"use client";

import { useRef } from "react";
import Image from "next/image";
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
// version was retired) — the faint road photo behind it keeps this from
// becoming a plain-text stretch regardless of screen width.

export function VerticalJourney({ stages, elementColor, dark }: ProcessSectionProps) {
  const ref = useRef<HTMLDivElement>(null);
  const prefersReducedMotion = useReducedMotion();
  const lineHeight = useVerticalLineProgress(ref);

  return (
    <div ref={ref} className="relative mt-16 pl-12 sm:pl-16">
      <Image
        src="/images/own-ridge-road-poster.jpg"
        alt=""
        fill
        priority
        sizes="100vw"
        className="-z-10 object-cover"
        style={{ opacity: 0.1 }}
      />
      <div
        className={`absolute left-[7px] top-2 bottom-2 w-px sm:left-[11px] ${dark ? "bg-ivory/20" : "bg-border"}`}
        aria-hidden="true"
      />
      <motion.div
        className={`absolute left-[7px] top-2 w-px origin-top sm:left-[11px] ${dark ? "bg-sandstone" : "bg-clay"}`}
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
            dark={dark}
          />
        ))}
      </ol>
    </div>
  );
}
