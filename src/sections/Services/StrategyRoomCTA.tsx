"use client";

import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Container } from "@/components/Container";
import { CalendlyEmbed } from "@/components/CalendlyEmbed";
import { packages } from "@/data/services";
import { site } from "@/data/site";
import { entityFacts } from "@/data/entityFacts";
import { useHydratedReducedMotion } from "@/hooks/useHydratedReducedMotion";
import {
  SERVICES_SITUATION_EVENT,
  SERVICES_SITUATION_STORAGE_KEY,
  SITUATION_TO_PACKAGE,
  isServicesSituation,
  readCompletedHomeDiagnosis,
  type ServicesSituationDetail,
  type ServicesSituationId,
} from "@/lib/servicesJourney";
import { track } from "@/lib/analytics";

// The Strategy Room closes the page without turning booking into another
// diagnosis. The visitor already chose a situation near the start of this
// journey, so that route is carried forward when it exists. Availability is
// always one action away; the two-question brief is useful preparation, never
// a gate in front of the calendar.
const PRIORITIES = ["Getting positioning right", "Building recognition", "Staying consistent", "Still deciding"] as const;
const FOCUS_AREAS = ["Positioning & identity", "Content & voice", "Ongoing management", "Still exploring"] as const;
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
    invitation: "Begin with the position, then name the first expression that needs a clear direction.",
    priorities: ["Getting positioning right", "Building recognition", "Staying consistent", "Still deciding"],
    focusAreas: ["Positioning & identity", "Content & voice", "Ongoing management", "Still exploring"],
  },
  reposition: {
    invitation: "Bring the meaning that no longer fits and the touchpoint where that confusion appears most clearly.",
    priorities: ["Getting positioning right", "Building recognition", "Staying consistent", "Still deciding"],
    focusAreas: ["Positioning & identity", "Content & voice", "Ongoing management", "Still exploring"],
  },
  ongoing: {
    invitation: "Bring the recurring decision that keeps drifting as more content and campaigns go live.",
    priorities: ["Staying consistent", "Building recognition", "Getting positioning right", "Still deciding"],
    focusAreas: ["Ongoing management", "Content & voice", "Positioning & identity", "Still exploring"],
  },
};

const OPTION_BUTTON_CLASS =
  "min-h-11 rounded-full border border-ivory/25 bg-ivory/[0.04] px-4 py-2.5 text-sm text-ivory/90 transition-colors duration-300 hover:border-sandstone/50 hover:bg-ivory/10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sandstone";

const QUIET_ACTION_CLASS =
  "inline-flex min-h-11 items-center justify-center rounded-full px-4 py-2.5 text-sm text-ivory/70 transition-colors duration-300 hover:bg-ivory/[0.06] hover:text-ivory focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sandstone";

type Step = 0 | 1 | 2;

export function StrategyRoomCTA() {
  const [briefStarted, setBriefStarted] = useState(false);
  const [calendarOpen, setCalendarOpen] = useState(false);
  const [step, setStep] = useState<Step>(0);
  const [priority, setPriority] = useState<string | null>(null);
  const [focus, setFocus] = useState<string | null>(null);
  const [carriedPackage, setCarriedPackage] = useState<string | null>(null);
  const [carriedSituation, setCarriedSituation] = useState<ServicesSituationId | null>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const dialogRef = useRef<HTMLDivElement>(null);
  const returnFocusRef = useRef<HTMLElement | null>(null);
  const briefHeadingRef = useRef<HTMLParagraphElement>(null);
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
    if (!calendarOpen) return;

    returnFocusRef.current = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.dispatchEvent(new CustomEvent(MODAL_INTERACTION_EVENT, { detail: { active: true } }));

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
      window.dispatchEvent(new CustomEvent(MODAL_INTERACTION_EVENT, { detail: { active: false } }));
      window.requestAnimationFrame(() => returnFocusRef.current?.focus());
    };
  }, [calendarOpen]);

  function startBrief() {
    setBriefStarted(true);
    window.requestAnimationFrame(() => briefHeadingRef.current?.focus());
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
  }

  function pickFocus(value: string) {
    setFocus(value);
    setStep(2);
  }

  function goBack() {
    if (step === 1) {
      setPriority(null);
      setFocus(null);
      setStep(0);
      return;
    }
    if (step === 2) {
      setFocus(null);
      setStep(1);
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
  const answers = [carriedPackage ? `Route: ${carriedPackage}` : null, priority, focus].filter(
    (answer): answer is string => Boolean(answer),
  );

  const calendarDialog =
    calendarOpen && typeof document !== "undefined"
      ? createPortal(
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
                  <p className="text-xs font-medium uppercase tracking-[0.18em] text-sandstone">30-minute strategy call</p>
                  <h3 id="strategy-calendar-title" className="mt-2 font-display text-3xl font-normal text-ivory sm:text-4xl">
                    Choose a time that feels unhurried.
                  </h3>
                  <p id="strategy-calendar-description" className="mt-2 max-w-2xl text-sm leading-relaxed text-ivory/72">
                    The calendar opens here without changing your place in the Brand Strategy journey.
                  </p>
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
              <CalendlyEmbed url={site.calendlyUrl} />
            </motion.div>
          </motion.div>,
          document.body,
        )
      : null;

  return (
    <>
      <Container className="relative max-w-3xl text-center">
        <motion.div
          data-services-chapter-copy="true"
          initial={prefersReducedMotion ? undefined : { opacity: 0, y: 16 }}
          whileInView={prefersReducedMotion ? undefined : { opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "0px 0px -15% 0px" }}
          transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
        >
          <p className="text-sm font-medium uppercase tracking-[0.2em] text-sandstone">Book call</p>
          <h2 className="mt-3 text-display-md font-display font-normal leading-[1.06] text-ivory">
            Open the strategy room.
          </h2>
          <p className="mx-auto mt-5 max-w-xl text-base leading-relaxed text-ivory/90">
            Thirty minutes with the person who does the work. Bring the unclear part; no polished brief or pitch deck is
            required.
          </p>
          <p className="mx-auto mt-3 max-w-xl text-sm leading-6 text-ivory/68">
            Founder-led remote projects are available across {entityFacts.delivery.regions.slice(0, -1).join(", ")} and{" "}
            {entityFacts.delivery.regions.at(-1)}.
          </p>
        </motion.div>

        <div data-services-chapter-resolution="true" className="relative mt-8 min-h-[18rem]" aria-live="off">
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
                {carriedPackage ? (
                  <div className="mx-auto mb-6 max-w-lg rounded-2xl border border-sandstone/25 bg-sandstone/[0.07] px-4 py-3 text-left">
                    <p className="text-[0.62rem] font-medium uppercase tracking-[0.16em] text-sandstone/80">Carried from your situation</p>
                    <p className="mt-1 font-display text-lg font-normal text-ivory">{carriedPackage}</p>
                    {routeBrief ? <p className="mt-1 text-xs leading-relaxed text-ivory/62">{routeBrief.invitation}</p> : null}
                  </div>
                ) : null}
                <p className="font-display text-2xl font-normal text-ivory">Availability is one step away.</p>
                <p className="mx-auto mt-3 max-w-lg text-sm leading-relaxed text-ivory/72">
                  Choose a time now, or add a short two-question brief so the conversation can begin closer to the real
                  decision.
                </p>
                <div className="mt-7 flex flex-col items-center justify-center gap-3 sm:flex-row">
                  <button
                    type="button"
                    data-strategy-control="true"
                    onClick={openCalendar}
                    className="inline-flex min-h-12 items-center justify-center rounded-full bg-sandstone px-6 py-3 text-sm font-medium text-soil transition-[transform,background-color] duration-300 hover:-translate-y-0.5 hover:bg-ivory focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-3 focus-visible:outline-sandstone"
                  >
                    See available times
                    <span aria-hidden="true" className="ml-2">↗</span>
                  </button>
                  <button type="button" data-strategy-control="true" onClick={startBrief} className={OPTION_BUTTON_CLASS}>
                    Add a 60-second brief
                  </button>
                </div>
                <p className="mt-5 text-xs leading-relaxed text-ivory/48">The brief is optional and never blocks the calendar.</p>
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
                <p ref={briefHeadingRef} tabIndex={-1} className="text-[0.65rem] font-medium uppercase tracking-[0.18em] text-ivory/60 outline-none">
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
                        <span className="ml-2">Back</span>
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
                  <div className="mt-5 flex justify-center">
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
      </Container>

      <AnimatePresence>{calendarDialog}</AnimatePresence>
    </>
  );
}
