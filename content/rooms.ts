/**
 * The room name and its age range, defined once and never apart.
 *
 * This file exists because of one rule: a room name never appears anywhere on
 * the site without its age range beside it — `npm run verify`, check R1,
 * enforces it against every string literal in the codebase. Both the room data
 * (content/programs.ts) and the image manifest (content/images.ts) build their
 * prose from this table, so the pairing cannot drift between the two and the
 * alt text a screen reader hears carries the age range the sighted visitor
 * reads on the card.
 *
 * Splitting it out also breaks what would otherwise be an import cycle:
 * programs.ts needs the photographs, images.ts needs the age ranges.
 */

export const roomNames = {
  acorn: { label: "Acorn Room", ages: "6 weeks – 15 months" },
  sunflower: { label: "Sunflower Room", ages: "15 – 24 months" },
  maple: { label: "Maple Room", ages: "2 – 3 years" },
  oak: { label: "Oak Room", ages: "3 – 4 years" },
  summit: { label: "Summit Room", ages: "4 – 5 years" },
  "after-school": { label: "After-School Club", ages: "5 – 10 years" },
} as const;

export type RoomSlug = keyof typeof roomNames;

/** "Acorn Room, 6 weeks – 15 months" — the form used inside prose and alt text. */
export const named = (slug: RoomSlug) => `${roomNames[slug].label}, ${roomNames[slug].ages}`;
