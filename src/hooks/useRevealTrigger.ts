import { useEffect, useRef, useState, type RefObject } from "react";
import { useLenis } from "@/components/SmoothScrollProvider";
import { registerScrollCheck } from "@/lib/scrollCheckRegistry";

// Drives every scroll-triggered entrance animation on the site (Reveal,
// ImageBreak, ClipReveal, PerspectiveReveal, ElementReveal, VideoBreak's
// quote fade). A real IntersectionObserver handles the common case while
// a position check follows both Lenis and native scroll as a redundant
// safety net.
//
// The important rule is that an element already passed by the viewport
// must settle into its readable state too. Requiring it to still overlap
// the viewport left headings at opacity: 0 after fast scrolls, hash jumps,
// browser restoration, and stitched visual audits. These entrances are
// one-time decoration, never a gate in front of content.
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

      // Reveal once the element enters the reading window OR has already
      // been passed. The latter prevents invisible blank space after a
      // fast scroll, direct anchor jump, browser Back restoration, or a
      // full-section screenshot that temporarily places the heading above
      // the viewport while the rest of its section is being captured.
      if (rect.top < window.innerHeight * 0.92) setVisible(true);
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setVisible(true);
      },
      { rootMargin }
    );
    observer.observe(el);

    checkPosition();
    const frame = window.requestAnimationFrame(checkPosition);
    const fallback = window.setTimeout(checkPosition, 800);

    let unsubscribe: (() => void) | undefined;
    if (lenis) {
      unsubscribe = registerScrollCheck(lenis, checkPosition);
    } else {
      window.addEventListener("scroll", checkPosition, { passive: true });
      unsubscribe = () => window.removeEventListener("scroll", checkPosition);
    }

    window.addEventListener("hashchange", checkPosition);
    window.addEventListener("pageshow", checkPosition);

    return () => {
      observer.disconnect();
      window.cancelAnimationFrame(frame);
      window.clearTimeout(fallback);
      unsubscribe?.();
      window.removeEventListener("hashchange", checkPosition);
      window.removeEventListener("pageshow", checkPosition);
    };
  }, [rootMargin, lenis, visible]);

  return [ref, visible];
}
