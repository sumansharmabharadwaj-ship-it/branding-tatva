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
//
// The offscreen half was the only half that ever existed. The spec
// also names a CONCURRENT cap of two videos on desktop and one on
// mobile, and nothing enforced it. Measured on Home: four playing at
// once around a third of the way down, and three for most of the
// page, every one decoding in parallel on a page that already runs
// several scrubbed scenes.
//
// So the warden now ranks as well as gates. Of everything currently
// onscreen it keeps the videos nearest the viewport centre playing,
// up to the budget, and pauses the rest under the same flag it uses
// offscreen. Centre distance rather than document order because the
// thing a visitor is looking at is the thing in the middle of their
// screen, and that stays true scrolling in either direction. Anything
// paused this way resumes as soon as it becomes nearest again, so the
// effect reads as attention following the scroll rather than as
// videos stopping.
const MARGIN = "5% 0px";
const FLAG = "wardenPaused";
const MOBILE_QUERY = "(max-width: 767px)";

export function VideoWarden() {
  useEffect(() => {
    const onscreen = new Set<HTMLVideoElement>();
    let frame = 0;

    const budget = () => (window.matchMedia(MOBILE_QUERY).matches ? 1 : 2);

    function centreDistance(video: HTMLVideoElement) {
      const rect = video.getBoundingClientRect();
      return Math.abs(rect.top + rect.height / 2 - window.innerHeight / 2);
    }

    function enforce() {
      frame = 0;
      const ranked = [...onscreen].sort((a, b) => centreDistance(a) - centreDistance(b));
      const allowed = budget();

      ranked.forEach((video, index) => {
        if (index < allowed) {
          // Resume only what the warden itself paused, so a component
          // that deliberately paused its own video keeps that decision.
          if (video.dataset[FLAG] && video.paused) {
            delete video.dataset[FLAG];
            void video.play().catch(() => {});
          }
        } else if (!video.paused) {
          video.dataset[FLAG] = "1";
          video.pause();
        }
      });
    }

    function schedule() {
      if (frame) return;
      frame = requestAnimationFrame(enforce);
    }

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          const video = entry.target as HTMLVideoElement;
          if (entry.isIntersecting) {
            onscreen.add(video);
          } else {
            onscreen.delete(video);
            if (!video.paused) {
              video.dataset[FLAG] = "1";
              video.pause();
            }
          }
        }
        schedule();
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

    // Ranking depends on scroll position, so it re-runs as the page
    // moves, coalesced to one pass per frame. Passive, and read only:
    // Lenis owns scroll and this never writes to it.
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    // The missing half. Components start their own videos on
    // loadeddata, which lands after any pass triggered by intersection
    // or scroll, so the warden would pause a video and the component
    // would immediately restart it. Listening for play in the capture
    // phase means every start, whoever initiates it, triggers one more
    // ranking pass. Capture because play does not bubble.
    document.addEventListener("play", schedule, true);

    return () => {
      observer.disconnect();
      mutations.disconnect();
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
      document.removeEventListener("play", schedule, true);
      if (frame) cancelAnimationFrame(frame);
    };
  }, []);

  return null;
}
