"use client";

import Image from "next/image";
import { motion, useInView, useReducedMotion } from "framer-motion";
import { useEffect, useRef } from "react";

type HomeAmbientFilmProps = {
  videoWebm: string;
  videoMp4?: string;
  poster: string;
  label: string;
  className: string;
  imagePosition?: string;
  direction?: 1 | -1;
};

/**
 * A deliberately peripheral film fragment for chapters whose main teaching
 * instrument is a diagram rather than a full-bleed video. It remains behind
 * the content, drifts slowly, and only decodes while its own chapter is near
 * the viewport. WebM is offered first for a lighter, more reliable autoplay
 * path, with MP4 retained as the compatibility fallback. On reduced motion
 * the same composition resolves into its poster.
 */
export function HomeAmbientFilm({
  videoWebm,
  videoMp4,
  poster,
  label,
  className,
  imagePosition = "center",
  direction = 1,
}: HomeAmbientFilmProps) {
  const rootRef = useRef<HTMLElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const prefersReducedMotion = Boolean(useReducedMotion());
  const inView = useInView(rootRef, { margin: "18% 0px", amount: 0.08 });

  useEffect(() => {
    const film = videoRef.current;
    if (!film || prefersReducedMotion) return;

    if (inView && !document.hidden) void film.play().catch(() => {});
    else film.pause();
  }, [inView, prefersReducedMotion]);

  return (
    <motion.figure
      ref={rootRef}
      data-home-ambient-film
      aria-hidden="true"
      className={`pointer-events-none overflow-hidden border border-ivory/12 bg-soil/20 shadow-[0_28px_90px_rgba(20,18,16,0.26)] ${className}`}
      initial={prefersReducedMotion ? false : { opacity: 0, scale: 0.93, filter: "blur(9px)" }}
      animate={
        prefersReducedMotion
          ? { opacity: 0.34 }
          : inView
            ? {
                opacity: [0.24, 0.42, 0.3],
                x: [0, direction * 11, 0],
                y: [0, -9, 0],
                scale: [1, 1.045, 1],
                rotate: [direction * -1.2, direction * 0.8, direction * -1.2],
                filter: "blur(0px)",
              }
            : { opacity: 0.08, scale: 0.97, filter: "blur(6px)" }
      }
      transition={
        prefersReducedMotion
          ? { duration: 0 }
          : {
              opacity: { duration: 9, repeat: Infinity, ease: "easeInOut" },
              x: { duration: 15, repeat: Infinity, ease: "easeInOut" },
              y: { duration: 11, repeat: Infinity, ease: "easeInOut" },
              scale: { duration: 13, repeat: Infinity, ease: "easeInOut" },
              rotate: { duration: 17, repeat: Infinity, ease: "easeInOut" },
              filter: { duration: 0.8 },
            }
      }
    >
      {prefersReducedMotion ? (
        <Image
          src={poster}
          alt=""
          fill
          sizes="(max-width: 767px) 55vw, 24vw"
          className="object-cover"
          style={{ objectPosition: imagePosition }}
        />
      ) : (
        <video
          ref={videoRef}
          poster={poster}
          className="absolute inset-0 h-full w-full object-cover"
          style={{ objectPosition: imagePosition }}
          muted
          loop
          autoPlay
          playsInline
          preload="metadata"
          onCanPlay={(event) => {
            if (inView && !document.hidden) {
              void event.currentTarget.play().catch(() => {});
            }
          }}
        >
          <source src={videoWebm} type="video/webm" />
          {videoMp4 && <source src={videoMp4} type="video/mp4" />}
        </video>
      )}

      <span
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(180deg, rgba(20,18,16,0.02) 20%, rgba(20,18,16,0.42) 100%)",
        }}
      />
      <motion.span
        className="absolute -inset-y-8 -left-1/2 w-1/3 rotate-12 bg-ivory/10 blur-xl"
        animate={prefersReducedMotion ? undefined : { x: ["0%", "620%"] }}
        transition={
          prefersReducedMotion
            ? undefined
            : { duration: 6.8, repeat: Infinity, repeatDelay: 4.4, ease: "easeInOut" }
        }
      />
      <figcaption className="absolute bottom-4 left-4 right-4 font-display text-sm leading-snug text-ivory/68">
        {label}
      </figcaption>
    </motion.figure>
  );
}
