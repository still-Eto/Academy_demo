/**
 * Downloads the source photography into /public/photos/_source.
 *
 *     npm run photos:fetch      # once, to populate the sources
 *     npm run photos:build      # grades them into what the site serves
 *
 * The originals are committed. The site never fetches from a third party at
 * runtime — a demo that loads broken images on a prospect's office WiFi is
 * worse than no demo.
 *
 * ---------------------------------------------------------------------------
 * LICENSING — every file below is free for commercial use, no attribution
 * required (Pexels License / Unsplash License / Pixabay Content License).
 * Checked individually rather than assumed. See REJECTED at the bottom for the
 * four shortlisted images that did not survive that check.
 * ---------------------------------------------------------------------------
 */

import { mkdir, writeFile } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const outDir = join(root, "public", "photos", "_source");

const UA = {
  "user-agent":
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
  /* Ask for JPEG explicitly. Pexels content-negotiates to AVIF otherwise,
     which would mean grading a lossy re-encode and then encoding again. */
  accept: "image/jpeg,image/*;q=0.8",
};

const pexels = (id, w = 2400) =>
  `https://images.pexels.com/photos/${id}/pexels-photo-${id}.jpeg?auto=compress&cs=tinysrgb&w=${w}`;

/*
  The five art-direction sources are pulled at 3000px rather than 2400. They are
  cropped harder than the originals — a 16:9 hero band out of a 3:2 frame throws
  away a third of the height before anything is resized — and starting wider is
  the difference between a 1600px hero derived from real pixels and one derived
  from an upscale.
*/

/**
 * Four of the eleven come from one Pexels shoot (8535xxx). That is deliberate:
 * a shared source shoot means shared light, and shared light is most of what
 * makes a set of stock images stop looking like a set of stock images.
 *
 * ---------------------------------------------------------------------------
 * THE ART-DIRECTION BATCH (five files, appended below the original six).
 *
 * The original six are bright, evenly-lit activity shots. They are correct for
 * the program cards and the room pages, where a parent wants to see the room in
 * daylight — and they are wrong for a full-bleed hero, a dark section ground or
 * a wordless photographic break, all of which need directional light, falling
 * shadow and a subject the background drops away from.
 *
 * Every candidate for those five slots was judged on the same five criteria, in
 * this order: low-key or directional light; shallow depth of field; candid,
 * nobody facing the camera; warm temperature; and room to crop wide. Rejections
 * are recorded in REJECTED below alongside the original four.
 * ---------------------------------------------------------------------------
 */
export const SOURCES = [
  {
    file: "teacher-and-children-painting.jpg",
    url: pexels(8535198),
    page: "https://www.pexels.com/photo/children-painting-in-kindergarten-8535198/",
    licence: "Pexels License",
    use: "Sunflower Room card. A teacher with five children at a table, in a room with a real window.",
  },
  {
    file: "toddler-with-wooden-toys.jpg",
    url: pexels(3661280),
    page: "https://www.pexels.com/photo/a-young-child-playing-with-wooden-toys-at-a-round-table-3661280/",
    licence: "Pexels License",
    use: "Sunflower Room, 15–24 months. Table height and toy scale match the age band.",
  },
  {
    file: "girl-painting.jpg",
    url: pexels(32255746),
    page: "https://www.pexels.com/photo/young-girl-engaged-in-colorful-art-activity-32255746/",
    licence: "Pexels License",
    use: "Maple Room, 2–3 years. Messy play.",
  },
  {
    file: "child-cutting-with-help.jpg",
    url: pexels(8535164),
    page: "https://www.pexels.com/photo/kids-on-a-table-holding-scissors-8535164/",
    licence: "Pexels License",
    use: "Oak Room, 3–4 years. An adult's hands guiding a child's on the scissors.",
  },
  {
    file: "children-cutting-paper.jpg",
    url: pexels(8535172),
    page: "https://www.pexels.com/photo/group-of-children-crafting-with-scissors-and-paper-in-a-classroom-setting-8535172/",
    licence: "Pexels License",
    use: "After-School Club, 5–10 years. Group work at a table.",
  },
  {
    file: "teacher-on-the-floor-with-children.jpg",
    url: pexels(8422262),
    page: "https://www.pexels.com/photo/woman-in-gray-shirt-sitting-beside-girl-in-yellow-shirt-8422262/",
    licence: "Pexels License",
    use: "Parent quotes on the home page. Warmth, not information.",
  },

  /* ---------------------------------------------------------------- the five */

  {
    file: "teacher-reading-with-children.jpg",
    url: pexels(8535169, 3000),
    page: "https://www.pexels.com/photo/a-woman-teaching-children-to-read-book-8535169/",
    licence: "Pexels License",
    use:
      "THE HERO. A teacher's finger on the page, three children leaning into the book. " +
      "Not one face is turned to the camera, which is the whole difference between a " +
      "photograph of a school and a photograph of a school being photographed. The " +
      "background falls away behind the group. Cropped 16:9 for the desktop hero and " +
      "3:4 for the phone, from this one frame, so both are the same moment.",
  },
  {
    file: "empty-room-daylight.jpg",
    url: pexels(8088099, 3000),
    page: "https://www.pexels.com/photo/brown-wooden-table-with-chairs-8088099/",
    licence: "Pexels License",
    use:
      "Safety, full-bleed under the four claims. A real room with nobody in it: one round " +
      "table, six child-height chairs, materials squared away on open shelving, and a " +
      "patch of morning sun on the floor from the window on the left. Tidy without being " +
      "staged, which is the only way a photograph can support a claim about what a room " +
      "is like when you walk into it.",
  },
  {
    file: "hands-blocks-warm-table.jpg",
    url: pexels(12956020, 3000),
    page: "https://www.pexels.com/photo/a-child-playing-with-wooden-blocks-12956020/",
    licence: "Pexels License",
    use:
      "The mid-page break — full-bleed, no text, about 40vh. A toddler's hand " +
      "setting a terracotta block on a stack of teal, sage and cream ones, on a " +
      "warm table, backlit, no face in the frame. The blocks are almost exactly " +
      "this site's palette, and the frame is bright — which is the point: the " +
      "band sits between two light sections and has to belong to them.",
  },

  {
    file: "playground-golden-hour.jpg",
    url: pexels(38690377, 3000),
    page: "https://www.pexels.com/photo/sunset-glow-on-playground-slide-in-suburban-park-38690377/",
    licence: "Pexels License",
    use:
      "The closing CTA, and the playground on /about. Low sun coming through the trees " +
      "behind the slide, everything else in shadow. The end of the day a parent is " +
      "actually picturing when they read 'come and see the room your child would be in'.",
  },
];

/**
 * REJECTED, and why. Recorded here rather than dropped silently, because the
 * reasons are the same ones that will disqualify the next batch.
 *
 * 1. unsplash.com/photos/…-8X07Pxtnr-c  (was the intended hero)
 *    Serves from plus.unsplash.com — Unsplash+, a PAID subscription licence,
 *    not the free Unsplash License. Not ours to use. Replaced by 8535198.
 *
 * 2. unsplash.com/photos/…-WTacXFjaF94  (was the Sunflower Room)
 *    Free licence, but the child is wearing a face mask, which dates the
 *    photograph to the pandemic on sight, and the setting is a plastic mall
 *    play area rather than a classroom. Replaced by 3661280.
 *
 * 3. pixabay.com/photos/kindergarden-child-laugh-2519212  (was the warmth slot)
 *    Free licence, but: 1280x720 is too small to serve a card at 2x, the
 *    worksheet under the child's hand carries legible Korean text, and the
 *    over-bright to-camera smile is exactly the "reads as stock on sight"
 *    look the brief rules out. Replaced by 8422262.
 *
 * 4. pexels.com/photo/…-28232751  (was the After-School Club)
 *    Free licence, but every child wears a uniform reading "GREEN GARDEN
 *    PRESCHOOL" over a tree logo — another school's branding, legible at card
 *    size, on a page selling this one. Replaced by 8535172.
 *
 * ---- and from the art-direction batch ----
 *
 * 5. pexels.com/photo/…-15052434  (was the strongest empty-room frame by far)
 *    Warm wood, low key, real montessori shelving, light raking in from one
 *    window — everything the brief asks for. It also carries "GEMS EĞİTİM
 *    MODELİ" on the wall and a string of Turkish flag bunting across the
 *    window, both legible at full-bleed width. Same rule as 28232751: another
 *    institution's identity, on a page selling this one. Replaced by 8924162.
 *
 * 6. pexels.com/photo/…-8535158  (was the second empty-room candidate)
 *    Free licence, clean room, but the display wall on the right is a grid of
 *    Cyrillic captions and photographs of named people. Legible, and not ours.
 *
 * 7. pexels.com/photo/…-8535620  (was the third)
 *    Free licence, but lit by four bare fluorescent tubes — the exact cool
 *    blue-white interior the brief rules out — and a LEGO box front is legible
 *    on the shelf.
 *
 * 8. pexels.com/photo/…-8535212  (was a hero candidate, and a good one)
 *    Four children at a full-height window, backs to camera, real directional
 *    light. Rejected on shape, not content: it is a 2:3 portrait frame whose
 *    subject sits in a narrow horizontal band, so the 16:9 hero crop keeps the
 *    children and loses the window that makes the photograph work.
 *
 * 9. pexels.com/photo/…-6087624  (was the mid-page break)
 *    Free licence, shallow depth, warm — but the blocks are stamped "JENGA"
 *    and the stamp is legible at the size a full-bleed band renders it.
 *
 * ---- and on the second pass, after the page read too cold ----
 *
 * 10. pexels.com/photo/…-8924162  (SHIPPED as the safety band, then replaced)
 *     My own selection, and the worst call in the set. Described in this file
 *     as "an empty room with the easels folded against the wall and one tall
 *     window doing all the lighting", which is true of the frame and not true
 *     of the 2:1 band cut out of it: that band is folded easels, a plastic tub
 *     of oddments, a waste bin, stacked plastic baskets and a blank white
 *     table filling the right third. A storage corner, directly beneath the
 *     words "four things you can check on the tour". Replaced by 8088099.
 *
 * 14. pexels.com/photo/…-6974741  (SHIPPED as the day-timeline ground, then dropped)
 *     A genuinely low-key frame and the best of its kind in the set — which is
 *     exactly why it had no home once the day timeline moved to a light ground.
 *     A photograph that only works under white type has nowhere to go on a page
 *     that stopped using white type below the fold. Removed rather than left in
 *     the manifest to be built and never fetched.
 *
 * 13. pexels.com/photo/…-7117354  (SHIPPED as the mid-page break, then replaced)
 *     Warm, sunlit, muted plum and terracotta blocks — and shot on weathered
 *     reclaimed barn board. It reads farmhouse, not classroom, and beside a
 *     photograph of an actual preschool room two sections later it belongs to a
 *     different site. Replaced by 12956020.
 *
 * 11. pexels.com/photo/…-7269700  (SHIPPED as the mid-page break, then replaced)
 *     A good photograph on a cold grey-white floor, between two warm sections,
 *     so it read as belonging to a different site. Also carries a legible
 *     product sticker on the toy in the lower left — the same rule that
 *     disqualified 28232751 and 6087624. Replaced by 7117354.
 *
 * 12. pexels.com/photo/…-38289173  (was the strongest safety-band candidate)
 *     Beautiful: sage wall, felt tree, cloud lights, warm oak, full-height
 *     glazing. It is also a 3D architectural render, not a photograph. On a
 *     page whose argument is "come and stand in the room", a room that does
 *     not exist is the one thing the photography cannot be.
 */

await mkdir(outDir, { recursive: true });
let failed = 0;
for (const s of SOURCES) {
  const res = await fetch(s.url, { headers: UA, redirect: "follow" });
  if (!res.ok) {
    console.error(`FAILED ${s.file}: HTTP ${res.status}`);
    failed++;
    continue;
  }
  const buf = Buffer.from(await res.arrayBuffer());
  if (buf[0] !== 0xff || buf[1] !== 0xd8) {
    console.error(`FAILED ${s.file}: not a JPEG (${res.headers.get("content-type")})`);
    failed++;
    continue;
  }
  await writeFile(join(outDir, s.file), buf);
  console.log(`${s.file.padEnd(40)} ${(buf.length / 1024).toFixed(0)} KB`);
}
console.log(`\n${SOURCES.length - failed}/${SOURCES.length} sources in public/photos/_source`);
process.exitCode = failed === 0 ? 0 : 1;
