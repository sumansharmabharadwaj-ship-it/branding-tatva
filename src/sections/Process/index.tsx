import { VerticalJourney } from "./VerticalJourney";
import { Container } from "@/components/Container";
import type { ProcessSectionProps } from "./types";

// Used to be a pinned horizontal scroll on wide viewports, with this
// vertical thread as the mobile/reduced-motion fallback. The pin was
// the only GSAP ScrollTrigger `pin: true` usage anywhere on the site,
// and it depends on precise scroll-position math staying in sync with
// everything lazy-loaded around it — a real, repeated source of
// "content goes missing mid-scroll" reports that kept resisting
// targeted fixes (pin desync on tab backgrounding, stale trigger
// positions, environment-specific rendering quirks). Removing the pin
// entirely removes that whole failure class at the root instead of
// continuing to patch around it. This vertical version already reads
// as a complete, deliberate design on its own — not a degraded
// fallback — so nothing is lost by using it everywhere.

export function ProcessSection({ stages, elementColor, dark }: ProcessSectionProps) {
  return (
    <Container>
      <VerticalJourney stages={stages} elementColor={elementColor} dark={dark} />
    </Container>
  );
}
