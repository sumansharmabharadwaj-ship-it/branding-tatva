"use client";

import { useHydratedReducedMotion } from "@/hooks/useHydratedReducedMotion";
import { cloneElement, isValidElement, useId, useRef, useState, type MouseEvent, type ReactElement } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { contactSchema, brandStages, type ContactFormValues } from "@/lib/contact-schema";
import { cn } from "@/lib/utils";
import { Magnetic } from "@/components/Magnetic";
import { useSpotlight } from "@/hooks/useSpotlight";
import { EASE_AIR } from "@/lib/motion";

type Status = "idle" | "submitting" | "success" | "error";

// Underline-only fields, not full bordered boxes — per direct feedback
// pointing at tile.pt's own "let's talk" form as a bar to match: bigger,
// more confident type instead of small clinical inputs sitting in a
// grid of near-identical rectangles. `bg-transparent` (not warm-white)
// so the field reads as part of the page, not a boxed form widget.
const inputClass =
  "mt-2 w-full border-0 border-b border-soil/18 bg-transparent px-0 py-3 text-base text-soil placeholder:text-foreground-secondary/45 transition-[border-color,background-color] duration-300 focus:border-action-primary focus:bg-white/20 focus:outline-none focus:ring-0 sm:text-lg";

let rippleId = 0;

// The submit button is the single most consequential click on the site,
// yet it was the only primary CTA with none of LinkButton's signature
// interactions (cursor-spotlight sheen, click ripple) — it can't reuse
// LinkButton directly (that component renders a Next Link, this needs a
// real form-submit button), so the same two effects are wired here by
// hand instead.
export function ContactForm() {
  const [status, setStatus] = useState<Status>("idle");
  const [serverError, setServerError] = useState<string | null>(null);
  const prefersReducedMotion = useHydratedReducedMotion();
  const buttonRef = useRef<HTMLButtonElement>(null);
  const spotlightRef = useSpotlight(buttonRef, Boolean(prefersReducedMotion));
  const [ripples, setRipples] = useState<{ id: number; x: number; y: number }[]>([]);
  // Manual guide p38 and Suman's reference panel: ask only what is
  // needed up front. Three essential fields carry the enquiry; the
  // seven optional ones stay one click away rather than gone, so a
  // visitor who wants to say more still can.
  const [showMore, setShowMore] = useState(false);

  function handleButtonClick(e: MouseEvent<HTMLButtonElement>) {
    if (prefersReducedMotion) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const id = rippleId++;
    setRipples((prev) => [...prev, { id, x: e.clientX - rect.left, y: e.clientY - rect.top }]);
    setTimeout(() => setRipples((prev) => prev.filter((r) => r.id !== id)), 650);
  }

  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors },
  } = useForm<ContactFormValues>({
    resolver: zodResolver(contactSchema),
  });

  const requiredDetails = watch(["name", "email", "description"]);
  const completedDetails = requiredDetails.filter(
    (value) => typeof value === "string" && value.trim().length > 0,
  ).length;
  const completionLabel =
    completedDetails === 3
      ? "Ready when you are"
      : completedDetails > 0
        ? "Your note is taking shape"
        : "A quiet place to begin";

  async function onSubmit(values: ContactFormValues) {
    setStatus("submitting");
    setServerError(null);
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        setServerError(data.error ?? "Something went wrong. Please try again.");
        setStatus("error");
        return;
      }
      setStatus("success");
      reset();
    } catch {
      setServerError("The server was unreachable. Check your connection and try again.");
      setStatus("error");
    }
  }

  // Every other consequential moment on this page (the button itself,
  // the staggered field reveal) already carries real motion; the
  // success state was the one hard cut left, an abrupt re-render swap
  // with nothing animating at all. The checkmark reuses the exact
  // stroke-draw technique LinkButton's secondary variant already
  // proves (pathLength 0 to 1 via a dashoffset transition), so this
  // isn't a new animation idiom, just the existing one applied to the
  // form's actual final moment.
  if (status === "success") {
    return (
      <motion.div
        role="status"
        initial={prefersReducedMotion ? undefined : { opacity: 0, scale: 0.96, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.35, ease: EASE_AIR }}
        className="rounded-2xl border border-state-success/40 bg-state-success/10 p-6"
      >
        <motion.svg
          width="40"
          height="40"
          viewBox="0 0 40 40"
          fill="none"
          aria-hidden="true"
          initial={prefersReducedMotion ? undefined : { scale: 0.6, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.35, delay: 0.1, ease: EASE_AIR }}
        >
          <circle cx="20" cy="20" r="19" className="stroke-state-success" strokeWidth="1.5" opacity="0.4" />
          <motion.path
            d="M12 20.5L17 25.5L28.5 14"
            className="stroke-state-success"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            initial={prefersReducedMotion ? undefined : { pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 0.35, delay: 0.3, ease: "easeOut" }}
          />
        </motion.svg>
        <motion.div
          initial={prefersReducedMotion ? undefined : { opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, delay: 0.5, ease: EASE_AIR }}
        >
          <p className="mt-4 font-display text-xl font-normal text-soil">Thank you, that&apos;s in.</p>
          <p className="mt-2 text-sm text-foreground-secondary">
            I read every enquiry personally and reply within a few days. If it&apos;s
            urgent, feel free to email directly too.
          </p>
        </motion.div>
      </motion.div>
    );
  }

  // Direct feedback that this form read as one flat block dropped in at
  // once — the same staggered "open folder" reveal PackageSelector's own
  // includes list already proved, applied per row here instead. Rows
  // fire in visual reading order (top to bottom), not per input, so a
  // two-column row still animates as one beat.
  let rowIndex = -1;
  function nextDelay() {
    rowIndex += 1;
    return prefersReducedMotion ? 0 : rowIndex * 0.06;
  }

  return (
    <div className="rounded-[2rem] border border-white/55 bg-[#F6F2EA]/88 px-6 py-7 shadow-[0_30px_100px_rgba(26,38,27,0.2)] backdrop-blur-3xl sm:px-10 sm:py-9">
      {/* The panel mirrors the booking card beside it — cream ground,
          italic display accent, serif line, and the sprig divider —
          so the two paths on this page read as siblings rather than
          a styled card next to a bare form. */}
      <div className="text-center">
        <p className="text-[0.65rem] font-medium uppercase tracking-[0.22em] text-clay">A note, in your own words</p>
        <p className="mt-3 font-display text-3xl font-normal leading-tight text-soil sm:text-4xl">What are you building?</p>
        <p className="mx-auto mt-4 max-w-sm text-sm leading-relaxed text-foreground-secondary">
          Three details begin the conversation. Add more only when it helps you explain the picture.
        </p>
      </div>

      <div className="mt-6 rounded-2xl border border-soil/10 bg-white/30 px-4 py-3">
        <div className="flex items-center justify-between gap-4">
          <p className="text-[0.65rem] font-medium uppercase tracking-[0.18em] text-soil/48">Conversation note</p>
          <p className="text-xs text-soil/58" aria-live="polite">{completionLabel}</p>
        </div>
        <div className="mt-3 h-px overflow-hidden bg-soil/12" aria-hidden="true">
          <motion.span
            className="block h-full bg-clay"
            initial={false}
            animate={{ width: `${(completedDetails / 3) * 100}%` }}
            transition={{ duration: prefersReducedMotion ? 0 : 0.45, ease: EASE_AIR }}
          />
        </div>
        <div className="mt-2 flex justify-between" aria-hidden="true">
          {[0, 1, 2].map((index) => (
            <span
              key={index}
              className={`h-1.5 w-1.5 rounded-full transition-colors duration-300 ${
                completedDetails > index ? "bg-clay" : "bg-soil/15"
              }`}
            />
          ))}
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} noValidate className="mt-6 space-y-5">
      {/* Honeypot — hidden from real users, visible to bots */}
      <input
        type="text"
        tabIndex={-1}
        autoComplete="off"
        className="hidden"
        aria-hidden="true"
        {...register("company_website")}
      />

      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35, delay: nextDelay(), ease: EASE_AIR }}
        className="grid gap-5 sm:grid-cols-2"
      >
        <Field label="01 Your name" error={errors.name?.message}>
          <input className={inputClass} {...register("name")} />
        </Field>
        <Field label="02 Your email" error={errors.email?.message}>
          <input type="email" className={inputClass} {...register("email")} />
        </Field>
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35, delay: nextDelay(), ease: EASE_AIR }}>
        <Field label="03 What feels unclear right now?" error={errors.description?.message}>
          <textarea rows={4} className={inputClass} {...register("description")} />
        </Field>
      </motion.div>

      {/* The optional seven, kept and reachable rather than removed. */}
      <div className="border-t border-soil/10 pt-5">
        <button
          type="button"
          aria-expanded={showMore}
          aria-controls="contact-more"
          onClick={() => setShowMore((v) => !v)}
          className="link-underline inline-flex items-center gap-2 text-sm font-medium text-clay transition-colors duration-300 hover:text-soil"
        >
          {showMore ? "Fewer details" : "Add more detail"}
          <span aria-hidden="true" className={`text-base transition-transform duration-300 ${showMore ? "rotate-45" : ""}`}>
            +
          </span>
        </button>

        <div id="contact-more" hidden={!showMore}>
          <AnimatePresence initial={false}>
            {showMore && (
              <motion.div
                initial={prefersReducedMotion ? undefined : { opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={prefersReducedMotion ? undefined : { opacity: 0 }}
                transition={{ duration: 0.35, ease: EASE_AIR }}
                className="mt-5 space-y-5"
              >
                <div className="grid gap-5 sm:grid-cols-2">
                  <Field label="Business or brand name" error={errors.business?.message}>
                    <input className={inputClass} {...register("business")} />
                  </Field>
                  <Field label="Phone (optional)" error={errors.phone?.message}>
                    <input className={inputClass} {...register("phone")} />
                  </Field>
                </div>
                <Field label="Website or social link (optional)" error={errors.website?.message}>
                  <input className={inputClass} {...register("website")} />
                </Field>
                <Field label="Where is your brand right now?" error={errors.brandStage?.message}>
                  <select className={inputClass} defaultValue="" {...register("brandStage")}>
                    <option value="" disabled>
                      Choose the closest fit
                    </option>
                    {brandStages.map((stage) => (
                      <option key={stage} value={stage}>
                        {stage}
                      </option>
                    ))}
                  </select>
                </Field>
                <Field label="What do you think you need?" error={errors.servicesNeeded?.message}>
                  <input className={inputClass} {...register("servicesNeeded")} placeholder="A rough idea is fine" />
                </Field>
                <div className="grid gap-5 sm:grid-cols-2">
                  <Field label="Estimated budget (optional)" error={errors.budget?.message}>
                    <input className={inputClass} {...register("budget")} />
                  </Field>
                  <Field label="Desired timeline (optional)" error={errors.timeline?.message}>
                    <input className={inputClass} {...register("timeline")} />
                  </Field>
                </div>
                <Field label="How did you find Branding Tatva? (optional)" error={errors.referral?.message}>
                  <input className={inputClass} {...register("referral")} />
                </Field>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {status === "error" && serverError && (
        <p role="alert" className="text-sm text-state-error">
          {serverError}
        </p>
      )}

        <Magnetic className="inline-block">
        <button
          ref={buttonRef}
          type="submit"
          onClick={handleButtonClick}
          disabled={status === "submitting"}
          className={cn(
            "group/btn relative overflow-hidden inline-flex items-center justify-center gap-1.5 rounded-full bg-action-primary px-6 py-3 text-sm font-medium text-white transition-all duration-300 ease-earth hover:bg-action-primary-hover hover:-translate-y-0.5 hover:shadow-elevation-lg focus-ring-halo disabled:opacity-60 disabled:hover:translate-y-0 disabled:hover:shadow-none"
          )}
        >
          <span
            ref={spotlightRef}
            aria-hidden="true"
            className="cursor-spotlight pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300"
          />
          {!prefersReducedMotion && (
            <AnimatePresence>
              {ripples.map((r) => (
                <motion.span
                  key={r.id}
                  aria-hidden="true"
                  className="pointer-events-none absolute rounded-full bg-current"
                  style={{ left: r.x, top: r.y, transform: "translate(-50%, -50%)" }}
                  initial={{ width: 0, height: 0, opacity: 0.3 }}
                  animate={{ width: 220, height: 220, opacity: 0 }}
                  transition={{ duration: 0.72, ease: EASE_AIR }}
                />
              ))}
            </AnimatePresence>
          )}
          <span className="relative z-10 inline-flex items-center gap-1.5">
            {status === "submitting" ? "Sending…" : "Send enquiry"}
            {status !== "submitting" && (
              <span
                aria-hidden="true"
                className="inline-block -translate-x-1 opacity-0 transition-all duration-300 ease-earth group-hover/btn:translate-x-0 group-hover/btn:opacity-100"
              >
                &rarr;
              </span>
            )}
          </span>
        </button>
        </Magnetic>
      </form>
    </div>
  );
}

function Field({
  label,
  error,
  children,
}: {
  label: string;
  error?: string;
  children: ReactElement<{ "aria-invalid"?: boolean; "aria-describedby"?: string }>;
}) {
  const errorId = useId();
  return (
    <label className="block text-xs font-medium uppercase tracking-wide text-foreground-secondary">
      {label}
      {isValidElement(children)
        ? cloneElement(children, {
            "aria-invalid": Boolean(error),
            "aria-describedby": error ? errorId : undefined,
          })
        : children}
      {error && (
        <span id={errorId} className="mt-1 block text-xs font-normal text-state-error">
          {error}
        </span>
      )}
    </label>
  );
}
