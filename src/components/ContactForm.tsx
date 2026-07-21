"use client";

import { useRef, useState, type MouseEvent } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { contactSchema, brandStages, type ContactFormValues } from "@/lib/contact-schema";
import { cn } from "@/lib/utils";
import { Magnetic } from "@/components/Magnetic";
import { useSpotlight } from "@/hooks/useSpotlight";
import { EASE_AIR } from "@/lib/motion";

type Status = "idle" | "submitting" | "success" | "error";

const inputClass =
  "mt-1 w-full rounded-md border border-border bg-warm-white px-3 py-2 text-sm text-soil placeholder:text-foreground-secondary/60 focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-state-focus";

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
  const prefersReducedMotion = useReducedMotion();
  const buttonRef = useRef<HTMLButtonElement>(null);
  const spotlightRef = useSpotlight(buttonRef, Boolean(prefersReducedMotion));
  const [ripples, setRipples] = useState<{ id: number; x: number; y: number }[]>([]);

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
    formState: { errors },
  } = useForm<ContactFormValues>({
    resolver: zodResolver(contactSchema),
  });

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

  if (status === "success") {
    return (
      <div className="rounded-lg border border-state-success/40 bg-state-success/10 p-6">
        <p className="font-display text-xl font-semibold text-soil">Thank you, that&apos;s in.</p>
        <p className="mt-2 text-sm text-foreground-secondary">
          I read every enquiry personally and reply within a few days. If it&apos;s
          urgent, feel free to email directly too.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-5">
      {/* Honeypot — hidden from real users, visible to bots */}
      <input
        type="text"
        tabIndex={-1}
        autoComplete="off"
        className="hidden"
        aria-hidden="true"
        {...register("company_website")}
      />

      <div className="grid gap-5 sm:grid-cols-2">
        <Field label="Name" error={errors.name?.message}>
          <input className={inputClass} {...register("name")} />
        </Field>
        <Field label="Email" error={errors.email?.message}>
          <input type="email" className={inputClass} {...register("email")} />
        </Field>
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <Field label="Phone (optional)" error={errors.phone?.message}>
          <input className={inputClass} {...register("phone")} />
        </Field>
        <Field label="Business or brand name" error={errors.business?.message}>
          <input className={inputClass} {...register("business")} />
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

      <Field label="Tell me about the project" error={errors.description?.message}>
        <textarea rows={5} className={inputClass} {...register("description")} />
      </Field>

      <Field label="How did you find Branding Tatva? (optional)" error={errors.referral?.message}>
        <input className={inputClass} {...register("referral")} />
      </Field>

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
            "group/btn relative overflow-hidden inline-flex items-center justify-center gap-1.5 rounded-full bg-action-primary px-6 py-3 text-sm font-medium text-white transition-all duration-300 ease-earth hover:bg-action-primary-hover hover:-translate-y-0.5 hover:shadow-elevation-lg focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-state-focus focus-visible:ring-offset-2 disabled:opacity-60 disabled:hover:translate-y-0 disabled:hover:shadow-none"
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
                  transition={{ duration: 0.6, ease: EASE_AIR }}
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
  );
}

function Field({
  label,
  error,
  children,
}: {
  label: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <label className="block text-sm font-medium text-soil">
      {label}
      {children}
      {error && (
        <span className="mt-1 block text-xs font-normal text-state-error">{error}</span>
      )}
    </label>
  );
}
