import { ManagedImg, ManagedAvatar } from "@/components/managed-image";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { ArrowRight, Check } from "@/components/icons";
import { breadcrumbLd, JsonLd } from "@/components/json-ld";
import { Reveal } from "@/components/reveal";
import { AvailabilityChip, AvailabilityText, ClosingCta } from "@/components/ui";
import { bySlug, programs } from "@/content/programs";
import { site } from "@/content/site.config";
import { staffByGroup } from "@/content/staff";
import { forRoom } from "@/content/testimonials";
import { monthlyEquivalent } from "@/content/tuition";

export function generateStaticParams() {
  return programs.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const program = bySlug(slug);
  if (!program) return {};

  return {
    title: `${program.label}: ${program.ages}`,
    description: `${program.label} at ${site.name}: ${program.ages}, ${program.ratio} ratio against an Illinois minimum of ${program.stateRatio}, ${program.classSize} children, $${program.rate5} a week for five days. ${program.oneLiner}`,
    alternates: { canonical: `/programs/${program.slug}` },
  };
}

export default async function ProgramPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const program = bySlug(slug);
  if (!program) notFound();

  const teachers = staffByGroup(program.slug);
  const quotes = forRoom(program.slug);
  const nextRoom = program.next ? bySlug(program.next) : null;

  return (
    <>
      <JsonLd
        data={breadcrumbLd([
          { name: "Home", path: "/" },
          { name: "Programs", path: "/programs" },
          { name: `${program.label}: ${program.ages}`, path: `/programs/${program.slug}` },
        ])}
      />

      {/* ---------------- Header ---------------- */}
      <section className="border-b border-line bg-brand-tint">
        <div className="shell pt-8 pb-10 lg:pt-14 lg:pb-14">
          <nav aria-label="Breadcrumb" className="mb-5">
            <ol className="flex flex-wrap items-center gap-x-2 text-[0.875rem] text-muted">
              <li>
                <Link href="/" className="underline underline-offset-4">Home</Link>
              </li>
              <li aria-hidden="true">/</li>
              <li>
                <Link href="/programs" className="underline underline-offset-4">Programs</Link>
              </li>
              <li aria-hidden="true">/</li>
              <li aria-current="page" className="font-semibold text-ink">{program.label}</li>
            </ol>
          </nav>

          <div className="flex flex-wrap items-center gap-3">
            <AvailabilityChip availability={program.availability} />
            <span className="text-[0.9375rem] font-semibold">
              <AvailabilityText availability={program.availability} />
            </span>
          </div>

          <h1 className="mt-4 text-[2rem] leading-[1.1] lg:text-[3rem]">{program.label}</h1>
          {/* A room name never appears without its age range beside it. */}
          <p className="mt-2 text-[1.125rem] font-semibold text-brand lg:text-[1.375rem]">
            {program.ages}
          </p>

          <p className="measure mt-5 text-[1.0625rem] leading-relaxed text-muted lg:text-[1.1875rem]">
            {program.intro}
          </p>

          <div className="mt-7 flex flex-col gap-2.5 sm:flex-row">
            <Link href="/book-a-tour" className="btn btn-primary">
              Book a Tour
            </Link>
            <a href={site.phone.href} className="btn btn-secondary">
              Call {site.phone.display}
            </a>
          </div>
        </div>
      </section>

      {/* ---------------- The numbers ---------------- */}
      <section className="border-b border-line">
        <div className="shell section-tight">
          <h2 className="text-[1.5rem] leading-tight lg:text-[2rem]">The numbers</h2>

          <dl className="mt-6 grid grid-cols-2 gap-x-5 gap-y-6 lg:grid-cols-4">
            <div>
              <dt className="text-[0.875rem] text-muted">Ages</dt>
              <dd className="mt-1 font-serif text-[1.25rem] font-semibold">{program.ages}</dd>
            </div>
            <div>
              <dt className="text-[0.875rem] text-muted">Our ratio</dt>
              <dd className="mt-1 font-serif text-[1.25rem] font-semibold">
                {program.ratio}
                <span className="block text-[0.875rem] font-sans font-normal text-muted">
                  Illinois allows {program.stateRatio}
                </span>
              </dd>
            </div>
            <div>
              <dt className="text-[0.875rem] text-muted">Class size</dt>
              <dd className="mt-1 font-serif text-[1.25rem] font-semibold">
                {program.classSize} children
                <span className="block text-[0.875rem] font-sans font-normal text-muted">
                  {program.teachersInRoom} teachers, Illinois caps the group at {program.stateMaxGroup}
                </span>
              </dd>
            </div>
            <div>
              <dt className="text-[0.875rem] text-muted">Hours</dt>
              <dd className="mt-1 font-serif text-[1.25rem] font-semibold">{program.hours}</dd>
            </div>
          </dl>

          <div className="card mt-8 p-5 lg:p-6">
            <h3 className="text-[1.125rem]">What it costs</h3>
            <dl className="mt-4 grid gap-4 sm:grid-cols-2">
              <div className="rounded-lg bg-brand-tint p-4">
                <dt className="text-[0.875rem] text-muted">Five days a week</dt>
                <dd className="mt-1 font-serif text-[1.5rem] font-semibold">
                  ${program.rate5}
                  <span className="text-[1rem] font-normal text-muted"> / week</span>
                  <span className="block text-[0.875rem] font-sans font-normal text-muted">
                    ${monthlyEquivalent(program.rate5).toLocaleString("en-US")} a month
                  </span>
                </dd>
              </div>
              <div className="rounded-lg bg-brand-tint p-4">
                <dt className="text-[0.875rem] text-muted">Three days a week</dt>
                <dd className="mt-1 font-serif text-[1.5rem] font-semibold">
                  ${program.rate3}
                  <span className="text-[1rem] font-normal text-muted"> / week</span>
                  <span className="block text-[0.875rem] font-sans font-normal text-muted">
                    ${monthlyEquivalent(program.rate3).toLocaleString("en-US")} a month
                  </span>
                </dd>
              </div>
            </dl>
            <Link
              href="/tuition"
              className="mt-5 inline-flex min-h-[48px] items-center gap-1.5 font-semibold text-brand underline underline-offset-4"
            >
              Fees, what is included, and what is not
              <ArrowRight />
            </Link>
          </div>
        </div>
      </section>

      {/* ---------------- Included ---------------- */}
      <section className="border-b border-line bg-brand-tint/40">
        <div className="shell section-tight">
          <h2 className="text-[1.5rem] leading-tight lg:text-[2rem]">
            What the weekly rate covers
          </h2>
          <ul className="measure mt-6 space-y-3">
            {program.included.map((item) => (
              <li key={item} className="flex gap-3 text-[1.0625rem] leading-relaxed">
                <Check className="mt-1.5 h-4 w-4 shrink-0 text-good" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* ---------------- The room's day ---------------- */}
      <section className="border-b border-line">
        <div className="shell section-tight">
          <h2 className="text-[1.5rem] leading-tight lg:text-[2rem]">
            A day in the {program.label}
          </h2>
          <p className="measure mt-3 text-[1.0625rem] leading-relaxed text-muted">
            {program.ages}. This is the real schedule, including the unglamorous parts.
          </p>

          <Reveal className="mt-8">
            <ol className="relative border-l-2 border-line pl-5">
              {program.rhythm.map((entry) => (
                <li key={entry.time} className="relative pb-5 last:pb-0">
                  <span
                    aria-hidden="true"
                    className="absolute -left-[26px] top-[7px] h-2.5 w-2.5 rounded-full bg-brand ring-4 ring-bg"
                  />
                  <p className="font-semibold tabular-nums">{entry.time}</p>
                  <p className="measure mt-0.5 text-[1.0625rem] leading-relaxed text-muted">
                    {entry.what}
                  </p>
                </li>
              ))}
            </ol>
          </Reveal>

          {program.rhythmNote && (
            <p className="measure mt-6 rounded-[10px] bg-brand-tint p-4 text-[0.9375rem] leading-relaxed">
              {program.rhythmNote}
            </p>
          )}
        </div>
      </section>

      {/* ---------------- Outcomes, in parent language ---------------- */}
      <section className="border-b border-line bg-brand-tint/40">
        <div className="shell section-tight">
          <h2 className="measure-tight text-[1.5rem] leading-tight lg:text-[2rem]">
            What your child will be able to do by the end of the year
          </h2>
          <p className="measure mt-3 text-[1.0625rem] leading-relaxed text-muted">
            Not every child, and not on a schedule. This is what most children in this room manage
            by the time they leave it.
          </p>
          <ul className="measure mt-6 space-y-3">
            {program.outcomes.map((item) => (
              <li key={item} className="flex gap-3 text-[1.0625rem] leading-relaxed">
                <Check className="mt-1.5 h-4 w-4 shrink-0 text-good" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* ---------------- The teachers in this room ---------------- */}
      <section className="border-b border-line">
        <div className="shell section-tight">
          <h2 className="text-[1.5rem] leading-tight lg:text-[2rem]">
            The teachers in the {program.label}
          </h2>
          <p className="measure mt-3 text-[1.0625rem] leading-relaxed text-muted">
            Both of them are in this room all year. Breaks are covered by our two floating teachers,
            never by moving one of these two somewhere else.
          </p>

          <div className="mt-8 grid gap-5 sm:grid-cols-2">
            {teachers.map((person) => (
              <div key={person.name} className="card flex gap-4 p-5">
                <ManagedAvatar image={person.photo} size={80} />
                <div>
                  <p className="font-serif text-[1.0625rem] font-semibold">{person.name}</p>
                  <p className="text-[0.875rem] text-muted">{person.role}</p>
                  <p className="mt-1 text-[0.9375rem] font-semibold text-brand">
                    {person.years} years at {site.shortName}
                  </p>
                  <p className="mt-1 text-[0.875rem] text-muted">{person.credential}</p>
                  <p className="mt-2.5 text-[0.9375rem] leading-relaxed">
                    &ldquo;{person.quote}&rdquo;
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ---------------- Photographs of this room ---------------- */}
      <section className="border-b border-line bg-brand-tint/40">
        <div className="shell section-tight">
          <h2 className="text-[1.5rem] leading-tight lg:text-[2rem]">The {program.label} itself</h2>
          <div className="mt-7 grid gap-5 sm:grid-cols-2">
            {program.photos.map((photo) => (
              <ManagedImg
                key={photo.src}
                image={photo}
                sizes="(min-width: 640px) 28rem, 100vw"
                className="rounded-[10px] border border-line"
              />
            ))}
          </div>

          {quotes.length > 0 && (
            <figure className="measure mt-8 border-l-2 border-brand pl-5">
              <blockquote className="text-[1.0625rem] leading-relaxed">
                &ldquo;{quotes[0].quote}&rdquo;
              </blockquote>
              <figcaption className="mt-3 text-[0.9375rem] text-muted">
                {quotes[0].name}, parent in the {program.label} ({program.ages}),{" "}
                {quotes[0].year}
              </figcaption>
            </figure>
          )}
        </div>
      </section>

      {/* ---------------- Availability + where they go next ---------------- */}
      <section className="border-b border-line">
        <div className="shell section-tight">
          <div className="grid gap-8 lg:grid-cols-2 lg:gap-12">
            <div>
              <h2 className="text-[1.5rem] leading-tight lg:text-[2rem]">Right now</h2>
              <p className="mt-4 flex flex-wrap items-center gap-3">
                <AvailabilityChip availability={program.availability} />
                <span className="text-[1.0625rem] font-semibold">
                  <AvailabilityText availability={program.availability} />
                </span>
              </p>
              <p className="measure mt-4 text-[1.0625rem] leading-relaxed text-muted">
                Updated {site.openingsUpdated}. There is no charge to join a waitlist and no deposit
                to hold a place on one. Ask us your position and we will tell you the number.
              </p>
              <Link href="/book-a-tour" className="btn btn-primary mt-6">
                Book a Tour
              </Link>
            </div>

            {nextRoom && (
              <div className="card p-5 lg:p-6">
                <p className="eyebrow mb-2">Where your child goes next</p>
                <h3 className="text-[1.25rem] leading-tight">{nextRoom.label}</h3>
                <p className="mt-1 text-[0.9375rem] font-semibold text-muted">{nextRoom.ages}</p>
                <p className="mt-3 text-[0.9375rem] leading-relaxed text-muted">
                  {nextRoom.oneLiner}
                </p>
                <p className="mt-3 text-[0.9375rem] leading-relaxed text-muted">
                  Children move up by readiness rather than by birthday, after about two weeks of
                  short visits with their current teacher.
                </p>
                <Link
                  href={`/programs/${nextRoom.slug}`}
                  className="mt-4 inline-flex min-h-[48px] items-center gap-1.5 font-semibold text-brand underline underline-offset-4"
                >
                  Inside the {nextRoom.label}
                  <span className="sr-only">, {nextRoom.ages}</span>
                  <ArrowRight />
                </Link>
              </div>
            )}
          </div>
        </div>
      </section>

      <ClosingCta />
    </>
  );
}
