"use client";

import { useEffect } from "react";
import { isVideoVisuallyEligible } from "@/lib/videoVisibility";

// Sitewide video budget enforcer. It pauses media outside the viewport and
// only resumes a film it paused itself when the film remains visually eligible.
// Hidden sticky slides stay asleep while active decorative scene films can
// continue even when they are removed from the accessibility tree.
const MARGIN = "5% 0px";
const FLAG = "wardenPaused";

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

          if (video.dataset[FLAG] && isVideoVisuallyEligible(video)) {
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
        if (video.dataset[FLAG] && isVideoVisuallyEligible(video)) {
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
