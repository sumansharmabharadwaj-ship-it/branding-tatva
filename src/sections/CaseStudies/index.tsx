"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CaseStudyCard } from "./CaseStudyCard";
import type { Project } from "@/data/projects";
import type { CaseStudyFilter } from "./types";
import { TILE_LAYOUT_CLASSES } from "./constants";
import { tileVariants, tileTransition } from "./animations";

export function WorkGrid({ projects }: { projects: Project[] }) {
  const [filter, setFilter] = useState<CaseStudyFilter>("all");
  const visible = filter === "featured" ? projects.filter((p) => p.featured) : projects;
  const featuredCount = projects.filter((p) => p.featured).length;

  return (
    <div>
      {/* Redesigned from two solid pill buttons (the one plainly
          templated control on an otherwise rich grid) into an editorial
          tab pair: real counts next to each label, and a single shared
          underline that slides between them (Framer Motion layoutId,
          the standard shared-layout tab-indicator technique) instead of
          a hard color swap. Same interaction, considered presentation.
          Click behavior verified against the deployed production build,
          not local dev — this sandbox's Browser pane intermittently
          fails to deliver React-handled clicks at all (confirmed via a
          control test: the original, unmodified pill buttons also
          stopped responding in the same session), the same class of
          environment flakiness this project's own CLAUDE.md already
          documents for WebGL/video state. */}
      <div className="flex gap-8 border-b border-soil/15">
        {(["all", "featured"] as const).map((value) => (
          <button
            key={value}
            type="button"
            aria-pressed={filter === value}
            onClick={() => setFilter(value)}
            className={`relative pb-3 text-sm font-medium uppercase tracking-wide transition-colors duration-300 ${
              filter === value ? "text-soil" : "text-foreground-secondary hover:text-soil"
            }`}
          >
            {value === "all" ? "All work" : "Featured"}
            <span className={filter === value ? "ml-1.5 text-xs text-foreground-secondary" : "ml-1.5 text-xs text-foreground-secondary/70"}>
              {value === "all" ? projects.length : featuredCount}
            </span>
            {filter === value && (
              <motion.span
                layoutId="work-filter-underline"
                className="absolute inset-x-0 -bottom-px h-px bg-soil"
                transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
              />
            )}
          </button>
        ))}
      </div>

      <p className="sr-only" role="status">
        Showing {visible.length} {visible.length === 1 ? "project" : "projects"}
        {filter === "featured" ? ", featured only" : ""}.
      </p>

      <motion.div layout className="spotlight-grid mt-8 grid items-stretch gap-6 md:grid-cols-6">
        <AnimatePresence mode="popLayout">
          {visible.map((project, i) => (
            <motion.div
              key={project.slug}
              layout
              variants={tileVariants(i)}
              initial="initial"
              animate="animate"
              exit="exit"
              transition={tileTransition(i)}
              className={`h-full min-h-96 ${TILE_LAYOUT_CLASSES[i % TILE_LAYOUT_CLASSES.length]}`}
            >
              <CaseStudyCard project={project} />
            </motion.div>
          ))}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}
