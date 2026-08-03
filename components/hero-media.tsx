import Image from "next/image";

import { heroImage, heroImageMobile, photoStem, type ManagedImage } from "@/content/images";
import { site } from "@/content/site.config";
import { HeroClip } from "./hero-clip";

/**
 * The hero photograph and its scrim. Everything that is not type.
 *
 * This fills its parent absolutely — the parent owns the height, which is 85vh
 * on a phone and 88vh from `lg`, and the image has no say in it. That is also
 * why there is no aspect-ratio box here any more and no CLS risk from removing
 * it: the box is sized by the viewport before any byte of image arrives, which
 * is a stronger guarantee than a ratio derived from the file.
 *
 * TWO CROPS, ONE FRAME. 88vh is a 2.4:1 band on a 1568px monitor and a 0.54:1
 * portrait on a 390px phone. A single 16:9 file `object-fit: cover`-ed into
 * both keeps the teacher on the desktop and throws her out of frame on the
 * phone. So the manifest carries `hero` (16:9) and `hero.mobile` (3:4), cropped
 * from the same exposure at build time, and the `media` attribute below picks
 * one. Exactly one is ever fetched, including by the preload.
 *
 * `priority` is still derived from the manifest rather than passed: `hero` is
 * the one entry with `lcp: true`, asserted by `npm run verify`.
 */

/** srcset for one manifest entry in one format. */
const setOf = (image: ManagedImage, ext: string) =>
  image.photo!.widths.map((w) => `${photoStem(image)}-${w}.${ext} ${w}w`).join(", ");

const widestOf = (image: ManagedImage, ext: string) =>
  `${photoStem(image)}-${image.photo!.widths[image.photo!.widths.length - 1]}.${ext}`;

/**
 * The breakpoint the two crops swap at. 768px, matching Tailwind's `md`, which
 * is also where the hero content stops being a single stacked column.
 */
const WIDE = "(min-width: 768px)";
const NARROW = "(max-width: 767.98px)";

export function HeroMedia() {
  const video = site.media.hero.video;
  const photo = heroImage.photo;

  /* Full-bleed at every width: the image IS the section. No container, no
     radius, no margin. */
  const box = "absolute inset-0 overflow-hidden bg-ground";

  if (!photo) {
    /* The wordless block, for a re-skin that has not been given photography
       yet. The scrim still runs, so the type over it is legible either way.

       `src` is optional on the manifest now (portraits declare none), so this
       branch checks for it. A hero with neither a photograph nor a block is the
       dark ground and the scrim, which is still a legible hero. */
    if (!heroImage.src) {
      return (
        <div className={box}>
          <div className="scrim-hero absolute inset-0" />
        </div>
      );
    }
    const block = heroImage.src;
    return (
      <div className={box}>
        <link rel="preload" as="image" href={block} fetchPriority="high" />
        <Image
          src={block}
          alt={heroImage.alt}
          fill
          priority
          fetchPriority="high"
          unoptimized
          sizes="100vw"
          className="object-cover"
        />
        {video && <HeroClip src={video} poster={block} />}
        <div className="scrim-hero absolute inset-0" />
      </div>
    );
  }

  return (
    <div className={box}>
      {/*
        React hoists both of these into <head>. They carry complementary media
        queries, so a phone fetches only the 3:4 crop and a monitor only the
        16:9 — and each names the same AVIF its <source> will choose, or the
        preload costs bytes instead of saving them.
      */}
      <link
        rel="preload"
        as="image"
        media={WIDE}
        href={widestOf(heroImage, "avif")}
        imageSrcSet={setOf(heroImage, "avif")}
        imageSizes="100vw"
        type="image/avif"
        fetchPriority="high"
      />
      <link
        rel="preload"
        as="image"
        media={NARROW}
        href={widestOf(heroImageMobile, "avif")}
        imageSrcSet={setOf(heroImageMobile, "avif")}
        imageSizes="100vw"
        type="image/avif"
        fetchPriority="high"
      />

      <picture>
        <source media={WIDE} type="image/avif" srcSet={setOf(heroImage, "avif")} sizes="100vw" />
        <source media={WIDE} type="image/webp" srcSet={setOf(heroImage, "webp")} sizes="100vw" />
        <source media={WIDE} type="image/jpeg" srcSet={setOf(heroImage, "jpg")} sizes="100vw" />
        <source type="image/avif" srcSet={setOf(heroImageMobile, "avif")} sizes="100vw" />
        <source type="image/webp" srcSet={setOf(heroImageMobile, "webp")} sizes="100vw" />
        <img
          src={widestOf(heroImageMobile, "jpg")}
          srcSet={setOf(heroImageMobile, "jpg")}
          sizes="100vw"
          alt={heroImage.alt}
          width={heroImageMobile.width}
          height={heroImageMobile.height}
          fetchPriority="high"
          decoding="sync"
          /*
            Biased slightly above center, and only slightly. Both crops carry
            the faces in the upper half and the hand on the page in the lower,
            and the hand is the half that argues the headline — so the pixels to
            give up when a short window forces a choice are at the top, not the
            bottom. At 50% the phone crop is most of the teacher's hair.
          */
          className="absolute inset-0 h-full w-full object-cover object-[50%_44%]"
        />
      </picture>

      {/* The clip goes UNDER the scrim, not over it. It mounts on top of the
          poster and would otherwise cover the gradient the headline depends
          on — a clip that plays and takes the type to 1.2:1 with it. */}
      {video && (
        <HeroClip src={widestOf(heroImage, "jpg")} poster={widestOf(heroImage, "jpg")} />
      )}

      {/* The scrim. Two gradients; see `.scrim-hero` in globals.css. */}
      <div className="scrim-hero absolute inset-0" />
    </div>
  );
}
