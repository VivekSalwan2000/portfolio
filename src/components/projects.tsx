import { ArrowUpRight, GithubLogo } from "@phosphor-icons/react/ssr";
import { projects, secondaryProjects } from "@/lib/data";
import { ChapterHeading } from "./chapter-heading";
import { ProjectPlate } from "./project-plate";
import { Reveal, StaggerGroup, StaggerItem } from "./reveal";

export function Projects() {
  return (
    <section id="projects" className="bg-bg px-5 sm:px-8 py-20 sm:py-28 transition-colors duration-300">
      <div className="mx-auto max-w-5xl">
        <ChapterHeading
          index="03"
          eyebrow="Selected work"
          title="Three systems"
          titleAccent="I built end to end"
          description="Full-stack and backend projects, each broken down as a problem, the decision that shaped it, and the result."
        />

        <div className="mt-14 space-y-14 sm:space-y-16">
          {projects.map((project, i) => (
            <ProjectPlate key={project.slug} project={project} reverse={i % 2 === 1} />
          ))}
        </div>

        <Reveal className="mt-16 sm:mt-20">
          <p className="font-sans text-[11px] tracking-[0.2em] uppercase text-muted-fg mb-2">
            Also built — for Data & AI roles
          </p>
          <div className="rule mb-5" />
          <StaggerGroup className="divide-y divide-border">
            {secondaryProjects.map((project) => (
              <StaggerItem key={project.name}>
                <a
                  href={`https://github.com/${project.repo}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex items-center justify-between gap-4 py-4 hover:text-accent active:translate-x-0.5 transition-all cursor-pointer"
                >
                  <span className="min-w-0">
                    <span className="font-sans font-medium">{project.name}</span>
                    <span className="text-muted-fg"> — {project.detail}</span>
                  </span>
                  <span className="flex items-center gap-1 shrink-0 font-sans text-xs text-muted-fg group-hover:text-accent">
                    <GithubLogo size={14} />
                    <ArrowUpRight size={14} />
                  </span>
                </a>
              </StaggerItem>
            ))}
          </StaggerGroup>
        </Reveal>
      </div>
    </section>
  );
}
