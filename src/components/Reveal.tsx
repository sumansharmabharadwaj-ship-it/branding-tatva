"use client";

import { motion, useReducedMotion } from "framer-motion";
import { EASE_AIR } from "@/lib/motion";

// Scroll-triggered entrance for a section. Fires once, settles quickly, and
// never blocks reading (content is present in the DOM immediately, this
// only animates opacity/position). Renders statically under
// prefers-reduced-motion, consistent with the rest of the motion system.

export function Reveal({
  children,
  className,
  delay = 0,
}: {
  children: React.ReactNode;
  className?: string;
  delay?: number;
}) {
  const prefersReducedMotion = useReducedMotion();

  if (prefersReducedMotion) {
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.6, ease: EASE_AIR, delay }}
    >
      {children}
    </motion.div>
  );
}
