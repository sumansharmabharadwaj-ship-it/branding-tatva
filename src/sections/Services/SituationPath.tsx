"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { Container } from "@/components/Container";
import { LinkButton } from "@/components/Button";
import { packages } from "@/data/services";
import { SITUATION_KEY } from "@/sections/Home/VisitorRecognition";

// Conversion architecture, Services chapter two: the visitor chooses
// their situation before any package is pitched. If they already chose
// on the Home page, the same choice arrives here preselected (read
// from the shared localStorage key VisitorRecognition writes), so the
// site remembers where they stand instead of asking twice. Selection
// reveals the recommended package, the reason, and the real scope from
// data/services.ts — never new marketing copy. Two contextual CTAs:
// the package detail below, and the booking room at the end.
const OPTIONS = [
  {
    id: "idea",
    label: "I am beginning with an idea",
    slug: "brand-beginning",
    reason: "Positioning gets decided before anything is designed, so every later choice inherits one direction.",
  },
  {
    id: "reposition",
    label: "My existing brand needs repositioning",
    slug: "brand-clarity",
    reason: "An audit finds where recognition is leaking, then one position replaces the several currently competing.",
  },
  {
    id: "ongoing",
    label: "I need ongoing consistency",
    slug: "brand-partnership",
    reason: "Recognition compounds when one person keeps the system coherent as more goes out into the world.",
  },
] as const;

// Home's VisitorRecognition stores its own three ids; both of its
// existing-brand situations resolve to the repositioning path here.
const HOME_ID_MAP: Record<string, string> = {
  idea: "idea",
  inconsistent: "reposition",
  outgrown: "reposition",
};

export function SituationPath() {
  const [selected, setSelected] = useState<string | null>(null);
  const [carried, setCarried] = useState(false);
  const prefersReducedMotion = useReducedMotion();

  useEffect(() => {
    try {
      const saved = window.localStorage.getItem(SITUATION_KEY);
      const mapped = saved ? HOME_ID_MAP[saved] : undefined;
      if (mapped) {
        setSelected(mapped);
        setCarried(true);
      }
    } catch {}
  }, []);

  function pick(id: string) {
    setSelected(id);
    setCarried(false);
  }

  const active = OPTIONS.find((o) => o.id === selected);
  const pkg = active ? packages.find((p) => p.slug === active.slug) : undefined;

  return (
    <Container className="max-w-5xl">
      <p className="text-sm font-medium uppercase tracking-wide text-sandstone">Choose your situation</p>
      <h2 className="mt-2 max-w-2xl text-display-sm font-display font-normal text-ivory">
        Three starting points. One of them is yours.
      </h2>
      {carried && (
        <p className="mt-3 text-sm text-ivory/70">Carried over from where you stood on the Home page.</p>
      )}
      <div className="mt-10 grid gap-3 sm:grid-cols-3">
        {OPTIONS.map((option, i) => {
          const isActive = selected === option.id;
          return (
            <motion.button
              key={option.id}
              type="button"
              aria-pressed={isActive}
              onClick={() => pick(option.id)}
              initial={prefersReducedMotion ? undefined : { opacity: 0, y: 18 }}
              whileInView={prefersReducedMotion ? undefined : { opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "0px 0px -10% 0px" }}
              transition={{ duration: 0.5, delay: i * 0.08, ease: [0.16, 1, 0.3, 1] }}
              className={`h-full rounded-2xl border p-5 text-left backdrop-blur-md transition-colors duration-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-sandstone sm:p-6 ${
                isActive
                  ? "border-sandstone/60 bg-ivory/[0.08] text-ivory"
                  : "border-ivory/15 bg-ivory/[0.03] text-ivory/85 hover:border-ivory/35 hover:bg-ivory/[0.06]"
              }`}
            >
              <span className="font-display text-lg font-normal leading-snug sm:text-xl">{option.label}</span>
            </motion.button>
          );
        })}
      </div>
      <AnimatePresence mode="wait">
        {active && pkg && (
          <motion.div
            key={active.id}
            initial={prefersReducedMotion ? undefined : { opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={prefersReducedMotion ? undefined : { opacity: 0 }}
            transition={{ duration: prefersReducedMotion ? 0 : 0.5, ease: [0.22, 1, 0.36, 1] }}
            className="mt-8 rounded-2xl border-t-2 border-ivory/12 p-6 backdrop-blur-md sm:p-8"
            style={{ borderTopColor: pkg.color, backgroundColor: "rgba(244,239,230,0.05)" }}
          >
            <div className="flex flex-wrap items-baseline gap-x-4 gap-y-1">
              <p className="font-display text-xl font-normal text-ivory">{pkg.name}</p>
              <p className="text-sm text-ivory/70">{pkg.forWho}</p>
            </div>
            <p className="mt-4 max-w-2xl text-base leading-relaxed text-ivory/90">{active.reason}</p>
            <p className="mt-4 text-xs font-medium uppercase tracking-[0.15em] text-ivory/60">Indicative scope</p>
            <ul className="mt-2 grid gap-1.5 sm:grid-cols-2">
              {pkg.includes.map((item) => (
                <li key={item} className="text-sm text-ivory/85 before:mr-2 before:content-['•']">
                  {item}
                </li>
              ))}
            </ul>
            <div className="mt-6 flex flex-wrap gap-3">
              <LinkButton href="#desire" variant="secondary" className="border-ivory/30 text-ivory hover:bg-ivory/10">
                See the full package
              </LinkButton>
              <LinkButton href="#book">Book a Brand Strategy Session</LinkButton>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </Container>
  );
}
