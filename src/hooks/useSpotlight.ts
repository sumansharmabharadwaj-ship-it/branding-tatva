import { useEffect, useRef, type RefObject } from "react";

// A soft light that follows the cursor within a container, via a CSS
// custom property rather than React state — writing style directly to
// the DOM on every pointer move avoids a re-render per pixel of mouse
// travel, and the consuming radial-gradient just reads the variable, so
// only one composited layer ever repaints. Pair with a class that reads
// --spotlight-x/y (see .hero-spotlight in globals.css for the pattern).
// Originally built for the Home hero; extracted here once the Threshold
// split-screen needed the identical technique on each panel.
export function useSpotlight(ref: RefObject<HTMLElement | null>, disabled = false) {
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
