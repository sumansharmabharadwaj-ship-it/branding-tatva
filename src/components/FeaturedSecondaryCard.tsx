"use client";

import { useHydratedReducedMotion } from "@/hooks/useHydratedReducedMotion";
import { useRef, useState } from "react";
import { motion } from "framer-motion";
import { CinematicCardMedia } from "@/components/CinematicCardMedia";
import { useTilt } from "@/hooks/useTilt";
import type { Project } from "@/data/projects";

const GRADIENT = "linear-gradient(0deg, rgba(39,34,30,0.9) 0%, rgba(39,34,30,0.45) 55%, rgba(39,34,30,0.15) 100%)";

// The Home page's two secondary "Selected work" entries — smaller than
// FeaturedWorkHero, but still a real card, so it gets the same
// hover-driven playback-rate/brightness boost CaseStudyCard's media
// does, plus the same cursor-follow tilt CaseStudyCard/TiltCard already
// use (previously the only card type on Home with no tilt at all).
// Needs its own hover state (a plain group-hover CSS class can't drive
// video.playbackRate imperatively), which is why this is a small client
// component rather than inline markup in the Home server component.
export function FeaturedSecondaryCard({ project }: { project: Project }) {
  const [isHovered, setIsHovered] = useState(false);
  const ref = useRef<HTMLAnchorElement>(null);
  const prefersReducedMotion = useHydratedReducedMotion();
  const { rotateX, rotateY } = useTilt(ref, 5, Boolean(prefersReducedMotion));

  return (
    <a
      ref={ref}
      href={`/work/${project.slug}`}
      data-cursor-label="Read case study"
      className="group relative block h-full"
      style={{ perspective: 1000 }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <motion.div
        style={prefersReducedMotion ? undefined : { rotateX, rotateY }}
        className="relative flex h-full min-h-88 flex-col justify-end overflow-hidden rounded-2xl p-6 sm:p-8"
      >
        <CinematicCardMedia
          image={project.cardImage}
          video={project.cardVideo}
          gradient={GRADIENT}
          sizes="(min-width: 640px) 50vw, 100vw"
          isHovered={isHovered}
          accent={project.accent}
          imagePosition={project.cardImagePosition}
        />
        <div className="relative border-t-2 pt-4" style={{ borderColor: project.accent }}>
          <p className="text-xs font-medium uppercase tracking-wide text-ivory/70">{project.industry}</p>
          <p className="mt-2 font-display text-2xl font-normal text-ivory transition-colors group-hover:text-clay">
            {project.title}
          </p>
          <p className="mt-3 text-sm italic text-ivory/80">{project.hook ?? project.outcome}</p>
        </div>
      </motion.div>
    </a>
  );
}
