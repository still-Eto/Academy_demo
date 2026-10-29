/**
 * The dates of the openings block, worked out from today.
 *
 * The block sells recency ("Updated …", "2 spaces from …"), so a typed-in
 * month goes stale and turns the trust signal against the center: on
 * 29.10.2026 the page still said "Updated August 2026" and "from September 8".
 * Every date the openings show now comes from here, on the day the page is
 * rendered; app/layout.tsx revalidates every hour.
 *
 * Read these values inside a component or a function, never into a constant
 * at module level: a constant is worked out once per server process.
 *
 * No imports, so scripts/check-dates.mts can load this file with plain Node.
 */

export const CENTER_TIME_ZONE = "America/Chicago";

const MONTHS = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

/** Today in Elmhurst: year, month (1 to 12) and day. */
export function centerToday(now: Date = new Date()) {
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone: CENTER_TIME_ZONE,
    year: "numeric",
    month: "numeric",
    day: "numeric",
  }).formatToParts(now);
  const part = (type: string) => Number(parts.find((p) => p.type === type)!.value);
  return { year: part("year"), month: part("month"), day: part("day") };
}

/** "October 2026": the month the openings are stamped with. */
export function openingsMonth(now: Date = new Date()): string {
  const { year, month } = centerToday(now);
  return `${MONTHS[month - 1]} ${year}`;
}

/** The first Monday of next month, the day a room's next spaces open. */
export function nextOpeningDay(now: Date = new Date()): Date {
  const { year, month } = centerToday(now);
  const first = new Date(Date.UTC(year, month, 1));
  return new Date(Date.UTC(year, month, 1 + ((8 - first.getUTCDay()) % 7)));
}

/** "November 2", for "2 spaces from November 2". */
export function nextOpeningDate(now: Date = new Date()): string {
  const day = nextOpeningDay(now);
  return `${MONTHS[day.getUTCMonth()]} ${day.getUTCDate()}`;
}

/** "2026–27", the program year that runs from August to July. */
export function programYear(now: Date = new Date()): string {
  const { year, month } = centerToday(now);
  const start = month >= 8 ? year : year - 1;
  return `${start}–${String(start + 1).slice(2)}`;
}

/** "fall", "winter", "spring" or "summer", for "7 spaces open this fall". */
export function season(now: Date = new Date()): string {
  const { month } = centerToday(now);
  if (month >= 9 && month <= 11) return "fall";
  if (month === 12 || month <= 2) return "winter";
  if (month <= 5) return "spring";
  return "summer";
}
