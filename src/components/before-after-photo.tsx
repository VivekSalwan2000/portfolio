"use client";

import { useEffect, useRef, useState, type PointerEvent as ReactPointerEvent, type KeyboardEvent as ReactKeyboardEvent } from "react";
import {
  motion,
  useMotionValue,
  useMotionValueEvent,
  useReducedMotion,
  useTransform,
  animate,
  type AnimationPlaybackControls,
} from "framer-motion";

const KEY_STEP = 2;
const EASE_OUT: [number, number, number, number] = [0.23, 1, 0.32, 1];

function clamp01(n: number) {
  return Math.min(1, Math.max(0, n));
}

/**
 * A single photo, dragged between the full-color original and a duotone
 * grade mapped onto the site's own ink/gold pair (see #photo-duotone in
 * svg-filters.tsx) — the same colors the buttons use, so this reads as a
 * deliberate brand film grade rather than a generic B&W filter. One source
 * image; the duotone side is the same photo re-graded in CSS, not a
 * separately edited export — wiped in from the left via clip-path so
 * scrubbing never touches the React render path.
 */
export function BeforeAfterPhoto({
  src,
  alt,
  defaultPosition = 55,
  className = "",
}: {
  src: string;
  alt: string;
  defaultPosition?: number;
  className?: string;
}) {
  const reduceMotion = useReducedMotion();
  const frameRef = useRef<HTMLDivElement>(null);
  const percentRef = useRef<HTMLSpanElement>(null);
  const dragging = useRef(false);
  const demoRan = useRef(false);
  const demoControls = useRef<AnimationPlaybackControls | null>(null);

  const initial = clamp01(defaultPosition / 100);
  const wipe = useMotionValue(initial);
  const [a11yValue, setA11yValue] = useState(() => Math.round(initial * 100));
  const [pressed, setPressed] = useState(false);

  useMotionValueEvent(wipe, "change", (v) => {
    const pct = Math.round(clamp01(v) * 100);
    if (percentRef.current) percentRef.current.textContent = `${pct}%`;
    if (!dragging.current) setA11yValue(pct);
  });

  useEffect(() => {
    if (reduceMotion || demoRan.current) return;
    demoRan.current = true;
    const from = clamp01(defaultPosition / 100);
    demoControls.current = animate(wipe, [from, Math.min(1, from + 0.22), from], {
      duration: 1.65,
      times: [0, 0.55, 1],
      ease: EASE_OUT,
      delay: 0.6,
    });
    return () => {
      demoControls.current?.stop();
      demoControls.current = null;
    };
  }, [reduceMotion, defaultPosition, wipe]);

  const clipPath = useTransform(wipe, (v) => `inset(0 ${100 - clamp01(v) * 100}% 0 0)`);
  const handleLeft = useTransform(wipe, (v) => `${clamp01(v) * 100}%`);

  const stopDemo = () => {
    demoControls.current?.stop();
    demoControls.current = null;
  };

  const setFromPointer = (clientX: number) => {
    const el = frameRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    if (rect.width <= 0) return;
    wipe.set(clamp01((clientX - rect.left) / rect.width));
  };

  const onPointerDown = (e: ReactPointerEvent<HTMLDivElement>) => {
    if (e.button !== 0) return;
    stopDemo();
    dragging.current = true;
    setPressed(true);
    e.currentTarget.setPointerCapture(e.pointerId);
    setFromPointer(e.clientX);
  };

  const onPointerMove = (e: ReactPointerEvent<HTMLDivElement>) => {
    if (!dragging.current) return;
    setFromPointer(e.clientX);
  };

  const endDrag = (e: ReactPointerEvent<HTMLDivElement>) => {
    if (!dragging.current) return;
    dragging.current = false;
    setPressed(false);
    setA11yValue(Math.round(clamp01(wipe.get()) * 100));
    if (e.currentTarget.hasPointerCapture(e.pointerId)) {
      e.currentTarget.releasePointerCapture(e.pointerId);
    }
  };

  const onKeyDown = (e: ReactKeyboardEvent<HTMLDivElement>) => {
    const current = wipe.get();
    let next: number | null = null;
    if (e.key === "ArrowLeft") next = current - KEY_STEP / 100;
    else if (e.key === "ArrowRight") next = current + KEY_STEP / 100;
    else if (e.key === "Home") next = 0;
    else if (e.key === "End") next = 1;
    if (next === null) return;
    e.preventDefault();
    stopDemo();
    wipe.set(clamp01(next));
  };

  return (
    <div
      ref={frameRef}
      role="slider"
      tabIndex={0}
      aria-orientation="horizontal"
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={a11yValue}
      aria-valuetext={`${a11yValue}% in color`}
      aria-label="Drag to reveal the photo in color"
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={endDrag}
      onPointerCancel={endDrag}
      onKeyDown={onKeyDown}
      className={`group relative isolate aspect-[5/7] w-full cursor-ew-resize touch-none overflow-hidden rounded-2xl border border-border outline-none select-none focus-visible:ring-2 focus-visible:ring-accent ${className}`}
    >
      {/* Duotone base — brand ink/gold grade, see #photo-duotone */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={src}
        alt={alt}
        draggable={false}
        decoding="async"
        style={{ filter: "url(#photo-duotone) contrast(1.05)" }}
        className="absolute inset-0 h-full w-full object-cover"
      />

      {/* Color, wiped in from the left */}
      <motion.div className="absolute inset-0" style={{ clipPath }}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={src} alt="" draggable={false} decoding="async" className="h-full w-full object-cover" />
      </motion.div>

      <div className="photo-vignette pointer-events-none absolute inset-0" aria-hidden="true" />

      <span className="pointer-events-none absolute bottom-3.5 left-3.5 z-10 font-sans text-[10px] font-medium uppercase tracking-[0.18em] text-[var(--hero-fg)]/90">
        Color
      </span>
      <span className="pointer-events-none absolute bottom-3.5 right-3.5 z-10 font-sans text-[10px] font-medium uppercase tracking-[0.18em] text-[var(--hero-fg)]/90">
        Duotone
      </span>

      <motion.div
        aria-hidden="true"
        className="pointer-events-none absolute inset-y-0 z-20 w-0.5 bg-[var(--hero-fg)]/90 [box-shadow:0_0_12px_rgba(0,0,0,.35)]"
        style={{ left: handleLeft, x: "-50%" }}
      />

      <motion.div
        className="pointer-events-none absolute top-1/2 z-30"
        style={{ left: handleLeft, x: "-50%", y: "-50%" }}
      >
        <motion.div
          animate={{ scale: pressed ? 0.92 : 1 }}
          transition={{ duration: 0.12, ease: EASE_OUT }}
          className="relative flex size-9 items-center justify-center rounded-full bg-[var(--hero-accent)] text-[var(--hero-accent-ink)] shadow-lg ring-1 ring-black/10"
        >
          <HandleChevrons />
          <span
            ref={percentRef}
            className="absolute left-1/2 top-[calc(100%+8px)] -translate-x-1/2 rounded-md bg-[var(--hero-accent-ink)]/80 px-1.5 py-0.5 font-sans text-[10px] font-medium tabular-nums tracking-wide text-[var(--hero-fg)]"
          >
            {a11yValue}%
          </span>
        </motion.div>
      </motion.div>
    </div>
  );
}

function HandleChevrons() {
  return (
    <svg width="16" height="12" viewBox="0 0 16 12" fill="none" aria-hidden="true">
      <path d="M1.25 6L5.75 1.75V10.25L1.25 6Z" fill="currentColor" />
      <path d="M14.75 6L10.25 1.75V10.25L14.75 6Z" fill="currentColor" />
    </svg>
  );
}
