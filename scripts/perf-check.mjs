/**
 * CLS and LCP on a throttled connection, against a production build.
 *
 *     npm run build && npm run verify:perf
 *
 * LCP is the figure most likely to regress when real photographs replace
 * lightweight SVG blocks, so it is measured rather than assumed — on emulated
 * 4G, with the CPU throttled, which is the condition the number is claimed for.
 */
import { spawn, spawnSync } from "node:child_process";
import { chromium, devices } from "playwright";

const PORT = Number(process.env.PORT ?? 3217);
const BASE = `http://127.0.0.1:${PORT}`;

const server = spawn(
  process.platform === "win32" ? "npx.cmd" : "npx",
  ["next", "start", "--port", String(PORT), "--hostname", "127.0.0.1"],
  { cwd: process.cwd(), stdio: "ignore", shell: process.platform === "win32" },
);
process.on("exit", () => {
  if (process.platform === "win32")
    spawnSync("taskkill", ["/pid", String(server.pid), "/T", "/F"], { stdio: "ignore" });
  else server.kill();
});
for (let i = 0; i < 180; i++) {
  try {
    const r = await fetch(BASE, { redirect: "manual" });
    if (r.status < 500) break;
  } catch { /* not up */ }
  await new Promise((r) => setTimeout(r, 500));
}

/** Lighthouse's "Slow 4G" preset. */
const FOUR_G = { downloadThroughput: (1.6 * 1024 * 1024) / 8, uploadThroughput: (750 * 1024) / 8, latency: 150 };

const browser = await chromium.launch();
const rows = [];

for (const [label, routes] of [["390px", ["/"]], ["1440px", ["/"]]]) {
  for (const route of routes) {
    const ctx = await browser.newContext(
      label === "390px"
        ? { ...devices["iPhone 13"], viewport: { width: 390, height: 844 } }
        : { viewport: { width: 1440, height: 900 } },
    );
    const page = await ctx.newPage();
    const cdp = await ctx.newCDPSession(page);
    await cdp.send("Network.enable");
    await cdp.send("Network.emulateNetworkConditions", { offline: false, ...FOUR_G });
    await cdp.send("Emulation.setCPUThrottlingRate", { rate: 4 /* Lighthouse mobile default */ });

    await page.addInitScript(() => {
      window.__cls = 0;
      window.__lcp = 0;
      new PerformanceObserver((l) => {
        for (const e of l.getEntries()) if (!e.hadRecentInput) window.__cls += e.value;
      }).observe({ type: "layout-shift", buffered: true });
      new PerformanceObserver((l) => {
        for (const e of l.getEntries()) window.__lcp = e.startTime;
      }).observe({ type: "largest-contentful-paint", buffered: true });
    });

    await page.goto(BASE + route, { waitUntil: "load" });
    await page.waitForTimeout(2500);
    const beforeScroll = await page.evaluate(() => ({ cls: window.__cls, lcp: window.__lcp }));

    await page.evaluate(async () => {
      const step = window.innerHeight * 0.85;
      for (let y = 0; y < document.body.scrollHeight; y += step) {
        window.scrollTo(0, y);
        await new Promise((r) => setTimeout(r, 140));
      }
      window.scrollTo(0, 0);
    });
    await page.waitForTimeout(1200);
    const after = await page.evaluate(() => window.__cls);

    rows.push({ label, route, lcp: beforeScroll.lcp, cls: beforeScroll.cls, clsFull: after });
    await ctx.close();
  }
}
await browser.close();

console.log("\n=== CLS / LCP, emulated Slow 4G (1.6 Mbps, 150ms RTT) + 4x CPU throttle ===\n");
for (const r of rows) {
  console.log(
    `  ${r.label.padEnd(7)} ${r.route.padEnd(16)} LCP ${(r.lcp / 1000).toFixed(2)}s   ` +
      `CLS ${r.cls.toFixed(4)} at load, ${r.clsFull.toFixed(4)} after scrolling the whole page`,
  );
}
const worstLcp = Math.max(...rows.map((r) => r.lcp));
const worstCls = Math.max(...rows.map((r) => r.clsFull));
console.log(`\n  worst LCP ${(worstLcp / 1000).toFixed(2)}s (budget 2.5s) — ${worstLcp < 2500 ? "PASS" : "FAIL"}`);
console.log(`  worst CLS ${worstCls.toFixed(4)} (budget 0.1) — ${worstCls < 0.1 ? "PASS" : "FAIL"}`);
process.exitCode = worstLcp < 2500 && worstCls < 0.1 ? 0 : 1;
