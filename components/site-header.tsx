"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCallback, useEffect, useId, useRef, useState, useSyncExternalStore } from "react";

import { site } from "@/content/site.config";
import { ChevronDown, Close, Logomark, Menu } from "./icons";

/** Five links maximum, plus the CTA styled distinctly from them. */
const NAV = [
  { href: "/safety", label: "Safety" },
  { href: "/tuition", label: "Tuition" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
];

/**
 * Only the three fields the menu actually renders. Passing these in from the
 * server keeps the whole of content/programs.ts — every rhythm, outcome and
 * photograph — out of the client bundle.
 */
export type HeaderRoom = { slug: string; label: string; ages: string };

export function SiteHeader({ rooms }: { rooms: HeaderRoom[] }) {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);
  const [programsOpen, setProgramsOpen] = useState(false);

  /* ------------------------------------------------------------------------
     OVERLAY MODE

     The home page opens on a full-bleed 88vh photograph, and the nav sits on
     top of it in white with no fill of its own — then takes a solid `ground`
     background once the hero has scrolled past. Nowhere else on the site has a
     dark opening, so nowhere else overlays.

     THE NO-JAVASCRIPT PATH IS THE REASON THIS IS SHAPED THE WAY IT IS.

     A `fixed` transparent header is only readable while a dark hero is behind
     it. Without JavaScript nothing can tell it when that stops being true, and
     a permanently transparent bar in white type would land on the light
     Programs section a screen down and become invisible. So the server renders
     it `absolute` — overlaying the hero, and scrolling away with it, which is
     correct and readable with no script at all. Only once the client has taken
     over does it become `fixed` and start listening for scroll.

     Everything off the home page keeps exactly the layout it had: in flow, in
     the page background, sticky from `lg`.
     ------------------------------------------------------------------------ */
  const overlay = pathname === "/";

  /*
    "Has the client taken over yet." `useSyncExternalStore` with a server
    snapshot of `false` and a client snapshot of `true` is the supported way to
    ask that: it returns false for the server render and the hydrating render,
    then true, with no effect and no state to keep in sync. Written as
    `useEffect(() => setLifted(true))` it is a synchronous setState in an effect
    — a cascading render, and an eslint error.

    `subscribe` is a no-op because the answer never changes again.
  */
  const lifted = useSyncExternalStore(
    useCallback(() => () => {}, []),
    () => true,
    () => false,
  );

  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    if (!overlay) return;

    /* Solid from the point the hero's own plinth leaves the screen. Reading
       the hero's measured height rather than a constant keeps this correct at
       88vh, at the 640px floor, and on a rotated phone. */
    const onScroll = () => {
      const hero = document.querySelector<HTMLElement>("[data-hero]");
      const threshold = hero ? hero.offsetHeight - 96 : window.innerHeight * 0.8;
      setScrolled(window.scrollY > threshold);
    };

    /*
      The first measurement is scheduled rather than run inline. It matters on a
      reload that restores a scroll position or a back-navigation, where the
      page can arrive already past the hero and no scroll event is coming — and
      running it inline would be the same cascading setState the hook above
      exists to avoid.
    */
    const first = requestAnimationFrame(onScroll);
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      cancelAnimationFrame(first);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, [overlay]);

  /* Transparent only while the hero is genuinely behind the bar. The mobile
     menu is a full-screen panel in the page background, so the bar behind it
     has to be solid too or the logo sits on the photograph through it. */
  const transparent = overlay && !scrolled && !menuOpen;

  const menuId = useId();
  const programsId = useId();

  const menuButtonRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const programsWrapRef = useRef<HTMLDivElement>(null);
  const programsButtonRef = useRef<HTMLButtonElement>(null);

  /* Route change closes everything. Adjusted during render rather than in an
     effect, so the menu is already closed on the first paint of the new page
     instead of flashing open and then shutting. */
  const [lastPath, setLastPath] = useState(pathname);
  if (pathname !== lastPath) {
    setLastPath(pathname);
    setMenuOpen(false);
    setProgramsOpen(false);
  }

  /* ----- Programs dropdown: opens on tap, closes on tap-outside and Escape.
     No hover anywhere, because a phone has none. ----- */
  useEffect(() => {
    if (!programsOpen) return;

    const onPointerDown = (e: PointerEvent) => {
      if (!programsWrapRef.current?.contains(e.target as Node)) setProgramsOpen(false);
    };
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setProgramsOpen(false);
        programsButtonRef.current?.focus();
      }
    };

    document.addEventListener("pointerdown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("pointerdown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [programsOpen]);

  /* ----- Mobile menu: focus trapped while open, focus returned on close. ----- */
  const closeMenu = useCallback(() => {
    setMenuOpen(false);
    menuButtonRef.current?.focus();
  }, []);

  useEffect(() => {
    if (!menuOpen) return;

    const panel = panelRef.current;
    if (!panel) return;

    const focusables = () =>
      Array.from(
        panel.querySelectorAll<HTMLElement>(
          'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])',
        ),
      ).filter((el) => el.offsetParent !== null);

    focusables()[0]?.focus();

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        closeMenu();
        return;
      }
      if (e.key !== "Tab") return;

      const items = focusables();
      if (items.length === 0) return;
      const first = items[0];
      const last = items[items.length - 1];

      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };

    document.addEventListener("keydown", onKeyDown);
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = previousOverflow;
    };
  }, [menuOpen, closeMenu]);

  const isCurrent = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  /* Three layout states, one element. Off the home page nothing has changed. */
  const position = overlay
    ? lifted
      ? "fixed inset-x-0 top-0"
      : "absolute inset-x-0 top-0"
    : "relative lg:sticky lg:top-0";

  /* `on-dark` on both overlay skins, not just the solid one: the transparent
     bar sits on the hero scrim, which is every bit as dark as `ground`. It is
     what repaints the focus ring and the logomark cut-outs. */
  const skin = transparent
    ? "on-dark border-transparent bg-transparent"
    : overlay
      ? "on-dark border-white/10 bg-ground"
      : "border-line bg-bg";

  return (
    <header
      data-transparent={transparent ? "" : undefined}
      className={`z-40 border-b ${position} ${skin} ${
        /* Only the overlay header animates, and only between its two skins.
           Off the home page there is nothing to transition between. */
        overlay ? "transition-colors duration-200" : ""
      }`}
    >
      <div className="shell flex h-[60px] items-center justify-between gap-3 lg:h-[76px]">
        <Link
          href="/"
          className={`flex items-center gap-2.5 py-2 ${transparent || overlay ? "text-bg" : "text-brand"}`}
          aria-label={`${site.name} home`}
        >
          <Logomark className="h-8 w-8 lg:h-9 lg:w-9" />
          <span
            className={`font-serif text-[1.0625rem] leading-tight font-semibold lg:text-xl ${
              transparent || overlay ? "text-bg" : "text-ink"
            }`}
          >
            {site.name}
          </span>
        </Link>

        {/* ---------------- Desktop navigation ---------------- */}
        <nav aria-label="Main" className="hidden items-center gap-1 lg:flex">
          <div ref={programsWrapRef} className="relative">
            <button
              ref={programsButtonRef}
              type="button"
              aria-expanded={programsOpen}
              aria-controls={programsId}
              onClick={() => setProgramsOpen((v) => !v)}
              className={`flex min-h-[48px] items-center gap-1.5 rounded-lg px-3 font-semibold ${
                overlay
                  ? isCurrent("/programs")
                    ? "text-brass"
                    : "text-bg"
                  : isCurrent("/programs")
                    ? "text-brand"
                    : "text-ink"
              }`}
            >
              Programs
              <ChevronDown className={`h-4 w-4 transition-transform ${programsOpen ? "rotate-180" : ""}`} />
            </button>

            {programsOpen && (
              <div
                id={programsId}
                /* `on-light`: a white panel opening inside the dark overlay
                   header. See globals.css. */
                className="on-light absolute left-0 top-full z-50 mt-1 w-[22rem] rounded-[10px] border border-line bg-surface p-2 text-ink shadow-[var(--shadow-lift)]"
              >
                <Link
                  href="/programs"
                  className="flex min-h-[48px] items-center rounded-lg px-3 text-[0.9375rem] font-semibold text-brand"
                >
                  Compare all six rooms
                </Link>
                <ul className="mt-2 space-y-2 border-t border-line pt-2">
                  {rooms.map((p) => (
                    <li key={p.slug}>
                      <Link
                        href={`/programs/${p.slug}`}
                        className="flex min-h-[48px] flex-col justify-center rounded-lg px-3 py-1 text-[0.9375rem] leading-snug hover:bg-brand-tint"
                      >
                        <span className="font-semibold">{p.label}</span>
                        <span className="block text-[0.8125rem] text-muted">{p.ages}</span>
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          {NAV.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              aria-current={isCurrent(item.href) ? "page" : undefined}
              className={`flex min-h-[48px] items-center rounded-lg px-3 font-semibold ${
                isCurrent(item.href)
                  ? `underline decoration-2 underline-offset-[6px] ${overlay ? "text-brass" : "text-brand"}`
                  : overlay
                    ? "text-bg"
                    : "text-ink"
              }`}
            >
              {item.label}
            </Link>
          ))}

          <Link href="/book-a-tour" className="btn btn-primary ml-3">
            Book a Tour
          </Link>
        </nav>

        {/* ---------------- Mobile trigger ---------------- */}
        <button
          ref={menuButtonRef}
          type="button"
          onClick={() => setMenuOpen(true)}
          aria-expanded={menuOpen}
          aria-controls={menuId}
          className={`-mr-2 flex h-12 w-12 items-center justify-center rounded-lg lg:hidden ${
            overlay ? "text-bg" : "text-ink"
          }`}
        >
          <Menu />
          <span className="sr-only">Open menu</span>
        </button>
      </div>

      {/* ---------------- Mobile menu ---------------- */}
      {menuOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div
            className="absolute inset-0 bg-ink/40"
            onClick={closeMenu}
            aria-hidden="true"
          />
          <div
            ref={panelRef}
            id={menuId}
            role="dialog"
            aria-modal="true"
            aria-label="Site menu"
            className="on-light absolute inset-x-0 top-0 max-h-full overflow-y-auto bg-bg pb-8 text-ink shadow-[var(--shadow-lift)]"
          >
            <div className="shell flex h-[60px] items-center justify-between">
              <span className="font-serif text-[1.0625rem] font-semibold">{site.name}</span>
              <button
                type="button"
                onClick={closeMenu}
                className="-mr-2 flex h-12 w-12 items-center justify-center rounded-lg text-ink"
              >
                <Close />
                <span className="sr-only">Close menu</span>
              </button>
            </div>

            <nav aria-label="Main" className="shell">
              <Link
                href="/book-a-tour"
                className="btn btn-primary mb-6 w-full"
                onClick={() => setMenuOpen(false)}
              >
                Book a Tour
              </Link>

              <p className="eyebrow mb-2">Programs</p>
              <ul className="mb-2 space-y-2">
                {rooms.map((p) => (
                  <li key={p.slug}>
                    <Link
                      href={`/programs/${p.slug}`}
                      className="flex min-h-[48px] flex-col justify-center rounded-lg border border-line bg-surface px-4 py-2"
                    >
                      <span className="font-semibold leading-tight">{p.label}</span>
                      <span className="text-[0.875rem] text-muted">{p.ages}</span>
                    </Link>
                  </li>
                ))}
              </ul>
              <Link
                href="/programs"
                className="mb-6 flex min-h-[48px] items-center font-semibold text-brand underline underline-offset-4"
              >
                Compare all six rooms
              </Link>

              <ul className="space-y-2 border-t border-line pt-4">
                {[...NAV, { href: "/staff", label: "Meet the teachers" }, { href: "/faq", label: "Questions parents ask" }].map(
                  (item) => (
                    <li key={item.href}>
                      <Link
                        href={item.href}
                        aria-current={isCurrent(item.href) ? "page" : undefined}
                        className="flex min-h-[48px] items-center text-lg font-semibold"
                      >
                        {item.label}
                      </Link>
                    </li>
                  ),
                )}
              </ul>

              <a
                href={site.phone.href}
                className="mt-6 flex min-h-[48px] items-center gap-2 font-semibold text-brand"
              >
                Call {site.phone.display}
              </a>
            </nav>
          </div>
        </div>
      )}
    </header>
  );
}
