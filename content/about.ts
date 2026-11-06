/**
 * /about — four short sections and nothing else.
 * No mission statement, no values grid, no timeline graphic.
 */

import { img, signatureImage } from "./images";
import { site } from "./site.config";

export const story = {
  heading: `How ${site.shortName} started`,
  paragraphs: [
    `${site.founder.name} opened ${site.name} in ${site.founded} in what had been a dental practice on ${site.address.street}. Eleven children, two teachers, one room.`,
    `Marisol Vega came in 2014 as assistant director and bought the school from ${site.founder.firstName} in 2019. The west wing and the second playground went up in 2016.`,
    `We are licensed for ${site.license.capacityDay} children in the day program and ${site.license.capacityAfterSchool} in the after-school club, and we have never asked the state to raise either number.`,
    `${site.founder.firstName} still comes in on Thursdays to read to the Oak Room, where the children are 3 and 4 years old.`,
  ],
};

/**
 * Three concrete practices, not three values.
 * "Every child goes outside twice a day" beats "we value outdoor learning".
 */
export const practices = [
  {
    heading: "Every child goes outside twice a day, in every season, down to 20°F",
    body: "Forty-five minutes in the morning and forty-five in the afternoon, in the two fenced yards. Babies get twenty to thirty minutes. Below 20°F or in lightning we use the gym instead. We do not skip it because it is cold. We ask you for boots and a warmer coat.",
  },
  {
    heading: "Your child’s teachers stay in your child’s room, all year",
    body: "We employ two floating teachers whose entire job is covering breaks, lunches and sick days. That means we never pull your child’s teacher into another room to plug a gap. If Tanya is your baby’s teacher in September, Tanya is your baby’s teacher in May.",
  },
  {
    heading: "Nobody eats alone at a counter",
    body: "From age two, lunch is served family-style at the table. Children pass the bowl and serve themselves, and a teacher sits down and eats exactly the same food. It is slower and it makes more mess. It is also where most of the conversation in a day happens.",
  },
];

export const building = {
  heading: "The building",
  intro:
    "One floor, no stairs, six classrooms off a single corridor you can see the whole length of. Every classroom has a door that opens directly onto a yard.",
  spaces: [
    {
      name: "The entry",
      body: "One locked door, a keypad, and a desk with a person behind it from 6:30 to 6:00. Every family has its own code. You sign in on the pad; we can see who is in the building at any moment.",
      photo: img("building.entry"),
    },
    {
      name: "The classrooms",
      body: "Six rooms, all on the ground floor, all with windows on two sides. Low shelves, no wall-to-wall carpet, and nothing on the walls above adult eye height.",
      photo: img("building.corridor"),
    },
    {
      name: "Two playgrounds",
      body: "A separate fenced yard for babies and toddlers, and a larger one for the Maple, Oak and Summit Rooms. Five-foot fence, self-latching gates, poured rubber surfacing under everything you can fall from.",
      photo: img("building.playground"),
    },
    {
      name: "The kitchen",
      body: "A full kitchen, not a warming station. Rosa cooks breakfast, lunch and two snacks here every day and reads every label that comes through the door. Nothing containing nuts has ever been in it.",
      photo: img("building.kitchen"),
    },
  ],
};

export const directorNote = {
  heading: `A note from ${site.director.firstName}`,
  paragraphs: [
    "I have worked here for twelve years and owned it for seven, and the thing I care most about is the part of this job that is boring: the same teachers in the same rooms, the ratios holding on a Friday afternoon in February, the drill log actually being filled in.",
    "You will hear a lot of language about philosophy when you tour centers this month. I would ask you instead to look at the ratio, ask how long the teachers have been there, and ask whether you can walk in unannounced. Those three answers tell you nearly everything.",
    "If you write to me, I write back myself, within one business day. Ask me anything, including what we are not good at.",
  ],
  signature: signatureImage,
};
