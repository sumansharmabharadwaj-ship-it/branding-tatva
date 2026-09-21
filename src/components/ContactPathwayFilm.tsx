"use client";

import Image from "next/image";
import { useContext, useEffect, useRef, useState, type ReactNode } from "react";
import { motion, useMotionValue, useTransform } from "framer-motion";
import { useHydratedReducedMotion } from "@/hooks/useHydratedReducedMotion";
import { useVideoFadeIn } from "@/hooks/useVideoFadeIn";
import { ContactSceneMotion } from "@/components/ContactCinematicScene";
import { usesLivingStill } from "@/lib/mediaMode";

export type ContactPathwayFilmProps = {
  active?: boolean;
  video: string;
  poster: string;
  caption: string;
  playbackRate: number;
  camera: "folio" | "conversation" | "letter";
  hoverBoost?: number;
  imagePosition?: string;
};

const CAMERA_TRAVEL = {
  folio: { x: [-2, 0, 1.6], y: [1.3, 0, -1.3] },
  conversation: { x: [-1.4, 0, 1.4], y: [-1.6, 0, 1.6] },
  letter: { x: [2, 0, -1.6], y: [0.8, 0, -1.5] },
};

/** Mount only with the active photograph. Its camera and window light share
 * the chapter's eased timeline, including reverse scroll and reading focus. */
function PathwayCamera({ camera, hovered, children }: {
  camera: ContactPathwayFilmProps["camera"];
  hovered: boolean;
  children: ReactNode;
}) {
  const scene = useContext(ContactSceneMotion);
  const restingProgress = useMotionValue(0.5);
  const restingFocus = useMotionValue(0);
  const progress = scene?.progress ?? restingProgress;
  const readingRest = scene?.readingRest ?? restingFocus;
  const enabled = scene?.enabled ?? false;
  const travel = CAMERA_TRAVEL[camera];
  const compactScale = scene?.compact ? 0.55 : 1;
  const travelX = useTransform(progress, [0, 0.5, 1], travel.x);
  const travelY = useTransform(progress, [0, 0.5, 1], travel.y);
  const travelScale = useTransform(progress, [0, 0.5, 1], scene?.compact ? [1.075, 1.035, 1.065] : [1.12, 1.06, 1.1]);
  const lightTravel = useTransform(progress, [0, 1], [-45, 45]);
  const x = useTransform(() => `${travelX.get() * compactScale * (1 - readingRest.get())}%`);
  const y = useTransform(() => `${travelY.get() * compactScale * (1 - readingRest.get())}%`);
  const scale = useTransform(() => 1.035 + (travelScale.get() - 1.035) * (1 - readingRest.get()));
  const lightX = useTransform(() => `${lightTravel.get() * (1 - readingRest.get())}%`);

  return <>
    <motion.div
      aria-hidden="true"
      data-contact-pathway-plane
      data-contact-pathway-motion={enabled ? "full" : "reduced"}
      style={{ x: enabled ? x : 0, y: enabled ? y : 0, scale: enabled ? scale : 1 }}
    >{children}</motion.div>
    <motion.div
      aria-hidden="true"
      data-contact-pathway-light
      style={{ x: enabled ? lightX : 0 }}
      animate={{ opacity: enabled ? hovered ? 0.32 : 0.18 : 0 }}
      initial={false}
      transition={{ duration: enabled ? 0.35 : 0 }}
    />
  </>;
}

/**
 * The active contact route owns one quiet foreground film. Keeping the film
 * inside the selected panel makes the choice feel tangible while preserving
 * the form and booking card as calm, distraction-free working surfaces.
 */
export function ContactPathwayFilm({
  active = true,
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
  const [retainMedia, setRetainMedia] = useState(active);
  const showMedia = active || retainMedia;

  useVideoFadeIn(videoRef, showMedia && !reducedMotion && !livingStill);

  useEffect(() => {
    if (active) {
      setRetainMedia(true);
      return;
    }
    // Keep the outgoing photograph through the 140ms dissolve. Hidden routes
    // then release their camera and image instead of running three at once.
    const timer = window.setTimeout(() => setRetainMedia(false), reducedMotion ? 0 : 160);
    return () => window.clearTimeout(timer);
  }, [active, reducedMotion]);

  useEffect(() => {
    const element = videoRef.current;
    if (!element || livingStill) return;

    // Each route gets its own small hover lift. The ceiling stays below real
    // time so the response reads as attention, never fast-forward playback.
    const nextRate = Math.min(0.96, playbackRate + (isHovering ? hoverBoost : 0));
    element.defaultPlaybackRate = nextRate;
    element.playbackRate = nextRate;
  }, [hoverBoost, isHovering, livingStill, playbackRate, showMedia, video]);

  return (
    <figure
      data-contact-pathway-film
      data-contact-pathway-camera={camera}
      className="relative m-0 w-full min-w-0 self-center overflow-hidden rounded-2xl bg-soil"
      onPointerEnter={(event) => {
        if (event.pointerType === "mouse") setIsHovering(true);
      }}
      onPointerLeave={(event) => {
        if (event.pointerType === "mouse") setIsHovering(false);
      }}
      onPointerCancel={() => setIsHovering(false)}
    >
      {showMedia ? <PathwayCamera camera={camera} hovered={isHovering}>
        <Image
          src={poster}
          alt=""
          fill
          sizes="(min-width: 1024px) 28vw, (min-width: 640px) 42vw, calc(100vw - 5rem)"
          style={{ objectFit: "cover", objectPosition: imagePosition }}
        />

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
      </PathwayCamera> : null}

      <div
        aria-hidden="true"
        className="absolute inset-0 bg-[linear-gradient(180deg,transparent_55%,rgba(24,27,22,0.72)_100%)]"
      />

      <figcaption className="absolute inset-x-4 bottom-3 text-[0.7rem] font-medium leading-relaxed tracking-[0.03em] text-ivory [text-shadow:0_1px_14px_rgba(20,16,10,0.6)] sm:bottom-4">
        {caption}
      </figcaption>
    </figure>
  );
}
