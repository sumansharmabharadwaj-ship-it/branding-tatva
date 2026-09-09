"use client";

import { RootSystem } from "./RootSystem";
import type { ProcessSectionProps } from "./types";

// Keep the same decisions and deliverables available in every motion mode.
// RootSystem disables its image and selection movement for reduced motion.
export function ProcessSection({ stages }: ProcessSectionProps) {
  return <RootSystem stages={stages} />;
}
