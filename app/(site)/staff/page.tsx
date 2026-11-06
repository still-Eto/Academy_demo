import { ManagedAvatar } from "@/components/managed-image";
import type { Metadata } from "next";

import { Reveal } from "@/components/reveal";
import { ClosingCta, PageHero } from "@/components/ui";
import { programs } from "@/content/programs";
import { site } from "@/content/site.config";
import { groupLabels, leadTeacherAverageTenure, staff, staffByGroup } from "@/content/staff";

export const metadata: Metadata = {
  title: "Meet the teachers",
  description: `Everyone who works at ${site.name}, by room: name, credential, years here and one sentence in their own voice. Including Rosa, who cooks every meal.`,
  alternates: { canonical: "/staff" },
};

/** Rooms first, then the people who are not in a room but are still here. */
const groups = [
  { key: "leadership", label: groupLabels.leadership, ages: null as string | null },
  ...programs.map((p) => ({ key: p.slug, label: p.label, ages: p.ages })),
  { key: "floating", label: groupLabels.floating, ages: null },
  { key: "kitchen", label: groupLabels.kitchen, ages: null },
  { key: "office", label: groupLabels.office, ages: null },
];

export default function StaffPage() {
  return (
    <>
      <PageHero
        eyebrow="The people here"
        title={`Everyone who works at ${site.shortName}`}
        lead={
          <>
            {/*
              The explicit `{" "}` is load-bearing. `{staff.length} people` on one
              line looks like it has a space in it and compiles without one: when
              a JSX expression opens a line AND the prose after it wraps onto a
              second line, SWC drops the leading space of that text node. It
              shipped as "17people" in the first sentence of this page.

              Single-line cases are unaffected, which is why the other eighteen
              instances of this shape in the codebase are fine — see the note on
              the `verify` check that now scans the built output for it.
            */}
            {staff.length}{" "}
            people, and this is all of them, including Rosa, who cooks every meal, and Ellen,
            who will fix your bill. Our six lead teachers have been here an average of{" "}
            {leadTeacherAverageTenure} years. Tenure is the number worth asking about at every
            center you tour.
          </>
        }
      />

      <div className="shell section">
        <div className="space-y-14 lg:space-y-18">
          {groups.map((group) => {
            const people = staffByGroup(group.key);
            if (people.length === 0) return null;

            return (
              <Reveal key={group.key}>
                <section>
                  <h2 className="text-[1.5rem] leading-tight lg:text-[2rem]">
                    {group.label}
                    {/* A room name never appears without its age range beside it. */}
                    {group.ages && (
                      <span className="mt-1 block font-sans text-[1rem] font-semibold text-muted">
                        {group.ages}
                      </span>
                    )}
                  </h2>

                  <div className="mt-6 grid gap-5 md:grid-cols-2 lg:gap-6">
                    {people.map((person) => (
                      <article key={person.name} className="card flex gap-4 p-5">
                        <ManagedAvatar image={person.photo} size={80} name={person.name} />
                        <div>
                          <h3 className="font-serif text-[1.0625rem] leading-tight font-semibold">
                            {person.name}
                          </h3>
                          <p className="text-[0.875rem] text-muted">{person.role}</p>
                          <p className="mt-1 text-[0.9375rem] font-semibold text-brand">
                            {person.years} {person.years === 1 ? "year" : "years"} at{" "}
                            {site.shortName}
                          </p>
                          <p className="mt-1 text-[0.875rem] leading-snug text-muted">
                            {person.credential}
                          </p>
                          <p className="mt-2.5 text-[0.9375rem] leading-relaxed">
                            &ldquo;{person.quote}&rdquo;
                          </p>
                        </div>
                      </article>
                    ))}
                  </div>
                </section>
              </Reveal>
            );
          })}
        </div>

        <p className="measure mt-14 text-[0.9375rem] leading-relaxed text-muted">
          Every adult on this page clears Illinois State Police and FBI fingerprint checks, the
          CANTS child abuse and neglect registry and the sex offender registries before a first
          shift, and again every year. Every classroom teacher holds current pediatric CPR and First
          Aid.
        </p>
      </div>

      <ClosingCta />
    </>
  );
}
