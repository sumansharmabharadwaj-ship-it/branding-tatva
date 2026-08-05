"use client";

import { useEffect } from "react";

const MARGIN = "18% 0px";
const FLAG = "wardenPaused";

export function VideoWarden() {
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          const video = entry.target as HTMLVideoElement;

          if (video.dataset.autoplayManaged === "true") {
            delete video.dataset[FLAG];
            continue;
          }

          if (!entry.isIntersecting) {
            if (!video.paused) {
              video.dataset[FLAG] = "1";
              video.pause();
            }
          } else if (video.dataset[FLAG]) {
            delete video.dataset[FLAG];
            void video.play().catch(() => undefined);
          }
        }
      },
      { rootMargin: MARGIN },
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

    return () => {
      observer.disconnect();
      mutations.disconnect();
    };
  }, []);

  return null;
}
