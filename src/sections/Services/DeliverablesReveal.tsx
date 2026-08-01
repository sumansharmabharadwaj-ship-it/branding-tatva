"use client";

import { motion, useReducedMotion } from "framer-motion";
import { Container } from "@/components/Container";
import { Reveal } from "@/components/Reveal";
import { packages } from "@/data/services";

// Direct feedback, twice escalated: the original flat checklist read as
// a SaaS features list; the three-white-cards version that replaced it
// still read as "pricing cards on a light background" — equal columns,
// isolated floating cards, the exact conventional comparison layout the
// Creative Director brief banned. The light branch is now a dossier:
// three overlapping strategy sheets spread asymmetrically across the
// viewport, each a numbered file with a tab, a margin annotation, and
// its checklist writing itself in — opening a confidential brand
// strategy document rather than comparing packages. Every item still
// traces to real services.ts data; prices deliberately stay out of
// this chapter (they live in PackageSelector above), which is half of
// what made it read as pricing cards.
//
// The dark variant (unused on Services today) keeps the earlier card
// rendering for any future dark-ground caller rather than being
// deleted.

// Margin annotations — the "handwritten note in the file" device. Short
// noun phrases inside the copy standard (no "not", no dashes, no banned
// vocabulary), one per real package.
const ANNOTATIONS: Record<string, string> = {
  "brand-beginning": "the ground everything stands on",
  "brand-clarity": "one system, every channel",
  "brand-partnership": "recognition, month after month",
};

// Each sheet's resting pose in the spread — alternating rotation and
// horizontal offset so the three documents overlap like papers laid on
// a desk, never three equal columns. Offsets/overlaps only exist at
// lg:; mobile stacks the sheets full width.
const POSES = [
  { rotate: -1.3, className: "lg:w-[62%]" },
  { rotate: 1.1, className: "lg:-mt-20 lg:ml-auto lg:w-[62%]" },
  { rotate: -0.9, className: "lg:-mt-16 lg:ml-[6%] lg:w-[62%]" },
];

export function DeliverablesReveal({ light = false }: { light?: boolean }) {
  const prefersReducedMotion = useReducedMotion();

  if (!light) {
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
          {packages.map((pkg, pi) => {
            const items = pkg.includes.filter((item) => !item.startsWith("Everything in"));
            return (
              <motion.div
                key={pkg.slug}
                initial={prefersReducedMotion ? undefined : { opacity: 0, y: 30 }}
                whileInView={prefersReducedMotion ? undefined : { opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "0px 0px -12% 0px" }}
                transition={{ duration: 0.55, delay: pi * 0.12, ease: [0.16, 1, 0.3, 1] }}
                className="h-full"
              >
                <div className="h-full rounded-xl border-t-2 bg-ivory/[0.03] p-6" style={{ borderColor: pkg.color }}>
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
              </motion.div>
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
          <p className="text-sm font-medium uppercase tracking-wide text-action-secondary">What you receive</p>
          <h2 className="mt-2 text-display-sm font-display font-normal text-soil sm:text-display-md">
            What you actually leave with.
          </h2>
          <p className="mt-4 max-w-xl text-base text-foreground-secondary">
            Every item below is pulled directly from the three packages above. Nothing generic, nothing invented.
          </p>
        </Reveal>
        {/* Contents page for the dossier — the same numbered hairline
            index device the hero and Stakes already use, so the file
            reads as part of one editorial system. */}
        <Reveal delay={0.12} className="hidden lg:block">
          <p className="text-xs font-medium uppercase tracking-[0.15em] text-soil/50">Inside this file</p>
          <ol className="mt-3">
            {packages.map((pkg, i) => (
              <li key={pkg.slug} className="flex items-baseline gap-3 border-b border-soil/15 py-2">
                <span className="font-display text-sm text-soil/40">{String(i + 1).padStart(2, "0")}</span>
                <span className="text-sm text-soil/80">{pkg.name}</span>
              </li>
            ))}
          </ol>
        </Reveal>
      </div>

      {/* The spread — three sheets overlapping down the page, each
          sliding out from beneath the one before it as the visitor
          scrolls, settling with its own slight rotation. Hover picks a
          sheet up: it lifts, straightens a little, and its under page
          separates. */}
      <div className="relative mt-14 lg:mt-20">
        {packages.map((pkg, pi) => {
          const items = pkg.includes.filter((item) => !item.startsWith("Everything in"));
          const pose = POSES[pi] ?? POSES[0];
          return (
            <motion.article
              key={pkg.slug}
              initial={
                prefersReducedMotion ? undefined : { opacity: 0, y: 70, rotate: pose.rotate + 2.5 }
              }
              whileInView={prefersReducedMotion ? undefined : { opacity: 1, y: 0, rotate: pose.rotate }}
              viewport={{ once: true, margin: "0px 0px -14% 0px" }}
              transition={{ duration: 0.7, delay: 0.08, ease: [0.16, 1, 0.3, 1] }}
              whileHover={prefersReducedMotion ? undefined : { y: -8, rotate: pose.rotate * 0.35 }}
              className={`group relative mt-8 first:mt-0 lg:mt-0 ${pose.className}`}
              style={{ zIndex: pi + 10 }}
            >
              {/* The page beneath this sheet in the stack. */}
              <div
                aria-hidden="true"
                className={`absolute inset-0 rounded-sm bg-[#F3EDE2] shadow-[0_2px_10px_rgba(39,34,30,0.07)] transition-transform duration-500 ease-out ${
                  pi % 2 === 0
                    ? "rotate-[1.4deg] group-hover:translate-y-2 group-hover:rotate-[2.6deg]"
                    : "-rotate-[1.2deg] group-hover:translate-y-2 group-hover:-rotate-[2.4deg]"
                }`}
              />
              {/* File tab. */}
              <div className="relative inline-flex translate-y-px items-center gap-2 rounded-t-md border border-b-0 border-soil/15 bg-[#F6F1E7] px-4 py-1.5">
                <span aria-hidden="true" className="h-1.5 w-1.5 rounded-full" style={{ backgroundColor: pkg.color }} />
                <span className="text-[0.65rem] font-medium uppercase tracking-[0.2em] text-soil/70">
                  File {String(pi + 1).padStart(2, "0")}
                </span>
              </div>
              {/* The sheet itself. */}
              <div className="relative rounded-b-md rounded-tr-md border border-soil/15 bg-[#FBF8F2] p-7 shadow-[0_3px_20px_rgba(39,34,30,0.1)] transition-shadow duration-300 group-hover:shadow-[0_18px_44px_rgba(39,34,30,0.18)] sm:p-9">
                <div
                  aria-hidden="true"
                  className="absolute inset-x-0 top-0 h-[2px] rounded-t-sm"
                  style={{ backgroundColor: pkg.color }}
                />
                <div className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1">
                  <h3 className="font-display text-2xl font-normal text-soil">{pkg.name}</h3>
                  {/* Margin annotation — a note written in the file. */}
                  <span className="-rotate-1 font-display text-base italic text-action-secondary/90">
                    {ANNOTATIONS[pkg.slug]}
                  </span>
                </div>
                {/* The rule draws itself across the page. */}
                <motion.div
                  className="mt-4 h-px bg-soil/10"
                  aria-hidden="true"
                  style={{ originX: 0 }}
                  initial={prefersReducedMotion ? undefined : { scaleX: 0 }}
                  whileInView={prefersReducedMotion ? undefined : { scaleX: 1 }}
                  viewport={{ once: true, margin: "0px 0px -10% 0px" }}
                  transition={{ duration: 0.9, delay: 0.25, ease: [0.16, 1, 0.3, 1] }}
                />
                {/* Checklist writes itself in, two columns on wide
                    sheets so the document reads as a spread rather
                    than a narrow list. */}
                <ul className="mt-5 gap-x-10 space-y-3 sm:columns-2 sm:[&>li]:break-inside-avoid">
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
