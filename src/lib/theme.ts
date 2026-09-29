/**
 * Canonical brand colors, mirrored from the CSS custom properties in
 * globals.css. CSS reads the tokens directly from there, but code that runs
 * outside the cascade — canvas rendering, the edge-runtime OG/icon images,
 * the theme-toggle reveal animation — needs literal color strings, so those
 * places import from here instead of re-typing the hex by hand.
 */
export const BRAND = {
  nightBg: "#14110d",
  nightFg: "#f3ece0",
  nightMutedFg: "#b0a28d",
  dayBg: "#f2ebdd",
  accent: "#d4a15e",
} as const;
