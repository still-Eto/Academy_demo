/**
 * Catches text that compiled without a space in it.
 *
 *     npm run build && npm run verify:text
 *
 * THE BUG THIS EXISTS FOR. Written in a component, this looks correct:
 *
 *     <>
 *       {staff.length} people, and this is all of them — including Rosa, who
 *       cooks every meal, and Ellen, who will fix your bill.
 *     </>
 *
 * and it shipped as "17people". When a JSX expression opens a line AND the
 * prose after it wraps onto a second line, SWC drops the leading space of that
 * text node. The same shape on a single line is fine, which is why eighteen
 * other instances of it in this codebase are correct and two were not — and why
 * reading the source tells you nothing. It has to be checked in the output.
 *
 * HOW. React separates adjacent text segments with an empty comment, so a
 * `<!-- -->` with a word character on both sides and no space is exactly the
 * join that lost one. Real prose almost never produces that: a join normally
 * lands on punctuation, a tag boundary, or a space that survived.
 *
 * Scans every prerendered HTML file plus every client chunk, because the two
 * real cases lived one in each — /staff is static, and the tour confirmation
 * only exists after a submit and is therefore only in the bundle.
 */

import { readdirSync, readFileSync, statSync } from "node:fs";
import { dirname, join, relative } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");

const walk = (dir, test, acc = []) => {
  let entries;
  try {
    entries = readdirSync(dir);
  } catch {
    return acc;
  }
  for (const entry of entries) {
    const full = join(dir, entry);
    if (statSync(full).isDirectory()) walk(full, test, acc);
    else if (test(full)) acc.push(full);
  }
  return acc;
};

const findings = [];

/* ---------------------------------------------------- prerendered HTML */
for (const file of walk(join(root, ".next", "server", "app"), (f) => f.endsWith(".html"))) {
  const html = readFileSync(file, "utf8");
  const re = /([^\s<>"]{0,24})<!-- -->([^\s<>"]{0,24})/g;
  let m;
  while ((m = re.exec(html))) {
    const [, before, after] = m;
    if (!before || !after) continue;
    if (!/[A-Za-z0-9]$/.test(before) || !/^[A-Za-z]/.test(after)) continue;
    findings.push({
      where: relative(root, file),
      text: `${before}[no space]${after}`,
    });
  }
}

/*
  ------------------------------------------------------- client chunks

  In a bundle the join is not a comment, it is two adjacent entries in the JSX
  children array: `…,dw.site.director.tenureYears,"years here — …"`. So the
  signal is a string literal OPENING with one of the unit words this site
  actually prints after a number.

  Two things keep it honest.

  The lookbehind. A correct construction puts the space in its own entry —
  `…,12," ","years here …"` — which is what an explicit `{" "}` compiles to, and
  it is not a defect. Only a unit-word literal that is NOT preceded by a lone
  space literal is a real glue.

  The trailing `[^"]`. `,"children"` is React's own prop key, not prose, and it
  appears in every chunk. Requiring the string to continue past the unit word
  excludes it without having to special-case the word.
*/
const UNITS = [
  "people",
  "years",
  "year",
  "weeks",
  "week",
  "months",
  "month",
  "days",
  "day",
  "minutes",
  "spaces",
  "space",
  "children",
  "teachers",
  "rooms",
  "hours",
];
const unitRe = new RegExp(`(?<!" "),"(?:${UNITS.join("|")})\\b[^"]`, "g");

for (const file of walk(join(root, ".next", "static"), (f) => f.endsWith(".js"))) {
  const js = readFileSync(file, "utf8");
  let m;
  unitRe.lastIndex = 0;
  while ((m = unitRe.exec(js))) {
    findings.push({
      where: relative(root, file),
      text: `…,"${js.slice(m.index + 2, m.index + 44).split('"')[0]}"`,
    });
  }
}

/* ------------------------------------------------------------------ print */
const unique = [...new Map(findings.map((f) => [`${f.where}|${f.text}`, f])).values()];

console.log("\n=== Glued text check ===\n");
if (unique.length === 0) {
  console.log("[PASS] No number or word compiled hard against the one after it.");
  console.log(
    "       Scanned every prerendered page and every client chunk for a text join\n" +
      "       with word characters on both sides and no space between them.\n",
  );
  process.exit(0);
}

console.log(`[FAIL] ${unique.length} place(s) where text compiled without a space:\n`);
for (const f of unique) console.log(`       ${f.where}\n         ${f.text}`);
console.log(
  "\n       Fix: put an explicit {\" \"} after the expression. See the note at the\n" +
    "       top of this file for why the source looks correct anyway.\n",
);
process.exit(1);
