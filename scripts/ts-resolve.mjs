/**
 * Lets the build scripts import content/*.ts directly.
 *
 * Node strips TypeScript types on its own, but it will not guess at a missing
 * file extension the way a bundler does, and it does not know about the `@/`
 * alias in tsconfig.json. This resolve hook teaches it both, so the shot list
 * and the placeholder art are generated from the same manifest the site
 * renders from rather than from a second copy that can drift.
 */
import { pathToFileURL } from "node:url";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");

export function resolve(specifier, context, next) {
  if (specifier.startsWith("@/")) {
    return next(pathToFileURL(join(root, specifier.slice(2) + ".ts")).href, context);
  }
  if (/^\.{1,2}\//.test(specifier) && !/\.[cm]?[jt]sx?$/.test(specifier)) {
    return next(specifier + ".ts", context);
  }
  return next(specifier, context);
}
