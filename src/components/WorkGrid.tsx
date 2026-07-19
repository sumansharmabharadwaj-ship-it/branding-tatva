"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { KenBurnsImage } from "./KenBurnsImage";
import type { Project } from "@/data/projects";

// Cards with a cardVideo cross-fade from the static KenBurnsImage into an
// ambient clip that actually plays on hover — closer to the "Netflix
// hover autoplay" feel than a still image alone. Play/pause is driven by
// JS (video.play()/.pause()), since a video sitting at opacity: 0 still
// needs to be explicitly started; CSS alone can't do that.
//
// Hover state is owned by the outer Link (WorkCard, below), not by this
// component — a first version attached onMouseEnter directly here, which
// silently never fired whenever the pointer was over the text-content
// block instead: that block is a sibling of this element, not a
// descendant, so the event never reached this listener at all. Lifting
// the handler to their shared Link ancestor (matching how the existing
// group-hover CSS already behaves — hovering anywhere in the card
// triggers it) fixes that for real, not just for the pixels this
// component happens to occupy.
function WorkCardMedia({ project, isHovered }: { project: Project; isHovered: boolean }) {
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
            gradient="linear-gradient(0deg, rgba(39,34,30,0.9) 0%, rgba(39,34,30,0.45) 55%, rgba(39,34,30,0.15) 100%)"
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
          style={{
            opacity: isHovered ? 1 : 0,
            backgroundImage:
              "linear-gradient(0deg, rgba(39,34,30,0.9) 0%, rgba(39,34,30,0.45) 55%, rgba(39,34,30,0.15) 100%)",
          }}
        />
      )}
    </div>
  );
}

function WorkCard({ project }: { project: Project }) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div
      className="group relative h-full transition-all duration-300 hover:-translate-y-1 hover:shadow-elevation-md"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <Link
        href={`/work/${project.slug}`}
        data-cursor-label="View case study"
        className="relative flex h-full flex-col justify-end overflow-hidden rounded-lg p-6 shadow-elevation-sm"
      >
        <WorkCardMedia project={project} isHovered={isHovered} />
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
    </div>
  );
}

// A real filter, not decoration: "Featured" and "All work" are the one
// grouping in the data that actually splits unevenly (3 of 5 vs all 5).
// Industry doesn't work as a filter here — every project already has a
// distinct industry, so filtering by it would just isolate one card at
// a time instead of narrowing a real set.

type Filter = "featured" | "all";

// A 5-tile repeating pattern (large+tall pair, then a 3/3 pair, then one
// full-width close) so the grid reads as a considered mosaic rather than
// uniform cards, whichever filter is active — 3 featured or all 5.
const tileClass = [
  "md:col-span-4 md:min-h-120",
  "md:col-span-2 md:min-h-120",
  "md:col-span-3 md:min-h-80",
  "md:col-span-3 md:min-h-80",
  "md:col-span-6 md:min-h-96",
];

export function WorkGrid({ projects }: { projects: Project[] }) {
  const [filter, setFilter] = useState<Filter>("all");
  const visible = filter === "featured" ? projects.filter((p) => p.featured) : projects;

  return (
    <div>
      <div className="flex gap-2">
        {(["all", "featured"] as const).map((value) => (
          <button
            key={value}
            type="button"
            onClick={() => setFilter(value)}
            className={`rounded-full border px-4 py-1.5 text-xs font-medium uppercase tracking-wide transition-colors duration-300 ${
              filter === value
                ? "border-action-primary bg-action-primary text-white"
                : "border-border text-foreground-secondary hover:border-action-primary/40"
            }`}
          >
            {value === "all" ? "All work" : "Featured"}
          </button>
        ))}
      </div>

      <motion.div layout className="mt-8 grid items-stretch gap-6 md:grid-cols-6">
        <AnimatePresence mode="popLayout">
          {visible.map((project, i) => (
            <motion.div
              key={project.slug}
              layout
              initial={{ opacity: 0, scale: 0.97 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.97 }}
              transition={{ duration: 0.35, delay: (i % 4) * 0.05, ease: [0.16, 1, 0.3, 1] }}
              className={`h-full min-h-96 ${tileClass[i % tileClass.length]}`}
            >
              <WorkCard project={project} />
            </motion.div>
          ))}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}
