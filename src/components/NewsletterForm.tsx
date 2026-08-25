"use client";

import { useHydratedReducedMotion } from "@/hooks/useHydratedReducedMotion";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion } from "framer-motion";
import { newsletterSchema, type NewsletterFormValues } from "@/lib/newsletter-schema";
import { Magnetic } from "@/components/Magnetic";
import { EASE_AIR } from "@/lib/motion";
import { track } from "@/lib/analytics";

type Status = "idle" | "submitting" | "success" | "already" | "error";

// A single-field sibling to ContactForm — same underline-only input
// language, same honeypot/status-machine shape, deliberately without
// any of ContactForm's own richness (spotlight, ripple) since this is
// meant to read as a quiet, low-commitment aside next to the real
// enquiry form, not a second version of it.
export function NewsletterForm({ readerPath }: { readerPath?: string }) {
  const [status, setStatus] = useState<Status>("idle");
  const [serverError, setServerError] = useState<string | null>(null);
  const prefersReducedMotion = useHydratedReducedMotion();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<NewsletterFormValues>({
    resolver: zodResolver(newsletterSchema),
  });

  async function onSubmit(values: NewsletterFormValues) {
    setStatus("submitting");
    setServerError(null);
    try {
      const res = await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...values, source: "newsletter" }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setServerError(data.error ?? "The inbox gate stayed closed. Please try once more.");
        setStatus("error");
        return;
      }
      const nextStatus = data.alreadySubscribed ? "already" : "success";
      setStatus(nextStatus);
      track("insights_field_note_requested", {
        reader_path: readerPath ?? "none",
        result: data.alreadySubscribed ? "already_held" : "confirmation_sent",
      });
      reset();
    } catch {
      setServerError(
        "The connection paused before the request arrived. Check the network and try once more.",
      );
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
        role="status"
        initial={prefersReducedMotion ? undefined : { opacity: 0, y: 6 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35, ease: EASE_AIR }}
        className="mt-4 text-sm text-ivory/85"
      >
        {status === "success"
          ? "Your place is held. A confirmation link is waiting in your inbox."
          : "Your place is already held."}
      </motion.p>
    );
  }

  return (
    <div className="mt-4 max-w-sm">
      <p className="text-xs font-medium uppercase tracking-[0.13em] text-sandstone">
        Where should the next field note land?
      </p>
      <form
        onSubmit={handleSubmit(onSubmit)}
        noValidate
        aria-busy={status === "submitting"}
        className="mt-3 flex flex-col gap-3 sm:flex-row sm:items-start"
      >
        {/* Honeypot — hidden from real users, visible to bots */}
        <input
          type="text"
          tabIndex={-1}
          autoComplete="off"
          className="hidden"
          aria-hidden="true"
          {...register("company_website")}
        />
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
            <span role="alert" className="mt-1 block text-xs text-clay">
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
            {status === "submitting" ? "Sending…" : "Send the next note"}
          </button>
        </Magnetic>
      </form>
      <p className="mt-3 text-xs leading-5 text-ivory/55">
        One confirmation email. Leave whenever the notes stop being useful.
      </p>
    </div>
  );
}
