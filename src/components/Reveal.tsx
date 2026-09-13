"use client";

import { useHydratedMotionPreference } from "@/hooks/useHydratedReducedMotion";
import { motion } from "framer-motion";
import { EASE_AIR } from "@/lib/motion";
import { useRevealTrigger } from "@/hooks/useRevealTrigger";

// Scroll-triggered entrance for a section. Fires once, settles quickly, and
// never blocks reading (content is present in the DOM immediately, this
// only animates opacity/position). Renders statically under
// prefers-reduced-motion, consistent with the rest of the motion system.
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
  const { hydrated, prefersReducedMotion } = useHydratedMotionPreference();
  const [ref, visible] = useRevealTrigger("0px 0px -80px 0px");

  if (!hydrated || prefersReducedMotion) {
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.div
      ref={ref}
      className={className}
      initial={{ opacity: 1, y: 12 }}
      animate={visible ? { opacity: 1, y: 0 } : { opacity: 1, y: 12 }}
      transition={{ duration, ease: EASE_AIR, delay }}
    >
      {children}
    </motion.div>
  );
}
