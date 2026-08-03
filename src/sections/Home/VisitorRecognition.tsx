"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { Container } from "@/components/Container";
import { Reveal } from "@/components/Reveal";
import { track } from "@/lib/analytics";

// Conversion architecture, Home section two: the visitor identifies
// their own situation before being taught anything. Selection reveals
// the likely need and the real service path, persists to localStorage
// (read again on Services), and offers one contextual CTA. Tactile
// editorial cards, zero quiz language, zero forms. Copy follows the
// sitewide standard; every path maps to a real package in
// data/services.ts.
const STATES = [
  {
    id: "idea",
    label: "I am building from an idea",
    need: "Positioning decided before anything gets designed, so every later choice inherits a direction.",
    path: "Foundation",
    pathNote: "The starting package: discovery, positioning, core identity.",
    // Manual guide p9/p56: proof arrives as the consequence of the
    // visitor's own choice — one verified fact per situation, straight
    // from data/projects.ts, linked to its full decision trail.
    proof: {
      slug: "myshopineurope",
      line: "MyShopInEurope began with the same decision: a complete brand foundation, with positioning settled around craft and origin before the platform sold a thing.",
    },
  },
  {
    id: "inconsistent",
    label: "My brand exists but feels inconsistent",
    need: "One system aligning what already exists, so every channel says the same thing.",
    path: "Full Brand System",
    pathNote: "Audit, repositioning, and voice alignment across channels.",
    proof: {
      slug: "herbalcart",
      line: "HerbalCart got a full campaign reset built on one repositioning: public perception moved from herbal supplement toward a modern wellness brand.",
    },
  },
  {
    id: "outgrown",
    label: "The business has grown beyond its current position",
    need: "A position that matches what the business has become, then an identity that carries it.",
    path: "Full Brand System",
    pathNote: "A full audit and repositioning, built for where the business is heading.",
    proof: {
      slug: "dr-haley-nutrition",
      line: "Dr. Haley Nutrition sharpened its position and posted less: engagement climbed from 0.71% to 2.81%, and every post earned 104% more followers.",
    },
  },
] as const;

export const SITUATION_KEY = "bt-situation";

export function VisitorRecognition() {
  const [selected, setSelected] = useState<string | null>(null);
  const prefersReducedMotion = useReducedMotion();

  useEffect(() => {
    try {
      const saved = window.localStorage.getItem(SITUATION_KEY);
      if (saved && STATES.some((s) => s.id === saved)) setSelected(saved);
    } catch {}
  }, []);

  function pick(id: string) {
    setSelected(id);
    track("visitor_situation_selected", { situation: id, page: "home" });
    try {
      window.localStorage.setItem(SITUATION_KEY, id);
    } catch {}
  }

  const active = STATES.find((s) => s.id === selected);

  return (
    <section className="bg-soil py-16 sm:py-24">
      <Container className="max-w-5xl">
        <Reveal>
          <p className="text-sm font-medium uppercase tracking-wide text-sandstone">Where you stand</p>
          <h2 className="mt-2 max-w-2xl text-display-sm font-display font-normal text-ivory">
            Your brand may already be telling you where the gap is.
          </h2>
        </Reveal>
        <div className="mt-10 grid gap-3 sm:grid-cols-3">
          {STATES.map((state, i) => {
            const isActive = selected === state.id;
            return (
              <Reveal key={state.id} delay={i * 0.07}>
                <button
                  type="button"
                  aria-pressed={isActive}
                  onClick={() => pick(state.id)}
                  className={`h-full w-full rounded-2xl border p-5 text-left transition-all duration-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-sandstone sm:p-6 ${
                    isActive
                      ? "border-sandstone/60 bg-ivory/[0.08] text-ivory"
                      : "border-ivory/15 bg-ivory/[0.03] text-ivory/85 hover:border-ivory/35 hover:bg-ivory/[0.06]"
                  }`}
                >
                  <span className="font-display text-lg font-normal leading-snug sm:text-xl">{state.label}</span>
                </button>
              </Reveal>
            );
          })}
        </div>
        <AnimatePresence mode="wait">
          {active && (
            <motion.div
              key={active.id}
              initial={prefersReducedMotion ? undefined : { opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={prefersReducedMotion ? undefined : { opacity: 0 }}
              transition={{ duration: prefersReducedMotion ? 0 : 0.5, ease: [0.22, 1, 0.36, 1] }}
              className="mt-8 rounded-2xl border border-ivory/12 p-6 backdrop-blur-md sm:p-8"
              style={{ backgroundColor: "rgba(244,239,230,0.05)" }}
            >
              <p className="max-w-2xl text-base leading-relaxed text-ivory/90">{active.need}</p>
              <p className="mt-4 text-sm text-ivory/70">
                The path for this: <span className="text-ivory">{active.path}</span>. {active.pathNote}
              </p>
              <div className="mt-5 border-l-2 border-sandstone/50 pl-4">
                <p className="text-xs font-medium uppercase tracking-[0.15em] text-ivory/60">Recorded proof</p>
                <p className="mt-1 max-w-2xl text-sm leading-relaxed text-ivory/85">{active.proof.line}</p>
              </div>
              <div className="mt-5 flex flex-wrap gap-x-6 gap-y-2">
                <Link
                  href={`/work/${active.proof.slug}`}
                  className="inline-flex items-center gap-2 text-sm font-medium text-sandstone underline decoration-sandstone/40 underline-offset-4 transition-colors hover:text-ivory"
                >
                  See the decisions behind the result
                  <span aria-hidden="true">→</span>
                </Link>
                <Link
                  href="/services"
                  className="inline-flex items-center gap-2 text-sm font-medium text-sandstone underline decoration-sandstone/40 underline-offset-4 transition-colors hover:text-ivory"
                >
                  Explore the right service path
                  <span aria-hidden="true">→</span>
                </Link>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </Container>
    </section>
  );
}
