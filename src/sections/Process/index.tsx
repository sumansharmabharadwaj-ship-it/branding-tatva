"use client";

import { useEffect, useState } from "react";
import { useReducedMotion } from "framer-motion";
import { VerticalJourney } from "./VerticalJourney";
import { HorizontalJourney } from "./HorizontalJourney";
import { Container } from "@/components/Container";
import type { ProcessSectionProps } from "./types";
import { DESKTOP_QUERY } from "./constants";

// Picks between the two Process treatments: a pinned horizontal scroll
// on wide viewports (HorizontalJourney), a connected vertical thread
// everywhere else (VerticalJourney) — a real, working experience on its
// own, not a degraded fallback.

export function ProcessSection({ stages, elementColor }: ProcessSectionProps) {
  const prefersReducedMotion = useReducedMotion();
  const [isDesktop, setIsDesktop] = useState(false);

  useEffect(() => {
    setIsDesktop(window.matchMedia(DESKTOP_QUERY).matches);
  }, []);

  if (isDesktop && !prefersReducedMotion) {
    return <HorizontalJourney stages={stages} elementColor={elementColor} />;
  }

  return (
    <Container>
      <VerticalJourney stages={stages} elementColor={elementColor} />
    </Container>
  );
}
