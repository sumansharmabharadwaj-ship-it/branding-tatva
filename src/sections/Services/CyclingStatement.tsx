"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { SplitReveal } from "@/components/SplitReveal";

// Direct feedback that the hero's static question read as weak next to
// the rest of the page's ambition — visitors should experience a claim
// building before reading a question. Two short opinionated lines
// cycle in, then hand off to the existing char-reveal headline (the
// same SplitReveal/initSplitTextReveal machinery every other headline
// on the site uses, not a new reveal system). Under reduced motion the
// cycling lines are skipped entirely — the headline renders immediately,
// same as every other motion component's own convention.
const LINES = ["Most brands compete on price.", "The remembered ones compete on something else."];
const LINE_DURATION = 1100;

export function CyclingStatement({ headline }: { headline: React.ReactNode }) {
  const prefersReducedMotion = useReducedMotion();
  const [index, setIndex] = useState(0);
  const [done, setDone] = useState(prefersReducedMotion ?? false);

  useEffect(() => {
    if (prefersReducedMotion) {
      setDone(true);
      return;
    }
    if (index >= LINES.length) {
      setDone(true);
      return;
    }
    const timer = setTimeout(() => setIndex((i) => i + 1), LINE_DURATION);
    return () => clearTimeout(timer);
  }, [index, prefersReducedMotion]);

  if (done) {
    return (
      <SplitReveal
        as="h1"
        splitType="chars"
        className="mx-auto mt-6 max-w-2xl font-display text-[clamp(2rem,4.5vw,3.25rem)] font-normal leading-[1.1] text-ivory"
      >
        {headline}
      </SplitReveal>
    );
  }

  return (
    <div className="mx-auto mt-6 flex h-[clamp(2.6rem,6vw,4.25rem)] max-w-2xl items-center justify-center">
      <AnimatePresence mode="wait">
        <motion.p
          key={index}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          className="font-display text-[clamp(1.6rem,4vw,2.75rem)] font-normal leading-[1.15] text-ivory/90"
        >
          {LINES[index]}
        </motion.p>
      </AnimatePresence>
    </div>
  );
}
