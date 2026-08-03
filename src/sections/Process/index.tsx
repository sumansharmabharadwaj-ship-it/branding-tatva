"use client";

import { VerticalJourney } from "./VerticalJourney";
import { Container } from "@/components/Container";
import type { ProcessSectionProps } from "./types";

export function ProcessSection({ stages, elementColor, dark }: ProcessSectionProps) {
  return (
    <Container>
      <VerticalJourney stages={stages} elementColor={elementColor} dark={dark} />
    </Container>
  );
}
