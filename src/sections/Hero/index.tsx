"use client";

import { useRef } from "react";
import Image from "next/image";
import { motion, useReducedMotion } from "framer-motion";
import { DustMotes } from "@/components/DustMotes";
import type { CinematicHeroProps } from "./types";
import { HERO_SCRIM_GRADIENT } from "./constants";
import { useHeroParallax } from "./animations";

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
          <video
            className="h-full w-full object-cover"
            style={{ objectPosition: imagePosition }}
            src={video}
            poster={poster}
            autoPlay
            muted
            loop
            playsInline
            preload="auto"
          />
          <div className="absolute inset-0" style={{ backgroundImage: HERO_SCRIM_GRADIENT }} />
        </motion.div>
      ) : (
        <motion.div
          className="absolute inset-0 top-[-10%] h-[120%] w-full"
          style={{ y: prefersReducedMotion ? 0 : imageY }}
        >
          <Image
            src={poster ?? image ?? ""}
            alt=""
            fill
            priority
            sizes="100vw"
            style={{ objectFit: "cover", objectPosition: imagePosition }}
          />
          <div className="absolute inset-0" style={{ backgroundImage: HERO_SCRIM_GRADIENT }} />
        </motion.div>
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
