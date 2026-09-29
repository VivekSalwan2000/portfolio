/**
 * Page-wide SVG filter definitions, mounted once in the root layout since
 * they render no visible markup of their own — referenced elsewhere via
 * `url(#id)` in CSS `filter`/`backdrop-filter`.
 */
export function SvgFilters() {
  return (
    <svg aria-hidden="true" className="absolute h-0 w-0 overflow-hidden">
      <defs>
        {/* Gives .glass-button its actual refraction — feTurbulence +
            feDisplacementMap warp whatever's behind it, the way real glass
            bends light, rather than just blurring it flat. Referenced via
            backdrop-filter: url(#liquid-glass-distortion) in globals.css. */}
        <filter
          id="liquid-glass-distortion"
          x="-20%"
          y="-20%"
          width="140%"
          height="140%"
          colorInterpolationFilters="sRGB"
        >
          <feTurbulence
            type="fractalNoise"
            baseFrequency="0.015 0.025"
            numOctaves="2"
            seed="6"
            result="noise"
          />
          <feGaussianBlur in="noise" stdDeviation="2" result="blurredNoise" />
          <feDisplacementMap
            in="SourceGraphic"
            in2="blurredNoise"
            scale="14"
            xChannelSelector="R"
            yChannelSelector="G"
          />
        </filter>

        {/* Remaps the About photo's "other" grade from a plain grayscale
            desaturation to a two-tone map onto the site's own ink/gold
            pair (--hero-accent-ink / --hero-accent) — shadows fall to the
            same dark ink the buttons use, highlights to the same warm
            gold, so the photo reads as a deliberate brand film grade
            instead of a generic B&W filter. feColorMatrix collapses to
            luminance first; feComponentTransfer then maps that [0,1]
            range across the two brand colors per channel. */}
        <filter id="photo-duotone" colorInterpolationFilters="sRGB">
          <feColorMatrix
            type="matrix"
            values="0.2126 0.7152 0.0722 0 0
                    0.2126 0.7152 0.0722 0 0
                    0.2126 0.7152 0.0722 0 0
                    0      0      0      1 0"
          />
          <feComponentTransfer>
            <feFuncR type="table" tableValues="0.1098 0.9412" />
            <feFuncG type="table" tableValues="0.0784 0.8588" />
            <feFuncB type="table" tableValues="0.0471 0.6902" />
          </feComponentTransfer>
        </filter>
      </defs>
    </svg>
  );
}
