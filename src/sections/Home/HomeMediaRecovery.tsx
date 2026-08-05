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
  if (video.dataset.homeCompatibleSource === webm) return false;

  video.pause();
  video.autoplay = false;
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
  return true;
}

function playVisibleVideo(video: HTMLVideoElement, reducedMotion: MediaQueryList) {
  if (
    document.hidden ||
    reducedMotion.matches ||
    video.dataset.homeInView !== "true"
  ) {
    video.pause();
    return;
  }

  void video.play().catch(() => undefined);
}

export function HomeMediaRecovery() {
  useEffect(() => {
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (reducedMotion.matches) return;

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          const video = entry.target as HTMLVideoElement;
          video.dataset.homeInView = entry.isIntersecting ? "true" : "false";
          playVisibleVideo(video, reducedMotion);
        }
      },
      { rootMargin: "28% 0px", threshold: 0.04 },
    );

    const install = () => {
      for (const media of HOME_MEDIA) {
        const video = document.querySelector<HTMLVideoElement>(
          `video[src="${media.original}"]`,
        );
        if (!video) continue;

        const installed = installCompatibleSource(video, media.original, media.webm);
        if (installed) observer.observe(video);
      }
    };

    const resume = () => {
      document
        .querySelectorAll<HTMLVideoElement>("video[data-home-compatible-source]")
        .forEach((video) => playVisibleVideo(video, reducedMotion));
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
      observer.disconnect();
      document.removeEventListener("visibilitychange", resume);
      window.removeEventListener("pageshow", resume);
      window.removeEventListener("focus", resume);
    };
  }, []);

  return null;
}
