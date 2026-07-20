import type { RefObject } from "react";
import { useScroll, useTransform, type MotionValue } from "framer-motion";

// The vertical journey's progress line, tied to how far the section has
// been scrolled through rather than a fixed duration — draws in step
// with actually reading the list. The offset starts filling once the
// section is 80% into view and finishes with 60% still to scroll, so it
// tracks actually reading the list rather than the raw section bounds.
export function useVerticalLineProgress(ref: RefObject<HTMLElement | null>): MotionValue<string> {
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 0.8", "end 0.6"] });
  return useTransform(scrollYProgress, [0, 1], ["0%", "100%"]);
}
