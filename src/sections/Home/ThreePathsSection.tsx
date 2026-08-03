"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import {
  AnimatePresence,
  motion,
  useMotionValueEvent,
  useReducedMotion,
  useScroll,
  useTransform,
} from "framer-motion";
import { SITUATION_KEY } from "@/sections/Home/VisitorRecognition";
import { track } from "@/lib/analytics";

const PATHS = [
  {
    n: "01",
    title: "Build the foundation",
    body: "For a business still carrying several possible identities and no governing decision.",
    start: "Possibility",
    finish: "A clear position",
    href: "/services#desire",
    tint: "#8B6045",
    atmosphere: "rgba(139,96,69,.34)",
    route: ["Question", "Position", "Build", "Launch"],
    outcome: "A brand people can understand before they are asked to buy.",
  },
  {
    n: "02",
    title: "Reposition the whole system",
    body: "For an existing brand whose offer, identity and communication no longer point in one direction.",
    start: "Drift",
    finish: "Coherence",
    href: "/services#situation",
    tint: "#6C7D5A",
    atmosphere: "rgba(108,125,90,.34)",
    route: ["Decode", "Refuse", "Align", "Signal"],
    outcome: "Recognition begins compounding instead of restarting on every channel.",
  },
  {
    n: "03",
    title: "Keep the brand coherent in motion",
    body: "For a sound brand that needs ongoing content, judgement and consistency across changing channels.",
    start: "Momentum",
    finish: "Memory",
    href: "/services#offerings",
    tint: "#B28B4D",
    atmosphere: "rgba(178,139,77,.34)",
    route: ["Plan", "Create", "Learn", "Compound"],
    outcome: "Every new piece strengthens the same meaning instead of adding another personality.",
  },
] as const;

const SITUATION_TO_PATH: Record<string, number> = {
  idea: 0,
  inconsistent: 1,
  outgrown: 1,
};

const SITUATION_COPY: Record<string, string> = {
  idea: "You said the business keeps changing direction before anything settles.",
  inconsistent: "You said people see the brand, but every version feels different.",
  outgrown: "You said the business has grown while the brand still looks behind.",
};

export function ThreePathsSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const prefersReducedMotion = useReducedMotion();
  const [recommendedPath, setRecommendedPath] = useState(1);
  const [situation, setSituation] = useState<string | null>(null);
  const [activePath, setActivePath] = useState(0);
  const [manualPath, setManualPath] = useState(false);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end end"],
  });

  const horizonY = useTransform(scrollYProgress, [0, 1], ["64%", "35%"]);
  const fieldScale = useTransform(scrollYProgress, [0, 1], [1.04, 1.18]);
  const fieldRotate = useTransform(scrollYProgress, [0, 1], [-2, 2]);
  const routeX = useTransform(scrollYProgress, [0, 1], ["-18%", "18%"]);
  const wordSpacing = useTransform(scrollYProgress, [0, 1], ["0em", "0.08em"]);

  useEffect(() => {
    try {
      const saved = window.localStorage.getItem(SITUATION_KEY);
      if (!saved) return;
      setSituation(saved);
      const recommendation = SITUATION_TO_PATH[saved] ?? 1;
      setRecommendedPath(recommendation);
      setActivePath(recommendation);
    } catch {}
  }, []);

  useMotionValueEvent(scrollYProgress, "change", (value) => {
    if (prefersReducedMotion || manualPath) return;
    const index = Math.min(PATHS.length - 1, Math.floor(value * PATHS.length));
    setActivePath(index);
  });

  const active = PATHS[activePath];
  const isRecommended = activePath === recommendedPath;

  function choosePath(index: number) {
    setManualPath(true);
    setActivePath(index);
    track("service_path_opened", {
      path: PATHS[index].title,
      recommended: index === recommendedPath,
      page: "home",
    });
  }

  return (
    <section ref={sectionRef} className="relative h-[330svh] bg-[#ECE7DC] text-soil">
      <div className="sticky top-0 h-svh min-h-[680px] overflow-hidden">
        <motion.div
          aria-hidden="true"
          className="absolute inset-[-8%]"
          style={prefersReducedMotion ? undefined : { scale: fieldScale, rotate: fieldRotate }}
        >
          <div
            className="absolute inset-0 transition-colors duration-1000"
            style={{
              background: `radial-gradient(circle at 50% 42%, ${active.atmosphere}, transparent 30%), linear-gradient(180deg, #f4f0e7 0%, #e7ded0 56%, #cfc1ad 100%)`,
            }}
          />
          <motion.div
            className="absolute inset-x-[-12%] h-[48%] rounded-[50%] border border-soil/8 bg-white/18 blur-[1px]"
            style={{ top: horizonY }}
          />
          <motion.div
            className="absolute left-1/2 top-1/2 h-[86vw] w-[86vw] max-h-[70rem] max-w-[70rem] -translate-x-1/2 -translate-y-1/2 rounded-full border border-soil/10"
            animate={prefersReducedMotion ? undefined : { rotate: 360 }}
            transition={{ duration: 42, repeat: Infinity, ease: "linear" }}
          />
          <motion.div
            className="absolute left-1/2 top-1/2 h-[58vw] w-[58vw] max-h-[48rem] max-w-[48rem] -translate-x-1/2 -translate-y-1/2 rounded-full border border-soil/8"
            animate={prefersReducedMotion ? undefined : { rotate: -360 }}
            transition={{ duration: 34, repeat: Infinity, ease: "linear" }}
          />
        </motion.div>

        <div className="absolute inset-x-0 top-0 z-10 flex items-center justify-between px-6 pt-7 text-[0.62rem] font-medium uppercase tracking-[0.24em] text-soil/48 sm:px-10 lg:px-14">
          <span>Three ways into the work</span>
          <span>{String(activePath + 1).padStart(2, "0")} / 03</span>
        </div>

        <div className="relative z-10 flex h-full flex-col justify-between px-6 pb-8 pt-20 sm:px-10 sm:pb-10 lg:px-14">
          <div className="grid gap-8 lg:grid-cols-[0.8fr_1.2fr] lg:items-start">
            <div>
              <p className="max-w-sm text-sm leading-relaxed text-soil/58">
                {situation
                  ? SITUATION_COPY[situation]
                  : "Most businesses do not need more output first. They need to know which problem the output is meant to solve."}
              </p>
              <p className="mt-5 text-[0.62rem] font-medium uppercase tracking-[0.2em]" style={{ color: active.tint }}>
                {isRecommended ? "The route your earlier answer points toward" : "Another possible beginning"}
              </p>
            </div>

            <div className="lg:justify-self-end lg:text-right">
              <p className="font-display text-[clamp(2.9rem,7vw,7.6rem)] font-normal leading-[0.84] tracking-[-0.055em]">
                The right scope
                <br />
                begins where
                <br />
                the signal breaks.
              </p>
            </div>
          </div>

          <div className="relative flex flex-1 items-center justify-center py-8">
            <motion.div
              aria-hidden="true"
              className="absolute inset-x-[-8%] top-1/2 h-px bg-gradient-to-r from-transparent via-soil/28 to-transparent"
              style={{ x: routeX }}
            />

            <AnimatePresence mode="wait">
              <motion.div
                key={active.n}
                initial={prefersReducedMotion ? undefined : { opacity: 0, y: 70, filter: "blur(16px)" }}
                animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                exit={prefersReducedMotion ? undefined : { opacity: 0, y: -48, filter: "blur(12px)" }}
                transition={{ duration: prefersReducedMotion ? 0 : 0.72, ease: [0.22, 1, 0.36, 1] }}
                className="relative w-full max-w-6xl text-center"
              >
                <p className="text-[0.62rem] font-medium uppercase tracking-[0.28em]" style={{ color: active.tint }}>
                  {active.start} becomes {active.finish}
                </p>

                <motion.h3
                  className="mx-auto mt-5 max-w-5xl font-display text-[clamp(3.2rem,8vw,8.5rem)] font-normal leading-[0.88] tracking-[-0.055em]"
                  style={prefersReducedMotion ? undefined : { letterSpacing: wordSpacing }}
                >
                  {active.title.split(" ").map((word, index) => (
                    <motion.span
                      key={`${active.n}-${word}-${index}`}
                      className="mr-[0.18em] inline-block"
                      initial={prefersReducedMotion ? undefined : { opacity: 0, y: 36, rotateX: -24 }}
                      animate={{ opacity: 1, y: 0, rotateX: 0 }}
                      transition={{ delay: prefersReducedMotion ? 0 : index * 0.045, duration: 0.6 }}
                    >
                      {word}
                    </motion.span>
                  ))}
                </motion.h3>

                <p className="mx-auto mt-7 max-w-2xl text-sm leading-relaxed text-soil/62 sm:text-base">
                  {active.body}
                </p>

                <div className="mx-auto mt-8 flex max-w-3xl flex-wrap items-center justify-center gap-x-4 gap-y-3">
                  {active.route.map((step, index) => (
                    <motion.div
                      key={step}
                      className="flex items-center gap-4"
                      initial={prefersReducedMotion ? undefined : { opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: prefersReducedMotion ? 0 : 0.22 + index * 0.12 }}
                    >
                      <span className="relative flex h-10 w-10 items-center justify-center rounded-full border border-soil/14 bg-white/28 text-[0.62rem] uppercase tracking-[0.12em]">
                        {String(index + 1).padStart(2, "0")}
                        {!prefersReducedMotion && (
                          <motion.span
                            className="absolute inset-[-5px] rounded-full border"
                            style={{ borderColor: `${active.tint}55` }}
                            animate={{ scale: [0.9, 1.18, 0.9], opacity: [0.12, 0.55, 0.12] }}
                            transition={{ duration: 3.2, repeat: Infinity, delay: index * 0.35 }}
                          />
                        )}
                      </span>
                      <span className="text-xs font-medium uppercase tracking-[0.18em] text-soil/52">{step}</span>
                      {index < active.route.length - 1 && <span aria-hidden="true" className="text-soil/24">→</span>}
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          <div className="grid gap-6 border-t border-soil/12 pt-6 lg:grid-cols-[1fr_auto] lg:items-end">
            <div>
              <p className="text-[0.62rem] uppercase tracking-[0.2em] text-soil/38">What this route changes</p>
              <p className="mt-3 max-w-3xl font-display text-[clamp(1.8rem,3.3vw,3.5rem)] leading-[1.02]">
                {active.outcome}
              </p>
            </div>

            <Link
              href={active.href}
              onClick={() => choosePath(activePath)}
              className="group inline-flex min-h-12 items-center justify-center gap-3 rounded-full border border-soil/18 bg-white/30 px-6 text-xs font-medium uppercase tracking-[0.17em] transition-all duration-300 hover:-translate-y-0.5 hover:bg-white/60"
            >
              Enter this route
              <span className="transition-transform duration-300 group-hover:translate-x-1" aria-hidden="true">→</span>
            </Link>
          </div>
        </div>

        <div className="absolute bottom-8 left-6 z-20 hidden flex-col gap-2 sm:flex lg:left-14" role="tablist" aria-label="Choose a service route">
          {PATHS.map((path, index) => {
            const selected = index === activePath;
            return (
              <button
                key={path.n}
                type="button"
                role="tab"
                aria-selected={selected}
                onClick={() => choosePath(index)}
                className="group flex items-center gap-3 text-left"
              >
                <span
                  className="h-px transition-all duration-500"
                  style={{ width: selected ? 56 : 20, backgroundColor: selected ? path.tint : "rgba(39,34,30,.22)" }}
                />
                <span className={`text-[0.58rem] uppercase tracking-[0.16em] transition-colors ${selected ? "text-soil" : "text-soil/34 group-hover:text-soil/60"}`}>
                  {path.n} {path.start}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </section>
  );
}
