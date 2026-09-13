"use client";

import { useHydratedReducedMotion } from "@/hooks/useHydratedReducedMotion";
import { motion } from "framer-motion";
import type { ReactNode } from "react";
import type { Transition } from "framer-motion";
import { EASE_AIR } from "@/lib/motion";
import { useRevealTrigger } from "@/hooks/useRevealTrigger";

type Slug = "earth" | "water" | "fire" | "air" | "space";

// Each element gets its own physical signature instead of the site's
// default fade-up, matching what the row's own copy claims about it:
// earth settles under its own weight, water ripples in rather than
// sliding, fire catches with a flicker of overshoot, air drifts in
// off-axis and floats to rest, space blooms outward from a soft focus.

const recipes: Record<
  Slug,
  { initial: Record<string, number | string>; animate: Record<string, number | number[] | string>; transition: Transition }
> = {
  earth: {
    initial: { opacity: 0, y: 56 },
    animate: { opacity: 1, y: 0 },
    transition: {
      y: { type: "spring", stiffness: 90, damping: 15 },
      opacity: { duration: 0.35, ease: "easeOut" },
    },
  },
  water: {
    initial: { opacity: 0, x: -64 },
    animate: { opacity: 1, x: [-64, 14, 0] },
    transition: { duration: 1.2, ease: [0.65, 0, 0.35, 1] },
  },
  fire: {
    initial: { opacity: 0, scale: 0.9 },
    animate: { opacity: 1, scale: [0.9, 1.05, 1] },
    transition: { duration: 0.72, ease: EASE_AIR },
  },
  air: {
    initial: { opacity: 0, x: 48, y: -14, rotate: 3 },
    animate: { opacity: 1, x: 0, y: [-14, 6, 0], rotate: 0 },
    transition: { duration: 1.2, ease: EASE_AIR },
  },
  space: {
    initial: { opacity: 0, scale: 0.82, filter: "blur(6px)" },
    animate: { opacity: 1, scale: 1, filter: "blur(0px)" },
    transition: { duration: 1.2, ease: EASE_AIR },
  },
};

export function ElementReveal({
  slug,
  delay = 0,
  className,
  children,
}: {
  slug: Slug;
  delay?: number;
  className?: string;
  children: ReactNode;
}) {
  const prefersReducedMotion = useHydratedReducedMotion();
  const recipe = recipes[slug];
  const [ref, visible] = useRevealTrigger("0px 0px -100px 0px");

  if (prefersReducedMotion) {
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.div
      ref={ref}
      className={className}
      initial={recipe.initial}
      animate={visible ? recipe.animate : undefined}
      transition={{ ...recipe.transition, delay }}
    >
      {children}
    </motion.div>
  );
}
