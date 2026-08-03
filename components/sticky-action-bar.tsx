"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

import { site } from "@/content/site.config";
import { Phone } from "./icons";

/**
 * The permanently reachable primary CTA on a phone.
 *
 * Two targets: Book a Tour at roughly 65% width, and a Call button that dials.
 * 64px tall, safe-area respected, and it disappears the moment any text input
 * anywhere on the page takes focus so it can never sit on top of the keyboard.
 *
 * Hidden from `lg` up, where the sticky header carries the same CTA.
 */
export function StickyActionBar() {
  const [inputFocused, setInputFocused] = useState(false);

  useEffect(() => {
    const isTextEntry = (el: EventTarget | null) => {
      if (!(el instanceof HTMLElement)) return false;
      const tag = el.tagName;
      return (
        tag === "TEXTAREA" ||
        tag === "SELECT" ||
        (tag === "INPUT" && !["button", "submit", "reset", "checkbox", "radio"].includes((el as HTMLInputElement).type)) ||
        el.isContentEditable
      );
    };

    const onFocusIn = (e: FocusEvent) => {
      if (isTextEntry(e.target)) setInputFocused(true);
    };
    const onFocusOut = (e: FocusEvent) => {
      if (isTextEntry(e.target)) setInputFocused(false);
    };

    document.addEventListener("focusin", onFocusIn);
    document.addEventListener("focusout", onFocusOut);
    return () => {
      document.removeEventListener("focusin", onFocusIn);
      document.removeEventListener("focusout", onFocusOut);
    };
  }, []);

  if (inputFocused) return null;

  return (
    <div className="fixed inset-x-0 bottom-0 z-30 border-t border-line bg-bg/92 backdrop-blur-md lg:hidden">
      <div
        className="flex items-stretch gap-2 px-3"
        style={{ height: 64, paddingBottom: 0, marginBottom: "env(safe-area-inset-bottom, 0px)" }}
      >
        <Link
          href="/book-a-tour"
          className="btn btn-primary my-1.5 flex-[0_0_64%] px-3 text-[1.0625rem]"
        >
          Book a Tour
        </Link>
        <a
          href={site.phone.href}
          className="btn btn-secondary my-1.5 flex-1 px-3 text-[1.0625rem]"
          aria-label={`Call ${site.name} on ${site.phone.display}`}
        >
          <Phone className="h-5 w-5" />
          Call
        </a>
      </div>
    </div>
  );
}
