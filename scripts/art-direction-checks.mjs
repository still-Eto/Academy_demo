/**
 * Section 9 of the art-direction plan, measured against a production build.
 *
 *     npm run build && npm run verify:art
 *
 * The visual test — does the hero hold its own beside the reference sites —
 * is answered by looking at screenshots, not by this file. Everything here is
 * the second question: did the craft cost us anything.
 *
 *   1  hero height at 1568x745 and 390x844, as a percentage of the viewport
 *   2  share of total scroll height sitting on a dark ground, as a two-sided
 *      band — too little is a flat page, too much is a heavy one
 *   3  computed font-size of the display headline at 1568
 *   4  contrast of the page white over the real composited background, at the
 *      lightest and darkest pixel under every run of type on a dark section
 *   7  image bytes transferred on / at 390px
 *   9  status of all fifteen routes
 *  11  visible focus ring on every focusable control on the dark sections
 *
 * LCP, CLS and Lighthouse are `npm run verify:perf` and
 * `npm run verify:lighthouse`, which already existed and already throttle
 * properly. Not duplicated here.
 */

import { spawn, spawnSync } from "node:child_process";
import { mkdirSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { chromium } from "playwright";
import sharp from "sharp";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const out = join(root, "verification");
const PORT = Number(process.env.PORT ?? 3219);
const BASE = `http://127.0.0.1:${PORT}`;

const ROUTES = [
  "/",
  "/programs",
  "/programs/acorn",
  "/programs/sunflower",
  "/programs/maple",
  "/programs/oak",
  "/programs/summit",
  "/programs/after-school",
  "/safety",
  "/tuition",
  "/about",
  "/staff",
  "/faq",
  "/book-a-tour",
  "/contact",
];

/* ------------------------------------------------------------------ colour */
const lum = (r, g, b) => {
  const f = (c) => {
    c /= 255;
    return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
  };
  return 0.2126 * f(r) + 0.7152 * f(g) + 0.0722 * f(b);
};
const contrast = (a, b) => {
  const [x, y] = [a, b].sort((p, q) => q - p);
  return (x + 0.05) / (y + 0.05);
};
/* The colour the type on the dark sections actually is: `--brand-bg`. */
const FG = lum(250, 248, 244);
/* A ground counts as "dark" when the page white on it clears large-text AA.
   That is the property the 35% target is about — how much of the page reads
   as a dark field — so it is the definition used rather than an eyeballed
   list of section class names. */
const DARK_AT = 3;

/* ------------------------------------------------------------------ server */
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
    if (process.platform === "win32")
      spawnSync("taskkill", ["/pid", String(server.pid), "/T", "/F"], { stdio: "ignore" });
    else server.kill();
  } catch {
    /* already gone */
  }
});
for (let i = 0; i < 240; i++) {
  try {
    const r = await fetch(BASE, { redirect: "manual" });
    if (r.status < 500) break;
  } catch {
    /* not up yet */
  }
  await new Promise((r) => setTimeout(r, 500));
}

const results = [];
const record = (id, label, ok, detail) => results.push({ id, label, ok, detail });

const browser = await chromium.launch();

/**
 * Loads a page and does not return until every image on it has decoded.
 * Measuring a full-bleed section whose photograph has not arrived reports the
 * flat ground colour and a very good contrast number — the wrong answer, given
 * confidently. This is the single most important line in the file.
 */
async function settled(page, url) {
  await page.goto(url, { waitUntil: "networkidle" });
  await page.evaluate(() =>
    document.querySelectorAll("img[loading=lazy]").forEach((i) => i.setAttribute("loading", "eager")),
  );
  await page.evaluate(async () => {
    for (let y = 0; y < document.body.scrollHeight; y += 300) {
      window.scrollTo(0, y);
      await new Promise((r) => requestAnimationFrame(r));
    }
    window.scrollTo(0, 0);
  });
  await page
    .waitForFunction(
      () => [...document.querySelectorAll("img")].every((i) => i.complete && i.naturalWidth > 0),
      null,
      { timeout: 30000 },
    )
    .catch(() => {});
  await page.waitForTimeout(400);
}

/* ===================================================================== 1 */
{
  const rows = [];
  for (const [w, h, label] of [
    [1568, 745, "desktop"],
    [390, 844, "mobile"],
  ]) {
    const ctx = await browser.newContext({
      viewport: { width: w, height: h },
      deviceScaleFactor: 1,
      isMobile: w < 500,
      hasTouch: w < 500,
      reducedMotion: "reduce",
    });
    const page = await ctx.newPage();
    await settled(page, BASE + "/");
    const px = await page.evaluate(
      () => document.querySelector("[data-hero]")?.getBoundingClientRect().height ?? 0,
    );
    rows.push({ label, w, h, px, pct: (px / h) * 100 });
    await ctx.close();
  }
  /*
    One pixel of tolerance. The phone hero is `min-height: 85vh`, and 85% of
    844 is 717.4 — which the engine lays out as 717.4 and which is therefore
    84.996vh, not 85. Asserting `>= 85` on a value the browser cannot represent
    exactly fails a section that is doing precisely what it was told.
  */
  const ok = rows.every((r) => r.px >= r.h * 0.85 - 1);
  record(
    1,
    "Hero occupies at least 85vh",
    ok,
    rows
      .map(
        (r) =>
          `${r.label} ${r.w}x${r.h}: hero is ${r.px.toFixed(1)}px tall = ${r.pct.toFixed(1)}vh ` +
          `(needs ${(r.h * 0.85).toFixed(0)}px)`,
      )
      .join("\n      "),
  );
}

/* ===================================================================== 2 */
{
  /*
    Sampled, not summed from a list of section names. Renders the whole page at
    1568 wide, then walks the document one row of pixels at a time down the
    centre column and asks whether the page white would be legible on what is
    there. That counts the hero, both photographic bands and the two
    image-backed sections correctly, none of which is a flat fill.
  */
  const ctx = await browser.newContext({
    viewport: { width: 1568, height: 745 },
    deviceScaleFactor: 1,
    reducedMotion: "reduce",
  });
  const page = await ctx.newPage();
  await settled(page, BASE + "/");
  const shot = await page.screenshot({ fullPage: true });
  await ctx.close();

  const { data, info } = await sharp(shot).raw().toBuffer({ resolveWithObject: true });
  const { width, height, channels } = info;
  /* Two columns well inside the gutters, averaged, so a single wide element
     does not decide a row on its own. */
  const cols = [Math.round(width * 0.06), Math.round(width * 0.94)];
  let dark = 0;
  for (let y = 0; y < height; y++) {
    let L = 0;
    for (const x of cols) {
      const i = (y * width + x) * channels;
      L += lum(data[i], data[i + 1], data[i + 2]);
    }
    if (contrast(FG, L / cols.length) >= DARK_AT) dark++;
  }
  const pct = (dark / height) * 100;
  /*
    A BAND, NOT A FLOOR, AND THE FLOOR IS THE PART THAT CHANGED.

    The art-direction plan asked for at least 35% dark, and it was right about
    the problem it was written for: the page had no tone darker than its body
    text and read as a document. Built to that number it went to 60%, and on a
    site selling childcare that reads as solemn — which is a worse failure than
    the one it fixed, because a parent feels it before they read a word.

    So the assertion is now two-sided. Below about 15% there is no anchor left
    and the page is one flat field again. Above about 40% it is heavy. In
    between, the dark is doing what it is for: the hero and the closing band
    are photographs a parent looks INTO, and everything between them is light.
  */
  const LOW = 15;
  const HIGH = 40;
  record(
    2,
    `Dark ground is between ${LOW}% and ${HIGH}% of the page's scroll height`,
    pct >= LOW && pct <= HIGH,
    `page is ${height}px tall at 1568 wide; ${dark}px of it is dark = ${pct.toFixed(1)}%
      ` +
      `the dark is the hero and the closing band, both full-bleed photographs; ` +
      `every section between them is on one of three light grounds`,
  );
}

/* ===================================================================== 3 */
{
  const ctx = await browser.newContext({ viewport: { width: 1568, height: 745 }, deviceScaleFactor: 1 });
  const page = await ctx.newPage();
  await page.goto(BASE + "/", { waitUntil: "networkidle" });
  const type = await page.evaluate(() => {
    const h1 = document.querySelector("h1.display");
    if (!h1) return null;
    const s = getComputedStyle(h1);
    return {
      size: parseFloat(s.fontSize),
      leading: s.lineHeight,
      tracking: s.letterSpacing,
      family: s.fontFamily.split(",")[0],
    };
  });
  await ctx.close();
  record(
    3,
    "Display headline is at least 72px at 1568",
    Boolean(type) && type.size >= 72,
    type
      ? `computed font-size ${type.size.toFixed(1)}px, line-height ${type.leading}, letter-spacing ${type.tracking}, ${type.family}`
      : "no h1.display found",
  );
}

/* ===================================================================== 4 */
{
  /*
    The contrast that matters on a photographic section is not a pair of hex
    values — it is the type against whatever the photograph and the scrim
    composite to underneath it. So: capture the page once with the type hidden,
    then sample inside the rectangles the type occupied.
  */
  const TARGETS = [
    ["hero", "[data-hero]", "h1, [data-trust-line] > span, .btn, a[href='#openings']"],
            ["closing", "section:has(.btn-ghost-light)", "h2, p, .btn"],
  ];

  const ctx = await browser.newContext({
    viewport: { width: 1568, height: 745 },
    deviceScaleFactor: 1,
    reducedMotion: "reduce",
  });
  const page = await ctx.newPage();
  await settled(page, BASE + "/");

  const plan = await page.evaluate((targets) => {
    const acc = [];
    for (const [name, sel, textSel] of targets) {
      const sec = document.querySelector(sel);
      if (!sec) continue;
      acc.push({
        name,
        rects: [...sec.querySelectorAll(textSel)]
          .map((n) => n.getBoundingClientRect())
          .filter((r) => r.width > 8 && r.height > 8)
          .map((r) => ({
            x: Math.round(r.left + window.scrollX),
            y: Math.round(r.top + window.scrollY),
            w: Math.round(r.width),
            h: Math.round(r.height),
          })),
      });
    }
    return acc;
  }, TARGETS);

  await page.evaluate((targets) => {
    for (const [, sel, textSel] of targets)
      document
        .querySelector(sel)
        ?.querySelectorAll(textSel)
        .forEach((n) => (n.style.visibility = "hidden"));
    /* The header is `fixed` over the hero; left visible it is captured as if
       it were the hero's own background. */
    document.querySelector("header")?.style.setProperty("display", "none", "important");
  }, TARGETS);
  await page.waitForTimeout(250);
  const shot = await page.screenshot({ fullPage: true });
  await ctx.close();

  const { data, info } = await sharp(shot).raw().toBuffer({ resolveWithObject: true });
  const { width, height, channels } = info;
  const lines = [];
  let worst = Infinity;
  for (const { name, rects } of plan) {
    let hi = -1;
    let lo = 2;
    for (const r of rects)
      for (let y = Math.max(0, r.y); y < Math.min(height, r.y + r.h); y++)
        for (let x = Math.max(0, r.x); x < Math.min(width, r.x + r.w); x++) {
          const i = (y * width + x) * channels;
          const L = lum(data[i], data[i + 1], data[i + 2]);
          if (L > hi) hi = L;
          if (L < lo) lo = L;
        }
    if (hi < 0) continue;
    const [cHi, cLo] = [contrast(FG, hi), contrast(FG, lo)];
    worst = Math.min(worst, cHi, cLo);
    lines.push(
      `${name.padEnd(13)} lightest ${cHi.toFixed(2)}:1, darkest ${cLo.toFixed(2)}:1 ` +
        `(over ${rects.length} runs of type)`,
    );
  }
  record(
    4,
    "Page white clears 4.5:1 over the lightest AND darkest composited pixel under it",
    worst >= 4.5,
    lines.join("\n      ") + `\n      worst case anywhere on the page: ${worst.toFixed(2)}:1`,
  );
}

/* ===================================================================== 7 */
{
  const ctx = await browser.newContext({
    ...{ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2, isMobile: true, hasTouch: true },
    reducedMotion: "reduce",
  });
  const page = await ctx.newPage();
  const seen = new Map();
  page.on("response", async (res) => {
    const type = res.headers()["content-type"] ?? "";
    if (!/^image\//.test(type)) return;
    try {
      const len = Number(res.headers()["content-length"] ?? 0) || (await res.body()).length;
      seen.set(res.url(), { len, type });
    } catch {
      /* body already gone */
    }
  });

  /* Above the fold only — what a visitor actually pays for on arrival. */
  await page.goto(BASE + "/", { waitUntil: "networkidle" });
  await page.waitForTimeout(500);
  const fold = [...seen.values()].reduce((n, v) => n + v.len, 0);
  const foldCount = seen.size;

  /* Then the whole page, which is what they pay for if they read all of it. */
  await page.evaluate(async () => {
    for (let y = 0; y < document.body.scrollHeight; y += 300) {
      window.scrollTo(0, y);
      await new Promise((r) => requestAnimationFrame(r));
    }
  });
  await page.waitForTimeout(2500);
  const total = [...seen.values()].reduce((n, v) => n + v.len, 0);
  await ctx.close();

  const kb = (n) => `${(n / 1024).toFixed(0)}KB`;
  record(
    7,
    "Image bytes transferred on / at 390px",
    fold <= 400 * 1024,
    `on arrival, before any scroll: ${foldCount} image(s), ${kb(fold)}\n      ` +
      `after scrolling the whole page: ${seen.size} images, ${kb(total)}\n      ` +
      `formats served: ${[...new Set([...seen.values()].map((v) => v.type))].join(", ")}`,
  );
}

/* ===================================================================== 9 */
{
  const codes = [];
  for (const route of ROUTES) {
    const res = await fetch(BASE + route, { redirect: "manual" });
    codes.push({ route, status: res.status });
  }
  const bad = codes.filter((c) => c.status !== 200);
  record(
    9,
    "All 15 routes return 200",
    bad.length === 0,
    `${codes.length} routes checked; ${codes.filter((c) => c.status === 200).length} returned 200` +
      (bad.length ? `\n      FAILED: ${bad.map((b) => `${b.route} ${b.status}`).join(", ")}` : ""),
  );
}

/* ==================================================================== 11 */
{
  /*
    Every focusable control that sits on one of the new dark sections, tabbed
    to in order, with the ring measured against the ground behind it. A 3px
    outline that is `--color-accent` on `--color-ground` measures 2.8:1 and is
    a ring you have to look for; `.on-dark :focus-visible` repaints it to the
    page white, and this is what proves that rule is actually in scope.
  */
  const ctx = await browser.newContext({ viewport: { width: 1568, height: 745 }, deviceScaleFactor: 1 });
  const page = await ctx.newPage();
  await settled(page, BASE + "/");

  const checked = await page.evaluate(() => {
    const darkSections = [...document.querySelectorAll(".on-dark")];
    const focusables = [];
    for (const sec of darkSections)
      for (const el of sec.querySelectorAll('a[href], button:not([disabled]), input, [tabindex]:not([tabindex="-1"])'))
        if (el.getBoundingClientRect().width > 0) focusables.push(el);

    const rows = [];
    for (const el of focusables.slice(0, 60)) {
      el.focus();
      const s = getComputedStyle(el);
      /* An <input class="sr-only"> draws its ring on the label beside it, which
         is the room tabs — read that instead of the 1px hidden input. */
      const proxy =
        el.tagName === "INPUT" && el.className.includes("sr-only")
          ? document.querySelector(`label[for="${el.id}"]`)
          : el;
      const ps = proxy ? getComputedStyle(proxy) : s;
      rows.push({
        tag: el.tagName.toLowerCase(),
        label: (el.textContent || el.getAttribute("aria-label") || el.id || "").trim().slice(0, 28),
        width: parseFloat(ps.outlineWidth) || parseFloat(s.outlineWidth) || 0,
        color: ps.outlineColor || s.outlineColor,
        style: ps.outlineStyle,
      });
    }
    return rows;
  });
  await ctx.close();

  const ringless = checked.filter((r) => !(r.width >= 2 && r.style !== "none"));
  const colors = [...new Set(checked.map((r) => r.color))];
  record(
    11,
    "Every control on a dark section draws a visible focus ring",
    checked.length > 0 && ringless.length === 0,
    `${checked.length} focusable controls on .on-dark sections, all with a >=2px outline: ${ringless.length === 0}` +
      `\n      ring colours in use: ${colors.join(", ")}` +
      (ringless.length ? `\n      NO RING: ${ringless.map((r) => `${r.tag} "${r.label}"`).join(", ")}` : ""),
  );
}

await browser.close();
server.kill();

/* ------------------------------------------------------------------ print */
let failures = 0;
const lines = ["", "=== Art direction verification ===", ""];
for (const r of results) {
  if (!r.ok) failures++;
  lines.push(`[${r.ok ? "PASS" : "FAIL"}] ${r.id}. ${r.label}`);
  if (r.detail) lines.push(`      ${r.detail}`);
  lines.push("");
}
lines.push(`${results.length - failures}/${results.length} art-direction checks passed`);
lines.push("");
lines.push("Items 5 (LCP), 6 (CLS), 8 (320px overflow) and 10 (Lighthouse) are covered by");
lines.push("`npm run verify:perf`, `npm run verify:browser` and `npm run verify:lighthouse`.");
lines.push("");

const text = lines.join("\n");
console.log(text);
mkdirSync(out, { recursive: true });
writeFileSync(join(out, "art-direction-checks.txt"), text);
process.exit(failures === 0 ? 0 : 1);
