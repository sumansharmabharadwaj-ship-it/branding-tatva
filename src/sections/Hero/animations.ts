import { useScroll, useTransform, type MotionValue } from "framer-motion";
import type { RefObject } from "react";
import {
  HERO_IMAGE_PARALLAX_RANGE,
  HERO_CONTENT_Y_RANGE,
  HERO_CONTENT_FADE_PROGRESS,
} from "./constants";

export type HeroParallax = {
  imageY: MotionValue<string>;
  contentOpacity: MotionValue<number>;
  contentY: MotionValue<string>;
};

// Scroll-linked parallax for the hero: the background drifts down faster
// than the text as the section scrolls out, and the text fades before it
// clears the viewport. One hook so the three related transforms share a
// single scroll-progress source instead of each component re-deriving it.
export function useHeroParallax(ref: RefObject<HTMLElement | null>): HeroParallax {
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });

  const imageY = useTransform(scrollYProgress, [0, 1], HERO_IMAGE_PARALLAX_RANGE);
  const contentOpacity = useTransform(scrollYProgress, HERO_CONTENT_FADE_PROGRESS, [1, 0]);
  const contentY = useTransform(scrollYProgress, [0, 1], HERO_CONTENT_Y_RANGE);

  return { imageY, contentOpacity, contentY };
}
