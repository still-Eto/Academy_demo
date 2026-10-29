/**
 * The six rooms. Every number here is the single source of truth: ratios,
 * class sizes, weekly rates and availability are read from this file by the
 * home page, /programs, the six program pages, /safety and /tuition.
 *
 * RULE (enforced by scripts/verify.mjs): a room name never appears without its
 * age range beside it. `label` and `ages` travel together everywhere.
 *
 * Illinois minimums are 89 Ill. Adm. Code 407.190, verified 2026-08-01.
 * Where a room spans two age bands, Illinois applies the ratio and group size
 * of the YOUNGEST child in the group — that is the figure recorded here.
 */

import { roomPhotos, type ManagedImage } from "./images";
import { roomNames } from "./rooms";
import { nextOpeningDate, programYear } from "@/lib/openings-dates";

export type Availability =
  | { kind: "open"; spaces: number }
  | { kind: "opening"; spaces: number; from: string }
  | { kind: "waitlist"; note: string };

export type RhythmEntry = { time: string; what: string };

export type Program = {
  slug: string;
  label: string;
  /** Short age range. Always rendered beside `label`. */
  ages: string;
  /** Long form, for prose. */
  agesLong: string;
  ratio: string;
  /** Illinois legal minimum for the youngest child in this room. */
  stateRatio: string;
  classSize: number;
  /** Illinois maximum group size for the youngest child in this room. */
  stateMaxGroup: number;
  teachersInRoom: number;
  hours: string;
  rate5: number;
  rate3: number;
  availability: Availability;
  /** One sentence: what happens in this room. Used on the card. */
  oneLiner: string;
  intro: string;
  rhythm: RhythmEntry[];
  rhythmNote?: string;
  /** Parent language. Never developmental jargon. */
  outcomes: string[];
  included: string[];
  /** Slug of the room a child moves up to. */
  next: string | null;
  /** Straight out of content/images.ts — the one file a photo swap touches. */
  photos: ManagedImage[];
};

export const programs: Program[] = [
  {
    slug: "acorn",
    label: roomNames["acorn"].label,
    ages: roomNames["acorn"].ages,
    agesLong: "six weeks to fifteen months",
    ratio: "1:3",
    stateRatio: "1:4",
    classSize: 6,
    stateMaxGroup: 12,
    teachersInRoom: 2,
    hours: "6:30am – 6:00pm",
    rate5: 525,
    rate3: 370,
    availability: { kind: "waitlist", note: "about 6 weeks" },
    oneLiner:
      "Six babies, two teachers, and your child’s own eating and sleeping schedule rather than ours.",
    intro:
      "The Acorn Room runs on your baby’s clock, not a timetable. You tell us when she eats and when she sleeps, we write it down, and we follow it. Illinois allows one teacher for every four infants. We staff one for every three, and the same two teachers are in the room every day.",
    rhythm: [
      { time: "6:30", what: "Arrival. We read your overnight notes before you leave the room." },
      { time: "7:30", what: "Bottles and breakfast, on your baby’s schedule" },
      { time: "8:30", what: "Floor time — tummy time, mirrors, treasure baskets" },
      { time: "9:15", what: "First nap for most babies, in her own crib, the same crib every day" },
      { time: "10:30", what: "Outside in the infant yard, 20–30 minutes" },
      { time: "11:15", what: "Lunch — purees or table food, whichever stage you’re at" },
      { time: "12:00", what: "Second nap" },
      { time: "12:30", what: "We send you a photo and a written note" },
      { time: "2:00", what: "Books and songs, one teacher to one baby" },
      { time: "3:00", what: "Snack" },
      { time: "3:30", what: "Stroller walk or the infant yard again" },
      { time: "4:00", what: "Second note home — feeds, diapers, naps, mood" },
      { time: "4:30", what: "Quiet play. Families start arriving." },
      { time: "6:00", what: "Doors close" },
    ],
    rhythmNote:
      "Babies under about eight months ignore this list entirely, and that is fine. It is a description of the room, not a schedule your baby has to meet.",
    outcomes: [
      "Walking, or close to it",
      "Drinking from an open cup with a hand steadying it",
      "Feeding herself soft finger food",
      "Waving, pointing and reaching to ask for something",
      "Saying a handful of words your family recognizes",
      "Napping on a rhythm that also works at home on the weekend",
    ],
    included: [
      "Breakfast, lunch and two snacks, prepared in our kitchen",
      "Bottle warming and storage, and formula preparation if you supply the formula",
      "A written feed, nap and diaper log every day",
      "Two photos a day",
      "Sunscreen",
      "All books, materials and equipment",
    ],
    next: "sunflower",
    photos: roomPhotos("acorn"),
  },
  {
    slug: "sunflower",
    label: roomNames["sunflower"].label,
    ages: roomNames["sunflower"].ages,
    agesLong: "fifteen to twenty-four months",
    ratio: "1:4",
    stateRatio: "1:5",
    classSize: 8,
    stateMaxGroup: 15,
    teachersInRoom: 2,
    hours: "6:30am – 6:00pm",
    rate5: 475,
    rate3: 335,
    availability: {
      kind: "opening",
      spaces: 2,
      get from() {
        return nextOpeningDate();
      },
    },
    oneLiner:
      "Eight toddlers, two teachers, and ninety minutes outside every day in two doses.",
    intro:
      "Fifteen months to two years is the loudest, fastest year. The Sunflower Room is built for it: eight children, two teachers who stay all year, low furniture a toddler can climb without help, and two long stretches outdoors a day. Circle time is eight minutes, because that is honestly all a toddler has.",
    rhythm: [
      { time: "6:30", what: "Arrival and free play" },
      { time: "8:00", what: "Breakfast" },
      { time: "8:30", what: "Diapers, handwashing, songs" },
      { time: "9:00", what: "Circle — eight minutes, no longer" },
      { time: "9:15", what: "Outside, 45 minutes" },
      { time: "10:15", what: "Sensory table and art" },
      { time: "11:00", what: "Lunch at the table, a teacher sitting down eating the same food" },
      { time: "11:45", what: "Books, then cots down" },
      { time: "12:00", what: "Nap" },
      { time: "2:15", what: "Wake, diapers, snack" },
      { time: "3:00", what: "Outside, 45 minutes" },
      { time: "4:00", what: "Blocks, music and small-group play" },
      { time: "5:00", what: "Quiet books. Families start arriving." },
      { time: "6:00", what: "Doors close" },
    ],
    outcomes: [
      "Putting two words together — \"more milk\", \"Jo help\"",
      "Climbing the low structure without a hand",
      "Using a spoon with reasonable accuracy",
      "Getting her own shoes on, usually on the wrong feet",
      "Telling you the name of the friend she sat next to",
      "Handing you a book and turning the pages herself",
    ],
    included: [
      "Breakfast, lunch and two snacks",
      "All diapering supplies applied — but you supply diapers and wipes",
      "A daily note covering meals, naps, diapers and what she played with",
      "Sunscreen",
      "All art materials and books",
    ],
    next: "maple",
    photos: roomPhotos("sunflower"),
  },
  {
    slug: "maple",
    label: roomNames["maple"].label,
    ages: roomNames["maple"].ages,
    agesLong: "two to three years",
    ratio: "1:6",
    stateRatio: "1:8",
    classSize: 12,
    stateMaxGroup: 16,
    teachersInRoom: 2,
    hours: "6:30am – 6:00pm",
    rate5: 425,
    rate3: 300,
    availability: { kind: "open", spaces: 1 },
    oneLiner:
      "Twelve two-year-olds, two teachers, and the year most children finish toilet training.",
    intro:
      "This is the toilet-training year, and we do it with you rather than to you. Nobody has to be trained to start in the Maple Room. Illinois allows one teacher for every eight two-year-olds; we staff one for every six, which is the difference between a teacher who can take a child to the bathroom and a teacher who cannot leave the room.",
    rhythm: [
      { time: "6:30", what: "Arrival and free play" },
      { time: "8:00", what: "Breakfast" },
      { time: "8:30", what: "Toileting and handwashing" },
      { time: "9:00", what: "Circle and story, twelve minutes" },
      { time: "9:20", what: "Outside, 45 minutes" },
      { time: "10:15", what: "Small groups — art, the water table, puzzles" },
      { time: "11:15", what: "Lunch, served family-style at the table" },
      { time: "12:00", what: "Nap" },
      { time: "2:30", what: "Wake and snack" },
      { time: "3:00", what: "Outside, 45 minutes" },
      { time: "4:00", what: "Open centers — blocks, dress-up, books" },
      { time: "5:15", what: "Quiet table work. Families start arriving." },
      { time: "6:00", what: "Doors close" },
    ],
    outcomes: [
      "Using the toilet on his own, including the flush and the handwashing",
      "Sitting through a fifteen-minute story",
      "Taking turns without an adult standing over the toy",
      "Drawing a person with a head and legs",
      "Telling you a two-part story about his day",
      "Carrying his own plate to the cart after lunch",
    ],
    included: [
      "Breakfast, lunch and two snacks",
      "Toilet training support, on your timeline, starting whenever you say",
      "A daily note home",
      "Sunscreen",
      "All curriculum materials",
    ],
    next: "oak",
    photos: roomPhotos("maple"),
  },
  {
    slug: "oak",
    label: roomNames["oak"].label,
    ages: roomNames["oak"].ages,
    agesLong: "three to four years",
    ratio: "1:8",
    stateRatio: "1:10",
    classSize: 16,
    stateMaxGroup: 20,
    teachersInRoom: 2,
    hours: "6:30am – 6:00pm",
    rate5: 385,
    rate3: 270,
    availability: { kind: "open", spaces: 4 },
    oneLiner:
      "Sixteen three-year-olds, two teachers, and project work that runs for weeks rather than an afternoon.",
    intro:
      "Three-year-olds can hold onto a question for a long time, so the Oak Room works in projects. A question about why the small car rolls faster turns into three weeks of ramps. Letters and numbers happen in small groups of four, not as a whole-class worksheet.",
    rhythm: [
      { time: "6:30", what: "Arrival and free play" },
      { time: "8:00", what: "Breakfast" },
      { time: "8:30", what: "Morning meeting — calendar, weather, classroom jobs" },
      { time: "9:00", what: "Outside, 45 minutes" },
      { time: "9:45", what: "Project work in small groups of four" },
      { time: "10:45", what: "Read-aloud" },
      { time: "11:15", what: "Lunch, family-style — children serve themselves from the bowl" },
      { time: "12:00", what: "Rest, 45 minutes on a cot, then quiet books for the children who don’t sleep" },
      { time: "1:30", what: "Letters, numbers or science, in small groups" },
      { time: "2:30", what: "Snack" },
      { time: "3:00", what: "Outside, 45 minutes" },
      { time: "4:00", what: "Open centers" },
      { time: "5:15", what: "Quiet games. Families start arriving." },
      { time: "6:00", what: "Doors close" },
    ],
    outcomes: [
      "Recognizing her own name in print, and most letters",
      "Counting out ten objects accurately, one at a time",
      "Cutting along a line",
      "Holding a conversation with an adult who isn’t family",
      "Settling most disagreements with words before a teacher arrives",
      "Managing the bathroom, her coat and her lunch without help",
    ],
    included: [
      "Breakfast, lunch and two snacks",
      "All project and curriculum materials",
      "A daily note home describing what she actually did, by name",
      "Sunscreen",
      "A fall and spring conference with her teacher",
    ],
    next: "summit",
    photos: roomPhotos("oak"),
  },
  {
    slug: "summit",
    label: roomNames["summit"].label,
    ages: roomNames["summit"].ages,
    agesLong: "four to five years",
    ratio: "1:9",
    stateRatio: "1:10",
    classSize: 18,
    stateMaxGroup: 20,
    teachersInRoom: 2,
    hours: "6:30am – 6:00pm",
    rate5: 365,
    rate3: 255,
    availability: {
      kind: "waitlist",
      get note() {
        return `full for ${programYear()}`;
      },
    },
    oneLiner:
      "Eighteen children, two teachers, and a one-page kindergarten readiness sheet sent home every April.",
    intro:
      "The Summit Room is the year before kindergarten, and we treat it that way. Literacy and math happen in small groups every morning. In April every family gets a single page listing what their child can and cannot yet do against what District 205 expects in August — no scores, no percentiles, just the list.",
    rhythm: [
      { time: "6:30", what: "Arrival and free play" },
      { time: "8:00", what: "Breakfast" },
      { time: "8:30", what: "Morning meeting and news" },
      { time: "9:00", what: "Literacy in small groups, twenty minutes each" },
      { time: "9:45", what: "Outside, 45 minutes" },
      { time: "10:30", what: "Math and science investigation" },
      { time: "11:15", what: "Lunch, family-style" },
      { time: "12:00", what: "Rest, 30 minutes, then quiet choice" },
      { time: "1:00", what: "Writing and journals" },
      { time: "1:45", what: "Special — music Monday, Spanish Wednesday, yoga Friday" },
      { time: "2:30", what: "Snack" },
      { time: "3:00", what: "Outside, 45 minutes" },
      { time: "4:00", what: "Open centers and board games" },
      { time: "5:15", what: "Read-aloud. Families start arriving." },
      { time: "6:00", what: "Doors close" },
    ],
    outcomes: [
      "Writing his first and last name",
      "Hearing and counting the separate sounds in a short word",
      "Counting to 100, and writing numbers to 20",
      "Sitting in a group lesson for twenty minutes",
      "Following a three-step direction the first time",
      "Packing his own bag and zipping his own coat",
    ],
    included: [
      "Breakfast, lunch and two snacks",
      "Music, Spanish and yoga — no extra charge, ever",
      "The April kindergarten readiness sheet",
      "Two conferences a year, plus one whenever you ask",
      "Sunscreen and all materials",
    ],
    next: "after-school",
    photos: roomPhotos("summit"),
  },
  {
    slug: "after-school",
    label: roomNames["after-school"].label,
    ages: roomNames["after-school"].ages,
    agesLong: "five to ten years",
    ratio: "1:12",
    stateRatio: "1:20",
    classSize: 24,
    stateMaxGroup: 30,
    teachersInRoom: 2,
    hours: "2:30pm – 6:00pm on school days",
    rate5: 175,
    rate3: 125,
    availability: { kind: "open", spaces: 6 },
    oneLiner:
      "Our van collects from four Elmhurst District 205 elementary schools, and homework is done before you arrive about half the time.",
    intro:
      "The club is not a holding pen. There is a teacher at every homework table, forty-five minutes outside or in the gym, and a club block that runs the same project for a whole session — Lego engineering, cooking, art, chess. On District 205 institute days and school breaks the club runs 7:00am–6:00pm at no extra cost.",
    rhythm: [
      { time: "2:30", what: "Our van arrives from four District 205 elementary schools" },
      { time: "2:45", what: "Snack" },
      { time: "3:15", what: "Homework hour — a teacher sitting at every table" },
      { time: "4:15", what: "Outside or in the gym, 45 minutes" },
      { time: "5:00", what: "Clubs — Lego engineering, cooking, art, chess" },
      { time: "5:45", what: "Quiet reading. Families start arriving." },
      { time: "6:00", what: "Doors close" },
    ],
    rhythmNote:
      "On District 205 institute days and school breaks the club runs 7:00am to 6:00pm, at no extra cost. Those days are already in the weekly rate.",
    outcomes: [
      "Homework finished before dinner on most days",
      "One club project carried through to the end each session",
      "Someone who knows how the school day actually went, and will tell you",
      "Forty-five minutes of running every single day",
    ],
    included: [
      "Van pickup from four District 205 elementary schools",
      "An afternoon snack",
      "Homework support at a staffed table",
      "All club materials",
      "Full days 7:00am–6:00pm on institute days and school breaks",
    ],
    next: null,
    photos: roomPhotos("after-school"),
  },
];

export const bySlug = (slug: string) => programs.find((p) => p.slug === slug);

/**
 * The three fields the header menu renders. Passed into the client header as a
 * prop so the rest of this file — every rhythm, outcome and photograph — stays
 * out of the client bundle.
 */
export const headerRooms = programs.map((p) => ({
  slug: p.slug,
  label: p.label,
  ages: p.ages,
}));

/** The five day-program rooms — the after-school club is not one of them. */
export const dayPrograms = programs.filter((p) => p.slug !== "after-school");

/** "Acorn Room · Infants 6 weeks–15 months". Never render a room name alone. */
export const roomLabel = (p: Program) => `${p.label} · ${p.ages}`;

export const availabilityWords = (a: Availability) => {
  switch (a.kind) {
    case "open":
      return a.spaces === 1 ? "1 space now" : `${a.spaces} spaces now`;
    case "opening":
      return `${a.spaces} ${a.spaces === 1 ? "space" : "spaces"} from ${a.from}`;
    case "waitlist":
      return `Waitlist, ${a.note}`;
  }
};

/** Short form for the availability chip. Always paired with an icon shape. */
export const availabilityChip = (a: Availability) => {
  switch (a.kind) {
    case "open":
      return { tone: "good" as const, icon: "check" as const, text: a.spaces === 1 ? "1 space" : `${a.spaces} spaces` };
    case "opening":
      return { tone: "good" as const, icon: "calendar" as const, text: `${a.spaces} from ${a.from}` };
    case "waitlist":
      return { tone: "wait" as const, icon: "clock" as const, text: "Waitlist" };
  }
};

/** Day-program spaces available this fall, counted rather than claimed. */
export const dayProgramSpaces = dayPrograms.reduce(
  (n, p) => n + (p.availability.kind === "waitlist" ? 0 : p.availability.spaces),
  0,
);

export const afterSchoolSpaces =
  programs.find((p) => p.slug === "after-school")!.availability.kind === "waitlist"
    ? 0
    : (programs.find((p) => p.slug === "after-school")!.availability as { spaces: number }).spaces;

/** 6 + 8 + 12 + 16 + 18 = 60. Computed, so it can never drift from the rooms. */
export const dayCapacity = dayPrograms.reduce((n, p) => n + p.classSize, 0);
