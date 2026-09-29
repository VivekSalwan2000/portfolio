"use client";

import { useEffect, useRef, useState } from "react";
import { useInView, useReducedMotion } from "framer-motion";

/**
 * Animates a leading integer up to its final value once scrolled into view.
 * Only kicks in for plain "98" / "98%" style values — a range like
 * "10-20%" would read as a second, unrelated number climbing mid-animation,
 * so those are left as a static string instead of half-simulating it.
 */
export function CountUp({
  value,
  duration = 1.1,
  className,
}: {
  value: string;
  duration?: number;
  className?: string;
}) {
  const shouldReduceMotion = useReducedMotion();
  const canAnimate = /^\d+%?$/.test(value);
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  const [display, setDisplay] = useState(shouldReduceMotion || !canAnimate ? value : "0");

  useEffect(() => {
    if (!inView || shouldReduceMotion || !canAnimate) return;
    const target = parseInt(value, 10);
    const suffix = value.endsWith("%") ? "%" : "";
    const start = performance.now();
    let raf: number;
    const tick = (now: number) => {
      const progress = Math.min(1, (now - start) / (duration * 1000));
      const eased = 1 - Math.pow(1 - progress, 3);
      setDisplay(`${Math.round(target * eased)}${suffix}`);
      if (progress < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [inView, shouldReduceMotion, canAnimate, value, duration]);

  return (
    <span ref={ref} className={className}>
      {display}
    </span>
  );
}
