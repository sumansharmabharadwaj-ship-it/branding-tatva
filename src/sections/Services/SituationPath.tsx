"use client";

import { useHydratedReducedMotion } from "@/hooks/useHydratedReducedMotion";
import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Container } from "@/components/Container";
import { LinkButton } from "@/components/Button";
import { packages } from "@/data/services";
import { SITUATION_KEY } from "@/sections/Home/VisitorRecognition";
import { track } from "@/lib/analytics";

// Conversion architecture, Services chapter two: the visitor places
// themselves before any package is pitched. If they already chose in the
// Home page Clarity Lab, the same condition arrives preselected, so the
// site remembers the diagnosis instead of asking the same question again.
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

// The current Home Clarity Lab stores idea, inconsistent, or outgrown.
// In that refined diagnosis, outgrown means growth is outrunning the
// system, so it should carry into ongoing consistency rather than force
// another repositioning choice on the Services page.
const HOME_ID_MAP: Record<string, string> = {
  idea: "idea",
  inconsistent: "reposition",
  outgrown: "ongoing",
};

const EASE = [0.22, 1, 0.36, 1] as const;

export function SituationPath() {
  const [selected, setSelected] = useState<string | null>(null);
  const [carried, setCarried] = useState(false);
  const prefersReducedMotion = useHydratedReducedMotion();

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
    setSelected((previous) => (previous === id ? previous : id));
    track("visitor_situation_selected", { situation: id, page: "services" });
    setCarried(false);
  }

  return (
    <Container className="max-w-6xl">
      <div className="grid gap-10 lg:grid-cols-[minmax(0,20rem)_1fr] lg:gap-20">
        <div className="lg:sticky lg:top-28 lg:self-start">
          <p className="text-sm font-medium uppercase tracking-wide text-sandstone">Choose your situation</p>
          <h2 className="mt-2 text-display-sm font-display font-normal text-ivory">
            Three starting points. One of them is yours.
          </h2>
          <p className="mt-4 max-w-sm text-sm leading-relaxed text-ivory/70">
            The rest of this page reads differently depending on where the brand stands today. Start with the row that sounds like yours.
          </p>
          <AnimatePresence>
            {carried && (
              <motion.p
                initial={prefersReducedMotion ? undefined : { opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="mt-5 inline-flex items-center gap-2 rounded-full border border-sandstone/40 px-3.5 py-1.5 text-xs text-sandstone"
              >
                <span aria-hidden="true">↺</span> Carried over from your Home page diagnosis.
              </motion.p>
            )}
          </AnimatePresence>
        </div>

        <div>
          {OPTIONS.map((option, index) => {
            const isActive = selected === option.id;
            const pkg = packages.find((entry) => entry.slug === option.slug);
            return (
              <div key={option.id} className="relative">
                <div className="h-px bg-ivory/12" aria-hidden="true" />
                <motion.button
                  type="button"
                  aria-pressed={isActive}
                  onClick={() => pick(option.id)}
                  initial={prefersReducedMotion ? undefined : { opacity: 0, y: 14 }}
                  whileInView={prefersReducedMotion ? undefined : { opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "0px 0px -10% 0px" }}
                  transition={{ duration: 0.35, delay: index * 0.07, ease: EASE }}
                  className="group grid w-full grid-cols-[2.5rem_1fr_auto] items-baseline gap-3 py-6 text-left focus-visible:outline focus-visible:outline-2 focus-visible:outline-sandstone sm:gap-5 sm:py-7"
                >
                  <span
                    className={`font-display text-base transition-colors duration-300 ${isActive ? "text-sandstone" : "text-ivory/35"}`}
                    aria-hidden="true"
                  >
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <span
                    className={`font-display text-xl font-normal leading-snug transition-all duration-500 ease-out group-hover:translate-x-1 sm:text-2xl ${
                      isActive ? "text-ivory" : "text-ivory/80 group-hover:text-ivory"
                    }`}
                  >
                    {option.label}
                  </span>
                  <span
                    aria-hidden="true"
                    className={`pt-1 text-xl font-light transition-all duration-300 ${
                      isActive ? "rotate-45 text-sandstone" : "text-ivory/50 group-hover:text-ivory"
                    }`}
                  >
                    +
                  </span>
                </motion.button>
                <AnimatePresence initial={false}>
                  {isActive && pkg && (
                    <motion.div
                      initial={prefersReducedMotion ? undefined : { height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={prefersReducedMotion ? undefined : { height: 0, opacity: 0 }}
                      transition={{ duration: prefersReducedMotion ? 0 : 0.55, ease: EASE }}
                      className="overflow-hidden"
                    >
                      <div
                        className="mb-7 rounded-2xl border-t-2 p-6 backdrop-blur-md sm:p-7"
                        style={{ borderTopColor: pkg.color, backgroundColor: "rgba(244,239,230,0.05)" }}
                      >
                        <div className="flex flex-wrap items-baseline gap-x-4 gap-y-1">
                          <p className="font-display text-xl font-normal text-ivory">{pkg.name}</p>
                          <p className="text-sm text-ivory/70">{pkg.forWho}</p>
                        </div>
                        <p className="mt-3 max-w-2xl text-base leading-relaxed text-ivory/90">{option.reason}</p>
                        <p className="mt-4 text-xs font-medium uppercase tracking-[0.15em] text-ivory/60">
                          Indicative scope
                        </p>
                        <ul className="mt-2 grid gap-1.5 sm:grid-cols-2">
                          {pkg.includes.map((item) => (
                            <li key={item} className="text-sm text-ivory/85 before:mr-2 before:content-['•']">
                              {item}
                            </li>
                          ))}
                        </ul>
                        <div className="mt-6 flex flex-wrap gap-3">
                          <LinkButton
                            href="#desire"
                            variant="secondary"
                            className="border-ivory/30 text-ivory hover:bg-ivory/10"
                          >
                            See the full package
                          </LinkButton>
                          <LinkButton href="#book">Book a Brand Strategy Session</LinkButton>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
          <div className="h-px bg-ivory/12" aria-hidden="true" />
        </div>
      </div>
    </Container>
  );
}
