"use client";

import { useEffect } from "react";

// Sitewide video budget enforcer. It pauses media outside the viewport and
// only resumes a film it paused itself when the film is still visually and
// semantically eligible. This prevents a hidden sticky slide or carousel card
// from waking merely because its DOM rectangle intersects the viewport.
const MARGIN = "5% 0px";
const FLAG = "wardenPaused";

function canResume(video: HTMLVideoElement) {
  if (document.hidden || !video.muted || !video.loop) return false;

  const rect = video.getBoundingClientRect();
  if (
    rect.width < 2 ||
    rect.height < 2 ||
    rect.bottom <= 0 ||
    rect.top >= window.innerHeight
  ) {
    return false;
  }

  const decorativeFilm = Boolean(
    video.closest("[data-home-ambient-film], [data-home-film-constellation]"),
  );

  let node: HTMLElement | null = video;
  while (node && node !== document.body) {
    if (node.getAttribute("aria-hidden") === "true" && !decorativeFilm) {
      return false;
    }

    const style = window.getComputedStyle(node);
    if (
      style.display === "none" ||
      style.visibility === "hidden" ||
      Number.parseFloat(style.opacity || "1") <= 0.025
    ) {
      return false;
    }

    node = node.parentElement;
  }

  return true;
}

export function VideoWarden() {
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          const video = entry.target as HTMLVideoElement;

          if (!entry.isIntersecting) {
            if (!video.paused) {
              video.dataset[FLAG] = "1";
              video.pause();
            }
            continue;
          }

          if (video.dataset[FLAG] && canResume(video)) {
            delete video.dataset[FLAG];
            void video.play().catch(() => {});
          }
        }
      },
      { rootMargin: MARGIN, threshold: [0, 0.05, 0.35] },
    );

    const watched = new WeakSet<HTMLVideoElement>();

    function watchAll() {
      document.querySelectorAll<HTMLVideoElement>("video").forEach((video) => {
        if (watched.has(video)) return;
        watched.add(video);
        observer.observe(video);
      });
    }

    watchAll();
    const mutations = new MutationObserver(watchAll);
    mutations.observe(document.body, { childList: true, subtree: true });

    function onVisibilityChange() {
      if (document.hidden) {
        document.querySelectorAll<HTMLVideoElement>("video").forEach((video) => {
          if (!video.paused) {
            video.dataset[FLAG] = "1";
            video.pause();
          }
        });
        return;
      }

      document.querySelectorAll<HTMLVideoElement>("video").forEach((video) => {
        if (video.dataset[FLAG] && canResume(video)) {
          delete video.dataset[FLAG];
          void video.play().catch(() => {});
        }
      });
    }

    document.addEventListener("visibilitychange", onVisibilityChange);

    return () => {
      observer.disconnect();
      mutations.disconnect();
      document.removeEventListener("visibilitychange", onVisibilityChange);
    };
  }, []);

  return null;
}
