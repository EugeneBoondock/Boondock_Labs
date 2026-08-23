"use client";

import { ArrowUpRight, GitCommitHorizontal } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import styles from "./home.module.css";

type ContributionDay = {
  date: string;
  count: number;
  level: number;
};

type Repository = {
  name: string;
  description: string | null;
  language: string | null;
  url: string;
  updatedAt: string;
};

type ActivityPayload = {
  days: ContributionDay[];
  total: number;
  streak: number;
  repos: Repository[];
};

const EMPTY_DAYS = Array.from({ length: 371 }, (_, index) => ({
  date: `loading-${index}`,
  count: 0,
  level: 0,
}));

function formatUpdated(date: string) {
  const days = Math.max(
    0,
    Math.floor((Date.now() - new Date(date).getTime()) / 86_400_000),
  );
  if (days === 0) return "Updated today";
  if (days === 1) return "Updated yesterday";
  return `Updated ${days} days ago`;
}

export default function GitHubActivity() {
  const [data, setData] = useState<ActivityPayload | null>(null);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    const controller = new AbortController();
    fetch("/api/github-contributions", { signal: controller.signal })
      .then((response) => {
        if (!response.ok) throw new Error("GitHub activity request failed");
        return response.json() as Promise<ActivityPayload>;
      })
      .then(setData)
      .catch((error: unknown) => {
        if (error instanceof Error && error.name !== "AbortError")
          setFailed(true);
      });
    return () => controller.abort();
  }, []);

  const days = data?.days.length ? data.days : EMPTY_DAYS;
  const monthLabels = useMemo(() => {
    if (!data?.days.length) return [];
    return data.days.filter((day) => day.date.endsWith("-01")).slice(-12);
  }, [data]);

  return (
    <section id="github" className={styles.githubSection}>
      <div className={styles.sectionFrame}>
        <div className={styles.githubTopline}>
          <p className={styles.eyebrow}>GitHub activity</p>
          <a
            href="https://github.com/EugeneBoondock"
            target="_blank"
            rel="noreferrer"
            className={styles.textLink}
          >
            View GitHub profile <ArrowUpRight size={15} />
          </a>
        </div>

        <div className={styles.githubHeader}>
          <div>
            <h2>@EugeneBoondock</h2>
            <p>The founder’s public work, measured over the last year.</p>
          </div>
          <div className={styles.githubStats} aria-live="polite">
            <div>
              <strong>{data ? data.total.toLocaleString() : "…"}</strong>
              <span>contributions</span>
            </div>
            <div>
              <strong>{data ? data.streak : "…"}</strong>
              <span>day streak</span>
            </div>
          </div>
        </div>

        <div className={styles.activityScroller}>
          <div className={styles.monthLabels} aria-hidden="true">
            {monthLabels.map((day) => (
              <span key={day.date}>
                {new Intl.DateTimeFormat("en", { month: "short" }).format(
                  new Date(`${day.date}T00:00:00`),
                )}
              </span>
            ))}
          </div>
          <div className={styles.contributionGrid}>
            {days.map((day) => (
              <button
                type="button"
                key={day.date}
                className={styles.contributionCell}
                data-level={day.level}
                tabIndex={data ? 0 : -1}
                aria-label={
                  data
                    ? `${day.count} ${day.count === 1 ? "contribution" : "contributions"} on ${new Intl.DateTimeFormat(
                        "en",
                        {
                          dateStyle: "long",
                        },
                      ).format(new Date(`${day.date}T00:00:00`))}`
                    : "Loading activity"
                }
                title={data ? `${day.date}: ${day.count} contributions` : ""}
              />
            ))}
          </div>
        </div>

        {failed ? (
          <p className={styles.activityError}>
            Live activity is taking longer to load. The GitHub profile link is
            ready.
          </p>
        ) : null}

        <div className={styles.repoList}>
          <p className={styles.eyebrow}>Recently updated repositories</p>
          {(data?.repos ?? []).map((repo) => (
            <a key={repo.name} href={repo.url} target="_blank" rel="noreferrer">
              <GitCommitHorizontal size={16} />
              <strong>{repo.name}</strong>
              <span>{repo.description ?? "Public repository"}</span>
              <small>
                {repo.language ?? "Code"} · {formatUpdated(repo.updatedAt)}
              </small>
              <ArrowUpRight size={15} />
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
