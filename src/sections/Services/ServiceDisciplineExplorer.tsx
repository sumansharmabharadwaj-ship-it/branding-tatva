"use client";

import type { CSSProperties, KeyboardEvent } from "react";
import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { Container } from "@/components/Container";
import { DisciplineOutput } from "./DisciplineOutput";
import { Reveal } from "@/components/Reveal";
import { useHydratedReducedMotion } from "@/hooks/useHydratedReducedMotion";
import { offerings } from "@/data/services";
import { track } from "@/lib/analytics";
import {
  SERVICES_SITUATION_EVENT,
  SERVICES_SITUATION_STORAGE_KEY,
  isServicesSituation,
  readCompletedHomeDiagnosis,
  type ServicesSituationDetail,
  type ServicesSituationId,
} from "@/lib/servicesJourney";

const EASE = [0.16, 1, 0.3, 1] as const;
const DEFAULT_DISCIPLINE_ORDER = offerings.map((_, index) => index);

// A situation changes sequencing, not scope. Every route can still inspect all
// six disciplines, while the work most consequential at that stage appears
// first in the chapter and keyboard order.
const ROUTE_PLANS: Record<
  ServicesSituationId,
  { label: string; summary: string; order: readonly number[] }
> = {
  idea: {
    label: "Building a new brand",
    summary: "Decide the position, then build the language and identity buyers will meet.",
    order: [0, 1, 3, 4, 5, 2],
  },
  reposition: {
    label: "Repositioning an established business",
    summary: "Keep what earns trust, replace what no longer fits, and rebuild the encounters buyers use most.",
    order: [0, 1, 3, 5, 4, 2],
  },
  ongoing: {
    label: "Stopping drift across channels",
    summary: "Write the rules, apply them to live work, and review what buyers actually respond to.",
    order: [1, 4, 2, 5, 3, 0],
  },
};

// Six stacked description rows made the complete Services list read like
// a catalogue and consumed almost two screens before the visitor reached
// the package decision. All six now resolve inside one responsive frame:
// the visitor chooses a discipline from the index and one explanatory panel
// changes in place. This removes another scroll runway and gives touch,
// keyboard and pointer visitors the same predictable control.
export function ServiceDisciplineExplorer() {
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const [activeIndex, setActiveIndex] = useState(0);
  const [situation, setSituation] = useState<ServicesSituationId | null>(null);
  const prefersReducedMotion = useHydratedReducedMotion();
  const active = offerings[activeIndex];
  const routePlan = situation ? ROUTE_PLANS[situation] : null;
  const disciplineOrder = routePlan?.order ?? DEFAULT_DISCIPLINE_ORDER;
  const activePosition = Math.max(0, disciplineOrder.indexOf(activeIndex));

  useEffect(() => {
    function applySituation(nextSituation: ServicesSituationId | null) {
      setSituation(nextSituation);
      setActiveIndex(
        nextSituation
          ? (ROUTE_PLANS[nextSituation].order[0] ?? DEFAULT_DISCIPLINE_ORDER[0])
          : DEFAULT_DISCIPLINE_ORDER[0],
      );
    }

    try {
      const storedSituation = window.localStorage.getItem(SERVICES_SITUATION_STORAGE_KEY);
      applySituation(
        isServicesSituation(storedSituation)
          ? storedSituation
          : readCompletedHomeDiagnosis(),
      );
    } catch {
      applySituation(null);
    }

    function onSituation(event: Event) {
      const detail = (event as CustomEvent<ServicesSituationDetail>).detail;
      applySituation(isServicesSituation(detail?.situation) ? detail.situation : null);
    }

    window.addEventListener(SERVICES_SITUATION_EVENT, onSituation as EventListener);
    return () => window.removeEventListener(SERVICES_SITUATION_EVENT, onSituation as EventListener);
  }, []);

  // Keep this choice stable as the visitor scrolls through its explanation.

  function activate(index: number, source: "focus" | "click") {
    if (index === activeIndex) return;
    setActiveIndex(index);
    track("capability_selected", {
      capability: offerings[index].name,
      source,
      page: "services",
    });
  }

  function handleTabKey(index: number, event: KeyboardEvent<HTMLButtonElement>) {
    const currentPosition = Math.max(0, disciplineOrder.indexOf(index));
    let nextPosition: number | undefined;
    if (event.key === "ArrowRight" || event.key === "ArrowDown") {
      nextPosition = (currentPosition + 1) % disciplineOrder.length;
    }
    if (event.key === "ArrowLeft" || event.key === "ArrowUp") {
      nextPosition = (currentPosition - 1 + disciplineOrder.length) % disciplineOrder.length;
    }
    if (event.key === "Home") nextPosition = 0;
    if (event.key === "End") nextPosition = disciplineOrder.length - 1;
    if (nextPosition === undefined) return;
    event.preventDefault();
    const nextIndex = disciplineOrder[nextPosition] ?? DEFAULT_DISCIPLINE_ORDER[0];
    activate(nextIndex, "focus");
    tabRefs.current[nextIndex]?.focus({ preventScroll: true });
  }

  return (
    <div data-services-discipline-journey="true" className="relative min-h-svh">
      <div className="relative lg:flex lg:min-h-svh lg:items-center lg:overflow-hidden">
        <Container className="relative max-w-7xl py-2 lg:py-12">
          <div
            data-discipline-layout="true"
            className="grid gap-10 lg:grid-cols-[minmax(15rem,0.58fr)_minmax(0,1.42fr)] lg:items-center lg:gap-12 xl:grid-cols-[minmax(16rem,0.52fr)_minmax(0,1.48fr)] xl:gap-16"
          >
            <div data-services-chapter-copy="true" className="lg:self-center">
              <Reveal>
                <p className="text-sm font-medium uppercase tracking-wide text-sandstone">What the work can cover</p>
                <h2 data-discipline-heading="true" className="mt-2 text-display-sm font-display font-normal text-ivory">
                  One position. Six ways to put it to work.
                </h2>
                <p data-discipline-intro="true" className="mt-4 max-w-sm text-sm leading-relaxed text-ivory/75">
                  Each discipline carries the position into the places buyers meet you.
                </p>
                <div data-discipline-progress="true" className="mt-7 flex items-center gap-4" aria-hidden="true">
                  <span className="font-display text-2xl text-ivory">
                    {String(activePosition + 1).padStart(2, "0")}
                  </span>
                  <span className="h-px flex-1 overflow-hidden bg-ivory/12">
                    <motion.span
                      className="block h-full origin-left"
                      style={{ backgroundColor: active.color }}
                      animate={{ scaleX: (activePosition + 1) / offerings.length }}
                      transition={{ duration: prefersReducedMotion ? 0 : 0.48, ease: EASE }}
                    />
                  </span>
                  <span className="text-[0.58rem] uppercase tracking-[0.14em] text-ivory/45">
                    / {String(offerings.length).padStart(2, "0")}
                  </span>
                </div>
              </Reveal>
            </div>

            <div data-services-chapter-instrument="true" className="min-w-0">
              <div
                className="services-discipline-rail-viewport overflow-visible lg:overflow-hidden"
              >
                <div
                  role="tablist"
                  aria-label={
                    routePlan
                      ? `Branding Tatva service disciplines ordered for ${routePlan.label}`
                      : "Branding Tatva service disciplines"
                  }
                  className="services-discipline-rail grid gap-1.5 rounded-2xl border border-ivory/12 bg-[rgba(11,17,16,0.46)] p-2 backdrop-blur-md lg:flex lg:w-max lg:min-w-full lg:gap-2"
                >
                  {disciplineOrder.map((offeringIndex, sequenceIndex) => {
                    const offer = offerings[offeringIndex] ?? offerings[0];
                    const isActive = activeIndex === offeringIndex;
                    return (
                      <button
                        key={offer.name}
                        ref={(node) => {
                          tabRefs.current[offeringIndex] = node;
                        }}
                        id={`service-discipline-tab-${offeringIndex}`}
                        data-service-discipline-index={offeringIndex}
                        type="button"
                        role="tab"
                        aria-selected={isActive}
                        aria-controls="service-discipline-panel"
                        tabIndex={isActive ? 0 : -1}
                        onFocus={() => activate(offeringIndex, "focus")}
                        onClick={() => activate(offeringIndex, "click")}
                        onKeyDown={(event) => handleTabKey(offeringIndex, event)}
                        className="group relative flex min-h-14 min-w-0 items-center gap-3 overflow-hidden rounded-xl px-3 py-3 text-left focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sandstone sm:px-4 lg:w-[13.5rem] lg:flex-none"
                        style={{ "--discipline-color": offer.color, "--disc-index": sequenceIndex } as CSSProperties}
                      >
                        <span
                          aria-hidden="true"
                          className={`relative font-display text-sm transition-colors duration-300 ${
                            isActive ? "text-ivory" : "text-ivory/35 group-hover:text-ivory/65"
                          }`}
                        >
                          {String(sequenceIndex + 1).padStart(2, "0")}
                        </span>
                        <span
                          data-discipline-label="true"
                          className={`relative flex-1 font-display text-[1.05rem] font-normal leading-tight transition-colors duration-300 sm:text-lg ${
                            isActive ? "text-ivory" : "text-ivory/72 group-hover:text-ivory"
                          }`}
                        >
                          {offer.name}
                        </span>
                        <span
                          aria-hidden="true"
                          data-discipline-dot="true"
                          className={`relative h-2 w-2 shrink-0 rounded-full transition-all duration-300 ${
                            isActive ? "scale-125" : "opacity-55 group-hover:opacity-100"
                          }`}
                          style={{ backgroundColor: offer.color }}
                        />
                      </button>
                    );
                  })}
                </div>
              </div>

              <div
                data-service-discipline-panel-shell="true"
                data-section-jump-yield="true"
                tabIndex={-1}
                className="relative mt-4 min-h-[22rem] overflow-hidden rounded-3xl border border-ivory/14 bg-[rgba(10,16,16,0.58)] p-6 backdrop-blur-lg sm:p-8 lg:min-h-[24rem]"
              >
                <motion.div
                  key={`discipline-thread-${active.name}`}
                  aria-hidden="true"
                  className="absolute inset-x-6 top-0 h-px origin-left sm:inset-x-8"
                  style={{ backgroundColor: active.color }}
                  initial={prefersReducedMotion ? false : { opacity: 0.32, scaleX: 0.08 }}
                  animate={{ opacity: 1, scaleX: 1 }}
                  transition={prefersReducedMotion ? { duration: 0 } : { duration: 0.56, ease: EASE }}
                />

                  <div
                    id="service-discipline-panel"
                    role="tabpanel"
                    tabIndex={0}
                    aria-labelledby={`service-discipline-tab-${activeIndex}`}
                    className="relative flex min-h-[18rem] flex-col justify-between lg:min-h-[20rem]"
                  >
                    <div data-discipline-panel-copy="true">
                      <div data-discipline-panel-meta="true" className="flex items-baseline justify-between gap-4">
                        <p className="text-xs font-medium uppercase tracking-[0.18em] text-ivory/55">
                          Discipline {String(activePosition + 1).padStart(2, "0")} / {String(offerings.length).padStart(2, "0")}
                        </p>
                        <span className="font-display text-5xl font-normal text-ivory/10" aria-hidden="true">
                          {String(activePosition + 1).padStart(2, "0")}
                        </span>
                      </div>
                      <div data-discipline-copy-deck="true">
                        {offerings.map((offer, index) => (
                          <div key={offer.name} data-discipline-copy="true" data-active={index === activeIndex} aria-hidden={index !== activeIndex} inert={index !== activeIndex}>
                            <h3 data-discipline-panel-heading="true" className="mt-5 max-w-xl font-display text-3xl font-normal leading-tight sm:text-4xl">{offer.name}</h3>
                            <p data-discipline-panel-detail="true" className="mt-6 max-w-2xl text-base leading-relaxed sm:text-lg">{offer.detail}</p>
                          </div>
                        ))}
                      </div>
                    </div>

                    <DisciplineOutput index={activeIndex} />

                    <div data-discipline-panel-footer="true" className="mt-10 flex flex-wrap items-center justify-between gap-4 border-t border-ivory/12 pt-5">
                      <p data-service-route-context="true" className="max-w-sm text-sm leading-relaxed text-ivory/60">
                        {[null, ...Object.values(ROUTE_PLANS)].map((plan) => {
                          const isActive = plan?.label === routePlan?.label;
                          return (
                            <span key={plan?.label ?? "default"} data-service-route-state="true" data-active={isActive} aria-hidden={!isActive} inert={!isActive}>
                              {plan ? (
                                <>
                                  <span className="block font-medium uppercase tracking-[0.16em] text-sandstone/80" style={{ fontSize: "clamp(0.7rem, 1.1vw, 0.8rem)" }}>Your route: {plan.label}</span>
                                  <span className="mt-1 block">{plan.summary}</span>
                                </>
                              ) : "Included when the engagement requires it. Nothing is added to fill a list."}
                            </span>
                          );
                        })}
                      </p>
                      <a
                        href="#desire"
                        data-discipline-next="true"
                        className="link-underline inline-flex min-h-11 items-center gap-2 px-1 text-sm text-sandstone transition-colors duration-300 hover:text-ivory focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-sandstone"
                      >
                        Compare the three engagements
                        <span aria-hidden="true">↓</span>
                      </a>
                    </div>
                  </div>

              </div>
            </div>
          </div>
        </Container>
      </div>
    </div>
  );
}
