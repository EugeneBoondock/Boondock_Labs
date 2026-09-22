import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";
export const revalidate = 0;

type ContributionDay = {
  date: string;
  count: number;
  level: number;
};

function parseContributionDays(html: string): ContributionDay[] {
  const days: ContributionDay[] = [];
  const cellPattern =
    /data-date="([^"]+)"[^>]*data-level="(\d+)"[^>]*><\/td>\s*<tool-tip[^>]*>([\s\S]*?)<\/tool-tip>/g;

  for (const match of html.matchAll(cellPattern)) {
    const text = match[3].replace(/<[^>]+>/g, " ").trim();
    const countMatch = text.match(/^(\d[\d,]*) contributions?/i);
    days.push({
      date: match[1],
      level: Number(match[2]),
      count: countMatch ? Number(countMatch[1].replace(/,/g, "")) : 0,
    });
  }
  return days;
}

function calculateStreak(days: ContributionDay[], today: string) {
  const byDate = new Map(days.map((day) => [day.date, day.count]));
  const cursor = new Date(`${today}T12:00:00Z`);
  if ((byDate.get(today) ?? 0) === 0)
    cursor.setUTCDate(cursor.getUTCDate() - 1);
  let streak = 0;

  while (streak < 366) {
    const key = cursor.toISOString().slice(0, 10);
    if ((byDate.get(key) ?? 0) === 0) break;
    streak += 1;
    cursor.setUTCDate(cursor.getUTCDate() - 1);
  }
  return streak;
}

export async function GET() {
  const now = new Date();
  const currentYear = now.getUTCFullYear();
  const githubToken = process.env.GITHUB_TOKEN?.trim();
  const headers = {
    Accept: "text/html",
    "User-Agent": "Boondock-Labs-Portfolio",
  };
  const apiHeaders = {
    Accept: "application/vnd.github+json",
    "User-Agent": "Boondock-Labs-Portfolio",
    "X-GitHub-Api-Version": "2022-11-28",
  };

  try {
    const [
      previousResponse,
      currentResponse,
      publicReposResponse,
      authenticatedReposResponse,
    ] =
      await Promise.all([
        fetch(
          `https://github.com/users/EugeneBoondock/contributions?y=${currentYear - 1}`,
          { headers, next: { revalidate } },
        ),
        fetch(
          `https://github.com/users/EugeneBoondock/contributions?y=${currentYear}`,
          { headers, next: { revalidate } },
        ),
        fetch(
          "https://api.github.com/users/EugeneBoondock/repos?sort=pushed&direction=desc&per_page=8",
          {
            headers: apiHeaders,
            next: { revalidate },
          },
        ),
        githubToken
          ? fetch(
              "https://api.github.com/user/repos?visibility=all&affiliation=owner,collaborator,organization_member&sort=pushed&direction=desc&per_page=100",
              {
                headers: {
                  ...apiHeaders,
                  Authorization: `Bearer ${githubToken}`,
                },
                next: { revalidate },
              },
            )
          : Promise.resolve(null),
      ]);

    if (!previousResponse.ok || !currentResponse.ok) {
      throw new Error("GitHub contribution source returned an error");
    }

    const merged = [
      ...parseContributionDays(await previousResponse.text()),
      ...parseContributionDays(await currentResponse.text()),
    ];
    const unique = new Map(merged.map((day) => [day.date, day]));
    const end = new Date(
      Date.UTC(currentYear, now.getUTCMonth(), now.getUTCDate()),
    );
    const start = new Date(end);
    start.setUTCDate(start.getUTCDate() - 364);
    const startKey = start.toISOString().slice(0, 10);
    const endKey = end.toISOString().slice(0, 10);
    const days = [...unique.values()]
      .filter((day) => day.date >= startKey && day.date <= endKey)
      .sort((a, b) => a.date.localeCompare(b.date));

    const publicRepositories = publicReposResponse.ok
      ? ((await publicReposResponse.json()) as Array<Record<string, unknown>>)
      : [];
    const authenticatedRepositories = authenticatedReposResponse?.ok
      ? ((await authenticatedReposResponse.json()) as Array<
          Record<string, unknown>
        >)
      : [];
    const privateRepositoryCount = authenticatedRepositories.filter(
      (repo) => repo.private === true,
    ).length;
    const privateRepoAccess = privateRepositoryCount > 0;

    console.info("[github-contributions] authenticated repository access", {
      tokenConfigured: Boolean(githubToken),
      responseStatus: authenticatedReposResponse?.status ?? null,
      repositoryCount: authenticatedRepositories.length,
      privateRepositoryCount,
    });
    const repositoriesByName = new Map<string, Record<string, unknown>>();

    for (const repo of [
      ...publicRepositories,
      ...authenticatedRepositories,
    ]) {
      const fullName = typeof repo.full_name === "string" ? repo.full_name : "";
      if (repo.fork === true || !fullName) {
        continue;
      }

      repositoriesByName.set(fullName.toLowerCase(), repo);
    }

    const repositories = [...repositoriesByName.values()]
      .sort((a, b) =>
        String(b.pushed_at ?? "").localeCompare(String(a.pushed_at ?? "")),
      )
      .slice(0, 5)
      .map((repo) => ({
        name: String(repo.name),
        description:
          typeof repo.description === "string" ? repo.description : null,
        language: typeof repo.language === "string" ? repo.language : null,
        url: String(repo.html_url),
        updatedAt: String(repo.pushed_at),
        private: repo.private === true,
      }));

    return NextResponse.json({
      days,
      total: days.reduce((sum, day) => sum + day.count, 0),
      streak: calculateStreak(days, endKey),
      repos: repositories,
      privateRepoAccess,
    });
  } catch {
    return NextResponse.json(
      { error: "GitHub activity is currently unavailable" },
      { status: 503 },
    );
  }
}
