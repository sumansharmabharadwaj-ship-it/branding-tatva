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

function viewportRatio(video: HTMLVideoElement) {
  const bounds = video.getBoundingClientRect();
  if (bounds.height <= 0 || bounds.width <= 0) return 0;
  const visibleHeight = Math.min(bounds.bottom, window.innerHeight) - Math.max(bounds.top, 0);
  if (visibleHeight <= 0) return 0;
  return Math.min(1, visibleHeight / bounds.height);
}

export function HomeV4MediaDirector() {
  const prefersReducedMotion = Boolean(useHydratedReducedMotion());

  useEffect(() => {
    const root = document.querySelector<HTMLElement>("[data-home-v4]");
    if (!root) return;
    const homeRoot = root;

    const tracked = new Set<HTMLVideoElement>();
    const visibleRatios = new Map<HTMLVideoElement, number>();
    const nearbyMedia = new Map<HTMLVideoElement, boolean>();
    const cleanups = new Map<HTMLVideoElement, () => void>();
    const navigatorHints = navigator as NavigatorWithHints;
    const constrainedConnection =
      Boolean(navigatorHints.connection?.saveData) ||
      navigatorHints.connection?.effectiveType === "2g" ||
      navigatorHints.connection?.effectiveType === "slow-2g";
    let formInteraction = false;
    let guideMode: HomeGuideMode =
      document.documentElement.dataset.homeGuideMode === "paused"
        ? "paused"
        : document.documentElement.dataset.homeGuideMode === "guided"
          ? "guided"
          : "manual";

    function mediaBudget() {
      return 1;
    }

    function globallyPaused() {
      // Pausing the guided journey only stops automatic chapter changes. It
      // must not freeze ambient film or the page looks broken. Reduced motion,
      // a hidden document, and active form input still pause media as expected.
      return prefersReducedMotion || document.hidden || formInteraction;
    }

    function syncAll() {
      const candidates = [...visibleRatios.entries()]
        .filter(
          ([video, ratio]) =>
            video.isConnected &&
            ratio > 0 &&
            video.dataset.homeMediaState !== "failed",
        )
        .sort(([videoA, ratioA], [videoB, ratioB]) => {
          if (Math.abs(ratioA - ratioB) > 0.04) return ratioB - ratioA;
          return distanceFromViewportCentre(videoA) - distanceFromViewportCentre(videoB);
        })
        .slice(0, mediaBudget())
        .map(([video]) => video);
      const allowed = new Set(candidates);
      const warmCandidate = [...nearbyMedia.entries()]
        .filter(
          ([video, nearby]) =>
            nearby &&
            video.isConnected &&
            !allowed.has(video) &&
            !video.closest('[data-home-v4-chapter="opening"]') &&
            video.dataset.homeMediaState !== "failed",
        )
        .sort(([videoA], [videoB]) => {
          const readinessA = videoA.readyState >= HTMLMediaElement.HAVE_CURRENT_DATA ? 1 : 0;
          const readinessB = videoB.readyState >= HTMLMediaElement.HAVE_CURRENT_DATA ? 1 : 0;
          if (readinessA !== readinessB) return readinessA - readinessB;
          return distanceFromViewportCentre(videoA) - distanceFromViewportCentre(videoB);
        })[0]?.[0];

      tracked.forEach((video) => {
        applyPlaybackRate(video);
        const openingVideo = Boolean(video.closest('[data-home-v4-chapter="opening"]'));
        const admitted = allowed.has(video);
        const warming = video === warmCandidate;

        video.dataset.homeMediaAdmission = admitted
          ? globallyPaused()
            ? "held"
            : "playing"
          : warming
            ? "warming"
            : "parked";

        if (!openingVideo) {
          video.preload = !prefersReducedMotion && !constrainedConnection && !document.hidden && (admitted || warming)
            ? "auto"
            : "none";
        }

        if (!globallyPaused() && admitted) {
          if (video.paused) {
            void video.play().catch(() => {
              if (video.dataset.homeMediaState !== "failed") {
                video.dataset.homeMediaState = "poster";
              }
            });
          }
        } else if (!video.paused) {
          video.pause();
        }
      });
    }

    const playbackObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const video = entry.target as HTMLVideoElement;
          visibleRatios.set(video, entry.isIntersecting ? entry.intersectionRatio : 0);
        });
        syncAll();
      },
      {
        rootMargin: "0px",
        threshold: [0, 0.02, 0.15, 0.35, 0.65],
      },
    );

    const prewarmObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          nearbyMedia.set(entry.target as HTMLVideoElement, entry.isIntersecting);
        });
        syncAll();
      },
      { rootMargin: "55% 0px", threshold: 0 },
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
      if (!openingVideo) video.preload = "none";

      applyPlaybackRate(video);
      video.dataset.homeMediaState = video.readyState >= HTMLMediaElement.HAVE_CURRENT_DATA
        ? "ready"
        : "poster";

      // Individual media components still own their own lifecycle. Whenever
      // one of them tries to resume, the director reapplies the shared pace
      // and immediately arbitrates the decoding budget again.
      const refreshMediaState = () => {
        applyPlaybackRate(video);
        queueMicrotask(syncAll);
      };
      const markReady = () => {
        video.dataset.homeMediaState = "ready";
        queueMicrotask(syncAll);
      };
      const markPlaying = () => {
        video.dataset.homeMediaState = "playing";
      };
      const markWaiting = () => {
        if (video.dataset.homeMediaState !== "failed") {
          video.dataset.homeMediaState = video.currentTime > 0 ? "buffering" : "poster";
        }
      };
      const markFailed = () => {
        video.dataset.homeMediaState = "failed";
        visibleRatios.set(video, 0);
        queueMicrotask(syncAll);
      };
      video.addEventListener("loadedmetadata", refreshMediaState);
      video.addEventListener("play", refreshMediaState);
      video.addEventListener("loadeddata", markReady);
      video.addEventListener("playing", markPlaying);
      video.addEventListener("waiting", markWaiting);
      video.addEventListener("error", markFailed);

      const bounds = video.getBoundingClientRect();
      const nearViewport = bounds.bottom >= -window.innerHeight * 0.55 && bounds.top <= window.innerHeight * 1.55;
      visibleRatios.set(video, viewportRatio(video));
      nearbyMedia.set(video, nearViewport);
      playbackObserver.observe(video);
      prewarmObserver.observe(video);

      cleanups.set(video, () => {
        video.removeEventListener("loadedmetadata", refreshMediaState);
        video.removeEventListener("play", refreshMediaState);
        video.removeEventListener("loadeddata", markReady);
        video.removeEventListener("playing", markPlaying);
        video.removeEventListener("waiting", markWaiting);
        video.removeEventListener("error", markFailed);
        playbackObserver.unobserve(video);
        prewarmObserver.unobserve(video);
        visibleRatios.delete(video);
        nearbyMedia.delete(video);
        // Hand the video back to the sitewide warden on the way out.
        delete video.dataset.autoplayManaged;
        delete video.dataset.homeMediaAdmission;
        delete video.dataset.homeMediaState;
      });
    }

    function untrack(video: HTMLVideoElement) {
      if (!tracked.has(video)) return;
      video.pause();
      cleanups.get(video)?.();
      cleanups.delete(video);
      tracked.delete(video);
    }

    homeRoot.querySelectorAll<HTMLVideoElement>("video").forEach(track);

    const mutationObserver = new MutationObserver((records) => {
      records.forEach((record) => {
        record.removedNodes.forEach((node) => {
          if (!(node instanceof Element)) return;
          if (node instanceof HTMLVideoElement) untrack(node);
          node.querySelectorAll<HTMLVideoElement>("video").forEach(untrack);
        });
      });
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
      tracked.forEach((video) => {
        const bounds = video.getBoundingClientRect();
        visibleRatios.set(video, viewportRatio(video));
        nearbyMedia.set(
          video,
          bounds.bottom >= -window.innerHeight * 0.55 && bounds.top <= window.innerHeight * 1.55,
        );
      });
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
    homeRoot.addEventListener("focusin", onFocusIn);
    homeRoot.addEventListener("focusout", onFocusOut);
    syncAll();

    return () => {
      mutationObserver.disconnect();
      playbackObserver.disconnect();
      prewarmObserver.disconnect();
      document.removeEventListener("visibilitychange", onVisibilityChange);
      window.removeEventListener(HOME_GUIDE_MODE_EVENT, onGuideMode as EventListener);
      window.removeEventListener("resize", onViewportProfileChange);
      homeRoot.removeEventListener("focusin", onFocusIn);
      homeRoot.removeEventListener("focusout", onFocusOut);
      cleanups.forEach((cleanup) => cleanup());
      tracked.forEach((video) => video.pause());
      cleanups.clear();
      tracked.clear();
      visibleRatios.clear();
      nearbyMedia.clear();
    };
  }, [prefersReducedMotion]);

  return null;
}
