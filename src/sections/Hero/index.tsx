"use client";

import { useRef } from "react";
import Image from "next/image";
import dynamic from "next/dynamic";
import { motion, useReducedMotion } from "framer-motion";
import { useSpotlight } from "@/hooks/useSpotlight";
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
  const prefersReducedMotion = useReducedMotion();
  const { imageY, contentOpacity, contentY } = useHeroParallax(ref);
  const mouseParallax = useHeroMouseParallax(ref, Boolean(prefersReducedMotion));
  const spotlightRef = useSpotlight(ref, Boolean(prefersReducedMotion));

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
        <h1 className="mt-6 max-w-2xl font-display text-[clamp(2.25rem,5.5vw,4rem)] font-semibold leading-[1.08] text-ivory">
          {headline}
        </h1>
        <p className="mt-4 max-w-md text-base text-ivory/70">{subhead}</p>
        {children && (
          <div className="mt-9 flex flex-wrap items-center justify-center gap-4">{children}</div>
        )}
      </motion.div>
    </section>
  );
}
