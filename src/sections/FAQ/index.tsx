"use client";

import { useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { faqs } from "@/data/faqs";
import { track } from "@/lib/analytics";
import { Reveal } from "@/components/Reveal";
import { answerTransition, TOGGLE_ROTATION } from "./animations";

export function FAQ({ questions }: { questions?: string[] } = {}) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const prefersReducedMotion = useReducedMotion();

  return (
    <div className="divide-y divide-border">
      {(questions ? faqs.filter((f) => questions.includes(f.question)) : faqs).map((item, i) => {
        const isOpen = openIndex === i;
        const questionId = `faq-question-${i}`;
        const answerId = `faq-answer-${i}`;
        return (
          <Reveal key={item.question} delay={i * 0.05} className="py-1">
            <button
              type="button"
              id={questionId}
              className="flex w-full items-center justify-between rounded-2xl px-3 py-3 text-left font-medium text-soil transition-colors duration-300 hover:bg-clay/8 focus-visible:bg-clay/8"
              aria-expanded={isOpen}
              aria-controls={answerId}
              onClick={() => {
                // Only the opening counts: a close is the same click
                // twice and would double every question's number.
                if (!isOpen) track("faq_opened", { question: item.question });
                setOpenIndex(isOpen ? null : i);
              }}
            >
              {item.question}
              <span
                className="ml-4 shrink-0 text-foreground-secondary transition-transform duration-300 ease-earth"
                style={{ transform: isOpen ? TOGGLE_ROTATION.open : TOGGLE_ROTATION.closed }}
                aria-hidden="true"
              >
                +
              </span>
            </button>
            {/* The answer is always in the DOM and only its height
                animates. It used to mount on open, which meant the
                server rendered eleven questions with no answers: the
                FAQPage schema promised text that existed nowhere in the
                markup, and any crawler that ignores JSON-LD, which
                includes most LLM crawlers, saw questions alone. */}
            <motion.div
              id={answerId}
              role="region"
              aria-labelledby={questionId}
              initial={false}
              animate={{
                height: isOpen ? "auto" : 0,
                opacity: isOpen ? 1 : 0,
              }}
              transition={prefersReducedMotion ? { duration: 0 } : answerTransition}
              className="overflow-hidden"
            >
              <p className="mt-3 px-3 text-sm text-foreground-secondary">{item.answer}</p>
            </motion.div>
          </Reveal>
        );
      })}
    </div>
  );
}
