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
import { Container } from "@/components/Container";
import { track } from "@/lib/analytics";
import { useMediaQuery } from "@/hooks/useMediaQuery";

const STATES = [
  {
    id: "idea",
    number: "01",
    label: "We keep changing direction before anything settles",
    stage: "Building from an idea",
    symptom: "Too many possibilities. No governing decision yet.",
    need: "Positioning decided before anything gets designed, so every later choice inherits a direction.",
    path: "Foundation",
    pathNote: "Discovery, positioning, core identity, and the first usable brand system.",
    outcome: "A business people can understand before they are asked to buy.",
    proof: {
      slug: "myshopineurope",
      title: "MyShopInEurope",
      metric: "Position before platform",
      line: "The brand was built around craft and origin before the platform sold a thing, giving every later decision one centre of gravity.",
    },
  },
  {
    id: "inconsistent",
    number: "02",
    label: "People see us, but every version feels different",
    stage: "An existing brand without one system",
    symptom: "Every channel is active. None of them feel related.",
    need: "One system aligning what already exists, so every channel says the same thing without becoming repetitive.",
    path: "Full Brand System",
    pathNote: "Audit, repositioning, verbal identity, and alignment across every customer-facing surface.",
    outcome: "Recognition begins compounding instead of restarting on every channel.",
    proof: {
      slug: "herbalcart",
      title: "HerbalCart",
      metric: "One repositioning",
      line: "A complete campaign reset moved public perception from herbal supplement toward a modern wellness brand.",
    },
  },
  {
    id: "outgrown",
    number: "03",
    label: "The business has grown, but the brand still looks behind",
    stage: "A mature offer inside an earlier identity",
    symptom: "The offer has matured. The brand still describes an earlier version.",
    need: "A position that matches what the business has become, then an identity and content system capable of carrying it.",
    path: "Full Brand System",
    pathNote: "Strategic audit, repositioning, identity refinement, and an implementation system for the next stage.",
    outcome: "The brand catches up with the quality already present in the business.",
    proof: {
      slug: "dr-haley-nutrition",
      title: "Dr. Haley Nutrition",
      metric: "0.71% → 2.81%",
      line: "Sharper positioning and a more disciplined content system lifted engagement while the brand published less.",
    },
  },
] as const;

export const SITUATION_KEY = "bt-situation";

type SituationId = (typeof STATES)[number]["id"];

export function VisitorRecognition() {
  const ref = useRef<HTMLElement>(null);
  const prefersReducedMotion = useReducedMotion();
  const compactLayout = useMediaQuery("(max-width: 1023px), (max-height: 719px)");
  const staticLayout = Boolean(prefersReducedMotion) || compactLayout;
  const [selected, setSelected] = useState<SituationId>(STATES[0].id);
  const [manual, setManual] = useState(false);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end end"] });

  const fogY = useTransform(scrollYProgress, [0, 1], [80, -120]);
  const fogOpacity = useTransform(scrollYProgress, [0, 0.45, 1], [0.18, 0.5, 0.16]);
  const fieldScale = useTransform(scrollYProgress, [0, 1], [0.96, 1.08]);
  const resolutionOpacity = useTransform(scrollYProgress, [0.54, 0.75, 1], [0, 1, 1]);
  const resolutionY = useTransform(scrollYProgress, [0.55, 0.8], [70, 0]);

  useEffect(() => {
    try {
      const saved = window.localStorage.getItem(SITUATION_KEY) as SituationId | null;
      if (saved && STATES.some((state) => state.id === saved)) setSelected(saved);
    } catch {}
  }, []);

  useMotionValueEvent(scrollYProgress, "change", (value) => {
    if (staticLayout || manual) return;
    const index = Math.min(STATES.length - 1, Math.floor(value * 3.1));
    setSelected(STATES[index].id);
  });

  function pick(id: SituationId) {
    setManual(true);
    setSelected(id);
    track("visitor_situation_selected", { situation: id, page: "home" });
    try {
      window.localStorage.setItem(SITUATION_KEY, id);
    } catch {}
  }

  const active = STATES.find((state) => state.id === selected) ?? STATES[0];

  if (staticLayout) {
    return (
      <section className="relative overflow-hidden bg-soil py-24 text-ivory sm:py-28">
        <div
          aria-hidden="true"
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(circle at 22% 22%, rgba(184,90,52,.2), transparent 30%), radial-gradient(circle at 78% 62%, rgba(198,169,122,.14), transparent 34%), linear-gradient(145deg,#17130f 0%,#27211b 52%,#12100d 100%)",
          }}
        />
        <Container className="relative z-10 max-w-[92rem]">
          <div className="grid gap-8 lg:grid-cols-[0.8fr_1.2fr] lg:items-end">
            <div>
              <p className="text-[0.65rem] font-medium uppercase tracking-[0.32em] text-sandstone">
                The mind answers before the mouth does
              </p>
              <h2 className="mt-5 max-w-3xl font-display text-[clamp(3rem,7vw,6.6rem)] font-normal leading-[0.92] tracking-[-0.045em]">
                Which sentence feels a little <span className="italic text-clay">too familiar?</span>
              </h2>
            </div>
            <p className="max-w-xl text-sm leading-relaxed text-ivory/66 sm:text-base lg:justify-self-end">
              Do not analyse it. Notice which one catches first. Choose it to reveal the likely gap and the next useful decision.
            </p>
          </div>

          <div className="mt-10 grid gap-4 lg:grid-cols-3" aria-label="Choose the situation that feels closest">
            {STATES.map((state) => {
              const isActive = state.id === selected;
              return (
                <button
                  key={state.id}
                  type="button"
                  aria-pressed={isActive}
                  onClick={() => pick(state.id)}
                  className={`rounded-[1.5rem] border p-6 text-left transition-colors duration-300 ${
                    isActive
                      ? "border-sandstone/65 bg-soil/78"
                      : "border-ivory/12 bg-soil/38 hover:border-ivory/30 hover:bg-soil/58"
                  }`}
                >
                  <span className="text-[0.6rem] uppercase tracking-[0.22em] text-sandstone/72">{state.number} · {state.stage}</span>
                  <span className="mt-4 block font-display text-3xl leading-tight text-ivory">“{state.label}”</span>
                </button>
              );
            })}
          </div>

          <div className="mt-6 rounded-[1.7rem] border border-ivory/14 bg-[#16130f]/82 p-6 shadow-2xl backdrop-blur-md sm:p-8">
            <div className="grid gap-7 lg:grid-cols-[0.8fr_1.2fr_auto] lg:items-end">
              <div>
                <p className="text-[0.6rem] uppercase tracking-[0.24em] text-ivory/38">The likely gap</p>
                <p className="mt-2 font-display text-3xl text-ivory">{active.path}</p>
                <p className="mt-3 text-sm leading-relaxed text-ivory/62">{active.symptom}</p>
              </div>
              <div>
                <p className="text-[0.6rem] uppercase tracking-[0.24em] text-ivory/38">What changes</p>
                <p className="mt-2 text-base leading-relaxed text-ivory/78">{active.outcome}</p>
                <p className="mt-3 text-sm leading-relaxed text-ivory/48">{active.pathNote}</p>
              </div>
              <div className="flex flex-col gap-3">
                <Link href={`/work/${active.proof.slug}`} className="inline-flex min-h-11 items-center justify-center rounded-full bg-sandstone px-5 text-xs font-medium uppercase tracking-[0.14em] text-soil">
                  See the proof ↗
                </Link>
                <Link href="/services" className="inline-flex min-h-11 items-center justify-center rounded-full border border-ivory/20 px-5 text-xs font-medium uppercase tracking-[0.14em] text-ivory/76">
                  Trace the path →
                </Link>
              </div>
            </div>
          </div>
        </Container>
      </section>
    );
  }

  return (
    <section ref={ref} className="relative min-h-[290svh] bg-soil text-ivory">
      <div className="sticky top-0 flex h-svh min-h-[680px] items-center overflow-hidden">
        <motion.div
          aria-hidden="true"
          className="absolute inset-[-10%]"
          style={{
            scale: fieldScale,
            background:
              "radial-gradient(circle at 22% 32%, rgba(184,90,52,.2), transparent 30%), radial-gradient(circle at 76% 62%, rgba(198,169,122,.14), transparent 34%), linear-gradient(145deg,#17130f 0%,#27211b 52%,#12100d 100%)",
          }}
        />
        <motion.div
          aria-hidden="true"
          className="absolute -left-[12%] top-[18%] h-[44%] w-[70%] rounded-full bg-ivory/[0.055] blur-[90px]"
          style={{ y: fogY, opacity: fogOpacity }}
        />
        <motion.div
          aria-hidden="true"
          className="absolute -right-[18%] bottom-[4%] h-[52%] w-[78%] rounded-full bg-clay/[0.09] blur-[110px]"
          style={{ y: fogY, opacity: fogOpacity }}
        />

        <Container className="relative z-[2] max-w-[92rem]">
          <div className="grid min-h-[72svh] gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:items-center lg:gap-20">
            <div>
              <p className="text-[0.65rem] font-medium uppercase tracking-[0.32em] text-sandstone">
                The mind answers before the mouth does
              </p>
              <h2 className="mt-5 max-w-xl font-display text-[clamp(3rem,6.4vw,6.8rem)] font-normal leading-[0.9] tracking-[-0.045em]">
                Which sentence
                <br />
                feels a little
                <br />
                <span className="italic text-clay">too familiar?</span>
              </h2>
              <p className="mt-7 max-w-md text-sm leading-relaxed text-ivory/58 sm:text-base">
                Do not analyse it. Notice which one catches first. Recognition usually arrives before explanation.
              </p>
            </div>

            <div className="relative flex min-h-[34rem] items-center justify-center">
              <div className="absolute inset-0 rounded-full bg-[radial-gradient(circle,rgba(198,169,122,.08),transparent_58%)]" aria-hidden="true" />
              {STATES.map((state, index) => {
                const isActive = state.id === selected;
                const positions = [
                  "left-0 top-[8%] max-w-[29rem]",
                  "right-0 top-[38%] max-w-[31rem]",
                  "left-[8%] bottom-[2%] max-w-[30rem]",
                ];
                return (
                  <motion.button
                    key={state.id}
                    type="button"
                    aria-pressed={isActive}
                    onClick={() => pick(state.id)}
                    className={`absolute ${positions[index]} text-left focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-8 focus-visible:outline-sandstone`}
                    animate={{
                      opacity: isActive ? 1 : 0.2,
                      scale: isActive ? 1 : 0.88,
                      x: isActive ? 0 : index === 1 ? 36 : -28,
                      filter: isActive ? "blur(0px)" : "blur(3px)",
                    }}
                    transition={{ duration: 0.75, ease: [0.22, 1, 0.36, 1] }}
                  >
                    <span className="block text-[0.62rem] uppercase tracking-[0.25em] text-sandstone/65">
                      {state.number} · {state.stage}
                    </span>
                    <span className="mt-3 block font-display text-[clamp(2rem,3.6vw,4.4rem)] leading-[0.98] tracking-[-0.035em] text-ivory">
                      “{state.label}”
                    </span>
                    <motion.span className="mt-4 block h-px origin-left bg-sandstone/70" animate={{ scaleX: isActive ? 1 : 0.12 }} transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }} />
                  </motion.button>
                );
              })}
            </div>
          </div>

          <motion.div style={{ opacity: resolutionOpacity, y: resolutionY }} className="absolute inset-x-6 bottom-8 z-[4] sm:bottom-10">
            <AnimatePresence mode="wait">
              <motion.div
                key={active.id}
                initial={{ opacity: 0, y: 18, filter: "blur(8px)" }}
                animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                exit={{ opacity: 0, y: -12, filter: "blur(5px)" }}
                transition={{ duration: 0.5 }}
                className="mx-auto grid max-w-5xl gap-5 border-t border-ivory/14 pt-5 md:grid-cols-[0.85fr_1.15fr_auto] md:items-end"
              >
                <div>
                  <p className="text-[0.6rem] uppercase tracking-[0.24em] text-ivory/38">The likely gap</p>
                  <p className="mt-2 font-display text-2xl text-ivory sm:text-3xl">{active.path}</p>
                  <p className="mt-2 text-sm leading-relaxed text-ivory/56">{active.symptom}</p>
                </div>
                <div>
                  <p className="text-[0.6rem] uppercase tracking-[0.24em] text-ivory/38">What changes</p>
                  <p className="mt-2 text-sm leading-relaxed text-ivory/72 sm:text-base">{active.outcome}</p>
                  <p className="mt-2 text-xs leading-relaxed text-ivory/42">{active.pathNote}</p>
                </div>
                <div className="flex gap-3 md:flex-col">
                  <Link href={`/work/${active.proof.slug}`} className="inline-flex min-h-11 items-center justify-center rounded-full bg-sandstone px-5 text-xs font-medium uppercase tracking-[0.14em] text-soil transition-transform hover:-translate-y-0.5">
                    See the proof ↗
                  </Link>
                  <Link href="/services" className="inline-flex min-h-11 items-center justify-center rounded-full border border-ivory/20 px-5 text-xs font-medium uppercase tracking-[0.14em] text-ivory/76 transition-colors hover:border-ivory/45 hover:text-ivory">
                    Trace the path →
                  </Link>
                </div>
              </motion.div>
            </AnimatePresence>
          </motion.div>
        </Container>
      </div>
    </section>
  );
}
