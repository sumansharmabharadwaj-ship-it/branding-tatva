"use client";

import { useEffect, useState } from "react";
import { useReducedMotion } from "framer-motion";
import { ProcessJourney } from "./ProcessJourney";
import { ProcessHorizontalJourney } from "./ProcessHorizontalJourney";
import { Container } from "./Container";
import type { ProcessStage } from "@/data/process";

// The pinned horizontal treatment needs real width to read as "pages"
// rather than a cramped strip, and a pin that eats 6 screens of scroll on
// a phone is closer to a trap than storytelling — so it's gated to a
// wide viewport, on top of the existing prefers-reduced-motion check.
// Everyone else gets the vertical ProcessJourney treatment already built
// (a real, working experience on its own, not a degraded fallback).

const DESKTOP_QUERY = "(min-width: 1024px)";

export function ProcessSection({
  stages,
  elementColor,
}: {
  stages: ProcessStage[];
  elementColor: Record<string, string>;
}) {
  const prefersReducedMotion = useReducedMotion();
  const [isDesktop, setIsDesktop] = useState(false);

  useEffect(() => {
    setIsDesktop(window.matchMedia(DESKTOP_QUERY).matches);
  }, []);

  if (isDesktop && !prefersReducedMotion) {
    return <ProcessHorizontalJourney stages={stages} elementColor={elementColor} />;
  }

  return (
    <Container>
      <ProcessJourney stages={stages} elementColor={elementColor} />
    </Container>
  );
}
