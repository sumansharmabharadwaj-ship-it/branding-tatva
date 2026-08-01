"use client";

import { motion, useReducedMotion } from "framer-motion";
import { Container } from "@/components/Container";
import { Reveal } from "@/components/Reveal";
import { packages } from "@/data/services";

// Direct feedback that the original flat 14-item two-column checklist
// read as a plain SaaS features list, no hierarchy, no sense of which
// deliverable belonged to which real commitment. Regrouped by the same
// three real packages PackageSelector shows above, one card per
// package, each showing only what that tier actually *adds* (Full
// Brand System's own "Everything in Foundation" cross-reference line
// is a summary, not a 15th deliverable, so it's filtered here same as
// before) — a reader can now see the real cumulative shape of the
// offer instead of one undifferentiated block of checkmarks. Each
// card's own package color anchors it, the same visual language
// PackageSelector already uses, so this reads as a continuation of the
// choice above rather than a disconnected list.

// `light` — Phase 1's editorial-light chapter break: this section moved
// off dark video onto the site's parchment ground, and the cards read
// as what the deliverables actually are — printed documents. Real paper
// surfaces (near-white fill, a hairline rule under the package name, a
// soft shadow lifting each sheet off the parchment), dark confident
// type. The dark variant is kept intact for any future dark-ground
// caller rather than deleted.
export function DeliverablesReveal({ light = false }: { light?: boolean }) {
  const prefersReducedMotion = useReducedMotion();
  return (
    <Container className="max-w-5xl">
      <Reveal>
        <p className={`text-sm font-medium uppercase tracking-wide ${light ? "text-action-secondary" : "text-sandstone"}`}>
          What you receive
        </p>
        <h2 className={`mt-2 text-display-sm font-display font-normal sm:text-display-md ${light ? "text-soil" : "text-ivory"}`}>
          What you actually leave with.
        </h2>
        <p className={`mt-4 max-w-xl text-base ${light ? "text-foreground-secondary" : "text-ivory/85"}`}>
          Every item below is pulled directly from the three packages above. Nothing generic, nothing invented.
        </p>
      </Reveal>
      <div className="mt-12 grid gap-6 sm:grid-cols-3">
        {packages.map((pkg, pi) => {
          const items = pkg.includes.filter((item) => !item.startsWith("Everything in"));
          return (
            // Phase 2 motion direction — "documents laid on the desk":
            // each sheet settles into place with a slight rotation
            // correcting itself (scroll), and lifts toward the reader
            // on hover with its shadow deepening — picking the page up.
            // This is the only section with a rotation in its motion
            // language, matching the only paper-object metaphor.
            <motion.div
              key={pkg.slug}
              initial={prefersReducedMotion ? undefined : { opacity: 0, y: 30, rotate: pi % 2 === 0 ? -1.4 : 1.1 }}
              whileInView={prefersReducedMotion ? undefined : { opacity: 1, y: 0, rotate: 0 }}
              viewport={{ once: true, margin: "0px 0px -12% 0px" }}
              transition={{ duration: 0.55, delay: pi * 0.12, ease: [0.16, 1, 0.3, 1] }}
              whileHover={light && !prefersReducedMotion ? { y: -6 } : undefined}
              className="h-full"
            >
              <div
                className={
                  light
                    ? "h-full rounded-lg border-t-2 bg-[#FBF8F2] p-7 shadow-[0_2px_16px_rgba(39,34,30,0.08)] transition-shadow duration-300 hover:shadow-[0_14px_32px_rgba(39,34,30,0.16)]"
                    : "h-full rounded-xl border-t-2 bg-ivory/[0.03] p-6"
                }
                style={{ borderColor: pkg.color }}
              >
                {/* Document header — each sheet reads as a numbered
                    file, not a generic card: index numeral in the
                    package's own color, name, hairline rule. */}
                <div className="flex items-baseline justify-between">
                  <p className={`text-xs font-medium uppercase tracking-[0.15em] ${light ? "text-soil/60" : "text-ivory/60"}`}>
                    {pkg.name}
                  </p>
                  {light && (
                    <span className="font-display text-xl font-normal leading-none opacity-45" style={{ color: pkg.color }}>
                      {String(pi + 1).padStart(2, "0")}
                    </span>
                  )}
                </div>
                {light && <div className="mt-3 h-px bg-soil/10" aria-hidden="true" />}
                {/* Items write themselves onto the page line by line —
                    the visible animation this chapter was missing once
                    the sheets had settled. */}
                <ul className="mt-4 space-y-3">
                  {items.map((item, ii) => (
                    <motion.li
                      key={item}
                      initial={light && !prefersReducedMotion ? { opacity: 0, x: -10 } : undefined}
                      whileInView={light && !prefersReducedMotion ? { opacity: 1, x: 0 } : undefined}
                      viewport={{ once: true, margin: "0px 0px -8% 0px" }}
                      transition={{ duration: 0.4, delay: 0.25 + pi * 0.12 + ii * 0.08 }}
                      className={`flex items-start gap-2.5 ${light ? "text-[0.95rem] text-soil/85" : "text-sm text-ivory/85"}`}
                    >
                      <span aria-hidden="true" className="mt-0.5 shrink-0" style={{ color: pkg.color }}>
                        &#10003;
                      </span>
                      {item}
                    </motion.li>
                  ))}
                </ul>
              </div>
            </motion.div>
          );
        })}
      </div>
    </Container>
  );
}
