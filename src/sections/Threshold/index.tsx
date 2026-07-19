"use client";

import { useState } from "react";
import { Reveal } from "@/components/Reveal";
import { ThresholdPanel } from "./ThresholdPanel";
import type { ThresholdPanelData } from "./types";

// The two-panel "which threshold are you at" split screen. Hovering
// either side visibly shifts attention to it — the image brightens and
// grows, the sibling dims and recedes — without ever animating a
// layout property; both panels stay a fixed 50% width the entire time
// (see constants.ts for why). Each panel gets its own cursor spotlight,
// same technique as the Home hero.

export function Threshold({
  heading,
  panels,
}: {
  heading: string;
  panels: [ThresholdPanelData, ThresholdPanelData];
}) {
  const [active, setActive] = useState<"left" | "right" | null>(null);

  return (
    <section>
      <h2 className="container-page pt-20 text-center font-display text-display-sm font-semibold text-soil">
        {heading}
      </h2>
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
