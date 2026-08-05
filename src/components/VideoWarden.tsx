"use client";

import { useEffect } from "react";
import { isVideoVisuallyEligible } from "@/lib/videoVisibility";

// Sitewide video budget enforcer. It pauses media outside the viewport and
// only resumes a film it paused itself when the film remains visually eligible.
// Hidden sticky slides stay asleep while active decorative scene films can
// continue even when they are removed from the accessibility tree.
const MARGIN = "5% 0px";
const FLAG = "wardenPaused";

function reducedMotionIsActive(mediaQuery: MediaQueryList) {
  return (
    document.documentElement.dataset.motion === "reduced" ||
    mediaQuery.matches
  );
}

function pauseForWarden(video: HTMLVideoElement) {
  if (video.paused) return;
  video.dataset[FLAG] = "1";
  video.pause();
}

function resumeIfEligible(
  video: HTMLVideoElement,
  reduceMotion: boolean,
) {
  if (
    document.hidden ||
    reduceMotion ||
    !video.dataset[FLAG] ||
    !isVideoVisuallyEligible(video)
  ) {
    return;
  }

  delete video.dataset[FLAG];
  void video.play().catch(() => {});
}

export function VideoWarden() {
  useEffect(() => {
    const motionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");

    const observer = new IntersectionObserver(
      (entries) => {
        const reduceMotion = reducedMotionIsActive(motionQuery);

        for (const entry of entries) {
          const video = entry.target as HTMLVideoElement;

          if (
            document.hidden ||
            reduceMotion ||
            !entry.isIntersecting ||
            !isVideoVisuallyEligible(video)
          ) {
            pauseForWarden(video);
            continue;
          }

          resumeIfEligible(video, reduceMotion);
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

    function syncAll() {
      const reduceMotion = reducedMotionIsActive(motionQuery);

      document.querySelectorAll<HTMLVideoElement>("video").forEach((video) => {
        if (
          document.hidden ||
          reduceMotion ||
          !isVideoVisuallyEligible(video)
        ) {
          pauseForWarden(video);
          return;
        }

        resumeIfEligible(video, reduceMotion);
      });
    }

    function onVisibilityChange() {
      syncAll();
    }

    function onPageHide() {
      document.querySelectorAll<HTMLVideoElement>("video").forEach(
        pauseForWarden,
      );
    }

    function onPageShow() {
      window.requestAnimationFrame(syncAll);
      window.setTimeout(syncAll, 500);
    }

    watchAll();

    const mutations = new MutationObserver(() => {
      watchAll();
      syncAll();
    });
    mutations.observe(document.body, { childList: true, subtree: true });

    const motionAttributeObserver = new MutationObserver(syncAll);
    motionAttributeObserver.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["data-motion"],
    });

    document.addEventListener("visibilitychange", onVisibilityChange);
    window.addEventListener("pagehide", onPageHide);
    window.addEventListener("pageshow", onPageShow);
    motionQuery.addEventListener("change", syncAll);

    return () => {
      observer.disconnect();
      mutations.disconnect();
      motionAttributeObserver.disconnect();
      document.removeEventListener("visibilitychange", onVisibilityChange);
      window.removeEventListener("pagehide", onPageHide);
      window.removeEventListener("pageshow", onPageShow);
      motionQuery.removeEventListener("change", syncAll);
    };
  }, []);

  return null;
}
