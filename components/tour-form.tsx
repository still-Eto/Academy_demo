"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useId, useState, useSyncExternalStore } from "react";
import { useForm } from "react-hook-form";

import { noIndex } from "@/content/site.config";
import { ageOptions, dateBounds, slotOptions, tourSchema, type TourInput } from "@/lib/tour-schema";
import { TourConfirmation } from "./tour-confirmation";

/**
 * Five fields. No exceptions. Everything else is asked at the tour.
 *
 *   1. Parent name
 *   2. Phone
 *   3. Email
 *   4. Child's age
 *   5. Preferred tour day — one field, a native date control plus a
 *      morning/afternoon choice, grouped in a single labelled fieldset.
 *
 * With JavaScript off this is an ordinary form that POSTs to /api/tour, which
 * validates with this same schema and redirects to the same confirmation.
 */
export function TourForm({ defaults }: { defaults?: Partial<TourInput> }) {
  const [sent, setSent] = useState<TourInput | null>(null);
  const [formError, setFormError] = useState<string | null>(null);
  /**
   * Marks the moment the form stops being a plain HTML form and starts
   * intercepting its own submit. Before this, a submit is a real POST to
   * /api/tour and still lands on a real confirmation — which is the point of
   * the progressive enhancement, and what the verification suite waits for.
   *
   * useSyncExternalStore rather than an effect: it reads false on the server
   * and true on the client with no extra render pass.
   */
  const hydrated = useSyncExternalStore(
    () => () => {},
    () => true,
    () => false,
  );
  const bounds = dateBounds();
  const uid = useId();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setError,
  } = useForm<TourInput>({
    resolver: zodResolver(tourSchema),
    mode: "onTouched",
    defaultValues: {
      name: defaults?.name ?? "",
      phone: defaults?.phone ?? "",
      email: defaults?.email ?? "",
      childAge: defaults?.childAge ?? "",
      tourDate: defaults?.tourDate ?? "",
      tourSlot: defaults?.tourSlot,
    },
  });

  // Put the confirmation where she is looking, not below the fold.
  useEffect(() => {
    if (sent) window.scrollTo({ top: 0, behavior: "auto" });
  }, [sent]);

  const onSubmit = handleSubmit(async (values) => {
    setFormError(null);
    try {
      const res = await fetch("/api/tour", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });
      const data = await res.json();

      if (!res.ok || !data.ok) {
        const serverErrors: Record<string, string> = data?.errors ?? {};
        let matched = false;
        for (const [field, message] of Object.entries(serverErrors)) {
          if (field === "form") continue;
          setError(field as keyof TourInput, { message });
          matched = true;
        }
        if (!matched) {
          setFormError(
            serverErrors.form ??
              "Something went wrong on our end. Please call us on the number above and we'll book it by phone.",
          );
        }
        return;
      }

      setSent(values);
    } catch {
      setFormError(
        "We couldn't reach the server. Please call us on the number above and we'll book it by phone.",
      );
    }
  });

  if (sent) {
    return <TourConfirmation name={sent.name} tourDate={sent.tourDate} tourSlot={sent.tourSlot} />;
  }

  const fieldClass =
    "mt-1.5 block w-full rounded-lg border border-line bg-surface px-3.5 py-3 text-[1rem] leading-normal";
  const labelClass = "block font-semibold text-[0.9375rem]";
  const errorClass = "mt-1.5 text-[0.875rem] leading-snug text-wait";

  return (
    <form
      method="POST"
      action="/api/tour"
      onSubmit={onSubmit}
      noValidate
      data-hydrated={hydrated ? "true" : "false"}
      className="card p-5 lg:p-7"
    >
      <h2 className="text-[1.375rem] leading-tight lg:text-[1.625rem]">Ask for a tour</h2>
      <p className="mt-2 text-[0.9375rem] leading-relaxed text-muted">
        Five questions. We ask everything else when you are standing in the room.
      </p>

      {formError && (
        <p role="alert" className="mt-5 rounded-lg bg-wait-bg px-4 py-3 text-[0.9375rem] text-wait">
          {formError}
        </p>
      )}

      <div className="mt-6 space-y-5">
        {/* 1 — Parent name */}
        <div data-field="name">
          <label htmlFor={`${uid}-name`} className={labelClass}>
            Your name
          </label>
          <input
            {...register("name")}
            id={`${uid}-name`}
            type="text"
            autoComplete="name"
            autoCapitalize="words"
            aria-invalid={errors.name ? "true" : undefined}
            aria-describedby={errors.name ? `${uid}-name-error` : undefined}
            className={fieldClass}
          />
          {errors.name && (
            <p id={`${uid}-name-error`} className={errorClass}>
              {errors.name.message}
            </p>
          )}
        </div>

        {/* 2 — Phone */}
        <div data-field="phone">
          <label htmlFor={`${uid}-phone`} className={labelClass}>
            Phone
          </label>
          <input
            {...register("phone")}
            id={`${uid}-phone`}
            type="tel"
            inputMode="tel"
            autoComplete="tel"
            aria-invalid={errors.phone ? "true" : undefined}
            aria-describedby={errors.phone ? `${uid}-phone-error` : undefined}
            className={fieldClass}
          />
          {errors.phone && (
            <p id={`${uid}-phone-error`} className={errorClass}>
              {errors.phone.message}
            </p>
          )}
        </div>

        {/* 3 — Email */}
        <div data-field="email">
          <label htmlFor={`${uid}-email`} className={labelClass}>
            Email
          </label>
          <input
            {...register("email")}
            id={`${uid}-email`}
            type="email"
            inputMode="email"
            autoComplete="email"
            autoCapitalize="off"
            spellCheck={false}
            aria-invalid={errors.email ? "true" : undefined}
            aria-describedby={errors.email ? `${uid}-email-error` : undefined}
            className={fieldClass}
          />
          {errors.email && (
            <p id={`${uid}-email-error`} className={errorClass}>
              {errors.email.message}
            </p>
          )}
        </div>

        {/* 4 — Child's age */}
        <div data-field="childAge">
          <label htmlFor={`${uid}-age`} className={labelClass}>
            Your child&rsquo;s age
          </label>
          <select
            {...register("childAge")}
            id={`${uid}-age`}
            aria-invalid={errors.childAge ? "true" : undefined}
            aria-describedby={errors.childAge ? `${uid}-age-error` : undefined}
            className={fieldClass}
            defaultValue={defaults?.childAge ?? ""}
          >
            <option value="">Choose an age</option>
            {ageOptions.map((o) => (
              <option key={o.value} value={o.value}>
                {o.label}
              </option>
            ))}
          </select>
          {errors.childAge && (
            <p id={`${uid}-age-error`} className={errorClass}>
              {errors.childAge.message}
            </p>
          )}
        </div>

        {/* 5 — Preferred tour day: one field, native date control plus slot */}
        <fieldset data-field="tourDay" className="border-0 p-0">
          <legend className={labelClass}>Preferred tour day</legend>

          <input
            {...register("tourDate")}
            id={`${uid}-date`}
            type="date"
            min={bounds.min}
            max={bounds.max}
            aria-label="Tour date"
            aria-invalid={errors.tourDate ? "true" : undefined}
            aria-describedby={errors.tourDate ? `${uid}-date-error` : `${uid}-date-hint`}
            className={fieldClass}
          />
          <p id={`${uid}-date-hint`} className="mt-1.5 text-[0.875rem] text-muted">
            Weekdays only. Pick anything in the next two months.
          </p>
          {errors.tourDate && (
            <p id={`${uid}-date-error`} className={errorClass}>
              {errors.tourDate.message}
            </p>
          )}

          <div
            role="radiogroup"
            aria-label="Morning or afternoon"
            aria-invalid={errors.tourSlot ? "true" : undefined}
            aria-describedby={errors.tourSlot ? `${uid}-slot-error` : undefined}
            className="mt-3 grid grid-cols-2 gap-2"
          >
            {slotOptions.map((slot) => (
              <label
                key={slot.value}
                className="flex min-h-[64px] cursor-pointer flex-col justify-center rounded-lg border border-line bg-surface px-3.5 py-2 has-checked:border-brand has-checked:bg-brand-tint"
              >
                <span className="flex items-center gap-2">
                  <input
                    {...register("tourSlot")}
                    type="radio"
                    value={slot.value}
                    className="h-4 w-4 accent-[var(--color-brand)]"
                  />
                  <span className="font-semibold">{slot.label}</span>
                </span>
                <span className="mt-0.5 pl-6 text-[0.8125rem] text-muted">{slot.detail}</span>
              </label>
            ))}
          </div>
          {errors.tourSlot && (
            <p id={`${uid}-slot-error`} className={errorClass}>
              {errors.tourSlot.message}
            </p>
          )}
        </fieldset>
      </div>

      <button type="submit" disabled={isSubmitting} className="btn btn-primary mt-7 w-full">
        {isSubmitting ? "Sending…" : "Ask Marisol for a tour"}
      </button>

      <p className="mt-3 text-[0.875rem] leading-relaxed text-muted">
        No deposit, no obligation, and we will not add you to a mailing list.
      </p>

      {/*
        What happens to the three pieces of personal data this form collects.

        The form does a real POST to a real endpoint, so "what do you do with
        my phone number" is a fair question and there was nowhere on the site
        that answered it. This is the answer, at the point it is asked, which
        is worth more than a policy page nobody opens.

        The wording follows the deployment. On a demo `/api/tour` validates the
        submission and writes it to the server log — no database, no email, no
        third party — and saying so is both true and reassuring. On a real
        center's deployment that endpoint becomes their CRM, so the line states
        the purpose instead and the center adds a policy page beside it.
      */}
      <p className="mt-2 text-[0.875rem] leading-relaxed text-muted">
        {noIndex
          ? "This is a demonstration site. What you type here is not saved, emailed or passed to anyone."
          : "We use your name, phone and email to arrange the tour and reply to you, and for nothing else."}
      </p>
    </form>
  );
}
