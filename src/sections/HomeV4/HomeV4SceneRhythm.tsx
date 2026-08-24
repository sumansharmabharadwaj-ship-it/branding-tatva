"use client";

import { useEffect } from "react";
import { useLenis } from "@/components/SmoothScrollProvider";
import { useHydratedReducedMotion } from "@/hooks/useHydratedReducedMotion";

const CHAPTER_SELECTOR = "[data-home-v4-chapter]";
const SETTLE_DELAY_MS = 150;
const SNAP_DURATION_SECONDS = 0.62;

/**
 * Keeps visitor-led scrolling intact, then gently resolves an in-between
 * resting position to the nearest complete desktop scene. Nothing is trapped
 * or autoplayed: a new wheel, pointer, touch, or keyboard gesture immediately
 * wins over the settle animation.
 */
export function HomeV4SceneRhythm() {
  const lenis = useLenis();
  const prefersReducedMotion = Boolean(useHydratedReducedMotion());

  useEffect(() => {
    const root = document.querySelector<HTMLElement>("[data-home-v4]");
    if (!root || prefersReducedMotion) return;

    const eligible = window.matchMedia(
      "(min-width: 1101px) and (min-height: 700px) and (pointer: fine)",
    );
    let settleTimer = 0;
    let releaseTimer = 0;
    let settling = false;

    const chapters = () =>
      Array.from(document.querySelectorAll<HTMLElement>(CHAPTER_SELECTOR));

    const clearSceneState = () => {
      root.removeAttribute("data-scene-settling");
      chapters().forEach((chapter) => {
        chapter.removeAttribute("data-scene-target");
      });
    };

    const release = () => {
      window.clearTimeout(releaseTimer);
      settling = false;
      clearSceneState();
    };

    const settle = () => {
      settleTimer = 0;
      if (!eligible.matches || settling) return;

      const focused = document.activeElement;
      if (
        focused instanceof HTMLElement &&
        focused.matches("input, textarea, select, [contenteditable='true']")
      ) {
        return;
      }

      const scenes = chapters();
      if (scenes.length < 2) return;

      const pageY = window.scrollY;
      const viewport = window.innerHeight;
      const positions = scenes.map((scene) => ({
        scene,
        top: pageY + scene.getBoundingClientRect().top,
      }));
      const last = positions.at(-1);

      // Once the final invitation is leaving, the footer should remain freely
      // reachable rather than being pulled back into the last chapter.
      if (last && pageY > last.top + viewport * 0.56) return;

      const nearest = positions.reduce((best, candidate) =>
        Math.abs(candidate.top - pageY) < Math.abs(best.top - pageY)
          ? candidate
          : best,
      );
      const distance = Math.abs(nearest.top - pageY);

      if (distance < 3 || distance > viewport * 0.54) return;

      settling = true;
      root.setAttribute("data-scene-settling", "true");
      nearest.scene.setAttribute("data-scene-target", "true");

      window.clearTimeout(releaseTimer);
      releaseTimer = window.setTimeout(release, 950);

      if (lenis) {
        lenis.scrollTo(nearest.scene, {
          duration: SNAP_DURATION_SECONDS,
          easing: (value) => 1 - Math.pow(1 - value, 4),
          onComplete: release,
        });
      } else {
        window.scrollTo({ top: nearest.top, behavior: "smooth" });
      }
    };

    const scheduleSettle = () => {
      if (!eligible.matches || settling) return;
      window.clearTimeout(settleTimer);
      settleTimer = window.setTimeout(settle, SETTLE_DELAY_MS);
    };

    const yieldToVisitor = () => {
      window.clearTimeout(settleTimer);
      if (!settling) return;

      if (lenis) lenis.scrollTo(window.scrollY, { immediate: true });
      release();
    };

    const onKeydown = (event: KeyboardEvent) => {
      if (
        ["ArrowDown", "ArrowUp", "PageDown", "PageUp", "Home", "End", " "].includes(
          event.key,
        )
      ) {
        yieldToVisitor();
      }
    };

    window.addEventListener("scroll", scheduleSettle, { passive: true });
    window.addEventListener("wheel", yieldToVisitor, { passive: true });
    window.addEventListener("touchstart", yieldToVisitor, { passive: true });
    window.addEventListener("pointerdown", yieldToVisitor, { passive: true });
    window.addEventListener("keydown", onKeydown);

    return () => {
      window.clearTimeout(settleTimer);
      window.clearTimeout(releaseTimer);
      clearSceneState();
      window.removeEventListener("scroll", scheduleSettle);
      window.removeEventListener("wheel", yieldToVisitor);
      window.removeEventListener("touchstart", yieldToVisitor);
      window.removeEventListener("pointerdown", yieldToVisitor);
      window.removeEventListener("keydown", onKeydown);
    };
  }, [lenis, prefersReducedMotion]);

  return null;
}
