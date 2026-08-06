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

function clamp(value: number) {
  return Math.min(1, Math.max(0, value));
}

function ensureSceneSignal(scene: HTMLElement, name: string) {
  if (scene.querySelector(":scope > [data-services-scroll-signal]")) return;
  const signal = document.createElement("span");
  signal.dataset.servicesScrollSignal = name;
  signal.setAttribute("aria-hidden", "true");
  scene.append(signal);
}

function prepareScenes(root: HTMLElement) {
  const main = root.querySelector<HTMLElement>("main");
  const hero = main?.querySelector<HTMLElement>(":scope > section:first-of-type");
  if (hero) {
    hero.id ||= "services-opening";
    hero.dataset.servicesScene = "opening";
    const copy = Array.from(hero.children).find(
      (child): child is HTMLElement =>
        child instanceof HTMLElement && Boolean(child.querySelector("h1")),
    );
    if (copy) copy.dataset.servicesHeroCopy = "true";
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
    ensureSceneSignal(scene, chapter.scene);
  });

  const offeringScene = root.querySelector<HTMLElement>("#offerings");
  const offeringStage = offeringScene
    ? Array.from(offeringScene.children).find(
        (child): child is HTMLElement =>
          child instanceof HTMLElement &&
          child.classList.contains("relative") &&
          Boolean(child.querySelector('[role="tablist"]')),
      )
    : null;
  if (offeringStage) offeringStage.dataset.servicesStickyStage = "true";
}

function readScenes(root: HTMLElement): SceneRecord[] {
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
    const root = markerRef.current?.closest<HTMLElement>("[data-services-scroll-root]")!;
    if (!root) return;

    prepareScenes(root);
    const scenes = readScenes(root);
    if (!scenes.length) return;

    root.dataset.servicesScrollReady = "true";
    root.dataset.servicesDirection = "down";
    root.dataset.servicesActiveScene = scenes[0].id;
    scenes[0].element.dataset.servicesActive = "true";

    let activeScene = scenes[0];
    let lastScrollY = window.scrollY;
    let frame = 0;
    let formInteraction = false;
    const ratios = new Map<HTMLElement, number>();

    function activate(next: SceneRecord) {
      if (next.id === activeScene.id) return;
      activeScene.element.dataset.servicesActive = "false";
      next.element.dataset.servicesActive = "true";
      activeScene = next;
      root.dataset.servicesActiveScene = next.id;
      setActiveId(next.id);
      if (next.id === "book") setMobileOpen(false);
    }

    const sceneObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          ratios.set(entry.target as HTMLElement, entry.isIntersecting ? entry.intersectionRatio : 0);
        });
        const ranked = scenes
          .map((scene) => ({ scene, ratio: ratios.get(scene.element) ?? 0 }))
          .sort((a, b) => b.ratio - a.ratio);
        if (ranked[0]?.ratio > 0) activate(ranked[0].scene);
      },
      {
        rootMargin: "-16% 0px -48% 0px",
        threshold: [0, 0.08, 0.2, 0.42, 0.68],
      },
    );
    scenes.forEach((scene) => sceneObserver.observe(scene.element));

    function updateProgress() {
      frame = 0;
      const viewport = Math.max(1, window.innerHeight);
      const scrollY = window.scrollY;
      const direction = scrollY >= lastScrollY ? "down" : "up";
      root.dataset.servicesDirection = direction;
      lastScrollY = scrollY;

      scenes.forEach((scene) => {
        const bounds = scene.element.getBoundingClientRect();
        const start = viewport * 0.84;
        const end = viewport * 0.16 - bounds.height;
        const progress = prefersReducedMotion
          ? bounds.bottom > 0 && bounds.top < viewport
            ? 1
            : 0
          : clamp((start - bounds.top) / Math.max(1, start - end));
        if (Math.abs(progress - scene.progress) < 0.002) return;
        scene.progress = progress;

        scene.element.style.setProperty("--services-progress", progress.toFixed(4));
        scene.element.style.setProperty("--services-line", `${(progress * 100).toFixed(2)}%`);
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

        if (bounds.bottom >= -viewport * 0.2 && bounds.top <= viewport * 1.2) {
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
      if (frame) return;
      frame = window.requestAnimationFrame(updateProgress);
    }

    const videos = new Set<HTMLVideoElement>();
    const videoRatios = new Map<HTMLVideoElement, number>();
    const videoCleanup = new Map<HTMLVideoElement, () => void>();
    const compactViewport = window.matchMedia("(max-width: 767px)");
    const hints = navigator as NavigatorWithHints;
    const constrained =
      Boolean(hints.connection?.saveData) ||
      hints.connection?.effectiveType === "2g" ||
      hints.connection?.effectiveType === "slow-2g" ||
      (typeof hints.deviceMemory === "number" && hints.deviceMemory <= 4);

    function mediaBudget() {
      return compactViewport.matches || constrained ? 1 : 2;
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
          .slice(0, mediaBudget())
          .map(([video]) => video),
      );

      videos.forEach((video) => {
        const shouldPlay =
          !prefersReducedMotion && !document.hidden && !formInteraction && allowed.has(video);
        if (shouldPlay && video.paused) void video.play().catch(() => undefined);
        if (!shouldPlay && !video.paused) video.pause();
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
      { rootMargin: "20% 0px", threshold: [0, 0.02, 0.25, 0.5, 0.75] },
    );

    function registerVideo(video: HTMLVideoElement) {
      if (videos.has(video)) return;
      videos.add(video);
      video.dataset.servicesMediaManaged = "true";
      const resync = () => queueMicrotask(syncVideos);
      video.addEventListener("play", resync);
      videoObserver.observe(video);
      videoCleanup.set(video, () => {
        video.removeEventListener("play", resync);
        videoObserver.unobserve(video);
      });
    }
    root.querySelectorAll<HTMLVideoElement>("video").forEach(registerVideo);

    const mutationObserver = new MutationObserver((records) => {
      records.forEach((record) => {
        record.addedNodes.forEach((node) => {
          if (!(node instanceof Element)) return;
          if (node instanceof HTMLVideoElement) registerVideo(node);
          node.querySelectorAll<HTMLVideoElement>("video").forEach(registerVideo);
        });
      });
      syncVideos();
    });
    mutationObserver.observe(root, { childList: true, subtree: true });

    function onFocusIn(event: FocusEvent) {
      const target = event.target;
      if (!(target instanceof Element) || !target.matches(FORM_CONTROL_SELECTOR)) return;
      formInteraction = true;
      syncVideos();
    }

    function onFocusOut() {
      window.setTimeout(() => {
        const active = document.activeElement;
        formInteraction = Boolean(
          active instanceof Element && root.contains(active) && active.matches(FORM_CONTROL_SELECTOR),
        );
        syncVideos();
      }, 0);
    }

    window.addEventListener("scroll", scheduleProgress, { passive: true });
    window.addEventListener("resize", scheduleProgress, { passive: true });
    compactViewport.addEventListener("change", syncVideos);
    document.addEventListener("visibilitychange", syncVideos);
    root.addEventListener("focusin", onFocusIn);
    root.addEventListener("focusout", onFocusOut);
    updateProgress();
    syncVideos();

    return () => {
      window.cancelAnimationFrame(frame);
      window.removeEventListener("scroll", scheduleProgress);
      window.removeEventListener("resize", scheduleProgress);
      compactViewport.removeEventListener("change", syncVideos);
      document.removeEventListener("visibilitychange", syncVideos);
      root.removeEventListener("focusin", onFocusIn);
      root.removeEventListener("focusout", onFocusOut);
      mutationObserver.disconnect();
      sceneObserver.disconnect();
      videoObserver.disconnect();
      videoCleanup.forEach((cleanup) => cleanup());
      videos.forEach((video) => video.pause());
      delete root.dataset.servicesScrollReady;
      delete root.dataset.servicesActiveScene;
      delete root.dataset.servicesDirection;
    };
  }, [prefersReducedMotion]);

  const activeIndex = Math.max(0, CHAPTERS.findIndex((chapter) => chapter.id === activeId));
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
            {CHAPTERS.map((chapter, index) => (
              <li key={chapter.id}>
                <button
                  type="button"
                  aria-current={chapter.id === active.id ? "step" : undefined}
                  aria-label={`Open chapter ${index + 1}: ${chapter.label}`}
                  onClick={() => chooseChapter(chapter.id)}
                >
                  <i aria-hidden="true" />
                  <span>{chapter.label}</span>
                </button>
              </li>
            ))}
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
