"use client";

import { motion, useReducedMotion } from "framer-motion";
import { Container } from "@/components/Container";
import { Reveal } from "@/components/Reveal";
import { TiltCard } from "@/components/TiltCard";
import { ElementGlyph } from "@/components/ElementGlyph";
import { packages } from "@/data/services";

// Art directed from scratch three times on escalating direct feedback:
// flat checklist → three white cards → parchment dossier → and now THE
// STRATEGY ROOM. The final verdict on every light version was the same:
// a pale chapter reads as a SaaS pricing block no matter how the paper
// is dressed, because the chapter itself detaches from the cinematic
// journey around it. So the chapter goes dark: a warm charcoal-bronze
// study (MOOD.study) where the cream documents themselves are the
// light source — sheets spread asymmetrically across a dark desk under
// drifting lamp light, each embossed with its package's own element
// glyph, held and tilted by the cursor like physical paper. The
// documents keep everything the dossier established (file tabs,
// numbered files, margin annotations in script, self-drawing rules,
// checklists that write themselves in, the under-page that separates
// on hover) — now staged instead of stranded. Every item still traces
// to real services.ts data; prices stay in PackageSelector.

// Margin annotations — the "note written in the file" device. Short
// noun phrases inside the copy standard.
const ANNOTATIONS: Record<string, string> = {
  "brand-beginning": "the ground everything stands on",
  "brand-clarity": "one system, every channel",
  "brand-partnership": "recognition, month after month",
};

// Each package's documented element mapping (see data/services.ts color
// comments and PackageSelector's CHOICES) — reused here as the embossed
// glyph on each sheet rather than inventing new iconography.
const GLYPHS: Record<string, "earth" | "water" | "space"> = {
  "brand-beginning": "earth",
  "brand-clarity": "water",
  "brand-partnership": "space",
};

// Resting pose per sheet — alternating rotation and offset so the
// documents overlap like papers on a desk, never equal columns.
// Offsets/overlaps exist only at lg:; mobile stacks full width.
const POSES = [
  { rotate: -1.3, className: "lg:w-[64%]" },
  { rotate: 1.1, className: "lg:-mt-20 lg:ml-auto lg:w-[64%]" },
  { rotate: -0.9, className: "lg:-mt-16 lg:ml-[5%] lg:w-[64%]" },
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
          <p className="text-sm font-medium uppercase tracking-wide text-sandstone">What you receive</p>
          <h2 className="mt-2 text-display-sm font-display font-normal text-ivory sm:text-display-md">
            What you actually leave with.
          </h2>
          <p className="mt-4 max-w-xl text-base text-ivory/85">
            Every item below is pulled directly from the three packages above. Nothing generic, nothing invented.
          </p>
        </Reveal>
        {/* Contents page — the same numbered hairline index the hero and
            Stakes already use. */}
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

      {/* The desk — sheets overlap down the page, sliding out from
          beneath one another on scroll, each held by the cursor
          (TiltCard: real 3D tilt + a glow in the package's own color,
          the site's proven physical-object interaction). */}
      <div className="relative mt-14 lg:mt-20">
        {packages.map((pkg, pi) => {
          const items = pkg.includes.filter((item) => !item.startsWith("Everything in"));
          const pose = POSES[pi] ?? POSES[0];
          return (
            <motion.article
              key={pkg.slug}
              initial={prefersReducedMotion ? undefined : { opacity: 0, y: 70, rotate: pose.rotate + 2.5 }}
              whileInView={prefersReducedMotion ? undefined : { opacity: 1, y: 0, rotate: pose.rotate }}
              viewport={{ once: true, margin: "0px 0px -14% 0px" }}
              transition={{ duration: 0.7, delay: 0.08, ease: [0.16, 1, 0.3, 1] }}
              className={`group relative mt-10 first:mt-0 lg:mt-0 ${pose.className}`}
              style={{ zIndex: pi + 10 }}
            >
              <TiltCard glowColor={pkg.color}>
                {/* The page beneath this sheet in the stack — separates
                    when the document is picked up. */}
                <div
                  aria-hidden="true"
                  className={`absolute inset-0 rounded-sm bg-[#EFE6D6] shadow-[0_4px_18px_rgba(0,0,0,0.35)] transition-transform duration-500 ease-out ${
                    pi % 2 === 0
                      ? "rotate-[1.4deg] group-hover:translate-y-2.5 group-hover:rotate-[2.8deg]"
                      : "-rotate-[1.2deg] group-hover:translate-y-2.5 group-hover:-rotate-[2.6deg]"
                  }`}
                />
                {/* File tab. */}
                <div className="relative inline-flex translate-y-px items-center gap-2 rounded-t-md border border-b-0 border-soil/20 bg-[#EFE6D6] px-4 py-1.5">
                  <span aria-hidden="true" className="h-1.5 w-1.5 rounded-full" style={{ backgroundColor: pkg.color }} />
                  <span className="text-[0.65rem] font-medium uppercase tracking-[0.2em] text-soil/70">
                    File {String(pi + 1).padStart(2, "0")}
                  </span>
                </div>
                {/* The sheet — cream paper glowing against the dark
                    study, deep warm shadow lifting it off the desk. */}
                <div className="relative overflow-hidden rounded-b-md rounded-tr-md bg-[#F6EFE2] p-7 shadow-[0_10px_40px_rgba(0,0,0,0.45)] transition-shadow duration-300 group-hover:shadow-[0_26px_64px_rgba(0,0,0,0.6)] sm:p-9">
                  <div
                    aria-hidden="true"
                    className="absolute inset-x-0 top-0 h-[2px]"
                    style={{ backgroundColor: pkg.color }}
                  />
                  {/* Embossed element glyph — each package's documented
                      element pressed into its own paper like a maker's
                      mark. */}
                  <ElementGlyph
                    slug={GLYPHS[pkg.slug]}
                    className="pointer-events-none absolute -bottom-8 -right-6 h-40 w-40 -rotate-6"
                    style={{ color: pkg.color, opacity: 0.09 }}
                  />
                  <div className="relative flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1">
                    <h3 className="font-display text-2xl font-normal text-soil sm:text-3xl">{pkg.name}</h3>
                    <span className="-rotate-1 font-display text-base italic text-action-secondary">
                      {ANNOTATIONS[pkg.slug]}
                    </span>
                  </div>
                  {/* The rule draws itself across the page. */}
                  <motion.div
                    className="relative mt-4 h-px bg-soil/15"
                    aria-hidden="true"
                    style={{ originX: 0 }}
                    initial={prefersReducedMotion ? undefined : { scaleX: 0 }}
                    whileInView={prefersReducedMotion ? undefined : { scaleX: 1 }}
                    viewport={{ once: true, margin: "0px 0px -10% 0px" }}
                    transition={{ duration: 0.9, delay: 0.25, ease: [0.16, 1, 0.3, 1] }}
                  />
                  {/* Checklist writes itself in, two columns on wide
                      sheets so the document reads as a spread. */}
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
              </TiltCard>
            </motion.article>
          );
        })}
      </div>
    </Container>
  );
}
