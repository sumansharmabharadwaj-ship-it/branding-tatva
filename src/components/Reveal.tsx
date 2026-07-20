"use client";

import { motion, useReducedMotion } from "framer-motion";
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
}: {
  children: React.ReactNode;
  className?: string;
  delay?: number;
}) {
  const prefersReducedMotion = useReducedMotion();
  const [ref, visible] = useRevealTrigger("0px 0px -80px 0px");

  if (prefersReducedMotion) {
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.div
      ref={ref}
      className={className}
      initial={{ opacity: 0, y: 20 }}
      animate={visible ? { opacity: 1, y: 0 } : undefined}
      transition={{ duration: 0.6, ease: EASE_AIR, delay }}
    >
      {children}
    </motion.div>
  );
}
