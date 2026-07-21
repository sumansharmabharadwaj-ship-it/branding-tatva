"use client";

import { useRef } from "react";
import Image from "next/image";
import { motion, useReducedMotion } from "framer-motion";
import { kenBurnsAnimation } from "@/animations/kenBurns";
import { AnimatedStat } from "@/components/AnimatedStat";
import { useLazyMount } from "@/hooks/useLazyMount";
import { useTilt } from "@/hooks/useTilt";

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
  industry,
  title,
  outcome,
  stats,
  imagePosition = "center",
  accent,
}: {
  href: string;
  image: string;
  industry: string;
  title: string;
  outcome: string;
  stats?: { value: string; label: string }[];
  imagePosition?: string;
  accent?: string;
}) {
  const prefersReducedMotion = useReducedMotion();
  const [lazyRef, shouldLoad] = useLazyMount();
  const tiltRef = useRef<HTMLAnchorElement>(null);
  const { rotateX, rotateY } = useTilt(tiltRef, 2.5, Boolean(prefersReducedMotion));

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
