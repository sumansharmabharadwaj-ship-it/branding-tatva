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

// `dark` mirrors the same prop ProcessSection already exposes — this
// section moved from the light bg-background-alt tier to the same
// bg-soil/video treatment as every other Services section (direct
// feedback that the one remaining light stretch still read as blank),
// so every hardcoded light-only color needs a dark-bg equivalent.
export function RiskRemovalFAQ({ dark = false }: { dark?: boolean }) {
  const [openQuestion, setOpenQuestion] = useState<string | null>(null);
  const prefersReducedMotion = useReducedMotion();

  return (
    <div className="space-y-10">
      {/* Phase 2 motion direction — "the calm chapter": entrances here
          run slower and further apart than anywhere earlier on the
          page, the motion equivalent of the room going quiet before a
          decision. */}
      {GROUPS.map((group, gi) => (
        <Reveal key={group.label} delay={gi * 0.14} duration={0.9}>
          {/* Phase 1 typography: dark-variant group labels moved off
              warm sandstone (this section's slate mood is the page's
              coolest chapter — a warm label on every group re-warmed
              it) onto a cool quiet ivory, with wider editorial
              tracking. Questions read a step larger; answers at full
              text-base. */}
          <p
            className={`text-xs font-medium uppercase tracking-[0.18em] ${dark ? "text-ivory/70" : "text-action-secondary"}`}
          >
            {group.label}
          </p>
          {/* Interaction language — "the fog clearing", this chapter's
              own motion identity: dividers draw themselves in like
              horizon lines emerging from mist, a soft glow blooms under
              the cursor (light through fog, matching the mist layers in
              the section backdrop), the question leans gently toward the
              reader, and open answers condense out of a blur instead of
              simply sliding down. No other section shares any of these. */}
          <div className="mt-3">
            {group.questions.map((question, qi) => {
              const item = faqs.find((f) => f.question === question);
              if (!item) return null;
              const isOpen = openQuestion === item.question;
              return (
                // Each question condenses out of the fog as the visitor
                // descends — the section reads as a guided sequence of
                // arrivals rather than one tall pre-rendered list.
                <motion.div
                  key={item.question}
                  className="py-1"
                  initial={prefersReducedMotion ? undefined : { opacity: 0, y: 18, filter: "blur(4px)" }}
                  whileInView={prefersReducedMotion ? undefined : { opacity: 1, y: 0, filter: "blur(0px)" }}
                  viewport={{ once: true, margin: "0px 0px -8% 0px" }}
                  transition={{ duration: 0.65, delay: 0.1 + qi * 0.08, ease: [0.16, 1, 0.3, 1] }}
                >
                  <motion.div
                    aria-hidden="true"
                    className={`h-px ${dark ? "bg-ivory/15" : "bg-border"}`}
                    style={{ originX: 0 }}
                    initial={prefersReducedMotion ? undefined : { scaleX: 0 }}
                    whileInView={prefersReducedMotion ? undefined : { scaleX: 1 }}
                    viewport={{ once: true, margin: "0px 0px -6% 0px" }}
                    transition={{ duration: 1.1, delay: 0.15 + qi * 0.1, ease: [0.16, 1, 0.3, 1] }}
                  />
                  <button
                    type="button"
                    className={`group mt-1 flex w-full items-center justify-between rounded-lg px-3 py-3.5 text-left text-[1.05rem] font-medium transition-all duration-500 ${
                      dark
                        ? `text-ivory hover:bg-ivory/[0.07] hover:shadow-[0_0_38px_rgba(222,230,236,0.08)] focus-visible:bg-ivory/[0.07] ${isOpen ? "bg-ivory/[0.05]" : ""}`
                        : "text-soil hover:bg-clay/8 focus-visible:bg-clay/8"
                    }`}
                    aria-expanded={isOpen}
                    onClick={() => setOpenQuestion(isOpen ? null : item.question)}
                  >
                    <span className="transition-transform duration-500 ease-out group-hover:translate-x-1.5">
                      {item.question}
                    </span>
                    <span
                      aria-hidden="true"
                      className={`ml-4 shrink-0 text-lg transition-all duration-300 group-hover:opacity-100 ${
                        dark ? "text-ivory/70 opacity-70" : "text-action-primary"
                      }`}
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
                        <motion.p
                          initial={prefersReducedMotion ? undefined : { opacity: 0, filter: "blur(6px)", y: 4 }}
                          animate={prefersReducedMotion ? undefined : { opacity: 1, filter: "blur(0px)", y: 0 }}
                          transition={{ duration: 0.5, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
                          className={`max-w-2xl pb-4 text-base leading-relaxed ${dark ? "text-ivory/90" : "text-foreground-secondary"}`}
                        >
                          {item.answer}
                        </motion.p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              );
            })}
          </div>
        </Reveal>
      ))}
    </div>
  );
}
