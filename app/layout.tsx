import type { Metadata, Viewport } from "next";
import { Source_Sans_3, Source_Serif_4 } from "next/font/google";
import type { CSSProperties } from "react";

import { homeTitle, noIndex, site } from "@/content/site.config";
import "./globals.css";

/**
 * Two families, no more. A humanist serif for headings (warmth plus
 * institutional weight) over a humanist sans for body. next/font self-hosts
 * both, so there is no external request and no layout shift.
 */
const heading = Source_Serif_4({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-heading",
  weight: ["600", "700"],
});

const body = Source_Sans_3({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-body",
  weight: ["400", "600", "700"],
});

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    /*
      `default` is used verbatim — Next.js does NOT apply `template` to it — so
      it has to be the finished string, brand included, exactly once. The old
      value was the full-sentence tagline, which any route inheriting it would
      have rendered at 79 characters ending in a period.
    */
    default: homeTitle,
    template: `%s · ${site.name}`,
  },
  description: `${site.name} in ${site.address.city}, ${site.address.state}. 1:3 infant ratio, licensed #${site.license.number}, NAEYC accredited, open ${site.hours.short}. Current openings listed by room.`,
  applicationName: site.name,
  authors: [{ name: site.name }],
  openGraph: {
    type: "website",
    locale: "en_US",
    siteName: site.name,
    url: site.url,
    title: `${site.name} — ${site.tagline}`,
    description: `1:3 infant ratio, licensed #${site.license.number}, NAEYC accredited. Openings listed by room, updated ${site.openingsUpdated}.`,
  },
  twitter: { card: "summary_large_image" },
  robots: noIndex ? { index: false, follow: false } : { index: true, follow: true },
  alternates: { canonical: "/" },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  colorScheme: "light",
  /* The page now opens on a full-bleed dark hero with the nav transparent over
     it, so the browser chrome above it has to be the hero's ground and not the
     brand green — otherwise the first 40px of an iOS screen is a lighter stripe
     sitting on top of a dark photograph. */
  themeColor: site.brand.ground,
};

/**
 * Every brand token becomes a custom property on :root. This is the mechanism
 * that makes content/site.config.ts the only file you edit to re-skin the
 * demo — no component anywhere holds a hex value.
 */
const brandVars = {
  "--brand-primary": site.brand.primary,
  "--brand-primary-dark": site.brand.primaryDark,
  "--brand-primary-tint": site.brand.primaryTint,
  "--brand-accent": site.brand.accent,
  "--brand-accent-dark": site.brand.accentDark,
  "--brand-on-accent": site.brand.onAccent,
  "--brand-on-primary": site.brand.onPrimary,
  "--brand-bg": site.brand.bg,
  "--brand-surface": site.brand.surface,
  "--brand-ink": site.brand.ink,
  "--brand-ink-muted": site.brand.inkMuted,
  "--brand-line": site.brand.line,
  "--brand-ground": site.brand.ground,
  "--brand-sand": site.brand.sand,
  "--brand-deep": site.brand.deep,
  "--brand-on-ground": site.brand.onGround,
  "--brand-brass": site.brand.brass,
  "--brand-brass-dark": site.brand.brassDark,
  "--brand-status-good": site.brand.statusGood,
  "--brand-status-good-bg": site.brand.statusGoodBg,
  "--brand-status-wait": site.brand.statusWait,
  "--brand-status-wait-bg": site.brand.statusWaitBg,
} as CSSProperties;

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en-US" className={`${heading.variable} ${body.variable}`} style={brandVars}>
      <head>
        {/*
          The scroll-reveal opt-IN. Everything the server renders is opaque;
          only the presence of `js-reveal` on <html> turns on the hidden state
          in globals.css. So:

            no JavaScript      -> class never lands -> nothing is ever hidden
            reduced motion     -> class never lands -> opacity is never touched
            script throws      -> class never lands -> nothing is ever hidden
            observer misbehaves-> the 1200ms net below reveals everything anyway

          It runs in <head>, before first paint, so there is no flash either
          way. Kept inline and tiny on purpose — a separate request could lose
          the race with paint.
        */}
        <script
          dangerouslySetInnerHTML={{
            __html:
              '(function(){try{var d=document.documentElement;' +
              'if(window.matchMedia&&window.matchMedia("(prefers-reduced-motion: reduce)").matches)return;' +
              'd.classList.add("js-reveal");' +
              'setTimeout(function(){var n=d.querySelectorAll("[data-reveal]");' +
              'for(var i=0;i<n.length;i++)n[i].classList.add("is-in")},1200)}catch(e){}})()',
          }}
        />
      </head>
      <body>
        <a href="#main" className="skip-link">
          Skip to content
        </a>
        {children}
      </body>
    </html>
  );
}
