import { CaretDown } from "@phosphor-icons/react/ssr";
import type { CaseStudyProject } from "@/lib/data";
import { Reveal } from "./reveal";
import { RepoCard } from "./repo-card";

const STEPS: { key: keyof Pick<CaseStudyProject, "problem" | "decision" | "result">; label: string }[] = [
  { key: "problem", label: "Problem" },
  { key: "decision", label: "Key decision" },
  { key: "result", label: "Result" },
];

export function ProjectPlate({ project, reverse = false }: { project: CaseStudyProject; reverse?: boolean }) {
  return (
    <Reveal className="shine-card group overflow-hidden rounded-[2rem] border border-border bg-card transition-all duration-300 hover:-translate-y-1 hover:border-border-strong hover:shadow-2xl hover:shadow-black/20">
      <div className="relative aspect-video w-full overflow-hidden">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={project.image} alt={`${project.name} cover art`} className="h-full w-full object-cover" />
        <div className="case-scrim" aria-hidden="true" />

        <div className="absolute inset-x-0 bottom-0 p-6 sm:p-8">
          <h3 className="font-serif font-semibold text-3xl tracking-tight text-balance text-[var(--hero-fg)] sm:text-4xl">
            {project.name}
          </h3>
          <p className="mt-1 font-serif italic text-base text-[var(--hero-fg-80)] sm:text-lg">
            {project.tagline}
          </p>
          <span className="mt-4 inline-flex items-center rounded-full border border-[var(--hero-border)] px-3 py-1.5 font-sans text-[11px] tracking-widest uppercase text-[var(--hero-fg-80)]">
            {project.status}
          </span>
        </div>
      </div>

      <div className="border-t border-border">
        <div
          aria-hidden="true"
          className="hidden items-center justify-center gap-1.5 py-4 font-sans text-[10px] tracking-[0.3em] uppercase text-muted-fg opacity-100 transition-opacity duration-300 motion-reduce:transition-none lg:flex lg:group-hover:opacity-0 lg:group-focus-within:opacity-0"
        >
          <span>Hover for the full case study</span>
          <CaretDown size={12} />
        </div>

        {/* Collapsed to zero height on desktop until hovered (or focused,
            for keyboard users) — grid-template-rows animates smoothly to
            "auto" without knowing the content's height up front, and
            overflow-hidden on the child keeps it clipped while collapsed.
            Mobile has no hover to trigger this, so it just stays open. */}
        <div className="grid grid-rows-[1fr] transition-[grid-template-rows] duration-500 ease-out motion-reduce:transition-none lg:grid-rows-[0fr] lg:group-hover:grid-rows-[1fr] lg:group-focus-within:grid-rows-[1fr]">
          <div className="overflow-hidden">
            <div
              className={`grid gap-8 p-8 sm:p-10 [&>*]:min-w-0 lg:grid-cols-[1fr_1fr] lg:gap-14 lg:items-start ${
                reverse ? "lg:[&>*:first-child]:order-2" : ""
              }`}
            >
              <div>
                <dl className="space-y-4">
                  {STEPS.map(({ key, label }) => (
                    <div key={key} className="border-l-2 border-border pl-4">
                      <dt className="font-sans text-[10px] tracking-[0.2em] uppercase text-muted-fg">{label}</dt>
                      <dd className="mt-1 text-[15px] text-fg/90 leading-relaxed">{project[key]}</dd>
                    </div>
                  ))}
                </dl>

                <div className="mt-6 flex flex-wrap items-center gap-2">
                  {project.stack.map((tech) => (
                    <span
                      key={tech}
                      className="font-sans text-[10.5px] px-2.5 py-1 rounded-full border border-border-strong/60 text-muted-fg transition-colors duration-200 hover:border-accent hover:bg-accent/10 hover:text-accent"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>

              <RepoCard repo={project.repo} fallbackDescription={project.tagline} fallbackStack={project.stack} />
            </div>
          </div>
        </div>
      </div>
    </Reveal>
  );
}
