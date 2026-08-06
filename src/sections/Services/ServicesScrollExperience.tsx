"use client";

import { Compass, X } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import { useHydratedReducedMotion } from "@/hooks/useHydratedReducedMotion";

const CHAPTERS = [
  { id: "services-opening", scene: "opening", label: "Opening signal" },
  { id: "situation", scene: "situation", label: "Your situation" },
  { id: "offerings", scene: "offerings", label: "Six disciplines" },
  { id: "desire", scene: "desire", label: "Package paths" },
  { id: "verified-outcome", scene: "verified-outcome", label: "Verified outcome" },
  { id: "authority", scene: "authority", label: "Brand foundation" },
  { id: "stakes", scene: "stakes", label: "Positioning cost" },
  { id: "education", scene: "education", label: "Perception" },
  { id: "deliverables", scene: "deliverables", label: "The archive" },
  { id: "imagine", scene: "imagine", label: "Project map" },
  { id: "health", scene: "health", label: "Health check" },
  { id: "audit", scene: "audit", label: "Recognition audit" },
  { id: "book", scene: "book", label: "Strategy room" },
] as const;

const SCENE_PROGRESS_EVENT = "bt:services-scene-progress";
const ACTIVE_CHAPTER_EVENT = "bt:services-active-chapter";
const FORM_CONTROL_SELECTOR =
  "input, textarea, select, [contenteditable='true'], [role='textbox']";

type SceneRecord = {
  id: string;
  label: string;
  element: HTMLElement;
  progress: number;
};

type NavigatorWithHints = Navigator & {
  connection?: { saveData?: boolean; effectiveType?: string };
  deviceMemory?: number;
};

function clamp(value: number, minimum = 0, maximum = 1) {
  return Math.min(maximum, Math.max(minimum, value));
}

function ensureSceneSignal(scene: HTMLElement, name: string) {
  if (scene.querySelector(":scope > [data-services-scroll-signal]")) return;
  const signal = document.createElement("span");
  signal.dataset.servicesScrollSignal = name;
  signal.setAttribute("aria-hidden", "true");
  scene.append(signal);
}

function assignSceneIdentity(root: HTMLElement) {
  const main = root.querySelector<HTMLElement>("main");
  const hero = main?.querySelector<HTMLElement>(":scope > section:first-of-type");
  if (hero) {
    hero.id ||= "services-opening";
    hero.dataset.servicesScene = "opening";
  }

  CHAPTERS.forEach((chapter, index) => {
    const scene =
      root.querySelector<HTMLElement>(`#${chapter.id}`) ??
      root.querySelector<HTMLElement>(`[data-services-scene="${chapter.scene}"]`);
    if (!scene) return;

    scene.id ||= chapter.id;
    scene.dataset.servicesScene ||= chapter.scene;
    scene.dataset.servicesChapterIndex = String(index);
    scene.dataset.servicesChapterLabel = chapter.label;
    scene.style.setProperty("--services-progress", "0");
    scene.style.setProperty("--services-line", "0%");
    scene.style.setProperty("--services-shift-x", "0px");
    scene.style.setProperty("--services-shift-y", "0px");
    scene.style.setProperty("--services-scene-scale", "1");
    ensureSceneSignal(scene, chapter.scene);
  });

  const offeringScene = root.querySelector<HTMLElement>("#offerings");
  if (offeringScene) {
    const stage = Array.from(offeringScene.children).find(
      (child): child is HTMLElement =>
        child instanceof HTMLElement &&
        child.classList.contains("relative") &&
        Boolean(child.querySelector('[role="tablist"]')),
    );
    if (stage) stage.dataset.servicesStickyStage = "true";
  }

  const heroCopy = hero
    ? Array.from(hero.children).find(
        (child): child is HTMLElement =>
          child instanceof HTMLElement && Boolean(child.querySelector("h1")),
      )
    : null;
  if (heroCopy) heroCopy.dataset.servicesHeroCopy = "true";
}

function collectScenes(root: HTMLElement): SceneRecord[] {
  return CHAPTERS.flatMap((chapter) => {
    const element = root.querySelector<HTMLElement>(`#${chapter.id}`);
    return element
      ? [{ id: chapter.id, label: chapter.label, element, progress: 0 }]
      : [];
  });
}

export function ServicesScrollExperience() {
  const markerRef = useRef<HTMLSpanElement>(null);
  const prefersReducedMotion = Boolean(useHydratedReducedMotion());
  const [activeId, setActiveId] = useState(CHAPTERS[0].id);
  const [mobileOpen, setMobileOpen] = useState(false);

  const chooseChapter = useCallback(
    (id: string) => {
      const target = document.getElementById(id);
      if (!target) return;
      setMobileOpen(false);
      target.scrollIntoView({
        behavior: prefersReducedMotion ? "auto" : "smooth",
        block: "start",
      });
    },
    [prefersReducedMotion],
  );

  useEffect(() => {
    const marker = markerRef.current;
    const maybeRoot = marker?.closest<HTMLElement>("[data-services-scroll-root]");
    if (!maybeRoot) return;
    const root: HTMLElement = maybeRoot;

    assignSceneIdentity(root);
    let scenes = collectScenes(root);
    if (!scenes.length) return;

    root.dataset.servicesScrollReady = "true";
    root.dataset.servicesDirection = "down";
    root.dataset.servicesActiveScene = scenes[0].id;

    const ratios = new Map<HTMLElement, number>();
    let activeScene = scenes[0];
    let lastScrollY = window.scrollY;
    let scheduledFrame = 0;
    let formInteraction = false;

    function announceActive(next: SceneRecord) {
      if (next.id === activeScene.id) return;
      activeScene.element.dataset.servicesActive = "false";
      next.element.dataset.servicesActive = "true";
      activeScene = next;
      root.dataset.servicesActiveScene = next.id;
      setActiveId(next.id);
      window.dispatchEvent(
        new CustomEvent(ACTIVE_CHAPTER_EVENT, {
          detail: { id: next.id, label: next.label },
        }),
      );
      if (next.id === "book") setMobileOpen(false);
    }

    scenes[0].element.dataset.servicesActive = "true";

    const chapterObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          ratios.set(
            entry.target as HTMLElement,
            entry.isIntersecting ? entry.intersectionRatio : 0,
          );
        });

        let best = activeScene;
        let bestRatio = -1;
        scenes.forEach((scene) => {
          const ratio = ratios.get(scene.element) ?? 0;
          if (ratio > bestRatio) {
            bestRatio = ratio;
            best = scene;
          }
        });
        if (bestRatio > 0) announceActive(best);
      },
      {
        rootMargin: "-16% 0px -48% 0px",
        threshold: [0, 0.08, 0.2, 0.42, 0.68],
      },
    );
    scenes.forEach((scene) => chapterObserver.observe(scene.element));

    function updateSceneProgress() {
      scheduledFrame = 0;
      const viewportHeight = Math.max(1, window.innerHeight);
      const nextScrollY = window.scrollY;
      const direction = nextScrollY >= lastScrollY ? "down" : "up";
      root.dataset.servicesDirection = direction;
      lastScrollY = nextScrollY;

      scenes.forEach((scene) => {
        const bounds = scene.element.getBoundingClientRect();
        const start = viewportHeight * 0.84;
        const end = viewportHeight * 0.16 - bounds.height;
        const denominator = Math.max(1, start - end);
        const progress = prefersReducedMotion
          ? bounds.bottom > 0 && bounds.top < viewportHeight
            ? 1
            : 0
          : clamp((start - bounds.top) / denominator);

        if (Math.abs(progress - scene.progress) < 0.002) return;
        scene.progress = progress;
        scene.element.style.setProperty("--services-progress", progress.toFixed(4));
        scene.element.style.setProperty(
          "--services-line",
          `${(progress * 100).toFixed(2)}%`,
        );
        scene.element.style.setProperty(
          "--services-shift-x",
          `${((progress - 0.5) * 22).toFixed(2)}px`,
        );
        scene.element.style.setProperty(
          "--services-shift-y",
          `${((0.5 - progress) * 18).toFixed(2)}px`,
        );
        scene.element.style.setProperty(
          "--services-scene-scale",
          (1 + progress * 0.018).toFixed(4),
        );

        if (
          bounds.bottom >= -viewportHeight * 0.2 &&
          bounds.top <= viewportHeight * 1.2
        ) {
          window.dispatchEvent(
            new CustomEvent(SCENE_PROGRESS_EVENT, {
              detail: {
                id: scene.id,
                scene: scene.element.dataset.servicesScene,
                progress,
                direction,
              },
            }),
          );
        }
      });
    }

    function scheduleProgress() {
      if (scheduledFrame) return;
      scheduledFrame = window.requestAnimationFrame(updateSceneProgress);
    }

    const videos = new Set<HTMLVideoElement>();
    const videoRatios = new Map<HTMLVideoElement, number>();
    const videoCleanups = new Map<HTMLVideoElement, () => void>();
    const viewportProfile = window.matchMedia("(max-width: 767px)");
    const navigatorHints = navigator as NavigatorWithHints;
    const constrainedConnection =
      Boolean(navigatorHints.connection?.saveData) ||
      navigatorHints.connection?.effectiveType === "2g" ||
      navigatorHints.connection?.effectiveType === "slow-2g";
    const lowMemory =
      typeof navigatorHints.deviceMemory === "number" &&
      navigatorHints.deviceMemory <= 4;

    function videoBudget() {
      return viewportProfile.matches || constrainedConnection || lowMemory ? 1 : 2;
    }

    function distanceFromCentre(video: HTMLVideoElement) {
      const bounds = video.getBoundingClientRect();
      return Math.abs(bounds.top + bounds.height / 2 - window.innerHeight / 2);
    }

    function syncVideos() {
      const allowed = new Set(
        [...videoRatios.entries()]
          .filter(([video, ratio]) => video.isConnected && ratio > 0.02)
          .sort(([videoA, ratioA], [videoB, ratioB]) => {
            if (Math.abs(ratioA - ratioB) > 0.04) return ratioB - ratioA;
            return distanceFromCentre(videoA) - distanceFromCentre(videoB);
          })
          .slice(0, videoBudget())
          .map(([video]) => video),
      );

      videos.forEach((video) => {
        const shouldPlay =
          !prefersReducedMotion &&
          !document.hidden &&
          !formInteraction &&
          allowed.has(video);
        if (shouldPlay) {
          if (video.paused) void video.play().catch(() => undefined);
        } else if (!video.paused) {
          video.pause();
        }
      });
    }

    const videoObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          videoRatios.set(
            entry.target as HTMLVideoElement,
            entry.isIntersecting ? entry.intersectionRatio : 0,
          );
        });
        syncVideos();
      },
      {
        rootMargin: "20% 0px",
        threshold: [0, 0.02, 0.25, 0.5, 0.75],
      },
    );

    function trackVideo(video: HTMLVideoElement) {
      if (videos.has(video)) return;
      videos.add(video);
      video.dataset.servicesMediaManaged = "true";
      const resync = () => queueMicrotask(syncVideos);
      video.addEventListener("play", resync);
      videoObserver.observe(video);
      videoCleanups.set(video, () => {
        video.removeEventListener("play", resync);
        videoObserver.unobserve(video);
        videoRatios.delete(video);
      });
    }
    root.querySelectorAll<HTMLVideoElement>("video").forEach(trackVideo);

    const mutationObserver = new MutationObserver((records) => {
      let refreshScenes = false;
      records.forEach((record) => {
        record.addedNodes.forEach((node) => {
          if (!(node instanceof Element)) return;
          if (node instanceof HTMLVideoElement) trackVideo(node);
          node.querySelectorAll<HTMLVideoElement>("video").forEach(trackVideo);
          if (
            node.matches?.("[data-services-scene]") ||
            node.querySelector?.("[data-services-scene]")
          ) {
            refreshScenes = true;
          }
        });
      });
      if (refreshScenes) {
        scenes.forEach((scene) => chapterObserver.unobserve(scene.element));
        assignSceneIdentity(root);
        scenes = collectScenes(root);
        scenes.forEach((scene) => chapterObserver.observe(scene.element));
      }
      scheduleProgress();
      syncVideos();
    });
    mutationObserver.observe(root, { childList: true, subtree: true });

    function onFocusIn(event: FocusEvent) {
      const target = event.target;
      if (!(target instanceof Element) || !target.matches(FORM_CONTROL_SELECTOR))
        return;
      formInteraction = true;
      root.dataset.servicesFormInteraction = "true";
      syncVideos();
    }

    function onFocusOut() {
      window.setTimeout(() => {
        const active = document.activeElement;
        formInteraction = Boolean(
          active instanceof Element &&
            root.contains(active) &&
            active.matches(FORM_CONTROL_SELECTOR),
        );
        root.dataset.servicesFormInteraction = formInteraction ? "true" : "false";
        syncVideos();
      }, 0);
    }

    function onVisibilityChange() {
      syncVideos();
    }

    window.addEventListener("scroll", scheduleProgress, { passive: true });
    window.addEventListener("resize", scheduleProgress, { passive: true });
    viewportProfile.addEventListener("change", syncVideos);
    document.addEventListener("visibilitychange", onVisibilityChange);
    root.addEventListener("focusin", onFocusIn);
    root.addEventListener("focusout", onFocusOut);
    updateSceneProgress();
    syncVideos();

    return () => {
      window.cancelAnimationFrame(scheduledFrame);
      window.removeEventListener("scroll", scheduleProgress);
      window.removeEventListener("resize", scheduleProgress);
      viewportProfile.removeEventListener("change", syncVideos);
      document.removeEventListener("visibilitychange", onVisibilityChange);
      root.removeEventListener("focusin", onFocusIn);
      root.removeEventListener("focusout", onFocusOut);
      mutationObserver.disconnect();
      chapterObserver.disconnect();
      videoObserver.disconnect();
      videoCleanups.forEach((cleanup) => cleanup());
      videos.forEach((video) => video.pause());
      root.removeAttribute("data-services-scroll-ready");
      root.removeAttribute("data-services-active-scene");
      root.removeAttribute("data-services-direction");
    };
  }, [prefersReducedMotion]);

  const activeIndex = Math.max(
    0,
    CHAPTERS.findIndex((chapter) => chapter.id === activeId),
  );
  const active = CHAPTERS[activeIndex] ?? CHAPTERS[0];
  const hiddenForArrival = active.id === "book";

  return (
    <>
      <span ref={markerRef} className="sr-only" aria-hidden="true" />

      {!hiddenForArrival && (
        <nav
          data-services-progress="desktop"
          aria-label="Services chapter progress"
          className="services-progress services-progress--desktop"
        >
          <span className="services-progress__current" aria-live="polite">
            <small>{String(activeIndex + 1).padStart(2, "0")}</small>
            <span>{active.label}</span>
          </span>
          <ol>
            {CHAPTERS.map((chapter, index) => {
              const selected = chapter.id === active.id;
              return (
                <li key={chapter.id}>
                  <button
                    type="button"
                    aria-current={selected ? "step" : undefined}
                    aria-label={`Open chapter ${index + 1}: ${chapter.label}`}
                    onClick={() => chooseChapter(chapter.id)}
                  >
                    <i aria-hidden="true" />
                    <span>{chapter.label}</span>
                  </button>
                </li>
              );
            })}
          </ol>
        </nav>
      )}

      {!hiddenForArrival && (
        <nav
          data-services-progress="mobile"
          aria-label="Services chapter progress"
          className="services-progress services-progress--mobile"
        >
          {mobileOpen && (
            <div className="services-progress__mobile-menu">
              <div>
                <p>Explore the services film</p>
                <button
                  type="button"
                  onClick={() => setMobileOpen(false)}
                  aria-label="Close chapter menu"
                >
                  <X size={16} />
                </button>
              </div>
              <ol>
                {CHAPTERS.map((chapter, index) => (
                  <li key={chapter.id}>
                    <button
                      type="button"
                      aria-current={chapter.id === active.id ? "step" : undefined}
                      onClick={() => chooseChapter(chapter.id)}
                    >
                      <small>{String(index + 1).padStart(2, "0")}</small>
                      <span>{chapter.label}</span>
                    </button>
                  </li>
                ))}
              </ol>
            </div>
          )}
          <button
            type="button"
            className="services-progress__mobile-trigger"
            aria-expanded={mobileOpen}
            aria-label={`${mobileOpen ? "Close" : "Open"} Services chapter guide. Current chapter ${activeIndex + 1} of ${CHAPTERS.length}: ${active.label}`}
            onClick={() => setMobileOpen((open) => !open)}
          >
            <Compass size={15} strokeWidth={1.5} aria-hidden="true" />
            <span>{String(activeIndex + 1).padStart(2, "0")}</span>
            <small>/ {String(CHAPTERS.length).padStart(2, "0")}</small>
          </button>
        </nav>
      )}
    </>
  );
}
