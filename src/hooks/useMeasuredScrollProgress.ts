"use client";

import { type RefObject, useEffect, useState } from "react";
import { useReducedMotion } from "framer-motion";

// The Scroll OS's shared measured progress hook (docs/SCROLL_OS.md §9):
// one rect based progress source for every Level C storytelling scene,
// rAF coalesced, reduced motion resolves instantly to the finished
// state so no content ever hides behind an animation that will never
// run. For per frame style writes (the hottest scenes), keep writing
// styles directly to nodes instead of consuming this state — the
// 0.002 threshold here keeps React renders sparse for everything else.
export function useMeasuredScrollProgress(ref: RefObject<HTMLElement | null>) {
  const reduceMotion = useReducedMotion();
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (reduceMotion) {
      setProgress(1);
      return;
    }

    let frame = 0;

    const update = () => {
      const element = ref.current;
      if (!element) return;
      const rect = element.getBoundingClientRect();
      const travel = Math.max(1, rect.height - window.innerHeight);
      const next = Math.min(1, Math.max(0, -rect.top / travel));
      setProgress((previous) => (Math.abs(previous - next) > 0.002 ? next : previous));
    };

    const requestUpdate = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(update);
    };

    update();
    window.addEventListener("scroll", requestUpdate, { passive: true });
    window.addEventListener("resize", requestUpdate);

    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", requestUpdate);
      window.removeEventListener("resize", requestUpdate);
    };
  }, [ref, reduceMotion]);

  return progress;
}
