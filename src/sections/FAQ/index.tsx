"use client";

import { useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { faqs } from "@/data/faqs";
import { answerVariants, answerTransition, TOGGLE_ROTATION } from "./animations";

export function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const prefersReducedMotion = useReducedMotion();

  return (
    <div className="divide-y divide-border">
      {faqs.map((item, i) => {
        const isOpen = openIndex === i;
        return (
          <div key={item.question} className="py-1">
            <button
              type="button"
              className="flex w-full items-center justify-between rounded-lg px-3 py-3 text-left font-medium text-soil transition-colors duration-300 hover:bg-clay/8 focus-visible:bg-clay/8"
              aria-expanded={isOpen}
              onClick={() => setOpenIndex(isOpen ? null : i)}
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
            <AnimatePresence initial={false}>
              {isOpen && (
                <motion.div
                  variants={prefersReducedMotion ? undefined : answerVariants}
                  initial="initial"
                  animate="animate"
                  exit="exit"
                  transition={answerTransition}
                  className="overflow-hidden"
                >
                  <p className="mt-3 px-3 text-sm text-foreground-secondary">{item.answer}</p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        );
      })}
    </div>
  );
}
