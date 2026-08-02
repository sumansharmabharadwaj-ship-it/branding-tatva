"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { SplitReveal } from "@/components/SplitReveal";

// Direct feedback that the hero's static question read as weak next to
// the rest of the page's ambition — visitors should experience a claim
// building before reading a question. Two short opinionated lines
// cycle in, then hand off to the existing char-reveal headline (the
// same SplitReveal/initSplitTextReveal machinery every other headline
// on the site uses, not a new reveal system).
//
// Phase 5 (Lighthouse, real Chrome, throttled mobile): the cycling
// ritual plus hydration pushed the H1 paint — the page's mobile LCP
// element — past 7s. CLAUDE.md's own motion rule ("nothing that blocks
// or delays reading a headline") decides the trade: on small viewports
// and under reduced motion the headline renders immediately; the
// two-line ritual is a desktop experience. The choice is made once at
// mount with a synchronous matchMedia read (an async media-query hook
// would report "mobile" on desktop's first tick and kill the ritual
// there too). SSR renders the first cycling line for every visitor —
// identical markup either way, so there is no hydration mismatch.
const LINES = ["Most brands compete on price.", "The remembered ones compete on something else."];
const LINE_DURATION = 1100;

type Mode = "pending" | "cycle" | "headline";

export function CyclingStatement({ headline }: { headline: React.ReactNode }) {
  const prefersReducedMotion = useReducedMotion();
  const [mode, setMode] = useState<Mode>("pending");
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const mobile = window.matchMedia("(max-width: 1023px)").matches;
    setMode(prefersReducedMotion || mobile ? "headline" : "cycle");
  }, [prefersReducedMotion]);

  useEffect(() => {
    if (mode !== "cycle") return;
    if (index >= LINES.length) {
      setMode("headline");
      return;
    }
    const timer = setTimeout(() => setIndex((i) => i + 1), LINE_DURATION);
    return () => clearTimeout(timer);
  }, [mode, index]);

  if (mode === "headline") {
    return (
      <SplitReveal
        as="h1"
        splitType="chars"
        // Matches Home's hero scale and this hero's documented Phase 1
        // typography pass — see the git history of this file for the
        // full sizing rationale.
        className="mt-6 max-w-3xl font-display text-[clamp(2.5rem,6vw,4.6rem)] font-normal leading-[1.04] tracking-[-0.01em] text-ivory"
      >
        {headline}
      </SplitReveal>
    );
  }

  return (
    <div className="mt-6 flex h-[clamp(2.9rem,6.5vw,5rem)] max-w-2xl items-center">
      <AnimatePresence mode="wait">
        <motion.p
          key={Math.min(index, LINES.length - 1)}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          className="font-display text-[clamp(1.85rem,4.5vw,3.25rem)] font-normal leading-[1.12] text-ivory/90"
        >
          {LINES[Math.min(index, LINES.length - 1)]}
        </motion.p>
      </AnimatePresence>
    </div>
  );
}
