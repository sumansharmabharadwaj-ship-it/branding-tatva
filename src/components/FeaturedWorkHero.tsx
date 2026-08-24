"use client";

import { useHydratedReducedMotion } from "@/hooks/useHydratedReducedMotion";
import { useRef } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { kenBurnsAnimation } from "@/animations/kenBurns";
import { AnimatedStat } from "@/components/AnimatedStat";
import { useLazyMount } from "@/hooks/useLazyMount";
import { useTilt } from "@/hooks/useTilt";
import { useVideoFadeIn } from "@/hooks/useVideoFadeIn";

const KEN_BURNS = kenBurnsAnimation({ scale: 1.05, duration: 16 });

// The large featured-work entry: a full photographic block with a slow
// hover zoom, distinct from the smaller text-only entries beside it so
// the section reads as one large story plus two quiet footnotes, not
// three identical cards. Stats render as scannable count-up numbers
// (same component the case-study pages already use) rather than the
// raw outcome paragraph — a wall of "104%... 1,350%... 365%..." prose
// crammed into one card is a data dump, not something anyone actually
// reads at a glance. Falls back to the outcome sentence for projects
// that don't have verified stats broken out yet.

export function FeaturedWorkHero({
  href,
  image,
  video,
  industry,
  title,
  hook,
  outcome,
  stats,
  imagePosition = "center",
  accent,
}: {
  href: string;
  image: string;
  video?: string;
  industry: string;
  title: string;
  hook?: string;
  outcome: string;
  stats?: { value: string; label: string }[];
  imagePosition?: string;
  accent?: string;
}) {
  const prefersReducedMotion = useHydratedReducedMotion();
  const [lazyRef, shouldLoad] = useLazyMount();
  const tiltRef = useRef<HTMLAnchorElement>(null);
  const { rotateX, rotateY } = useTilt(tiltRef, 2.5, Boolean(prefersReducedMotion));
  const videoRef = useRef<HTMLVideoElement>(null);
  useVideoFadeIn(videoRef, shouldLoad && Boolean(video) && !prefersReducedMotion);

  return (
    <a
      ref={tiltRef}
      href={href}
      data-cursor-label="View case study"
      className="group relative flex min-h-[75svh] items-end overflow-hidden bg-soil"
      style={{ perspective: 1000 }}
    >
      <motion.div
        ref={lazyRef}
        className="absolute inset-0"
        initial={KEN_BURNS.initial}
        animate={prefersReducedMotion ? undefined : KEN_BURNS.animate}
        whileHover={{ scale: 1.1 }}
        transition={KEN_BURNS.transition}
        style={prefersReducedMotion ? undefined : { rotateX, rotateY }}
      >
        {shouldLoad && (
          <>
            {/* priority — this section sits well below the fold on a
                long home page, and confirmed elsewhere on this site
                that next/image's own native lazy-load can simply never
                fire for a section scrolled past quickly; useLazyMount
                (IntersectionObserver + Lenis-scroll fallback) already
                decides correct timing, so priority just skips the
                second, unreliable gate on top of that. */}
            <Image
              src={image}
              alt=""
              fill
              priority
              sizes="100vw"
              style={{ objectFit: "cover", objectPosition: imagePosition }}
            />
            {/* project.cardVideo was already in the data (data/projects.ts)
                but this component had no video prop at all — the featured
                hero slot silently fell back to a still image with only a
                barely-perceptible 1.05 Ken Burns scale, reading as static
                next to every other video-forward section on the page.
                Fades in on top of the still image once ready, same
                pattern as TexturedDark/CinematicCardMedia. */}
            {video && (
              <video
                ref={videoRef}
                className="absolute inset-0 h-full w-full object-cover opacity-0 transition-opacity duration-700"
                style={{ objectPosition: imagePosition }}
                src={video}
                muted
                loop
                playsInline
                aria-hidden="true"
                preload="metadata"
              />
            )}
            {/* Ties the featured entry's own industry photography back
                to its element without replacing it — same treatment as
                the smaller work cards below it. */}
            {accent && (
              <div className="absolute inset-0" style={{ backgroundColor: accent, opacity: 0.16, mixBlendMode: "multiply" }} />
            )}
          </>
        )}
        <div
          className="absolute inset-0"
          style={{
            backgroundImage:
              "linear-gradient(0deg, rgba(39,34,30,0.92) 0%, rgba(39,34,30,0.35) 55%, rgba(39,34,30,0.25) 100%)",
          }}
        />
      </motion.div>
      <div className="container-page relative py-10">
        <p className="text-xs font-medium uppercase tracking-[0.3em] text-sandstone">{industry}</p>
        <p className="mt-3 max-w-xl font-display text-3xl font-normal text-ivory sm:text-4xl">
          {title}
        </p>
        {hook && <p className="mt-2 max-w-lg text-sm italic text-ivory/80">{hook}</p>}
        {stats && stats.length > 0 ? (
          <div className="mt-6 flex flex-wrap gap-x-8 gap-y-4">
            {stats.slice(0, 3).map((stat) => (
              <div key={stat.label}>
                <p className="font-display text-2xl font-normal text-ivory sm:text-3xl">
                  <AnimatedStat value={stat.value} />
                </p>
                <p className="mt-0.5 max-w-[10rem] text-xs text-ivory/70">{stat.label}</p>
              </div>
            ))}
          </div>
        ) : (
          <p className="mt-3 max-w-lg text-sm text-ivory/70">{outcome}</p>
        )}
      </div>
    </a>
  );
}
