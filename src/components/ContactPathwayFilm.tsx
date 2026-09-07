"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { useHydratedReducedMotion } from "@/hooks/useHydratedReducedMotion";
import { useVideoFadeIn } from "@/hooks/useVideoFadeIn";
import { EASE_AIR } from "@/lib/motion";
import { LivingImage } from "@/components/LivingImage";
import { usesLivingStill } from "@/lib/mediaMode";

export type ContactPathwayFilmProps = {
  video: string;
  poster: string;
  caption: string;
  playbackRate: number;
  camera: "folio" | "conversation" | "letter";
  hoverBoost?: number;
  imagePosition?: string;
};

/**
 * The active contact route owns one quiet foreground film. Keeping the film
 * inside the selected panel makes the choice feel tangible while preserving
 * the form and booking card as calm, distraction-free working surfaces.
 */
export function ContactPathwayFilm({
  video,
  poster,
  caption,
  playbackRate,
  camera,
  hoverBoost = 0.06,
  imagePosition = "center",
}: ContactPathwayFilmProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isHovering, setIsHovering] = useState(false);
  const reducedMotion = useHydratedReducedMotion();
  const livingStill = usesLivingStill(video);

  useVideoFadeIn(videoRef, !reducedMotion && !livingStill);

  useEffect(() => {
    const element = videoRef.current;
    if (!element || livingStill) return;

    // Each route gets its own small hover lift. The ceiling stays below real
    // time so the response reads as attention, never fast-forward playback.
    const nextRate = Math.min(0.96, playbackRate + (isHovering ? hoverBoost : 0));
    element.defaultPlaybackRate = nextRate;
    element.playbackRate = nextRate;
  }, [hoverBoost, isHovering, livingStill, playbackRate, video]);

  return (
    <motion.figure
      data-contact-pathway-film
      data-contact-pathway-camera={camera}
      className="relative m-0 w-full min-w-0 self-center overflow-hidden rounded-2xl bg-soil"
      onPointerEnter={(event) => {
        if (event.pointerType === "mouse") setIsHovering(true);
      }}
      onPointerLeave={(event) => {
        if (event.pointerType === "mouse") setIsHovering(false);
      }}
      initial={reducedMotion ? undefined : { opacity: 0, scale: 1.035, clipPath: "inset(0 14% 0 0 round 1.4rem)" }}
      animate={{ opacity: 1, scale: 1, clipPath: "inset(0 0% 0 0 round 1.4rem)" }}
      transition={{ duration: reducedMotion ? 0 : 0.64, ease: EASE_AIR }}
    >
      {livingStill ? (
        <LivingImage
          src={poster}
          sizes="(min-width: 1024px) 28vw, (min-width: 640px) 42vw, calc(100vw - 5rem)"
          imagePosition={imagePosition}
          intensity="subtle"
        />
      ) : (
        <Image
          src={poster}
          alt=""
          fill
          sizes="(min-width: 1024px) 28vw, (min-width: 640px) 42vw, calc(100vw - 5rem)"
          style={{ objectFit: "cover", objectPosition: imagePosition }}
        />
      )}

      {!reducedMotion && !livingStill ? (
        <video
          ref={videoRef}
          data-video-priority="foreground"
          className="contact-pathway-film-video absolute inset-0 h-full w-full object-cover opacity-0 transition-opacity duration-700"
          style={{ objectPosition: imagePosition }}
          muted
          loop
          playsInline
          aria-hidden="true"
          preload="metadata"
        >
          <source src={video} type="video/mp4" />
        </video>
      ) : null}

      <div
        aria-hidden="true"
        className="absolute inset-0 bg-[linear-gradient(180deg,transparent_55%,rgba(24,27,22,0.72)_100%)]"
      />
      <div
        aria-hidden="true"
        className="contact-pathway-film-glint absolute inset-y-0 left-[-35%] w-[42%] rotate-[11deg] bg-gradient-to-r from-transparent via-white/18 to-transparent"
      />

      <figcaption className="absolute inset-x-4 bottom-3 text-[0.65rem] font-medium leading-relaxed tracking-[0.03em] text-ivory sm:bottom-4">
        {caption}
      </figcaption>
    </motion.figure>
  );
}
