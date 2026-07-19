import { useEffect, useRef, type RefObject } from "react";
import {
  useScroll,
  useTransform,
  useMotionValue,
  useSpring,
  type MotionValue,
} from "framer-motion";
import {
  HERO_IMAGE_PARALLAX_RANGE,
  HERO_CONTENT_Y_RANGE,
  HERO_CONTENT_FADE_PROGRESS,
  MOUSE_PARALLAX_RANGE_PX,
  MOUSE_PARALLAX_SPRING,
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

export type HeroMouseParallax = {
  x: MotionValue<number>;
  y: MotionValue<number>;
};

// A second, independent depth layer on top of the scroll parallax above:
// the background drifts a few pixels opposite the cursor, like the scene
// has real depth rather than being a flat photo behind the text. Spring-
// smoothed so it settles rather than snapping to the raw pointer
// position, and stacks on the SCROLL parallax's own motion.div (a
// separate nested element) rather than fighting it for the same
// transform.
export function useHeroMouseParallax(
  ref: RefObject<HTMLElement | null>,
  disabled = false
): HeroMouseParallax {
  const rawX = useMotionValue(0);
  const rawY = useMotionValue(0);
  const x = useSpring(rawX, MOUSE_PARALLAX_SPRING);
  const y = useSpring(rawY, MOUSE_PARALLAX_SPRING);

  useEffect(() => {
    const el = ref.current;
    if (!el || disabled) return;

    function handleMove(e: MouseEvent) {
      const rect = el!.getBoundingClientRect();
      const px = (e.clientX - rect.left) / rect.width - 0.5; // -0.5..0.5
      const py = (e.clientY - rect.top) / rect.height - 0.5;
      rawX.set(-px * MOUSE_PARALLAX_RANGE_PX);
      rawY.set(-py * MOUSE_PARALLAX_RANGE_PX);
    }
    function handleLeave() {
      rawX.set(0);
      rawY.set(0);
    }

    el.addEventListener("mousemove", handleMove);
    el.addEventListener("mouseleave", handleLeave);
    return () => {
      el.removeEventListener("mousemove", handleMove);
      el.removeEventListener("mouseleave", handleLeave);
    };
  }, [ref, rawX, rawY, disabled]);

  return { x, y };
}

// A soft light that follows the cursor within the hero, via a CSS
// custom property rather than React state — writing style directly to
// the DOM on every pointer move avoids a re-render per pixel of mouse
// travel, and the radial-gradient itself reads the variable, so only
// one composited layer ever repaints.
export function useHeroSpotlight(ref: RefObject<HTMLElement | null>, disabled = false) {
  const spotlightRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    const spotlight = spotlightRef.current;
    if (!el || !spotlight || disabled) return;

    // A single CSS custom property write per mousemove is cheap enough
    // not to need manual rAF coalescing — the browser's own event rate
    // already caps this reasonably, and skipping the extra rAF hop
    // keeps the update synchronous with the event that caused it.
    function handleMove(e: MouseEvent) {
      const rect = el!.getBoundingClientRect();
      const px = ((e.clientX - rect.left) / rect.width) * 100;
      const py = ((e.clientY - rect.top) / rect.height) * 100;
      spotlight!.style.setProperty("--spotlight-x", `${px}%`);
      spotlight!.style.setProperty("--spotlight-y", `${py}%`);
      spotlight!.style.opacity = "1";
    }
    function handleLeave() {
      spotlight!.style.opacity = "0";
    }

    el.addEventListener("mousemove", handleMove);
    el.addEventListener("mouseleave", handleLeave);
    return () => {
      el.removeEventListener("mousemove", handleMove);
      el.removeEventListener("mouseleave", handleLeave);
    };
  }, [ref, disabled]);

  return spotlightRef;
}
