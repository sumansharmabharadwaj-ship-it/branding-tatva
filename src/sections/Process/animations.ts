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
//
// Both the tween's own target (`x`) and the trigger's `end` are
// functions, not one-off numbers computed at setup time — with
// invalidateOnRefresh: true, ScrollTrigger only re-runs whichever of
// these are functions when it recalculates on resize. A static `x` here
// would leave the *scrub target* frozen at the very first measurement
// while `end` (a function) picked up the new one, so a resize (window
// resize, or a font/content reflow changing track.scrollWidth) would
// desync exactly how far the track visually travels from how far the
// pinned scroll distance actually is — the track would either stop
// short of the last stage or keep scrolling after it's already fully
// in view.
export function initHorizontalScroll(section: HTMLElement, track: HTMLElement): gsap.Context {
  return gsap.context(() => {
    const getScrollDistance = () => track.scrollWidth - section.offsetWidth;
    if (getScrollDistance() <= 0) return;

    gsap.to(track, {
      x: () => -getScrollDistance(),
      ease: "none",
      scrollTrigger: {
        trigger: section,
        start: "top top",
        end: () => `+=${getScrollDistance()}`,
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
