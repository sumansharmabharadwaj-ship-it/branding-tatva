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
      eyebrow: "Field notes already active",
      title: "This inbox already receives Field Notes.",
      detail: label
        ? `${label} can keep guiding what you read here; the emails remain broad, occasional, and editorial.`
        : "The emails remain broad, occasional, and editorial.",
    };
  }

  return {
    eyebrow: "Confirmation sent",
    title: "One last step: open your inbox.",
    detail: label
      ? `${label} stays active on this page while you confirm your place for the next field note.`
      : "Confirm your place for the next field note from the email that just arrived.",
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
        setServerError(data.error ?? "The inbox gate stayed closed. Please try once more.");
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
    ? "Receive the next useful field note"
    : "Where should the next field note land?";
  const submitLabel =
    status === "submitting"
      ? "Sending…"
      : "Request field notes";
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
                  <strong>Next field note</strong>
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
              {isEvidenceThread
                ? "Double opt-in. Occasional and editorial—not a personalised drip sequence. Leave in one click."
                : "Double opt-in. Leave whenever the notes stop being useful."}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
