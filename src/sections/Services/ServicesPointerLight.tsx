"use client";

import { useEffect, useRef } from "react";
import { useHydratedReducedMotion } from "@/hooks/useHydratedReducedMotion";

/**
 * A pointer following light pool for a Services chapter: the visitor's
 * cursor carries a soft patch of light across the section, the same
 * grammar as Contact's scene sunlight but self contained — one listener
 * on the parent section, one compositor driven layer, zero coupling to
 * any scroll runtime.
 *
 * Mount it as a direct child of the `position: relative` section, after
 * the section's other background layers and before its content plane,
 * so the light paints over the atmosphere and under the reading
 * surfaces. The wrapper takes no children and never wraps content (the
 * standing reveal wrapper rule).
 *
 * Movement rides the `translate` property with a long organic
 * transition, so the pool trails the cursor like light through water
 * rather than tracking it mechanically. Fine pointer devices only;
 * reduced motion (either signal) leaves the layer dormant — the
 * chapter's designed background never depended on it.
 */
export function ServicesPointerLight({ tone = "sun" }: { tone?: "sun" | "ember" }) {
  const poolRef = useRef<HTMLSpanElement>(null);
  const reducedMotion = useHydratedReducedMotion();

  useEffect(() => {
    const pool = poolRef.current;
    const layer = pool?.parentElement;
    const section = layer?.parentElement;
    if (!pool || !layer || !section || reducedMotion) return;

    const finePointer = window.matchMedia("(hover: hover) and (pointer: fine)");
    let frame = 0;
    let clientX = 0;
    let clientY = 0;

    const updateLight = () => {
      frame = 0;
      if (document.hidden || !finePointer.matches) return;
      const rect = section.getBoundingClientRect();
      pool.style.translate = `${clientX - rect.left}px ${clientY - rect.top}px`;
      if (layer.dataset.pointerLightAwake !== "true") layer.dataset.pointerLightAwake = "true";
    };

    const onMove = (event: PointerEvent) => {
      if (document.hidden || !finePointer.matches || event.pointerType === "touch") return;
      clientX = event.clientX;
      clientY = event.clientY;
      // High frequency pointers can dispatch several events between paints.
      // Read the latest geometry once, beside the single visual update.
      if (!frame) frame = requestAnimationFrame(updateLight);
    };

    const onLeave = () => {
      cancelAnimationFrame(frame);
      frame = 0;
      delete layer.dataset.pointerLightAwake;
    };

    const onVisibilityChange = () => {
      if (document.hidden) onLeave();
    };

    section.addEventListener("pointermove", onMove, { passive: true });
    section.addEventListener("pointerleave", onLeave);
    finePointer.addEventListener("change", onLeave);
    document.addEventListener("visibilitychange", onVisibilityChange);
    return () => {
      onLeave();
      section.removeEventListener("pointermove", onMove);
      section.removeEventListener("pointerleave", onLeave);
      finePointer.removeEventListener("change", onLeave);
      document.removeEventListener("visibilitychange", onVisibilityChange);
    };
  }, [reducedMotion]);

  return (
    <div aria-hidden="true" data-services-pointer-light={tone}>
      <span ref={poolRef} />
    </div>
  );
}
