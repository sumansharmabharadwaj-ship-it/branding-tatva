"use client";

import { useEffect } from "react";

// The sitewide video budget enforcer (SCROLL_OS §17–§18). The
// scroll fatigue audit measured nineteen videos decoding at once on
// Home: section-level observers pause their own consumers offscreen,
// while this final guard prevents independently managed clips from
// escaping the page's playback budget.
const MARGIN = "5% 0px";
const FLAG = "wardenPaused";
const HOME_HIDDEN_FLAG = "homeMotionHidden";
const REDUCED_QUERY = "(prefers-reduced-motion: reduce)";

export function VideoWarden() {
  useEffect(() => {
    const reducedMotion = window.matchMedia(REDUCED_QUERY);

    const shouldStayPaused = (video: HTMLVideoElement) =>
      reducedMotion.matches ||
      document.documentElement.dataset.motion === "reduced" ||
      Boolean(video.dataset[HOME_HIDDEN_FLAG]) ||
      video.style.visibility === "hidden";

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          const video = entry.target as HTMLVideoElement;

          if (shouldStayPaused(video)) {
            video.pause();
            continue;
          }

          if (!entry.isIntersecting) {
            if (!video.paused) {
              video.dataset[FLAG] = "1";
              video.pause();
            }
          } else if (video.dataset[FLAG]) {
            delete video.dataset[FLAG];
            video.play().catch(() => {});
          }
        }
      },
      { rootMargin: MARGIN },
    );

    const watched = new WeakSet<HTMLVideoElement>();
    function watchAll() {
      document.querySelectorAll("video").forEach((video) => {
        if (!watched.has(video)) {
          watched.add(video);
          observer.observe(video);
        }
      });
    }

    const pauseForPreference = () => {
      if (
        reducedMotion.matches ||
        document.documentElement.dataset.motion === "reduced"
      ) {
        document.querySelectorAll<HTMLVideoElement>("video").forEach((video) =>
          video.pause(),
        );
      }
    };

    watchAll();
    pauseForPreference();

    const mutations = new MutationObserver(() => {
      watchAll();
      pauseForPreference();
    });
    mutations.observe(document.body, { childList: true, subtree: true });

    if (typeof reducedMotion.addEventListener === "function") {
      reducedMotion.addEventListener("change", pauseForPreference);
    } else {
      reducedMotion.addListener(pauseForPreference);
    }

    return () => {
      observer.disconnect();
      mutations.disconnect();
      if (typeof reducedMotion.removeEventListener === "function") {
        reducedMotion.removeEventListener("change", pauseForPreference);
      } else {
        reducedMotion.removeListener(pauseForPreference);
      }
    };
  }, []);

  return null;
}
