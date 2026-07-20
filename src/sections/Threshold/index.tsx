"use client";

import { useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { Reveal } from "@/components/Reveal";
import { EASE_AIR } from "@/lib/motion";
import { ThresholdPanel } from "./ThresholdPanel";
import type { ThresholdPanelData } from "./types";

// The two-panel "which threshold are you at" split screen. Hovering
// either side visibly shifts attention to it — the image brightens and
// grows, the sibling dims and recedes — without ever animating a
// layout property; both panels stay a fixed 50% width the entire time
// (see constants.ts for why). Each panel gets its own cursor spotlight,
// same technique as the Home hero. The shared heading above both panels
// also answers back: hovering a side swaps it for that panel's own
// activeHeading, then settles back to the default on hover-end, so the
// whole section reads as reacting rather than just the one half you're
// pointing at.
//
// All three possible headings (default + each panel's activeHeading)
// stay mounted the whole time, stacked in the same slot and cross-faded
// by opacity — the same pattern as every other hover-driven swap on the
// site (CaseStudyCard's media, ThresholdPanel's own image/video). An
// AnimatePresence key-swap was tried first, but that depends on its
// exit animation actually finishing before the next heading mounts,
// which adds a failure mode this simpler always-mounted approach
// doesn't have.

export function Threshold({
  heading,
  panels,
}: {
  heading: string;
  panels: [ThresholdPanelData, ThresholdPanelData];
}) {
  const [active, setActive] = useState<"left" | "right" | null>(null);
  const prefersReducedMotion = useReducedMotion();

  return (
    <section>
      <div className="container-page pt-20 text-center">
        {prefersReducedMotion ? (
          <h2 className="font-display text-display-sm font-semibold text-soil">{heading}</h2>
        ) : (
          <div className="relative mx-auto min-h-[2.75em]">
            <motion.h2
              animate={{ opacity: active === null ? 1 : 0 }}
              transition={{ duration: 0.35, ease: EASE_AIR }}
              className="absolute inset-0 flex items-center justify-center px-4 font-display text-display-sm font-semibold text-soil"
            >
              {heading}
            </motion.h2>
            {panels.map(
              (panel) =>
                panel.activeHeading && (
                  <motion.h2
                    key={panel.key}
                    animate={{ opacity: active === panel.key ? 1 : 0 }}
                    transition={{ duration: 0.35, ease: EASE_AIR }}
                    className="absolute inset-0 flex items-center justify-center px-4 font-display text-display-sm font-semibold text-soil"
                  >
                    {panel.activeHeading}
                  </motion.h2>
                )
            )}
          </div>
        )}
      </div>
      <div className="mt-12 grid min-h-[70vh] sm:grid-cols-2">
        {panels.map((panel) => (
          <Reveal key={panel.key} delay={panel.key === "right" ? 0.12 : 0} className="h-full">
            <ThresholdPanel
              panel={panel}
              isActive={active === panel.key}
              siblingActive={active !== null && active !== panel.key}
              onHoverStart={() => setActive(panel.key)}
              onHoverEnd={() => setActive((current) => (current === panel.key ? null : current))}
            />
          </Reveal>
        ))}
      </div>
    </section>
  );
}
