/**
 * ============================================================================
 *  THE IMAGE MANIFEST
 * ============================================================================
 *  Every image on the site is described exactly once, here. Nothing else in
 *  the codebase names a file under /public/img.
 *
 *  TO SWAP A PLACEHOLDER FOR A REAL PHOTOGRAPH:
 *    1. Drop the file into /public/photos/_source.
 *    2. Point `photo.source` on that one entry below at it.
 *    3. Correct `alt` — it describes what is in the frame, for a parent using
 *       a screen reader. Not the shot brief.
 *    4. npm run photos:build
 *  That is the whole operation. No component changes, and no layout shift,
 *  because `width`/`height` here drive an aspect-ratio box on the container —
 *  see components/managed-image.tsx.
 *
 *  The shot brief for each slot — what to photograph, and when — lives in
 *  content/photo-briefs.ts, which no component imports, so that language is
 *  never bundled and never reaches a browser.
 *
 *  Exactly one entry may carry `lcp: true`. It is the only image that gets
 *  `priority`; everything else is lazy. `npm run verify` asserts both.
 * ============================================================================
 */

import { named } from "./rooms";
import { site } from "./site.config";

export type ImageKind = "hero" | "room" | "building" | "portrait" | "map" | "mark";

export type Orientation = "landscape" | "portrait" | "square";

/**
 * A real photograph filling this slot.
 *
 * `source` is a filename in /public/photos/_source. `npm run photos:build`
 * grades it and writes /public/photos/<slot>-<width>.{avif,webp,jpg} at the
 * slot's exact declared aspect ratio. Absent means the slot renders the
 * wordless graded block instead — which is the right answer whenever the only
 * available photograph would be the wrong age, the wrong room, or carrying
 * another school's branding.
 */
export type Photo = {
  source: string;
  /** Rendered widths to emit. Smallest first. */
  widths: number[];
  /**
   * Which exposure target this slot is matched to.
   *
   * Every image is pulled toward a mean luminance so that no frame reads
   * brighter or flatter than the one beside it — that match is most of what
   * stops a set of stock photographs looking like a set of stock photographs.
   * But there are two sets here, not one, and holding them to a single number
   * is what a build script does when nobody has told it there is art direction.
   *
   *   "daylight"  the rooms, the cards, the hero, the empty room. Window-lit,
   *               matched to each other.
   *   "low-key"   the playground at dusk, in its two crops. Matched to each
   *               other, and to a target well below the daylight one. Grading
   *               these to the daylight number would take a photograph whose
   *               whole value is its shadow and turn it into an overcast
   *               afternoon.
   *
   * Default is "daylight".
   */
  tone?: "daylight" | "low-key";
  /**
   * Where the crop is anchored when the source ratio differs from the slot's.
   *
   * "attention" finds the busiest region, which is usually the faces — but it
   * is the wrong choice for a portrait source with people low in the frame,
   * where it cheerfully crops to the wall behind them. Both portrait sources
   * here use "center" for exactly that reason.
   *
   * "west" and "east" exist for the two crops that turn a landscape frame into
   * a portrait one. Neither automatic strategy can do that job: on the hero,
   * "attention" takes the teacher's face and leaves the book — the thing she is
   * pointing at, and the only reason the photograph means anything — outside
   * the frame, while "center" takes the child in the middle and loses both.
   *
   * US spelling, translated to sharp's own in the build script, so the
   * US-English check over the source tree stays strict.
   */
  crop?: "attention" | "entropy" | "center" | "north" | "south" | "west" | "east";
};

export type ManagedImage = {
  /** Manifest key, injected below. Also the filename stem of the derivatives. */
  id: string;
  /**
   * Path under /public for the wordless block that stands in until a
   * photograph exists.
   *
   * OPTIONAL, and the seventeen staff portraits are why. A slot that has no
   * photograph normally wants a block at the right aspect ratio, because the
   * layout has to hold its shape either way. A portrait slot does not: an empty
   * portrait renders as an initials monogram (see ManagedAvatar), which is a
   * better answer than a face-shaped grey blank and does not need a file behind
   * it. Seventeen byte-identical 342-byte silhouettes sat in public/img/staff/
   * for exactly as long as this field was required, referenced by nothing.
   *
   * Absent means "there is no stand-in and none is wanted". `npm run verify`
   * checks that every src which IS declared resolves to a real file.
   */
  src?: string;
  /** Set when a real photograph fills this slot. See `Photo` above. */
  photo?: Photo;
  /** What a screen reader says. Describe the photograph, not the intent. */
  alt: string;
  orientation: Orientation;
  kind: ImageKind;
  /** Intrinsic pixels. The ratio of these two is locked at the container. */
  width: number;
  height: number;
  /** The one LCP image. Only this entry may be rendered with `priority`. */
  lcp?: true;
};

/**
 * An entry as written below, before `id` is injected from its key. Declaring
 * the id twice — once as the key, once in the body — is exactly the kind of
 * duplication that goes stale.
 */
type Declared = Omit<ManagedImage, "id">;

const landscape = (w = 1200, h = 800) => ({ width: w, height: h, orientation: "landscape" as const });
const square = (size = 600) => ({ width: size, height: size, orientation: "square" as const });

/* -------------------------------------------------------------------------
   The detail strip.

   Four square crops, edge to edge, in one row on the home page. They are the
   only images on the site closer than about six feet from a child, and that
   proximity is the entire point of them: five wides carrying fifteen routes is
   what made the page read as a building rather than a school.

   1:1 rather than 4:3 for two reasons. A square is the shape that survives
   being four-up on a desktop and two-up on a phone without either row becoming
   a letterbox — and it is visibly not the ratio of anything else on the site,
   so the strip reads as a deliberate device rather than four more cards.

   800px is the widest they are ever rendered: four across a 1568px shell is
   392 CSS pixels, so 800 covers 2x. Nothing here needs a 2400px derivative.
   ------------------------------------------------------------------------- */
const details = {
  "detail.paint": {
    src: "/img/rooms/maple-1.svg",
    photo: {
      source: "hands-white-paint-table.jpg",
      widths: [400, 800],
      /* Portrait source, hands dead centre. "attention" goes to the high-
         contrast printed sheet in the top left corner instead. */
      crop: "center",
    },
    alt: "Two children's hands flat on a wooden table covered in white paint, one palm turned up",
    kind: "room" as const,
    ...square(800),
  },
  "detail.clay": {
    src: "/img/rooms/maple-1.svg",
    photo: {
      source: "hands-clay-board.jpg",
      widths: [400, 800],
      crop: "attention",
    },
    alt: "A child's hands pressing down into a lump of white clay on a board, fingers stained with paint",
    kind: "room" as const,
    ...square(800),
  },
  "detail.pots": {
    src: "/img/rooms/oak-2.svg",
    photo: {
      source: "paint-pots-overhead.jpg",
      widths: [400, 800],
      /* The frame is a tall overhead. The square wants the middle third, where
         the spilled blue and the jar of brushes are; "attention" takes the
         white palette at the bottom and loses every hand in the picture. */
      crop: "center",
    },
    alt: "Looking down on three children's hands, open pots of poster paint and brushes standing in a jar, with spilled blue paint across the paper",
    kind: "room" as const,
    ...square(800),
  },
  "detail.drawing": {
    src: "/img/rooms/maple-2.svg",
    photo: {
      source: "hands-crayons-drawing.jpg",
      widths: [400, 800],
      /* "attention" reads the dark window grille at the top right as the
         busiest region. The subject is the paper, which is the middle. */
      crop: "center",
    },
    alt: "Looking down on a large sheet of paper covered in crayon flowers, with two children's hands still drawing on it",
    kind: "room" as const,
    ...square(800),
  },
} satisfies Record<string, Declared>;

/* -------------------------------------------------------------------------
   Hero

   Two slots, one photograph.

   The hero is now 88vh of full-bleed image, and 88vh is a very different shape
   on the two devices that matter. At 1568x745 the box is 1568x656 — wider than
   16:9. At 390x844 it is 390x717 — taller than it is wide. `object-fit: cover`
   on a single 16:9 file would scale that landscape frame to 717px tall, which
   makes it 1274px wide, and then throw away 70% of the width to fit 390. The
   teacher's hand on the page, which is the entire subject, lands outside the
   crop.

   So the same source is cropped twice at build time — 16:9 for the desktop
   band, 3:4 for the phone — and components/hero-media.tsx picks between them
   with a `media` attribute on the <source> and on the preload, so exactly one
   of the two is ever fetched. Neither is a runtime crop and neither is an
   upscale; both come out of the same 3000px original.
   ------------------------------------------------------------------------- */
const hero = {
  hero: {
    src: "/img/hero-bridgewood.svg",
    photo: {
      source: "teacher-reading-with-children.jpg",
      widths: [960, 1280, 1600, 2000, 2560],
      /* "center", not "attention". The busiest region of this frame is the
         bookshelf behind the group; attention crops to it and cuts the
         teacher's hand off the bottom of the band. */
      crop: "center",
    },
    alt: "A teacher pointing at a page while three children lean in to look at the book",
    kind: "hero" as const,
    /*
      2560x1200, not 16:9. The slot ratio has to be near the ratio it is
      actually rendered at, because `object-fit: cover` crops away whatever the
      difference is. 88vh at 1568x745 is a 2.39:1 band; a 16:9 file scaled to
      cover it loses 226px off the height, and what is in the bottom 226px of
      this frame is the teacher's hand on the page — the subject. At 2.13:1 the
      loss is 79px and the hand stays in.
    */
    width: 2560,
    height: 1200,
    orientation: "landscape" as const,
    lcp: true as const,
  },
  "hero.mobile": {
    src: "/img/hero-bridgewood.svg",
    photo: {
      source: "teacher-reading-with-children.jpg",
      widths: [420, 640, 840, 1080],
      crop: "west",
    },
    alt: "A teacher pointing at a page while three children lean in to look at the book",
    kind: "hero" as const,
    width: 1080,
    height: 1440,
    orientation: "portrait" as const,
  },
} satisfies Record<string, Declared>;

/* -------------------------------------------------------------------------
   The full-bleed bands.

   Four slots that exist only to be a section's ground rather than a picture
   inside one. Each is wider than any card ratio on the site, because a band
   that is 40vh tall and the full width of a 1568px monitor is a 4:1 shape and
   cropping a 3:2 photograph into it at render time throws away the framing the
   photographer chose.
   ------------------------------------------------------------------------- */
const bands = {
  "band.breath": {
    src: "/img/rooms/maple-2.svg",
    photo: {
      source: "hands-blocks-warm-table.jpg",
      widths: [720, 1200, 1800, 2400],
      /* Portrait source, subject in the lower half: "attention" finds the hand
         and the stack. */
      crop: "attention",
    },
    alt: "A child's hand setting a terracotta block on top of a stack of teal, sage and cream wooden blocks",
    kind: "room" as const,
    /* 3.2:1, not 2.4:1. A full-bleed band is 1568 wide and about 300 tall on a
       desktop — a 5.2:1 slice — and `object-fit: cover` throws away whatever
       the file has spare. At 2.4:1 that was 43% of the height, and what it took
       was the row of blocks along the bottom. Declaring the slot nearer the
       shape it is actually rendered at is the same lesson as the hero. */
    ...landscape(2400, 750),
  },
  "band.safety": {
    src: "/img/building/corridor.svg",
    photo: {
      source: "empty-room-daylight.jpg",
      widths: [720, 1200, 1800, 2400],
      /* The source is 16:9, so the 2:1 band is chosen on the vertical axis and
         only north/south/center move it. The top third is bare white wall and
         ceiling; "south" takes the half with the room in it — table, chairs,
         shelving, rug, and the patch of sun on the floor. */
      crop: "south",
    },
    alt: "An empty classroom with a round table and six child-height chairs, materials on open shelves, and morning sun on the floor",
    kind: "building" as const,
    ...landscape(2400, 900),
  },
  "band.closing": {
    src: "/img/building/playground.svg",
    photo: {
      source: "playground-golden-hour.jpg",
      widths: [720, 1200, 1800, 2400],
      crop: "center",
      tone: "low-key",
    },
    alt: "Low evening sun coming through the trees behind the playground slide",
    kind: "building" as const,
    ...landscape(2400, 1200),
  },
} satisfies Record<string, Declared>;

/* -------------------------------------------------------------------------
   Classrooms — two per room. The first of each pair also appears beside the
   parent quotes on the home page, so it should be the stronger of the two.
   ------------------------------------------------------------------------- */
const rooms = {
  /*
    Both Acorn slots were wordless blocks for a good reason, now spent.

    The reason was age: every photograph in the set showed a toddler or a
    preschooler, a parent of a six-week-old spots that instantly, and a wrong
    frame here would have undermined the 1:3 infant ratio printed beside it.
    An empty slot cost nothing; a wrong one would have cost the room.

    These two are infants, from one shoot, and neither shows a face — so there
    is no age for a parent to argue with. What they are NOT is a photograph of
    this room: they are close crops on a rug and a wood floor, and the alt text
    says a rug and a wood floor. The claim the page makes is the ratio, which is
    printed; the photograph is only asked to show a baby at floor level, which
    is what it does.
  */
  "room.acorn.1": {
    src: "/img/rooms/acorn-1.svg",
    photo: {
      source: "infant-blocks-floor.jpg",
      widths: [400, 760, 1200],
      /* A 3:2 slot out of a 2:3 source keeps 44% of the height, so the choice
         here is which 44%. "attention" reads the woven rug as the busiest
         region and crops to carpet. "north" was worse: it took the top of the
         frame, which is torso, and left the hands and the block on the bottom
         edge — a close-up of a baby's middle. "center" is the band with the
         hands, the block and the first row of rug in it. */
      crop: "center",
    },
    alt: "A seated baby turning a wooden picture block over in both hands, more blocks on the rug in front",
    kind: "room" as const,
    ...landscape(),
  },
  "room.acorn.2": {
    src: "/img/rooms/acorn-2.svg",
    photo: {
      source: "infant-alphabet-blocks.jpg",
      widths: [400, 760, 1200],
      crop: "center",
    },
    alt: "A baby sitting barefoot on a woven rug with painted wooden blocks scattered within reach",
    kind: "room" as const,
    ...landscape(),
  },
  "room.sunflower.1": {
    src: "/img/rooms/sunflower-1.svg",
    photo: {
      source: "toddler-with-wooden-toys.jpg",
      widths: [400, 760, 1200],
      crop: "attention",
    },
    alt: "A toddler at a round table reaching for a wooden toy truck",
    kind: "room" as const,
    ...landscape(),
  },
  /* The brief for this slot asks for the sensory table. Nothing in the free
     libraries is a sensory table in use — they are all either an empty tub or a
     kitchen. A child at the top of this room's age band with both hands on the
     material is the same claim, honestly made. */
  "room.sunflower.2": {
    src: "/img/rooms/sunflower-2.svg",
    photo: {
      source: "toddler-stacking-rings.jpg",
      widths: [400, 760, 1200],
      crop: "attention",
    },
    alt: "A toddler on a jute mat threading a wooden ring onto a post, alphabet puzzle pieces behind",
    kind: "room" as const,
    ...landscape(),
  },
  "room.maple.1": {
    src: "/img/rooms/maple-1.svg",
    photo: {
      source: "girl-painting.jpg",
      widths: [400, 760, 1200],
      crop: "center",
    },
    alt: "A child at a paint-covered table, brush in hand, jars of poster paint in front of her",
    kind: "room" as const,
    ...landscape(),
  },
  "room.maple.2": {
    src: "/img/rooms/maple-2.svg",
    /* The warmth frame. The children in it read as two to four, which is this
       room, so it sits here rather than beside a quote from an infant parent. */
    photo: {
      source: "teacher-on-the-floor-with-children.jpg",
      widths: [400, 760, 1200],
      crop: "center",
    },
    alt: "A teacher sitting on the floor with four children, sorting wooden shapes on a rug",
    kind: "room" as const,
    ...landscape(),
  },
  "room.oak.1": {
    src: "/img/rooms/oak-1.svg",
    photo: {
      source: "child-cutting-with-help.jpg",
      widths: [400, 760, 1200],
      crop: "attention",
    },
    alt: "An adult's hands steadying a child's hands on a pair of scissors at a wooden table",
    kind: "room" as const,
    ...landscape(),
  },
  /* The old hero. It is a good photograph of a group at a table and a poor
     photograph to build a 88vh dark opening out of — evenly lit, everyone at
     the same distance, no shadow anywhere in it. That is exactly right on a
     room card, which is where it now lives. */
  "room.oak.2": {
    src: "/img/rooms/oak-2.svg",
    photo: {
      source: "teacher-and-children-painting.jpg",
      widths: [400, 760, 1200],
      crop: "attention",
    },
    alt: "A teacher at a low table with five children, painting, with a window behind them",
    kind: "room" as const,
    ...landscape(),
  },
  /* Both from the 8422xxx shoot, which also supplies room.maple.2 — so the
     light on this page is the light on that one, and neither reads borrowed.
     The A–Z chart in both frames was checked at full resolution and is English;
     the reading frames from the OTHER classroom shoot were not, and the note in
     scripts/fetch-photography.mjs records which and why. */
  "room.summit.1": {
    src: "/img/rooms/summit-1.svg",
    photo: {
      source: "alphabet-chart-lesson.jpg",
      widths: [400, 760, 1200],
      crop: "attention",
    },
    alt: "Two teachers holding up an illustrated alphabet chart in front of a seated group of children",
    kind: "room" as const,
    ...landscape(),
  },
  "room.summit.2": {
    src: "/img/rooms/summit-2.svg",
    photo: {
      source: "letter-lesson-seated.jpg",
      widths: [400, 760, 1200],
      /* Native 3:2, so the crop barely moves and any strategy would do. The
         letters the teachers hold up are single cards rather than the A–Z chart
         in room.summit.1, and the magnetic board behind them is thrown far
         enough out of focus that nothing on it resolves at card width. */
      crop: "attention",
    },
    alt: "Six children on low chairs seen from behind, watching two teachers hold up letter cards",
    kind: "room" as const,
    ...landscape(),
  },
  "room.after-school.1": {
    src: "/img/rooms/after-school-1.svg",
    photo: {
      source: "children-cutting-paper.jpg",
      widths: [400, 760, 1200],
      crop: "attention",
    },
    alt: "Three school-age children cutting green paper at a long table by a window",
    kind: "room" as const,
    ...landscape(),
  },
  "room.after-school.2": {
    src: "/img/rooms/after-school-2.svg",
    alt: `The gym at ${site.shortName}, set up for the after-school hour`,
    kind: "room" as const,
    ...landscape(),
  },
} satisfies Record<string, Declared>;

/* -------------------------------------------------------------------------
   The building
   ------------------------------------------------------------------------- */
const building = {
  "building.entry": {
    src: "/img/building/entry.svg",
    alt: `The ${site.shortName} entry vestibule, with the sign-in desk and the keypad by the inner door`,
    kind: "building" as const,
    ...landscape(),
  },
  "building.corridor": {
    src: "/img/building/corridor.svg",
    alt: `The ${site.shortName} corridor, with classroom doors and cubbies along one wall`,
    kind: "building" as const,
    ...landscape(),
  },
  /* Same frame as `band.closing`, cropped 3:2 for the two-up grid on /about
     rather than 2:1 for the closing band. One evening, two shapes. */
  "building.playground": {
    src: "/img/building/playground.svg",
    photo: {
      source: "playground-golden-hour.jpg",
      widths: [400, 760, 1200],
      crop: "center",
      tone: "low-key",
    },
    alt: "The playground climbing structure and slide at the end of the day, backlit by low sun",
    kind: "building" as const,
    ...landscape(),
  },
  "building.kitchen": {
    src: "/img/building/kitchen.svg",
    alt: `The ${site.shortName} kitchen, with a stainless steel prep counter and the menu board above it`,
    kind: "building" as const,
    ...landscape(),
  },
} satisfies Record<string, Declared>;

/* -------------------------------------------------------------------------
   Staff portraits.
   Square crop, head and shoulders, ONE session, one background, one light.
   A page of portraits taken on different days looks like a page of stock.
   ------------------------------------------------------------------------- */
const staffPortraits = [
  ["marisol-vega", "Marisol Vega", "Director"],
  ["ellen-brzozowski", "Ellen Brzozowski", "Office Manager"],
  ["tanya-okafor", "Tanya Okafor", `Lead Teacher, ${named("acorn")}`],
  ["priya-raghavan", "Priya Raghavan", `Teacher, ${named("acorn")}`],
  ["renata-alvarez", "Renata Alvarez", `Lead Teacher, ${named("sunflower")}`],
  ["jo-feldman", "Jo Feldman", `Teacher, ${named("sunflower")}`],
  ["camille-boyd", "Camille Boyd", `Lead Teacher, ${named("maple")}`],
  ["hector-salas", "Hector Salas", `Teacher, ${named("maple")}`],
  ["nadia-haddad", "Nadia Haddad", `Lead Teacher, ${named("oak")}`],
  ["will-turnbull", "Will Turnbull", `Teacher, ${named("oak")}`],
  ["grace-yun", "Grace Yun", `Lead Teacher, ${named("summit")}`],
  ["marcus-bell", "Marcus Bell", `Teacher, ${named("summit")}`],
  ["deion-pratt", "Deion Pratt", "After-School Coordinator"],
  ["sofia-nakamura", "Sofia Nakamura", "After-School Teacher"],
  ["angie-prokop", "Angie Prokop", "Floating Teacher"],
  ["sam-whitaker", "Sam Whitaker", "Floating Teacher"],
  ["rosa-delgado", "Rosa Delgado", "Cook"],
] as const;

/*
  No `src`. These seventeen entries carried a path to seventeen identical
  342-byte grey silhouettes, and nothing rendered them — ManagedAvatar has drawn
  an initials monogram from the person's name since the day it was written. The
  files stayed because the type required the field and `npm run verify` checked
  that the field resolved, so a dead reference kept seventeen dead files alive.

  The day real portraits exist, they arrive the same way every other photograph
  does: drop them in _source, add `photo` here, run `npm run photos:build`. The
  component already branches on `photo` and not on `src`.
*/
const portraits = Object.fromEntries(
  staffPortraits.map(([slug, name, role]) => [
    `staff.${slug}`,
    {
      alt: `${name}, ${role}`,
      kind: "portrait" as const,
      ...square(),
    },
  ]),
) as Record<`staff.${(typeof staffPortraits)[number][0]}`, Declared>;

/* -------------------------------------------------------------------------
   Everything else
   ------------------------------------------------------------------------- */
const other = {
  map: {
    src: "/img/map-bridgewood.svg",
    alt: `Map showing ${site.name} at ${site.address.street} in ${site.address.city}, ${site.address.state}`,
    kind: "map" as const,
    ...landscape(1200, 720),
  },
  signature: {
    src: "/img/marisol-signature.svg",
    alt: `${site.director.name}'s signature`,
    kind: "mark" as const,
    ...landscape(320, 96),
  },
} satisfies Record<string, Declared>;

/**
 * Every entry carries its own key as `id`, injected here rather than typed out
 * twice. `id` is also the filename stem of the graded derivatives, which is
 * what lets a component build a srcset without knowing the build script's
 * naming convention.
 */
const declared = {
  ...hero,
  ...bands,
  ...details,
  ...rooms,
  ...building,
  ...portraits,
  ...other,
};

export const images = Object.fromEntries(
  Object.entries(declared).map(([id, value]) => [id, { ...value, id }]),
) as { [K in keyof typeof declared]: (typeof declared)[K] & { id: K } };

export type ImageId = keyof typeof images;

/** Typed lookup. A bad id is a compile error, not a broken image at runtime. */
export const img = (id: ImageId): ManagedImage => images[id];

/** The two photographs for a room, in order. */
export const roomPhotos = (slug: string): ManagedImage[] =>
  [`room.${slug}.1`, `room.${slug}.2`]
    .filter((id): id is ImageId => id in images)
    .map((id) => images[id]);

export const staffPhoto = (slug: string): ManagedImage =>
  images[`staff.${slug}` as ImageId] ?? images["staff.marisol-vega"];

/**
 * The director's portrait, resolved from her name rather than hard-coded, so a
 * re-skin that changes `site.director` picks up the right entry as soon as the
 * staff list carries it.
 */
const slugify = (s: string) =>
  s
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");

export const directorImage: ManagedImage =
  images[`staff.${slugify(site.director.name)}` as ImageId] ?? images["staff.marisol-vega"];

export const heroImage = images.hero;
/** The phone crop of the same frame. See the note above the `hero` block. */
export const heroImageMobile = images["hero.mobile"];
export const mapImage = images.map;
export const signatureImage = images.signature;

/** The full-bleed bands, by the section they belong to. */
export const bandImages = {
  breath: images["band.breath"],
  safety: images["band.safety"],
  closing: images["band.closing"],
} as const;

/**
 * The four detail crops, in the order they appear across the strip.
 *
 * Order is composition, not chronology: paint, clay, pots, blocks puts the one
 * frame with three children in it — and the only one with any motion — third,
 * where the eye lands after it has already been drawn across two quiet ones.
 */
export const detailImages = [
  images["detail.paint"],
  images["detail.clay"],
  images["detail.pots"],
  images["detail.drawing"],
] as const;

/**
 * The path stem of a slot's graded derivatives, e.g. "/photos/room-oak-1".
 * scripts/build-photography.mjs writes "<stem>-<width>.{avif,webp,jpg}".
 */
export const photoStem = (image: ManagedImage) => `/photos/${image.id.replace(/\./g, "-")}`;

/** Every entry, for the shot list and for `npm run verify`. */
export const allImages: ManagedImage[] = Object.values(images);

/** Exactly one. Asserted by verify.mjs so a second `priority` cannot creep in. */
export const lcpImages = allImages.filter((i) => i.lcp);
