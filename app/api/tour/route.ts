import { NextResponse, type NextRequest } from "next/server";

import { tourSchema } from "@/lib/tour-schema";

/**
 * The tour endpoint.
 *
 * It answers two kinds of caller with the same validation:
 *
 *   1. the client form, which sends JSON via fetch and renders the
 *      confirmation in place;
 *   2. a browser with JavaScript disabled, which does a plain form POST. That
 *      caller gets a 303 back to /book-a-tour with the booking in the query
 *      string, so it lands on the same confirmation rather than a page of raw
 *      JSON. The form must never look broken in a demo.
 */

const THINKING_TIME = 600;

export async function POST(request: NextRequest) {
  const contentType = request.headers.get("content-type") ?? "";
  const wantsHtml = !contentType.includes("application/json");

  let raw: Record<string, unknown>;

  if (contentType.includes("application/json")) {
    try {
      raw = await request.json();
    } catch {
      return NextResponse.json(
        { ok: false, errors: { form: "We couldn't read that. Please try again." } },
        { status: 400 },
      );
    }
  } else {
    const form = await request.formData();
    raw = Object.fromEntries(form.entries());
  }

  const parsed = tourSchema.safeParse(raw);

  if (!parsed.success) {
    const errors: Record<string, string> = {};
    for (const issue of parsed.error.issues) {
      const key = String(issue.path[0] ?? "form");
      if (!errors[key]) errors[key] = issue.message;
    }

    if (wantsHtml) {
      const params = new URLSearchParams({ error: "1" });
      for (const [key, value] of Object.entries(raw)) {
        if (typeof value === "string") params.set(key, value);
      }
      return NextResponse.redirect(new URL(`/book-a-tour?${params}`, request.url), 303);
    }

    return NextResponse.json({ ok: false, errors }, { status: 400 });
  }

  const booking = parsed.data;

  // TODO: replace this with the real integration — write the request to the
  // center's CRM or booking system and email the director. Everything needed
  // is in `booking`. Nothing else in the app has to change.
  console.log("[tour request]", {
    ...booking,
    receivedAt: new Date().toISOString(),
  });

  await new Promise((resolve) => setTimeout(resolve, THINKING_TIME));

  if (wantsHtml) {
    const params = new URLSearchParams({
      booked: "1",
      name: booking.name,
      tourDate: booking.tourDate,
      tourSlot: booking.tourSlot,
    });
    return NextResponse.redirect(new URL(`/book-a-tour?${params}`, request.url), 303);
  }

  return NextResponse.json({ ok: true, booking });
}
