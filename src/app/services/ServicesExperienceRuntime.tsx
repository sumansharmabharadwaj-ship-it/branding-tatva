"use client";

import { useEffect } from "react";

const ACTIVE_ROOT_MARGIN = "-18% 0px -50% 0px";
const SCENE_SELECTOR = "[data-services-scene], #authority, #book";

function clamp(value: number, minimum = 0, maximum = 1) {
  return Math.min(maximum, Math.max(minimum, value));
}

function orderedScenes(main: HTMLElement) {
  const firstSection = main.querySelector<HTMLElement>("section");
  const candidates = [
    ...(firstSection ? [firstSection] : []),
    ...Array.from(main.querySelectorAll<HTMLElement>(SCENE_SELECTOR)),
  ];

  return Array.from(new Set(candidates)).sort((a, b) => {
    if (a === b) return 0;
    return a.compareDocumentPosition(b) & Node.DOCUMENT_POSITION_FOLLOWING ? -1 : 1;
  });
}

export function ServicesExperienceRuntime() {
  useEffect(() => {
    const main = document.getElementById("main-content");
    if (!main) return;

    const scenes = orderedScenes(main);
    if (!scenes.length) return;

    document.documentElement.dataset.servicesExperience = "active";
    const ratios = new Map<HTMLElement, number>();
    let activeIndex = 0;
    let frame = 0;

    scenes.forEach((scene, index) => {
      scene.dataset.servicesScrollScene =
        scene.dataset.servicesScene || scene.id || (index === 0 ? "opening" : `scene-${index + 1}`);
      scene.dataset.servicesScrollIndex = String(index);
      scene.style.setProperty("--services-scene-progress", index === 0 ? "0" : "-1");
    });

    function publishChapter(index: number) {
      if (index === activeIndex && document.documentElement.dataset.servicesActiveChapter) return;
      activeIndex = index;
      const chapter = scenes[index];
      const progress = scenes.length > 1 ? index / (scenes.length - 1) : 1;

      document.documentElement.dataset.servicesActiveChapter =
        chapter.dataset.servicesScrollScene || String(index + 1);
      document.documentElement.style.setProperty(
        "--services-chapter-progress",
        `${(progress * 100).toFixed(3)}%`,
      );
      document.documentElement.style.setProperty(
        "--services-chapter-angle",
        `${(progress * 360).toFixed(2)}deg`,
      );

      scenes.forEach((scene, sceneIndex) => {
        scene.dataset.servicesActive = sceneIndex === index ? "true" : "false";
      });
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          ratios.set(entry.target as HTMLElement, entry.isIntersecting ? entry.intersectionRatio : 0);
        });

        let nextIndex = activeIndex;
        let strongest = -1;
        scenes.forEach((scene, index) => {
          const ratio = ratios.get(scene) ?? 0;
          if (ratio > strongest) {
            strongest = ratio;
            nextIndex = index;
          }
        });
        publishChapter(nextIndex);
      },
      {
        rootMargin: ACTIVE_ROOT_MARGIN,
        threshold: [0, 0.08, 0.2, 0.38, 0.62],
      },
    );

    scenes.forEach((scene) => observer.observe(scene));

    function updateSceneProgress() {
      frame = 0;
      const viewportHeight = Math.max(1, window.innerHeight);

      scenes.forEach((scene) => {
        const bounds = scene.getBoundingClientRect();
        if (bounds.bottom < -viewportHeight || bounds.top > viewportHeight * 2) return;

        const progress = clamp((viewportHeight - bounds.top) / (viewportHeight + bounds.height));
        const centred = clamp(1 - Math.abs(progress - 0.5) * 2);
        scene.style.setProperty("--services-scene-progress", progress.toFixed(4));
        scene.style.setProperty("--services-scene-presence", centred.toFixed(4));
        scene.style.setProperty("--services-scene-signal-x", `${(progress * 100).toFixed(3)}%`);

        const phase = bounds.top > viewportHeight * 0.35 ? "entering" : bounds.bottom < viewportHeight * 0.65 ? "leaving" : "present";
        scene.dataset.servicesPhase = phase;
      });
    }

    function scheduleProgress() {
      if (frame) return;
      frame = window.requestAnimationFrame(updateSceneProgress);
    }

    publishChapter(0);
    updateSceneProgress();
    window.addEventListener("scroll", scheduleProgress, { passive: true });
    window.addEventListener("resize", scheduleProgress, { passive: true });
    window.addEventListener("pageshow", scheduleProgress);

    return () => {
      window.cancelAnimationFrame(frame);
      observer.disconnect();
      window.removeEventListener("scroll", scheduleProgress);
      window.removeEventListener("resize", scheduleProgress);
      window.removeEventListener("pageshow", scheduleProgress);
      delete document.documentElement.dataset.servicesExperience;
      delete document.documentElement.dataset.servicesActiveChapter;
      document.documentElement.style.removeProperty("--services-chapter-progress");
      document.documentElement.style.removeProperty("--services-chapter-angle");

      scenes.forEach((scene) => {
        delete scene.dataset.servicesScrollScene;
        delete scene.dataset.servicesScrollIndex;
        delete scene.dataset.servicesActive;
        delete scene.dataset.servicesPhase;
        scene.style.removeProperty("--services-scene-progress");
        scene.style.removeProperty("--services-scene-presence");
        scene.style.removeProperty("--services-scene-signal-x");
      });
    };
  }, []);

  return null;
}
