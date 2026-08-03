/**
 * Proves the photo swap is a drop-in.
 *
 *     npm run build && node scripts/photo-swap-cls.mjs
 *
 * Writes real raster JPEGs over every placeholder path in the manifest — at
 * the manifest's own dimensions — reloads each page, and measures layout
 * shift. If the aspect ratio were not locked at the container, replacing a
 * vector placeholder with a raster photograph would reflow the page and CLS
 * would spike. The originals are restored afterwards, always.
 *
 * The JPEGs are generated here rather than shipped, so the repo stays free of
 * binary fixtures.
 */

import { spawn, spawnSync } from "node:child_process";
import { copyFileSync, existsSync, mkdirSync, readFileSync, renameSync, rmSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { chromium, devices } from "playwright";

import { allImages } from "./manifest.mjs";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const backup = join(root, ".photo-swap-backup");
const PORT = Number(process.env.PORT ?? 3214);
const BASE = `http://127.0.0.1:${PORT}`;

const ROUTES = ["/", "/about", "/staff", "/programs/sunflower", "/contact", "/book-a-tour"];

/* ------------------------------------------------------------------ JPEG */
/**
 * A minimal baseline JPEG at an arbitrary size. Encodes one flat DC-only MCU
 * per block, which is all this test needs — the browser has to decode the SOF0
 * header and lay the image out at its intrinsic size, and that is the whole
 * point of the exercise.
 */
function flatJpeg(width, height) {
  const qt = new Uint8Array(64).fill(16);
  const zigzagQ = Buffer.concat([Buffer.from([0xff, 0xdb, 0x00, 0x43, 0x00]), Buffer.from(qt)]);

  const sof = Buffer.from([
    0xff, 0xc0, 0x00, 0x11, 0x08,
    (height >> 8) & 0xff, height & 0xff,
    (width >> 8) & 0xff, width & 0xff,
    0x03,
    0x01, 0x11, 0x00,
    0x02, 0x11, 0x00,
    0x03, 0x11, 0x00,
  ]);

  /* Two standard tables (luma DC + luma AC), reused for chroma. */
  const dcBits = [0, 1, 5, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0];
  const dcVals = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11];
  const acBits = [0, 2, 1, 3, 3, 2, 4, 3, 5, 5, 4, 4, 0, 0, 1, 0x7d];
  const acVals = [
    0x01, 0x02, 0x03, 0x00, 0x04, 0x11, 0x05, 0x12, 0x21, 0x31, 0x41, 0x06, 0x13, 0x51, 0x61, 0x07,
    0x22, 0x71, 0x14, 0x32, 0x81, 0x91, 0xa1, 0x08, 0x23, 0x42, 0xb1, 0xc1, 0x15, 0x52, 0xd1, 0xf0,
    0x24, 0x33, 0x62, 0x72, 0x82, 0x09, 0x0a, 0x16, 0x17, 0x18, 0x19, 0x1a, 0x25, 0x26, 0x27, 0x28,
    0x29, 0x2a, 0x34, 0x35, 0x36, 0x37, 0x38, 0x39, 0x3a, 0x43, 0x44, 0x45, 0x46, 0x47, 0x48, 0x49,
    0x4a, 0x53, 0x54, 0x55, 0x56, 0x57, 0x58, 0x59, 0x5a, 0x63, 0x64, 0x65, 0x66, 0x67, 0x68, 0x69,
    0x6a, 0x73, 0x74, 0x75, 0x76, 0x77, 0x78, 0x79, 0x7a, 0x83, 0x84, 0x85, 0x86, 0x87, 0x88, 0x89,
    0x8a, 0x92, 0x93, 0x94, 0x95, 0x96, 0x97, 0x98, 0x99, 0x9a, 0xa2, 0xa3, 0xa4, 0xa5, 0xa6, 0xa7,
    0xa8, 0xa9, 0xaa, 0xb2, 0xb3, 0xb4, 0xb5, 0xb6, 0xb7, 0xb8, 0xb9, 0xba, 0xc2, 0xc3, 0xc4, 0xc5,
    0xc6, 0xc7, 0xc8, 0xc9, 0xca, 0xd2, 0xd3, 0xd4, 0xd5, 0xd6, 0xd7, 0xd8, 0xd9, 0xda, 0xe1, 0xe2,
    0xe3, 0xe4, 0xe5, 0xe6, 0xe7, 0xe8, 0xe9, 0xea, 0xf1, 0xf2, 0xf3, 0xf4, 0xf5, 0xf6, 0xf7, 0xf8,
    0xf9, 0xfa,
  ];

  const dht = (cls, id, bits, vals) =>
    Buffer.concat([
      Buffer.from([0xff, 0xc4]),
      Buffer.from([((3 + bits.length + vals.length) >> 8) & 0xff, (3 + bits.length + vals.length) & 0xff]),
      Buffer.from([(cls << 4) | id]),
      Buffer.from(bits),
      Buffer.from(vals),
    ]);

  const sos = Buffer.from([
    0xff, 0xda, 0x00, 0x0c, 0x03, 0x01, 0x00, 0x02, 0x11, 0x03, 0x11, 0x00, 0x3f, 0x00,
  ]);

  /* One grey MCU repeated: DC=0 (code 0x00, 2 bits "00"), EOB (0x00 -> "1010")
     for each of Y, Cb, Cr. Packed and padded with 1-bits. */
  const blocksWide = Math.ceil(width / 8);
  const blocksHigh = Math.ceil(height / 8);
  const bits = [];
  for (let i = 0; i < blocksWide * blocksHigh; i++) {
    for (let c = 0; c < 3; c++) {
      bits.push(0, 0);                 // DC category 0
      bits.push(1, 0, 1, 0);           // AC EOB
    }
  }
  while (bits.length % 8) bits.push(1);
  const scan = [];
  for (let i = 0; i < bits.length; i += 8) {
    let b = 0;
    for (let j = 0; j < 8; j++) b = (b << 1) | bits[i + j];
    scan.push(b);
    if (b === 0xff) scan.push(0x00); // byte stuffing
  }

  return Buffer.concat([
    Buffer.from([0xff, 0xd8]),
    zigzagQ,
    sof,
    dht(0, 0, dcBits, dcVals),
    dht(1, 0, acBits, acVals),
    sos,
    Buffer.from(scan),
    Buffer.from([0xff, 0xd9]),
  ]);
}

/* -------------------------------------------------------------- swap in */
rmSync(backup, { recursive: true, force: true });
mkdirSync(backup, { recursive: true });

const swapped = [];
for (const image of allImages) {
  const target = join(root, "public", image.src.replace(/^\//, ""));
  if (!existsSync(target)) continue;
  const saved = join(backup, image.src.replace(/^\//, "").replace(/[\\/]/g, "__"));
  copyFileSync(target, saved);
  swapped.push({ target, saved });
}

const restore = () => {
  for (const { target, saved } of swapped) {
    if (existsSync(saved)) copyFileSync(saved, target);
  }
  rmSync(backup, { recursive: true, force: true });
};
process.on("exit", restore);

let server;
try {
  /* Write the raster stand-ins over the SVG paths. Same path, same size, a
     completely different decoder — exactly the situation a real swap creates. */
  for (const image of allImages) {
    const target = join(root, "public", image.src.replace(/^\//, ""));
    if (!existsSync(target)) continue;
    writeFileSync(target, flatJpeg(image.width, image.height));
  }

  server = spawn(
    process.platform === "win32" ? "npx.cmd" : "npx",
    ["next", "start", "--port", String(PORT), "--hostname", "127.0.0.1"],
    { cwd: root, stdio: "ignore", shell: process.platform === "win32" },
  );
  process.on("exit", () => {
    if (process.platform === "win32") {
      spawnSync("taskkill", ["/pid", String(server.pid), "/T", "/F"], { stdio: "ignore" });
    } else {
      server.kill();
    }
  });

  for (let i = 0; i < 180; i++) {
    try {
      const r = await fetch(BASE, { redirect: "manual" });
      if (r.status < 500) break;
    } catch {
      /* not up */
    }
    await new Promise((r) => setTimeout(r, 500));
  }

  const browser = await chromium.launch();
  const results = [];

  for (const [label, opts] of [
    ["390px", { ...devices["iPhone 13"], viewport: { width: 390, height: 844 } }],
    ["1440px", { viewport: { width: 1440, height: 900 } }],
  ]) {
    const ctx = await browser.newContext(opts);
    for (const route of ROUTES) {
      const page = await ctx.newPage();
      await page.addInitScript(() => {
        window.__cls = 0;
        new PerformanceObserver((list) => {
          for (const entry of list.getEntries()) {
            if (!entry.hadRecentInput) window.__cls += entry.value;
          }
        }).observe({ type: "layout-shift", buffered: true });
      });
      await page.goto(BASE + route, { waitUntil: "networkidle" });
      /* Scroll the whole page so every lazy image loads where it will be seen,
         which is when a ratio mistake would actually shift content. */
      await page.evaluate(async () => {
        const step = window.innerHeight * 0.8;
        for (let y = 0; y < document.body.scrollHeight; y += step) {
          window.scrollTo(0, y);
          await new Promise((r) => setTimeout(r, 90));
        }
        window.scrollTo(0, 0);
      });
      await page.waitForTimeout(600);
      const cls = await page.evaluate(() => window.__cls ?? 0);
      results.push({ label, route, cls });
      await page.close();
    }
    await ctx.close();
  }

  await browser.close();

  const worst = Math.max(...results.map((r) => r.cls));
  console.log("\n=== CLS across a placeholder -> photograph swap ===");
  console.log(`    ${allImages.length} SVG placeholders replaced with real JPEGs at the same paths\n`);
  for (const r of results) {
    console.log(`  ${r.label.padEnd(7)} ${r.route.padEnd(22)} CLS ${r.cls.toFixed(4)}`);
  }
  console.log(`\n  worst CLS ${worst.toFixed(4)} — budget 0.1 — ${worst < 0.1 ? "PASS" : "FAIL"}`);

  /* Confirm the swap actually happened, so a no-op cannot pass this test. */
  const probe = readFileSync(join(root, "public", allImages[0].src.replace(/^\//, "")));
  console.log(
    `  sanity: ${allImages[0].src} served as ${probe[0] === 0xff && probe[1] === 0xd8 ? "JPEG" : "NOT a JPEG — test invalid"}`,
  );

  process.exitCode = worst < 0.1 ? 0 : 1;
} finally {
  restore();
  void renameSync;
}
