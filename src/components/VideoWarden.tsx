"use client";

import { useEffect } from "react";

const MARGIN = "18% 0px";
const FLAG = "wardenPaused";


function distanceFromViewportCentre(video: HTMLVideoElement) {
  const rect = video.getBoundingClientRect();
  return Math.abs(rect.top + rect.height / 2 - window.innerHeight / 2);
}

// How much of the screen this video occupies, 0 to 1.
function viewportCoverage(video: HTMLVideoElement) {
  const rect = video.getBoundingClientRect();
  const visibleHeight =
    Math.max(0, Math.min(rect.bottom, window.innerHeight) - Math.max(rect.top, 0));
  return visibleHeight / window.innerHeight;
}

export function VideoWarden() {
  useEffect(() => {
    let frame = 0;

    function onScreen(video: HTMLVideoElement) {
      const rect = video.getBoundingClientRect();
      if (rect.width === 0 || rect.height === 0) return false;
      const margin = window.innerHeight * 0.18;
      return rect.bottom > -margin && rect.top < window.innerHeight + margin;
    }

    function arbitrate() {
      frame = 0;
      // Every video in the document, rather than only the ones the observer
      // has reported. An earlier version trusted the observer alone, and any
      // video it had yet to report kept playing outside the budget entirely.
      const all = [...document.querySelectorAll<HTMLVideoElement>("video")];

      // One cinematic owner at a time. Page-level directors may request play,
      // but the warden remains the final arbiter so adjacent scenes never
      // compete for attention or decoding capacity.
      const governed = all;

      const allowed = new Set(
        governed
          .filter(onScreen)
          // A full bleed background filling the screen matters more than a
          // small inline clip that happens to sit nearer the middle. Ranking
          // by nearness alone left backgrounds frozen behind the copy, so
          // coverage decides first and nearness only breaks ties.
          .sort((a, b) => {
            const coverA = viewportCoverage(a);
            const coverB = viewportCoverage(b);
            if (Math.abs(coverA - coverB) > 0.08) return coverB - coverA;
            return distanceFromViewportCentre(a) - distanceFromViewportCentre(b);
          })
          .slice(0, 1),
      );

      governed.forEach((video) => {
        if (allowed.has(video)) {
          if (video.paused) {
            delete video.dataset[FLAG];
            void video.play().catch(() => undefined);
          }
        } else if (!video.paused) {
          video.dataset[FLAG] = "1";
          video.pause();
        }
      });
    }

    function schedule() {
      if (frame) return;
      frame = requestAnimationFrame(arbitrate);
    }

    const observer = new IntersectionObserver(
      // The observer is purely a trigger now: any crossing means the picture
      // changed, so re-arbitrate. What actually plays is decided in arbitrate.
      () => schedule(),
      { rootMargin: MARGIN, threshold: [0, 0.1, 0.35, 0.6] },
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

    // A video component may start itself after arbitration ran. Re-arbitrate
    // on play, visibility recovery, resizing and native scrolling so the
    // dominant owner remains correct through every handoff.
    document.addEventListener("play", schedule, true);
    document.addEventListener("visibilitychange", schedule);
    window.addEventListener("resize", schedule, { passive: true });
    window.addEventListener("scroll", schedule, { passive: true });

    return () => {
      if (frame) cancelAnimationFrame(frame);
      document.removeEventListener("play", schedule, true);
      document.removeEventListener("visibilitychange", schedule);
      window.removeEventListener("resize", schedule);
      window.removeEventListener("scroll", schedule);
      observer.disconnect();
      mutations.disconnect();
    };
  }, []);

  return null;
}
