"use client";

import type { MouseEventHandler, ReactNode } from "react";

/**
 * A solid accent-gold pill with a small dark dot beside the label at rest.
 * On hover that dot expands to fill the whole pill dark, and the label
 * swaps for label+icon in a light color — the reference's light-to-dark
 * reveal, kept on the site's own accent-gold-to-dark-ink palette instead of
 * white-to-black. Fixed --hero-* tokens (not the theme's --color-* ones)
 * are what make this render identically in both themes and in every
 * section — the whole point was for the two buttons to match exactly.
 */
export function InteractiveButton({
  href,
  type = "button",
  onClick,
  label,
  icon,
  className = "",
  disabled = false,
}: {
  href?: string;
  type?: "button" | "submit";
  onClick?: MouseEventHandler;
  label: string;
  icon: ReactNode;
  className?: string;
  disabled?: boolean;
}) {
  const content = (
    <>
      <span className="relative z-10 inline-flex items-center gap-2 transition-all duration-300 group-hover:translate-x-8 group-hover:opacity-0">
        <span aria-hidden="true" className="h-1.5 w-1.5 shrink-0 rounded-full bg-[var(--hero-accent-ink)]" />
        {label}
      </span>
      <span className="absolute inset-0 z-10 flex translate-x-8 items-center justify-center gap-2 text-[var(--hero-fg)] opacity-0 transition-all duration-300 group-hover:translate-x-0 group-hover:opacity-100">
        {label}
        {icon}
      </span>
      <span
        aria-hidden="true"
        className="absolute left-[22px] top-1/2 h-2 w-2 -translate-y-1/2 scale-100 rounded-full bg-[var(--hero-accent-ink)] transition-all duration-500 ease-out group-hover:left-0 group-hover:top-0 group-hover:h-full group-hover:w-full group-hover:translate-y-0 group-hover:scale-[1.8]"
      />
    </>
  );

  // Solid accent gold at rest — the same fill every other primary button on
  // the site uses — instead of the reference's plain white/light chip,
  // which read as out of place here. The dark ink dot still expands to a
  // full dark fill on hover, so the light-to-dark reveal survives the
  // recolor.
  const sharedClassName = `group relative isolate inline-flex items-center justify-center overflow-hidden rounded-full bg-[var(--hero-accent)] px-6 py-3.5 font-medium text-sm text-[var(--hero-accent-ink)] transition-transform active:scale-[0.98] cursor-pointer disabled:cursor-not-allowed disabled:opacity-50 disabled:pointer-events-none disabled:active:scale-100 ${className}`;

  if (href) {
    return (
      <a href={href} className={sharedClassName}>
        {content}
      </a>
    );
  }

  return (
    <button type={type} onClick={onClick} disabled={disabled} className={sharedClassName}>
      {content}
    </button>
  );
}
