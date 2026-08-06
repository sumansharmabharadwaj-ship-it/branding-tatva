"use client";

import { useRef, useState, type KeyboardEvent } from "react";
import { motion } from "framer-motion";
import { useHydratedReducedMotion } from "@/hooks/useHydratedReducedMotion";
import { track } from "@/lib/analytics";
import { motionTokens } from "@/lib/motionTokens";
import { ELEMENT_HEX } from "@/lib/sectionWash";

const PATHS = [
  {
    id: "generic",
    label: "Positioned generically",
    shortLabel: "Generic future",
    result: "Recognition resets",
    color: ELEMENT_HEX.earth,
  },
  {
    id: "distinct",
    label: "Positioned distinctly",
    shortLabel: "Distinct future",
    result: "Recognition compounds",
    color: ELEMENT_HEX.water,
  },
] as const;

type PathId = (typeof PATHS)[number]["id"];

export function MobileStakesDeck({
  origins,
  generic,
  distinct,
}: {
  origins: readonly string[];
  generic: readonly string[];
  distinct: readonly string[];
}) {
  const [activePath, setActivePath] = useState<PathId>("generic");
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const prefersReducedMotion = useHydratedReducedMotion();
  const activeIndex = PATHS.findIndex((path) => path.id === activePath);

  function selectPath(index: number, focus = false, source = "tab") {
    const nextIndex = (index + PATHS.length) % PATHS.length;
    const path = PATHS[nextIndex];
    setActivePath(path.id);
    if (focus) requestAnimationFrame(() => tabRefs.current[nextIndex]?.focus());
    track("capability_selected", {
      page: "services",
      capability: `Stakes: ${path.label}`,
      source: `mobile_stakes_${source}`,
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
        nextIndex = PATHS.length - 1;
        break;
      default:
        return;
    }
    event.preventDefault();
    selectPath(nextIndex, true, "keyboard");
  }

  return (
    <div
      data-stakes-mobile-deck="true"
      data-active-stakes-path={activePath}
      className="mt-10 lg:hidden"
    >
      <div
        data-stakes-origins="true"
        className="rounded-2xl border border-ivory/12 bg-[rgba(19,21,22,0.5)] p-4 backdrop-blur-md"
      >
        <div className="flex items-end justify-between gap-4">
          <div>
            <p className="text-[0.58rem] font-medium uppercase tracking-[0.18em] text-ivory/48">
              Where the weak path begins
            </p>
            <p className="mt-1 font-display text-xl font-normal text-ivory">Four early decisions.</p>
          </div>
          <span className="font-display text-3xl text-ivory/[0.08]" aria-hidden="true">
            01–04
          </span>
        </div>
        <ol className="mt-4 grid grid-cols-2 gap-px overflow-hidden rounded-xl border border-ivory/10 bg-ivory/10">
          {origins.map((origin, index) => (
            <li
              key={origin}
              data-stakes-origin="true"
              className="min-h-[6.4rem] bg-[rgba(13,15,16,0.94)] p-3.5"
            >
              <span className="font-display text-xs text-sandstone/75">{String(index + 1).padStart(2, "0")}</span>
              <p className="mt-2 text-[0.78rem] leading-relaxed text-ivory/78">{origin}</p>
            </li>
          ))}
        </ol>
      </div>

      <div
        role="tablist"
        aria-label="Brand positioning outcomes"
        className="mt-4 grid grid-cols-2 gap-2 rounded-2xl border border-ivory/12 bg-[rgba(13,15,16,0.68)] p-1.5 backdrop-blur-md"
      >
        {PATHS.map((path, index) => {
          const selected = activePath === path.id;
          return (
            <button
              key={path.id}
              ref={(node) => {
                tabRefs.current[index] = node;
              }}
              id={`stakes-path-tab-${path.id}`}
              type="button"
              role="tab"
              aria-selected={selected}
              aria-controls={`stakes-path-panel-${path.id}`}
              tabIndex={selected ? 0 : -1}
              data-stakes-path-tab="true"
              onClick={() => selectPath(index)}
              onKeyDown={(event) => handleTabKey(event, index)}
              className={`relative min-h-12 overflow-hidden rounded-xl px-3 py-2.5 text-center text-xs font-medium uppercase tracking-[0.11em] transition-colors duration-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-sandstone ${
                selected ? "bg-ivory/[0.08] text-ivory" : "text-ivory/48 hover:bg-ivory/[0.04] hover:text-ivory/80"
              }`}
            >
              <span className="relative">{path.shortLabel}</span>
              {selected && (
                <motion.span
                  layoutId="mobile-stakes-active-path"
                  aria-hidden="true"
                  className="absolute inset-x-4 bottom-0 h-px"
                  style={{ backgroundColor: path.color }}
                  transition={prefersReducedMotion ? { duration: 0 } : { duration: motionTokens.durationFast }}
                />
              )}
            </button>
          );
        })}
      </div>

      <div className="relative mt-4 min-h-[29rem]">
        {PATHS.map((path, index) => {
          const selected = activePath === path.id;
          const statements = path.id === "generic" ? generic : distinct;
          return (
            <motion.section
              key={path.id}
              id={`stakes-path-panel-${path.id}`}
              role="tabpanel"
              aria-labelledby={`stakes-path-tab-${path.id}`}
              hidden={!selected}
              data-stakes-path-panel="true"
              data-stakes-path={path.id}
              initial={false}
              animate={selected ? { opacity: 1, y: 0 } : { opacity: 0, y: 10 }}
              transition={prefersReducedMotion ? { duration: 0 } : { duration: motionTokens.durationBase }}
              className="rounded-2xl border border-ivory/12 bg-[rgba(20,22,23,0.74)] p-5 backdrop-blur-md"
              style={{ borderTopColor: path.color }}
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-[0.58rem] font-medium uppercase tracking-[0.18em] text-ivory/45">
                    Future {String(index + 1).padStart(2, "0")}
                  </p>
                  <h3 className="mt-1 font-display text-3xl font-normal leading-tight text-ivory">{path.label}</h3>
                </div>
                <span className="font-display text-5xl leading-none text-ivory/[0.07]" aria-hidden="true">
                  {String(index + 1).padStart(2, "0")}
                </span>
              </div>

              <ol className="mt-6 space-y-0">
                {statements.map((statement, statementIndex) => (
                  <li
                    key={statement}
                    data-stakes-outcome="true"
                    className="grid grid-cols-[1.5rem_1fr] gap-3 border-t border-ivory/10 py-3.5 first:border-t-0 first:pt-0"
                  >
                    <span className="pt-0.5 font-display text-xs" style={{ color: path.color }}>
                      {String(statementIndex + 1).padStart(2, "0")}
                    </span>
                    <p className="text-[0.95rem] leading-relaxed text-ivory/88">{statement}</p>
                  </li>
                ))}
              </ol>

              <div className="mt-2 border-t border-ivory/10 pt-4">
                <div className="flex items-center justify-between gap-4">
                  <span className="text-[0.58rem] font-medium uppercase tracking-[0.16em] text-ivory/45">
                    Recognition effect
                  </span>
                  <span className="font-display text-lg" style={{ color: path.color }}>
                    {path.result}
                  </span>
                </div>
                <div className="mt-3 h-px overflow-hidden bg-ivory/10">
                  <motion.div
                    aria-hidden="true"
                    className="h-full origin-left"
                    style={{ backgroundColor: path.color }}
                    initial={false}
                    animate={{ scaleX: path.id === "generic" ? 0.28 : 1 }}
                    transition={prefersReducedMotion ? { duration: 0 } : { duration: motionTokens.durationBase }}
                  />
                </div>
              </div>
            </motion.section>
          );
        })}
      </div>

      <button
        type="button"
        data-stakes-path-switch="true"
        onClick={() => selectPath(activeIndex === 0 ? 1 : 0, false, "switch")}
        className="mt-4 flex min-h-12 w-full items-center justify-between rounded-full border border-ivory/18 px-5 py-3 text-sm text-ivory/72 transition-colors hover:border-ivory/38 hover:bg-ivory/[0.04] hover:text-ivory focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sandstone"
      >
        <span>{activeIndex === 0 ? "See what changes when the position is distinct" : "Review the generic future"}</span>
        <span aria-hidden="true">{activeIndex === 0 ? "→" : "←"}</span>
      </button>
    </div>
  );
}
