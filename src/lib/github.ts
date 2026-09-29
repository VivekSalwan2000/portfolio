const REVALIDATE_SECONDS = 60 * 60 * 24; // daily

export type RepoLanguage = { name: string; percent: number };

export type RepoData = {
  ok: true;
  owner: string;
  name: string;
  description: string | null;
  stars: number;
  updatedAt: string | null;
  languages: RepoLanguage[];
  commitCount: number | null;
  ci: { status: string; conclusion: string | null } | null;
  htmlUrl: string;
};

export type RepoFetchResult = RepoData | { ok: false; owner: string; name: string; htmlUrl: string };

function parseLastPageFromLink(link: string | null): number | null {
  if (!link) return null;
  const match = link.match(/[?&]page=(\d+)>;\s*rel="last"/);
  return match ? parseInt(match[1], 10) : null;
}

async function getCommitCount(owner: string, name: string): Promise<number | null> {
  try {
    const res = await fetch(`https://api.github.com/repos/${owner}/${name}/commits?per_page=1`, {
      next: { revalidate: REVALIDATE_SECONDS },
      headers: { Accept: "application/vnd.github+json" },
    });
    if (!res.ok) return null;
    const fromLink = parseLastPageFromLink(res.headers.get("link"));
    if (fromLink !== null) return fromLink;
    const commits = await res.json();
    return Array.isArray(commits) ? commits.length : null;
  } catch {
    return null;
  }
}

async function getCiStatus(owner: string, name: string): Promise<RepoData["ci"]> {
  try {
    const res = await fetch(
      `https://api.github.com/repos/${owner}/${name}/actions/runs?per_page=1`,
      { next: { revalidate: REVALIDATE_SECONDS }, headers: { Accept: "application/vnd.github+json" } }
    );
    if (!res.ok) return null;
    const json = await res.json();
    const run = json?.workflow_runs?.[0];
    if (!run) return null;
    return { status: run.status, conclusion: run.conclusion ?? null };
  } catch {
    return null;
  }
}

function toLanguagePercents(bytes: Record<string, number>): RepoLanguage[] {
  const total = Object.values(bytes).reduce((sum, n) => sum + n, 0);
  if (total <= 0) return [];
  return Object.entries(bytes)
    .map(([name, n]) => ({ name, percent: (n / total) * 100 }))
    .sort((a, b) => b.percent - a.percent);
}

/**
 * Fetches repo metadata, language breakdown, commit count, and CI status from
 * the public GitHub REST API at build time (no token required). Any failure
 * (rate limit, network error, missing repo) degrades to `{ ok: false }` so
 * the caller can render a static fallback — this must never break the build.
 */
export async function getRepoData(fullName: string): Promise<RepoFetchResult> {
  const [owner, name] = fullName.split("/");
  const htmlUrl = `https://github.com/${fullName}`;

  try {
    const [repoRes, langRes] = await Promise.all([
      fetch(`https://api.github.com/repos/${fullName}`, {
        next: { revalidate: REVALIDATE_SECONDS },
        headers: { Accept: "application/vnd.github+json" },
      }),
      fetch(`https://api.github.com/repos/${fullName}/languages`, {
        next: { revalidate: REVALIDATE_SECONDS },
        headers: { Accept: "application/vnd.github+json" },
      }),
    ]);

    if (!repoRes.ok) throw new Error(`GitHub API ${repoRes.status} for ${fullName}`);

    const repoJson = await repoRes.json();
    const langJson = langRes.ok ? await langRes.json() : {};

    const [commitCount, ci] = await Promise.all([getCommitCount(owner, name), getCiStatus(owner, name)]);

    return {
      ok: true,
      owner,
      name,
      description: repoJson.description ?? null,
      stars: repoJson.stargazers_count ?? 0,
      updatedAt: repoJson.pushed_at ?? repoJson.updated_at ?? null,
      languages: toLanguagePercents(langJson),
      commitCount,
      ci,
      htmlUrl: repoJson.html_url ?? htmlUrl,
    };
  } catch {
    return { ok: false, owner, name, htmlUrl };
  }
}
