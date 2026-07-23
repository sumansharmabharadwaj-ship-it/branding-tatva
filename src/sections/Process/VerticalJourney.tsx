"use client";

import { useRef } from "react";
import { motion, useReducedMotion } from "framer-motion";
import type { ProcessSectionProps } from "./types";
import { useVerticalLineProgress } from "./animations";
import { JourneyStage } from "./JourneyStage";

// A connected vertical thread instead of a grid of six identical boxes —
// the six stages already form one continuous sequence (Listen leads to
// Notice leads to Ground, and so on), so the layout should read that way
// too. The line's own fill is tied to scroll position: it draws down as
// the visitor moves through the section, so "progress" is something felt
// rather than just implied by the numbering. Used at every viewport size
// (see sections/Process/index.tsx for why the old desktop-only pinned
// version was retired).
//
// Each stage carries its own photo/video backdrop now (see JourneyStage)
// instead of one shared image behind the whole list — direct feedback
// that desktop's PinnedJourney already crossfades a distinct video per
// stage while mobile stayed on a single static backdrop, reading as an
// unfinished/older version of the same section rather than a deliberate
// mobile-specific treatment. bg-soil stays on this wrapper as a plain
// fallback fill so the rounded-xl container never shows transparent
// even before any individual stage's own poster has loaded.
export function VerticalJourney({ stages, elementColor }: ProcessSectionProps) {
  const ref = useRef<HTMLDivElement>(null);
  const prefersReducedMotion = useReducedMotion();
  const lineHeight = useVerticalLineProgress(ref);

  return (
    <div ref={ref} className="relative mt-16 overflow-hidden rounded-xl bg-soil px-4 py-10 pl-16 sm:px-8 sm:pl-20">
      <div className="absolute left-[23px] top-12 bottom-12 w-px sm:left-[27px] bg-ivory/20" aria-hidden="true" />
      <motion.div
        className="absolute left-[23px] top-12 w-px origin-top sm:left-[27px] bg-sandstone"
        style={prefersReducedMotion ? { height: "100%" } : { height: lineHeight }}
        aria-hidden="true"
      />
      <ol className="space-y-12">
        {stages.map((stage, i) => (
          <JourneyStage
            key={stage.stage}
            stage={stage}
            index={i}
            color={elementColor[stage.element]}
            delay={(i % 3) * 0.08}
            dark
          />
        ))}
      </ol>
    </div>
  );
}
