"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { motion, useReducedMotion } from "framer-motion";
import type { ProcessSectionProps } from "./types";
import { useVerticalLineProgress } from "./animations";
import { useLazyMount } from "@/hooks/useLazyMount";
import { BREAK_OVERLAY_GRADIENT } from "@/lib/media";
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
// The background was a 10%-opacity photo — direct feedback that this
// read as flat/empty rather than as a real visual moment. Now a real
// video (higgsfield-element-earth: hand-drawn plans and sketches on a
// desk, the actual physical act of mapping out work) plays behind the
// thread at real strength, with the same dark overlay every other
// photo/video section on the site uses — which is why `dark` is now
// always true here regardless of what the caller passes, matching the
// ivory-on-photo treatment that's consistent everywhere else.
export function VerticalJourney({ stages, elementColor }: ProcessSectionProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [mediaRef, shouldLoad] = useLazyMount();
  const prefersReducedMotion = useReducedMotion();
  const lineHeight = useVerticalLineProgress(ref);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [videoReady, setVideoReady] = useState(false);

  useEffect(() => {
    const el = videoRef.current;
    if (!el || !shouldLoad || prefersReducedMotion) return;
    el.play().catch(() => {});
  }, [shouldLoad, prefersReducedMotion]);

  return (
    <div ref={ref} className="relative mt-16 overflow-hidden rounded-xl px-4 py-10 pl-16 sm:px-8 sm:pl-20">
      <div ref={mediaRef} className="absolute inset-0 -z-10" aria-hidden="true">
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
