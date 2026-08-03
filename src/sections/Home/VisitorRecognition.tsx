"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { BackgroundVideo } from "@/components/BackgroundVideo";
import { Container } from "@/components/Container";
import { LinkButton } from "@/components/Button";

const SITUATIONS = [
  {
    id: "idea",
    number: "01",
    stage: "Beginning with an idea",
    statement: "The business could become several things, and every direction still feels possible.",
    signal: "Possibility is high. The governing decision is still missing.",
    decision: "Define the position before identity, content, and launch begin making separate promises.",
    outcome: "A business people can understand before they are asked to buy.",
    service: "Brand Foundation",
    proof: { slug: "myshopineurope", title: "MyShopInEurope" },
    accent: "#C6A97A",
  },
  {
    id: "inconsistent",
    number: "02",
    stage: "Existing without one system",
    statement: "People see the brand, yet every channel seems to introduce a different personality.",
    signal: "Visibility exists. Recognition keeps restarting.",
    decision: "Align position, voice, identity, and experience around one meaning that can compound.",
    outcome: "Every new touchpoint begins strengthening the same memory.",
    service: "Full Brand System",
    proof: { slug: "executive-springboard", title: "Executive Springboard" },
    accent: "#8FAE83",
  },
  {
    id: "outgrown",
    number: "03",
    stage: "Growing beyond the current brand",
    statement: "The business has matured, while the brand still describes an earlier version of it.",
    signal: "The quality has moved forward. Perception has stayed behind.",
    decision: "Reposition the business, then rebuild the signals that carry its present value.",
    outcome: "The brand begins matching the standard the business already delivers.",
    service: "Strategic Repositioning",
    proof: { slug: "dr-haley-nutrition", title: "Dr. Haley Nutrition" },
    accent: "#B85A34",
  },
] as const;

export const HOME_SITUATION_KEY = "branding-tatva-home-situation";
type SituationId = (typeof SITUATIONS)[number]["id"];

export function VisitorRecognition() {
  const reduce = useReducedMotion();
  const [selected, setSelected] = useState<SituationId>(SITUATIONS[0].id);

  useEffect(() => {
    try {
      const saved = window.localStorage.getItem(HOME_SITUATION_KEY) as SituationId | null;
      if (saved && SITUATIONS.some((item) => item.id === saved)) setSelected(saved);
    } catch {}
  }, []);

  function choose(id: SituationId) {
    setSelected(id);
    try {
      window.localStorage.setItem(HOME_SITUATION_KEY, id);
    } catch {}
  }

  const active = SITUATIONS.find((item) => item.id === selected) ?? SITUATIONS[0];
  const activeIndex = SITUATIONS.findIndex((item) => item.id === active.id);

  return (
    <section className="relative isolate overflow-hidden bg-soil py-24 text-ivory sm:py-32 lg:py-40">
      <BackgroundVideo
        video="/videos/pexels-living-meadow.mp4"
        videoWebm="/videos/pexels-living-meadow.webm"
        poster="/images/pexels-living-meadow-poster.jpg"
        imagePosition="50% 48%"
        parallax
      />
      <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(20,29,21,.94)_0%,rgba(20,29,21,.78)_48%,rgba(20,29,21,.58)_100%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_74%_44%,rgba(198,169,122,.18),transparent_34%)]" />

      <Container className="relative max-w-[88rem]">
        <div className="grid gap-14 lg:grid-cols-[0.78fr_1.22fr] lg:items-start lg:gap-20">
          <div className="lg:sticky lg:top-28">
            <p className="text-[0.64rem] font-medium uppercase tracking-[0.3em] text-sandstone">
              The first recognition
            </p>
            <h2 className="mt-5 max-w-xl font-display text-[clamp(3rem,6vw,6.4rem)] font-normal leading-[0.9] tracking-[-0.045em] text-ivory">
              Which part of this story already feels like yours?
            </h2>
            <p className="mt-7 max-w-md text-sm leading-relaxed text-ivory/72 sm:text-base">
              People decide whether something is relevant before they study the details. Begin with the sentence that catches first.
            </p>
            <div className="mt-10 hidden items-center gap-4 text-[0.58rem] uppercase tracking-[0.22em] text-ivory/42 lg:flex">
              <span>Possibility</span>
              <span className="h-px flex-1 bg-gradient-to-r from-sandstone/70 to-transparent" />
              <span>Recognition</span>
            </div>
          </div>

          <div className="relative">
            <svg
              viewBox="0 0 760 430"
              className="pointer-events-none absolute inset-x-0 top-6 hidden h-[27rem] w-full lg:block"
              aria-hidden="true"
            >
              <path d="M372 410 C370 330 210 310 170 235 C130 160 170 98 150 28" fill="none" stroke="rgba(244,239,230,.14)" strokeWidth="1.4" />
              <path d="M372 410 C375 318 385 260 380 205 C375 145 392 90 380 26" fill="none" stroke="rgba(244,239,230,.14)" strokeWidth="1.4" />
              <path d="M372 410 C390 325 545 305 590 235 C630 170 590 100 610 28" fill="none" stroke="rgba(244,239,230,.14)" strokeWidth="1.4" />
              {[
                "M372 410 C370 330 210 310 170 235 C130 160 170 98 150 28",
                "M372 410 C375 318 385 260 380 205 C375 145 392 90 380 26",
                "M372 410 C390 325 545 305 590 235 C630 170 590 100 610 28",
              ].map((path, index) => (
                <motion.path
                  key={path}
                  d={path}
                  fill="none"
                  stroke={SITUATIONS[index].accent}
                  strokeLinecap="round"
                  strokeWidth="2.2"
                  initial={false}
                  animate={{
                    pathLength: activeIndex === index ? 1 : 0.08,
                    opacity: activeIndex === index ? 0.95 : 0.18,
                  }}
                  transition={{ duration: reduce ? 0 : 0.9, ease: [0.22, 1, 0.36, 1] }}
                />
              ))}
              <motion.circle
                cx="372"
                cy="410"
                r="7"
                animate={{ fill: active.accent, scale: reduce ? 1 : [0.9, 1.2, 0.9] }}
                transition={{ fill: { duration: 0.5 }, scale: { duration: 2.8, repeat: Infinity, ease: "easeInOut" } }}
              />
            </svg>

            <div className="relative z-10 space-y-4" role="list" aria-label="Choose the business situation that feels closest">
              {SITUATIONS.map((item, index) => {
                const isActive = item.id === active.id;
                return (
                  <motion.button
                    key={item.id}
                    type="button"
                    onClick={() => choose(item.id)}
                    aria-pressed={isActive}
                    className={`group relative w-full overflow-hidden rounded-[1.6rem] border px-6 py-6 text-left backdrop-blur-xl transition-colors duration-500 sm:px-8 sm:py-7 ${
                      isActive
                        ? "border-ivory/24 bg-soil/72"
                        : "border-ivory/10 bg-soil/38 hover:border-ivory/22 hover:bg-soil/52"
                    }`}
                    animate={reduce ? undefined : { x: isActive ? 0 : index % 2 === 0 ? 8 : -8 }}
                    transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
                  >
                    <motion.span
                      aria-hidden="true"
                      className="absolute inset-y-0 left-0 w-1 origin-bottom"
                      animate={{ backgroundColor: item.accent, scaleY: isActive ? 1 : 0.18, opacity: isActive ? 1 : 0.35 }}
                      transition={{ duration: 0.55 }}
                    />
                    <span className="flex items-start gap-5">
                      <span className="mt-1 text-[0.6rem] uppercase tracking-[0.22em] text-ivory/42">{item.number}</span>
                      <span>
                        <span className="block text-[0.62rem] font-medium uppercase tracking-[0.2em]" style={{ color: item.accent }}>
                          {item.stage}
                        </span>
                        <span className="mt-3 block font-display text-[clamp(1.65rem,3vw,3.2rem)] leading-[1.02] tracking-[-0.03em] text-ivory">
                          {item.statement}
                        </span>
                      </span>
                    </span>
                  </motion.button>
                );
              })}
            </div>

            <div className="relative z-20 mt-6 min-h-[23rem] rounded-[1.8rem] border border-ivory/14 bg-[#172019]/88 p-6 shadow-2xl backdrop-blur-2xl sm:p-8">
              <AnimatePresence mode="wait" initial={false}>
                <motion.div
                  key={active.id}
                  initial={reduce ? false : { opacity: 0, y: 20, filter: "blur(10px)" }}
                  animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                  exit={reduce ? undefined : { opacity: 0, y: -14, filter: "blur(7px)" }}
                  transition={{ duration: reduce ? 0 : 0.65, ease: [0.22, 1, 0.36, 1] }}
                >
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <p className="text-[0.6rem] uppercase tracking-[0.24em] text-ivory/42">What your answer suggests</p>
                    <span className="rounded-full border border-ivory/14 px-3 py-1 text-[0.58rem] uppercase tracking-[0.16em]" style={{ color: active.accent }}>
                      {active.service}
                    </span>
                  </div>
                  <p className="mt-6 font-display text-[clamp(2rem,4vw,4.4rem)] leading-[0.96] tracking-[-0.035em] text-ivory">
                    {active.signal}
                  </p>
                  <div className="mt-7 grid gap-6 border-t border-ivory/12 pt-6 md:grid-cols-2">
                    <div>
                      <p className="text-[0.58rem] uppercase tracking-[0.2em] text-ivory/38">The decision beneath it</p>
                      <p className="mt-3 text-sm leading-relaxed text-ivory/72 sm:text-base">{active.decision}</p>
                    </div>
                    <div>
                      <p className="text-[0.58rem] uppercase tracking-[0.2em] text-ivory/38">What becomes possible</p>
                      <p className="mt-3 text-sm leading-relaxed text-ivory/72 sm:text-base">{active.outcome}</p>
                    </div>
                  </div>
                  <div className="mt-8 flex flex-wrap items-center gap-4">
                    <LinkButton href="/services">Explore the right service path</LinkButton>
                    <Link href={`/work/${active.proof.slug}`} className="link-underline text-sm text-ivory/68 hover:text-ivory">
                      See how {active.proof.title} was approached
                    </Link>
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
