"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useHydratedReducedMotion } from "@/hooks/useHydratedReducedMotion";
import { EASE_AIR } from "@/lib/motion";

// The hero used to list where a brand gap can live as one static clause.
// Naming the visitor's own case is the conversion moment of a contact
// page, so the places now surface one at a time: a quiet rotor that lets
// each possibility land alone for a breath before the next. The full list
// stays in the accessible text and in the server render, so search
// engines, screen readers, and reduced motion visitors all read the
// original sentence unchanged.
const PLACES = [
  "positioning",
  "voice",
  "identity",
  "recognition",
  "the part that refuses a name",
] as const;

const HOLD_MS = 2600;

export function ContactRotatingGap() {
  const prefersReducedMotion = useHydratedReducedMotion();
  const [index, setIndex] = useState(0);
  const [running, setRunning] = useState(false);

  useEffect(() => {
    if (prefersReducedMotion) return;
    setRunning(true);
    const timer = window.setInterval(() => {
      setIndex((current) => (current + 1) % PLACES.length);
    }, HOLD_MS);
    return () => {
      window.clearInterval(timer);
    };
  }, [prefersReducedMotion]);

  if (!running || prefersReducedMotion) {
    return <>Positioning, voice, identity, or something harder to name.</>;
  }

  return (
    <>
      <span className="sr-only">
        Positioning, voice, identity, or something harder to name.
      </span>
      <span aria-hidden="true">
        Sometimes it sits in{" "}
        <span className="relative inline-flex overflow-hidden align-bottom">
          <AnimatePresence mode="popLayout" initial={false}>
            <motion.em
              key={PLACES[index]}
              initial={{ y: "0.9em", opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: "-0.9em", opacity: 0 }}
              transition={{ duration: 0.45, ease: EASE_AIR }}
              className="inline-block whitespace-nowrap font-display text-[1.08em] not-italic text-sandstone"
            >
              {PLACES[index]}
            </motion.em>
          </AnimatePresence>
        </span>
        .
      </span>
    </>
  );
}
