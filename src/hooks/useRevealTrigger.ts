import { useEffect, useRef, useState, type RefObject } from "react";
import { useLenis } from "@/components/SmoothScrollProvider";

// Drives every scroll-triggered entrance animation on the site (Reveal,
// ImageBreak, ClipReveal, PerspectiveReveal, ElementReveal, VideoBreak's
// quote fade) — previously each of these used Framer Motion's own
// whileInView/viewport prop directly, which depends entirely on
// Framer Motion's internal IntersectionObserver firing. That's the
// exact same failure class already found and fixed twice elsewhere on
// this site (useLazyMount's image/video loading, AnimatedStat's
// count-up): every one of these components starts at opacity: 0 (or
// scaled/blurred/offset) and has nothing that guarantees it ever
// reaches its visible end state if the observer callback doesn't fire
// for a given element. Since literally every major text block and
// section entrance on the site goes through one of these six
// components, this was the most likely explanation for "a section
// just never shows up while scrolling" reports that persisted even
// after the load-time and pin-related fixes.
//
// Same dual-redundant mechanism as useLazyMount: a real
// IntersectionObserver for the common case, plus a Lenis-scroll-tick
// position check (not a raw `scroll` listener — see
// SmoothScrollProvider's comment on why) as a fallback that doesn't
// depend on the observer at all. Once triggered, state never resets —
// these are one-time entrances, not repeating animations.
export function useRevealTrigger(rootMargin = "0px 0px -80px 0px"): [RefObject<HTMLDivElement | null>, boolean] {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  const lenis = useLenis();

  useEffect(() => {
    const el = ref.current;
    if (!el || visible) return;

    function checkPosition() {
      if (!el) return;
      const rect = el.getBoundingClientRect();
      if (rect.top < window.innerHeight * 0.92 && rect.bottom > window.innerHeight * 0.08) {
        setVisible(true);
      }
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setVisible(true);
      },
      { rootMargin }
    );
    observer.observe(el);

    checkPosition();
    const fallback = setTimeout(checkPosition, 800);
    const unsubscribe = lenis?.on("scroll", checkPosition);

    return () => {
      observer.disconnect();
      clearTimeout(fallback);
      unsubscribe?.();
    };
  }, [rootMargin, lenis, visible]);

  return [ref, visible];
}
