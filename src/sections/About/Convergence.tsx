"use client";

import { useHydratedReducedMotion } from "@/hooks/useHydratedReducedMotion";
import { useRef } from "react";
import Link from "next/link";
import { motion, useScroll, useTransform } from "framer-motion";
import { Container } from "@/components/Container";

// About redesign, the interdisciplinary convergence — the brief's two
// field layout where Psychology and Language literally travel toward
// each other through measured scroll progress and meet as Brand
// Strategy. Pure typography and transforms: CSS sticky, useScroll on
// the wrapper, zero WebGL. Reduced motion renders the resolved state
// statically inside a normal height section.
const FIELDS = [
  {
    name: "Psychology",
    line: "How attention lands, how memory holds, how a choice actually gets made.",
  },
  {
    name: "Language",
    line: "How a sentence frames value, how a phrase sticks, how words carry a position.",
  },
] as const;

export function Convergence() {
  const wrapRef = useRef<HTMLDivElement>(null);
  const prefersReducedMotion = useHydratedReducedMotion();
  const { scrollYProgress } = useScroll({ target: wrapRef, offset: ["start end", "end start"] });

  // The two disciplines start apart and arrive at center; the merged
  // discipline surfaces once they meet.
  const leftX = useTransform(scrollYProgress, [0.15, 0.55], ["-18vw", "0vw"]);
  const rightX = useTransform(scrollYProgress, [0.15, 0.55], ["18vw", "0vw"]);
  const fieldOpacity = useTransform(scrollYProgress, [0.5, 0.62], [1, 0.25]);
  const mergedOpacity = useTransform(scrollYProgress, [0.52, 0.68], [0, 1]);
  const mergedY = useTransform(scrollYProgress, [0.52, 0.68], [16, 0]);

  if (prefersReducedMotion) {
    return (
      <Container className="max-w-5xl py-4 text-center">
        <p className="text-sm font-medium uppercase tracking-wide text-sandstone">Two fields, one discipline</p>
        <div className="mt-8 grid gap-8 sm:grid-cols-2">
          {FIELDS.map((f) => (
            <div key={f.name}>
              <p className="font-display text-3xl font-normal text-ivory">{f.name}</p>
              <p className="mt-2 text-sm leading-relaxed text-ivory/80">{f.line}</p>
            </div>
          ))}
        </div>
        <p className="mt-10 font-display text-4xl font-normal text-sandstone">Brand strategy</p>
        <p className="mx-auto mt-3 max-w-md text-sm leading-relaxed text-ivory/85">
          One discipline, practiced where the two overlap: what people notice, what they believe, and what they repeat.
        </p>
        {/* Reduced motion carries the complete content, including the
            real decision the diagram resolves into. */}
        <p className="mx-auto mt-5 max-w-md text-sm leading-relaxed text-ivory/70">
          In practice: posting less and saying it sharper took one client&apos;s engagement rate from 0.71% to 2.81%.
          Psychology chose the moments; language earned them.
        </p>
        <Link
          href="/work/dr-haley-nutrition"
          className="link-underline mt-2 inline-flex items-center gap-2 text-sm font-medium text-sandstone"
        >
          See that decision documented <span aria-hidden="true">→</span>
        </Link>
      </Container>
    );
  }

  return (
    <div ref={wrapRef} className="relative h-[220vh]">
      <div className="sticky top-0 flex h-screen items-center overflow-hidden">
        <Container className="w-full max-w-5xl text-center">
          <p className="text-sm font-medium uppercase tracking-wide text-sandstone">Two fields, one discipline</p>
          <div className="relative mt-10">
            <div className="flex flex-col items-center justify-center gap-6 sm:flex-row sm:gap-16">
              <motion.div style={{ x: leftX, opacity: fieldOpacity }} className="max-w-xs">
                <p className="font-display text-[clamp(2rem,4.5vw,3.4rem)] font-normal leading-none text-ivory">
                  {FIELDS[0].name}
                </p>
                <p className="mt-3 text-sm leading-relaxed text-ivory/80">{FIELDS[0].line}</p>
              </motion.div>
              <motion.div style={{ x: rightX, opacity: fieldOpacity }} className="max-w-xs">
                <p className="font-display text-[clamp(2rem,4.5vw,3.4rem)] font-normal leading-none text-ivory">
                  {FIELDS[1].name}
                </p>
                <p className="mt-3 text-sm leading-relaxed text-ivory/80">{FIELDS[1].line}</p>
              </motion.div>
            </div>
            <motion.div style={{ opacity: mergedOpacity, y: mergedY }} className="mt-12">
              <p className="font-display text-[clamp(2.4rem,5.5vw,4.2rem)] font-normal leading-none text-sandstone">
                Brand strategy
              </p>
              <p className="mx-auto mt-4 max-w-md text-base leading-relaxed text-ivory/90">
                One discipline, practiced where the two overlap: what people notice, what they believe, and what they
                repeat.
              </p>
              {/* Guide Vol I ch.6 / manual p81: the diagram resolves
                  into one REAL project decision, so the convergence
                  reads as practice rather than theory. The claim is
                  the recorded Dr. Haley outcome (projects.ts). */}
              <p className="mx-auto mt-6 max-w-md text-sm leading-relaxed text-ivory/70">
                In practice: posting less and saying it sharper took one client&apos;s engagement rate from 0.71% to
                2.81%. Psychology chose the moments; language earned them.
              </p>
              <Link
                href="/work/dr-haley-nutrition"
                className="link-underline mt-3 inline-flex items-center gap-2 text-sm font-medium text-sandstone transition-colors duration-300 hover:text-ivory"
              >
                See that decision documented <span aria-hidden="true">→</span>
              </Link>
            </motion.div>
          </div>
        </Container>
      </div>
    </div>
  );
}
