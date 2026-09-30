"use client";

import { useEffect, useRef } from "react";
import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";
import { ArrowRight, CaretDown } from "@phosphor-icons/react";
import { disciplines, profile } from "@/lib/data";
import { InteractiveButton } from "./interactive-button";
import { Marquee } from "./marquee";
import { WordsPullUp } from "./words-pull-up";

export function Hero() {
  const shouldReduceMotion = useReducedMotion();
  const videoRef = useRef<HTMLVideoElement>(null);
  const sectionRef = useRef<HTMLElement>(null);
  const loopVeilRef = useRef<HTMLDivElement>(null);
  const posterCoverRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    // The autoplay attribute alone can silently stay paused — battery
    // saver mode, a slow initial connection, or other browser autoplay
    // heuristics can all block it even though the video is muted. When
    // that happens Chrome renders its own big play-button overlay on top
    // (not anything of ours) so visitors aren't stuck looking at a frozen
    // video. Rather than rely on one retry, this listens on every signal
    // that autoplay might now succeed: once metadata/data/enough-to-play
    // arrives, and — the reliable fallback of last resort — the visitor's
    // very first interaction anywhere on the page, which every browser
    // treats as a user gesture that unblocks playback.
    if (shouldReduceMotion) return;
    const video = videoRef.current;
    if (!video) return;
    const tryPlay = () => {
      void video.play().catch(() => {});
    };
    tryPlay();
    video.addEventListener("loadeddata", tryPlay);
    video.addEventListener("canplay", tryPlay);
    video.addEventListener("canplaythrough", tryPlay);
    const interactionEvents = ["pointerdown", "keydown", "touchstart", "scroll"] as const;
    interactionEvents.forEach((ev) => window.addEventListener(ev, tryPlay, { once: true, passive: true }));
    return () => {
      video.removeEventListener("loadeddata", tryPlay);
      video.removeEventListener("canplay", tryPlay);
      video.removeEventListener("canplaythrough", tryPlay);
      interactionEvents.forEach((ev) => window.removeEventListener(ev, tryPlay));
    };
  }, [shouldReduceMotion]);

  useEffect(() => {
    // The source clip's last frame doesn't match its first — without this,
    // every loop restart reads as a visible jump-cut, which is the kind of
    // thing that gives away "looping background video" and undermines the
    // ambient effect. Driven off the video's own timeupdate (not a parallel
    // CSS clock) so it stays correctly synced to actual playback position
    // even through buffering hiccups; a CSS transition on the veil element
    // smooths the sparse timeupdate ticks into what reads as a soft fade.
    if (shouldReduceMotion) return;
    const video = videoRef.current;
    const veil = loopVeilRef.current;
    if (!video || !veil) return;

    const FADE_SECONDS = 0.45;
    const onTimeUpdate = () => {
      const { currentTime, duration } = video;
      if (!duration) return;
      const remaining = duration - currentTime;
      let opacity = 0;
      if (remaining < FADE_SECONDS) opacity = 1 - remaining / FADE_SECONDS;
      else if (currentTime < FADE_SECONDS) opacity = 1 - currentTime / FADE_SECONDS;
      veil.style.opacity = String(Math.max(0, Math.min(1, opacity)));
    };

    video.addEventListener("timeupdate", onTimeUpdate);
    return () => video.removeEventListener("timeupdate", onTimeUpdate);
  }, [shouldReduceMotion]);

  useEffect(() => {
    // Whatever the video's actual paused/loading state is at any moment —
    // waiting on Safari's Low Power Mode to allow playback, buffering,
    // browser-specific autoplay heuristics — the visitor should only ever
    // see either the still poster frame or the actively playing video,
    // never the browser's own native "this video isn't playing" chrome
    // (the play-button overlay Chrome and Safari both render on top of a
    // paused <video>). This static poster image sits above the video and
    // only fades away once the "playing" event fires, i.e. real playback
    // has genuinely started — not just "autoplay was attempted" — and
    // comes back if it ever pauses again for any reason.
    if (shouldReduceMotion) return;
    const video = videoRef.current;
    const cover = posterCoverRef.current;
    if (!video || !cover) return;

    const hideCover = () => {
      cover.style.opacity = "0";
    };
    const showCover = () => {
      cover.style.opacity = "1";
    };

    video.addEventListener("playing", hideCover);
    video.addEventListener("pause", showCover);
    // Autoplay can start synchronously before this effect even runs — in
    // that case the "playing" event already fired and this listener
    // missed it, so check the current state directly too.
    if (!video.paused) hideCover();
    return () => {
      video.removeEventListener("playing", hideCover);
      video.removeEventListener("pause", showCover);
    };
  }, [shouldReduceMotion]);

  // The video (background layer) and the name/CTA block (foreground layer)
  // travel at different rates as the hero scrolls past — that gap in speed
  // is what reads as depth. The video is scaled up so translating it never
  // exposes an edge.
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end start"],
  });
  const videoY = useTransform(scrollYProgress, [0, 1], ["0%", "10%"]);
  const contentY = useTransform(scrollYProgress, [0, 1], [0, -50]);
  const contentOpacity = useTransform(scrollYProgress, [0, 0.55], [1, 0]);
  const cueOpacity = useTransform(scrollYProgress, [0, 0.12], [1, 0]);

  return (
    <section id="top" ref={sectionRef} className="relative p-3 sm:p-4">
      <div className="hero-frame relative min-h-[calc(100svh-1.5rem)] sm:min-h-[calc(100svh-2rem)] rounded-2xl md:rounded-[2rem] overflow-hidden flex flex-col justify-end pb-8 sm:pb-10 md:pb-12">
        <motion.video
          ref={videoRef}
          style={shouldReduceMotion ? undefined : { y: videoY, scale: 1.15 }}
          className="hero-video absolute inset-0 h-full w-full object-cover"
          autoPlay={!shouldReduceMotion}
          loop
          muted
          playsInline
          preload="auto"
          poster="/hero-poster.jpg"
          aria-hidden="true"
          src="/hero-bg.mp4"
        />
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          ref={posterCoverRef}
          src="/hero-poster.jpg"
          alt=""
          aria-hidden="true"
          className="hero-poster-cover absolute inset-0 h-full w-full object-cover"
        />
        <div className="hero-scrim" aria-hidden="true" />
        <div className="hero-grain" aria-hidden="true" />
        <div className="hero-vignette" aria-hidden="true" />
        <div ref={loopVeilRef} className="hero-loop-veil" aria-hidden="true" />

        <motion.div
          style={shouldReduceMotion ? undefined : { y: contentY, opacity: contentOpacity }}
          className="relative z-10 px-5 sm:px-8 md:px-10"
        >
          <div className="max-w-3xl">
            <h1 className="font-serif font-semibold leading-[0.9] tracking-tight text-balance text-[clamp(2.75rem,12vw,8.5rem)] text-[var(--hero-fg)]">
              <WordsPullUp text={profile.name} />
            </h1>

            <motion.p
              initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="font-sans text-xs tracking-[0.3em] uppercase text-[var(--hero-accent)] mt-4"
            >
              {profile.eyebrow}
            </motion.p>

            <motion.p
              initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.5 }}
              className="italic text-[var(--hero-accent)] text-[clamp(1.25rem,3vw,2.25rem)] mt-2"
            >
              {profile.heroAccent}
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.65 }}
              className="flex flex-wrap items-center gap-3 mt-6"
            >
              <InteractiveButton
                href="#projects"
                label="View my work"
                icon={<ArrowRight size={16} weight="bold" />}
              />
              <a
                href="#contact"
                className="glass-button glass-button--hero shine-card inline-flex items-center gap-2 px-6 py-3.5 rounded-full border border-[var(--hero-border)] text-[var(--hero-fg)] font-medium text-sm hover:border-[var(--hero-accent)] hover:text-[var(--hero-accent)] active:scale-[0.98] cursor-pointer"
              >
                <span className="glass-button__surface" aria-hidden="true" />
                <span className="glass-button__content">Get in touch</span>
              </a>
            </motion.div>
          </div>
        </motion.div>

        <motion.div
          style={shouldReduceMotion ? undefined : { opacity: cueOpacity }}
          className="pointer-events-none relative z-10 mt-8 sm:mt-10 flex flex-col items-center gap-1.5"
          aria-hidden="true"
        >
          <span className="font-sans text-[10px] tracking-[0.3em] uppercase text-[var(--hero-fg-70)]">
            Scroll
          </span>
          <motion.span
            animate={shouldReduceMotion ? undefined : { y: [0, 5, 0] }}
            transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
            className="text-[var(--hero-fg-70)]"
          >
            <CaretDown size={16} />
          </motion.span>
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.9 }}
        className="mt-10 sm:mt-14"
      >
        <div className="rule mb-6" />
        <Marquee items={disciplines} className="text-muted-fg font-sans text-xs tracking-[0.2em] uppercase py-1" />
        <div className="rule mt-6" />
      </motion.div>
    </section>
  );
}
