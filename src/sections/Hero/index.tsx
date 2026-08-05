"use client";

import { useRef } from "react";
import Image from "next/image";
import dynamic from "next/dynamic";
import { motion, useTransform, useReducedMotion } from "framer-motion";
import { useSpotlight } from "@/hooks/useSpotlight";
import { useVideoFadeIn } from "@/hooks/useVideoFadeIn";
import { SplitReveal } from "@/components/SplitReveal";
import type { CinematicHeroProps } from "./types";
import { HERO_SCRIM_GRADIENT } from "./constants";
import { useHeroParallax, useHeroMouseParallax } from "./animations";

const DustMotes = dynamic(() => import("@/components/DustMotes").then((m) => m.DustMotes), {
  ssr: false,
});

export function CinematicHero({
  image,
  video,
  poster,
  imagePosition = "center",
  badge,
  headline,
  subhead,
  children,
}: CinematicHeroProps) {
  const ref = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const prefersReducedMotion = useReducedMotion();
  const { imageY, contentOpacity, contentY } = useHeroParallax(ref);
  const mouseParallax = useHeroMouseParallax(ref, Boolean(prefersReducedMotion));
  const spotlightRef = useSpotlight(ref, Boolean(prefersReducedMotion));
  const foregroundX = useTransform(mouseParallax.x, (v) => v * 2.4);
  const foregroundY = useTransform(mouseParallax.y, (v) => v * 2.4);

  // The browser's autoplay attribute is treated as a request, not a
  // guarantee. Explicit play/resume keeps the opening film alive after a
  // protected-preview redirect, tab return, or replay of the guided journey.
  useVideoFadeIn(
    videoRef,
    Boolean(video && !prefersReducedMotion),
  );

  return (
    <section ref={ref} data-cinematic-hero className="relative h-svh min-h-[620px] overflow-hidden bg-soil">
      {video && poster && <link rel="preload" as="image" href={poster} fetchPriority="high" />}
      {video && !prefersReducedMotion ? (
        <motion.div
          className="absolute inset-0 top-[-10%] h-[120%] w-full"
          style={{ y: imageY }}
        >
          <motion.div
            className="absolute inset-0"
            style={{ x: mouseParallax.x, y: mouseParallax.y }}
          >
            <video
              ref={videoRef}
              className="h-full w-full object-cover"
              style={{ objectPosition: imagePosition }}
              src={video}
              poster={poster}
              autoPlay
              muted
              loop
              playsInline
              preload="metadata"
              onCanPlay={(event) => {
                void event.currentTarget.play().catch(() => {});
              }}
            />
          </motion.div>
          <div className="absolute inset-0" style={{ backgroundImage: HERO_SCRIM_GRADIENT }} />
        </motion.div>
      ) : (
        <motion.div
          className="absolute inset-0 top-[-10%] h-[120%] w-full"
          style={{ y: prefersReducedMotion ? 0 : imageY }}
        >
          <motion.div
            className="absolute inset-0"
            style={prefersReducedMotion ? undefined : { x: mouseParallax.x, y: mouseParallax.y }}
          >
            <Image
              src={poster ?? image ?? ""}
              alt=""
              fill
              priority
              sizes="100vw"
              style={{ objectFit: "cover", objectPosition: imagePosition }}
            />
          </motion.div>
          <div className="absolute inset-0" style={{ backgroundImage: HERO_SCRIM_GRADIENT }} />
        </motion.div>
      )}

      {!prefersReducedMotion && <div className="light-rays" aria-hidden="true" />}

      {!prefersReducedMotion && (
        <motion.div
          className="pointer-events-none absolute -inset-8"
          style={{
            x: foregroundX,
            y: foregroundY,
            background:
              "radial-gradient(circle, transparent 45%, rgba(20,17,14,0.5) 100%)",
          }}
          aria-hidden="true"
        />
      )}

      {!prefersReducedMotion && (
        <div
          ref={spotlightRef}
          aria-hidden="true"
          className="cursor-spotlight pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500"
        />
      )}

      <DustMotes />

      <motion.div
        style={prefersReducedMotion ? undefined : { opacity: contentOpacity, y: contentY }}
        data-hero-content className="relative flex h-full flex-col items-center justify-end px-6 pb-24 text-center sm:pb-28"
      >
        <span className="inline-flex items-center rounded-full border border-ivory/30 px-4 py-1.5 text-[0.65rem] font-medium uppercase tracking-[0.25em] text-ivory/85">
          {badge}
        </span>
        <SplitReveal
          as="h1"
          className="mt-6 max-w-2xl font-display text-[clamp(2.25rem,5.5vw,4rem)] font-normal leading-[1.08] text-ivory"
        >
          {headline}
        </SplitReveal>
        <p className="mt-4 max-w-md text-base text-ivory/80">{subhead}</p>
        {children && (
          <motion.div
            className="mt-9 flex flex-wrap items-center justify-center gap-4"
            animate={prefersReducedMotion ? undefined : { y: [0, -5, 0] }}
            transition={{ duration: 3.6, repeat: Infinity, ease: "easeInOut" }}
          >
            {children}
          </motion.div>
        )}
      </motion.div>
    </section>
  );
}
