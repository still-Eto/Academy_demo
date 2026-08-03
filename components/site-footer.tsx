import Link from "next/link";

import { programs } from "@/content/programs";
import { fullAddress, mapsHref, noIndex, site } from "@/content/site.config";
import { Logomark } from "./icons";

/**
 * Four columns collapsing to one on mobile. License number, accreditation and
 * hours are text, not logo images linking to "#".
 * No newsletter signup. No social icons, because there is nothing real to
 * point them at.
 */
export function SiteFooter() {
  return (
    /*
      Forest green, not the near-black ground. The footer is the last thing on
      the page and it is 800px tall; in `ground` it was a second slab of
      near-black under the closing band, and two of those in a row is most of
      what made the foot of this page feel heavy. `primary` is the brand colour,
      it is unmistakably a colour rather than an absence of one, and the page
      white on it measures 10.0:1.
    */
    <footer className="on-dark mt-auto bg-brand text-bg">
      <div className="shell py-8 lg:py-16">
        {/*
          Two columns on mobile, four from `lg`. Twelve navigation links at the
          48px tap-target minimum is 576px of footer if they run in one column
          — nearly three quarters of a phone screen of nothing but links. Side
          by side it is 288px, and the 48px targets and 8px separations are
          untouched. The address and the licensing block stay full width
          because both contain strings that must not be forced to wrap.
        */}
        <div className="grid grid-cols-2 gap-x-6 gap-y-6 lg:grid-cols-4 lg:gap-8">
          {/* 1 — where we are, how to reach us */}
          <div className="col-span-2 lg:col-span-1">
            <div className="mb-4 flex items-center gap-2.5">
              <Logomark className="h-8 w-8 text-bg/95" />
              <span className="font-serif text-lg font-semibold">{site.name}</span>
            </div>
            <address className="not-italic text-[0.9375rem] leading-snug text-bg/85 lg:leading-relaxed">
              {/* min-h-[48px] rather than relying on the line-height: the
                  tighter mobile leading below took this two-line link to 41px
                  tall, under the tap-target floor. */}
              <a
                href={mapsHref}
                className="flex min-h-[48px] flex-col justify-center underline underline-offset-4 hover:text-bg"
              >
                {site.address.street}
                <br />
                {site.address.city}, {site.address.state} {site.address.zip}
              </a>
              {/* Stacked with a real gap so the two tap targets are never
                  adjacent — 8px minimum between neighbouring controls. */}
              <span className="mt-3 flex flex-col gap-2">
                <a
                  href={site.phone.href}
                  className="flex min-h-[48px] items-center font-semibold underline underline-offset-4 hover:text-bg"
                >
                  {site.phone.display}
                </a>
                <a
                  href={`mailto:${site.email}`}
                  className="flex min-h-[48px] items-center underline underline-offset-4 hover:text-bg"
                >
                  {site.email}
                </a>
              </span>
            </address>
          </div>

          {/* 2 — the rooms. A room name never appears without its age range. */}
          <nav aria-label="Programs">
            <h2 className="mb-4 font-serif text-base font-semibold">Programs</h2>
            {/* space-y-2 is the floor, not a preference: 8px is the minimum
                separation between two adjacent tap targets. */}
            <ul className="space-y-2 text-[0.9375rem] text-bg/85">
              {programs.map((p) => (
                <li key={p.slug}>
                  <Link
                    href={`/programs/${p.slug}`}
                    className="flex min-h-[48px] flex-col justify-center py-1 hover:text-bg"
                  >
                    <span className="underline underline-offset-4">{p.label}</span>
                    <span className="text-[0.8125rem] text-bg/70">{p.ages}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          {/* 3 — the pages a parent looks for */}
          <nav aria-label={`About ${site.shortName}`}>
            <h2 className="mb-4 font-serif text-base font-semibold">The school</h2>
            {/* space-y-2 is the floor, not a preference: 8px is the minimum
                separation between two adjacent tap targets. */}
            <ul className="space-y-2 text-[0.9375rem] text-bg/85">
              {[
                { href: "/safety", label: "Safety & health" },
                { href: "/tuition", label: "Tuition & schedules" },
                { href: "/faq", label: "Questions parents ask" },
                { href: "/about", label: "About us" },
                { href: "/staff", label: "Meet the teachers" },
                { href: "/contact", label: "Contact & directions" },
              ].map((l) => (
                <li key={l.href}>
                  <Link
                    href={l.href}
                    className="flex min-h-[48px] items-center underline underline-offset-4 hover:text-bg"
                  >
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          {/* 4 — the credentials, as text */}
          <div className="col-span-2 lg:col-span-1">
            <h2 className="mb-4 font-serif text-base font-semibold">Licensing & hours</h2>
            <ul className="space-y-2.5 text-[0.9375rem] leading-snug text-bg/85 lg:space-y-3 lg:leading-relaxed">
              <li>
                Licensed #{site.license.number}
                <br />
                <span className="text-bg/70">{site.license.agency}</span>
              </li>
              {site.accreditations.map((a) => (
                <li key={a.label}>
                  {a.href ? (
                    <a
                      href={a.href}
                      rel="noopener noreferrer"
                      target="_blank"
                      className="underline underline-offset-4 hover:text-bg"
                    >
                      {a.label}
                    </a>
                  ) : (
                    a.label
                  )}
                </li>
              ))}
              <li>
                {site.hours.display}
                <br />
                <span className="text-bg/70">{site.hours.closedNote}</span>
              </li>
              <li>
                Licensed capacity {site.license.capacityDay} in the day program, plus{" "}
                {site.license.capacityAfterSchool} in the after-school club.
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-7 border-t border-bg/20 pt-4 text-[0.8125rem] text-bg/65 lg:mt-12 lg:pt-6">
          <p>
            © {new Date().getFullYear()} {site.name}. {fullAddress}.
          </p>

          {/*
            THE DEMO DISCLAIMER.

            Two real accrediting bodies are named on this site and both marks
            link to the real registries — NAEYC and ExceleRate Illinois. The
            license number, the address and the phone number are invented. That
            combination is fine behind `noindex` and a `Disallow: /`, and it is
            not fine once somebody pastes the URL into an email, which is
            exactly what a demo is for.

            Conditional on `noIndex`, which is the flag that already means "this
            deployment is a demonstration". So it appears on every demo and
            disappears by itself on the real center's site, where every claim
            above it is true and a disclaimer would be nonsense — the same
            switch, doing the same job, in one more place.
          */}
          {noIndex && (
            <p className="mt-2">
              Demonstration site. {site.name} is not a real school: the license number, address and
              phone number on these pages are invented, and the accreditations shown are examples of
              what a center would list rather than credentials this one holds.
            </p>
          )}
        </div>
      </div>
    </footer>
  );
}
