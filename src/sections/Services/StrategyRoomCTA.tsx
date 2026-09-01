"use client";

import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Container } from "@/components/Container";
import { CalendlyEmbed } from "@/components/CalendlyEmbed";
import { packages } from "@/data/services";
import { consultation, site } from "@/data/site";
import { entityFacts } from "@/data/entityFacts";
import { useHydratedReducedMotion } from "@/hooks/useHydratedReducedMotion";
import {
  SERVICES_SITUATION_EVENT,
  SERVICES_SITUATION_STORAGE_KEY,
  SERVICES_RECOGNITION_AUDIT_EVENT,
  SITUATION_TO_PACKAGE,
  isServicesSituation,
  readCompletedHomeDiagnosis,
  recognitionAuditGuidance,
  type ServicesRecognitionAuditDetail,
  type ServicesSituationDetail,
  type ServicesSituationId,
} from "@/lib/servicesJourney";
import { track } from "@/lib/analytics";

// The Strategy Room closes the page without turning booking into another
// diagnosis. The visitor already chose a situation near the start of this
// journey, so that route is carried forward when it exists. Availability is
// always one action away; the two-question brief is useful preparation, never
// a gate in front of the calendar.
const PRIORITIES = ["Getting positioning right", "Building recognition", "Stopping brand drift", "Still deciding"] as const;
const FOCUS_AREAS = ["Positioning and identity", "Content and voice", "Ongoing direction", "Still exploring"] as const;
const QUESTION_COUNT = 2;
const MODAL_INTERACTION_EVENT = "bt:services-modal-interaction";

const ROUTE_BRIEFS: Record<
  ServicesSituationId,
  {
    invitation: string;
    priorities: readonly (typeof PRIORITIES)[number][];
    focusAreas: readonly (typeof FOCUS_AREAS)[number][];
  }
> = {
  idea: {
    invitation: "Begin with the position, then name the first expression that needs direction.",
    priorities: ["Getting positioning right", "Building recognition", "Stopping brand drift", "Still deciding"],
    focusAreas: ["Positioning and identity", "Content and voice", "Ongoing direction", "Still exploring"],
  },
  reposition: {
    invitation: "Bring the meaning that no longer fits and the touchpoint where that confusion appears most clearly.",
    priorities: ["Getting positioning right", "Building recognition", "Stopping brand drift", "Still deciding"],
    focusAreas: ["Positioning and identity", "Content and voice", "Ongoing direction", "Still exploring"],
  },
  ongoing: {
    invitation: "Bring the recurring decision that keeps drifting as more content and campaigns go live.",
    priorities: ["Stopping brand drift", "Building recognition", "Getting positioning right", "Still deciding"],
    focusAreas: ["Ongoing direction", "Content and voice", "Positioning and identity", "Still exploring"],
  },
};

const OPTION_BUTTON_CLASS =
  "min-h-11 rounded-full border border-ivory/25 bg-ivory/[0.04] px-4 py-2.5 text-sm text-ivory/90 transition-colors duration-300 hover:border-sandstone/50 hover:bg-ivory/10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sandstone";

const QUIET_ACTION_CLASS =
  "inline-flex min-h-11 items-center justify-center rounded-full px-4 py-2.5 text-sm text-ivory/70 transition-colors duration-300 hover:bg-ivory/[0.06] hover:text-ivory focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sandstone";

const CARRIED_CONTEXT_CLASS =
  "rounded-2xl border border-sandstone/25 bg-sandstone/[0.07] px-4 py-3 text-left";

type Step = 0 | 1 | 2;

export function StrategyRoomCTA() {
  const [briefStarted, setBriefStarted] = useState(false);
  const [calendarOpen, setCalendarOpen] = useState(false);
  const [step, setStep] = useState<Step>(0);
  const [priority, setPriority] = useState<string | null>(null);
  const [focus, setFocus] = useState<string | null>(null);
  const [carriedPackage, setCarriedPackage] = useState<string | null>(null);
  const [carriedSituation, setCarriedSituation] = useState<ServicesSituationId | null>(null);
  const [recognitionAudit, setRecognitionAudit] = useState<ServicesRecognitionAuditDetail | null>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const dialogRef = useRef<HTMLDivElement>(null);
  const returnFocusRef = useRef<HTMLElement | null>(null);
  const briefHeadingRef = useRef<HTMLParagraphElement>(null);
  const briefStartButtonRef = useRef<HTMLButtonElement>(null);
  const shouldFocusBriefHeadingRef = useRef(false);
  const shouldRestoreBriefStartFocusRef = useRef(false);
  const prefersReducedMotion = useHydratedReducedMotion();

  useEffect(() => {
    function applySituation(situation: ServicesSituationId | null) {
      setCarriedSituation(situation);
      if (!situation) {
        setCarriedPackage(null);
        return;
      }
      const packageSlug = SITUATION_TO_PACKAGE[situation];
      const matchedPackage = packages.find((entry) => entry.slug === packageSlug);
      setCarriedPackage(matchedPackage?.name ?? null);
    }

    try {
      const storedSituation = window.localStorage.getItem(SERVICES_SITUATION_STORAGE_KEY);
      const savedSituation = isServicesSituation(storedSituation)
        ? storedSituation
        : readCompletedHomeDiagnosis();
      applySituation(savedSituation);
    } catch {
      applySituation(null);
    }

    function onSituation(event: Event) {
      const detail = (event as CustomEvent<ServicesSituationDetail>).detail;
      const nextSituation = isServicesSituation(detail?.situation) ? detail.situation : null;
      applySituation(nextSituation);
      setPriority(null);
      setFocus(null);
      setStep(0);
      setBriefStarted(false);
    }

    window.addEventListener(SERVICES_SITUATION_EVENT, onSituation as EventListener);
    return () => window.removeEventListener(SERVICES_SITUATION_EVENT, onSituation as EventListener);
  }, []);

  useEffect(() => {
    function onRecognitionAudit(event: Event) {
      const detail = (event as CustomEvent<ServicesRecognitionAuditDetail>).detail;
      if (
        !detail ||
        !Number.isInteger(detail.score) ||
        !Number.isInteger(detail.total) ||
        detail.score < 0 ||
        detail.score > detail.total
      ) {
        return;
      }
      setRecognitionAudit(detail.score > 0 ? detail : null);
    }

    window.addEventListener(SERVICES_RECOGNITION_AUDIT_EVENT, onRecognitionAudit as EventListener);
    return () => window.removeEventListener(SERVICES_RECOGNITION_AUDIT_EVENT, onRecognitionAudit as EventListener);
  }, []);

  useEffect(() => {
    if (!calendarOpen) return;

    returnFocusRef.current = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.dispatchEvent(
      new CustomEvent(MODAL_INTERACTION_EVENT, { detail: { active: true, source: "calendar" } }),
    );

    function closeOnEscape(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setCalendarOpen(false);
        return;
      }
      if (event.key !== "Tab") return;

      const dialog = dialogRef.current;
      if (!dialog) return;
      const focusable = Array.from(
        dialog.querySelectorAll<HTMLElement>(
          'a[href], button:not([disabled]), iframe, [tabindex]:not([tabindex="-1"])',
        ),
      ).filter((element) => element.getClientRects().length > 0);
      if (focusable.length === 0) {
        event.preventDefault();
        closeButtonRef.current?.focus();
        return;
      }

      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    }

    window.addEventListener("keydown", closeOnEscape);
    const focusFrame = window.requestAnimationFrame(() => closeButtonRef.current?.focus());

    return () => {
      window.cancelAnimationFrame(focusFrame);
      window.removeEventListener("keydown", closeOnEscape);
      document.body.style.overflow = previousOverflow;
      window.dispatchEvent(
        new CustomEvent(MODAL_INTERACTION_EVENT, { detail: { active: false, source: "calendar" } }),
      );
      window.requestAnimationFrame(() => returnFocusRef.current?.focus());
    };
  }, [calendarOpen]);

  useEffect(() => {
    if (!briefStarted) return;
    window.dispatchEvent(
      new CustomEvent(MODAL_INTERACTION_EVENT, { detail: { active: true, source: "brief" } }),
    );

    return () => {
      window.dispatchEvent(
        new CustomEvent(MODAL_INTERACTION_EVENT, { detail: { active: false, source: "brief" } }),
      );
    };
  }, [briefStarted]);

  function focusBriefHeading() {
    window.requestAnimationFrame(() => briefHeadingRef.current?.focus());
  }

  function registerBriefHeading(node: HTMLParagraphElement | null) {
    briefHeadingRef.current = node;
    if (!node || !shouldFocusBriefHeadingRef.current) return;
    shouldFocusBriefHeadingRef.current = false;
    node.focus();
  }

  function registerBriefStartButton(node: HTMLButtonElement | null) {
    briefStartButtonRef.current = node;
    if (!node || !shouldRestoreBriefStartFocusRef.current) return;
    shouldRestoreBriefStartFocusRef.current = false;
    node.focus();
  }

  function startBrief() {
    shouldFocusBriefHeadingRef.current = true;
    setBriefStarted(true);
  }

  function closeBrief() {
    shouldRestoreBriefStartFocusRef.current = true;
    restart();
    setBriefStarted(false);
  }

  function openCalendar() {
    track("calendar_opened", {
      source: "services-strategy-room",
      brief: step === QUESTION_COUNT ? "completed" : "skipped",
      route: carriedSituation ?? "unselected",
    });
    setCalendarOpen(true);
  }

  function pickPriority(value: string) {
    setPriority(value);
    setFocus(null);
    setStep(1);
    focusBriefHeading();
  }

  function pickFocus(value: string) {
    setFocus(value);
    setStep(2);
    focusBriefHeading();
  }

  function goBack() {
    if (step === 1) {
      setPriority(null);
      setFocus(null);
      setStep(0);
      focusBriefHeading();
      return;
    }
    if (step === 2) {
      setFocus(null);
      setStep(1);
      focusBriefHeading();
    }
  }

  function restart() {
    setPriority(null);
    setFocus(null);
    setStep(0);
  }

  function skipBriefAndOpenCalendar() {
    openCalendar();
    restart();
    setBriefStarted(false);
  }

  const transition = prefersReducedMotion ? { duration: 0 } : { duration: 0.35, ease: [0.16, 1, 0.3, 1] as const };
  const routeBrief = carriedSituation ? ROUTE_BRIEFS[carriedSituation] : null;
  const priorityOptions = routeBrief?.priorities ?? PRIORITIES;
  const focusOptions = routeBrief?.focusAreas ?? FOCUS_AREAS;
  const progressLabel = step < QUESTION_COUNT ? `Question ${step + 1} of ${QUESTION_COUNT}` : "Brief ready";
  const answers = [
    carriedPackage ? `Route: ${carriedPackage}` : null,
    recognitionAudit ? `Recognition: ${recognitionAudit.score} / ${recognitionAudit.total} answers hold` : null,
    priority,
    focus,
  ].filter(
    (answer): answer is string => Boolean(answer),
  );

  const calendarDialog =
    typeof document !== "undefined"
      ? createPortal(
          <AnimatePresence>
            {calendarOpen ? (
              <motion.div
                key="strategy-calendar-dialog"
                className="fixed inset-0 z-[1200] flex items-center justify-center bg-black/75 p-3 backdrop-blur-md sm:p-6"
                initial={prefersReducedMotion ? undefined : { opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: prefersReducedMotion ? 0 : 0.24 }}
                onMouseDown={(event) => {
                  if (event.target === event.currentTarget) setCalendarOpen(false);
                }}
              >
                <motion.div
                  ref={dialogRef}
                  role="dialog"
                  aria-modal="true"
                  aria-labelledby="strategy-calendar-title"
                  aria-describedby="strategy-calendar-description"
                  className="relative max-h-[calc(100svh-1.5rem)] w-full max-w-4xl overflow-y-auto rounded-[1.75rem] border border-sandstone/35 bg-[#171D19] p-4 shadow-[0_35px_120px_rgba(0,0,0,0.55)] sm:p-6"
                  initial={prefersReducedMotion ? undefined : { opacity: 0, y: 18, scale: 0.985 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 10, scale: 0.99 }}
                  transition={transition}
                >
                  <div className="flex items-start justify-between gap-6 px-1">
                    <div>
                      <p className="text-xs font-medium uppercase tracking-[0.18em] text-sandstone">30 minute brand diagnosis</p>
                      <h3 id="strategy-calendar-title" className="mt-2 font-display text-3xl font-normal text-ivory sm:text-4xl">
                        Choose a time that feels unhurried.
                      </h3>
                      <p id="strategy-calendar-description" className="mt-2 max-w-2xl text-sm leading-relaxed text-ivory/72">
                        Choose a time without losing the brief you have already prepared.
                      </p>
                      <div className="mt-4 flex flex-wrap items-center gap-x-3 gap-y-2 text-sm leading-relaxed text-ivory/65">
                        <span>Calendar not showing times? Send the decision directly.</span>
                        <Link
                          href="/contact"
                          className="inline-flex min-h-11 items-center rounded-full border border-sandstone/35 px-4 py-2 font-medium text-ivory transition-colors hover:border-sandstone/65 hover:bg-sandstone/[0.08] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sandstone"
                        >
                          Open the contact room
                          <span aria-hidden="true" className="ml-2">→</span>
                        </Link>
                      </div>
                    </div>
                    <button
                      ref={closeButtonRef}
                      type="button"
                      onClick={() => setCalendarOpen(false)}
                      className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-ivory/20 text-xl text-ivory/75 transition-colors hover:border-sandstone/55 hover:text-ivory focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sandstone"
                      aria-label="Close scheduling calendar"
                    >
                      <span aria-hidden="true">×</span>
                    </button>
                  </div>
                  {answers.length > 0 && (
                    <div className="mt-5 flex flex-wrap gap-2 px-1" aria-label="Your Strategy Room brief">
                      {answers.map((answer) => (
                        <span
                          key={answer}
                          className="rounded-full border border-sandstone/25 bg-sandstone/[0.07] px-3 py-1.5 text-xs text-ivory/78"
                        >
                          {answer}
                        </span>
                      ))}
                    </div>
                  )}
                  <CalendlyEmbed url={`${site.calendlyUrl}/30min`} />
                </motion.div>
              </motion.div>
            ) : null}
          </AnimatePresence>,
          document.body,
        )
      : null;

  return (
    <>
      <Container className="relative max-w-6xl">
        <div
          data-strategy-room-stage="true"
          className="relative grid items-center gap-7 lg:grid-cols-[minmax(19rem,0.82fr)_minmax(28rem,1.18fr)] lg:gap-12"
        >
          <div data-strategy-room-copy="true" data-services-chapter-copy="true" className="text-center lg:text-left">
          <p className="text-sm font-medium uppercase tracking-[0.2em] text-sandstone">Book a brand diagnosis</p>
          <h2 className="mt-3 text-display-md font-display font-normal leading-[1.06] text-ivory">
            Bring the brand decision that keeps returning.
          </h2>
          <p className="mx-auto mt-5 max-w-xl text-base leading-relaxed text-ivory/90 lg:mx-0">
            Thirty minutes directly with Suman. Bring the decision, the disagreement, or the sentence nobody can finish.
            A polished brief is not required.
          </p>
          <p className="mx-auto mt-3 max-w-xl text-sm leading-6 text-ivory/68 lg:mx-0">
            Remote projects led directly by Suman are available across {entityFacts.delivery.regions.slice(0, -1).join(", ")} and{" "}
            {entityFacts.delivery.regions.at(-1)}.
          </p>
          <div data-strategy-room-agenda="true" className="mx-auto mt-7 max-w-2xl lg:mx-0">
            <p className="text-[0.65rem] font-medium uppercase tracking-[0.18em] text-sandstone/78">
              Inside the diagnosis
            </p>
            <ol aria-label="What happens in the diagnosis" className="mt-3 grid gap-2.5 text-left sm:grid-cols-3 lg:grid-cols-1">
              {consultation.steps.map((item, index) => (
                <li
                  key={item}
                  data-strategy-agenda-step="true"
                  className="relative rounded-2xl border border-ivory/15 bg-[rgba(18,24,21,0.48)] px-4 py-3.5 backdrop-blur-md"
                >
                  <span className="text-[0.62rem] font-medium uppercase tracking-[0.16em] text-sandstone/75">
                    0{index + 1}
                  </span>
                  <p className="mt-2 text-sm leading-relaxed text-ivory/78">{item}</p>
                </li>
              ))}
            </ol>
          </div>
          </div>

          <div data-services-chapter-resolution="true" className="relative min-h-[18rem]" aria-live="off">
          <AnimatePresence mode="wait" initial={false}>
            {!briefStarted ? (
              <motion.div
                key="booking-choice"
                data-strategy-room-shell="true"
                initial={prefersReducedMotion ? undefined : { opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={transition}
                className="mx-auto max-w-2xl rounded-[1.75rem] border border-ivory/18 bg-[rgba(18,24,21,0.68)] p-6 shadow-[0_28px_90px_rgba(6,10,8,0.26)] backdrop-blur-xl sm:p-8"
              >
                {carriedPackage || recognitionAudit ? (
                  <div
                    className={`mx-auto mb-6 grid max-w-xl gap-3 ${carriedPackage && recognitionAudit ? "sm:grid-cols-2" : ""}`}
                    data-strategy-room-context="true"
                  >
                    {carriedPackage ? (
                      <div className={CARRIED_CONTEXT_CLASS}>
                        <p className="text-[0.62rem] font-medium uppercase tracking-[0.16em] text-sandstone/80">Carried from your situation</p>
                        <p className="mt-1 font-display text-lg font-normal text-ivory">{carriedPackage}</p>
                        {routeBrief ? <p className="mt-1 text-xs leading-relaxed text-ivory/62">{routeBrief.invitation}</p> : null}
                      </div>
                    ) : null}
                    {recognitionAudit ? (
                      <div className={CARRIED_CONTEXT_CLASS} data-carried-recognition-audit="true">
                        <p className="text-[0.62rem] font-medium uppercase tracking-[0.16em] text-sandstone/80">Carried from your audit</p>
                        <p className="mt-1 font-display text-lg font-normal text-ivory">
                          {recognitionAudit.score} of {recognitionAudit.total} answers hold
                        </p>
                        <p className="mt-1 text-xs leading-relaxed text-ivory/62">
                          {recognitionAuditGuidance(recognitionAudit.score, recognitionAudit.total)}
                        </p>
                      </div>
                    ) : null}
                  </div>
                ) : null}
                <p className="font-display text-2xl font-normal text-ivory">Choose a time or write first.</p>
                <p className="mx-auto mt-3 max-w-lg text-sm leading-relaxed text-ivory/72">
                  Open the calendar now, or answer two short questions so the call can begin with the real decision.
                </p>
                <div data-strategy-room-actions="true" className="mt-7 flex flex-col items-center justify-center gap-3 sm:flex-row">
                  <button
                    type="button"
                    data-strategy-control="true"
                    onClick={openCalendar}
                    className="inline-flex min-h-12 items-center justify-center rounded-full bg-sandstone px-6 py-3 text-sm font-medium text-soil transition-[transform,background-color] duration-300 hover:-translate-y-0.5 hover:bg-ivory focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-3 focus-visible:outline-sandstone"
                  >
                    See available times
                    <span aria-hidden="true" className="ml-2">↗</span>
                  </button>
                  <button ref={registerBriefStartButton} type="button" data-strategy-control="true" onClick={startBrief} className={OPTION_BUTTON_CLASS}>
                    Add a short brief
                  </button>
                </div>
                <p data-strategy-room-note="true" className="mt-5 text-xs leading-relaxed text-ivory/48">The brief is optional and never blocks the calendar.</p>
              </motion.div>
            ) : (
              <motion.div
                key="conversation-brief"
                data-strategy-room-shell="true"
                initial={prefersReducedMotion ? undefined : { opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={transition}
                className="mx-auto max-w-2xl rounded-[1.75rem] border border-ivory/18 bg-[rgba(18,24,21,0.68)] p-6 shadow-[0_28px_90px_rgba(6,10,8,0.26)] backdrop-blur-xl sm:p-8"
              >
                <p ref={registerBriefHeading} tabIndex={-1} className="text-[0.65rem] font-medium uppercase tracking-[0.18em] text-ivory/60 outline-none">
                  {progressLabel}
                </p>
                <div className="mx-auto mt-3 flex max-w-sm justify-center gap-1.5" aria-hidden="true">
                  {Array.from({ length: QUESTION_COUNT }).map((_, index) => (
                    <span
                      key={index}
                      className={`h-1 flex-1 rounded-full transition-colors duration-500 ${
                        index < step ? "bg-sandstone" : "bg-ivory/15"
                      }`}
                    />
                  ))}
                </div>

                <AnimatePresence mode="wait" initial={false}>
                  {step === 0 && (
                    <motion.div key="priority" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={transition}>
                      <p className="mt-6 text-sm font-medium uppercase tracking-wide text-ivory/78">What matters most right now?</p>
                      <div className="mx-auto mt-5 flex max-w-lg flex-wrap justify-center gap-2.5">
                        {priorityOptions.map((option) => (
                          <motion.button
                            key={option}
                            type="button"
                            data-strategy-control="true"
                            onClick={() => pickPriority(option)}
                            whileHover={prefersReducedMotion ? undefined : { y: -2 }}
                            whileTap={prefersReducedMotion ? undefined : { scale: 0.97 }}
                            transition={{ duration: 0.18 }}
                            className={OPTION_BUTTON_CLASS}
                          >
                            {option}
                          </motion.button>
                        ))}
                      </div>
                    </motion.div>
                  )}

                  {step === 1 && (
                    <motion.div key="focus" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={transition}>
                      <p className="mt-6 text-sm font-medium uppercase tracking-wide text-ivory/78">Where should the conversation focus?</p>
                      <div className="mx-auto mt-5 flex max-w-lg flex-wrap justify-center gap-2.5">
                        {focusOptions.map((option) => (
                          <motion.button
                            key={option}
                            type="button"
                            data-strategy-control="true"
                            onClick={() => pickFocus(option)}
                            whileHover={prefersReducedMotion ? undefined : { y: -2 }}
                            whileTap={prefersReducedMotion ? undefined : { scale: 0.97 }}
                            transition={{ duration: 0.18 }}
                            className={OPTION_BUTTON_CLASS}
                          >
                            {option}
                          </motion.button>
                        ))}
                      </div>
                      <button type="button" data-strategy-control="true" onClick={goBack} className={`${QUIET_ACTION_CLASS} mt-5`}>
                        <span aria-hidden="true">←</span>
                        <span className="ml-2">Previous question</span>
                      </button>
                    </motion.div>
                  )}

                  {step === 2 && (
                    <motion.div key="ready" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={transition}>
                      <p className="mt-6 font-display text-2xl font-normal text-ivory">Your starting point is clear.</p>
                      <div className="mx-auto mt-4 flex max-w-xl flex-wrap justify-center gap-2" aria-label="Your Strategy Room brief">
                        {answers.map((answer) => (
                          <span key={answer} className="rounded-full border border-sandstone/30 bg-sandstone/[0.08] px-3 py-1.5 text-xs text-ivory/80">
                            {answer}
                          </span>
                        ))}
                      </div>
                      <div className="mt-6 flex flex-col items-center justify-center gap-2 sm:flex-row">
                        <button
                          type="button"
                          data-strategy-control="true"
                          onClick={openCalendar}
                          className="inline-flex min-h-12 items-center justify-center rounded-full bg-sandstone px-6 py-3 text-sm font-medium text-soil transition-[transform,background-color] duration-300 hover:-translate-y-0.5 hover:bg-ivory focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-3 focus-visible:outline-sandstone"
                        >
                          See available times
                          <span aria-hidden="true" className="ml-2">↗</span>
                        </button>
                        <button type="button" data-strategy-control="true" onClick={restart} className={QUIET_ACTION_CLASS}>
                          Change answers
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                {step < QUESTION_COUNT ? (
                  <div className="mt-5 flex flex-wrap justify-center gap-2">
                    {step === 0 ? (
                      <button type="button" data-strategy-control="true" onClick={closeBrief} className={QUIET_ACTION_CLASS}>
                        Back to availability
                      </button>
                    ) : null}
                    <button
                      type="button"
                      data-strategy-control="true"
                      onClick={skipBriefAndOpenCalendar}
                      className={QUIET_ACTION_CLASS}
                    >
                      Skip the brief and view times
                    </button>
                  </div>
                ) : null}
              </motion.div>
            )}
          </AnimatePresence>
          </div>
        </div>
      </Container>

      {calendarDialog}
    </>
  );
}
