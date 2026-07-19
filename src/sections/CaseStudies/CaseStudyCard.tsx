"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import { KenBurnsImage } from "@/components/KenBurnsImage";
import { useTilt } from "@/hooks/useTilt";
import type { Project } from "@/data/projects";
import { CARD_MEDIA_GRADIENT, CARD_TILT_MAX_DEGREES } from "./constants";

// Cards with a cardVideo cross-fade from the static KenBurnsImage into an
// ambient clip that actually plays on hover — closer to the "Netflix
// hover autoplay" feel than a still image alone. Play/pause is driven by
// JS (video.play()/.pause()), since a video sitting at opacity: 0 still
// needs to be explicitly started; CSS alone can't do that.
//
// Hover state is owned by the outer Link (CaseStudyCard, below), not by
// this component — a first version attached onMouseEnter directly here,
// which silently never fired whenever the pointer was over the text-
// content block instead: that block is a sibling of this element, not a
// descendant, so the event never reached this listener at all. Lifting
// the handler to their shared Link ancestor (matching how the existing
// group-hover CSS already behaves — hovering anywhere in the card
// triggers it) fixes that for real, not just for the pixels this
// component happens to occupy.
function CardMedia({ project, isHovered }: { project: Project; isHovered: boolean }) {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    if (isHovered) {
      video.play().catch(() => {});
    } else {
      video.pause();
      video.currentTime = 0;
    }
  }, [isHovered]);

  return (
    <div className="absolute inset-0">
      {project.cardImage && (
        <div className="absolute inset-0 transition-transform duration-700 ease-out group-hover:scale-110">
          <KenBurnsImage
            image={project.cardImage}
            gradient={CARD_MEDIA_GRADIENT}
            sizes="(min-width: 768px) 50vw, 100vw"
          />
        </div>
      )}
      {project.cardVideo && (
        <video
          ref={videoRef}
          className="absolute inset-0 h-full w-full object-cover transition-opacity duration-500"
          style={{ opacity: isHovered ? 1 : 0 }}
          src={project.cardVideo}
          muted
          loop
          playsInline
          preload="none"
        />
      )}
      {project.cardVideo && (
        <div
          className="absolute inset-0 transition-opacity duration-500"
          style={{ opacity: isHovered ? 1 : 0, backgroundImage: CARD_MEDIA_GRADIENT }}
        />
      )}
    </div>
  );
}

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
        transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
        className="relative h-full"
      >
        <Link
          href={`/work/${project.slug}`}
          data-cursor-label="View case study"
          className="relative flex h-full flex-col justify-end overflow-hidden rounded-lg p-6 shadow-elevation-sm"
        >
          <CardMedia project={project} isHovered={isHovered} />
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
