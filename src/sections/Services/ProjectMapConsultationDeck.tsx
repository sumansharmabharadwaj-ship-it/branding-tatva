"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import type { Deliverable } from "@/data/deliverables";
import {
  CHANGE_INSIGHTS,
  DIAGNOSTICS,
  JOURNEY_STAGES,
  type ChangeId,
  type ProjectMap,
  type SituationId,
} from "@/lib/recommendationEngine";
import { useHydratedReducedMotion } from "@/hooks/useHydratedReducedMotion";
import { motionTokens } from "@/lib/motionTokens";

const INSIGHTS = [
  "The struggle",
  "Visible symptoms",
  "Customer perception",
  "The likely root cause",
  "Where the work begins",
  "The decisions ahead",
  "What you receive",
  "How recognition grows",
] as const;

export function ProjectMapConsultationDeck({
  situation,
  change,
  map,
  mapDeliverables,
  packageColor,
}: {
  situation: SituationId;
  change: ChangeId;
  map: ProjectMap;
  mapDeliverables: Deliverable[];
  packageColor: string;
}) {
  const [activeIndex, setActiveIndex] = useState(0);
  const prefersReducedMotion = useHydratedReducedMotion();
  const diagnostic = DIAGNOSTICS[situation];

  function renderInsight(index: number) {
    switch (index) {
      case 0:
        return <p className="text-base leading-relaxed text-ivory/90 sm:text-lg">{diagnostic.struggle}</p>;
      case 1:
        return (
          <ul className="space-y-3">
            {diagnostic.symptoms.map((symptom, itemIndex) => (
              <li key={symptom} className="grid grid-cols-[1.75rem_1fr] gap-3 text-sm leading-relaxed text-ivory/85 sm:text-base">
                <span className="font-display text-sandstone/75">{String(itemIndex + 1).padStart(2, "0")}</span>
                <span>{symptom}</span>
              </li>
            ))}
          </ul>
        );
      case 2:
        return <p className="text-base leading-relaxed text-ivory/90 sm:text-lg">{diagnostic.perception}</p>;
      case 3:
        return (
          <div className="border-l-2 border-sandstone/55 pl-5">
            <p className="font-display text-2xl font-normal leading-snug text-ivory sm:text-3xl">{diagnostic.rootCause}</p>
          </div>
        );
      case 4:
        return (
          <ol className="flex flex-wrap items-center gap-y-3">
            {JOURNEY_STAGES.map((stage, stageIndex) => {
              const active = map.stages.includes(stageIndex);
              return (
                <li key={stage} className="flex items-center">
                  <span
                    className={`rounded-full border px-3 py-1.5 text-xs transition-colors duration-500 ${
                      active ? "border-sandstone/70 text-ivory" : "border-ivory/12 text-ivory/32"
                    }`}
                    style={active ? { backgroundColor: `${packageColor}33` } : undefined}
                  >
                    {stage}
                  </span>
                  {stageIndex < JOURNEY_STAGES.length - 1 && (
                    <span aria-hidden="true" className="mx-1.5 text-ivory/20">→</span>
                  )}
                </li>
              );
            })}
          </ol>
        );
      case 5:
        return (
          <ul className="space-y-3">
            {map.questions.map((question, questionIndex) => (
              <li key={question} className="grid grid-cols-[1.75rem_1fr] gap-3 text-sm leading-relaxed text-ivory/90 sm:text-base">
                <span className="font-display text-sandstone/75">{String(questionIndex + 1).padStart(2, "0")}</span>
                <span>{question}</span>
              </li>
            ))}
          </ul>
        );
      case 6:
        return (
          <div className="grid gap-2 sm:grid-cols-2">
            {mapDeliverables.map((deliverable) => (
              <div key={deliverable.id} className="rounded-2xl border border-ivory/15 bg-ivory/[0.035] px-4 py-3">
                <p className="text-sm leading-snug text-ivory/90">{deliverable.name}</p>
                <p className="mt-1 text-[0.62rem] uppercase tracking-[0.14em] text-sandstone/75">{deliverable.group}</p>
              </div>
            ))}
          </div>
        );
      case 7:
        return (
          <div className="space-y-4">
            <p className="font-display text-2xl font-normal leading-snug text-sandstone sm:text-3xl">
              {CHANGE_INSIGHTS[change]}
            </p>
            {map.marketingLayer && (
              <p className="border-t border-ivory/12 pt-4 text-sm leading-relaxed text-ivory/72">
                Optional marketing layer: {map.marketingLayer}
              </p>
            )}
          </div>
        );
      default:
        return null;
    }
  }

  return (
    <div data-project-map-insight-deck="true" className="grid gap-5 xl:grid-cols-[minmax(13rem,0.72fr)_minmax(0,1.28fr)]">
      <div
        role="tablist"
        aria-label="Project map consultation chapters"
        className="grid grid-cols-2 gap-2 xl:block xl:space-y-1"
      >
        {INSIGHTS.map((label, index) => {
          const selected = activeIndex === index;
          return (
            <button
              key={label}
              id={`project-map-insight-tab-${index}`}
              type="button"
              role="tab"
              aria-selected={selected}
              aria-controls="project-map-insight-panel"
              tabIndex={selected ? 0 : -1}
              onClick={() => setActiveIndex(index)}
              className={`group relative flex min-h-12 w-full items-center gap-2.5 overflow-hidden rounded-xl border px-3 py-2.5 text-left transition-colors duration-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-sandstone xl:min-h-11 ${
                selected
                  ? "border-sandstone/55 bg-sandstone/10 text-ivory"
                  : "border-ivory/10 bg-ivory/[0.025] text-ivory/62 hover:border-ivory/25 hover:text-ivory"
              }`}
            >
              {selected && (
                <motion.span
                  layoutId="project-map-insight-active"
                  aria-hidden="true"
                  className="absolute inset-y-2 left-0 w-0.5 rounded-full bg-sandstone"
                  transition={prefersReducedMotion ? { duration: 0 } : { duration: motionTokens.durationFast }}
                />
              )}
              <span className="relative font-display text-xs text-sandstone/70">{String(index + 1).padStart(2, "0")}</span>
              <span className="relative text-[0.68rem] leading-tight sm:text-xs">{label}</span>
            </button>
          );
        })}
      </div>

      <div className="relative min-h-[20rem] overflow-hidden rounded-2xl border border-ivory/12 bg-[rgba(8,13,12,0.34)] p-5 sm:p-7">
        <div className="paper-grain" style={{ opacity: 0.055 }} aria-hidden="true" />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -right-20 -top-20 h-56 w-56 rounded-full blur-3xl"
          style={{ backgroundColor: `${packageColor}25` }}
        />
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={activeIndex}
            id="project-map-insight-panel"
            role="tabpanel"
            aria-labelledby={`project-map-insight-tab-${activeIndex}`}
            initial={prefersReducedMotion ? undefined : { opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={prefersReducedMotion ? undefined : { opacity: 0, y: -7 }}
            transition={{ duration: prefersReducedMotion ? 0 : motionTokens.durationBase, ease: motionTokens.easeOrganic }}
            className="relative"
          >
            <div className="flex items-baseline justify-between gap-4 border-b border-ivory/10 pb-4">
              <div>
                <p className="text-[0.58rem] font-medium uppercase tracking-[0.18em] text-ivory/45">Consultation chapter</p>
                <h4 className="mt-1 font-display text-xl font-normal text-ivory sm:text-2xl">{INSIGHTS[activeIndex]}</h4>
              </div>
              <span className="font-display text-4xl text-ivory/[0.08]" aria-hidden="true">
                {String(activeIndex + 1).padStart(2, "0")}
              </span>
            </div>
            <div className="mt-6">{renderInsight(activeIndex)}</div>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
