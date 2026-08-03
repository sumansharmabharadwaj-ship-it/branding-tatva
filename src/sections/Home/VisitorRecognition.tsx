"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { Container } from "@/components/Container";
import { Reveal } from "@/components/Reveal";
import { track } from "@/lib/analytics";

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
    pathNote: "Audit, repositioning, verbal identity, and alignment across every customer facing surface.",
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

function SignalMark({ active }: { active: boolean }) {
  return (
    <span className="relative flex h-10 w-10 shrink-0 items-center justify-center" aria-hidden="true">
      <span className={`absolute rounded-full border transition-all duration-700 ${active ? "inset-0 border-sandstone/60" : "inset-2 border-ivory/20"}`} />
      <span className={`rounded-full transition-all duration-700 ${active ? "h-2.5 w-2.5 bg-sandstone shadow-[0_0_24px_rgba(212,185,154,0.8)]" : "h-1.5 w-1.5 bg-ivory/35"}`} />
    </span>
  );
}

function SignalHandoff({ reduced }: { reduced: boolean | null }) {
  return (
    <div className="pointer-events-none absolute inset-x-0 top-0 h-36 -translate-y-20 overflow-hidden" aria-hidden="true">
      <div className="absolute left-1/2 top-0 h-20 w-px -translate-x-1/2 bg-gradient-to-b from-sandstone/80 to-sandstone/20" />
      <motion.span
        className="absolute left-1/2 top-[4.7rem] h-2.5 w-2.5 -translate-x-1/2 rounded-full bg-sandstone shadow-[0_0_32px_rgba(212,185,154,0.75)]"
        animate={reduced ? undefined : { scale: [0.9, 1.2, 0.9], opacity: [0.7, 1, 0.7] }}
        transition={{ duration: 2.8, repeat: Infinity, ease: "easeInOut" }}
      />
      <svg className="absolute inset-x-0 top-[4.9rem] h-24 w-full" viewBox="0 0 1200 100" preserveAspectRatio="none">
        {["M600 0 C600 32 240 28 190 100", "M600 0 C600 42 600 45 600 100", "M600 0 C600 32 960 28 1010 100"].map((d, index) => (
          <motion.path
            key={d}
            d={d}
            fill="none"
            stroke={index === 1 ? "rgba(212,185,154,.5)" : "rgba(212,185,154,.34)"}
            strokeWidth={index === 1 ? 1.2 : 1}
            initial={reduced ? undefined : { pathLength: 0, opacity: 0 }}
            animate={{ pathLength: 1, opacity: 1 }}
            transition={{ duration: 1.1, delay: 0.15 + index * 0.13, ease: [0.22, 1, 0.36, 1] }}
          />
        ))}
      </svg>
    </div>
  );
}

export function VisitorRecognition() {
  const [selected, setSelected] = useState<string>(STATES[0].id);
  const prefersReducedMotion = useReducedMotion();

  useEffect(() => {
    try {
      const saved = window.localStorage.getItem(SITUATION_KEY);
      if (saved && STATES.some((state) => state.id === saved)) setSelected(saved);
    } catch {}
  }, []);

  function pick(id: string) {
    setSelected(id);
    track("visitor_situation_selected", { situation: id, page: "home" });
    try {
      window.localStorage.setItem(SITUATION_KEY, id);
    } catch {}
  }

  const active = STATES.find((state) => state.id === selected) ?? STATES[0];

  return (
    <section className="relative overflow-hidden bg-soil pb-20 pt-28 sm:pb-28 sm:pt-36">
      <SignalHandoff reduced={prefersReducedMotion} />
      <div className="pointer-events-none absolute inset-0 opacity-70" aria-hidden="true" style={{ background: "radial-gradient(circle at 18% 20%, rgba(184,90,52,0.12), transparent 34%), radial-gradient(circle at 82% 70%, rgba(212,185,154,0.09), transparent 32%)" }} />

      <Container className="relative max-w-6xl">
        <Reveal>
          <div className="flex flex-col gap-6 border-b border-ivory/10 pb-9 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-xs font-medium uppercase tracking-[0.28em] text-sandstone">The signal splits here</p>
              <h2 className="mt-3 max-w-3xl text-display-md font-display font-normal text-ivory">Which sentence has been following your business around?</h2>
            </div>
            <p className="max-w-sm text-sm leading-relaxed text-ivory/55">Choose the closest one. The page will trace the likely strategic gap, the path that resolves it, and a real precedent.</p>
          </div>
        </Reveal>

        <div className="mt-10 grid gap-8 lg:grid-cols-[0.82fr_1.18fr] lg:gap-12">
          <div className="relative">
            <div className="absolute bottom-5 left-5 top-5 w-px bg-gradient-to-b from-sandstone/40 via-ivory/15 to-transparent" aria-hidden="true" />
            <div className="space-y-3">
              {STATES.map((state, index) => {
                const isActive = selected === state.id;
                return (
                  <Reveal key={state.id} delay={index * 0.06}>
                    <button
                      type="button"
                      aria-pressed={isActive}
                      onClick={() => pick(state.id)}
                      className={`group relative flex w-full items-start gap-4 rounded-2xl border px-4 py-5 text-left transition-all duration-500 sm:px-5 ${isActive ? "translate-x-1 border-sandstone/45 bg-ivory/[0.08] shadow-[0_22px_60px_-35px_rgba(0,0,0,0.8)]" : "border-transparent bg-transparent hover:border-ivory/12 hover:bg-ivory/[0.03]"}`}
                    >
                      <SignalMark active={isActive} />
                      <span className="min-w-0 flex-1">
                        <span className="flex items-start justify-between gap-4">
                          <span className={`font-display text-xl leading-tight transition-colors sm:text-2xl ${isActive ? "text-ivory" : "text-ivory/72 group-hover:text-ivory"}`}>“{state.label}”</span>
                          <span className="pt-1 text-[0.65rem] tracking-[0.2em] text-ivory/30">{state.number}</span>
                        </span>
                        <span className={`mt-3 block text-[0.68rem] font-medium uppercase tracking-[0.17em] transition-colors ${isActive ? "text-sandstone" : "text-ivory/30 group-hover:text-ivory/45"}`}>{state.stage}</span>
                        <span className={`mt-2 block text-sm leading-relaxed transition-colors ${isActive ? "text-ivory/65" : "text-ivory/38 group-hover:text-ivory/55"}`}>{state.symptom}</span>
                      </span>
                    </button>
                  </Reveal>
                );
              })}
            </div>
          </div>

          <div className="relative min-h-[520px] overflow-hidden rounded-2xl border border-ivory/12 bg-[#1d1a17] shadow-[0_34px_90px_-42px_rgba(0,0,0,0.9)]">
            <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-sandstone/70 to-transparent" aria-hidden="true" />
            <div className="absolute right-0 top-0 h-56 w-56 rounded-full bg-clay/10 blur-3xl" aria-hidden="true" />
            <AnimatePresence mode="wait">
              <motion.div
                key={active.id}
                initial={prefersReducedMotion ? undefined : { opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                exit={prefersReducedMotion ? undefined : { opacity: 0, y: -10 }}
                transition={{ duration: prefersReducedMotion ? 0 : 0.55, ease: [0.22, 1, 0.36, 1] }}
                className="relative flex h-full min-h-[520px] flex-col p-6 sm:p-9"
              >
                <div className="flex items-center justify-between gap-5">
                  <div>
                    <p className="text-[0.65rem] font-medium uppercase tracking-[0.24em] text-sandstone">Strategic reading</p>
                    <p className="mt-2 font-display text-3xl text-ivory sm:text-4xl">{active.path}</p>
                  </div>
                  <div className="relative h-20 w-20 shrink-0" aria-hidden="true">
                    {[0, 1, 2].map((ring) => (
                      <motion.span key={ring} className="absolute rounded-full border border-sandstone/30" style={{ inset: ring * 10 }} animate={prefersReducedMotion ? undefined : { opacity: [0.22, 0.75, 0.22], scale: [0.96, 1.04, 0.96] }} transition={{ duration: 3.8 + ring * 0.5, repeat: Infinity, delay: ring * 0.35, ease: "easeInOut" }} />
                    ))}
                    <span className="absolute inset-[34px] rounded-full bg-sandstone" />
                  </div>
                </div>

                <div className="mt-8 grid gap-6 sm:grid-cols-2">
                  <div><p className="text-[0.65rem] uppercase tracking-[0.2em] text-ivory/35">What the signal means</p><p className="mt-3 text-base leading-relaxed text-ivory/82">{active.need}</p></div>
                  <div><p className="text-[0.65rem] uppercase tracking-[0.2em] text-ivory/35">What changes</p><p className="mt-3 text-base leading-relaxed text-ivory/82">{active.outcome}</p></div>
                </div>

                <div className="mt-8 rounded-2xl border border-sandstone/20 bg-ivory/[0.045] p-5 sm:p-6">
                  <div className="flex flex-wrap items-start justify-between gap-4">
                    <div><p className="text-[0.65rem] font-medium uppercase tracking-[0.2em] text-sandstone">Recorded precedent</p><p className="mt-2 font-display text-2xl text-ivory">{active.proof.title}</p></div>
                    <p className="font-display text-2xl text-sandstone sm:text-3xl">{active.proof.metric}</p>
                  </div>
                  <p className="mt-4 max-w-2xl text-sm leading-relaxed text-ivory/66">{active.proof.line}</p>
                </div>

                <p className="mt-6 text-sm leading-relaxed text-ivory/48">{active.pathNote}</p>
                <div className="mt-auto flex flex-col gap-3 pt-8 sm:flex-row sm:items-center">
                  <Link href={`/work/${active.proof.slug}`} className="inline-flex min-h-11 items-center justify-center rounded-full bg-sandstone px-5 text-sm font-medium text-soil transition-transform duration-300 hover:-translate-y-0.5">Inspect the evidence <span className="ml-2" aria-hidden="true">↗</span></Link>
                  <Link href="/services" className="inline-flex min-h-11 items-center justify-center rounded-full border border-ivory/20 px-5 text-sm font-medium text-ivory/80 transition-colors hover:border-ivory/40 hover:text-ivory">See the service path <span className="ml-2" aria-hidden="true">→</span></Link>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>

        <Reveal delay={0.12} className="mt-10 flex items-center gap-4 text-xs uppercase tracking-[0.2em] text-ivory/35">
          <span className="h-px flex-1 bg-gradient-to-r from-transparent to-ivory/15" aria-hidden="true" />
          Recognition becomes useful when it leads to evidence
          <span className="h-px flex-1 bg-gradient-to-l from-transparent to-ivory/15" aria-hidden="true" />
        </Reveal>
      </Container>
    </section>
  );
}
