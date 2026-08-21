"use client";

import { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion } from "framer-motion";
import { newsletterSchema, type NewsletterFormValues } from "@/lib/newsletter-schema";
import { Magnetic } from "@/components/Magnetic";
import { EASE_AIR } from "@/lib/motion";
import { useHydratedReducedMotion } from "@/hooks/useHydratedReducedMotion";

type Status = "idle" | "submitting" | "success" | "already" | "error";

// A single-field sibling to ContactForm — same underline-only input
// language, same honeypot/status-machine shape, deliberately without
// any of ContactForm's own richness (spotlight, ripple) since this is
// meant to read as a quiet, low-commitment aside next to the real
// enquiry form, not a second version of it.
export function NewsletterForm() {
  const [status, setStatus] = useState<Status>("idle");
  const [serverError, setServerError] = useState<string | null>(null);
  const prefersReducedMotion = useHydratedReducedMotion();
  const successRef = useRef<HTMLParagraphElement>(null);
  const errorRef = useRef<HTMLSpanElement>(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<NewsletterFormValues>({
    resolver: zodResolver(newsletterSchema),
  });

  useEffect(() => {
    if (status === "success" || status === "already") successRef.current?.focus();
    if (status === "error") errorRef.current?.focus();
  }, [status]);

  async function onSubmit(values: NewsletterFormValues) {
    setStatus("submitting");
    setServerError(null);
    try {
      const res = await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setServerError(data.error ?? "Something went wrong. Please try again.");
        setStatus("error");
        return;
      }
      setStatus(data.alreadySubscribed ? "already" : "success");
      reset();
    } catch {
      setServerError("The server was unreachable. Check your connection and try again.");
      setStatus("error");
    }
  }

  // Was a hard, unanimated swap, the same one-frame cut ContactForm's
  // own success state used to be. Kept deliberately smaller than that
  // fix (no checkmark, no spring) since this form is meant to read as
  // a quiet aside next to the real enquiry form, not a second version
  // of it, so a small fade rather than a full moment.
  if (status === "success" || status === "already") {
    return (
      <motion.p
        ref={successRef}
        tabIndex={-1}
        role="status"
        initial={prefersReducedMotion ? undefined : { opacity: 0, y: 6 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35, ease: EASE_AIR }}
        className="mt-4 text-sm text-ivory/85"
      >
        {status === "success"
          ? "Check your inbox. I sent a quick confirmation link to finish signing up."
          : "You're already on the list."}
      </motion.p>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="mt-4 flex max-w-sm flex-col gap-3 sm:flex-row sm:items-start">
      {/* Honeypot — hidden from real users, visible to bots */}
      <input
        type="text"
        tabIndex={-1}
        autoComplete="off"
        className="hidden"
        aria-hidden="true"
        {...register("company_website")}
      />
      <input type="hidden" value="newsletter" {...register("source")} />
      <div className="flex-1">
        <label htmlFor="newsletter-email" className="sr-only">
          Email address
        </label>
        <input
          id="newsletter-email"
          type="email"
          placeholder="you@yourbrand.com"
          className="w-full border-0 border-b-2 border-ivory/25 bg-transparent px-0 py-2 text-ivory placeholder:text-ivory/60 transition-colors duration-200 focus:border-sandstone focus:outline-none focus:ring-0"
          aria-invalid={Boolean(errors.email)}
          aria-describedby={errors.email ? "newsletter-email-error" : undefined}
          {...register("email")}
        />
        {errors.email && (
          <span id="newsletter-email-error" className="mt-1 block text-xs text-clay">
            {errors.email.message}
          </span>
        )}
        {status === "error" && serverError && (
          <span ref={errorRef} tabIndex={-1} role="alert" className="mt-1 block text-xs text-clay focus:outline-none">
            {serverError}
          </span>
        )}
      </div>
      <Magnetic className="inline-block">
        <button
          type="submit"
          disabled={status === "submitting"}
          className="min-h-11 whitespace-nowrap rounded-full border border-ivory/30 px-5 py-2.5 text-sm font-medium text-ivory transition-all duration-300 ease-earth hover:-translate-y-0.5 hover:border-ivory/50 hover:bg-ivory/10 disabled:opacity-60 disabled:hover:translate-y-0"
        >
          {status === "submitting" ? "Sending…" : "Subscribe"}
        </button>
      </Magnetic>
    </form>
  );
}
