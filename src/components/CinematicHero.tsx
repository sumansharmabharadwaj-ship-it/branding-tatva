"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform, useReducedMotion } from "framer-motion";

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
}: {
  image?: string;
  video?: string;
  poster?: string;
  imagePosition?: string;
  badge: string;
  headline: React.ReactNode;
  subhead: string;
  children?: React.ReactNode;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const prefersReducedMotion = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });

  const imageY = useTransform(scrollYProgress, [0, 1], ["0%", "18%"]);
  const contentOpacity = useTransform(scrollYProgress, [0, 0.6], [1, 0]);
  const contentY = useTransform(scrollYProgress, [0, 1], ["0%", "10%"]);

  const gradient =
    "linear-gradient(180deg, rgba(20,17,14,0.65) 0%, rgba(20,17,14,0.2) 14%, rgba(20,17,14,0.1) 32%, rgba(20,17,14,0.55) 62%, rgba(20,17,14,0.95) 100%)";

  return (
    <section ref={ref} className="relative h-[100svh] min-h-[620px] overflow-hidden bg-soil">
      {video && !prefersReducedMotion ? (
        <motion.div
          className="absolute inset-0 -top-[10%] h-[120%] w-full"
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
          />
          <div className="absolute inset-0" style={{ backgroundImage: gradient }} />
        </motion.div>
      ) : (
        <motion.div
          className="absolute inset-0 -top-[10%] h-[120%] w-full"
          style={{
            y: prefersReducedMotion ? 0 : imageY,
            backgroundImage: `${gradient}, url(${poster ?? image})`,
            backgroundSize: "cover",
            backgroundPosition: imagePosition,
          }}
        />
      )}

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
          <div className="mt-8 flex flex-wrap items-center justify-center gap-4">{children}</div>
        )}

        <span className="mt-14 inline-flex items-center gap-2 rounded-full border border-ivory/20 px-4 py-1.5 text-[0.65rem] uppercase tracking-[0.3em] text-ivory/50">
          Scroll
        </span>
      </motion.div>
    </section>
  );
}
