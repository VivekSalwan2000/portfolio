import { Reveal } from "./reveal";

export function ChapterHeading({
  index,
  eyebrow,
  title,
  titleAccent,
  description,
}: {
  index: string;
  eyebrow: string;
  title: string;
  titleAccent?: string;
  description?: string;
}) {
  return (
    <Reveal>
      <div className="flex items-baseline gap-3 mb-4">
        <span className="font-sans text-sm text-accent">{index}</span>
        <span className="font-sans text-[11px] tracking-[0.2em] uppercase text-muted-fg">
          {eyebrow}
        </span>
      </div>
      <h2 className="font-serif font-semibold leading-[0.95] tracking-tight text-balance text-[clamp(2rem,5.5vw,3.75rem)]">
        {title}
        {titleAccent && (
          <>
            <br />
            <span className="font-normal italic text-accent">{titleAccent}</span>
          </>
        )}
      </h2>
      {description && (
        <p className="mt-5 max-w-xl text-muted-fg leading-relaxed">{description}</p>
      )}
    </Reveal>
  );
}
