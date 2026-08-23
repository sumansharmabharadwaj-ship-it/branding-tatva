"use client";

import { useHydratedReducedMotion } from "@/hooks/useHydratedReducedMotion";
import { useEffect } from "react";

import {
  HOME_GUIDE_MODE_EVENT,
  type HomeGuideMode,
} from "@/hooks/useHomeGuideMode";

// The motion bible keeps ambient footage perceptibly alive while preserving calm.
const DEFAULT_PLAYBACK_RATE = 1.1;
const FORM_CONTROL_SELECTOR =
  "input, textarea, select, [contenteditable='true'], [role='textbox']";

type NavigatorWithHints = Navigator & {
  connection?: { saveData?: boolean; effectiveType?: string };
  deviceMemory?: number;
};

function requestedPlaybackRate(video: HTMLVideoElement) {
  const requested = Number(video.dataset.homePlaybackRate ?? DEFAULT_PLAYBACK_RATE);
  if (!Number.isFinite(requested)) return DEFAULT_PLAYBACK_RATE;
  return Math.min(1.15, Math.max(1, requested));
}

function applyPlaybackRate(video: HTMLVideoElement) {
  const rate = requestedPlaybackRate(video);
  if (Math.abs(video.defaultPlaybackRate - rate) > 0.001) video.defaultPlaybackRate = rate;
  if (Math.abs(video.playbackRate - rate) > 0.001) video.playbackRate = rate;
}

function distanceFromViewportCentre(video: HTMLVideoElement) {
  const bounds = video.getBoundingClientRect();
  const centre = bounds.top + bounds.height / 2;
  return Math.abs(centre - window.innerHeight / 2);
}

export function HomeV4MediaDirector() {
  const prefersReducedMotion = Boolean(useHydratedReducedMotion());

  useEffect(() => {
    const root = document.querySelector<HTMLElement>("[data-home-v4]");
    if (!root) return;
    const homeRoot = root;

    const tracked = new Set<HTMLVideoElement>();
    const visibleRatios = new Map<HTMLVideoElement, number>();
    const cleanups = new Map<HTMLVideoElement, () => void>();
    const navigatorHints = navigator as NavigatorWithHints;
    const constrainedConnection =
      Boolean(navigatorHints.connection?.saveData) ||
      navigatorHints.connection?.effectiveType === "2g" ||
      navigatorHints.connection?.effectiveType === "slow-2g";
    const lowMemory =
      typeof navigatorHints.deviceMemory === "number" && navigatorHints.deviceMemory <= 4;
    const compactViewport = window.matchMedia("(max-width: 720px)");
    let formInteraction = false;
    let guideMode: HomeGuideMode =
      document.documentElement.dataset.homeGuideMode === "paused"
        ? "paused"
        : document.documentElement.dataset.homeGuideMode === "guided"
          ? "guided"
          : "manual";

    function mediaBudget() {
      return constrainedConnection || lowMemory || compactViewport.matches ? 1 : 2;
    }

    function globallyPaused() {
      // Pausing the guided journey only stops automatic chapter changes. It
      // must not freeze ambient film or the page looks broken. Reduced motion,
      // a hidden document, and active form input still pause media as expected.
      return prefersReducedMotion || document.hidden || formInteraction;
    }

    function syncAll() {
      const candidates = [...visibleRatios.entries()]
        .filter(([video, ratio]) => video.isConnected && ratio > 0)
        .sort(([videoA, ratioA], [videoB, ratioB]) => {
          if (Math.abs(ratioA - ratioB) > 0.04) return ratioB - ratioA;
          return distanceFromViewportCentre(videoA) - distanceFromViewportCentre(videoB);
        })
        .slice(0, mediaBudget())
        .map(([video]) => video);
      const allowed = new Set(candidates);

      tracked.forEach((video) => {
        applyPlaybackRate(video);
        if (!globallyPaused() && allowed.has(video)) {
          if (video.paused) void video.play().catch(() => {});
        } else if (!video.paused) {
          video.pause();
        }
      });
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const video = entry.target as HTMLVideoElement;
          visibleRatios.set(video, entry.isIntersecting ? entry.intersectionRatio : 0);
        });
        syncAll();
      },
      {
        rootMargin: "24% 0px",
        threshold: [0, 0.02, 0.15, 0.35, 0.65],
      },
    );

    function track(video: HTMLVideoElement) {
      if (tracked.has(video)) return;
      tracked.add(video);

      // VideoWarden runs sitewide and resumes any video that scrolls back into
      // view. On this page that fights the budget below: the warden restarts a
      // clip the director just paused, so the number playing at once drifts
      // above the budget and varies run to run. The warden already stands down
      // for anything claiming ownership, so claim it here.
      video.dataset.autoplayManaged = "true";

      const openingVideo = Boolean(video.closest('[data-home-v4-chapter="opening"]'));
      if (!openingVideo && video.preload === "auto") video.preload = "metadata";
      if (constrainedConnection && !openingVideo) video.preload = "none";

      applyPlaybackRate(video);

      // Individual media components still own their own lifecycle. Whenever
      // one of them tries to resume, the director reapplies the shared pace
      // and immediately arbitrates the decoding budget again.
      const refreshMediaState = () => {
        applyPlaybackRate(video);
        queueMicrotask(syncAll);
      };
      video.addEventListener("loadedmetadata", refreshMediaState);
      video.addEventListener("play", refreshMediaState);

      const bounds = video.getBoundingClientRect();
      const nearViewport =
        bounds.bottom >= -window.innerHeight * 0.24 &&
        bounds.top <= window.innerHeight * 1.24;
      visibleRatios.set(video, nearViewport ? 0.01 : 0);
      observer.observe(video);

      cleanups.set(video, () => {
        video.removeEventListener("loadedmetadata", refreshMediaState);
        video.removeEventListener("play", refreshMediaState);
        observer.unobserve(video);
        visibleRatios.delete(video);
        // Hand the video back to the sitewide warden on the way out.
        delete video.dataset.autoplayManaged;
      });
    }

    homeRoot.querySelectorAll<HTMLVideoElement>("video").forEach(track);

    const mutationObserver = new MutationObserver((records) => {
      records.forEach((record) => {
        record.addedNodes.forEach((node) => {
          if (!(node instanceof Element)) return;
          if (node instanceof HTMLVideoElement) track(node);
          node.querySelectorAll<HTMLVideoElement>("video").forEach(track);
        });
      });
      syncAll();
    });
    mutationObserver.observe(homeRoot, { childList: true, subtree: true });

    function onVisibilityChange() {
      syncAll();
    }

    function onGuideMode(event: Event) {
      const nextMode = (event as CustomEvent<{ mode?: HomeGuideMode }>).detail?.mode;
      if (nextMode) guideMode = nextMode;
      syncAll();
    }

    function onViewportProfileChange() {
      syncAll();
    }

    function onFocusIn(event: FocusEvent) {
      const target = event.target;
      if (!(target instanceof Element) || !target.matches(FORM_CONTROL_SELECTOR)) return;
      formInteraction = true;
      syncAll();
    }

    function onFocusOut() {
      window.setTimeout(() => {
        const active = document.activeElement;
        formInteraction = Boolean(
          active instanceof Element &&
            homeRoot.contains(active) &&
            active.matches(FORM_CONTROL_SELECTOR),
        );
        syncAll();
      }, 0);
    }

    document.addEventListener("visibilitychange", onVisibilityChange);
    window.addEventListener(HOME_GUIDE_MODE_EVENT, onGuideMode as EventListener);
    window.addEventListener("resize", onViewportProfileChange, { passive: true });
    compactViewport.addEventListener("change", onViewportProfileChange);
    homeRoot.addEventListener("focusin", onFocusIn);
    homeRoot.addEventListener("focusout", onFocusOut);
    syncAll();

    return () => {
      mutationObserver.disconnect();
      observer.disconnect();
      document.removeEventListener("visibilitychange", onVisibilityChange);
      window.removeEventListener(HOME_GUIDE_MODE_EVENT, onGuideMode as EventListener);
      window.removeEventListener("resize", onViewportProfileChange);
      compactViewport.removeEventListener("change", onViewportProfileChange);
      homeRoot.removeEventListener("focusin", onFocusIn);
      homeRoot.removeEventListener("focusout", onFocusOut);
      cleanups.forEach((cleanup) => cleanup());
      tracked.forEach((video) => video.pause());
      cleanups.clear();
      tracked.clear();
      visibleRatios.clear();
    };
  }, [prefersReducedMotion]);

  return null;
}
