"use client";

import { useHydratedReducedMotion } from "@/hooks/useHydratedReducedMotion";
import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { LivingImage } from "@/components/LivingImage";
import { Reveal } from "@/components/Reveal";
import { useSpotlight } from "@/hooks/useSpotlight";
import { useLazyMount } from "@/hooks/useLazyMount";
import { EASE_AIR } from "@/lib/motion";
import { BREAK_OVERLAY_GRADIENT } from "@/lib/media";
import { usesLivingStill } from "@/lib/mediaMode";
import type { ProcessStage } from "@/data/process";

// Previously the vertical journey had no onMouse*/whileHover anywhere —
// audit-confirmed as the most "dead" section on the site interaction-
// wise, scroll-reveal only. Two additions: a per-stage cursor glow (the
// same useSpotlight technique Threshold already uses on its panels,
// colored per stage instead of one fixed tone) and a ring that draws in
// around the stage number via SVG pathLength once it scrolls into view
// (the same technique the redesigned PageLoadVeil already proved).
//
// Each stage now carries its own photo/video backdrop (stage.poster/
// stage.video, the same data PinnedJourney's desktop crossfade already
// uses) instead of sharing one static image across all six — direct
// feedback that the mobile version reading as "the old design" next to
// desktop's per-stage backgrounds was the actual gap, not a stylistic
// preference. The overflow-hidden boundary lives on an inner div, not
// the <li> itself, since the numbered badge below is deliberately
// positioned outside the row's own box (-left-12/-left-16) and would
// get clipped if the <li> carried overflow-hidden directly.
export function JourneyStage({
  stage,
  index,
  color,
  delay,
  dark,
}: {
  stage: ProcessStage;
  index: number;
  color: string;
  delay: number;
  dark?: boolean;
}) {
  const ref = useRef<HTMLLIElement>(null);
  const prefersReducedMotion = useHydratedReducedMotion();
  const spotlightRef = useSpotlight(ref, Boolean(prefersReducedMotion));
  const [mediaRef, shouldLoad] = useLazyMount();
  const videoRef = useRef<HTMLVideoElement>(null);
  const [videoReady, setVideoReady] = useState(false);
  const livingStill = usesLivingStill(stage.video);

  useEffect(() => {
    const el = videoRef.current;
    if (!el || !shouldLoad || prefersReducedMotion || livingStill) return;
    el.play().catch(() => {});
  }, [livingStill, prefersReducedMotion, shouldLoad]);

  return (
    <li
      ref={ref}
      className="relative"
      style={{ ["--spotlight-color" as string]: `${color}2E` }}
    >
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
            transition={{ duration: 0.72, ease: EASE_AIR, delay }}
          />
        </svg>
        <span
          className="absolute inset-0 flex items-center justify-center rounded-full text-[0.65rem] font-semibold text-ivory"
          style={{ backgroundColor: color }}
        >
          {index + 1}
        </span>
      </span>
      <div className="relative -mx-4 overflow-hidden rounded-2xl px-4 py-3">
        {stage.poster && (
          <div ref={mediaRef} className="absolute inset-0" aria-hidden="true">
            {livingStill ? (
              <LivingImage
                src={stage.poster}
                sizes="(min-width: 640px) 700px, 100vw"
                intensity="cinematic"
                className="absolute inset-0"
              />
            ) : (
              <Image
                src={stage.poster}
                alt=""
                fill
                sizes="(min-width: 640px) 700px, 100vw"
                className="object-cover"
                style={{ objectPosition: "center" }}
              />
            )}
            {shouldLoad && stage.video && !prefersReducedMotion && !livingStill && (
              <video
                aria-hidden="true"
                ref={videoRef}
                className="absolute inset-0 h-full w-full object-cover transition-opacity duration-700"
                style={{ opacity: videoReady ? 1 : 0 }}
                onCanPlay={() => setVideoReady(true)}
                src={stage.video}
                muted
                loop
                playsInline
                preload="metadata"
              />
            )}
            <div className="absolute inset-0" style={{ backgroundImage: BREAK_OVERLAY_GRADIENT }} />
            <div className="absolute inset-0 bg-soil/35" />
          </div>
        )}
        {!prefersReducedMotion && (
          <div
            ref={spotlightRef}
            aria-hidden="true"
            className="stage-spotlight pointer-events-none absolute inset-0 rounded-2xl opacity-0 transition-opacity duration-500"
          />
        )}
        <Reveal delay={delay}>
          <p className={`relative font-display text-xl font-normal sm:text-2xl ${stage.poster || dark ? "text-ivory" : "text-soil"}`}>
            {stage.stage}
          </p>
          <p className={`relative mt-2 max-w-lg text-sm ${stage.poster || dark ? "text-ivory/75" : "text-foreground-secondary"}`}>
            {stage.description}
          </p>
        </Reveal>
      </div>
    </li>
  );
}
