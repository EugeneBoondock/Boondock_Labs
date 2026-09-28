PRAGMA foreign_keys = ON;

CREATE TABLE IF NOT EXISTS sent_mail_observations (
  provider TEXT NOT NULL,
  provider_message_id TEXT NOT NULL,
  recipient_email TEXT NOT NULL,
  rfc_message_id TEXT,
  source TEXT NOT NULL CHECK (source IN ('agent', 'manual')),
  occurred_at TEXT NOT NULL,
  observed_at TEXT NOT NULL,
  PRIMARY KEY (provider, provider_message_id, recipient_email)
);
CREATE INDEX IF NOT EXISTS sent_mail_recipient ON sent_mail_observations(recipient_email, occurred_at DESC);

CREATE TABLE IF NOT EXISTS contact_suppression_keys (
  key_type TEXT NOT NULL CHECK (key_type IN ('email', 'domain', 'company')),
  key_value TEXT NOT NULL,
  reason TEXT NOT NULL CHECK (reason IN ('prior_sent', 'human_owned', 'handoff', 'permanent_delivery_failure')),
  active INTEGER NOT NULL DEFAULT 1 CHECK (active IN (0, 1)),
  source_provider_message_id TEXT,
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL,
  PRIMARY KEY (key_type, key_value, reason)
);
CREATE INDEX IF NOT EXISTS contact_suppression_active ON contact_suppression_keys(reason, key_type, key_value) WHERE active = 1;

CREATE TABLE IF NOT EXISTS admin_handoffs (
  id TEXT PRIMARY KEY,
  prospect_id TEXT NOT NULL REFERENCES prospects(id),
  inbound_message_id TEXT REFERENCES outreach_messages(id),
  reason TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'awaiting_admin' CHECK (status IN ('awaiting_admin', 'resolved')),
  created_at TEXT NOT NULL,
  resolved_at TEXT,
  UNIQUE (inbound_message_id)
);
