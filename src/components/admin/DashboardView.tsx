import styles from "@/app/admin/admin.module.css";
import type { Dashboard } from "@/lib/admin/dashboard";

function dateTime(value: string | null | undefined): string {
  if (!value) return "Not recorded";
  const normalized = /^\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}$/.test(value)
    ? `${value.replace(" ", "T")}Z`
    : value;
  const date = new Date(normalized);
  if (Number.isNaN(date.getTime())) return value;
  return new Intl.DateTimeFormat("en-ZA", {
    dateStyle: "medium",
    timeStyle: "short",
    timeZone: "Africa/Johannesburg",
  }).format(date);
}

function amount(minor: number, currency: string): string {
  try {
    return new Intl.NumberFormat("en-ZA", {
      style: "currency",
      currency,
    }).format(minor / 100);
  } catch {
    return `${currency} ${(minor / 100).toFixed(2)}`;
  }
}

function websiteLink(value: string | null) {
  if (!value) return null;
  try {
    const url = new URL(value);
    if (url.protocol !== "https:" && url.protocol !== "http:") return null;
    return (
      <a href={url.href} target="_blank" rel="noopener noreferrer">
        Website ↗
      </a>
    );
  } catch {
    return null;
  }
}

function Status({ value }: { value: string }) {
  return (
    <span className={styles.status} data-status={value}>
      {value.replaceAll("_", " ")}
    </span>
  );
}

function Section({
  id,
  eyebrow,
  title,
  count,
  children,
}: {
  id: string;
  eyebrow: string;
  title: string;
  count: number;
  children: React.ReactNode;
}) {
  return (
    <section id={id} className={styles.section} aria-labelledby={`${id}-title`}>
      <div className={styles.sectionHeading}>
        <div>
          <p className={styles.eyebrow}>{eyebrow}</p>
          <h2 id={`${id}-title`}>{title}</h2>
        </div>
        <span className={styles.count}>{count} shown</span>
      </div>
      {children}
    </section>
  );
}

function Empty({ label }: { label: string }) {
  return <p className={styles.empty}>No {label} recorded yet.</p>;
}

export function DashboardView({ data }: { data: Dashboard }) {
  const metrics = [
    {
      label: "Prospects",
      value: data.counts.prospects,
      note: "In the registry",
    },
    {
      label: "Emails sent",
      value: data.counts.outbound,
      note: "Outbound messages",
    },
    { label: "Replies", value: data.counts.replies, note: "Inbound messages" },
    {
      label: "Quotes sent",
      value: data.counts.quotes_sent,
      note: "Includes later decisions",
    },
    {
      label: "Quotes accepted",
      value: data.counts.quotes_accepted,
      note: "Recorded decisions",
    },
    {
      label: "Active runs",
      value: data.counts.active_runs,
      note: "Queued or running",
    },
  ];

  return (
    <>
      <div className={styles.stats} aria-label="Outreach totals">
        {metrics.map((metric) => (
          <div className={styles.stat} key={metric.label}>
            <span>{metric.label}</span>
            <strong>{metric.value.toLocaleString("en-ZA")}</strong>
            <small>{metric.note}</small>
          </div>
        ))}
      </div>

      <div className={styles.grid}>
        <Section
          id="activity"
          eyebrow="Event log"
          title="Recent activity"
          count={data.activity.length}
        >
          {data.activity.length ? (
            <ol className={styles.activityList}>
              {data.activity.map((event) => (
                <li key={event.id}>
                  <span className={styles.activityDot} aria-hidden="true" />
                  <div>
                    <strong>{event.event_type.replaceAll("_", " ")}</strong>
                    <p>
                      {event.company_name ?? event.entity_type} ·{" "}
                      {event.actor_type}
                    </p>
                  </div>
                  <time>{dateTime(event.occurred_at)}</time>
                </li>
              ))}
            </ol>
          ) : (
            <Empty label="activity" />
          )}
        </Section>

        <Section
          id="runs"
          eyebrow="Agent operations"
          title="GPT-6 Luna runs"
          count={data.runs.length}
        >
          {data.runs.length ? (
            <div className={styles.stack}>
              {data.runs.map((run) => (
                <article className={styles.stackItem} key={run.id}>
                  <div className={styles.rowTop}>
                    <strong>{run.agent_name}</strong>
                    <Status value={run.status} />
                  </div>
                  <p>
                    {run.model} · {run.trigger}
                  </p>
                  <small>
                    Started {dateTime(run.started_at)} · Finished{" "}
                    {dateTime(run.finished_at)}
                  </small>
                  {run.error_summary && (
                    <p className={styles.errorText}>{run.error_summary}</p>
                  )}
                </article>
              ))}
            </div>
          ) : (
            <Empty label="agent runs" />
          )}
        </Section>
      </div>

      <Section
        id="prospects"
        eyebrow="Pipeline"
        title="Prospect registry"
        count={data.prospects.length}
      >
        {data.prospects.length ? (
          <div className={styles.tableScroll}>
            <table>
              <thead>
                <tr>
                  <th>Company</th>
                  <th>Contact</th>
                  <th>Stage</th>
                  <th>Owner</th>
                  <th>Source</th>
                  <th>Last activity</th>
                </tr>
              </thead>
              <tbody>
                {data.prospects.map((prospect) => (
                  <tr key={prospect.id}>
                    <td>
                      <strong>{prospect.company_name}</strong>
                      <span className={styles.cellSub}>
                        {websiteLink(prospect.website_url)}
                      </span>
                    </td>
                    <td>
                      {prospect.contact_name ?? "Not listed"}
                      <span className={styles.cellSub}>
                        {prospect.contact_email ?? ""}
                      </span>
                    </td>
                    <td>
                      <Status value={prospect.stage} />
                    </td>
                    <td>{prospect.owner_agent_name ?? "Unassigned"}</td>
                    <td>{prospect.source ?? "Not listed"}</td>
                    <td>{dateTime(prospect.last_activity_at)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <Empty label="prospects" />
        )}
      </Section>

      <Section
        id="messages"
        eyebrow="Conversations"
        title="Emails and replies"
        count={data.messages.length}
      >
        {data.messages.length ? (
          <div className={styles.messageGrid}>
            {data.messages.map((message) => (
              <article className={styles.message} key={message.id}>
                <div className={styles.rowTop}>
                  <span
                    className={styles.direction}
                    data-direction={message.direction}
                  >
                    {message.direction}
                  </span>
                  <time>{dateTime(message.occurred_at)}</time>
                </div>
                <h3>{message.subject || "No subject"}</h3>
                <p className={styles.messageCompany}>
                  {message.company_name} · {message.provider}
                </p>
                <p className={styles.messageAddress}>
                  {message.from_email} → {message.to_email}
                </p>
                {message.preview && (
                  <p className={styles.preview}>{message.preview}</p>
                )}
                <Status value={message.status} />
              </article>
            ))}
          </div>
        ) : (
          <Empty label="messages" />
        )}
      </Section>

      <Section
        id="quotes"
        eyebrow="Commercial"
        title="Quotes"
        count={data.quotes.length}
      >
        {data.quotes.length ? (
          <div className={styles.tableScroll}>
            <table>
              <thead>
                <tr>
                  <th>Quote</th>
                  <th>Company</th>
                  <th>Amount</th>
                  <th>Status</th>
                  <th>Issued</th>
                  <th>Sent</th>
                  <th>Decision</th>
                </tr>
              </thead>
              <tbody>
                {data.quotes.map((quote) => (
                  <tr key={quote.id}>
                    <td>
                      <strong>{quote.quote_number}</strong>
                    </td>
                    <td>{quote.company_name}</td>
                    <td>{amount(quote.amount_minor, quote.currency)}</td>
                    <td>
                      <Status value={quote.status} />
                    </td>
                    <td>{dateTime(quote.issued_at)}</td>
                    <td>{dateTime(quote.sent_at)}</td>
                    <td>{dateTime(quote.decided_at)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <Empty label="quotes" />
        )}
      </Section>
    </>
  );
}
