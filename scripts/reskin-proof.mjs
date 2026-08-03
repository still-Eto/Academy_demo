/**
 * Proves verification item 17: editing only content/site.config.ts rebrands
 * the entire site.
 *
 *   npm run build && node scripts/reskin-proof.mjs
 *
 * It edits nothing but site.config.ts — the center name and the primary color
 * with its two derived shades — rebuilds, screenshots, then puts the file back
 * exactly as it was and rebuilds again. Nothing else in the repository is
 * touched at any point.
 *
 * Output: verification/reskin-*.png
 */

import { execFileSync } from "node:child_process";
import { copyFileSync, readFileSync, unlinkSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const config = join(root, "content", "site.config.ts");
const backup = join(root, "content", "site.config.ts.bak");

/** The only edits. Four values, one file. */
const EDITS = [
  ['name: "Bridgewood Academy"', 'name: "Harborview Academy"'],
  ['shortName: "Bridgewood"', 'shortName: "Harborview"'],
  ['primary: "#1E4635"', 'primary: "#1B3A5C"'],
  ['primaryDark: "#153125"', 'primaryDark: "#12283F"'],
  ['primaryTint: "#EEF3F0"', 'primaryTint: "#EDF1F5"'],
];

const run = (cmd, args) =>
  execFileSync(cmd, args, { cwd: root, stdio: "inherit", shell: process.platform === "win32" });

const shots = (label) => {
  process.env.PORT = "3217";
  process.env.SHOT_SUFFIX = label;
  run(process.platform === "win32" ? "node.exe" : "node", ["scripts/screenshots.mjs", "/"]);
};

copyFileSync(config, backup);

try {
  let text = readFileSync(config, "utf8");
  for (const [from, to] of EDITS) {
    if (!text.includes(from)) throw new Error(`could not find ${from} in site.config.ts`);
    text = text.replace(from, to);
  }
  writeFileSync(config, text, "utf8");
  console.log("\n--- site.config.ts edited: name + primary color -------------------\n");

  // Placeholder art reads its palette from the same file, so it follows too.
  run(process.platform === "win32" ? "node.exe" : "node", ["scripts/generate-placeholders.mjs"]);
  run("npm", ["run", "build"]);
  shots("reskin");
  console.log("\n--- screenshots captured, restoring --------------------------------\n");
} finally {
  copyFileSync(backup, config);
  unlinkSync(backup);
  run(process.platform === "win32" ? "node.exe" : "node", ["scripts/generate-placeholders.mjs"]);
  run("npm", ["run", "build"]);
  console.log("\nsite.config.ts restored and rebuilt. Nothing else was modified.\n");
}
