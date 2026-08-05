"use client";

import { useEffect } from "react";

const HOME_MEDIA = [
  {
    original: "/videos/hero-forest-sanctuary.mp4",
    webm: "/videos/home-reframe-hero.webm",
  },
  {
    original: "/videos/pexels-river-dawn.mp4",
    webm: "/videos/home-reframe-framework.webm",
  },
  {
    original: "/videos/higgsfield-silver-tide.mp4",
    webm: "/videos/home-reframe-invitation.webm",
  },
] as const;

function installCompatibleSource(video: HTMLVideoElement, original: string, webm: string) {
  if (video.dataset.homeCompatibleSource === webm) return;

  video.pause();
  video.removeAttribute("src");
  video.querySelectorAll("source").forEach((source) => source.remove());

  const preferred = document.createElement("source");
  preferred.src = webm;
  preferred.type = "video/webm";

  const fallback = document.createElement("source");
  fallback.src = original;
  fallback.type = "video/mp4";

  video.append(preferred, fallback);
  video.dataset.homeCompatibleSource = webm;
  video.load();

  if (!document.hidden && !window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    void video.play().catch(() => undefined);
  }
}

export function HomeMediaRecovery() {
  useEffect(() => {
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (reducedMotion.matches) return;

    const install = () => {
      for (const media of HOME_MEDIA) {
        const video = document.querySelector<HTMLVideoElement>(
          `video[src="${media.original}"]`,
        );
        if (video) installCompatibleSource(video, media.original, media.webm);
      }
    };

    const resume = () => {
      if (document.hidden || reducedMotion.matches) return;
      document
        .querySelectorAll<HTMLVideoElement>("video[data-home-compatible-source]")
        .forEach((video) => void video.play().catch(() => undefined));
    };

    install();
    const animationFrame = window.requestAnimationFrame(install);
    const retry = window.setTimeout(install, 650);

    document.addEventListener("visibilitychange", resume);
    window.addEventListener("pageshow", resume);
    window.addEventListener("focus", resume);

    return () => {
      window.cancelAnimationFrame(animationFrame);
      window.clearTimeout(retry);
      document.removeEventListener("visibilitychange", resume);
      window.removeEventListener("pageshow", resume);
      window.removeEventListener("focus", resume);
    };
  }, []);

  return null;
}
