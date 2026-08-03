"use client";

import { useReducedMotion } from "framer-motion";
import { VerticalJourney } from "./VerticalJourney";
import { RootSystem } from "./RootSystem";
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
// PinnedJourney reintroduces the pinned/full-bleed treatment on plain
// CSS `position: sticky` instead of a ScrollTrigger pin — see its own
// comment for why that avoids the failure class outright rather than
// just hoping it doesn't recur. That sticky approach doesn't depend on
// viewport width to be reliable (it's what made it safe to trust again
// after the old GSAP-pin version), so it's no longer desktop-only:
// direct feedback confirmed the mobile-only VerticalJourney fallback
// read as a plain, dated version of the section sitting right next to
// PinnedJourney's richer per-stage crossfade, not as a deliberate
// mobile treatment. VerticalJourney is now reserved for
// prefers-reduced-motion only, where a pinned/scrubbed section would
// be exactly the kind of motion that preference exists to turn off.
export function ProcessSection({ stages, elementColor, dark }: ProcessSectionProps) {
  const prefersReducedMotion = useReducedMotion();

  if (prefersReducedMotion) {
    return (
      <Container>
        <VerticalJourney stages={stages} elementColor={elementColor} dark={dark} />
      </Container>
    );
  }

  return <RootSystem stages={stages} />;
}
