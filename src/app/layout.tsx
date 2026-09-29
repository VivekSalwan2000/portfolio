import type { Metadata, Viewport } from "next";
import { Newsreader } from "next/font/google";
import { GeistSans } from "geist/font/sans";
import { BRAND } from "@/lib/theme";
import { profile } from "@/lib/data";
import { SvgFilters } from "@/components/svg-filters";
import { Preloader } from "@/components/preloader";
import "./globals.css";

const newsreader = Newsreader({
  variable: "--font-newsreader",
  subsets: ["latin"],
  weight: ["400", "600"],
  style: ["normal", "italic"],
  display: "swap",
});

const siteUrl = "https://viveksalwan.ca";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Vivek Salwan — Software Engineer",
    template: "%s — Vivek Salwan",
  },
  description:
    "Vivek Salwan is a Computer Science graduate (Brock University) building full-stack, backend, and applied AI/ML systems — from multithreaded Java servers to Firebase platforms and neural language models.",
  keywords: [
    "Vivek Salwan",
    "Software Engineer",
    "Full Stack Developer",
    "Backend Developer",
    "Computer Science",
    "Brock University",
    "Ontario",
    "Canada",
    "Java Developer",
    "Machine Learning",
  ],
  authors: [{ name: "Vivek Salwan", url: "https://github.com/VivekSalwan2000" }],
  creator: "Vivek Salwan",
  alternates: {
    canonical: siteUrl,
  },
  openGraph: {
    type: "website",
    url: siteUrl,
    title: "Vivek Salwan — Software Engineer",
    description:
      "Full-stack, backend, and applied AI/ML — from multithreaded Java servers to Firebase platforms and neural language models.",
    siteName: "Vivek Salwan",
  },
  twitter: {
    card: "summary_large_image",
    title: "Vivek Salwan — Software Engineer",
    description:
      "Full-stack, backend, and applied AI/ML — from multithreaded Java servers to Firebase platforms and neural language models.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: BRAND.nightBg,
};

const themeInitScript = `
try {
  var t = localStorage.getItem('theme');
  var theme = t === 'day' ? 'day' : 'night';
  document.documentElement.setAttribute('data-theme', theme);
  var meta = document.querySelector('meta[name="theme-color"]');
  if (meta) meta.setAttribute('content', theme === 'day' ? '${BRAND.dayBg}' : '${BRAND.nightBg}');
} catch (e) {}
`;

const personJsonLd = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: profile.name,
  url: siteUrl,
  jobTitle: profile.eyebrow,
  email: `mailto:${profile.email}`,
  alumniOf: {
    "@type": "CollegeOrUniversity",
    name: "Brock University",
  },
  sameAs: [profile.github, profile.linkedin],
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      data-theme="night"
      suppressHydrationWarning
      className={`${GeistSans.variable} ${newsreader.variable} h-full antialiased`}
    >
      <body
        className="min-h-full flex flex-col bg-bg text-fg selection:bg-accent"
        suppressHydrationWarning
      >
        <script suppressHydrationWarning dangerouslySetInnerHTML={{ __html: themeInitScript }} />
        <SvgFilters />
        <Preloader />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(personJsonLd) }}
        />
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[100] focus:rounded-full focus:bg-accent focus:px-5 focus:py-2.5 focus:font-sans focus:text-sm focus:font-medium focus:text-accent-ink"
        >
          Skip to content
        </a>
        {children}
      </body>
    </html>
  );
}
