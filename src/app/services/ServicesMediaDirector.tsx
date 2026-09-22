"use client";

import { useEffect } from "react";
import { useHydratedReducedMotion } from "@/hooks/useHydratedReducedMotion";

const FORM_CONTROL_SELECTOR =
  "input, textarea, select, [contenteditable='true'], [role='textbox']";
const MODAL_INTERACTION_EVENT = "bt:services-modal-interaction";

type NavigatorWithHints = Navigator & {
  connection?: { saveData?: boolean; effectiveType?: string };
  deviceMemory?: number;
};

function distanceFromViewportCentre(video: HTMLVideoElement) {
  const bounds = video.getBoundingClientRect();
  return Math.abs(bounds.top + bounds.height / 2 - window.innerHeight / 2);
}

export function ServicesMediaDirector() {
  const prefersReducedMotion = useHydratedReducedMotion();

  useEffect(() => {
    const root = document.getElementById("main-content");
    if (!root) return;
    const servicesRoot = root;

    const videos = new Set<HTMLVideoElement>();
    const ratios = new Map<HTMLVideoElement, number>();
    const cleanups = new Map<HTMLVideoElement, () => void>();
    const compactViewport = window.matchMedia("(max-width: 767px)");
    const hints = navigator as NavigatorWithHints;
    const constrained =
      Boolean(hints.connection?.saveData) ||
      hints.connection?.effectiveType === "2g" ||
      hints.connection?.effectiveType === "slow-2g" ||
      (typeof hints.deviceMemory === "number" && hints.deviceMemory <= 4);
    let formInteraction = false;
    let fieldInteraction = false;
    let modalInteraction = false;
    const activeModalInteractions = new Set<string>();
    let disposed = false;
    let focusTimer: number | undefined;

    function mediaBudget() {
      return compactViewport.matches || constrained ? 1 : 2;
    }

    function publishFormInteraction() {
      formInteraction = fieldInteraction || modalInteraction;
      document.documentElement.dataset.servicesFormInteraction = formInteraction ? "true" : "false";
    }

    function syncVideos() {
      if (disposed) return;

      const allowed = new Set(
        [...ratios.entries()]
          .filter(([video, ratio]) => video.isConnected && ratio > 0.02)
          .sort(([videoA, ratioA], [videoB, ratioB]) => {
            if (Math.abs(ratioA - ratioB) > 0.04) return ratioB - ratioA;
            return distanceFromViewportCentre(videoA) - distanceFromViewportCentre(videoB);
          })
          .slice(0, mediaBudget())
          .map(([video]) => video),
      );

      // Publish the entire eligibility set before any play request. The shared
      // warden can then choose one film without reviving a paused Services scene.
      videos.forEach((video) => {
        const shouldPlay =
          !prefersReducedMotion && !document.hidden && !formInteraction && allowed.has(video);
        video.dataset.servicesMediaAllowed = shouldPlay ? "true" : "false";
      });
      videos.forEach((video) => {
        if (video.dataset.servicesMediaAllowed === "true") {
          if (video.paused) void video.play().catch(() => undefined);
        } else if (!video.paused) video.pause();
      });
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!videos.has(entry.target as HTMLVideoElement)) return;
          ratios.set(
            entry.target as HTMLVideoElement,
            entry.isIntersecting ? entry.intersectionRatio : 0,
          );
        });
        syncVideos();
      },
      {
        rootMargin: "20% 0px",
        threshold: [0, 0.02, 0.18, 0.36, 0.62],
      },
    );

    function registerVideo(video: HTMLVideoElement) {
      if (videos.has(video)) return;
      videos.add(video);
      video.dataset.servicesMediaManaged = "true";
      video.dataset.servicesMediaAllowed = "false";

      // Media events enforce this film's pause state only. Re-ranking every
      // film from `play` restarts neighbours that VideoWarden has just paused.
      const enforcePause = () => {
        if (video.dataset.servicesMediaAllowed !== "true" && !video.paused) video.pause();
      };
      video.addEventListener("play", enforcePause);
      video.addEventListener("loadedmetadata", enforcePause);
      observer.observe(video);

      cleanups.set(video, () => {
        video.removeEventListener("play", enforcePause);
        video.removeEventListener("loadedmetadata", enforcePause);
        observer.unobserve(video);
        delete video.dataset.servicesMediaManaged;
        delete video.dataset.servicesMediaAllowed;
        ratios.delete(video);
      });
    }

    servicesRoot.querySelectorAll<HTMLVideoElement>("video").forEach(registerVideo);

    const mutationObserver = new MutationObserver((records) => {
      let mediaChanged = false;
      videos.forEach((video) => {
        if (servicesRoot.contains(video)) return;
        cleanups.get(video)?.();
        cleanups.delete(video);
        videos.delete(video);
        video.pause();
        mediaChanged = true;
      });
      function registerAddedVideo(video: HTMLVideoElement) {
        if (videos.has(video) || !servicesRoot.contains(video)) return;
        registerVideo(video);
        mediaChanged = true;
      }
      records.forEach((record) => {
        record.addedNodes.forEach((node) => {
          if (!(node instanceof Element)) return;
          if (node instanceof HTMLVideoElement) registerAddedVideo(node);
          node.querySelectorAll<HTMLVideoElement>("video").forEach(registerAddedVideo);
        });
      });
      if (mediaChanged) syncVideos();
    });
    mutationObserver.observe(servicesRoot, { childList: true, subtree: true });

    function onFocusIn(event: FocusEvent) {
      const target = event.target;
      if (!(target instanceof Element) || !target.matches(FORM_CONTROL_SELECTOR)) return;
      fieldInteraction = true;
      publishFormInteraction();
      syncVideos();
    }

    function onFocusOut() {
      window.clearTimeout(focusTimer);
      focusTimer = window.setTimeout(() => {
        focusTimer = undefined;
        if (disposed) return;
        const active = document.activeElement;
        fieldInteraction = Boolean(
          active instanceof Element &&
            servicesRoot.contains(active) &&
            active.matches(FORM_CONTROL_SELECTOR),
        );
        publishFormInteraction();
        syncVideos();
      }, 0);
    }

    function onModalInteraction(event: Event) {
      const detail = (event as CustomEvent<{ active?: boolean; source?: string }>).detail;
      const source = detail?.source || "modal";
      if (detail?.active) activeModalInteractions.add(source);
      else activeModalInteractions.delete(source);
      modalInteraction = activeModalInteractions.size > 0;
      publishFormInteraction();
      syncVideos();
    }

    const active = document.activeElement;
    fieldInteraction = Boolean(active instanceof Element && servicesRoot.contains(active) && active.matches(FORM_CONTROL_SELECTOR));
    publishFormInteraction();
    document.addEventListener("visibilitychange", syncVideos);
    compactViewport.addEventListener("change", syncVideos);
    servicesRoot.addEventListener("focusin", onFocusIn);
    servicesRoot.addEventListener("focusout", onFocusOut);
    window.addEventListener(MODAL_INTERACTION_EVENT, onModalInteraction);
    syncVideos();

    return () => {
      disposed = true;
      window.clearTimeout(focusTimer);
      mutationObserver.disconnect();
      observer.disconnect();
      document.removeEventListener("visibilitychange", syncVideos);
      compactViewport.removeEventListener("change", syncVideos);
      servicesRoot.removeEventListener("focusin", onFocusIn);
      servicesRoot.removeEventListener("focusout", onFocusOut);
      window.removeEventListener(MODAL_INTERACTION_EVENT, onModalInteraction);
      cleanups.forEach((cleanup) => cleanup());
      videos.forEach((video) => video.pause());
      cleanups.clear();
      ratios.clear();
      videos.clear();
      activeModalInteractions.clear();
      delete document.documentElement.dataset.servicesFormInteraction;
    };
  }, [prefersReducedMotion]);

  return null;
}
