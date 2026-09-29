type MarqueeProps = {
  items: string[];
  className?: string;
  duration?: number;
  direction?: "left" | "right";
  pauseOnHover?: boolean;
  fade?: boolean;
  fadeAmount?: number;
};

export function Marquee({
  items,
  className,
  duration = 32,
  direction = "left",
  pauseOnHover = true,
  fade = true,
  fadeAmount = 12,
}: MarqueeProps) {
  const content = (
    <>
      {items.map((item, i) => (
        <span key={i} className="inline-flex items-center gap-6 shrink-0">
          <span>{item}</span>
          <span className="text-accent" aria-hidden="true">
            ·
          </span>
        </span>
      ))}
    </>
  );

  const maskImage = fade
    ? `linear-gradient(to right, transparent 0%, black ${fadeAmount}%, black ${100 - fadeAmount}%, transparent 100%)`
    : undefined;

  return (
    <div
      className={`group overflow-hidden ${className ?? ""}`}
      style={maskImage ? { maskImage, WebkitMaskImage: maskImage } : undefined}
      aria-hidden="true"
    >
      <div
        className={`flex gap-6 w-max motion-reduce:[animation-play-state:paused] ${
          pauseOnHover ? "group-hover:[animation-play-state:paused]" : ""
        }`}
        style={{
          animationName: direction === "left" ? "marquee" : "marquee-reverse",
          animationDuration: `${duration}s`,
          animationTimingFunction: "linear",
          animationIterationCount: "infinite",
        }}
      >
        <div className="flex gap-6 shrink-0">{content}</div>
        <div className="flex gap-6 shrink-0">{content}</div>
      </div>
    </div>
  );
}
