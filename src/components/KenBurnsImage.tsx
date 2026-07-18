"use client";

import { motion, useReducedMotion } from "framer-motion";

// A reusable slow, continuous zoom drift for any full-bleed background
// image block that isn't already a hero. Used anywhere a static photo
// panel would otherwise sit motionless for the entire time it's on
// screen, like the diptych panels on the home page.

export function KenBurnsImage({
  image,
  gradient,
  className,
}: {
  image: string;
  gradient: string;
  className?: string;
}) {
  const prefersReducedMotion = useReducedMotion();

  return (
    <motion.div
      className={`absolute inset-0 ${className ?? ""}`}
      style={{
        backgroundImage: `${gradient}, url(${image})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
      initial={{ scale: 1 }}
      animate={prefersReducedMotion ? undefined : { scale: 1.08 }}
      transition={{ duration: 18, repeat: Infinity, repeatType: "mirror", ease: "easeInOut" }}
    />
  );
}
