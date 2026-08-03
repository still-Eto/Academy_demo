import Link from "next/link";
import type { ReactNode } from "react";

import { bandImages, detailImages, type ManagedImage } from "@/content/images";
import { availabilityChip, availabilityWords, type Availability, type Program } from "@/content/programs";
import { site, trustLine } from "@/content/site.config";
import { ArrowRight, Calendar, Check, Clock } from "./icons";
import { ManagedImg } from "./managed-image";

/* --------------------------------------------------------------------------
   Availability status.
   Colour never carries the meaning on its own: every state pairs a muted tone
   with a word AND a distinct icon shape.
   -------------------------------------------------------------------------- */
export function AvailabilityChip({ availability }: { availability: Availability }) {
  const chip = availabilityChip(availability);
  const Icon = chip.icon === "check" ? Check : chip.icon === "calendar" ? Calendar : Clock;

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[0.8125rem] font-semibold ${
        chip.tone === "good" ? "bg-good-bg text-good" : "bg-wait-bg text-wait"
      }`}
    >
      <Icon className="h-3.5 w-3.5" />
      {chip.text}
    </span>
  );
}

/** The long form, e.g. "2 spaces from September 8" or "Waitlist — about 6 weeks". */
export function AvailabilityText({ availability }: { availability: Availability }) {
  return <>{availabilityWords(availability)}</>;
}

/* --------------------------------------------------------------------------
   Section heading
   -------------------------------------------------------------------------- */
export function SectionHeading({
  eyebrow,
  title,
  lead,
  id,
  align = "left",
  /**
   * "dark" is for the sections that sit on `ground` or `deep`. It swaps the
   * lead's muted grey for white at 75% — `--color-ink-muted` is 7.5:1 on the
   * page and 1.9:1 on the dark ground, so inheriting it there is not a shade
   * too dark, it is illegible.
   */
  tone = "light",
  /**
   * `display-2` rather than the standard heading size. The three signature
   * sections take it; the rest of the page keeps its existing scale, which is
   * most of what makes those three read as the emphasized ones.
   */
  size = "default",
}: {
  eyebrow?: string;
  title: string;
  lead?: ReactNode;
  id?: string;
  align?: "left" | "center";
  tone?: "light" | "dark";
  size?: "default" | "display";
}) {
  const onDark = tone === "dark";

  return (
    <div className={align === "center" ? "mx-auto text-center" : ""}>
      {eyebrow && (
        /* The brass rule after the eyebrow is the third of the three repeated
           ornaments, and it is what ties nine unrelated section openings into
           one system. Left-anchored, because a centered rule over a
           left-aligned column reads as a stray line. */
        <p className={`eyebrow mb-3 lg:mb-4 ${align === "center" ? "" : "rule-lead"}`}>
          {eyebrow}
        </p>
      )}
      <h2
        id={id}
        className={
          size === "display"
            ? "display-2"
            : "text-[1.75rem] leading-[1.15] lg:text-[2.25rem]"
        }
      >
        {title}
      </h2>
      {lead && (
        <div
          className={`measure mt-3 text-[1.0625rem] leading-snug lg:mt-4 lg:text-[1.125rem] lg:leading-relaxed ${
            onDark ? "text-bg/80" : "text-muted"
          } ${align === "center" ? "mx-auto" : ""}`}
        >
          {lead}
        </div>
      )}
    </div>
  );
}

/* --------------------------------------------------------------------------
   Program card.
   Hours and price printed on the card itself — the one good instinct from the
   makeup-academy reference, without the visual noise around it.
   -------------------------------------------------------------------------- */
export function ProgramCard({
  program,
  dense = false,
  /**
   * Below `sm`, drop to the five things that decide anything: room, age range,
   * ratio against the state minimum, weekly rate, link. Class size, hours and
   * the descriptive sentence come back from `sm` up and are always on the
   * program page. Six full cards was the single largest block on the mobile
   * home page.
   */
  compactOnMobile = false,
  /**
   * Put the room's own photograph at the top of the card.
   *
   * Off by default, and ON for the six cards on /programs — a page that was
   * fifteen hundred words and a table with not one photograph on it, while six
   * graded room photographs already sat on disk being used once each. This is
   * the cheapest image on the site: no new sourcing, no new grading, one
   * derivative set serving two pages.
   *
   * It stays off on the home page. Those six cards are already below a
   * full-bleed band and a four-frame strip, and six more photographs there
   * would push the openings table and the tuition figures another screen down
   * on a phone for no argument gained.
   *
   * A room with no photograph renders no image rather than a wordless block:
   * the block is the right answer at 1200px on the room page and reads as a
   * failed load at 380px on a card.
   */
  withPhoto = false,
}: {
  program: Program;
  dense?: boolean;
  compactOnMobile?: boolean;
  withPhoto?: boolean;
}) {
  const secondary = compactOnMobile ? "hidden sm:block" : "";
  const photo = withPhoto ? program.photos.find((p) => p.photo) : undefined;

  return (
    /*
      The whole card is the target, not just the row at the bottom of it. That
      makes the tap area the size of the card instead of a 48px strip, and it
      frees the "Inside the …" row from having to reserve 48px of its own —
      six of those was 350px of mobile scroll spent on chevrons.

      No aria-label: the card's own text already names the link, and an
      aria-label that does not contain the visible text is a 2.5.3 failure.
    */
    <Link
      href={`/programs/${program.slug}`}
      className={`card group flex h-full flex-col ${photo ? "overflow-hidden p-0" : "p-4 sm:p-5 lg:p-6"}`}
    >
      {photo && (
        /*
          4:3 rather than the 3:2 the file is cut at. A card in a three-up grid
          is about 380px wide, and 3:2 makes that a 253px-tall photograph on top
          of 240px of table — the picture wins an argument it should not be in.
          4:3 brings it to 285px and the numbers stay the reason the card
          exists. `object-cover` on a ratio box is the same no-CLS path every
          other image takes.
        */
        <ManagedImg
          image={photo}
          sizes="(min-width: 1024px) 24rem, (min-width: 640px) 45vw, 92vw"
          ratioClassName="aspect-[4/3]"
          imgClassName="transition-transform duration-500 ease-out motion-safe:group-hover:scale-[1.03]"
        />
      )}
      <div className={photo ? "flex flex-1 flex-col p-4 sm:p-5 lg:p-6" : "contents"}>
        <div className="flex flex-wrap items-start justify-between gap-x-3 gap-y-2">
          <div>
            <h3 className="text-[1.25rem] leading-tight lg:text-[1.375rem]">
              {program.label}
              {/* A room name never appears without its age range beside it —
                  on the same line at mobile width, on its own line above `sm`. */}
              {compactOnMobile && (
                <span className="font-sans text-[0.9375rem] font-semibold text-muted sm:hidden">
                  {" "}
                  · {program.ages}
                </span>
              )}
            </h3>
            <p className={`mt-1 text-[0.9375rem] font-semibold text-muted ${secondary}`}>
              {program.ages}
            </p>
          </div>
          <AvailabilityChip availability={program.availability} />
        </div>

        <dl className="mt-3 grid grid-cols-2 gap-x-4 gap-y-3 border-y border-line py-2.5 text-[0.9375rem] lg:mt-4 lg:py-4">
          <div>
            <dt className="text-muted">Ratio</dt>
            <dd className="font-semibold">
              {program.ratio}{" "}
              <span className="font-normal text-muted">(IL {program.stateRatio})</span>
            </dd>
          </div>
          <div>
            <dt className="text-muted">5 days a week</dt>
            <dd className="font-semibold">${program.rate5}/week</dd>
          </div>
          <div className={secondary}>
            <dt className="text-muted">Class size</dt>
            <dd className="font-semibold">{program.classSize} children</dd>
          </div>
          <div className={secondary}>
            <dt className="text-muted">Hours</dt>
            <dd className="font-semibold">{program.hours}</dd>
          </div>
        </dl>

        {!dense && (
          <p className={`mt-4 text-[0.9375rem] leading-relaxed text-muted ${secondary}`}>
            {program.oneLiner}
          </p>
        )}

        <span className="mt-auto flex items-center gap-1.5 pt-2.5 font-semibold text-brand underline underline-offset-4 lg:min-h-[48px] lg:pt-4">
          <span>Inside the {program.label}</span>
          <ArrowRight />
        </span>
      </div>
    </Link>
  );
}

/* --------------------------------------------------------------------------
   A full-bleed photographic band with nothing on it.

   Edge to edge, no container, no radius, no caption, about a third of a
   viewport tall. Two of these punctuate the home page.

   The argument for spending a whole band on a photograph and no words: a site
   that puts a photograph up with nothing written over it is saying the
   photograph is good enough to carry a screen. It is the cheapest presence
   available, and it only works if that is true — which is why both bands are
   details (hands on blocks, an empty room at 7:30am) rather than the wide
   establishing shots that need a caption to mean anything.

   Sized in vh with a floor, like the hero, so it is a proportion of the screen
   rather than a fixed strip. `aria-hidden` is deliberately NOT set: the alt
   text is real description of a real room, and a parent using a screen reader
   should get it.
   -------------------------------------------------------------------------- */
export function PhotoBand({
  image,
  /**
   * Where in the photograph the band should look.
   *
   * A band is the full width of the viewport and about a third of its height —
   * 5:1 on a desktop, and closer to 1.4:1 on a phone. No single file fits both,
   * so `object-fit: cover` always discards something, and which something is
   * the whole difference between a photograph and a strip of floor. Both bands
   * here carry their subject low in the frame, so both look down.
   */
  focus = "object-center",
  className = "",
}: {
  image: ManagedImage;
  focus?: string;
  className?: string;
}) {
  return (
    <div className={`relative h-[36vh] min-h-[240px] overflow-hidden bg-ground lg:h-[42vh] ${className}`}>
      <ManagedImg image={image} sizes="100vw" fill imgClassName={focus} />
    </div>
  );
}

/* --------------------------------------------------------------------------
   The detail strip.

   Four square photographs in one full-bleed row, no gap, no caption, no words.
   Two up on a phone, four up from `sm`.

   WHY THIS EXISTS. The site had five photographs carrying fifteen routes, and
   every one of them was a wide — a room, a group, a playground. Nothing was
   closer than about six feet from a child, which is what made a page about
   forty children read as a page about a building. This is the cheapest
   available fix: four tight crops of hands and materials, about 190px tall on
   a phone and 300 on a desktop, dropped between two sections that were already
   adjacent. It buys proximity for almost no vertical space, which matters on a
   page whose mobile scroll height is already 11,000px.

   No gap between the four, deliberately. Gutters would make this a gallery of
   four pictures; butted edge to edge it is one band that happens to be made of
   four, and it sits in the same family as the full-bleed PhotoBand above it.

   `sizes` is exact rather than "100vw": each tile is a quarter of the viewport
   from `sm` and a half below it, so a phone fetches the 400px file and not the
   800px one.
   -------------------------------------------------------------------------- */
export function DetailStrip() {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-4">
      {detailImages.map((image) => (
        <ManagedImg
          key={image.id}
          image={image}
          sizes="(min-width: 640px) 25vw, 50vw"
          /*
            The manifest declares these 1:1 and the container honours that on a
            phone, where two-up at 50vw is a 195px square and the crop is tight
            enough to read. From `sm` the tile is a quarter of the width, and a
            square quarter of a 1568px shell would be a 392px-tall band — half
            the height of the hero, for four supporting images. `aspect-[5/4]`
            from `sm` holds it to about 300px instead.

            The ratio override is a container class, not a re-crop: the file is
            still the square the build wrote, and `object-cover` takes the
            middle of it. Every one of the four has its subject centred, which
            is why that is safe here and would not be on the bands.
          */
          ratioClassName="aspect-square sm:aspect-[5/4]"
          imgClassName="transition-transform duration-500 ease-out motion-safe:hover:scale-[1.03]"
        />
      ))}
    </div>
  );
}

/* --------------------------------------------------------------------------
   The trust line. Answers "is my child safe here" in under a second.
   -------------------------------------------------------------------------- */
export function TrustLine({
  className = "",
  /**
   * "dark" is the hero plinth: the same four claims in white at about 70%,
   * under a brass hairline, at the very bottom of the full-bleed image. The
   * claims are what the headline stands on, so they get the base of the section
   * rather than a line tucked under the buttons.
   */
  tone = "light",
}: {
  className?: string;
  tone?: "light" | "dark";
}) {
  const onDark = tone === "dark";
  /*
    Two layouts, one markup, and no stranded separators at any width.

    Below `sm`: a grid. The ratio takes a full-width row of its own; the other
    three sit in two columns beneath it. The middots are display:none, because
    a separator is a device for setting items on ONE line and these are not on
    one line. Every cell is single-line — measured, not assumed.

    From `sm` up: a flex row with the middots back, each one its own trailing
    element so a wrapped line never opens with a stray character. The claims
    are worded tightly enough (595px) to fit the 652px hero column on one line,
    which is what stopped it wrapping there at all.

    Type stays at 15px on both. These are the numbers that answer the parent's
    second question; shrinking them to buy a tidier wrap is the wrong trade.
  */
  return (
    <p
      data-trust-line=""
      className={`grid grid-cols-2 gap-x-4 gap-y-1.5 text-[0.9375rem] leading-snug sm:flex sm:flex-wrap sm:items-baseline sm:gap-x-1.5 sm:gap-y-1 sm:leading-relaxed ${
        onDark ? "text-bg/75" : "text-muted"
      } ${className}`}
    >
      {trustLine.map((item, i) => (
        <span
          key={item}
          /*
            The ratio takes the full width of the mobile grid on its own row.
            Shortening it was not enough on its own: even at 29 characters it
            needs about 200px and a cell is 167px, so it still wrapped to two
            lines beside a neighbour that took one, and the row read as broken
            alignment. Given its own row, every cell is single-line.
          */
          className={
            i === 0
              ? `col-span-2 font-semibold sm:col-auto ${onDark ? "text-bg" : "text-ink"}`
              : ""
          }
        >
          {item}
          {i < trustLine.length - 1 && (
            <span
              aria-hidden="true"
              className={`ml-1.5 hidden sm:inline ${onDark ? "text-brass" : "text-line"}`}
            >
              ·
            </span>
          )}
        </span>
      ))}
    </p>
  );
}

/* --------------------------------------------------------------------------
   The tour offer, restated. Used in the closing band and on /contact.
   -------------------------------------------------------------------------- */
export function TourPromise() {
  return (
    <p className="measure text-[1.0625rem] leading-relaxed">
      45 minutes. You&rsquo;ll meet the teacher your child would actually have. Come during nap or
      during play &mdash; tell us which, and {site.director.firstName} will set it up.
    </p>
  );
}

/* --------------------------------------------------------------------------
   Closing CTA band
   -------------------------------------------------------------------------- */
export function ClosingCta() {
  return (
    /*
      The last section, and the one that has to convert. Full-bleed photograph
      of the playground at the end of the day, heavy scrim, tall — it closes the
      page the way the hero opened it, which is what makes the whole thing read
      as one document rather than a stack of blocks.

      The photograph is the same evening as the one on /about, cropped
      differently. `band.closing` is graded to the low-key target, so it is
      genuinely dark before the scrim rather than a bright frame dimmed.
    */
    <section className="on-dark on-ground relative isolate overflow-hidden">
      <ManagedImg image={bandImages.closing} sizes="100vw" fill />
      <div className="scrim-side absolute inset-0" aria-hidden="true" />
      <div className="frame-brass pointer-events-none absolute inset-0" aria-hidden="true" />

      <div className="relative shell section-tall">
        <div className="measure">
          <p className="eyebrow rule-lead mb-4 lg:mb-5">Book a tour</p>
          <h2 className="display-2">Come and see the room your child would be in.</h2>
          <p className="mt-4 text-[1.0625rem] leading-snug text-bg/85 lg:mt-6 lg:text-[1.125rem] lg:leading-relaxed">
            45 minutes. You&rsquo;ll meet the teacher your child would actually have, stand in the
            room, and read the drill log on the wall. Come during nap or during play &mdash; tell us
            which.
          </p>
          <p className="mt-3 text-[0.9375rem] leading-snug text-bg/75">
            {site.director.responsePromise}
          </p>
          <div className="mt-6 flex flex-col gap-2.5 sm:flex-row sm:gap-3 lg:mt-8">
            <Link href="/book-a-tour" className="btn btn-primary">
              Book a Tour
            </Link>
            <a href={site.phone.href} className="btn btn-ghost-light">
              Call {site.phone.display}
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}

/* --------------------------------------------------------------------------
   Page header used on every interior page
   -------------------------------------------------------------------------- */
export function PageHero({
  eyebrow,
  title,
  lead,
  children,
}: {
  eyebrow: string;
  title: string;
  lead?: ReactNode;
  children?: ReactNode;
}) {
  return (
    /*
      The opening of all fourteen interior pages, and the cheapest place on the
      site to spend the new foundation.

      It was pale mint on off-white with a 48px heading — the exact combination
      the art direction was written to remove, repeated fourteen times. It is
      now the dark ground, a brass eyebrow over a brass rule, and `display-2`,
      which puts every interior page in the same register as the home page for
      the cost of one component.

      It does NOT become a full-bleed photographic hero. Only the home page gets
      one. Fourteen 88vh photographs would make the tuition table three screens
      further down the page than it is now, and the reason a parent opens
      /tuition is the table.
    */
    <section className="on-dark on-ground">
      <div className="shell pt-12 pb-14 lg:pt-20 lg:pb-20">
        <p className="eyebrow rule-lead mb-4 lg:mb-5">{eyebrow}</p>
        <h1 className="display-2 measure-tight">{title}</h1>
        {lead && (
          <div className="measure mt-5 text-[1.0625rem] leading-relaxed text-bg/80 lg:mt-6 lg:text-[1.1875rem]">
            {lead}
          </div>
        )}
        {children}
      </div>
    </section>
  );
}
