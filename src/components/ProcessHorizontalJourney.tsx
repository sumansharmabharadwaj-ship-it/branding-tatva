"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ElementGlyph } from "./ElementGlyph";
import type { ProcessStage } from "@/data/process";

gsap.registerPlugin(ScrollTrigger);

// Desktop-only pinned horizontal scroll through the process stages — the
// section holds still while the viewport moves through it, one stage per
// "screen" of scroll, like turning pages rather than reading a list.
// gsap.context() scopes every ScrollTrigger/tween this creates so
// ctx.revert() tears them all down cleanly on unmount, which matters here
// specifically because Next's client-side navigation would otherwise leave
// stale pinned-scroll instances behind on the next page.

export function ProcessHorizontalJourney({
  stages,
  elementColor,
}: {
  stages: ProcessStage[];
  elementColor: Record<string, string>;
}) {
  const sectionRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    const track = trackRef.current;
    if (!section || !track) return;

    const ctx = gsap.context(() => {
      const scrollDistance = track.scrollWidth - section.offsetWidth;
      if (scrollDistance <= 0) return;

      gsap.to(track, {
        x: -scrollDistance,
        ease: "none",
        scrollTrigger: {
          trigger: section,
          start: "top top",
          end: () => `+=${scrollDistance}`,
          scrub: 1,
          pin: true,
          invalidateOnRefresh: true,
        },
      });
    }, section);

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
