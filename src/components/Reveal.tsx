"use client";

import { motion, useReducedMotion } from "framer-motion";
import { EASE_AIR } from "@/lib/motion";
import { useRevealTrigger } from "@/hooks/useRevealTrigger";

// Scroll-triggered entrance for a section. Fires once, settles quickly, and
// never blocks reading (content is present in the DOM immediately, this
// only animates opacity/position). The rendered element stays identical
// between the server and first client render; reduced-motion preference
// changes animation values rather than swapping motion.div for div, which
// prevents hydration mismatches when that media query is already active.
//
// Driven by useRevealTrigger rather than Framer Motion's own whileInView/
// viewport prop — see that hook's comment for why relying on its internal
// IntersectionObserver alone left every Reveal-wrapped block (i.e. most
// of the site's text) with no guarantee of ever leaving opacity: 0.

export function Reveal({
  children,
  className,
  delay = 0,
  // Optional per-section pacing (Phase 2 motion hierarchy): most
  // sections keep the default 0.6s; the deliberately calm chapters
  // (Services' FAQ, Book Call) pass a longer duration so their
  // entrances read slower and quieter than everything before them.
  duration = 0.6,
}: {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  duration?: number;
}) {
  const prefersReducedMotion = useReducedMotion();
  const [ref, visible] = useRevealTrigger("0px 0px -80px 0px");
  const staticMode = prefersReducedMotion === true;

  return (
    <motion.div
      ref={ref}
      className={className}
      initial={staticMode ? false : { opacity: 0, y: 20 }}
      animate={
        staticMode || visible
          ? { opacity: 1, y: 0 }
          : undefined
      }
      transition={
        staticMode
          ? { duration: 0 }
          : { duration, ease: EASE_AIR, delay }
      }
    >
      {children}
    </motion.div>
  );
}
