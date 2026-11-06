import type { Metadata } from "next";
import Link from "next/link";

import { Check } from "@/components/icons";
import { Reveal } from "@/components/reveal";
import { ClosingCta, PageHero } from "@/components/ui";
import { programs } from "@/content/programs";
import { safetySections } from "@/content/safety";
import { site } from "@/content/site.config";

export const metadata: Metadata = {
  title: "Safety, health & staff credentials",
  description: `Ratios against the Illinois minimum room by room, keypad entry, fingerprint background checks, a 100.4°F fever threshold, drill frequencies and cleaning schedules at ${site.name}.`,
  alternates: { canonical: "/safety" },
};

/** The ratio table is the argument of this page, so it sits inside it. */
function RatioTable() {
  return (
    <>
      {/* Mobile: one row per room, stacked. No sideways scrolling. */}
      <div className="mt-6 space-y-3 md:hidden">
        {programs.map((p) => (
          <div key={p.slug} className="card p-4">
            <p className="font-serif text-[1.0625rem] leading-tight font-semibold">{p.label}</p>
            <p className="mt-0.5 text-[0.875rem] text-muted">{p.ages}</p>
            <dl className="mt-3 grid grid-cols-2 gap-3 text-[0.9375rem]">
              <div className="rounded-lg bg-good-bg px-3 py-2">
                <dt className="text-[0.8125rem] text-good">{site.shortName}</dt>
                <dd className="font-serif text-[1.25rem] font-semibold text-good">{p.ratio}</dd>
              </div>
              <div className="rounded-lg bg-bg px-3 py-2">
                <dt className="text-[0.8125rem] text-muted">Illinois minimum</dt>
                <dd className="font-serif text-[1.25rem] font-semibold text-muted">
                  {p.stateRatio}
                </dd>
              </div>
            </dl>
            <p className="mt-2 text-[0.875rem] text-muted">
              {p.classSize} children with {p.teachersInRoom} teachers. Illinois caps this group at{" "}
              {p.stateMaxGroup}.
            </p>
          </div>
        ))}
      </div>

      {/* md and up: the two-column comparison as a real table. */}
      <div className="mt-6 hidden md:block">
        <table className="w-full border-collapse text-left">
          <caption className="sr-only">
            Staff-to-child ratios at {site.name} compared with the Illinois legal minimum, by room
          </caption>
          <thead>
            <tr className="border-b-2 border-line text-[0.875rem] text-muted">
              <th scope="col" className="py-3 pr-4 font-semibold">Room</th>
              <th scope="col" className="py-3 pr-4 font-semibold">Ages</th>
              <th scope="col" className="py-3 pr-4 font-semibold">{site.shortName}</th>
              <th scope="col" className="py-3 pr-4 font-semibold">Illinois minimum</th>
              <th scope="col" className="py-3 font-semibold">Group size, ours / Illinois cap</th>
            </tr>
          </thead>
          <tbody>
            {programs.map((p) => (
              <tr key={p.slug} className="border-b border-line last:border-0">
                <th scope="row" className="py-4 pr-4 font-serif text-[1.0625rem] font-semibold">
                  {p.label}
                </th>
                <td className="py-4 pr-4 text-[0.9375rem] text-muted">{p.ages}</td>
                <td className="py-4 pr-4">
                  <span className="inline-block rounded-md bg-good-bg px-2.5 py-1 font-serif text-[1.125rem] font-semibold text-good">
                    {p.ratio}
                  </span>
                </td>
                <td className="py-4 pr-4 font-serif text-[1.125rem] font-semibold text-muted">
                  {p.stateRatio}
                </td>
                <td className="py-4 text-[0.9375rem]">
                  <span className="font-semibold">{p.classSize}</span>
                  <span className="text-muted"> / {p.stateMaxGroup}</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <p className="mt-5 text-[0.875rem] leading-relaxed text-muted">
        Illinois minimums are 89 Ill. Adm. Code 407.190. Child care licensure moved from DCFS to the{" "}
        {site.license.agency} on July 1, 2026; the standards themselves did not change. Our license
        number is {site.license.number}.
      </p>
    </>
  );
}

export default function SafetyPage() {
  return (
    <>
      <PageHero
        eyebrow="Safety & health"
        title="The procedures, in full"
        lead={
          <>
            Licensing is the floor. This page is what we do above it: the thresholds, the
            frequencies, the certifications and the ratios, written down so you can hold us to them.
            Everything here is checkable on a tour, and you are welcome to check it.
          </>
        }
      />
      {/*
        Deleted: a twelve-item "On this page" jump nav that used to sit here.
        A parent on a sofa at 9:40pm does not use a table of contents — she
        scrolls or she leaves — and twelve buttons pushed the ratio table, which
        is the entire argument of this page, most of a screen further down.
        It was a section for a director skimming, at the parent's expense.
      */}

      <div className="shell section">
        <div className="space-y-14 lg:space-y-20">
          {safetySections.map((section) => (
            <Reveal key={section.id}>
              <section id={section.id} className="scroll-mt-24">
                <h2 className="measure-tight text-[1.5rem] leading-tight lg:text-[2rem]">
                  {section.heading}
                </h2>

                <div className="measure mt-4 space-y-4 text-[1.0625rem] leading-relaxed text-muted">
                  {section.body.map((para) => (
                    <p key={para}>{para}</p>
                  ))}
                </div>

                {section.points && (
                  <ul className="measure mt-5 space-y-3">
                    {section.points.map((point) => (
                      <li key={point} className="flex gap-3 text-[1.0625rem] leading-relaxed">
                        <Check className="mt-1.5 h-4 w-4 shrink-0 text-good" />
                        <span>{point}</span>
                      </li>
                    ))}
                  </ul>
                )}

                {/* The ratio comparison lives inside its own section. */}
                {section.id === "ratios" && <RatioTable />}
              </section>
            </Reveal>
          ))}
        </div>

        <div className="card mt-16 p-6 lg:p-8">
          <h2 className="text-[1.375rem] leading-tight lg:text-[1.625rem]">
            What we are licensed and accredited for
          </h2>
          <dl className="mt-5 grid gap-5 sm:grid-cols-2">
            <div>
              <dt className="text-[0.875rem] text-muted">License</dt>
              <dd className="mt-1 font-semibold">
                #{site.license.number}
                <span className="block font-normal text-muted">{site.license.agency}</span>
              </dd>
            </div>
            <div>
              <dt className="text-[0.875rem] text-muted">Licensed capacity</dt>
              <dd className="mt-1 font-semibold">
                {site.license.capacityDay} in the day program
                <span className="block font-normal text-muted">
                  Plus {site.license.capacityAfterSchool} in the after-school club. We have never
                  asked to raise either number.
                </span>
              </dd>
            </div>
            {site.accreditations.map((a) => (
              <div key={a.label}>
                <dt className="text-[0.875rem] text-muted">Accreditation</dt>
                <dd className="mt-1 font-semibold">
                  {a.href ? (
                    <a
                      href={a.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-brand underline underline-offset-4"
                    >
                      {a.label}
                    </a>
                  ) : (
                    a.label
                  )}
                  <span className="block font-normal text-muted">{a.detail}</span>
                </dd>
              </div>
            ))}
          </dl>

          <p className="mt-6 text-[0.9375rem] leading-relaxed text-muted">
            Ask on the tour to see anything on this page for yourself, and we will show you the
            actual document: the drill log, the playground checklist, the health department report,
            a teacher&rsquo;s certification card.{" "}
            <Link href="/faq" className="font-semibold text-brand underline underline-offset-4">
              More questions parents ask
            </Link>
            .
          </p>
        </div>
      </div>

      <ClosingCta />
    </>
  );
}
