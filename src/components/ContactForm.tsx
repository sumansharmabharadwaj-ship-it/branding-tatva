"use client";

import {
  cloneElement,
  isValidElement,
  useEffect,
  useId,
  useRef,
  useState,
  type MouseEvent,
  type ReactElement,
} from "react";
import { AnimatePresence, motion } from "framer-motion";
import { CheckCircle2 } from "lucide-react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { contactSchema, brandStages, type ContactFormValues } from "@/lib/contact-schema";
import { cn } from "@/lib/utils";
import { Magnetic } from "@/components/Magnetic";
import { useSpotlight } from "@/hooks/useSpotlight";
import { useHydratedReducedMotion } from "@/hooks/useHydratedReducedMotion";
import { EASE_AIR } from "@/lib/motion";

type Status = "idle" | "submitting" | "success" | "error";

const inputClass =
  "mt-2 w-full border-0 border-b-2 border-border bg-transparent px-0 py-2.5 text-lg text-soil placeholder:text-foreground-secondary/50 transition-colors duration-200 focus:border-action-primary focus:outline-none focus:ring-0";

let rippleId = 0;

export function ContactForm({ deliveryEnabled }: { deliveryEnabled: boolean }) {
  const [status, setStatus] = useState<Status>("idle");
  const [serverError, setServerError] = useState<string | null>(null);
  const [showMore, setShowMore] = useState(false);
  const prefersReducedMotion = useHydratedReducedMotion();
  const buttonRef = useRef<HTMLButtonElement>(null);
  const successRef = useRef<HTMLDivElement>(null);
  const errorRef = useRef<HTMLParagraphElement>(null);
  const spotlightRef = useSpotlight(buttonRef, Boolean(prefersReducedMotion));
  const [ripples, setRipples] = useState<{ id: number; x: number; y: number }[]>([]);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ContactFormValues>({
    resolver: zodResolver(contactSchema),
  });

  useEffect(() => {
    if (status === "success") successRef.current?.focus();
    if (status === "error") errorRef.current?.focus();
  }, [status]);

  function handleButtonClick(event: MouseEvent<HTMLButtonElement>) {
    if (prefersReducedMotion) return;
    const rect = event.currentTarget.getBoundingClientRect();
    const id = rippleId++;
    setRipples((previous) => [
      ...previous,
      { id, x: event.clientX - rect.left, y: event.clientY - rect.top },
    ]);
    setTimeout(
      () => setRipples((previous) => previous.filter((ripple) => ripple.id !== id)),
      650,
    );
  }

  async function onSubmit(values: ContactFormValues) {
    setStatus("submitting");
    setServerError(null);

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });
      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        setServerError(data.error ?? "The enquiry could not be delivered. Please try again.");
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

  if (!deliveryEnabled) {
    return (
      <div
        role="status"
        className="rounded-2xl border border-border/60 bg-parchment/80 px-6 py-8 shadow-elevation-md sm:px-10 sm:py-10"
      >
        <p className="text-sm font-medium uppercase tracking-[0.16em] text-clay">Enquiry delivery</p>
        <h2 className="mt-3 font-display text-3xl font-normal text-soil">
          The secure message route is being connected.
        </h2>
        <p className="mt-4 max-w-xl text-sm leading-relaxed text-foreground-secondary">
          The form will open only when verified delivery is available. Until then, no message is accepted or shown as sent.
        </p>
      </div>
    );
  }

  if (status === "success") {
    return (
      <motion.div
        ref={successRef}
        tabIndex={-1}
        role="status"
        aria-live="polite"
        initial={prefersReducedMotion ? undefined : { opacity: 0, scale: 0.96, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.35, ease: EASE_AIR }}
        className="rounded-2xl border border-state-success/40 bg-state-success/10 p-6 focus:outline-none focus-visible:ring-2 focus-visible:ring-action-primary"
      >
        <motion.div
          initial={prefersReducedMotion ? undefined : { scale: 0.6, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.35, delay: 0.1, ease: EASE_AIR }}
        >
          <CheckCircle2 aria-hidden="true" className="h-10 w-10 text-state-success" strokeWidth={1.6} />
        </motion.div>
        <p className="mt-4 font-display text-2xl font-normal text-soil">Your message has been delivered.</p>
        <p className="mt-2 max-w-xl text-sm leading-relaxed text-foreground-secondary">
          Suman will review the context and reply directly to the work email you shared. If it is useful to continue, the reply will clarify the next decision before any conversation is scheduled.
        </p>
        <Link href="/work" className="mt-5 inline-flex text-sm font-medium text-action-primary-hover link-underline">
          Return to Work + Services
        </Link>
      </motion.div>
    );
  }

  return (
    <div
      className="rounded-2xl border border-border/60 px-6 py-8 shadow-elevation-md sm:px-10 sm:py-10"
      style={{ backgroundColor: "#F6F2EA" }}
    >
      <div>
        <p className="text-sm font-medium uppercase tracking-[0.16em] text-clay">Project enquiry</p>
        <h2 className="mt-3 font-display text-3xl font-normal text-soil sm:text-4xl">Start with the decision.</h2>
        <p className="mt-4 max-w-xl text-sm leading-relaxed text-foreground-secondary">
          Four essential details make the first reply useful. Add anything else only when it helps explain the situation.
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} noValidate className="mt-8 space-y-6">
        <input
          type="text"
          tabIndex={-1}
          autoComplete="off"
          className="hidden"
          aria-hidden="true"
          {...register("company_website")}
        />

        <div className="grid gap-6 sm:grid-cols-2">
          <Field label="Name" error={errors.name?.message}>
            <input autoComplete="name" className={inputClass} {...register("name")} />
          </Field>
          <Field label="Work email" error={errors.email?.message}>
            <input type="email" autoComplete="email" className={inputClass} {...register("email")} />
          </Field>
        </div>

        <Field label="Company or brand" error={errors.business?.message}>
          <input autoComplete="organization" className={inputClass} {...register("business")} />
        </Field>

        <Field label="What is changing, and what decision is waiting?" error={errors.description?.message}>
          <textarea rows={5} className={inputClass} {...register("description")} />
        </Field>

        <div className="border-t border-border/70 pt-5">
          <button
            type="button"
            aria-expanded={showMore}
            aria-controls="contact-more"
            onClick={() => setShowMore((value) => !value)}
            className="link-underline inline-flex min-h-11 items-center gap-2 text-sm font-medium text-clay transition-colors duration-300 hover:text-soil focus-ring-halo"
          >
            {showMore ? "Fewer details" : "Add timing, budget or useful context"}
            <span aria-hidden="true" className={cn("text-base transition-transform duration-300", showMore && "rotate-45")}>
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
                  className="mt-5 space-y-6"
                >
                  <Field label="Website or social link (optional)" error={errors.website?.message}>
                    <input inputMode="url" className={inputClass} {...register("website")} />
                  </Field>
                  <div className="grid gap-6 sm:grid-cols-2">
                    <Field
                      label="Phone (optional)"
                      hint="Share this only if you would prefer a callback."
                      error={errors.phone?.message}
                    >
                      <input type="tel" autoComplete="tel" className={inputClass} {...register("phone")} />
                    </Field>
                    <Field label="Where is the brand now? (optional)" error={errors.brandStage?.message}>
                      <select className={inputClass} defaultValue="" {...register("brandStage")}>
                        <option value="">Choose the closest fit</option>
                        {brandStages.map((stage) => (
                          <option key={stage} value={stage}>
                            {stage}
                          </option>
                        ))}
                      </select>
                    </Field>
                  </div>
                  <Field label="What kind of support may be useful? (optional)" error={errors.servicesNeeded?.message}>
                    <input className={inputClass} {...register("servicesNeeded")} placeholder="A rough idea is enough" />
                  </Field>
                  <div className="grid gap-6 sm:grid-cols-2">
                    <Field label="Timing (optional)" error={errors.timeline?.message}>
                      <input className={inputClass} {...register("timeline")} />
                    </Field>
                    <Field label="Budget or range (optional)" error={errors.budget?.message}>
                      <input className={inputClass} {...register("budget")} />
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
          <p
            ref={errorRef}
            tabIndex={-1}
            role="alert"
            className="rounded-sm border border-state-error/30 bg-state-error/10 p-3 text-sm text-state-error focus:outline-none"
          >
            {serverError}
          </p>
        )}

        <Magnetic className="inline-block">
          <button
            ref={buttonRef}
            type="submit"
            onClick={handleButtonClick}
            disabled={status === "submitting"}
            className="group/btn relative inline-flex min-h-11 items-center justify-center gap-1.5 overflow-hidden rounded-full bg-action-primary px-6 py-3 text-sm font-medium text-white transition-all duration-300 ease-earth hover:-translate-y-0.5 hover:bg-action-primary-hover hover:shadow-elevation-lg focus-ring-halo disabled:opacity-60 disabled:hover:translate-y-0 disabled:hover:shadow-none"
          >
            <span
              ref={spotlightRef}
              aria-hidden="true"
              className="cursor-spotlight pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300"
            />
            {!prefersReducedMotion && (
              <AnimatePresence>
                {ripples.map((ripple) => (
                  <motion.span
                    key={ripple.id}
                    aria-hidden="true"
                    className="pointer-events-none absolute rounded-full bg-current"
                    style={{ left: ripple.x, top: ripple.y, transform: "translate(-50%, -50%)" }}
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
    </div>
  );
}

function Field({
  label,
  hint,
  error,
  children,
}: {
  label: string;
  hint?: string;
  error?: string;
  children: ReactElement<{ "aria-invalid"?: boolean; "aria-describedby"?: string }>;
}) {
  const hintId = useId();
  const errorId = useId();
  const describedBy = [hint ? hintId : null, error ? errorId : null].filter(Boolean).join(" ") || undefined;

  return (
    <label className="block text-xs font-medium uppercase tracking-wide text-foreground-secondary">
      {label}
      {isValidElement(children)
        ? cloneElement(children, {
            "aria-invalid": Boolean(error),
            "aria-describedby": describedBy,
          })
        : children}
      {hint && (
        <span id={hintId} className="mt-1 block text-xs font-normal normal-case tracking-normal text-foreground-secondary">
          {hint}
        </span>
      )}
      {error && (
        <span id={errorId} className="mt-1 block text-xs font-normal normal-case tracking-normal text-state-error">
          {error}
        </span>
      )}
    </label>
  );
}
