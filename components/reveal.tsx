import type { ReactNode } from "react";

/**
 * The only motion on the site: fade and rise, 12px, 300ms, ease-out, once.
 *
 * This is a *server* component — it just stamps `data-reveal` on a wrapper.
 * One small client component (RevealObserver, mounted once per layout) runs a
 * single IntersectionObserver over every marked element, so using Reveal
 * twenty times on a page costs no extra client JavaScript.
 *
 * The hidden state is opt-in: it applies only under `.js-reveal`, which the
 * inline script in app/layout.tsx puts on <html> when JavaScript runs and
 * motion is allowed. The server-rendered HTML is always fully opaque, so this
 * can only ever enhance content — it can never hide it.
 *
 * Never wrap the hero or the openings block in this. They are the two things a
 * prospect looks at first and they must be instant at every width, including a
 * 2560px monitor where both are inside the first viewport.
 */
export function Reveal({
  children,
  className,
  delay = 0,
}: {
  children: ReactNode;
  className?: string;
  /** Stagger, in ms. Keep it small — nothing should feel choreographed. */
  delay?: number;
}) {
  return (
    <div
      data-reveal=""
      className={className}
      style={delay ? { transitionDelay: `${delay}ms` } : undefined}
    >
      {children}
    </div>
  );
}
