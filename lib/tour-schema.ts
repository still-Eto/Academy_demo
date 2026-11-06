import { z } from "zod";

import { programs } from "@/content/programs";

/**
 * One schema for the tour form. It used to be shared with app/api/tour/route.ts;
 * since 05.11.2026 the form sends nothing (still-Eto/ertukara#59), so the
 * browser is the only place it runs.
 *
 * Five fields, and only five. Everything else is asked at the tour.
 */

/* Deliberately permissive — a real parent's email should never be rejected by
   a clever regex at 9:40pm. This catches typos, not exotic addresses. */
const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

/* At least 10 digits once punctuation is stripped. */
const digitsOf = (s: string) => s.replace(/\D/g, "");

export const ageOptions = [
  { value: "expecting", label: "Not born yet" },
  ...programs.map((p) => ({
    value: p.slug,
    label: `${p.ages} · ${p.label}`,
  })),
];

export const slotOptions = [
  { value: "morning", label: "Morning", detail: "9:00–11:30am, during play" },
  { value: "afternoon", label: "Afternoon", detail: "1:00–3:00pm, during nap" },
] as const;

export const tourSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, { message: "Please tell us your name so we know who we're writing back to." })
    .max(80, { message: "That's longer than we can store. Please shorten it." }),

  phone: z
    .string()
    .trim()
    .min(1, { message: "We need a phone number so we can confirm your time." })
    .refine((v) => digitsOf(v).length >= 10, {
      message: "That doesn't look like a full phone number. Please include the area code.",
    }),

  email: z
    .string()
    .trim()
    .min(1, { message: "We need an email address to send you the confirmation." })
    .refine((v) => EMAIL.test(v), {
      message: "Please check that address. It's missing an @ or the part after the dot.",
    }),

  childAge: z
    .string()
    .min(1, { message: "Choose your child's age so we show you the right room." })
    .refine((v) => ageOptions.some((o) => o.value === v), {
      message: "Choose your child's age so we show you the right room.",
    }),

  /* Field five: the preferred tour day. One field, two controls — a native
     date input and a morning/afternoon choice. */
  tourDate: z
    .string()
    .min(1, { message: "Pick a day you could come in." })
    .refine((v) => /^\d{4}-\d{2}-\d{2}$/.test(v), {
      message: "Pick a day you could come in.",
    })
    .refine(
      (v) => {
        // Anchored to UTC noon on purpose. The client renders this form during
        // SSR and again on hydration; if the two sides disagreed about "today"
        // across a timezone boundary, React would report a mismatch and the
        // date bounds would drift. Everything date-shaped here is UTC.
        const day = new Date(`${v}T12:00:00Z`).getUTCDay();
        return day >= 1 && day <= 5;
      },
      { message: "We run tours Monday to Friday. Please pick a weekday." },
    ),

  tourSlot: z.enum(["morning", "afternoon"], {
    message: "Morning or afternoon, whichever suits you.",
  }),
});

export type TourInput = z.infer<typeof tourSchema>;

/** "Tuesday, September 8" — used in the confirmation, never a raw ISO string. */
export function formatTourDate(iso: string) {
  const d = new Date(`${iso}T12:00:00Z`);
  if (Number.isNaN(d.getTime())) return iso;
  return d.toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    timeZone: "UTC",
  });
}

export function slotLabel(slot: string) {
  return slotOptions.find((s) => s.value === slot)?.detail ?? slot;
}

/**
 * Tomorrow, and sixty days out — the bounds on the native date control.
 * Computed in UTC so the server-rendered attribute and the hydrated one always
 * agree, whatever timezone the parent is in.
 */
export function dateBounds() {
  const now = Date.now();
  const iso = (offsetDays: number) =>
    new Date(now + offsetDays * 86_400_000).toISOString().slice(0, 10);
  return { min: iso(1), max: iso(60) };
}
