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
