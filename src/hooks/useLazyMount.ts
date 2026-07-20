import { useEffect, useRef, useState, type RefObject } from "react";

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
// fails to fire for a given element (a tab that loads already scrolled
// to an anchor link, a browser edge case, anything that resolves the
// observer before this effect finishes subscribing), that section's
// real content never renders at all — not degraded, not delayed, a
// permanently blank colored rectangle where a photo should be.
//
// The safety net only applies to elements already at or near the
// viewport when this mounts — that's the one case where "the observer
// should have fired almost immediately but didn't" is actually
// diagnosable. Anything genuinely below the fold is left to the
// observer alone; giving every element on the page the same timer
// regardless of position would just eagerly load the whole page on a
// fixed clock, which is the exact network cost this hook exists to
// avoid.
export function useLazyMount(rootMargin = "600px 0px"): [RefObject<HTMLDivElement | null>, boolean] {
  const ref = useRef<HTMLDivElement>(null);
  const [shouldLoad, setShouldLoad] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setShouldLoad(true);
          observer.disconnect();
        }
      },
      { rootMargin }
    );
    observer.observe(el);

    const rect = el.getBoundingClientRect();
    const nearViewport = rect.top < window.innerHeight * 1.5 && rect.bottom > -window.innerHeight * 0.5;
    const fallback = nearViewport ? setTimeout(() => setShouldLoad(true), 800) : undefined;

    return () => {
      observer.disconnect();
      if (fallback) clearTimeout(fallback);
    };
  }, [rootMargin]);

  return [ref, shouldLoad];
}
