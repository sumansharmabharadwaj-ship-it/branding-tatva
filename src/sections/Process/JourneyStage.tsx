"use client";

import { useRef } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { Reveal } from "@/components/Reveal";
import { useSpotlight } from "@/hooks/useSpotlight";
import { EASE_AIR } from "@/lib/motion";
import type { ProcessStage } from "@/data/process";

// Previously the vertical journey had no onMouse*/whileHover anywhere —
// audit-confirmed as the most "dead" section on the site interaction-
// wise, scroll-reveal only. Two additions: a per-stage cursor glow (the
// same useSpotlight technique Threshold already uses on its panels,
// colored per stage instead of one fixed tone) and a ring that draws in
// around the stage number via SVG pathLength once it scrolls into view
// (the same technique the redesigned PageLoadVeil already proved).
export function JourneyStage({
  stage,
  index,
  color,
  delay,
}: {
  stage: ProcessStage;
  index: number;
  color: string;
  delay: number;
}) {
  const ref = useRef<HTMLLIElement>(null);
  const prefersReducedMotion = useReducedMotion();
  const spotlightRef = useSpotlight(ref, Boolean(prefersReducedMotion));

  return (
    <li
      ref={ref}
      className="relative -mx-4 rounded-lg px-4 py-3"
      style={{ ["--spotlight-color" as string]: `${color}2E` }}
    >
      {!prefersReducedMotion && (
        <div
          ref={spotlightRef}
          aria-hidden="true"
          className="stage-spotlight pointer-events-none absolute inset-0 rounded-lg opacity-0 transition-opacity duration-500"
        />
      )}
      <span className="absolute -left-12 top-0 h-6 w-6 sm:-left-16" aria-hidden="true">
        <svg width="24" height="24" viewBox="0 0 24 24" className="absolute inset-0 -rotate-90">
          <circle cx="12" cy="12" r="10" fill="none" stroke={color} strokeOpacity={0.25} strokeWidth={1.5} />
          <motion.circle
            cx="12"
            cy="12"
            r="10"
            fill="none"
            stroke={color}
            strokeWidth={1.5}
            initial={{ pathLength: 0 }}
            whileInView={prefersReducedMotion ? undefined : { pathLength: 1 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.7, ease: EASE_AIR, delay }}
          />
        </svg>
        <span
          className="absolute inset-0 flex items-center justify-center rounded-full text-[0.65rem] font-semibold text-ivory"
          style={{ backgroundColor: color }}
        >
          {index + 1}
        </span>
      </span>
      <Reveal delay={delay}>
        <p className="relative font-display text-xl font-semibold text-soil sm:text-2xl">{stage.stage}</p>
        <p className="relative mt-2 max-w-lg text-sm text-foreground-secondary">{stage.description}</p>
      </Reveal>
    </li>
  );
}
