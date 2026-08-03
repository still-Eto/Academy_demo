import { ManagedImg } from "@/components/managed-image";
import { mapImage } from "@/content/images";
import type { Metadata } from "next";

import { MapPin, Phone } from "@/components/icons";
import { ClosingCta, PageHero } from "@/components/ui";
import { fullAddress, mapsHref, site } from "@/content/site.config";

export const metadata: Metadata = {
  title: "Contact & directions",
  description: `${fullAddress}. ${site.phone.display}. Open ${site.hours.display}. Parking, the door to use, and a map.`,
  alternates: { canonical: "/contact" },
};

export default function ContactPage() {
  return (
    <>
      <PageHero
        eyebrow="Contact"
        title={site.location.driveTime}
        lead={`${site.location.driveTimeSecondary}. Here is the address, the phone number and where to park.`}
      />

      <div className="shell section">
        <div className="grid gap-10 lg:grid-cols-2 lg:gap-14">
          <div>
            <ul className="space-y-6">
              <li className="flex gap-3">
                <MapPin className="mt-1 h-5 w-5 shrink-0 text-brand" />
                <div>
                  <h2 className="font-serif text-[1.125rem] font-semibold">Address</h2>
                  <address className="mt-1 not-italic">
                    <a
                      href={mapsHref}
                      className="text-[1.0625rem] font-semibold text-brand underline underline-offset-4"
                    >
                      {site.address.street}
                      <br />
                      {site.address.city}, {site.address.state} {site.address.zip}
                    </a>
                  </address>
                </div>
              </li>

              <li className="flex gap-3">
                <Phone className="mt-1 h-5 w-5 shrink-0 text-brand" />
                <div>
                  <h2 className="font-serif text-[1.125rem] font-semibold">Phone and email</h2>
                  <p className="mt-1">
                    <a
                      href={site.phone.href}
                      className="text-[1.0625rem] font-semibold text-brand underline underline-offset-4"
                    >
                      {site.phone.display}
                    </a>
                  </p>
                  <p className="mt-1">
                    <a
                      href={`mailto:${site.email}`}
                      className="text-[1.0625rem] font-semibold text-brand underline underline-offset-4"
                    >
                      {site.email}
                    </a>
                  </p>
                  <p className="mt-2 text-[0.9375rem] leading-relaxed text-muted">
                    {site.director.responsePromise}
                  </p>
                </div>
              </li>
            </ul>

            <div className="card mt-8 p-5">
              <h2 className="font-serif text-[1.125rem] font-semibold">Hours</h2>
              <p className="mt-1 text-[1.0625rem] font-semibold">{site.hours.display}</p>
              <p className="mt-1 text-[0.9375rem] text-muted">
                {site.hours.closedNote} The after-school club runs 2:30pm&ndash;6:00pm on school
                days and 7:00am&ndash;6:00pm on District 205 institute days and school breaks.
              </p>
            </div>

            <div className="card mt-5 p-5">
              <h2 className="font-serif text-[1.125rem] font-semibold">Parking and which door</h2>
              <p className="mt-2 text-[0.9375rem] leading-relaxed text-muted">
                {site.location.parking}
              </p>
              <p className="mt-2 text-[0.9375rem] leading-relaxed text-muted">
                {site.location.door}
              </p>
            </div>
          </div>

          <div>
            <a href={mapsHref} className="block overflow-hidden rounded-[10px] border border-line">
              <ManagedImg image={mapImage} sizes="(min-width: 1024px) 34rem, 100vw" />
              <span className="block bg-surface px-4 py-3 text-[0.9375rem] font-semibold text-brand underline underline-offset-4">
                Open in maps
              </span>
            </a>

            <p className="mt-5 text-[0.9375rem] leading-relaxed text-muted">
              Licensed #{site.license.number}, {site.license.agency}.{" "}
              {site.accreditations.map((a) => a.label).join(". ")}.
            </p>
          </div>
        </div>
      </div>

      <ClosingCta />
    </>
  );
}
