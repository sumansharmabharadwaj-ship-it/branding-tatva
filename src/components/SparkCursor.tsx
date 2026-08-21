"use client";

import { useEffect, useRef } from "react";
import { useMotionPreference } from "@/components/MotionPreference";

const INTERACTIVE_SELECTOR =
  'a, button, [role="button"], input, textarea, select, summary, [data-magnetic]';

export function SparkCursor() {
  const { pref } = useMotionPreference();
  const sunRef = useRef<HTMLDivElement>(null);
  const labelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const finePointer = window.matchMedia("(pointer: fine)");
    const osReduced = window.matchMedia("(prefers-reduced-motion: reduce)");
    const sun = sunRef.current;
    const label = labelRef.current;
    if (!sun || !label) return;

    let active = false;

    function sync() {
      active = finePointer.matches && !osReduced.matches && pref !== "reduced";
      document.documentElement.classList.toggle("sun-cursor-active", active);
      if (!active) {
        sun.style.opacity = "0";
        label.style.opacity = "0";
      }
    }

    function move(event: PointerEvent) {
      if (!active) return;
      sun.style.opacity = "1";
      sun.style.transform =
        `translate3d(${event.clientX}px, ${event.clientY}px, 0) translate(-50%, -50%)`;
      label.style.transform =
        `translate3d(${event.clientX}px, ${event.clientY}px, 0) translate(-50%, 24px)`;
    }

    function over(event: PointerEvent) {
      if (!active || !(event.target instanceof Element)) return;
      const target = event.target.closest<HTMLElement>(INTERACTIVE_SELECTOR);
      sun.classList.toggle("spark-cursor-core--hover", Boolean(target));
      const copy =
        target?.dataset.cursorLabel ||
        target?.getAttribute("aria-label") ||
        "";
      label.textContent = copy.slice(0, 24);
      label.classList.toggle("spark-cursor-label--visible", Boolean(copy));
    }

    function out(event: PointerEvent) {
      if (!(event.relatedTarget instanceof Element)) {
        sun.style.opacity = "0";
        label.classList.remove("spark-cursor-label--visible");
      }
    }

    sync();
    finePointer.addEventListener("change", sync);
    osReduced.addEventListener("change", sync);
    window.addEventListener("pointermove", move, { passive: true });
    document.addEventListener("pointerover", over, { passive: true });
    document.addEventListener("pointerout", out, { passive: true });

    return () => {
      finePointer.removeEventListener("change", sync);
      osReduced.removeEventListener("change", sync);
      window.removeEventListener("pointermove", move);
      document.removeEventListener("pointerover", over);
      document.removeEventListener("pointerout", out);
      document.documentElement.classList.remove("sun-cursor-active");
    };
  }, [pref]);

  return (
    <>
      <div ref={sunRef} aria-hidden="true" className="spark-cursor-core sun-cursor" />
      <div ref={labelRef} aria-hidden="true" className="spark-cursor-label" />
    </>
  );
}
