"use client";

import { useEffect, useRef } from "react";

// Replaces the system cursor with a small warm spark, the bindu the whole
// visual system already revolves around (the Logo's convergence point,
// "attention is the first thing any brand has to earn") rather than an
// unrelated emoji. A soft glowing core with a trailing wisp stretched
// toward the direction of travel, like an ember drifting rather than a
// sticker pasted on top of whatever's underneath. Fixed positioning +
// raw clientX/clientY means it tracks the pointer correctly during
// scroll. Disabled on touch devices, and the reduced-motion CSS rule in
// globals.css zeroes out the transition/pulse durations.
//
// Over links/buttons the core grows and the trail backs off — a small
// magnetic-feeling cue that something is clickable, without the trail's
// motion-blur streak competing with the target itself.

const INTERACTIVE_SELECTOR = 'a, button, [role="button"], input, textarea, select';

export function SparkCursor() {
  const coreRef = useRef<HTMLDivElement>(null);
  const trailRef = useRef<HTMLDivElement>(null);
  const labelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const isFinePointer = window.matchMedia("(pointer: fine)").matches;
    if (!isFinePointer) return;

    const core = coreRef.current;
    const trail = trailRef.current;
    const label = labelRef.current;
    if (!core || !trail || !label) return;

    document.documentElement.classList.add("spark-cursor-active");

    let lastX = 0;
    let lastY = 0;
    let hovering = false;

    function handleMove(e: MouseEvent) {
      if (!core || !trail || !label) return;
      const dx = e.clientX - lastX;
      const dy = e.clientY - lastY;
      lastX = e.clientX;
      lastY = e.clientY;

      const speed = Math.min(Math.hypot(dx, dy), 60);
      const angle = speed > 1 ? Math.atan2(dy, dx) * (180 / Math.PI) : 0;
      const stretch = 1 + speed / 10;
      const coreScale = hovering ? 2.2 : 1;

      core.style.opacity = "1";
      core.style.transform = `translate3d(${e.clientX}px, ${e.clientY}px, 0) translate(-50%, -50%) scale(${coreScale})`;

      const trailOpacity = hovering ? 0 : Math.min(0.25 + speed / 45, 0.95);
      trail.style.opacity = String(trailOpacity);
      trail.style.transform = `translate3d(${e.clientX}px, ${e.clientY}px, 0) translate(-50%, -50%) rotate(${angle}deg) scaleX(${stretch})`;

      label.style.transform = `translate3d(${e.clientX}px, ${e.clientY}px, 0) translate(-50%, 22px)`;
    }
    window.addEventListener("mousemove", handleMove);

    function handleOver(e: MouseEvent) {
      const target = e.target as Element;
      if (target?.closest?.(INTERACTIVE_SELECTOR)) {
        hovering = true;
        core?.classList.add("spark-cursor-core--hover");
      }
      const labelSource = target?.closest?.("[data-cursor-label]");
      if (labelSource && label) {
        label.textContent = labelSource.getAttribute("data-cursor-label");
        label.classList.add("spark-cursor-label--visible");
      }
    }
    function handleOut(e: MouseEvent) {
      const target = e.target as Element;
      if (target?.closest?.(INTERACTIVE_SELECTOR)) {
        hovering = false;
        core?.classList.remove("spark-cursor-core--hover");
      }
      if (target?.closest?.("[data-cursor-label]")) {
        label?.classList.remove("spark-cursor-label--visible");
      }
    }
    document.addEventListener("mouseover", handleOver);
    document.addEventListener("mouseout", handleOut);

    return () => {
      window.removeEventListener("mousemove", handleMove);
      document.removeEventListener("mouseover", handleOver);
      document.removeEventListener("mouseout", handleOut);
      document.documentElement.classList.remove("spark-cursor-active");
    };
  }, []);

  return (
    <>
      <div ref={trailRef} aria-hidden="true" className="spark-cursor-trail" />
      <div ref={coreRef} aria-hidden="true" className="spark-cursor-core" />
      <div ref={labelRef} aria-hidden="true" className="spark-cursor-label" />
    </>
  );
}
