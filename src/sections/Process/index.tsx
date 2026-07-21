"use client";

import { useReducedMotion } from "framer-motion";
import { VerticalJourney } from "./VerticalJourney";
import { PinnedJourney } from "./PinnedJourney";
import { Container } from "@/components/Container";
import type { ProcessSectionProps } from "./types";

// Used to be a pinned horizontal scroll on wide viewports, with this
// vertical thread as the mobile/reduced-motion fallback. That pin was
// a GSAP ScrollTrigger `pin: true` — a separate trigger/pin-target
// pair with a scroll range cached once up front — and it depended on
// staying in sync with everything lazy-loaded around it — a real,
// repeated source of "content goes missing mid-scroll" reports that
// kept resisting targeted fixes (pin desync on tab backgrounding,
// stale trigger positions, environment-specific rendering quirks). It
// was removed entirely rather than continuing to patch around it.
//
// PinnedJourney reintroduces the pinned/full-bleed treatment for
// desktop, motion-allowed visitors, but on plain CSS
// `position: sticky` instead of a ScrollTrigger pin — see its own
// comment for why that avoids the failure class outright rather than
// just hoping it doesn't recur. VerticalJourney remains the mobile and
// reduced-motion experience, same split ElementsSection already
// established for its own pinned/fallback pair — it already reads as
// a complete, deliberate design on its own, not a degraded fallback.
export function ProcessSection({ stages, elementColor, dark }: ProcessSectionProps) {
  const prefersReducedMotion = useReducedMotion();

  if (prefersReducedMotion) {
    return (
      <Container>
        <VerticalJourney stages={stages} elementColor={elementColor} dark={dark} />
      </Container>
    );
  }

  return (
    <>
      <div className="hidden sm:block">
        <PinnedJourney stages={stages} elementColor={elementColor} />
      </div>
      <div className="sm:hidden">
        <Container>
          <VerticalJourney stages={stages} elementColor={elementColor} dark={dark} />
        </Container>
      </div>
    </>
  );
}
