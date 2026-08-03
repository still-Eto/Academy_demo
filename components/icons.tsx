/**
 * Every icon on the site, inline. No icon package is installed, because
 * importing one wholesale is the single easiest way to blow the 120KB
 * first-load budget on the home page.
 *
 * All icons are decorative by default (aria-hidden). Where an icon carries
 * meaning on its own — the phone button in the action bar — the parent
 * element carries the accessible name.
 */

type IconProps = { className?: string };

const base = "shrink-0";

export function ChevronDown({ className = "h-4 w-4" }: IconProps) {
  return (
    <svg viewBox="0 0 20 20" fill="none" aria-hidden="true" className={`${base} ${className}`}>
      <path d="m5 7.5 5 5 5-5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function Check({ className = "h-4 w-4" }: IconProps) {
  return (
    <svg viewBox="0 0 20 20" fill="none" aria-hidden="true" className={`${base} ${className}`}>
      <path d="m4 10.5 4 4 8-9" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function Calendar({ className = "h-4 w-4" }: IconProps) {
  return (
    <svg viewBox="0 0 20 20" fill="none" aria-hidden="true" className={`${base} ${className}`}>
      <rect x="2.5" y="4" width="15" height="13.5" rx="2" stroke="currentColor" strokeWidth="1.8" />
      <path d="M2.5 8h15M6.5 2.5V5m7-2.5V5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  );
}

export function Clock({ className = "h-4 w-4" }: IconProps) {
  return (
    <svg viewBox="0 0 20 20" fill="none" aria-hidden="true" className={`${base} ${className}`}>
      <circle cx="10" cy="10" r="7.5" stroke="currentColor" strokeWidth="1.8" />
      <path d="M10 5.75V10l3 2" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function Phone({ className = "h-5 w-5" }: IconProps) {
  return (
    <svg viewBox="0 0 20 20" fill="none" aria-hidden="true" className={`${base} ${className}`}>
      <path
        d="M6.6 3H4.2A1.7 1.7 0 0 0 2.5 4.9c.3 3 1.6 5.8 3.7 7.9 2.1 2.1 4.9 3.4 7.9 3.7a1.7 1.7 0 0 0 1.9-1.7v-2.4a1.2 1.2 0 0 0-1-1.2l-2-.4a1.2 1.2 0 0 0-1.2.5l-.6.9a9.6 9.6 0 0 1-4-4l.9-.6a1.2 1.2 0 0 0 .5-1.2l-.4-2a1.2 1.2 0 0 0-1.2-1Z"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function ArrowRight({ className = "h-4 w-4" }: IconProps) {
  return (
    <svg viewBox="0 0 20 20" fill="none" aria-hidden="true" className={`${base} ${className}`}>
      <path d="M3.5 10h13m0 0-4.5-4.5M16.5 10 12 14.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function Menu({ className = "h-6 w-6" }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" className={`${base} ${className}`}>
      <path d="M4 7h16M4 12h16M4 17h16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

export function Close({ className = "h-6 w-6" }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" className={`${base} ${className}`}>
      <path d="m6 6 12 12M18 6 6 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

export function MapPin({ className = "h-5 w-5" }: IconProps) {
  return (
    <svg viewBox="0 0 20 20" fill="none" aria-hidden="true" className={`${base} ${className}`}>
      <path d="M10 18s6-5.1 6-9.4A6 6 0 0 0 4 8.6C4 12.9 10 18 10 18Z" stroke="currentColor" strokeWidth="1.7" strokeLinejoin="round" />
      <circle cx="10" cy="8.5" r="2.2" stroke="currentColor" strokeWidth="1.7" />
    </svg>
  );
}

export function Shield({ className = "h-5 w-5" }: IconProps) {
  return (
    <svg viewBox="0 0 20 20" fill="none" aria-hidden="true" className={`${base} ${className}`}>
      <path d="M10 2.5 3.75 5v5c0 3.4 2.5 6.5 6.25 7.5 3.75-1 6.25-4.1 6.25-7.5V5L10 2.5Z" stroke="currentColor" strokeWidth="1.7" strokeLinejoin="round" />
      <path d="m7.5 10 1.8 1.8L13 8" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

/* --------------------------------------------------------------------------
   The four safety marks.

   One set, drawn to one specification: a 24 viewbox, 1.4 stroke, round caps
   and joins, no fills and no two-tone. Thin enough to read as a drawn mark
   rather than a UI affordance, which is the difference between four claims
   about a building and four rows of a settings screen.

   They are used in exactly one place — the safety claims on the home page.
   Ornament that appears once is decoration; these appear four times, as a set,
   which is what makes them structural.
   -------------------------------------------------------------------------- */
const mark = {
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  /* 1.5 rather than the 1.4 these were first drawn at. Thin is the register;
     invisible is not. At the 36px these render at, 1.4 in a 24 grid is a
     0.6px hairline after scaling and the shapes stopped being identifiable —
     the fingerprint read as smudge and the plate as a target. */
  strokeWidth: 1.5,
  strokeLinecap: "round",
  strokeLinejoin: "round",
} as const;

/** A door with a keypad beside it. Arrival and pickup. */
export function DoorKeypad({ className = "h-9 w-9" }: IconProps) {
  return (
    <svg {...mark} aria-hidden="true" className={`${base} ${className}`}>
      <path d="M4.5 20.5V4.8a1.3 1.3 0 0 1 1.3-1.3h6.9a1.3 1.3 0 0 1 1.3 1.3v15.7" />
      <path d="M3 20.5h13" />
      <circle cx="11.4" cy="12.4" r="1" />
      <rect x="17.5" y="6.5" width="4.5" height="7.5" rx="1.2" />
      <path d="M19 9h1.5M19 11.4h1.5" />
    </svg>
  );
}

/**
 * A fingerprint. Background checks.
 *
 * Four concentric arcs and a core, rather than the anatomically-correct whorl
 * it started as — at 36px the accurate version is six strokes inside 20px and
 * resolves to a grey blob.
 */
export function Fingerprint({ className = "h-9 w-9" }: IconProps) {
  return (
    <svg {...mark} aria-hidden="true" className={`${base} ${className}`}>
      <path d="M12 10.8v5.4" />
      <path d="M8.7 11.7a3.3 3.3 0 0 1 6.6 0v3.1" />
      <path d="M5.7 12a6.3 6.3 0 0 1 12.6 0v4.4" />
      <path d="M2.8 12.3a9.2 9.2 0 0 1 6-8.6" />
      <path d="M21.2 12.3a9.2 9.2 0 0 0-6-8.6" />
      <path d="M8.7 19.8a6 6 0 0 0 .6-2" />
      <path d="M15.3 19.4a9 9 0 0 0 .5-1.6" />
    </svg>
  );
}

/**
 * A notice on a wall with a photograph on it. Allergies.
 *
 * The claim is "allergies are posted in the room, with a photograph", so the
 * mark is the posted notice — a framed card with a portrait square and two
 * lines of writing. The plate-and-leaf it replaces was read as a target at
 * card size and said "food" rather than "posted where you can see it".
 */
export function PostedNotice({ className = "h-9 w-9" }: IconProps) {
  return (
    <svg {...mark} aria-hidden="true" className={`${base} ${className}`}>
      <rect x="3.5" y="4" width="17" height="16" rx="1.6" />
      <rect x="6.3" y="7" width="5.4" height="5.4" rx="1" />
      <path d="M14.4 8.2h3.4M14.4 11.2h3.4" />
      <path d="M6.3 15.6h11.5M6.3 17.9h7.6" />
    </svg>
  );
}

/** A thermometer with a scale. Illness thresholds. */
export function Thermometer({ className = "h-9 w-9" }: IconProps) {
  return (
    <svg {...mark} aria-hidden="true" className={`${base} ${className}`}>
      <path d="M9.4 13.9V5a2.6 2.6 0 0 1 5.2 0v8.9a4.3 4.3 0 1 1-5.2 0Z" />
      <path d="M12 16.6V8.4" />
      <path d="M17 6.4h3.5M17 9.4h2.3M17 12.4h3.5" />
    </svg>
  );
}

/**
 * The mark: a two-arch viaduct — a bridge, for Bridgewood.
 * Drawn with currentColor and the page background token, so it re-skins with
 * the palette like everything else.
 */
export function Logomark({ className = "h-8 w-8" }: IconProps) {
  return (
    /*
      `logomark` carries `--logomark-void`, the colour of the arches cut out of
      the tile. It is the page background on a light header and the dark ground
      on the overlay header — see globals.css. Hard-coded to `--color-bg` the
      mark went off-white-on-off-white the moment the nav moved onto the hero.
    */
    <svg
      viewBox="0 0 32 32"
      fill="none"
      aria-hidden="true"
      className={`logomark ${base} ${className}`}
    >
      <rect width="32" height="32" rx="8" fill="currentColor" />
      <g
        stroke="var(--logomark-void)"
        strokeWidth="2.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M6.5 12.5h19" />
        <path d="M9.4 23.5v-4.6a3 3 0 0 1 6 0v4.6" />
        <path d="M17.6 23.5v-4.6a3 3 0 0 1 6 0v4.6" />
        <path d="M6.5 23.5h19" />
      </g>
    </svg>
  );
}
