import Link from "next/link";

import { availabilityWords, programs, type Availability, type Program } from "@/content/programs";
import { site } from "@/content/site.config";
import { ArrowRight, Clock } from "./icons";

/**
 * Live openings by classroom — the single most valuable and most commonly
 * missing element in this niche, and the one thing on this site no competitor
 * has. It used to be rendered as an eleven-pixel-header data table: an
 * admin panel for the most persuasive fact on the page.
 *
 * It is now six cards on the dark ground, and the STATUS IS THE VISUAL EVENT.
 * A room with space sets its number at display scale over a brass rule. A full
 * room is a muted card at lower contrast that says "Waitlist" and how long.
 * The difference between the two has to be readable from across a room, which
 * is the actual test: a director scrolling on a phone decides in one glance
 * whether this page is worth a call.
 *
 * What has NOT changed is the honesty. Two of the six rooms are full, they
 * still say so, and they still say roughly how long the wait is. The design
 * makes the scarcity legible; it does not manufacture any.
 *
 * Colour never carries the meaning alone: every state pairs its tone with a
 * number or a word AND a distinct treatment (rule and scale, versus a muted
 * card with a clock).
 */

/** The number, or the absence of one. Drives everything about the card. */
function statusOf(a: Availability) {
  if (a.kind === "waitlist") return null;
  return {
    count: a.spaces,
    /* "now" and "from September 8" are different promises and the card says
       which. The old chip flattened both into a green pill. */
    when: a.kind === "open" ? "now" : `from ${a.from}`,
  };
}

function OpeningCard({ program }: { program: Program }) {
  const status = statusOf(program.availability);
  const words = availabilityWords(program.availability);

  return (
    <li>
      <Link
        href={`/programs/${program.slug}`}
        /*
          The whole card is the target. `h-full` so the six cards in the grid
          are the same height whatever their content, which is what makes the
          two waitlist cards read as deliberately quieter rather than shorter.
        */
        className={`flex h-full flex-col rounded-[10px] border border-line bg-surface p-5 lg:p-6 ${
          status
            ? "card-brass"
            : /* Muted, lower contrast, no brass rule. A full room should not
                 draw the eye — but it must stay above 4.5:1, so this dims the
                 EDGE and never the text. */
              "border-t-2 border-t-line"
        }`}
      >
        <div className="flex-1">
          {/* A room name never appears without its age range. */}
          <h3 className="font-serif text-[1.25rem] leading-tight font-semibold lg:text-[1.375rem]">
            {program.label}
          </h3>
          <p className="mt-1 text-[0.9375rem] text-muted">{program.ages}</p>
        </div>

        {status ? (
          <p className="mt-6 lg:mt-8">
            {/*
              The event. A single numeral at display scale, in brass, with the
              qualifier set small beneath it. `aria-hidden` on the numeral and
              the full sentence in the visually-hidden span, so a screen reader
              hears "2 spaces from September 8" rather than "2" and then a
              fragment.
            */}
            <span className="sr-only">{words}</span>
            <span
              aria-hidden="true"
              className="block font-serif text-[3.5rem] leading-[0.85] font-semibold tracking-[-0.02em] text-brand lg:text-[4.5rem]"
            >
              {status.count}
            </span>
            <span aria-hidden="true" className="mt-2.5 block text-[1rem] leading-snug text-ink lg:mt-3">
              {status.count === 1 ? "space" : "spaces"} {status.when}
            </span>
          </p>
        ) : (
          <p className="mt-6 flex items-start gap-2 text-[1rem] leading-snug text-muted lg:mt-8">
            <Clock className="mt-0.5 h-4 w-4 shrink-0" />
            <span>{words}</span>
          </p>
        )}

        <span className="mt-5 flex min-h-[24px] items-center gap-1.5 text-[0.9375rem] font-semibold text-brand underline underline-offset-4 lg:mt-6">
          Inside the room
          <span className="sr-only">
            : {program.label}, {program.ages}
          </span>
          <ArrowRight />
        </span>
      </Link>
    </li>
  );
}

export function OpeningsBlock({ headingId = "openings" }: { headingId?: string }) {
  return (
    <div>
      {/*
        One list, one card component, at every width. The old block shipped
        stacked cards below `md` and a real <table> above it — two renderings of
        the same six rows, only one of them ever in the accessibility tree. The
        cards carry the same information the table columns did (room, ages,
        whether there is space, when) and they carry it at a size a phone can
        read, so there is nothing left for the table to do.
      */}
      <ul
        aria-describedby={`${headingId}-stamp`}
        className="grid gap-3 sm:grid-cols-2 sm:gap-4 lg:grid-cols-3 lg:gap-5"
      >
        {programs.map((p) => (
          <OpeningCard key={p.slug} program={p} />
        ))}
      </ul>

      <p
        id={`${headingId}-stamp`}
        className="mt-6 text-[0.9375rem] leading-snug text-muted lg:mt-8"
      >
        <span className="eyebrow">Updated {site.openingsUpdated}</span>
        <span className="mt-2 block">
          We change this page the day a space opens or closes. If it says a space is there,
          it is there.
        </span>
      </p>
    </div>
  );
}
