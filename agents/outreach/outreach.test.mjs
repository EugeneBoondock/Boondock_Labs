import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { DatabaseSync } from 'node:sqlite';
import { createHash } from 'node:crypto';
import { Registry, southAfricanDayBounds } from './store.mjs';
import { renderQuotePdf } from './pdf.mjs';
import { buildMime, GmailClient, parseGmailMessage, signedBodies, SIGNATURE_TEXT, SIGNATURE_LOGO } from './gmail.mjs';
import { pollReplies, parseDeliveryFailure } from './poll.mjs';
import { encryptRefreshToken, decryptRefreshToken, authorizationUrl } from './oauth.mjs';
import { AgentsApi, runSavedAgent } from './agents-api.mjs';
import { handleOutreachRequest, researchUrl } from './worker.mjs';
import { sendOutreach, sendQuote } from './send.mjs';
import { assessQuoteContext } from './rules.mjs';
import { scheduledSlot, backfillSlot, prospectEvidence, parseOutreachDraft, parseLeadCandidates, verifyLeadCandidate,
  asksForQuote, replyNeedsHandoff, parseReplyDecision, verifyQuoteBenchmarks } from './schedule.mjs';
import { forcedWebResearch } from './web-research.mjs';
import { cloudflareDirectoryResearch, parseDirectoryCandidate } from './cloudflare-research.mjs';

test('scheduled discovery forces live search and keeps valid results when another search fails', async () => {
  const calls = [];
  const result = await forcedWebResearch({ apiKey: 'test-key', organizationId: 'org-test', known: [],
    fetcher: async (_url, options) => {
      const request = JSON.parse(options.body);
      calls.push(request);
      if (calls.length > 1) return new Response('', { status: 429 });
      return Response.json({ status: 'completed', output: [
        { type: 'web_search_call' },
        { type: 'message', content: [{ type: 'output_text', text: JSON.stringify({ candidates: [
          { companyName: 'A Cafe', contactEmail: 'hello@example.co.za' },
        ] }) }] },
      ] });
    } });
  assert.equal(calls.length, 6);
  assert.ok(calls.every((call) => call.tool_choice === 'required' && call.tools[0].type === 'web_search'));
  assert.equal(result.failures, 5);
  assert.equal(result.candidates.length, 1);
});

test('daily outreach limits follow the South African calendar day', () => {
  assert.deepEqual(southAfricanDayBounds('2026-09-27T23:30:00.000Z'), {
    day: '2026-09-28',
    start: '2026-09-27T22:00:00.000Z',
    end: '2026-09-28T22:00:00.000Z',
  });
  assert.deepEqual(southAfricanDayBounds('2026-09-28T21:59:59.000Z').day, '2026-09-28');
  assert.deepEqual(southAfricanDayBounds('2026-09-28T22:00:00.000Z').day, '2026-09-29');
});

test('backfill only reopens a missed slot from one to three South African days ago', () => {
  const at = new Date('2026-09-30T03:00:00Z');
  assert.deepEqual(backfillSlot(3, '2026-09-29', at), { day: '2026-09-29', slot: 3, due: true, today: '2026-09-30' });
  assert.equal(backfillSlot(1, '2026-09-27', at).day, '2026-09-27');
  assert.throws(() => backfillSlot(1, '2026-09-30', at), /one to three days/);
  assert.throws(() => backfillSlot(1, '2026-09-26', at), /one to three days/);
  assert.throws(() => backfillSlot(1, '2026-10-01', at), /one to three days/);
  assert.throws(() => backfillSlot(1, 'yesterday', at), /YYYY-MM-DD/);
  assert.throws(() => backfillSlot(5, '2026-09-29', at), /four scheduled/);
});

test('completed manual first run occupies the matching scheduled send slot', async () => {
  const registry = new Registry(new D1TestAdapter());
  await registry.setAgentEnabled('outreach', true, 'test:enable-outreach');
  const key = 'run:2026-09-28:slot-1:send';
  const manual = await registry.createRun({ agentId: 'outreach', trigger: 'manual', idempotencyKey: key });
  await registry.updateRun(manual.id, 'running', `${key}:running`);
  await registry.updateRun(manual.id, 'succeeded', `${key}:succeeded`);
  const scheduled = await registry.createRun({ agentId: 'outreach', trigger: 'scheduled', idempotencyKey: key });
  assert.equal(scheduled.id, manual.id);
  assert.equal(scheduled.status, 'succeeded');
});

test('fixed send slots, current public evidence, and opt-out text gate scheduled mail', () => {
  assert.deepEqual(scheduledSlot(1, new Date('2026-09-28T07:00:00Z')),
    { day: '2026-09-28', slot: 1, due: true });
  assert.equal(scheduledSlot(2, new Date('2026-09-28T07:00:00Z')).due, false);
  assert.deepEqual(scheduledSlot(4, new Date('2026-09-28T18:00:00Z')),
    { day: '2026-09-28', slot: 4, due: true });
  assert.throws(() => scheduledSlot(5), /four scheduled/);
  const prospect = { stage: 'qualified', email_normalized: 'info@example.co.za',
    website_url: 'https://example.co.za/', source: 'https://example.co.za/contact' };
  const events = [{ event_type: 'prospect.created', metadata_json: JSON.stringify({ observations: [{
    sourceUrl: 'https://example.co.za/projects', observedAt: '2026-09-28T07:00:00Z',
    finding: 'The project page has entries with no dates.', offeringCode: 'website-redesign',
  }] }) }];
  assert.equal(prospectEvidence(prospect, events, Date.parse('2026-09-28T08:00:00Z')).observations.length, 1);
  assert.throws(() => prospectEvidence({ ...prospect, source: 'https://other.co.za/contact' }, events,
    Date.parse('2026-09-28T08:00:00Z')), /verified public contact URL/);
  const bodyText = `Hi team,\n\nI’m Eugene from Boondock Labs. We design and build websites for South African businesses that want to present their work clearly online.\n\nI came across your construction projects and enjoyed seeing the range of work in your gallery. The latest dated entries on the page are from 2020, so a visitor may miss the projects you have completed since then. A refreshed project page could show recent work, location, and the type of service delivered, while keeping the details that already tell your story.\n\nIf that sounds useful, I can send a couple of specific ideas by email, or we can have a short call. If it is not relevant, just reply no thanks and I will leave it there.`;
  const draft = [{ type: 'message', role: 'assistant', turn_id: 'turn-1', content: [{ type: 'output_text',
    text: JSON.stringify({ subject: 'Project portfolio', bodyText }) }] }];
  assert.equal(parseOutreachDraft(draft, 'turn-1').subject, 'Project portfolio');
  assert.match(parseOutreachDraft(draft, 'turn-1').bodyText, /AI agents that can help with common customer enquiries/);
  assert.throws(() => parseOutreachDraft(draft, 'turn-2'), /incomplete/);
  assert.throws(() => parseOutreachDraft([{ ...draft[0], content: [{ type: 'output_text',
    text: JSON.stringify({ subject: 'Project portfolio', bodyText: 'Would a refreshed project page help? If not, reply no thanks.' }) }] }], 'turn-1'), /checks/);
});

test('scheduled research admits only independently visible email and opportunity text', async () => {
  const candidate = { companyName: 'Example Works', websiteUrl: 'https://example.co.za/',
    contactEmail: 'info@example.co.za', contactSourceUrl: 'https://example.co.za/contact',
    observationUrl: 'https://example.co.za/projects', evidenceText: 'Projects listed from January 2019',
    finding: 'The project list shows January 2019 entries without newer status dates.', offeringCode: 'website-redesign' };
  const items = [{ type: 'message', role: 'assistant', turn_id: 'turn-lead', content: [{ type: 'output_text',
    text: JSON.stringify({ candidates: [candidate] }) }] }];
  assert.equal(parseLeadCandidates(items, 'turn-lead').length, 1);
  const fetcher = async (url) => ({ ok: true, url, headers: new Headers(), text: async () =>
    url.endsWith('/contact') ? '<p>Email: info@example.co.za</p>' : '<p>Projects listed from January 2019</p>' });
  const verified = await verifyLeadCandidate(candidate, fetcher, new Date('2026-09-28T09:00:00Z'));
  assert.equal(verified.source, candidate.contactSourceUrl);
  assert.equal(verified.observations[0].offeringCode, 'website-redesign');
  await assert.rejects(() => verifyLeadCandidate({ ...candidate, evidenceText: 'A much newer project listing' }, fetcher),
    /absent from the live page/);
  const placeholderFetch = async (url) => ({ ok: true, url, headers: new Headers(), text: async () =>
    '<h1>Website Coming Soon</h1><p>info@example.co.za</p>' });
  const placeholder = await verifyLeadCandidate({ ...candidate, contactSourceUrl: 'https://example.co.za/',
    observationUrl: 'https://example.co.za/', evidenceText: 'Our new site will launch soon' }, placeholderFetch);
  assert.match(placeholder.observations[0].finding, /currently displays “website coming soon”/);
});

test('a public listing can qualify a business without a dedicated website', async () => {
  const listing = 'https://www.africabizinfo.com/ZA/example-gardens';
  const candidate = { companyName: 'Example Gardens', websiteUrl: null, contactEmail: 'hello@example.com',
    contactSourceUrl: listing, observationUrl: listing,
    evidenceText: 'There is no website listed for Example Gardens, but you can find Example Gardens on Facebook.',
    finding: 'The public listing offers a Facebook link but no dedicated website, so a small service site could help visitors learn about the business.',
    offeringCode: 'website-redesign' };
  const fetcher = async (url) => ({ ok: true, url, headers: new Headers(), text: async () =>
    `<html><body>${candidate.companyName} South Africa ${candidate.contactEmail} ${candidate.evidenceText}</body></html>` });
  const verified = await verifyLeadCandidate(candidate, fetcher, new Date('2026-09-28T10:00:00Z'));
  assert.equal(verified.websiteUrl, null);
  const prospect = { stage: 'qualified', email_normalized: candidate.contactEmail, website_url: null, source: listing };
  const events = [{ event_type: 'prospect.created', metadata_json: JSON.stringify({ observations: verified.observations }) }];
  assert.equal(prospectEvidence(prospect, events, Date.parse('2026-09-28T11:00:00Z')).contactSourceUrl, listing);
});

test('a live business profile with a public email and no listed website qualifies', async () => {
  const url = 'https://live-profiles.com/ZAUX-OX0JG';
  const candidate = { companyName: 'El Waterworks Plumbing Co', websiteUrl: null,
    contactEmail: 'waterworksplumbco@gmail.com', contactSourceUrl: url, observationUrl: url,
    evidenceText: 'Open Website Not provided',
    finding: 'The public directory profile shows a business email and marks the website as not provided.',
    offeringCode: 'website-redesign' };
  const fetcher = async () => ({ ok: true, url, headers: new Headers(), text: async () =>
    '<p>El Waterworks Plumbing Co, Berea, South Africa</p><p>Email Address waterworksplumbco@gmail.com</p><p>Open Website Not provided</p>' });
  const verified = await verifyLeadCandidate(candidate, fetcher);
  assert.equal(verified.websiteUrl, null);
  assert.equal(verified.source, url);
});

test('a directory contact on the business email domain can verify a placeholder website', async () => {
  const listing = 'https://saonlinedirectory.co.za/showlisting.php?listing=123';
  const website = 'https://example.co.za/';
  const candidate = { companyName: 'Example Studio', websiteUrl: website, contactEmail: 'hello@example.co.za',
    contactSourceUrl: listing, observationUrl: website, evidenceText: 'SOMETHING IS HAPPENING!',
    finding: 'The business website currently shows a coming soon message instead of service information.',
    offeringCode: 'website-redesign' };
  const fetcher = async (url) => ({ ok: true, url, headers: new Headers(), text: async () =>
    url === listing ? `Example Studio Company Email : hello@example.co.za` : candidate.evidenceText });
  const verified = await verifyLeadCandidate(candidate, fetcher, new Date('2026-09-28T10:00:00Z'));
  const prospect = { stage: 'qualified', email_normalized: candidate.contactEmail, website_url: website, source: listing };
  const events = [{ event_type: 'prospect.created', metadata_json: JSON.stringify({ observations: verified.observations }) }];
  assert.equal(prospectEvidence(prospect, events, Date.parse('2026-09-28T11:00:00Z')).contactSourceUrl, listing);
});

class D1TestAdapter {
  constructor() {
    this.sqlite = new DatabaseSync(':memory:');
    for (const file of ['../../migrations/001_outreach_registry.sql', '../../migrations/002_outreach_support.sql', '../../migrations/003_outreach_contact_limits.sql', '../../migrations/004_outreach_takeover.sql', '../../migrations/005_outreach_delivery_failures.sql', '../../migrations/006_outreach_verified_market_quotes.sql']) {
      this.sqlite.exec(readFileSync(new URL(file, import.meta.url), 'utf8'));
    }
  }
  prepare(query) {
    const db = this.sqlite;
    const adapter = (args) => ({
      first: async () => db.prepare(query).get(...args) ?? null,
      all: async () => ({ results: db.prepare(query).all(...args) }),
      run: async () => ({ meta: { changes: Number(db.prepare(query).run(...args).changes) } }),
    });
    return { bind: (...args) => adapter(args), ...adapter([]) };
  }
  async batch(statements) {
    this.sqlite.exec('BEGIN');
    try {
      const results = [];
      for (const statement of statements) results.push(await statement.run());
      this.sqlite.exec('COMMIT');
      return results;
    } catch (error) {
      this.sqlite.exec('ROLLBACK');
      throw error;
    }
  }
}

test('verified-market migration preserves existing quote items with foreign keys enabled', () => {
  const db = new DatabaseSync(':memory:');
  for (const file of ['001_outreach_registry.sql', '002_outreach_support.sql', '003_outreach_contact_limits.sql',
    '004_outreach_takeover.sql', '005_outreach_delivery_failures.sql']) {
    db.exec(readFileSync(new URL(`../../migrations/${file}`, import.meta.url), 'utf8'));
  }
  assert.equal(db.prepare('PRAGMA foreign_keys').get().foreign_keys, 1);
  const at = '2026-09-28T00:00:00.000Z';
  db.prepare('INSERT INTO prospects (id,company_name,source,stage,created_at,updated_at) VALUES (?,?,?,?,?,?)')
    .run('p-old', 'Old Client', 'manual', 'replied', at, at);
  db.prepare('INSERT INTO quotes (id,prospect_id,quote_number,currency,amount_minor,status,created_at,updated_at) VALUES (?,?,?,?,?,?,?,?)')
    .run('q-old', 'p-old', 'BL-OLD', 'ZAR', 100000, 'draft', at, at);
  db.prepare('INSERT INTO quote_items (id,quote_id,position,service_code,description,quantity,unit_price_minor,line_total_minor,pricing_source) VALUES (?,?,?,?,?,?,?,?,?)')
    .run('item-old', 'q-old', 0, 'website-redesign', 'Old quote', 1, 100000, 100000, 'catalog');
  db.exec(readFileSync(new URL('../../migrations/006_outreach_verified_market_quotes.sql', import.meta.url), 'utf8'));
  assert.equal(db.prepare('SELECT id FROM quote_items WHERE quote_id=?').get('q-old').id, 'item-old');
  assert.equal(db.prepare('PRAGMA foreign_key_check').all().length, 0);
  assert.match(db.prepare("SELECT sql FROM sqlite_master WHERE name='quote_items'").get().sql, /verified_market/);
});

const prospectInput = (email, key) => ({ companyName: `${email.split('@')[0]} Ltd`, contactEmail: email, source: 'manual-test', idempotencyKey: key,
  observations: [{ sourceUrl: 'https://evidence.example.co.za/site', observedAt: new Date().toISOString(), finding: 'Contact form page lists an older copyright year', offeringCode: 'website-redesign' }] });

test('runner can list the full prospect registry past the dashboard default', async () => {
  const adapter = new D1TestAdapter();
  const registry = new Registry(adapter);
  const statement = adapter.sqlite.prepare('INSERT INTO prospects (id,company_name,contact_email,email_normalized,source,stage,created_at,updated_at) VALUES (?,?,?,?,?,?,?,?)');
  for (let index = 0; index < 126; index++) {
    statement.run(`p-${index}`, `Business ${index}`, `hello${index}@example.co.za`, `hello${index}@example.co.za`,
      'test', index < 76 ? 'contacted' : 'qualified', '2026-09-28T00:00:00Z', '2026-09-28T00:00:00Z');
  }
  assert.equal((await registry.listProspects()).length, 50);
  assert.equal((await registry.listProspects(1000)).length, 126);
  await assert.rejects(() => registry.listProspects(1001), /Invalid prospect list limit/);
});

test('core contract, run events, dedupe, suppression, and daily volume guard', async () => {
  const adapter = new D1TestAdapter();
  const registry = new Registry(adapter, { dailyLimit: 1 });
  const tables = adapter.sqlite.prepare("SELECT name FROM sqlite_master WHERE type='table' AND name NOT LIKE 'sqlite_%' ORDER BY name").all().map((row) => row.name);
  assert.deepEqual(tables, ['activity_events','admin_handoffs','agent_runs','contact_suppression_keys','delivery_failures','mailbox_cursors','outreach_agents','outreach_messages','outreach_opt_outs','prospect_business_keys','prospects','quote_documents','quote_items','quotes','sent_mail_observations']);
  assert.equal((await registry.listAgents()).length, 3);
  const first = await registry.addProspect(prospectInput('FIRST@example.com', 'lead:first'));
  assert.equal((await registry.addProspect(prospectInput('first@example.com', 'lead:duplicate'))).id, first.id);
  await registry.changeStage(first.id, 'qualified', 'stage:first');
  await registry.optOut({ email: 'first@example.com', reason: 'Requested', idempotencyKey: 'opt:first' });
  await assert.rejects(() => registry.reserveOutbound({ prospectId: first.id, kind: 'initial', idempotencyKey: 'send:first' }), /opted out/i);
  const second = await registry.addProspect(prospectInput('second@example.com', 'lead:second'));
  await registry.changeStage(second.id, 'qualified', 'stage:second');
  const reservation = await registry.reserveOutbound({ prospectId: second.id, kind: 'initial', idempotencyKey: 'send:second' });
  assert.equal((await registry.reserveOutbound({ prospectId: second.id, kind: 'initial', idempotencyKey: 'another-run' })).idempotencyKey, reservation.idempotencyKey);
  await registry.markSending(reservation.idempotencyKey);
  await assert.rejects(() => registry.markSending(reservation.idempotencyKey), /already attempted/);
  const sent = await registry.finishOutbound({ idempotencyKey: reservation.idempotencyKey, provider: 'gmail', providerMessageId: 'g-1', providerThreadId: 't-1', subject: 'Hello', bodyText: 'Hello there' });
  assert.equal((await registry.finishOutbound({ idempotencyKey: reservation.idempotencyKey })).id, sent.id);
  assert.equal((await registry.prospect(second.id)).stage, 'contacted');
  await assert.rejects(() => registry.reserveOutbound({ prospectId: second.id, kind: 'initial', idempotencyKey: 'nudge' }), /qualified/);
  const third = await registry.addProspect(prospectInput('third@example.com', 'lead:third'));
  await registry.changeStage(third.id, 'qualified', 'stage:third');
  await assert.rejects(() => registry.reserveOutbound({ prospectId: third.id, kind: 'initial', idempotencyKey: 'send:third' }), /Daily limit/);
  await registry.setAgentEnabled('lead-research', true, 'agent:enable');
  const run = await registry.createRun({ agentId: 'lead-research', trigger: 'manual', idempotencyKey: 'run:one' });
  assert.equal((await registry.updateRun(run.id, 'running', 'run:start', 'sess_123')).status, 'running');
  assert.equal((await registry.updateRun(run.id, 'succeeded', 'run:done')).status, 'succeeded');
  assert.ok((await registry.timeline(second.id)).some((event) => event.event_type === 'message.sent'));
});

test('qualification requires current evidence and quote scope follows the selected service', async () => {
  const registry = new Registry(new D1TestAdapter());
  const input = prospectInput('scope@example.com', 'lead:scope');
  delete input.observations;
  const prospect = await registry.addProspect(input);
  await assert.rejects(() => registry.changeStage(prospect.id, 'qualified', 'stage:scope'), /observations required/i);
  await registry.recordObservations(prospect.id, prospectInput('scope@example.com', 'lead:observation').observations, 'observations:scope');
  assert.equal((await registry.changeStage(prospect.id, 'qualified', 'stage:scope')).stage, 'qualified');
  const context = assessQuoteContext({ serviceCode: 'whatsapp-ai-agent', conversationVolume: '300 per month' }, [], 'Client provides FAQ');
  assert.ok(context.missing.includes('dataSources'));
  assert.ok(context.missing.includes('two recent South African market sources'));
  assert.ok(!context.missing.includes('pagesFeatures'));
});

test('reply and quote rules require review for missing prices and produce a stored PDF', async () => {
  const registry = new Registry(new D1TestAdapter(), { catalog: { ZAR: { audit: { unitPriceMinor: 120000, minQuantity: 1, maxQuantity: 2 } } }, maxQuoteMinor: 500000 });
  const prospect = await registry.addProspect(prospectInput('reply@example.com', 'lead:reply'));
  await registry.changeStage(prospect.id, 'qualified', 'stage:qualified');
  await registry.changeStage(prospect.id, 'contacted', 'stage:contacted');
  const inbound = {
    prospectId: prospect.id, provider: 'gmail', providerMessageId: 'g-in-1', providerThreadId: 'thread',
    fromEmail: 'reply@example.com', toEmail: 'eugene@boondocklabs.co.za', subject: 'Interested', bodyText: 'Please quote', idempotencyKey: 'inbound:1',
  };
  assert.equal((await registry.recordInbound(inbound)).id, (await registry.recordInbound(inbound)).id);
  assert.equal((await registry.prospect(prospect.id)).stage, 'replied');
  const quote = await registry.createQuote({ prospectId: prospect.id, quoteNumber: 'Q-TEST-1', currency: 'ZAR', expiresAt: '2099-01-01T00:00:00Z',
    items: [{ code: 'audit', description: 'Technical audit', quantity: 1 }, { code: 'custom', description: 'Custom project', quantity: 1 }], idempotencyKey: 'quote:one' });
  assert.equal(quote.reviewStatus, 'pending');
  assert.equal(quote.amount_minor, 0);
  await assert.rejects(() => registry.storeQuotePdf(quote.id, 'abc', '0'.repeat(64), 'pdf:early'), /approval/);
  await assert.rejects(() => registry.approveQuote(quote.id, [null, 200000], 'quote:missing-scope', 'admin'), /scope or market evidence/);
  const context = { scope: { serviceCode: 'website-redesign', siteType: 'Business site', pagesFeatures: 'Five pages and contact form', designContent: 'Custom design, client text', hosting: 'Managed hosting', timeline: 'Six weeks', integrations: 'Contact form', ongoingSupport: 'Monthly updates' },
    assumptions: 'Client supplies copy and images', benchmarks: [
      { sourceUrl: 'https://example-a.co.za/pricing', observedAt: new Date().toISOString(), currency: 'ZAR', minAmountMinor: 200000, maxAmountMinor: 400000, comparableScope: 'Small business website' },
      { sourceUrl: 'https://example-b.co.za/services', observedAt: new Date().toISOString(), currency: 'ZAR', minAmountMinor: 250000, maxAmountMinor: 500000, comparableScope: 'Custom website' },
    ] };
  await registry.updateQuoteContext(quote.id, { ...context, idempotencyKey: 'quote:context' });
  await assert.rejects(() => registry.approveQuote(quote.id, [null, 1000000], 'quote:bad', 'admin'), /exceeds/);
  const approved = await registry.approveQuote(quote.id, [null, 200000], 'quote:approved', 'admin');
  assert.equal(approved.amount_minor, 320000);
  assert.equal(approved.reviewStatus, 'approved');
  const bytes = renderQuotePdf({ quoteNumber: approved.quote_number, companyName: prospect.company_name, currency: approved.currency,
    amountMinor: approved.amount_minor, items: approved.items.map((item) => ({ quantity: item.quantity, description: item.description, lineTotalMinor: item.line_total_minor })),
    issuedAt: approved.issued_at, expiresAt: approved.expires_at, context: approved.context });
  assert.ok(bytes.toString('ascii', 0, 8).startsWith('%PDF-1.4'));
  assert.ok(bytes.toString('ascii').includes('xref'));
  assert.ok(bytes.toString('ascii').includes('ZAR 3200.00'));
  assert.ok(bytes.toString('ascii').includes('Client supplies copy and images'));
  assert.ok(bytes.toString('ascii').includes('example-a.co.za'));
  await registry.storeQuotePdf(quote.id, bytes.toString('base64'), createHash('sha256').update(bytes).digest('hex'), 'pdf:one');
  assert.equal((await registry.pdf(quote.id)).content_type, 'application/pdf');
});

test('requested quote uses independently fetched South African prices and complete client scope', async () => {
  const scope = { serviceCode: 'website-redesign', siteType: 'Business site', pagesFeatures: 'Five pages and a contact form',
    designContent: 'Client supplies approved copy and images', hosting: 'Client-managed hosting', timeline: 'Six weeks',
    integrations: 'Contact form only', ongoingSupport: 'No ongoing support included' };
  const scopeEvidence = Object.fromEntries(Object.entries(scope).filter(([field]) => field !== 'serviceCode'));
  const benchmarks = [
    { sourceUrl: 'https://price-a.co.za/websites', evidenceText: 'Five-page business website package R 12,000',
      comparableScope: 'Five-page business website package', minAmountMinor: 1200000, maxAmountMinor: 1200000 },
    { sourceUrl: 'https://price-b.co.za/websites', evidenceText: 'Five-page business website package R 14,000',
      comparableScope: 'Five-page business website package', minAmountMinor: 1400000, maxAmountMinor: 1400000 },
  ];
  const quoteFetch = async (url) => ({ ok: true, url, headers: new Headers(),
    text: async () => `<html><body>${benchmarks.find((item) => item.sourceUrl === url)?.evidenceText ?? ''}</body></html>` });
  assert.equal(asksForQuote('Could you send a quotation?'), true);
  assert.equal(replyNeedsHandoff('Could you send a quotation?'), false);
  assert.equal(replyNeedsHandoff('Please send your design files'), true);
  const decision = { action: 'quote', subject: 'Re: Website quote', bodyText: 'The PDF quotation is attached.',
    description: 'Five-page business website and contact form', scope, scopeEvidence,
    assumptions: 'Client supplies approved content', benchmarks };
  const items = [{ type: 'message', role: 'assistant', turn_id: 'turn-quote',
    content: [{ type: 'output_text', text: JSON.stringify(decision) }] }];
  assert.equal(parseReplyDecision(items, 'turn-quote').action, 'quote');
  assert.equal((await verifyQuoteBenchmarks(benchmarks, quoteFetch)).length, 2);
  await assert.rejects(() => verifyQuoteBenchmarks([{ ...benchmarks[0], evidenceText: 'Five-page business website package R 12,000 with invented extras' }, benchmarks[1]], quoteFetch),
    /absent from the live page/);
  await assert.rejects(() => verifyQuoteBenchmarks([{ ...benchmarks[0], minAmountMinor: 1500000 }, benchmarks[1]], quoteFetch),
    /does not match/);
  const registry = new Registry(new D1TestAdapter(), { quoteFetch });
  const prospect = await registry.addProspect(prospectInput('quote-buyer@example.co.za', 'lead:auto-quote'));
  await registry.changeStage(prospect.id, 'qualified', 'stage:auto-qualified');
  await registry.changeStage(prospect.id, 'contacted', 'stage:auto-contacted');
  await registry.recordInbound({ prospectId: prospect.id, provider: 'gmail', providerMessageId: 'in:auto',
    rfcMessageId: '<in-auto@example.co.za>', fromEmail: 'quote-buyer@example.co.za',
    toEmail: 'eugene@boondocklabs.co.za', subject: 'Website quote',
    bodyText: `Please quote a website redesign. ${Object.values(scopeEvidence).join('; ')}.`, idempotencyKey: 'inbound:auto' });
  const input = { prospectId: prospect.id, quoteNumber: 'BL-TEST-AUTO', currency: 'ZAR',
    expiresAt: new Date(Date.now() + 14 * 86400000).toISOString(), autoMarketQuote: true,
    items: [{ code: scope.serviceCode, description: decision.description, quantity: 1 }],
    scope, scopeEvidence, inboundMessageId: (await registry.pendingReplies())[0].id,
    assumptions: decision.assumptions, benchmarks, idempotencyKey: 'quote:auto' };
  const quote = await registry.createQuote(input);
  assert.equal(quote.reviewStatus, 'approved');
  assert.equal(quote.amount_minor, 1300000);
  assert.equal(quote.items[0].pricing_source, 'verified_market');
  assert.equal((await registry.createQuote(input)).id, quote.id);
  await assert.rejects(() => registry.createQuote({ ...input, items: [{ ...input.items[0], code: 'website-ai-chat' }],
    idempotencyKey: 'quote:auto:wrong-service' }), /matching scope/);
  await assert.rejects(() => registry.createQuote({ ...input, scope: { ...scope, timeline: '' },
    idempotencyKey: 'quote:auto:missing-scope' }), /matching scope/);
  await assert.rejects(() => registry.createQuote({ ...input, scopeEvidence: { ...scopeEvidence, timeline: 'A false timeline' },
    idempotencyKey: 'quote:auto:invented-scope' }), /did not confirm/);
  await assert.rejects(() => registry.createQuote({ ...input,
    benchmarks: benchmarks.map((item) => ({ ...item, evidenceText: item.evidenceText.replace('website', 'mobile app'),
      comparableScope: item.comparableScope.replace('website', 'mobile app') })),
    idempotencyKey: 'quote:auto:wrong-market' }), /absent from the live page/);
  let attachedPdf;
  const api = { async request(path, body) {
    if (path === `/messages/${input.inboundMessageId}`) return registry.inboundForReply(input.inboundMessageId);
    if (path === `/quotes/${quote.id}/pdf`) return registry.storeQuotePdf(quote.id, body.pdfBase64, body.sha256Hex, body.idempotencyKey);
    if (path === `/quotes/${quote.id}/sent`) return registry.markQuoteSent(quote.id, body.messageId, body.idempotencyKey);
    if (path === '/outbound/reserve') return registry.reserveOutbound(body);
    if (path === '/outbound/sending') return registry.markSending(body.idempotencyKey);
    if (path === '/outbound/sent') return registry.finishOutbound(body);
    if (path === '/outbound/uncertain') return registry.markUncertain(body.idempotencyKey, body.reason);
    throw new Error(`Unexpected registry path ${path}`);
  } };
  const gmail = { allowSend: true, send: async (message) => {
    attachedPdf = message.pdf;
    return { id: 'gmail:auto-quote', threadId: 'thread:auto-quote' };
  } };
  const sent = await sendQuote({ registry: api, gmail, quote, prospect, subject: decision.subject,
    bodyText: decision.bodyText, inboundMessageId: input.inboundMessageId });
  assert.equal(sent.status, 'sent');
  assert.ok(attachedPdf.bytes.toString('ascii', 0, 8).startsWith('%PDF-1.4'));
  assert.equal((await registry.quote(quote.id)).status, 'sent');
  assert.equal((await registry.pendingReplies()).length, 0);
});

test('Gmail MIME and reply polling preserve message and thread IDs', async () => {
  const mime = buildMime({ to: 'buyer@example.com', subject: 'Hello', text: 'Body', messageId: '<outreach-123@boondocklabs.co.za>' });
  const rawMime = Buffer.from(mime, 'base64url').toString('utf8');
  assert.ok(rawMime.includes('From: eugene@boondocklabs.co.za'));
  assert.ok(rawMime.includes('Content-Type: multipart/alternative'));
  const plainPart = rawMime.match(/Content-Type: text\/plain; charset=UTF-8\r\nContent-Transfer-Encoding: base64\r\n\r\n([A-Za-z0-9+/=\r\n]+)/)?.[1];
  const htmlPart = rawMime.match(/Content-Type: text\/html; charset=UTF-8\r\nContent-Transfer-Encoding: base64\r\n\r\n([A-Za-z0-9+/=\r\n]+)/)?.[1];
  assert.ok(plainPart && htmlPart);
  assert.ok(Buffer.from(plainPart, 'base64').toString('utf8').endsWith(SIGNATURE_TEXT));
  const html = Buffer.from(htmlPart, 'base64').toString('utf8');
  assert.ok(html.includes(SIGNATURE_LOGO));
  assert.match(html, /width="64" height="64"/);
  assert.doesNotMatch(html, /\.webp\b/i);
  assert.ok(html.includes('bgcolor="#f5f0e6"'));
  assert.ok(html.includes('alt="Boondock Labs"'));
  assert.ok(!html.includes('081 628 8767'));
  assert.equal(signedBodies(`Body\n\n${SIGNATURE_TEXT}`).plain.split(SIGNATURE_TEXT).length, 2);
  const pdfMime = Buffer.from(buildMime({ to: 'buyer@example.com', subject: 'Quote', text: 'Attached', messageId: '<outreach-quote@boondocklabs.co.za>', pdf: { filename: 'Q-1.pdf', bytes: Buffer.from('%PDF-1.4 example') } }), 'base64url').toString('utf8');
  assert.ok(pdfMime.includes('Content-Type: multipart/mixed'));
  assert.ok(pdfMime.includes('Content-Type: multipart/alternative'));
  assert.ok(pdfMime.includes('Content-Disposition: attachment; filename="Q-1.pdf"'));
  const raw = { id: 'gmail-42', threadId: 'thread-9', labelIds: ['INBOX'], internalDate: String(Date.now()), snippet: 'Reply', payload: {
    headers: [{ name: 'From', value: 'Buyer <buyer@example.com>' }, { name: 'To', value: 'eugene@boondocklabs.co.za' }, { name: 'Subject', value: 'Re: Hello' }, { name: 'Message-ID', value: '<reply@example.com>' }],
    mimeType: 'text/plain', body: { data: Buffer.from('Please stop emailing me').toString('base64url') },
  } };
  assert.equal(parseGmailMessage(raw).providerThreadId, 'thread-9');
  const calls = [];
  const registry = { async request(path, body) {
    calls.push({ path, body });
    if (path === '/mailbox/cursor') return null;
    if (path.startsWith('/prospects/by-email')) return { id: 'prospect-1' };
    return {};
  } };
  const gmail = { profile: async () => ({ historyId: '123' }), listInbox: async () => ({ messages: [{ id: raw.id }] }), listSent: async () => ({ messages: [] }), getMessage: async () => raw };
  const result = await pollReplies(gmail, registry);
  assert.equal(result.recorded, 1);
  assert.ok(calls.some((call) => call.path === '/messages/inbound' && call.body.providerMessageId === 'gmail-42'));
  assert.ok(calls.some((call) => call.path === '/opt-outs'));
  assert.ok(calls.some((call) => call.path === '/mailbox/cursor' && call.body?.historyId === '123'));
});

test('reply polling advances past a deleted Gmail history message', async () => {
  const calls = [];
  const registry = { async request(path, body) {
    calls.push({ path, body });
    if (path === '/mailbox/cursor' && !body) return { history_id: '120' };
    return {};
  } };
  const gmail = {
    profile: async () => ({ historyId: '123' }),
    history: async () => ({ historyId: '123', history: [{ messagesAdded: [{ message: { id: 'gone' } }] }] }),
    getMessage: async () => { const error = new Error('Gmail API failed (404)'); error.status = 404; throw error; },
  };
  const result = await pollReplies(gmail, registry);
  assert.equal(result.processed, 1);
  assert.equal(result.outcomes[0].status, 'missing');
  assert.ok(calls.some((call) => call.path === '/mailbox/cursor' && call.body?.historyId === '123'));
});

test('Cloudflare research rendering is service-only and restricted to public seed hosts', async () => {
  const allowedHosts = 'live-profiles.com,africabizinfo.com';
  assert.equal(researchUrl('https://www.live-profiles.com/ZA/example', allowedHosts), 'https://www.live-profiles.com/ZA/example');
  for (const url of ['http://live-profiles.com', 'https://live-profiles.com.evil.test',
    'https://127.0.0.1/', 'https://user@live-profiles.com/', 'https://live-profiles.com:8443/']) {
    assert.throws(() => researchUrl(url, allowedHosts));
  }
  const calls = [];
  const env = { OUTREACH_SERVICE_TOKEN: 'test-secret', BROWSER_RESEARCH_HOSTS: allowedHosts,
    BROWSER: { async quickAction(action, options) {
      calls.push({ action, options });
      if (action === 'links') return Response.json({ success: true,
        result: ['https://live-profiles.com/ZA/a', 'https://127.0.0.1/', 'https://example.com/'] });
      return new Response('# Business listing\n\nNo website listed.', { status: 200 });
    } } };
  const request = (url, token) => new Request('https://registry.example/research/render', {
    method: 'POST', headers: { 'Content-Type': 'application/json', ...(token ? { Authorization: `Bearer ${token}` } : {}) },
    body: JSON.stringify({ url }),
  });
  assert.equal((await handleOutreachRequest(request('https://live-profiles.com/ZA/example'), env)).status, 403);
  assert.equal((await handleOutreachRequest(request('https://example.com/', 'test-secret'), env)).status, 400);
  const badAction = new Request('https://registry.example/research/render', { method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: 'Bearer test-secret' },
    body: JSON.stringify({ url: 'https://live-profiles.com/', action: 'screenshot' }) });
  assert.equal((await handleOutreachRequest(badAction, env)).status, 400);
  const response = await handleOutreachRequest(request('https://live-profiles.com/ZA/example', 'test-secret'), env);
  assert.equal(response.status, 200);
  assert.match(await response.text(), /No website listed/);
  const linksRequest = new Request('https://registry.example/research/render', { method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: 'Bearer test-secret' },
    body: JSON.stringify({ url: 'https://live-profiles.com/', action: 'links' }) });
  const links = await handleOutreachRequest(linksRequest, env);
  assert.deepEqual((await links.json()).result, ['https://live-profiles.com/ZA/a']);
  assert.deepEqual(calls, [{ action: 'markdown', options: { url: 'https://live-profiles.com/ZA/example' } },
    { action: 'links', options: { url: 'https://live-profiles.com/' } }]);
});

test('Cloudflare directory research selects only local businesses with visible email and missing website', async () => {
  const url = 'https://live-profiles.com/ZAUX-OX0JG';
  const page = '# El Waterworks Plumbing Co\n## Contact & Location\nEmail Address\nwaterworksplumbco@gmail.com\nOpen Website\nNot provided\nCity / Town\nBerea\nCountry\nSouth Africa\n## About This Business';
  const candidate = parseDirectoryCandidate(page, url);
  assert.equal(candidate.contactEmail, 'waterworksplumbco@gmail.com');
  assert.equal(candidate.websiteUrl, null);
  assert.equal(parseDirectoryCandidate(page.replace('Not provided', 'www.example.co.za'), url), null);
  assert.equal(parseDirectoryCandidate(page.replace('Berea', 'Not provided'), url), null);
  const calls = [];
  const registry = { async request(path, input) {
    calls.push({ path, input });
    if (input.action === 'links') return { success: true, result: [url, url, 'https://example.com/private'] };
    return { success: true, result: page };
  } };
  const result = await cloudflareDirectoryResearch({ registry, pageLimit: 2, sleep: async () => {} });
  assert.equal(result.scanned, 1);
  assert.equal(result.candidates.length, 1);
  assert.equal(calls.length, 2);
});

test('directory links are sampled across the full South African listing', async () => {
  const links = Array.from({ length: 1001 }, (_, index) =>
    `https://live-profiles.com/ZAUX-${String(index).padStart(5, '0')}`);
  const env = { OUTREACH_SERVICE_TOKEN: 'test-secret', BROWSER_RESEARCH_HOSTS: 'live-profiles.com',
    BROWSER: { quickAction: async () => Response.json({ success: true, result: links }) } };
  const response = await handleOutreachRequest(new Request('https://registry.example/research/render', {
    method: 'POST', headers: { Authorization: 'Bearer test-secret', 'Content-Type': 'application/json' },
    body: JSON.stringify({ url: 'https://live-profiles.com/directory', action: 'links' }),
  }), env);
  const result = await response.json();
  assert.equal(result.totalAvailable, 1001);
  assert.ok(result.result.length <= 1000);
  assert.ok(result.result.some((value) => value.endsWith('01000')));
});

test('OAuth callback, encrypted token, and service endpoint access stay scoped', async () => {
  const key = Buffer.alloc(32, 7).toString('base64');
  const envelope = encryptRefreshToken('private-refresh-token', key);
  assert.equal(decryptRefreshToken(envelope, key), 'private-refresh-token');
  assert.ok(!envelope.includes('private-refresh-token'));
  assert.throws(() => decryptRefreshToken(envelope, Buffer.alloc(32, 8).toString('base64')));
  const url = new URL(authorizationUrl({ clientId: 'client-id', publicBaseUrl: 'https://outreach.boondocklabs.co.za', state: 'state', challenge: 'challenge' }));
  assert.equal(url.searchParams.get('redirect_uri'), 'https://outreach.boondocklabs.co.za/oauth/google/callback');
  assert.equal(url.searchParams.get('access_type'), 'offline');
  const env = { OUTREACH_DB: new D1TestAdapter(), OUTREACH_SERVICE_TOKEN: 'service-secret' };
  const denied = await handleOutreachRequest(new Request('https://registry.example/agents'), env);
  assert.equal(denied.status, 403);
  const allowed = await handleOutreachRequest(new Request('https://registry.example/agents', { headers: { Authorization: 'Bearer service-secret' } }), env);
  assert.equal(allowed.status, 200);
  assert.equal((await allowed.json()).length, 3);
  const policy = await handleOutreachRequest(new Request('https://registry.example/policy', { headers: { Authorization: 'Bearer service-secret' } }), env);
  assert.equal(policy.status, 200);
  assert.deepEqual(await policy.json().then(({ dailyInitialLimit, perRunInitialLimit }) =>
    ({ dailyInitialLimit, perRunInitialLimit })), { dailyInitialLimit: 200, perRunInitialLimit: 50 });
});

test('Earthie saved agents are checked before sessions and run outcomes are stored', async () => {
  const calls = [];
  const savedIds = { 'lead-research': 'agent-lead-research', outreach: 'agent-outreach', 'reply-quotation': 'agent-reply-quotation' };
  const sessionIds = { 'lead-research': 'sess_lead', outreach: 'sess_outreach', 'reply-quotation': 'sess_reply' };
  let inputAccepted = false;
  const fakeFetch = async (url, options) => {
    calls.push({ url, options });
    if (url.endsWith('/models/gpt-5.6-luna')) return Response.json({ id: 'gpt-5.6-luna' });
    const role = Object.keys(savedIds).find((key) => url.endsWith(`/agents/${savedIds[key]}`));
    if (role) return Response.json({ id: savedIds[role], model: 'gpt-5.6-luna', metadata: { boondock_role: role } });
    if (url.endsWith('/sessions/sess_lead')) return Response.json({ id: 'sess_lead', status: 'idle', agent: { id: savedIds['lead-research'], model: 'gpt-5.6-luna' }, environment: { type: 'self_hosted' } });
    if (url.includes('/sessions/sess_lead/turns?')) return Response.json({ data: inputAccepted ? [{ id: 'turn_1', status: 'completed' }] : [] });
    if (url.endsWith('/sessions/sess_lead/events') && options.method === 'POST') { inputAccepted = true; return new Response(null, { status: 202 }); }
    throw new Error(`Unexpected URL ${url}`);
  };
  assert.throws(() => new AgentsApi({ apiKey: 'test', organizationId: '', fetcher: fakeFetch }), /organization ID/);
  const api = new AgentsApi({ apiKey: 'test', organizationId: 'org-EarthieTest', savedAgentIds: savedIds, sessionIds, fetcher: fakeFetch });
  const mapping = await api.verifySavedAgents();
  assert.deepEqual(Object.keys(mapping).sort(), ['lead-research','outreach','reply-quotation'].sort());
  assert.ok(calls.every((call) => call.options.headers['OpenAI-Organization'] === 'org-EarthieTest'));
  assert.ok(calls.every((call) => call.options.method !== 'POST'));
  const actions = [];
  const registry = { async request(path, body) {
    actions.push({ path, body });
    if (path === '/runs') return { id: 'run-1', status: 'queued' };
    return { id: 'run-1', status: body.status ?? 'running', external_run_id: body.externalRunId ?? null };
  } };
  const result = await runSavedAgent({ role: 'lead-research', input: 'Research a company', idempotencyKey: 'run-key', registry, agentsApi: api });
  assert.equal(result.status, 'succeeded');
  assert.ok(actions.some((action) => action.path === '/runs/run-1/session'));
  assert.ok(inputAccepted);
  assert.ok(calls.every((call) => !call.url.endsWith('/sessions')));
});

test('one cold contact per business, silence, and one reply per distinct inbound', async () => {
  const registry = new Registry(new D1TestAdapter(), { dailyLimit: 10 });
  const first = await registry.addProspect({ ...prospectInput('owner@acme.co.za', 'lead:acme'), companyName: 'Acme Holdings', websiteUrl: 'https://www.acme.co.za' });
  const second = await registry.addProspect({ ...prospectInput('manager@acme.co.za', 'lead:acme-other'), companyName: 'Acme Projects', websiteUrl: 'https://acme.co.za' });
  await registry.changeStage(first.id, 'qualified', 'stage:acme');
  await registry.changeStage(second.id, 'qualified', 'stage:acme-other');
  const initial = await registry.reserveOutbound({ prospectId: first.id, kind: 'initial', idempotencyKey: 'initial:acme' });
  await assert.rejects(() => registry.reserveOutbound({ prospectId: second.id, kind: 'initial', idempotencyKey: 'initial:acme-other' }), /prior business contact/);
  await registry.markSending(initial.idempotencyKey);
  await registry.finishOutbound({ idempotencyKey: initial.idempotencyKey, provider: 'gmail', providerMessageId: 'out-1', subject: 'Hello', bodyText: 'One introduction' });
  await assert.rejects(() => registry.reserveOutbound({ prospectId: first.id, kind: 'initial', idempotencyKey: 'reminder' }), /qualified/);
  await assert.rejects(() => registry.reserveOutbound({ prospectId: first.id, kind: 'reply', inboundMessageId: 'imaginary' }), /Genuine inbound/);
  const reply = await registry.recordInbound({ prospectId: first.id, provider: 'gmail', providerMessageId: 'in-1', providerThreadId: 'thread-1', rfcMessageId: '<in-1@acme.co.za>',
    fromEmail: 'owner@acme.co.za', toEmail: 'eugene@boondocklabs.co.za', subject: 'Re: Hello', bodyText: 'Tell me more', idempotencyKey: 'in:1' });
  assert.deepEqual((await registry.pendingReplies()).map((item) => item.id), [reply.id]);
  const response = await registry.reserveOutbound({ prospectId: first.id, kind: 'reply', inboundMessageId: reply.id, idempotencyKey: 'response:1' });
  assert.equal((await registry.pendingReplies()).length, 0);
  assert.equal((await registry.reserveOutbound({ prospectId: first.id, kind: 'reply', inboundMessageId: reply.id, idempotencyKey: 'response:another-run' })).idempotencyKey, response.idempotencyKey);
  await registry.markSending(response.idempotencyKey);
  await registry.finishOutbound({ idempotencyKey: response.idempotencyKey, provider: 'gmail', providerMessageId: 'out-2', subject: 'Re: Hello', bodyText: 'Details', inReplyToId: '<in-1@acme.co.za>' });
  await assert.rejects(() => registry.markSending(response.idempotencyKey), /already attempted/);
  const next = await registry.recordInbound({ prospectId: first.id, provider: 'gmail', providerMessageId: 'in-2', providerThreadId: 'thread-1', rfcMessageId: '<in-2@acme.co.za>',
    fromEmail: 'owner@acme.co.za', toEmail: 'eugene@boondocklabs.co.za', subject: 'Re: Hello', bodyText: 'Another question', idempotencyKey: 'in:2' });
  assert.deepEqual((await registry.pendingReplies()).map((item) => item.id), [next.id]);
  assert.ok((await registry.reserveOutbound({ prospectId: first.id, kind: 'reply', inboundMessageId: next.id })).idempotencyKey.includes(next.id));
  await registry.optOut({ email: 'owner@acme.co.za', reason: 'Stop', idempotencyKey: 'opt:acme' });
  assert.equal((await registry.pendingReplies()).length, 0);
  await assert.rejects(() => registry.reserveOutbound({ prospectId: first.id, kind: 'reply', inboundMessageId: next.id }), /opted out/);
});

test('manual Sent mail takes over a business and cancels a reserved send at the final database gate', async () => {
  const registry = new Registry(new D1TestAdapter());
  const first = await registry.addProspect({ ...prospectInput('owner@acme.co.za', 'lead:takeover'), companyName: 'Acme', websiteUrl: 'https://acme.co.za' });
  const second = await registry.addProspect({ ...prospectInput('team@acme.co.za', 'lead:takeover-team'), companyName: 'Acme', websiteUrl: 'https://acme.co.za' });
  await registry.changeStage(first.id, 'qualified', 'qualified:takeover');
  await registry.changeStage(second.id, 'qualified', 'qualified:takeover-team');
  const reservation = await registry.reserveOutbound({ prospectId: first.id, kind: 'initial', idempotencyKey: 'reserved:takeover' });
  const observed = await registry.recordSentEvidence({ recipientEmail: 'owner@acme.co.za', providerMessageId: 'manual-1',
    rfcMessageId: '<eugene-manual@example.com>' });
  assert.equal(observed.source, 'manual');
  assert.equal((await registry.recordSentEvidence({ recipientEmail: 'owner@acme.co.za', providerMessageId: 'manual-1' })).source, 'manual');
  await assert.rejects(() => registry.markSending(reservation.idempotencyKey), /suppression|takeover/i);
  await assert.rejects(() => registry.reserveOutbound({ prospectId: second.id, kind: 'initial' }), /prior sent|takeover/i);
  await assert.rejects(() => registry.releaseHumanControl(first.id, 'admin:release:acme'), /permanent/i);
  await assert.rejects(() => registry.reserveOutbound({ prospectId: second.id, kind: 'initial' }), /prior sent|takeover/i);
  const handoff = await registry.requestHandoff({ prospectId: first.id, reason: 'Client asked Eugene for photos', idempotencyKey: 'handoff:photos' });
  assert.equal(handoff.status, 'awaiting_admin');
  assert.equal((await registry.suppression(first, ['handoff'])).reason, 'handoff');
});

test('hard relay denial bounces remain distinct from accepted attempts and suppress exact addresses', async () => {
  const registry = new Registry(new D1TestAdapter());
  for (const [index, address] of ['fifthave@iafrica.com', 'elmapapps@mweb.co.za'].entries()) {
    const prospect = await registry.addProspect(prospectInput(address, `lead:bounce:${index}`));
    await registry.changeStage(prospect.id, 'qualified', `qualified:bounce:${index}`);
    await registry.changeStage(prospect.id, 'contacted', `contacted:bounce:${index}`);
    await registry.recordSentEvidence({ recipientEmail: address, providerMessageId: `sent:${index}`,
      rfcMessageId: `<outreach-${'a'.repeat(32)}@boondocklabs.co.za>` });
    const inbound = await registry.recordInbound({ prospectId: prospect.id, provider: 'gmail', providerMessageId: `in:${index}`,
      fromEmail: address, toEmail: 'eugene@boondocklabs.co.za', subject: 'Re: Test', bodyText: 'Can you help?', idempotencyKey: `inbound:bounce:${index}` });
    const first = await registry.recordDeliveryFailure({ recipientEmail: address, providerMessageId: `dsn:${index}`,
      smtpStatus: '550 5.7.1', diagnostic: '550 5.7.1 : Relay access denied' });
    assert.equal(first.classification, 'permanent_delivery_failure');
    assert.equal((await registry.recordDeliveryFailure({ recipientEmail: address, providerMessageId: `dsn:${index}` })).diagnostic, first.diagnostic);
    await assert.rejects(() => registry.reserveOutbound({ prospectId: prospect.id, kind: 'reply', inboundMessageId: inbound.id }), /delivery failure|suppression/i);
  }
  const dsn = parseDeliveryFailure({ fromEmail: 'mailer-daemon@googlemail.com', subject: 'Message blocked',
    bodyText: 'Your message could not be delivered to elmapapps@mweb.co.za. The response from the remote server was: 550 5.7.1 : Relay access denied' });
  assert.ok(dsn.recipients.includes('elmapapps@mweb.co.za'));
  assert.equal(dsn.smtpStatus, '550 5.7.1');
});

test('WhatsApp details need a direct request and OAuth profile must match Eugene', async () => {
  const prospect = { id: 'p1', email_normalized: 'buyer@example.com' };
  const inbound = { id: 'i1', prospect_id: 'p1', body_text: 'Please send details by email', rfcMessageId: '<i1@example.com>' };
  const fakeRegistry = { request: async () => inbound };
  await assert.rejects(() => sendOutreach({ registry: fakeRegistry, gmail: { allowSend: true }, prospect, kind: 'reply', inboundMessageId: 'i1',
    bodyText: 'WhatsApp +27 81 628 8767', subject: 'Details', idempotencyKey: 'one' }), /not requested/);
  const gmail = new GmailClient({ clientId: 'client', clientSecret: 'secret', refreshToken: 'refresh',
    fetcher: async () => Response.json({ emailAddress: 'other@example.com' }) });
  gmail.accessToken = 'access'; gmail.expiresAt = Date.now() + 3600000;
  await assert.rejects(() => gmail.profile(), /account mismatch/);
});
