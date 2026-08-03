/**
 * Twelve questions that answer objections rather than market.
 * Question 12 is answered honestly, including the notice period and what
 * happens to fees. Almost nobody does that, which is why it works.
 *
 * These are rendered as <details>/<summary> (no JavaScript required) and as
 * FAQPage JSON-LD.
 */

export type Faq = { q: string; a: string[] };

export const closedHolidays = [
  "New Year’s Day",
  "Memorial Day",
  "Juneteenth",
  "Independence Day",
  "Labor Day",
  "Thanksgiving Day",
  "The Friday after Thanksgiving",
  "Christmas Eve",
  "Christmas Day",
];

export const faqs: Faq[] = [
  {
    q: "How long is the waitlist?",
    a: [
      "It depends entirely on the room, so we publish it by room on the home page and update it monthly.",
      "As of August 2026: the Acorn Room (6 weeks–15 months) is full with about a six-week wait. The Sunflower Room (15–24 months) has two spaces from September 8. The Maple Room (2–3 years) has one space now, the Oak Room (3–4 years) has four, and the After-School Club (5–10 years) has six. The Summit Room (4–5 years) is full for 2026–27.",
      "There is no charge to sit on a waitlist and no deposit to hold a place on it. We call in the order people joined, and we tell you your position when you ask.",
    ],
  },
  {
    q: "Does my child have to be toilet trained?",
    a: [
      "No. Not for any room, at any age.",
      "Most children finish training during their year in the Maple Room (2–3 years), and we do it alongside you rather than to you. You tell us when you want to start and we start that week. If your four-year-old still has accidents, that is ordinary and it changes nothing about her place here.",
    ],
  },
  {
    q: "What happens if my child is sick — do I still pay?",
    a: [
      "Yes. Tuition holds your child’s place, not the days she attends, so sick days are already priced into the annual figure. We do not charge extra and we do not credit back.",
      "Keep her home if she has a temperature of 100.4°F or higher, has vomited or had diarrhea twice in 24 hours, has an undiagnosed rash, or has pink eye with discharge. She comes back 24 hours after the last fever, without fever medication in her system.",
      "If she develops symptoms here we call you straight away and she waits in the office with an adult, not alone.",
    ],
  },
  {
    q: "What about snow days and holidays?",
    a: [
      `We close nine days a year: ${closedHolidays.join(", ")}.`,
      "For snow, we close when Elmhurst District 205 closes. That has happened twice in the last five years. There is no extra charge for a closure and no credit for one — those days are already in the annual figure.",
      "We do not close for teacher training days. We cover training with our floating teachers so you never lose a workday to it.",
    ],
  },
  {
    q: "Do you have part-time options?",
    a: [
      "Yes — a three-day option in every room, Monday/Wednesday/Friday or Tuesday/Thursday plus one. The rate is on the tuition page next to the five-day rate.",
      "We do not offer half days or two-day weeks. A child who comes twice a week does not settle, and the room’s ratios have to hold whether she is here or not.",
    ],
  },
  {
    q: "Can I drop in without telling you?",
    a: [
      "Yes, and you should. Your family code opens the door during business hours and you do not need a reason or an appointment.",
      "The only thing we ask is that you come into the room rather than watching from the hall, because a child who spots a parent through a window and cannot reach them has a hard rest of the morning.",
      "If a center will not let you walk in unannounced, that is worth asking about — anywhere, not just here.",
    ],
  },
  {
    q: "Where do the children nap?",
    a: [
      "Babies in the Acorn Room (6 weeks–15 months) sleep in their own crib, the same crib every day, on their back with nothing in it. Our infant staff hold current safe-sleep certification.",
      "From the Sunflower Room (15–24 months) up, children sleep on a cot with their own blanket from home, which goes back with you every Friday to be washed.",
      "Rest is 45 minutes in the Oak Room (3–4 years) and 30 in the Summit Room (4–5 years). Children who do not sleep are not made to lie there — they read or do something quiet on their cot.",
    ],
  },
  {
    q: "Is there screen time?",
    a: [
      "There is no television, tablet or screen in any classroom. Not for reward, not on a rainy day, not at pickup.",
      "The one exception is the Summit Room (4–5 years), where children sometimes use a laptop with a teacher to look something up that came out of their own question. That is a few minutes, a few times a month, with an adult sitting there.",
    ],
  },
  {
    q: "What do you do when a child hits or bites?",
    a: [
      "We stop it, we look after the child who was hurt first, and then we work out what the other child was trying to get. Under three, biting is almost always a child who has run out of words.",
      "You hear from us the same day, by phone, from the teacher who was in the room. Not a note in the bag at 6pm and not an anonymous incident slip.",
      "We do not use time-out chairs and we never withhold food or outdoor time. If a pattern does not shift in a few weeks, Marisol sits down with you and we make a plan together — before it becomes a problem, not after.",
    ],
  },
  {
    q: "What do you serve, and what about allergies?",
    a: [
      "Breakfast, lunch and two snacks, cooked here by Rosa Delgado, who holds a Certified Food Protection Manager credential. Menus go up four weeks ahead, on the wall by the front door and by email.",
      "The building is nut-free and always has been. Every allergy in the building is posted in that child’s room and in the kitchen, with a photograph.",
      "From age two, lunch is family-style: the bowl goes on the table and children serve themselves, with a teacher sitting down eating the same food. Nobody is made to finish anything.",
    ],
  },
  {
    q: "How does my child move up to the next room?",
    a: [
      "By readiness, not by birthday. Most children move within a month or two of the age boundary, but a young two-year-old who is not ready for the Maple Room (2–3 years) stays in the Sunflower Room (15–24 months) a little longer, and that is free — we do not charge the higher rate until she moves.",
      "Before any move, your child spends short visits in the new room with her current teacher, over about two weeks. You meet the new teacher before the first visit, not after.",
    ],
  },
  {
    q: "What if it isn’t working out — how do we leave?",
    a: [
      "Thirty days’ written notice. An email to Marisol is enough; there is no form.",
      "You pay for those thirty days and nothing after them. We do not hold a last month’s tuition, so there is nothing for us to refund and nothing for you to chase. The registration fee and any supply fee already billed stay with us — those are spent by the time you would be leaving.",
      "Your child’s spot is released at the end of the notice period. If you come back within a year we do not charge the registration fee again.",
      "If you are leaving because something went wrong, please tell Marisol what it was. She will ask. It is more useful to us than a polite exit.",
    ],
  },
];
