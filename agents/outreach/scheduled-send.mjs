import { readFile } from 'node:fs/promises';
import { AgentsApi } from './agents-api.mjs';
import { GmailClient, SIGNATURE_LOGO } from './gmail.mjs';
import { loadRefreshToken } from './oauth.mjs';
import { pollReplies } from './poll.mjs';
import { RegistryClient } from './registry-client.mjs';
import { SLOT_HOURS, scheduledSlot, backfillSlot, prospectEvidence, parseOutreachDraft, parseLeadCandidates, verifyLeadCandidate } from './schedule.mjs';
import { sendOutreach } from './send.mjs';
import { cloudflareDirectoryResearch } from './cloudflare-research.mjs';

const slot = process.argv[2];
const checkOnly = process.argv[3] === '--check';
const catchUp = ['--catch-up', '--catch-up-resume'].includes(process.argv[3]);
const skipResearch = process.argv[3] === '--catch-up-resume';
const resume = process.argv[3] === '--resume' || catchUp;
// Backfill runs a missed slot from a recent day once, under that day's run key; registry caps still apply.
const backfill = process.argv[3] === '--backfill';
if (backfill && process.env.OUTREACH_BACKFILL_ENABLED !== 'true') throw new Error('Backfill is not enabled');
const schedule = backfill ? backfillSlot(slot, process.env.OUTREACH_BACKFILL_DATE) : scheduledSlot(slot);
const today = backfill ? schedule.today : schedule.day;
const dayTarget = process.env.OUTREACH_DAY_TARGET_DATE === schedule.day && process.env.OUTREACH_DAY_TARGET
  ? Number(process.env.OUTREACH_DAY_TARGET) : null;
if (dayTarget !== null && (!Number.isSafeInteger(dayTarget) || dayTarget < 1 || dayTarget > 200)) {
  throw new Error('Invalid outreach day target');
}
const localHour = Number(new Intl.DateTimeFormat('en-GB', { timeZone: 'Africa/Johannesburg',
  hour: '2-digit', hourCycle: 'h23' }).format(new Date()));
if (catchUp && (process.env.OUTREACH_CATCH_UP_ENABLED !== 'true' || localHour <= SLOT_HOURS[slot] || dayTarget === null)) {
  throw new Error('Catch-up needs an elapsed slot and a dated day target');
}
if (!checkOnly && ((!schedule.due && !catchUp && !backfill) || process.env.OUTREACH_SCHEDULE_SEND_ENABLED !== 'true' ||
  process.env.OUTREACH_SEND_ENABLED !== 'false')) {
  throw new Error('Scheduled prospect sending is outside its approved slot or enable gate');
}

const registry = new RegistryClient({ baseUrl: process.env.OUTREACH_REGISTRY_URL, token: process.env.OUTREACH_SERVICE_TOKEN });
const allProspects = () => registry.request('/prospects?limit=1000');
const saved = JSON.parse(await readFile(process.env.OUTREACH_AGENT_SESSIONS_FILE ?? '/etc/boondock-outreach/agent-sessions.json', 'utf8'));
const api = new AgentsApi({ apiKey: process.env.OPENAI_API_KEY, organizationId: process.env.OPENAI_ORG_ID,
  projectId: process.env.OPENAI_PROJECT_ID,
  savedAgentIds: { 'lead-research': process.env.OPENAI_AGENT_LEAD_RESEARCH_ID,
    outreach: process.env.OPENAI_AGENT_OUTREACH_ID, 'reply-quotation': process.env.OPENAI_AGENT_REPLY_QUOTATION_ID },
  sessionIds: Object.fromEntries(Object.entries(saved).map(([role, value]) => [role, value.sessionId])) });
const gmail = new GmailClient({ clientId: process.env.GMAIL_CLIENT_ID, clientSecret: process.env.GMAIL_CLIENT_SECRET,
  refreshToken: await loadRefreshToken(process.env.OUTREACH_OAUTH_TOKEN_FILE, process.env.OUTREACH_TOKEN_ENCRYPTION_KEY),
  allowSend: !checkOnly });

const key = `run:${schedule.day}:slot-${schedule.slot}:send`;
async function itemsForTurn(sessionId) {
  const response = await fetch(`https://api.openai.com/v1/agents/sessions/${encodeURIComponent(sessionId)}/items?order=desc&limit=100`,
    { headers: api.headers(), signal: AbortSignal.timeout(15000) });
  if (!response.ok) throw new Error(`Saved agent output lookup failed (${response.status})`);
  return (await response.json()).data ?? [];
}

async function researchAndQueue(leadKey = `run:${schedule.day}:slot-${schedule.slot}:lead`, trigger = 'scheduled') {
  let leadRun = await registry.request('/runs', { agentId: 'lead-research', trigger, idempotencyKey: leadKey });
  if (leadRun.status === 'succeeded') return { reviewed: 0, qualified: 0, prior: true };
  if (leadRun.status !== 'queued') throw new Error(`Lead research run is ${leadRun.status}; reconcile before retrying`);
  const leadSession = await api.existingSession('lead-research');
  if (leadSession.status !== 'idle') throw new Error('Lead research session is not idle');
  leadRun = await registry.request(`/runs/${leadRun.id}/status`, { status: 'running', idempotencyKey: `${leadKey}:running` });
  await registry.request(`/runs/${leadRun.id}/session`, { externalRunId: leadSession.id, idempotencyKey: `${leadKey}:session` });
  const existingProspects = await allProspects();
  const known = existingProspects.map((item) => item.website_url ?? item.source).filter(Boolean);
  const input = `Date ${today}, Africa/Johannesburg. Use your web_search tool to propose up to 30 South African businesses for controller verification. Search broadly across provinces and sectors: restaurants, caterers, trades, local shops, service providers, and studios. Two lead types matter most. First, small independent businesses whose public listing shows no dedicated website and gives a visible business email. Second, small businesses whose own website is weak: a coming-soon or under-construction page, placeholder or lorem ipsum text, broken or error pages, services or prices missing, an old announcement or dated notice, no clear enquiry path, or a layout that is plainly outdated. Larger businesses remain eligible with a specific verified fit. For missing-site leads use SA Online Directory (saonlinedirectory.co.za) and live-profiles.com listings. Do not use AfricaBizInfo: its pages block the controller's verification, so those leads are always rejected. For weak-site leads, use pages on the business's own website. For a missing-site lead, set websiteUrl to null; the exact listing must show the email and say no website is listed or show only a Facebook page as its website. For a weak-site lead, evidenceText must be words visible on that site that show the problem, and the finding must describe it kindly and specifically. The controller checks registry duplicates and suppression, so inability to read the registry is not a reason to return zero candidates. Search beyond this previous shortlist: ${JSON.stringify(known)}. Never send mail. Return JSON only: {"candidates":[{"companyName":"...","websiteUrl":null,"contactEmail":"public address","contactSourceUrl":"exact HTTPS page with that address","observationUrl":"exact HTTPS page showing opportunity","evidenceText":"20 to 220 characters copied exactly from the visible observation page","finding":"specific, respectful interpretation without an unsupported claim","offeringCode":"website-redesign"}]}. For businesses with a website, use its HTTPS URL in websiteUrl and same-site contact and observation pages. Do not use a copyright footer as age evidence. Exclude any business without directly visible contact and opportunity evidence. The controller independently fetches pages and qualifies leads; do not fabricate data.`;
  const turn = await api.runExistingSession('lead-research', input, leadKey);
  if (turn.status !== 'completed') throw new Error(`Lead research turn ${turn.status}`);
  const savedCandidates = parseLeadCandidates(await itemsForTurn(leadSession.id), turn.turnId);
  const seenEmails = new Set(existingProspects.map((item) => item.email_normalized));
  let qualified = 0, reviewed = 0, browserPages = 0, browserFailures = 0;
  for (let round = 0; round < 5 && qualified + existingProspects.filter((item) => item.stage === 'qualified').length < 50; round++) {
    const rendered = await cloudflareDirectoryResearch({ registry,
      offset: (schedule.slot - 1) * 250 + round * 50, pageLimit: 50 });
    browserPages += rendered.scanned;
    browserFailures += rendered.failed;
    const candidates = [...rendered.candidates, ...(round === 0 ? savedCandidates : [])];
    for (const candidate of candidates) {
      known.push(candidate?.websiteUrl ?? candidate?.contactSourceUrl);
      const email = String(candidate?.contactEmail ?? '').toLowerCase().trim();
      if (!email || seenEmails.has(email)) continue;
      reviewed++;
      try {
        const data = await verifyLeadCandidate(candidate);
        seenEmails.add(email);
        let prospect = await registry.request('/prospects', { ...data, ownerAgentId: 'lead-research',
          idempotencyKey: `${leadKey}:prospect:${reviewed}` });
        if (!['new','qualified'].includes(prospect.stage)) continue;
        await registry.request(`/prospects/${prospect.id}/observations`, { observations: data.observations,
          idempotencyKey: `${leadKey}:observation:${reviewed}` });
        if (prospect.stage === 'new') prospect = await registry.request(`/prospects/${prospect.id}/stage`, {
          stage: 'qualified', idempotencyKey: `${leadKey}:qualified:${reviewed}` });
        if (prospect.stage === 'qualified') qualified++;
      } catch (error) {
        if (error.message !== 'Public source could not be verified') seenEmails.add(email);
        console.log(JSON.stringify({ skippedLeadIndex: reviewed, reason: String(error.message).slice(0, 200) }));
      }
      if (qualified + existingProspects.filter((item) => item.stage === 'qualified').length >= 50) break;
    }
  }
  await registry.request(`/runs/${leadRun.id}/status`, { status: 'succeeded', idempotencyKey: `${leadKey}:succeeded`,
    externalRunId: leadSession.id });
  return { reviewed, qualified, browserPages, browserFailures };
}

const agents = await registry.request('/agents');
if (agents.length !== 3 || agents.some((item) => !item.enabled)) throw new Error('All three agents must be enabled');
if (!await registry.request('/mailbox/cursor')) throw new Error('Gmail Sent and Inbox cursor is missing');
await gmail.profile();
const session = await api.existingSession('outreach');
const leadSession = await api.existingSession('lead-research');
let prospects = (await allProspects()).filter((item) => item.stage === 'qualified')
  .sort((a, b) => Number(Boolean(a.website_url)) - Number(Boolean(b.website_url)));
if (checkOnly) {
  console.log(JSON.stringify({ slot: schedule.slot, day: schedule.day, due: schedule.due,
    sessionId: session.id, sessionStatus: session.status, leadSessionStatus: leadSession.status,
    qualifiedQueue: prospects.length, sendEnabled: false }));
  process.exit(0);
}
if (session.status !== 'idle') throw new Error('Outreach session is not idle');

let run = await registry.request('/runs', { agentId: 'outreach', trigger: backfill ? 'manual' : 'scheduled', idempotencyKey: key });
if (run.status === 'succeeded' && !resume) {
  console.log(JSON.stringify({ slot: schedule.slot, alreadyComplete: true, attempted: 0 }));
  process.exit(0);
}
if (resume && run.status !== 'succeeded') throw new Error(`Recovery requires a completed slot, found ${run.status}`);
if (!resume && run.status !== 'queued') throw new Error(`Scheduled slot is ${run.status}; reconcile before retrying`);
let research = null;
let priorAttempts = 0;
if (resume) {
  for (const prospect of await allProspects()) {
    const events = await registry.request(`/prospects/${encodeURIComponent(prospect.id)}/events`);
    priorAttempts += events.filter((event) => event.event_type === 'outbound.initial_reserved' && event.agent_run_id === run.id).length;
  }
  if (priorAttempts >= 50) throw new Error('Completed slot has no remaining per-run capacity');
  if (catchUp && !skipResearch) {
    await pollReplies(gmail, registry);
    research = await researchAndQueue(`run:${schedule.day}:slot-${schedule.slot}:catch-up:${crypto.randomUUID()}`, 'manual');
    prospects = (await allProspects()).filter((item) => item.stage === 'qualified')
      .sort((a, b) => Number(Boolean(a.website_url)) - Number(Boolean(b.website_url)));
  }
} else {
  await pollReplies(gmail, registry);
  research = await researchAndQueue(undefined, backfill ? 'manual' : 'scheduled');
  prospects = (await allProspects()).filter((item) => item.stage === 'qualified')
    .sort((a, b) => Number(Boolean(a.website_url)) - Number(Boolean(b.website_url)));
  run = await registry.request(`/runs/${run.id}/status`, { status: 'running', idempotencyKey: `${key}:running` });
  await registry.request(`/runs/${run.id}/session`, { externalRunId: session.id, idempotencyKey: `${key}:session` });
}

let priorDayAttempts = 0;
if (dayTarget !== null) {
  for (const prospect of await allProspects()) {
    const events = await registry.request(`/prospects/${encodeURIComponent(prospect.id)}/events`);
    priorDayAttempts += events.filter((event) => event.event_type === 'outbound.initial_reserved' &&
      scheduledSlot(slot, new Date(event.occurred_at)).day === schedule.day).length;
  }
}

let attempted = 0, skipped = 0;
for (const prospect of prospects) {
  if (priorAttempts + attempted >= 50) break;
  if (dayTarget !== null && priorDayAttempts + attempted >= dayTarget) break;
  if (!scheduledSlot(slot).due && !catchUp && !backfill) break;
  let phase = 'preflight';
  try {
    const events = await registry.request(`/prospects/${encodeURIComponent(prospect.id)}/events`);
    const evidence = prospectEvidence(prospect, events);
    if (!evidence) { skipped++; continue; }
    const source = await fetch(evidence.contactSourceUrl, { signal: AbortSignal.timeout(15000) });
    if (!source.ok || new URL(source.url).hostname.replace(/^www\./, '') !==
      new URL(evidence.contactSourceUrl).hostname.replace(/^www\./, '')) { skipped++; continue; }
    const page = (await source.text()).toLowerCase();
    if (!page.includes(prospect.email_normalized)) { skipped++; continue; }
    if ((await gmail.listSent(null, `to:${prospect.email_normalized}`)).messages?.length) { skipped++; continue; }
    phase = 'draft';
    const input = `Date ${today}, Africa/Johannesburg. Draft one charismatic first-contact email as JSON with subject and bodyText. Do not send. Company: ${prospect.company_name}. Address: ${prospect.email_normalized}. Public contact page verified by controller: ${evidence.contactSourceUrl}. Use only these verified observations: ${JSON.stringify(evidence.observations)}. Write 100 to 150 words in the body. The voice is warm, confident, and personable, with genuine enthusiasm for small local businesses: the kind of note a friendly neighbour who builds websites would write. Open with a line that feels personal to this business, keep sentences lively and varied, and give it a little personality without hype, exclamation overload, or exaggeration. The subject should be short, specific, and intriguing rather than salesy. Early in the email say “I’m Eugene from Boondock Labs” and explain in plain language that we design and build websites for South African businesses. Acknowledge the business and its work respectfully. ${prospect.website_url ? 'Describe the specific website observation without sounding like you are correcting or scolding them, then offer one concrete, useful idea for presenting their work or helping customers.' : 'The business listing gives a public email and says no website is listed, or lists a Facebook page as its website. Do not claim you proved that no website exists. Mention the public listing and suggest a simple dedicated site that presents their services, examples of work, and a clear enquiry path.'} In one or two natural sentences, mention that we also build AI agents, such as a WhatsApp or website assistant that answers common customer questions and takes enquiries or bookings around the clock, and mobile apps, without assuming the business needs one. Invite a reply with permission to send a couple of ideas by email or arrange a short call. End with a low-pressure opt-out such as “If this is not relevant, just reply no thanks and I will leave it there.” Avoid formulaic praise, generic sales language, and claims beyond the observations. Do not include pricing, WhatsApp number, or a signature; the sender appends Eugene’s signature. Keep the subject plain ASCII to display correctly in email.`;
    let draft;
    for (let draftAttempt = 1; draftAttempt <= 3; draftAttempt++) {
      const turn = await api.runExistingSession('outreach', input, `${key}:${prospect.id}:draft:${draftAttempt}`);
      if (turn.status === 'completed') {
        try {
          draft = parseOutreachDraft(await itemsForTurn(session.id), turn.turnId);
          break;
        } catch (error) {
          console.log(JSON.stringify({ draftRetry: draftAttempt, prospectId: prospect.id,
            reason: String(error.message).slice(0, 200) }));
        }
      } else {
        if (/usage or billing limit|no credits remaining|credit_balance_exhausted/i.test(turn.error ?? '')) {
          throw new Error('OpenAI credits are exhausted; restore the organization balance before resuming outreach');
        }
        console.log(JSON.stringify({ draftRetry: draftAttempt, prospectId: prospect.id,
          reason: `Outreach draft turn ${turn.status}: ${turn.error ?? 'no detail'}`.slice(0, 200) }));
      }
    }
    if (!draft) throw new Error('Outreach draft failed after three attempts');
    phase = 'send';
    const message = await sendOutreach({ registry, gmail, prospect, ...draft, kind: 'initial',
      idempotencyKey: `${key}:${prospect.id}:initial`, agentRunId: run.id });
    attempted++;
    const sent = await gmail.getMessage(message.provider_message_id);
    if (!sent.labelIds?.includes('SENT')) throw new Error('Gmail accepted the message but Sent verification is pending');
    const html = sent.payload?.parts?.find((part) => part.mimeType === 'text/html')?.body?.data;
    const markup = html ? Buffer.from(html, 'base64url').toString('utf8') : '';
    if (!markup.includes(SIGNATURE_LOGO) || /\.webp\b/i.test(markup)) {
      throw new Error('Gmail accepted the message but signature verification failed');
    }
  } catch (error) {
    if (phase !== 'preflight' || error.outcomeUnknown) throw error;
    skipped++;
    console.log(JSON.stringify({ skippedProspectId: prospect.id, reason: String(error.message).slice(0, 200) }));
  }
}
if (!resume) await registry.request(`/runs/${run.id}/status`, { status: 'succeeded', idempotencyKey: `${key}:succeeded`,
  externalRunId: session.id });
console.log(JSON.stringify({ slot: schedule.slot, day: schedule.day, runId: run.id, research,
  priorAttempts, priorDayAttempts, dayTarget, acceptedAttempts: attempted, skipped, recovery: resume }));
