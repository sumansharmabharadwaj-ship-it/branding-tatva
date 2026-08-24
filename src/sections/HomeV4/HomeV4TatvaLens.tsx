"use client";

import { useEffect, useRef } from "react";
import { useHydratedReducedMotion } from "@/hooks/useHydratedReducedMotion";

const CHAPTER_SELECTOR = "[data-home-v4-chapter]";
const FINE_POINTER_QUERY = "(min-width: 1101px) and (hover: hover) and (pointer: fine)";

const CHAPTER_LABELS: Record<string, string> = {
  opening: "Opening signal",
  recognition: "Recognition",
  diagnostic: "Brand diagnostic",
  cost: "Hidden cost",
  foundation: "Foundation",
  paths: "Ways to begin",
  process: "The method",
  evidence: "Evidence",
  tatva: "The system",
  studio: "The thinking room",
  decision: "Decision room",
  insights: "Field notes",
  invitation: "Invitation",
};

const CHAPTER_ELEMENTS: Record<string, string> = {
  recognition: "space",
  diagnostic: "water",
  cost: "fire",
  foundation: "earth",
  paths: "space",
  process: "water",
  evidence: "earth",
  tatva: "air",
  studio: "air",
  decision: "fire",
  insights: "space",
  invitation: "water",
};

const CAMERA_PLANES: Record<string, { content: string; media?: string }> = {
  recognition: {
    content: ".home-v4-recognition__shell",
    media: ".home-v4-recognition__media",
  },
  diagnostic: {
    content: ".brand-orbit__shell",
    media: ".brand-orbit__landscape",
  },
  cost: {
    content: ".home-v4-cost__shell",
    media: ".home-v4-cost__media",
  },
  foundation: {
    content: ".foundation-orbit__shell",
    media: ".foundation-orbit__media",
  },
  paths: {
    content: ".paths-cinematic__shell",
    media: ".paths-cinematic__film",
  },
  process: {
    content: ".decision-flow__shell",
    media: ".decision-flow__media",
  },
  evidence: {
    content: ".evidence-cinematic__shell",
    media: ".evidence-cinematic__backdrop",
  },
  tatva: {
    content: ".tatva-pressure-lab > div:last-child",
    media: ".tatva-pressure-lab__film",
  },
  studio: {
    content: ".studio-cinematic__grid",
  },
  decision: {
    content: ".questions-cinematic__shell",
  },
  insights: {
    content: ".home-insights__shell",
    media: ".home-insights__film",
  },
  invitation: {
    content: "[data-cursor-media] > div.relative.flex.flex-1",
    media: "[data-cursor-media] > video",
  },
};

const CAMERA_PROPERTIES = [
  "--tatva-camera-content-x",
  "--tatva-camera-content-y",
  "--tatva-camera-scale",
  "--tatva-camera-opacity",
  "--tatva-camera-media-y",
  "--tatva-camera-media-scale",
];

function clamp(value: number, minimum = 0, maximum = 1) {
  return Math.min(maximum, Math.max(minimum, value));
}

function chapterId(chapter: HTMLElement) {
  return chapter.dataset.homeV4Chapter || chapter.dataset.homeChapter || chapter.id || "scene";
}

/**
 * Publishes one camera language across the post hero homepage.
 *
 * The director never prevents or replaces native input. It reads scroll,
 * direction, velocity and pointer position, then writes low frequency CSS
 * variables for the fixed lens layer. Existing scenes remain the owners of
 * their content, state, media and accessibility.
 */
export function HomeV4TatvaLens() {
  const reducedMotion = Boolean(useHydratedReducedMotion());
  const indexRef = useRef<HTMLSpanElement>(null);
  const nameRef = useRef<HTMLElement>(null);
  const progressRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const root = document.querySelector<HTMLElement>("[data-home-v4]");
    if (!root || reducedMotion) return;
    const homeRoot = root;

    const pointerProfile = window.matchMedia(FINE_POINTER_QUERY);
    let profileEnabled = pointerProfile.matches;
    let chapters = Array.from(homeRoot.querySelectorAll<HTMLElement>(CHAPTER_SELECTOR));
    let activeChapter: HTMLElement | null = null;
    let frame = 0;
    let lastScrollY = window.scrollY;
    let lastSampleAt = performance.now();
    let targetSpeed = 0;
    let renderedSpeed = 0;
    let direction = 1;
    let pointerX = 0.5;
    let pointerY = 0.5;
    let pointerTargetX = 0.5;
    let pointerTargetY = 0.5;
    let chapterProgress = 0;
    let chapterFocus = 1;
    let arrivalWeight = 0;
    let releaseWeight = 0;
    let needsMeasure = true;
    let running = true;
    let frameRunning = false;
    const cameraPlanes = new Set<HTMLElement>();

    const clearActiveChapter = () => {
      if (!activeChapter) return;
      activeChapter.removeAttribute("data-tatva-lens-active");
      activeChapter.removeAttribute("data-tatva-lens-phase");
      activeChapter.style.removeProperty("--tatva-chapter-focus");
      activeChapter.style.removeProperty("--tatva-chapter-progress");
      CAMERA_PROPERTIES.forEach((property) => activeChapter?.style.removeProperty(property));
      activeChapter = null;
    };

    const clearCameraPlanes = () => {
      cameraPlanes.forEach((plane) => plane.removeAttribute("data-tatva-lens-plane"));
      cameraPlanes.clear();
    };

    const tagCameraPlanes = () => {
      clearCameraPlanes();
      chapters.forEach((chapter) => {
        const id = chapterId(chapter);
        const element = CHAPTER_ELEMENTS[id];
        const planes = CAMERA_PLANES[id];
        if (element) chapter.dataset.tatvaLensElement = element;
        else delete chapter.dataset.tatvaLensElement;
        if (!planes) return;

        const contentPlane = chapter.querySelector<HTMLElement>(planes.content);
        if (contentPlane) {
          contentPlane.dataset.tatvaLensPlane = "content";
          cameraPlanes.add(contentPlane);
        }

        if (!planes.media) return;
        const mediaPlane = chapter.querySelector<HTMLElement>(planes.media);
        if (mediaPlane) {
          mediaPlane.dataset.tatvaLensPlane = "media";
          cameraPlanes.add(mediaPlane);
        }
      });
    };

    const refreshChapters = () => {
      chapters = Array.from(homeRoot.querySelectorAll<HTMLElement>(CHAPTER_SELECTOR));
      if (profileEnabled) tagCameraPlanes();
      else clearCameraPlanes();
      needsMeasure = profileEnabled;
      if (profileEnabled) scheduleRender();
    };

    const onPointerMove = (event: PointerEvent) => {
      if (!profileEnabled) return;
      pointerTargetX = clamp(event.clientX / Math.max(1, window.innerWidth));
      pointerTargetY = clamp(event.clientY / Math.max(1, window.innerHeight));
      scheduleRender();
    };

    const onPointerLeave = () => {
      if (!profileEnabled) return;
      pointerTargetX = 0.5;
      pointerTargetY = 0.46;
      scheduleRender();
    };

    const onScroll = () => {
      if (!profileEnabled) return;
      const now = performance.now();
      const nextScrollY = window.scrollY;
      const delta = nextScrollY - lastScrollY;
      const elapsed = Math.max(16, now - lastSampleAt);
      if (Math.abs(delta) > 0.25) direction = delta > 0 ? 1 : -1;
      targetSpeed = clamp(Math.abs(delta) / elapsed / 2.15);
      lastScrollY = nextScrollY;
      lastSampleAt = now;
      needsMeasure = true;
      scheduleRender();
    };

    const onResize = () => {
      if (!profileEnabled) return;
      needsMeasure = true;
      scheduleRender();
    };

    const measureChapter = () => {
      if (!chapters.length) return;
      const viewport = Math.max(1, window.innerHeight);
      const centre = viewport * 0.5;
      let nextChapter = chapters[0] ?? null;
      let bestDistance = Number.POSITIVE_INFINITY;

      chapters.forEach((chapter) => {
        const rect = chapter.getBoundingClientRect();
        const containsCentre = rect.top <= centre && rect.bottom >= centre;
        const distance = containsCentre
          ? 0
          : Math.min(Math.abs(rect.top - centre), Math.abs(rect.bottom - centre));
        if (distance < bestDistance) {
          bestDistance = distance;
          nextChapter = chapter;
        }
      });

      if (!nextChapter) return;
      if (activeChapter !== nextChapter) {
        clearActiveChapter();
        activeChapter = nextChapter;
        activeChapter.dataset.tatvaLensActive = "true";
      }

      const rect = nextChapter.getBoundingClientRect();
      const id = chapterId(nextChapter);
      const index = Math.max(0, chapters.indexOf(nextChapter));
      const entry = clamp((viewport - rect.top) / Math.max(viewport * 0.58, 1));
      const exit = clamp((viewport * 0.42 - rect.bottom) / Math.max(viewport * 0.58, 1));
      const focus = clamp(1 - Math.abs(rect.top) / viewport);
      const travel = Math.max(1, rect.height - viewport);
      const progress = travel > 1
        ? clamp(-rect.top / travel)
        : clamp((viewport - rect.top) / (viewport + rect.height));
      chapterProgress = progress;
      chapterFocus = focus;
      arrivalWeight = 1 - entry;
      releaseWeight = exit;
      const phase = exit > 0.08 ? "release" : entry < 0.82 ? "arrival" : "resolved";
      const world = nextChapter.dataset.cursorWorld === "light" ? "light" : "dark";
      const element = CHAPTER_ELEMENTS[id] || "earth";

      nextChapter.dataset.tatvaLensPhase = phase;
      nextChapter.style.setProperty("--tatva-chapter-focus", focus.toFixed(3));
      nextChapter.style.setProperty("--tatva-chapter-progress", progress.toFixed(3));
      homeRoot.dataset.tatvaLensChapter = id;
      homeRoot.dataset.tatvaLensPhase = phase;
      homeRoot.dataset.tatvaLensWorld = world;
      homeRoot.dataset.tatvaLensElement = element;
      homeRoot.style.setProperty("--tatva-lens-focus", focus.toFixed(3));
      homeRoot.style.setProperty("--tatva-lens-progress", progress.toFixed(3));

      const nextIndexCopy = `${String(index + 1).padStart(2, "0")} / ${String(chapters.length).padStart(2, "0")}`;
      const nextNameCopy = CHAPTER_LABELS[id] || id;
      if (indexRef.current && indexRef.current.textContent !== nextIndexCopy) {
        indexRef.current.textContent = nextIndexCopy;
      }
      if (nameRef.current && nameRef.current.textContent !== nextNameCopy) {
        nameRef.current.textContent = nextNameCopy;
      }
      if (progressRef.current) {
        progressRef.current.style.transform = `scaleX(${clamp((index + progress) / chapters.length).toFixed(4)})`;
      }
    };

    const renderCameraMotion = () => {
      if (!activeChapter) return;
      const transitionWeight = clamp(Math.max(arrivalWeight, releaseWeight));
      const travelAxis = arrivalWeight - releaseWeight;
      const contentX = direction * renderedSpeed * -5.5;
      const contentY = travelAxis * 13 + direction * renderedSpeed * 5;
      const contentScale = 1 - transitionWeight * 0.009 - renderedSpeed * 0.002;
      const contentOpacity = 0.9 + (1 - transitionWeight) * 0.1;
      const mediaY = travelAxis * -8 + direction * renderedSpeed * -4;
      const mediaScale = 1.018 + transitionWeight * 0.016 + renderedSpeed * 0.01;

      activeChapter.style.setProperty("--tatva-camera-content-x", `${contentX.toFixed(2)}px`);
      activeChapter.style.setProperty("--tatva-camera-content-y", `${contentY.toFixed(2)}px`);
      activeChapter.style.setProperty("--tatva-camera-scale", contentScale.toFixed(4));
      activeChapter.style.setProperty("--tatva-camera-opacity", contentOpacity.toFixed(3));
      activeChapter.style.setProperty("--tatva-camera-media-y", `${mediaY.toFixed(2)}px`);
      activeChapter.style.setProperty("--tatva-camera-media-scale", mediaScale.toFixed(4));
      homeRoot.style.setProperty("--tatva-lens-transition", transitionWeight.toFixed(4));
      homeRoot.style.setProperty("--tatva-lens-focus", chapterFocus.toFixed(3));
    };

    function scheduleRender() {
      if (!running || frameRunning) return;
      frameRunning = true;
      frame = window.requestAnimationFrame(render);
    }

    function render() {
      frameRunning = false;
      if (!running || !profileEnabled) return;
      renderedSpeed += (targetSpeed - renderedSpeed) * 0.17;
      targetSpeed *= 0.84;
      if (targetSpeed < 0.002) targetSpeed = 0;
      pointerX += (pointerTargetX - pointerX) * 0.11;
      pointerY += (pointerTargetY - pointerY) * 0.11;

      homeRoot.style.setProperty("--tatva-lens-x", pointerX.toFixed(4));
      homeRoot.style.setProperty("--tatva-lens-y", pointerY.toFixed(4));
      homeRoot.style.setProperty("--tatva-lens-speed", renderedSpeed.toFixed(4));
      homeRoot.style.setProperty(
        "--tatva-lens-turn",
        `${(chapterProgress * 38 + direction * renderedSpeed * 22).toFixed(2)}deg`,
      );

      if (needsMeasure) {
        measureChapter();
        needsMeasure = false;
      }
      renderCameraMotion();

      const pointerMoving =
        Math.abs(pointerTargetX - pointerX) > 0.0005 ||
        Math.abs(pointerTargetY - pointerY) > 0.0005;
      if (targetSpeed > 0.001 || renderedSpeed > 0.001 || pointerMoving || needsMeasure) {
        scheduleRender();
      }
    }

    const clearHomeRootState = () => {
      delete homeRoot.dataset.tatvaLens;
      delete homeRoot.dataset.tatvaLensChapter;
      delete homeRoot.dataset.tatvaLensPhase;
      delete homeRoot.dataset.tatvaLensWorld;
      delete homeRoot.dataset.tatvaLensElement;
      homeRoot.style.removeProperty("--tatva-lens-x");
      homeRoot.style.removeProperty("--tatva-lens-y");
      homeRoot.style.removeProperty("--tatva-lens-speed");
      homeRoot.style.removeProperty("--tatva-lens-turn");
      homeRoot.style.removeProperty("--tatva-lens-focus");
      homeRoot.style.removeProperty("--tatva-lens-progress");
      homeRoot.style.removeProperty("--tatva-lens-transition");
    };

    const disableProfile = () => {
      clearActiveChapter();
      clearCameraPlanes();
      chapters.forEach((chapter) => delete chapter.dataset.tatvaLensElement);
      clearHomeRootState();
    };

    const syncPointerProfile = () => {
      profileEnabled = pointerProfile.matches;
      if (!profileEnabled) {
        disableProfile();
        return;
      }
      homeRoot.dataset.tatvaLens = "active";
      refreshChapters();
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onResize, { passive: true });
    window.addEventListener("pointermove", onPointerMove, { passive: true });
    document.documentElement.addEventListener("mouseleave", onPointerLeave);
    pointerProfile.addEventListener("change", syncPointerProfile);

    const mutationObserver = new MutationObserver(refreshChapters);
    mutationObserver.observe(homeRoot, { childList: true, subtree: true });
    syncPointerProfile();

    return () => {
      running = false;
      window.cancelAnimationFrame(frame);
      mutationObserver.disconnect();
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onResize);
      window.removeEventListener("pointermove", onPointerMove);
      document.documentElement.removeEventListener("mouseleave", onPointerLeave);
      pointerProfile.removeEventListener("change", syncPointerProfile);
      disableProfile();
    };
  }, [reducedMotion]);

  if (reducedMotion) return null;

  return (
    <div className="tatva-lens-runtime" aria-hidden="true">
      <span className="tatva-lens-runtime__aperture" />
      <span className="tatva-lens-runtime__focus-plane" />
      <span className="tatva-lens-runtime__chapter">
        <span ref={indexRef}>01 / 13</span>
        <strong ref={nameRef}>Opening signal</strong>
        <i><b ref={progressRef} /></i>
      </span>
    </div>
  );
}
