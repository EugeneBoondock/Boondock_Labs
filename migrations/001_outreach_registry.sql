PRAGMA foreign_keys = ON;

CREATE TABLE IF NOT EXISTS outreach_agents (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  model TEXT NOT NULL,
  role TEXT NOT NULL,
  enabled INTEGER NOT NULL DEFAULT 0 CHECK (enabled IN (0, 1)),
  created_at TEXT NOT NULL
);

INSERT OR IGNORE INTO outreach_agents (id, name, model, role, enabled, created_at) VALUES
  ('lead-research', 'Lead research', 'gpt-6-luna', 'lead_research', 0, '2026-09-27T00:00:00.000Z'),
  ('outreach', 'Outreach', 'gpt-6-luna', 'outreach', 0, '2026-09-27T00:00:00.000Z'),
  ('reply-quotation', 'Reply and quotation', 'gpt-6-luna', 'reply_quotation', 0, '2026-09-27T00:00:00.000Z');

CREATE TABLE IF NOT EXISTS prospects (
  id TEXT PRIMARY KEY,
  company_name TEXT NOT NULL,
  website_url TEXT,
  contact_name TEXT,
  contact_email TEXT,
  email_normalized TEXT,
  source TEXT NOT NULL,
  stage TEXT NOT NULL DEFAULT 'new' CHECK (stage IN ('new','qualified','contacted','replied','quoted','won','lost')),
  owner_agent_id TEXT REFERENCES outreach_agents(id),
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL,
  last_activity_at TEXT
);
CREATE UNIQUE INDEX IF NOT EXISTS prospects_email_unique ON prospects(email_normalized) WHERE email_normalized IS NOT NULL;
CREATE INDEX IF NOT EXISTS prospects_stage_activity ON prospects(stage, last_activity_at DESC);
CREATE INDEX IF NOT EXISTS prospects_owner_stage ON prospects(owner_agent_id, stage);

CREATE TABLE IF NOT EXISTS agent_runs (
  id TEXT PRIMARY KEY,
  agent_id TEXT NOT NULL REFERENCES outreach_agents(id),
  trigger TEXT NOT NULL CHECK (trigger IN ('manual','scheduled','webhook')),
  status TEXT NOT NULL CHECK (status IN ('queued','running','succeeded','failed','cancelled')),
  started_at TEXT,
  finished_at TEXT,
  external_run_id TEXT,
  error_summary TEXT,
  created_at TEXT NOT NULL
);
CREATE INDEX IF NOT EXISTS agent_runs_recent ON agent_runs(created_at DESC);

CREATE TABLE IF NOT EXISTS outreach_messages (
  id TEXT PRIMARY KEY,
  prospect_id TEXT NOT NULL REFERENCES prospects(id),
  agent_run_id TEXT REFERENCES agent_runs(id),
  direction TEXT NOT NULL CHECK (direction IN ('outbound','inbound')),
  provider TEXT NOT NULL,
  provider_message_id TEXT,
  provider_thread_id TEXT,
  in_reply_to_id TEXT,
  from_email TEXT NOT NULL,
  to_email TEXT NOT NULL,
  subject TEXT NOT NULL,
  body_text TEXT NOT NULL,
  status TEXT NOT NULL,
  occurred_at TEXT NOT NULL,
  created_at TEXT NOT NULL
);
CREATE UNIQUE INDEX IF NOT EXISTS outreach_messages_provider_id_unique ON outreach_messages(provider, provider_message_id) WHERE provider_message_id IS NOT NULL;
CREATE INDEX IF NOT EXISTS outreach_messages_prospect_recent ON outreach_messages(prospect_id, occurred_at DESC);

CREATE TABLE IF NOT EXISTS quotes (
  id TEXT PRIMARY KEY,
  prospect_id TEXT NOT NULL REFERENCES prospects(id),
  agent_run_id TEXT REFERENCES agent_runs(id),
  quote_number TEXT NOT NULL UNIQUE,
  currency TEXT NOT NULL,
  amount_minor INTEGER NOT NULL CHECK (amount_minor >= 0),
  status TEXT NOT NULL CHECK (status IN ('draft','sent','viewed','accepted','declined','expired')),
  issued_at TEXT,
  sent_at TEXT,
  expires_at TEXT,
  decided_at TEXT,
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL
);
CREATE INDEX IF NOT EXISTS quotes_prospect_recent ON quotes(prospect_id, created_at DESC);

CREATE TABLE IF NOT EXISTS activity_events (
  id TEXT PRIMARY KEY,
  prospect_id TEXT REFERENCES prospects(id),
  agent_run_id TEXT REFERENCES agent_runs(id),
  actor_type TEXT NOT NULL,
  event_type TEXT NOT NULL,
  entity_type TEXT NOT NULL,
  entity_id TEXT NOT NULL,
  occurred_at TEXT NOT NULL,
  idempotency_key TEXT NOT NULL UNIQUE,
  metadata_json TEXT NOT NULL DEFAULT '{}'
);
CREATE INDEX IF NOT EXISTS activity_events_recent ON activity_events(occurred_at DESC);
CREATE INDEX IF NOT EXISTS activity_events_prospect ON activity_events(prospect_id, occurred_at DESC);
