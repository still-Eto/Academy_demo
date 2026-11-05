import { ManagedAvatar } from "@/components/managed-image";
import { directorImage } from "@/content/images";
import { season } from "@/lib/openings-dates";
import type { Metadata } from "next";

import { Check } from "@/components/icons";
import { TourForm } from "@/components/tour-form";
import { dayProgramSpaces, programs } from "@/content/programs";
import { site } from "@/content/site.config";
import { tourTestimonials } from "@/content/testimonials";

export const metadata: Metadata = {
  title: "Book a tour",
  description: `See the room your child would be in. 45 minutes at ${site.name} in ${site.address.city}. ${site.director.name} replies within one business day.`,
  alternates: { canonical: "/book-a-tour" },
};

const STEPS = [
  {
    title: `${site.director.firstName} emails you a time`,
    body: "Within one business day, written by her. She checks your day against what is actually happening in the rooms — no automated calendar will offer you a slot during a fire drill.",
  },
  {
    title: "You come for 45 minutes",
    body: "You stand in the room your child would be in, meet the teacher who would have her, and read the drill log on the wall outside the office. Bring your child if it helps.",
  },
  {
    title: "You decide, in your own time",
    body: "If you want the place you say so, then or later. Nobody will call you twice. There is no deposit to hold a tour and no deposit to think about it.",
  },
];

/* Nothing on this page reads the address bar any more. Until 05.11.2026 a
   no-JavaScript submit went to /api/tour, which redirected back here with
   every entry in the query string; the form now sends nothing and renders its
   confirmation in place (still-Eto/ertukara#59), so the page is static. */
export default function BookATourPage() {
  return (
    <section className="shell py-10 lg:py-16">
      {/*
        THREE CHILDREN, NOT TWO, AND ONE <h1>.

        This used to be two columns, each carrying its own copy of the heading —
        one `lg:hidden`, one `hidden lg:block`. Only ever one of them was
        visible, and `display: none` keeps the other out of the accessibility
        tree, so no visitor met it twice. It was still two <h1> elements in the
        document, which is one more than a page gets to have.

        Splitting the heading into its own child fixes that without moving a
        pixel. Mobile is flex column in source order — heading, form, then what
        happens next. Desktop is the same two-column grid it was, with the
        heading and "what happens next" stacked in column one and the form
        spanning both rows of column two.

        It also fixes a smaller bug: the mobile heading lived inside the
        `booked ?` branch, so submitting the form left the phone with no visible
        heading at all.
      */}
      <div className="flex flex-col lg:grid lg:grid-cols-[minmax(0,1fr)_minmax(0,26rem)] lg:items-start lg:gap-x-14">
        {/* ---------------- 1. The one <h1> ---------------- */}
        <div className="order-1 mb-6 lg:col-start-1 lg:row-start-1 lg:mb-0">
          <h1 className="text-[1.9375rem] leading-[1.12] lg:text-[2.5rem] lg:leading-[1.08]">
            See the room your child would be in.
          </h1>
          {/* The sub-line is shorter on a phone, where it sits directly above
              the first field and every line costs a thumb-scroll. Same fact,
              two lengths — not two headings. */}
          <p className="measure mt-3 text-[1.0625rem] leading-relaxed text-muted lg:mt-4 lg:text-[1.1875rem]">
            <span className="lg:hidden">
              45 minutes. {dayProgramSpaces} spaces open across the day program this {season()}.
            </span>
            <span className="hidden lg:inline">
              45 minutes, during nap or during play &mdash; you choose which.{" "}
              {dayProgramSpaces} spaces are open across the day program this {season()}.
            </span>
          </p>
        </div>

        {/* ---------------- 2. The form (it turns into the confirmation in place) ---------------- */}
        <div className="order-2 lg:col-start-2 lg:row-start-1 lg:row-span-2">
            <>
              <div className="mb-6 lg:hidden">
                {/*
                  The reassurance, moved above the button it is supposed to
                  earn. On mobile the right-hand column stacks underneath, so
                  Marisol, the response promise and both parent quotes all sat
                  BELOW the submit — two thirds of this traffic reached the
                  decision point before reading the thing that makes it feel
                  safe. One row, one photograph, one sentence, kept short
                  enough that the first field is still within a thumb's reach.
                  The full "what happens next" and the quotes stay below the
                  form, unchanged.
                */}
                <div data-trust-row="" className="card mt-5 flex items-center gap-3 p-3">
                  <ManagedAvatar image={directorImage} size={48} />
                  <div className="min-w-0">
                    <p className="text-[0.9375rem] leading-tight font-semibold">
                      {site.director.name}
                      <span className="font-normal text-muted"> · {site.director.role}</span>
                    </p>
                    <p className="mt-1 text-[0.875rem] leading-snug text-muted">
                      {site.director.responsePromise}
                    </p>
                  </div>
                </div>
              </div>
              <TourForm />
            </>
        </div>

        {/* ---------------- 3. What happens next, and who replies ---------------- */}
        <div className="order-3 mt-10 lg:col-start-1 lg:row-start-2 lg:mt-0">
          <h2 className="mt-8 font-serif text-[1.25rem] font-semibold lg:mt-10">
            What happens next
          </h2>
          <ol className="mt-4 space-y-5">
            {STEPS.map((step, i) => (
              <li key={step.title} className="flex gap-3.5">
                <span
                  aria-hidden="true"
                  className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-brand text-[0.875rem] font-semibold text-bg"
                >
                  {i + 1}
                </span>
                <div>
                  <p className="font-semibold">{step.title}</p>
                  <p className="mt-1 text-[0.9375rem] leading-relaxed text-muted">{step.body}</p>
                </div>
              </li>
            ))}
          </ol>

          {/* The named human and the response promise. Desktop only — on
              mobile this is the trust row above the form, and saying it twice
              on one screen makes it read like marketing rather than a fact. */}
          <div className="card mt-8 hidden items-start gap-4 p-5 lg:flex">
            <ManagedAvatar image={directorImage} size={64} />
            <div>
              <p className="font-serif text-[1.0625rem] font-semibold">{site.director.name}</p>
              <p className="text-[0.875rem] text-muted">
                {site.director.role} · {site.director.tenureYears} years here ·{" "}
                {site.director.credential}
              </p>
              <p className="mt-2.5 flex items-start gap-2 text-[0.9375rem] leading-relaxed">
                <Check className="mt-1 h-4 w-4 shrink-0 text-good" />
                <span>{site.director.responsePromise}</span>
              </p>
            </div>
          </div>

          {/* Two short parent quotes. */}
          <div className="mt-8 space-y-5">
            {tourTestimonials.map((t) => {
              const room = programs.find((p) => p.slug === t.room)!;
              return (
                <figure key={t.name} className="border-l-2 border-line pl-4">
                  <blockquote className="text-[0.9375rem] leading-relaxed">
                    &ldquo;{t.quote}&rdquo;
                  </blockquote>
                  <figcaption className="mt-2 text-[0.875rem] text-muted">
                    &mdash; {t.name}, parent in the {room.label} ({room.ages}), {t.year}
                  </figcaption>
                </figure>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
