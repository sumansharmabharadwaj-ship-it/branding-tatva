"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { useReducedMotion } from "framer-motion";
import { useLenis } from "@/components/SmoothScrollProvider";
import { useLazyMount } from "@/hooks/useLazyMount";
import { BREAK_OVERLAY_GRADIENT } from "@/lib/media";
import { ElementGlyph } from "@/components/ElementGlyph";
import type { ProcessSectionProps } from "./types";

type GlyphSlug = "earth" | "water" | "fire" | "air" | "space";

// The pinned/full-bleed sibling to VerticalJourney, same relationship
// ElementsSection already has between PinnedSlider and VerticalUnfold —
// see PinnedSlider's own comment for why this uses plain CSS
// `position: sticky` rather than a GSAP ScrollTrigger pin (a past
// version of this exact section lost real time to pin-desync bugs;
// sticky positioning can't fall out of sync with the wrapper's own
// height because it IS the wrapper's own layout). Reuses
// VerticalJourney's shared backdrop rather than sourcing six distinct
// stage photos — this is a mechanism swap, not a visual redesign.
export function PinnedJourney({ stages, elementColor }: ProcessSectionProps) {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const stageRefs = useRef<(HTMLDivElement | null)[]>([]);
  const [activeIndex, setActiveIndex] = useState(0);
  const activeIndexRef = useRef(0);
  const lenis = useLenis();

  const [mediaRef, shouldLoad] = useLazyMount();
  const prefersReducedMotion = useReducedMotion();
  const videoRef = useRef<HTMLVideoElement>(null);
  const [videoReady, setVideoReady] = useState(false);

  useEffect(() => {
    const el = videoRef.current;
    if (!el || !shouldLoad || prefersReducedMotion) return;
    el.play().catch(() => {});
  }, [shouldLoad, prefersReducedMotion]);

  useEffect(() => {
    const wrapper = wrapperRef.current;
    if (!wrapper) return;

    function update() {
      if (!wrapper) return;
      const rect = wrapper.getBoundingClientRect();
      const scrollableDistance = rect.height - window.innerHeight;
      const raw = scrollableDistance > 0 ? -rect.top / scrollableDistance : 0;
      const clamped = Math.min(1, Math.max(0, raw));
      const progress = clamped * (stages.length - 1);
      const idx = Math.min(stages.length - 1, Math.round(progress));
      if (idx !== activeIndexRef.current) {
        activeIndexRef.current = idx;
        setActiveIndex(idx);
      }
      stageRefs.current.forEach((stageEl, i) => {
        if (!stageEl) return;
        stageEl.style.opacity = String(Math.max(0, 1 - Math.abs(progress - i)));
      });
    }

    update();
    const unsubscribe = lenis?.on("scroll", update);
    window.addEventListener("resize", update);
    return () => {
      unsubscribe?.();
      window.removeEventListener("resize", update);
    };
  }, [stages.length, lenis]);

  return (
    <div ref={wrapperRef} className="relative" style={{ height: `${stages.length * 100}vh` }}>
      <div className="sticky top-0 h-screen w-full overflow-hidden">
        <div ref={mediaRef} className="absolute inset-0" aria-hidden="true">
          <Image
            src="/images/higgsfield-element-earth.jpg"
            alt=""
            fill
            priority
            sizes="100vw"
            className="object-cover"
          />
          {shouldLoad && !prefersReducedMotion && (
            <video
              ref={videoRef}
              className="absolute inset-0 h-full w-full object-cover transition-opacity duration-700"
              style={{ opacity: videoReady ? 1 : 0 }}
              onCanPlay={() => setVideoReady(true)}
              src="/videos/higgsfield-element-earth.mp4"
              muted
              loop
              playsInline
              preload="metadata"
            />
          )}
          <div className="absolute inset-0" style={{ backgroundImage: BREAK_OVERLAY_GRADIENT }} />
        </div>

        {stages.map((stage, i) => {
          const color = elementColor[stage.element];
          return (
            <div
              key={stage.stage}
              ref={(node) => {
                stageRefs.current[i] = node;
              }}
              className="relative flex h-full items-center px-6 sm:px-16"
              style={{ opacity: i === 0 ? 1 : 0, pointerEvents: i === activeIndex ? "auto" : "none" }}
              aria-hidden={i !== activeIndex}
            >
              <div className="max-w-xl">
                <div className="flex items-center gap-4">
                  <span
                    className="font-display text-[clamp(3.5rem,9vw,6.5rem)] font-semibold leading-none opacity-40"
                    style={{ color }}
                  >
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <ElementGlyph
                    slug={stage.element.toLowerCase() as GlyphSlug}
                    className="h-10 w-10 opacity-90"
                    style={{ color }}
                  />
                </div>
                <p className="mt-4 font-display text-3xl font-semibold text-ivory sm:text-4xl">{stage.stage}</p>
                <p className="mt-4 max-w-lg text-sm text-ivory/75 sm:text-base">{stage.description}</p>
              </div>
            </div>
          );
        })}

        {/* Numbered index, same pattern as PinnedSlider's own — six
            stages read comfortably on one line even at the sm breakpoint
            since stage names are short (Listen, Notice, Ground...). */}
        <div className="pointer-events-none absolute bottom-10 left-6 z-10 flex flex-wrap gap-x-6 gap-y-2 sm:left-16">
          {stages.map((stage, i) => (
            <span
              key={stage.stage}
              className="font-body text-[0.7rem] uppercase tracking-[0.2em] transition-colors duration-500"
              style={{ color: i === activeIndex ? "#F4EFE6" : "rgba(244,239,230,0.4)" }}
            >
              {String(i + 1).padStart(2, "0")} {stage.stage}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
