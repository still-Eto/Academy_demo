/**
 * Generates every placeholder image in /public/img as a local SVG.
 *
 *     node scripts/generate-placeholders.mjs
 *
 * The list of files and their dimensions come from content/images.ts — the
 * same manifest the site renders from — so a slot added there produces a
 * placeholder here with no second edit. Slots that carry a real photograph
 * (`photo` set on the manifest entry) are skipped; those are built by
 * scripts/build-photography.mjs.
 *
 * These are deliberately NOT grey boxes, and they are deliberately WORDLESS.
 * A graded block in the brand palette reads as a design choice. A grey
 * rectangle reads as a broken build, and a caption reading "PHOTOGRAPH TO
 * COME" reads as an unfinished project — which is worse than either, because
 * it tells the visitor in words that nothing above it is real.
 *
 * Nothing here hotlinks Unsplash, Pexels or any external host.
 */

import { mkdir, writeFile } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

import { allImages, palette } from "./manifest.mjs";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const outDir = join(root, "public");

/* ---------- color helpers ---------- */
const hex = (h) => [1, 3, 5].map((i) => parseInt(h.slice(i, i + 2), 16));
const toHex = (rgb) => "#" + rgb.map((v) => Math.round(v).toString(16).padStart(2, "0")).join("");
const mix = (a, b, t) => toHex(hex(a).map((v, i) => v + (hex(b)[i] - v) * t));

const tone = {
  /* Warm, tinted, unmistakably part of this brand — not #EEE. */
  base: mix(palette.bg, palette.primary, 0.12),
  light: mix(palette.bg, palette.primary, 0.04),
  shape: mix(palette.bg, palette.primary, 0.24),
  accent: mix(palette.bg, palette.accent, 0.22),
  deep: mix(palette.bg, palette.primary, 0.46),
  rule: mix(palette.bg, palette.primary, 0.3),
  ink: mix(palette.bg, palette.ink, 0.78),
  quiet: mix(palette.bg, palette.ink, 0.5),
};

/**
 * A wordless graded block.
 *
 * NOT ONE CHARACTER OF TEXT RENDERS HERE, and none ever should. The previous
 * version printed the shot brief, the time of day and the pixel dimensions
 * into the artwork — production notes rendered as page content. A director
 * reading "PHOTOGRAPH TO COME" in the hero learns she is looking at a mockup,
 * and every claim above it gets re-read as hypothetical.
 *
 * The shot brief lives in content/photo-briefs.ts and in PHOTO-SWAP.md — a
 * build-time module no component imports, so none of that language is bundled.
 * These blocks are role="presentation"; the <img alt> around them names them.
 */
function scene({ width: w, height: h }) {
  const r = Math.round(Math.min(w, h) * 0.19);
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}" fill="none" role="presentation">
  <defs>
    <linearGradient id="grade" x1="0" y1="0" x2="0.65" y2="1">
      <stop offset="0" stop-color="${tone.light}"/>
      <stop offset="1" stop-color="${tone.base}"/>
    </linearGradient>
  </defs>
  <rect width="${w}" height="${h}" fill="url(#grade)"/>
  <path d="M0 0 H${Math.round(w * 0.58)} L${Math.round(w * 0.2)} ${h} H0 Z" fill="${tone.light}" opacity="0.5"/>
  <circle cx="${Math.round(w * 0.71)}" cy="${Math.round(h * 0.36)}" r="${r}" fill="${tone.shape}" opacity="0.7"/>
  <rect x="0" y="${h - Math.max(2, Math.round(h * 0.006))}" width="${w}" height="${Math.max(2, Math.round(h * 0.006))}" fill="${tone.deep}" opacity="0.45"/>
</svg>
`;
}

/**
 * A portrait stand-in: shoulders and a head, no face, in brand tones.
 *
 * Deliberately uncaptioned. Portraits render between 48px (the trust row on
 * /book-a-tour) and about 226px (the teacher strip), and a caption sized to be
 * legible at 226px is an illegible smear at 48px — which is precisely the
 * "looks like a rendering failure" problem. A clean silhouette in the brand
 * palette reads as intentional at every size it is actually used at. The
 * person is still named in `alt` and in PHOTO-SWAP.md.
 */
function portrait({ width: size }) {
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 ${size} ${size}" fill="none" role="presentation">
  <rect width="${size}" height="${size}" fill="${tone.base}"/>
  <path d="M0 0 H${Math.round(size * 0.52)} L${Math.round(size * 0.2)} ${size} H0 Z" fill="${tone.light}"/>
  <circle cx="${size / 2}" cy="${Math.round(size * 0.38)}" r="${Math.round(size * 0.16)}" fill="${tone.shape}"/>
  <path d="M${Math.round(size * 0.16)} ${size} a${Math.round(size * 0.34)} ${Math.round(size * 0.32)} 0 0 1 ${Math.round(size * 0.68)} 0 Z" fill="${tone.shape}"/>
</svg>
`;
}

/** A static map. Never an iframe — this links out to the maps app. */
function map({ width: w, height: h }) {
  const roads = [];
  for (let i = 1; i < 6; i++) {
    const y = Math.round((h / 6) * i);
    roads.push(`<line x1="0" y1="${y}" x2="${w}" y2="${y}" stroke="${tone.rule}" stroke-width="${i === 3 ? 14 : 6}"/>`);
  }
  for (let i = 1; i < 8; i++) {
    const x = Math.round((w / 8) * i);
    roads.push(`<line x1="${x}" y1="0" x2="${x}" y2="${h}" stroke="${tone.rule}" stroke-width="${i === 4 ? 14 : 6}"/>`);
  }
  /* Wordless, like everything else. The link around it already says
     "Open in maps" in the page's own type. */
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}" fill="none" role="img">
  <rect width="${w}" height="${h}" fill="${tone.base}"/>
  ${roads.join("\n  ")}
  <rect x="${Math.round(w * 0.5)}" y="${Math.round(h * 0.5)}" width="${Math.round(w * 0.125)}" height="${Math.round(h * 0.167)}" fill="${tone.shape}"/>
  <path d="M${Math.round(w / 2)} ${Math.round(h * 0.5 - 78)} c-26 0-46 20-46 46 0 33 46 74 46 74s46-41 46-74c0-26-20-46-46-46Z" fill="${palette.accent}"/>
  <circle cx="${Math.round(w / 2)}" cy="${Math.round(h * 0.5 - 32)}" r="17" fill="${palette.bg}"/>
</svg>
`;
}

/** The director's signature. Replaced by a scan of the real one. */
function signature({ width: w, height: h }) {
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 320 96" fill="none" role="img">
  <path d="M14 68c10-30 18-44 24-44 5 0 4 12 1 24-3 13-2 18 3 18 7 0 12-12 16-26 3-11 6-16 9-16 4 0 4 8 2 18-2 11 0 16 5 16 8 0 13-14 17-14 3 0 3 6 1 10-2 5 0 8 4 8 6 0 10-8 14-18 3-8 6-12 9-12 4 0 4 7 2 14-2 8 0 12 5 12 7 0 12-9 18-20 4-8 8-12 11-12 4 0 3 8 1 15-2 8 1 12 6 12 9 0 20-9 34-27" stroke="${palette.ink}" stroke-width="3.2" stroke-linecap="round" stroke-linejoin="round" opacity="0.82"/>
  <path d="M232 72c14 4 28 3 44-4" stroke="${palette.ink}" stroke-width="3.2" stroke-linecap="round" opacity="0.82"/>
</svg>
`;
}

/* ---------- generate every entry in the manifest ---------- */
let written = 0;
for (const image of allImages) {
  const body =
    image.kind === "portrait"
      ? portrait(image)
      : image.kind === "map"
        ? map(image)
        : image.kind === "mark"
          ? signature(image)
          : scene(image);

  const target = join(outDir, image.src.replace(/^\//, ""));
  await mkdir(dirname(target), { recursive: true });
  await writeFile(target, body, "utf8");
  written++;
}

/* The app icon is the logomark, standalone. Not a photograph, so not in the
   manifest — but it does re-skin with the palette, so it is generated here. */
await writeFile(
  join(root, "app", "icon.svg"),
  `<svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 32 32" fill="none">
  <rect width="32" height="32" rx="8" fill="${palette.primary}"/>
  <g stroke="${palette.bg}" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
    <path d="M6.5 12.5h19"/>
    <path d="M9.4 23.5v-4.6a3 3 0 0 1 6 0v4.6"/>
    <path d="M17.6 23.5v-4.6a3 3 0 0 1 6 0v4.6"/>
    <path d="M6.5 23.5h19"/>
  </g>
</svg>
`,
  "utf8",
);

console.log(
  `Wrote ${written} placeholders + app/icon.svg from content/images.ts using palette ${palette.primary} / ${palette.accent}`,
);
