import { ManagedAvatar } from "@/components/managed-image";
import { directorImage } from "@/content/images";
import Link from "next/link";

import { site } from "@/content/site.config";
import { formatTourDate, slotLabel } from "@/lib/tour-schema";
import { Check } from "./icons";

/**
 * The confirmation. Written with the same care as the hero, because this is
 * where trust is actually won or lost.
 *
 * It names the day, the slot and the person who will reply, and tells her how
 * to change it. Never "Thanks, we'll be in touch."
 *
 * The form renders it in place once the fields validate. Nothing is sent
 * anywhere (still-Eto/ertukara#59).
 */
export function TourConfirmation({
  name,
  tourDate,
  tourSlot,
}: {
  name: string;
  tourDate: string;
  tourSlot: string;
}) {
  const firstName = name.trim().split(/\s+/)[0] || "there";

  return (
    <div className="card p-6 lg:p-8" role="status">
      <span className="inline-flex h-11 w-11 items-center justify-center rounded-full bg-good-bg text-good">
        <Check className="h-6 w-6" />
      </span>

      <h2 className="mt-5 text-[1.5rem] leading-tight lg:text-[1.875rem]">
        You&rsquo;re on {site.director.firstName}&rsquo;s list, {firstName}.
      </h2>

      <p className="mt-4 text-[1.0625rem] leading-relaxed">
        You asked for{" "}
        <strong className="font-semibold">
          {formatTourDate(tourDate)}, {tourSlot === "morning" ? "morning" : "afternoon"}
        </strong>{" "}
        &mdash; {slotLabel(tourSlot)}.
      </p>

      <div className="mt-6 flex items-start gap-4 rounded-[10px] bg-brand-tint p-4">
        <ManagedAvatar image={directorImage} size={56} />
        <p className="text-[0.9375rem] leading-relaxed">
          <strong className="font-semibold">{site.director.name}</strong>, {site.director.role} &mdash;{" "}
          {/* Explicit `{" "}` — see the note on /staff. This one shipped as
              "12years here" in the message a parent reads immediately after
              handing over their phone number. */}
          {site.director.tenureYears}{" "}
          years here &mdash; will email you within one business day to confirm the exact time. She
          writes those herself.
        </p>
      </div>

      <div className="mt-7 border-t border-line pt-5 text-[0.9375rem] leading-relaxed text-muted">
        <p className="font-semibold text-ink">Need to move it or cancel?</p>
        <p className="mt-1">
          Reply to {site.director.firstName}&rsquo;s email, or call{" "}
          <a href={site.phone.href} className="font-semibold text-brand underline underline-offset-4">
            {site.phone.display}
          </a>{" "}
          any weekday between {site.hours.short}. There is nothing to cancel formally and no
          deposit &mdash; a tour costs you nothing but the 45 minutes.
        </p>
      </div>

      <Link
        href="/"
        className="mt-7 inline-flex min-h-[48px] items-center font-semibold text-brand underline underline-offset-4"
      >
        Back to {site.name}
      </Link>
    </div>
  );
}
