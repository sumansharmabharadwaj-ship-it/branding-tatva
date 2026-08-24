"use client";

import type { KeyboardEvent, PointerEvent } from "react";
import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Container } from "@/components/Container";
import { useHydratedReducedMotion } from "@/hooks/useHydratedReducedMotion";
import { track } from "@/lib/analytics";

const SCENE_PROGRESS_EVENT = "bt:services-scene-progress";
const MANUAL_HOLD_MS = 14000;
const EASE = [0.22, 1, 0.36, 1] as const;

const RUNGS = [
  {
    label: "Unknown",
    signal: "Every encounter begins from zero.",
    explanation: "The market has no shortcut to the business yet. Each conversation starts with a complete explanation.",
    decision: "Define the category and the belief the brand will own.",
    system: "Category and position",
  },
  {
    label: "Recognized",
    signal: "The name registers. The meaning still moves.",
    explanation: "A familiar name enters consideration, while inconsistent cues keep the brand interchangeable.",
    decision: "Repeat a distinctive verbal and visual code.",
    system: "Distinctive assets",
  },
  {
    label: "Remembered",
    signal: "The pattern returns before the advertisement does.",
    explanation: "Repeated meaning creates a mental shortcut. The brand begins to surface before a buyer starts searching.",
    decision: "Carry the same meaning through every encounter.",
    system: "Mental availability",
  },
  {
    label: "Preferred",
    signal: "The choice begins before comparison.",
    explanation: "A clear position gives the brand an advantage before features and price enter the conversation.",
    decision: "Protect the position while the business expands.",
    system: "Brand preference",
  },
] as const;

type ServicesProgressDetail = {
  id?: string;
  progress?: number;
};

export function PerceptionLadder() {
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const manualUntilRef = useRef(0);
  const [activeIndex, setActiveIndex] = useState(0);
  const prefersReducedMotion = useHydratedReducedMotion();
  const activeRung = RUNGS[activeIndex] ?? RUNGS[0];

  useEffect(() => {
    if (prefersReducedMotion) return;

    function onSceneProgress(event: Event) {
      const detail = (event as CustomEvent<ServicesProgressDetail>).detail;
      if (detail?.id !== "education" || typeof detail.progress !== "number") return;
      if (Date.now() < manualUntilRef.current) return;

      const index = Math.min(
        RUNGS.length - 1,
        Math.max(0, Math.floor(detail.progress * RUNGS.length)),
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
        <div>
          <p className="text-sm font-medium uppercase tracking-wide text-[#C6CCB8]">Perception</p>
          <h2 className="mt-2 max-w-lg text-display-sm font-display font-normal text-ivory">
            Recognition is built in four public stages.
          </h2>
          <p className="mt-4 max-w-md text-sm leading-relaxed text-ivory/78 sm:text-base">
            Attention begins as exposure. Repeated codes turn exposure into recall. A position carried consistently
            turns recall into preference.
          </p>

          <div className="mt-7 flex items-center gap-3" aria-hidden="true">
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
            className="link-underline mt-7 inline-flex min-h-11 items-center gap-2 text-sm text-[#C6CCB8] transition-colors hover:text-ivory focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#A0A690]"
          >
            Test the signals in your own brand
            <span aria-hidden="true">↓</span>
          </a>
        </div>

        <div
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
              initial={prefersReducedMotion ? false : { opacity: 0, y: 14, filter: "blur(7px)" }}
              animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              exit={prefersReducedMotion ? undefined : { opacity: 0, y: -10, filter: "blur(5px)" }}
              transition={{ duration: prefersReducedMotion ? 0 : 0.5, ease: EASE }}
            >
              <h3 className="mt-5 font-display text-[clamp(2.8rem,5vw,4.8rem)] font-normal leading-none text-ivory">
                {activeRung.label}
              </h3>
              <p className="mt-4 max-w-lg font-display text-xl font-normal leading-snug text-[#C6CCB8] sm:text-2xl">
                {activeRung.signal}
              </p>
              <p className="mt-5 max-w-lg text-sm leading-relaxed text-ivory/82 sm:text-base">
                {activeRung.explanation}
              </p>

              <div className="mt-7 grid gap-5 border-t border-ivory/12 pt-5 sm:grid-cols-2">
                <div>
                  <p className="text-[0.58rem] font-medium uppercase tracking-[0.18em] text-ivory/45">System decision</p>
                  <p className="mt-2 text-sm leading-relaxed text-ivory/90">{activeRung.decision}</p>
                </div>
                <div className="sm:border-l sm:border-ivory/12 sm:pl-5">
                  <p className="text-[0.58rem] font-medium uppercase tracking-[0.18em] text-ivory/45">What begins to compound</p>
                  <p className="mt-2 font-display text-xl font-normal text-ivory">{activeRung.system}</p>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </Container>
  );
}
