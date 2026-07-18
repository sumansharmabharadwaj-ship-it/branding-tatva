"use client";

import { useEffect, useRef } from "react";

// A bee that follows the mouse instead of the default cursor. Fixed
// positioning + raw clientX/clientY means it tracks the pointer correctly
// during scroll, with no extra scroll listener needed. The trailing feel
// comes from a CSS transition on transform, not a rAF loop, so it keeps
// working even if the tab is backgrounded. Disabled on touch devices (no
// cursor to replace there) and the CSS-level reduced-motion rule in
// globals.css already zeroes out the transition/wing/bob animation
// durations.
//
// Tilts toward the direction of travel and flutters continuously (not
// just a vertical bob), and sits at reduced opacity with a soft blur so
// it reads as ambient motion rather than a flat sticker pasted on top of
// whatever badge or button happens to be under the cursor.

export function BeeCursor() {
  const beeRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const isFinePointer = window.matchMedia("(pointer: fine)").matches;
    if (!isFinePointer) return;

    const bee = beeRef.current;
    if (!bee) return;

    document.documentElement.classList.add("bee-cursor-active");

    let lastX = 0;
    let lastY = 0;

    function handleMove(e: MouseEvent) {
      if (!bee) return;
      const dx = e.clientX - lastX;
      const dy = e.clientY - lastY;
      lastX = e.clientX;
      lastY = e.clientY;

      const speed = Math.min(Math.hypot(dx, dy), 40);
      const tilt = Math.max(-22, Math.min(22, dx * 1.4));

      bee.style.opacity = "1";
      bee.style.transform = `translate3d(${e.clientX}px, ${e.clientY}px, 0) translate(-50%, -60%) rotate(${tilt}deg) scale(${1 + speed / 200})`;
    }
    window.addEventListener("mousemove", handleMove);

    return () => {
      window.removeEventListener("mousemove", handleMove);
      document.documentElement.classList.remove("bee-cursor-active");
    };
  }, []);

  return (
    <div ref={beeRef} aria-hidden="true" className="bee-cursor bee-cursor-bob">
      <span className="bee-cursor-flutter">🐝</span>
    </div>
  );
}
