import { readFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { resolve } from 'node:path';
import { AgentsApi, runSavedAgent } from './agents-api.mjs';
import { GmailClient } from './gmail.mjs';
import { loadRefreshToken } from './oauth.mjs';
import { pollReplies } from './poll.mjs';
import { RegistryClient } from './registry-client.mjs';
import { sendOutreach, sendQuote } from './send.mjs';

const registry = () => new RegistryClient({ baseUrl: process.env.OUTREACH_REGISTRY_URL, token: process.env.OUTREACH_SERVICE_TOKEN });
const agents = async () => {
  const saved = JSON.parse(await readFile(process.env.OUTREACH_AGENT_SESSIONS_FILE ?? '/etc/boondock-outreach/agent-sessions.json', 'utf8'));
  return new AgentsApi({ apiKey: process.env.OPENAI_API_KEY, organizationId: process.env.OPENAI_ORG_ID,
  projectId: process.env.OPENAI_PROJECT_ID, sessionIds: Object.fromEntries(Object.entries(saved).map(([role, state]) => [role, state.sessionId])), savedAgentIds: {
    'lead-research': process.env.OPENAI_AGENT_LEAD_RESEARCH_ID,
    outreach: process.env.OPENAI_AGENT_OUTREACH_ID,
    'reply-quotation': process.env.OPENAI_AGENT_REPLY_QUOTATION_ID,
  } });
};

async function gmail() {
  return new GmailClient({ clientId: process.env.GMAIL_CLIENT_ID, clientSecret: process.env.GMAIL_CLIENT_SECRET,
    refreshToken: await loadRefreshToken(process.env.OUTREACH_OAUTH_TOKEN_FILE, process.env.OUTREACH_TOKEN_ENCRYPTION_KEY),
    allowSend: process.env.OUTREACH_SEND_ENABLED === 'true' });
}

export async function main(args = process.argv.slice(2)) {
  const [command, one, two, three] = args;
  if (command === 'verify-agents') {
    const mapping = await (await agents()).verifySavedAgents();
    process.stdout.write(`${JSON.stringify(mapping, null, 2)}\n`);
    return;
  }
  if (command === 'verify-mailbox') {
    const mailbox = await gmail();
    const profile = await mailbox.profile();
    process.stdout.write(`${JSON.stringify({ emailAddress: profile.emailAddress, sendingEnabled: mailbox.allowSend })}\n`);
    return;
  }
  if (command === 'poll-replies') {
    const result = await pollReplies(await gmail(), registry());
    process.stdout.write(`${JSON.stringify({ processed: result.processed, recorded: result.recorded })}\n`);
    return;
  }
  if (command === 'run-agent') {
    const input = await readFile(two, 'utf8');
    if (!three) throw new Error('Stable run idempotency key required');
    const result = await runSavedAgent({ role: one, input, idempotencyKey: three, registry: registry(), agentsApi: await agents(), trigger: 'manual' });
    process.stdout.write(`${JSON.stringify({ id: result.id, status: result.status, externalRunId: result.external_run_id })}\n`);
    return;
  }
  if (command === 'send' || command === 'send-quote') {
    if (process.env.OUTREACH_SEND_ENABLED !== 'true') throw new Error('Outbound Gmail send is disabled');
    const data = JSON.parse(await readFile(one, 'utf8'));
    const client = registry(), mailbox = await gmail();
    if (command === 'send') {
      const prospect = await client.request(`/prospects/${encodeURIComponent(data.prospectId)}`);
      const message = await sendOutreach({ registry: client, gmail: mailbox, prospect, subject: data.subject, bodyText: data.bodyText,
        idempotencyKey: data.idempotencyKey, kind: data.kind, inboundMessageId: data.inboundMessageId ?? null, agentRunId: data.agentRunId ?? null });
      process.stdout.write(`${JSON.stringify({ id: message.id, providerMessageId: message.provider_message_id })}\n`);
      return;
    }
    const quote = await client.request(`/quotes/${encodeURIComponent(data.quoteId)}`);
    const prospect = await client.request(`/prospects/${encodeURIComponent(quote.prospect_id)}`);
    const message = await sendQuote({ registry: client, gmail: mailbox, quote, prospect, subject: data.subject, bodyText: data.bodyText, inboundMessageId: data.inboundMessageId });
    process.stdout.write(`${JSON.stringify({ id: message.id, providerMessageId: message.provider_message_id })}\n`);
    return;
  }
  throw new Error('Usage: verify-agents | verify-mailbox | poll-replies | run-agent ROLE INPUT_FILE IDEMPOTENCY_KEY | send JSON_FILE | send-quote JSON_FILE');
}

if (process.argv[1] && fileURLToPath(import.meta.url) === resolve(process.argv[1])) {
  main().catch((error) => {
    process.stderr.write(`${error.message}\n`);
    process.exitCode = 1;
  });
}
