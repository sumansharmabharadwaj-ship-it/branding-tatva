"use client";

import type { CSSProperties, KeyboardEvent, PointerEvent } from "react";
import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowDown, ArrowRight, Compass, FileText, Sprout } from "lucide-react";
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
    signal: "Buyers understand only after a full explanation.",
    explanation: "The market has no reliable shortcut to the business yet. Every encounter must rebuild category, meaning, and relevance from the beginning.",
    decision: "Define the category and the belief the brand will own.",
    evidence: "Independent descriptions of what the business is and who it is for.",
    system: "Category and position",
  },
  {
    label: "Recognized",
    signal: "The name or cues register, but the meaning still moves.",
    explanation: "Familiarity has begun, but recognition alone does not make the brand easy to describe or choose. Inconsistent cues can still make it interchangeable.",
    decision: "Repeat a small set of distinctive verbal and visual codes.",
    evidence: "Correct identification from cues other than the name, plus repeated language across interviews.",
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
    evidence: "Shortlist mentions, qualified enquiries, and sales notes that cite the position.",
    system: "Consideration",
  },
] as const;

const ROUTE_FOCUS: Record<
  ServicesSituationId,
  { transition: string; note: string }
> = {
  idea: {
    transition: "From unfamiliar to recognised",
    note: "Foundation gives the business a category, position, and repeatable identity before launch.",
  },
  reposition: {
    transition: "From recognised to recalled",
    note: "Full Brand System aligns the meaning and cues already circulating among buyers.",
  },
  ongoing: {
    transition: "From recalled to considered",
    note: "Brand Partnership keeps each live expression recognisable as the business moves.",
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
    <Container className="relative max-w-[90rem]">
      <div
        data-perception-system="true"
        data-perception-stage={activeIndex + 1}
        style={{ "--perception-progress": `${(activeIndex / (RUNGS.length - 1)) * 100}%` } as CSSProperties}
        className="relative"
      >
        <div data-perception-heading="true" className="grid gap-6 lg:grid-cols-[minmax(0,1.16fr)_minmax(19rem,0.74fr)] lg:items-end lg:gap-16">
          <div>
            <p className="text-[0.66rem] font-semibold uppercase tracking-[0.22em] text-[#45583F] sm:text-xs">
              How buyers remember
            </p>
            <h2 className="mt-3 max-w-[24ch] font-display text-[clamp(2.45rem,4.6vw,5rem)] font-normal leading-[0.98] tracking-[-0.025em] text-[#1D2D25]">
              Four ways buyers may hold your brand in memory.
            </h2>
          </div>

          <div className="max-w-xl lg:justify-self-end">
            <p data-perception-intro="true" className="max-w-[39rem] text-sm leading-relaxed text-[#3F463E] sm:text-base">
              These are different market conditions, not a guaranteed ladder. Each condition asks for a different
              brand decision and a different form of evidence.
            </p>

            <AnimatePresence initial={false}>
              {routeFocus ? (
                <motion.div
                  key={routeFocus.transition}
                  data-perception-route="true"
                  initial={prefersReducedMotion ? false : { opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={prefersReducedMotion ? undefined : { opacity: 0, y: -6 }}
                  transition={{ duration: prefersReducedMotion ? 0 : 0.36, ease: EASE }}
                  className="mt-4 border-l border-[#B85A34]/55 pl-4"
                >
                  <p className="text-[0.58rem] font-semibold uppercase tracking-[0.16em] text-[#68725F]">
                    Your selected engagement
                  </p>
                  <p className="mt-1 font-display text-lg font-normal text-[#273A2F]">{routeFocus.transition}</p>
                  <p className="mt-1 text-xs leading-relaxed text-[#4F574D]">{routeFocus.note}</p>
                </motion.div>
              ) : null}
            </AnimatePresence>
          </div>
        </div>

        <div
          data-perception-horizon="true"
          data-services-chapter-instrument="true"
          role="tablist"
          aria-label="Four stages of brand recognition"
          className="relative mt-8 grid grid-cols-2 sm:mt-10 sm:grid-cols-4"
        >
          {RUNGS.map((rung, index) => {
            const active = index === activeIndex;
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
                data-perception-stage-tab="true"
                className="group relative min-h-20 px-3 py-3 text-left sm:min-h-24 sm:px-5 sm:text-center"
              >
                <span className={`block font-display text-2xl leading-none transition-colors sm:text-3xl ${active ? "text-[#B85A34]" : "text-[#9A927E] group-hover:text-[#5C6B4A]"}`}>
                  {String(index + 1).padStart(2, "0")}
                </span>
                <span className={`mt-2 block font-display text-base font-normal transition-colors sm:text-lg ${active ? "text-[#B85A34]" : "text-[#615C50] group-hover:text-[#2E3D32]"}`}>
                  {rung.label}
                </span>
                <span data-perception-horizon-node="true" data-active={active ? "true" : "false"} aria-hidden="true" />
                {active ? (
                  <motion.span
                    layoutId="active-perception-horizon"
                    data-perception-horizon-active="true"
                    aria-hidden="true"
                    transition={{ duration: prefersReducedMotion ? 0 : 0.44, ease: EASE }}
                  />
                ) : null}
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
          className="relative mt-5"
        >
          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              key={activeRung.label}
              data-perception-reading="true"
              initial={prefersReducedMotion ? false : { opacity: 0, y: 16, clipPath: "inset(0 0 18% 0)" }}
              animate={{ opacity: 1, y: 0, clipPath: "inset(0 0 0% 0)" }}
              exit={prefersReducedMotion ? undefined : { opacity: 0, y: -10, clipPath: "inset(0 0 30% 0)" }}
              transition={{ duration: prefersReducedMotion ? 0 : 0.48, ease: EASE }}
              className="grid gap-8 border-t border-[#B9AD96]/75 pt-8 lg:grid-cols-[minmax(0,1fr)_minmax(35rem,1.35fr)] lg:gap-12"
            >
              <div>
                <p className="text-[0.6rem] font-semibold uppercase tracking-[0.2em] text-[#45583F]">
                  What buyers currently do
                </p>
                <h3 className="mt-4 max-w-[25ch] font-display text-[clamp(2rem,3.25vw,3.65rem)] font-normal leading-[1.04] tracking-[-0.02em] text-[#1E3328]">
                  {activeRung.signal}
                </h3>
                <span className="mt-5 block h-px w-12 bg-[#79866F]" aria-hidden="true" />
                <p data-perception-explanation="true" className="mt-5 max-w-xl text-sm leading-relaxed text-[#3E473F] sm:text-base">
                  {activeRung.explanation}
                </p>
              </div>

              <div data-perception-evidence-grid="true" className="grid gap-0 sm:grid-cols-3">
                <div data-perception-detail="decision">
                  <Compass aria-hidden="true" strokeWidth={1.45} />
                  <p>What to decide next</p>
                  <p>{activeRung.decision}</p>
                </div>
                <div data-perception-detail="evidence">
                  <FileText aria-hidden="true" strokeWidth={1.45} />
                  <p>Evidence to collect</p>
                  <p>{activeRung.evidence}</p>
                </div>
                <div data-perception-detail="system" data-perception-system-result="true">
                  <Sprout aria-hidden="true" strokeWidth={1.45} />
                  <p>System to build</p>
                  <p>{activeRung.system}</p>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        <a
          href="#audit"
          data-perception-audit-action="true"
          className="group relative mt-8 grid min-h-16 items-center gap-4 border border-[#CFC4B0]/85 bg-[rgba(250,247,239,0.88)] px-4 py-3 text-[#24372C] shadow-[0_18px_54px_rgba(65,56,43,0.09)] backdrop-blur-sm sm:grid-cols-[auto_1fr_auto] sm:rounded-2xl sm:px-6"
        >
          <span className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-[#819076] bg-[#748266] text-[#FCFAF6] transition-transform duration-300 group-hover:translate-y-0.5" aria-hidden="true">
            <ArrowDown className="h-4 w-4" strokeWidth={1.8} />
          </span>
          <span className="text-sm leading-relaxed text-[#424A42] sm:max-w-lg">
            Check which conditions are already true and plan your next move in the brand audit.
          </span>
          <span className="inline-flex min-h-11 items-center justify-center gap-2 rounded-full bg-[#2D4A32] px-5 text-sm font-medium text-[#FCFAF6] transition-colors duration-300 group-hover:bg-[#243D2A]">
            Open brand audit
            <ArrowRight className="h-4 w-4" strokeWidth={1.8} aria-hidden="true" />
          </span>
        </a>
      </div>
    </Container>
  );
}
