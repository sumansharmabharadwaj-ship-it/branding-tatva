"use client";

import { useEffect } from "react";

const PLAYBACK_RATE = 1.08;
const JOURNEY_START_DELAY_MS = 3600;

function prepareVideo(video: HTMLVideoElement, reducedMotion: MediaQueryList) {
  video.muted = true;
  video.defaultMuted = true;
  video.playsInline = true;
  video.loop = true;
  video.playbackRate = reducedMotion.matches ? 1 : PLAYBACK_RATE;

  if (!reducedMotion.matches && video.getBoundingClientRect().top < window.innerHeight * 1.25) {
    void video.play().catch(() => undefined);
  }
}

export function HomePacingDirector() {
  useEffect(() => {
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const root = document.getElementById("main-content");
    if (!root) return;

    const prepareAll = () => {
      root.querySelectorAll<HTMLVideoElement>("video").forEach((video) => {
        prepareVideo(video, reducedMotion);
      });
    };

    prepareAll();

    const observer = new MutationObserver(prepareAll);
    observer.observe(root, { childList: true, subtree: true });

    const onCanPlay = (event: Event) => {
      if (event.target instanceof HTMLVideoElement && root.contains(event.target)) {
        prepareVideo(event.target, reducedMotion);
      }
    };

    document.addEventListener("canplay", onCanPlay, true);

    const startJourney = window.setTimeout(() => {
      if (reducedMotion.matches || document.hidden) return;

      const controls = Array.from(
        document.querySelectorAll<HTMLElement>("[data-auto-journey-ui] button"),
      );
      const playButton = controls.find((button) =>
        /play journey|begin journey|start journey/i.test(button.textContent ?? ""),
      );

      playButton?.click();
    }, JOURNEY_START_DELAY_MS);

    return () => {
      observer.disconnect();
      document.removeEventListener("canplay", onCanPlay, true);
      window.clearTimeout(startJourney);
    };
  }, []);

  return null;
}
