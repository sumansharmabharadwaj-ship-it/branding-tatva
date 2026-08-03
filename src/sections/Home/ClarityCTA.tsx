"use client";

import { useRef } from "react";
import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";
import { BackgroundVideo } from "@/components/BackgroundVideo";

const LENSES = [
  {
    label: "Psychology",
    question: "What did attention choose before logic arrived?",
    consequence: "Recognition begins where instinct already leans.",
    accent: "#C6A97A",
    x: "-11vw",
    rotate: -3,
  },
  {
    label: "Literature",
    question: "Which words survive after the explanation disappears?",
    consequence: "Language gives strategy a shape memory can keep.",
    accent: "#B87458",
    x: "9vw",
    rotate: 2,
  },
  {
    label: "Strategy",
    question: "Which decision must every later decision remember?",
    consequence: "Coherence turns separate moments into one market position.",
    accent: "#9AA184",
    x: "0vw",
    rotate: 0,
  },
] as const;

function LensBeat({
  index,
  progress,
  reduced,
}: {
  index: number;
  progress: ReturnType<typeof useScroll>["scrollYProgress"];
  reduced: boolean | null;
}) {
  const lens = LENSES[index];
  const start = index * 0.22 + 0.08;
  const peak = start + 0.12;
  const end = start + 0.28;
  const opacity = useTransform(progress, [start, peak, end], [0, 1, 0]);
  const y = useTransform(progress, [start, peak, end], [70, 0, -55]);
  const scale = useTransform(progress, [start, peak, end], [0.94, 1, 1.04]);
  const questionX = useTransform(progress, [start, peak], [index % 2 === 0 ? -80 : 80, 0]);

  return (
    <motion.div
      className="absolute inset-0 flex items-center px-6 sm:px-12 lg:px-20"
      style={reduced ? undefined : { opacity, y, scale }}
      aria-hidden={index !== 0 ? undefined : false}
    >
      <div className={`w-full ${index === 1 ? "text-right" : index === 2 ? "mx-auto text-center" : "text-left"}`}>
        <p className="text-[0.62rem] font-medium uppercase tracking-[0.32em]" style={{ color: lens.accent }}>
          Lens {String(index + 1).padStart(2, "0")} · {lens.label}
        </p>
        <motion.h2
          className={`mt-6 font-display text-[clamp(2.8rem,7vw,7rem)] font-normal leading-[0.92] tracking-[-0.045em] text-ivory ${index === 2 ? "mx-auto max-w-5xl" : "max-w-4xl"} ${index === 1 ? "ml-auto" : ""}`}
          style={reduced ? undefined : { x: questionX }}
        >
          {lens.question}
        </motion.h2>
        <p className={`mt-7 max-w-xl text-sm leading-relaxed text-ivory/62 sm:text-base ${index === 1 ? "ml-auto" : index === 2 ? "mx-auto" : ""}`}>
          {lens.consequence}
        </p>
      </div>
    </motion.div>
  );
}

export function ClarityCTA() {
  const ref = useRef<HTMLElement>(null);
  const reduced = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end end"] });

  const videoScale = useTransform(scrollYProgress, [0, 1], [1.08, 1.24]);
  const videoX = useTransform(scrollYProgress, [0, 0.35, 0.7, 1], ["0%", "-4%", "5%", "0%"]);
  const brightness = useTransform(scrollYProgress, [0, 0.32, 0.67, 1], [0.5, 0.68, 0.56, 0.34]);
  const videoFilter = useTransform(brightness, (value) => `brightness(${value}) saturate(0.9)`);
  const aperture = useTransform(scrollYProgress, [0.76, 1], ["inset(0% 0% 0% 0% round 0rem)", "inset(8% 12% 8% 12% round 2.5rem)"]);
  const finalOpacity = useTransform(scrollYProgress, [0.78, 0.9], [0, 1]);
  const finalY = useTransform(scrollYProgress, [0.78, 0.92], [50, 0]);

  return (
    <section ref={ref} aria-label="The thinking behind the evidence" className="relative h-[300svh] bg-soil">
      <div className="sticky top-0 h-svh overflow-hidden">
        <motion.div
          className="absolute inset-0"
          style={reduced ? undefined : { scale: videoScale, x: videoX, filter: videoFilter, clipPath: aperture }}
        >
          <BackgroundVideo
            video="/videos/higgsfield-idea-sketch.mp4"
            poster="/images/higgsfield-idea-sketch.jpg"
            imagePosition="center 55%"
          />
        </motion.div>

        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_45%,rgba(20,17,14,0.08),rgba(20,17,14,0.88)_78%)]" />
        <div className="absolute inset-0 bg-gradient-to-b from-black/28 via-transparent to-black/72" />

        <div className="absolute left-6 top-7 z-20 sm:left-12 sm:top-10 lg:left-20">
          <p className="text-[0.6rem] font-medium uppercase tracking-[0.3em] text-sandstone/76">Behind the evidence</p>
          <p className="mt-2 max-w-xs font-display text-lg leading-tight text-ivory/72 sm:text-xl">
            The result is visible. The judgement that produced it is quieter.
          </p>
        </div>

        <div className="relative z-10 h-full">
          {LENSES.map((_, index) => (
            <LensBeat key={index} index={index} progress={scrollYProgress} reduced={reduced} />
          ))}

          <motion.div
            className="absolute inset-0 flex items-center justify-center px-6 text-center"
            style={reduced ? undefined : { opacity: finalOpacity, y: finalY }}
          >
            <div className="max-w-5xl">
              <p className="text-[0.62rem] font-medium uppercase tracking-[0.32em] text-sandstone">The author enters</p>
              <p className="mt-6 font-display text-[clamp(3.2rem,8vw,8rem)] font-normal leading-[0.86] tracking-[-0.055em] text-ivory">
                Observe widely.
                <span className="block italic text-clay">Decide narrowly.</span>
              </p>
              <p className="mx-auto mt-7 max-w-xl text-sm leading-relaxed text-ivory/62 sm:text-base">
                Psychology reads behaviour. Literature distils meaning. Strategy makes every expression remember the same decision.
              </p>
            </div>
          </motion.div>
        </div>

        <div className="absolute bottom-7 left-6 right-6 z-20 flex items-center gap-5 sm:left-12 sm:right-12 lg:left-20 lg:right-20">
          <span className="text-[0.58rem] uppercase tracking-[0.24em] text-ivory/35">Evidence</span>
          <div className="h-px flex-1 bg-ivory/12">
            <motion.div className="h-full origin-left bg-sandstone" style={{ scaleX: scrollYProgress }} />
          </div>
          <span className="text-[0.58rem] uppercase tracking-[0.24em] text-ivory/35">Author</span>
        </div>
      </div>
    </section>
  );
}
