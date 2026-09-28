PRAGMA foreign_keys = ON;

CREATE TABLE IF NOT EXISTS outreach_opt_outs (
  email_normalized TEXT PRIMARY KEY,
  reason TEXT NOT NULL,
  source_message_id TEXT,
  created_at TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS quote_items (
  id TEXT PRIMARY KEY,
  quote_id TEXT NOT NULL REFERENCES quotes(id),
  position INTEGER NOT NULL,
  service_code TEXT NOT NULL,
  description TEXT NOT NULL,
  quantity INTEGER NOT NULL CHECK (quantity > 0),
  unit_price_minor INTEGER,
  line_total_minor INTEGER,
  pricing_source TEXT NOT NULL CHECK (pricing_source IN ('catalog','review')),
  UNIQUE (quote_id, position)
);

CREATE TABLE IF NOT EXISTS quote_documents (
  quote_id TEXT PRIMARY KEY REFERENCES quotes(id),
  filename TEXT NOT NULL,
  content_type TEXT NOT NULL CHECK (content_type = 'application/pdf'),
  pdf_base64 TEXT NOT NULL,
  sha256_hex TEXT NOT NULL,
  created_at TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS mailbox_cursors (
  mailbox_email TEXT PRIMARY KEY,
  history_id TEXT NOT NULL,
  updated_at TEXT NOT NULL
);
