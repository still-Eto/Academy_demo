/**
 * The eleven measurements the fix brief asks for, run against a production
 * build. Every check reports a figure, not a yes.
 *
 *     npm run build && node scripts/fix-brief-checks.mjs
 *
 * Screenshots land in /verification/fix-brief.
 */

import { spawn, spawnSync } from "node:child_process";
import { mkdirSync, writeFileSync, readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { chromium, devices } from "playwright";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const shots = join(root, "verification", "fix-brief");
const PORT = Number(process.env.PORT ?? 3213);
const BASE = `http://127.0.0.1:${PORT}`;

/** The fifteen real routes. /this-page-does-not-exist is the 404, checked apart. */
const ROUTES = [
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
];

const out = [];
const say = (s = "") => {
  console.log(s);
  out.push(s);
};

async function waitForServer(url, timeoutMs = 90_000) {
  const started = Date.now();
  while (Date.now() - started < timeoutMs) {
    try {
      const res = await fetch(url, { redirect: "manual" });
      if (res.status < 500) return true;
    } catch {
      /* not up yet */
    }
    await new Promise((r) => setTimeout(r, 500));
  }
  throw new Error(`server did not come up at ${url}`);
}

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
const shutdown = () => {
  try {
    if (process.platform === "win32") spawnSync("taskkill", ["/pid", String(server.pid), "/T", "/F"], { stdio: "ignore" }); else server.kill();
  } catch {
    /* already gone */
  }
};
process.on("exit", shutdown);
process.on("SIGINT", () => {
  shutdown();
  process.exit(1);
});

await waitForServer(BASE);
mkdirSync(shots, { recursive: true });
const browser = await chromium.launch();

/* ===================================================================== */
say("=== 1. / with JavaScript disabled ===");
{
  for (const [w, h] of [
    [390, 844],
    [2560, 1271],
  ]) {
    const ctx = await browser.newContext({
      viewport: { width: w, height: h },
      javaScriptEnabled: false,
      deviceScaleFactor: 1,
    });
    const page = await ctx.newPage();
    await page.goto(BASE + "/", { waitUntil: "load" });

    const legible = await page.evaluate(() => {
      const faint = (el) => Number(getComputedStyle(el).opacity) < 0.95;
      /* A program card is the whole link: room, ages, ratio and weekly rate. */
      const cards = [...document.querySelectorAll('a[href^="/programs/"]')].filter((a) =>
        /Ratio/.test(a.textContent ?? ""),
      );
      const openings = [...document.querySelectorAll("#openings li, #openings tbody tr")];
      const text = (el) => (el?.innerText ?? "").replace(/\s+/g, " ").trim();
      return {
        programCards: cards.length,
        programCardsFaint: cards.filter(faint).length,
        cardText: cards.map((c) => text(c).slice(0, 58)),
        openingsRows: openings.length,
        openingsRowsFaint: openings.filter(faint).length,
        openingsText: text(document.querySelector("#openings")).slice(0, 150),
      };
    });

    await page.screenshot({ path: join(shots, `nojs-home-${w}.png`), fullPage: false });
    await page.screenshot({ path: join(shots, `nojs-home-${w}-full.png`), fullPage: true });

    say(
      `  ${w}x${h} no-JS: ${legible.programCards} program cards (${legible.programCardsFaint} faint), ` +
        `${legible.openingsRows} openings rows (${legible.openingsRowsFaint} faint)`,
    );
    say(`    openings reads: "${legible.openingsText}…"`);
    for (const c of legible.cardText) say(`    card: ${c}…`);
    await ctx.close();
  }
}

/* ===================================================================== */
say("");
say("=== 2. Elements on / with computed opacity < 0.95 after load ===");
{
  for (const [w, h] of [
    [390, 844],
    [2560, 1271],
  ]) {
    const ctx = await browser.newContext({ viewport: { width: w, height: h } });
    const page = await ctx.newPage();
    await page.goto(BASE + "/", { waitUntil: "networkidle" });

    const probe = () =>
      page.evaluate(() => {
        const vh = window.innerHeight;
        const faint = [...document.querySelectorAll("body *")].filter(
          (el) => Number(getComputedStyle(el).opacity) < 0.95,
        );
        const inFirstViewport = faint.filter((el) => {
          const r = el.getBoundingClientRect();
          return r.height > 0 && r.top < vh && r.bottom > 0;
        });
        return {
          total: faint.length,
          visible: inFirstViewport.length,
          sample: faint
            .slice(0, 4)
            .map((el) => `${el.tagName.toLowerCase()}[${(el.textContent ?? "").trim().slice(0, 24)}]`),
        };
      });

    const atLoad = await probe();
    /* Past the 1200ms safety net, and past any reveal transition. */
    await page.waitForTimeout(1800);
    const settled = await probe();

    say(`  ${w}x${h}`);
    say(
      `    at networkidle : ${atLoad.total} faint on the page, ${atLoad.visible} of them inside the first viewport`,
    );
    say(
      `    after settle   : ${settled.total} faint on the page, ${settled.visible} inside the first viewport ${settled.sample.join(" ")}`,
    );
    await ctx.close();
  }
}

/* ===================================================================== */
say("");
say("=== 3. document.title for all 15 routes ===");
{
  const ctx = await browser.newContext({ viewport: { width: 1280, height: 800 } });
  const page = await ctx.newPage();
  const brand = /Bridgewood Academy/g;
  let bad = 0;
  for (const [route] of ROUTES) {
    await page.goto(BASE + route, { waitUntil: "domcontentloaded" });
    const t = await page.title();
    const n = t.length;
    const brandCount = (t.match(brand) ?? []).length;
    const trailingPeriod = /\.$/.test(t);
    const ok = n <= 60 && brandCount === 1 && !trailingPeriod;
    if (!ok) bad++;
    say(
      `  ${ok ? "ok  " : "FAIL"} ${String(n).padStart(3)} chars  brand x${brandCount}  ` +
        `${trailingPeriod ? "TRAILING PERIOD  " : ""}${route}  ->  "${t}"`,
    );
  }
  say(`  ${ROUTES.length - bad}/${ROUTES.length} routes pass all three title rules`);
  await ctx.close();
}

/* ===================================================================== */
say("");
say("=== 4. /book-a-tour at 390px: y of trust row, first label, submit ===");
{
  const ctx = await browser.newContext({ ...devices["iPhone 13"], viewport: { width: 390, height: 844 } });
  const page = await ctx.newPage();
  await page.goto(BASE + "/book-a-tour", { waitUntil: "networkidle" });

  const y = await page.evaluate(() => {
    const top = (el) => (el ? Math.round(el.getBoundingClientRect().top + window.scrollY) : null);
    const trust = document.querySelector("[data-trust-row]");
    const label = document.querySelector("form label, form legend");
    const submit = document.querySelector('form button[type="submit"]');
    return {
      trustRow: top(trust),
      trustRowHeight: trust ? Math.round(trust.getBoundingClientRect().height) : null,
      firstLabel: top(label),
      firstLabelText: label?.textContent?.trim() ?? null,
      submit: top(submit),
      submitText: submit?.textContent?.trim() ?? null,
    };
  });
  say(`  trust row      y = ${y.trustRow}  (height ${y.trustRowHeight}px)`);
  say(`  first label    y = ${y.firstLabel}  "${y.firstLabelText}"`);
  say(`  submit button  y = ${y.submit}  "${y.submitText}"`);
  say(
    `  order correct: ${y.trustRow !== null && y.trustRow < y.firstLabel}; ` +
      `first label under y=500: ${y.firstLabel < 500}; trust row under 100px tall: ${y.trustRowHeight < 100}`,
  );
  await page.screenshot({ path: join(shots, "book-a-tour-390-fold.png") });
  await ctx.close();
}

/* ===================================================================== */
say("");
say("=== 5. document.body.scrollHeight on / at 390px ===");
{
  const ctx = await browser.newContext({ ...devices["iPhone 13"], viewport: { width: 390, height: 844 } });
  const page = await ctx.newPage();
  await page.goto(BASE + "/", { waitUntil: "networkidle" });
  await page.waitForTimeout(1500);
  const h = await page.evaluate(() => document.body.scrollHeight);
  say(`  scrollHeight = ${h}px  (${(h / 844).toFixed(1)} phone screens)  target <= 9500`);

  const sections = await page.evaluate(() =>
    [...document.querySelectorAll("main > section, main > div > section")].map((s) => ({
      h: Math.round(s.getBoundingClientRect().height),
      t: (s.textContent ?? "").replace(/\s+/g, " ").trim().slice(0, 46),
    })),
  );
  for (const s of sections) say(`    ${String(s.h).padStart(5)}px  ${s.t}`);
  await ctx.close();
}

/* ===================================================================== */
say("");
say("=== 6. Hero at 1440, 1920, 2560 ===");
{
  for (const w of [1440, 1920, 2560]) {
    const ctx = await browser.newContext({ viewport: { width: w, height: 900 } });
    const page = await ctx.newPage();
    await page.goto(BASE + "/", { waitUntil: "networkidle" });
    await page.waitForTimeout(400);
    const geo = await page.evaluate(() => {
      const h1 = document.querySelector("h1");
      const img = document.querySelector("main img");
      const r = h1.getBoundingClientRect();
      const ri = img.getBoundingClientRect();
      return {
        h1Left: Math.round(r.left),
        h1Width: Math.round(r.width),
        imgRight: Math.round(window.innerWidth - ri.right),
        gutter: Math.round(r.left),
      };
    });
    say(`  ${w}px: h1 starts at x=${geo.h1Left}, h1 width ${geo.h1Width}, right gutter ${geo.imgRight}`);
    await page.screenshot({ path: join(shots, `hero-${w}.png`), clip: { x: 0, y: 0, width: w, height: 900 } });
    await ctx.close();
  }
}

/* ===================================================================== */
say("");
say("=== 7. Hero trust line at 390px ===");
{
  const ctx = await browser.newContext({ ...devices["iPhone 13"], viewport: { width: 390, height: 844 } });
  const page = await ctx.newPage();
  await page.goto(BASE + "/", { waitUntil: "networkidle" });
  const el = page.locator("[data-trust-line]").first();
  const box = await el.boundingBox();
  const info = await page.evaluate(() => {
    const t = document.querySelector("[data-trust-line]");
    return {
      text: (t?.innerText ?? "").replace(/\n/g, " / "),
      separators: (t?.innerText ?? "").split("·").length - 1,
      fontSize: t ? getComputedStyle(t).fontSize : null,
      items: t ? t.children.length : 0,
    };
  });
  say(`  items ${info.items}, "·" characters in rendered text: ${info.separators}, font-size ${info.fontSize}`);
  say(`  reads: ${info.text}`);
  if (box) {
    await page.screenshot({
      path: join(shots, "trust-line-390.png"),
      clip: { x: 0, y: Math.max(0, box.y - 10), width: 390, height: box.height + 20 },
    });
  }
  await ctx.close();
}

/* ===================================================================== */
say("");
say("=== 8. Horizontal scroll at 320px, all 15 routes ===");
{
  const ctx = await browser.newContext({ viewport: { width: 320, height: 900 } });
  const offenders = [];
  for (const [route] of ROUTES) {
    const page = await ctx.newPage();
    await page.goto(BASE + route, { waitUntil: "networkidle" });
    const info = await page.evaluate(() => ({
      scrollWidth: document.documentElement.scrollWidth,
      clientWidth: document.documentElement.clientWidth,
    }));
    if (info.scrollWidth > info.clientWidth + 1) {
      offenders.push(`${route}: ${info.scrollWidth} > ${info.clientWidth}`);
    }
    await page.close();
  }
  say(
    offenders.length === 0
      ? `  0 of ${ROUTES.length} routes overflow at 320px (documentElement.scrollWidth never exceeds clientWidth)`
      : `  ${offenders.length} offenders: ${offenders.join("; ")}`,
  );
  await ctx.close();
}

/* ===================================================================== */
say("");
say("=== 9. HTTP status for all 15 routes ===");
{
  const codes = [];
  for (const [route] of ROUTES) {
    const res = await fetch(BASE + route, { redirect: "manual" });
    codes.push(`${route} ${res.status}`);
  }
  const bad = codes.filter((c) => !c.endsWith(" 200"));
  say(`  ${codes.length - bad.length}/${codes.length} return 200`);
  say(`  ${codes.join(", ")}`);
}

void readFileSync;

/* ===================================================================== */
say("");
say("=== 10. Banned placeholder strings anywhere in built output ===");
{
  const { readdirSync, statSync: st, readFileSync: rf } = await import("node:fs");
  const needles = ["PHOTOGRAPH TO COME", "TO COME", "1600×1000", "1600x1000", "Shot from"];
  const walk = (dir, acc = []) => {
    for (const e of readdirSync(dir)) {
      const full = join(dir, e);
      if (st(full).isDirectory()) {
        if (e === "node_modules" || e === "_source" || e === "cache") continue;
        walk(full, acc);
      } else if (/\.(html|js|css|svg|json|txt)$/.test(e)) acc.push(full);
    }
    return acc;
  };
  const files = [...walk(join(root, ".next")), ...walk(join(root, "public"))];
  const hits = [];
  for (const f of files) {
    const text = rf(f, "utf8");
    for (const n of needles) if (text.includes(n)) hits.push(`${f.replace(root, "")}: "${n}"`);
  }
  say(`  scanned ${files.length} built + public files for: ${needles.map((n) => `"${n}"`).join(", ")}`);
  say(hits.length === 0 ? "  0 matches" : `  ${hits.length} MATCHES:\n    ${hits.slice(0, 10).join("\n    ")}`);

  /* Also: is there any rendered text inside any served image? */
  const svgWithText = [...walk(join(root, "public"))].filter(
    (f) => f.endsWith(".svg") && rf(f, "utf8").includes("<text"),
  );
  say(`  SVGs under /public containing a <text> element: ${svgWithText.length}`);
}

/* ===================================================================== */
say("");
say("=== 11. Transferred image bytes on / at 390px ===");
{
  const ctx = await browser.newContext({ ...devices["iPhone 13"], viewport: { width: 390, height: 844 } });
  const page = await ctx.newPage();
  const seen = new Map();
  page.on("response", async (res) => {
    const type = res.headers()["content-type"] ?? "";
    if (!/^image\//.test(type)) return;
    try {
      const body = await res.body();
      seen.set(res.url(), { bytes: body.length, type });
    } catch {
      /* redirect or aborted */
    }
  });
  await page.goto(BASE + "/", { waitUntil: "networkidle" });
  await page.waitForTimeout(1200);
  const above = [...seen.values()].reduce((n, v) => n + v.bytes, 0);
  say(`  first paint, no scroll: ${seen.size} images, ${(above / 1024).toFixed(0)} KB`);
  for (const [url, v] of [...seen.entries()].sort((a, b) => b[1].bytes - a[1].bytes).slice(0, 6)) {
    say(`    ${(v.bytes / 1024).toFixed(0).padStart(5)} KB  ${v.type.padEnd(11)} ${url.replace(BASE, "")}`);
  }
  await page.evaluate(async () => {
    const step = window.innerHeight * 0.9;
    for (let y = 0; y < document.body.scrollHeight; y += step) {
      window.scrollTo(0, y);
      await new Promise((r) => setTimeout(r, 110));
    }
  });
  await page.waitForTimeout(1500);
  const all = [...seen.values()].reduce((n, v) => n + v.bytes, 0);
  const byType = {};
  for (const v of seen.values()) byType[v.type] = (byType[v.type] ?? 0) + v.bytes;
  say(`  after scrolling the whole page: ${seen.size} images, ${(all / 1024).toFixed(0)} KB`);
  say(`    ${Object.entries(byType).map(([t, b]) => `${t} ${(b / 1024).toFixed(0)}KB`).join(", ")}`);
  await ctx.close();
}

/* ===================================================================== */
say("");
say("=== 12. Screenshots: / and a program page, at 390 and 1440 ===");
{
  for (const [label, opts] of [
    ["390", { ...devices["iPhone 13"], viewport: { width: 390, height: 844 } }],
    ["1440", { viewport: { width: 1440, height: 900 } }],
  ]) {
    const ctx = await browser.newContext(opts);
    for (const [route, name] of [["/", "home"], ["/programs/oak", "program-oak"]]) {
      const page = await ctx.newPage();
      await page.goto(BASE + route, { waitUntil: "networkidle" });
      await page.evaluate(async () => {
        const step = window.innerHeight * 0.9;
        for (let y = 0; y < document.body.scrollHeight; y += step) {
          window.scrollTo(0, y);
          await new Promise((r) => setTimeout(r, 90));
        }
        window.scrollTo(0, 0);
      });
      await page.waitForTimeout(900);
      await page.screenshot({ path: join(shots, name + "-" + label + "-fold.png") });
      await page.screenshot({ path: join(shots, name + "-" + label + "-full.png"), fullPage: true });
      say("  wrote " + name + "-" + label + "-fold.png and -full.png");
      await page.close();
    }
    await ctx.close();
  }
}

await browser.close();
shutdown();
writeFileSync(join(shots, "report.txt"), out.join("\n"), "utf8");
console.log("\nReport written to verification/fix-brief/report.txt");
