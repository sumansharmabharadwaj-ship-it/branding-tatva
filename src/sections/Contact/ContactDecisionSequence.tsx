"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { useId, useState } from "react";
import { EASE_AIR, MOTION_DISTANCE, MOTION_DURATION } from "@/lib/motion";

const STEPS = [
  {
    number: "01",
    title: "Context is read",
    body: "The enquiry reaches Suman directly. The first read identifies the business change, the waiting decision and the material already available.",
    outcome: "A shared view of the question",
  },
  {
    number: "02",
    title: "The decision is shaped",
    body: "The reply addresses the situation and asks for the smallest amount of extra context needed to understand fit and scope.",
    outcome: "A useful direction for the next exchange",
  },
  {
    number: "03",
    title: "The next step is agreed",
    body: "When the work fits, scope, cadence and the first decision are aligned before a calendar invitation enters the exchange.",
    outcome: "A clear agenda for moving forward",
  },
] as const;

export function ContactDecisionSequence() {
  const [activeIndex, setActiveIndex] = useState(0);
  const prefersReducedMotion = useReducedMotion();
  const titleId = useId();
  const active = STEPS[activeIndex];

  return (
    <div>
      <p className="text-sm font-medium uppercase tracking-[0.16em] text-action-secondary">What happens next</p>
      <h2 id={titleId} className="mt-3 max-w-xl font-display text-display-sm font-normal text-soil">
        Three decisions carry the enquiry forward.
      </h2>
      <p className="mt-4 max-w-xl text-sm leading-6 text-foreground-secondary">
        Select a stage to see its purpose. The sequence keeps the first exchange direct, calm and useful.
      </p>

      <div className="mt-8 grid gap-5 sm:grid-cols-[0.7fr_1.3fr]">
        <div className="space-y-2" role="tablist" aria-labelledby={titleId}>
          {STEPS.map((step, index) => {
            const selected = activeIndex === index;
            return (
              <button
                key={step.number}
                type="button"
                role="tab"
                aria-selected={selected}
                aria-controls={`${titleId}-panel`}
                onClick={() => setActiveIndex(index)}
                className={`grid min-h-14 w-full grid-cols-[2.5rem_1fr] items-center gap-3 rounded-xl border px-4 py-3 text-left transition-[background-color,border-color,transform] duration-200 focus-ring-halo ${
                  selected
                    ? "translate-x-1 border-soil bg-soil text-ivory"
                    : "border-soil/12 bg-background-elevated/60 text-soil hover:translate-x-0.5 hover:border-soil/30"
                }`}
              >
                <span className="text-xs font-semibold tracking-[0.16em] opacity-55">{step.number}</span>
                <span className="font-display text-lg">{step.title}</span>
                <span className="sr-only">. {step.body}. Outcome: {step.outcome}.</span>
              </button>
            );
          })}
        </div>

        <div id={`${titleId}-panel`} role="tabpanel" className="min-h-72 overflow-hidden rounded-2xl border border-soil/12 bg-background-elevated p-6 shadow-elevation-sm">
          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              key={active.number}
              initial={prefersReducedMotion ? undefined : { opacity: 0, y: MOTION_DISTANCE.content }}
              animate={{ opacity: 1, y: 0 }}
              exit={prefersReducedMotion ? undefined : { opacity: 0, y: -MOTION_DISTANCE.near }}
              transition={{ duration: prefersReducedMotion ? 0 : MOTION_DURATION.reveal, ease: EASE_AIR }}
            >
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-clay">Stage {active.number}</p>
              <h3 className="mt-4 font-display text-3xl font-normal text-soil">{active.title}</h3>
              <p className="mt-4 text-sm leading-6 text-foreground-secondary">{active.body}</p>
              <div className="mt-7 border-t border-soil/12 pt-5">
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-action-secondary">Outcome</p>
                <p className="mt-2 font-display text-xl font-normal text-soil">{active.outcome}</p>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      <p className="mt-7 text-sm leading-6 text-foreground-secondary">
        A presentation can wait. Share the business context, the change underway, the decision ahead and any real timing constraint.
      </p>
    </div>
  );
}
