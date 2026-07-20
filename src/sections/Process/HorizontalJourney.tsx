"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import { ElementGlyph } from "@/components/ElementGlyph";
import type { ProcessSectionProps } from "./types";
import { initHorizontalScroll } from "./animations";

// Desktop-only pinned horizontal scroll through the process stages — see
// animations.ts's initHorizontalScroll for the actual GSAP/ScrollTrigger
// setup; this component only owns the refs and the markup.
//
// This section pins for the full width of the track (7 stages, several
// thousand pixels of scroll distance) — previously with nothing behind
// the cards but flat cream, which reads as a long stretch of empty
// space during exactly the part of the page a visitor spends the most
// scroll distance in. A faint mountain-road photo (own-ridge-road — a
// literal path, matching "how a project moves") sits behind the whole
// track at low opacity: enough to keep the section visually alive,
// nowhere near enough to compete with the text sitting on top of it.

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
    <div ref={sectionRef} className="relative overflow-hidden bg-background">
      <Image
        src="/images/own-ridge-road-poster.jpg"
        alt=""
        fill
        priority
        sizes="100vw"
        className="object-cover"
        style={{ opacity: 0.16 }}
      />
      <div className="absolute inset-0" style={{ backgroundColor: "#F4EFE6", opacity: 0.55 }} />
      <div ref={trackRef} className="relative flex w-max">
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
