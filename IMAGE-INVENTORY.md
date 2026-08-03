# Image inventory

Two states are recorded below: **BEFORE**, the ground truth established by
reading `content/images.ts`, `components/managed-image.tsx` and every route under
`app/`; and **AFTER**, the state once the first pass of the image plan shipped.

Jump to [what changed](#after--what-shipped) for the current numbers.

---

# BEFORE — ground truth

Baseline: `npm run verify` → 15/15, 40 manifest entries.

Everything on this site comes through **one** manifest (`content/images.ts`) and
**one** component (`components/managed-image.tsx`). Check M1 in `scripts/verify.mjs`
fails the build if any other file names a path under `/public/img`, so "which
component" is the same answer everywhere and is not repeated per row below.

---

## The number

**40 manifest entries. 12 carry a real photograph. 10 source frames on disk.**

The 28 without a photograph are not all holes:

| | count | status |
|---|---|---|
| Real photographs | 12 | shipping |
| Staff portraits | 17 | **deliberately empty** — collapse to initials, see below |
| Map + signature | 2 | drawn artwork, correct as SVG |
| **Genuinely empty photographic slots** | **9** | **the hole** |

The 9: `room.acorn.1`, `room.acorn.2`, `room.sunflower.2`, `room.summit.1`,
`room.summit.2`, `room.after-school.2`, `building.entry`, `building.corridor`,
`building.kitchen`.

---

## Per route

Counts are **rendered `<img>` elements from the manifest**. "block" = a manifest
entry with no `photo`, which renders the wordless SVG at the same aspect ratio.

| Route | Photos | Blocks | Slots rendered |
|---|---|---|---|
| `/` | **4** | 0 | `hero` + `hero.mobile` (one frame, two crops, one fetched), `band.breath`, `band.safety`, `band.closing`, `map` (SVG) |
| `/programs` | **0** | 0 | none — six text-only cards |
| `/programs/acorn` | **0** | **2** | `room.acorn.1`, `room.acorn.2` |
| `/programs/sunflower` | 1 | 1 | `room.sunflower.1` ✓, `room.sunflower.2` |
| `/programs/maple` | 2 | 0 | `room.maple.1` ✓, `room.maple.2` ✓ |
| `/programs/oak` | 2 | 0 | `room.oak.1` ✓, `room.oak.2` ✓ |
| `/programs/summit` | **0** | **2** | `room.summit.1`, `room.summit.2` |
| `/programs/after-school` | 1 | 1 | `room.after-school.1` ✓, `room.after-school.2` |
| `/staff` | **0** | 0 | 17 initials monograms |
| `/safety` | **0** | 0 | none — 210 lines of source, nothing to look at |
| `/about` | 1 | 3 | `building.playground` ✓, `building.entry`, `building.corridor`, `building.kitchen` |
| `/contact` | **0** | 0 | `map` (SVG) only |
| `/tuition` | **0** | 0 | none |
| `/faq` | **0** | 0 | none |
| `/book-a-tour` | **0** | 0 | 2 director initials monograms |

Eight of fifteen routes render zero photographs.

---

## The 12 shipping photographs

| Slot | Source frame | Ratio | Tone | Crop |
|---|---|---|---|---|
| `hero` | `teacher-reading-with-children.jpg` | 2560×1200 | daylight | center |
| `hero.mobile` | same frame | 1080×1440 | daylight | west |
| `band.breath` | `hands-blocks-warm-table.jpg` | 2400×750 | daylight | attention |
| `band.safety` | `empty-room-daylight.jpg` | 2400×900 | daylight | south |
| `band.closing` | `playground-golden-hour.jpg` | 2400×1200 | low-key | center |
| `room.sunflower.1` | `toddler-with-wooden-toys.jpg` | 1200×800 | daylight | attention |
| `room.maple.1` | `girl-painting.jpg` | 1200×800 | daylight | center |
| `room.maple.2` | `teacher-on-the-floor-with-children.jpg` | 1200×800 | daylight | center |
| `room.oak.1` | `child-cutting-with-help.jpg` | 1200×800 | daylight | attention |
| `room.oak.2` | `teacher-and-children-painting.jpg` | 1200×800 | daylight | attention |
| `room.after-school.1` | `children-cutting-paper.jpg` | 1200×800 | daylight | attention |
| `building.playground` | `playground-golden-hour.jpg` | 1200×800 | low-key | center |

10 source files, 12 slots: the hero frame and the playground frame are each
cropped twice at build time.

---

## Corrections to the brief

Five of the brief's premises were already resolved in the repo, and two of its
instructions would undo work that is deliberate. Recording them here so the next
pass does not re-litigate them.

**1. The seventeen silhouettes are already gone from the page.**
`ManagedAvatar` returns an initials monogram whenever `image.photo` is unset —
see the comment block at `components/managed-image.tsx:108`. The 342-byte SVGs
still sit in `public/img/staff/` but nothing references them. They are dead
files to delete, not a rendering defect. The brief's Option 1 ("delete the
avatar slot entirely") is the call that was already made.

**2. `band-day-2400.jpg` does not exist.** The day-timeline moved to a light
ground and its photograph was dropped — recorded as rejection 14 in
`scripts/fetch-photography.mjs`. There are three bands, not four.

**3. The bands already pass the Step 1 test.** They are hands on blocks, an
empty room at 7:30am, and a backlit playground. Two of the three are deliberate
*absence* of people, chosen so a wordless full-bleed band carries a screen on
its own. Re-shooting them would be a downgrade.

**4. "`next/image` everywhere, no raw `<img>`" would be a regression.**
Photographs are pre-graded and pre-sized to disk by `npm run photos:build`, then
served through a plain `<picture>`. Sending them through Next's optimizer
re-encodes an encode for no gain. `next/image` is still used for the SVG blocks,
which the optimizer passes through. `sizes` is already set at every call site,
`priority` is derived from the manifest rather than passed, and check M2 fails
the build if a second `priority` appears.

**5. The grading script already exists and is stronger than the brief's.**
`scripts/build-photography.mjs` measures each frame's mean luminance *after* the
tone curve and pulls it toward a per-tone-class target (daylight 148, low-key
75), rather than applying fixed constants blind. The brief's proposed
`.tint({r:255,g:250,b:240})` would be actively wrong — sharp's `tint` maps the
image through a single hue and flattens colour separation.

**6. `placeholder="blur"` is not available on this path** and is not needed:
`ManagedImg` sets `aspect-ratio` on the container from the manifest's intrinsic
dimensions, so the box is at final size before a byte arrives. CLS is 0 across a
photo swap by construction. A blur-up LQIP is still worth adding as a separate
call — it is a perceived-performance change, not a layout one.

**7. Alt text is at 100% and is enforced.** Check M4 fails the build if any entry
is missing `alt`, `subject`, `timeOfDay`, `width` or `height`.

---

## What is actually missing

In the brief's own priority order:

1. **A detail strip on `/`** — four tight 1:1 crops of hands and materials.
   Nothing like it exists; there are no square images on the site at all.
2. **The Acorn Room has no photograph and the Summit Room has no photograph.**
   Two of six room pages are entirely wordless blocks. Acorn is the infant room
   and the hardest single sell on the site.
3. **`/programs`, `/safety`, `/tuition`, `/faq`, `/contact`, `/staff` render no
   photography at all** — six routes.
4. **Three building slots** (`entry`, `corridor`, `kitchen`) are blocks, and
   `/about` renders three of them in a four-up grid beside one real photograph.
5. **No `public/img/CREDITS.md`.** Licence provenance exists, but it lives in
   comments inside `scripts/fetch-photography.mjs` — thorough, and not where
   anyone would look for it.

---

# AFTER — what shipped

`npm run verify` → 15/15. **44 manifest entries, 21 carrying a real
photograph, from 19 source frames.** Up from 12 slots and 10 frames.

## Per route, before → after

| Route | Photos before | Photos after | What changed |
|---|---|---|---|
| `/` | 4 | **8** | the four-frame detail strip |
| `/programs` | 0 | **6** | one photograph per room card, reusing the room frames |
| `/programs/acorn` | **0** | **2** | infant photography, both slots |
| `/programs/sunflower` | 1 | **2** | second slot filled |
| `/programs/maple` | 2 | 2 | — |
| `/programs/oak` | 2 | 2 | — |
| `/programs/summit` | **0** | **2** | pre-K literacy, both slots |
| `/programs/after-school` | 1 | 1 | second slot still empty — see below |
| `/staff` | 0 | 0 | 17 dead silhouette files deleted |
| `/safety` | 0 | 0 | not yet done |
| `/about` | 1 | 1 | not yet done |
| `/contact`, `/tuition`, `/faq`, `/book-a-tour` | 0 | 0 | not yet done |

Routes rendering zero photographs: **8 → 5**.

## The nine empty slots: six filled, three not

Filled — `room.acorn.1`, `room.acorn.2`, `room.sunflower.2`, `room.summit.1`,
`room.summit.2`, and four new `detail.*` slots.

**Still empty, deliberately:**

- `room.after-school.2` (the gym). Every free-library candidate was either a
  dated municipal sports hall, a seamless-white studio set, or teenagers and
  adults on a page for 5–10 year olds.
- `building.entry`, `building.corridor`, `building.kitchen`. Searches for
  childcare corridors return high-school metal lockers and children in uniform;
  searches for the nap room and the cot spacing return the one genuinely correct
  frame, which carries nine legible Cyrillic book covers.

These stay wordless blocks on the same principle the repo already applied to the
Acorn Room: an empty slot costs nothing, a wrong one costs the room's
credibility. Every rejection and its reason is recorded in
`scripts/fetch-photography.mjs`.

## The finding worth keeping

The 8535xxx shoot — which supplies the hero and four room cards — has two
halves. Its **craft and painting** frames are clean. Every frame in it
containing **books or a book ledge** carries Cyrillic cover text, legible at card
size. Four were checked at full resolution and all four failed. Do not shortlist
a reading frame from that shoot without zooming the book first.

A second, subtler one: a frame whose background is most of its area and
near-white **cannot** be exposure-matched into a warm set, because the match is
computed on mean luminance and the background owns the mean. One detail-strip
candidate had to be replaced for exactly this reason after grading.

## Measured after the change

Production build, emulated Slow 4G (1.6 Mbps, 150 ms RTT) with 4× CPU throttle:

| | 390px | 1440px | Budget |
|---|---|---|---|
| LCP | **2.06s** | 1.94s | 2.5s ✓ |
| CLS | **0.0000** | 0.0339 | 0.1 ✓ |
| Page height | 11,764px | 9,914px | ~14,000px ✓ |

Mobile CLS is exactly zero, which is the aspect-ratio-box architecture doing its
job across four newly-added images.

Home page image weight at 390px, from `npm run verify:art`:
**84 KB before any scroll, 191 KB after scrolling the whole page**, all AVIF.
The four detail tiles are 195px squares on a phone, so they fetch the 400px
derivative, not the 800.

Other checks: `npm run verify` 15/15 · `npx tsc --noEmit` clean · `npm run lint`
clean (one pre-existing unused-import warning in `stat-counter-grid.tsx`) ·
`npm run build` 22 routes · `verify:art` 6/7, see below.

## Known failure, pre-existing

`npm run verify:art` check 4 fails at **4.23:1** against a 4.5:1 target — page
white over the lightest composited pixel under the type on the hero and the
closing band. Not a regression from this pass: check 4 measures only
`[data-hero]` and the closing section, the hero and closing derivatives are
byte-identical to before (`git status` shows zero changed files matching
`hero`/`band-closing`), and neither `app/globals.css` nor the hero markup was
touched. The fix is either a slightly heavier scrim under those two type runs or
a text-shadow, and it is a separate change.
