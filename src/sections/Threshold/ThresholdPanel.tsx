"use client";

import { useRef } from "react";
import Image from "next/image";
import { motion, useReducedMotion } from "framer-motion";
import { LinkButton } from "@/components/Button";
import { useSpotlight } from "@/hooks/useSpotlight";
import type { ThresholdPanelData } from "./types";
import {
  ACTIVE_IMAGE_SCALE,
  INACTIVE_IMAGE_SCALE,
  INACTIVE_DIM_OPACITY,
  PANEL_TRANSITION_MS,
} from "./constants";

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
      className="relative flex h-full min-h-[50vh] items-end overflow-hidden bg-soil p-8 sm:min-h-0 sm:p-12"
    >
      <motion.div
        className="absolute inset-0"
        animate={{ scale: imageScale, opacity: dimmed ? INACTIVE_DIM_OPACITY : 1 }}
        transition={{ duration: PANEL_TRANSITION_MS / 1000, ease: [0.16, 1, 0.3, 1] }}
      >
        <Image
          src={panel.image}
          alt=""
          fill
          sizes="(min-width: 640px) 50vw, 100vw"
          style={{ objectFit: "cover" }}
        />
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
        transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
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
