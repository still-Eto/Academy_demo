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
import { fileURLToPath, pathToFileURL } from "node:url";

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

  /* ------------------------------------------------------------- the strip */

  /**
   * THE DETAIL STRIP — four square crops on the home page.
   *
   * The site's problem was never that the photography was too dark. It was that
   * five frames carried fifteen routes, and every one of them was a wide: a room,
   * a group, a playground. Nothing on the site was closer than about six feet
   * from a child. A strip of four tight crops of hands and materials is the
   * cheapest possible answer, because it costs one band of vertical space and
   * reads as evidence that someone was actually in the room.
   *
   * Selection rule for all four, applied before download rather than after: the
   * frame contains hands doing something, or material visibly in use. No empty
   * corners, no arranged-and-unused toys, no studio white. Three of the four are
   * paint or clay, which is on purpose — mess is the thing the site did not have
   * — and the fourth is wood, so the strip is not four photographs of the same
   * afternoon.
   */
  {
    file: "hands-white-paint-table.jpg",
    url: pexels(35842218, 2000),
    page: "https://www.pexels.com/photo/creative-child-hand-painting-on-wooden-table-35842218/",
    licence: "Pexels License",
    use:
      "Detail strip 1. Two children's hands flat on a warm wooden table smeared with white " +
      "paint, one palm up, handprints around them. No faces. The wood is almost exactly the " +
      "table tone in the Maple Room card, which is what lets a 1:1 crop sit beside a 3:2 one.",
  },
  {
    file: "hands-clay-board.jpg",
    url: pexels(35842244, 2000),
    page: "https://www.pexels.com/photo/child-sculpting-colorful-clay-masterpiece-35842244/",
    licence: "Pexels License",
    use:
      "Detail strip 2. A child's two hands pressing into white clay on a board, fingers " +
      "stained with the last colour, dried smears of pink and ochre around the edge. Same " +
      "shoot as 35842218 — shared light, which is most of why the strip reads as one room.",
  },
  {
    file: "paint-pots-overhead.jpg",
    url: pexels(8540366, 2000),
    page: "https://www.pexels.com/photo/people-holding-a-painting-materials-8540366/",
    licence: "Pexels License",
    use:
      "Detail strip 3. Straight down onto kraft paper: three children's hands, open poster " +
      "paint pots, brushes standing in a jar of purple, and a run of spilled blue across the " +
      "middle. The only frame in the set with three children in it, and the only one with " +
      "motion. Kraft brown is the warm ground the strip needs at its centre.",
  },
  {
    file: "hands-crayons-drawing.jpg",
    url: pexels(5093988, 2000),
    page: "https://www.pexels.com/photo/crop-anonymous-kid-drawing-on-white-paper-with-color-wax-crayons-5093988/",
    licence: "Pexels License",
    use:
      "Detail strip 4. Straight down onto a warm wooden table: a big sheet of paper with a " +
      "child's own crayon flowers on it, two hands still working and a third entering from " +
      "the left edge. The drawing is genuinely a child's, which is the part that cannot be " +
      "faked and the part a parent reads first.",
  },

  /* -------------------------------------------------- the rooms that had none */

  /**
   * THE ACORN ROOM, 6 weeks – 15 months.
   *
   * Both Acorn slots shipped as wordless blocks, and the manifest gave the
   * reason: every photograph in the set showed a toddler or a preschooler, and a
   * parent of a six-week-old spots an age mismatch instantly. That reasoning was
   * right, and it is now obsolete rather than wrong — these two frames are
   * unmistakably infants, and neither one shows a face, so there is no age to
   * argue with. Same shoot, so they match each other on the page.
   *
   * Neither is shot in a classroom. That is survivable here and would not be on
   * a wide: both are cropped close enough that the only setting information is a
   * woven rug and a wood floor, and the alt text says exactly that rather than
   * claiming a room.
   */
  {
    file: "infant-blocks-floor.jpg",
    url: pexels(4964355, 2000),
    page: "https://www.pexels.com/photo/baby-playing-with-wooden-blocks-on-a-rug-4964355/",
    licence: "Pexels License",
    use:
      "Acorn Room, 6 weeks – 15 months. A seated infant, framed from the chest down, both " +
      "hands turning a wooden picture block, more blocks on the rug in front. The body reads " +
      "infant beyond argument — which is the whole reason this slot could finally be filled.",
  },
  {
    file: "infant-alphabet-blocks.jpg",
    url: pexels(4964482, 2000),
    page: "https://www.pexels.com/photo/adorable-baby-sitting-on-a-rug-and-playing-with-wooden-blocks-4964482/",
    licence: "Pexels License",
    use:
      "Acorn Room, second slot. Same infant, same shoot, landscape: bare feet, a hand on a " +
      "block, five painted wooden blocks scattered across a woven rug with warm boards behind.",
  },

  /**
   * THE SUMMIT ROOM, 4 – 5 years.
   *
   * Also two wordless blocks until now. Both frames come from the 8422xxx shoot,
   * which already supplies room.maple.2 — so the light on the Summit page
   * matches the light on the Maple page, and neither looks borrowed.
   */
  {
    file: "alphabet-chart-lesson.jpg",
    url: pexels(8422164, 2000),
    page: "https://www.pexels.com/photo/teachers-engage-children-in-learning-alphabet-during-a-kindergarten-class-8422164/",
    licence: "Pexels License",
    use:
      "Summit Room, 4 – 5 years. Two teachers holding an illustrated A–Z chart, children " +
      "seated in front of them. The chart is English, checked at full resolution — see the " +
      "note on rejection 15, which is the same shot in a different room with Cyrillic on it.",
  },
  {
    file: "letter-lesson-seated.jpg",
    url: pexels(8422132, 2000),
    page: "https://www.pexels.com/photo/children-in-a-kindergarten-classroom-engaging-with-letters-during-a-learning-session-8422132/",
    licence: "Pexels License",
    use:
      "Summit Room, second slot. The same lesson, wider: two teachers holding single letter " +
      "cards and six children on low chairs with their backs to the camera. Native landscape, " +
      "which matters — see rejection 25 for the portrait frame of the same moment that could " +
      "not be cropped to a 3:2 card without losing either the teachers or the focal plane.",
  },

  /**
   * THE SUNFLOWER ROOM, second slot, 15 – 24 months.
   *
   * The brief asks for the sensory table. Nothing in the free libraries shows a
   * sensory table that is not either an empty tub or a stock kitchen. This is the
   * honest alternative: a child at the top of the room's age band, hands on the
   * material, no room claim in the frame.
   */
  {
    file: "toddler-stacking-rings.jpg",
    url: pexels(8504336, 2000),
    page: "https://www.pexels.com/photo/cute-toddler-engaging-with-wooden-toys-on-a-play-mat-8504336/",
    licence: "Pexels License",
    use:
      "Sunflower Room, 15 – 24 months. A toddler sitting on a jute mat threading wooden rings " +
      "onto a post, alphabet puzzle pieces scattered behind. Both hands on the material, and " +
      "the child is visibly walking-age rather than a preschooler.",
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
 *
 * ---- and on the pass that filled Acorn, Summit and the detail strip ----
 *
 * THE GENERAL FINDING, because it will save the next pass an hour: the 8535xxx
 * shoot has two halves. The craft and painting frames (8535164, 8535172,
 * 8535198, and the hero, 8535169) are clean and are what this site ships. Every
 * frame in that shoot that contains BOOKS or a book ledge carries Cyrillic
 * cover text, legible at card size. Four of them were checked at full
 * resolution and all four failed. Do not shortlist a reading frame from that
 * shoot without zooming the book first.
 *
 * 15. pexels.com/photo/…-8535181  (was Summit, and the best frame considered)
 *     A teacher and three children over an open picture book on a rug —
 *     compositionally the strongest candidate in the whole pass. The open book
 *     and the stack beside it read "Даниэль Сузанна Вернер" and a mirrored
 *     Cyrillic title. Same rule as 8535158.
 *
 * 16. pexels.com/photo/…-8535171  (was the second Summit candidate)
 *     Overhead, four children and a teacher around books on a rug, backs to
 *     camera, a wall of glass behind. The spine of the top book reads
 *     "…ижка без названия". Also, the rug is a hard cobalt that owns the frame
 *     and belongs to no palette on this site.
 *
 * 17. pexels.com/photo/…-8535156  (was the /safety sleeping room)
 *     A real nap room with stacked cots and visible spacing — precisely the
 *     photograph that page wants, since it makes an abstract claim about sleep
 *     checks concrete. The book ledge along the left wall is nine Cyrillic
 *     covers: "Сказки", "Лама в садике без мамы", "Софи". Legible.
 *
 * 18. pexels.com/photo/…-7207123 and …-7337617  (were the After-School gym)
 *     7207123 is a wall-bar gymnasium with worn parquet, dim tungsten and a
 *     painted club emblem — it reads as a municipal sports hall in about 1985,
 *     not an after-school club in Elmhurst. 7337617 is shot beautifully from
 *     the ceiling and the people in it are teenagers and adults, on a page for
 *     5 – 10 year olds. `room.after-school.2` stays a wordless block.
 *
 * 19. pexels.com/photo/…-9654179  (was also the gym)
 *     Three children with a skipping rope, and the automatic reject from the
 *     selection rule: shot in a studio against seamless white with hoops taped
 *     to the wall as graphic props. Nothing in it is a place.
 *
 * 20. pexels.com/photo/…-9002692  (was detail strip 3, and it was excellent)
 *     A child's finger in a row of poster paint pots, blue apron, real mess.
 *     Everything the strip wants. It is working on a spread of German newsprint
 *     and "kehre" and a column of body text are legible under the paint. Same
 *     rule that disqualified the Korean worksheet in rejection 3. Replaced by
 *     8540366, which is on plain kraft paper.
 *
 * 21. pexels.com/photo/…-8924166  (was detail strip 4)
 *     Art supplies on warm wooden shelves — pencil pots, scissors, a tray of
 *     crayons. Rejected on the selection rule rather than on content: nothing
 *     in it is in use and nobody is in it. It is the "arranged and unused"
 *     frame the whole strip exists to be the opposite of.
 *
 * 23. pexels.com/photo/…-6952000  (SHIPPED as detail strip 4, then replaced)
 *     Two hands setting one faceted beech block on another — the right subject,
 *     and it rhymed with the block band. Rejected after grading, on the strip's
 *     own acceptance test: the ground is a child's white t-shirt, blown out, so
 *     the exposure match dragged it to x0.735 and it came off the pass at 143
 *     against a set sitting on 148. Beside three frames on wood, kraft and a
 *     paint-smeared board it was visibly the one cool grey rectangle in the row.
 *     A strip with no gaps between its four frames has nowhere to hide that.
 *     Replaced by 5093988, which is on warm wood. The lesson is narrower than
 *     "no white backgrounds": a frame whose background is 80% of its area and
 *     near-white cannot be exposure-matched into a warm set, because the match
 *     is computed on mean luminance and the background owns the mean.
 *
 * 25. pexels.com/photo/…-8422147  (SHIPPED as room.summit.2, then replaced)
 *     Rejected on shape and depth of field rather than on content, which is a
 *     failure mode worth naming because it is invisible until after grading.
 *     A tall portrait: teachers and the chart across the top third, four
 *     children's heads through the middle, activity rug filling the bottom
 *     half. A 3:2 card keeps 44% of that height and there is no 44% that works
 *     — "center" is the backs of four heads and a carpet with nothing
 *     happening in it, and "north" is the teachers, who are thrown a long way
 *     out of focus because the children are the focal plane. It is a good
 *     photograph of children, and every landscape crop of it is a photograph of
 *     something else. Replaced by 8422132, the same moment shot wide.
 *
 * 24. pexels.com/photo/…-7168894  (was the crayon frame, and the better photograph)
 *     A child's hand drawing on a colouring sheet on rich warm boards, loose
 *     crayons beside it. Better light than the frame that replaced it. The
 *     crayons are legibly wrappered "Crayola" along the right edge — the same
 *     rule as the JENGA blocks in rejection 9. Replaced by 5093988, where the
 *     crayons are in hands rather than laid out with their labels up.
 *
 * 22. pexels.com/photo/…-8422126  (was the /staff band)
 *     Two teachers and eight children in a real room, which is the shot that
 *     page wants. The wall behind them carries "I AM NOT YOUNG ENOUGH TO KNOW
 *     EVERYTHING" in a hand-lettered speech bubble, legible and centred. It is
 *     someone else's wall text and it would read as this school's motto.
 */

/*
  Only download when this file is RUN. `SOURCES` above is the licence record for
  the whole site, and scripts/credits.mjs imports it to generate
  public/img/CREDITS.md — which would have re-downloaded nineteen photographs
  every time the credits were regenerated, on a module whose entire point is
  that the originals are committed and never fetched again.
*/
const invokedDirectly =
  process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href;

if (invokedDirectly) {
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
}
