"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import type { Waystone } from "@/components/motion/WaystoneField";
import { useHydratedReducedMotion } from "@/hooks/useHydratedReducedMotion";
import { motionTokens } from "@/lib/motionTokens";

type ChoiceStep = "situation" | "change" | "complete";

function initialStep(situation: string | null, change: string | null): ChoiceStep {
  if (situation && change) return "complete";
  if (situation) return "change";
  return "situation";
}

export function ProjectMapChoiceDeck({
  situationStones,
  changeStones,
  situation,
  change,
  recommendedChange,
  onSituation,
  onChange,
}: {
  situationStones: Waystone[];
  changeStones: Waystone[];
  situation: string | null;
  change: string | null;
  recommendedChange?: string | null;
  onSituation: (id: string) => void;
  onChange: (id: string) => void;
}) {
  const [step, setStep] = useState<ChoiceStep>(() => initialStep(situation, change));
  const prefersReducedMotion = useHydratedReducedMotion();

  const situationStone = situationStones.find((stone) => stone.id === situation);
  const changeStone = changeStones.find((stone) => stone.id === change);
  const stones = step === "situation" ? situationStones : changeStones;
  const activeId = step === "situation" ? situation : change;
  const groupLabel = step === "situation" ? "Your situation" : "The change you want";

  function chooseSituation(id: string) {
    onSituation(id);
    setStep(change ? "complete" : "change");
  }

  function chooseChange(id: string) {
    onChange(id);
    setStep("complete");
  }

  return (
    <div
      data-project-map-choice-deck="true"
      className="mt-8 overflow-hidden rounded-3xl border border-ivory/14 bg-[rgba(244,239,230,0.045)] backdrop-blur-md"
    >
      <div className="grid lg:grid-cols-[minmax(14rem,0.72fr)_minmax(0,1.28fr)]">
        <div className="border-b border-ivory/12 p-5 sm:p-7 lg:border-b-0 lg:border-r">
          <p className="text-[0.62rem] font-medium uppercase tracking-[0.2em] text-sandstone">Two decisions</p>
          <div className="mt-5 flex items-center gap-3" aria-label="Project map progress">
            {["situation", "change"].map((item, index) => {
              const complete = item === "situation" ? Boolean(situation) : Boolean(change);
              const current = step === item;
              return (
                <div key={item} className="flex flex-1 items-center gap-2">
                  <span
                    className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full border font-display text-sm ${
                      complete || current
                        ? "border-sandstone/70 bg-sandstone/10 text-sandstone"
                        : "border-ivory/15 text-ivory/35"
                    }`}
                  >
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  {index === 0 && <span className="h-px flex-1 bg-ivory/15" aria-hidden="true" />}
                </div>
              );
            })}
          </div>

          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              key={step}
              aria-live="polite"
              initial={prefersReducedMotion ? undefined : { opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={prefersReducedMotion ? undefined : { opacity: 0, y: -5 }}
              transition={{ duration: prefersReducedMotion ? 0 : motionTokens.durationFast, ease: motionTokens.easeOrganic }}
              className="mt-7"
            >
              {step === "situation" && (
                <>
                  <p className="font-display text-2xl font-normal text-ivory">Where is the business now?</p>
                  <p className="mt-2 text-sm leading-relaxed text-ivory/70">
                    Choose the condition that creates the most friction today. The second decision arrives in the same frame.
                  </p>
                </>
              )}
              {step === "change" && (
                <>
                  <p className="font-display text-2xl font-normal text-ivory">What needs to become clearer?</p>
                  <p className="mt-2 text-sm leading-relaxed text-ivory/70">
                    One desired shift completes the brief and opens the recommendation below.
                  </p>
                </>
              )}
              {step === "complete" && (
                <>
                  <p className="font-display text-2xl font-normal text-ivory">Your working brief is set.</p>
                  <p className="mt-2 text-sm leading-relaxed text-ivory/70">
                    The map below now translates both answers into the questions, deliverables, and package path that fit.
                  </p>
                </>
              )}
            </motion.div>
          </AnimatePresence>

          {(situationStone || changeStone) && (
            <div className="mt-7 space-y-2 border-t border-ivory/12 pt-5">
              {situationStone && (
                <button
                  type="button"
                  onClick={() => setStep("situation")}
                  className="group flex min-h-11 w-full items-center justify-between gap-3 rounded-xl px-2 text-left text-sm text-ivory/70 transition-colors hover:bg-ivory/[0.04] hover:text-ivory focus-visible:outline focus-visible:outline-2 focus-visible:outline-sandstone"
                  aria-label={`Edit situation: ${situationStone.title}`}
                >
                  <span>
                    <span className="mr-2 text-[0.6rem] uppercase tracking-[0.16em] text-ivory/40">01</span>
                    {situationStone.title}
                  </span>
                  <span aria-hidden="true" className="text-sandstone opacity-60 transition-opacity group-hover:opacity-100">Edit</span>
                </button>
              )}
              {changeStone && (
                <button
                  type="button"
                  onClick={() => setStep("change")}
                  className="group flex min-h-11 w-full items-center justify-between gap-3 rounded-xl px-2 text-left text-sm text-ivory/70 transition-colors hover:bg-ivory/[0.04] hover:text-ivory focus-visible:outline focus-visible:outline-2 focus-visible:outline-sandstone"
                  aria-label={`Edit desired change: ${changeStone.title}`}
                >
                  <span>
                    <span className="mr-2 text-[0.6rem] uppercase tracking-[0.16em] text-ivory/40">02</span>
                    {changeStone.title}
                  </span>
                  <span aria-hidden="true" className="text-sandstone opacity-60 transition-opacity group-hover:opacity-100">Edit</span>
                </button>
              )}
            </div>
          )}
        </div>

        <div className="relative min-h-[25rem] p-4 sm:p-6 lg:p-7">
          <div className="paper-grain" style={{ opacity: 0.06 }} aria-hidden="true" />
          <AnimatePresence mode="wait" initial={false}>
            {step === "complete" ? (
              <motion.div
                key="complete"
                data-project-map-brief="true"
                initial={prefersReducedMotion ? undefined : { opacity: 0, scale: 0.985 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={prefersReducedMotion ? undefined : { opacity: 0 }}
                transition={{ duration: prefersReducedMotion ? 0 : motionTokens.durationBase, ease: motionTokens.easeOrganic }}
                className="relative flex min-h-[21rem] flex-col justify-center"
              >
                <p className="text-xs font-medium uppercase tracking-[0.18em] text-ivory/50">The brief</p>
                <div className="mt-4 grid gap-3 sm:grid-cols-2">
                  <button
                    type="button"
                    onClick={() => setStep("situation")}
                    className="min-h-32 rounded-2xl border border-ivory/15 bg-ivory/[0.035] p-5 text-left transition-colors hover:border-sandstone/50 hover:bg-ivory/[0.06] focus-visible:outline focus-visible:outline-2 focus-visible:outline-sandstone"
                    aria-label={`Edit situation: ${situationStone?.title ?? "Not selected"}`}
                  >
                    <span className="text-[0.6rem] uppercase tracking-[0.18em] text-sandstone">01 · Situation</span>
                    <span className="mt-3 block font-display text-xl leading-snug text-ivory">{situationStone?.title}</span>
                    <span className="mt-2 block text-xs leading-relaxed text-ivory/60">{situationStone?.teach}</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setStep("change")}
                    className="min-h-32 rounded-2xl border border-ivory/15 bg-ivory/[0.035] p-5 text-left transition-colors hover:border-sandstone/50 hover:bg-ivory/[0.06] focus-visible:outline focus-visible:outline-2 focus-visible:outline-sandstone"
                    aria-label={`Edit desired change: ${changeStone?.title ?? "Not selected"}`}
                  >
                    <span className="text-[0.6rem] uppercase tracking-[0.18em] text-sandstone">02 · Desired change</span>
                    <span className="mt-3 block font-display text-xl leading-snug text-ivory">{changeStone?.title}</span>
                    <span className="mt-2 block text-xs leading-relaxed text-ivory/60">{changeStone?.teach}</span>
                  </button>
                </div>
                <div className="mt-5 flex items-center gap-3 text-sm text-ivory/65">
                  <span aria-hidden="true" className="h-px flex-1 bg-gradient-to-r from-transparent via-sandstone/50 to-transparent" />
                  Project map ready below
                  <span aria-hidden="true">↓</span>
                  <span aria-hidden="true" className="h-px flex-1 bg-gradient-to-r from-transparent via-sandstone/50 to-transparent" />
                </div>
              </motion.div>
            ) : (
              <motion.div
                key={step}
                initial={prefersReducedMotion ? undefined : { opacity: 0, x: 18 }}
                animate={{ opacity: 1, x: 0 }}
                exit={prefersReducedMotion ? undefined : { opacity: 0, x: -12 }}
                transition={{ duration: prefersReducedMotion ? 0 : motionTokens.durationBase, ease: motionTokens.easeOrganic }}
                className="relative"
              >
                <div role="group" aria-label={groupLabel} className="grid grid-cols-2 gap-2.5 sm:gap-3 xl:grid-cols-3">
                  {stones.map((stone, index) => {
                    const selected = activeId === stone.id;
                    const recommended = step === "change" && recommendedChange === stone.id && !selected;
                    return (
                      <motion.button
                        key={stone.id}
                        type="button"
                        aria-pressed={selected}
                        onClick={() => (step === "situation" ? chooseSituation(stone.id) : chooseChange(stone.id))}
                        initial={prefersReducedMotion ? undefined : { opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: selected && !prefersReducedMotion ? 2 : 0 }}
                        transition={{
                          duration: prefersReducedMotion ? 0 : motionTokens.durationFast,
                          delay: prefersReducedMotion ? 0 : index * 0.035,
                          ease: motionTokens.easeOrganic,
                        }}
                        whileTap={prefersReducedMotion ? undefined : { scale: 0.985 }}
                        className={`relative min-h-32 overflow-hidden rounded-2xl border p-3.5 text-left transition-colors duration-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-sandstone sm:min-h-36 sm:p-4 ${
                          selected
                            ? "border-sandstone/70 bg-sandstone/10"
                            : recommended
                              ? "border-sandstone/45 bg-sandstone/[0.055]"
                              : "border-ivory/14 bg-ivory/[0.035] hover:border-ivory/35 hover:bg-ivory/[0.06]"
                        }`}
                      >
                        <span className="absolute right-3 top-3 font-display text-sm text-ivory/25" aria-hidden="true">
                          {String(index + 1).padStart(2, "0")}
                        </span>
                        {recommended && (
                          <span className="block pr-5 text-[0.5rem] font-medium uppercase tracking-[0.14em] text-sandstone">
                            Recommended next
                          </span>
                        )}
                        <span className="mt-4 block pr-3 font-display text-[0.98rem] leading-snug text-ivory sm:text-lg">
                          {stone.title}
                        </span>
                        <span className="mt-2 block text-[0.68rem] leading-relaxed text-ivory/62 sm:text-xs">{stone.teach}</span>
                        {stone.meta && (
                          <span className="mt-2 block text-[0.52rem] uppercase tracking-[0.12em] text-sandstone/75">
                            {stone.meta}
                          </span>
                        )}
                      </motion.button>
                    );
                  })}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
