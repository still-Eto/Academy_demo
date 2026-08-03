/**
 * Dev-only horizontal-overflow detector.
 *
 * Logs the exact element that is wider than the viewport, which is the only
 * way to fix "no horizontal scroll at 320px" without guessing.
 *
 * Loaded through a dynamic import that is unreachable in a production build
 * (see components/client-bits.tsx), so none of this reaches a visitor.
 */
export function startOverflowDetector() {
  const check = () => {
    const limit = document.documentElement.clientWidth;
    const offenders: { el: Element; right: number }[] = [];

    document.querySelectorAll<HTMLElement>("body *").forEach((el) => {
      const rect = el.getBoundingClientRect();
      if (rect.width === 0 && rect.height === 0) return;
      if (rect.right > limit + 1 || rect.left < -1) {
        offenders.push({ el, right: Math.round(rect.right) });
      }
    });

    if (offenders.length === 0) return;

    // Only the outermost offenders matter — children inherit the problem.
    const outermost = offenders.filter(
      ({ el }) => !offenders.some((o) => o.el !== el && o.el.contains(el)),
    );

    console.warn(
      `[overflow] viewport ${limit}px — ${outermost.length} element(s) exceed it:`,
      outermost.map(({ el, right }) => ({
        tag: el.tagName.toLowerCase(),
        class: String(el.className),
        right,
      })),
    );
  };

  const id = window.setTimeout(check, 400);
  window.addEventListener("resize", check);

  return () => {
    window.clearTimeout(id);
    window.removeEventListener("resize", check);
  };
}
