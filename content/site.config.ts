/**
 * ============================================================================
 *  THE RE-SKIN SWITCH
 * ============================================================================
 *  This is the only file you edit to rebrand the demo for a new prospect.
 *  Center name, phone, address, license, accreditations, hours, director,
 *  and every brand color live here and nowhere else.
 *
 *  Colors are emitted as CSS custom properties by app/layout.tsx and consumed
 *  by Tailwind through `@theme inline` in app/globals.css. No component ever
 *  hard-codes a hex value, a phone number, or the center’s name.
 *
 *  Change `name` and `brand.primary` and the whole site changes. That is
 *  verification item 17.
 * ============================================================================
 */

import { openingsMonth } from "@/lib/openings-dates";

export type Accreditation = {
  /** Rendered as text, never as a logo linking to "#". */
  label: string;
  /** Real registry URL, or null — in which case it renders as plain text. */
  href: string | null;
  detail: string;
};

export const site = {
  name: "Bridgewood Academy",
  shortName: "Bridgewood",
  tagline: "Early learning in Elmhurst, from six weeks to kindergarten.",

  /**
   * The <title> half of the tagline: a fragment, not a sentence, short enough
   * that "<name> · <titleTagline>" clears 60 characters with the brand in it
   * exactly once. `tagline` above is prose and stays a full sentence — it is
   * used in OG descriptions and on screen, never in a title tag.
   */
  titleTagline: "Early learning in Elmhurst, IL",

  /** Used for canonical URLs, sitemap and OG tags. The demo's own address, so a shared link and its
      preview image resolve on the host that serves the demo (the school is fictional, its domain is not ours). */
  url: "https://bridgewood-academy.vercel.app",

  founded: 2011,

  address: {
    street: "1420 Sheldon Avenue",
    city: "Elmhurst",
    state: "IL",
    zip: "60126",
    /** Approximate — Elmhurst, DuPage County. Used for LocalBusiness JSON-LD. */
    lat: 41.8994,
    lng: -87.9403,
  },

  /** E.164 for tel: links, formatted for display. Never hard-code either. */
  phone: {
    display: "(630) 555-0147",
    href: "tel:+16305550147",
  },

  email: "hello@bridgewoodacademy.com",

  hours: {
    display: "Monday–Friday, 6:30am–6:00pm",
    short: "6:30am–6:00pm",
    opens: "06:30",
    closes: "18:00",
    days: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
    closedNote: "Closed nine holidays a year.",
  },

  license: {
    number: "IDEC-114-0928",
    /**
     * VERIFIED 2026-08-01: The Illinois Department of Early Childhood became
     * the lead agency for child care licensure on July 1, 2026, taking it over
     * from DCFS. IDEC also took over the Child Care Assistance Program (CCAP)
     * from IDHS on the same date.
     */
    agency: "Illinois Department of Early Childhood",
    agencyShort: "IDEC",
    agencyUrl: "https://idec.illinois.gov/forproviders/licensure.html",
    capacityDay: 60,
    capacityAfterSchool: 24,
  },

  accreditations: [
    {
      label: "NAEYC accredited since 2019",
      href: "https://www.naeyc.org/accreditation/programs",
      detail:
        "The National Association for the Education of Young Children re-accredits us every five years against 10 program standards.",
    },
    {
      label: "ExceleRate Illinois Gold Circle of Quality",
      href: "https://www.excelerateillinois.com/",
      detail:
        "Gold is the top of the four Illinois quality circles. It is the only one that is assessed on group size and ratios by an independent assessor.",
    },
  ] satisfies Accreditation[],

  director: {
    name: "Marisol Vega",
    firstName: "Marisol",
    role: "Director",
    tenureYears: 12,
    credential: "M.Ed. Early Childhood Education",
    email: "marisol@bridgewoodacademy.com",
    /** The response promise. Shown on /book-a-tour and /contact. */
    responsePromise:
      "Marisol replies within one business day, and it is a real reply, not an auto-response.",
    /* Her portrait lives in content/images.ts like every other image, as
       `directorImage`. Nothing outside that file names a path under /public. */
  },

  founder: {
    name: "Carol Nystrom",
    firstName: "Carol",
  },

  /** Drive-time framing beats a raw address on a phone at 9:40pm. */
  location: {
    driveTime: "8 minutes from downtown Elmhurst",
    driveTimeSecondary: "10 minutes from the I-290 exit at York Road",
    parking:
      "Twelve spaces in the lot off Sheldon Avenue, plus eight along the east fence reserved for drop-off between 6:30 and 9:00am.",
    door: "Use the front door under the green awning. The playground-side door is exit-only and alarmed.",
  },

  /**
   * The month stamped on the openings block. Recency is itself a trust signal,
   * so it is the month of the day the page is rendered (lib/openings-dates.ts),
   * never a typed-in month that goes stale.
   */
  get openingsUpdated() {
    return openingsMonth();
  },

  media: {
    hero: {
      /**
       * The poster, its dimensions and its alt text are the `hero` entry in
       * content/images.ts — the single image manifest. Only the optional clip
       * is a config switch, because it is a yes/no decision rather than an
       * asset the photographer is briefed to deliver.
       *
       * Drop a short muted clip of a real morning here — e.g. "/video/morning.mp4".
       * components/hero-media.tsx then plays it above 768px, only on connections
       * that have not asked to save data, and never under reduced motion.
       * Null renders the poster alone, which is the current state.
       */
      video: null as string | null,
    },
  },

  /**
   * BRAND TOKENS.
   * Every value here is emitted as a CSS custom property on :root.
   * Contrast ratios were measured, not assumed — see `npm run verify`.
   */
  brand: {
    /** Deep warm emerald green. High contrast against white. */
    primary: "#1B4D3E",
    primaryDark: "#12392D",
    primaryTint: "#F0F6F3",
    /** Terracotta orange accent. High contrast >= 4.5:1 against white. */
    accent: "#B34426",
    accentDark: "#8C3016",
    /**
     * The CTA label and any text sitting on the primary fill.
     */
    onAccent: "#FFFFFF",
    onPrimary: "#FFFFFF",
    /** Warm ivory page background, warm charcoal ink. */
    bg: "#FFFDF9",
    surface: "#FFFFFF",
    ink: "#1F2421",
    inkMuted: "#5A635E",
    line: "#E4ECE7",

    /* Warm, rich green grounds */
    ground: "#1E4636",
    deep: "#163B2D",

    /**
     * Warm light sand tint for section background rhythm.
     */
    sand: "#F6F1E6",
    /** Text set on ground or deep. */
    onGround: "#FFFDF9",

    /* Warm golden amber brass accents */
    brass: "#E5A329",
    brassDark: "#7C560E",
    /** Muted status tones. */
    statusGood: "#155C40",
    statusGoodBg: "#E6F4ED",
    statusWait: "#945012",
    statusWaitBg: "#FAF0E3",
    /** Focus ring. */
    focus: "#B34426",
  },
} as const;

export type Site = typeof site;

/**
 * Keeps search engines out of a demo deployment.
 *
 * Bridgewood Academy does not exist, but Elmhurst does, and the license number
 * on this site is not a real one. A demo sitting on a public URL should never
 * turn up in a parent's search results for childcare. Set NEXT_PUBLIC_NOINDEX
 * to "true" on any deployment that is a demo.
 *
 * Default is indexable, because that is the correct behaviour for the real
 * center this template becomes.
 */
export const noIndex = ["true", "1", "yes"].includes(
  (process.env.NEXT_PUBLIC_NOINDEX ?? "").trim().toLowerCase(),
);

/**
 * The one-line answer to "is my child safe here", rendered above the fold.
 *
 * The ratio claim is deliberately terse. Written out long — "1:3 infant ratio
 * — Illinois allows 1:4" — it needs 648px of a 652px column, so the flex gaps
 * pushed it onto a second line and stranded a separator at the end of the
 * first; and in the mobile grid it wrapped to two lines while its neighbour
 * took one, which read as broken alignment rather than as four deliberate
 * facts. Measured at 595px, this form sits on one line in the desktop row and
 * one line in every mobile cell. Same claim, same two numbers.
 */
export const trustLine = [
  "1:3 infants · IL requires 1:4",
  `Licensed #${site.license.number}`,
  "NAEYC accredited",
  `Open ${site.hours.short}`,
];

/**
 * The home page <title>, in full. Every other route builds its title from
 * `%s · <name>`, so this is the one place the brand could end up twice — it is
 * set as an `absolute` title in app/(site)/page.tsx to stop the template
 * applying on top of it. Kept here so a re-skin cannot leave it stale.
 * 51 characters for Bridgewood; verify.mjs asserts it stays under 60.
 */
export const homeTitle = `${site.name} · ${site.titleTagline}`;

export const fullAddress = `${site.address.street}, ${site.address.city}, ${site.address.state} ${site.address.zip}`;

/** Deep link that opens the native maps app on a phone. */
export const mapsHref = `https://maps.google.com/?q=${encodeURIComponent(
  `${site.name}, ${fullAddress}`,
)}`;

/* The static map image — never an iframe — is `map` in content/images.ts. */
