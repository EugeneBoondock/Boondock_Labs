import { normalizeEmail, requiredText, validateLeadObservations } from './rules.mjs';

export const SLOT_HOURS = Object.freeze({ 1: 9, 2: 13, 3: 16, 4: 20 });
const DIRECTORY_HOSTS = new Set(['africabizinfo.com', 'saonlinedirectory.co.za', 'live-profiles.com']);

export function scheduledSlot(slot, at = new Date()) {
  const hour = SLOT_HOURS[slot];
  if (!hour) throw new Error('Only the four scheduled outreach slots are allowed');
  const parts = Object.fromEntries(new Intl.DateTimeFormat('en-GB', {
    timeZone: 'Africa/Johannesburg', year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', hourCycle: 'h23',
  }).formatToParts(at).map((part) => [part.type, part.value]));
  return { day: `${parts.year}-${parts.month}-${parts.day}`, slot: Number(slot), due: Number(parts.hour) === hour };
}

const MAX_BACKFILL_DAYS = 3;

// A missed slot from a recent past day, run once under its own dated idempotency key.
export function backfillSlot(slot, day, at = new Date()) {
  if (!SLOT_HOURS[slot]) throw new Error('Only the four scheduled outreach slots are allowed');
  if (!/^\d{4}-\d{2}-\d{2}$/.test(day ?? '') || Number.isNaN(Date.parse(`${day}T00:00:00Z`))) {
    throw new Error('Backfill needs a YYYY-MM-DD day');
  }
  const today = scheduledSlot(slot, at).day;
  const ageDays = (Date.parse(`${today}T00:00:00Z`) - Date.parse(`${day}T00:00:00Z`)) / 86400000;
  if (ageDays < 1 || ageDays > MAX_BACKFILL_DAYS) throw new Error('Backfill day must be one to three days in the past');
  return { day, slot: Number(slot), due: true, today };
}

export function prospectEvidence(prospect, events, at = Date.now()) {
  if (prospect?.stage !== 'qualified' || !prospect.email_normalized) return null;
  const source = new URL(prospect.source);
  const website = prospect.website_url ? new URL(prospect.website_url) : null;
  const verifiedDirectory = DIRECTORY_HOSTS.has(source.hostname.replace(/^www\./, ''));
  const emailDomain = prospect.email_normalized.split('@')[1];
  if (source.protocol !== 'https:' || (website && source.hostname.replace(/^www\./, '') !== website.hostname.replace(/^www\./, '') &&
    !(verifiedDirectory && emailDomain === website.hostname.replace(/^www\./, ''))) ||
    (!website && !DIRECTORY_HOSTS.has(source.hostname.replace(/^www\./, '')))) {
    throw new Error('Qualified prospect needs a verified public contact URL');
  }
  const event = events.find((item) => ['prospect.created','prospect.observations_updated'].includes(item.event_type));
  const observations = validateLeadObservations(JSON.parse(event?.metadata_json ?? '{}').observations, at);
  if (!observations.some((item) => new URL(item.sourceUrl).hostname.replace(/^www\./, '') ===
    (website ?? source).hostname.replace(/^www\./, ''))) {
    throw new Error('Opportunity evidence must come from the verified source');
  }
  return { contactSourceUrl: source.href, observations };
}

export function parseOutreachDraft(items, turnId) {
  const item = items.find((entry) => entry.type === 'message' && entry.role === 'assistant' && entry.turn_id === turnId);
  const text = item?.content?.find((part) => part.type === 'output_text')?.text;
  const draft = JSON.parse(text ?? 'null');
  if (!draft || typeof draft.subject !== 'string' || typeof draft.bodyText !== 'string') throw new Error('Agent draft is incomplete');
  const subject = draft.subject.trim();
  let bodyText = draft.bodyText.trim();
  if (!/\bAI agents?\b/i.test(bodyText)) {
    const paragraphs = bodyText.split(/\n\s*\n/);
    const ideaIndex = Math.max(0, paragraphs.length - 2);
    paragraphs[ideaIndex] += ' We also build AI agents that can help with common customer enquiries, if that would be useful to you.';
    bodyText = paragraphs.join('\n\n');
  }
  const wordCount = bodyText.split(/\s+/).length;
  if (!subject || subject.length > 150 || !bodyText || bodyText.length > 1800 ||
    wordCount < 85 || wordCount > 170 || !/\b(?:I am|I'm|I’m) Eugene\b/i.test(bodyText) ||
    !/Boondock Labs/i.test(bodyText) || !/\b(?:build|design|create|develop|redesign)\b/i.test(bodyText) ||
    !/no thanks|no further contact|not interested|opt out|don.t contact/i.test(bodyText) ||
    /\.webp\b|\+27\s*81\s*628\s*8767|\b(?:R\s?\d|ZAR\s?\d)\b/i.test(`${subject} ${bodyText}`)) {
    throw new Error('Agent draft failed content and opt-out checks');
  }
  return { subject, bodyText };
}

export function assistantOutput(items, turnId) {
  const item = items.find((entry) => entry.type === 'message' && entry.role === 'assistant' && entry.turn_id === turnId);
  const text = item?.content?.find((part) => part.type === 'output_text')?.text;
  if (typeof text !== 'string' || !text.trim()) throw new Error('Saved agent output is missing');
  return JSON.parse(text);
}

export function parseLeadCandidates(items, turnId) {
  const value = assistantOutput(items, turnId);
  if (!Array.isArray(value?.candidates) || value.candidates.length > 30) throw new Error('Lead agent must return at most 30 candidates');
  return value.candidates;
}

export function replyNeedsHandoff(text) {
  return /\b(?:contract|invoice)\b|\b(?:send|share|provide|attach)\b.{0,40}\b(?:photos?|images?|files?|documents?|assets?|logos?|mockups?|portfolio)\b/i.test(text);
}

export function asksForQuote(text) {
  return /\b(?:quote|quotation|estimate|pricing|price|cost|budget|proposal)\b/i.test(text);
}

export function parseReplyDecision(items, turnId) {
  const decision = assistantOutput(items, turnId);
  if (decision?.action === 'handoff') return { action: 'handoff', reason: requiredText(decision.reason, 'handoff reason', 500) };
  if (!['reply', 'quote'].includes(decision?.action)) throw new Error('Reply agent decision needs review');
  const subject = requiredText(decision.subject, 'reply subject', 150);
  const bodyText = requiredText(decision.bodyText, 'reply body', 1800);
  if (/\.webp\b|\b(?:R\s?\d|ZAR\s?\d)\b/i.test(`${subject} ${bodyText}`)) throw new Error('Reply contains an unreviewed asset or price');
  if (decision.action === 'reply') return { action: 'reply', subject, bodyText };
  if (!/\b(?:attach|pdf|quotation)\b/i.test(bodyText)) throw new Error('Quote reply must identify the attached PDF');
  if (!Array.isArray(decision.benchmarks) || decision.benchmarks.length < 2 || decision.benchmarks.length > 5) {
    throw new Error('Quote requires two to five current market sources');
  }
  return { action: 'quote', subject, bodyText, description: requiredText(decision.description, 'quote description', 500),
    scope: decision.scope, scopeEvidence: decision.scopeEvidence,
    assumptions: requiredText(decision.assumptions, 'quote assumptions', 1500),
    benchmarks: decision.benchmarks };
}

function host(url) { return new URL(url).hostname.toLowerCase().replace(/^www\./, ''); }
function visibleText(html) {
  return html.replace(/<!--[\s\S]*?-->/g, ' ').replace(/<(script|style|noscript)\b[^>]*>[\s\S]*?<\/\1\s*>/gi, ' ')
    .replace(/<[^>]*>/g, ' ').replace(/&nbsp;|&#160;/gi, ' ').replace(/&amp;/gi, '&')
    .replace(/&quot;|&#34;/gi, '"').replace(/&#39;|&apos;/gi, "'").replace(/\s+/g, ' ').trim().toLowerCase();
}

function quotedAmountsMinor(text) {
  return [...text.matchAll(/\b(?:ZAR|R)\s*([0-9][0-9\s,.]*)/gi)].map((match) => {
    const raw = match[1].trim();
    const cents = /[,.]\d{2}$/.test(raw);
    const digits = raw.replace(/\D/g, '');
    return cents ? Number(digits) : Number(digits) * 100;
  }).filter(Number.isSafeInteger);
}

export async function verifyQuoteBenchmarks(benchmarks, fetcher = fetch, at = new Date()) {
  if (!Array.isArray(benchmarks) || benchmarks.length < 2 || benchmarks.length > 5) throw new Error('Two to five market sources are required');
  const verified = [];
  for (const item of benchmarks) {
    const url = new URL(item?.sourceUrl);
    if (url.protocol !== 'https:' || !url.hostname.toLowerCase().endsWith('.za') || url.username || url.password || url.port) {
      throw new Error('Automatic quote needs a public South African HTTPS source');
    }
    const evidenceText = requiredText(item.evidenceText, 'market evidence text', 500);
    const comparableScope = requiredText(item.comparableScope, 'comparable scope', 500);
    if (comparableScope.length < 10 || !visibleText(evidenceText).includes(visibleText(comparableScope))) {
      throw new Error('Comparable service scope must be visible in the price excerpt');
    }
    const response = await fetcher(url.href, { signal: AbortSignal.timeout(15000), redirect: 'manual' });
    if (!response.ok || host(response.url) !== host(url.href) || Number(response.headers.get('content-length') ?? 0) > 1000000) {
      throw new Error('Current South African price page could not be verified');
    }
    const page = await response.text();
    if (page.length > 1000000 || !visibleText(page).includes(visibleText(evidenceText))) {
      throw new Error('Quoted price and service description are absent from the live page');
    }
    if (/\b(?:monthly|per month|subscription|p\/m)\b/i.test(evidenceText)) {
      throw new Error('Recurring prices need review before a fixed-scope quote');
    }
    const amounts = quotedAmountsMinor(evidenceText);
    if (!Number.isSafeInteger(item.minAmountMinor) || !Number.isSafeInteger(item.maxAmountMinor) ||
      item.minAmountMinor < 10000 || item.maxAmountMinor < item.minAmountMinor ||
      !amounts.includes(item.minAmountMinor) || !amounts.includes(item.maxAmountMinor)) {
      throw new Error('Market price does not match the visible ZAR amount');
    }
    verified.push({ sourceUrl: url.href, observedAt: at.toISOString(), currency: 'ZAR',
      minAmountMinor: item.minAmountMinor, maxAmountMinor: item.maxAmountMinor, comparableScope });
  }
  if (new Set(verified.map((item) => host(item.sourceUrl))).size < 2) throw new Error('Two independent South African market domains are required');
  return verified;
}

export async function verifyLeadCandidate(candidate, fetcher = fetch, at = new Date()) {
  const companyName = requiredText(candidate?.companyName, 'company name', 200);
  const contactEmail = normalizeEmail(candidate?.contactEmail);
  const websiteUrl = candidate?.websiteUrl ? new URL(candidate.websiteUrl) : null;
  const contactSourceUrl = new URL(candidate?.contactSourceUrl);
  const observationUrl = new URL(candidate?.observationUrl);
  const contactHost = host(contactSourceUrl.href), websiteHost = websiteUrl ? host(websiteUrl.href) : null;
  const directoryContact = DIRECTORY_HOSTS.has(contactHost);
  if (!contactEmail || [websiteUrl, contactSourceUrl, observationUrl].filter(Boolean).some((url) => url.protocol !== 'https:') ||
    (websiteHost && websiteHost !== contactHost && !(directoryContact && contactEmail.split('@')[1] === websiteHost)) ||
    host(websiteUrl?.href ?? contactSourceUrl.href) !== host(observationUrl.href) ||
    (!websiteUrl && !directoryContact)) {
    throw new Error('Lead needs a verified public HTTPS contact and observation page');
  }
  const evidenceText = requiredText(candidate?.evidenceText, 'visible evidence text', 220);
  if (evidenceText.length < 20) throw new Error('Evidence quote is too short to verify');
  const finding = requiredText(candidate?.finding, 'specific finding', 500);
  const pages = await Promise.all([contactSourceUrl, observationUrl].map(async (url, index) => {
    const response = await fetcher(url.href, { signal: AbortSignal.timeout(15000), redirect: 'follow' });
    if (!response.ok || host(response.url) !== host((index === 0 ? contactSourceUrl : websiteUrl ?? contactSourceUrl).href) ||
      Number(response.headers.get('content-length') ?? 0) > 1000000) throw new Error('Public source could not be verified');
    return await response.text();
  }));
  if (!pages[0].toLowerCase().includes(contactEmail)) throw new Error('Contact email is absent from the public source');
  if (!websiteUrl && (!visibleText(pages[0]).includes(visibleText(companyName)) ||
    !/\bsouth africa\b/.test(visibleText(pages[0])))) {
    throw new Error('Directory listing does not identify a South African business');
  }
  if (!websiteUrl && !/there is no website listed|company website\s*:\s*(?:www\.)?facebook\.com|open website\s+not provided/i.test(visibleText(pages[0]))) {
    throw new Error('Listing does not support a missing dedicated website');
  }
  let verifiedFinding = finding;
  if (!visibleText(pages[1]).includes(visibleText(evidenceText))) {
    const notice = websiteUrl && visibleText(pages[1]).slice(0, 1600)
      .match(/\b(?:website|site|we are|our new site)\s+(?:is\s+|is currently\s+)?(?:coming soon|under construction|under maintenance)\b/);
    if (!notice) throw new Error('Dated opportunity text is absent from the live page');
    verifiedFinding = `The public website currently displays “${notice[0]}”. A completed site could present the business and give visitors a clear enquiry path.`;
  }
  const observations = validateLeadObservations([{ sourceUrl: observationUrl.href, observedAt: at.toISOString(),
    finding: verifiedFinding, offeringCode: candidate.offeringCode }], at.getTime());
  return { companyName, websiteUrl: websiteUrl?.href ?? null, contactEmail, source: contactSourceUrl.href, observations };
}
