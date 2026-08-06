"use client";

import { useRef } from "react";
import Image from "next/image";
import { useReducedMotion } from "framer-motion";
import { useVideoFadeIn } from "@/hooks/useVideoFadeIn";
import { toSvh } from "@/lib/media";

type ServicesCinematicHeroProps = {
  children: React.ReactNode;
  video: string;
  poster: string;
  minHeight?: string;
  imagePosition?: string;
};

/**
 * The Services opening uses an original generated film, so it gets a
 * purpose-built media shell instead of changing the site-wide PhotoHero API.
 * The poster is always present, the film fades in only when playable, playback
 * is slightly quicker than a conventional ambient loop, and reduced-motion
 * visitors receive the same composed final frame with no autoplay dependency.
 */
export function ServicesCinematicHero({
  children,
  video,
  poster,
  minHeight = "70vh",
  imagePosition = "60% center",
}: ServicesCinematicHeroProps) {
  const prefersReducedMotion = useReducedMotion();
  const videoRef = useRef<HTMLVideoElement>(null);
  useVideoFadeIn(videoRef, !prefersReducedMotion);

  return (
    <section
      className="relative flex items-center overflow-hidden bg-[#080d0b]"
      style={{ minHeight: toSvh(minHeight) }}
    >
      <Image
        src={poster}
        alt=""
        fill
        priority
        sizes="100vw"
        style={{ objectFit: "cover", objectPosition: imagePosition }}
      />

      {!prefersReducedMotion && (
        <video
          ref={videoRef}
          className="absolute inset-0 h-full w-full object-cover opacity-0 transition-opacity duration-700"
          style={{ objectPosition: imagePosition }}
          src={video}
          poster={poster}
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
          onLoadedMetadata={(event) => {
            event.currentTarget.defaultPlaybackRate = 1.15;
            event.currentTarget.playbackRate = 1.15;
          }}
        />
      )}

      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
        style={{
          backgroundImage:
            "linear-gradient(180deg, rgba(8,13,11,0.5) 0%, rgba(8,13,11,0.64) 58%, rgba(8,13,11,0.9) 100%)",
        }}
      />

      {children}
    </section>
  );
}
