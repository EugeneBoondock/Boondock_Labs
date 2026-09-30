import { AGENT_IDS, SENDER, SERVICE_SCOPE_FIELDS, assessQuoteContext, businessKeys, normalizeEmail, priceQuote, approveQuoteItems, requiredText, validateLeadObservations, validateStage } from './rules.mjs';
import { verifyQuoteBenchmarks } from './schedule.mjs';

const uid = () => crypto.randomUUID();
const now = () => new Date().toISOString();
const sql = (db, query, ...args) => db.prepare(query).bind(...args);
const meta = (value) => JSON.stringify(value);
const PERSONAL_MAIL_DOMAINS = new Set(['gmail.com', 'googlemail.com', 'outlook.com', 'hotmail.com', 'live.com', 'yahoo.com', 'icloud.com', 'aol.com', 'proton.me', 'protonmail.com']);
const AGENT_MESSAGE_ID = /^<outreach-[a-f0-9]{32}@boondocklabs\.co\.za>$/i;

export function southAfricanDayBounds(at) {
  const parts = Object.fromEntries(new Intl.DateTimeFormat('en-GB', { timeZone: 'Africa/Johannesburg',
    year: 'numeric', month: '2-digit', day: '2-digit' }).formatToParts(new Date(at)).map((part) => [part.type, part.value]));
  const day = `${parts.year}-${parts.month}-${parts.day}`;
  const start = Date.parse(`${day}T00:00:00+02:00`);
  return { day, start: new Date(start).toISOString(), end: new Date(start + 86400000).toISOString() };
}

function contactKeys(prospect, identity = null) {
  const keys = [['email', prospect.email_normalized]];
  const emailDomain = prospect.email_normalized?.split('@')[1];
  if (emailDomain && !PERSONAL_MAIL_DOMAINS.has(emailDomain)) keys.push(['domain', emailDomain]);
  if (identity?.domain_key) keys.push(['domain', identity.domain_key]);
  if (identity?.company_key) keys.push(['company', identity.company_key]);
  return [...new Map(keys.map(([type, value]) => [`${type}:${value}`, [type, value]])).values()];
}

function suppressionSql(keys, reasons) {
  return { condition: keys.map(() => '(key_type=? AND key_value=?)').join(' OR '), args: keys.flat(), reasons };
}
function event(db, { prospectId = null, runId = null, actor = 'system', type, entity, entityId, key, metadata = {}, at = now() }) {
  return sql(db, `INSERT INTO activity_events (id,prospect_id,agent_run_id,actor_type,event_type,entity_type,entity_id,occurred_at,idempotency_key,metadata_json)
    VALUES (?,?,?,?,?,?,?,?,?,?)`, uid(), prospectId, runId, actor, type, entity, entityId, at, key, meta(metadata));
}

export class Registry {
  constructor(db, { dailyLimit = 200, runLimit = 50, replyDailyLimit = 100, maxQuoteMinor = 100000000, catalog = {}, quoteFetch = fetch } = {}) {
    this.db = db;
    this.dailyLimit = dailyLimit;
    this.runLimit = runLimit;
    this.replyDailyLimit = replyDailyLimit;
    this.maxQuoteMinor = maxQuoteMinor;
    this.catalog = catalog;
    this.quoteFetch = quoteFetch;
    if (!Number.isSafeInteger(dailyLimit) || dailyLimit < 1 || dailyLimit > 1000) throw new Error('Invalid daily limit');
    if (!Number.isSafeInteger(runLimit) || runLimit < 1 || runLimit > 50) throw new Error('Invalid per-run limit');
    if (!Number.isSafeInteger(replyDailyLimit) || replyDailyLimit < 1 || replyDailyLimit > 1000) throw new Error('Invalid reply daily limit');
    if (!Number.isSafeInteger(maxQuoteMinor) || maxQuoteMinor < 1) throw new Error('Invalid quote limit');
  }

  async getEvent(key) { return this.db.prepare('SELECT * FROM activity_events WHERE idempotency_key=?').bind(key).first(); }
  async prospect(id) { return this.db.prepare('SELECT * FROM prospects WHERE id=?').bind(id).first(); }
  async prospectByEmail(email) { return this.db.prepare('SELECT * FROM prospects WHERE email_normalized=?').bind(normalizeEmail(email)).first(); }
  async run(id) { return this.db.prepare('SELECT * FROM agent_runs WHERE id=?').bind(id).first(); }
  async message(id) { return this.db.prepare('SELECT * FROM outreach_messages WHERE id=?').bind(id).first(); }
  async identity(id) { return this.db.prepare('SELECT * FROM prospect_business_keys WHERE prospect_id=?').bind(id).first(); }
  async suppression(prospect, reasons = ['human_owned', 'handoff']) {
    const keys = contactKeys(prospect, await this.identity(prospect.id));
    const query = suppressionSql(keys, reasons);
    return this.db.prepare(`SELECT reason FROM contact_suppression_keys WHERE active=1 AND reason IN (${reasons.map(() => '?').join(',')}) AND (${query.condition}) LIMIT 1`)
      .bind(...reasons, ...query.args).first();
  }
  async inboundForReply(id) {
    const message = await this.message(id);
    if (!message || message.direction !== 'inbound') return null;
    const recorded = await this.db.prepare("SELECT metadata_json FROM activity_events WHERE event_type='message.received' AND entity_id=?").bind(id).first();
    return { ...message, rfcMessageId: recorded ? JSON.parse(recorded.metadata_json).rfcMessageId ?? null : null };
  }
  async listAgents() { return (await this.db.prepare('SELECT * FROM outreach_agents ORDER BY id').all()).results; }

  async setAgentEnabled(id, enabled, key) {
    key = requiredText(key, 'idempotency key', 200);
    if (!AGENT_IDS.includes(id) || typeof enabled !== 'boolean') throw new Error('Invalid agent setting');
    if (await this.getEvent(key)) return this.db.prepare('SELECT * FROM outreach_agents WHERE id=?').bind(id).first();
    await this.db.batch([
      sql(this.db, 'UPDATE outreach_agents SET enabled=? WHERE id=?', enabled ? 1 : 0, id),
      event(this.db, { actor: 'admin', type: 'agent.enabled_changed', entity: 'outreach_agent', entityId: id, key, metadata: { enabled } }),
    ]);
    return this.db.prepare('SELECT * FROM outreach_agents WHERE id=?').bind(id).first();
  }

  async addProspect(data) {
    const key = requiredText(data.idempotencyKey, 'idempotency key', 200);
    const prior = await this.getEvent(key);
    if (prior) return this.prospect(prior.entity_id);
    const email = normalizeEmail(data.contactEmail);
    if (!email) throw new Error('Contact email required');
    const existing = await this.db.prepare('SELECT * FROM prospects WHERE email_normalized=?').bind(email).first();
    if (existing) return existing;
    const owner = data.ownerAgentId ?? 'lead-research';
    if (!AGENT_IDS.includes(owner)) throw new Error('Invalid owner');
    const id = uid(), at = now(), keys = businessKeys(data.companyName, data.websiteUrl);
    const observations = data.observations ? validateLeadObservations(data.observations) : [];
    const results = await this.db.batch([
      sql(this.db, `INSERT OR IGNORE INTO prospects (id,company_name,website_url,contact_name,contact_email,email_normalized,source,stage,owner_agent_id,created_at,updated_at,last_activity_at)
        VALUES (?,?,?,?,?,?,?,?,?,?,?,?)`, id, requiredText(data.companyName, 'company name', 200), data.websiteUrl ?? null, data.contactName ?? null, data.contactEmail, email, requiredText(data.source, 'source', 200), 'new', owner, at, at, at),
      sql(this.db, `INSERT INTO prospect_business_keys (prospect_id,company_key,domain_key)
        SELECT id,?,? FROM prospects WHERE id=?`, keys.companyKey, keys.domainKey, id),
      sql(this.db, `INSERT INTO activity_events (id,prospect_id,actor_type,event_type,entity_type,entity_id,occurred_at,idempotency_key,metadata_json)
        SELECT ?,id,'agent','prospect.created','prospect',id,?,?,? FROM prospects WHERE id=?`, uid(), at, key, meta({ source: data.source, observations }), id),
    ]);
    return results[0].meta.changes ? this.prospect(id) : this.db.prepare('SELECT * FROM prospects WHERE email_normalized=?').bind(email).first();
  }

  async changeStage(id, next, key, actor = 'agent') {
    key = requiredText(key, 'idempotency key', 200);
    if (await this.getEvent(key)) return this.prospect(id);
    const current = await this.prospect(id);
    if (!current) throw new Error('Prospect not found');
    validateStage(current.stage, next);
    if (next === 'qualified') {
      const latest = await this.db.prepare("SELECT metadata_json FROM activity_events WHERE prospect_id=? AND event_type IN ('prospect.created','prospect.observations_updated') ORDER BY rowid DESC LIMIT 1").bind(id).first();
      if (!latest || !JSON.parse(latest.metadata_json).observations?.length) throw new Error('Dated public observations required before qualification');
      validateLeadObservations(JSON.parse(latest.metadata_json).observations);
    }
    const at = now();
    const results = await this.db.batch([
      sql(this.db, 'UPDATE prospects SET stage=?,updated_at=?,last_activity_at=? WHERE id=? AND stage=?', next, at, at, id, current.stage),
      sql(this.db, `INSERT INTO activity_events (id,prospect_id,actor_type,event_type,entity_type,entity_id,occurred_at,idempotency_key,metadata_json)
        SELECT ?,?,?,'prospect.stage_changed','prospect',?,?,?,? WHERE changes()=1`, uid(), id, actor, id, at, key, meta({ from: current.stage, to: next })),
    ]);
    if (!results[0].meta.changes) throw new Error('Stage changed concurrently');
    return this.prospect(id);
  }

  async recordObservations(id, observations, key) {
    key = requiredText(key, 'idempotency key', 200);
    if (await this.getEvent(key)) return this.prospect(id);
    const prospect = await this.prospect(id);
    if (!prospect) throw new Error('Prospect not found');
    const validated = validateLeadObservations(observations), at = now();
    await this.db.batch([
      sql(this.db, 'UPDATE prospects SET updated_at=?,last_activity_at=? WHERE id=?', at, at, id),
      event(this.db, { prospectId: id, actor: 'agent', type: 'prospect.observations_updated', entity: 'prospect', entityId: id, key, at, metadata: { observations: validated } }),
    ]);
    return this.prospect(id);
  }

  async createRun(data) {
    const key = requiredText(data.idempotencyKey, 'idempotency key', 200);
    const prior = await this.getEvent(key);
    if (prior) return this.run(prior.entity_id);
    if (!AGENT_IDS.includes(data.agentId) || !['manual','scheduled','webhook'].includes(data.trigger)) throw new Error('Invalid run');
    const agent = await this.db.prepare('SELECT * FROM outreach_agents WHERE id=?').bind(data.agentId).first();
    if (!agent?.enabled) throw new Error('Agent disabled');
    const id = uid(), at = now();
    await this.db.batch([
      sql(this.db, `INSERT INTO agent_runs (id,agent_id,trigger,status,created_at) VALUES (?,?,?,'queued',?)`, id, data.agentId, data.trigger, at),
      event(this.db, { actor: 'scheduler', type: 'run.queued', entity: 'agent_run', entityId: id, key, at }),
    ]);
    return this.run(id);
  }

  async updateRun(id, status, key, externalRunId = null, errorSummary = null) {
    key = requiredText(key, 'idempotency key', 200);
    if (await this.getEvent(key)) return this.run(id);
    const run = await this.run(id);
    if (!run || !({ queued: ['running','cancelled'], running: ['succeeded','failed','cancelled'] }[run.status] ?? []).includes(status)) throw new Error('Invalid run transition');
    const at = now(), terminal = ['succeeded','failed','cancelled'].includes(status);
    const results = await this.db.batch([
      sql(this.db, `UPDATE agent_runs SET status=?,started_at=CASE WHEN ?='running' THEN ? ELSE started_at END,
        finished_at=CASE WHEN ?=1 THEN ? ELSE finished_at END,external_run_id=COALESCE(?,external_run_id),error_summary=? WHERE id=? AND status=?`,
        status, status, at, terminal ? 1 : 0, at, externalRunId, errorSummary, id, run.status),
      sql(this.db, `INSERT INTO activity_events (id,actor_type,event_type,entity_type,entity_id,occurred_at,idempotency_key,metadata_json)
        SELECT ?,'scheduler',?,'agent_run',?,?,?,? WHERE changes()=1`, uid(), `run.${status}`, id, at, key, meta({ externalRunId, errorSummary })),
    ]);
    if (!results[0].meta.changes) throw new Error('Run changed concurrently');
    return this.run(id);
  }

  async linkRunSession(id, externalRunId, key) {
    key = requiredText(key, 'idempotency key', 200);
    if (await this.getEvent(key)) return this.run(id);
    const run = await this.run(id);
    if (!run || run.status !== 'running' || run.external_run_id) throw new Error('Run is not waiting for a session');
    externalRunId = requiredText(externalRunId, 'external run ID', 255);
    const at = now();
    await this.db.batch([
      sql(this.db, `UPDATE agent_runs SET external_run_id=? WHERE id=? AND status='running' AND external_run_id IS NULL`, externalRunId, id),
      event(this.db, { actor: 'scheduler', type: 'run.session_linked', entity: 'agent_run', entityId: id, key, at, metadata: { externalRunId } }),
    ]);
    return this.run(id);
  }

  async recordInbound(data) {
    const key = requiredText(data.idempotencyKey, 'idempotency key', 200);
    const prior = await this.getEvent(key);
    if (prior) return this.message(prior.entity_id);
    const provider = requiredText(data.provider, 'provider', 80), providerId = requiredText(data.providerMessageId, 'provider message ID', 255);
    const duplicate = await this.db.prepare('SELECT * FROM outreach_messages WHERE provider=? AND provider_message_id=?').bind(provider, providerId).first();
    if (duplicate) return duplicate;
    const prospect = await this.prospect(data.prospectId);
    if (!prospect || normalizeEmail(data.fromEmail) !== prospect.email_normalized || normalizeEmail(data.toEmail) !== SENDER) throw new Error('Inbound address mismatch');
    const id = uid(), at = now(), occurred = data.occurredAt ? new Date(data.occurredAt).toISOString() : at;
    await this.db.batch([
      sql(this.db, `INSERT INTO outreach_messages (id,prospect_id,agent_run_id,direction,provider,provider_message_id,provider_thread_id,in_reply_to_id,from_email,to_email,subject,body_text,status,occurred_at,created_at)
        VALUES (?,?,?,'inbound',?,?,?,?,?,?,?,?,?,?,?)`, id, prospect.id, data.agentRunId ?? null, provider, providerId, data.providerThreadId ?? null, data.inReplyToId ?? null, prospect.email_normalized, SENDER, requiredText(data.subject, 'subject', 998), requiredText(data.bodyText, 'body', 100000), 'received', occurred, at),
      sql(this.db, `UPDATE prospects SET stage=CASE WHEN stage='contacted' THEN 'replied' ELSE stage END,updated_at=?,last_activity_at=? WHERE id=?`, at, occurred, prospect.id),
      event(this.db, { prospectId: prospect.id, runId: data.agentRunId ?? null, actor: 'contact', type: 'message.received', entity: 'outreach_message', entityId: id, key, at: occurred, metadata: { provider, providerId, rfcMessageId: data.rfcMessageId ?? null } }),
    ]);
    return this.message(id);
  }

  async optOut(data) {
    const email = normalizeEmail(data.email), key = requiredText(data.idempotencyKey, 'idempotency key', 200);
    if (await this.getEvent(key)) return { email, optedOut: true };
    const prospect = await this.db.prepare('SELECT id FROM prospects WHERE email_normalized=?').bind(email).first();
    const reason = requiredText(data.reason, 'reason', 500), at = now();
    await this.db.batch([
      sql(this.db, `INSERT OR IGNORE INTO outreach_opt_outs (email_normalized,reason,source_message_id,created_at) VALUES (?,?,?,?)`, email, reason, data.sourceMessageId ?? null, at),
      event(this.db, { prospectId: prospect?.id ?? null, actor: 'contact', type: 'contact.opted_out', entity: 'email', entityId: email, key, at, metadata: { reason, sourceMessageId: data.sourceMessageId ?? null } }),
    ]);
    return { email, optedOut: true };
  }

  async recordSentEvidence(data) {
    const email = normalizeEmail(data.recipientEmail);
    const providerId = requiredText(data.providerMessageId, 'provider message ID', 255);
    const key = `gmail:sent-observed:${providerId}:${email}`;
    const existing = await this.db.prepare('SELECT source FROM sent_mail_observations WHERE provider=? AND provider_message_id=? AND recipient_email=?')
      .bind('gmail', providerId, email).first();
    if (existing) return { source: existing.source, recipientEmail: email };
    const knownAgentMessage = await this.db.prepare('SELECT id FROM outreach_messages WHERE provider=? AND provider_message_id=? AND direction=?')
      .bind('gmail', providerId, 'outbound').first();
    const source = knownAgentMessage || AGENT_MESSAGE_ID.test(data.rfcMessageId ?? '') ? 'agent' : 'manual';
    const domain = email.split('@')[1];
    const matches = (await this.db.prepare(`SELECT p.*, b.company_key, b.domain_key FROM prospects p
      JOIN prospect_business_keys b ON b.prospect_id=p.id
      WHERE p.email_normalized=? OR (b.domain_key=? AND ? NOT IN (${[...PERSONAL_MAIL_DOMAINS].map(() => '?').join(',')}))`)
      .bind(email, domain, domain, ...PERSONAL_MAIL_DOMAINS).all()).results;
    const keys = new Map();
    keys.set(`email:${email}`, ['email', email]);
    if (!PERSONAL_MAIL_DOMAINS.has(domain)) keys.set(`domain:${domain}`, ['domain', domain]);
    for (const prospect of matches) {
      for (const [type, value] of contactKeys(prospect, prospect)) keys.set(`${type}:${value}`, [type, value]);
    }
    const at = now(), occurred = data.occurredAt ? new Date(data.occurredAt).toISOString() : at;
    const actions = [sql(this.db, `INSERT OR IGNORE INTO sent_mail_observations
      (provider,provider_message_id,recipient_email,rfc_message_id,source,occurred_at,observed_at) VALUES (?,?,?,?,?,?,?)`,
      'gmail', providerId, email, data.rfcMessageId ?? null, source, occurred, at)];
    for (const [type, value] of keys.values()) {
      for (const reason of source === 'manual' ? ['prior_sent', 'human_owned'] : ['prior_sent']) {
        actions.push(sql(this.db, `INSERT INTO contact_suppression_keys
          (key_type,key_value,reason,active,source_provider_message_id,created_at,updated_at) VALUES (?,?,?,1,?,?,?)
          ON CONFLICT(key_type,key_value,reason) DO UPDATE SET active=1,source_provider_message_id=excluded.source_provider_message_id,updated_at=excluded.updated_at`,
        type, value, reason, providerId, at, at));
      }
    }
    actions.push(event(this.db, { prospectId: matches[0]?.id ?? null, actor: source === 'manual' ? 'admin' : 'agent',
      type: source === 'manual' ? 'contact.human_owned' : 'mail.sent_observed', entity: 'email', entityId: email, key,
      at: occurred, metadata: { providerMessageId: providerId, source, matchedProspectIds: matches.map((item) => item.id) } }));
    await this.db.batch(actions);
    return { source, recipientEmail: email, matchedProspectIds: matches.map((item) => item.id) };
  }

  async recordDeliveryFailure(data) {
    const email = normalizeEmail(data.recipientEmail);
    const providerId = requiredText(data.providerMessageId, 'provider message ID', 255);
    const existing = await this.db.prepare('SELECT * FROM delivery_failures WHERE provider=? AND provider_message_id=? AND recipient_email=?')
      .bind('gmail', providerId, email).first();
    if (existing) return existing;
    const smtpStatus = requiredText(data.smtpStatus, 'SMTP status', 20);
    if (!/^[45]\d\d(?:\s+[245]\.\d\.\d)?$/.test(smtpStatus)) throw new Error('Invalid SMTP failure status');
    const diagnostic = requiredText(data.diagnostic, 'SMTP diagnostic', 500);
    const sent = await this.db.prepare('SELECT 1 FROM sent_mail_observations WHERE recipient_email=? LIMIT 1').bind(email).first();
    const outbound = await this.db.prepare("SELECT 1 FROM outreach_messages WHERE to_email=? AND direction='outbound' LIMIT 1").bind(email).first();
    if (!sent && !outbound) throw new Error('Delivery failure has no matching Sent mail');
    const classification = smtpStatus.startsWith('5') ? 'permanent_delivery_failure' : 'transient_delivery_failure';
    const at = now(), occurred = data.occurredAt ? new Date(data.occurredAt).toISOString() : at;
    const prospect = await this.prospectByEmail(email);
    const actions = [sql(this.db, `INSERT OR IGNORE INTO delivery_failures
      (provider,provider_message_id,recipient_email,smtp_status,diagnostic,classification,occurred_at,observed_at)
      VALUES (?,?,?,?,?,?,?,?)`, 'gmail', providerId, email, smtpStatus, diagnostic, classification, occurred, at)];
    if (classification === 'permanent_delivery_failure') actions.push(sql(this.db, `INSERT INTO contact_suppression_keys
      (key_type,key_value,reason,active,source_provider_message_id,created_at,updated_at)
      VALUES ('email',?,'permanent_delivery_failure',1,?,?,?)
      ON CONFLICT(key_type,key_value,reason) DO UPDATE SET active=1,source_provider_message_id=excluded.source_provider_message_id,updated_at=excluded.updated_at`,
    email, providerId, at, at));
    actions.push(event(this.db, { prospectId: prospect?.id ?? null, actor: 'provider', type: 'mail.delivery_failure',
      entity: 'email', entityId: email, key: `gmail:delivery-failure:${providerId}:${email}`, at: occurred,
      metadata: { smtpStatus, diagnostic, classification, providerMessageId: providerId } }));
    await this.db.batch(actions);
    return this.db.prepare('SELECT * FROM delivery_failures WHERE provider=? AND provider_message_id=? AND recipient_email=?')
      .bind('gmail', providerId, email).first();
  }

  async selfTest(key) {
    const row = await this.getEvent(requiredText(key, 'idempotency key', 200));
    return row?.event_type === 'mail.self_test_sent' ? { providerMessageId: row.entity_id, ...JSON.parse(row.metadata_json) } : null;
  }

  async recordSelfTest(data) {
    const key = requiredText(data.idempotencyKey, 'idempotency key', 200);
    const prior = await this.selfTest(key);
    if (prior) return prior;
    if (normalizeEmail(data.recipientEmail) !== SENDER) throw new Error('Self-test recipient must be Eugene');
    const providerMessageId = requiredText(data.providerMessageId, 'provider message ID', 255);
    const providerThreadId = requiredText(data.providerThreadId, 'provider thread ID', 255);
    await this.db.batch([event(this.db, { actor: 'admin', type: 'mail.self_test_sent', entity: 'gmail_message', entityId: providerMessageId,
      key, metadata: { providerThreadId, recipientEmail: SENDER } })]);
    return { providerMessageId, providerThreadId, recipientEmail: SENDER };
  }

  async requestHandoff(data) {
    const key = requiredText(data.idempotencyKey, 'idempotency key', 200);
    const prior = await this.getEvent(key);
    if (prior) return this.db.prepare('SELECT * FROM admin_handoffs WHERE id=?').bind(prior.entity_id).first();
    const prospect = await this.prospect(data.prospectId);
    const inbound = data.inboundMessageId ? await this.inboundForReply(data.inboundMessageId) : null;
    if (!prospect || (data.inboundMessageId && inbound?.prospect_id !== prospect.id)) throw new Error('Valid prospect and inbound message required');
    const reason = requiredText(data.reason, 'handoff reason', 1000);
    const id = uid(), at = now(), keys = contactKeys(prospect, await this.identity(prospect.id));
    const actions = [sql(this.db, `INSERT INTO admin_handoffs (id,prospect_id,inbound_message_id,reason,created_at)
      VALUES (?,?,?,?,?)`, id, prospect.id, data.inboundMessageId ?? null, reason, at)];
    for (const [type, value] of keys) actions.push(sql(this.db, `INSERT INTO contact_suppression_keys
      (key_type,key_value,reason,active,created_at,updated_at) VALUES (?,?,'handoff',1,?,?)
      ON CONFLICT(key_type,key_value,reason) DO UPDATE SET active=1,updated_at=excluded.updated_at`, type, value, at, at));
    actions.push(event(this.db, { prospectId: prospect.id, actor: 'system', type: 'contact.handoff_requested',
      entity: 'admin_handoff', entityId: id, key, at, metadata: { reason, inboundMessageId: data.inboundMessageId ?? null } }));
    await this.db.batch(actions);
    return this.db.prepare('SELECT * FROM admin_handoffs WHERE id=?').bind(id).first();
  }

  async releaseHumanControl(prospectId, key) {
    key = requiredText(key, 'idempotency key', 200);
    const prospect = await this.prospect(prospectId);
    if (!prospect) throw new Error('Prospect not found');
    if (await this.suppression(prospect, ['human_owned'])) throw new Error('Manual Eugene ownership is permanent');
    if (await this.getEvent(key)) return { prospectId, humanOwned: false };
    const at = now(), keys = contactKeys(prospect, await this.identity(prospectId));
    const actions = keys.map(([type, value]) => sql(this.db, `UPDATE contact_suppression_keys SET active=0,updated_at=?
      WHERE key_type=? AND key_value=? AND reason='handoff'`, at, type, value));
    actions.push(sql(this.db, `UPDATE admin_handoffs SET status='resolved',resolved_at=? WHERE prospect_id=? AND status='awaiting_admin'`, at, prospectId));
    actions.push(event(this.db, { prospectId, actor: 'admin', type: 'contact.agent_reenabled', entity: 'prospect', entityId: prospectId, key, at }));
    await this.db.batch(actions);
    return { prospectId, humanOwned: false };
  }

  async reserveOutbound(data) {
    const prospect = await this.prospect(data.prospectId);
    if (!prospect || !prospect.email_normalized) throw new Error('Prospect is not ready');
    const kind = data.kind;
    if (!['initial','reply'].includes(kind)) throw new Error('Outbound kind must be initial or reply');
    let inbound = null;
    if (kind === 'initial') {
      if (prospect.stage !== 'qualified') throw new Error('Initial mail requires a qualified prospect');
      const latest = await this.db.prepare("SELECT metadata_json FROM activity_events WHERE prospect_id=? AND event_type IN ('prospect.created','prospect.observations_updated') ORDER BY rowid DESC LIMIT 1").bind(prospect.id).first();
      validateLeadObservations(JSON.parse(latest?.metadata_json ?? '{}').observations);
    }
    if (kind === 'reply') {
      inbound = await this.inboundForReply(data.inboundMessageId);
      if (!inbound || inbound.prospect_id !== prospect.id || !['replied','quoted'].includes(prospect.stage)) throw new Error('Genuine inbound message required for a reply');
    }
    if (await this.db.prepare('SELECT 1 FROM outreach_opt_outs WHERE email_normalized=?').bind(prospect.email_normalized).first()) throw new Error('Contact opted out');
    const reasons = kind === 'initial' ? ['prior_sent', 'human_owned', 'handoff', 'permanent_delivery_failure'] : ['human_owned', 'handoff', 'permanent_delivery_failure'];
    if (await this.suppression(prospect, reasons)) throw new Error('Prior sent mail, human takeover, handoff, or delivery failure blocks outbound mail');
    const key = kind === 'initial' ? `outbound:initial:${prospect.id}` : `outbound:reply:${inbound.id}`;
    if (await this.getEvent(key)) return { idempotencyKey: key, status: 'reserved', kind };
    const at = now(), bounds = southAfricanDayBounds(at);
    const identity = await this.db.prepare('SELECT * FROM prospect_business_keys WHERE prospect_id=?').bind(prospect.id).first();
    if (!identity) throw new Error('Business identity missing');
    const suppression = suppressionSql(contactKeys(prospect, identity), reasons);
    const uniqueGuard = kind === 'initial'
      ? `AND NOT EXISTS (SELECT 1 FROM activity_events e JOIN prospect_business_keys b ON b.prospect_id=e.prospect_id
          WHERE e.event_type='outbound.initial_reserved' AND (b.company_key=? OR (b.domain_key IS NOT NULL AND b.domain_key=?)))`
      : `AND NOT EXISTS (SELECT 1 FROM activity_events WHERE event_type='outbound.reply_reserved' AND entity_id=?)`;
    const uniqueArg = kind === 'initial' ? [identity.company_key, identity.domain_key] : [inbound.id];
    const results = await this.db.batch([
      sql(this.db, `INSERT OR IGNORE INTO activity_events (id,prospect_id,agent_run_id,actor_type,event_type,entity_type,entity_id,occurred_at,idempotency_key,metadata_json)
        SELECT ?,?,?,'scheduler',?,'reservation',?,?,?,?
        WHERE NOT EXISTS (SELECT 1 FROM outreach_opt_outs WHERE email_normalized=?)
        AND NOT EXISTS (SELECT 1 FROM contact_suppression_keys WHERE active=1 AND reason IN (${reasons.map(() => '?').join(',')}) AND (${suppression.condition}))
        ${uniqueGuard}
        AND (SELECT COUNT(*) FROM activity_events WHERE event_type=? AND occurred_at >= ? AND occurred_at < ?) < ?
        AND (? IS NULL OR (SELECT COUNT(*) FROM activity_events WHERE event_type='outbound.initial_reserved' AND agent_run_id=?) < ?)`,
        uid(), prospect.id, data.agentRunId ?? null, kind === 'initial' ? 'outbound.initial_reserved' : 'outbound.reply_reserved', kind === 'initial' ? prospect.id : inbound.id,
        at, key, meta({ email: prospect.email_normalized, kind, requestKey: data.idempotencyKey ?? null }), prospect.email_normalized,
        ...reasons, ...suppression.args, ...uniqueArg, kind === 'initial' ? 'outbound.initial_reserved' : 'outbound.reply_reserved',
        bounds.start, bounds.end, kind === 'initial' ? this.dailyLimit : this.replyDailyLimit,
        data.agentRunId ?? null, data.agentRunId ?? null, this.runLimit),
    ]);
    if (!results[0].meta.changes) throw new Error('Daily limit, prior business contact, prior reply, or opt out blocks outbound mail');
    return { idempotencyKey: key, status: 'reserved', kind };
  }

  async markSending(key) {
    key = requiredText(key, 'idempotency key', 200);
    const reservation = await this.getEvent(key);
    if (!reservation || !['outbound.initial_reserved','outbound.reply_reserved'].includes(reservation.event_type)) throw new Error('Reservation missing');
    if (await this.getEvent(`${key}:sending`)) throw new Error('Mail already attempted');
    if (await this.getEvent(`${key}:cancelled`)) throw new Error('Reservation was cancelled');
    const prospect = await this.prospect(reservation.prospect_id);
    const reasons = reservation.event_type === 'outbound.initial_reserved' ? ['prior_sent','human_owned','handoff','permanent_delivery_failure'] : ['human_owned','handoff','permanent_delivery_failure'];
    if (await this.suppression(prospect, reasons)) throw new Error('Contact suppression blocks outbound mail');
    const suppression = suppressionSql(contactKeys(prospect, await this.identity(prospect.id)), reasons);
    const at = now();
    const results = await this.db.batch([
      sql(this.db, `INSERT OR IGNORE INTO activity_events (id,prospect_id,agent_run_id,actor_type,event_type,entity_type,entity_id,occurred_at,idempotency_key,metadata_json)
        SELECT ?,?,?,'scheduler','outbound.sending','reservation',?,?,?,? WHERE NOT EXISTS
          (SELECT 1 FROM outreach_opt_outs WHERE email_normalized=(SELECT email_normalized FROM prospects WHERE id=?))
        AND NOT EXISTS (SELECT 1 FROM contact_suppression_keys WHERE active=1 AND reason IN (${reasons.map(() => '?').join(',')}) AND (${suppression.condition}))
        AND NOT EXISTS (SELECT 1 FROM activity_events WHERE idempotency_key=?)`,
        uid(), reservation.prospect_id, reservation.agent_run_id, key, at, `${key}:sending`, '{}', reservation.prospect_id,
        ...reasons, ...suppression.args, `${key}:cancelled`),
    ]);
    if (!results[0].meta.changes) throw new Error('Contact suppression blocks outbound mail');
    return { idempotencyKey: key, status: 'sending' };
  }

  async finishOutbound(data) {
    const key = requiredText(data.idempotencyKey, 'idempotency key', 200);
    const prior = await this.getEvent(`${key}:sent`);
    if (prior) return this.message(prior.entity_id);
    const reservation = await this.getEvent(key), sending = await this.getEvent(`${key}:sending`);
    if (!reservation || !sending || await this.getEvent(`${key}:uncertain`)) throw new Error('Mail attempt is not active');
    const prospect = await this.prospect(reservation.prospect_id);
    const provider = requiredText(data.provider, 'provider', 80), providerId = requiredText(data.providerMessageId, 'provider message ID', 255);
    const id = uid(), at = now();
    await this.db.batch([
      sql(this.db, `INSERT INTO outreach_messages (id,prospect_id,agent_run_id,direction,provider,provider_message_id,provider_thread_id,in_reply_to_id,from_email,to_email,subject,body_text,status,occurred_at,created_at)
        VALUES (?,?,?,'outbound',?,?,?,?,?,?,?,?,?,?,?)`, id, prospect.id, reservation.agent_run_id, provider, providerId, data.providerThreadId ?? null, data.inReplyToId ?? null, SENDER, prospect.email_normalized, requiredText(data.subject, 'subject', 998), requiredText(data.bodyText, 'body', 100000), 'sent', at, at),
      sql(this.db, `UPDATE prospects SET stage=CASE WHEN stage='qualified' THEN 'contacted' ELSE stage END,updated_at=?,last_activity_at=? WHERE id=?`, at, at, prospect.id),
      event(this.db, { prospectId: prospect.id, runId: reservation.agent_run_id, actor: 'agent', type: 'message.sent', entity: 'outreach_message', entityId: id, key: `${key}:sent`, at, metadata: { provider, providerId, reservationKey: key, reservationType: reservation.event_type } }),
    ]);
    return this.message(id);
  }

  async markUncertain(key, reason) {
    key = requiredText(key, 'idempotency key', 200);
    if (await this.getEvent(`${key}:uncertain`)) return;
    const reservation = await this.getEvent(key);
    if (!reservation || !await this.getEvent(`${key}:sending`) || await this.getEvent(`${key}:sent`)) throw new Error('Mail attempt is not active');
    await this.db.batch([event(this.db, { prospectId: reservation.prospect_id, runId: reservation.agent_run_id, actor: 'scheduler', type: 'outbound.uncertain', entity: 'reservation', entityId: key, key: `${key}:uncertain`, metadata: { reason: requiredText(reason, 'reason', 500) } })]);
  }

  async quote(id) {
    const row = await this.db.prepare('SELECT * FROM quotes WHERE id=?').bind(id).first();
    if (!row) return null;
    const created = await this.db.prepare("SELECT metadata_json FROM activity_events WHERE event_type='quote.created' AND entity_id=?").bind(id).first();
    const approved = await this.db.prepare("SELECT id FROM activity_events WHERE event_type='quote.approved' AND entity_id=?").bind(id).first();
    const updated = await this.db.prepare("SELECT metadata_json FROM activity_events WHERE event_type='quote.context_updated' AND entity_id=? ORDER BY rowid DESC LIMIT 1").bind(id).first();
    const items = (await this.db.prepare('SELECT * FROM quote_items WHERE quote_id=? ORDER BY position').bind(id).all()).results;
    const initial = JSON.parse(created.metadata_json);
    return { ...row, items, context: updated ? JSON.parse(updated.metadata_json) : initial.context,
      reviewStatus: approved ? 'approved' : initial.needsReview ? 'pending' : 'approved' };
  }

  async createQuote(data) {
    const key = requiredText(data.idempotencyKey, 'idempotency key', 200);
    const prior = await this.getEvent(key);
    if (prior) return this.quote(prior.entity_id);
    const prospect = await this.prospect(data.prospectId);
    if (!prospect || !['replied','quoted'].includes(prospect.stage)) throw new Error('Prospect is not ready for a quote');
    const currency = requiredText(data.currency, 'currency', 3).toUpperCase();
    if (currency !== 'ZAR') throw new Error('Quotes must use ZAR');
    let priced = priceQuote(data.items, this.catalog[currency] ?? {}, this.maxQuoteMinor);
    const benchmarks = data.autoMarketQuote ? await verifyQuoteBenchmarks(data.benchmarks, this.quoteFetch) : data.benchmarks;
    const context = assessQuoteContext(data.scope, benchmarks, data.assumptions);
    if (data.autoMarketQuote) {
      const serviceWords = {
        'website-redesign': /\b(?:website|web site|web design|web development)\b/i,
        'whatsapp-ai-agent': /\bwhatsapp\b/i,
        'website-ai-chat': /\b(?:chatbot|chat widget|ai chat)\b/i,
        'android-ios-app': /\b(?:app|android|ios|mobile)\b/i,
      };
      if (!serviceWords[context.scope.serviceCode] ||
        benchmarks.some((item) => !serviceWords[context.scope.serviceCode].test(item.comparableScope))) {
        throw new Error('Market evidence does not match the quoted service');
      }
      const inbound = await this.inboundForReply(data.inboundMessageId);
      if (!inbound || inbound.prospect_id !== prospect.id) throw new Error('Automatic quote needs its genuine inbound message');
      const inboundText = inbound.body_text.replace(/\s+/g, ' ').toLowerCase();
      for (const field of SERVICE_SCOPE_FIELDS[context.scope.serviceCode] ?? []) {
        const excerpt = requiredText(data.scopeEvidence?.[field], `client scope evidence for ${field}`, 500)
          .replace(/\s+/g, ' ').toLowerCase();
        if (excerpt.length < 5 || !inboundText.includes(excerpt)) {
          throw new Error(`Client did not confirm quote scope field ${field}`);
        }
      }
      if (!context.complete || data.items.length !== 1 || data.items[0].quantity !== 1 ||
        data.items[0].code !== context.scope.serviceCode) throw new Error('Automatic quote needs complete, matching scope');
      const midpoints = benchmarks.map((item) => (item.minAmountMinor + item.maxAmountMinor) / 2);
      if (Math.max(...midpoints) > Math.min(...midpoints) * 2) throw new Error('Market prices differ too much for automatic quoting');
      const amountMinor = Math.round(midpoints.reduce((sum, value) => sum + value, 0) / midpoints.length);
      if (!Number.isSafeInteger(amountMinor) || amountMinor < 10000 || amountMinor > this.maxQuoteMinor) {
        throw new Error('Automatic quote exceeds the permitted ZAR range');
      }
      priced = { amountMinor, needsReview: false,
        items: [{ ...priced.items[0], unitPriceMinor: amountMinor, lineTotalMinor: amountMinor, pricingSource: 'verified_market' }] };
    }
    const id = uid(), at = now(), expires = new Date(data.expiresAt).toISOString();
    if (expires <= at) throw new Error('Quote expiry must be in the future');
    await this.db.batch([
      sql(this.db, `INSERT INTO quotes (id,prospect_id,agent_run_id,quote_number,currency,amount_minor,status,issued_at,expires_at,created_at,updated_at)
        VALUES (?,?,?,?,?,?,'draft',?,?,?,?)`, id, prospect.id, data.agentRunId ?? null, requiredText(data.quoteNumber, 'quote number', 80), currency, priced.amountMinor, at, expires, at, at),
      ...priced.items.map((item, position) => sql(this.db, `INSERT INTO quote_items (id,quote_id,position,service_code,description,quantity,unit_price_minor,line_total_minor,pricing_source)
        VALUES (?,?,?,?,?,?,?,?,?)`, uid(), id, position, item.code, item.description, item.quantity, item.unitPriceMinor, item.lineTotalMinor, item.pricingSource)),
      event(this.db, { prospectId: prospect.id, runId: data.agentRunId ?? null, actor: 'agent', type: 'quote.created', entity: 'quote', entityId: id, key, at,
        metadata: { needsReview: priced.needsReview || !context.complete, context } }),
    ]);
    return this.quote(id);
  }

  async approveQuote(id, prices, key, reviewer) {
    key = requiredText(key, 'idempotency key', 200);
    if (await this.getEvent(key)) return this.quote(id);
    const quote = await this.quote(id);
    if (!quote || quote.status !== 'draft' || quote.reviewStatus !== 'pending') throw new Error('Quote is not pending review');
    if (!assessQuoteContext(quote.context.scope, quote.context.benchmarks, quote.context.assumptions).complete) throw new Error('Quote scope or market evidence needs clarification');
    const approved = approveQuoteItems(quote.items, prices, this.maxQuoteMinor);
    const at = now();
    await this.db.batch([
      ...approved.items.map((item) => sql(this.db, `UPDATE quote_items SET unit_price_minor=?,line_total_minor=?,pricing_source='review' WHERE id=?`, item.unitPriceMinor, item.lineTotalMinor, item.id)),
      sql(this.db, `UPDATE quotes SET amount_minor=?,updated_at=? WHERE id=? AND status='draft'`, approved.amountMinor, at, id),
      event(this.db, { prospectId: quote.prospect_id, actor: 'admin', type: 'quote.approved', entity: 'quote', entityId: id, key, at, metadata: { amountMinor: approved.amountMinor, reviewer: requiredText(reviewer, 'reviewer', 320) } }),
    ]);
    return this.quote(id);
  }

  async updateQuoteContext(id, data) {
    const key = requiredText(data.idempotencyKey, 'idempotency key', 200);
    if (await this.getEvent(key)) return this.quote(id);
    const quote = await this.quote(id);
    if (!quote || quote.status !== 'draft' || quote.reviewStatus !== 'pending') throw new Error('Quote is not pending review');
    const context = assessQuoteContext(data.scope, data.benchmarks, data.assumptions);
    await this.db.batch([event(this.db, { prospectId: quote.prospect_id, actor: 'agent', type: 'quote.context_updated', entity: 'quote', entityId: id, key, metadata: context })]);
    return this.quote(id);
  }

  async storeQuotePdf(id, pdfBase64, sha256Hex, key) {
    key = requiredText(key, 'idempotency key', 200);
    if (await this.getEvent(key)) return this.quote(id);
    const quote = await this.quote(id);
    if (!quote || quote.status !== 'draft' || quote.reviewStatus !== 'approved') throw new Error('Quote needs approval');
    if (typeof pdfBase64 !== 'string' || pdfBase64.length < 140 || pdfBase64.length > 1000000 || !/^[A-Za-z0-9+/]+={0,2}$/.test(pdfBase64)) throw new Error('Invalid PDF');
    if (!/^[a-f0-9]{64}$/.test(sha256Hex)) throw new Error('Invalid PDF hash');
    const binary = atob(pdfBase64);
    if (!binary.startsWith('%PDF-1.4')) throw new Error('Invalid PDF header');
    const bytes = Uint8Array.from(binary, (char) => char.charCodeAt(0));
    const digest = [...new Uint8Array(await crypto.subtle.digest('SHA-256', bytes))].map((part) => part.toString(16).padStart(2, '0')).join('');
    if (digest !== sha256Hex) throw new Error('PDF hash mismatch');
    await this.db.batch([
      sql(this.db, `INSERT INTO quote_documents (quote_id,filename,content_type,pdf_base64,sha256_hex,created_at) VALUES (?,?,'application/pdf',?,?,?)`, id, `${quote.quote_number}.pdf`, pdfBase64, sha256Hex, now()),
      event(this.db, { prospectId: quote.prospect_id, actor: 'scheduler', type: 'quote.pdf_stored', entity: 'quote', entityId: id, key, metadata: { sha256Hex, filename: `${quote.quote_number}.pdf` } }),
    ]);
    return this.quote(id);
  }

  async pdf(id) {
    return this.db.prepare('SELECT * FROM quote_documents WHERE quote_id=?').bind(id).first();
  }

  async mailboxCursor(email = SENDER) {
    return this.db.prepare('SELECT * FROM mailbox_cursors WHERE mailbox_email=?').bind(email).first();
  }

  async updateMailboxCursor(historyId, key, email = SENDER) {
    key = requiredText(key, 'idempotency key', 200);
    if (await this.getEvent(key)) return this.mailboxCursor(email);
    historyId = requiredText(historyId, 'history ID', 80);
    if (!/^\d+$/.test(historyId)) throw new Error('Invalid history ID');
    const at = now();
    await this.db.batch([
      sql(this.db, `INSERT INTO mailbox_cursors (mailbox_email,history_id,updated_at) VALUES (?,?,?)
        ON CONFLICT(mailbox_email) DO UPDATE SET history_id=excluded.history_id,updated_at=excluded.updated_at`, email, historyId, at),
      event(this.db, { actor: 'scheduler', type: 'mailbox.cursor_updated', entity: 'mailbox', entityId: email, key, at, metadata: { historyId } }),
    ]);
    return this.mailboxCursor(email);
  }

  async markQuoteSent(id, messageId, key) {
    key = requiredText(key, 'idempotency key', 200);
    if (await this.getEvent(key)) return this.quote(id);
    const quote = await this.quote(id);
    if (!quote || quote.status !== 'draft' || quote.reviewStatus !== 'approved' || !await this.pdf(id)) throw new Error('Approved PDF required');
    const message = await this.message(messageId);
    if (!message || message.prospect_id !== quote.prospect_id || message.direction !== 'outbound' || message.status !== 'sent') throw new Error('Sent message required');
    const sentEvent = await this.db.prepare("SELECT metadata_json FROM activity_events WHERE event_type='message.sent' AND entity_id=?").bind(messageId).first();
    if (!sentEvent || JSON.parse(sentEvent.metadata_json).reservationType !== 'outbound.reply_reserved') throw new Error('Quote must answer a genuine inbound message');
    const at = now();
    await this.db.batch([
      sql(this.db, `UPDATE quotes SET status='sent',sent_at=?,updated_at=? WHERE id=? AND status='draft'`, at, at, id),
      sql(this.db, `UPDATE prospects SET stage='quoted',updated_at=?,last_activity_at=? WHERE id=? AND stage='replied'`, at, at, quote.prospect_id),
      event(this.db, { prospectId: quote.prospect_id, actor: 'scheduler', type: 'quote.sent', entity: 'quote', entityId: id, key, at, metadata: { messageId } }),
    ]);
    return this.quote(id);
  }

  async listProspects(limit = 50) {
    if (!Number.isSafeInteger(limit) || limit < 1 || limit > 1000) throw new Error('Invalid prospect list limit');
    return (await this.db.prepare('SELECT * FROM prospects ORDER BY COALESCE(last_activity_at,created_at) DESC LIMIT ?').bind(limit).all()).results;
  }
  async pendingReplies(limit = 100) {
    if (!Number.isSafeInteger(limit) || limit < 1 || limit > 100) throw new Error('Invalid pending reply limit');
    return (await this.db.prepare(`SELECT m.* FROM outreach_messages m
      WHERE m.direction='inbound' AND m.status='received'
        AND NOT EXISTS (SELECT 1 FROM outreach_opt_outs o WHERE o.email_normalized=m.from_email)
        AND NOT EXISTS (SELECT 1 FROM activity_events e WHERE e.event_type='outbound.reply_reserved' AND e.entity_id=m.id)
        AND NOT EXISTS (SELECT 1 FROM admin_handoffs h WHERE h.inbound_message_id=m.id)
      ORDER BY m.occurred_at ASC LIMIT ?`).bind(limit).all()).results;
  }
  async listRuns(limit = 50) { return (await this.db.prepare('SELECT * FROM agent_runs ORDER BY created_at DESC LIMIT ?').bind(limit).all()).results; }
  async timeline(id, limit = 100) { return (await this.db.prepare('SELECT * FROM activity_events WHERE prospect_id=? ORDER BY occurred_at DESC LIMIT ?').bind(id, limit).all()).results; }
}
