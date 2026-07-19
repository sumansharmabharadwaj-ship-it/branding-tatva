import type { RefObject } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useScroll, useTransform, type MotionValue } from "framer-motion";

gsap.registerPlugin(ScrollTrigger);

// Desktop-only pinned horizontal scroll through the process stages — the
// section holds still while the viewport moves through it, one stage per
// "screen" of scroll, like turning pages rather than reading a list.
// gsap.context() scopes every ScrollTrigger/tween this creates so
// ctx.revert() tears them all down cleanly on unmount, which matters here
// specifically because Next's client-side navigation would otherwise leave
// stale pinned-scroll instances behind on the next page.
export function initHorizontalScroll(section: HTMLElement, track: HTMLElement): gsap.Context {
  return gsap.context(() => {
    const scrollDistance = track.scrollWidth - section.offsetWidth;
    if (scrollDistance <= 0) return;

    gsap.to(track, {
      x: -scrollDistance,
      ease: "none",
      scrollTrigger: {
        trigger: section,
        start: "top top",
        end: () => `+=${scrollDistance}`,
        scrub: 1,
        pin: true,
        invalidateOnRefresh: true,
      },
    });
  }, section);
}

// The vertical journey's progress line, tied to how far the section has
// been scrolled through rather than a fixed duration — draws in step
// with actually reading the list. The offset starts filling once the
// section is 80% into view and finishes with 60% still to scroll, so it
// tracks actually reading the list rather than the raw section bounds.
export function useVerticalLineProgress(ref: RefObject<HTMLElement | null>): MotionValue<string> {
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 0.8", "end 0.6"] });
  return useTransform(scrollYProgress, [0, 1], ["0%", "100%"]);
}
