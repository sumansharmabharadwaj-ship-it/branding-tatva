"use client";

import { useRef } from "react";
import Image from "next/image";
import { motion, useScroll, useTransform, useReducedMotion } from "framer-motion";
import { Reveal } from "@/components/Reveal";
import { SplitReveal } from "@/components/SplitReveal";
import { LinkButton } from "@/components/Button";
import { LogoMark } from "@/components/Logo";
import { ScrollCue } from "@/components/ScrollCue";

const PAPER_GRAIN_URL =
  "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='180' height='180'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")";

// Collage hero: a full-bleed nature backdrop with two small
// physical-feeling cards floating centered on top of it — a postcard
// carrying the headline, a bordered photo card carrying Suman's own
// footage beneath it. Direct reference: a set of Pinterest pins
// showing exactly this (a postage-stamp/postcard object centered on a
// full-bleed landscape photo), not a competing full-bleed banner or a
// 50/50 split panel — those kept forcing her portrait footage to cover
// a shape it doesn't fit.
//
// Two things a flat white rounded rectangle never had, both fixed
// here: it needs to read as an actual object (the same paper-grain
// noise texture used sitewide, a hairline double rule, the brand's own
// five-bar mark as a corner seal) rather than a generic card, and the
// whole scene needs to move on scroll, not just fade in once — the
// background and the two cards now drift at different rates as the
// section scrolls by, the same parallax technique (and the same
// useScroll/useTransform primitives) the homepage's own CinematicHero
// already uses, so this isn't a one-off animation vocabulary.
export function AboutSplitHero({
  eyebrow,
  headline,
  body,
  ctaHref,
  ctaLabel,
  video,
  poster,
  bgVideo,
  bgPoster,
}: {
  eyebrow: string;
  headline: string;
  body: string;
  ctaHref: string;
  ctaLabel: string;
  video: string;
  poster: string;
  bgVideo: string;
  bgPoster: string;
}) {
  const ref = useRef<HTMLElement>(null);
  const prefersReducedMotion = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });

  const bgY = useTransform(scrollYProgress, [0, 1], ["0%", "20%"]);
  const postcardY = useTransform(scrollYProgress, [0, 1], ["0%", "8%"]);
  const postcardRotate = useTransform(scrollYProgress, [0, 1], [-1.5, -5]);
  const photoY = useTransform(scrollYProgress, [0, 1], ["0%", "14%"]);
  const photoRotate = useTransform(scrollYProgress, [0, 1], [1.5, 5]);
  const contentOpacity = useTransform(scrollYProgress, [0, 0.7], [1, 0]);

  return (
    <section ref={ref} className="relative flex min-h-screen items-center justify-center overflow-hidden bg-soil">
      {prefersReducedMotion ? (
        <Image src={bgPoster} alt="" fill priority sizes="100vw" className="object-cover" />
      ) : (
        <motion.div className="absolute inset-0 top-[-12%] h-[124%] w-full" style={{ y: bgY }}>
          <video
            className="h-full w-full object-cover"
            src={bgVideo}
            poster={bgPoster}
            autoPlay
            muted
            loop
            playsInline
          />
        </motion.div>
      )}
      <div
        className="absolute inset-0"
        style={{
          backgroundImage:
            "radial-gradient(ellipse 90% 70% at 50% 45%, rgba(39,34,30,0.42) 0%, rgba(39,34,30,0.12) 55%, rgba(39,34,30,0.38) 100%)",
        }}
      />

      <motion.div
        className="relative z-10 flex flex-col items-center px-6 py-28 text-center"
        style={prefersReducedMotion ? undefined : { opacity: contentOpacity }}
      >
        <Reveal>
          {/* The postcard — a real designed object, not a plain box:
              paper-grain texture, a hairline double rule, the brand's
              five-bar mark standing in as a wax-seal-style emblem. */}
          <motion.div
            className="relative z-20 mx-auto max-w-[19rem] rounded-sm bg-ivory px-7 py-7 shadow-elevation-lg sm:max-w-sm sm:px-9 sm:py-8"
            style={prefersReducedMotion ? { rotate: -1.5 } : { y: postcardY, rotate: postcardRotate }}
          >
            <div
              className="pointer-events-none absolute inset-0 rounded-sm opacity-[0.05] mix-blend-multiply"
              style={{ backgroundImage: PAPER_GRAIN_URL }}
              aria-hidden="true"
            />
            <div className="pointer-events-none absolute inset-[6px] rounded-[2px] border border-soil/15" aria-hidden="true" />
            <LogoMark size={26} className="relative mx-auto" />
            <span className="relative mt-3 block text-[0.6rem] font-medium uppercase tracking-[0.3em] text-soil/50">
              {eyebrow}
            </span>
            <SplitReveal
              as="h1"
              className="relative mt-4 font-display text-[clamp(1.3rem,3.4vw,2rem)] font-normal leading-[1.22] text-soil"
            >
              {headline}
            </SplitReveal>
          </motion.div>
        </Reveal>

        {/* The photo card — her own footage, bordered like a printed
            photograph, overlapping the postcard's bottom edge. */}
        <Reveal delay={0.12} className="relative z-10 -mt-4">
          <motion.div
            className="relative w-[230px] overflow-hidden rounded-lg border-[6px] border-ivory shadow-elevation-lg sm:w-[280px]"
            style={prefersReducedMotion ? { rotate: 1.5 } : { y: photoY, rotate: photoRotate }}
          >
            <div className="relative aspect-[3/4] w-full overflow-hidden">
              {prefersReducedMotion ? (
                <Image src={poster} alt="" fill sizes="280px" className="object-cover" />
              ) : (
                <video
                  className="absolute inset-0 h-full w-full object-cover"
                  src={video}
                  poster={poster}
                  autoPlay
                  muted
                  loop
                  playsInline
                />
              )}
              <div
                className="absolute inset-x-0 bottom-0 px-4 pb-3 pt-8"
                style={{ backgroundImage: "linear-gradient(0deg, rgba(20,17,14,0.75) 0%, rgba(20,17,14,0) 100%)" }}
              >
                <p className="font-body text-[0.65rem] uppercase tracking-[0.18em] text-ivory/90">{body}</p>
              </div>
            </div>
          </motion.div>
        </Reveal>

        <Reveal delay={0.22} className="mt-9">
          <LinkButton href={ctaHref}>{ctaLabel}</LinkButton>
        </Reveal>
      </motion.div>

      <ScrollCue />
    </section>
  );
}
