"use client";

import type { KeyboardEvent, PointerEvent } from "react";
import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Container } from "@/components/Container";
import { useHydratedReducedMotion } from "@/hooks/useHydratedReducedMotion";
import { track } from "@/lib/analytics";
import {
  SERVICES_SITUATION_EVENT,
  SERVICES_SITUATION_STORAGE_KEY,
  isServicesSituation,
  readCompletedHomeDiagnosis,
  type ServicesSituationDetail,
  type ServicesSituationId,
} from "@/lib/servicesJourney";

const SCENE_PROGRESS_EVENT = "bt:services-scene-progress";
const MANUAL_HOLD_MS = 14000;
const EASE = [0.22, 1, 0.36, 1] as const;

const RUNGS = [
  {
    label: "Unfamiliar",
    signal: "The business makes sense only after a full explanation.",
    explanation: "The market has no reliable shortcut to the business yet. Every encounter must rebuild category, meaning, and relevance from the beginning.",
    decision: "Define the category and the belief the brand will own.",
    evidence: "Independent descriptions of what the business is—and who it is for.",
    system: "Category & position",
  },
  {
    label: "Recognized",
    signal: "The name or cues register. The meaning still moves.",
    explanation: "Familiarity has begun, but recognition alone does not make the brand easy to describe or choose. Inconsistent cues can still make it interchangeable.",
    decision: "Repeat a small set of distinctive verbal and visual codes.",
    evidence: "Correct identification from non-name cues, plus consistent language across interviews.",
    system: "Distinctive codes",
  },
  {
    label: "Recalled",
    signal: "The brand returns in a relevant buying moment.",
    explanation: "Recognition needs a prompt. Recall happens when the need appears and the brand comes to mind without one. Repetition can support that memory; distribution and relevance still matter.",
    decision: "Link the same meaning to the situations in which buyers need it.",
    evidence: "Unaided mentions, branded searches, and repeat direct visits at relevant moments.",
    system: "Mental availability",
  },
  {
    label: "Considered",
    signal: "The brand enters the shortlist before price alone decides.",
    explanation: "Recall creates an opportunity, not guaranteed preference. Relevance, proof, availability, experience, and price still shape the final decision.",
    decision: "Protect the position and support it with evidence buyers can inspect.",
    evidence: "Shortlist mentions, qualified enquiries, and win-loss notes that cite the position.",
    system: "Consideration",
  },
] as const;

const ROUTE_FOCUS: Record<
  ServicesSituationId,
  { transition: string; note: string }
> = {
  idea: {
    transition: "Unfamiliar → Recognized",
    note: "Foundation gives the business a category, position, and repeatable identity before launch.",
  },
  reposition: {
    transition: "Recognized → Recalled",
    note: "Full Brand System aligns the meaning and cues already circulating in the market.",
  },
  ongoing: {
    transition: "Recalled → Considered",
    note: "Brand Partnership protects consistency as the system meets the market repeatedly.",
  },
};

type ServicesProgressDetail = {
  id?: string;
  progress?: number;
  storyProgress?: number;
};

export function PerceptionLadder() {
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const manualUntilRef = useRef(0);
  const [activeIndex, setActiveIndex] = useState(0);
  const [routeFocus, setRouteFocus] = useState<(typeof ROUTE_FOCUS)[ServicesSituationId] | null>(null);
  const prefersReducedMotion = useHydratedReducedMotion();
  const activeRung = RUNGS[activeIndex] ?? RUNGS[0];

  useEffect(() => {
    function applySituation(situation: ServicesSituationId | null) {
      setRouteFocus(situation ? ROUTE_FOCUS[situation] : null);
    }

    try {
      const storedSituation = window.localStorage.getItem(SERVICES_SITUATION_STORAGE_KEY);
      applySituation(
        isServicesSituation(storedSituation)
          ? storedSituation
          : readCompletedHomeDiagnosis(),
      );
    } catch {
      applySituation(null);
    }

    function onSituation(event: Event) {
      const detail = (event as CustomEvent<ServicesSituationDetail>).detail;
      applySituation(isServicesSituation(detail?.situation) ? detail.situation : null);
    }

    window.addEventListener(SERVICES_SITUATION_EVENT, onSituation as EventListener);
    return () => window.removeEventListener(SERVICES_SITUATION_EVENT, onSituation as EventListener);
  }, []);

  useEffect(() => {
    if (prefersReducedMotion) return;

    function onSceneProgress(event: Event) {
      const detail = (event as CustomEvent<ServicesProgressDetail>).detail;
      if (detail?.id !== "education" || typeof detail.progress !== "number") return;
      if (Date.now() < manualUntilRef.current) return;
      const storyProgress = detail.storyProgress ?? detail.progress;

      const index = Math.min(
        RUNGS.length - 1,
        Math.max(0, Math.floor(storyProgress * RUNGS.length)),
      );
      setActiveIndex((current) => (current === index ? current : index));
    }

    window.addEventListener(SCENE_PROGRESS_EVENT, onSceneProgress as EventListener);
    return () => window.removeEventListener(SCENE_PROGRESS_EVENT, onSceneProgress as EventListener);
  }, [prefersReducedMotion]);

  function activate(index: number, source: "hover" | "focus" | "click" | "keyboard") {
    manualUntilRef.current = Date.now() + MANUAL_HOLD_MS;
    setActiveIndex(index);
    if (source === "click" || source === "keyboard") {
      track("capability_selected", {
        page: "services",
        capability: `Recognition ladder: ${RUNGS[index]?.label ?? "stage"}`,
        source: `perception_${source}`,
      });
    }
  }

  function handlePointerEnter(index: number, event: PointerEvent<HTMLButtonElement>) {
    if (event.pointerType === "mouse" || event.pointerType === "pen") activate(index, "hover");
  }

  function handleKeyDown(index: number, event: KeyboardEvent<HTMLButtonElement>) {
    let nextIndex: number | undefined;
    if (event.key === "ArrowRight" || event.key === "ArrowDown") nextIndex = (index + 1) % RUNGS.length;
    if (event.key === "ArrowLeft" || event.key === "ArrowUp") nextIndex = (index - 1 + RUNGS.length) % RUNGS.length;
    if (event.key === "Home") nextIndex = 0;
    if (event.key === "End") nextIndex = RUNGS.length - 1;
    if (nextIndex === undefined) return;
    event.preventDefault();
    activate(nextIndex, "keyboard");
    tabRefs.current[nextIndex]?.focus();
  }

  return (
    <Container className="relative max-w-7xl">
      <div
        data-perception-system="true"
        data-perception-stage={activeIndex + 1}
        className="grid gap-8 lg:grid-cols-[minmax(15rem,0.62fr)_minmax(16rem,0.72fr)_minmax(21rem,1.05fr)] lg:items-center lg:gap-10 xl:gap-16"
      >
        <div data-services-chapter-copy="true">
          <p className="text-sm font-medium uppercase tracking-wide text-[#C6CCB8]">Perception</p>
          <h2 className="mt-2 max-w-lg text-display-sm font-display font-normal text-ivory">
            Four ways a market can hold or lose your brand.
          </h2>
          <p data-perception-intro="true" className="mt-4 max-w-md text-sm leading-relaxed text-ivory/78 sm:text-base">
            A practical diagnostic, not a promise of a linear climb. Recognition, recall, and consideration are
            different states; each needs a different brand decision.
          </p>

          <AnimatePresence initial={false}>
            {routeFocus ? (
              <motion.div
                key={routeFocus.transition}
                data-perception-route="true"
                initial={prefersReducedMotion ? false : { opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={prefersReducedMotion ? undefined : { opacity: 0, y: -6 }}
                transition={{ duration: prefersReducedMotion ? 0 : 0.38, ease: EASE }}
                className="mt-5 rounded-2xl border border-[#A0A690]/30 bg-[rgba(160,166,144,0.08)] px-4 py-3"
              >
                <p className="text-[0.58rem] font-medium uppercase tracking-[0.16em] text-[#C6CCB8]/75">
                  Your selected route concentrates here
                </p>
                <p className="mt-1 font-display text-lg font-normal text-ivory">{routeFocus.transition}</p>
                <p className="mt-1.5 text-xs leading-relaxed text-ivory/68">{routeFocus.note}</p>
              </motion.div>
            ) : null}
          </AnimatePresence>

          <div data-perception-progress="true" className="mt-7 flex items-center gap-3" aria-hidden="true">
            <span className="font-display text-lg text-[#C6CCB8]">{String(activeIndex + 1).padStart(2, "0")}</span>
            <span className="relative h-px flex-1 overflow-hidden bg-ivory/14">
              <motion.span
                className="absolute inset-y-0 left-0 bg-[#A0A690]"
                animate={{ width: `${((activeIndex + 1) / RUNGS.length) * 100}%` }}
                transition={{ duration: prefersReducedMotion ? 0 : 0.48, ease: EASE }}
              />
            </span>
            <span className="text-[0.58rem] uppercase tracking-[0.16em] text-ivory/45">/ 04</span>
          </div>

          <a
            href="#audit"
            data-perception-audit-action="true"
            className="link-underline mt-7 hidden min-h-11 items-center gap-2 text-sm text-[#C6CCB8] transition-colors hover:text-ivory focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#A0A690] sm:inline-flex"
          >
            Test which signals already hold
            <span aria-hidden="true">↓</span>
          </a>
        </div>

        <div
          data-services-chapter-instrument="true"
          role="tablist"
          aria-label="Four stages of brand recognition"
          className="grid grid-cols-2 gap-1 rounded-3xl border border-ivory/12 bg-[rgba(14,20,18,0.42)] p-2 backdrop-blur-xl lg:block"
        >
          {RUNGS.map((rung, index) => {
            const active = index === activeIndex;
            const complete = index < activeIndex;
            return (
              <button
                key={rung.label}
                ref={(node) => {
                  tabRefs.current[index] = node;
                }}
                id={`perception-stage-tab-${index}`}
                type="button"
                role="tab"
                aria-selected={active}
                aria-controls="perception-stage-panel"
                tabIndex={active ? 0 : -1}
                onPointerEnter={(event) => handlePointerEnter(index, event)}
                onFocus={() => activate(index, "focus")}
                onClick={() => activate(index, "click")}
                onKeyDown={(event) => handleKeyDown(index, event)}
                className={`group relative grid min-h-14 w-full grid-cols-[2rem_1fr_auto] items-center gap-2 overflow-hidden rounded-2xl px-2.5 py-2.5 text-left transition-colors duration-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#A0A690] sm:px-4 lg:min-h-16 lg:grid-cols-[2.5rem_1fr_auto] lg:gap-3 lg:py-3 ${
                  active ? "text-ivory" : "text-ivory/55 hover:bg-ivory/[0.04] hover:text-ivory/85"
                }`}
              >
                {active && (
                  <motion.span
                    layoutId="active-perception-stage"
                    aria-hidden="true"
                    className="absolute inset-0 rounded-2xl border border-[#A0A690]/45 bg-ivory/[0.075] shadow-[0_14px_42px_rgba(0,0,0,0.18)]"
                    transition={{ duration: prefersReducedMotion ? 0 : 0.42, ease: EASE }}
                  />
                )}
                <span className={`relative font-display text-sm ${active || complete ? "text-[#C6CCB8]" : "text-ivory/35"}`}>
                  {String(index + 1).padStart(2, "0")}
                </span>
                <span className="relative font-display text-base font-normal sm:text-lg lg:text-xl">{rung.label}</span>
                <span
                  aria-hidden="true"
                  className={`relative h-2.5 w-2.5 rounded-full border transition-colors duration-300 ${
                    active ? "border-[#C6CCB8] bg-[#C6CCB8] shadow-[0_0_14px_rgba(198,204,184,0.5)]" : complete ? "border-[#A0A690] bg-[#A0A690]/60" : "border-ivory/25"
                  }`}
                />
              </button>
            );
          })}
        </div>

        <div
          data-services-chapter-resolution="true"
          data-perception-panel="true"
          id="perception-stage-panel"
          role="tabpanel"
          aria-labelledby={`perception-stage-tab-${activeIndex}`}
          className="relative min-h-[24rem] overflow-hidden rounded-[1.75rem] border border-ivory/15 bg-[rgba(12,18,17,0.62)] p-6 shadow-[0_30px_90px_rgba(0,0,0,0.28)] backdrop-blur-xl sm:p-8"
        >
          <div className="flex items-center justify-between gap-4">
            <p className="text-[0.62rem] font-medium uppercase tracking-[0.2em] text-ivory/55">Market state</p>
            <span className="font-display text-5xl leading-none text-ivory/[0.08]" aria-hidden="true">
              {String(activeIndex + 1).padStart(2, "0")}
            </span>
          </div>

          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              key={activeRung.label}
              initial={prefersReducedMotion ? false : { opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              exit={prefersReducedMotion ? undefined : { opacity: 0, y: -10 }}
              transition={{ duration: prefersReducedMotion ? 0 : 0.5, ease: EASE }}
            >
              <h3 className="mt-5 font-display text-[clamp(2.8rem,5vw,4.8rem)] font-normal leading-none text-ivory">
                {activeRung.label}
              </h3>
              <p className="mt-4 max-w-lg font-display text-xl font-normal leading-snug text-[#C6CCB8] sm:text-2xl">
                {activeRung.signal}
              </p>
              <p data-perception-explanation="true" className="mt-5 max-w-lg text-sm leading-relaxed text-ivory/82 sm:text-base">
                {activeRung.explanation}
              </p>

              <div data-perception-evidence-grid="true" className="mt-7 grid gap-5 border-t border-ivory/12 pt-5 sm:grid-cols-2">
                <div>
                  <p className="text-[0.58rem] font-medium uppercase tracking-[0.18em] text-ivory/55">Strategy decision</p>
                  <p className="mt-2 text-sm leading-relaxed text-ivory/90">{activeRung.decision}</p>
                </div>
                <div className="sm:border-l sm:border-ivory/12 sm:pl-5">
                  <p className="text-[0.58rem] font-medium uppercase tracking-[0.18em] text-ivory/55">Evidence worth watching</p>
                  <p className="mt-2 text-sm leading-relaxed text-ivory/90">{activeRung.evidence}</p>
                </div>
              </div>

              <div data-perception-system-result="true" className="mt-5 flex flex-wrap items-baseline justify-between gap-3 border-t border-ivory/12 pt-4">
                <p className="text-[0.58rem] font-medium uppercase tracking-[0.18em] text-ivory/50">System to build</p>
                <p className="font-display text-xl font-normal text-[#C6CCB8]">{activeRung.system}</p>
              </div>

              <a
                href="#audit"
                data-perception-mobile-action="true"
                className="mt-4 inline-flex min-h-11 w-full items-center justify-between rounded-full border border-[#A0A690]/45 bg-[rgba(198,204,184,0.12)] px-4 text-sm font-medium text-ivory transition-[border-color,background-color] hover:border-[#C6CCB8]/75 hover:bg-[rgba(198,204,184,0.18)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#A0A690] sm:hidden"
              >
                Test which signals already hold
                <span aria-hidden="true">↓</span>
              </a>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </Container>
  );
}
