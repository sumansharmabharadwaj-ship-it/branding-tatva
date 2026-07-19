"use client";

import { useEffect, useRef } from "react";
import { ElementGlyph } from "@/components/ElementGlyph";
import type { ProcessSectionProps } from "./types";
import { initHorizontalScroll } from "./animations";

// Desktop-only pinned horizontal scroll through the process stages — see
// animations.ts's initHorizontalScroll for the actual GSAP/ScrollTrigger
// setup; this component only owns the refs and the markup.

export function HorizontalJourney({ stages, elementColor }: ProcessSectionProps) {
  const sectionRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    const track = trackRef.current;
    if (!section || !track) return;

    const ctx = initHorizontalScroll(section, track);
    return () => ctx.revert();
  }, [stages]);

  return (
    <div ref={sectionRef} className="relative overflow-hidden">
      <div ref={trackRef} className="flex w-max">
        {stages.map((stage, i) => (
          <div
            key={stage.stage}
            className="flex h-[70vh] w-[70vw] shrink-0 flex-col justify-center border-r border-border px-16 lg:w-[45vw]"
          >
            <div className="flex items-baseline gap-4">
              <span
                className="font-display text-[clamp(3rem,6vw,5rem)] font-semibold leading-none opacity-[0.22]"
                style={{ color: elementColor[stage.element] }}
              >
                {String(i + 1).padStart(2, "0")}
              </span>
              <ElementGlyph
                slug={stage.element.toLowerCase() as "earth" | "water" | "fire" | "air" | "space"}
                className="h-8 w-8 opacity-70"
                style={{ color: elementColor[stage.element] }}
              />
            </div>
            <p className="mt-4 font-display text-3xl font-semibold text-soil lg:text-4xl">
              {stage.stage}
            </p>
            <p className="mt-4 max-w-md text-foreground-secondary">{stage.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
