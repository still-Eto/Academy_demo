/**
 * Grades the source photography into what the site actually serves.
 *
 *     npm run photos:build
 *
 * Reads content/images.ts — the same manifest the site renders from — and for
 * every entry carrying `photo`, writes graded AVIF, WebP and JPEG at each
 * declared width, cropped to that slot's exact declared aspect ratio.
 *
 * WHY GRADE AT ALL. Six unrelated stock photographs from different shoots is
 * the clearest tell of a template site; a director who has seen a hundred of
 * these recognises it on sight. The fix is not a CSS filter — that costs paint
 * time on every view and cannot correct white balance. It is a one-time pass
 * here, committed to disk.
 *
 * THE GRADE, in order:
 *   1. Crop to the slot ratio, anchored on the busiest region (usually faces).
 *   2. Warm white balance + gentle contrast, as one per-channel linear.
 *      Biased warm to sit against the #FAF8F4 page rather than fight it.
 *   3. Saturation to 0.92 — nothing shouts.
 *   4. Shadow lift. A second linear, this one a<1 and b>0, which raises the
 *      black point a few levels and leaves white where it is. Without it the
 *      contrast pivot in step 2 closes the shadows up, and closed shadows on a
 *      dark ground read as a printing fault rather than as depth.
 *   5. Exposure match. Each image's mean luminance is measured and pulled
 *      toward the target for ITS TONE CLASS, so no frame reads brighter or
 *      flatter than the ones beside it. Measured per image, not guessed.
 *
 * TWO TARGETS, NOT ONE. `tone` on a manifest entry says which set an image
 * belongs to — see the note on `Photo["tone"]` in content/images.ts. The
 * daylight set is the rooms, the cards, the hero and the empty room. The
 * low-key set is the two bands that are dark on purpose. Matching is what makes
 * a set look like one afternoon; matching ACROSS the two sets is what would
 * make the dark ones look like a mistake.
 */

import { mkdir, readdir, rm, writeFile } from "node:fs/promises";
import { existsSync, statSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

import { allImages } from "./manifest.mjs";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const sourceDir = join(root, "public", "photos", "_source");
const outDir = join(root, "public", "photos");

/* ---------------------------------------------------------------- the grade */

/**
 * Target mean luminance per tone class, 0–255, measured AFTER the tone curve
 * and the shadow lift below.
 *
 * daylight — 148 rather than a neutral 128: these are bright, window-lit
 *   classrooms, and dragging them to mid-grey would make the set look overcast.
 *
 * low-key — 75. It was 46, and 46 was a mistake made twice over: these two
 *   frames then went UNDER scrims of 70% and 72%, so a photograph already four
 *   stops down was darkened again by the layer on top of it. The result was a
 *   day-in-the-life section and a closing band that read as near-black
 *   rectangles with something you had to be told was behind them, on a site
 *   selling childcare.
 *
 *   75 keeps them clearly the darker set — daylight is 148 — while leaving
 *   enough in them to survive a scrim. The number is set by the darker of the
 *   two: the playground comes off the tone curve at about 30 and needs x2.53 to
 *   reach 75, which is the most that frame can take before its shadows go grey.
 *   At 90 it pinned against the clamp at 63 while the other frame sat at 83 —
 *   two "matched" images a section boundary apart, drifting 20 levels. Matched
 *   at a number they can both reach beats aspirational and apart.
 *
 * What matters for "matched exposure" is that a set lands on the same number,
 * not which number it is. There are two sets, so there are two numbers.
 */
const TARGET_LUMA = { daylight: 148, "low-key": 75 };
/**
 * How far a single image may be pushed. Beyond this, grading becomes damage.
 *
 * The ceiling is 2.6 rather than 1.3 so the low-key pair can actually reach
 * their target: the playground comes off the tone curve at about 30, and 1.3
 * would leave it pinned at 39 while the other frame sat at 73 — the two
 * "matched" images a section boundary apart, a stop and a half out. A frame
 * that dark is mostly shadow, and lifting shadow is the direction that costs
 * the least.
 *
 * The floor moved to 0.70 for the opposite reason: the empty-room band comes
 * off the tone curve at 206, and 0.78 left it at 156 while the rest of the
 * daylight set sat on 148 — the one photograph on the page whose job is to be
 * unremarkable, reading eight levels brighter than everything around it.
 */
const EXPOSURE_CLAMP = [0.70, 2.6];

/**
 * The shadow lift, as a per-channel linear: `out = 0.98*in + 5`.
 *
 * Black goes to 5, white stays at 255. Applied after the contrast pivot in
 * CHANNEL, which is what it exists to partly undo — the pivot is there to give
 * the midtones some snap, and left alone it also crushes everything below about
 * level 20 to solid black. On the daylight images nobody would notice. On a
 * 88vh hero under a 70% scrim, and on a section whose whole ground is one dark
 * photograph, crushed shadows are the difference between depth and a hole.
 */
const SHADOW_LIFT = { a: 0.98, b: 5 };

/**
 * Warm white balance folded together with a gentle contrast lift, expressed as
 * one per-channel `out = a*in + b`.
 *
 * Red gains most, blue least, which is the warm shift. The negative offsets
 * are the contrast pivot — without them a gain would just lift everything and
 * wash the image out.
 */
const CHANNEL = {
  a: [1.075, 1.045, 1.008],
  b: [-7.5, -6.0, -3.5],
};

const SATURATION = 0.92;

const clamp = (v, lo, hi) => Math.min(hi, Math.max(lo, v));

/** Rec. 709 luma from sharp's per-channel means. */
const luma = (stats) => {
  const [r, g, b] = stats.channels;
  return 0.2126 * r.mean + 0.7152 * g.mean + 0.0722 * b.mean;
};

/* ------------------------------------------------------------------- build */

const slots = allImages.filter((i) => i.photo);
if (slots.length === 0) {
  console.log("No manifest entry carries `photo`. Nothing to build.");
  process.exit(0);
}

/* Clear previously generated derivatives, but never the committed sources. */
if (existsSync(outDir)) {
  for (const entry of await readdir(outDir)) {
    if (entry === "_source") continue;
    await rm(join(outDir, entry), { recursive: true, force: true });
  }
}
await mkdir(outDir, { recursive: true });

const report = [];

for (const slot of slots) {
  const src = join(sourceDir, slot.photo.source);
  if (!existsSync(src)) {
    console.error(`MISSING SOURCE ${slot.photo.source} for ${slot.id}`);
    process.exitCode = 1;
    continue;
  }

  const ratio = slot.width / slot.height;
  /* US spelling in the manifest, sharp's own spelling here. `centre` is not a
     typo and not a British spelling that escaped the US-English check — it is
     sharp's API, and scripts/ is not in that check's source tree anyway. */
  const FIXED = {
    north: "north",
    south: "south",
    west: "west",
    east: "east",
    center: "centre",
  };
  const position =
    slot.photo.crop === "entropy"
      ? sharp.strategy.entropy
      : (FIXED[slot.photo.crop] ?? sharp.strategy.attention);

  /* Measure exposure on the CROPPED frame, not the original — a portrait
     source cropped to a landscape slot can lose most of its bright sky or
     dark floor, and grading to the uncropped mean would then be wrong. */
  const widest = Math.max(...slot.photo.widths);
  const cropped = await sharp(src)
    .resize(widest, Math.round(widest / ratio), { fit: "cover", position })
    .toBuffer();

  /*
    Order matters. The tone curve and the lift both change luminance, so
    exposure has to be measured AFTER both — measuring the raw crop and then
    applying the rest put every image on the clamp floor and left a 34-point
    spread, which is not a match.

    The lift is a separate sharp() pass rather than a second .linear() on this
    one, because sharp applies operations in its own fixed pipeline order and
    not in call order; two linears in one pipeline is not two linears.
  */
  const toned = await sharp(cropped)
    .linear(CHANNEL.a, CHANNEL.b)
    .modulate({ saturation: SATURATION })
    .toBuffer();

  const lifted = await sharp(toned).linear(SHADOW_LIFT.a, SHADOW_LIFT.b).toBuffer();

  const tone = slot.photo.tone ?? "daylight";
  const target = TARGET_LUMA[tone];
  const before = luma(await sharp(lifted).stats());
  const exposure = clamp(target / before, ...EXPOSURE_CLAMP);

  const graded = await sharp(lifted).modulate({ brightness: exposure }).toBuffer();
  const after = luma(await sharp(graded).stats());

  const files = [];
  for (const w of slot.photo.widths) {
    const h = Math.round(w / ratio);
    const base = `${slot.id.replace(/\./g, "-")}-${w}`;
    const resized = sharp(graded).resize(w, h, { fit: "cover" });

    for (const [ext, opts] of [
      /* The hero is the LCP element on every breakpoint, so it is encoded harder
         than the rest. 45 is still visually clean at these sizes. */
      ["avif", { quality: slot.lcp ? 45 : 52, effort: 6 }],
      ["webp", { quality: 74, effort: 5 }],
      ["jpg", { quality: 80, mozjpeg: true, chromaSubsampling: "4:4:4" }],
    ]) {
      const buf = await resized
        .clone()
        [ext === "jpg" ? "jpeg" : ext](opts)
        .toBuffer();
      await writeFile(join(outDir, `${base}.${ext}`), buf);
      files.push({ name: `${base}.${ext}`, bytes: buf.length });
    }
  }

  report.push({
    id: slot.id,
    source: slot.photo.source,
    tone,
    ratio: `${slot.width}x${slot.height}`,
    before: before.toFixed(1),
    after: after.toFixed(1),
    exposure: exposure.toFixed(3),
    files,
  });
}

/* ------------------------------------------------------------------ report */
console.log("\n=== Graded photography ===");
console.log(
  `  targets: daylight ${TARGET_LUMA.daylight}, low-key ${TARGET_LUMA["low-key"]} · ` +
    `saturation ${SATURATION} · warm WB ${CHANNEL.a.join("/")} · ` +
    `shadow lift ${SHADOW_LIFT.a}x+${SHADOW_LIFT.b}\n`,
);
for (const r of report) {
  const total = r.files.reduce((n, f) => n + f.bytes, 0);
  console.log(
    `  ${r.id.padEnd(22)} ${r.tone.padEnd(9)} ${r.source.padEnd(38)} ${r.ratio.padEnd(10)} ` +
      `luma ${r.before} -> ${r.after} (x${r.exposure})  ${r.files.length} files, ${(total / 1024).toFixed(0)} KB`,
  );
}

/*
  The spread is reported WITHIN each tone class, because that is the number the
  claim is about. A single figure across both classes would be the difference
  between a lit classroom and a playground after sunset, which is intended.
*/
console.log("");
for (const tone of Object.keys(TARGET_LUMA)) {
  const set = report.filter((r) => r.tone === tone).map((r) => Number(r.after));
  if (set.length === 0) continue;
  const [lo, hi] = [Math.min(...set), Math.max(...set)];
  console.log(
    `  ${tone.padEnd(9)} post-grade mean luma ${lo.toFixed(1)} to ${hi.toFixed(1)} ` +
      `(spread ${(hi - lo).toFixed(1)} of 255, ${set.length} images)`,
  );
}
const allFiles = report.flatMap((r) => r.files);
console.log(
  `  ${allFiles.length} files written to public/photos, ${(allFiles.reduce((n, f) => n + f.bytes, 0) / 1024 / 1024).toFixed(2)} MB total on disk`,
);
void statSync;
