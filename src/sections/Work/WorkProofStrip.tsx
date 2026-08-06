"use client";

import { motion, useReducedMotion } from "framer-motion";
import type { Project } from "@/data/projects";
import { WORK } from "@/sections/Work/palette";

const CAPABILITY_EVIDENCE = [
  "Brand foundation",
  "Positioning",
  "Messaging",
  "Customer journey",
  "Content systems",
  "Recognition",
];

export function WorkProofStrip({ projects }: { projects: Project[] }) {
  const prefersReducedMotion = useReducedMotion();
  const items = [`${projects.length} engagements on record`, ...CAPABILITY_EVIDENCE, "Founder-led direction"];

  return (
    <section
      aria-label="Work evidence summary"
      className="border-y"
      style={{ backgroundColor: WORK.forest, borderColor: "rgba(143,174,131,0.24)" }}
    >
      <div className="flex items-stretch">
        <div
          className="hidden shrink-0 items-center border-r px-6 text-[0.62rem] font-medium uppercase tracking-[0.2em] sm:flex lg:px-10"
          style={{ borderColor: "rgba(143,174,131,0.24)", color: WORK.sand }}
        >
          Evidence line
        </div>

        <div className="min-w-0 flex-1 overflow-hidden py-4 sm:py-5">
          <p className="sr-only">{items.join(". ")}.</p>

          {prefersReducedMotion ? (
            <ul className="flex flex-wrap justify-center gap-x-6 gap-y-2 px-5" aria-hidden="true">
              {items.map((item) => (
                <li key={item} className="text-xs uppercase tracking-[0.14em] text-white/80">
                  {item}
                </li>
              ))}
            </ul>
          ) : (
            <motion.div
              aria-hidden="true"
              className="flex w-max items-center"
              animate={{ x: ["0%", "-50%"] }}
              transition={{ duration: 24, ease: "linear", repeat: Infinity }}
            >
              {[...items, ...items].map((item, index) => (
                <span key={`${item}-${index}`} className="flex shrink-0 items-center text-xs uppercase tracking-[0.15em] text-white/82">
                  <span className="px-5 sm:px-7">{item}</span>
                  <span className="h-1 w-1 rounded-full" style={{ backgroundColor: WORK.sand }} />
                </span>
              ))}
            </motion.div>
          )}
        </div>
      </div>
    </section>
  );
}
