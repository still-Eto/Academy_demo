import type { Metadata } from "next";
import Link from "next/link";

import { ChevronDown } from "@/components/icons";
import { faqLd, JsonLd } from "@/components/json-ld";
import { ClosingCta, PageHero } from "@/components/ui";
import { faqs } from "@/content/faq";
import { site } from "@/content/site.config";

export const metadata: Metadata = {
  title: "Questions parents actually ask",
  description: `Waitlists, toilet training, sick days, snow days, part-time, dropping in unannounced, naps, screens, discipline, food, moving up a room, and how to leave, answered plainly by ${site.name}.`,
  alternates: { canonical: "/faq" },
};

/**
 * <details>/<summary> — this works with JavaScript disabled, needs no client
 * bundle, and is keyboard-operable for free. A "Read More" toggle hiding four
 * paragraphs of prose would be the wrong tool; these are real questions.
 */
export default function FaqPage() {
  return (
    <>
      <JsonLd data={faqLd()} />

      <PageHero
        eyebrow="Questions"
        title="The twelve questions we actually get asked"
        lead={
          <>
            Including the last one, which almost nobody answers on a website. If yours is not here,
            call {site.phone.display} and ask for {site.director.firstName}.
          </>
        }
      />

      <div className="shell section">
        <div className="measure">
          <ul className="space-y-3">
            {faqs.map((faq, i) => (
              <li key={faq.q}>
                <details
                  name="faq"
                  className="card group px-5 py-1 [&_summary::-webkit-details-marker]:hidden"
                  open={i === 0}
                >
                  <summary className="flex min-h-[56px] cursor-pointer list-none items-center justify-between gap-4 py-3 font-serif text-[1.125rem] leading-snug font-semibold lg:text-[1.25rem]">
                    {faq.q}
                    <ChevronDown className="h-5 w-5 shrink-0 text-brand transition-transform group-open:rotate-180" />
                  </summary>
                  <div className="space-y-3 pb-5 text-[1.0625rem] leading-relaxed text-muted">
                    {faq.a.map((para) => (
                      <p key={para}>{para}</p>
                    ))}
                  </div>
                </details>
              </li>
            ))}
          </ul>

          <div className="mt-12 rounded-[10px] bg-brand-tint p-6">
            <h2 className="text-[1.25rem] leading-tight lg:text-[1.5rem]">
              Something else on your mind?
            </h2>
            <p className="mt-3 text-[1.0625rem] leading-relaxed">
              {site.director.responsePromise} Ask her anything, including what we are not good at.
            </p>
            <p className="mt-4 flex flex-col gap-2 sm:flex-row sm:gap-4">
              <a
                href={`mailto:${site.director.email}`}
                className="flex min-h-[48px] items-center font-semibold text-brand underline underline-offset-4"
              >
                {site.director.email}
              </a>
              <a
                href={site.phone.href}
                className="flex min-h-[48px] items-center font-semibold text-brand underline underline-offset-4"
              >
                {site.phone.display}
              </a>
            </p>
            <p className="mt-5 text-[0.9375rem] text-muted">
              The detail behind several of these answers is on the{" "}
              <Link href="/safety" className="font-semibold text-brand underline underline-offset-4">
                safety page
              </Link>{" "}
              and the{" "}
              <Link href="/tuition" className="font-semibold text-brand underline underline-offset-4">
                tuition page
              </Link>
              .
            </p>
          </div>
        </div>
      </div>

      <ClosingCta />
    </>
  );
}
