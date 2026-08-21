"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { useId, useState } from "react";
import { Container } from "@/components/Container";
import { LinkButton } from "@/components/Button";
import { EASE_AIR, MOTION_DISTANCE, MOTION_DURATION } from "@/lib/motion";

const STAGES = [
  {
    number: "01",
    label: "Credentials",
    title: "Two disciplines, held intact",
    description:
      "Clinical psychology studies attention, perception and decision structure. English literature studies voice, interpretation and the architecture of meaning.",
    items: ["M.A. Clinical Psychology · 2023", "B.A. English Literature · 2021"],
  },
  {
    number: "02",
    label: "Lenses",
    title: "Observation meets language",
    description:
      "One lens reads the human signal. The other gives that signal a precise verbal form. Together they reveal where a brand loses meaning between intention and reception.",
    items: ["Attention", "Perception", "Narrative", "Memory"],
  },
  {
    number: "03",
    label: "Method",
    title: "Evidence becomes a strategic choice",
    description:
      "Research is decoded into a position, a narrative, a verbal system and the rules that keep every expression recognisably connected.",
    items: ["Research", "Positioning", "Narrative", "System rules"],
  },
  {
    number: "04",
    label: "Application",
    title: "The choice travels into the work",
    description:
      "The final system gives website, content, identity direction and campaign decisions one centre of gravity, with every claim bounded by available evidence.",
    items: ["Website", "Content", "Identity direction", "Campaign logic"],
  },
] as const;

export function CredentialStrategyMap({ compact = false }: { compact?: boolean }) {
  const [activeIndex, setActiveIndex] = useState(0);
  const prefersReducedMotion = useReducedMotion();
  const titleId = useId();
  const active = STAGES[activeIndex];

  return (
    <section
      id={compact ? "credential-strategy-teaser" : "credential-strategy"}
      aria-labelledby={titleId}
      className={`relative overflow-hidden ${compact ? "bg-background-alt py-20 sm:py-24" : "bg-[#10151A] py-20 text-ivory sm:py-28 lg:min-h-svh lg:flex lg:items-center"}`}
    >
      <Container className="relative w-full">
        <div className="grid gap-10 lg:grid-cols-[0.78fr_1.22fr] lg:gap-16">
          <div>
            <p className={`text-xs font-semibold uppercase tracking-[0.2em] ${compact ? "text-action-secondary" : "text-sandstone"}`}>
              Degree → brand strategy
            </p>
            <h2
              id={titleId}
              className={`mt-4 max-w-xl font-display font-normal ${compact ? "text-display-md text-soil" : "text-[clamp(2.2rem,4vw,4.4rem)] leading-[1.02] text-ivory"}`}
            >
              {compact
                ? "Two disciplines enter the strategy room together."
                : "A qualification earns its place by changing a client decision."}
            </h2>
            <p className={`mt-5 max-w-xl leading-7 ${compact ? "text-foreground-secondary" : "text-ivory/72"}`}>
              Follow the transformation from verified study to a practical brand system. Choose any stage to inspect the connection.
            </p>

            <div className="mt-8 grid grid-cols-2 gap-2 sm:grid-cols-4 lg:grid-cols-2" role="tablist" aria-label="Credential to strategy stages">
              {STAGES.map((stage, index) => {
                const selected = activeIndex === index;
                return (
                  <button
                    key={stage.number}
                    type="button"
                    role="tab"
                    aria-selected={selected}
                    aria-controls={`${titleId}-panel`}
                    onClick={() => setActiveIndex(index)}
                    className={`min-h-14 rounded-xl border px-4 py-3 text-left transition-[border-color,background-color,transform] duration-200 focus-ring-halo ${
                      compact
                        ? selected
                          ? "border-soil bg-soil text-ivory"
                          : "border-border bg-background-elevated text-soil hover:-translate-y-0.5 hover:border-soil/35"
                        : selected
                          ? "border-sandstone/70 bg-ivory/[0.1] text-ivory"
                          : "border-ivory/14 bg-ivory/[0.035] text-ivory/66 hover:-translate-y-0.5 hover:border-ivory/30"
                    }`}
                  >
                    <span className="block text-[0.62rem] font-semibold tracking-[0.18em] opacity-60">{stage.number}</span>
                    <span className="mt-1 block text-sm font-medium">{stage.label}</span>
                    <span className="sr-only">. {stage.title}. {stage.description}</span>
                  </button>
                );
              })}
            </div>

            {compact ? (
              <div className="mt-7">
                <LinkButton href="/about#credential-strategy">See the full method map</LinkButton>
              </div>
            ) : null}
          </div>

          <div
            id={`${titleId}-panel`}
            role="tabpanel"
            className={`relative min-h-[28rem] overflow-hidden rounded-[1.75rem] border p-6 sm:p-8 ${
              compact
                ? "border-border bg-background-elevated shadow-elevation-md"
                : "border-ivory/14 bg-ivory/[0.055] shadow-[0_30px_100px_rgba(0,0,0,0.24)]"
            }`}
          >
            <div className="flex items-center justify-between border-b border-current/10 pb-5">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] opacity-65">Transformation map</p>
              <p className="font-display text-2xl opacity-35">{active.number} / 04</p>
            </div>

            <AnimatePresence mode="wait" initial={false}>
              <motion.div
                key={active.number}
                initial={prefersReducedMotion ? undefined : { opacity: 0, y: MOTION_DISTANCE.content }}
                animate={{ opacity: 1, y: 0 }}
                exit={prefersReducedMotion ? undefined : { opacity: 0, y: -MOTION_DISTANCE.near }}
                transition={{ duration: prefersReducedMotion ? 0 : MOTION_DURATION.reveal, ease: EASE_AIR }}
                className="pt-8"
              >
                <p className={`text-xs font-semibold uppercase tracking-[0.2em] ${compact ? "text-clay" : "text-sandstone"}`}>
                  {active.label}
                </p>
                <h3 className={`mt-4 max-w-xl font-display text-3xl font-normal leading-tight sm:text-4xl ${compact ? "text-soil" : "text-ivory"}`}>
                  {active.title}
                </h3>
                <p className={`mt-5 max-w-xl leading-7 ${compact ? "text-foreground-secondary" : "text-ivory/72"}`}>
                  {active.description}
                </p>

                <div className="mt-10 grid gap-3 sm:grid-cols-2">
                  {active.items.map((item, index) => (
                    <motion.div
                      key={item}
                      initial={prefersReducedMotion ? undefined : { opacity: 0, x: -MOTION_DISTANCE.near }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{
                        duration: prefersReducedMotion ? 0 : MOTION_DURATION.reveal,
                        delay: prefersReducedMotion ? 0 : index * 0.06,
                        ease: EASE_AIR,
                      }}
                      className={`rounded-xl border px-4 py-4 text-sm ${
                        compact
                          ? "border-soil/10 bg-parchment/50 text-soil"
                          : "border-ivory/12 bg-[#071117]/45 text-ivory/82"
                      }`}
                    >
                      <span className="mr-3 font-display text-lg opacity-35">{String(index + 1).padStart(2, "0")}</span>
                      {item}
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            </AnimatePresence>

            <div className="absolute inset-x-6 bottom-6 h-px overflow-hidden bg-current/10 sm:inset-x-8 sm:bottom-8" aria-hidden="true">
              <motion.div
                className={`h-full ${compact ? "bg-clay" : "bg-sandstone"}`}
                animate={{ width: `${((activeIndex + 1) / STAGES.length) * 100}%` }}
                transition={{ duration: prefersReducedMotion ? 0 : MOTION_DURATION.focus, ease: EASE_AIR }}
              />
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
