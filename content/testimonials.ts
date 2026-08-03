/**
 * Named, specific social proof. First name, last initial, the child’s room,
 * the year. Vague praise from "A Happy Mom" is worth less than nothing.
 *
 * Every teacher named in a quote is a real entry in content/staff.ts and is
 * assigned to the room the parent names. scripts/verify.mjs checks this.
 */

import { site } from "./site.config";

export type Testimonial = {
  quote: string;
  name: string;
  /** Program slug — used to render "parent in the Sunflower Room". */
  room: string;
  year: number;
};

export const testimonials: Testimonial[] = [
  {
    quote:
      "I asked for the infant ratio on the phone and got a number, not a speech. Nine months in, Nora has had the same two teachers the whole time. She walks in and goes straight to Jo.",
    name: "Danielle R.",
    room: "sunflower",
    year: 2024,
  },
  {
    quote:
      `We toured four places. ${site.shortName} was the only one that let us stand in the infant room during nap and just watch. Tanya wrote down how Elias likes to be put down, and eight months later she still does it that way.`,
    name: "Andre & Aimee T.",
    room: "acorn",
    year: 2025,
  },
  {
    quote:
      "The daily note actually says what happened. \"Built a ramp with Will, tested it eleven times, wanted to know why the small car went faster.\" That is my kid, exactly.",
    name: "Estela V.",
    room: "oak",
    year: 2024,
  },
  {
    quote:
      "My son bit another child in October. Camille called me that afternoon, told me what happened, and told me what they were doing about it. No form letter, no vague email at 6pm.",
    name: "Ben H.",
    room: "maple",
    year: 2025,
  },
  {
    quote:
      "Grace sent us home in April with one page listing what Mateo could and could not do yet before kindergarten. His teacher this year said he was one of the most ready children in the class.",
    name: "Karla M.",
    room: "summit",
    year: 2023,
  },
  {
    quote:
      "I get there at 5:50 most days and nobody has ever made me feel late. Deion has the homework finished about half the time, which buys me back an hour of my evening.",
    name: "Tom W.",
    room: "after-school",
    year: 2025,
  },
];

/** Three for the home page. */
export const homeTestimonials = [
  testimonials[1], // Acorn — answers the infant-safety question
  testimonials[0], // Sunflower — highest-demand room
  testimonials[3], // Maple — the one about a bad day, which is the persuasive one
];

/** Two short ones for the booking page. */
export const tourTestimonials = [testimonials[1], testimonials[4]];

export const forRoom = (slug: string) => testimonials.filter((t) => t.room === slug);
