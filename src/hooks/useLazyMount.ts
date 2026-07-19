import { useEffect, useRef, useState, type RefObject } from "react";

// Gates a boolean to true the first time the returned ref's element
// nears the viewport, then disconnects — the same "don't pay for what's
// below the fold" pattern that ImageBreak, VideoBreak, and KenBurnsImage
// each implemented independently. A generous rootMargin default (600px)
// means content starts loading well before it's actually visible, so
// there's no visible pop-in as someone scrolls down.
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
    return () => observer.disconnect();
  }, [rootMargin]);

  return [ref, shouldLoad];
}
