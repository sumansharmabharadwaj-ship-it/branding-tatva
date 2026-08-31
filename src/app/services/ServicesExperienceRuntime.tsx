"use client";

import { useEffect } from "react";

const SCENE_SELECTOR = "[data-services-scene], #authority, #book";
const SCENE_PROGRESS_EVENT = "bt:services-scene-progress";
const CHAPTERS_READY_EVENT = "bt:services-chapters-ready";
const ACTIVE_CHAPTER_EVENT = "bt:services-active-chapter";
const DIRECT_ANCHOR_PROGRESS = 0.455;

const SCENE_MOTION: Record<
  string,
  { contentX: number; contentY: number; rotate: number; scale: number; cameraX: number; cameraY: number }
> = {
  situation: { contentX: 30, contentY: -4, rotate: 0.55, scale: 0.014, cameraX: -22, cameraY: 24 },
  offerings: { contentX: -28, contentY: 10, rotate: -0.48, scale: 0.018, cameraX: 22, cameraY: 20 },
  desire: { contentX: 0, contentY: 22, rotate: 0, scale: 0.026, cameraX: 0, cameraY: -26 },
  "verified-outcome": { contentX: 24, contentY: -9, rotate: 0.4, scale: 0.016, cameraX: -18, cameraY: 22 },
  education: { contentX: -22, contentY: 9, rotate: -0.38, scale: 0.02, cameraX: 20, cameraY: -22 },
  audit: { contentX: 18, contentY: 12, rotate: 0.28, scale: 0.015, cameraX: -14, cameraY: 18 },
  book: { contentX: 0, contentY: 18, rotate: 0, scale: 0.022, cameraX: 0, cameraY: -18 },
};

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

function smoothRange(value: number, start: number, end: number) {
  const local = clamp((value - start) / Math.max(0.0001, end - start));
  return local * local * (3 - 2 * local);
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
  return scene.dataset.servicesScene || (index === 0 ? "opening" : scene.id || `scene-${index + 1}`);
}

export function ServicesExperienceRuntime() {
  useEffect(() => {
    const main = document.getElementById("main-content");
    if (!main) return;
    const servicesRoot = main;

    const scenes = orderedScenes(servicesRoot);
    const firstScene = scenes[0];
    if (!firstScene) return;
    const hero = firstScene;

    document.documentElement.dataset.servicesExperience = "active";
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
    let pendingAnchorIndex: number | null = null;
    let frame = 0;
    let scrollSettleTimer = 0;
    let pointerFrame = 0;
    let pointerX = 0;
    let pointerY = 0;
    let lastScrollY = window.scrollY;
    let lastFrameTime = performance.now();
    let smoothedVelocity = 0;
    let scrollDirection: "up" | "down" = "down";
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const finePointer = window.matchMedia("(hover: hover) and (pointer: fine)").matches;

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
      scene.style.setProperty("--services-scene-presence", index === 0 ? "1" : "0");
      scene.style.setProperty("--services-scene-axis", "0");
      scene.style.setProperty("--services-content-x", "0px");
      scene.style.setProperty("--services-content-y", "0px");
      scene.style.setProperty("--services-content-rotate", "0deg");
      scene.style.setProperty("--services-content-scale", "1");
      scene.style.setProperty("--services-camera-x", "0px");
      scene.style.setProperty("--services-camera-y", "0px");
      scene.style.setProperty("--services-camera-scale", "1.02");
      scene.style.setProperty("--services-anticipation", index === 0 ? "1" : "0");
      scene.style.setProperty("--services-activation", index === 0 ? "1" : "0");
      scene.style.setProperty("--services-discovery", index === 0 ? "1" : "0");
      scene.style.setProperty("--services-resolution", index === 0 ? "1" : "0");
      scene.style.setProperty("--services-departure", "0");
      scene.style.setProperty("--services-copy-x", "0px");
      scene.style.setProperty("--services-copy-y", "0px");
      scene.style.setProperty("--services-copy-opacity", "1");
      scene.style.setProperty("--services-instrument-x", "0px");
      scene.style.setProperty("--services-instrument-y", "0px");
      scene.style.setProperty("--services-instrument-scale", "1");
      scene.style.setProperty("--services-instrument-opacity", "1");
      scene.style.setProperty("--services-instrument-mask", "0%");
      scene.style.setProperty("--services-resolution-y", "0px");
      scene.style.setProperty("--services-resolution-opacity", "1");

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

      window.dispatchEvent(
        new CustomEvent(ACTIVE_CHAPTER_EVENT, {
          detail: {
            id: chapter.id,
            href: `#${chapter.id}`,
            index,
            label: chapter.dataset.servicesChapterLabel,
            scene: chapter.dataset.servicesScrollScene,
          },
        }),
      );
    }

    function chapterIndexForHash(hash = window.location.hash) {
      if (!hash.startsWith("#")) return -1;

      let id = hash.slice(1);
      try {
        id = decodeURIComponent(id);
      } catch {
        // A malformed fragment cannot match a scene, so the focal line keeps
        // ownership of chapter state.
        return -1;
      }

      return scenes.findIndex((scene) => scene.id === id);
    }

    function publishAnchorChapter() {
      const index = chapterIndexForHash();
      if (index < 0) return;

      // Native anchor alignment can finish a frame or two after hydration.
      // Keep the requested destination authoritative until its content plane
      // reaches the focal line, then hand control back to normal scrolling.
      pendingAnchorIndex = index;
      publishChapter(index);
      scheduleProgress();
    }

    // One geometric focal line owns chapter state. Intersection ratios can
    // briefly favour a previous full-height scene after a hash jump, which is
    // why the rail could still announce Opening signal beside Client proof.
    // The focal line follows the content plane and resolves identically for
    // wheel, trackpad, touch, keyboard and direct anchors.
    function chapterAtFocalLine(viewportHeight: number) {
      const focalY = viewportHeight * 0.34;

      if (pendingAnchorIndex !== null) {
        const anchorScene = scenes[pendingAnchorIndex];
        const anchorBounds = anchorScene?.getBoundingClientRect();
        const anchorIndex = pendingAnchorIndex;

        if (anchorBounds && anchorBounds.top <= focalY && anchorBounds.bottom > focalY) {
          pendingAnchorIndex = null;
        }

        return anchorIndex;
      }

      let nearestIndex = 0;
      let nearestDistance = Number.POSITIVE_INFINITY;

      scenes.forEach((scene, index) => {
        const bounds = scene.getBoundingClientRect();
        if (bounds.top <= focalY && bounds.bottom > focalY) {
          nearestIndex = index;
          nearestDistance = -1;
          return;
        }
        if (nearestDistance < 0) return;

        const distance = bounds.top > focalY ? bounds.top - focalY : focalY - bounds.bottom;
        if (distance < nearestDistance) {
          nearestDistance = distance;
          nearestIndex = index;
        }
      });

      return nearestIndex;
    }

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
      const now = performance.now();
      const elapsed = Math.max(16, now - lastFrameTime);
      const scrollDelta = window.scrollY - lastScrollY;
      const rawVelocity = clamp(Math.abs(scrollDelta) / elapsed / 1.45);
      smoothedVelocity += (rawVelocity - smoothedVelocity) * 0.24;
      if (Math.abs(scrollDelta) > 0.4) scrollDirection = scrollDelta > 0 ? "down" : "up";
      lastScrollY = window.scrollY;
      lastFrameTime = now;

      document.documentElement.dataset.servicesScrollDirection = scrollDirection;
      document.documentElement.style.setProperty(
        "--services-scroll-velocity",
        smoothedVelocity.toFixed(4),
      );
      updateHeroProgress(viewportHeight);
      publishChapter(chapterAtFocalLine(viewportHeight));

      scenes.forEach((scene, index) => {
        const bounds = scene.getBoundingClientRect();
        if (bounds.bottom < -viewportHeight || bounds.top > viewportHeight * 2) return;

        const measuredProgress = clamp(
          (viewportHeight - bounds.top) / (viewportHeight + bounds.height),
        );
        // The requested chapter can paint before the browser finishes its
        // native anchor movement. Give that one scene its settled arrival
        // composition immediately, then return to measured scroll progress as
        // soon as the scene reaches the focal line. This prevents masks,
        // choice cards and proof copy from appearing partially closed.
        const progress =
          pendingAnchorIndex === index
            ? Math.max(measuredProgress, DIRECT_ANCHOR_PROGRESS)
            : measuredProgress;
        const centred = clamp(1 - Math.abs(progress - 0.5) * 2);
        const axis = clamp((progress - 0.5) * 2, -1, 1);
        const key = scene.dataset.servicesScrollScene || "";
        const motion = SCENE_MOTION[key];
        // A direct chapter link settles the section just below the fixed
        // navigation, which is roughly progress 0.45 for a one-screen scene.
        // Complete the visual entrance before that focal point so hash and
        // rail navigation never leave body copy translucent or clipped.
        const anticipation = smoothRange(progress, 0.01, 0.1);
        const activation = smoothRange(progress, 0.05, 0.24);
        const discovery = smoothRange(progress, 0.13, 0.38);
        const resolution = smoothRange(progress, 0.26, 0.44);
        const departure = smoothRange(progress, 0.82, 0.98);
        // Interactive chapter states begin after the visual composition has
        // arrived. This keeps the first option visible at a direct anchor,
        // then uses the remaining scroll distance to play the sequence.
        const storyProgress = smoothRange(progress, 0.36, 0.82);
        const arrival = 1 - activation;
        const travelAxis = -arrival + departure;
        const signedVelocity = smoothedVelocity * (scrollDirection === "down" ? 1 : -1);
        scene.style.setProperty("--services-scene-progress", progress.toFixed(4));
        scene.style.setProperty("--services-scene-presence", centred.toFixed(4));
        scene.style.setProperty("--services-scene-axis", axis.toFixed(4));
        scene.style.setProperty("--services-scene-signal-x", `${(progress * 100).toFixed(3)}%`);
        scene.style.setProperty("--services-anticipation", anticipation.toFixed(4));
        scene.style.setProperty("--services-activation", activation.toFixed(4));
        scene.style.setProperty("--services-discovery", discovery.toFixed(4));
        scene.style.setProperty("--services-resolution", resolution.toFixed(4));
        scene.style.setProperty("--services-departure", departure.toFixed(4));
        scene.style.setProperty("--services-scroll-kick", signedVelocity.toFixed(4));

        const lateralSign = motion?.contentX && motion.contentX < 0 ? -1 : 1;
        scene.style.setProperty(
          "--services-copy-x",
          `${(travelAxis * 18 * lateralSign + signedVelocity * 5).toFixed(2)}px`,
        );
        scene.style.setProperty(
          "--services-copy-y",
          `${(arrival * 15 - departure * 11 + signedVelocity * 8).toFixed(2)}px`,
        );
        scene.style.setProperty(
          "--services-copy-opacity",
          clamp(0.7 + activation * 0.3 - departure * 0.12, 0.58, 1).toFixed(4),
        );
        scene.style.setProperty(
          "--services-instrument-x",
          `${((1 - discovery) * -32 * lateralSign + departure * 18 * lateralSign + signedVelocity * 9).toFixed(2)}px`,
        );
        scene.style.setProperty(
          "--services-instrument-y",
          `${((1 - discovery) * 18 - departure * 9 + signedVelocity * 11).toFixed(2)}px`,
        );
        scene.style.setProperty(
          "--services-instrument-scale",
          clamp(0.972 + discovery * 0.028 + smoothedVelocity * 0.012 - departure * 0.006, 0.96, 1.018).toFixed(4),
        );
        scene.style.setProperty(
          "--services-instrument-opacity",
          clamp(0.62 + discovery * 0.38 - departure * 0.1, 0.52, 1).toFixed(4),
        );
        scene.style.setProperty(
          "--services-instrument-mask",
          `${((1 - discovery) * 9 + departure * 2.5).toFixed(3)}%`,
        );
        scene.style.setProperty(
          "--services-resolution-y",
          `${((1 - resolution) * 12 - departure * 8).toFixed(2)}px`,
        );
        scene.style.setProperty(
          "--services-resolution-opacity",
          clamp(0.66 + resolution * 0.34 - departure * 0.08, 0.58, 1).toFixed(4),
        );

        if (motion && !reducedMotion) {
          scene.style.setProperty(
            "--services-content-x",
            `${(travelAxis * motion.contentX + signedVelocity * motion.contentX * 0.16).toFixed(2)}px`,
          );
          scene.style.setProperty(
            "--services-content-y",
            `${(travelAxis * motion.contentY + signedVelocity * 8).toFixed(2)}px`,
          );
          scene.style.setProperty(
            "--services-content-rotate",
            `${(travelAxis * motion.rotate + signedVelocity * motion.rotate * 0.28).toFixed(3)}deg`,
          );
          scene.style.setProperty(
            "--services-content-scale",
            (1 - arrival * motion.scale - departure * motion.scale * 0.55).toFixed(4),
          );
          scene.style.setProperty(
            "--services-camera-x",
            `${(travelAxis * motion.cameraX + pointerX * 5 + signedVelocity * 6).toFixed(2)}px`,
          );
          scene.style.setProperty(
            "--services-camera-y",
            `${(travelAxis * motion.cameraY + pointerY * 4 + signedVelocity * 9).toFixed(2)}px`,
          );
          scene.style.setProperty(
            "--services-camera-scale",
            (1.014 + arrival * 0.024 + departure * 0.018 + smoothedVelocity * 0.018).toFixed(4),
          );
        }

        const phase =
          bounds.top > viewportHeight * 0.35
            ? "entering"
            : bounds.bottom < viewportHeight * 0.65
              ? "leaving"
              : "present";
        scene.dataset.servicesPhase = phase;
        scene.dataset.servicesRhythm =
          progress < 0.08
            ? "anticipation"
            : progress < 0.24
              ? "activation"
              : progress < 0.42
                ? "discovery"
                : progress < 0.82
                  ? "resolution"
                  : "handoff";

        if (bounds.bottom >= -viewportHeight * 0.2 && bounds.top <= viewportHeight * 1.2) {
          window.dispatchEvent(
            new CustomEvent(SCENE_PROGRESS_EVENT, {
              detail: {
                id: scene.id,
                scene: scene.dataset.servicesScrollScene,
                label: scene.dataset.servicesChapterLabel,
                progress,
                storyProgress,
                presence: centred,
                phase,
                rhythm: scene.dataset.servicesRhythm,
                direction: scrollDirection,
                velocity: smoothedVelocity,
              },
            }),
          );
        }
      });

      if (Math.abs(scrollDelta) < 0.4 && smoothedVelocity > 0.006) {
        frame = window.requestAnimationFrame(updateSceneProgress);
      }
    }

    function scheduleProgress() {
      if (frame) return;
      frame = window.requestAnimationFrame(updateSceneProgress);
    }

    function scheduleSettledProgress() {
      window.clearTimeout(scrollSettleTimer);
      scrollSettleTimer = window.setTimeout(scheduleProgress, 160);
    }

    function onScroll() {
      scheduleProgress();
      // Smooth anchor travel can finish between the browser's last scroll
      // event and its final painted position. Re-read that settled geometry so
      // a chapter never keeps an intermediate story state after arrival.
      scheduleSettledProgress();
    }

    function publishPointer() {
      pointerFrame = 0;
      servicesRoot.style.setProperty("--services-pointer-x", pointerX.toFixed(4));
      servicesRoot.style.setProperty("--services-pointer-y", pointerY.toFixed(4));
      scheduleProgress();
    }

    function onPointerMove(event: PointerEvent) {
      if (!finePointer || reducedMotion) return;
      pointerX = clamp(event.clientX / Math.max(1, window.innerWidth) - 0.5, -0.5, 0.5) * 2;
      pointerY = clamp(event.clientY / Math.max(1, window.innerHeight) - 0.5, -0.5, 0.5) * 2;
      if (!pointerFrame) pointerFrame = window.requestAnimationFrame(publishPointer);
    }

    function onPointerLeave() {
      if (!finePointer || reducedMotion) return;
      pointerX = 0;
      pointerY = 0;
      if (!pointerFrame) pointerFrame = window.requestAnimationFrame(publishPointer);
    }

    const initialAnchorIndex = chapterIndexForHash();
    if (initialAnchorIndex >= 0) {
      pendingAnchorIndex = initialAnchorIndex;
      publishChapter(initialAnchorIndex);
    } else {
      publishChapter(0);
    }
    updateSceneProgress();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", scheduleProgress, { passive: true });
    window.addEventListener("pageshow", scheduleProgress);
    window.addEventListener("hashchange", publishAnchorChapter);
    servicesRoot.addEventListener("pointermove", onPointerMove, { passive: true });
    servicesRoot.addEventListener("pointerleave", onPointerLeave);

    return () => {
      window.cancelAnimationFrame(frame);
      window.cancelAnimationFrame(pointerFrame);
      window.clearTimeout(scrollSettleTimer);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", scheduleProgress);
      window.removeEventListener("pageshow", scheduleProgress);
      window.removeEventListener("hashchange", publishAnchorChapter);
      servicesRoot.removeEventListener("pointermove", onPointerMove);
      servicesRoot.removeEventListener("pointerleave", onPointerLeave);
      delete document.documentElement.dataset.servicesExperience;
      delete document.documentElement.dataset.servicesScrollDirection;
      delete document.documentElement.dataset.servicesActiveChapter;
      delete document.documentElement.dataset.servicesActiveChapterId;
      delete document.documentElement.dataset.servicesChapterCount;
      document.documentElement.style.removeProperty("--services-chapter-progress");
      document.documentElement.style.removeProperty("--services-chapter-angle");
      document.documentElement.style.removeProperty("--services-scroll-velocity");
      servicesRoot.style.removeProperty("--services-pointer-x");
      servicesRoot.style.removeProperty("--services-pointer-y");

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
        delete scene.dataset.servicesRhythm;
        if (generatedIds.has(scene)) scene.removeAttribute("id");
        scene.style.removeProperty("--services-scene-progress");
        scene.style.removeProperty("--services-scene-presence");
        scene.style.removeProperty("--services-scene-axis");
        scene.style.removeProperty("--services-scene-signal-x");
        scene.style.removeProperty("--services-content-x");
        scene.style.removeProperty("--services-content-y");
        scene.style.removeProperty("--services-content-rotate");
        scene.style.removeProperty("--services-content-scale");
        scene.style.removeProperty("--services-camera-x");
        scene.style.removeProperty("--services-camera-y");
        scene.style.removeProperty("--services-camera-scale");
        scene.style.removeProperty("--services-anticipation");
        scene.style.removeProperty("--services-activation");
        scene.style.removeProperty("--services-discovery");
        scene.style.removeProperty("--services-resolution");
        scene.style.removeProperty("--services-departure");
        scene.style.removeProperty("--services-scroll-kick");
        scene.style.removeProperty("--services-copy-x");
        scene.style.removeProperty("--services-copy-y");
        scene.style.removeProperty("--services-copy-opacity");
        scene.style.removeProperty("--services-instrument-x");
        scene.style.removeProperty("--services-instrument-y");
        scene.style.removeProperty("--services-instrument-scale");
        scene.style.removeProperty("--services-instrument-opacity");
        scene.style.removeProperty("--services-instrument-mask");
        scene.style.removeProperty("--services-resolution-y");
        scene.style.removeProperty("--services-resolution-opacity");
      });
      signalLayers.clear();
      generatedIds.clear();
    };
  }, []);

  return null;
}
