"use client";

import dynamic from "next/dynamic";
import { useRef, useState } from "react";
import { AnimatePresence, m } from "motion/react";
import { Reveal } from "@/components/fx/Reveal";
import { TeardownPreview } from "@/components/visuals/TeardownPreview";
import { BUDGET_LABEL, trackFormError, trackFormStart, trackLeadSubmitted } from "@/lib/analytics";
import type { BudgetRange, LeadPayload } from "@/lib/analytics";
import { BUDGETS, validateLead, type Errors, type FieldName } from "@/lib/validateLead";
import { EASE_OUT_EXPO } from "@/lib/motion";

const Aurora = dynamic(() => import("@/components/fx/Aurora").then((m) => m.Aurora));

const EMPTY: LeadPayload = {
  name: "",
  email: "",
  company: "",
  budget: "" as BudgetRange,
  message: "",
};

type Status = "idle" | "submitting" | "success" | "error";

export function BookACall() {
  const [values, setValues] = useState<LeadPayload>(EMPTY);
  const [errors, setErrors] = useState<Errors>({});
  const [touched, setTouched] = useState<Partial<Record<FieldName, boolean>>>({});
  const [status, setStatus] = useState<Status>("idle");
  const [serverError, setServerError] = useState<string | null>(null);

  const startedRef = useRef(false);
  const honeypotRef = useRef<HTMLInputElement | null>(null);

  const markStarted = () => {
    if (startedRef.current) return;
    startedRef.current = true;
    trackFormStart();
  };

  const update = (field: FieldName, value: string) => {
    markStarted();
    const next = { ...values, [field]: value };
    setValues(next);

    // Only re-validate a field the user has already left once, so errors never
    // appear while they are still mid-word.
    if (touched[field]) {
      setErrors(validateLead(next));
    }
  };

  const blur = (field: FieldName) => {
    setTouched((current) => ({ ...current, [field]: true }));
    setErrors(validateLead(values));
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setServerError(null);
    // Someone who submits an empty form has still started it — without this,
    // `form_error` could be reported before `form_start`.
    markStarted();

    const found = validateLead(values);
    setErrors(found);
    setTouched({ name: true, email: true, company: true, budget: true, message: true });

    const invalid = Object.keys(found) as FieldName[];
    if (invalid.length > 0) {
      trackFormError(invalid);
      // Move focus to the first problem — required for keyboard and screen readers.
      document.getElementById(`field-${invalid[0]}`)?.focus();
      return;
    }

    setStatus("submitting");

    try {
      const response = await fetch("/api/lead", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ ...values, website: honeypotRef.current?.value ?? "" }),
      });

      const data = (await response.json()) as {
        ok: boolean;
        id?: string;
        errors?: Errors;
        error?: string;
      };

      if (!response.ok || !data.ok) {
        if (data.errors) setErrors(data.errors);
        setServerError(data.error ?? "We couldn't send that. Please try again.");
        setStatus("error");
        return;
      }

      // The conversion event: GA4 `generate_lead` + Meta `Lead`, via the dataLayer.
      trackLeadSubmitted(values, data.id ?? "unknown");
      setStatus("success");
    } catch {
      setServerError("Network error. Please check your connection and try again.");
      setStatus("error");
    }
  };

  return (
    <section id="book" data-nav-theme="light" className="relative isolate overflow-hidden bg-white py-24 sm:py-32">
      <Aurora intensity={0.5} />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 bottom-0 h-40 bg-gradient-to-b from-transparent to-white"
      />

      <div className="u-shell relative z-10 grid gap-14 lg:grid-cols-[0.95fr_1fr] lg:items-start lg:gap-20">
        <Reveal>
          <p className="u-eyebrow">Book a call</p>
          <h2 className="u-balance mt-4 max-w-[14ch] text-headline text-ink">
            Start with the free audit.
          </h2>
          <p className="u-pretty mt-6 max-w-[42ch] text-lede text-body">
            Thirty minutes, your account open on the screen. Then a written
            teardown — the three things costing you the most.
          </p>

          <div className="mt-10">
            <TeardownPreview />
          </div>
        </Reveal>

        <Reveal delay={0.1}>
          <div className="relative overflow-hidden rounded-[22px] border border-line bg-white p-5 shadow-[0_2px_4px_rgba(11,13,18,0.04),0_40px_90px_-40px_rgba(11,13,18,0.3)] sm:p-6">
            <AnimatePresence mode="wait" initial={false}>
              {status === "success" ? (
                <m.div
                  key="success"
                  initial={{ opacity: 0, y: 14 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.5, ease: EASE_OUT_EXPO }}
                  className="py-10 text-center"
                  role="status"
                  aria-live="polite"
                >
                  <span className="mx-auto grid size-14 place-items-center rounded-full bg-[#e4f7f1] text-[#0a7f61] ring-1 ring-inset ring-[#bfe9da]">
                    <svg
                      viewBox="0 0 24 24"
                      className="size-6"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2.2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      aria-hidden="true"
                    >
                      <path d="m5 13 4 4L19 7" />
                    </svg>
                  </span>
                  <h3 className="mt-6 text-title text-ink">You&rsquo;re on the list.</h3>
                  <p className="mx-auto mt-3 max-w-[34ch] text-[15px] leading-relaxed text-body">
                    Check <span className="font-medium text-ink">{values.email}</span> — the
                    invite and a short intake form are on their way.
                  </p>
                  <p className="mt-6 text-[12px] text-muted">
                    Demo build: the submission was logged server-side and a
                    <code className="mx-1 rounded bg-surface px-1.5 py-0.5 text-accent-ink">generate_lead</code>
                    event pushed to the dataLayer.
                  </p>
                </m.div>
              ) : (
                <m.form
                  key="form"
                  onSubmit={handleSubmit}
                  noValidate
                  initial={false}
                  exit={{ opacity: 0 }}
                  className="space-y-3.5"
                >
                  {/* A booking form with no header reads as a floating stack of
                      inputs. This says what you are actually booking. */}
                  <div className="flex items-center gap-3 border-b border-line pb-4">
                    <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-accent-soft text-accent-ink ring-1 ring-inset ring-accent-line">
                      <svg
                        viewBox="0 0 24 24"
                        className="size-[18px]"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.8"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        aria-hidden="true"
                      >
                        <rect x="3" y="5" width="18" height="16" rx="2.4" />
                        <path d="M3 10h18M8 3v4M16 3v4" />
                        <path d="m9.4 15.4 1.8 1.8 3.4-3.8" />
                      </svg>
                    </span>

                    <div className="min-w-0">
                      <p className="text-[14px] font-semibold tracking-tight text-ink">
                        Free account audit
                      </p>
                      <p className="truncate text-[12px] text-muted">
                        Google Meet or Zoom · no deck
                      </p>
                    </div>

                    <span className="ml-auto shrink-0 rounded-full border border-line bg-surface px-2.5 py-1 text-[11px] font-medium text-body">
                      30 min
                    </span>
                  </div>

                  {/* Two short fields share a row; email gets the full width
                      because addresses are long and truncation looks broken. */}
                  <div className="grid gap-3.5 sm:grid-cols-2">
                    <Field
                      id="name"
                      label="Full name"
                      autoComplete="name"
                      placeholder="Jordan Reyes"
                      value={values.name}
                      error={touched.name ? errors.name : undefined}
                      onChange={(value) => update("name", value)}
                      onBlur={() => blur("name")}
                    />

                    <Field
                      id="company"
                      label="Company"
                      autoComplete="organization"
                      placeholder="Company Inc."
                      value={values.company}
                      error={touched.company ? errors.company : undefined}
                      onChange={(value) => update("company", value)}
                      onBlur={() => blur("company")}
                    />
                  </div>

                  <Field
                    id="email"
                    label="Work email"
                    type="email"
                    inputMode="email"
                    autoComplete="email"
                    placeholder="jordan@company.com"
                    value={values.email}
                    error={touched.email ? errors.email : undefined}
                    onChange={(value) => update("email", value)}
                    onBlur={() => blur("email")}
                  />

                  {/* Budget as a radio group: one tap on mobile, no select sheet. */}
                  <fieldset>
                    <div className="flex items-baseline justify-between gap-3">
                      <legend className="text-[13px] font-medium text-ink">
                        Monthly ad budget
                      </legend>
                      {touched.budget && errors.budget && (
                        <span id="error-budget" className="shrink-0 text-[11px] font-medium text-red-600">
                          {errors.budget}
                        </span>
                      )}
                    </div>
                    <div
                      className="mt-1.5 grid grid-cols-2 gap-1.5"
                      role="radiogroup"
                      aria-describedby={
                        touched.budget && errors.budget ? "error-budget" : undefined
                      }
                    >
                      {BUDGETS.map((budget) => {
                        const selected = values.budget === budget;
                        return (
                          <button
                            key={budget}
                            type="button"
                            role="radio"
                            aria-checked={selected}
                            id={budget === BUDGETS[0] ? "field-budget" : undefined}
                            onClick={() => {
                              setTouched((current) => ({ ...current, budget: true }));
                              markStarted();
                              const next = { ...values, budget };
                              setValues(next);
                              setErrors(validateLead(next));
                            }}
                            className={`rounded-lg border px-3 py-2.5 text-[13px] font-medium transition-colors duration-200 ${
                              selected
                                ? "border-accent bg-accent-soft text-accent-ink"
                                : "border-line bg-white text-body hover:border-line-strong hover:text-ink"
                            }`}
                          >
                            {BUDGET_LABEL[budget]}
                          </button>
                        );
                      })}
                    </div>
                  </fieldset>

                  <Field
                    id="message"
                    label="Anything we should know?"
                    optional
                    multiline
                    placeholder="Current spend, biggest constraint, timeline…"
                    value={values.message ?? ""}
                    error={touched.message ? errors.message : undefined}
                    onChange={(value) => update("message", value)}
                    onBlur={() => blur("message")}
                  />

                  {/* Honeypot — off-screen, not display:none, so bots still fill it. */}
                  <input
                    ref={honeypotRef}
                    type="text"
                    name="website"
                    tabIndex={-1}
                    autoComplete="off"
                    aria-hidden="true"
                    className="absolute left-[-9999px] size-px opacity-0"
                  />

                  {serverError && (
                    <p role="alert" className="text-[13px] text-red-600">
                      {serverError}
                    </p>
                  )}

                  <button
                    type="submit"
                    disabled={status === "submitting"}
                    className="group mt-1 flex w-full items-center justify-center gap-2 rounded-xl bg-ink px-6 py-3 text-[15px] font-semibold text-white shadow-[0_12px_30px_-12px_rgba(11,13,18,0.5)] transition-transform duration-300 hover:scale-[1.01] active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {status === "submitting" ? "Sending…" : "Book my free audit"}
                    {status !== "submitting" && (
                      <span aria-hidden="true" className="transition-transform duration-300 group-hover:translate-x-0.5">
                        →
                      </span>
                    )}
                  </button>

                  <p className="text-center text-[12px] leading-relaxed text-muted">
                    We reply within one business day. No sequences, no reselling
                    your details.
                  </p>
                </m.form>
              )}
            </AnimatePresence>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

/* -------------------------------------------------------------------------- */

type FieldProps = {
  id: FieldName;
  label: string;
  value: string;
  onChange: (value: string) => void;
  onBlur: () => void;
  error?: string;
  type?: string;
  inputMode?: "email" | "text";
  autoComplete?: string;
  placeholder?: string;
  optional?: boolean;
  multiline?: boolean;
};

function Field({
  id,
  label,
  value,
  onChange,
  onBlur,
  error,
  type = "text",
  inputMode,
  autoComplete,
  placeholder,
  optional,
  multiline,
}: FieldProps) {
  const describedBy = error ? `error-${id}` : undefined;

  const shared = {
    id: `field-${id}`,
    name: id,
    value,
    placeholder,
    autoComplete,
    onChange: (
      event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    ) => onChange(event.target.value),
    onBlur,
    "aria-invalid": Boolean(error),
    "aria-describedby": describedBy,
    className: `w-full rounded-lg border bg-surface-2 px-3.5 py-2.5 text-[15px] text-ink placeholder:text-muted outline-none transition-[border-color,background-color,box-shadow] duration-200 focus:bg-white focus:ring-4 ${
      error
        ? "border-red-400 focus:border-red-500 focus:ring-red-500/10"
        : "border-line hover:border-line-strong focus:border-accent focus:ring-accent/12"
    }`,
  };

  return (
    <div>
      {/*
        The error sits on the label row rather than under the input. The old
        layout reserved a permanent gutter beneath every field so an appearing
        error could not shift the form — that gutter was most of this card's
        dead space. Here the row height is set by the label, so the error costs
        nothing and still cannot shift anything, provided it stays on one line.
        That is why the validator's messages are short.
      */}
      <div className="flex items-baseline justify-between gap-3">
        <label htmlFor={`field-${id}`} className="shrink-0 text-[13px] font-medium text-ink">
          {label}
        </label>

        {error ? (
          <span id={describedBy} className="min-w-0 truncate text-[11px] font-medium text-red-600">
            {error}
          </span>
        ) : (
          optional && <span className="shrink-0 text-[11px] text-muted">Optional</span>
        )}
      </div>

      <div className="mt-1.5">
        {multiline ? (
          <textarea {...shared} rows={3} className={`${shared.className} resize-none`} />
        ) : (
          <input {...shared} type={type} inputMode={inputMode} />
        )}
      </div>
    </div>
  );
}
