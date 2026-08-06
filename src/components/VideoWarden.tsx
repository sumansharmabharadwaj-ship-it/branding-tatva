"use client";

import { useEffect } from "react";

const MARGIN = "18% 0px";
const FLAG = "wardenPaused";

// How many videos may decode at once. A phone doing three at a time drops
// frames on exactly the scroll this site is built around, so it gets one.
function concurrencyBudget() {
  const nav = navigator as Navigator & {
    connection?: { saveData?: boolean; effectiveType?: string };
    deviceMemory?: number;
  };
  const constrained =
    Boolean(nav.connection?.saveData) ||
    nav.connection?.effectiveType === "2g" ||
    nav.connection?.effectiveType === "slow-2g";
  const lowMemory = typeof nav.deviceMemory === "number" && nav.deviceMemory <= 4;
  const compact = window.matchMedia("(max-width: 720px)").matches;
  return constrained || lowMemory || compact ? 1 : 2;
}

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
      const budget = concurrencyBudget();

      // Every video in the document, rather than only the ones the observer
      // has reported. An earlier version trusted the observer alone, and any
      // video it had yet to report kept playing outside the budget entirely.
      const all = [...document.querySelectorAll<HTMLVideoElement>("video")];

      // Videos claimed by a page level director are outside this component's
      // control, but they still consume decoding capacity, so they count
      // against the same budget rather than sitting beside it.
      const claimed = all.filter(
        (video) => video.dataset.autoplayManaged === "true" && !video.paused,
      ).length;

      const free = Math.max(0, budget - claimed);
      const governed = all.filter((video) => video.dataset.autoplayManaged !== "true");

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
          .slice(0, free),
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

    // A video component may start itself after the arbitration above ran, so
    // re-arbitrate whenever one begins playing.
    document.addEventListener("play", schedule, true);

    return () => {
      if (frame) cancelAnimationFrame(frame);
      document.removeEventListener("play", schedule, true);
      observer.disconnect();
      mutations.disconnect();
    };
  }, []);

  return null;
}
