import { useEffect, useRef, type RefObject } from "react";

// A soft light that follows the cursor within a container, via a CSS
// custom property rather than React state — writing style directly to
// the DOM on every pointer move avoids a re-render per pixel of mouse
// travel, and the consuming radial-gradient just reads the variable, so
// only one composited layer ever repaints. Pair with a class that reads
// --spotlight-x/y (see .cursor-spotlight in globals.css for the pattern).
// Originally built for the Home hero; extracted here once the Threshold
// split-screen needed the identical technique on each panel.
export function useSpotlight(ref: RefObject<HTMLElement | null>, disabled = false) {
  const spotlightRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    const spotlight = spotlightRef.current;
    if (!el || !spotlight || disabled) return;

    // The property write itself is cheap, but getBoundingClientRect()
    // isn't — it forces a synchronous layout read, and doing that on
    // every raw mousemove (which can fire faster than one event per
    // frame) is unnecessary work regardless of how cheap the write after
    // it is. mousemove now only caches the latest pointer position; a
    // single rAF loop reads geometry and applies the update once per
    // frame, same pattern useTilt/SparkCursor already use.
    let pointer: { x: number; y: number } | null = null;
    let rafId: number | null = null;

    function tick() {
      rafId = null;
      if (!pointer || !el || !spotlight) return;
      const rect = el.getBoundingClientRect();
      const px = ((pointer.x - rect.left) / rect.width) * 100;
      const py = ((pointer.y - rect.top) / rect.height) * 100;
      spotlight.style.setProperty("--spotlight-x", `${px}%`);
      spotlight.style.setProperty("--spotlight-y", `${py}%`);
      spotlight.style.opacity = "1";
    }
    function handleMove(e: MouseEvent) {
      pointer = { x: e.clientX, y: e.clientY };
      if (rafId === null) rafId = requestAnimationFrame(tick);
    }
    function handleLeave() {
      pointer = null;
      spotlight!.style.opacity = "0";
    }

    el.addEventListener("mousemove", handleMove);
    el.addEventListener("mouseleave", handleLeave);
    return () => {
      el.removeEventListener("mousemove", handleMove);
      el.removeEventListener("mouseleave", handleLeave);
      if (rafId !== null) cancelAnimationFrame(rafId);
    };
  }, [ref, disabled]);

  return spotlightRef;
}
