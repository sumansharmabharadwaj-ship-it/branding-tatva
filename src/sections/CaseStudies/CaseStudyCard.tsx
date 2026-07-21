"use client";

import { useRef, useState } from "react";
import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import { CinematicCardMedia } from "@/components/CinematicCardMedia";
import { useTilt } from "@/hooks/useTilt";
import { EASE_AIR } from "@/lib/motion";
import type { Project } from "@/data/projects";
import { CARD_MEDIA_GRADIENT, CARD_TILT_MAX_DEGREES } from "./constants";

export function CaseStudyCard({ project }: { project: Project }) {
  const [isHovered, setIsHovered] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const prefersReducedMotion = useReducedMotion();
  const { rotateX, rotateY } = useTilt(ref, CARD_TILT_MAX_DEGREES, Boolean(prefersReducedMotion));

  return (
    <div
      ref={ref}
      className="group relative h-full"
      style={{ perspective: 1000 }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Tilt (rotateX/rotateY) and lift (y) live on this wrapper, not
          the CSS hover:-translate-y-1 the card used before — Framer
          Motion computes one combined inline `transform`, which would
          silently override a Tailwind transform utility class rather
          than combining with it. The accent-colored glow uses
          filter: drop-shadow rather than box-shadow for the same
          GPU-compositing reason box-shadow forces a repaint of the
          shadow region on every frame; drop-shadow doesn't. */}
      <motion.div
        style={prefersReducedMotion ? undefined : { rotateX, rotateY }}
        animate={
          prefersReducedMotion
            ? undefined
            : {
                y: isHovered ? -6 : 0,
                filter: isHovered
                  ? `drop-shadow(0 16px 28px ${project.accent}55)`
                  : "drop-shadow(0 0px 0px transparent)",
              }
        }
        transition={{ duration: 0.35, ease: EASE_AIR }}
        className="relative h-full"
      >
        <Link
          href={`/work/${project.slug}`}
          data-cursor-label="View case study"
          className="spotlight-card relative flex h-full flex-col justify-end overflow-hidden rounded-lg p-6 shadow-elevation-sm"
          style={{ ["--card-color" as string]: project.accent }}
        >
          <CinematicCardMedia
            image={project.cardImage}
            video={project.cardVideo}
            gradient={CARD_MEDIA_GRADIENT}
            isHovered={isHovered}
            dust
            accent={project.accent}
            imagePosition={project.cardImagePosition}
          />
          <div className="relative border-t-2 pt-4" style={{ borderTopColor: project.accent }}>
            <p className="text-xs font-medium uppercase tracking-wide text-ivory/70">{project.industry}</p>
            <p className="mt-2 font-display text-2xl font-semibold text-ivory">{project.title}</p>
            <p className="mt-3 line-clamp-3 text-sm text-ivory/80">{project.challenge}</p>
            <div className="mt-4 flex flex-wrap gap-2">
              {project.services.map((s) => (
                <span key={s} className="rounded-full border border-ivory/30 px-3 py-1 text-xs text-ivory/80">
                  {s}
                </span>
              ))}
            </div>
            <p className="mt-5 inline-flex items-center gap-1.5 text-xs font-medium uppercase tracking-wide text-ivory transition-transform duration-300 group-hover:translate-x-1">
              View case study <span aria-hidden="true">&rarr;</span>
            </p>
          </div>
        </Link>
      </motion.div>
    </div>
  );
}
