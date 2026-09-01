"use client";

import { useEffect } from "react";
import { useHydratedReducedMotion } from "@/hooks/useHydratedReducedMotion";

const CHAPTER_SELECTOR = "[data-home-v4-chapter]";
const ARRIVAL_EVENT = "bt:home-scene-enter";
const ARRIVAL_DURATION_MS = 760;
const ELIGIBLE_QUERY =
  "(min-width: 1101px) and (min-height: 700px) and (pointer: fine)";

type SceneEnterDetail = {
  id?: string;
};

/**
 * Gives every desktop chapter one short exposure lift when the shared pacing
 * director marks it active. This runtime never moves the page or competes with
 * chapter controls; native scrolling and every visitor input remain untouched.
 */
export function HomeV4SceneRhythm() {
  const prefersReducedMotion = Boolean(useHydratedReducedMotion());

  useEffect(() => {
    const root = document.querySelector<HTMLElement>("[data-home-v4]");
    if (!root || prefersReducedMotion) return;

    const eligible = window.matchMedia(ELIGIBLE_QUERY);
    let arrivalTimer = 0;

    const chapters = () =>
      Array.from(root.querySelectorAll<HTMLElement>(CHAPTER_SELECTOR));

    const clearSceneState = () => {
      window.clearTimeout(arrivalTimer);
      arrivalTimer = 0;
      root.removeAttribute("data-scene-settling");
      chapters().forEach((chapter) => {
        chapter.removeAttribute("data-scene-target");
      });
    };

    const markArrival = (event: Event) => {
      if (!eligible.matches) {
        clearSceneState();
        return;
      }

      const id = (event as CustomEvent<SceneEnterDetail>).detail?.id;
      if (!id || id === "opening") return;
      const target = chapters().find(
        (chapter) =>
          chapter.dataset.homeV4Chapter === id ||
          chapter.dataset.homeChapter === id ||
          chapter.dataset.homeSection === id ||
          chapter.id === id,
      );
      if (!target || target.dataset.sceneTarget === "true") return;

      clearSceneState();
      root.setAttribute("data-scene-settling", "true");
      target.setAttribute("data-scene-target", "true");
      arrivalTimer = window.setTimeout(clearSceneState, ARRIVAL_DURATION_MS);
    };

    const updateEligibility = () => {
      if (!eligible.matches) clearSceneState();
    };

    window.addEventListener(ARRIVAL_EVENT, markArrival);
    eligible.addEventListener("change", updateEligibility);

    return () => {
      clearSceneState();
      window.removeEventListener(ARRIVAL_EVENT, markArrival);
      eligible.removeEventListener("change", updateEligibility);
    };
  }, [prefersReducedMotion]);

  return null;
}
