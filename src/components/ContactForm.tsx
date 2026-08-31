"use client";

import { useHydratedReducedMotion } from "@/hooks/useHydratedReducedMotion";
import {
  cloneElement,
  isValidElement,
  useEffect,
  useId,
  useRef,
  useState,
  type KeyboardEvent,
  type MouseEvent,
  type ReactElement,
} from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useForm, type Path } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { CalendarDays, Check, CircleAlert, Copy, Mail, RotateCcw, X } from "lucide-react";
import { contactSchema, brandStages, type ContactFormValues } from "@/lib/contact-schema";
import { cn } from "@/lib/utils";
import { Magnetic } from "@/components/Magnetic";
import { useSpotlight } from "@/hooks/useSpotlight";
import { track } from "@/lib/analytics";
import { EASE_AIR } from "@/lib/motion";
import { site } from "@/data/site";
import { packages } from "@/data/services";
import {
  clearServicesContactPackage,
  useServicesContactPackage,
} from "@/hooks/useServicesContactPackage";
import { calendlyHrefForServicesPackage } from "@/lib/servicesJourney";

type Status = "idle" | "submitting" | "success" | "error";
type DraftStatus = "empty" | "restored" | "saving" | "saved";
type RecoveryCopyStatus = "idle" | "copied" | "error";
type ContactDraftField = Exclude<keyof ContactFormValues, "company_website" | "servicePackage">;
type ContactSubmission = { fingerprint: string; id: string };

const CONTACT_DRAFT_KEY = "branding-tatva:contact-note:v1";
const CONTACT_DRAFT_VERSION = 1;
const CONTACT_DRAFT_DELAY_MS = 360;
const CONTACT_DRAFT_LIMITS: Record<ContactDraftField, number> = {
  name: 120,
  email: 254,
  phone: 60,
  business: 160,
  website: 500,
  brandStage: 80,
  servicesNeeded: 1000,
  budget: 120,
  timeline: 120,
  description: 5000,
  referral: 200,
};
const CONTACT_DRAFT_FIELDS = Object.keys(
  CONTACT_DRAFT_LIMITS,
) as ContactDraftField[];
const OPTIONAL_DRAFT_FIELDS: ContactDraftField[] = [
  "phone",
  "business",
  "website",
  "brandStage",
  "servicesNeeded",
  "budget",
  "timeline",
  "referral",
];

function readContactDraft(): Partial<ContactFormValues> | null {
  try {
    const raw = window.sessionStorage.getItem(CONTACT_DRAFT_KEY);
    if (!raw) return null;
    const payload: unknown = JSON.parse(raw);
    if (!payload || typeof payload !== "object") return null;

    const version = "version" in payload ? payload.version : null;
    const values = "values" in payload ? payload.values : null;
    if (
      version !== CONTACT_DRAFT_VERSION ||
      !values ||
      typeof values !== "object"
    ) {
      window.sessionStorage.removeItem(CONTACT_DRAFT_KEY);
      return null;
    }

    const draft: Record<string, string> = {};
    const storedValues = values as Record<string, unknown>;
    for (const field of CONTACT_DRAFT_FIELDS) {
      const value = storedValues[field];
      if (typeof value === "string") {
        draft[field] = value.slice(0, CONTACT_DRAFT_LIMITS[field]);
      }
    }

    if (
      draft.brandStage &&
      !brandStages.includes(draft.brandStage as (typeof brandStages)[number])
    ) {
      delete draft.brandStage;
    }

    return Object.values(draft).some((value) => value.trim())
      ? (draft as Partial<ContactFormValues>)
      : null;
  } catch {
    return null;
  }
}

function persistContactDraft(values: ContactFormValues) {
  try {
    const draft: Record<string, string> = {};
    for (const field of CONTACT_DRAFT_FIELDS) {
      const value = values[field];
      if (typeof value === "string" && value.length > 0) {
        draft[field] = value.slice(0, CONTACT_DRAFT_LIMITS[field]);
      }
    }

    if (!Object.values(draft).some((value) => value.trim())) {
      window.sessionStorage.removeItem(CONTACT_DRAFT_KEY);
      return;
    }

    window.sessionStorage.setItem(
      CONTACT_DRAFT_KEY,
      JSON.stringify({ version: CONTACT_DRAFT_VERSION, values: draft }),
    );
  } catch {
    // Storage may be unavailable in a restricted/private browser. The form
    // remains fully functional; only this same-tab convenience stands down.
  }
}

function hasContactDraftValues(values: ContactFormValues) {
  return CONTACT_DRAFT_FIELDS.some((field) => {
    const value = values[field];
    return typeof value === "string" && Boolean(value.trim());
  });
}

function emptyContactFormValues(
  servicePackage?: ContactFormValues["servicePackage"],
): ContactFormValues {
  return {
    name: "",
    email: "",
    phone: "",
    business: "",
    website: "",
    brandStage: undefined,
    servicesNeeded: "",
    budget: "",
    timeline: "",
    description: "",
    referral: "",
    servicePackage,
    company_website: "",
  };
}

function clearContactDraft() {
  try {
    window.sessionStorage.removeItem(CONTACT_DRAFT_KEY);
  } catch {}
}

// Underline-only fields, not full bordered boxes — per direct feedback
// pointing at tile.pt's own "let's talk" form as a bar to match: bigger,
// more confident type instead of small clinical inputs sitting in a
// grid of near-identical rectangles. `bg-transparent` (not warm-white)
// so the field reads as part of the page, not a boxed form widget.
const inputClass =
  "mt-1.5 w-full border-0 border-b border-soil/18 bg-transparent px-0 py-2.5 text-base text-soil placeholder:text-foreground-secondary/45 transition-[border-color,background-color] duration-300 aria-[invalid=true]:border-state-error/70 focus:border-action-primary focus:bg-white/20 focus:outline-none focus:ring-0 sm:mt-2 sm:py-3 sm:text-lg";

let rippleId = 0;

const SUCCESS_STEPS = [
  ["01", "Delivered", "Your enquiry is in."],
  ["02", "Read personally", "Suman reviews the note."],
  ["03", "Reply", "Suman responds by email."],
] as const;

const FORM_FIELD_ORDER: ReadonlyArray<{
  name: Path<ContactFormValues>;
  label: string;
}> = [
  { name: "name", label: "your name" },
  { name: "email", label: "your email" },
  { name: "description", label: "your question" },
  { name: "business", label: "your brand name" },
  { name: "phone", label: "your phone number" },
  { name: "website", label: "your website" },
  { name: "brandStage", label: "your brand stage" },
  { name: "servicesNeeded", label: "the support you need" },
  { name: "budget", label: "your budget" },
  { name: "timeline", label: "your timeline" },
  { name: "referral", label: "how you found us" },
];

const REQUIRED_FIELD_NAMES = new Set<Path<ContactFormValues>>(["name", "email", "description"]);

// The submit button is the single most consequential click on the site,
// yet it was the only primary CTA with none of LinkButton's signature
// interactions (cursor-spotlight sheen, click ripple) — it can't reuse
// LinkButton directly (that component renders a Next Link, this needs a
// real form-submit button), so the same two effects are wired here by
// hand instead.
export function ContactForm() {
  const [status, setStatus] = useState<Status>("idle");
  const [serverError, setServerError] = useState<string | null>(null);
  const [serverRequestId, setServerRequestId] = useState<string | null>(null);
  const [successMinHeight, setSuccessMinHeight] = useState<number | null>(null);
  const [receiptEmail, setReceiptEmail] = useState<string | null>(null);
  const [draftStatus, setDraftStatus] = useState<DraftStatus>("empty");
  const [recoveryCopyStatus, setRecoveryCopyStatus] = useState<RecoveryCopyStatus>("idle");
  const servicePackage = useServicesContactPackage();
  const selectedPackage = packages.find((entry) => entry.slug === servicePackage);
  const bookingHref = calendlyHrefForServicesPackage(site.calendlyUrl, servicePackage);
  const prefersReducedMotion = useHydratedReducedMotion();
  const cardRef = useRef<HTMLDivElement>(null);
  const formRef = useRef<HTMLFormElement>(null);
  const recoveryRef = useRef<HTMLDivElement>(null);
  const successRef = useRef<HTMLDivElement>(null);
  const packageStatusRef = useRef<HTMLParagraphElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const draftTimerRef = useRef<number | null>(null);
  const submissionRef = useRef<ContactSubmission | null>(null);
  const rippleTimersRef = useRef<Set<number>>(new Set());
  const spotlightRef = useSpotlight(buttonRef, Boolean(prefersReducedMotion));
  const [ripples, setRipples] = useState<{ id: number; x: number; y: number }[]>([]);
  const [packageNotice, setPackageNotice] = useState("");
  // Manual guide p38 and Suman's reference panel: ask only what is
  // needed up front. Three essential fields carry the enquiry; the
  // seven optional ones stay one click away rather than gone, so a
  // visitor who wants to say more still can.
  const [showMore, setShowMore] = useState(false);
  const hasDraft = draftStatus !== "empty";
  const draftStatusCopy =
    draftStatus === "restored"
      ? "Your unfinished note was restored in this tab."
      : draftStatus === "saving"
        ? "Saving in this tab."
        : draftStatus === "saved"
          ? "Saved in this tab."
          : "Unfinished notes stay in this tab.";
  const serverReference = serverRequestId?.replaceAll("-", "").slice(0, 12) ?? null;

  function handleButtonClick(e: MouseEvent<HTMLButtonElement>) {
    if (prefersReducedMotion || e.detail === 0) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const id = rippleId++;
    setRipples((prev) => [...prev, { id, x: e.clientX - rect.left, y: e.clientY - rect.top }]);
    const timer = window.setTimeout(() => {
      setRipples((prev) => prev.filter((r) => r.id !== id));
      rippleTimersRef.current.delete(timer);
    }, 650);
    rippleTimersRef.current.add(timer);
  }

  const {
    register,
    handleSubmit,
    reset,
    getValues,
    setFocus,
    watch,
    formState: { errors, submitCount },
  } = useForm<ContactFormValues>({
    resolver: zodResolver(contactSchema),
  });

  function moveToNextRequiredField(
    event: KeyboardEvent<HTMLInputElement>,
    nextField: "email" | "description",
  ) {
    if (event.key !== "Enter" || event.nativeEvent.isComposing) return;
    event.preventDefault();
    setFocus(nextField);
  }

  const requiredDetails = watch(["name", "email", "description"]);
  const requiredDetailChecks = [
    contactSchema.shape.name.safeParse(requiredDetails[0] ?? "").success,
    contactSchema.shape.email.safeParse(requiredDetails[1] ?? "").success,
    contactSchema.shape.description.safeParse(requiredDetails[2] ?? "").success,
  ];
  const completedDetails = requiredDetailChecks.filter(Boolean).length;
  const completionLabel =
    completedDetails === 3
      ? "Required details complete"
      : completedDetails > 0
        ? `${completedDetails} of 3 required details complete`
        : "Three required details";
  const invalidFields = FORM_FIELD_ORDER.filter(({ name }) => Boolean(errors[name]));
  const firstInvalidField = invalidFields[0];
  const showValidationRecovery = submitCount > 0 && invalidFields.length > 0 && status !== "error";

  useEffect(() => {
    const draft = readContactDraft();
    if (!draft) return;

    reset(draft);
    setShowMore(
      OPTIONAL_DRAFT_FIELDS.some((field) => {
        const value = draft[field];
        return typeof value === "string" && Boolean(value.trim());
      }),
    );
    setDraftStatus("restored");
  }, [reset]);

  useEffect(() => {
    const subscription = watch(() => {
      if (draftTimerRef.current !== null) {
        window.clearTimeout(draftTimerRef.current);
      }
      const hasValues = hasContactDraftValues(getValues());
      setDraftStatus(hasValues ? "saving" : "empty");
      draftTimerRef.current = window.setTimeout(() => {
        const values = getValues();
        persistContactDraft(values);
        setDraftStatus(hasContactDraftValues(values) ? "saved" : "empty");
        draftTimerRef.current = null;
      }, CONTACT_DRAFT_DELAY_MS);
    });

    const persistLatestDraft = () => {
      persistContactDraft(getValues());
    };
    const persistWhenHidden = () => {
      if (document.visibilityState === "hidden") persistLatestDraft();
    };

    window.addEventListener("pagehide", persistLatestDraft);
    document.addEventListener("visibilitychange", persistWhenHidden);

    return () => {
      subscription.unsubscribe();
      window.removeEventListener("pagehide", persistLatestDraft);
      document.removeEventListener("visibilitychange", persistWhenHidden);
      if (draftTimerRef.current !== null) {
        window.clearTimeout(draftTimerRef.current);
        draftTimerRef.current = null;
      }
      persistContactDraft(getValues());
    };
  }, [getValues, watch]);

  useEffect(() => {
    if (status !== "success" && status !== "error" && !showValidationRecovery) return;
    const frame = window.requestAnimationFrame(() => {
      if (status === "success") successRef.current?.focus({ preventScroll: true });
      else recoveryRef.current?.focus({ preventScroll: true });
    });
    return () => window.cancelAnimationFrame(frame);
  }, [showValidationRecovery, status, submitCount]);

  useEffect(() => {
    const timers = rippleTimersRef.current;
    return () => {
      timers.forEach((timer) => window.clearTimeout(timer));
      timers.clear();
    };
  }, []);

  async function onSubmit(values: ContactFormValues) {
    setStatus("submitting");
    setServerError(null);
    setServerRequestId(null);
    setRecoveryCopyStatus("idle");
    const submissionValues: ContactFormValues = servicePackage
      ? { ...values, servicePackage }
      : values;
    const fingerprint = JSON.stringify(submissionValues);
    if (submissionRef.current?.fingerprint !== fingerprint) {
      submissionRef.current = { fingerprint, id: crypto.randomUUID() };
    }
    const submissionId = submissionRef.current.id;
    const controller = new AbortController();
    const timeout = window.setTimeout(() => controller.abort(), 15_000);
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-Contact-Submission": submissionId,
        },
        body: JSON.stringify(submissionValues),
        signal: controller.signal,
      });
      const data: unknown = await res.json().catch(() => null);
      const deliveryConfirmed =
        res.ok &&
        data !== null &&
        typeof data === "object" &&
        "ok" in data &&
        data.ok === true;
      const requestId =
        data &&
        typeof data === "object" &&
        "requestId" in data &&
        typeof data.requestId === "string"
          ? data.requestId
          : null;
      if (!deliveryConfirmed) {
        const message =
          data && typeof data === "object" && "error" in data && typeof data.error === "string"
            ? data.error
            : "The server returned no delivery confirmation. Send the note once more.";
        track("contact_form_delivery_failed", {
          source: "contact_form",
          reason: "server",
          status: res.status,
        });
        setServerRequestId(requestId);
        setServerError(message);
        setStatus("error");
        return;
      }
      const measuredHeight = cardRef.current?.getBoundingClientRect().height;
      // Preserve the compact form-to-confirmation handoff without inheriting
      // the full height of an expanded optional-details form. A success card
      // should settle within roughly one viewport, never create a blank tail.
      setSuccessMinHeight(
        measuredHeight
          ? Math.min(measuredHeight, Math.max(window.innerHeight - 64, 0))
          : null,
      );
      clearContactDraft();
      submissionRef.current = null;
      setDraftStatus("empty");
      setReceiptEmail(values.email.trim());
      setServerRequestId(requestId);
      setStatus("success");
      track("contact_form_submitted", {
        source: "contact_form",
        optional_details_opened: showMore,
      });
      reset(emptyContactFormValues(servicePackage ?? undefined));
    } catch (error) {
      const timedOut = error instanceof DOMException && error.name === "AbortError";
      track("contact_form_delivery_failed", {
        source: "contact_form",
        reason: timedOut ? "timeout" : "network",
      });
      setServerError(
        timedOut
          ? "No delivery confirmation arrived within fifteen seconds. Send the note once more or email Suman directly."
          : "No delivery confirmation came back. Check your connection, then send the note once more.",
      );
      setServerRequestId(null);
      setStatus("error");
    } finally {
      window.clearTimeout(timeout);
    }
  }

  function onInvalid() {
    track("contact_form_validation_failed", { source: "contact_form" });
    setStatus("idle");
    setServerError(null);
    setServerRequestId(null);
    setRecoveryCopyStatus("idle");
  }

  function focusInvalidField() {
    if (!firstInvalidField) return;
    const focusControl = () => {
      const control = formRef.current?.elements.namedItem(firstInvalidField.name);
      if (control instanceof HTMLElement) control.focus();
    };

    if (!REQUIRED_FIELD_NAMES.has(firstInvalidField.name) && !showMore) {
      setShowMore(true);
      window.requestAnimationFrame(() => window.requestAnimationFrame(focusControl));
      return;
    }
    focusControl();
  }

  function startAnotherNote() {
    setStatus("idle");
    setSuccessMinHeight(null);
    setReceiptEmail(null);
    setRecoveryCopyStatus("idle");
    window.requestAnimationFrame(() => setFocus("name"));
  }

  function clearSavedNote() {
    clearContactDraft();
    reset(emptyContactFormValues(servicePackage ?? undefined));
    setDraftStatus("empty");
    setShowMore(false);
    setServerError(null);
    setServerRequestId(null);
    setReceiptEmail(null);
    setRecoveryCopyStatus("idle");
    submissionRef.current = null;
    setStatus("idle");
    track("contact_route_selected", { source: "contact_form", route: "draft_cleared" });
    window.requestAnimationFrame(() => setFocus("name"));
  }

  function removeSelectedPackage() {
    if (!selectedPackage || !servicePackage) return;

    const removedPackageName = selectedPackage.name;
    clearServicesContactPackage();
    setPackageNotice(
      `${removedPackageName} was removed. Your note stays here.`,
    );
    submissionRef.current = null;
    track("contact_route_selected", {
      source: "contact_form",
      route: "package_cleared",
      package: servicePackage,
    });
    window.requestAnimationFrame(() =>
      packageStatusRef.current?.focus({ preventScroll: true }),
    );
  }

  function buildFallbackNote() {
    const values = getValues();
    const name = values.name?.trim();
    const email = values.email?.trim();
    const phone = values.phone?.trim();
    const business = values.business?.trim();
    const website = values.website?.trim();
    const brandStage = values.brandStage?.trim();
    const servicesNeeded = values.servicesNeeded?.trim();
    const budget = values.budget?.trim();
    const timeline = values.timeline?.trim();
    const question = values.description?.trim();
    const referral = values.referral?.trim();

    return [
      "Hello Suman,",
      "",
      question || "I would like to discuss my brand.",
      "",
      name && `Name: ${name}`,
      email && `Email: ${email}`,
      phone && `Phone: ${phone}`,
      business && `Brand: ${business}`,
      website && `Website or social: ${website}`,
      brandStage && `Brand stage: ${brandStage}`,
      servicesNeeded && `Support needed: ${servicesNeeded}`,
      budget && `Budget: ${budget}`,
      timeline && `Timeline: ${timeline}`,
      referral && `Found Branding Tatva through: ${referral}`,
      selectedPackage && `Selected package: ${selectedPackage.name}`,
      serverReference && `Reference: ${serverReference}`,
    ]
      .filter(Boolean)
      .join("\n");
  }

  function handleEmailFallbackClick(event: MouseEvent<HTMLAnchorElement>) {
    const name = getValues("name")?.trim();
    const subject = name ? `Brand enquiry from ${name}` : "Brand enquiry";
    const body = buildFallbackNote();

    event.currentTarget.href = `mailto:${site.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    track("contact_route_selected", {
      source: "contact_form_recovery",
      route: "email_with_note",
      ...(servicePackage ? { package: servicePackage } : {}),
    });
  }

  async function copyRecoveryNote() {
    const note = buildFallbackNote();
    try {
      if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(note);
      } else {
        const fallback = document.createElement("textarea");
        fallback.value = note;
        fallback.setAttribute("readonly", "");
        fallback.style.position = "fixed";
        fallback.style.opacity = "0";
        document.body.appendChild(fallback);
        fallback.select();
        const copied = document.execCommand("copy");
        fallback.remove();
        if (!copied) throw new Error("Copy command was unavailable");
      }
      setRecoveryCopyStatus("copied");
      track("contact_route_selected", {
        source: "contact_form_recovery",
        route: "note_copied",
      });
    } catch {
      setRecoveryCopyStatus("error");
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
        ref={successRef}
        tabIndex={-1}
        role="status"
        aria-labelledby="contact-success-heading"
        data-contact-form-card
        data-contact-form-success
        initial={prefersReducedMotion ? undefined : { opacity: 0.72, scale: 0.985, clipPath: "inset(0 0 12% 0 round 2rem)" }}
        animate={{ opacity: 1, scale: 1, clipPath: "inset(0 0 0% 0 round 2rem)" }}
        transition={{ duration: 0.52, ease: EASE_AIR }}
        style={{ minHeight: successMinHeight ?? undefined }}
        className="flex rounded-[2rem] border border-white/55 bg-[#F6F2EA]/88 px-6 py-8 shadow-[0_30px_100px_rgba(26,38,27,0.2)] backdrop-blur-3xl focus:outline-none sm:px-10 sm:py-10"
      >
        <div className="my-auto w-full">
          <motion.span
            aria-hidden="true"
            initial={prefersReducedMotion ? undefined : { scale: 0.72, rotate: -8, opacity: 0 }}
            animate={{ scale: 1, rotate: 0, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.12, ease: EASE_AIR }}
            className="mx-auto flex h-14 w-14 items-center justify-center rounded-full border border-state-success/30 bg-state-success/10 text-state-success"
          >
            <Check className="h-6 w-6" strokeWidth={1.7} />
          </motion.span>

          <div className="mx-auto mt-6 max-w-lg text-center">
            <p className="text-[0.65rem] font-medium uppercase tracking-[0.22em] text-clay">
              Your note has arrived
            </p>
            <h3 id="contact-success-heading" className="mt-3 font-display text-3xl font-normal leading-tight text-soil sm:text-4xl">
              Your words are with Suman.
            </h3>
            <p className="mx-auto mt-4 max-w-md text-sm leading-relaxed text-foreground-secondary sm:text-base">
              The note arrived exactly as written. Suman will read the brand problem herself and reply by email.
            </p>
            {receiptEmail ? (
              <div
                data-contact-success-destination
                className="mx-auto mt-4 w-fit max-w-full rounded-2xl border border-soil/10 bg-white/35 px-4 py-2.5 text-xs leading-relaxed text-soil/62"
              >
                <p>
                  Replying to <strong className="break-all font-medium text-soil">{receiptEmail}</strong>
                </p>
                {serverReference ? (
                  <p className="mt-1 text-[0.62rem] uppercase tracking-[0.12em] text-soil/42">
                    Enquiry reference <span className="font-medium text-soil/62">{serverReference}</span>
                  </p>
                ) : null}
              </div>
            ) : null}
          </div>

          <ol className="mx-auto mt-6 grid max-w-2xl grid-cols-3 gap-1.5 sm:mt-8 sm:gap-2" aria-label="What happens next">
            {SUCCESS_STEPS.map(([index, title, detail], stepIndex) => (
              <motion.li
                key={title}
                initial={prefersReducedMotion ? undefined : { opacity: 0, scaleX: 0.94 }}
                animate={{ opacity: 1, scaleX: 1 }}
                transition={{ duration: 0.42, delay: 0.2 + stepIndex * 0.1, ease: EASE_AIR }}
                className={`rounded-xl border px-2.5 py-3 text-left sm:rounded-2xl sm:px-4 sm:py-4 ${
                  stepIndex === 0
                    ? "border-state-success/25 bg-state-success/[0.07]"
                    : "border-soil/10 bg-white/25"
                }`}
              >
                <span className={`text-[0.6rem] font-medium uppercase tracking-[0.18em] ${stepIndex === 0 ? "text-state-success" : "text-soil/38"}`}>
                  {index}
                </span>
                <strong className="mt-1.5 block font-display text-[0.92rem] font-normal leading-tight text-soil sm:mt-2 sm:text-lg">{title}</strong>
                <span className="mt-1 hidden text-xs leading-relaxed text-soil/58 sm:block">{detail}</span>
              </motion.li>
            ))}
          </ol>

          <div className="mt-6 flex items-center justify-center gap-2 sm:mt-8 sm:gap-3">
            <a
              href={bookingHref}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() =>
                track("calendar_opened", {
                  source: "contact_form_success",
                  ...(servicePackage ? { package: servicePackage } : {}),
                })
              }
              data-cursor-label="Book a session"
              className="inline-flex min-h-11 flex-1 items-center justify-center rounded-full bg-soil px-3 py-2 text-xs font-medium text-ivory transition-[transform,background-color] duration-300 hover:-translate-y-0.5 hover:bg-action-primary-hover focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-3 focus-visible:outline-clay sm:min-h-12 sm:flex-none sm:px-5 sm:py-3 sm:text-sm"
            >
              <CalendarDays aria-hidden="true" className="mr-2 h-4 w-4" strokeWidth={1.5} />
              Book a session
            </a>
            <button
              type="button"
              onClick={startAnotherNote}
              data-cursor-label="Write another note"
              className="inline-flex min-h-11 flex-1 items-center justify-center rounded-full border border-soil/15 bg-white/30 px-3 py-2 text-xs font-medium text-soil transition-colors duration-300 hover:bg-white/60 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-3 focus-visible:outline-clay sm:min-h-12 sm:flex-none sm:px-5 sm:py-3 sm:text-sm"
            >
              <RotateCcw aria-hidden="true" className="mr-2 h-4 w-4" strokeWidth={1.5} />
              Write another note
            </button>
          </div>
        </div>
      </motion.div>
    );
  }

  return (
    <div
      ref={cardRef}
      data-contact-form-card
      data-contact-form-completion={completedDetails}
      data-contact-form-expanded={showMore ? "true" : undefined}
      className="rounded-[2rem] border border-white/55 bg-[#F6F2EA]/88 px-6 py-7 shadow-[0_30px_100px_rgba(26,38,27,0.2)] backdrop-blur-3xl sm:px-10 sm:py-9"
    >
      {/* The panel mirrors the booking card beside it — cream ground,
          italic display accent, serif line, and the sprig divider —
          so the two paths on this page read as siblings rather than
          a styled card next to a bare form. */}
      <div data-contact-form-intro className="text-center">
        <p className="text-[0.65rem] font-medium uppercase tracking-[0.22em] text-clay">The brand problem, in your words</p>
        <p className="mt-3 font-display text-3xl font-normal leading-tight text-soil sm:text-4xl">What needs to change in perception?</p>
        <p className="mx-auto mt-4 max-w-sm text-sm leading-relaxed text-foreground-secondary">
          Name the decision, who needs to believe it, and what currently refuses to resolve. Only three details are required.
        </p>
        {selectedPackage ? (
          <div
            data-contact-form-package="true"
            className="mx-auto mt-5 flex max-w-md items-start gap-3 rounded-2xl border border-clay/20 bg-clay/[0.06] px-4 py-3 text-left"
          >
            <span className="min-w-0 flex-1">
              <span className="block text-[0.6rem] font-medium uppercase tracking-[0.18em] text-soil/45">
                Selected engagement
              </span>
              <strong className="mt-1 block font-display text-lg font-normal leading-tight text-clay">
                {selectedPackage.name}
              </strong>
              <span className="mt-1.5 block text-xs leading-relaxed text-soil/58">
                This appears with your note and booking links. Remove it if the enquiry has changed.
              </span>
            </span>
            <button
              type="button"
              onClick={removeSelectedPackage}
              data-contact-form-package-remove
              data-cursor-label="Remove package"
              aria-label={`Remove ${selectedPackage.name} from this enquiry`}
              className="inline-flex min-h-11 shrink-0 items-center gap-1.5 rounded-full border border-soil/12 bg-white/35 px-3 py-2 text-[0.68rem] font-medium text-soil/62 transition-[background-color,color] duration-300 hover:bg-white/70 hover:text-soil focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-clay"
            >
              Remove
              <X aria-hidden="true" className="h-3.5 w-3.5" strokeWidth={1.5} />
            </button>
          </div>
        ) : null}
      </div>

      <div
        data-contact-form-progress
        className="mt-6 rounded-2xl border border-soil/10 bg-white/30 px-4 py-3"
        role="progressbar"
        aria-label="Required enquiry details"
        aria-valuemin={0}
        aria-valuemax={3}
        aria-valuenow={completedDetails}
        aria-valuetext={completionLabel}
      >
        <div className="flex items-center justify-between gap-4">
          <p className="text-[0.65rem] font-medium uppercase tracking-[0.18em] text-soil/48">Conversation note</p>
          <p className="text-xs text-soil/58" aria-live="polite">{completionLabel}</p>
        </div>
        <div className="mt-3 h-px overflow-hidden bg-soil/12" aria-hidden="true">
          <motion.span
            className="block h-full origin-left bg-clay"
            initial={false}
            animate={{ scaleX: completedDetails / 3 }}
            transition={{ duration: prefersReducedMotion ? 0 : 0.45, ease: EASE_AIR }}
          />
        </div>
        <div className="mt-2 grid grid-cols-3 gap-2" aria-hidden="true">
          {["Name", "Email", "Question"].map((label, index) => (
            <span
              key={label}
              className={`flex items-center gap-1.5 text-[0.58rem] font-medium uppercase tracking-[0.12em] transition-colors duration-300 ${
                requiredDetailChecks[index] ? "text-clay" : "text-soil/34"
              }`}
            >
              <span
                className={`h-1.5 w-1.5 shrink-0 rounded-full transition-colors duration-300 ${
                  requiredDetailChecks[index] ? "bg-clay" : "bg-soil/15"
                }`}
              />
              {label}
            </span>
          ))}
        </div>
      </div>

      <p
        ref={packageStatusRef}
        tabIndex={-1}
        role="status"
        aria-live="polite"
        aria-atomic="true"
        data-contact-form-package-status
        className="sr-only"
      >
        {packageNotice}
      </p>

      <form
        ref={formRef}
        data-contact-form-body
        data-service-package={servicePackage ?? undefined}
        onSubmit={handleSubmit(onSubmit, onInvalid)}
        noValidate
        aria-busy={status === "submitting"}
        className="mt-6 space-y-5"
      >
      {/* Honeypot — hidden from real users, visible to bots */}
      <input
        type="text"
        maxLength={200}
        tabIndex={-1}
        autoComplete="off"
        className="hidden"
        aria-hidden="true"
        {...register("company_website")}
      />
      <div data-contact-required-grid className="grid grid-cols-2 gap-4 sm:gap-5">
        <Field label="01 Your name" error={errors.name?.message}>
          <input
            required
            aria-required="true"
            autoComplete="name"
            autoCapitalize="words"
            enterKeyHint="next"
            maxLength={CONTACT_DRAFT_LIMITS.name}
            data-contact-mobile-next="email"
            onKeyDown={(event) => moveToNextRequiredField(event, "email")}
            className={inputClass}
            {...register("name")}
          />
        </Field>
        <Field label="02 Your email" error={errors.email?.message}>
          <input
            required
            aria-required="true"
            type="email"
            inputMode="email"
            autoComplete="email"
            autoCapitalize="none"
            autoCorrect="off"
            enterKeyHint="next"
            spellCheck={false}
            maxLength={CONTACT_DRAFT_LIMITS.email}
            data-contact-mobile-next="description"
            onKeyDown={(event) => moveToNextRequiredField(event, "description")}
            className={inputClass}
            {...register("email")}
          />
        </Field>
      </div>

      <div data-contact-form-question>
        <Field
          label="03 Which brand decision cannot move forward?"
          hint="Positioning, voice, identity, offer structure, recognition, or something harder to name. A few lines are enough."
          error={errors.description?.message}
        >
          <textarea
            required
            aria-required="true"
            rows={4}
            autoCapitalize="sentences"
            spellCheck
            maxLength={CONTACT_DRAFT_LIMITS.description}
            className={inputClass}
            {...register("description")}
          />
        </Field>
      </div>

      {/* The optional seven, kept and reachable rather than removed. */}
      <div className="border-t border-soil/10 pt-5">
        <button
          type="button"
          aria-expanded={showMore}
          aria-controls="contact-more"
          onClick={() => setShowMore((v) => !v)}
          data-cursor-label={showMore ? "Close details" : "Add details"}
          className="link-underline inline-flex min-h-11 items-center gap-2 py-2 text-sm font-medium text-clay transition-colors duration-300 hover:text-soil"
        >
          {showMore ? "Fewer details" : "Add useful context"}
          <span aria-hidden="true" className={`text-base transition-transform duration-300 ${showMore ? "rotate-45" : ""}`}>
            +
          </span>
        </button>

        <div id="contact-more">
          <AnimatePresence initial={false}>
            {showMore && (
              <motion.div
                initial={prefersReducedMotion ? undefined : { opacity: 0.65, scaleY: 0.94, clipPath: "inset(0 0 100% 0 round 1rem)" }}
                animate={{ opacity: 1, scaleY: 1, clipPath: "inset(0 0 0% 0 round 0rem)" }}
                exit={prefersReducedMotion ? undefined : { opacity: 0, scaleY: 0.97, clipPath: "inset(0 0 100% 0 round 1rem)" }}
                transition={{ duration: 0.35, ease: EASE_AIR }}
                className="mt-5 space-y-5"
                style={{ transformOrigin: "top" }}
              >
                <p className="text-xs leading-relaxed text-soil/52">
                  Add only the context already at hand. Every field below is optional.
                </p>
                <fieldset className="space-y-5">
                  <legend className="sr-only">About the brand</legend>
                  <div className="grid gap-5 sm:grid-cols-2">
                    <Field label="Business or brand name" error={errors.business?.message}>
                      <input autoComplete="organization" maxLength={CONTACT_DRAFT_LIMITS.business} className={inputClass} {...register("business")} />
                    </Field>
                    <Field label="Phone (optional)" error={errors.phone?.message}>
                      <input type="tel" inputMode="tel" autoComplete="tel" maxLength={CONTACT_DRAFT_LIMITS.phone} className={inputClass} {...register("phone")} />
                    </Field>
                  </div>
                  <Field label="Website or social link (optional)" error={errors.website?.message}>
                    <input type="url" inputMode="url" autoComplete="url" maxLength={CONTACT_DRAFT_LIMITS.website} className={inputClass} {...register("website")} />
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
                </fieldset>
                <fieldset className="space-y-5 border-t border-soil/10 pt-5">
                  <legend className="sr-only">Scope and timing</legend>
                  <Field label="What do you think you need?" error={errors.servicesNeeded?.message}>
                    <input maxLength={CONTACT_DRAFT_LIMITS.servicesNeeded} className={inputClass} {...register("servicesNeeded")} placeholder="Name the work you have in mind" />
                  </Field>
                  <div className="grid gap-5 sm:grid-cols-2">
                    <Field label="Estimated budget (optional)" error={errors.budget?.message}>
                      <input maxLength={CONTACT_DRAFT_LIMITS.budget} className={inputClass} {...register("budget")} />
                    </Field>
                    <Field label="Desired timeline (optional)" error={errors.timeline?.message}>
                      <input maxLength={CONTACT_DRAFT_LIMITS.timeline} className={inputClass} {...register("timeline")} />
                    </Field>
                  </div>
                  <Field label="How did you find Branding Tatva? (optional)" error={errors.referral?.message}>
                    <input maxLength={CONTACT_DRAFT_LIMITS.referral} className={inputClass} {...register("referral")} />
                  </Field>
                </fieldset>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* A single resolution line keeps validation and delivery recovery
          in the same paper-reveal language as the rest of the scene.
          It stays beside the submit action and takes focus without
          moving the viewport; returning to a field remains the user's
          explicit choice. */}
      <AnimatePresence initial={false}>
        {showValidationRecovery && firstInvalidField ? (
          <motion.div
            key="validation-recovery"
            ref={recoveryRef}
            tabIndex={-1}
            role="alert"
            data-contact-form-resolution
            initial={prefersReducedMotion ? undefined : { opacity: 0.65, scaleX: 0.97, clipPath: "inset(0 8% 0 0 round 1rem)" }}
            animate={{ opacity: 1, scaleX: 1, clipPath: "inset(0 0% 0 0 round 1rem)" }}
            exit={prefersReducedMotion ? undefined : { opacity: 0, scaleX: 0.985, clipPath: "inset(0 0 0 14% round 1rem)" }}
            transition={{ duration: 0.34, ease: EASE_AIR }}
            className="flex origin-left items-center gap-3 rounded-2xl border border-state-error/18 bg-[#F3E8DE]/75 px-4 py-3 text-soil focus:outline-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-clay"
          >
            <CircleAlert aria-hidden="true" className="h-4 w-4 shrink-0 text-state-error" strokeWidth={1.5} />
            <p className="min-w-0 flex-1 text-sm leading-relaxed">
              {invalidFields.length === 1 ? "One detail needs" : `${invalidFields.length} details need`} a second look.
            </p>
            <button
              type="button"
              onClick={focusInvalidField}
              data-cursor-label="Review detail"
              className="inline-flex min-h-11 shrink-0 items-center px-1 text-xs font-medium text-clay underline decoration-clay/30 underline-offset-4 transition-colors hover:text-soil focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-clay"
            >
              Review {firstInvalidField.label}
            </button>
          </motion.div>
        ) : status === "error" && serverError ? (
          <motion.div
            key="delivery-recovery"
            ref={recoveryRef}
            tabIndex={-1}
            role="alert"
            data-contact-form-resolution
            initial={prefersReducedMotion ? undefined : { opacity: 0.65, scaleX: 0.97, clipPath: "inset(0 8% 0 0 round 1rem)" }}
            animate={{ opacity: 1, scaleX: 1, clipPath: "inset(0 0% 0 0 round 1rem)" }}
            exit={prefersReducedMotion ? undefined : { opacity: 0, scaleX: 0.985, clipPath: "inset(0 0 0 14% round 1rem)" }}
            transition={{ duration: 0.34, ease: EASE_AIR }}
            className="flex origin-left flex-col gap-3 rounded-2xl border border-state-error/18 bg-[#F3E8DE]/75 px-4 py-3 text-soil focus:outline-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-clay sm:flex-row sm:items-center"
          >
            <span className="flex min-w-0 flex-1 items-start gap-3">
              <CircleAlert aria-hidden="true" className="mt-0.5 h-4 w-4 shrink-0 text-state-error" strokeWidth={1.5} />
              <span className="text-sm leading-relaxed">
                <strong className="font-medium">Your note is still here.</strong>{" "}
                {serverError}
                {serverReference ? (
                  <span className="mt-1 block text-xs text-soil/52">
                    Reference {serverReference}
                  </span>
                ) : null}
              </span>
            </span>
            <span className="flex w-full shrink-0 flex-col gap-2 sm:w-auto sm:items-end">
              <span className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={copyRecoveryNote}
                  data-contact-recovery-copy
                  data-cursor-label="Copy this note"
                  className="inline-flex min-h-11 items-center justify-center rounded-full border border-soil/14 bg-white/35 px-3 py-2 text-xs font-medium text-soil transition-colors hover:bg-white/65 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-clay"
                >
                  {recoveryCopyStatus === "copied" ? (
                    <Check aria-hidden="true" className="mr-2 h-3.5 w-3.5" strokeWidth={1.5} />
                  ) : (
                    <Copy aria-hidden="true" className="mr-2 h-3.5 w-3.5" strokeWidth={1.5} />
                  )}
                  {recoveryCopyStatus === "copied" ? "Copied" : "Copy note"}
                </button>
                <a
                  href={`mailto:${site.email}?subject=${encodeURIComponent("Brand enquiry")}`}
                  onClick={handleEmailFallbackClick}
                  data-contact-recovery-email
                  data-cursor-label="Email this note"
                  className="inline-flex min-h-11 items-center justify-center rounded-full border border-soil/14 bg-white/35 px-3 py-2 text-xs font-medium text-soil transition-colors hover:bg-white/65 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-clay"
                >
                  <Mail aria-hidden="true" className="mr-2 h-3.5 w-3.5" strokeWidth={1.5} />
                  Email note
                </a>
              </span>
              <span className="min-h-4 text-right text-[0.64rem] leading-relaxed text-soil/52" role="status" aria-live="polite">
                {recoveryCopyStatus === "copied"
                  ? "Full note copied."
                  : recoveryCopyStatus === "error"
                    ? "Copy unavailable. Use email instead."
                    : "Both options keep every detail you entered."}
              </span>
            </span>
          </motion.div>
        ) : null}
      </AnimatePresence>

        <div
          data-contact-submit-row
          className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between"
        >
          <Magnetic className="block w-full sm:inline-block sm:w-auto">
            <button
              ref={buttonRef}
              type="submit"
              onClick={handleButtonClick}
              disabled={status === "submitting"}
              data-cursor-label={status === "submitting" ? "Sending" : "Send enquiry"}
              className={cn(
                "group/btn relative inline-flex min-h-12 w-full items-center justify-center gap-1.5 overflow-hidden rounded-full bg-action-primary px-6 py-3 text-sm font-medium text-white transition-all duration-300 ease-earth hover:-translate-y-0.5 hover:bg-action-primary-hover hover:shadow-elevation-lg focus-ring-halo disabled:opacity-60 disabled:hover:translate-y-0 disabled:hover:shadow-none sm:w-auto",
              )}
            >
              <span
                ref={spotlightRef}
                aria-hidden="true"
                className="cursor-spotlight pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300"
              />
              {!prefersReducedMotion ? (
                <AnimatePresence>
                  {ripples.map((r) => (
                    <motion.span
                      key={r.id}
                      aria-hidden="true"
                      className="pointer-events-none absolute h-[220px] w-[220px] rounded-full bg-current"
                      style={{ left: r.x - 110, top: r.y - 110 }}
                      initial={{ scale: 0, opacity: 0.3 }}
                      animate={{ scale: 1, opacity: 0 }}
                      transition={{ duration: 0.72, ease: EASE_AIR }}
                    />
                  ))}
                </AnimatePresence>
              ) : null}
              <span className="relative z-10 inline-flex items-center gap-1.5">
                {status === "submitting"
                  ? "Sending…"
                  : status === "error"
                    ? "Try sending again"
                    : "Send enquiry"}
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
          <div className="flex flex-wrap items-center justify-center gap-x-3 gap-y-1 sm:max-w-[16rem] sm:justify-end">
            <p
              data-contact-draft-status
              data-state={draftStatus}
              className="text-center text-[0.68rem] leading-relaxed text-soil/52 sm:text-right"
            >
              {draftStatusCopy}
            </p>
            <span
              data-contact-draft-announcement
              className="sr-only"
              role="status"
              aria-live="polite"
              aria-atomic="true"
            >
              {draftStatus === "restored"
                ? "Your unfinished contact note was restored in this tab."
                : ""}
            </span>
            {hasDraft ? (
              <button
                type="button"
                onClick={clearSavedNote}
                data-cursor-label="Clear note"
                className="inline-flex min-h-11 items-center px-1 text-[0.68rem] font-medium text-clay underline decoration-clay/30 underline-offset-4 transition-colors hover:text-soil focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-clay"
              >
                Clear note
              </button>
            ) : null}
          </div>
        </div>
        <span className="sr-only" role="status" aria-live="polite" aria-atomic="true">
          {status === "submitting" ? "Sending your enquiry." : ""}
        </span>
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
  children: ReactElement<{
    "aria-invalid"?: boolean;
    "aria-describedby"?: string;
    "aria-errormessage"?: string;
  }>;
}) {
  const hintId = useId();
  const errorId = useId();
  const existingDescription = isValidElement(children)
    ? children.props["aria-describedby"]
    : undefined;
  const describedBy = [existingDescription, hint ? hintId : null, error ? errorId : null]
    .filter(Boolean)
    .join(" ") || undefined;

  return (
    <label className="block min-w-0 text-xs font-medium uppercase tracking-wide text-foreground-secondary">
      {label}
      {isValidElement(children)
        ? cloneElement(children, {
            "aria-invalid": Boolean(error),
            "aria-describedby": describedBy,
            "aria-errormessage": error ? errorId : undefined,
          })
        : children}
      {hint ? (
        <span id={hintId} className="mt-1.5 block text-xs font-normal normal-case leading-relaxed tracking-normal text-soil/52">
          {hint}
        </span>
      ) : null}
      {error && (
        <span id={errorId} className="mt-1 block text-xs font-normal text-state-error">
          {error}
        </span>
      )}
    </label>
  );
}
