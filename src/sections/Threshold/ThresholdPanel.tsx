"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { motion, useReducedMotion } from "framer-motion";
import { LinkButton } from "@/components/Button";
import { useSpotlight } from "@/hooks/useSpotlight";
import { useLazyMount } from "@/hooks/useLazyMount";
import { EASE_AIR } from "@/lib/motion";
import type { ThresholdPanelData } from "./types";
import {
  ACTIVE_IMAGE_SCALE,
  INACTIVE_IMAGE_SCALE,
  INACTIVE_DIM_OPACITY,
  PANEL_TRANSITION_MS,
} from "./constants";

// The ambient clip plays continuously once the panel nears the viewport
// — a still image behind a section this large reads as frozen. Hovering
// still does its own thing (the image/video scales up and brightens
// while the sibling dims, see the parent motion.div's animate below);
// this only controls whether the clip itself is playing at all, not
// which panel currently has attention.
function PanelVideo({ src }: { src: string }) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [ref, shouldLoad] = useLazyMount();
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const video = videoRef.current;
    if (!video || !shouldLoad) return;
    video.play().catch(() => {});
  }, [shouldLoad]);

  return (
    <div ref={ref} className="absolute inset-0">
      {shouldLoad && (
        <video
          ref={videoRef}
          className="absolute inset-0 h-full w-full object-cover transition-opacity duration-700"
          style={{ opacity: ready ? 1 : 0 }}
          onCanPlay={() => setReady(true)}
          src={src}
          muted
          loop
          playsInline
          preload="metadata"
        />
      )}
    </div>
  );
}

export function ThresholdPanel({
  panel,
  isActive,
  siblingActive,
  onHoverStart,
  onHoverEnd,
}: {
  panel: ThresholdPanelData;
  isActive: boolean;
  siblingActive: boolean;
  onHoverStart: () => void;
  onHoverEnd: () => void;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const prefersReducedMotion = useReducedMotion();
  const spotlightRef = useSpotlight(ref, Boolean(prefersReducedMotion));

  const imageScale = prefersReducedMotion
    ? 1
    : isActive
      ? ACTIVE_IMAGE_SCALE
      : siblingActive
        ? INACTIVE_IMAGE_SCALE
        : 1;
  const dimmed = siblingActive && !isActive;

  return (
    <div
      ref={ref}
      onMouseEnter={onHoverStart}
      onMouseLeave={onHoverEnd}
      className="relative flex h-full min-h-[50svh] items-end overflow-hidden bg-soil p-8 sm:min-h-0 sm:p-12"
    >
      <motion.div
        className="absolute inset-0"
        animate={{ scale: imageScale, opacity: dimmed ? INACTIVE_DIM_OPACITY : 1 }}
        transition={{ duration: PANEL_TRANSITION_MS / 1000, ease: EASE_AIR }}
      >
        <Image
          src={panel.image}
          alt=""
          fill
          priority
          sizes="(min-width: 640px) 50vw, 100vw"
          style={{ objectFit: "cover" }}
        />
        {panel.video && !prefersReducedMotion && <PanelVideo src={panel.video} />}
        <div className="absolute inset-0" style={{ backgroundImage: panel.gradient }} />
      </motion.div>

      {!prefersReducedMotion && (
        <div
          ref={spotlightRef}
          aria-hidden="true"
          className="cursor-spotlight pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500"
        />
      )}

      <motion.div
        className="relative"
        animate={{ y: isActive ? -4 : 0 }}
        transition={{ duration: 0.4, ease: EASE_AIR }}
      >
        <p className="text-xs font-medium uppercase tracking-[0.3em] text-sandstone">
          {panel.eyebrow}
        </p>
        <p className="mt-3 max-w-xs font-display text-3xl font-semibold text-ivory">
          {panel.title}
        </p>
        <p className="mt-3 max-w-xs text-sm text-ivory/70">{panel.description}</p>
        <LinkButton
          href={panel.ctaHref}
          variant="secondary"
          className="mt-6 border-ivory/30 text-ivory hover:bg-ivory/10"
        >
          {panel.ctaLabel}
        </LinkButton>
      </motion.div>
    </div>
  );
}
