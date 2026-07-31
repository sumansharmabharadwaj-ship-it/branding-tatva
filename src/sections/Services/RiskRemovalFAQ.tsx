"use client";

import { useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { Reveal } from "@/components/Reveal";
import { faqs } from "@/data/faqs";
import { answerVariants, answerTransition, TOGGLE_ROTATION } from "@/sections/FAQ/animations";

// Direct feedback that a flat 11-question accordion read as boring next
// to the rest of the page. Groups the same real questions from
// data/faqs.ts into three real categories by what they're actually
// about — a static mapping here, not a change to faqs.ts itself, so
// the shared <FAQ /> component (still used unmodified on Home) is
// unaffected. Every question and answer is identical to the flat
// version; only the grouping and accordion chrome are new.
const GROUPS = [
  {
    label: "Working together",
    questions: [
      "Can you help a brand new business?",
      "Can you help an existing brand that already has an identity?",
      "Can we work remotely?",
      "What should I prepare before we start?",
    ],
  },
  {
    label: "Scope & deliverables",
    questions: [
      "What does branding actually include?",
      "Do you design logos?",
      "Can you actually implement, or just strategize?",
      "Do you manage ongoing content and campaigns?",
    ],
  },
  {
    label: "Timeline & results",
    questions: ["How long does a project take?", "Will branding increase revenue?", "How long before I see results?"],
  },
] as const;

export function RiskRemovalFAQ() {
  const [openQuestion, setOpenQuestion] = useState<string | null>(null);
  const prefersReducedMotion = useReducedMotion();

  return (
    <div className="space-y-10">
      {GROUPS.map((group, gi) => (
        <Reveal key={group.label} delay={gi * 0.08}>
          <p className="text-xs font-medium uppercase tracking-wide text-action-secondary">{group.label}</p>
          <div className="mt-3 divide-y divide-border">
            {group.questions.map((question) => {
              const item = faqs.find((f) => f.question === question);
              if (!item) return null;
              const isOpen = openQuestion === item.question;
              return (
                <div key={item.question} className="py-1">
                  <button
                    type="button"
                    className="flex w-full items-center justify-between rounded-lg px-3 py-3 text-left font-medium text-soil transition-colors duration-300 hover:bg-clay/8 focus-visible:bg-clay/8"
                    aria-expanded={isOpen}
                    onClick={() => setOpenQuestion(isOpen ? null : item.question)}
                  >
                    {item.question}
                    <span
                      aria-hidden="true"
                      className="ml-4 shrink-0 text-lg text-action-primary transition-transform duration-300"
                      style={{ transform: isOpen ? TOGGLE_ROTATION.open : TOGGLE_ROTATION.closed }}
                    >
                      +
                    </span>
                  </button>
                  <AnimatePresence initial={false}>
                    {isOpen && (
                      <motion.div
                        variants={prefersReducedMotion ? undefined : answerVariants}
                        initial="initial"
                        animate="animate"
                        exit="exit"
                        transition={answerTransition}
                        className="overflow-hidden px-3"
                      >
                        <p className="pb-4 text-foreground-secondary">{item.answer}</p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </div>
        </Reveal>
      ))}
    </div>
  );
}
