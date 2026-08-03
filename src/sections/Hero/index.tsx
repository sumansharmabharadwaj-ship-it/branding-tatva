"use client";

import { useRef } from "react";
import Image from "next/image";
import dynamic from "next/dynamic";
import { motion, useTransform, useReducedMotion } from "framer-motion";
import { useSpotlight } from "@/hooks/useSpotlight";
import { SplitReveal } from "@/components/SplitReveal";
import type { CinematicHeroProps } from "./types";
import { HERO_SCRIM_GRADIENT } from "./constants";
import { useHeroParallax, useHeroMouseParallax } from "./animations";

const DustMotes = dynamic(() => import("@/components/DustMotes").then((m) => m.DustMotes), {
  ssr: false,
});

const SIGNAL_PATH =
  "M0 54 C38 54 48 54 70 54 C91 54 96 18 118 18 C142 18 145 88 169 88 C192 88 195 34 218 34 C242 34 245 70 267 70 C290 70 296 54 330 54 C364 54 370 54 400 54";

function MemorySignal({ reduced }: { reduced: boolean | null }) {
  return (
    <div className="pointer-events-none absolute inset-x-0 bottom-[29%] z-[1] mx-auto hidden max-w-5xl px-10 sm:block" aria-hidden="true">
      <div className="relative h-28 overflow-hidden opacity-70 [mask-image:linear-gradient(90deg,transparent,black_15%,black_85%,transparent)]">
        <svg viewBox="0 0 400 108" preserveAspectRatio="none" className="absolute inset-0 h-full w-full">
          <path d="M0 54 H400" fill="none" stroke="rgba(244,239,230,0.14)" strokeWidth="0.7" />
          {[18, 36, 72].map((offset) => (
            <motion.path
              key={offset}
              d={SIGNAL_PATH}
              fill="none"
              stroke="rgba(198,169,122,0.18)"
              strokeWidth="0.7"
              transform={`translate(0 ${offset - 36}) scale(1 ${1 - Math.abs(offset - 36) / 110})`}
              initial={false}
              animate={reduced ? undefined : { opacity: [0.18, 0.42, 0.18] }}
              transition={{ duration: 5.5 + offset / 20, repeat: Infinity, ease: "easeInOut" }}
            />
          ))}
          <motion.path
            d={SIGNAL_PATH}
            fill="none"
            stroke="#C6A97A"
            strokeWidth="1.35"
            strokeLinecap="round"
            pathLength={1}
            initial={reduced ? false : { pathLength: 0, opacity: 0 }}
            animate={reduced ? undefined : { pathLength: 1, opacity: 1 }}
            transition={{ duration: 2.2, delay: 0.5, ease: [0.16, 1, 0.3, 1] }}
          />
        </svg>
        <motion.div
          className="absolute left-1/2 top-1/2 h-32 w-32 -translate-x-1/2 -translate-y-1/2 rounded-full border border-sandstone/20"
          animate={reduced ? undefined : { scale: [0.7, 1.55], opacity: [0.5, 0] }}
          transition={{ duration: 3.6, repeat: Infinity, ease: "easeOut" }}
        />
      </div>
    </div>
  );
}

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
  const foregroundX = useTransform(mouseParallax.x, (v) => v * 2.4);
  const foregroundY = useTransform(mouseParallax.y, (v) => v * 2.4);

  return (
    <section ref={ref} className="relative h-svh min-h-[620px] overflow-hidden bg-soil">
      {video && poster && <link rel="preload" as="image" href={poster} fetchPriority="high" />}
      {video && !prefersReducedMotion ? (
        <motion.div className="absolute inset-0 top-[-10%] h-[120%] w-full" style={{ y: imageY }}>
          <motion.div className="absolute inset-0" style={{ x: mouseParallax.x, y: mouseParallax.y }}>
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

      {!prefersReducedMotion && <div className="light-rays" aria-hidden="true" />}

      {!prefersReducedMotion && (
        <motion.div
          className="pointer-events-none absolute -inset-8"
          style={{
            x: foregroundX,
            y: foregroundY,
            background: "radial-gradient(circle, transparent 45%, rgba(20,17,14,0.5) 100%)",
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
      <MemorySignal reduced={prefersReducedMotion} />

      <div className="pointer-events-none absolute inset-y-0 left-5 z-10 hidden items-center md:flex" aria-hidden="true">
        <div className="flex -rotate-90 items-center gap-3 origin-center whitespace-nowrap text-[0.62rem] uppercase tracking-[0.32em] text-ivory/45">
          <span className="h-px w-10 bg-sandstone/50" />
          Recognition begins beneath the surface
        </div>
      </div>

      <motion.div
        style={prefersReducedMotion ? undefined : { opacity: contentOpacity, y: contentY }}
        className="relative z-[2] flex h-full flex-col items-center justify-end px-6 pb-20 text-center sm:pb-24"
      >
        <motion.span
          initial={prefersReducedMotion ? false : { opacity: 0, y: 12 }}
          animate={prefersReducedMotion ? undefined : { opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.15 }}
          className="inline-flex items-center gap-2 rounded-full border border-ivory/25 bg-soil/15 px-4 py-1.5 text-[0.65rem] font-medium uppercase tracking-[0.25em] text-ivory/85 backdrop-blur-sm"
        >
          <span className="h-1.5 w-1.5 rounded-full bg-sandstone shadow-[0_0_14px_rgba(198,169,122,0.9)]" />
          {badge}
        </motion.span>

        <SplitReveal
          as="h1"
          className="mt-5 max-w-3xl text-balance font-display text-[clamp(2.5rem,6vw,4.8rem)] font-normal leading-[1.02] text-ivory"
        >
          {headline}
        </SplitReveal>

        <motion.p
          initial={prefersReducedMotion ? false : { opacity: 0, y: 14 }}
          animate={prefersReducedMotion ? undefined : { opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.7 }}
          className="mt-5 max-w-xl text-pretty text-sm leading-relaxed text-ivory/78 sm:text-base"
        >
          {subhead}
        </motion.p>

        {children && (
          <motion.div
            className="mt-8 flex flex-wrap items-center justify-center gap-4"
            initial={prefersReducedMotion ? false : { opacity: 0, y: 18 }}
            animate={prefersReducedMotion ? undefined : { opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.95, ease: [0.16, 1, 0.3, 1] }}
          >
            {children}
          </motion.div>
        )}
      </motion.div>

      <motion.div
        aria-hidden="true"
        className="absolute bottom-5 left-1/2 z-10 flex -translate-x-1/2 flex-col items-center gap-2 text-[0.58rem] uppercase tracking-[0.28em] text-ivory/45"
        animate={prefersReducedMotion ? undefined : { opacity: [0.35, 0.8, 0.35] }}
        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
      >
        Enter the system
        <span className="h-8 w-px bg-gradient-to-b from-sandstone/70 to-transparent" />
      </motion.div>
    </section>
  );
}
