"use client";

import { motion, useReducedMotion } from "framer-motion";
import { Container } from "@/components/Container";
import { Reveal } from "@/components/Reveal";
import { ElementGlyph } from "@/components/ElementGlyph";
import { packages } from "@/data/services";

// Strategy files, final form. The scroll-scrubbed discovery sequence
// (folder cover sliding away inside a 280vh sticky frame) was retired
// on direct screenshot evidence: on real wide displays it produced
// long near-empty viewports mid-scrub, a lingering cover fragment at
// the frame edge, and unresolved sheet overlaps mid-flight — glitches,
// not cinema. The chapter returns to the approved photographed desk:
// three overlapping files entering with a rotation settle, checklists
// writing themselves in, glyphs embossing, margin annotations arriving
// after the heading. TiltCard's cursor glow was also removed on the
// same feedback (its radial read as a stray card shadow on hover) —
// hover is now a clean lift with the under page separating. One
// composition, every width, no sticky, no sequence to glitch.

const ANNOTATIONS: Record<string, string> = {
  "brand-beginning": "the ground everything stands on",
  "brand-clarity": "one system, every channel",
  "brand-partnership": "recognition, month after month",
};

const GLYPHS: Record<string, "earth" | "water" | "space"> = {
  "brand-beginning": "earth",
  "brand-clarity": "water",
  "brand-partnership": "space",
};

const POSES = [
  { rotate: -1.3, className: "lg:w-[62%]" },
  { rotate: 1.1, className: "lg:-mt-16 lg:ml-auto lg:w-[62%]" },
  { rotate: -0.9, className: "lg:-mt-12 lg:ml-[6%] lg:w-[62%]" },
];

export function DeliverablesReveal({ room = false }: { room?: boolean }) {
  const prefersReducedMotion = useReducedMotion();

  if (!room) {
    return (
      <Container className="max-w-5xl">
        <Reveal>
          <p className="text-sm font-medium uppercase tracking-wide text-sandstone">What you receive</p>
          <h2 className="mt-2 text-display-sm font-display font-normal text-ivory sm:text-display-md">
            What you actually leave with.
          </h2>
          <p className="mt-4 max-w-xl text-base text-ivory/85">
            Every item below is pulled directly from the three packages above. Nothing generic, nothing invented.
          </p>
        </Reveal>
        <div className="mt-12 grid gap-6 sm:grid-cols-3">
          {packages.map((pkg) => {
            const items = pkg.includes.filter((item) => !item.startsWith("Everything in"));
            return (
              <div key={pkg.slug} className="h-full rounded-xl border-t-2 bg-ivory/[0.03] p-6" style={{ borderColor: pkg.color }}>
                <p className="text-xs font-medium uppercase tracking-[0.15em] text-ivory/60">{pkg.name}</p>
                <ul className="mt-4 space-y-3">
                  {items.map((item) => (
                    <li key={item} className="flex items-start gap-2.5 text-sm text-ivory/85">
                      <span aria-hidden="true" className="mt-0.5 shrink-0" style={{ color: pkg.color }}>
                        &#10003;
                      </span>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            );
          })}
        </div>
      </Container>
    );
  }

  return (
    <Container className="max-w-6xl">
      <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,15rem)] lg:items-end lg:gap-16">
        <Reveal>
          <p className="text-sm font-medium uppercase tracking-wide text-sandstone">What you receive</p>
          <h2 className="mt-2 text-display-sm font-display font-normal text-ivory sm:text-display-md">
            What you actually leave with.
          </h2>
          <p className="mt-4 max-w-xl text-base text-ivory/85">
            Every item below is pulled directly from the three packages above. Nothing generic, nothing invented.
          </p>
        </Reveal>
        <Reveal delay={0.12} className="hidden lg:block">
          <p className="text-xs font-medium uppercase tracking-[0.15em] text-ivory/50">Inside this file</p>
          <ol className="mt-3">
            {packages.map((pkg, i) => (
              <li key={pkg.slug} className="flex items-baseline gap-3 border-b border-ivory/15 py-2">
                <span className="font-display text-sm text-ivory/40">{String(i + 1).padStart(2, "0")}</span>
                <span className="text-sm text-ivory/80">{pkg.name}</span>
              </li>
            ))}
          </ol>
        </Reveal>
      </div>

      <div className="relative mt-14 lg:mt-16">
        {packages.map((pkg, pi) => {
          const items = pkg.includes.filter((item) => !item.startsWith("Everything in"));
          const pose = POSES[pi] ?? POSES[0];
          return (
            <motion.article
              key={pkg.slug}
              initial={prefersReducedMotion ? undefined : { opacity: 0, y: 60, rotate: pose.rotate + 2.5 }}
              whileInView={prefersReducedMotion ? undefined : { opacity: 1, y: 0, rotate: pose.rotate }}
              viewport={{ once: true, margin: "0px 0px -12% 0px" }}
              transition={{ duration: 0.7, delay: 0.08, ease: [0.16, 1, 0.3, 1] }}
              whileHover={prefersReducedMotion ? undefined : { y: -6, rotate: pose.rotate * 0.4 }}
              className={`group relative mt-10 first:mt-0 lg:mt-0 ${pose.className}`}
              style={{ zIndex: pi + 10 }}
            >
              {/* The page beneath this sheet — separates when the
                  document is picked up. */}
              <div
                aria-hidden="true"
                className={`absolute inset-0 rounded-sm bg-[#EFE6D6] shadow-[0_4px_18px_rgba(0,0,0,0.3)] transition-transform duration-500 ease-out ${
                  pi % 2 === 0
                    ? "rotate-[1.4deg] group-hover:translate-y-2 group-hover:rotate-[2.6deg]"
                    : "-rotate-[1.2deg] group-hover:translate-y-2 group-hover:-rotate-[2.4deg]"
                }`}
              />
              <div className="relative inline-flex translate-y-px items-center gap-2 rounded-t-md border border-b-0 border-soil/20 bg-[#EFE6D6] px-4 py-1.5">
                <span aria-hidden="true" className="h-1.5 w-1.5 rounded-full" style={{ backgroundColor: pkg.color }} />
                <span className="text-[0.65rem] font-medium uppercase tracking-[0.2em] text-soil/70">
                  File {String(pi + 1).padStart(2, "0")}
                </span>
              </div>
              <div className="relative overflow-hidden rounded-b-md rounded-tr-md bg-[#F6EFE2] p-7 shadow-[0_10px_36px_rgba(0,0,0,0.4)] sm:p-9">
                <div aria-hidden="true" className="absolute inset-x-0 top-0 h-[2px]" style={{ backgroundColor: pkg.color }} />
                <motion.div
                  aria-hidden="true"
                  className="pointer-events-none absolute -bottom-8 -right-6"
                  initial={prefersReducedMotion ? { opacity: 0.09 } : { opacity: 0, scale: 1.18, rotate: -2 }}
                  whileInView={prefersReducedMotion ? undefined : { opacity: 0.09, scale: 1, rotate: -6 }}
                  viewport={{ once: true, margin: "0px 0px -8% 0px" }}
                  transition={{ duration: 0.9, delay: 0.5, ease: [0.16, 1, 0.3, 1] }}
                >
                  <ElementGlyph slug={GLYPHS[pkg.slug]} className="h-36 w-36" style={{ color: pkg.color }} />
                </motion.div>
                <div className="relative flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1">
                  <h3 className="font-display text-2xl font-normal text-soil sm:text-3xl">{pkg.name}</h3>
                  <motion.span
                    className="-rotate-1 font-display text-base italic text-action-secondary"
                    initial={prefersReducedMotion ? undefined : { opacity: 0, y: 4, filter: "blur(3px)" }}
                    whileInView={prefersReducedMotion ? undefined : { opacity: 1, y: 0, filter: "blur(0px)" }}
                    viewport={{ once: true, margin: "0px 0px -8% 0px" }}
                    transition={{ duration: 0.7, delay: 0.45, ease: [0.16, 1, 0.3, 1] }}
                  >
                    {ANNOTATIONS[pkg.slug]}
                  </motion.span>
                </div>
                <motion.div
                  className="relative mt-4 h-px bg-soil/15"
                  aria-hidden="true"
                  style={{ originX: 0 }}
                  initial={prefersReducedMotion ? undefined : { scaleX: 0 }}
                  whileInView={prefersReducedMotion ? undefined : { scaleX: 1 }}
                  viewport={{ once: true, margin: "0px 0px -8% 0px" }}
                  transition={{ duration: 0.9, delay: 0.25, ease: [0.16, 1, 0.3, 1] }}
                />
                <ul className="relative mt-5 gap-x-10 space-y-3 sm:columns-2 sm:[&>li]:break-inside-avoid">
                  {items.map((item, ii) => (
                    <motion.li
                      key={item}
                      initial={prefersReducedMotion ? undefined : { opacity: 0, x: -10 }}
                      whileInView={prefersReducedMotion ? undefined : { opacity: 1, x: 0 }}
                      viewport={{ once: true, margin: "0px 0px -8% 0px" }}
                      transition={{ duration: 0.4, delay: 0.3 + ii * 0.09 }}
                      className="flex items-start gap-2.5 text-[0.95rem] text-soil/85"
                    >
                      <span aria-hidden="true" className="mt-0.5 shrink-0" style={{ color: pkg.color }}>
                        &#10003;
                      </span>
                      {item}
                    </motion.li>
                  ))}
                </ul>
              </div>
            </motion.article>
          );
        })}
      </div>
    </Container>
  );
}
