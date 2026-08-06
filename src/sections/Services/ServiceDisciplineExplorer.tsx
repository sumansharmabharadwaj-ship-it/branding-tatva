"use client";

import type { CSSProperties, PointerEvent } from "react";
import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Container } from "@/components/Container";
import { Reveal } from "@/components/Reveal";
import { useHydratedReducedMotion } from "@/hooks/useHydratedReducedMotion";
import { offerings } from "@/data/services";
import { track } from "@/lib/analytics";

const EASE = [0.16, 1, 0.3, 1] as const;
const SCENE_PROGRESS_EVENT = "bt:services-scene-progress";
const CLICK_HOLD_MS = 12000;
const HOVER_HOLD_MS = 3400;
const FIRST_OFFERING = offerings[0];

type ServicesProgressDetail = {
  id?: string;
  scene?: string;
  progress?: number;
};

// Six stacked description rows made the complete Services list read like
// a catalogue and consumed almost two screens before the visitor reached
// the package decision. The disciplines now form one lateral route above a
// stable explanation frame. A short native vertical range moves the active
// state across that route, so the visitor explores six kinds of work without
// crossing six separate screens. Every line remains sourced from services.ts.
export function ServiceDisciplineExplorer() {
  const [activeIndex, setActiveIndex] = useState(0);
  const pauseUntilRef = useRef(0);
  const prefersReducedMotion = useHydratedReducedMotion();
  const active = offerings[activeIndex] ?? FIRST_OFFERING;

  useEffect(() => {
    if (prefersReducedMotion) return;

    function onSceneProgress(event: Event) {
      const detail = (event as CustomEvent<ServicesProgressDetail>).detail;
      if (detail?.id !== "offerings" || typeof detail.progress !== "number") return;
      if (Date.now() < pauseUntilRef.current) return;

      const nextIndex = Math.min(
        offerings.length - 1,
        Math.max(0, Math.floor(detail.progress * offerings.length)),
      );
      setActiveIndex((current) => (current === nextIndex ? current : nextIndex));
    }

    window.addEventListener(SCENE_PROGRESS_EVENT, onSceneProgress as EventListener);
    return () => {
      window.removeEventListener(SCENE_PROGRESS_EVENT, onSceneProgress as EventListener);
    };
  }, [prefersReducedMotion]);

  function activate(index: number, source: "hover" | "focus" | "click") {
    const selectedOffer = offerings[index];
    if (!selectedOffer) return;

    pauseUntilRef.current =
      Date.now() + (source === "hover" ? HOVER_HOLD_MS : CLICK_HOLD_MS);
    if (index === activeIndex) return;
    setActiveIndex(index);
    track("capability_selected", {
      capability: selectedOffer.name,
      source,
      page: "services",
    });
  }

  function handlePointerEnter(index: number, event: PointerEvent<HTMLButtonElement>) {
    // Touch browsers can retain a synthetic hover state after a tap.
    // Only a real fine-pointer hover previews; touch remains click-led.
    if (event.pointerType === "mouse" || event.pointerType === "pen") {
      activate(index, "hover");
    }
  }

  return (
    <Container className="relative max-w-[92rem]">
      <div
        data-services-discipline-explorer="true"
        className="grid gap-9 lg:grid-cols-[minmax(0,20rem)_minmax(0,1fr)] lg:items-center lg:gap-12 xl:gap-16"
      >
        <Reveal>
          <p className="text-sm font-medium uppercase tracking-wide text-sandstone">The full practice</p>
          <h2 className="mt-2 text-display-sm font-display font-normal text-ivory">
            Six kinds of work, one discipline underneath.
          </h2>
          <p className="mt-4 max-w-sm text-sm leading-relaxed text-ivory/75">
            Every service appears inside the package paths ahead. Explore the complete practice here without leaving
            this scene.
          </p>
          <p className="mt-6 max-w-xs text-xs uppercase tracking-[0.16em] text-ivory/50">
            A short scroll travels across the practice
          </p>
        </Reveal>

        <div className="min-w-0">
          <div
            role="tablist"
            aria-label="Branding Tatva service disciplines"
            data-services-scroll-controlled="true"
            data-services-lateral-rail="true"
            className="grid grid-cols-2 gap-2 rounded-2xl border border-ivory/12 bg-[rgba(11,17,16,0.46)] p-2 backdrop-blur-md sm:grid-cols-3 xl:grid-cols-6"
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
                  className="group relative flex min-h-[6.6rem] min-w-0 flex-col justify-between overflow-hidden rounded-xl px-3 py-3 text-left focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sandstone sm:px-4"
                  style={{ "--discipline-color": offer.color } as CSSProperties}
                >
                  {isActive && (
                    <motion.span
                      layoutId="active-service-discipline"
                      aria-hidden="true"
                      className="absolute inset-0 rounded-xl border"
                      style={{
                        borderColor: `${offer.color}99`,
                        background: `linear-gradient(145deg, ${offer.color}32 0%, rgba(244,239,230,0.035) 72%)`,
                        boxShadow: `0 16px 42px ${offer.color}16`,
                      }}
                      transition={prefersReducedMotion ? { duration: 0 } : { duration: 0.36, ease: EASE }}
                    />
                  )}

                  <span className="relative flex items-center justify-between gap-2">
                    <span
                      aria-hidden="true"
                      className={`font-display text-sm transition-colors duration-300 ${
                        isActive ? "text-ivory" : "text-ivory/35 group-hover:text-ivory/65"
                      }`}
                    >
                      {String(index + 1).padStart(2, "0")}
                    </span>
                    <span
                      aria-hidden="true"
                      className={`h-2 w-2 shrink-0 rounded-full transition-all duration-300 ${
                        isActive ? "scale-125" : "opacity-55 group-hover:opacity-100"
                      }`}
                      style={{
                        backgroundColor: offer.color,
                        boxShadow: isActive ? `0 0 14px ${offer.color}88` : "none",
                      }}
                    />
                  </span>

                  <span
                    className={`relative mt-5 min-w-0 font-display text-[0.98rem] font-normal leading-[1.08] transition-colors duration-300 sm:text-[1.05rem] ${
                      isActive ? "text-ivory" : "text-ivory/72 group-hover:text-ivory"
                    }`}
                  >
                    {offer.name}
                  </span>

                  <span aria-hidden="true" className="relative mt-3 block h-px overflow-hidden bg-ivory/8">
                    <motion.span
                      className="block h-full origin-left"
                      style={{ backgroundColor: offer.color }}
                      animate={{ scaleX: isActive ? 1 : 0 }}
                      transition={{ duration: prefersReducedMotion ? 0 : 0.34, ease: EASE }}
                    />
                  </span>
                </button>
              );
            })}
          </div>

          <div className="relative mt-4 min-h-[21rem] overflow-hidden rounded-3xl border border-ivory/14 bg-[rgba(10,16,16,0.58)] p-6 backdrop-blur-lg sm:p-8 lg:min-h-[23rem]">
            <motion.div
              aria-hidden="true"
              className="pointer-events-none absolute -right-20 -top-20 h-72 w-72 rounded-full blur-3xl"
              animate={{ backgroundColor: `${active.color}28` }}
              transition={{ duration: prefersReducedMotion ? 0 : 0.45, ease: EASE }}
            />
            <div aria-hidden="true" className="absolute inset-x-6 top-0 h-px sm:inset-x-8" style={{ backgroundColor: active.color }} />

            <AnimatePresence mode="wait" initial={false}>
              <motion.div
                key={active.name}
                id="service-discipline-panel"
                role="tabpanel"
                aria-labelledby={`service-discipline-tab-${activeIndex}`}
                initial={prefersReducedMotion ? { opacity: 1 } : { opacity: 0, x: 18, filter: "blur(5px)" }}
                animate={{ opacity: 1, x: 0, filter: "blur(0px)" }}
                exit={prefersReducedMotion ? { opacity: 0 } : { opacity: 0, x: -12, filter: "blur(4px)" }}
                transition={prefersReducedMotion ? { duration: 0 } : { duration: 0.38, ease: EASE }}
                className="relative flex min-h-[17rem] flex-col justify-between lg:min-h-[19rem]"
                aria-live="polite"
              >
                <div className="grid gap-6 sm:grid-cols-[minmax(0,1fr)_auto] sm:items-start">
                  <div>
                    <p className="text-xs font-medium uppercase tracking-[0.18em] text-ivory/55">
                      Discipline {String(activeIndex + 1).padStart(2, "0")} / {String(offerings.length).padStart(2, "0")}
                    </p>
                    <h3 className="mt-5 max-w-xl font-display text-3xl font-normal leading-tight text-ivory sm:text-4xl">
                      {active.name}
                    </h3>
                    <p className="mt-5 max-w-3xl text-base leading-relaxed text-ivory/[0.88] sm:text-lg">{active.detail}</p>
                  </div>
                  <span className="font-display text-7xl font-normal leading-none text-ivory/[0.07]" aria-hidden="true">
                    {String(activeIndex + 1).padStart(2, "0")}
                  </span>
                </div>

                <div className="mt-8 flex flex-wrap items-center justify-between gap-4 border-t border-ivory/12 pt-5">
                  <p className="max-w-lg text-sm leading-relaxed text-ivory/60">
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
      </div>
    </Container>
  );
}
