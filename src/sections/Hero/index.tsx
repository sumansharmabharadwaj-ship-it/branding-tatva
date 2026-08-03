"use client";

import { useRef } from "react";
import Image from "next/image";
import dynamic from "next/dynamic";
import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";
import { SplitReveal } from "@/components/SplitReveal";
import type { CinematicHeroProps } from "./types";
import { HERO_SCRIM_GRADIENT } from "./constants";

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
  const ref = useRef<HTMLElement>(null);
  const prefersReducedMotion = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end end"] });

  const cameraScale = useTransform(scrollYProgress, [0, 1], [1.03, 1.1]);
  const cameraY = useTransform(scrollYProgress, [0, 1], [0, -22]);
  const sceneOpacity = useTransform(scrollYProgress, [0, 0.78, 1], [1, 0.82, 0.68]);
  const openingOpacity = useTransform(scrollYProgress, [0, 0.3, 0.5], [1, 1, 0]);
  const openingY = useTransform(scrollYProgress, [0, 0.5], [0, -34]);
  const clueOpacity = useTransform(scrollYProgress, [0.42, 0.58, 1], [0, 1, 1]);
  const clueY = useTransform(scrollYProgress, [0.42, 0.64], [36, 0]);
  const progress = useTransform(scrollYProgress, [0, 1], [0, 1]);

  return (
    <section ref={ref} className="relative h-[150svh] bg-soil">
      <div className="sticky top-0 h-dvh overflow-hidden bg-soil">
        {video && poster && <link rel="preload" as="image" href={poster} fetchPriority="high" />}

        <motion.div
          className="absolute inset-0"
          style={prefersReducedMotion ? undefined : { scale: cameraScale, y: cameraY, opacity: sceneOpacity }}
        >
          {video && !prefersReducedMotion ? (
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
          ) : (
            <Image
              src={poster ?? image ?? ""}
              alt=""
              fill
              priority
              sizes="100vw"
              style={{ objectFit: "cover", objectPosition: imagePosition }}
            />
          )}
          <div className="absolute inset-0" style={{ backgroundImage: HERO_SCRIM_GRADIENT }} />
          <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(18,15,12,.18),rgba(18,15,12,.3)_48%,rgba(18,15,12,.82))]" />
        </motion.div>

        {!prefersReducedMotion && <DustMotes />}

        <motion.div
          style={prefersReducedMotion ? undefined : { opacity: openingOpacity, y: openingY }}
          className="absolute inset-0 z-10 flex items-end justify-center px-6 pb-20 text-center sm:pb-24"
        >
          <div className="w-full max-w-4xl">
            <span className="inline-flex items-center gap-2 text-[0.62rem] font-medium uppercase tracking-[0.26em] text-ivory/72">
              <span className="h-1.5 w-1.5 rounded-full bg-sandstone shadow-[0_0_14px_rgba(198,169,122,.85)]" />
              {badge}
            </span>

            <SplitReveal
              as="h1"
              className="mx-auto mt-5 max-w-3xl text-balance font-display text-[clamp(2.7rem,6.5vw,5.4rem)] font-normal leading-[0.96] tracking-[-0.04em] text-ivory"
            >
              {headline}
            </SplitReveal>

            <p className="mx-auto mt-5 max-w-xl text-pretty text-sm leading-relaxed text-ivory/74 sm:text-base">
              {subhead}
            </p>

            {children && <div className="mt-8 flex flex-wrap items-center justify-center gap-4">{children}</div>}
          </div>
        </motion.div>

        <motion.div
          style={prefersReducedMotion ? { opacity: 0 } : { opacity: clueOpacity, y: clueY }}
          className="pointer-events-none absolute inset-0 z-20 flex items-center justify-center px-6 text-center"
        >
          <div className="max-w-3xl">
            <p className="text-[0.62rem] font-medium uppercase tracking-[0.32em] text-sandstone">The first clue</p>
            <p className="mt-5 font-display text-[clamp(3rem,7vw,7rem)] font-normal leading-[0.9] tracking-[-0.045em] text-ivory">
              What remains<br />after the moment?
            </p>
            <p className="mx-auto mt-6 max-w-md text-sm leading-relaxed text-ivory/64 sm:text-base">
              The answer is rarely what people see first. It is what their mind keeps carrying.
            </p>
          </div>
        </motion.div>

        <div className="absolute inset-x-6 bottom-6 z-30 flex items-center gap-4 sm:inset-x-10 lg:inset-x-14">
          <span className="text-[0.56rem] uppercase tracking-[0.24em] text-ivory/45">Opening</span>
          <div className="h-px flex-1 overflow-hidden bg-ivory/14">
            <motion.div className="h-full origin-left bg-sandstone" style={{ scaleX: progress }} />
          </div>
          <span className="text-[0.56rem] uppercase tracking-[0.24em] text-ivory/45">Recognition</span>
        </div>
      </div>
    </section>
  );
}
