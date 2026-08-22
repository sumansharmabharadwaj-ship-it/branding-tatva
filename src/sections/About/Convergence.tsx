"use client";

import Link from "next/link";
import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { Container } from "@/components/Container";
import { useHydratedReducedMotion } from "@/hooks/useHydratedReducedMotion";

const FIELDS = [
  {
    number: "01",
    name: "Psychology",
    degree: "M.A. Clinical Psychology",
    line: "Reads attention, tension and the way a choice is actually made.",
    color: "#a45f46",
  },
  {
    number: "02",
    name: "Literature",
    degree: "B.A. English Literature",
    line: "Gives the idea language people can understand, remember and repeat.",
    color: "#64775f",
  },
] as const;

function ResolvedMethod() {
  return (
    <div className="mx-auto max-w-2xl text-center">
      <p className="text-[0.62rem] font-semibold uppercase tracking-[0.2em] text-clay">Where the two meet</p>
      <p className="mt-3 font-display text-[clamp(2.7rem,6vw,5.4rem)] font-normal leading-[0.9] tracking-[-0.035em] text-soil">
        Brand strategy <em className="font-normal text-[#6a765d]">becomes usable.</em>
      </p>
      <p className="mx-auto mt-5 max-w-xl text-sm leading-relaxed text-soil/72 sm:text-base">
        Psychology finds the tension. Literature gives it language. Strategy turns both into a system a growing business can carry forward.
      </p>
      <Link
        href="/work/dr-haley-nutrition"
        className="mt-5 inline-flex items-center gap-2 text-sm font-medium text-clay underline decoration-clay/30 underline-offset-4 transition-colors hover:text-soil"
      >
        See the method in a documented decision <span aria-hidden="true">→</span>
      </Link>
    </div>
  );
}

export function Convergence() {
  const wrapRef = useRef<HTMLDivElement>(null);
  const prefersReducedMotion = Boolean(useHydratedReducedMotion());
  const { scrollYProgress } = useScroll({ target: wrapRef, offset: ["start start", "end end"] });

  const leftX = useTransform(scrollYProgress, [0.08, 0.48], ["-12vw", "0vw"]);
  const rightX = useTransform(scrollYProgress, [0.08, 0.48], ["12vw", "0vw"]);
  const fieldOpacity = useTransform(scrollYProgress, [0.46, 0.62], [1, 0.14]);
  const fieldY = useTransform(scrollYProgress, [0.46, 0.62], [0, -14]);
  const resolvedOpacity = useTransform(scrollYProgress, [0.5, 0.68], [0, 1]);
  const resolvedY = useTransform(scrollYProgress, [0.5, 0.68], [26, 0]);
  const ruleScale = useTransform(scrollYProgress, [0.12, 0.5], [0.18, 1]);

  if (prefersReducedMotion) {
    return (
      <div className="bg-[#eee7db] py-20 sm:py-28" data-about-scene="method">
        <Container className="max-w-6xl">
          <p className="text-center text-xs font-semibold uppercase tracking-[0.2em] text-clay">Two disciplines. One practice.</p>
          <div className="mt-10 grid gap-4 sm:grid-cols-2">
            {FIELDS.map((field) => (
              <article key={field.name} className="rounded-[1.6rem] border border-soil/10 bg-[#f8f3e9]/80 p-6 text-center shadow-[0_18px_60px_rgba(67,54,42,0.08)]">
                <p className="text-[0.62rem] font-semibold uppercase tracking-[0.18em]" style={{ color: field.color }}>{field.degree}</p>
                <h3 className="mt-3 font-display text-4xl font-normal text-soil">{field.name}</h3>
                <p className="mx-auto mt-3 max-w-sm text-sm leading-relaxed text-soil/68">{field.line}</p>
              </article>
            ))}
          </div>
          <div className="mt-12"><ResolvedMethod /></div>
        </Container>
      </div>
    );
  }

  return (
    <div ref={wrapRef} className="relative h-[165svh] bg-[#eee7db]" data-about-scene="method">
      <div className="sticky top-0 flex min-h-svh items-center overflow-hidden py-20">
        <div aria-hidden="true" className="absolute inset-0 bg-[radial-gradient(circle_at_50%_48%,rgba(196,142,103,0.13),transparent_34%),radial-gradient(circle_at_18%_78%,rgba(101,120,95,0.12),transparent_30%)]" />
        <Container className="relative w-full max-w-6xl text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-clay">Two disciplines. One practice.</p>
          <p className="mx-auto mt-3 max-w-xl text-sm leading-relaxed text-soil/60">
            Scroll once to see how Suman&apos;s training becomes one practical decision system.
          </p>

          <div className="relative mt-10 min-h-[25rem] sm:min-h-[28rem]">
            <motion.span
              aria-hidden="true"
              className="absolute left-1/2 top-[42%] h-px w-[min(72vw,46rem)] -translate-x-1/2 bg-gradient-to-r from-transparent via-clay/45 to-transparent"
              style={{ scaleX: ruleScale }}
            />

            <motion.div className="absolute inset-x-0 top-0 grid gap-4 sm:grid-cols-2 sm:gap-8" style={{ opacity: fieldOpacity, y: fieldY }}>
              {FIELDS.map((field, index) => (
                <motion.article
                  key={field.name}
                  style={{ x: index === 0 ? leftX : rightX }}
                  className="rounded-[1.6rem] border border-soil/10 bg-[#f8f3e9]/78 p-6 text-center shadow-[0_18px_60px_rgba(67,54,42,0.08)] backdrop-blur-sm sm:p-8"
                >
                  <p className="text-[0.62rem] font-semibold uppercase tracking-[0.18em]" style={{ color: field.color }}>
                    {field.number} · {field.degree}
                  </p>
                  <h3 className="mt-3 font-display text-[clamp(2.5rem,5vw,4.5rem)] font-normal leading-none text-soil">{field.name}</h3>
                  <p className="mx-auto mt-4 max-w-sm text-sm leading-relaxed text-soil/68">{field.line}</p>
                </motion.article>
              ))}
            </motion.div>

            <motion.div className="absolute inset-x-0 top-[8%] sm:top-[16%]" style={{ opacity: resolvedOpacity, y: resolvedY }}>
              <ResolvedMethod />
            </motion.div>
          </div>
        </Container>
      </div>
    </div>
  );
}
