"use client";

import type { CSSProperties, PointerEvent } from "react";
import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useInView } from "framer-motion";
import { Container } from "@/components/Container";
import { Reveal } from "@/components/Reveal";
import { useHydratedReducedMotion } from "@/hooks/useHydratedReducedMotion";
import { offerings } from "@/data/services";
import { track } from "@/lib/analytics";

const EASE = [0.16, 1, 0.3, 1] as const;
const AUTO_ADVANCE_MS = 3800;
const MANUAL_HOLD_MS = 12000;
const HOVER_HOLD_MS = 4200;

// Six stacked description rows made the complete Services list read like
// a catalogue and consumed almost two screens before the visitor reached
// the package decision. This explorer keeps all six disciplines visible
// in one scene: the names form the index, and one substantial explanation
// changes beside them on hover, focus, tap, or a calm in-view sequence.
// Nothing is hidden behind a carousel and no new service claims are
// invented; every line still comes from data/services.ts.
export function ServiceDisciplineExplorer() {
  const stageRef = useRef<HTMLDivElement>(null);
  const holdUntilRef = useRef(0);
  const [activeIndex, setActiveIndex] = useState(0);
  const prefersReducedMotion = useHydratedReducedMotion();
  const inView = useInView(stageRef, { amount: 0.3, margin: "8% 0px -10% 0px" });
  const active = offerings[activeIndex];

  useEffect(() => {
    if (!inView || prefersReducedMotion || offerings.length < 2) return;

    const timer = window.setInterval(() => {
      if (document.hidden || Date.now() < holdUntilRef.current) return;
      setActiveIndex((current) => (current + 1) % offerings.length);
    }, AUTO_ADVANCE_MS);

    return () => window.clearInterval(timer);
  }, [inView, prefersReducedMotion]);

  function activate(
    index: number,
    source: "hover" | "focus" | "click",
    holdMs = MANUAL_HOLD_MS,
  ) {
    holdUntilRef.current = Date.now() + holdMs;
    if (index === activeIndex) return;
    setActiveIndex(index);
    track("capability_selected", {
      capability: offerings[index].name,
      source,
      page: "services",
    });
  }

  function handlePointerEnter(index: number, event: PointerEvent<HTMLButtonElement>) {
    // Touch browsers can retain a synthetic hover state after a tap.
    // Only a real fine-pointer hover previews; touch remains click-led.
    if (event.pointerType === "mouse" || event.pointerType === "pen") {
      activate(index, "hover", HOVER_HOLD_MS);
    }
  }

  return (
    <Container className="relative max-w-7xl">
      <div
        ref={stageRef}
        className="grid gap-10 lg:grid-cols-[minmax(0,0.88fr)_minmax(0,1.12fr)] lg:items-center lg:gap-12 xl:grid-cols-[minmax(0,18rem)_minmax(18rem,0.82fr)_minmax(0,1.18fr)] xl:gap-14"
        onPointerDown={() => {
          holdUntilRef.current = Date.now() + MANUAL_HOLD_MS;
        }}
        onFocusCapture={() => {
          holdUntilRef.current = Date.now() + MANUAL_HOLD_MS;
        }}
      >
        <Reveal className="lg:col-span-2 xl:col-span-1">
          <p className="text-sm font-medium uppercase tracking-wide text-sandstone">The full practice</p>
          <h2 className="mt-2 text-display-sm font-display font-normal text-ivory">
            Six kinds of work, one discipline underneath.
          </h2>
          <p className="mt-4 max-w-sm text-sm leading-relaxed text-ivory/75">
            Every service appears inside the package paths ahead. Explore the complete practice here without leaving
            this scene.
          </p>
          <p className="mt-6 max-w-xs text-xs uppercase tracking-[0.16em] text-ivory/50">
            The index advances while you watch. Hover, focus, or tap and it waits.
          </p>
        </Reveal>

        <div
          role="tablist"
          aria-label="Branding Tatva service disciplines"
          className="relative overflow-hidden rounded-2xl border border-ivory/12 bg-[rgba(11,17,16,0.46)] p-2 backdrop-blur-md"
        >
          {offerings.map((offer, index) => {
            const isActive = activeIndex === index;
            return (
              <button
                key={offer.name}
                id={`service-discipline-tab-${index}`}
                type="button"
                role="tab"
                aria-selected={isActive}
                aria-controls="service-discipline-panel"
                tabIndex={isActive ? 0 : -1}
                onPointerEnter={(event) => handlePointerEnter(index, event)}
                onFocus={() => activate(index, "focus")}
                onClick={() => activate(index, "click")}
                className="group relative flex min-h-14 w-full items-center gap-3 overflow-hidden rounded-xl px-3 py-3 text-left focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sandstone sm:px-4"
                style={{ "--discipline-color": offer.color } as CSSProperties}
              >
                {isActive && (
                  <motion.span
                    layoutId="active-service-discipline"
                    aria-hidden="true"
                    className="absolute inset-0 rounded-xl border"
                    style={{
                      borderColor: `${offer.color}99`,
                      background: `linear-gradient(100deg, ${offer.color}2E 0%, rgba(244,239,230,0.035) 76%)`,
                    }}
                    transition={prefersReducedMotion ? { duration: 0 } : { duration: 0.42, ease: EASE }}
                  />
                )}
                <span
                  aria-hidden="true"
                  className={`relative font-display text-sm transition-colors duration-300 ${
                    isActive ? "text-ivory" : "text-ivory/35 group-hover:text-ivory/65"
                  }`}
                >
                  {String(index + 1).padStart(2, "0")}
                </span>
                <span
                  className={`relative flex-1 font-display text-[1.05rem] font-normal leading-tight transition-colors duration-300 sm:text-lg ${
                    isActive ? "text-ivory" : "text-ivory/72 group-hover:text-ivory"
                  }`}
                >
                  {offer.name}
                </span>
                <span
                  aria-hidden="true"
                  className={`relative h-2 w-2 shrink-0 rounded-full transition-all duration-300 ${
                    isActive ? "scale-125" : "opacity-55 group-hover:opacity-100"
                  }`}
                  style={{ backgroundColor: offer.color }}
                />
                {isActive && inView && !prefersReducedMotion && (
                  <motion.span
                    key={`discipline-progress-${activeIndex}`}
                    aria-hidden="true"
                    className="absolute inset-x-3 bottom-0 h-px origin-left sm:inset-x-4"
                    style={{ backgroundColor: offer.color }}
                    initial={{ scaleX: 0 }}
                    animate={{ scaleX: 1 }}
                    transition={{ duration: AUTO_ADVANCE_MS / 1000, ease: "linear" }}
                  />
                )}
              </button>
            );
          })}
        </div>

        <div className="relative min-h-[22rem] overflow-hidden rounded-3xl border border-ivory/14 bg-[rgba(10,16,16,0.58)] p-6 backdrop-blur-lg sm:p-8 lg:min-h-[25rem]">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -right-20 -top-20 h-64 w-64 rounded-full blur-3xl"
            style={{ backgroundColor: `${active.color}28` }}
          />
          <div aria-hidden="true" className="absolute inset-x-6 top-0 h-px sm:inset-x-8" style={{ backgroundColor: active.color }} />

          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              key={active.name}
              id="service-discipline-panel"
              role="tabpanel"
              aria-labelledby={`service-discipline-tab-${activeIndex}`}
              initial={prefersReducedMotion ? { opacity: 1 } : { opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              exit={prefersReducedMotion ? { opacity: 0 } : { opacity: 0, y: -10 }}
              transition={prefersReducedMotion ? { duration: 0 } : { duration: 0.42, ease: EASE }}
              className="relative flex min-h-[18rem] flex-col justify-between lg:min-h-[21rem]"
            >
              <div>
                <div className="flex items-baseline justify-between gap-4">
                  <p className="text-xs font-medium uppercase tracking-[0.18em] text-ivory/55">
                    Discipline {String(activeIndex + 1).padStart(2, "0")} / {String(offerings.length).padStart(2, "0")}
                  </p>
                  <span className="font-display text-5xl font-normal text-ivory/10" aria-hidden="true">
                    {String(activeIndex + 1).padStart(2, "0")}
                  </span>
                </div>
                <h3 className="mt-5 max-w-xl font-display text-3xl font-normal leading-tight text-ivory sm:text-4xl">
                  {active.name}
                </h3>
                <p className="mt-6 max-w-2xl text-base leading-relaxed text-ivory/[0.88] sm:text-lg">{active.detail}</p>
              </div>

              <div className="mt-10 flex flex-wrap items-center justify-between gap-4 border-t border-ivory/12 pt-5">
                <p className="max-w-sm text-sm leading-relaxed text-ivory/60">
                  Woven into the package paths below, rather than sold as an isolated output.
                </p>
                <a
                  href="#desire"
                  className="link-underline inline-flex min-h-11 items-center gap-2 px-1 text-sm text-sandstone transition-colors duration-300 hover:text-ivory focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-sandstone"
                >
                  Explore the package paths
                  <span aria-hidden="true">↓</span>
                </a>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </Container>
  );
}
