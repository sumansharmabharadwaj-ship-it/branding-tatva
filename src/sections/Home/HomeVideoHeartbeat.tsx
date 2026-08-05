"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";
import { isVideoVisuallyEligible } from "@/lib/videoVisibility";

const ROOT_MARGIN = "8% 0px";
const HEARTBEAT_MS = 2200;

function wake(video: HTMLVideoElement) {
  if (!isVideoVisuallyEligible(video) || !video.paused) return;
  void video.play().catch(() => {});
}

/**
 * A homepage-only safety net for browser autoplay edge cases.
 *
 * Each scene still owns its active state and VideoWarden still pauses media
 * outside the viewport. The shared visibility contract allows an active
 * decorative film to wake while hidden sticky and carousel slides remain
 * asleep.
 */
export function HomeVideoHeartbeat() {
  const pathname = usePathname();

  useEffect(() => {
    if (pathname !== "/") return;

    const observed = new WeakSet<HTMLVideoElement>();
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) wake(entry.target as HTMLVideoElement);
        });
      },
      { rootMargin: ROOT_MARGIN, threshold: [0, 0.08, 0.45] },
    );

    let frame = 0;
    function inspect() {
      frame = 0;
      document.querySelectorAll<HTMLVideoElement>("video").forEach((video) => {
        if (!observed.has(video)) {
          observed.add(video);
          observer.observe(video);
        }
        wake(video);
      });
    }

    function scheduleInspect() {
      if (frame) return;
      frame = window.requestAnimationFrame(inspect);
    }

    function onChapter() {
      scheduleInspect();
      window.setTimeout(scheduleInspect, 950);
    }

    inspect();
    const mutations = new MutationObserver(scheduleInspect);
    mutations.observe(document.body, { childList: true, subtree: true });

    const heartbeat = window.setInterval(inspect, HEARTBEAT_MS);
    document.addEventListener("visibilitychange", scheduleInspect);
    window.addEventListener("pageshow", scheduleInspect);
    window.addEventListener("bt:home-chapter", onChapter as EventListener);

    return () => {
      observer.disconnect();
      mutations.disconnect();
      window.clearInterval(heartbeat);
      window.cancelAnimationFrame(frame);
      document.removeEventListener("visibilitychange", scheduleInspect);
      window.removeEventListener("pageshow", scheduleInspect);
      window.removeEventListener("bt:home-chapter", onChapter as EventListener);
    };
  }, [pathname]);

  return null;
}
