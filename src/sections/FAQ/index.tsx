"use client";

import { useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { faqs } from "@/data/faqs";
import { track } from "@/lib/analytics";
import { Reveal } from "@/components/Reveal";
import { answerVariants, answerTransition, TOGGLE_ROTATION } from "./animations";

export function FAQ({ questions }: { questions?: string[] } = {}) {
  const items = questions ? faqs.filter((faq) => questions.includes(faq.question)) : faqs;
  const [openIndex, setOpenIndex] = useState<number | null>(0);
  const prefersReducedMotion = useReducedMotion();

  return (
    <div className="relative" aria-label="Common questions and answers">
      <div aria-hidden="true" className="absolute bottom-0 left-[1.05rem] top-0 w-px bg-border/70" />
      <div className="space-y-1">
        {items.map((item, i) => {
          const isOpen = openIndex === i;
          const questionId = `faq-question-${i}`;
          const answerId = `faq-answer-${i}`;

          return (
            <Reveal key={item.question} delay={i * 0.05}>
              <div className="relative pl-10">
                <span
                  aria-hidden="true"
                  className="absolute left-0 top-[1.15rem] flex h-9 w-9 items-center justify-center rounded-full border font-display text-xs transition-all duration-500 ease-earth"
                  style={{
                    borderColor: isOpen ? "rgba(128,82,58,0.55)" : "rgba(63,52,43,0.16)",
                    backgroundColor: isOpen ? "rgba(128,82,58,0.10)" : "rgba(244,239,230,0.92)",
                    color: isOpen ? "#80523A" : "rgba(63,52,43,0.48)",
                    transform: isOpen ? "scale(1.06)" : "scale(1)",
                  }}
                >
                  {String(i + 1).padStart(2, "0")}
                </span>

                <div
                  className="rounded-2xl border transition-[background-color,border-color,box-shadow] duration-500 ease-earth"
                  style={{
                    borderColor: isOpen ? "rgba(128,82,58,0.22)" : "transparent",
                    backgroundColor: isOpen ? "rgba(244,239,230,0.68)" : "transparent",
                    boxShadow: isOpen ? "0 16px 44px rgba(63,52,43,0.07)" : "none",
                  }}
                >
                  <button
                    type="button"
                    id={questionId}
                    className="group flex w-full items-center justify-between rounded-2xl px-4 py-5 text-left font-medium text-soil focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-clay"
                    aria-expanded={isOpen}
                    aria-controls={answerId}
                    onClick={() => {
                      if (!isOpen) track("faq_opened", { question: item.question });
                      setOpenIndex(isOpen ? null : i);
                    }}
                  >
                    <span className="pr-5 transition-transform duration-500 ease-earth group-hover:translate-x-1">
                      {item.question}
                    </span>
                    <span
                      className="relative flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-border/80 text-foreground-secondary transition-all duration-300 ease-earth group-hover:border-clay/40 group-hover:text-clay"
                      style={{ transform: isOpen ? TOGGLE_ROTATION.open : TOGGLE_ROTATION.closed }}
                      aria-hidden="true"
                    >
                      +
                    </span>
                  </button>

                  <AnimatePresence initial={false}>
                    {isOpen && (
                      <motion.div
                        id={answerId}
                        role="region"
                        aria-labelledby={questionId}
                        variants={prefersReducedMotion ? undefined : answerVariants}
                        initial="initial"
                        animate="animate"
                        exit="exit"
                        transition={answerTransition}
                        className="overflow-hidden"
                      >
                        <div className="px-4 pb-6">
                          <span aria-hidden="true" className="mb-4 block h-px w-10 bg-clay/45" />
                          <p className="max-w-xl text-sm leading-relaxed text-foreground-secondary">{item.answer}</p>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>
            </Reveal>
          );
        })}
      </div>
    </div>
  );
}
