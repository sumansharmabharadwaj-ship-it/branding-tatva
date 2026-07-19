"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform, useReducedMotion } from "framer-motion";
import { Reveal } from "./Reveal";
import type { ProcessStage } from "@/data/process";

// A connected vertical thread instead of a grid of six identical boxes —
// the six stages already form one continuous sequence (Listen leads to
// Notice leads to Ground, and so on), so the layout should read that way
// too. The line's own fill is tied to scroll position: it draws down as
// the visitor moves through the section, so "progress" is something felt
// rather than just implied by the numbering.

export function ProcessJourney({
  stages,
  elementColor,
}: {
  stages: ProcessStage[];
  elementColor: Record<string, string>;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const prefersReducedMotion = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start 0.8", "end 0.6"],
  });
  const lineHeight = useTransform(scrollYProgress, [0, 1], ["0%", "100%"]);

  return (
    <div ref={ref} className="relative mt-16 pl-12 sm:pl-16">
      <div
        className="absolute left-[7px] top-2 bottom-2 w-px bg-border sm:left-[11px]"
        aria-hidden="true"
      />
      <motion.div
        className="absolute left-[7px] top-2 w-px origin-top bg-clay sm:left-[11px]"
        style={prefersReducedMotion ? { height: "100%" } : { height: lineHeight }}
        aria-hidden="true"
      />
      <ol className="space-y-12">
        {stages.map((stage, i) => (
          <li key={stage.stage} className="relative">
            <span
              className="absolute -left-12 top-0 flex h-6 w-6 items-center justify-center rounded-full text-[0.65rem] font-semibold text-ivory sm:-left-16"
              style={{ backgroundColor: elementColor[stage.element] }}
            >
              {i + 1}
            </span>
            <Reveal delay={(i % 3) * 0.08}>
              <p className="font-display text-xl font-semibold text-soil sm:text-2xl">
                {stage.stage}
              </p>
              <p className="mt-2 max-w-lg text-sm text-foreground-secondary">
                {stage.description}
              </p>
            </Reveal>
          </li>
        ))}
      </ol>
    </div>
  );
}
