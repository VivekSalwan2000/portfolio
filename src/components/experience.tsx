import { experience } from "@/lib/data";
import { CountUp } from "./count-up";
import { Reveal } from "./reveal";
import { ChapterHeading } from "./chapter-heading";
import { Timeline } from "./timeline";

export function Experience() {
  const items = experience.map((job) => ({
    title: job.numeral,
    content: (
      <Reveal>
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:gap-6">
          <div className="shrink-0 sm:w-44">
            <p className="whitespace-nowrap font-sans text-[11px] tracking-widest uppercase text-accent">
              {job.period}
            </p>
            <p className="mt-1 whitespace-nowrap font-sans text-[11px] tracking-widest uppercase text-muted-fg">
              {job.location}
            </p>
          </div>

          <div className="shine-card group flex-1 rounded-2xl border border-border bg-card p-6 transition-all duration-300 hover:-translate-y-1 hover:border-border-strong hover:shadow-2xl hover:shadow-black/20 sm:p-8">
            <p className="font-sans text-[10px] tracking-[0.2em] uppercase text-accent mb-2">
              {job.context}
            </p>
            <h3 className="font-sans font-semibold text-2xl tracking-tight sm:text-3xl">
              {job.role} <span className="text-accent">@ {job.company}</span>
            </h3>

            <ul className="mt-5 space-y-3">
              {job.points.map((point) => (
                <li key={point} className="flex gap-3 text-sm leading-relaxed text-muted-fg sm:text-base">
                  <span className="shrink-0 select-none text-accent">›</span>
                  {point}
                </li>
              ))}
            </ul>

            <div className="mt-6 flex flex-wrap gap-2">
              <span className="inline-flex items-center gap-1.5 rounded-full border border-border-strong/60 px-3 py-1.5 font-sans text-[11px] tracking-widest uppercase text-muted-fg transition-colors duration-200 hover:border-accent hover:bg-accent/10 hover:text-accent">
                <CountUp value={job.stat.value} className="font-semibold text-accent" />
                {job.stat.label}
              </span>
              {job.skills.map((skill) => (
                <span
                  key={skill}
                  className="inline-flex items-center rounded-full border border-border-strong/60 px-3 py-1.5 font-sans text-[11px] tracking-widest uppercase text-muted-fg transition-colors duration-200 hover:border-accent hover:bg-accent/10 hover:text-accent"
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>
        </div>
      </Reveal>
    ),
  }));

  return (
    <section id="experience" className="bg-bg-raised px-5 sm:px-8 py-20 sm:py-28 transition-colors duration-300">
      <div className="mx-auto max-w-5xl">
        <ChapterHeading
          index="02"
          eyebrow="Engineering & operations experience"
          title="Two years"
          titleAccent="of owning the process"
        />

        <div className="mt-12">
          <Timeline data={items} />
        </div>
      </div>
    </section>
  );
}
