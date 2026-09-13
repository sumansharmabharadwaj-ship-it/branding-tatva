"use client";

import { useHydratedReducedMotion } from "@/hooks/useHydratedReducedMotion";
import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";

// Small scroll-linked drift wrapper — Phase 2's cheapest storytelling
// device: an element moves slightly slower (or faster) than the scroll
// around it, giving a section's backdrop typography real depth without
// a new scroll system. Framer's useScroll here reads the same native
// scroll Lenis drives (Lenis animates real window scroll, it never
// virtualizes it), so there is no second scroll source to fight — the
// same reasoning ScrollProgress's own Lenis subscription documents,
// approached from Framer's side because this needs per-element
// progress, not page progress. Pure transform, compositor-only.
// Renders children statically under reduced motion.

export function ParallaxDrift({
  children,
  className,
  distance = 60,
}: {
  children: React.ReactNode;
  className?: string;
  // Total px the child drifts across its container's full scroll pass.
  distance?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const prefersReducedMotion = useHydratedReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], [distance / 2, -distance / 2]);

  if (prefersReducedMotion) {
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.div ref={ref} className={className} style={{ y }}>
      {children}
    </motion.div>
  );
}
