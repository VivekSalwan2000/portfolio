"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";

// Cycles through the same identity phrase the About section spells out in
// full ("Software engineer · systems thinker · builder") rather than the
// generic multilingual "Hello" the reference component cycled — this is
// the site introducing itself, not a stock loading animation.
const SEQUENCE = ["Vivek Salwan", "Software Engineer", "Systems Thinker", "Builder"];
const STEP_MS = 380;

export function Preloader() {
  const shouldReduceMotion = useReducedMotion();
  const [index, setIndex] = useState(0);
  const [exiting, setExiting] = useState(false);
  const [done, setDone] = useState(false);

  useEffect(() => {
    if (shouldReduceMotion) {
      setDone(true);
      return;
    }
    if (index >= SEQUENCE.length - 1) {
      const t = setTimeout(() => setExiting(true), STEP_MS);
      return () => clearTimeout(t);
    }
    const t = setTimeout(() => setIndex((i) => i + 1), STEP_MS);
    return () => clearTimeout(t);
  }, [index, shouldReduceMotion]);

  useEffect(() => {
    if (done) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [done]);

  if (done) return null;

  return (
    <motion.div
      initial={false}
      animate={exiting ? { y: "-100%" } : { y: 0 }}
      transition={{ duration: 0.7, ease: [0.76, 0, 0.24, 1] }}
      onAnimationComplete={() => exiting && setDone(true)}
      className="fixed inset-0 z-[999] flex items-center justify-center bg-bg"
      aria-hidden="true"
    >
      <div className="flex items-center gap-3">
        <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-accent" />
        <AnimatePresence mode="popLayout">
          <motion.span
            key={index}
            initial={{ y: 16, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -16, opacity: 0 }}
            transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
            className="font-serif text-2xl italic text-fg sm:text-3xl"
          >
            {SEQUENCE[index]}
          </motion.span>
        </AnimatePresence>
      </div>
    </motion.div>
  );
}
