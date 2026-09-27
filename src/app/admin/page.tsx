import { DashboardView } from "@/components/admin/DashboardView";
import { verifyAdminAccess } from "@/lib/admin/access";
import {
  type Dashboard,
  getOutreachDatabase,
  loadDashboard,
} from "@/lib/admin/dashboard";
import { headers } from "next/headers";
import Link from "next/link";
import styles from "./admin.module.css";

export const dynamic = "force-dynamic";

function State({
  title,
  description,
  signIn = false,
}: { title: string; description: string; signIn?: boolean }) {
  return (
    <main className={`${styles.shell} ${styles.stateShell}`}>
      <div className={styles.stateCard}>
        <span className={styles.mark}>
          B<span>.</span>
        </span>
        <p className={styles.eyebrow}>Private workspace</p>
        <h1>{title}</h1>
        <p>{description}</p>
        {signIn && (
          <a
            className={styles.button}
            href="/cdn-cgi/access/login?redirect_url=%2Fadmin"
          >
            Sign in with Cloudflare Access
          </a>
        )}
        <Link className={styles.backLink} href="/">
          Return to site
        </Link>
      </div>
    </main>
  );
}

export default async function AdminPage() {
  const requestHeaders = await headers();
  const access = await verifyAdminAccess(
    requestHeaders.get("cf-access-jwt-assertion"),
  );
  if (!access.ok) {
    if (access.reason === "unavailable")
      return (
        <State
          title="Admin access unavailable"
          description="Cloudflare Access settings are required before this workspace can open."
        />
      );
    return (
      <State
        title="Administrator sign-in"
        description="This workspace is reserved for the Boondock Labs administrator."
        signIn
      />
    );
  }

  const db = getOutreachDatabase(access.env);
  if (!db)
    return (
      <State
        title="Outreach data unavailable"
        description="The outreach database binding has not been connected to this Worker."
      />
    );

  let data: Dashboard;
  try {
    data = await loadDashboard(db);
  } catch {
    return (
      <State
        title="Outreach data unavailable"
        description="The outreach database could not be read. Check the D1 binding and registry schema."
      />
    );
  }

  return (
    <main className={styles.shell}>
      <header className={styles.header}>
        <Link className={styles.brand} href="/" aria-label="Boondock Labs home">
          <span className={styles.mark}>
            B<span>.</span>
          </span>
          <span>BOONDOCK LABS</span>
        </Link>
        <div className={styles.headerRight}>
          <span className={styles.privateBadge}>Private workspace</span>
          <span>{access.email}</span>
        </div>
      </header>
      <div className={styles.content}>
        <div className={styles.hero}>
          <div>
            <p className={styles.eyebrow}>
              Outreach operations / Live D1 records
            </p>
            <h1>
              Outreach overview<span>.</span>
            </h1>
            <p>
              Prospects, conversations, quotes and GPT-6 Luna activity in one
              place.
            </p>
          </div>
          <a className={styles.button} href="/admin">
            Refresh activity ↗
          </a>
        </div>
        <nav className={styles.nav} aria-label="Dashboard sections">
          <a href="#activity">Activity</a>
          <a href="#runs">Agent runs</a>
          <a href="#prospects">Prospects</a>
          <a href="#messages">Emails</a>
          <a href="#quotes">Quotes</a>
        </nav>
        <DashboardView data={data} />
        <footer className={styles.footer}>
          Boondock Labs · Administrator workspace · Times shown in South Africa
          Standard Time
        </footer>
      </div>
    </main>
  );
}
