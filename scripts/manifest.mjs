/**
 * The image manifest and the brand palette, loaded straight out of the
 * TypeScript the site itself renders from. Import this from any build script
 * rather than re-declaring the list of images anywhere.
 */
import { register } from "node:module";

register("./ts-resolve.mjs", import.meta.url);

const images = await import("../content/images.ts");
const config = await import("../content/site.config.ts");
const briefs = await import("../content/photo-briefs.ts");

/* Build scripts want the shot brief alongside the slot; the site never does. */
export const allImages = images.allImages.map((i) => ({
  ...i,
  ...(briefs.shotBriefs[i.id] ?? { subject: "", timeOfDay: "" }),
}));
export const { lcpImages, img } = images;
export const { site } = config;
export const palette = site.brand;
