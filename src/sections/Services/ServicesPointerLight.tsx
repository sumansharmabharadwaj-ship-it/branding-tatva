"use client";

import { useEffect, useRef } from "react";

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

  useEffect(() => {
    const pool = poolRef.current;
    const layer = pool?.parentElement;
    const section = layer?.parentElement;
    if (!pool || !layer || !section) return;

    const finePointer = window.matchMedia("(hover: hover) and (pointer: fine)");
    const reducedQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (!finePointer.matches) return;

    let frame = 0;

    const reduced = () =>
      reducedQuery.matches || document.documentElement.dataset.motion === "reduced";

    const onMove = (event: PointerEvent) => {
      if (reduced()) return;
      const rect = section.getBoundingClientRect();
      const x = event.clientX - rect.left;
      const y = event.clientY - rect.top;
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        pool.style.translate = `${x}px ${y}px`;
        layer.dataset.pointerLightAwake = "true";
      });
    };

    const onLeave = () => {
      cancelAnimationFrame(frame);
      delete layer.dataset.pointerLightAwake;
    };

    section.addEventListener("pointermove", onMove, { passive: true });
    section.addEventListener("pointerleave", onLeave);
    return () => {
      cancelAnimationFrame(frame);
      section.removeEventListener("pointermove", onMove);
      section.removeEventListener("pointerleave", onLeave);
    };
  }, []);

  return (
    <div aria-hidden="true" data-services-pointer-light={tone}>
      <span ref={poolRef} />
    </div>
  );
}
