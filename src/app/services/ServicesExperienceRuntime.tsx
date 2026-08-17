"use client";

import { useEffect } from "react";

const ACTIVE_ROOT_MARGIN = "-18% 0px -50% 0px";
const SCENE_SELECTOR = "[data-services-scene], #authority, #book";
const SCENE_PROGRESS_EVENT = "bt:services-scene-progress";
const CHAPTERS_READY_EVENT = "bt:services-chapters-ready";

const CHAPTER_META: Record<string, { id: string; label: string }> = {
  opening: { id: "services-opening", label: "Opening signal" },
  situation: { id: "situation", label: "Your situation" },
  offerings: { id: "offerings", label: "Six disciplines" },
  desire: { id: "desire", label: "Package paths" },
  "verified-outcome": { id: "verified-outcome", label: "Verified outcome" },
  authority: { id: "authority", label: "Brand foundation" },
  stakes: { id: "stakes", label: "Positioning cost" },
  education: { id: "education", label: "Perception" },
  deliverables: { id: "deliverables", label: "The archive" },
  imagine: { id: "imagine", label: "Project map" },
  health: { id: "health", label: "Health check" },
  audit: { id: "audit", label: "Recognition audit" },
  book: { id: "book", label: "Strategy room" },
};

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

function sceneKey(scene: HTMLElement, index: number) {
  return scene.dataset.servicesScene || scene.id || (index === 0 ? "opening" : `scene-${index + 1}`);
}

export function ServicesExperienceRuntime() {
  useEffect(() => {
    const main = document.getElementById("main-content");
    if (!main) return;

    const scenes = orderedScenes(main);
    const firstScene = scenes[0];
    if (!firstScene) return;
    const hero = firstScene;

    document.documentElement.dataset.servicesExperience = "active";
    const ratios = new Map<HTMLElement, number>();
    const signalLayers = new Map<HTMLElement, HTMLSpanElement>();
    const generatedIds = new Set<HTMLElement>();
    const heroMedia = Array.from(
      hero.querySelectorAll<HTMLElement>(":scope > img, :scope > video"),
    );
    const heroHeading = hero.querySelector<HTMLElement>("h1");
    const heroIndex = hero.querySelector<HTMLElement>("ol");
    const heroAperture = document.createElement("span");
    const heroFragments = document.createElement("span");
    let activeIndex = 0;
    let frame = 0;
    let hashRestoreFrame = 0;

    hero.dataset.servicesHeroScene = "true";
    heroMedia.forEach((media) => {
      media.dataset.servicesHeroMedia = "true";
    });
    if (heroHeading) heroHeading.dataset.servicesHeroHeading = "true";
    if (heroIndex) heroIndex.dataset.servicesHeroIndex = "true";

    heroAperture.dataset.servicesHeroAperture = "true";
    heroAperture.setAttribute("aria-hidden", "true");
    heroFragments.dataset.servicesHeroFragments = "true";
    heroFragments.setAttribute("aria-hidden", "true");
    for (let index = 0; index < 3; index += 1) {
      const fragment = document.createElement("i");
      fragment.dataset.servicesHeroFragment = String(index + 1);
      heroFragments.appendChild(fragment);
    }
    hero.append(heroFragments, heroAperture);

    scenes.forEach((scene, index) => {
      const key = sceneKey(scene, index);
      const meta = CHAPTER_META[key] ?? {
        id: scene.id || `services-scene-${index + 1}`,
        label: `Chapter ${index + 1}`,
      };

      scene.dataset.servicesScrollScene = key;
      scene.dataset.servicesScrollIndex = String(index);
      scene.dataset.servicesChapterLabel = meta.label;
      if (!scene.id) {
        scene.id = meta.id;
        generatedIds.add(scene);
      }
      scene.style.setProperty("--services-scene-progress", index === 0 ? "0" : "-1");

      const signal = document.createElement("span");
      signal.dataset.servicesSceneSignal = "true";
      signal.setAttribute("aria-hidden", "true");
      scene.appendChild(signal);
      signalLayers.set(scene, signal);
    });

    const chapterDetail = scenes.map((scene, index) => ({
      id: scene.id,
      href: `#${scene.id}`,
      label: scene.dataset.servicesChapterLabel || `Chapter ${index + 1}`,
      scene: scene.dataset.servicesScrollScene || `scene-${index + 1}`,
    }));
    document.documentElement.dataset.servicesChapterCount = String(chapterDetail.length);
    window.dispatchEvent(
      new CustomEvent(CHAPTERS_READY_EVENT, {
        detail: { chapters: chapterDetail },
      }),
    );

    // A package preview can expand immediately after a chapter jump because
    // the new scroll position publishes a different journey beat. That layout
    // commit used to push the following Verified outcome scene hundreds of
    // pixels below its anchor after the browser had already aligned it. Give
    // React two paints to settle, then perform one final native alignment.
    // The retry stays inside three animation frames, so it cannot fight a
    // visitor who starts scrolling after the chapter has arrived.
    function restoreRequestedHash() {
      window.cancelAnimationFrame(hashRestoreFrame);
      const requestedHash = window.location.hash.slice(1);
      if (!requestedHash || !scenes.some((scene) => scene.id === requestedHash)) return;

      hashRestoreFrame = window.requestAnimationFrame(() => {
        hashRestoreFrame = window.requestAnimationFrame(() => {
          hashRestoreFrame = window.requestAnimationFrame(() => {
            document.getElementById(requestedHash)?.scrollIntoView({ behavior: "auto", block: "start" });
          });
        });
      });
    }

    restoreRequestedHash();
    window.addEventListener("hashchange", restoreRequestedHash);

    function publishChapter(index: number) {
      if (index === activeIndex && document.documentElement.dataset.servicesActiveChapter) return;
      const chapter = scenes[index] ?? scenes[0];
      if (!chapter) return;

      activeIndex = index;
      const progress = scenes.length > 1 ? index / (scenes.length - 1) : 1;

      document.documentElement.dataset.servicesActiveChapter =
        chapter.dataset.servicesScrollScene || String(index + 1);
      document.documentElement.dataset.servicesActiveChapterId = chapter.id;
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

    function updateHeroProgress(viewportHeight: number) {
      const bounds = hero.getBoundingClientRect();
      const exitProgress = clamp(-bounds.top / Math.max(1, viewportHeight * 0.78));
      const resolveProgress = clamp((window.scrollY + 24) / Math.max(1, viewportHeight * 0.34));
      const copyExit = clamp((exitProgress - 0.48) / 0.52);
      const apertureProgress = clamp((exitProgress - 0.22) / 0.78);

      hero.style.setProperty(
        "--services-hero-scale",
        (1.075 - resolveProgress * 0.055 + exitProgress * 0.035).toFixed(4),
      );
      hero.style.setProperty(
        "--services-hero-media-y",
        `${(-3.4 * exitProgress).toFixed(3)}%`,
      );
      hero.style.setProperty(
        "--services-hero-copy-y",
        `${(-20 * copyExit).toFixed(2)}px`,
      );
      hero.style.setProperty(
        "--services-hero-copy-opacity",
        (1 - copyExit * 0.76).toFixed(4),
      );
      hero.style.setProperty(
        "--services-hero-index-x",
        `${(18 * (1 - resolveProgress)).toFixed(2)}px`,
      );
      hero.style.setProperty(
        "--services-hero-index-opacity",
        (0.28 + resolveProgress * 0.72 - copyExit * 0.52).toFixed(4),
      );
      hero.style.setProperty(
        "--services-hero-aperture-scale",
        (0.58 + apertureProgress * 2.72).toFixed(4),
      );
      hero.style.setProperty(
        "--services-hero-aperture-opacity",
        (0.08 + apertureProgress * 0.72).toFixed(4),
      );
      hero.dataset.servicesHeroPhase =
        exitProgress > 0.72 ? "handoff" : resolveProgress >= 0.85 ? "resolved" : "assembling";
    }

    function updateSceneProgress() {
      frame = 0;
      const viewportHeight = Math.max(1, window.innerHeight);
      updateHeroProgress(viewportHeight);

      scenes.forEach((scene) => {
        const bounds = scene.getBoundingClientRect();
        if (bounds.bottom < -viewportHeight || bounds.top > viewportHeight * 2) return;

        const progress = clamp((viewportHeight - bounds.top) / (viewportHeight + bounds.height));
        const centred = clamp(1 - Math.abs(progress - 0.5) * 2);
        scene.style.setProperty("--services-scene-progress", progress.toFixed(4));
        scene.style.setProperty("--services-scene-presence", centred.toFixed(4));
        scene.style.setProperty("--services-scene-signal-x", `${(progress * 100).toFixed(3)}%`);

        const phase =
          bounds.top > viewportHeight * 0.35
            ? "entering"
            : bounds.bottom < viewportHeight * 0.65
              ? "leaving"
              : "present";
        scene.dataset.servicesPhase = phase;

        if (bounds.bottom >= -viewportHeight * 0.2 && bounds.top <= viewportHeight * 1.2) {
          window.dispatchEvent(
            new CustomEvent(SCENE_PROGRESS_EVENT, {
              detail: {
                id: scene.id,
                scene: scene.dataset.servicesScrollScene,
                label: scene.dataset.servicesChapterLabel,
                progress,
                presence: centred,
                phase,
              },
            }),
          );
        }
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
      window.cancelAnimationFrame(hashRestoreFrame);
      observer.disconnect();
      window.removeEventListener("scroll", scheduleProgress);
      window.removeEventListener("resize", scheduleProgress);
      window.removeEventListener("pageshow", scheduleProgress);
      window.removeEventListener("hashchange", restoreRequestedHash);
      delete document.documentElement.dataset.servicesExperience;
      delete document.documentElement.dataset.servicesActiveChapter;
      delete document.documentElement.dataset.servicesActiveChapterId;
      delete document.documentElement.dataset.servicesChapterCount;
      document.documentElement.style.removeProperty("--services-chapter-progress");
      document.documentElement.style.removeProperty("--services-chapter-angle");

      heroAperture.remove();
      heroFragments.remove();
      delete hero.dataset.servicesHeroScene;
      delete hero.dataset.servicesHeroPhase;
      heroMedia.forEach((media) => {
        delete media.dataset.servicesHeroMedia;
      });
      if (heroHeading) delete heroHeading.dataset.servicesHeroHeading;
      if (heroIndex) delete heroIndex.dataset.servicesHeroIndex;
      [
        "--services-hero-scale",
        "--services-hero-media-y",
        "--services-hero-copy-y",
        "--services-hero-copy-opacity",
        "--services-hero-index-x",
        "--services-hero-index-opacity",
        "--services-hero-aperture-scale",
        "--services-hero-aperture-opacity",
      ].forEach((property) => hero.style.removeProperty(property));

      scenes.forEach((scene) => {
        signalLayers.get(scene)?.remove();
        delete scene.dataset.servicesScrollScene;
        delete scene.dataset.servicesScrollIndex;
        delete scene.dataset.servicesChapterLabel;
        delete scene.dataset.servicesActive;
        delete scene.dataset.servicesPhase;
        if (generatedIds.has(scene)) scene.removeAttribute("id");
        scene.style.removeProperty("--services-scene-progress");
        scene.style.removeProperty("--services-scene-presence");
        scene.style.removeProperty("--services-scene-signal-x");
      });
      signalLayers.clear();
      generatedIds.clear();
    };
  }, []);

  return null;
}
