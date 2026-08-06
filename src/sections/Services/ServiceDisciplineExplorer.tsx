"use client";

import type { CSSProperties, KeyboardEvent, PointerEvent } from "react";
import { useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Container } from "@/components/Container";
import { Reveal } from "@/components/Reveal";
import { useHydratedReducedMotion } from "@/hooks/useHydratedReducedMotion";
import { offerings } from "@/data/services";
import { track } from "@/lib/analytics";

const EASE = [0.16, 1, 0.3, 1] as const;
type ActivationSource = "hover" | "focus" | "click" | "keyboard";

// Six document-length service rows once turned the opening commercial
// chapter into a catalogue. The names still remain visible together,
// but one substantial explanation changes beside or beneath them. On a
// phone the index is a two-by-three control field, not six full-width
// rows; desktop retains the vertical editorial index. The same DOM,
// source copy, panel, and package path serve both compositions.
export function ServiceDisciplineExplorer() {
  const [activeIndex, setActiveIndex] = useState(0);
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const prefersReducedMotion = useHydratedReducedMotion();
  const active = offerings[activeIndex];

  function activate(index: number, source: ActivationSource) {
    if (index === activeIndex) return;
    setActiveIndex(index);
    track("capability_selected", {
      capability: offerings[index].name,
      source,
      page: "services",
    });
  }

  function selectIndex(index: number, focus = false, source: ActivationSource = "click") {
    const nextIndex = (index + offerings.length) % offerings.length;
    activate(nextIndex, source);
    if (focus) requestAnimationFrame(() => tabRefs.current[nextIndex]?.focus());
  }

  function handlePointerEnter(index: number, event: PointerEvent<HTMLButtonElement>) {
    // Touch browsers can retain a synthetic hover state after a tap.
    // Only a fine pointer previews; touch remains click-led.
    if (event.pointerType === "mouse" || event.pointerType === "pen") {
      activate(index, "hover");
    }
  }

  function handleTabKey(event: KeyboardEvent<HTMLButtonElement>, index: number) {
    const compact = event.currentTarget.ownerDocument.defaultView?.matchMedia("(max-width: 1023px)").matches ?? false;
    let nextIndex: number | null = null;

    switch (event.key) {
      case "ArrowRight":
        nextIndex = index + 1;
        break;
      case "ArrowLeft":
        nextIndex = index - 1;
        break;
      case "ArrowDown":
        nextIndex = index + (compact ? 2 : 1);
        break;
      case "ArrowUp":
        nextIndex = index - (compact ? 2 : 1);
        break;
      case "Home":
        nextIndex = 0;
        break;
      case "End":
        nextIndex = offerings.length - 1;
        break;
      default:
        return;
    }

    event.preventDefault();
    selectIndex(nextIndex, true, "keyboard");
  }

  return (
    <Container className="relative max-w-7xl">
      <div
        data-service-discipline-explorer="true"
        data-active-discipline-index={activeIndex}
        className="grid gap-10 lg:grid-cols-[minmax(0,0.88fr)_minmax(0,1.12fr)] lg:items-center lg:gap-12 xl:grid-cols-[minmax(0,18rem)_minmax(18rem,0.82fr)_minmax(0,1.18fr)] xl:gap-14"
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
            <span className="lg:hidden">Tap a discipline</span>
            <span className="hidden lg:inline">Hover, focus, or tap a discipline</span>
          </p>
        </Reveal>

        <div
          data-service-discipline-index="true"
          role="tablist"
          aria-label="Branding Tatva service disciplines"
          className="relative grid grid-cols-2 gap-1.5 overflow-hidden rounded-2xl border border-ivory/12 bg-[rgba(11,17,16,0.46)] p-2 backdrop-blur-md lg:block"
        >
          {offerings.map((offer, index) => {
            const isActive = activeIndex === index;
            return (
              <button
                key={offer.name}
                ref={(node) => {
                  tabRefs.current[index] = node;
                }}
                id={`service-discipline-tab-${index}`}
                type="button"
                role="tab"
                aria-selected={isActive}
                aria-controls="service-discipline-panel"
                tabIndex={isActive ? 0 : -1}
                data-service-discipline-tab="true"
                data-discipline-index={index}
                onPointerEnter={(event) => handlePointerEnter(index, event)}
                onFocus={() => activate(index, "focus")}
                onClick={() => selectIndex(index, false, "click")}
                onKeyDown={(event) => handleTabKey(event, index)}
                className="group relative flex min-h-[5.6rem] w-full flex-col items-start justify-between gap-2 overflow-hidden rounded-xl px-3 py-3 text-left focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-sandstone lg:min-h-14 lg:flex-row lg:items-center lg:justify-start lg:gap-3 lg:px-4"
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

                <span className="relative flex w-full items-center justify-between lg:w-auto lg:shrink-0">
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
                    className={`h-2 w-2 rounded-full transition-all duration-300 lg:hidden ${
                      isActive ? "scale-125" : "opacity-55 group-hover:opacity-100"
                    }`}
                    style={{ backgroundColor: offer.color }}
                  />
                </span>

                <span
                  className={`relative flex-1 font-display text-[0.92rem] font-normal leading-[1.15] transition-colors duration-300 sm:text-base lg:text-lg ${
                    isActive ? "text-ivory" : "text-ivory/72 group-hover:text-ivory"
                  }`}
                >
                  {offer.name}
                </span>

                <span
                  aria-hidden="true"
                  className={`relative hidden h-2 w-2 shrink-0 rounded-full transition-all duration-300 lg:block ${
                    isActive ? "scale-125" : "opacity-55 group-hover:opacity-100"
                  }`}
                  style={{ backgroundColor: offer.color }}
                />
              </button>
            );
          })}
        </div>

        <div
          data-service-discipline-panel-shell="true"
          className="relative min-h-[20rem] overflow-hidden rounded-3xl border border-ivory/14 bg-[rgba(10,16,16,0.58)] p-5 backdrop-blur-lg sm:p-7 lg:min-h-[25rem] lg:p-8"
        >
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -right-20 -top-20 h-64 w-64 rounded-full blur-3xl"
            style={{ backgroundColor: `${active.color}28` }}
          />
          <div
            aria-hidden="true"
            className="absolute inset-x-5 top-0 h-px sm:inset-x-7 lg:inset-x-8"
            style={{ backgroundColor: active.color }}
          />

          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              key={active.name}
              id="service-discipline-panel"
              role="tabpanel"
              aria-labelledby={`service-discipline-tab-${activeIndex}`}
              data-service-discipline-panel="true"
              initial={prefersReducedMotion ? { opacity: 1 } : { opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              exit={prefersReducedMotion ? { opacity: 0 } : { opacity: 0, y: -10 }}
              transition={prefersReducedMotion ? { duration: 0 } : { duration: 0.42, ease: EASE }}
              className="relative flex min-h-[16rem] flex-col justify-between lg:min-h-[21rem]"
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
                <h3 className="mt-4 max-w-xl font-display text-3xl font-normal leading-tight text-ivory sm:text-4xl lg:mt-5">
                  {active.name}
                </h3>
                <p className="mt-5 max-w-2xl text-base leading-relaxed text-ivory/[0.88] sm:text-lg lg:mt-6">
                  {active.detail}
                </p>
              </div>

              <div className="mt-8 flex flex-wrap items-center justify-between gap-4 border-t border-ivory/12 pt-5 lg:mt-10">
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
