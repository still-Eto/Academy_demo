/**
 * Regenerates PHOTO-SWAP.md from content/images.ts.
 *
 *     node scripts/photo-swap-doc.mjs
 *
 * The shot list is generated rather than written by hand for one reason: a
 * hand-written list drifts. Adding an image to the manifest adds a row here,
 * changing an aspect ratio changes the row, and a photographer working from
 * this document is working from what the site actually renders.
 */

import { writeFile } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

import { allImages, site } from "./manifest.mjs";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");

/** 1200x800 -> "3:2". The number the photographer frames to. */
const gcd = (a, b) => (b ? gcd(b, a % b) : a);
const ratio = (w, h) => {
  const g = gcd(w, h);
  return `${w / g}:${h / g}`;
};

const table = (rows) =>
  [
    "| Slot | Status | Aspect | Time of day | The shot to take |",
    "|---|---|---|---|---|",
    ...rows.map(
      (i) =>
        `| \`${i.id}\` | ${i.photo ? `stock: \`${i.photo.source}\`` : "**empty — needs a shot**"} | **${ratio(i.width, i.height)}** (${i.width}×${i.height}) | ${i.timeOfDay} | ${i.subject}${i.lcp ? " **— LCP element. Supply it optimized.**" : ""} |`,
    ),
  ].join("\n");

const of = (kind) => allImages.filter((i) => i.kind === kind);

const filled = allImages.filter((i) => i.photo);
const empty = allImages.filter((i) => !i.photo);

const doc = `# Photo swap — the shot list

**Generated from \`content/images.ts\` and \`content/photo-briefs.ts\`. Do not edit
this file by hand.** Run \`npm run photo-doc\` after changing either.

${allImages.length} image slots. **${filled.length} carry a photograph today;
${empty.length} are wordless graded blocks** waiting for one.

---

## What is in the slots right now

${filled.length} slots hold free-license stock, graded into one look by
\`npm run photos:build\`. The originals are committed under
\`public/photos/_source\`; nothing is hotlinked, so the site cannot load broken
on a prospect's office WiFi.

Every remaining slot renders a **wordless** block in the brand palette. No
captions, no dimensions, no "photograph to come" — a placeholder that announces
itself in words is worse than an empty one, because it tells the visitor the
rest of the page is provisional too.

### Licensing

| Source | Licence | Attribution |
|---|---|---|
| Pexels | Pexels License — free for commercial use | Not required |
| Unsplash | Unsplash License — free for commercial use | Not required |
| Pixabay | Pixabay Content License | Not required |

Four shortlisted images were **rejected** rather than used. The reasons are
recorded in \`scripts/fetch-photography.mjs\` and are worth reading before
sourcing the next batch: one was Unsplash+ (a paid licence, not the free one),
one showed a masked child, one carried another preschool's logo across every
shirt in frame, and one was too small with legible foreign-language signage.

## How a swap works

1. Put the real file in \`public/photos/_source\`.
2. Open \`content/images.ts\`, find the slot, point \`photo.source\` at it.
3. Correct \`alt\` — it describes what is in the frame, for a parent using a
   screen reader. Not the shot brief.
4. \`npm run photos:build\`.

The container already holds the aspect ratio, so nothing on the page moves when
a block becomes a photograph. Measured: CLS 0.0000 across the swap.

**Aspect ratios are not suggestions.** They are locked at the container. A file
delivered at a different ratio is cropped to fit by \`object-fit: cover\` — it
will not break the layout, but it will lose whatever is at the edges.

## Direction

Rooms, light through windows, hands, materials on a table, the playground, a
teacher mid-sentence. Faces of children only where they read as authentic and
non-identifying. No posed group shots. Candid and documentary framing always
beats posed.

**Reject rather than include:** visible logos or branding (including another
school's uniform), wall calendars or signage with legible text, dated interiors,
face masks, and the over-lit grinning-model look that reads as stock on sight.

---

## THE GAP — what to source next, in priority order

**Every photograph on this site shows children doing an activity. Not one shows
a room.** For this niche that is backwards. Safety and cleanliness outrank
curriculum and cost for most parents, and the two pages carrying that argument
— \`/safety\` and the building section of \`/about\` — have no photography at all.
A director evaluating this demo will look for a picture of the space, because
that is what her own parents ask her for.

Four shots close it. All four are findable on the same free-license sources.

| Priority | Shot | Slot it fills | Why |
|---|---|---|---|
| **1** | An empty, clean, well-lit classroom — low tables, cubbies, natural light, no people | \`room.acorn.1\` or \`building.corridor\` | The single most valuable missing image on the site |
| **2** | The entrance or a secure door with a keypad | \`building.entry\` | Carries the whole safety argument in one frame |
| **3** | An outdoor playground, empty, soft surfacing visible | \`building.playground\` | The question every parent asks second |
| **4** | A nap room or cot area, empty and tidy | \`room.acorn.2\` | Answers the infant-room question the activity shots cannot |

**Staff portraits: four slots, no source images, and deliberately left empty.**
Cropping a child's face out of an activity shot into a teacher portrait is
obvious and it damages the page it sits on. The blocks stay; the name, role,
credential and tenure beside them carry the trust, and the face is a bonus. If
portraits are sourced later they must share one light temperature, or the page
will look like six different websites stitched together.

---

## Hero — ${of("hero").length} file

${table(of("hero"))}

**Optional video.** Set \`site.media.hero.video\` in \`content/site.config.ts\` to a
path like \`/video/morning.mp4\` and the hero plays it above 768px, only when the
connection has not asked to save data and the visitor has not asked for reduced
motion. 6–10 seconds, muted, no cuts, no music.

## Classrooms — ${of("room").length} files

The first photograph of each pair also appears beside the parent quotes on the
home page, so make it the stronger of the two.

${table(of("room"))}

## The building — ${of("building").length} files

${table(of("building"))}

## Staff portraits — ${of("portrait").length} slots, all empty

Square crop, head and shoulders. Shoot all ${of("portrait").length} in one
session, same background, same light — a page of portraits taken on different
days looks like a page of stock. ${site.director.name}'s carries the most
weight: it appears on \`/book-a-tour\`, \`/about\`, \`/staff\` and inside the tour
confirmation.

${table(of("portrait"))}

## Other — ${of("map").length + of("mark").length} files

${table([...of("map"), ...of("mark")])}

## App icon

\`app/icon.svg\` (64×64) is generated from the brand palette by
\`npm run placeholders\`. Replace it with the center's real mark if they have
one; otherwise leave it, since it re-skins automatically.
`;

await writeFile(join(root, "PHOTO-SWAP.md"), doc, "utf8");
console.log(`PHOTO-SWAP.md written — ${allImages.length} shots`);
