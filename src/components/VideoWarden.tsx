"use client";

import { useEffect } from "react";

const MARGIN = "18% 0px";
const FLAG = "wardenPaused";

function measureVideo(video: HTMLVideoElement) {
  const rect = video.getBoundingClientRect();
  const viewportHeight = Math.max(window.innerHeight, 1);
  const margin = viewportHeight * 0.18;
  const visibleHeight =
    Math.max(0, Math.min(rect.bottom, viewportHeight) - Math.max(rect.top, 0));
  return {
    video,
    onScreen:
      rect.width > 0 &&
      rect.height > 0 &&
      rect.bottom > -margin &&
      rect.top < viewportHeight + margin,
    coverage: visibleHeight / viewportHeight,
    distance: Math.abs(rect.top + rect.height / 2 - viewportHeight / 2),
  };
}

export function VideoWarden() {
  useEffect(() => {
    let frame = 0;

    function arbitrate() {
      frame = 0;
      // The watched set is kept complete by the initial scan and mutation
      // observer. Reusing it avoids a full-document selector on every scroll
      // frame while retaining videos that have not crossed an intersection
      // threshold yet.
      const all = [...watched];

      // One cinematic owner at a time. Page-level directors may request play,
      // but the warden remains the final arbiter so adjacent scenes never
      // compete for attention or decoding capacity.
      const governed = all;

      // Background tabs should own no decoder. Pausing here also means the
      // visibilitychange handoff cannot briefly restart a film before the
      // next intersection update arrives.
      if (document.hidden) {
        governed.forEach((video) => {
          if (video.paused) return;
          video.dataset[FLAG] = "1";
          video.pause();
        });
        return;
      }

      const candidates = governed
        // Geometry is deliberately sampled once per video. The previous
        // ranking path called getBoundingClientRect for visibility, coverage,
        // and distance independently, multiplying layout reads during scroll.
        .map(measureVideo)
        .filter((candidate) => candidate.onScreen)
        // A full bleed background filling the screen matters more than a
        // small inline clip that happens to sit nearer the middle. Ranking
        // by nearness alone left backgrounds frozen behind the copy, so
        // coverage decides first and nearness only breaks ties. A selected
        // foreground film can opt into priority: Contact uses that for the
        // route card the visitor is actively exploring. Grouped hero films
        // still travel together once either member becomes the primary.
        .sort((a, b) => {
          const priorityA = a.video.dataset.videoPriority === "foreground" ? 1 : 0;
          const priorityB = b.video.dataset.videoPriority === "foreground" ? 1 : 0;
          if (priorityA !== priorityB) return priorityB - priorityA;
          if (Math.abs(a.coverage - b.coverage) > 0.08) return b.coverage - a.coverage;
          return a.distance - b.distance;
        });

      const primary = candidates[0]?.video;
      const primaryGroup = primary?.dataset.videoWardenGroup;
      // Some heroes compose a full bleed film and a smaller foreground film
      // into one visible scene. A shared group lets that scene play together
      // without opening the playback budget to unrelated page media.
      const allowed = new Set(
        primaryGroup
          ? candidates
              .map((candidate) => candidate.video)
              .filter((video) => video.dataset.videoWardenGroup === primaryGroup)
          : primary
            ? [primary]
            : [],
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

    function enforcePlaybackBudget() {
      // A play request is the only moment when a second decoder can enter the
      // budget. Resolve that handoff synchronously instead of waiting for the
      // next animation frame, while scroll/resize work remains frame-batched.
      if (frame) {
        cancelAnimationFrame(frame);
        frame = 0;
      }
      arbitrate();
    }

    const observer = new IntersectionObserver(
      // The observer is purely a trigger now: any crossing means the picture
      // changed, so re-arbitrate. What actually plays is decided in arbitrate.
      () => schedule(),
      { rootMargin: MARGIN, threshold: [0, 0.1, 0.35, 0.6] },
    );

    const watched = new Set<HTMLVideoElement>();

    function videosWithin(node: Node) {
      const videos: HTMLVideoElement[] = [];
      if (node instanceof HTMLVideoElement) videos.push(node);
      if (node instanceof Element) {
        videos.push(...node.querySelectorAll<HTMLVideoElement>("video"));
      }
      return videos;
    }

    function watch(video: HTMLVideoElement) {
      if (watched.has(video)) return;
      watched.add(video);
      observer.observe(video);
    }

    function unwatch(video: HTMLVideoElement) {
      if (!watched.delete(video)) return;
      observer.unobserve(video);
    }

    function watchAll() {
      document.querySelectorAll<HTMLVideoElement>("video").forEach(watch);
    }

    watchAll();
    const mutations = new MutationObserver((records) => {
      records.forEach((record) => {
        record.removedNodes.forEach((node) => videosWithin(node).forEach(unwatch));
        record.addedNodes.forEach((node) => videosWithin(node).forEach(watch));
      });
      schedule();
    });
    mutations.observe(document.body, { childList: true, subtree: true });

    // A video component may start itself after arbitration ran. Enforce the
    // budget immediately on play so adjacent scenes never share even one
    // scheduled frame, then keep lower-priority triggers frame-batched.
    document.addEventListener("play", enforcePlaybackBudget, true);
    document.addEventListener("visibilitychange", schedule);
    window.addEventListener("resize", schedule, { passive: true });
    window.addEventListener("scroll", schedule, { passive: true });

    // Autoplay may have started before this effect subscribed to `play`.
    // Resolve that first frame against the same one-film budget immediately.
    enforcePlaybackBudget();

    return () => {
      if (frame) cancelAnimationFrame(frame);
      document.removeEventListener("play", enforcePlaybackBudget, true);
      document.removeEventListener("visibilitychange", schedule);
      window.removeEventListener("resize", schedule);
      window.removeEventListener("scroll", schedule);
      observer.disconnect();
      mutations.disconnect();
      watched.clear();
    };
  }, []);

  return null;
}
