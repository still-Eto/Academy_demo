/**
 * /safety — the page that wins the shortlist.
 *
 * Short factual sentences. No reassurance language. Every claim carries a
 * number, a frequency, a threshold or the name of a certification.
 *
 * Regulatory references verified 2026-08-01:
 *  - Child care licensure moved from DCFS to the Illinois Department of Early
 *    Childhood (IDEC) on July 1, 2026.
 *  - Staff/child ratios and maximum group sizes: 89 Ill. Adm. Code 407.190.
 *    Mixed-age rooms are governed by the youngest child in the group.
 *  - 15 clock hours of in-service training per staff member per year, and
 *    mandated reporter training within 30 days of hire: 89 Ill. Adm. Code 407.
 */

export type SafetySection = {
  id: string;
  heading: string;
  /** Rendered as paragraphs. */
  body: string[];
  /** Rendered as a checked list beneath the body. */
  points?: string[];
};

/** The four concrete claims on the home page. Each links to a section here. */
/**
 * `icon` names one of the four marks in components/icons.tsx. It is here
 * rather than mapped by array index in the page, so reordering these four
 * claims cannot silently put a thermometer next to the door policy.
 */
export type SafetyClaimIcon = "door" | "fingerprint" | "notice" | "thermometer";

export const homeSafetyClaims = [
  {
    icon: "door" as SafetyClaimIcon,
    heading: "One locked door, and a code that belongs to your family alone",
    body: "The front door is locked from 6:30am to 6:00pm. Every family gets its own keypad code, so the sign-in log shows exactly who came in and when. Codes are changed the same day anyone leaves a household.",
    href: "/safety#arrival",
  },
  {
    icon: "fingerprint" as SafetyClaimIcon,
    heading: "Every adult here is fingerprinted, and re-checked every year",
    body: "Illinois State Police and FBI fingerprint checks, the CANTS child abuse and neglect registry, and the national sex offender registry, before a first shift, then annually. Every teacher holds current pediatric CPR and First Aid.",
    href: "/safety#staff",
  },
  {
    icon: "notice" as SafetyClaimIcon,
    heading: "Allergies are posted in the room, with a photograph",
    body: "Every allergy in the building is on the wall in that child’s room and in the kitchen, with the child’s photo. Epinephrine sits in a labeled box at adult height in the room, not locked in an office. The building is nut-free.",
    href: "/safety#allergies",
  },
  {
    icon: "thermometer" as SafetyClaimIcon,
    heading: "Fever of 100.4°F means we call you, and back 24 hours after the last one",
    body: "The exclusion thresholds are written down and we apply them the same way to every family, including on a Monday when you have a meeting. Here is the whole list.",
    href: "/safety#illness",
  },
];

export const safetySections: SafetySection[] = [
  {
    id: "arrival",
    heading: "Arrival and pickup",
    body: [
      "The front door is locked from 6:30am to 6:00pm. There is one way in, through a vestibule with a desk that is staffed for the whole day.",
      "Every family has its own four-digit keypad code. The code identifies you, so the sign-in log records which adult entered and at what minute. We change a family’s code the same day anyone moves out of that household, and we do not need a reason.",
      "The playground-side doors are exit-only and alarmed. They open from the inside for a fire drill or an evacuation and never from the outside.",
    ],
    points: [
      "Doors locked 6:30am–6:00pm, no exceptions for deliveries",
      "One entrance, staffed the entire day",
      "Per-family keypad codes, changed on request within the hour",
      "A sign-in log that names the adult, not just the child",
    ],
  },
  {
    id: "pickup-list",
    heading: "Who can collect your child",
    body: [
      "Only the adults on your authorized pickup list. You write that list when you enroll and you change it in writing. Email to the office is fine. We do not accept changes by phone, from anyone, ever. That rule is the point of the rule.",
      "Anyone collecting your child who is not known to the teacher by sight shows photo ID at the desk. This happens often to grandparents, and they are usually pleased about it.",
      "If a custody order restricts who may collect your child, give us a copy and we will keep it at the desk. We follow the order, not the conversation at the door.",
      "If nobody has arrived by 6:00pm we call you, then the next name on your list. A teacher stays with your child in the office. There is a late fee of $1 a minute after 6:10pm and it goes to the teacher who stayed.",
    ],
  },
  {
    id: "staff",
    heading: "Who we hire, and what we check",
    body: [
      "Every adult who works here, from the teachers and the cook to the office manager and the director, clears the same checks before a first shift, and again every year:",
    ],
    points: [
      "Illinois State Police fingerprint-based criminal history check",
      "FBI fingerprint-based national criminal history check",
      "CANTS, the Illinois child abuse and neglect registry",
      "The national and Illinois sex offender registries",
      "Two reference calls we make ourselves, to a named supervisor",
    ],
  },
  {
    id: "training",
    heading: "What our staff are trained in",
    body: [
      "Illinois requires 15 clock hours of in-service training a year for every member of child care staff, and mandated reporter training within 30 days of hire. We meet both and go past the first one: our teachers averaged 24 hours last year.",
      "Certifications every classroom teacher holds and keeps current:",
    ],
    points: [
      "Pediatric CPR and First Aid, renewed every two years",
      "Mandated reporter training under ANCRA, renewed annually",
      "Safe sleep certification for everyone who works in the Acorn Room (6 weeks–15 months)",
      "Food allergy and epinephrine administration, renewed annually",
      "Rosa, our cook, holds a Certified Food Protection Manager credential (ServSafe)",
    ],
  },
  {
    id: "ratios",
    heading: "Ratios, room by room, against the Illinois minimum",
    body: [
      "This is the number that matters most and the one hardest to find on a childcare website. Ours is better than the legal minimum in every room, and better by more than one child in five of the six.",
      "Where a room spans two age bands, Illinois applies the ratio for the youngest child in the group. That is the figure in the state column.",
      "The ratio holds all day, including at 7:00am, at nap and at 5:45pm. Two floating teachers cover breaks and lunches so a room is never short while a teacher is out of it.",
    ],
  },
  {
    id: "illness",
    heading: "When to keep your child home",
    body: [
      "The thresholds are written down so that they are applied the same way to every family, on every day of the week.",
      "Keep your child home, or we will call you to collect her, for any of these:",
    ],
    points: [
      "A temperature of 100.4°F or higher",
      "Vomiting or diarrhea twice or more in 24 hours",
      "An undiagnosed rash",
      "Pink eye with discharge, until 24 hours after treatment starts",
      "A cough that stops her sleeping or joining in",
      "Any illness a doctor has told you is contagious",
    ],
  },
  {
    id: "illness-return",
    heading: "Coming back",
    body: [
      "24 hours after the last fever, with no fever medication in her system. 24 hours after the last time she was sick. We do not require a doctor’s note to come back, because getting one costs you a morning and tells us nothing we did not already know.",
      "If your child develops symptoms here we call you immediately and she waits in the office with an adult sitting with her, not on a chair in the corridor by herself.",
      "We post a dated notice on the door when there is a confirmed contagious illness in the building, naming the illness and the room, never the child.",
    ],
  },
  {
    id: "allergies",
    heading: "Allergies and medication",
    body: [
      "The building has been nut-free since it opened and Rosa reads every label that comes through the door.",
      "Every allergy in the building is posted on the wall of that child’s room and in the kitchen, with the child’s photograph, the allergen and the response. Epinephrine is stored in a labeled box at adult height inside the classroom, not locked in the office, because in an emergency the office is thirty seconds too far away.",
      "Any other medication needs a written authorization from you with the dose and the times. It stays in its original labeled container. Every dose is logged and signed by two adults, and you see the log at pickup.",
      "We do not give a first-ever dose of anything here. If your child has never had a medication before, the first one happens at home where you can watch her.",
    ],
  },
  {
    id: "drills",
    heading: "Emergency and lockdown drills",
    body: [
      "We run a fire drill on the first Tuesday of every month, at a different time of day each time, including during nap. A drill during nap is unpopular and it is the only one that tells us anything.",
      "A severe weather drill runs every quarter. The interior corridor is the shelter, and it has no glass in it.",
      "A lockdown drill runs twice a year. Children are told it is a practice for keeping the doors shut, which is what it is.",
      "The drill log is on the wall outside the office with the date, the time and how long the building took to clear. Read it when you tour. If a center cannot show you that log, ask why.",
    ],
  },
  {
    id: "cleaning",
    heading: "Cleaning, and how often",
    body: [
      "Frequencies, not adjectives:",
    ],
    points: [
      "Tables sanitized before and after every meal and every art activity",
      "Toys in the Acorn (6 weeks–15 months) and Sunflower (15–24 months) Rooms run through the dishwasher every night; anything mouthed goes into a bin immediately and is not returned to the shelf that day",
      "Bathrooms cleaned three times a day, and logged on the back of the door",
      "Cots wiped daily; blankets go home with you every Friday",
      "Floors mopped nightly; the whole building deep-cleaned every Friday after 6:00pm",
      "Air filters changed quarterly, on a schedule taped inside the utility door",
    ],
  },
  {
    id: "playground",
    heading: "The playgrounds",
    body: [
      "Two fenced yards: a smaller one for the Acorn and Sunflower Rooms, and a larger one for the Maple, Oak and Summit Rooms. Five-foot fence, self-latching gates that a two-year-old cannot work, and a gate that is checked every time a group comes in.",
      "Poured-in-place rubber surfacing under everything a child can climb, at a depth matched to the fall height of the equipment above it. Not wood chips, which move and thin out over a winter.",
      "A teacher walks both yards every Monday morning with a checklist: bolts, gates, surfacing, standing water, anything that has come over the fence. The log hangs by the gate.",
      "Sunscreen is applied before every outdoor block from April to October. It is included; you do not send it.",
    ],
  },
  {
    id: "food",
    heading: "Food handling",
    body: [
      "Rosa Delgado has cooked here for ten years and holds a Certified Food Protection Manager credential. She takes and records refrigerator and freezer temperatures twice a day.",
      "The kitchen is inspected by the DuPage County Health Department. The current report is posted by the front door, not filed in the office.",
      "Menus go up four weeks ahead. Every meal is cooked here on the day. If your child will not eat what is on the menu, we do not make her, and we do not tell you she ate it when she did not.",
    ],
  },
];
