/**
 * Lighthouse, mobile preset, against a production build.
 *
 *   npm run build && node scripts/lighthouse-check.mjs
 *
 * Never against the dev server, which scores meaninglessly.
 */

import { spawn, spawnSync } from "node:child_process";
import { mkdirSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import lighthouse from "lighthouse";
import { chromium } from "playwright";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const out = join(root, "verification");
const PORT = Number(process.env.PORT ?? 3215);
const CDP = 9333;
const BASE = `http://127.0.0.1:${PORT}`;

/* Refuse to run against something else already on this port — a leftover
   server serving a stale build silently produces meaningless scores. */
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
    if (process.platform === "win32") spawnSync("taskkill", ["/pid", String(server.pid), "/T", "/F"], { stdio: "ignore" }); else server.kill();
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

const browser = await chromium.launch({ args: [`--remote-debugging-port=${CDP}`] });

const ROUTES = ["/", "/book-a-tour", "/safety", "/tuition"];
const CATEGORIES = ["performance", "accessibility", "best-practices", "seo"];
const TARGETS = { performance: 90, accessibility: 100, "best-practices": 95, seo: 100 };

mkdirSync(out, { recursive: true });
const lines = ["=== Lighthouse, mobile preset, production build ===", ""];
let failures = 0;

for (const route of ROUTES) {
  const result = await lighthouse(
    BASE + route,
    { port: CDP, output: "json", logLevel: "error", onlyCategories: CATEGORIES },
    undefined,
  );

  if (!result) {
    lines.push(`${route}: lighthouse returned nothing`);
    failures++;
    continue;
  }

  const scores = {};
  for (const key of CATEGORIES) {
    scores[key] = Math.round((result.lhr.categories[key]?.score ?? 0) * 100);
  }

  const bad = CATEGORIES.filter((k) => scores[k] < TARGETS[k]);
  if (route === "/" && bad.length) failures++;

  lines.push(
    `${route}`,
    `  Performance   ${String(scores.performance).padStart(3)}  (target >= ${TARGETS.performance})`,
    `  Accessibility ${String(scores.accessibility).padStart(3)}  (target ${TARGETS.accessibility})`,
    `  Best Practices${String(scores["best-practices"]).padStart(4)}  (target >= ${TARGETS["best-practices"]})`,
    `  SEO           ${String(scores.seo).padStart(3)}  (target ${TARGETS.seo})`,
  );

  const audits = result.lhr.audits;
  const metrics = ["largest-contentful-paint", "cumulative-layout-shift", "total-blocking-time", "first-contentful-paint", "speed-index"];
  lines.push("  " + metrics.map((m) => `${m}: ${audits[m]?.displayValue ?? "?"}`).join("  |  "));

  /* Anything scored below 1 is worth naming, so failures are actionable. */
  for (const key of CATEGORIES) {
    const refs = result.lhr.categories[key]?.auditRefs ?? [];
    const problems = refs
      .map((ref) => audits[ref.id])
      .filter((a) => a && a.score !== null && a.score < 1 && a.scoreDisplayMode !== "informative")
      .map((a) => `${a.id} (${a.score})`);
    if (problems.length) lines.push(`  ${key} issues: ${problems.join(", ")}`);
  }
  lines.push("");

  writeFileSync(join(out, `lighthouse${route === "/" ? "-home" : route.replace(/\//g, "-")}.json`), JSON.stringify(result.lhr, null, 2));
}

await browser.close();
if (process.platform === "win32") spawnSync("taskkill", ["/pid", String(server.pid), "/T", "/F"], { stdio: "ignore" }); else server.kill();

const text = lines.join("\n");
console.log(text);
writeFileSync(join(out, "lighthouse.txt"), text, "utf8");
process.exit(failures === 0 ? 0 : 1);
