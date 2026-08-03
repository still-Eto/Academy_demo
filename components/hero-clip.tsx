"use client";

import { useEffect, useState } from "react";

/**
 * The real mobile data guard for the hero clip.
 *
 * The clip mounts only when all three are true:
 *   - the viewport is at least 768px wide;
 *   - the connection has not asked to save data;
 *   - the visitor has not asked for reduced motion.
 *
 * preload="none" on top of that, so nothing is fetched until it mounts.
 * Rendered only when a clip is actually configured in site.config.ts.
 */
export function HeroClip({ src, poster }: { src: string; poster: string }) {
  const [play, setPlay] = useState(false);

  useEffect(() => {
    const wide = window.matchMedia("(min-width: 768px)");
    const stillness = window.matchMedia("(prefers-reduced-motion: reduce)");

    const decide = () => {
      const connection = (navigator as Navigator & { connection?: { saveData?: boolean } }).connection;
      setPlay(wide.matches && !stillness.matches && connection?.saveData !== true);
    };

    decide();
    wide.addEventListener("change", decide);
    stillness.addEventListener("change", decide);
    return () => {
      wide.removeEventListener("change", decide);
      stillness.removeEventListener("change", decide);
    };
  }, []);

  if (!play) return null;

  return (
    <video
      src={src}
      poster={poster}
      muted
      playsInline
      loop
      autoPlay
      preload="none"
      aria-hidden="true"
      className="absolute inset-0 h-full w-full object-cover"
    />
  );
}
