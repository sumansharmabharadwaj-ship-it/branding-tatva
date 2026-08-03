"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { Container } from "@/components/Container";
import { track } from "@/lib/analytics";

const STATES = [
  {
    id: "idea",
    number: "01",
    label: "We keep changing direction before anything settles",
    stage: "Building from an idea",
    symptom: "Too many possibilities. No governing decision yet.",
    path: "Foundation",
    pathNote: "Discovery, positioning, core identity, and the first usable brand system.",
    outcome: "A business people can understand before they are asked to buy.",
    proof: { slug: "myshopineurope", title: "MyShopInEurope" },
  },
  {
    id: "inconsistent",
    number: "02",
    label: "People see us, but every version feels different",
    stage: "An existing brand without one system",
    symptom: "Every channel is active. None of them feel related.",
    path: "Full Brand System",
    pathNote: "Audit, repositioning, verbal identity, and alignment across every customer-facing surface.",
    outcome: "Recognition begins compounding instead of restarting on every channel.",
    proof: { slug: "herbalcart", title: "HerbalCart" },
  },
  {
    id: "outgrown",
    number: "03",
    label: "The business has grown, but the brand still looks behind",
    stage: "A mature offer inside an earlier identity",
    symptom: "The offer has matured. The brand still describes an earlier version.",
    path: "Full Brand System",
    pathNote: "Strategic audit, repositioning, identity refinement, and an implementation system for the next stage.",
    outcome: "The brand catches up with the quality already present in the business.",
    proof: { slug: "dr-haley-nutrition", title: "Dr. Haley Nutrition" },
  },
] as const;

export const SITUATION_KEY = "bt-situation";
type SituationId = (typeof STATES)[number]["id"];

export function VisitorRecognition() {
  const [selected, setSelected] = useState<SituationId>(STATES[0].id);
  const prefersReducedMotion = useReducedMotion();

  useEffect(() => {
    try {
      const saved = window.localStorage.getItem(SITUATION_KEY) as SituationId | null;
      if (saved && STATES.some((state) => state.id === saved)) setSelected(saved);
    } catch {}
  }, []);

  function pick(id: SituationId) {
    setSelected(id);
    track("visitor_situation_selected", { situation: id, page: "home" });
    try {
      window.localStorage.setItem(SITUATION_KEY, id);
    } catch {}
  }

  const active = STATES.find((state) => state.id === selected) ?? STATES[0];

  return (
    <section className="relative overflow-hidden bg-soil py-28 text-ivory sm:py-40">
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_76%_34%,rgba(184,90,52,.12),transparent_30%),radial-gradient(circle_at_18%_72%,rgba(212,185,154,.08),transparent_34%)]" />
      <Container className="relative max-w-[88rem]">
        <div className="grid gap-16 lg:grid-cols-[0.78fr_1.22fr] lg:gap-24">
          <div className="lg:sticky lg:top-28 lg:self-start">
            <motion.p
              initial={prefersReducedMotion ? false : { opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.7 }}
              transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
              className="text-[0.65rem] font-medium uppercase tracking-[0.32em] text-sandstone"
            >
              The mind answers before the mouth does
            </motion.p>
            <motion.h2
              initial={prefersReducedMotion ? false : { opacity: 0, y: 28 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.55 }}
              transition={{ duration: 1.1, delay: 0.12, ease: [0.16, 1, 0.3, 1] }}
              className="mt-5 max-w-xl font-display text-[clamp(3rem,6vw,6rem)] font-normal leading-[0.92] tracking-[-0.045em]"
            >
              Which sentence feels a little <span className="italic text-clay">too familiar?</span>
            </motion.h2>
            <motion.p
              initial={prefersReducedMotion ? false : { opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true, amount: 0.7 }}
              transition={{ duration: 1, delay: 0.45 }}
              className="mt-8 max-w-md text-sm leading-relaxed text-ivory/62 sm:text-base"
            >
              Do not analyse it. Notice which sentence catches first. Recognition usually arrives before explanation.
            </motion.p>
          </div>

          <div>
            <div className="space-y-4" role="list" aria-label="Choose the situation that best describes your brand">
              {STATES.map((state, index) => {
                const activeState = state.id === selected;
                return (
                  <motion.button
                    key={state.id}
                    type="button"
                    onClick={() => pick(state.id)}
                    aria-pressed={activeState}
                    initial={prefersReducedMotion ? false : { opacity: 0, y: 28 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, amount: 0.45 }}
                    transition={{ duration: 0.9, delay: index * 0.14, ease: [0.16, 1, 0.3, 1] }}
                    className={`group relative w-full overflow-hidden rounded-[1.5rem] border p-6 text-left transition-[border-color,background-color,transform] duration-700 sm:p-8 ${
                      activeState
                        ? "border-sandstone/70 bg-ivory/[0.08]"
                        : "border-ivory/12 bg-ivory/[0.025] hover:-translate-y-1 hover:border-ivory/28 hover:bg-ivory/[0.05]"
                    }`}
                  >
                    <motion.span
                      aria-hidden="true"
                      className="absolute inset-y-0 left-0 w-1 origin-bottom bg-sandstone"
                      animate={{ scaleY: activeState ? 1 : 0 }}
                      transition={{ duration: 0.75, ease: [0.16, 1, 0.3, 1] }}
                    />
                    <span className="block text-[0.62rem] uppercase tracking-[0.24em] text-sandstone/70">
                      {state.number} · {state.stage}
                    </span>
                    <span className="mt-3 block font-display text-[clamp(1.8rem,3.1vw,3.6rem)] leading-[1.02] tracking-[-0.03em]">
                      “{state.label}”
                    </span>
                    <span className={`mt-4 block text-xs uppercase tracking-[0.2em] transition-opacity duration-500 ${activeState ? "opacity-60" : "opacity-0"}`}>
                      Follow this clue ↓
                    </span>
                  </motion.button>
                );
              })}
            </div>

            <div className="mt-8 min-h-[21rem] rounded-[1.75rem] border border-ivory/14 bg-black/15 p-6 sm:p-8">
              <AnimatePresence mode="wait" initial={false}>
                <motion.div
                  key={active.id}
                  initial={prefersReducedMotion ? false : { opacity: 0, y: 24 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={prefersReducedMotion ? undefined : { opacity: 0, y: -16 }}
                  transition={{ duration: prefersReducedMotion ? 0 : 0.85, ease: [0.16, 1, 0.3, 1] }}
                >
                  <p className="text-[0.6rem] uppercase tracking-[0.24em] text-sandstone">The likely gap</p>
                  <p className="mt-3 font-display text-4xl text-ivory sm:text-5xl">{active.path}</p>
                  <p className="mt-4 max-w-xl text-sm leading-relaxed text-ivory/62">{active.symptom}</p>

                  <motion.div
                    initial={prefersReducedMotion ? false : { opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: prefersReducedMotion ? 0 : 0.9, delay: prefersReducedMotion ? 0 : 0.28 }}
                    className="mt-8 border-t border-ivory/12 pt-7"
                  >
                    <p className="text-[0.6rem] uppercase tracking-[0.24em] text-ivory/40">What changes</p>
                    <p className="mt-3 max-w-2xl font-display text-2xl leading-tight text-ivory sm:text-3xl">{active.outcome}</p>
                    <p className="mt-3 max-w-2xl text-sm leading-relaxed text-ivory/48">{active.pathNote}</p>
                  </motion.div>

                  <div className="mt-8 flex flex-wrap gap-3">
                    <Link href={`/work/${active.proof.slug}`} className="inline-flex min-h-11 items-center justify-center rounded-full bg-sandstone px-5 text-xs font-medium uppercase tracking-[0.14em] text-soil transition-transform duration-300 hover:-translate-y-0.5">
                      See {active.proof.title} ↗
                    </Link>
                    <Link href="/services" className="inline-flex min-h-11 items-center justify-center rounded-full border border-ivory/22 px-5 text-xs font-medium uppercase tracking-[0.14em] text-ivory/80 transition-colors duration-300 hover:border-ivory/45 hover:text-ivory">
                      Trace the path →
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
