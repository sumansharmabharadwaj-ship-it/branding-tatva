"use client";

import { useRef, type ReactNode } from "react";
import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";

/**
 * A quiet full-viewport chapter wrapper for sections that need to feel like
 * a scene without becoming another pinned interaction. The section remains
 * completely readable in normal document flow; scroll only adds a small
 * depth shift to its decorative media and content surface.
 */
export function CinematicScene({
  children,
  className = "",
  contentClassName = "",
}: {
  children: ReactNode;
  className?: string;
  contentClassName?: string;
}) {
  const ref = useRef<HTMLElement>(null);
  const prefersReducedMotion = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const y = useTransform(scrollYProgress, [0, 0.5, 1], [28, 0, -20]);
  const opacity = useTransform(scrollYProgress, [0, 0.15, 0.85, 1], [0.72, 1, 1, 0.82]);

  return (
    <section ref={ref} className={`relative flex min-h-[100svh] items-center ${className}`}>
      <motion.div
        className={`relative z-10 w-full ${contentClassName}`}
        style={prefersReducedMotion ? undefined : { y, opacity }}
      >
        {children}
      </motion.div>
    </section>
  );
}