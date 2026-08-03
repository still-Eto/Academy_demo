/**
 * Validates the JSON-LD actually emitted by the production build.
 *
 *   npm run build && node scripts/jsonld-check.mjs
 *
 * Invalid structured data is worse than none, so this parses every block on
 * every route and asserts the fields Google requires for each type.
 */

import { spawn } from "node:child_process";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const PORT = Number(process.env.PORT ?? 3218);
const BASE = `http://127.0.0.1:${PORT}`;

try {
  await fetch(BASE, { signal: AbortSignal.timeout(1500) });
  console.error(`Port ${PORT} is already in use.`);
  process.exit(1);
} catch {
  /* nothing listening */
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
    /* wait */
  }
  await new Promise((r) => setTimeout(r, 500));
}

const ROUTES = ["/", "/programs", "/programs/sunflower", "/safety", "/tuition", "/about", "/staff", "/faq", "/book-a-tour", "/contact"];

const REQUIRED = {
  LocalBusiness: ["name", "address", "telephone"],
  ChildCare: ["name", "address"],
  Preschool: ["name"],
  FAQPage: ["mainEntity"],
  BreadcrumbList: ["itemListElement"],
};

const problems = [];
const summary = [];

for (const route of ROUTES) {
  const html = await (await fetch(BASE + route)).text();
  const blocks = [...html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)].map((m) => m[1]);

  if (blocks.length === 0) {
    summary.push(`${route}: no JSON-LD`);
    continue;
  }

  const types = [];
  for (const [i, raw] of blocks.entries()) {
    let data;
    try {
      data = JSON.parse(raw);
    } catch (err) {
      problems.push(`${route} block ${i}: invalid JSON — ${err.message}`);
      continue;
    }

    if (!data["@context"]) problems.push(`${route} block ${i}: missing @context`);
    const blockTypes = [data["@type"]].flat();
    types.push(...blockTypes);

    for (const type of blockTypes) {
      for (const field of REQUIRED[type] ?? []) {
        if (data[field] === undefined) problems.push(`${route}: ${type} is missing "${field}"`);
      }
    }

    if (blockTypes.includes("FAQPage")) {
      const bad = (data.mainEntity ?? []).filter((q) => !q.name || !q.acceptedAnswer?.text);
      if (bad.length) problems.push(`${route}: ${bad.length} FAQ entries missing name or answer text`);
      summary.push(`${route}: FAQPage with ${data.mainEntity.length} questions`);
    }

    if (blockTypes.includes("LocalBusiness")) {
      if (!data.geo?.latitude || !data.geo?.longitude) problems.push(`${route}: LocalBusiness missing geo`);
      if (!data.openingHoursSpecification?.length) problems.push(`${route}: LocalBusiness missing openingHoursSpecification`);
      if (!data.address?.streetAddress) problems.push(`${route}: PostalAddress missing streetAddress`);
    }

    if (blockTypes.includes("BreadcrumbList")) {
      const positions = data.itemListElement.map((x) => x.position);
      if (positions.join(",") !== positions.map((_, i) => i + 1).join(",")) {
        problems.push(`${route}: BreadcrumbList positions are not 1..n`);
      }
      summary.push(`${route}: BreadcrumbList, ${data.itemListElement.length} levels`);
    }
  }

  summary.push(`${route}: ${blocks.length} block(s) — ${[...new Set(types)].join(", ")}`);
}

console.log("\n=== JSON-LD ===\n");
summary.forEach((s) => console.log("  " + s));
console.log("");
if (problems.length === 0) {
  console.log("PASS — every block parses and carries its required fields\n");
} else {
  console.log("FAIL");
  problems.forEach((p) => console.log("  " + p));
}

server.kill();
process.exit(problems.length === 0 ? 0 : 1);
