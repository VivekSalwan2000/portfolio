"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { motion, useMotionValueEvent, useReducedMotion, useScroll, useTransform } from "framer-motion";

export type TimelineEntry = {
  title: string;
  content: ReactNode;
};

/**
 * The sticky numeral lights up in accent color once the progress line
 * beside it has caught up — a small, direct link between the two pieces of
 * scroll machinery already driving this component, rather than a separate
 * effect bolted on top.
 */
function TimelineNumeral({ children }: { children: ReactNode }) {
  const ref = useRef<HTMLSpanElement>(null);
  const [active, setActive] = useState(false);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 55%", "start 35%"] });
  useMotionValueEvent(scrollYProgress, "change", (v) => setActive(v > 0.5));

  return (
    <span
      ref={ref}
      className={`pl-8 font-sans font-semibold text-3xl leading-none transition-colors duration-500 sm:text-4xl md:text-5xl ${
        active ? "text-accent" : "text-border-strong"
      }`}
    >
      {children}
    </span>
  );
}

export function Timeline({ data }: { data: TimelineEntry[] }) {
  const shouldReduceMotion = useReducedMotion();
  const listRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [height, setHeight] = useState(0);

  useEffect(() => {
    if (!listRef.current) return;
    setHeight(listRef.current.getBoundingClientRect().height);
  }, []);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start 75%", "end 55%"],
  });

  const heightTransform = useTransform(scrollYProgress, [0, 1], [0, height]);
  const opacityTransform = useTransform(scrollYProgress, [0, 0.15], [0, 1]);

  return (
    <div ref={containerRef} className="relative">
      <div ref={listRef} className="relative">
        {data.map((item, index) => (
          <div key={index} className="relative flex gap-6 pt-14 first:pt-0 sm:gap-10 md:pt-20">
            <div className="sticky top-24 z-10 flex h-fit shrink-0 items-start self-start md:top-28">
              <span className="absolute left-[7px] top-2 h-2.5 w-2.5 -translate-x-1/2 rounded-full border-2 border-accent bg-bg" />
              <TimelineNumeral>{item.title}</TimelineNumeral>
            </div>

            <div className="min-w-0 flex-1 pb-2">{item.content}</div>
          </div>
        ))}

        <div className="h-16 sm:h-20" aria-hidden="true" />

        <div
          style={{ height: `${height}px` }}
          className="absolute left-[7px] top-0 w-px bg-border [mask-image:linear-gradient(to_bottom,transparent_0%,black_6%,black_94%,transparent_100%)]"
        >
          {!shouldReduceMotion && (
            <motion.div
              style={{ height: heightTransform, opacity: opacityTransform }}
              className="absolute inset-x-0 top-0 w-px bg-accent"
            />
          )}
        </div>
      </div>
    </div>
  );
}
