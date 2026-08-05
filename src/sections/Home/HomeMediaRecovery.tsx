"use client";

import { useEffect } from "react";

const COMPATIBLE_SOURCES = new Map<string, string>([
  ["/videos/hero-forest-sanctuary.mp4", "/videos/home-reframe-hero.webm"],
  ["/videos/pexels-river-dawn.mp4", "/videos/home-reframe-framework.webm"],
  ["/videos/higgsfield-silver-tide.mp4", "/videos/home-reframe-invitation.webm"],
]);

function getOriginalSource(video: HTMLVideoElement) {
  return video.dataset.homeOriginalSource || video.getAttribute("src") || "";
}

function installCompatibleSource(video: HTMLVideoElement) {
  const original = getOriginalSource(video);
  const webm = COMPATIBLE_SOURCES.get(original);

  if (!original || !webm || video.dataset.homeCompatibleSource === webm) return;

  video.dataset.homeOriginalSource = original;
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
}

function prepareVideo(video: HTMLVideoElement) {
  video.muted = true;
  video.defaultMuted = true;
  video.loop = true;
  video.autoplay = true;
  video.playsInline = true;
  video.setAttribute("muted", "");
  video.setAttribute("playsinline", "");
  video.setAttribute("webkit-playsinline", "");
  installCompatibleSource(video);
}

function playVisibleVideo(video: HTMLVideoElement, reducedMotion: MediaQueryList) {
  if (document.hidden || reducedMotion.matches || video.dataset.homeInView !== "true") {
    video.pause();
    return;
  }

  if (video.readyState < HTMLMediaElement.HAVE_CURRENT_DATA) {
    video.load();
    return;
  }

  void video.play().catch(() => undefined);
}

export function HomeMediaRecovery() {
  useEffect(() => {
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const root = document.querySelector<HTMLElement>("[data-home-reframe]");
    if (!root) return;

    const tracked = new Set<HTMLVideoElement>();

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          const video = entry.target as HTMLVideoElement;
          video.dataset.homeInView = entry.isIntersecting ? "true" : "false";
          playVisibleVideo(video, reducedMotion);
        }
      },
      { rootMargin: "35% 0px", threshold: 0.01 },
    );

    const register = (video: HTMLVideoElement) => {
      if (tracked.has(video)) return;

      prepareVideo(video);
      tracked.add(video);
      observer.observe(video);

      const resume = () => playVisibleVideo(video, reducedMotion);
      video.addEventListener("loadeddata", resume);
      video.addEventListener("canplay", resume);
      video.addEventListener("stalled", resume);
      video.addEventListener("suspend", resume);
      video.dataset.homeRecoveryBound = "true";
    };

    const scan = () => root.querySelectorAll<HTMLVideoElement>("video").forEach(register);

    const resumeAll = () => tracked.forEach((video) => playVisibleVideo(video, reducedMotion));
    const handleMotionPreference = () => resumeAll();

    scan();

    const mutationObserver = new MutationObserver(scan);
    mutationObserver.observe(root, { childList: true, subtree: true });

    const animationFrame = window.requestAnimationFrame(scan);
    const retryOne = window.setTimeout(scan, 500);
    const retryTwo = window.setTimeout(scan, 1600);

    document.addEventListener("visibilitychange", resumeAll);
    window.addEventListener("pageshow", resumeAll);
    window.addEventListener("focus", resumeAll);
    window.addEventListener("pointerdown", resumeAll, { passive: true });
    reducedMotion.addEventListener("change", handleMotionPreference);

    return () => {
      window.cancelAnimationFrame(animationFrame);
      window.clearTimeout(retryOne);
      window.clearTimeout(retryTwo);
      observer.disconnect();
      mutationObserver.disconnect();
      document.removeEventListener("visibilitychange", resumeAll);
      window.removeEventListener("pageshow", resumeAll);
      window.removeEventListener("focus", resumeAll);
      window.removeEventListener("pointerdown", resumeAll);
      reducedMotion.removeEventListener("change", handleMotionPreference);
    };
  }, []);

  return null;
}
