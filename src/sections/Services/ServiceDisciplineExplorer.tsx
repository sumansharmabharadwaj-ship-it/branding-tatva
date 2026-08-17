"use client";

import type { CSSProperties, FocusEvent } from "react";
import { useEffect, useRef, useState } from "react";
import {
  AnimatePresence,
  motion,
  useInView,
  useMotionValueEvent,
  useScroll,
} from "framer-motion";
import { Container } from "@/components/Container";
import { Reveal } from "@/components/Reveal";
import { useHydratedReducedMotion } from "@/hooks/useHydratedReducedMotion";
import { useMediaQuery } from "@/hooks/useMediaQuery";
import { offerings } from "@/data/services";
import { track } from "@/lib/analytics";

const EASE = [0.16, 1, 0.3, 1] as const;
const AUTO_ADVANCE_MS = 3800;
const MANUAL_HOLD_MS = 12000;

function clamp(value: number, minimum = 0, maximum = 1) {
  return Math.min(maximum, Math.max(minimum, value));
}

// Six stacked description rows made the complete Services list read like
// a catalogue and consumed almost two screens before the visitor reached
// the package decision. Desktop now compresses all six into one 170svh
// journey: a modest vertical gesture advances a lateral discipline rail and
// replaces one explanatory panel inside a stable frame. Mobile keeps every
// discipline in a tap-first vertical index and advances calmly while visible.
export function ServiceDisciplineExplorer() {
  const journeyRef = useRef<HTMLDivElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const railViewportRef = useRef<HTMLDivElement>(null);
  const holdUntilRef = useRef(0);
  const [activeIndex, setActiveIndex] = useState(0);
  const prefersReducedMotion = useHydratedReducedMotion();
  const isDesktop = useMediaQuery("(min-width: 1024px)");
  const inView = useInView(stageRef, { amount: 0.3, margin: "8% 0px -10% 0px" });
  const { scrollYProgress } = useScroll({
    target: journeyRef,
    offset: ["start start", "end end"],
  });
  const active = offerings[activeIndex];

  useMotionValueEvent(scrollYProgress, "change", (progress) => {
    if (!isDesktop || prefersReducedMotion || Date.now() < holdUntilRef.current) return;
    const nextIndex = Math.min(
      offerings.length - 1,
      Math.floor(clamp(progress) * offerings.length),
    );
    setActiveIndex((current) => (current === nextIndex ? current : nextIndex));
  });

  useEffect(() => {
    if (isDesktop || !inView || prefersReducedMotion || offerings.length < 2) return;

    const timer = window.setInterval(() => {
      if (document.hidden || Date.now() < holdUntilRef.current) return;
      setActiveIndex((current) => (current + 1) % offerings.length);
    }, AUTO_ADVANCE_MS);

    return () => window.clearInterval(timer);
  }, [inView, isDesktop, prefersReducedMotion]);

  useEffect(() => {
    if (!isDesktop) return;
    const viewport = railViewportRef.current;
    const button = viewport?.querySelector<HTMLElement>(
      `[data-service-discipline-index="${activeIndex}"]`,
    );
    if (!viewport || !button) return;

    const targetLeft = button.offsetLeft - (viewport.clientWidth - button.offsetWidth) / 2;
    viewport.scrollTo({
      left: Math.max(0, targetLeft),
      behavior: prefersReducedMotion ? "auto" : "smooth",
    });
  }, [activeIndex, isDesktop, prefersReducedMotion]);

  function alignJourney(index: number) {
    const journey = journeyRef.current;
    if (!isDesktop || !journey) return;

    const rect = journey.getBoundingClientRect();
    const top = window.scrollY + rect.top;
    const travel = Math.max(0, journey.offsetHeight - window.innerHeight);
    const progress = offerings.length > 1 ? index / (offerings.length - 1) : 0;
    window.scrollTo({
      top: top + travel * progress,
      behavior: prefersReducedMotion ? "auto" : "smooth",
    });
  }

  function activate(
    index: number,
    source: "hover" | "focus" | "click",
    holdMs = MANUAL_HOLD_MS,
  ) {
    holdUntilRef.current = Date.now() + holdMs;
    if (source === "click") alignJourney(index);
    if (index === activeIndex) return;
    setActiveIndex(index);
    track("capability_selected", {
      capability: offerings[index].name,
      source,
      page: "services",
    });
  }

  function handleFocus(index: number, event: FocusEvent<HTMLButtonElement>) {
    // Mouse focus lands before click. Activating at that point moves the
    // horizontal rail underneath the pointer, so the release can land on a
    // neighbouring discipline. Keyboard focus remains an intentional manual
    // activation; pointer users activate on the completed click below.
    if (event.currentTarget.matches(":focus-visible")) activate(index, "focus");
  }

  return (
    <div
      ref={journeyRef}
      data-services-discipline-journey="true"
      className="relative lg:h-[170svh]"
    >
      <div className="relative lg:sticky lg:top-0 lg:flex lg:min-h-svh lg:items-center lg:overflow-hidden">
        <Container className="relative max-w-7xl py-2 lg:py-12">
          <div
            ref={stageRef}
            className="grid gap-10 lg:grid-cols-[minmax(15rem,0.58fr)_minmax(0,1.42fr)] lg:items-center lg:gap-12 xl:grid-cols-[minmax(16rem,0.52fr)_minmax(0,1.48fr)] xl:gap-16"
            onPointerDown={() => {
              holdUntilRef.current = Date.now() + MANUAL_HOLD_MS;
            }}
            onFocusCapture={() => {
              holdUntilRef.current = Date.now() + MANUAL_HOLD_MS;
            }}
          >
            <Reveal className="lg:self-center">
              <p className="text-sm font-medium uppercase tracking-wide text-sandstone">The full practice</p>
              <h2 className="mt-2 text-display-sm font-display font-normal text-ivory">
                Six kinds of work, one discipline underneath.
              </h2>
              <p className="mt-4 max-w-sm text-sm leading-relaxed text-ivory/75">
                Every service appears inside the package paths ahead. Explore the complete practice here without leaving
                this scene.
              </p>
              <p className="mt-6 max-w-xs text-xs uppercase tracking-[0.16em] text-ivory/50">
                {isDesktop
                  ? "Scroll a little to travel across the practice. Select one and the journey waits."
                  : "The index advances while you watch. Tap one and it waits."}
              </p>

              <div className="mt-7 flex items-center gap-4" aria-hidden="true">
                <span className="font-display text-2xl text-ivory">
                  {String(activeIndex + 1).padStart(2, "0")}
                </span>
                <span className="h-px flex-1 overflow-hidden bg-ivory/12">
                  <motion.span
                    className="block h-full origin-left"
                    style={{ backgroundColor: active.color }}
                    animate={{ scaleX: (activeIndex + 1) / offerings.length }}
                    transition={{ duration: prefersReducedMotion ? 0 : 0.48, ease: EASE }}
                  />
                </span>
                <span className="text-[0.58rem] uppercase tracking-[0.14em] text-ivory/45">
                  / {String(offerings.length).padStart(2, "0")}
                </span>
              </div>
            </Reveal>

            <div className="min-w-0">
              <div
                ref={railViewportRef}
                className="services-discipline-rail-viewport overflow-visible lg:overflow-hidden"
              >
                <div
                  role="tablist"
                  aria-label="Branding Tatva service disciplines"
                  className="services-discipline-rail grid gap-1.5 rounded-2xl border border-ivory/12 bg-[rgba(11,17,16,0.46)] p-2 backdrop-blur-md lg:flex lg:w-max lg:min-w-full lg:gap-2"
                >
                  {offerings.map((offer, index) => {
                    const isActive = activeIndex === index;
                    return (
                      <button
                        key={offer.name}
                        id={`service-discipline-tab-${index}`}
                        data-service-discipline-index={index}
                        type="button"
                        role="tab"
                        aria-selected={isActive}
                        aria-controls="service-discipline-panel"
                        tabIndex={isActive ? 0 : -1}
                        onFocus={(event) => handleFocus(index, event)}
                        onClick={() => activate(index, "click")}
                        className="group relative flex min-h-14 min-w-0 items-center gap-3 overflow-hidden rounded-xl px-3 py-3 text-left focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sandstone sm:px-4 lg:w-[13.5rem] lg:flex-none"
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
                        {isActive && inView && !prefersReducedMotion && !isDesktop && (
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
              </div>

              <div className="relative mt-4 min-h-[22rem] overflow-hidden rounded-3xl border border-ivory/14 bg-[rgba(10,16,16,0.58)] p-6 backdrop-blur-lg sm:p-8 lg:min-h-[24rem]">
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
                    initial={prefersReducedMotion ? { opacity: 1 } : { opacity: 0, x: 22, y: 8 }}
                    animate={{ opacity: 1, x: 0, y: 0 }}
                    exit={prefersReducedMotion ? { opacity: 0 } : { opacity: 0, x: -18, y: -6 }}
                    transition={prefersReducedMotion ? { duration: 0 } : { duration: 0.42, ease: EASE }}
                    className="relative flex min-h-[18rem] flex-col justify-between lg:min-h-[20rem]"
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
          </div>
        </Container>
      </div>
    </div>
  );
}
