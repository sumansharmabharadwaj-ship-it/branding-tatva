"use client";

import { useHydratedReducedMotion } from "@/hooks/useHydratedReducedMotion";
import { useRef, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { CinematicCardMedia } from "@/components/CinematicCardMedia";
import { useTilt } from "@/hooks/useTilt";
import { EASE_AIR } from "@/lib/motion";
import type { Project } from "@/data/projects";
import { CARD_MEDIA_GRADIENT, CARD_TILT_MAX_DEGREES } from "./constants";

export function CaseStudyCard({ project }: { project: Project }) {
  const [isHovered, setIsHovered] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const prefersReducedMotion = useHydratedReducedMotion();
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
          className="spotlight-card relative flex h-full flex-col justify-end overflow-hidden rounded-2xl p-6 shadow-elevation-sm"
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
          {/* A real metric on hover, not decoration — the grid otherwise
              only ever shows challenge/services text, never the actual
              result. Only renders where project.stats has real,
              verified numbers (data/projects.ts's own rule); cards
              without stats yet just don't get this, rather than
              inventing a number to fill the space. */}
          {project.stats?.[0] && (
            <motion.div
              aria-hidden="true"
              className="pointer-events-none absolute left-6 top-6 rounded-2xl px-3 py-2"
              style={{ backgroundColor: `${project.accent}E6` }}
              initial={prefersReducedMotion ? undefined : { opacity: 0, y: -8 }}
              animate={
                prefersReducedMotion
                  ? undefined
                  : isHovered
                    ? { opacity: 1, y: 0 }
                    : { opacity: 0, y: -8 }
              }
              transition={{ duration: 0.35, ease: EASE_AIR }}
            >
              <p className="font-display text-2xl font-normal leading-none text-ivory">{project.stats[0].value}</p>
              <p className="mt-1 max-w-[9rem] text-[0.65rem] uppercase leading-tight tracking-wide text-ivory/85">
                {project.stats[0].label}
              </p>
            </motion.div>
          )}
          <div className="relative border-t-2 pt-4" style={{ borderTopColor: project.accent }}>
            <p className="text-xs font-medium uppercase tracking-wide text-ivory/70">{project.industry}</p>
            <p className="mt-2 font-display text-2xl font-normal text-ivory">{project.title}</p>
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
