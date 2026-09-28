import { readFile } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import { AgentsApi } from './agents-api.mjs';
import { GmailClient, SIGNATURE_LOGO } from './gmail.mjs';
import { loadRefreshToken } from './oauth.mjs';
import { pollReplies, asksToStop } from './poll.mjs';
import { RegistryClient } from './registry-client.mjs';
import { asksForQuote, parseReplyDecision, replyNeedsHandoff } from './schedule.mjs';
import { sendOutreach, sendQuote } from './send.mjs';

const checkOnly = process.argv.includes('--check');
if (!checkOnly && (process.env.OUTREACH_REPLY_SEND_ENABLED !== 'true' || process.env.OUTREACH_SEND_ENABLED !== 'false')) {
  throw new Error('Reply sending is outside its explicit enable gate');
}
const registry = new RegistryClient({ baseUrl: process.env.OUTREACH_REGISTRY_URL, token: process.env.OUTREACH_SERVICE_TOKEN });
const saved = JSON.parse(await readFile(process.env.OUTREACH_AGENT_SESSIONS_FILE ?? '/etc/boondock-outreach/agent-sessions.json', 'utf8'));
const api = new AgentsApi({ apiKey: process.env.OPENAI_API_KEY, organizationId: process.env.OPENAI_ORG_ID,
  projectId: process.env.OPENAI_PROJECT_ID,
  savedAgentIds: { 'lead-research': process.env.OPENAI_AGENT_LEAD_RESEARCH_ID,
    outreach: process.env.OPENAI_AGENT_OUTREACH_ID, 'reply-quotation': process.env.OPENAI_AGENT_REPLY_QUOTATION_ID },
  sessionIds: Object.fromEntries(Object.entries(saved).map(([role, value]) => [role, value.sessionId])) });
const gmail = new GmailClient({ clientId: process.env.GMAIL_CLIENT_ID, clientSecret: process.env.GMAIL_CLIENT_SECRET,
  refreshToken: await loadRefreshToken(process.env.OUTREACH_OAUTH_TOKEN_FILE, process.env.OUTREACH_TOKEN_ENCRYPTION_KEY),
  allowSend: !checkOnly });
const agents = await registry.request('/agents');
if (agents.length !== 3 || agents.some((item) => !item.enabled)) throw new Error('All three agents must be enabled');
await gmail.profile();
const session = await api.existingSession('reply-quotation');
const pending = await registry.request('/messages/pending-replies');
if (checkOnly) {
  console.log(JSON.stringify({ sessionId: session.id, sessionStatus: session.status,
    pendingReplies: pending.length, sendEnabled: false }));
  process.exit(0);
}
if (session.status !== 'idle') throw new Error('Reply session is not idle');
await pollReplies(gmail, registry);
const fresh = await registry.request('/messages/pending-replies');
let sentCount = 0, handoffCount = 0;
for (const message of fresh.slice(0, 20)) {
  const inbound = await registry.request(`/messages/${encodeURIComponent(message.id)}`);
  const prospect = await registry.request(`/prospects/${encodeURIComponent(message.prospect_id)}`);
  if (!inbound || !prospect || inbound.from_email !== prospect.email_normalized) throw new Error('Pending inbound identity mismatch');
  const suppression = await registry.request(`/prospects/${encodeURIComponent(prospect.id)}/suppression`);
  const key = `reply:${message.id}:agent`;
  let run = await registry.request('/runs', { agentId: 'reply-quotation', trigger: 'scheduled', idempotencyKey: key });
  if (run.status !== 'queued') throw new Error(`Reply run ${run.status} requires reconciliation`);
  run = await registry.request(`/runs/${run.id}/status`, { status: 'running', idempotencyKey: `${key}:running` });
  await registry.request(`/runs/${run.id}/session`, { externalRunId: session.id, idempotencyKey: `${key}:session` });
  let decision;
  if (suppression || asksToStop(inbound.body_text) || !inbound.rfcMessageId) {
    decision = { action: 'handoff', reason: suppression ? `Contact suppression: ${suppression.reason}` :
      asksToStop(inbound.body_text) ? 'Contact requested no further outreach' : 'Inbound Message-ID is missing' };
  } else {
    const input = `One genuine inbound message from ${prospect.email_normalized} to Eugene at Boondock Labs. Subject: ${inbound.subject}. Body: ${inbound.body_text}. Draft at most one response for this exact inbound. Do not send. Return JSON only. For a normal answer, use {"action":"reply","subject":"...","bodyText":"..."}. If a requested quote lacks service scope, use reply to ask specific missing questions without stating a price. If a requested quote has complete client-confirmed scope and two current, comparable South African public HTTPS price pages, use {"action":"quote","subject":"...","bodyText":"The PDF quotation is attached ...","description":"one fixed-scope item","scope":{"serviceCode":"one Boondock offering", "all required service-specific fields":"client-confirmed values"},"scopeEvidence":{"each required field":"exact excerpt from this inbound message proving that field"},"assumptions":"explicit exclusions and assumptions","benchmarks":[{"sourceUrl":"https://...za/...","evidenceText":"exact visible service and ZAR price excerpt","comparableScope":"exact service words in excerpt","minAmountMinor":100000,"maxAmountMinor":100000}]}. Monetary values are ZAR cents. Each amount must appear in its exact visible excerpt, and pages must describe comparable fixed-scope work rather than subscriptions. Never infer client scope from unrelated facts or invent market prices. If price evidence is missing, return {"action":"handoff","reason":"Price evidence needs Eugene review"}. Contracts, invoices, and requests for photos/files/assets also go to handoff. Never claim an asset was received. If the sender expressly asks for WhatsApp contact, you may include +27 81 628 8767; otherwise omit it. No signature; the controller appends Eugene’s PNG signature.`;
    try {
      const turn = await api.runExistingSession('reply-quotation', input, key);
      if (turn.status !== 'completed') throw new Error(`Reply agent turn ${turn.status}`);
      const response = await fetch(`https://api.openai.com/v1/agents/sessions/${encodeURIComponent(session.id)}/items?order=desc&limit=100`,
        { headers: api.headers(), signal: AbortSignal.timeout(15000) });
      if (!response.ok) throw new Error(`Reply output lookup failed (${response.status})`);
      decision = parseReplyDecision((await response.json()).data ?? [], turn.turnId);
    } catch (error) {
      if (error.outcomeUnknown) throw error;
      decision = { action: 'handoff', reason: `Reply agent needs Eugene review: ${String(error.message).slice(0, 300)}` };
    }
  }
  if (replyNeedsHandoff(inbound.body_text)) decision = { action: 'handoff', reason: 'Contract, invoice, or client assets need Eugene review' };
  if (decision.action === 'quote' && !asksForQuote(inbound.body_text)) {
    decision = { action: 'handoff', reason: 'Unrequested quotation needs Eugene review' };
  }
  if (decision.action === 'reply' && asksForQuote(inbound.body_text) && !decision.bodyText.includes('?')) {
    decision = { action: 'handoff', reason: 'Quote request needs specific scope clarification or price review' };
  }
  if (decision.action === 'quote') {
    let quoteSending = false;
    try {
      const localDay = new Intl.DateTimeFormat('en-CA', { timeZone: 'Africa/Johannesburg', year: 'numeric', month: '2-digit', day: '2-digit' })
        .format(new Date()).replace(/\D/g, '');
      const suffix = createHash('sha256').update(inbound.id).digest('hex').slice(0, 8).toUpperCase();
      const quote = await registry.request('/quotes', { prospectId: prospect.id, agentRunId: run.id,
        idempotencyKey: `${key}:quote`, quoteNumber: `BL-${localDay}-${suffix}`, currency: 'ZAR',
        expiresAt: new Date(Date.now() + 14 * 86400000).toISOString(), autoMarketQuote: true,
        items: [{ code: decision.scope?.serviceCode, description: decision.description, quantity: 1 }],
        scope: decision.scope, scopeEvidence: decision.scopeEvidence, inboundMessageId: inbound.id,
        assumptions: decision.assumptions, benchmarks: decision.benchmarks });
      if (quote.reviewStatus !== 'approved') throw new Error('Verified quote remains pending review');
      quoteSending = true;
      const outbound = await sendQuote({ registry, gmail, quote, prospect, subject: decision.subject,
        bodyText: decision.bodyText, inboundMessageId: inbound.id });
      sentCount++;
      const sent = await gmail.getMessage(outbound.provider_message_id);
      if (!sent.labelIds?.includes('SENT')) throw new Error('Gmail accepted quote but Sent verification is pending');
      const html = sent.payload?.parts?.find((part) => part.mimeType === 'text/html')?.body?.data;
      const markup = html ? Buffer.from(html, 'base64url').toString('utf8') : '';
      if (!markup.includes(SIGNATURE_LOGO) || /\.webp\b/i.test(markup)) throw new Error('Gmail accepted quote but PNG verification failed');
    } catch (error) {
      if (error.outcomeUnknown || quoteSending) throw error;
      decision = { action: 'handoff', reason: `Quote needs Eugene review: ${String(error.message).slice(0, 300)}` };
    }
  }
  if (decision.action === 'handoff') {
    await registry.request('/handoffs', { prospectId: prospect.id, inboundMessageId: inbound.id, reason: decision.reason,
      idempotencyKey: `${key}:handoff` });
    handoffCount++;
  } else if (decision.action === 'reply') {
    const outbound = await sendOutreach({ registry, gmail, prospect, subject: decision.subject, bodyText: decision.bodyText,
      kind: 'reply', inboundMessageId: inbound.id, idempotencyKey: `${key}:send`, agentRunId: run.id });
    sentCount++;
    const sent = await gmail.getMessage(outbound.provider_message_id);
    if (!sent.labelIds?.includes('SENT')) throw new Error('Gmail accepted reply but Sent verification is pending');
    const html = sent.payload?.parts?.find((part) => part.mimeType === 'text/html')?.body?.data;
    const markup = html ? Buffer.from(html, 'base64url').toString('utf8') : '';
    if (!markup.includes(SIGNATURE_LOGO) || /\.webp\b/i.test(markup)) throw new Error('Gmail accepted reply but PNG verification failed');
  }
  await registry.request(`/runs/${run.id}/status`, { status: 'succeeded', idempotencyKey: `${key}:succeeded`,
    externalRunId: session.id });
}
console.log(JSON.stringify({ processed: sentCount + handoffCount, acceptedReplies: sentCount, handoffs: handoffCount }));
