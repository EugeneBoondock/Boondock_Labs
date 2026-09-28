PRAGMA foreign_keys = ON;

CREATE TABLE IF NOT EXISTS prospect_business_keys (
  prospect_id TEXT PRIMARY KEY REFERENCES prospects(id),
  company_key TEXT NOT NULL,
  domain_key TEXT
);
CREATE INDEX IF NOT EXISTS prospect_business_company ON prospect_business_keys(company_key);
CREATE INDEX IF NOT EXISTS prospect_business_domain ON prospect_business_keys(domain_key) WHERE domain_key IS NOT NULL;

CREATE UNIQUE INDEX IF NOT EXISTS outreach_one_initial_per_prospect
  ON activity_events(prospect_id) WHERE event_type = 'outbound.initial_reserved';
CREATE UNIQUE INDEX IF NOT EXISTS outreach_one_reply_per_inbound
  ON activity_events(entity_id) WHERE event_type = 'outbound.reply_reserved';
