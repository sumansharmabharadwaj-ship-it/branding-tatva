"use client";

import { useHydratedReducedMotion } from "@/hooks/useHydratedReducedMotion";
import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";

// Wraps a run of adjacent plain sections and washes the background from
// one tint to the next as you scroll through them, instead of each
// section holding a flat color that cuts hard into the next one. Used
// only between sections that sit next to each other with no photo
// breaking them up; photo sections already reset the palette on their
// own and don't need this.

export function GradientSections({
  children,
  colors,
}: {
  children: React.ReactNode;
  colors: string[];
}) {
  const ref = useRef<HTMLDivElement>(null);
  const prefersReducedMotion = useHydratedReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end end"] });
  const stops = colors.map((_, i) => i / (colors.length - 1));
  const backgroundColor = useTransform(scrollYProgress, stops, colors);

  return (
    <motion.div
      ref={ref}
      className="relative"
      style={{ backgroundColor: prefersReducedMotion ? colors[0] : backgroundColor }}
    >
      {children}
    </motion.div>
  );
}
