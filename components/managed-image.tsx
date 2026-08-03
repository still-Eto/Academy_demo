import Image from "next/image";

import { photoStem, type ManagedImage } from "@/content/images";

/**
 * The only way an image reaches the page.
 *
 * The point of this component is the container. `aspect-ratio` is set on the
 * wrapper from the manifest's intrinsic width and height, and the image fills
 * it absolutely — so the box exists at its final size before a single byte
 * arrives. A slot that is a wordless block today and a photograph tomorrow
 * occupies exactly the same space, and CLS stays at 0 across the swap.
 *
 * Two render paths, one container:
 *
 *   photo set  -> a plain <picture> over the graded AVIF/WebP/JPEG that
 *                 scripts/build-photography.mjs already wrote to disk. No
 *                 next/image here: these files are pre-sized and pre-graded,
 *                 and running them through the optimizer again would re-encode
 *                 an encode.
 *   no photo   -> the wordless SVG block, via next/image.
 *
 * `priority` is derived, never passed: only the manifest entry carrying
 * `lcp: true` gets it. `npm run verify` fails if that stops being exactly one.
 */
export function ManagedImg({
  image,
  sizes,
  className = "",
  imgClassName = "",
  /** Override the box ratio — e.g. a 16:9 crop of a 3:2 photograph on mobile. */
  ratioClassName,
  /**
   * Fill a positioned ancestor instead of occupying a ratio box of its own.
   *
   * This is how a photograph becomes a section's GROUND rather than something
   * inside it — the day timeline and the closing band both run one behind their
   * text. It is a distinct mode and not a class you can pass in, because the box
   * is `relative` in every other mode and `absolute` here: hand both to
   * `className` and the two position utilities land in the same Tailwind layer,
   * where which one wins is decided by their order in the generated stylesheet
   * rather than by the order you wrote them.
   *
   * No aspect-ratio is set in this mode. The parent owns the height, which is
   * also why it costs no CLS: the box is sized before the image resolves.
   */
  fill = false,
}: {
  image: ManagedImage;
  sizes: string;
  className?: string;
  imgClassName?: string;
  ratioClassName?: string;
  fill?: boolean;
}) {
  const box = fill
    ? `absolute inset-0 h-full w-full overflow-hidden ${className}`
    : `relative overflow-hidden ${ratioClassName ?? ""} ${className}`;
  const style =
    fill || ratioClassName ? undefined : { aspectRatio: `${image.width} / ${image.height}` };

  if (image.photo) {
    const stem = photoStem(image);
    const widths = image.photo.widths;
    const srcSet = (ext: string) => widths.map((w) => `${stem}-${w}.${ext} ${w}w`).join(", ");
    const widest = widths[widths.length - 1];

    return (
      <div className={box} style={style}>
        <picture>
          <source type="image/avif" srcSet={srcSet("avif")} sizes={sizes} />
          <source type="image/webp" srcSet={srcSet("webp")} sizes={sizes} />
          <img
            src={`${stem}-${widest}.jpg`}
            srcSet={srcSet("jpg")}
            sizes={sizes}
            alt={image.alt}
            width={image.width}
            height={image.height}
            loading={image.lcp ? "eager" : "lazy"}
            fetchPriority={image.lcp ? "high" : undefined}
            decoding={image.lcp ? "sync" : "async"}
            className={`absolute inset-0 h-full w-full object-cover ${imgClassName}`}
          />
        </picture>
      </div>
    );
  }

  /* No photograph AND no stand-in block: render nothing at all, rather than a
     broken <img>. Only the portrait slots are declared this way, and they go
     through ManagedAvatar rather than here — but the guard is what lets `src`
     be optional in the manifest, which is what let seventeen dead silhouette
     files be deleted. */
  if (!image.src) return null;

  return (
    <div className={box} style={style}>
      <Image
        src={image.src}
        alt={image.alt}
        fill
        sizes={sizes}
        priority={image.lcp === true}
        loading={image.lcp ? undefined : "lazy"}
        /* The blocks are local SVG, which the optimizer passes through
           untouched. Photographs never reach this branch. */
        unoptimized
        className={`object-cover ${imgClassName}`}
      />
    </div>
  );
}

/**
 * A round portrait at a fixed pixel size — the director beside the tour form,
 * the teacher cards on /staff and the room pages.
 *
 * IT RENDERS NOTHING WHEN THERE IS NO PHOTOGRAPH, AND THAT IS THE POINT.
 *
 * No staff photography exists. Cropping a child's face out of an activity shot
 * into a teacher portrait is obvious and damages the page it sits on, so the
 * seventeen portrait slots have always been empty — and until now they were
 * empty in the worst possible way: one generic grey silhouette, byte-identical
 * across all seventeen files, rendered seventeen times down a page headed
 * "Everyone who works at Bridgewood". Beside the real photography everywhere
 * else on the site, that does not read as a style decision. It reads as
 * seventeen images that failed to load.
 *
 * A name, a role, a credential, a tenure figure and a sentence in the person's
 * own voice is a stronger claim than a placeholder face. So the slot collapses
 * until it can be filled honestly.
 *
 * The swap is still a file copy. The day a center drops portraits into
 * `_source`, points the manifest entries at them and runs `npm run photos:build`,
 * `image.photo` becomes set and every one of these appears — no component
 * changes, which is exactly what the old version could NOT do: it rendered
 * `image.src` unconditionally, so it would have kept showing the silhouette
 * even after real portraits were graded to disk.
 */
export function ManagedAvatar({
  image,
  size,
  className = "",
  name,
}: {
  image: ManagedImage;
  /** Rendered box, in CSS pixels. */
  size: number;
  className?: string;
  name?: string;
}) {
  const photo = image.photo;
  if (!photo) {
    const displayName = name || image.alt || "";
    const initials = displayName
      .replace(/[^a-zA-Z\s]/g, "")
      .split(" ")
      .filter(Boolean)
      .map((part) => part[0])
      .slice(0, 2)
      .join("")
      .toUpperCase();

    return (
      <div
        style={{ width: size, height: size, fontSize: `${Math.max(14, Math.round(size * 0.36))}px` }}
        className={`relative shrink-0 flex items-center justify-center rounded-full bg-sand text-brand border border-brass/50 font-serif font-bold shadow-soft select-none ${className}`}
        aria-label={image.alt}
      >
        {initials || "BA"}
      </div>
    );
  }

  const stem = photoStem(image);
  const srcSet = (ext: string) =>
    photo.widths.map((w) => `${stem}-${w}.${ext} ${w}w`).join(", ");
  const widest = photo.widths[photo.widths.length - 1];

  return (
    <picture>
      <source type="image/avif" srcSet={srcSet("avif")} sizes={`${size}px`} />
      <source type="image/webp" srcSet={srcSet("webp")} sizes={`${size}px`} />
      <img
        src={`${stem}-${widest}.jpg`}
        srcSet={srcSet("jpg")}
        sizes={`${size}px`}
        alt={image.alt}
        width={image.width}
        height={image.height}
        loading="lazy"
        decoding="async"
        style={{ width: size, height: size }}
        className={`shrink-0 rounded-full object-cover ${className}`}
      />
    </picture>
  );
}
