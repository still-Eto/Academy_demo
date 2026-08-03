import { ManagedAvatar, ManagedImg } from "@/components/managed-image";
import { StatCounterGrid } from "@/components/stat-counter-grid";
import { bandImages, mapImage } from "@/content/images";
import type { Metadata } from "next";
import Link from "next/link";

import { DayTimeline } from "@/components/day-timeline";
import { HeroMedia } from "@/components/hero-media";
import {
  ArrowRight,
  DoorKeypad,
  Fingerprint,
  MapPin,
  Phone,
  PostedNotice,
  Thermometer,
} from "@/components/icons";
import { OpeningsBlock } from "@/components/openings-block";
import { Reveal } from "@/components/reveal";
import {
  ClosingCta,
  PhotoBand,
  ProgramCard,
  SectionHeading,
  TrustLine,
} from "@/components/ui";
import type { SafetyClaimIcon } from "@/content/safety";
import { afterSchoolSpaces, dayProgramSpaces, programs } from "@/content/programs";
import { homeSafetyClaims } from "@/content/safety";
import { homeTitle, mapsHref, site } from "@/content/site.config";
import { featuredStaff, leadTeacherAverageTenure } from "@/content/staff";
import { homeTestimonials } from "@/content/testimonials";
import { programs as allPrograms } from "@/content/programs";

export const metadata: Metadata = {
  /*
    `absolute` bypasses the root layout's `%s · <name>` template. Without it the
    template appends the brand a second time — which is how this page ended up
    with a 101-character title carrying the name twice and a period in the
    middle of it.
  */
  title: { absolute: homeTitle },
  description: `Licensed early learning in ${site.address.city}. 1:3 infant ratio against an Illinois minimum of 1:4. ${dayProgramSpaces} day-program spaces open this fall, listed by room. Open ${site.hours.short}.`,
  alternates: { canonical: "/" },
};

/**
 * The room each quote belongs to, for the attribution line: a room name never
 * appears without its age range, and both come from here.
 *
 * These used to carry a photograph of the room above the caption. They no
 * longer do, for two reasons. The section is large pull-quote type and a boxed
 * photograph under each quote fights it — but the deciding one is that the
 * Acorn Room (6 weeks – 15 months) has no photograph and deliberately never
 * will: every frame we hold shows a toddler or a preschooler, and a parent of a
 * six-week-old spots the age mismatch instantly. Its wordless block sat
 * directly under the best quote on the page, reading as an image that had
 * failed to load — the same defect as the staff silhouettes.
 *
 * The room photographs still appear on the program cards, the six room pages
 * and /about, which is where a parent goes to look at rooms.
 */
const quoteRooms = homeTestimonials.map(
  (t) => allPrograms.find((p) => p.slug === t.room)!,
);

/**
 * The four safety marks, keyed by the `icon` on each claim in content/safety.ts
 * rather than by position in the array, so reordering the claims cannot put a
 * thermometer next to the door policy.
 */
const SAFETY_MARKS: Record<SafetyClaimIcon, (p: { className?: string }) => React.ReactElement> = {
  door: DoorKeypad,
  fingerprint: Fingerprint,
  notice: PostedNotice,
  thermometer: Thermometer,
};

export default function HomePage() {
  return (
    <>
      {/* ------------------------------------------------------------------
          1 — HERO

          85vh on a phone, 88vh from `lg`, never under 640px. The height is the
          point: it has to fill the screen, and it has to be obvious that
          something continues below it — which is what the trust-line plinth at
          the very bottom does as well as anything an arrow would.

          `justify-between` with a spacer above puts the headline block in the
          lower third rather than the middle. Vertically centred, a headline on
          a photograph reads as a caption laid over it; sitting low, it reads as
          standing on it.

          The nav overlays this section transparently — see components/
          site-header.tsx, which switches to the solid ground once the hero has
          scrolled past.
         ------------------------------------------------------------------ */}
      <section
        data-hero=""
        /*
          `min-h`, not `h`. The height target is 85/88vh and it is met at every
          real viewport — but a fixed height plus `overflow-hidden` means that
          the day a heading wraps to a fourth line, or a visitor has bumped
          their default font size, the top of the section is silently cut off
          and the eyebrow disappears under the nav. With `min-h` the section
          grows instead. It has never had to here; it is there so it cannot
          fail closed.

          `pt` clears the overlaying navigation in that same case.
        */
        className="relative isolate flex min-h-[max(85vh,640px)] flex-col justify-end overflow-hidden pt-[64px] lg:min-h-[max(88vh,640px)] lg:pt-[72px]"
      >
        <HeroMedia />

        {/* The hairline corner frame. Inset below the nav rather than from the
            top of the section, or its top-left corner draws through the
            logotype. One of the three repeated ornaments; the day timeline and
            the closing band carry the same one. */}
        <div
          className="frame-brass pointer-events-none absolute inset-x-0 bottom-0 top-[60px] lg:top-[76px]"
          aria-hidden="true"
        />

        <div className="on-dark relative shell pb-3 lg:pb-3">
          {/*
            "Since 2011", not "Licensed since 2011". `site.founded` is when the
            school opened. Illinois child care licensure only moved to IDEC on
            1 July 2026, so a licence issued in 2011 would have carried a DCFS
            prefix, not the IDEC number printed in the trust line four inches
            below this. Two true facts, welded into one sentence that is not —
            on a page whose entire argument is that its numbers hold up.

            The licence itself is in the trust line and in the footer, where it
            appears without a date attached to it.
          */}
          <p className="eyebrow eyebrow-light">
            {site.address.city}, {site.address.state} &middot; Since {site.founded}
          </p>

          {/*
            The one <h1>. At 1568px this computes to 91px — larger than the
            headline on any of the four reference sites.

            The measure is capped in `ch`, not `rem`, so the line count holds as
            the size changes.

            17ch, and the number is set by the scrim rather than by taste. White
            type on a photograph needs about 65% of darkness under it whatever
            else is true — so every character the headline runs to the right is
            another column of picture that has to be darkened to carry it. At
            22ch the type reached 70% of the frame and took the daylight with
            it. At 17ch it clears the left half, the scrim falls away after it,
            and the right of the photograph is at 8%.
          */}
          <h1 className="display display-reserve mt-3 max-w-[16ch] text-bg lg:mt-3 lg:max-w-[17ch]">
            Elmhurst early learning, three infants to one teacher.
          </h1>

          <p className="measure mt-3.5 text-[1.0625rem] leading-[1.5] text-bg/85 lg:mt-4 lg:text-[1.1875rem]">
            Six weeks to kindergarten, plus after-school care to age 10.{" "}
            <strong className="font-semibold text-bg">
              {dayProgramSpaces} spaces open this fall
            </strong>{" "}
            — we list them by room below.
          </p>

          {/*
            One button, not two. The old pair had a solid terracotta CTA beside
            a bordered secondary of the same height and weight, which is two
            primary actions wearing different coats. The openings link keeps its
            place and loses the border — it is a quiet white text link under the
            button now, which is what it always was in the information
            hierarchy.
          */}
          {/* `gap-2`, not `gap-1`. The two are separate tap targets and the
              mobile rule is 48px each with 8px between them; at 4px the
              measured gap failed. The link's own 48px box makes the optical
              gap larger than the 8px suggests. */}
          <div className="mt-5 flex flex-col items-start gap-2 lg:mt-5">
            <Link href="/book-a-tour" className="btn btn-primary">
              Book a Tour
            </Link>
            <a
              href="#openings"
              className="flex min-h-[48px] items-center font-semibold text-bg underline decoration-1 underline-offset-[6px]"
            >
              See this month&rsquo;s openings
            </a>
          </div>
        </div>

        {/*
          The plinth. A brass hairline with a centred diamond, and the four
          claims beneath it, at the very base of the image. Answers "is my child
          safe here" without the visitor scrolling, and gives the headline
          something to stand on rather than float over.
        */}
        <div className="on-dark relative shell pb-5 lg:pb-6">
          <div className="rule-diamond rule-diamond-light mb-3 lg:mb-3" aria-hidden="true">
            <span />
          </div>
          <TrustLine tone="dark" />
        </div>
      </section>

      {/* STAT COUNTERS */}
      <section className="bg-sand/50 border-b border-line py-8 lg:py-12">
        <div className="shell">
          <StatCounterGrid />
        </div>
      </section>

      {/* ------------------------------------------------------------------
          2 — LIVE OPENINGS BY CLASSROOM

          Deliberately NOT wrapped in <Reveal>. On a 2560px monitor this whole
          section is inside the first viewport before any observer has run, and
          the hero's own "See this month's openings" button jumps straight here
          — a jump is not a scroll. It renders opaque, always.
         ------------------------------------------------------------------ */}
      {/*
        Sand, not the dark ground.

        The art direction put this section on near-black because dark reads as
        emphasis. It does — and six sections doing it left the page more than
        half dark, which on a childcare site reads as solemn rather than
        serious. The emphasis here was never the ground anyway: it is a numeral
        set at display scale. That works just as hard in brand green on a warm
        light field, and the page gets its brightness back.
      */}
      <section id="openings" className="on-sand scroll-mt-4">
        <div className="shell section-tall">
          <SectionHeading
            size="display"
            eyebrow={`Updated ${site.openingsUpdated}`}
            title="Where there is actually a space right now"
            /*
              The trailing clause of each lead is an aside. It reads well on a
              desktop column and costs three lines on a phone, so below `sm` it
              is not rendered. Nothing is duplicated — the same sentence simply
              stops earlier at mobile width.
            */
            lead={
              <>
                {dayProgramSpaces} spaces across the day program and {afterSchoolSpaces} in the
                after-school club. When a room is full we say so and we tell you roughly how long
                the wait is
                <span className="hidden sm:inline">
                  , because you have three other tabs open and you deserve to close one of them
                </span>
                .
              </>
            }
          />
          <div className="mt-8 lg:mt-12">
            <OpeningsBlock />
          </div>
        </div>
      </section>

      {/* ------------------------------------------------------------------
          3 — SIX PROGRAM CARDS
          Canvas, light, dense. The relief after the dark openings block, and
          the place the six existing bright activity photographs belong.
         ------------------------------------------------------------------ */}
      <section className="border-b border-line">
        <div className="shell section">
          <Reveal>
            <SectionHeading
              eyebrow="The six rooms"
              title="Ratio, class size, hours and price, without clicking"
              lead={
                <>
                  Every room beats the Illinois legal minimum on staffing. The state figure is in
                  brackets beside ours
                  <span className="hidden sm:inline"> so you can check the gap yourself</span>.
                </>
              }
            />
          </Reveal>

          <div className="mt-6 grid gap-3.5 sm:grid-cols-2 sm:gap-4 lg:mt-10 lg:grid-cols-3 lg:gap-6">
            {programs.map((program, i) => (
              <Reveal key={program.slug} delay={Math.min(i, 3) * 40}>
                <ProgramCard program={program} compactOnMobile />
              </Reveal>
            ))}
          </div>

          <Reveal>
            <Link
              href="/programs"
              className="mt-4 inline-flex min-h-[48px] items-center gap-1.5 font-semibold text-brand underline underline-offset-4 lg:mt-8"
            >
              Compare all six rooms in one table
              <ArrowRight />
            </Link>
          </Reveal>
        </div>
      </section>

      {/* ------------------------------------------------------------------
          4 — THE MID-PAGE BREATH
          A full-bleed photograph, edge to edge, with no words on it at all.
          It sits between the densest light section on the page and the darkest,
          and it is the transition between them.
         ------------------------------------------------------------------ */}
      <PhotoBand image={bandImages.breath} focus="object-[50%_58%]" />

      {/* ------------------------------------------------------------------
          5 — A DAY AT BRIDGEWOOD

          The section that lets a parent picture her child in the room, so it
          is the one that should feel like a room. Full-bleed low-light
          photograph as the ground, a heavy flat scrim over it, the timeline
          set in two columns on top. Cinematic rather than administrative — it
          was a toggle and a bulleted list.
         ------------------------------------------------------------------ */}
      <section className="on-tint">
        <div className="shell section-tall">
          <Reveal>
            <SectionHeading
              size="display"
              eyebrow="Hour by hour"
              title={`A day at ${site.shortName}`}
              lead={
                <>
                  Pick a room and read the whole day. This is the real schedule
                  <span className="hidden sm:inline">
                    , including the parts that are unglamorous
                  </span>
                  .
                </>
              }
            />
          </Reveal>
          <Reveal className="mt-8 lg:mt-12">
            <DayTimeline />
          </Reveal>
        </div>
      </section>

      {/* ------------------------------------------------------------------
          6 — SAFETY, IN FOUR CONCRETE CLAIMS

          Canvas, light, four cards under a brass hairline, each with its own
          thin-stroke mark. The four marks are the only icons on the page
          besides the timeline's, and they exist as a set — which is what stops
          them reading as clip art.
         ------------------------------------------------------------------ */}
      <section className="border-b border-line">
        <div className="shell section">
          <Reveal>
            <SectionHeading
              size="display"
              eyebrow="Safety"
              title="Four things you can check on the tour"
              lead="Not reassurance. Procedures, thresholds and frequencies, all of which you are welcome to test in person."
            />
          </Reveal>

          <div className="mt-7 grid gap-3.5 md:grid-cols-2 md:gap-5 lg:mt-11 lg:gap-6">
            {homeSafetyClaims.map((claim, i) => {
              const Mark = SAFETY_MARKS[claim.icon];
              return (
                <Reveal key={claim.href} delay={Math.min(i, 3) * 40}>
                  {/*
                    The whole card is the link, so "Read the detail" is an
                    affordance rather than a second target — it does not need to
                    hold 48px of its own on a phone. `card-brass` is the same
                    hairline the openings cards carry, which is what ties the
                    two card sets on this page together.
                  */}
                  <Link
                    href={claim.href}
                    className="card card-brass flex h-full flex-col rounded-t-none p-5 lg:p-7"
                  >
                    <Mark className="h-7 w-7 text-brand lg:h-8 lg:w-8" />
                    <h3 className="mt-4 text-[1.0625rem] leading-snug lg:mt-5 lg:text-[1.25rem]">
                      {claim.heading}
                    </h3>
                    <p className="mt-2.5 text-[0.9375rem] leading-snug text-muted lg:mt-3 lg:leading-relaxed">
                      {claim.body}
                    </p>
                    <span className="mt-auto flex items-center gap-1.5 pt-3 font-semibold text-brand underline underline-offset-4 lg:min-h-[48px] lg:pt-4">
                      Read the detail
                      <ArrowRight />
                    </span>
                  </Link>
                </Reveal>
              );
            })}
          </div>
        </div>
      </section>

      {/* ------------------------------------------------------------------
          7 — THE ROOM, FULL-BLEED

          Directly under the safety claims, edge to edge, no container: the
          building at 7:30am with nobody in it. A claim about what a room is
          like, immediately followed by the room.
         ------------------------------------------------------------------ */}
      <PhotoBand image={bandImages.safety} focus="object-[50%_78%]" />

      {/* ------------------------------------------------------------------
          6 — PARENT QUOTES, beside photographs of the rooms
         ------------------------------------------------------------------ */}
      {/*
        Canvas, not `deep`. This section was dark and did not need to be: with
        the hero, the openings, the day timeline, the location band, the closing
        band and the footer all on a dark ground, 60% of the page's scroll
        height was dark and the whole thing read heavy — on a site selling
        childcare. Moving the quotes back to the page ground drops it to about
        40%, which is what the art direction asked for in the first place, and
        puts a light stretch between the day timeline and the location band.
      */}
      <section className="on-sand">
        <div className="shell section">
          <Reveal>
            <SectionHeading
              size="display"
              eyebrow="From families here now"
              title="Named parents, named rooms, named years"
              lead="We publish the room and the year alongside every quote, so you can ask about it on the tour."
            />
          </Reveal>

          {/*
            Same swipeable strip as the teachers below. Three full-bleed quote
            cards stacked ran to about 1,500px on a phone — a screen and three
            quarters to read three sentences. Side by side, the second card is
            visibly cut off at the right edge, which is what tells a thumb
            there is more.
          */}
          <ul className="mt-6 -mx-5 flex snap-x snap-mandatory gap-4 overflow-x-auto px-5 pb-1.5 md:-mx-8 md:px-8 lg:mx-0 lg:mt-10 lg:grid lg:grid-cols-3 lg:gap-7 lg:overflow-visible lg:px-0 lg:pb-0">
            {homeTestimonials.map((t, i) => {
              const room = quoteRooms[i];
              return (
                <li
                  key={t.name}
                  className="w-[82vw] max-w-[22rem] shrink-0 snap-start sm:w-[54vw] lg:w-auto lg:max-w-none"
                >
                  <Reveal delay={Math.min(i, 3) * 40} className="h-full">
                    {/*
                      No card, no border, no fill. On the dark ground a boxed
                      quote reads as a widget; the quote set larger, with a
                      brass rule over it and the photograph beneath, reads as a
                      pull-quote. Same three facts — name, room, year — and the
                      writing gets the size it was always worth.
                    */}
                    <figure className="flex h-full flex-col">
                      <div className="rule-lead mb-5 lg:mb-6" aria-hidden="true" />
                      <blockquote className="font-serif text-[1.25rem] leading-[1.35] text-ink lg:text-[1.5rem]">
                        &ldquo;{t.quote}&rdquo;
                      </blockquote>
                      <figcaption className="mt-4 text-[0.9375rem] leading-snug text-muted lg:mt-5">
                        &mdash; {t.name}, parent in the {room.label} ({room.ages}), {t.year}
                      </figcaption>
                    </figure>
                  </Reveal>
                </li>
              );
            })}
          </ul>
        </div>
      </section>

      {/* ------------------------------------------------------------------
          7 — TEACHERS. Tenure is the trust signal.
         ------------------------------------------------------------------ */}
      <section className="border-b border-line">
        <div className="shell section">
          <Reveal>
            <SectionHeading
              eyebrow="The people in the room"
              title="How long they have been here"
              lead={
                <>
                  Our six lead teachers have been here an average of {leadTeacherAverageTenure}{" "}
                  years. Two floating teachers cover every break
                  <span className="hidden sm:inline">
                    , so your child&rsquo;s teacher is never pulled into another room
                  </span>
                  .
                </>
              }
            />
          </Reveal>

          {/*
            A swipeable strip on mobile, a four-up grid from `lg`. Four stacked
            full-width cards cost about 600px of scroll to say one thing —
            these teachers have been here a long time. The strip says it in
            one screen and invites a swipe for the rest.
          */}
          <ul className="mt-6 -mx-5 flex snap-x snap-mandatory gap-4 overflow-x-auto px-5 pb-1.5 md:-mx-8 md:px-8 lg:mx-0 lg:mt-10 lg:grid lg:grid-cols-4 lg:gap-6 lg:overflow-visible lg:px-0 lg:pb-0">
            {featuredStaff.map((person, i) => (
              <li
                key={person.name}
                className="w-[58vw] max-w-[15rem] shrink-0 snap-start sm:w-[38vw] lg:w-auto lg:max-w-none"
              >
                <Reveal delay={Math.min(i, 3) * 40} className="h-full">
                  <div className="card h-full p-4 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center gap-3 mb-3">
                        <ManagedAvatar image={person.photo} size={48} name={person.name} />
                        <div>
                          <p className="font-serif text-[1.0625rem] leading-tight font-semibold">
                            {person.name}
                          </p>
                          <p className="text-[0.8125rem] text-muted">{person.credential}</p>
                        </div>
                      </div>
                      <p className="mt-1 text-[0.875rem] font-semibold text-brand">
                        {person.years} years at {site.shortName}
                      </p>
                    </div>
                  </div>
                </Reveal>
              </li>
            ))}
          </ul>

          <Reveal>
            <Link
              href="/staff"
              className="mt-4 inline-flex min-h-[48px] items-center gap-1.5 font-semibold text-brand underline underline-offset-4 lg:mt-8"
            >
              Everyone who works here, including Rosa who cooks
              <ArrowRight />
            </Link>
          </Reveal>
        </div>
      </section>

      {/* ------------------------------------------------------------------
          10 — LOCATION
          Ink. The last dark section before the closing band, and the one that
          turns an address into a drive time.
         ------------------------------------------------------------------ */}
      <section className="on-tint">
        <div className="shell section">
          <div className="grid gap-7 lg:grid-cols-2 lg:items-center lg:gap-14">
            <Reveal>
              <SectionHeading
                tone="dark"
                size="display"
                eyebrow="Getting here"
                title={site.location.driveTime}
                lead={site.location.driveTimeSecondary + ". Here is everything you need to plan the run from work."}
              />

              <ul className="mt-5 space-y-2 lg:mt-7 lg:space-y-4">
                <li className="flex items-center gap-3">
                  <MapPin className="h-5 w-5 text-brand" />
                  <a
                    href={mapsHref}
                    className="flex min-h-[48px] items-center font-semibold underline underline-offset-4"
                  >
                    {site.address.street}, {site.address.city}, {site.address.state}{" "}
                    {site.address.zip}
                  </a>
                </li>
                <li className="flex items-center gap-3">
                  <Phone className="h-5 w-5 text-brand" />
                  <a
                    href={site.phone.href}
                    className="flex min-h-[48px] items-center font-semibold underline underline-offset-4"
                  >
                    {site.phone.display}
                  </a>
                </li>
              </ul>

              <p className="mt-4 text-[0.9375rem] leading-snug text-muted lg:mt-5 lg:leading-relaxed">
                {site.hours.display}. {site.hours.closedNote} {site.location.door}
              </p>

              <Link
                href="/contact"
                className="mt-3 inline-flex min-h-[48px] items-center gap-1.5 font-semibold text-brand underline underline-offset-4 lg:mt-5"
              >
                Parking, the door to use, and directions
                <ArrowRight />
              </Link>
            </Reveal>

            <Reveal>
              <a
                href={mapsHref}
                className="block overflow-hidden rounded-[10px] border border-line"
              >
                <ManagedImg image={mapImage} sizes="(min-width: 1024px) 34rem, 100vw" />
                <span className="block bg-surface px-4 py-3 text-[0.9375rem] font-semibold text-brand underline underline-offset-4">
                  Open in maps
                </span>
              </a>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ------------------------------------------------------------------
          9 — CLOSING CTA
         ------------------------------------------------------------------ */}
      <ClosingCta />
    </>
  );
}
