"use client";

import { useReducedMotion } from "framer-motion";
import { PinnedHold } from "./PinnedHold";
import { Threshold } from "@/sections/Threshold";

// Threshold's own panels are hover-driven, not click-driven, and
// nothing about position: sticky interferes with mouseenter/mouseleave
// (unlike a GSAP pin:true clone, sticky never detaches the element into
// its own layer) — the whole component drops into PinnedHold unmodified.
// Mobile stacks the two panels taller than one viewport (ThresholdPanel
// itself is min-h-[50svh] each below sm), so pinning there would clip
// content rather than just hold it; desktop/motion-allowed only, same
// convention as everywhere else. Uses the CSS-hidden dual-render
// pattern (not useMediaQuery-gated single-mount like PinnedVideoBreak)
// since Threshold's own videos are already lazy-mounted per panel, not
// eagerly autoplaying the way VideoBreak's is.
export function PinnedThreshold(props: React.ComponentProps<typeof Threshold>) {
  const prefersReducedMotion = useReducedMotion();

  if (prefersReducedMotion) {
    return <Threshold {...props} />;
  }

  return (
    <>
      <div className="hidden sm:block">
        <PinnedHold height="80vh">
          <Threshold {...props} />
        </PinnedHold>
      </div>
      <div className="sm:hidden">
        <Threshold {...props} />
      </div>
    </>
  );
}
