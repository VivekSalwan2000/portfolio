import { ArrowUpRight, GitCommit, GithubLogo, Star } from "@phosphor-icons/react/ssr";
import { getRepoData } from "@/lib/github";
import { Reveal } from "./reveal";

const LANG_BAR_COLORS = ["bg-accent", "bg-accent-strong", "bg-fg/40", "bg-fg/25", "bg-fg/15"];

function formatUpdated(iso: string | null): string | null {
  if (!iso) return null;
  return new Intl.DateTimeFormat("en-US", { month: "short", year: "numeric" }).format(new Date(iso));
}

function ciLabel(ci: { status: string; conclusion: string | null } | null): {
  label: string;
  tone: "pass" | "fail" | "pending";
} | null {
  if (!ci) return null;
  if (ci.status !== "completed") return { label: "CI running", tone: "pending" };
  if (ci.conclusion === "success") return { label: "CI passing", tone: "pass" };
  if (ci.conclusion) return { label: "CI failing", tone: "fail" };
  return null;
}

export async function RepoCard({
  repo,
  fallbackDescription,
  fallbackStack,
}: {
  repo: string;
  fallbackDescription: string;
  fallbackStack: string[];
}) {
  const data = await getRepoData(repo);

  if (!data.ok) {
    return (
      <Reveal>
        <a
          href={data.htmlUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="shine-card group block rounded-2xl border border-border bg-card p-6 hover:border-accent transition-all motion-safe:hover:-translate-y-0.5 active:scale-[0.99] motion-safe:active:translate-y-0"
        >
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-center gap-2 min-w-0">
              <GithubLogo size={16} className="text-muted-fg shrink-0" />
              <span className="font-sans text-sm truncate">
                {data.owner}/{data.name}
              </span>
            </div>
            <ArrowUpRight
              size={16}
              className="text-muted-fg group-hover:text-accent group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all shrink-0"
            />
          </div>
          <p className="mt-3 text-sm text-muted-fg leading-relaxed">{fallbackDescription}</p>
          <div className="mt-5 flex flex-wrap gap-1.5">
            {fallbackStack.map((tech) => (
              <span
                key={tech}
                className="font-sans text-[10.5px] px-2.5 py-1 rounded-full border border-border text-muted-fg"
              >
                {tech}
              </span>
            ))}
          </div>
        </a>
      </Reveal>
    );
  }

  const updated = formatUpdated(data.updatedAt);
  const ci = ciLabel(data.ci);
  const topLanguages = data.languages.slice(0, 5);
  const otherPercent = data.languages.slice(5).reduce((sum, l) => sum + l.percent, 0);

  return (
    <Reveal>
      <a
        href={data.htmlUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="shine-card group block rounded-2xl border border-border bg-card p-6 hover:border-accent transition-all motion-safe:hover:-translate-y-0.5 active:scale-[0.99] motion-safe:active:translate-y-0"
      >
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-2 min-w-0">
            <GithubLogo size={16} className="text-muted-fg shrink-0" />
            <span className="font-sans text-sm truncate">
              {data.owner}/{data.name}
            </span>
          </div>
          <ArrowUpRight
            size={16}
            className="text-muted-fg group-hover:text-accent group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all shrink-0"
          />
        </div>

        <p className="mt-3 text-sm text-muted-fg leading-relaxed min-h-[2.5em]">
          {data.description || fallbackDescription}
        </p>

        {topLanguages.length > 0 && (
          <div className="mt-5">
            <div className="flex h-1.5 w-full overflow-hidden rounded-full bg-border">
              {topLanguages.map((lang, i) => (
                <div
                  key={lang.name}
                  className={LANG_BAR_COLORS[i % LANG_BAR_COLORS.length]}
                  style={{ width: `${lang.percent}%` }}
                  title={`${lang.name} · ${lang.percent.toFixed(1)}%`}
                />
              ))}
              {otherPercent > 0 && (
                <div className="bg-border-strong" style={{ width: `${otherPercent}%` }} title="Other" />
              )}
            </div>
            <div className="mt-2 flex flex-wrap gap-x-3 gap-y-1">
              {topLanguages.map((lang) => (
                <span key={lang.name} className="font-sans text-[10.5px] text-muted-fg">
                  {lang.name} <span className="text-fg/70">{lang.percent.toFixed(0)}%</span>
                </span>
              ))}
            </div>
          </div>
        )}

        <div className="mt-5 flex flex-wrap items-center gap-x-4 gap-y-1.5 font-sans text-[11px] text-muted-fg">
          {data.commitCount !== null && (
            <span className="inline-flex items-center gap-1.5">
              <GitCommit size={13} />
              {data.commitCount} commits
            </span>
          )}
          {updated && <span>Updated {updated}</span>}
          {data.stars > 0 && (
            <span className="inline-flex items-center gap-1.5">
              <Star size={13} weight="fill" className="text-accent" />
              {data.stars}
            </span>
          )}
          {ci && (
            <span
              className={`inline-flex items-center gap-1.5 ${
                ci.tone === "pass" ? "text-accent" : ci.tone === "fail" ? "text-danger" : "text-muted-fg"
              }`}
            >
              <span
                className={`w-1.5 h-1.5 rounded-full ${
                  ci.tone === "pass" ? "bg-accent" : ci.tone === "fail" ? "bg-danger" : "bg-muted-fg"
                }`}
              />
              {ci.label}
            </span>
          )}
        </div>
      </a>
    </Reveal>
  );
}
