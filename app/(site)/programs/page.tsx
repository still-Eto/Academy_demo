import type { Metadata } from "next";
import Link from "next/link";

import { ArrowRight } from "@/components/icons";
import { Reveal } from "@/components/reveal";
import { AvailabilityChip, ClosingCta, PageHero, ProgramCard } from "@/components/ui";
import { availabilityWords, dayCapacity, programs } from "@/content/programs";
import { site } from "@/content/site.config";
import { fees } from "@/content/tuition";

export const metadata: Metadata = {
  title: "The six rooms",
  description: `Compare all six rooms at ${site.name}: age range, ratio against the Illinois minimum, class size, hours, weekly rate and current availability. Six weeks to age 10.`,
  alternates: { canonical: "/programs" },
};

export default function ProgramsPage() {
  return (
    <>
      <PageHero
        eyebrow="Programs"
        title="Six rooms, six weeks to age ten"
        lead={
          <>
            Five day-program rooms holding {dayCapacity} children in total, plus an after-school
            club for {site.license.capacityAfterSchool}. Every room is staffed better than the
            Illinois legal minimum. Compare them here rather than clicking through six pages.
          </>
        }
      />

      {/* ---------------- Cards, denser ---------------- */}
      <section className="border-b border-line">
        <div className="shell section">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 lg:gap-6">
            {programs.map((p, i) => (
              <Reveal key={p.slug} delay={Math.min(i, 3) * 40}>
                <ProgramCard program={p} />
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ---------------- The comparison ---------------- */}
      <section className="border-b border-line bg-brand-tint/40">
        <div className="shell section">
          <h2 className="text-[1.75rem] leading-[1.15] lg:text-[2.25rem]">
            All six rooms, side by side
          </h2>
          <p className="measure mt-4 text-[1.0625rem] leading-relaxed text-muted">
            No marketing copy in this table. The Illinois column is the legal minimum for the
            youngest child in that room, under 89 Ill. Adm. Code 407.190.
          </p>

          {/* Mobile: one block per room, so nothing scrolls sideways. */}
          <div className="mt-8 space-y-4 md:hidden">
            {programs.map((p) => (
              <div key={p.slug} className="card p-5">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h3 className="text-[1.125rem] leading-tight">{p.label}</h3>
                    <p className="mt-0.5 text-[0.875rem] font-semibold text-muted">{p.ages}</p>
                  </div>
                  <AvailabilityChip availability={p.availability} />
                </div>
                <dl className="mt-4 grid grid-cols-2 gap-x-4 gap-y-3 text-[0.9375rem]">
                  <div>
                    <dt className="text-muted">Our ratio</dt>
                    <dd className="font-semibold">{p.ratio}</dd>
                  </div>
                  <div>
                    <dt className="text-muted">Illinois minimum</dt>
                    <dd className="font-semibold">{p.stateRatio}</dd>
                  </div>
                  <div>
                    <dt className="text-muted">Class size</dt>
                    <dd className="font-semibold">{p.classSize}</dd>
                  </div>
                  <div>
                    <dt className="text-muted">Hours</dt>
                    <dd className="font-semibold">{p.hours}</dd>
                  </div>
                  <div>
                    <dt className="text-muted">5 days</dt>
                    <dd className="font-semibold">${p.rate5}/wk</dd>
                  </div>
                  <div>
                    <dt className="text-muted">3 days</dt>
                    <dd className="font-semibold">${p.rate3}/wk</dd>
                  </div>
                  <div className="col-span-2">
                    <dt className="text-muted">Availability</dt>
                    <dd className="font-semibold">{availabilityWords(p.availability)}</dd>
                  </div>
                </dl>
              </div>
            ))}
          </div>

          {/* md and up: the real table. */}
          <div className="mt-8 hidden md:block">
            <table className="w-full border-collapse text-left text-[0.9375rem]">
              <caption className="sr-only">
                Age range, ratio, class size, hours, weekly rate and availability for all six rooms
              </caption>
              <thead>
                <tr className="border-b-2 border-line text-[0.8125rem] text-muted">
                  <th scope="col" className="py-3 pr-3 font-semibold">Room</th>
                  <th scope="col" className="py-3 pr-3 font-semibold">Ages</th>
                  <th scope="col" className="py-3 pr-3 font-semibold">Our ratio</th>
                  <th scope="col" className="py-3 pr-3 font-semibold">IL minimum</th>
                  <th scope="col" className="py-3 pr-3 font-semibold">Class size</th>
                  <th scope="col" className="py-3 pr-3 font-semibold">Hours</th>
                  <th scope="col" className="py-3 pr-3 font-semibold">5-day</th>
                  <th scope="col" className="py-3 pr-3 font-semibold">3-day</th>
                  <th scope="col" className="py-3 font-semibold">Availability</th>
                </tr>
              </thead>
              <tbody>
                {programs.map((p) => (
                  <tr key={p.slug} className="border-b border-line last:border-0 align-top">
                    <th scope="row" className="py-4 pr-3 font-serif text-[1rem] font-semibold">
                      <Link href={`/programs/${p.slug}`} className="underline underline-offset-4">
                        {p.label}
                      </Link>
                    </th>
                    <td className="py-4 pr-3 text-muted">{p.ages}</td>
                    <td className="py-4 pr-3 font-semibold">{p.ratio}</td>
                    <td className="py-4 pr-3 text-muted">{p.stateRatio}</td>
                    <td className="py-4 pr-3">{p.classSize}</td>
                    <td className="py-4 pr-3 text-muted">{p.hours}</td>
                    <td className="py-4 pr-3 font-semibold">${p.rate5}</td>
                    <td className="py-4 pr-3">${p.rate3}</td>
                    <td className="py-4">
                      <AvailabilityChip availability={p.availability} />
                      <span className="mt-1 block text-[0.8125rem] text-muted">
                        {availabilityWords(p.availability)}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <p className="mt-6 text-[0.875rem] leading-relaxed text-muted">
            Weekly rates. Monthly equivalents, fees and what is included are on the{" "}
            <Link href="/tuition" className="font-semibold text-brand underline underline-offset-4">
              tuition page
            </Link>
            . Registration is {fees[0].amount} a year per family and the supply fee is{" "}
            {fees[1].amount} a semester.
          </p>

          <Link
            href="/safety#ratios"
            className="mt-6 inline-flex min-h-[48px] items-center gap-1.5 font-semibold text-brand underline underline-offset-4"
          >
            How our ratios compare to the state minimum, room by room
            <ArrowRight />
          </Link>
        </div>
      </section>

      <ClosingCta />
    </>
  );
}
