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
// motion-blur streak competing with the target itself. Over a full-bleed
// photo/video break (ImageBreak/VideoBreak, tagged data-cursor-media),
// which isn't clickable, the core instead widens into a soft, wide
// ambient halo — a gentler scale and no label, distinct from the tight
// bright glow that means "this responds to a click." Interactive
// targets take priority if the two ever overlap.

const INTERACTIVE_SELECTOR = 'a, button, [role="button"], input, textarea, select';
const MEDIA_SELECTOR = "[data-cursor-media]";
const TRAIL_LERP = 0.35;

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
    let pointerX = 0;
    let pointerY = 0;
    let trailX = 0;
    let trailY = 0;
    let hasMoved = false;
    let hovering = false;
    let overMedia = false;
    let angle = 0;
    let stretch = 1;
    let trailOpacity = 0;

    function handleMove(e: MouseEvent) {
      if (!core || !label) return;
      const dx = e.clientX - lastX;
      const dy = e.clientY - lastY;
      lastX = e.clientX;
      lastY = e.clientY;
      pointerX = e.clientX;
      pointerY = e.clientY;
      if (!hasMoved) {
        trailX = pointerX;
        trailY = pointerY;
        hasMoved = true;
      }

      const speed = Math.min(Math.hypot(dx, dy), 60);
      angle = speed > 1 ? Math.atan2(dy, dx) * (180 / Math.PI) : angle;
      stretch = 1 + speed / 10;
      trailOpacity = hovering || overMedia ? 0 : Math.min(0.25 + speed / 45, 0.95);
      const coreScale = hovering ? 2.2 : overMedia ? 1.5 : 1;

      core.style.opacity = "1";
      core.style.transform = `translate3d(${pointerX}px, ${pointerY}px, 0) translate(-50%, -50%) scale(${coreScale})`;
      label.style.transform = `translate3d(${pointerX}px, ${pointerY}px, 0) translate(-50%, 22px)`;
    }
    window.addEventListener("mousemove", handleMove);

    // The trail only reads as smooth if its on-screen position eases on
    // every animation frame. It used to instead sit behind a CSS
    // `transition: transform`, restarted on every raw mousemove event —
    // since mousemove fires far more often than that transition's own
    // 320ms duration, each new event cancelled the previous tween
    // mid-flight and started a new one, which is what made the whole
    // custom cursor feel laggy/stuttery rather than smooth. Lerping
    // trailX/Y toward the real pointer position here every rAF tick
    // (same technique already driving Lenis's scroll easing and
    // TiltCard's spring elsewhere on this site) decouples the trail's
    // rendered position from the input event rate. The speed/angle/
    // stretch/opacity values stay driven by real per-event pointer
    // velocity computed above, so how "fast" the trail reads doesn't
    // change — only its position is now frame-smoothed instead of
    // CSS-smoothed.
    let rafId = requestAnimationFrame(function tick() {
      if (trail && hasMoved) {
        trailX += (pointerX - trailX) * TRAIL_LERP;
        trailY += (pointerY - trailY) * TRAIL_LERP;
        trail.style.opacity = String(trailOpacity);
        trail.style.transform = `translate3d(${trailX}px, ${trailY}px, 0) translate(-50%, -50%) rotate(${angle}deg) scaleX(${stretch})`;
      }
      rafId = requestAnimationFrame(tick);
    });

    function handleOver(e: MouseEvent) {
      const target = e.target as Element;
      if (target?.closest?.(INTERACTIVE_SELECTOR)) {
        hovering = true;
        core?.classList.add("spark-cursor-core--hover");
      } else if (target?.closest?.(MEDIA_SELECTOR)) {
        overMedia = true;
        core?.classList.add("spark-cursor-core--media");
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
      } else if (target?.closest?.(MEDIA_SELECTOR)) {
        overMedia = false;
        core?.classList.remove("spark-cursor-core--media");
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
      cancelAnimationFrame(rafId);
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
