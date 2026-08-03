import Link from "next/link";

import { dayPrograms } from "@/content/programs";
import { ArrowRight } from "./icons";

/**
 * "A day at Bridgewood" — hour by hour, per room, in plain language.
 * This converts better than any paragraph about philosophy, because it lets a
 * parent picture her child in the room. The fourteen entries run in two columns
 * on a desktop instead of one very long administrative list, with the time
 * markers in brand green so the eye can scan the day by hour.
 *
 * Still built as a CSS-only radio group: the five inputs come first in the DOM
 * and `:checked ~` sibling selectors light the label and show the matching
 * panel (see `.rooms-*` in globals.css). That means:
 *
 *   - zero client JavaScript, on the page with the tightest JS budget;
 *   - it works with JavaScript disabled;
 *   - arrow keys move between rooms for free, because it is a real radiogroup.
 *
 * Defaults to the Sunflower Room, since toddler demand is highest.
 * Vertical on every breakpoint — never a horizontal scroller.
 */
export function DayTimeline() {
  const defaultSlug = "sunflower";

  return (
    <fieldset className="rooms border-0 p-0">
      <legend className="sr-only">Choose a room to see its day</legend>

      {/* All five inputs first — the sibling selectors depend on this order. */}
      {dayPrograms.map((p) => (
        <input
          key={p.slug}
          type="radio"
          name="day-room"
          id={`room-${p.slug}`}
          value={p.slug}
          defaultChecked={p.slug === defaultSlug}
          className="sr-only"
        />
      ))}

      <div className="rooms-tabs grid grid-cols-2 gap-2 sm:flex sm:flex-wrap">
        {dayPrograms.map((p) => (
          <label
            key={p.slug}
            htmlFor={`room-${p.slug}`}
            /* No fill utilities here — the resting and selected states are both
               in globals.css so neither can outrank the other. */
            className="flex min-h-[52px] cursor-pointer flex-col justify-center rounded-lg px-3.5 py-2 text-left sm:min-h-[56px]"
          >
            <span className="font-serif text-[1rem] leading-tight font-semibold">{p.label}</span>
            {/* A room name never appears without its age range. */}
            <span className="rooms-age text-[0.8125rem]">{p.ages}</span>
          </label>
        ))}
      </div>

      <div className="rooms-panels mt-8 lg:mt-10">
        {dayPrograms.map((p) => (
          <div key={p.slug} data-room={p.slug}>
            {/*
              Two columns from `lg`. Fourteen entries in one column is 900px of
              scroll on a desktop and reads as a printout; in two it is one
              screen and reads as a day. `columns` rather than a grid because
              the entries are a single ordered list and must stay one list —
              splitting them into two <ol>s to get two columns would tell a
              screen reader there are two days.
            */}
            <ol className="rooms-timeline lg:columns-2 lg:gap-14">
              {p.rhythm.map((entry) => (
                <li
                  key={entry.time}
                  className="relative flex gap-3 break-inside-avoid pb-3.5 last:pb-0 sm:gap-4 lg:pb-5"
                >
                  {/* Time markers in brass, tabular so the column is straight. */}
                  <span className="w-[4.25rem] shrink-0 pt-0.5 text-[0.9375rem] font-semibold tabular-nums text-brand lg:w-[4.75rem] lg:text-[1rem]">
                    {entry.time}
                  </span>
                  <span className="text-[1rem] leading-snug text-muted lg:text-[1.0625rem] lg:leading-relaxed">
                    {entry.what}
                  </span>
                </li>
              ))}
            </ol>

            {p.rhythmNote && (
              <p className="measure mt-7 border-l-2 border-brand py-1 pl-4 text-[0.9375rem] leading-snug text-muted lg:mt-9 lg:leading-relaxed">
                {p.rhythmNote}
              </p>
            )}

            <Link
              href={`/programs/${p.slug}`}
              className="mt-7 inline-flex min-h-[48px] items-center gap-1.5 font-semibold text-brand underline underline-offset-4 lg:mt-9"
            >
              Everything about the {p.label}
              <span className="sr-only">, {p.ages}</span>
              <ArrowRight />
            </Link>
          </div>
        ))}
      </div>
    </fieldset>
  );
}
