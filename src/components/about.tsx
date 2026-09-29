import { IdentificationBadge } from "@phosphor-icons/react/ssr";
import { vitals } from "@/lib/data";
import { Reveal } from "./reveal";
import { ChapterHeading } from "./chapter-heading";
import { BeforeAfterPhoto } from "./before-after-photo";

export function About() {
  return (
    <section id="about" className="bg-bg px-5 sm:px-8 py-20 sm:py-28 transition-colors duration-300">
      <div className="mx-auto max-w-5xl">
        <ChapterHeading
          index="01"
          eyebrow="Background"
          title="I like figuring out"
          titleAccent="how things work."
          description="Software engineer · systems thinker · builder"
        />

        <div className="mt-12 grid grid-cols-1 gap-10 lg:grid-cols-[1fr_21rem] lg:items-start lg:gap-14">
          <Reveal delay={0.1} className="space-y-6 text-lg leading-relaxed text-muted-fg">
            <p className="drop-cap text-fg">
              I still remember being introduced to programming in a Grade 8 computer class. I
              quickly realized how satisfying it was to break a problem into smaller pieces and
              build something that actually worked. Around the same time, I watched Sundar Pichai
              become Google’s CEO, and it was the first time I saw someone from India leading one
              of the world’s most influential tech companies. It made a career in technology feel
              exciting and possible. At the end of that school year, when our teacher asked us to
              write down what we wanted to become, I proudly wrote{" "}
              <strong className="font-semibold text-fg">“CEO at Google.”</strong> Years later,
              after starting my Computer Science degree at Brock, I found that same report card at
              home. My teacher had corrected my answer to{" "}
              <strong className="font-semibold text-fg">“Software Engineer.”</strong> That small
              correction turned out to be a full circle moment, and it’s the path I’ve been
              building toward ever since.
            </p>
            <p className="text-fg">She was right.</p>
            <p>
              I’ve always enjoyed breaking complicated problems into smaller pieces, understanding
              how they connect, and building something that works. From multithreaded systems and
              full-stack applications to ITSM operations and accessibility audits, that same
              curiosity is what shapes how I approach engineering today.
            </p>
          </Reveal>

          <Reveal delay={0.15}>
            <BeforeAfterPhoto src="/about-photo.webp" alt="Vivek Salwan" />
          </Reveal>
        </div>

        <Reveal delay={0.2} className="mt-10 rounded-2xl border border-border bg-card p-6 sm:p-8">
          <div className="flex items-center justify-between gap-3 pb-4 border-b border-border">
            <div className="flex items-center gap-2 font-sans text-[11px] tracking-[0.2em] uppercase text-accent">
              <IdentificationBadge size={16} />
              Vitals
            </div>
            <span className="font-sans text-[10px] tracking-widest uppercase text-muted-fg">
              B.Sc · 2025
            </span>
          </div>

          <dl className="divide-y divide-border">
            {vitals.map((row) => (
              <div
                key={row.label}
                className="grid grid-cols-1 gap-1 py-4 first:pt-4 last:pb-0 sm:grid-cols-[9rem_1fr] sm:items-baseline sm:gap-6"
              >
                <dt className="font-sans text-[10px] tracking-[0.15em] uppercase text-muted-fg">
                  {row.label}
                </dt>
                <dd className="flex flex-wrap items-baseline gap-x-3 gap-y-0.5">
                  <span className="font-sans font-semibold text-fg text-sm sm:text-base">{row.headline}</span>
                  {row.detail && <span className="text-sm text-muted-fg">{row.detail}</span>}
                </dd>
              </div>
            ))}
          </dl>
        </Reveal>
      </div>
    </section>
  );
}
