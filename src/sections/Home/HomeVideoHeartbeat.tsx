"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";
import { isVideoVisuallyEligible } from "@/lib/videoVisibility";

const ROOT_MARGIN = "8% 0px";
const DEFAULT_HEARTBEAT_MS = 2200;
const CONSERVATIVE_HEARTBEAT_MS = 5200;

type NavigatorWithConnection = Navigator & {
  connection?: {
    saveData?: boolean;
    effectiveType?: string;
  };
};

function reducedMotionIsActive(mediaQuery: MediaQueryList) {
  return (
    document.documentElement.dataset.motion === "reduced" ||
    mediaQuery.matches
  );
}

function wake(video: HTMLVideoElement, reduceMotion: boolean) {
  if (
    document.hidden ||
    reduceMotion ||
    !isVideoVisuallyEligible(video) ||
    !video.paused
  ) {
    return;
  }

  void video.play().catch(() => {});
}

/**
 * A homepage-only safety net for browser autoplay edge cases.
 *
 * Each scene still owns its active state and VideoWarden still pauses media
 * outside the viewport. This heartbeat only wakes visually eligible films,
 * stands down while the page is hidden or motion is reduced, and performs a
 * short recovery sequence after tab restores and back-forward-cache returns.
 */
export function HomeVideoHeartbeat() {
  const pathname = usePathname();

  useEffect(() => {
    if (pathname !== "/") return;

    const motionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    const connection = (navigator as NavigatorWithConnection).connection;
    const heartbeatMs =
      connection?.saveData ||
      connection?.effectiveType === "slow-2g" ||
      connection?.effectiveType === "2g"
        ? CONSERVATIVE_HEARTBEAT_MS
        : DEFAULT_HEARTBEAT_MS;

    const observed = new WeakSet<HTMLVideoElement>();
    const observer = new IntersectionObserver(
      (entries) => {
        const reduceMotion = reducedMotionIsActive(motionQuery);
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            wake(entry.target as HTMLVideoElement, reduceMotion);
          }
        });
      },
      { rootMargin: ROOT_MARGIN, threshold: [0, 0.08, 0.45] },
    );

    let frame = 0;
    let recoveryTimer = 0;
    let lateRecoveryTimer = 0;

    function inspect() {
      frame = 0;
      if (document.hidden || reducedMotionIsActive(motionQuery)) return;

      document.querySelectorAll<HTMLVideoElement>("video").forEach((video) => {
        if (!observed.has(video)) {
          observed.add(video);
          observer.observe(video);
        }
        wake(video, false);
      });
    }

    function scheduleInspect() {
      if (document.hidden || reducedMotionIsActive(motionQuery) || frame) return;
      frame = window.requestAnimationFrame(inspect);
    }

    function scheduleRecovery() {
      window.clearTimeout(recoveryTimer);
      window.clearTimeout(lateRecoveryTimer);
      scheduleInspect();
      recoveryTimer = window.setTimeout(scheduleInspect, 420);
      lateRecoveryTimer = window.setTimeout(scheduleInspect, 1350);
    }

    function onChapter() {
      scheduleInspect();
      window.setTimeout(scheduleInspect, 950);
    }

    function onVisibilityChange() {
      if (document.hidden) {
        window.cancelAnimationFrame(frame);
        frame = 0;
        return;
      }
      scheduleRecovery();
    }

    function onPageShow() {
      scheduleRecovery();
    }

    function onPageHide() {
      window.cancelAnimationFrame(frame);
      frame = 0;
      window.clearTimeout(recoveryTimer);
      window.clearTimeout(lateRecoveryTimer);
    }

    function onMotionPreferenceChange() {
      if (!reducedMotionIsActive(motionQuery)) scheduleRecovery();
    }

    inspect();

    const mutations = new MutationObserver(scheduleInspect);
    mutations.observe(document.body, { childList: true, subtree: true });

    const motionAttributeObserver = new MutationObserver(
      onMotionPreferenceChange,
    );
    motionAttributeObserver.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["data-motion"],
    });

    const heartbeat = window.setInterval(scheduleInspect, heartbeatMs);
    document.addEventListener("visibilitychange", onVisibilityChange);
    window.addEventListener("pageshow", onPageShow);
    window.addEventListener("pagehide", onPageHide);
    window.addEventListener("focus", scheduleRecovery);
    window.addEventListener("bt:home-chapter", onChapter as EventListener);
    motionQuery.addEventListener("change", onMotionPreferenceChange);

    return () => {
      observer.disconnect();
      mutations.disconnect();
      motionAttributeObserver.disconnect();
      window.clearInterval(heartbeat);
      window.clearTimeout(recoveryTimer);
      window.clearTimeout(lateRecoveryTimer);
      window.cancelAnimationFrame(frame);
      document.removeEventListener("visibilitychange", onVisibilityChange);
      window.removeEventListener("pageshow", onPageShow);
      window.removeEventListener("pagehide", onPageHide);
      window.removeEventListener("focus", scheduleRecovery);
      window.removeEventListener("bt:home-chapter", onChapter as EventListener);
      motionQuery.removeEventListener("change", onMotionPreferenceChange);
    };
  }, [pathname]);

  return null;
}
