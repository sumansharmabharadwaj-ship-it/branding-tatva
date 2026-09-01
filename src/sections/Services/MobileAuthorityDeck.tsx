"use client";

import { useRef, useState, type KeyboardEvent } from "react";
import { motion } from "framer-motion";
import { ElementGlyph } from "@/components/ElementGlyph";
import type { Element } from "@/data/elements";
import { useHydratedReducedMotion } from "@/hooks/useHydratedReducedMotion";
import { track } from "@/lib/analytics";
import { motionTokens } from "@/lib/motionTokens";

export type AuthorityLayer = {
  slug: Element["slug"];
  label: string;
  line: string;
  skipped: string;
  color: string;
};

export function MobileAuthorityDeck({
  layers,
  wavePath,
}: {
  layers: readonly AuthorityLayer[];
  wavePath: string;
}) {
  const [activeIndex, setActiveIndex] = useState(0);
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const prefersReducedMotion = useHydratedReducedMotion();
  const activeLayer = layers[activeIndex] ?? layers[0];

  function selectLayer(index: number, focus = false, source = "tab") {
    const nextIndex = (index + layers.length) % layers.length;
    setActiveIndex(nextIndex);
    if (focus) requestAnimationFrame(() => tabRefs.current[nextIndex]?.focus());
    track("capability_selected", {
      page: "services",
      capability: `Authority: ${layers[nextIndex]?.label ?? "layer"}`,
      source: `mobile_authority_${source}`,
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
        nextIndex = layers.length - 1;
        break;
      default:
        return;
    }
    event.preventDefault();
    selectLayer(nextIndex, true, "keyboard");
  }

  return (
    <div
      data-authority-mobile-deck="true"
      data-active-index={activeIndex}
      className="mt-9 lg:hidden"
    >
      <div className="border-b border-ivory/10 pb-4" aria-hidden="true">
        <div className="flex items-center justify-between gap-4">
          <p className="text-[0.6rem] font-medium uppercase tracking-[0.2em] text-ivory/50">
            What must exist before promotion
          </p>
          <span className="font-display text-sm text-sandstone/80">
            {String(activeIndex + 1).padStart(2, "0")} / {String(layers.length).padStart(2, "0")}
          </span>
        </div>
        <svg viewBox="0 0 400 80" className="mt-2 h-14 w-full" fill="none">
          <motion.g
            data-authority-mobile-wave="true"
            animate={{
              scaleY: 0.22 + (activeIndex / Math.max(1, layers.length - 1)) * 0.78,
              opacity: 0.48 + (activeIndex / Math.max(1, layers.length - 1)) * 0.52,
            }}
            transition={prefersReducedMotion ? { duration: 0 } : { duration: motionTokens.durationBase }}
            style={{ transformOrigin: "50% 50%" }}
          >
            <path d={wavePath} stroke="#C6A97A" strokeWidth="1.6" strokeLinecap="round" opacity="0.9" />
            <path d={wavePath} stroke="#C6A97A" strokeWidth="5" strokeLinecap="round" opacity="0.12" />
          </motion.g>
        </svg>
      </div>

      <div
        role="tablist"
        aria-label="Brand authority layers"
        className="mt-5 grid grid-cols-5 gap-1.5 rounded-2xl border border-ivory/12 bg-[rgba(11,14,16,0.52)] p-1.5 backdrop-blur-md"
      >
        {layers.map((layer, index) => {
          const selected = activeIndex === index;
          return (
            <button
              key={layer.slug}
              ref={(node) => {
                tabRefs.current[index] = node;
              }}
              id={`authority-layer-tab-${layer.slug}`}
              type="button"
              role="tab"
              aria-label={`${String(index + 1).padStart(2, "0")} ${layer.label}`}
              aria-selected={selected}
              aria-controls={`authority-layer-panel-${layer.slug}`}
              tabIndex={selected ? 0 : -1}
              data-authority-layer-tab="true"
              onClick={() => selectLayer(index)}
              onKeyDown={(event) => handleTabKey(event, index)}
              className={`relative flex min-h-12 flex-col items-center justify-center gap-1 rounded-xl px-1 py-2 transition-colors duration-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-sandstone ${
                selected ? "bg-ivory/[0.08] text-ivory" : "text-ivory/45 hover:bg-ivory/[0.04] hover:text-ivory/80"
              }`}
            >
              <span
                aria-hidden="true"
                className="h-1.5 w-1.5 rounded-full"
                style={{ backgroundColor: layer.color, opacity: selected ? 1 : 0.45 }}
              />
              <span className="font-display text-sm leading-none">
                {String(index + 1).padStart(2, "0")}
              </span>
              {selected && (
                <motion.span
                  layoutId="authority-mobile-active-layer"
                  aria-hidden="true"
                  className="absolute inset-x-2 bottom-0 h-px"
                  style={{ backgroundColor: layer.color }}
                  transition={prefersReducedMotion ? { duration: 0 } : { duration: motionTokens.durationFast }}
                />
              )}
            </button>
          );
        })}
      </div>

      <div className="relative mt-4 min-h-[17rem]">
        {layers.map((layer, index) => {
          const selected = activeIndex === index;
          return (
            <motion.section
              key={layer.slug}
              id={`authority-layer-panel-${layer.slug}`}
              role="tabpanel"
              aria-labelledby={`authority-layer-tab-${layer.slug}`}
              hidden={!selected}
              data-authority-layer-panel="true"
              data-authority-layer={layer.slug}
              initial={false}
              animate={
                selected
                  ? { opacity: 1, clipPath: "inset(0% 0 0% 0 round 1rem)", filter: "blur(0px)" }
                  : { opacity: 0, clipPath: "inset(0 0 72% 0 round 1rem)", filter: "blur(4px)" }
              }
              transition={prefersReducedMotion ? { duration: 0 } : { duration: motionTokens.durationBase }}
              className="rounded-2xl border border-ivory/12 bg-[rgba(10,13,15,0.58)] p-5 backdrop-blur-md"
              style={{ borderTopColor: layer.color }}
            >
              <div className="flex items-start justify-between gap-5">
                <div className="flex items-center gap-3">
                  <ElementGlyph slug={layer.slug} className="h-7 w-7 shrink-0" style={{ color: layer.color }} />
                  <div>
                    <p className="text-[0.58rem] font-medium uppercase tracking-[0.18em] text-ivory/45">
                      Active layer
                    </p>
                    <h3 className="mt-1 font-display text-3xl font-normal text-ivory">{layer.label}</h3>
                  </div>
                </div>
                <span className="font-display text-5xl leading-none text-ivory/[0.08]" aria-hidden="true">
                  {String(index + 1).padStart(2, "0")}
                </span>
              </div>
              <p className="mt-6 text-base leading-relaxed text-ivory/92">{layer.line}</p>
              <p className="mt-4 border-t border-ivory/10 pt-4 text-sm leading-relaxed text-ivory/62">
                {layer.skipped}
              </p>
            </motion.section>
          );
        })}
      </div>

      <div data-authority-mobile-controls="true" className="mt-4 flex items-center justify-between gap-3">
        <button
          type="button"
          onClick={() => selectLayer(activeIndex - 1, false, "previous")}
          className="inline-flex min-h-11 items-center gap-2 rounded-full border border-ivory/18 px-4 py-2.5 text-sm text-ivory/72 transition-colors hover:border-ivory/38 hover:text-ivory focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sandstone"
        >
          <span aria-hidden="true">←</span>
          Previous
        </button>
        <p className="min-w-0 truncate text-center text-xs uppercase tracking-[0.14em] text-ivory/48">
          {activeLayer?.label}
        </p>
        <button
          type="button"
          onClick={() => selectLayer(activeIndex + 1, false, "next")}
          className="inline-flex min-h-11 items-center gap-2 rounded-full border border-sandstone/42 px-4 py-2.5 text-sm text-sandstone transition-colors hover:border-sandstone hover:bg-sandstone/10 hover:text-ivory focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sandstone"
        >
          Next
          <span aria-hidden="true">→</span>
        </button>
      </div>
    </div>
  );
}
