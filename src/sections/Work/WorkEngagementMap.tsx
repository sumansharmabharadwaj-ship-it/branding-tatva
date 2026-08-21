"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { useId, useState } from "react";
import { Container } from "@/components/Container";
import { EASE_AIR, MOTION_DISTANCE, MOTION_DURATION } from "@/lib/motion";

const STAGES = [
  {
    number: "01",
    title: "Question",
    text: "Name the decision, the business context, and the friction the current brand keeps creating.",
    decision: "A precise problem and a bounded scope",
  },
  {
    number: "02",
    title: "Decode",
    text: "Audit the category, audience, existing material, and the distance between intended meaning and received meaning.",
    decision: "What changes, what stays, and why",
  },
  {
    number: "03",
    title: "Architect",
    text: "Define the position, narrative, verbal system, experience logic, and the rules that hold them together.",
    decision: "A direction the team can use",
  },
  {
    number: "04",
    title: "Signal",
    text: "Carry the strategy into the selected website, content, campaign, or identity-direction deliverables.",
    decision: "A coherent system in market",
  },
  {
    number: "05",
    title: "Learn",
    text: "Review the observable response and use the evidence available within the engagement boundary.",
    decision: "The next decision, grounded in signals",
  },
] as const;

export function WorkEngagementMap() {
  const [activeIndex, setActiveIndex] = useState(0);
  const prefersReducedMotion = useReducedMotion();
  const titleId = useId();
  const active = STAGES[activeIndex];

  return (
    <Container className="mt-16 border-t border-border pt-14 sm:mt-20 sm:pt-16">
      <div className="grid gap-10 lg:grid-cols-[0.72fr_1.28fr] lg:gap-14">
        <div>
          <p className="text-sm font-medium uppercase tracking-wide text-action-secondary">Process river</p>
          <h2 id={titleId} className="mt-2 max-w-xl text-display-sm font-display font-normal text-soil">
            Each phase resolves one decision before the next gains weight.
          </h2>
          <p className="mt-4 max-w-xl text-foreground-secondary">
            Choose a phase to see its action and exit decision. The sequence stays stable while scope and cadence follow the project.
          </p>

          <div className="mt-8 space-y-2" role="tablist" aria-labelledby={titleId}>
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
                  className={`grid min-h-14 w-full grid-cols-[3rem_1fr_auto] items-center gap-3 rounded-xl border px-4 py-3 text-left transition-[border-color,background-color,transform] duration-200 focus-ring-halo ${
                    selected
                      ? "translate-x-1 border-soil bg-soil text-ivory"
                      : "border-border bg-background-elevated text-soil hover:translate-x-0.5 hover:border-soil/35"
                  }`}
                >
                  <span className="text-xs font-semibold tracking-[0.16em] opacity-55">{stage.number}</span>
                  <span className="font-display text-lg">{stage.title}</span>
                  <span className="text-xs opacity-45" aria-hidden="true">→</span>
                  <span className="sr-only">. {stage.text}. Decision: {stage.decision}.</span>
                </button>
              );
            })}
          </div>
        </div>

        <div
          id={`${titleId}-panel`}
          role="tabpanel"
          className="relative min-h-[32rem] overflow-hidden rounded-[1.75rem] border border-soil/12 bg-soil p-6 text-ivory shadow-elevation-md sm:p-9"
        >
          <div className="flex items-center justify-between border-b border-ivory/12 pb-5">
            <span className="text-xs font-semibold uppercase tracking-[0.18em] text-sandstone">Active decision</span>
            <span className="font-display text-3xl text-ivory/25">{active.number}</span>
          </div>

          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              key={active.number}
              initial={prefersReducedMotion ? undefined : { opacity: 0, x: MOTION_DISTANCE.scene }}
              animate={{ opacity: 1, x: 0 }}
              exit={prefersReducedMotion ? undefined : { opacity: 0, x: -MOTION_DISTANCE.content }}
              transition={{ duration: prefersReducedMotion ? 0 : MOTION_DURATION.reveal, ease: EASE_AIR }}
              className="pt-10"
            >
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-sandstone">Phase {active.number}</p>
              <h3 className="mt-4 font-display text-[clamp(2.6rem,5vw,5.4rem)] font-normal leading-none text-ivory">
                {active.title}
              </h3>
              <p className="mt-6 max-w-xl text-base leading-7 text-ivory/72">{active.text}</p>
              <div className="mt-10 rounded-2xl border border-ivory/14 bg-ivory/[0.055] p-5 sm:p-6">
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-sandstone">Exit decision</p>
                <p className="mt-3 font-display text-2xl font-normal text-ivory">{active.decision}</p>
              </div>
            </motion.div>
          </AnimatePresence>

          <div className="absolute inset-x-6 bottom-7 sm:inset-x-9 sm:bottom-9" aria-hidden="true">
            <div className="h-px bg-ivory/12">
              <motion.div
                className="h-px bg-sandstone"
                animate={{ width: `${((activeIndex + 1) / STAGES.length) * 100}%` }}
                transition={{ duration: prefersReducedMotion ? 0 : MOTION_DURATION.focus, ease: EASE_AIR }}
              />
            </div>
            <div className="mt-3 flex justify-between text-[0.6rem] font-semibold tracking-[0.18em] text-ivory/35">
              <span>CONTEXT</span>
              <span>DECISION</span>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-10 grid gap-5 md:grid-cols-3">
        {[
          ["You bring", "Context, access to existing material, timely decisions, and honest constraints."],
          ["Suman leads", "Diagnosis, strategy, scoped production, documentation, and direct communication."],
          ["Together", "Approve trade-offs, keep the decision record current, and agree on the evidence boundary."],
        ].map(([title, body], index) => (
          <motion.article
            key={title}
            initial={prefersReducedMotion ? undefined : { opacity: 0, y: MOTION_DISTANCE.content }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.45 }}
            transition={{ duration: prefersReducedMotion ? 0 : MOTION_DURATION.reveal, delay: index * 0.06, ease: EASE_AIR }}
            className="rounded-xl border border-border bg-background-elevated p-6"
          >
            <p className="text-xs font-medium uppercase tracking-[0.15em] text-action-secondary">{title}</p>
            <p className="mt-3 text-sm text-foreground-secondary">{body}</p>
          </motion.article>
        ))}
      </div>
    </Container>
  );
}
