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

// Purely decorative ambient texture — contributes nothing to LCP or
// first paint, so it's code-split out of the hero's own bundle rather
// than shipped as part of the critical path.
const DustMotes = dynamic(() => import("@/components/DustMotes").then((m) => m.DustMotes), {
  ssr: false,
});

// Full-screen hero, restructured after looking at how references like
// Haven actually handle text over a photograph: a small pill badge, one
// tight headline, a single line of support copy, two pill CTAs, all held
// inside a strong scrim at the bottom of the frame rather than scattered
// across the whole image. The background can be a still photo (with
// scroll-linked parallax) or a muted looping video — a hero should never
// sit completely still, so a video background is the default direction
// going forward; the photo path stays for pages that don't have one yet.

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
  // A foreground layer reacting more than the background it sits in
  // front of is the actual depth cue (closer things move more) — same
  // spring values as the background's own mouse parallax, just a larger
  // multiple of it, rather than a second independent pointer listener.
  const foregroundX = useTransform(mouseParallax.x, (v) => v * 2.4);
  const foregroundY = useTransform(mouseParallax.y, (v) => v * 2.4);
  useVideoFadeIn(videoRef, Boolean(video && !prefersReducedMotion));

  return (
    <section ref={ref} className="relative h-svh min-h-[620px] overflow-hidden bg-soil">
      {/* The video's poster frame is what actually counts as the LCP
          candidate here (Chrome doesn't wait for real video data to
          paint) — a real production Lighthouse run found it wasn't
          being prioritized, discovered late in the load. React 19
          hoists a <link> rendered anywhere in the tree up to <head>,
          so this reaches the browser's preload scanner immediately. */}
      {video && poster && <link rel="preload" as="image" href={poster} fetchPriority="high" />}
      {video && !prefersReducedMotion ? (
        <motion.div
          className="absolute inset-0 top-[-10%] h-[120%] w-full"
          style={{ y: imageY }}
        >
          <motion.div
            className="absolute inset-0"
            style={prefersReducedMotion ? undefined : { x: mouseParallax.x, y: mouseParallax.y }}
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

      {/* Foreground depth layer — a soft vignette that reacts to the
          cursor more than the background video does, so the frame
          itself reads as sitting closer to the camera than the scene
          behind it, instead of everything living on one flat plane. */}
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

      {/* Cursor spotlight — a soft light following the pointer, purely
          additive atmosphere. Position is written directly to this
          element's own CSS custom properties (see useHeroSpotlight),
          not through React state, so mouse movement never triggers a
          re-render; only this one composited layer ever repaints. */}
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
        className="relative flex h-full flex-col items-center justify-end px-6 pb-24 text-center sm:pb-28"
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
