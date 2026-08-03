/**
 * Screenshots every page at 390x844 and 1440x900, into /verification.
 *
 *   npm run build && node scripts/screenshots.mjs [route-filter]
 *
 * Captured with reduced motion emulated, so the scroll-reveal animation does
 * not leave below-the-fold sections at opacity 0 in a full-page capture. The
 * content is identical either way.
 *
 * Also writes a `--fold` crop of the first viewport for each width, which is
 * the frame that actually decides whether a parent stays.
 */

import { spawn } from "node:child_process";
import { mkdirSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { chromium } from "playwright";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const out = join(root, "verification");
const PORT = Number(process.env.PORT ?? 3216);
const BASE = `http://127.0.0.1:${PORT}`;
const filter = process.argv[2];

export const ROUTES = [
  ["/", "home"],
  ["/programs", "programs"],
  ["/programs/acorn", "program-acorn"],
  ["/programs/sunflower", "program-sunflower"],
  ["/programs/maple", "program-maple"],
  ["/programs/oak", "program-oak"],
  ["/programs/summit", "program-summit"],
  ["/programs/after-school", "program-after-school"],
  ["/safety", "safety"],
  ["/tuition", "tuition"],
  ["/about", "about"],
  ["/staff", "staff"],
  ["/faq", "faq"],
  ["/book-a-tour", "book-a-tour"],
  ["/contact", "contact"],
  ["/this-page-does-not-exist", "404"],
];

/* Refuse to run against something else already on this port — a leftover
   server serving a stale build silently produces meaningless output. */
try {
  await fetch(BASE, { signal: AbortSignal.timeout(1500) });
  console.error(`Port ${PORT} is already in use. Stop that process first, or set PORT.`);
  process.exit(1);
} catch {
  /* nothing listening, which is what we want */
}

const server = spawn(
  process.platform === "win32" ? "npx.cmd" : "npx",
  ["next", "start", "--port", String(PORT), "--hostname", "127.0.0.1"],
  { cwd: root, stdio: "ignore", shell: process.platform === "win32" },
);
process.on("exit", () => {
  try {
    server.kill();
  } catch {
    /* already gone */
  }
});

for (let i = 0; i < 180; i++) {
  try {
    const r = await fetch(BASE);
    if (r.status < 500) break;
  } catch {
    /* not up yet */
  }
  await new Promise((r) => setTimeout(r, 500));
}

mkdirSync(out, { recursive: true });
const browser = await chromium.launch();

const widths = [
  { label: "390x844", viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true, deviceScaleFactor: 2 },
  { label: "1440x900", viewport: { width: 1440, height: 900 }, deviceScaleFactor: 1 },
];

let count = 0;
for (const w of widths) {
  const ctx = await browser.newContext({ ...w, reducedMotion: "reduce" });
  for (const [route, name] of ROUTES) {
    if (filter && !route.includes(filter)) continue;
    const page = await ctx.newPage();
    await page.goto(BASE + route, { waitUntil: "networkidle" });
    await page.evaluate(() => window.scrollTo(0, 0));
    await page.waitForTimeout(120);

    const prefix = process.env.SHOT_SUFFIX ? `${process.env.SHOT_SUFFIX}-` : "";
    await page.screenshot({ path: join(out, `${prefix}${name}--${w.label}--fold.png`) });
    if (!process.env.SHOT_SUFFIX) {
      await page.screenshot({ path: join(out, `${name}--${w.label}.png`), fullPage: true });
    }
    count += process.env.SHOT_SUFFIX ? 1 : 2;
    await page.close();
  }
  await ctx.close();
}

await browser.close();
server.kill();
console.log(`Wrote ${count} screenshots to /verification`);
process.exit(0);
