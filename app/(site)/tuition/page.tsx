import type { Metadata } from "next";
import Link from "next/link";

import { Check, Close } from "@/components/icons";
import { Reveal } from "@/components/reveal";
import { ClosingCta, PageHero } from "@/components/ui";
import { site } from "@/content/site.config";
import {
  discounts,
  fees,
  included,
  monthlyFormula,
  noHiddenCosts,
  notIncluded,
  paymentSchedule,
  tuitionRows,
  withdrawal,
} from "@/content/tuition";

export const metadata: Metadata = {
  title: "Tuition, schedules & what's included",
  description: `Weekly and monthly rates for all six rooms at ${site.name}, plus the registration fee, supply fee, sibling discount and exactly what is and is not included. No hidden costs.`,
  alternates: { canonical: "/tuition" },
};

const money = (n: number) => `$${n.toLocaleString("en-US")}`;

export default function TuitionPage() {
  return (
    <>
      <PageHero
        eyebrow="Tuition"
        title="Every rate, and every fee, on one page"
        lead={
          <>
            A parent who cannot find a price assumes she cannot afford it. Here is all of it:
            weekly, monthly, and the two fees that are not tuition. {noHiddenCosts}
          </>
        }
      />

      {/* ---------------- The table ---------------- */}
      <section className="border-b border-line">
        <div className="shell section">
          <h2 className="text-[1.75rem] leading-[1.15] lg:text-[2.25rem]">Rates by room</h2>

          {/* Mobile: a block per room. */}
          <div className="mt-7 space-y-4 md:hidden">
            {tuitionRows.map((row) => (
              <div key={row.slug} className="card p-5">
                <h3 className="text-[1.125rem] leading-tight">{row.label}</h3>
                <p className="mt-0.5 text-[0.875rem] font-semibold text-muted">{row.ages}</p>
                <dl className="mt-4 grid grid-cols-2 gap-4">
                  <div className="rounded-lg bg-brand-tint p-3">
                    <dt className="text-[0.8125rem] text-muted">5 days</dt>
                    <dd className="mt-0.5 font-serif text-[1.375rem] font-semibold">
                      {money(row.rate5)}
                      <span className="block text-[0.8125rem] font-sans font-normal text-muted">
                        {money(row.monthly5)} a month
                      </span>
                    </dd>
                  </div>
                  <div className="rounded-lg bg-brand-tint p-3">
                    <dt className="text-[0.8125rem] text-muted">3 days</dt>
                    <dd className="mt-0.5 font-serif text-[1.375rem] font-semibold">
                      {money(row.rate3)}
                      <span className="block text-[0.8125rem] font-sans font-normal text-muted">
                        {money(row.monthly3)} a month
                      </span>
                    </dd>
                  </div>
                </dl>
                <Link
                  href={`/programs/${row.slug}`}
                  className="mt-3 inline-flex min-h-[48px] items-center text-[0.9375rem] font-semibold text-brand underline underline-offset-4"
                >
                  Inside the {row.label}
                  <span className="sr-only">, {row.ages}</span>
                </Link>
              </div>
            ))}
          </div>

          {/* md and up: one table. */}
          <div className="mt-7 hidden md:block">
            <table className="w-full border-collapse text-left">
              <caption className="sr-only">
                Weekly and monthly-equivalent tuition for all six rooms
              </caption>
              <thead>
                <tr className="border-b-2 border-line text-[0.875rem] text-muted">
                  <th scope="col" className="py-3 pr-4 font-semibold">Room</th>
                  <th scope="col" className="py-3 pr-4 font-semibold">Ages</th>
                  <th scope="col" className="py-3 pr-4 font-semibold">5-day, weekly</th>
                  <th scope="col" className="py-3 pr-4 font-semibold">3-day, weekly</th>
                  <th scope="col" className="py-3 pr-4 font-semibold">5-day, monthly</th>
                  <th scope="col" className="py-3 font-semibold">3-day, monthly</th>
                </tr>
              </thead>
              <tbody>
                {tuitionRows.map((row) => (
                  <tr key={row.slug} className="border-b border-line last:border-0">
                    <th scope="row" className="py-4 pr-4 font-serif text-[1.0625rem] font-semibold">
                      <Link href={`/programs/${row.slug}`} className="underline underline-offset-4">
                        {row.label}
                      </Link>
                    </th>
                    <td className="py-4 pr-4 text-[0.9375rem] text-muted">{row.ages}</td>
                    <td className="py-4 pr-4 font-semibold">{money(row.rate5)}</td>
                    <td className="py-4 pr-4 font-semibold">{money(row.rate3)}</td>
                    <td className="py-4 pr-4 text-muted">{money(row.monthly5)}</td>
                    <td className="py-4 text-muted">{money(row.monthly3)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <p className="mt-5 text-[0.875rem] leading-relaxed text-muted">
            <strong className="font-semibold text-ink">How the monthly figure is worked out:</strong>{" "}
            {monthlyFormula} Every number in the two monthly columns above is that calculation,
            nothing else, so you can check them.
          </p>
        </div>
      </section>

      {/* ---------------- Fees ---------------- */}
      <section className="border-b border-line bg-brand-tint/40">
        <div className="shell section-tight">
          <h2 className="text-[1.75rem] leading-[1.15] lg:text-[2.25rem]">The two fees</h2>
          <p className="measure mt-3 text-[1.0625rem] leading-relaxed text-muted">
            These are the only charges that are not tuition. There is no annual increase written
            into your contract, no technology fee, no late-pickup retainer, no fundraising minimum.
          </p>

          <div className="mt-7 grid gap-5 md:grid-cols-2">
            {fees.map((fee) => (
              <div key={fee.label} className="card p-5 lg:p-6">
                <p className="font-serif text-[1.75rem] font-semibold">{fee.amount}</p>
                <p className="mt-1 font-semibold">{fee.label}</p>
                <p className="text-[0.9375rem] text-muted">{fee.cadence}</p>
                <p className="mt-3 text-[0.9375rem] leading-relaxed text-muted">{fee.detail}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ---------------- Included / not included ---------------- */}
      <section className="border-b border-line">
        <div className="shell section-tight">
          <div className="grid gap-10 lg:grid-cols-2 lg:gap-14">
            <Reveal>
              <h2 className="text-[1.5rem] leading-tight lg:text-[2rem]">
                Included in the weekly rate
              </h2>
              <ul className="mt-5 space-y-3">
                {included.map((item) => (
                  <li key={item} className="flex gap-3 text-[1.0625rem] leading-relaxed">
                    <Check className="mt-1.5 h-4 w-4 shrink-0 text-good" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </Reveal>

            <Reveal>
              <h2 className="text-[1.5rem] leading-tight lg:text-[2rem]">You supply these</h2>
              <ul className="mt-5 space-y-3">
                {notIncluded.map((item) => (
                  <li key={item} className="flex gap-3 text-[1.0625rem] leading-relaxed">
                    <Close className="mt-1 h-4 w-4 shrink-0 text-wait" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
              <p className="mt-5 text-[0.9375rem] leading-relaxed text-muted">
                That is the whole list. If it is not written above, it is in the weekly rate.
              </p>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ---------------- Payment, discounts, subsidy ---------------- */}
      <section className="border-b border-line bg-brand-tint/40">
        <div className="shell section-tight">
          <h2 className="text-[1.75rem] leading-[1.15] lg:text-[2.25rem]">
            {paymentSchedule.headline}
          </h2>
          <div className="measure mt-4 space-y-4 text-[1.0625rem] leading-relaxed text-muted">
            {paymentSchedule.body.map((p) => (
              <p key={p}>{p}</p>
            ))}
          </div>

          <div className="mt-9 grid gap-5 lg:grid-cols-3">
            {discounts.map((d) => (
              <div key={d.label} className="card p-5">
                <h3 className="text-[1.125rem] leading-tight">{d.label}</h3>
                <p className="mt-2 text-[0.9375rem] leading-relaxed text-muted">{d.detail}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ---------------- The promise, and leaving ---------------- */}
      <section className="border-b border-line">
        <div className="shell section-tight">
          <p className="measure font-serif text-[1.5rem] leading-snug font-semibold lg:text-[2rem]">
            {noHiddenCosts}
          </p>

          <div className="card mt-9 p-5 lg:p-7">
            <h2 className="text-[1.375rem] leading-tight lg:text-[1.625rem]">
              {withdrawal.headline}
            </h2>
            <p className="measure mt-3 text-[1.0625rem] leading-relaxed text-muted">
              {withdrawal.body}
            </p>
            <Link
              href="/faq"
              className="mt-4 inline-flex min-h-[48px] items-center font-semibold text-brand underline underline-offset-4"
            >
              The rest of the awkward questions, answered
            </Link>
          </div>

          <p className="mt-8 text-[0.9375rem] leading-relaxed text-muted">
            Questions about a specific month, a subsidy case or an employer benefit? Call{" "}
            <a href={site.phone.href} className="font-semibold text-brand underline underline-offset-4">
              {site.phone.display}
            </a>{" "}
            and ask for Ellen, who handles billing.
          </p>
        </div>
      </section>

      <ClosingCta />
    </>
  );
}
