"use client";

import { useEffect } from "react";
import { useHydratedReducedMotion } from "@/hooks/useHydratedReducedMotion";

const SEAM_QUERY = '.home-v4-handoff:not([data-home-handoff-preserve="true"])';
const ELIGIBLE_QUERY = "(min-width: 901px) and (min-height: 640px) and (pointer: fine)";

function clamp(value: number, minimum = 0, maximum = 1) {
  return Math.min(maximum, Math.max(minimum, value));
}

/**
 * Gives the zero-height chapter seams one shared, reversible scroll signal.
 * Chapters retain ownership of their content and interactions; this director
 * only paints the instant where two authored frames meet.
 */
export function HomeV4SeamDirector() {
  const prefersReducedMotion = Boolean(useHydratedReducedMotion());

  useEffect(() => {
    const rootElement = document.querySelector<HTMLElement>("[data-home-v4]");
    if (!rootElement || prefersReducedMotion) return;
    const root = rootElement;

    const eligible = window.matchMedia(ELIGIBLE_QUERY);
    const seams = Array.from(root.querySelectorAll<HTMLElement>(SEAM_QUERY));
    let frame = 0;
    let previousY = window.scrollY;
    let previousTime = performance.now();
    let direction = 1;

    function clearSeam(seam: HTMLElement) {
      delete seam.dataset.seamVisible;
      [
        "--home-handoff-presence",
        "--home-handoff-opacity",
        "--home-handoff-shift",
        "--home-handoff-scale",
        "--home-handoff-star-opacity",
        "--home-handoff-star-scale",
        "--home-handoff-dash",
      ].forEach((property) => seam.style.removeProperty(property));
    }

    function render(now: number) {
      frame = 0;
      if (!eligible.matches) {
        delete root.dataset.seamReady;
        seams.forEach(clearSeam);
        return;
      }

      root.dataset.seamReady = "true";
      const viewport = Math.max(1, window.innerHeight);
      const currentY = window.scrollY;
      const elapsed = Math.max(16, now - previousTime);
      const delta = currentY - previousY;
      if (Math.abs(delta) > 0.2) direction = delta > 0 ? 1 : -1;
      const velocity = clamp(Math.abs(delta) / elapsed / 1.8);

      seams.forEach((seam) => {
        const top = seam.getBoundingClientRect().top;
        const presence = clamp(1 - Math.abs(top - viewport * 0.5) / (viewport * 0.62));
        const phase = clamp((viewport - top) / viewport);

        if (presence <= 0.002) {
          if (seam.dataset.seamVisible === "true") {
            seam.dataset.seamVisible = "false";
            seam.style.setProperty("--home-handoff-presence", "0");
            seam.style.setProperty("--home-handoff-opacity", "0");
          }
          return;
        }

        seam.dataset.seamVisible = "true";
        seam.style.setProperty("--home-handoff-presence", presence.toFixed(4));
        seam.style.setProperty(
          "--home-handoff-opacity",
          (presence * (0.46 + velocity * 0.24)).toFixed(4),
        );
        seam.style.setProperty(
          "--home-handoff-shift",
          `${((phase - 0.5) * 5 + direction * velocity * -1.2).toFixed(3)}vw`,
        );
        seam.style.setProperty("--home-handoff-scale", (0.92 + presence * 0.08).toFixed(4));
        seam.style.setProperty(
          "--home-handoff-star-opacity",
          (0.2 + presence * 0.68).toFixed(4),
        );
        seam.style.setProperty(
          "--home-handoff-star-scale",
          (0.76 + presence * 0.48).toFixed(4),
        );
        seam.style.setProperty("--home-handoff-dash", `${(phase * direction * -72).toFixed(2)}px`);
      });

      previousY = currentY;
      previousTime = now;
    }

    function schedule() {
      if (!frame) frame = window.requestAnimationFrame(render);
    }

    schedule();
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule, { passive: true });
    eligible.addEventListener("change", schedule);

    return () => {
      window.cancelAnimationFrame(frame);
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
      eligible.removeEventListener("change", schedule);
      delete root.dataset.seamReady;
      seams.forEach(clearSeam);
    };
  }, [prefersReducedMotion]);

  return null;
}
