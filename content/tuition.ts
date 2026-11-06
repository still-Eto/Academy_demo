/**
 * Tuition. Rates live in content/programs.ts so a room’s price can never
 * disagree with itself between pages; this file derives everything else.
 *
 * Monthly equivalent = weekly rate × 52 ÷ 12, rounded to the dollar.
 * It is computed here rather than typed, so the table always reconciles.
 */

import { programs } from "./programs";

export const monthlyEquivalent = (weekly: number) => Math.round((weekly * 52) / 12);

export const monthlyFormula = "Monthly equivalent = weekly rate × 52 ÷ 12, rounded to the dollar.";

export const tuitionRows = programs.map((p) => ({
  slug: p.slug,
  label: p.label,
  ages: p.ages,
  rate5: p.rate5,
  rate3: p.rate3,
  monthly5: monthlyEquivalent(p.rate5),
  monthly3: monthlyEquivalent(p.rate3),
}));

export const fees = [
  {
    label: "Registration fee",
    amount: "$150",
    cadence: "once a year, per family",
    detail:
      "Charged when you enroll and again each September. One fee per family, not per child. It is not a deposit and it is not refunded if you leave.",
  },
  {
    label: "Supply fee",
    amount: "$75",
    cadence: "per semester, per child",
    detail:
      "Two a year, in August and January. It covers art materials, the classroom’s consumables and your child’s own portfolio.",
  },
];

export const included = [
  "Breakfast, lunch and two snacks every day, cooked here by Rosa",
  "All curriculum materials, books, art supplies and classroom equipment",
  "Sunscreen, applied before every outdoor block",
  "Music, Spanish and yoga in the Summit Room, 4 to 5 years",
  "Two parent–teacher conferences a year, plus any others you ask for",
  "Full days 7:00am–6:00pm in the After-School Club, 5 to 10 years, on institute days and school breaks",
  "The April kindergarten readiness sheet for Summit Room families, 4 to 5 years",
];

export const notIncluded = [
  "Diapers and wipes",
  "A nap blanket, which goes home to be washed every Friday",
  "A change of clothes to keep in your child’s cubby",
];

export const discounts = [
  {
    label: "Sibling discount",
    detail:
      "10% off the lower of the two weekly rates, applied automatically for as long as both children are enrolled.",
  },
  {
    label: "CCAP",
    detail:
      "We accept the Illinois Child Care Assistance Program. As of July 1, 2026 CCAP is administered by the Illinois Department of Early Childhood rather than IDHS. Your case moved automatically and your existing approval still counts. Ellen handles the paperwork with you.",
  },
  {
    label: "Employer childcare benefits",
    detail:
      "We invoice employer benefit programs directly. For a dependent care FSA, we send an itemized statement with our tax ID every January without you asking.",
  },
];

export const paymentSchedule = {
  headline: "You pay the same amount every month.",
  body: [
    "We bill monthly by ACH on the first business day of the month, for that month.",
    "Your monthly figure is the weekly rate × 52 ÷ 12. That is why the two months a year with a fifth week do not cost you extra, and why a four-week month is not cheaper.",
    "Tuition is charged for your child’s place, not for days attended. Holidays, sick days and vacation are already priced into the annual figure.",
  ],
};

/** The most persuasive sentence on the site. Do not soften it. */
export const noHiddenCosts =
  "Nothing else gets added later. If a cost isn’t on this page, we don’t charge it.";

export const withdrawal = {
  headline: "If you leave",
  body: "Thirty days’ written notice. An email to Marisol is enough. You pay for those thirty days and nothing after them. We don’t hold a last month’s tuition, so there is nothing to refund and nothing to chase. The registration fee and any supply fee already billed stay with us.",
};
