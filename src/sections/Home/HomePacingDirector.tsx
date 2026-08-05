"use client";

import { useEffect } from "react";

const PLAYBACK_RATE = 1.18;
const DESKTOP_MAX_ACTIVE_FILMS = 2;
const MOBILE_MAX_ACTIVE_FILMS = 1;
const SECTION_SELECTOR = "[data-home-section], [data-home-chapter], [data-home-v4-chapter]";

type VideoState = {
  ratio: number;
  near: boolean;
};

function prepareVideo(video: HTMLVideoElement, reducedMotion: MediaQueryList) {
  video.muted = true;
  video.defaultMuted = true;
  video.playsInline = true;
  video.loop = true;
  video.playbackRate = reducedMotion.matches ? 1 : PLAYBACK_RATE;
  video.dataset.autoplayManaged = "true";
}

export function HomePacingDirector() {
  useEffect(() => {
    const mainContent = document.getElementById("main-content");
    if (!mainContent) return;
    const main = mainContent;

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const compactViewport = window.matchMedia("(max-width: 767px)");
    const states = new Map<HTMLVideoElement, VideoState>();
    let videoObserver: IntersectionObserver | null = null;
    let sectionObserver: IntersectionObserver | null = null;
    let mutationObserver: MutationObserver | null = null;
    let refreshFrame = 0;

    const maxActiveFilms = () =>
      compactViewport.matches ? MOBILE_MAX_ACTIVE_FILMS : DESKTOP_MAX_ACTIVE_FILMS;

    function pause(video: HTMLVideoElement) {
      video.pause();
      video.dataset.homeFilmState = "resting";
    }

    function play(video: HTMLVideoElement) {
      prepareVideo(video, reducedMotion);
      if (document.hidden || reducedMotion.matches) {
        pause(video);
        return;
      }

      video.dataset.homeFilmState = "playing";
      void video.play().catch(() => {
        video.dataset.homeFilmState = "poster";
      });
    }

    function reconcilePlayback() {
      refreshFrame = 0;

      const eligible = Array.from(states.entries())
        .filter(([, state]) => state.near && state.ratio > 0.035)
        .sort((a, b) => b[1].ratio - a[1].ratio)
        .slice(0, maxActiveFilms())
        .map(([video]) => video);

      states.forEach((_state, video) => {
        if (eligible.includes(video)) play(video);
        else pause(video);
      });
    }

    function scheduleReconcile() {
      if (refreshFrame) return;
      refreshFrame = window.requestAnimationFrame(reconcilePlayback);
    }

    function registerVideos() {
      const videos = Array.from(main.querySelectorAll<HTMLVideoElement>("video"));

      videos.forEach((video) => {
        prepareVideo(video, reducedMotion);
        if (!states.has(video)) {
          states.set(video, { ratio: 0, near: false });
          videoObserver?.observe(video);
        }
      });

      states.forEach((_state, video) => {
        if (!main.contains(video)) {
          videoObserver?.unobserve(video);
          states.delete(video);
        }
      });

      scheduleReconcile();
    }

    videoObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const video = entry.target as HTMLVideoElement;
          states.set(video, {
            ratio: entry.intersectionRatio,
            near: entry.isIntersecting,
          });
        });
        scheduleReconcile();
      },
      {
        rootMargin: "22% 0px 18% 0px",
        threshold: [0, 0.035, 0.12, 0.26, 0.48, 0.72],
      },
    );

    sectionObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const section = entry.target as HTMLElement;
          const active = entry.isIntersecting && entry.intersectionRatio >= 0.1;
          section.dataset.homeSceneState = active ? "active" : "resting";

          if (active) {
            window.dispatchEvent(
              new CustomEvent("bt:home-scene-enter", {
                detail: {
                  id:
                    section.dataset.homeV4Chapter ||
                    section.dataset.homeChapter ||
                    section.dataset.homeSection ||
                    section.id ||
                    undefined,
                },
              }),
            );
          }
        });
      },
      {
        rootMargin: "7% 0px -9% 0px",
        threshold: [0, 0.1, 0.25, 0.48],
      },
    );

    const registerSections = () => {
      main.querySelectorAll<HTMLElement>(SECTION_SELECTOR).forEach((section) => {
        if (section.dataset.homeSceneObserved === "true") return;
        section.dataset.homeSceneObserved = "true";
        section.dataset.homeSceneState = "resting";
        sectionObserver?.observe(section);
      });
    };

    const refresh = () => {
      registerVideos();
      registerSections();
    };

    const onVisibility = () => scheduleReconcile();
    const onViewportChange = () => scheduleReconcile();
    const onCanPlay = (event: Event) => {
      if (!(event.target instanceof HTMLVideoElement) || !main.contains(event.target)) return;
      prepareVideo(event.target, reducedMotion);
      scheduleReconcile();
    };

    refresh();

    mutationObserver = new MutationObserver(refresh);
    mutationObserver.observe(main, {
      childList: true,
      subtree: true,
    });

    document.addEventListener("visibilitychange", onVisibility);
    document.addEventListener("canplay", onCanPlay, true);
    reducedMotion.addEventListener("change", onViewportChange);
    compactViewport.addEventListener("change", onViewportChange);
    window.addEventListener("pageshow", onVisibility);
    window.addEventListener("focus", onVisibility);

    return () => {
      window.cancelAnimationFrame(refreshFrame);
      mutationObserver?.disconnect();
      videoObserver?.disconnect();
      sectionObserver?.disconnect();
      states.forEach((_state, video) => pause(video));
      document.removeEventListener("visibilitychange", onVisibility);
      document.removeEventListener("canplay", onCanPlay, true);
      reducedMotion.removeEventListener("change", onViewportChange);
      compactViewport.removeEventListener("change", onViewportChange);
      window.removeEventListener("pageshow", onVisibility);
      window.removeEventListener("focus", onVisibility);
    };
  }, []);

  return null;
}
