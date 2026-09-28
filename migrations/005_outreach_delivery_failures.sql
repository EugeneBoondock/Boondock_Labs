PRAGMA foreign_keys = ON;

CREATE TABLE IF NOT EXISTS delivery_failures (
  provider TEXT NOT NULL,
  provider_message_id TEXT NOT NULL,
  recipient_email TEXT NOT NULL,
  smtp_status TEXT NOT NULL,
  diagnostic TEXT NOT NULL,
  classification TEXT NOT NULL CHECK (classification IN ('permanent_delivery_failure', 'transient_delivery_failure')),
  occurred_at TEXT NOT NULL,
  observed_at TEXT NOT NULL,
  PRIMARY KEY (provider, provider_message_id, recipient_email)
);
CREATE INDEX IF NOT EXISTS delivery_failures_recipient ON delivery_failures(recipient_email, occurred_at DESC);
