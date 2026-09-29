import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          // Stops the browser guessing a response's MIME type from its
          // content — blocks a class of attack where a file uploaded/served
          // as one type (e.g. an image) gets executed as another (e.g. JS).
          { key: "X-Content-Type-Options", value: "nosniff" },
          // No legitimate reason for this site to be framed by another
          // origin — blocks clickjacking (an invisible iframe of this site
          // overlaid on a malicious page to hijack clicks).
          { key: "X-Frame-Options", value: "DENY" },
          // Sends the full referrer only to this site's own origin; other
          // sites only see the origin, not the full path a visitor came
          // from (e.g. never leaks that someone arrived via a search for
          // their own name).
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          // Explicitly denies browser features this static portfolio has
          // no use for, so an embedded/compromised third-party script
          // couldn't invoke them even if one ever ended up on the page.
          { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
        ],
      },
    ];
  },
};

export default nextConfig;
