"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";

const ROOT_MARGIN = "8% 0px";
const HEARTBEAT_MS = 3200;

function isActuallyVisible(video: HTMLVideoElement) {
  if (document.hidden || !video.muted || !video.loop) return false;

  const rect = video.getBoundingClientRect();
  if (
    rect.width < 2 ||
    rect.height < 2 ||
    rect.bottom <= 0 ||
    rect.top >= window.innerHeight
  ) {
    return false;
  }

  let node: HTMLElement | null = video;
  while (node && node !== document.body) {
    if (node.getAttribute("aria-hidden") === "true") return false;
    const style = window.getComputedStyle(node);
    if (
      style.display === "none" ||
      style.visibility === "hidden" ||
      Number.parseFloat(style.opacity || "1") <= 0.025
    ) {
      return false;
    }
    node = node.parentElement;
  }

  return true;
}

function wake(video: HTMLVideoElement) {
  if (!isActuallyVisible(video) || !video.paused) return;
  void video.play().catch(() => {});
}

/**
 * A homepage-only safety net for browser autoplay edge cases.
 *
 * Each scene still owns its own active/inactive logic and VideoWarden still
 * pauses anything offscreen. This heartbeat only revives a muted loop when
 * the video and every ancestor are visibly present. It therefore repairs the
 * common delayed-mount race (AnimatePresence, sticky stages, tab return)
 * without waking hidden slides or decoding the whole page at once.
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

    inspect();
    const mutations = new MutationObserver(scheduleInspect);
    mutations.observe(document.body, {
      childList: true,
      subtree: true,
      attributes: true,
      attributeFilter: ["aria-hidden", "class", "style", "src"],
    });

    const heartbeat = window.setInterval(inspect, HEARTBEAT_MS);
    document.addEventListener("visibilitychange", scheduleInspect);
    window.addEventListener("pageshow", scheduleInspect);

    return () => {
      observer.disconnect();
      mutations.disconnect();
      window.clearInterval(heartbeat);
      window.cancelAnimationFrame(frame);
      document.removeEventListener("visibilitychange", scheduleInspect);
      window.removeEventListener("pageshow", scheduleInspect);
    };
  }, [pathname]);

  return null;
}
