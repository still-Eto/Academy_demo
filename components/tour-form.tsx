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
 * Nothing leaves the browser (05.11.2026, still-Eto/ertukara#59). The form
 * validates against the schema and renders the confirmation in place; there is
 * no endpoint, no fetch and no log. ertukara.com's privacy policy says the demo
 * forms transmit nothing, and the line under this form says nothing is saved.
 *
 * method="dialog" keeps that true without JavaScript: outside a <dialog> the
 * browser does nothing on submit, so no request and no query string ever
 * carries what a parent typed. A real center's deployment adds its own
 * endpoint, set up for that center's privacy policy.
 */
export function TourForm() {
  const [sent, setSent] = useState<TourInput | null>(null);
  /**
   * Marks the moment the form starts handling its own submit, which is what
   * the verification suite waits for. Before it, pressing the button does
   * nothing (method="dialog", see above).
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
  } = useForm<TourInput>({
    resolver: zodResolver(tourSchema),
    mode: "onTouched",
    defaultValues: {
      name: "",
      phone: "",
      email: "",
      childAge: "",
      tourDate: "",
    },
  });

  // Put the confirmation where she is looking, not below the fold.
  useEffect(() => {
    if (sent) window.scrollTo({ top: 0, behavior: "auto" });
  }, [sent]);

  const onSubmit = handleSubmit((values) => {
    setSent(values);
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
      method="dialog"
      onSubmit={onSubmit}
      noValidate
      data-hydrated={hydrated ? "true" : "false"}
      className="card p-5 lg:p-7"
    >
      <h2 className="text-[1.375rem] leading-tight lg:text-[1.625rem]">Ask for a tour</h2>
      <p className="mt-2 text-[0.9375rem] leading-relaxed text-muted">
        Five questions. We ask everything else when you are standing in the room.
      </p>

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
            defaultValue=""
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
        Ask Marisol for a tour
      </button>

      <p className="mt-3 text-[0.875rem] leading-relaxed text-muted">
        No deposit, no obligation, and we will not add you to a mailing list.
      </p>

      {/*
        What happens to the three pieces of personal data this form asks for,
        said at the point they are asked, which is worth more than a policy
        page nobody opens.

        On a demo the answer is nothing, and since 05.11.2026 that is literally
        true: no endpoint, no log, nothing leaves the browser (#59). On a real
        center's deployment the line states the purpose instead, and the center
        adds its endpoint and a policy page beside it.
      */}
      <p className="mt-2 text-[0.875rem] leading-relaxed text-muted">
        {noIndex
          ? "This is a demonstration site. What you type here is not saved, emailed or passed to anyone."
          : "We use your name, phone and email to arrange the tour and reply to you, and for nothing else."}
      </p>
      {noIndex && (
        <noscript>
          <p className="mt-2 text-[0.875rem] leading-relaxed text-muted">
            With JavaScript turned off, the button does nothing and nothing is sent.
          </p>
        </noscript>
      )}
    </form>
  );
}
