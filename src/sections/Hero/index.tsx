"use client";

import { useHydratedReducedMotion } from "@/hooks/useHydratedReducedMotion";
import { useRef } from "react";
import Image from "next/image";
import dynamic from "next/dynamic";
import {
  motion,
  useScroll,
  useTransform,
} from "framer-motion";
import { useSpotlight } from "@/hooks/useSpotlight";
import { SplitReveal } from "@/components/SplitReveal";
import type { CinematicHeroProps } from "./types";
import { HERO_SCRIM_GRADIENT } from "./constants";
import { useHeroMouseParallax } from "./animations";

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
  const prefersReducedMotion = useHydratedReducedMotion();
  const staticLayout = Boolean(prefersReducedMotion);
  const mouseParallax = useHeroMouseParallax(ref, staticLayout);
  const spotlightRef = useSpotlight(ref, staticLayout);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end end"],
  });

  const cameraScale = useTransform(scrollYProgress, [0, 1], [1.04, 1.2]);
  const cameraY = useTransform(scrollYProgress, [0, 1], [0, -48]);
  const sceneBrightness = useTransform(scrollYProgress, [0, 0.42, 1], [1, 0.72, 0.46]);
  const sceneBlur = useTransform(scrollYProgress, [0, 0.62, 1], [0, 0, 3]);
  const sceneFilter = useTransform(
    [sceneBrightness, sceneBlur],
    ([brightness, blur]) => `brightness(${brightness}) blur(${blur}px)`,
  );
  const openingOpacity = useTransform(scrollYProgress, [0, 0.28, 0.52], [1, 1, 0]);
  const openingY = useTransform(scrollYProgress, [0, 0.5], [0, -72]);
  const questionOpacity = useTransform(scrollYProgress, [0.38, 0.62, 0.9], [0, 1, 1]);
  const questionY = useTransform(scrollYProgress, [0.4, 0.72], [60, 0]);
  const aperture = useTransform(
    scrollYProgress,
    [0, 0.48, 1],
    ["inset(0% 0% 0% 0% round 0px)", "inset(5% 5% 5% 5% round 30px)", "inset(12% 14% 12% 14% round 44px)"],
  );
  const lightX = useTransform(scrollYProgress, [0, 1], ["-35%", "42%"]);
  const clueScale = useTransform(scrollYProgress, [0.48, 0.9], [0.82, 1]);

  return (
    <section ref={ref} className={staticLayout ? "relative min-h-svh bg-soil" : "relative h-[190svh] bg-soil"}>
      <div
        className={
          staticLayout
            ? "relative min-h-svh overflow-hidden bg-soil"
            : "sticky top-0 h-svh min-h-[620px] overflow-hidden bg-soil"
        }
      >
        {video && poster && <link rel="preload" as="image" href={poster} fetchPriority="high" />}

        <motion.div
          className="absolute inset-0"
          style={
            staticLayout
              ? undefined
              : {
                  clipPath: aperture,
                  scale: cameraScale,
                  y: cameraY,
                  filter: sceneFilter,
                }
          }
        >
          <motion.div
            className="absolute -inset-8"
            style={staticLayout ? undefined : { x: mouseParallax.x, y: mouseParallax.y }}
          >
            {video && !staticLayout ? (
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
          </motion.div>
          <div className="absolute inset-0" style={{ backgroundImage: HERO_SCRIM_GRADIENT }} />
        </motion.div>

        {!staticLayout && <div className="light-rays" aria-hidden="true" />}

        {!staticLayout && (
          <motion.div
            aria-hidden="true"
            className="pointer-events-none absolute -top-1/2 bottom-[-30%] z-[1] w-[32%] rotate-[14deg] bg-gradient-to-b from-transparent via-[#f5d9a0]/16 to-transparent blur-3xl"
            style={{ x: lightX }}
          />
        )}

        {!staticLayout && (
          <div
            ref={spotlightRef}
            aria-hidden="true"
            className="cursor-spotlight pointer-events-none absolute inset-0 z-[2] opacity-0 transition-opacity duration-500"
          />
        )}

        {!staticLayout && <DustMotes />}

        <motion.div
          style={staticLayout ? undefined : { opacity: openingOpacity, y: openingY }}
          className={`absolute inset-0 z-[3] flex flex-col items-center px-6 text-center ${
            staticLayout ? "justify-center pb-10 pt-24" : "justify-end pb-20 sm:pb-24"
          }`}
        >
          <motion.span
            initial={staticLayout ? false : { opacity: 0, y: 12 }}
            animate={staticLayout ? undefined : { opacity: 1, y: 0 }}
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
            initial={staticLayout ? false : { opacity: 0, y: 14 }}
            animate={staticLayout ? undefined : { opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.7 }}
            className="mt-5 max-w-xl text-pretty text-sm leading-relaxed text-ivory/78 sm:text-base"
          >
            {subhead}
          </motion.p>

          {children && (
            <motion.div
              className="mt-8 flex flex-wrap items-center justify-center gap-4"
              initial={staticLayout ? false : { opacity: 0, y: 18 }}
              animate={staticLayout ? undefined : { opacity: 1, y: 0 }}
              transition={{ duration: 0.9, delay: 0.95, ease: [0.16, 1, 0.3, 1] }}
            >
              {children}
            </motion.div>
          )}
        </motion.div>

        {!staticLayout && (
          <motion.div
            aria-hidden="true"
            style={{ opacity: questionOpacity, y: questionY, scale: clueScale }}
            className="pointer-events-none absolute inset-0 z-[4] flex items-center justify-center px-6 text-center"
          >
            <div className="max-w-3xl">
              <p className="text-[0.65rem] font-medium uppercase tracking-[0.32em] text-sandstone/85">
                The first clue
              </p>
              <p className="mt-5 font-display text-[clamp(2.8rem,7vw,7rem)] font-normal leading-[0.92] tracking-[-0.04em] text-ivory">
                What remains
                <br />
                after the moment?
              </p>
              <p className="mx-auto mt-6 max-w-md text-sm leading-relaxed text-ivory/62 sm:text-base">
                Scroll. The answer is not in what people see first, but in what their mind keeps carrying.
              </p>
            </div>
          </motion.div>
        )}

        {!staticLayout && (
          <motion.div
            aria-hidden="true"
            className="absolute bottom-5 left-1/2 z-10 flex -translate-x-1/2 flex-col items-center gap-2 text-[0.58rem] uppercase tracking-[0.28em] text-ivory/45"
            animate={{ opacity: [0.35, 0.8, 0.35] }}
            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
          >
            Follow the clue
            <span className="h-8 w-px bg-gradient-to-b from-sandstone/70 to-transparent" />
          </motion.div>
        )}
      </div>
    </section>
  );
}
