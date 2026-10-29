/*
  Date check for the Bridgewood demo (fictional center).

  The openings block sells recency, and on 29.10.2026 it still said "Updated
  August 2026" and "2 spaces from September 8". This script fails as soon as
  that can happen again:

  1. lib/openings-dates.ts gives, for today and every day of the next fourteen
     months, the month of that day as the stamp, a next opening day after it
     and at most 38 days away, and the program year that day belongs to.
  2. No typed-in stamp is back in content/, app/ or components/: "As of" or
     "Updated" with a month and year, "from" with a month and day, "this fall"
     and the other seasons, "full for 2026–27". Those come from
     lib/openings-dates.ts on the day the page is rendered.

  Run: node scripts/check-dates.mts
  Another day: CHECK_DATE=2027-03-20 node scripts/check-dates.mts
  Needs Node 22.18 or newer (TypeScript files run without a build step).
*/
import { readFileSync, readdirSync, statSync } from "node:fs";
import { join, relative } from "node:path";
import { fileURLToPath } from "node:url";
import { centerToday, nextOpeningDate, nextOpeningDay, openingsMonth, programYear, season } from "../lib/openings-dates.ts";

const root = fileURLToPath(new URL("..", import.meta.url));
const DAY = 86_400_000;
const MONTHS = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
const errors: string[] = [];

const now = process.env.CHECK_DATE ? new Date(`${process.env.CHECK_DATE}T17:00:00Z`) : new Date();
if (Number.isNaN(now.getTime())) {
  console.error("CHECK_DATE is not a date (YYYY-MM-DD).");
  process.exit(2);
}
const iso = (d: { year: number; month: number; day: number }) =>
  `${d.year}-${String(d.month).padStart(2, "0")}-${String(d.day).padStart(2, "0")}`;
const todayIso = iso(centerToday(now));

/* ---------- 1. The worked-out dates, today and the next fourteen months ---------- */

for (let t = now.getTime(); t <= now.getTime() + 425 * DAY; t += DAY) {
  const at = new Date(t);
  const day = centerToday(at);
  const dayUtc = Date.UTC(day.year, day.month - 1, day.day);
  if (openingsMonth(at) !== `${MONTHS[day.month - 1]} ${day.year}`) errors.push(`${iso(day)}: stamp "${openingsMonth(at)}" is not this month`);
  const ahead = Math.round((nextOpeningDay(at).getTime() - dayUtc) / DAY);
  if (ahead < 1 || ahead > 38) errors.push(`${iso(day)}: next opening day ${nextOpeningDate(at)} is ${ahead} days away`);
  const start = day.month >= 8 ? day.year : day.year - 1;
  if (!programYear(at).startsWith(String(start))) errors.push(`${iso(day)}: program year ${programYear(at)} is not the current one`);
  if (!["fall", "winter", "spring", "summer"].includes(season(at))) errors.push(`${iso(day)}: no season`);
}

/* ---------- 2. No typed-in stamp in the content ---------- */

const M = MONTHS.join("|");
const STAMPS = [
  new RegExp(`\\b(As of|Updated|updated) (${M}) \\d{4}\\b`, "g"),
  new RegExp(`\\bfrom (${M}) \\d{1,2}\\b`, "g"),
  /\bthis (fall|winter|spring|summer)\b/g,
  /\bfull for \d{4}[–-]\d{2}\b/g,
  /\bopeningsUpdated:\s*["'`]/g,
  new RegExp(`\\bfrom:\\s*["'\`](${M}) \\d{1,2}`, "g"),
];

function* sourceFiles(dir: string): Generator<string> {
  for (const name of readdirSync(dir)) {
    const path = join(dir, name);
    if (statSync(path).isDirectory()) yield* sourceFiles(path);
    else if (/\.(ts|tsx)$/.test(name)) yield path;
  }
}

for (const dir of ["content", "app", "components"]) {
  for (const file of sourceFiles(join(root, dir))) {
    // Comments may give examples; only what can reach the page counts.
    const text = readFileSync(file, "utf8").replace(/\/\*[\s\S]*?\*\//g, " ").replace(/^\s*\/\/.*$/gm, " ");
    for (const re of STAMPS) {
      for (const m of text.matchAll(re)) {
        errors.push(`${relative(root, file)}: typed-in "${m[0]}" goes stale; take it from lib/openings-dates.ts`);
      }
    }
  }
}

/* ---------- Result ---------- */

if (errors.length) {
  console.error(`Date check FAILED (day ${todayIso}), ${errors.length} finding(s):`);
  for (const e of errors.slice(0, 40)) console.error(`  - ${e}`);
  process.exit(1);
}
console.log(`Date check passed (day ${todayIso}).`);
console.log(`  Updated ${openingsMonth(now)}; Sunflower Room: 2 spaces from ${nextOpeningDate(now)}; Summit Room: full for ${programYear(now)}; "this ${season(now)}".`);
