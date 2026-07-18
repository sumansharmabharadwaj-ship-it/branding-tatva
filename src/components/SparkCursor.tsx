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

export function SparkCursor() {
  const coreRef = useRef<HTMLDivElement>(null);
  const trailRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const isFinePointer = window.matchMedia("(pointer: fine)").matches;
    if (!isFinePointer) return;

    const core = coreRef.current;
    const trail = trailRef.current;
    if (!core || !trail) return;

    document.documentElement.classList.add("spark-cursor-active");

    let lastX = 0;
    let lastY = 0;

    function handleMove(e: MouseEvent) {
      if (!core || !trail) return;
      const dx = e.clientX - lastX;
      const dy = e.clientY - lastY;
      lastX = e.clientX;
      lastY = e.clientY;

      const speed = Math.min(Math.hypot(dx, dy), 46);
      const angle = speed > 1.5 ? Math.atan2(dy, dx) * (180 / Math.PI) : 0;
      const stretch = 1 + speed / 22;

      core.style.opacity = "1";
      core.style.transform = `translate3d(${e.clientX}px, ${e.clientY}px, 0) translate(-50%, -50%)`;

      trail.style.opacity = String(Math.min(speed / 18, 0.75));
      trail.style.transform = `translate3d(${e.clientX}px, ${e.clientY}px, 0) translate(-50%, -50%) rotate(${angle}deg) scaleX(${stretch})`;
    }
    window.addEventListener("mousemove", handleMove);

    return () => {
      window.removeEventListener("mousemove", handleMove);
      document.documentElement.classList.remove("spark-cursor-active");
    };
  }, []);

  return (
    <>
      <div ref={trailRef} aria-hidden="true" className="spark-cursor-trail" />
      <div ref={coreRef} aria-hidden="true" className="spark-cursor-core" />
    </>
  );
}
