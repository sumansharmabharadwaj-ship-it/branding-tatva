import type { Transition, TargetAndTransition } from "framer-motion";

// The slow, continuous "never sitting completely still" drift used on
// every static photo panel that isn't already a hero with its own
// scroll-linked motion (PhotoHero's still-image path, KenBurnsImage,
// FeaturedWorkHero) — three components had converged on the exact same
// mirrored infinite-scale loop with only the scale target and duration
// actually differing per use, so those two knobs are the only things
// callers need to tune.

export type KenBurnsConfig = {
  scale?: number;
  duration?: number;
};

export type KenBurnsAnimation = {
  initial: TargetAndTransition;
  animate: TargetAndTransition;
  transition: Transition;
};

export function kenBurnsAnimation({ scale = 1.08, duration = 18 }: KenBurnsConfig = {}): KenBurnsAnimation {
  return {
    initial: { scale: 1 },
    animate: { scale },
    transition: { duration, repeat: Infinity, repeatType: "mirror", ease: "easeInOut" },
  };
}
