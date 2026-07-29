import { useEffect, useRef, useState, type RefObject } from "react";
import { useLenis } from "@/components/SmoothScrollProvider";
import { registerScrollCheck } from "@/lib/scrollCheckRegistry";

// Gates a boolean to true the first time the returned ref's element
// nears the viewport, then disconnects — the same "don't pay for what's
// below the fold" pattern that ImageBreak, VideoBreak, and KenBurnsImage
// each implemented independently. A generous rootMargin default (600px)
// means content starts loading well before it's actually visible, so
// there's no visible pop-in as someone scrolls down.
//
// Every consumer of this hook renders *only* a flat gradient/color block
// until shouldLoad flips true — the actual photo or video is what's
// gated behind it. That means if the IntersectionObserver callback ever
// fails to fire for a given element, that section's real content never
// renders at all — not degraded, not delayed, a permanently blank
// colored rectangle where a photo should be. This used to only guard
// against that for elements already near the viewport at mount, on the
// theory that anything genuinely below the fold could just trust the
// observer. Confirmed otherwise: an element scrolled fully into view and
// held there for several seconds can still never fire its callback (IO
// delivery isn't guaranteed to be timely in every environment — a
// throttled/occluded document is one real case). So below-the-fold
// elements get their own safety net too, just a cheaper one than a
// blanket timer: re-check the element's actual position on every Lenis
// scroll tick (not a raw `scroll` listener — see SmoothScrollProvider's
// own comment on why native scroll events aren't trustworthy in a
// Lenis-driven page) and flip shouldLoad directly off real geometry the
// moment it's in range, independent of whether IO ever fires at all.
export function useLazyMount(rootMargin = "600px 0px"): [RefObject<HTMLDivElement | null>, boolean] {
  const ref = useRef<HTMLDivElement>(null);
  const [shouldLoad, setShouldLoad] = useState(false);
  const lenis = useLenis();

  useEffect(() => {
    const el = ref.current;
    if (!el || shouldLoad) return;

    function checkPosition() {
      if (!el) return;
      const rect = el.getBoundingClientRect();
      if (rect.top < window.innerHeight * 1.5 && rect.bottom > -window.innerHeight * 0.5) {
        setShouldLoad(true);
      }
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setShouldLoad(true);
      },
      { rootMargin }
    );
    observer.observe(el);

    checkPosition();
    const fallback = setTimeout(checkPosition, 800);
    const unsubscribe = lenis ? registerScrollCheck(lenis, checkPosition) : undefined;

    return () => {
      observer.disconnect();
      clearTimeout(fallback);
      unsubscribe?.();
    };
  }, [rootMargin, lenis, shouldLoad]);

  return [ref, shouldLoad];
}
