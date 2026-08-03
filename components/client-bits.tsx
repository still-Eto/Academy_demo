"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";

/**
 * The two page-level client behaviours that are not tied to a single element,
 * kept together so the site ships exactly one small extra module rather than
 * one per usage.
 */

/**
 * Reveals every [data-reveal] element once, as it comes into view.
 * One observer for the whole page, re-scanned on navigation.
 *
 * Content is never gated on this running. The hidden state only exists while
 * `js-reveal` is on <html> (see the inline script in app/layout.tsx), and every
 * path out of here ends with the element visible.
 */
export function RevealObserver() {
  const pathname = usePathname();

  useEffect(() => {
    const revealAll = () => {
      document
        .querySelectorAll<HTMLElement>("[data-reveal]:not(.is-in)")
        .forEach((el) => el.classList.add("is-in"));
    };

    /* Reduced motion, or JavaScript that failed earlier than this. Either way
       nothing is hidden, so there is nothing to reveal. */
    if (!document.documentElement.classList.contains("js-reveal")) return;

    const elements = [...document.querySelectorAll<HTMLElement>("[data-reveal]:not(.is-in)")];
    if (elements.length === 0) return;

    if (!("IntersectionObserver" in window)) {
      revealAll();
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          entry.target.classList.add("is-in");
          observer.unobserve(entry.target);
        }
      },
      { rootMargin: "0px 0px -8% 0px", threshold: 0.05 },
    );

    /*
      Anything already on screen at mount is revealed now rather than waiting
      for an intersection *change* that may never arrive — a 2560px viewport
      that fits three sections on first paint, a jump to #openings, or a
      back-navigation that paints at a restored scroll offset.
    */
    const viewport = window.innerHeight || document.documentElement.clientHeight;
    for (const el of elements) {
      const r = el.getBoundingClientRect();
      if (r.height > 0 && r.top < viewport && r.bottom > 0) el.classList.add("is-in");
      else observer.observe(el);
    }

    /* The net. The inline script carries the same 1200ms fallback for the first
       load, in case React never hydrates; this one covers every client-side
       navigation after it. The page fails visible, never invisible. */
    const net = window.setTimeout(revealAll, 1200);

    return () => {
      window.clearTimeout(net);
      observer.disconnect();
    };
  }, [pathname]);

  return null;
}

/**
 * Dev-only horizontal-overflow probe. The implementation is behind a dynamic
 * import that is unreachable in a production build, so the detector's code is
 * split into its own chunk and never fetched by a real visitor.
 */
export function DevOverflowProbe() {
  useEffect(() => {
    if (process.env.NODE_ENV !== "development") return;
    void import("./overflow-detector").then((m) => m.startOverflowDetector());
  }, []);

  return null;
}
