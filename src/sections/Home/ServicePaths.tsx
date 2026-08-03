"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { BackgroundVideo } from "@/components/BackgroundVideo";
import { Container } from "@/components/Container";
import { LinkButton } from "@/components/Button";
import { HOME_SITUATION_KEY } from "@/sections/Home/VisitorRecognition";

const PATHS = [
  {
    id: "foundation",
    number: "01",
    title: "Build the foundation",
    forWhom: "For a business still carrying several possible identities and no governing position.",
    decision: "Choose what the business should stand for before expression multiplies.",
    stages: ["Discover", "Position", "Design", "Launch"],
    outcome: "A clear brand system people can understand from the first encounter.",
    href: "/services",
    accent: "#C6A97A",
  },
  {
    id: "reposition",
    number: "02",
    title: "Reposition the whole system",
    forWhom: "For an existing brand whose offer, identity, and communication have drifted apart.",
    decision: "Define the present value, then align every visible and verbal signal around it.",
    stages: ["Audit", "Refocus", "Align", "Activate"],
    outcome: "Recognition begins compounding instead of restarting across every channel.",
    href: "/services",
    accent: "#8FAE83",
  },
  {
    id: "continuity",
    number: "03",
    title: "Keep the brand coherent in motion",
    forWhom: "For a sound brand that needs ongoing content, judgment, and continuity as the market moves.",
    decision: "Protect the same meaning while campaigns, channels, and business priorities change.",
    stages: ["Plan", "Create", "Review", "Compound"],
    outcome: "Every new piece strengthens the same position, voice, and memory.",
    href: "/services",
    accent: "#B85A34",
  },
] as const;

const SITUATION_TO_PATH: Record<string, number> = {
  idea: 0,
  inconsistent: 1,
  outgrown: 1,
};

export function ServicePaths() {
  const reduce = useReducedMotion();
  const [activeIndex, setActiveIndex] = useState(1);
  const [recommendedIndex, setRecommendedIndex] = useState(1);

  useEffect(() => {
    try {
      const saved = window.localStorage.getItem(HOME_SITUATION_KEY);
      if (!saved) return;
      const next = SITUATION_TO_PATH[saved] ?? 1;
      setActiveIndex(next);
      setRecommendedIndex(next);
    } catch {}
  }, []);

  const active = PATHS[activeIndex];

  return (
    <section className="relative isolate overflow-hidden bg-[#102019] py-24 text-ivory sm:py-32 lg:py-40">
      <BackgroundVideo
        video="/videos/pexels-misty-lake-dawn.mp4"
        videoWebm="/videos/pexels-misty-lake-dawn.webm"
        poster="/images/pexels-misty-lake-dawn-poster.jpg"
        imagePosition="50% 48%"
        parallax
      />
      <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(10,24,18,.78)_0%,rgba(10,24,18,.64)_42%,rgba(10,24,18,.9)_100%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_58%,rgba(198,169,122,.14),transparent_38%)]" />

      <Container className="relative max-w-[92rem]">
        <div className="grid gap-10 lg:grid-cols-[0.72fr_1.28fr] lg:items-end lg:gap-20">
          <div>
            <p className="text-[0.64rem] font-medium uppercase tracking-[0.3em] text-sandstone">Three ways into the work</p>
            <h2 className="mt-5 max-w-xl font-display text-[clamp(3rem,6vw,6.4rem)] font-normal leading-[0.9] tracking-[-0.045em] text-ivory">
              The right scope begins where recognition first breaks.
            </h2>
          </div>
          <p className="max-w-2xl text-sm leading-relaxed text-ivory/72 sm:text-base lg:justify-self-end">
            The earlier answer already points toward a likely beginning. You remain free to inspect every route, compare the decisions, and choose the one that fits the business now.
          </p>
        </div>

        <div className="mt-14 grid gap-4 lg:grid-cols-3" role="tablist" aria-label="Choose a service path">
          {PATHS.map((path, index) => {
            const selected = index === activeIndex;
            const recommended = index === recommendedIndex;
            return (
              <motion.button
                key={path.id}
                type="button"
                role="tab"
                aria-selected={selected}
                onClick={() => setActiveIndex(index)}
                className={`relative overflow-hidden rounded-[1.7rem] border p-6 text-left backdrop-blur-2xl transition-colors duration-500 sm:p-7 ${
                  selected ? "border-ivory/28 bg-soil/72" : "border-ivory/10 bg-soil/36 hover:border-ivory/22 hover:bg-soil/52"
                }`}
                animate={reduce ? undefined : { y: selected ? -6 : 0 }}
                transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
              >
                <motion.span
                  aria-hidden="true"
                  className="absolute inset-x-0 top-0 h-1 origin-left"
                  animate={{ backgroundColor: path.accent, scaleX: selected ? 1 : 0.12, opacity: selected ? 1 : 0.35 }}
                  transition={{ duration: 0.55 }}
                />
                <div className="flex items-center justify-between gap-4">
                  <span className="text-[0.6rem] uppercase tracking-[0.22em] text-ivory/38">{path.number}</span>
                  {recommended && (
                    <span className="rounded-full border border-ivory/12 px-3 py-1 text-[0.54rem] uppercase tracking-[0.16em]" style={{ color: path.accent }}>
                      Your earlier answer points here
                    </span>
                  )}
                </div>
                <span className="mt-5 block font-display text-[clamp(2rem,3.6vw,3.9rem)] leading-[0.98] tracking-[-0.035em] text-ivory">
                  {path.title}
                </span>
                <span className="mt-5 block text-sm leading-relaxed text-ivory/62">{path.forWhom}</span>
              </motion.button>
            );
          })}
        </div>

        <div className="relative mt-6 overflow-hidden rounded-[2rem] border border-ivory/14 bg-[#102019]/88 p-6 shadow-2xl backdrop-blur-2xl sm:p-8 lg:p-10">
          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              key={active.id}
              initial={reduce ? false : { opacity: 0, y: 22, filter: "blur(10px)" }}
              animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              exit={reduce ? undefined : { opacity: 0, y: -14, filter: "blur(7px)" }}
              transition={{ duration: reduce ? 0 : 0.65, ease: [0.22, 1, 0.36, 1] }}
            >
              <div className="grid gap-10 lg:grid-cols-[0.8fr_1.2fr] lg:items-center">
                <div>
                  <p className="text-[0.6rem] uppercase tracking-[0.24em] text-ivory/38">The governing decision</p>
                  <p className="mt-4 font-display text-[clamp(2.2rem,4vw,4.6rem)] leading-[0.96] tracking-[-0.035em] text-ivory">
                    {active.decision}
                  </p>
                  <p className="mt-6 text-sm leading-relaxed text-ivory/68 sm:text-base">{active.outcome}</p>
                  <div className="mt-8">
                    <LinkButton href={active.href}>Explore this service path</LinkButton>
                  </div>
                </div>

                <div className="relative min-h-[20rem] overflow-hidden rounded-[1.6rem] border border-ivory/10 bg-black/14 p-6 sm:p-8">
                  <svg viewBox="0 0 700 280" className="absolute inset-x-5 top-4 h-[16rem] w-[calc(100%-2.5rem)]" aria-hidden="true">
                    <path d="M58 218 C170 84 260 235 350 142 C440 48 520 190 642 58" fill="none" stroke="rgba(244,239,230,.14)" strokeWidth="2" strokeLinecap="round" />
                    <motion.path
                      d="M58 218 C170 84 260 235 350 142 C440 48 520 190 642 58"
                      fill="none"
                      stroke={active.accent}
                      strokeWidth="3"
                      strokeLinecap="round"
                      initial={false}
                      animate={{ pathLength: 1, opacity: 0.95 }}
                      transition={{ duration: reduce ? 0 : 1.1, ease: [0.22, 1, 0.36, 1] }}
                    />
                    {[{ x: 58, y: 218 }, { x: 246, y: 187 }, { x: 433, y: 101 }, { x: 642, y: 58 }].map((point, index) => (
                      <motion.circle
                        key={`${active.id}-${index}`}
                        cx={point.x}
                        cy={point.y}
                        r="9"
                        fill={active.accent}
                        initial={reduce ? false : { scale: 0, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ delay: reduce ? 0 : 0.18 + index * 0.12, duration: 0.45 }}
                      />
                    ))}
                  </svg>
                  <div className="relative z-10 grid grid-cols-2 gap-4 pt-52 sm:grid-cols-4 sm:pt-48">
                    {active.stages.map((stage, index) => (
                      <div key={stage}>
                        <span className="text-[0.56rem] uppercase tracking-[0.18em] text-ivory/34">0{index + 1}</span>
                        <p className="mt-2 font-display text-2xl text-ivory">{stage}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </Container>
    </section>
  );
}
