/**
 * ============================================================================
 *  SHOT BRIEFS — BUILD TIME ONLY
 * ============================================================================
 *  What each image slot should eventually contain, and when to shoot it.
 *
 *  This file is deliberately NOT imported by any component. It is read by
 *  scripts/photo-swap-doc.mjs and scripts/generate-placeholders.mjs and by
 *  nothing else, so none of this language is ever bundled and shipped to a
 *  browser.
 *
 *  That separation is the point. When these strings lived on the image
 *  manifest they travelled into the client bundle and into the generated
 *  SVGs’ aria-labels, and phrases like “Shot from adult standing height”
 *  ended up inside the built output of a page selling a real school. Direction
 *  for a photographer belongs in the photographer’s brief, not in the deploy.
 * ============================================================================
 */

export type ShotBrief = {
  /** The shot to take. */
  subject: string;
  /** "Morning, 8:00–9:00am", "Any", … */
  timeOfDay: string;
};

export const shotBriefs: Record<string, ShotBrief> = {
  /*
    The hero brief changed with the art direction. It used to ask for a wide
    establishing shot of a room. A room does not carry a 88vh opening — the eye
    has nowhere to land and the headline has nothing to sit against. What
    carries it is one adult and two or three children at close range, none of
    them aware of the camera, lit from one side so the far side of the group
    falls into shadow. Shoot it wide enough to crop both a 16:9 band and a 3:4
    phone frame out of the same exposure.
  */
  "hero": {
    subject: "One teacher and three children over a book or a tray, close range, no eye contact with the camera. Light from a single window on one side of the group, the far side left in shadow. Expose for the faces and let the background go. Shoot wide — the same frame is cropped 16:9 and 3:4.",
    timeOfDay: "Morning, 9:00–10:00am, low sun on the window side",
  },
  "hero.mobile": {
    subject: "No separate shot. The 3:4 phone crop of the hero frame above, made at build time from the same exposure.",
    timeOfDay: "Same frame as the hero",
  },
  "band.breath": {
    subject: "Hands and wooden materials, shot from above, close. No face in the frame. This band carries no words at all, so the photograph has to be worth a screen on its own.",
    timeOfDay: "Any, window light, no flash",
  },
  "band.safety": {
    subject: "A room with nobody in it — chairs still down, materials on the shelf, one window doing the lighting. Shot from the doorway at adult standing height, the way a parent first sees it on the tour.",
    timeOfDay: "Morning, 7:15–7:45am, before the first child arrives",
  },
  "band.closing": {
    subject: "The playground at the end of the day, empty, sun low and behind the structure. Backlit, everything else in shadow. This sits under 'come and see the room your child would be in'.",
    timeOfDay: "Evening, the last 40 minutes before 6:00pm pickup ends",
  },
  "room.acorn.1": {
    subject: "Acorn Room, 6 weeks – 15 months — the window bench and the six cribs along the far wall",
    timeOfDay: "Mid-morning, during first nap, blinds half drawn",
  },
  "room.acorn.2": {
    subject: "Acorn Room, 6 weeks – 15 months — treasure baskets and the floor mirror on the mat",
    timeOfDay: "Mid-morning, floor time",
  },
  "room.sunflower.1": {
    subject: "Sunflower Room, 15 – 24 months — the low climbing platform and the reading corner",
    timeOfDay: "Morning, before 9:15 outdoor time",
  },
  "room.sunflower.2": {
    subject: "Sunflower Room, 15 – 24 months — the sensory table, dry oats and scoops",
    timeOfDay: "Mid-morning, 10:15 sensory block",
  },
  "room.maple.1": {
    subject: "Maple Room, 2 – 3 years — the block area, low shelves, tape lines on the mat",
    timeOfDay: "Late morning, small-group time",
  },
  "room.maple.2": {
    subject: "Maple Room, 2 – 3 years — three child-height sinks with a step at each one",
    timeOfDay: "Any, empty room, lights on",
  },
  "room.oak.1": {
    subject: "Oak Room, 3 – 4 years — the project table with a half-built cardboard ramp on it",
    timeOfDay: "Mid-morning, 9:45 project block, work in progress",
  },
  "room.oak.2": {
    subject: "Oak Room, 3 – 4 years — the library corner, books faced out on low shelves",
    timeOfDay: "Any, natural light from the window side",
  },
  "room.summit.1": {
    subject: "Summit Room, 4 – 5 years — the writing table, journals and pencil cups",
    timeOfDay: "Early afternoon, 1:00 journal block",
  },
  "room.summit.2": {
    subject: "Summit Room, 4 – 5 years — the small-group corner and the magnetic letter board",
    timeOfDay: "Morning, 9:00 literacy groups",
  },
  "room.after-school.1": {
    subject: "After-School Club, 5 – 10 years — four homework tables, club shelves behind",
    timeOfDay: "Afternoon, 3:15 homework hour",
  },
  "room.after-school.2": {
    subject: "The gym, set up for the after-school hour",
    timeOfDay: "Afternoon, 4:15, before the children come in",
  },
  "building.entry": {
    subject: "The entry vestibule — sign-in desk, keypad on the inner door. Shot from just inside the outer door.",
    timeOfDay: "Morning, 7:30–8:30am drop-off",
  },
  "building.corridor": {
    subject: "The corridor, classroom doors and cubbies along one wall, looking the full length",
    timeOfDay: "Any, empty, lights on",
  },
  "building.playground": {
    subject: "The main playground — climbing structure over poured rubber surfacing, fence visible",
    timeOfDay: "Mid-morning, 9:15–10:00, low sun",
  },
  "building.kitchen": {
    subject: "The kitchen — stainless prep counter, menu board above it",
    timeOfDay: "Late morning, 10:30, lunch prep under way",
  },
  "staff.marisol-vega": {
    subject: "Marisol Vega, Director — head and shoulders",
    timeOfDay: "One session, all seventeen, same background and same light",
  },
  "staff.ellen-brzozowski": {
    subject: "Ellen Brzozowski, Office Manager — head and shoulders",
    timeOfDay: "One session, all seventeen, same background and same light",
  },
  "staff.tanya-okafor": {
    subject: "Tanya Okafor, Lead Teacher, Acorn Room, 6 weeks – 15 months — head and shoulders",
    timeOfDay: "One session, all seventeen, same background and same light",
  },
  "staff.priya-raghavan": {
    subject: "Priya Raghavan, Teacher, Acorn Room, 6 weeks – 15 months — head and shoulders",
    timeOfDay: "One session, all seventeen, same background and same light",
  },
  "staff.renata-alvarez": {
    subject: "Renata Alvarez, Lead Teacher, Sunflower Room, 15 – 24 months — head and shoulders",
    timeOfDay: "One session, all seventeen, same background and same light",
  },
  "staff.jo-feldman": {
    subject: "Jo Feldman, Teacher, Sunflower Room, 15 – 24 months — head and shoulders",
    timeOfDay: "One session, all seventeen, same background and same light",
  },
  "staff.camille-boyd": {
    subject: "Camille Boyd, Lead Teacher, Maple Room, 2 – 3 years — head and shoulders",
    timeOfDay: "One session, all seventeen, same background and same light",
  },
  "staff.hector-salas": {
    subject: "Hector Salas, Teacher, Maple Room, 2 – 3 years — head and shoulders",
    timeOfDay: "One session, all seventeen, same background and same light",
  },
  "staff.nadia-haddad": {
    subject: "Nadia Haddad, Lead Teacher, Oak Room, 3 – 4 years — head and shoulders",
    timeOfDay: "One session, all seventeen, same background and same light",
  },
  "staff.will-turnbull": {
    subject: "Will Turnbull, Teacher, Oak Room, 3 – 4 years — head and shoulders",
    timeOfDay: "One session, all seventeen, same background and same light",
  },
  "staff.grace-yun": {
    subject: "Grace Yun, Lead Teacher, Summit Room, 4 – 5 years — head and shoulders",
    timeOfDay: "One session, all seventeen, same background and same light",
  },
  "staff.marcus-bell": {
    subject: "Marcus Bell, Teacher, Summit Room, 4 – 5 years — head and shoulders",
    timeOfDay: "One session, all seventeen, same background and same light",
  },
  "staff.deion-pratt": {
    subject: "Deion Pratt, After-School Coordinator — head and shoulders",
    timeOfDay: "One session, all seventeen, same background and same light",
  },
  "staff.sofia-nakamura": {
    subject: "Sofia Nakamura, After-School Teacher — head and shoulders",
    timeOfDay: "One session, all seventeen, same background and same light",
  },
  "staff.angie-prokop": {
    subject: "Angie Prokop, Floating Teacher — head and shoulders",
    timeOfDay: "One session, all seventeen, same background and same light",
  },
  "staff.sam-whitaker": {
    subject: "Sam Whitaker, Floating Teacher — head and shoulders",
    timeOfDay: "One session, all seventeen, same background and same light",
  },
  "staff.rosa-delgado": {
    subject: "Rosa Delgado, Cook — head and shoulders",
    timeOfDay: "One session, all seventeen, same background and same light",
  },
  "map": {
    subject: "Static map export centered on 1420 Sheldon Avenue. Deliberately not an embedded iframe — it is wrapped in a link that opens the visitor's own maps app. A Google Static Maps or Mapbox export at 2x is fine.",
    timeOfDay: "n/a",
  },
  "signature": {
    subject: "A scan of the director's actual signature, black on white, background removed",
    timeOfDay: "n/a",
  },
};
