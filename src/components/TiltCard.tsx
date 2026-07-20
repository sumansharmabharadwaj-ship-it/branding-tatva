"use client";

import { useRef, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { useTilt } from "@/hooks/useTilt";

const EASE = [0.16, 1, 0.3, 1] as const;

// The tilt + lift + colored-glow treatment CaseStudyCard already uses,
// pulled out so every other card grid on the site (services, about,
// blog, related-work) can share the mechanism instead of each hand-
// rolling its own rotateX/rotateY + drop-shadow wiring. Wrap a card's
// existing markup in this rather than relying on a flat CSS
// hover:-translate-y-1 — everything with a card shape on this site
// should respond the same way when the cursor lands on it.
export function TiltCard({
  children,
  className,
  glowColor = "#27221E",
  maxDegrees = 6,
}: {
  children: React.ReactNode;
  className?: string;
  glowColor?: string;
  maxDegrees?: number;
}) {
  const [isHovered, setIsHovered] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const prefersReducedMotion = useReducedMotion();
  const { rotateX, rotateY } = useTilt(ref, maxDegrees, Boolean(prefersReducedMotion));

  return (
    <div
      ref={ref}
      className={`h-full ${className ?? ""}`}
      style={{ perspective: 1000 }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <motion.div
        style={prefersReducedMotion ? undefined : { rotateX, rotateY }}
        animate={
          prefersReducedMotion
            ? undefined
            : {
                y: isHovered ? -6 : 0,
                filter: isHovered
                  ? `drop-shadow(0 16px 24px ${glowColor}40)`
                  : "drop-shadow(0 0px 0px transparent)",
              }
        }
        transition={{ duration: 0.35, ease: EASE }}
        className="h-full"
      >
        {children}
      </motion.div>
    </div>
  );
}
