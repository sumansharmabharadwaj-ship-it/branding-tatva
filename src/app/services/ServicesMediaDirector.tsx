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
    let syncing = false;

    function mediaBudget() {
      return compactViewport.matches || constrained ? 1 : 2;
    }

    function publishFormInteraction() {
      formInteraction = fieldInteraction || modalInteraction;
      document.documentElement.dataset.servicesFormInteraction = formInteraction ? "true" : "false";
    }

    function syncVideos() {
      if (syncing) return;
      syncing = true;

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

      videos.forEach((video) => {
        const shouldPlay =
          !prefersReducedMotion && !document.hidden && !formInteraction && allowed.has(video);
        if (shouldPlay && video.paused) void video.play().catch(() => undefined);
        if (!shouldPlay && !video.paused) video.pause();
      });

      queueMicrotask(() => {
        syncing = false;
      });
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
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

      const resync = () => queueMicrotask(syncVideos);
      video.addEventListener("play", resync);
      video.addEventListener("loadedmetadata", resync);
      observer.observe(video);

      cleanups.set(video, () => {
        video.removeEventListener("play", resync);
        video.removeEventListener("loadedmetadata", resync);
        observer.unobserve(video);
        delete video.dataset.servicesMediaManaged;
        ratios.delete(video);
      });
    }

    servicesRoot.querySelectorAll<HTMLVideoElement>("video").forEach(registerVideo);

    const mutationObserver = new MutationObserver((records) => {
      records.forEach((record) => {
        record.addedNodes.forEach((node) => {
          if (!(node instanceof Element)) return;
          if (node instanceof HTMLVideoElement) registerVideo(node);
          node.querySelectorAll<HTMLVideoElement>("video").forEach(registerVideo);
        });
      });
      syncVideos();
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
      window.setTimeout(() => {
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
      const detail = (event as CustomEvent<{ active?: boolean }>).detail;
      modalInteraction = Boolean(detail?.active);
      publishFormInteraction();
      syncVideos();
    }

    publishFormInteraction();
    document.addEventListener("visibilitychange", syncVideos);
    compactViewport.addEventListener("change", syncVideos);
    servicesRoot.addEventListener("focusin", onFocusIn);
    servicesRoot.addEventListener("focusout", onFocusOut);
    window.addEventListener(MODAL_INTERACTION_EVENT, onModalInteraction);
    syncVideos();

    return () => {
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
      delete document.documentElement.dataset.servicesFormInteraction;
    };
  }, [prefersReducedMotion]);

  return null;
}
