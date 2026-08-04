"use client";

import { useEffect } from "react";

const MAX_SIMULTANEOUS_FILMS = 2;
const REDUCED_QUERY = "(prefers-reduced-motion: reduce)";
const HIDDEN_FLAG = "homeMotionHidden";

function visibleArea(video: HTMLVideoElement) {
  const rect = video.getBoundingClientRect();
  const width = Math.max(0, Math.min(rect.right, window.innerWidth) - Math.max(rect.left, 0));
  const height = Math.max(0, Math.min(rect.bottom, window.innerHeight) - Math.max(rect.top, 0));
  return width * height;
}

/**
 * The homepage is one film, so playback needs one director rather than a
 * collection of independent clips. Individual scenes may request playback,
 * but this component enforces the final edit: never more than two visible
 * films decode at once, and reduced motion always resolves to the poster
 * underneath the video element.
 */
export function HomeMediaDirector() {
  useEffect(() => {
    const media = window.matchMedia(REDUCED_QUERY);
    let frame = 0;

    const schedule = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(enforce);
    };

    const enforce = () => {
      const videos = Array.from(document.querySelectorAll<HTMLVideoElement>("main video"));
      const reduced =
        media.matches || document.documentElement.dataset.motion === "reduced";

      if (reduced) {
        for (const video of videos) {
          video.pause();
          video.dataset[HIDDEN_FLAG] = "1";
          video.style.visibility = "hidden";
        }
        return;
      }

      for (const video of videos) {
        if (video.dataset[HIDDEN_FLAG]) {
          delete video.dataset[HIDDEN_FLAG];
          video.style.visibility = "";
        }
      }

      const visible = videos
        .map((video) => ({ video, area: visibleArea(video) }))
        .filter(({ area }) => area > 0)
        .sort((a, b) => b.area - a.area);
      const allowed = new Set(
        visible.slice(0, MAX_SIMULTANEOUS_FILMS).map(({ video }) => video),
      );

      for (const video of videos) {
        if (!allowed.has(video) && !video.paused) video.pause();
      }
    };

    const onPlay = (event: Event) => {
      if (event.target instanceof HTMLVideoElement) schedule();
    };

    const mutations = new MutationObserver(schedule);
    mutations.observe(document.body, { childList: true, subtree: true });
    document.addEventListener("play", onPlay, true);
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    document.addEventListener("visibilitychange", schedule);

    if (typeof media.addEventListener === "function") {
      media.addEventListener("change", schedule);
    } else {
      media.addListener(schedule);
    }

    schedule();

    return () => {
      cancelAnimationFrame(frame);
      mutations.disconnect();
      document.removeEventListener("play", onPlay, true);
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
      document.removeEventListener("visibilitychange", schedule);
      if (typeof media.removeEventListener === "function") {
        media.removeEventListener("change", schedule);
      } else {
        media.removeListener(schedule);
      }
    };
  }, []);

  return null;
}
