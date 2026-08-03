/**
 * Static half of the Section 14 verification.
 *
 *   node scripts/verify.mjs
 *
 * Contrast is measured, not assumed. Banned phrases, British spellings and
 * external image hosts are grepped and the actual output is printed. Ratios
 * are compared against the Illinois minimum arithmetically.
 *
 * The browser half — folds, tap targets, keyboard, no-JS, bundle size — is in
 * scripts/browser-checks.mjs.
 */

import { readdirSync, readFileSync, statSync } from "node:fs";
import { extname, join, relative } from "node:path";
import { dirname } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const results = [];
const pass = (id, label, detail) => results.push({ id, label, ok: true, detail });
const fail = (id, label, detail) => results.push({ id, label, ok: false, detail });

/* ------------------------------------------------------------------ files */
const SOURCE_DIRS = ["app", "components", "content", "lib"];
const SOURCE_EXT = new Set([".ts", ".tsx", ".css"]);

function walk(dir, acc = []) {
  for (const entry of readdirSync(dir)) {
    const full = join(dir, entry);
    if (statSync(full).isDirectory()) {
      if (entry === "node_modules" || entry === ".next") continue;
      walk(full, acc);
    } else if (SOURCE_EXT.has(extname(entry))) {
      acc.push(full);
    }
  }
  return acc;
}

/** The room name / age-range pairing, imported rather than regex-parsed. */
const { roomNames } = await import("../content/rooms.ts");

const sourceFiles = SOURCE_DIRS.flatMap((d) => walk(join(root, d)));
const sources = sourceFiles.map((f) => ({ path: relative(root, f), text: readFileSync(f, "utf8") }));

/** Strip // and /* *\/ comments so a note to myself never trips a copy check. */
const stripComments = (text) =>
  text.replace(/\/\*[\s\S]*?\*\//g, " ").replace(/^\s*\/\/.*$/gm, " ");

const prose = sources.map((s) => ({ ...s, text: stripComments(s.text) }));

function grepAll(pattern, corpus = prose) {
  const hits = [];
  for (const file of corpus) {
    const lines = file.text.split("\n");
    lines.forEach((line, i) => {
      if (pattern.test(line)) hits.push(`${file.path}:${i + 1}: ${line.trim().slice(0, 120)}`);
      pattern.lastIndex = 0;
    });
  }
  return hits;
}

/* -------------------------------------------------------------- contrast */
const srgb = (hex) => {
  const h = hex.replace("#", "");
  return [0, 2, 4].map((i) => parseInt(h.slice(i, i + 2), 16) / 255);
};

const luminance = (hex) => {
  const [r, g, b] = srgb(hex).map((c) => (c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4));
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
};

const contrast = (a, b) => {
  const [l1, l2] = [luminance(a), luminance(b)].sort((x, y) => y - x);
  return (l1 + 0.05) / (l2 + 0.05);
};

const round = (n) => Math.round(n * 100) / 100;

/* --------------------------------------------------- read the brand tokens */
const configText = readFileSync(join(root, "content", "site.config.ts"), "utf8");
const token = (key) => {
  const m = configText.match(new RegExp(`\\b${key}:\\s*"(#[0-9A-Fa-f]{6})"`));
  if (!m) throw new Error(`brand token ${key} not found in site.config.ts`);
  return m[1];
};

const brand = {
  primary: token("primary"),
  primaryDark: token("primaryDark"),
  primaryTint: token("primaryTint"),
  accent: token("accent"),
  accentDark: token("accentDark"),
  onAccent: token("onAccent"),
  onPrimary: token("onPrimary"),
  bg: token("bg"),
  surface: token("surface"),
  ink: token("ink"),
  inkMuted: token("inkMuted"),
  line: token("line"),
  statusGood: token("statusGood"),
  statusGoodBg: token("statusGoodBg"),
  statusWait: token("statusWait"),
  statusWaitBg: token("statusWaitBg"),
  ground: token("ground"),
  deep: token("deep"),
  onGround: token("onGround"),
  brass: token("brass"),
  brassDark: token("brassDark"),
  sand: token("sand"),
};

/* ------------------------------------------------------- read the programs */
const programsText = readFileSync(join(root, "content", "programs.ts"), "utf8");
const blocks = programsText.split(/\n  \{\n/).slice(1);

const rooms = blocks
  .map((block) => {
    const get = (key, quoted = true) => {
      const re = quoted
        ? new RegExp(`\\b${key}:\\s*"([^"]+)"`)
        : new RegExp(`\\b${key}:\\s*(\\d+)`);
      const m = block.match(re);
      return m ? m[1] : null;
    };
    const slug = get("slug");
    /* label and ages are no longer literals in this file — they come from
       content/rooms.ts, which is the one place the pairing is defined.
       Read them from there rather than from a regex over programs.ts. */
    const named = roomNames[slug] ?? { label: null, ages: null };
    return {
      slug,
      label: named.label,
      ages: named.ages,
      ratio: get("ratio"),
      stateRatio: get("stateRatio"),
      classSize: Number(get("classSize", false)),
      stateMaxGroup: Number(get("stateMaxGroup", false)),
      rate5: Number(get("rate5", false)),
      rate3: Number(get("rate3", false)),
    };
  })
  .filter((r) => r.slug && r.ratio);

/* ======================================================================= */
/* 14 — CTA label against the accent fill                                  */
/* ======================================================================= */
{
  const ctaRatio = contrast(brand.onAccent, brand.accent);
  const edgeRatio = contrast(brand.accent, brand.bg);
  const detail = [
    `CTA label ${brand.onAccent} on accent fill ${brand.accent} = ${round(ctaRatio)}:1 (need 4.5:1)`,
    `accent edge ${brand.accent} against page ${brand.bg} = ${round(edgeRatio)}:1 (need 3:1)`,
  ].join("\n      ");

  if (ctaRatio >= 4.5 && edgeRatio >= 3) pass(14, "CTA contrast", detail);
  else fail(14, "CTA contrast", detail);
}

/* ======================================================================= */
/* Contrast across the rest of the palette (feeds item 12, Accessibility)  */
/* ======================================================================= */
{
  const pairs = [
    ["body ink on page", brand.ink, brand.bg, 4.5],
    ["body ink on card", brand.ink, brand.surface, 4.5],
    ["muted text on page", brand.inkMuted, brand.bg, 4.5],
    ["muted text on card", brand.inkMuted, brand.surface, 4.5],
    ["muted text on tint", brand.inkMuted, brand.primaryTint, 4.5],
    ["brand link on page", brand.primary, brand.bg, 4.5],
    ["brand link on tint", brand.primary, brand.primaryTint, 4.5],
    ["page text on brand footer", brand.bg, brand.primary, 4.5],
    ["primary fill label", brand.onPrimary, brand.primary, 4.5],
    ["accent hover fill label", brand.onAccent, brand.accentDark, 4.5],
    ["status good on its chip", brand.statusGood, brand.statusGoodBg, 4.5],
    ["status wait on its chip", brand.statusWait, brand.statusWaitBg, 4.5],
    ["status good on page", brand.statusGood, brand.bg, 4.5],
    ["status wait on page", brand.statusWait, brand.bg, 4.5],
    ["focus ring on page", brand.accent, brand.bg, 3],
    ["focus ring on brand", brand.bg, brand.primary, 3],

    /* The dark ground introduced by the art direction. Every one of these is a
       pair that now actually appears on the page: the openings block and the
       location band are `ground`, the testimonials are `deep`, and every dark
       section carries a brass eyebrow and a brass rule. */
    ["body text on ground", brand.onGround, brand.ground, 4.5],
    ["body text on deep", brand.onGround, brand.deep, 4.5],
    ["brass eyebrow on ground", brand.brass, brand.ground, 4.5],
    ["brass eyebrow on deep", brand.brass, brand.deep, 4.5],
    ["brass eyebrow on page", brand.brassDark, brand.bg, 4.5],
    ["brass eyebrow on card", brand.brassDark, brand.surface, 4.5],
    /* Ornament carries no text, so 3:1 non-text is the bar it has to clear. */
    ["brass rule on ground", brand.brass, brand.ground, 3],
    ["brass rule on page", brand.brassDark, brand.bg, 3],
    /* The CTA keeps its own label contrast on the dark sections, and the focus
       ring has to stay visible over `ground` now that buttons sit on it. */
    ["primary CTA label on ground", brand.onAccent, brand.accent, 4.5],
    ["focus ring on ground", brand.bg, brand.ground, 3],
    ["focus ring on deep", brand.bg, brand.deep, 3],

    /* The warm light ground. Every pair that actually appears on it. */
    ["body ink on sand", brand.ink, brand.sand, 4.5],
    ["muted text on sand", brand.inkMuted, brand.sand, 4.5],
    ["brand link on sand", brand.primary, brand.sand, 4.5],
    ["brass eyebrow on sand", brand.brassDark, brand.sand, 4.5],
    ["accent edge on sand", brand.accent, brand.sand, 3],
  ];

  const rows = pairs.map(([name, fg, bg, need]) => {
    const r = contrast(fg, bg);
    return { name, r: round(r), need, ok: r >= need };
  });

  const bad = rows.filter((r) => !r.ok);
  const detail = rows.map((r) => `${r.ok ? "ok " : "FAIL"} ${r.name}: ${r.r}:1 (need ${r.need}:1)`).join("\n      ");

  if (bad.length === 0) pass("14b", "Palette contrast, all pairs", detail);
  else fail("14b", "Palette contrast, all pairs", detail);
}

/* ======================================================================= */
/* 18 — every ratio strictly better than the Illinois minimum              */
/* ======================================================================= */
{
  const parse = (r) => Number(r.split(":")[1]);
  const rows = rooms.map((room) => {
    const ours = parse(room.ratio);
    const state = parse(room.stateRatio);
    return {
      label: room.label,
      ages: room.ages,
      line: `${room.label} (${room.ages}): ours ${room.ratio} vs Illinois ${room.stateRatio}`,
      ok: ours < state,
      sizeOk: room.classSize <= room.stateMaxGroup,
      sizeLine: `group ${room.classSize} vs Illinois cap ${room.stateMaxGroup}`,
    };
  });

  const bad = rows.filter((r) => !r.ok || !r.sizeOk);
  const detail = rows.map((r) => `${r.ok && r.sizeOk ? "ok " : "FAIL"} ${r.line}, ${r.sizeLine}`).join("\n      ");

  if (rooms.length !== 6) fail(18, "Ratios beat the state minimum", `expected 6 rooms, parsed ${rooms.length}`);
  else if (bad.length === 0) pass(18, "Ratios beat the state minimum", detail);
  else fail(18, "Ratios beat the state minimum", detail);
}

/* ======================================================================= */
/* 15 — monthly equivalents reconcile with weekly × 52 ÷ 12                 */
/* ======================================================================= */
{
  const tuitionText = readFileSync(join(root, "content", "tuition.ts"), "utf8");
  const usesFormula = /Math\.round\(\(weekly \* 52\) \/ 12\)/.test(tuitionText);
  const hardCodedMonthly = /monthly[53]:\s*\d+/.test(tuitionText);

  const worked = rooms
    .map((r) => `${r.label}: $${r.rate5}/wk -> $${Math.round((r.rate5 * 52) / 12)}/mo, $${r.rate3}/wk -> $${Math.round((r.rate3 * 52) / 12)}/mo`)
    .join("\n      ");

  const detail = `monthly equivalents are computed, never typed: ${usesFormula && !hardCodedMonthly}\n      ${worked}`;
  if (usesFormula && !hardCodedMonthly) pass("15a", "Tuition arithmetic reconciles", detail);
  else fail("15a", "Tuition arithmetic reconciles", detail);
}

/* ======================================================================= */
/* 15 — capacity reconciles                                                */
/* ======================================================================= */
{
  const day = rooms.filter((r) => r.slug !== "after-school");
  const sum = day.reduce((n, r) => n + r.classSize, 0);
  const declared = Number(configText.match(/capacityDay:\s*(\d+)/)?.[1]);
  const afterSchool = rooms.find((r) => r.slug === "after-school")?.classSize;
  const declaredAfter = Number(configText.match(/capacityAfterSchool:\s*(\d+)/)?.[1]);

  const detail = `${day.map((r) => r.classSize).join(" + ")} = ${sum}, licensed capacity declared ${declared}; after-school ${afterSchool} vs declared ${declaredAfter}`;
  if (sum === declared && afterSchool === declaredAfter) pass("15b", "Capacity reconciles", detail);
  else fail("15b", "Capacity reconciles", detail);
}

/* ======================================================================= */
/* 16 — no banned phrase from Section 10                                   */
/* ======================================================================= */
{
  const banned = [
    "nurturing environment",
    "where every child can shine",
    "where every child can thrive",
    "where every child can grow",
    "second family",
    "learning through play",
    "state-of-the-art",
    "passionate team",
    "holistic",
    "unlock their potential",
    "we believe every child is unique",
    "journey",
    "peace of mind",
    "home away from home",
  ];

  const output = [];
  let found = 0;
  for (const phrase of banned) {
    const re = new RegExp(phrase.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "i");
    const hits = grepAll(re);
    output.push(`grep -ri "${phrase}"  ->  ${hits.length === 0 ? "no matches" : hits.join(" | ")}`);
    found += hits.length;
  }

  if (found === 0) pass(16, "No banned phrases", output.join("\n      "));
  else fail(16, "No banned phrases", output.join("\n      "));
}

/* ======================================================================= */
/* 19 — US English only                                                    */
/* ======================================================================= */
{
  const british = ["centre", "colour", "licence", "authorised", "organis", "programme", "behaviour", "favourite", "enrolment", "practise"];
  const output = [];
  let found = 0;
  for (const word of british) {
    const hits = grepAll(new RegExp(word, "i"));
    output.push(`grep -ri "${word}"  ->  ${hits.length === 0 ? "no matches" : hits.join(" | ")}`);
    found += hits.length;
  }

  if (found === 0) pass(19, "US English throughout", output.join("\n      "));
  else fail(19, "US English throughout", output.join("\n      "));
}

/* ======================================================================= */
/* 20 — no external image host anywhere in source                          */
/* ======================================================================= */
{
  const hosts = ["unsplash", "pexels", "pixabay", "cloudinary", "imgix", "gravatar"];
  const output = [];
  let found = 0;

  for (const host of hosts) {
    const hits = grepAll(new RegExp(host, "i"), sources);
    output.push(`grep -ri "${host}"  ->  ${hits.length === 0 ? "no matches" : hits.join(" | ")}`);
    found += hits.length;
  }

  const remoteSrc = grepAll(/(src|poster)\s*[:=]\s*["'{]?\s*["'`]?https?:\/\//i, sources);
  output.push(`grep -riE '(src|poster)=("|\\{)https?://'  ->  ${remoteSrc.length === 0 ? "no matches" : remoteSrc.join(" | ")}`);
  found += remoteSrc.length;

  if (found === 0) pass("20a", "No external image hosts in source", output.join("\n      "));
  else fail("20a", "No external image hosts in source", output.join("\n      "));
}

/* ======================================================================= */
/* 17 — nothing brand-specific is hard-coded outside site.config.ts        */
/* ======================================================================= */
{
  const outside = sources.filter((s) => s.path.replace(/\\/g, "/") !== "content/site.config.ts");

  const hexes = [];
  for (const file of outside) {
    // Ignore hex inside comments, and the SVG-generation script is separate.
    const text = stripComments(file.text);
    const matches = text.match(/#[0-9A-Fa-f]{6}\b/g);
    if (matches) hexes.push(`${file.path}: ${[...new Set(matches)].join(", ")}`);
  }

  const name = configText.match(/shortName:\s*"([^"]+)"/)[1];
  const phoneDigits = configText.match(/href:\s*"tel:\+?(\d+)"/)[1];
  const licenseNo = configText.match(/number:\s*"([^"]+)"/)[1];

  const nameHits = grepAll(new RegExp(`\\b${name}\\b`), outside.map((s) => ({ ...s, text: stripComments(s.text) })));
  const phoneHits = grepAll(new RegExp(phoneDigits.slice(-10).replace(/(\d{3})(\d{3})(\d{4})/, "\\(?$1\\)?[ -]?$2-?$3")), outside);
  const licenseHits = grepAll(new RegExp(licenseNo.replace(/[-]/g, "\\-")), outside);

  const detail = [
    `hard-coded hex outside site.config.ts: ${hexes.length === 0 ? "none" : "\n        " + hexes.join("\n        ")}`,
    `literal "${name}" outside site.config.ts: ${nameHits.length === 0 ? "none" : "\n        " + nameHits.join("\n        ")}`,
    `literal phone outside site.config.ts: ${phoneHits.length === 0 ? "none" : "\n        " + phoneHits.join("\n        ")}`,
    `literal license number outside site.config.ts: ${licenseHits.length === 0 ? "none" : "\n        " + licenseHits.join("\n        ")}`,
  ].join("\n      ");

  const total = hexes.length + nameHits.length + phoneHits.length + licenseHits.length;
  if (total === 0) pass("17a", "Re-skin switch: nothing hard-coded", detail);
  else fail("17a", "Re-skin switch: nothing hard-coded", detail);
}

/* ======================================================================= */
/* House rule — a room name never appears without its age range            */
/* ======================================================================= */
{
  /*
    Scans every single-line string literal — "…", '…' or `…` — for a room name
    and requires an age range inside the same literal.

    Three exemptions, each for a stated reason:

      content/rooms.ts          — it IS the pairing. Six labels, six age ranges,
                                  structurally bound, asserted by R0 above.
      programs.ts `intro:`      — room-page prose. `intro` renders in exactly
                                  one place, app/(site)/programs/[slug], directly
                                  under an <h1> that reads "<label> — <ages>".
      the room detail page      — same <h1>, same reason.

    Everything else is checked, including the rest of content/programs.ts and
    all of content/images.ts, both of which now build their room prose from
    rooms.ts rather than repeating the names. Alt text is covered: a screen
    reader hears "The Acorn Room, 6 weeks – 15 months, showing the low window
    bench…" because content/images.ts interpolates `named(slug)`.
  */
  const AGES = /\d+\s*(weeks?|months?|years?)|\d+\s*[–-]\s*\d+\s*(weeks?|months?|years?)|\$\{[^}]*ages[^}]*\}|\{[a-z]+\.ages\}/i;
  const EXEMPT = ["content/rooms.ts", "app/(site)/programs/[slug]/page.tsx"];

  /* The exemption is only safe if rooms.ts really does pair every name with a
     range, so that is checked directly rather than assumed. */
  const unpaired = Object.entries(roomNames).filter(
    ([, v]) => !v.label?.trim() || !AGES.test(v.ages ?? ""),
  );
  if (unpaired.length > 0) {
    fail(
      "R0",
      "content/rooms.ts pairs every room name with an age range",
      unpaired.map(([k]) => k).join(", "),
    );
  } else {
    pass(
      "R0",
      "content/rooms.ts pairs every room name with an age range",
      Object.entries(roomNames)
        .map(([k, v]) => `${k}: ${v.label} · ${v.ages}`)
        .join("; "),
    );
  }

  const bad = [];
  for (const file of prose) {
    const rel = file.path.replace(/\\/g, "/");
    if (EXEMPT.includes(rel)) continue;

    /* The room-page intro, exempted above by the <h1> directly over it.
       Prettier puts a long value on its own line, so the key and the string
       are usually two lines apart — hence the carried flag. */
    let inIntro = false;

    file.text.split("\n").forEach((line, i) => {
      if (rel === "content/programs.ts") {
        if (/^\s*intro:/.test(line)) inIntro = true;
        const wasIntro = inIntro;
        if (inIntro && /["'`],\s*$/.test(line)) inIntro = false;
        if (wasIntro) return;
      }
      const literals = line.match(/"[^"\n]*"|'[^'\n]*'|`[^`\n]*`/g) ?? [];
      for (const literal of literals) {
        for (const room of rooms) {
          const shortName = room.label.replace(/ (Room|Club)$/, "");
          const re = new RegExp(`\\b${shortName} (Room|Club)\\b`);
          if (!re.test(literal)) continue;
          if (!AGES.test(literal)) bad.push(`${file.path}:${i + 1}: ${literal.slice(0, 110)}`);
        }
      }
    });
  }

  if (bad.length === 0)
    pass("R1", "Room names always carry an age range", "no bare room name found in any string literal");
  else fail("R1", "Room names always carry an age range", bad.join("\n      "));
}

/* ======================================================================= */
/* M1–M4 — the image manifest is the single source for every image          */
/* ======================================================================= */
{
  const { allImages, lcpImages } = await import("./manifest.mjs");

  /* M1 — nothing outside content/images.ts names a file under /public/img. */
  const stray = grepAll(
    /["'`]\/img\//,
    sources.filter((s) => s.path.replace(/\\/g, "/") !== "content/images.ts"),
  );
  if (stray.length === 0) {
    pass(
      "M1",
      "Every image path lives in content/images.ts and nowhere else",
      `grep -r '"/img/' over app, components, content and lib, excluding the manifest -> no matches. ${allImages.length} images, all declared once.`,
    );
  } else {
    fail("M1", "Every image path lives in content/images.ts and nowhere else", stray.join("\n      "));
  }

  /* M2 — exactly one LCP image, and `priority` appears exactly where it should. */
  const priorityHits = grepAll(/\bpriority\b/, prose.filter((s) => /\.tsx$/.test(s.path)));
  const lcpOk = lcpImages.length === 1 && lcpImages[0].id === "hero";
  const priorityOk = priorityHits.every((h) =>
    /components\/(hero-media|managed-image)\.tsx/.test(h.replace(/\\/g, "/")),
  );
  const detail = [
    `entries carrying lcp: true -> ${lcpImages.length} (${lcpImages.map((i) => i.id).join(", ") || "none"})`,
    `\`priority\` appears in: ${priorityHits.map((h) => h.split(":")[0]).filter((v, i, a) => a.indexOf(v) === i).join(", ") || "nowhere"}`,
    "managed-image.tsx derives it from the manifest (image.lcp === true); hero-media.tsx is the hero itself. Nothing else may set it.",
  ].join("\n      ");
  if (lcpOk && priorityOk) pass("M2", "Exactly one LCP image, and only it gets `priority`", detail);
  else fail("M2", "Exactly one LCP image, and only it gets `priority`", detail);

  /*
    M3 — every declared file exists on disk.

    `src` is optional: a portrait slot with no photograph renders an initials
    monogram and wants no stand-in file at all. So the check is over the entries
    that DO declare one. It is still the check that matters — it catches a
    manifest path that has been renamed or deleted underneath the site — and it
    no longer forces a dead file to exist for every entry that never reads it.
  */
  const withSrc = allImages.filter((i) => i.src);
  const missing = withSrc.filter((i) => {
    try {
      statSync(join(root, "public", i.src.replace(/^\//, "")));
      return false;
    } catch {
      return true;
    }
  });
  if (missing.length === 0) {
    pass(
      "M3",
      "Every manifest entry resolves to a file in /public",
      `${withSrc.length} of ${allImages.length} entries declare a stand-in file, all present: ` +
        `${[...new Set(withSrc.map((i) => i.kind))].join(", ")}. ` +
        `${allImages.length - withSrc.length} portrait slots declare none by design.`,
    );
  } else {
    fail("M3", "Every manifest entry resolves to a file in /public", missing.map((i) => i.src).join(", "));
  }

  /* M4 — every entry carries the fields a photographer needs. */
  const incomplete = allImages.filter(
    (i) => !i.alt?.trim() || !i.subject?.trim() || !i.timeOfDay?.trim() || !i.width || !i.height,
  );
  if (incomplete.length === 0) {
    pass(
      "M4",
      "Every image declares alt, an aspect ratio, and a shot brief",
      `${allImages.length}/${allImages.length} complete — PHOTO-SWAP.md is generated from these fields, so the shot list cannot drift from the code`,
    );
  } else {
    fail(
      "M4",
      "Every image declares alt, subject, time of day and an aspect ratio",
      incomplete.map((i) => i.id).join(", "),
    );
  }
}

/* ------------------------------------------------------------------ print */
let failures = 0;
console.log("\n=== Static verification ===\n");
for (const r of results) {
  if (!r.ok) failures++;
  console.log(`[${r.ok ? "PASS" : "FAIL"}] ${r.id}. ${r.label}`);
  if (r.detail) console.log(`      ${r.detail}`);
  console.log("");
}
console.log(`${results.length - failures}/${results.length} static checks passed\n`);
process.exit(failures === 0 ? 0 : 1);
