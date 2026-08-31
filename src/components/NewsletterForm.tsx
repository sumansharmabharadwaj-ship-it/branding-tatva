"use client";

import { useHydratedReducedMotion } from "@/hooks/useHydratedReducedMotion";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowUp, Check } from "lucide-react";
import { newsletterSchema, type NewsletterFormValues } from "@/lib/newsletter-schema";
import { Magnetic } from "@/components/Magnetic";
import { EASE_AIR } from "@/lib/motion";
import { track } from "@/lib/analytics";

type Status = "idle" | "submitting" | "success" | "already" | "error";

type ReaderThread = {
  label?: string;
  origin?: string;
  pathName?: string;
};

function getConfirmationCopy(
  status: "success" | "already",
  thread: ReaderThread,
) {
  const label = thread.label?.trim();

  if (status === "already") {
    return {
      eyebrow: "Already subscribed",
      title: "This inbox already receives Branding Tatva letters.",
      detail: label
        ? `${label} remains selected on this page. The emails are occasional and written for the whole list.`
        : "The emails are occasional and written for the whole list.",
    };
  }

  return {
    eyebrow: "Confirmation sent",
    title: "Confirm the request in your inbox.",
    detail: label
      ? `${label} stays selected on this page while you confirm the request.`
      : "Use the email that just arrived to confirm the request.",
  };
}

// A single-field sibling to ContactForm — same underline-only input
// language, same honeypot/status-machine shape, deliberately without
// any of ContactForm's own richness (spotlight, ripple) since this is
// meant to read as a quiet, low-commitment aside next to the real
// enquiry form, not a second version of it.
export function NewsletterForm({
  readerPath,
  readerOrigin,
  readerLabel,
  readerPathName,
}: {
  readerPath?: string;
  readerOrigin?: string;
  readerLabel?: string;
  readerPathName?: string;
}) {
  const [status, setStatus] = useState<Status>("idle");
  const [serverError, setServerError] = useState<string | null>(null);
  const [confirmedThread, setConfirmedThread] = useState<ReaderThread>({});
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
        setServerError(data.error ?? "The letter request did not reach the mailing list. Send it once more.");
        setStatus("error");
        return;
      }
      const nextStatus = data.alreadySubscribed ? "already" : "success";
      setConfirmedThread({
        label: readerLabel,
        origin: readerOrigin,
        pathName: readerPathName,
      });
      setStatus(nextStatus);
      track("insights_field_note_requested", {
        reader_path: readerPath ?? "none",
        reader_origin: readerOrigin ?? "none",
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

  const hasConfirmation = status === "success" || status === "already";
  const confirmation = hasConfirmation
    ? getConfirmationCopy(status, confirmedThread)
    : undefined;
  const isEvidenceThread = readerOrigin === "evidence-ledger";
  const formPrompt = isEvidenceThread
    ? "Receive future letters on this topic"
    : "Receive occasional letters from Branding Tatva";
  const submitLabel =
    status === "submitting"
      ? "Sending…"
      : "Request the letters";
  const returnCopy = confirmedThread.pathName
    ? `Return to ${confirmedThread.pathName} essays`
    : "Return to the essay library";

  return (
    <div className="mt-4 min-h-[6.5rem] max-w-sm">
      <AnimatePresence initial={false} mode="wait">
        {confirmation ? (
          <motion.div
            key={`${status}-${confirmedThread.origin ?? "open"}-${
              confirmedThread.label ?? "open"
            }`}
            role="status"
            initial={prefersReducedMotion ? false : { opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={prefersReducedMotion ? undefined : { opacity: 0, y: -4 }}
            transition={{
              duration: prefersReducedMotion ? 0 : 0.35,
              ease: EASE_AIR,
            }}
            className="flex min-h-[6.5rem] flex-col justify-center border-y border-ivory/15 py-3"
          >
            <p className="text-[0.65rem] font-medium uppercase tracking-[0.16em] text-sandstone">
              {confirmation.eyebrow}
            </p>
            <p className="mt-2 font-display text-xl leading-tight text-ivory">
              {confirmation.title}
            </p>
            <p className="mt-2 text-xs leading-5 text-ivory/60">
              {confirmation.detail}
            </p>
            {status === "success" ? (
              <ol
                className="insights-field-note__status"
                aria-label="Field note confirmation progress"
              >
                <li data-state="complete">
                  <Check aria-hidden="true" />
                  <span>Request received</span>
                </li>
                <li data-state="active">
                  <span>02</span>
                  <strong>Confirm in email</strong>
                </li>
                <li data-state="pending">
                  <span>03</span>
                  <strong>Future letters</strong>
                </li>
              </ol>
            ) : null}
            <a
              href="#insights-library-scene"
              className="insights-field-note__return"
              onClick={() =>
                track("insights_field_note_return_to_library", {
                  reader_path: readerPath ?? "none",
                  result: status,
                })
              }
            >
              {returnCopy}
              <ArrowUp aria-hidden="true" />
            </a>
          </motion.div>
        ) : (
          <motion.div
            key="field-note-form"
            initial={false}
            exit={prefersReducedMotion ? undefined : { opacity: 0, y: -4 }}
            transition={{
              duration: prefersReducedMotion ? 0 : 0.2,
              ease: EASE_AIR,
            }}
          >
            <p className="text-xs font-medium uppercase tracking-[0.13em] text-sandstone">
              {formPrompt}
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
                  aria-describedby={
                    errors.email ? "newsletter-email-error" : undefined
                  }
                  {...register("email")}
                />
                {errors.email && (
                  <span
                    id="newsletter-email-error"
                    className="mt-1 block text-xs text-clay"
                  >
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
                  {submitLabel}
                </button>
              </Magnetic>
            </form>
            <p className="mt-3 text-xs leading-5 text-ivory/55">
              You will receive a confirmation email. Leave whenever the letters stop being useful.
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
