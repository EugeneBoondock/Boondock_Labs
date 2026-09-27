import type { AdminEnvironment } from "./access";

type Statement = { all<T>(): Promise<{ results: T[] }> };
type Database = { prepare(query: string): Statement };

export type Prospect = {
  id: string;
  company_name: string;
  website_url: string | null;
  contact_name: string | null;
  contact_email: string | null;
  source: string | null;
  stage: string;
  owner_agent_name: string | null;
  created_at: string;
  last_activity_at: string | null;
};
export type Message = {
  id: string;
  company_name: string;
  direction: string;
  provider: string;
  from_email: string;
  to_email: string;
  subject: string | null;
  preview: string | null;
  status: string;
  occurred_at: string;
};
export type Run = {
  id: string;
  agent_name: string;
  model: string;
  trigger: string;
  status: string;
  started_at: string | null;
  finished_at: string | null;
  error_summary: string | null;
};
export type Quote = {
  id: string;
  company_name: string;
  quote_number: string;
  currency: string;
  amount_minor: number;
  status: string;
  issued_at: string | null;
  sent_at: string | null;
  decided_at: string | null;
};
export type Activity = {
  id: string;
  company_name: string | null;
  actor_type: string;
  event_type: string;
  entity_type: string;
  occurred_at: string;
};
export type Counts = {
  prospects: number;
  outbound: number;
  replies: number;
  quotes_sent: number;
  quotes_accepted: number;
  active_runs: number;
};
export type Dashboard = {
  counts: Counts;
  prospects: Prospect[];
  messages: Message[];
  runs: Run[];
  quotes: Quote[];
  activity: Activity[];
};

export function getOutreachDatabase(env: AdminEnvironment): Database | null {
  const candidate = env.OUTREACH_DB as Partial<Database> | undefined;
  return candidate && typeof candidate.prepare === "function"
    ? (candidate as Database)
    : null;
}

export async function loadDashboard(db: Database): Promise<Dashboard> {
  const [countRows, prospects, messages, runs, quotes, activity] =
    await Promise.all([
      db
        .prepare(`SELECT
      (SELECT COUNT(*) FROM prospects) AS prospects,
      (SELECT COUNT(*) FROM outreach_messages WHERE direction = 'outbound') AS outbound,
      (SELECT COUNT(*) FROM outreach_messages WHERE direction = 'inbound') AS replies,
      (SELECT COUNT(*) FROM quotes WHERE sent_at IS NOT NULL) AS quotes_sent,
      (SELECT COUNT(*) FROM quotes WHERE status = 'accepted') AS quotes_accepted,
      (SELECT COUNT(*) FROM agent_runs WHERE status IN ('queued', 'running')) AS active_runs`)
        .all<Counts>(),
      db
        .prepare(`SELECT p.id, p.company_name, p.website_url, p.contact_name, p.contact_email,
      p.source, p.stage, a.name AS owner_agent_name, p.created_at, p.last_activity_at
      FROM prospects p LEFT JOIN outreach_agents a ON a.id = p.owner_agent_id
      ORDER BY COALESCE(p.last_activity_at, p.updated_at) DESC LIMIT 60`)
        .all<Prospect>(),
      db
        .prepare(`SELECT m.id, p.company_name, m.direction, m.provider, m.from_email,
      m.to_email, m.subject, substr(m.body_text, 1, 500) AS preview, m.status, m.occurred_at
      FROM outreach_messages m JOIN prospects p ON p.id = m.prospect_id
      ORDER BY m.occurred_at DESC LIMIT 40`)
        .all<Message>(),
      db
        .prepare(`SELECT r.id, a.name AS agent_name, a.model, r.trigger, r.status,
      r.started_at, r.finished_at, r.error_summary
      FROM agent_runs r JOIN outreach_agents a ON a.id = r.agent_id
      ORDER BY r.created_at DESC LIMIT 20`)
        .all<Run>(),
      db
        .prepare(`SELECT q.id, p.company_name, q.quote_number, q.currency, q.amount_minor,
      q.status, q.issued_at, q.sent_at, q.decided_at
      FROM quotes q JOIN prospects p ON p.id = q.prospect_id
      ORDER BY q.created_at DESC LIMIT 30`)
        .all<Quote>(),
      db
        .prepare(`SELECT e.id, p.company_name, e.actor_type, e.event_type, e.entity_type, e.occurred_at
      FROM activity_events e LEFT JOIN prospects p ON p.id = e.prospect_id
      ORDER BY e.occurred_at DESC LIMIT 40`)
        .all<Activity>(),
    ]);

  return {
    counts: countRows.results[0] ?? {
      prospects: 0,
      outbound: 0,
      replies: 0,
      quotes_sent: 0,
      quotes_accepted: 0,
      active_runs: 0,
    },
    prospects: prospects.results,
    messages: messages.results,
    runs: runs.results,
    quotes: quotes.results,
    activity: activity.results,
  };
}
