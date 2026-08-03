"use client";

import { useEffect } from "react";

// The sitewide video budget enforcer (SCROLL_OS §17–§18). The
// scroll fatigue audit measured nineteen videos decoding at once on
// Home: useVideoFadeIn pauses its own consumers offscreen, but the
// stage managed components (element rows, pinned stages, card loops)
// each own their playback and nothing global enforced the budget.
//
// The warden watches every video on the page, including ones mounted
// later, and PAUSES any playing video that leaves the viewport (25%
// margin so resumes stay ahead of the reveal). It only ever resumes
// a video it paused itself (marked with a data attribute), so stage
// managers that deliberately pause an onscreen video keep full
// authority — the warden never fights a component's own choices, it
// only stops offscreen decode work.
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
          } else if (video.dataset[FLAG]) {
            delete video.dataset[FLAG];
            video.play().catch(() => {});
          }
        }
      },
      { rootMargin: MARGIN }
    );

    const watched = new WeakSet<HTMLVideoElement>();
    function watchAll() {
      document.querySelectorAll("video").forEach((v) => {
        if (!watched.has(v)) {
          watched.add(v);
          observer.observe(v);
        }
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
