"use client";

import { motion, useReducedMotion } from "framer-motion";

export function WordsPullUp({ text, className }: { text: string; className?: string }) {
  const shouldReduceMotion = useReducedMotion();
  const words = text.split(" ");

  return (
    <span className={`inline-flex flex-wrap ${className ?? ""}`}>
      {words.map((word, i) => (
        <motion.span
          key={i}
          initial={{ y: shouldReduceMotion ? 0 : 24, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6, delay: i * 0.08, ease: [0.16, 1, 0.3, 1] }}
          className="inline-block"
          style={{ marginRight: "0.25em" }}
        >
          {word}
        </motion.span>
      ))}
    </span>
  );
}
