"use client";

import { useRef, useState, type KeyboardEvent } from "react";
import { motion } from "framer-motion";
import { AnimatedStat } from "@/components/AnimatedStat";
import { useHydratedReducedMotion } from "@/hooks/useHydratedReducedMotion";
import { track } from "@/lib/analytics";
import { motionTokens } from "@/lib/motionTokens";

export type PerceptionRung = {
  label: string;
  text: string;
  visitorQuestion: string;
  brandingRole: string;
  marketingRole: string;
  asset: string;
  metric: string;
  implication: string;
};

export function MobilePerceptionClimb({ rungs }: { rungs: readonly PerceptionRung[] }) {
  const [activeIndex, setActiveIndex] = useState(0);
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const prefersReducedMotion = useHydratedReducedMotion();
  const activeRung = rungs[activeIndex] ?? rungs[0];
  const progress = rungs.length > 1 ? activeIndex / (rungs.length - 1) : 1;
  const trackInset = rungs.length > 0 ? 100 / (rungs.length * 2) : 0;
  const trackWidth = 100 - trackInset * 2;

  function selectRung(index: number, focus = false, source = "tab") {
    const nextIndex = (index + rungs.length) % rungs.length;
    setActiveIndex(nextIndex);
    if (focus) requestAnimationFrame(() => tabRefs.current[nextIndex]?.focus());
    track("capability_selected", {
      page: "services",
      capability: `Perception ladder: ${rungs[nextIndex]?.label ?? "rung"}`,
      source: `mobile_perception_${source}`,
    });
  }

  function handleTabKey(event: KeyboardEvent<HTMLButtonElement>, index: number) {
    let nextIndex: number | null = null;
    switch (event.key) {
      case "ArrowRight":
      case "ArrowDown":
        nextIndex = index + 1;
        break;
      case "ArrowLeft":
      case "ArrowUp":
        nextIndex = index - 1;
        break;
      case "Home":
        nextIndex = 0;
        break;
      case "End":
        nextIndex = rungs.length - 1;
        break;
      default:
        return;
    }
    event.preventDefault();
    selectRung(nextIndex, true, "keyboard");
  }

  return (
    <div
      data-perception-mobile-deck="true"
      data-active-perception-index={activeIndex}
      data-perception-stage-count={rungs.length}
      className="mt-10 lg:hidden"
    >
      <div
        data-perception-proof="true"
        className="rounded-2xl border border-ivory/12 bg-[rgba(18,24,28,0.58)] p-4 backdrop-blur-md"
      >
        <div className="flex items-center justify-between gap-4">
          <div>
            <p className="text-[0.58rem] font-medium uppercase tracking-[0.18em] text-ivory/48">One verified signal</p>
            <p className="mt-1 text-sm text-ivory/66">LinkedIn engagement rate across eight weeks.</p>
          </div>
          <span className="font-display text-3xl text-ivory/[0.07]" aria-hidden="true">↗</span>
        </div>
        <div className="mt-4 grid grid-cols-[1fr_auto_1fr] items-center gap-3">
          <div>
            <p data-perception-proof-value="start" className="font-display text-3xl font-normal text-ivory">
              <AnimatedStat value="0.71%" />
            </p>
            <p className="mt-1 text-[0.65rem] uppercase tracking-[0.14em] text-ivory/45">Started</p>
          </div>
          <span aria-hidden="true" className="text-lg text-[#A0A690]">→</span>
          <div className="text-right">
            <p data-perception-proof-value="finish" className="font-display text-3xl font-normal text-[#A0A690]">
              <AnimatedStat value="2.81%" />
            </p>
            <p className="mt-1 text-[0.65rem] uppercase tracking-[0.14em] text-ivory/45">Reached</p>
          </div>
        </div>
        <p className="mt-3 border-t border-ivory/10 pt-3 text-[0.67rem] leading-relaxed text-ivory/42">
          This is a campaign-performance signal. Brand recall itself requires separate research.
        </p>
      </div>

      <div className="mt-5 rounded-2xl border border-ivory/12 bg-[rgba(15,20,24,0.64)] p-1.5 backdrop-blur-md">
        <div
          role="tablist"
          aria-label="Perception ladder rungs"
          className="relative grid gap-1"
          style={{ gridTemplateColumns: `repeat(${rungs.length}, minmax(0, 1fr))` }}
        >
          <div
            aria-hidden="true"
            className="absolute top-[1.18rem] h-px bg-ivory/12"
            style={{ left: `${trackInset}%`, width: `${trackWidth}%` }}
          />
          <motion.div
            aria-hidden="true"
            className="absolute top-[1.18rem] h-px origin-left bg-[#A0A690]"
            style={{ left: `${trackInset}%`, width: `${trackWidth}%` }}
            animate={{ scaleX: progress }}
            transition={prefersReducedMotion ? { duration: 0 } : { duration: motionTokens.durationBase }}
          />
          {rungs.map((rung, index) => {
            const selected = activeIndex === index;
            return (
              <button
                key={rung.label}
                ref={(node) => {
                  tabRefs.current[index] = node;
                }}
                id={`perception-rung-tab-${index}`}
                type="button"
                role="tab"
                aria-label={`${String(index + 1).padStart(2, "0")} ${rung.label}`}
                aria-selected={selected}
                aria-controls={`perception-rung-panel-${index}`}
                tabIndex={selected ? 0 : -1}
                data-perception-rung-tab="true"
                onClick={() => selectRung(index)}
                onKeyDown={(event) => handleTabKey(event, index)}
                className={`relative z-10 flex min-h-14 flex-col items-center justify-center rounded-xl px-0.5 py-2 text-center transition-colors duration-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#A0A690] ${
                  selected ? "bg-ivory/[0.08] text-ivory" : "text-ivory/42 hover:bg-ivory/[0.04] hover:text-ivory/75"
                }`}
              >
                <span
                  aria-hidden="true"
                  className={`h-2.5 w-2.5 rounded-full border-2 bg-[#11171B] transition-[border-color,box-shadow] duration-300 ${
                    selected ? "border-[#A0A690] shadow-[0_0_10px_rgba(160,166,144,0.45)]" : "border-ivory/22"
                  }`}
                />
                <span className="mt-1.5 font-display text-xs leading-none">{String(index + 1).padStart(2, "0")}</span>
              </button>
            );
          })}
        </div>
      </div>

      <div className="relative mt-4 min-h-[31rem] sm:min-h-[25rem]">
        {rungs.map((rung, index) => {
          const selected = activeIndex === index;
          return (
            <motion.section
              key={rung.label}
              id={`perception-rung-panel-${index}`}
              role="tabpanel"
              aria-labelledby={`perception-rung-tab-${index}`}
              hidden={!selected}
              data-perception-rung-panel="true"
              data-perception-rung={rung.label.toLowerCase()}
              initial={false}
              animate={selected ? { opacity: 1, y: 0 } : { opacity: 0, y: 10 }}
              transition={prefersReducedMotion ? { duration: 0 } : { duration: motionTokens.durationBase }}
              className="rounded-2xl border border-ivory/12 bg-[rgba(18,25,30,0.72)] p-5 backdrop-blur-md"
              style={{ borderTopColor: selected ? "#A0A690" : undefined }}
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-[0.58rem] font-medium uppercase tracking-[0.18em] text-ivory/45">
                    Stage {String(index + 1).padStart(2, "0")}
                  </p>
                  <h3 className="mt-1 font-display text-4xl font-normal text-ivory">{rung.label}</h3>
                </div>
                <span className="font-display text-5xl leading-none text-ivory/[0.07]" aria-hidden="true">
                  {String(index + 1).padStart(2, "0")}
                </span>
              </div>

              <p className="mt-4 text-base leading-relaxed text-ivory/90">{rung.text}</p>

              <div data-perception-question="true" className="mt-4 rounded-xl border border-ivory/10 bg-black/10 p-3.5">
                <p className="text-[0.56rem] font-medium uppercase tracking-[0.15em] text-ivory/42">Buyer is asking</p>
                <p className="mt-1 font-display text-base leading-snug text-ivory">{rung.visitorQuestion}</p>
              </div>

              <div className="mt-3 grid grid-cols-2 gap-2">
                <div data-perception-branding-role="true" className="rounded-xl border border-ivory/10 bg-black/10 p-3">
                  <p className="text-[0.54rem] font-medium uppercase tracking-[0.13em] text-ivory/40">Branding role</p>
                  <p className="mt-1.5 text-xs leading-relaxed text-ivory/72">{rung.brandingRole}</p>
                </div>
                <div data-perception-marketing-role="true" className="rounded-xl border border-ivory/10 bg-black/10 p-3">
                  <p className="text-[0.54rem] font-medium uppercase tracking-[0.13em] text-ivory/40">Marketing role</p>
                  <p className="mt-1.5 text-xs leading-relaxed text-ivory/72">{rung.marketingRole}</p>
                </div>
                <div data-perception-asset="true" className="rounded-xl border border-ivory/10 bg-black/10 p-3">
                  <p className="text-[0.54rem] font-medium uppercase tracking-[0.13em] text-ivory/40">Asset to build</p>
                  <p className="mt-1.5 text-xs leading-relaxed text-ivory/72">{rung.asset}</p>
                </div>
                <div data-perception-metric="true" className="rounded-xl border border-ivory/10 bg-black/10 p-3">
                  <p className="text-[0.54rem] font-medium uppercase tracking-[0.13em] text-ivory/40">Useful metric</p>
                  <p className="mt-1.5 text-xs leading-relaxed text-ivory/72">{rung.metric}</p>
                </div>
              </div>

              <p className="mt-4 border-l-2 border-[#A0A690]/55 pl-4 text-sm leading-relaxed text-ivory/72">
                {rung.implication}
              </p>
              <a
                href="#health"
                className="link-underline mt-4 inline-flex min-h-11 items-center text-sm text-[#A0A690] transition-colors hover:text-ivory focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#A0A690]"
              >
                Find your own stage in the health check
              </a>
            </motion.section>
          );
        })}
      </div>

      <div className="mt-4 flex items-center justify-between gap-3">
        <p className="min-w-0 truncate text-xs uppercase tracking-[0.14em] text-ivory/45">
          {activeRung?.label}
        </p>
        <button
          type="button"
          data-perception-next="true"
          onClick={() => selectRung(activeIndex + 1, false, "next")}
          className="inline-flex min-h-11 shrink-0 items-center gap-2 rounded-full border border-[#A0A690]/45 px-4 py-2.5 text-sm text-[#A0A690] transition-colors hover:border-[#A0A690] hover:bg-[#A0A690]/10 hover:text-ivory focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#A0A690]"
        >
          Next stage
          <span aria-hidden="true">↑</span>
        </button>
      </div>
    </div>
  );
}
