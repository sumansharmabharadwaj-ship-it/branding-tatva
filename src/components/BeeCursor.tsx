"use client";

import { useEffect, useRef } from "react";

// A bee that follows the mouse instead of the default cursor. Fixed
// positioning + raw clientX/clientY means it tracks the pointer correctly
// during scroll, with no extra scroll listener needed. The trailing feel
// comes from a CSS transition on transform, not a rAF loop, so it keeps
// working even if the tab is backgrounded. Disabled on touch devices (no
// cursor to replace there) and the CSS-level reduced-motion rule in
// globals.css already zeroes out the transition/bob animation durations.

export function BeeCursor() {
  const beeRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const isFinePointer = window.matchMedia("(pointer: fine)").matches;
    if (!isFinePointer) return;

    const bee = beeRef.current;
    if (!bee) return;

    document.documentElement.classList.add("bee-cursor-active");

    function handleMove(e: MouseEvent) {
      if (!bee) return;
      bee.style.opacity = "1";
      bee.style.transform = `translate3d(${e.clientX}px, ${e.clientY}px, 0) translate(-50%, -60%)`;
    }
    window.addEventListener("mousemove", handleMove);

    return () => {
      window.removeEventListener("mousemove", handleMove);
      document.documentElement.classList.remove("bee-cursor-active");
    };
  }, []);

  return (
    <div ref={beeRef} aria-hidden="true" className="bee-cursor bee-cursor-bob">
      🐝
    </div>
  );
}
