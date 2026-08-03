import { ManagedImg, ManagedAvatar } from "@/components/managed-image";
import { directorImage } from "@/content/images";
import type { Metadata } from "next";
import Image from "next/image";

import { Reveal } from "@/components/reveal";
import { ClosingCta, PageHero } from "@/components/ui";
import { building, directorNote, practices, story } from "@/content/about";
import { site } from "@/content/site.config";
import { leadTeacherAverageTenure } from "@/content/staff";

export const metadata: Metadata = {
  title: "About us",
  description: `${site.name} opened in ${site.founded} on ${site.address.street} in ${site.address.city}. How we started, three things we actually do, the building, and a note from ${site.director.name}.`,
  alternates: { canonical: "/about" },
};

export default function AboutPage() {
  return (
    <>
      <PageHero
        eyebrow="About"
        title={`${site.name}, since ${site.founded}`}
        lead={`One floor, six rooms, ${site.license.capacityDay} children in the day program and ${site.license.capacityAfterSchool} in the after-school club. Our six lead teachers have been here an average of ${leadTeacherAverageTenure} years.`}
      />

      {/* ---------------- 1. How it started ---------------- */}
      <section className="border-b border-line">
        <div className="shell section-tight">
          <h2 className="text-[1.75rem] leading-[1.15] lg:text-[2.25rem]">{story.heading}</h2>
          <div className="measure mt-5 space-y-4 text-[1.0625rem] leading-relaxed text-muted lg:text-[1.125rem]">
            {story.paragraphs.map((p) => (
              <p key={p}>{p}</p>
            ))}
          </div>
        </div>
      </section>

      {/* ---------------- 2. How we teach: three practices, not three values ---------------- */}
      <section className="border-b border-line bg-brand-tint/40">
        <div className="shell section-tight">
          <h2 className="text-[1.75rem] leading-[1.15] lg:text-[2.25rem]">How we teach</h2>
          <p className="measure mt-4 text-[1.0625rem] leading-relaxed text-muted">
            Three things we do, rather than three things we believe. You can check all three on a
            tour, and you should.
          </p>

          <div className="mt-9 space-y-8 lg:space-y-10">
            {practices.map((practice, i) => (
              <Reveal key={practice.heading} delay={Math.min(i, 3) * 40}>
                <div className="measure border-l-2 border-brand pl-5 lg:pl-6">
                  <h3 className="text-[1.25rem] leading-snug lg:text-[1.5rem]">
                    {practice.heading}
                  </h3>
                  <p className="mt-3 text-[1.0625rem] leading-relaxed text-muted">
                    {practice.body}
                  </p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ---------------- 3. The building ---------------- */}
      <section className="border-b border-line">
        <div className="shell section-tight">
          <h2 className="text-[1.75rem] leading-[1.15] lg:text-[2.25rem]">{building.heading}</h2>
          <p className="measure mt-4 text-[1.0625rem] leading-relaxed text-muted">
            {building.intro}
          </p>

          <div className="mt-9 grid gap-7 md:grid-cols-2 lg:gap-9">
            {building.spaces.map((space, i) => (
              <Reveal key={space.name} delay={Math.min(i, 3) * 40}>
                <figure>
                  <ManagedImg
                    image={space.photo}
                    sizes="(min-width: 768px) 32rem, 100vw"
                    className="rounded-[10px] border border-line"
                  />
                  <figcaption className="mt-4">
                    <h3 className="text-[1.125rem] leading-tight">{space.name}</h3>
                    <p className="mt-2 text-[0.9375rem] leading-relaxed text-muted">{space.body}</p>
                  </figcaption>
                </figure>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ---------------- 4. A note from Marisol ---------------- */}
      <section className="border-b border-line bg-brand-tint/40">
        <div className="shell section-tight">
          <div className="card p-6 lg:p-9">
            <div className="flex items-center gap-4">
              <ManagedAvatar image={directorImage} size={80} />
              <div>
                <h2 className="text-[1.375rem] leading-tight lg:text-[1.625rem]">
                  {directorNote.heading}
                </h2>
                <p className="mt-1 text-[0.9375rem] text-muted">
                  {site.director.role} · {site.director.tenureYears} years here ·{" "}
                  {site.director.credential}
                </p>
              </div>
            </div>

            <div className="measure mt-6 space-y-4 text-[1.0625rem] leading-relaxed">
              {directorNote.paragraphs.map((p) => (
                <p key={p}>{p}</p>
              ))}
            </div>

            <Image
              src={directorNote.signature.src}
              alt={directorNote.signature.alt}
              width={directorNote.signature.width}
              height={directorNote.signature.height}
              unoptimized
              loading="lazy"
              className="mt-7 h-16 w-auto"
            />

            <p className="mt-2 text-[0.9375rem] text-muted">
              {site.director.name} ·{" "}
              <a
                href={`mailto:${site.director.email}`}
                className="font-semibold text-brand underline underline-offset-4"
              >
                {site.director.email}
              </a>
            </p>
          </div>
        </div>
      </section>

      <ClosingCta />
    </>
  );
}
