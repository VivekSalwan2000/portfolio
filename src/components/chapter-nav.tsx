"use client";

import { motion, useReducedMotion } from "framer-motion";
import { useEffect, useState } from "react";
import { chapters, profile } from "@/lib/data";
import { ThemeToggle } from "./theme-toggle";

// Native `scroll-behavior: smooth` scales its duration with distance, so a
// jump from Home to Contact on a page this long can drag on for well over a
// second — that's the "takes a while to update" feeling. Driving the scroll
// ourselves keeps it fast and consistent: proportional to distance, but
// capped so no jump ever feels sluggish.
const SCROLL_EASE = (t: number) => 1 - Math.pow(1 - t, 3);

function scrollToId(id: string) {
  const el = document.getElementById(id);
  if (!el) return;

  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const startY = window.scrollY;
  const targetY = startY + el.getBoundingClientRect().top;

  if (reduced) {
    window.scrollTo(0, targetY);
    return;
  }

  const distance = targetY - startY;
  const duration = Math.min(650, Math.max(300, Math.abs(distance) * 0.35));
  const startTime = performance.now();

  function step(now: number) {
    const t = Math.min(1, (now - startTime) / duration);
    window.scrollTo(0, startY + distance * SCROLL_EASE(t));
    if (t < 1) requestAnimationFrame(step);
  }
  requestAnimationFrame(step);
}

export function ChapterNav() {
  const [active, setActive] = useState("top");
  const [scrolled, setScrolled] = useState(false);
  const shouldReduceMotion = useReducedMotion();

  useEffect(() => {
    const sections = chapters
      .map((c) => document.getElementById(c.id))
      .filter((el): el is HTMLElement => el !== null);

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActive(entry.target.id);
        });
      },
      { rootMargin: "-35% 0px -55% 0px", threshold: 0 }
    );
    sections.forEach((el) => observer.observe(el));

    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });

    return () => {
      observer.disconnect();
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  return (
    <>
      <header
        className={`fixed top-0 inset-x-0 z-40 transition-colors duration-300 ${
          scrolled ? "bg-bg/90 backdrop-blur-md border-b border-border" : "bg-transparent"
        }`}
      >
        <div className="w-full px-5 sm:px-8 h-16 flex items-center justify-end">
          <div className="flex items-center gap-3">
            <a
              href={profile.resumeHref}
              target="_blank"
              rel="noopener noreferrer"
              className="glass-button glass-button--flat shine-card hidden sm:inline-block font-sans text-xs xl:text-sm tracking-widest uppercase px-4 py-2 xl:px-5 xl:py-2.5 border border-border-strong rounded-full hover:border-accent hover:text-accent active:scale-95 cursor-pointer"
            >
              <span className="glass-button__surface" aria-hidden="true" />
              <span className="glass-button__content">Résumé</span>
            </a>
            <ThemeToggle />
          </div>
        </div>
      </header>

      {/* Desktop: a collapsed number rail on the left edge that expands into
          full section labels on hover — CSS-only, no JS needed. Hidden until
          the visitor actually scrolls, so the hero is the whole first
          impression rather than something with chrome already laid over it. */}
      <nav
        aria-label="Chapter navigation"
        aria-hidden={!scrolled}
        className={`group fixed left-4 xl:left-6 top-1/2 -translate-y-1/2 z-40 hidden lg:block transition-all duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] ${
          scrolled ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-3 pointer-events-none"
        }`}
      >
        <ol
          className="toc-rail-panel relative flex flex-col gap-0.5 rounded-full border border-border-strong/70 bg-card/80 backdrop-blur-md py-3 px-1.5 shadow-lg group-hover:rounded-[1.75rem] group-hover:border-border-strong group-hover:bg-card/95 group-hover:px-3.5 group-hover:shadow-xl"
        >
          {chapters.map((c) => {
            const isActive = active === c.id;
            return (
              <li key={c.id}>
                <a
                  href={`#${c.id}`}
                  onClick={(e) => {
                    e.preventDefault();
                    scrollToId(c.id);
                  }}
                  aria-current={isActive ? "true" : undefined}
                  className={`toc-rail-row relative flex items-center justify-start gap-0 px-2 py-1.5 rounded-full cursor-pointer group-hover:gap-2 group-hover:px-3 ${
                    isActive ? "text-accent" : "text-muted-fg hover:text-fg"
                  }`}
                >
                  {isActive && (
                    <motion.span
                      layoutId="rail-active-pill"
                      className="absolute inset-0 rounded-full border border-accent/50 bg-accent/5"
                      transition={
                        shouldReduceMotion ? { duration: 0 } : { type: "spring", bounce: 0.2, duration: 0.5 }
                      }
                    />
                  )}
                  <motion.span
                    whileHover={shouldReduceMotion ? undefined : { scale: 1.15 }}
                    whileTap={shouldReduceMotion ? undefined : { scale: 0.85 }}
                    transition={{ type: "spring", stiffness: 400, damping: 15 }}
                    className="relative font-sans text-[11px] tabular-nums shrink-0"
                  >
                    {c.index}
                  </motion.span>
                  <span
                    className={`toc-rail-row relative h-px shrink-0 w-0 ${
                      isActive ? "group-hover:w-4 group-hover:bg-accent" : "group-hover:w-4 group-hover:bg-border-strong"
                    }`}
                  />
                  <span className="toc-rail-row relative max-w-0 group-hover:max-w-[7rem] overflow-hidden opacity-0 group-hover:opacity-100">
                    <span className="font-sans text-[11px] tracking-[0.15em] uppercase whitespace-nowrap">
                      {c.label}
                    </span>
                  </span>
                </a>
              </li>
            );
          })}
        </ol>
      </nav>

      {/* Mobile & tablet: compact dot indicator, no room for a hover reveal.
          Same scroll-gated reveal as the desktop rail. */}
      <nav
        aria-label="Chapter navigation"
        aria-hidden={!scrolled}
        className={`fixed bottom-5 left-1/2 -translate-x-1/2 z-40 lg:hidden transition-all duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] ${
          scrolled ? "opacity-100 translate-y-0" : "opacity-0 translate-y-3 pointer-events-none"
        }`}
      >
        <ol className="flex items-center gap-2 rounded-full border border-border-strong bg-card/90 backdrop-blur-md px-3 py-2 shadow-lg">
          {chapters.map((c) => (
            <li key={c.id}>
              <a
                href={`#${c.id}`}
                onClick={(e) => {
                  e.preventDefault();
                  scrollToId(c.id);
                }}
                aria-current={active === c.id ? "true" : undefined}
                aria-label={c.label}
                className={`block w-2 h-2 rounded-full transition-all cursor-pointer active:scale-75 ${
                  active === c.id ? "bg-accent" : "bg-border-strong"
                }`}
              />
            </li>
          ))}
        </ol>
      </nav>
    </>
  );
}
