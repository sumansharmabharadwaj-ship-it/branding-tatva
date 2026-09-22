"use client";

import { useEffect } from "react";
import { homeReadingOwnsMotion, watchHomeMotionOwnership } from "./homeMotionOwnership";

const TOP_REVEAL_PX = 96;
const DOWNWARD_HIDE_THRESHOLD_PX = 8;
const UPWARD_REVEAL_TRAVEL_PX = 56;

export function HomeV4HeaderDirector() {
  useEffect(() => {
    const header = document.querySelector<HTMLElement>("[data-site-header]");
    const homeRoot = document.querySelector<HTMLElement>("[data-home-v4]");
    if (!header || !homeRoot) return;
    const homeHeader = header;
    const root = homeRoot;

    let lastCommittedScroll = readScroll();
    let upwardTravel = 0;
    let frame = 0;
    let disposed = false;
    let rebasePending = false;
    let hovered = false;

    function readScroll() {
      const maximum = Math.max(0, document.documentElement.scrollHeight - window.innerHeight);
      return Math.max(0, Math.min(maximum, window.scrollY));
    }

    function setHidden(hidden: boolean) {
      const value = hidden ? "true" : "false";
      if (homeHeader.dataset.homeNativeHidden !== value) homeHeader.dataset.homeNativeHidden = value;
    }

    function navigationOwnsHeader() {
      return hovered || homeHeader.contains(document.activeElement) ||
        Boolean(homeHeader.querySelector('[aria-expanded="true"]'));
    }

    function rebase() {
      lastCommittedScroll = readScroll();
      upwardTravel = 0;
    }

    function syncHeader() {
      frame = 0;
      if (disposed || document.hidden) return;
      const current = readScroll();

      if (rebasePending) {
        rebase();
        rebasePending = false;
      }
      if (navigationOwnsHeader() || current <= TOP_REVEAL_PX) {
        upwardTravel = 0;
        setHidden(false);
        lastCommittedScroll = current;
        return;
      }
      if (homeReadingOwnsMotion(root)) {
        rebase();
        return;
      }

      const delta = current - lastCommittedScroll;
      if (Math.abs(delta) < DOWNWARD_HIDE_THRESHOLD_PX) return;

      if (delta > 0) {
        upwardTravel = 0;
        setHidden(true);
      } else {
        upwardTravel += Math.abs(delta);
        if (upwardTravel >= UPWARD_REVEAL_TRAVEL_PX) {
          setHidden(false);
          upwardTravel = 0;
        }
      }

      lastCommittedScroll = current;
    }

    function schedule() {
      if (!disposed && !document.hidden && !frame) frame = window.requestAnimationFrame(syncHeader);
    }

    function onOwnershipChange() {
      if (disposed) return;
      rebase();
      rebasePending = true;
      if (document.hidden) {
        hovered = false;
        window.cancelAnimationFrame(frame);
        frame = 0;
        return;
      }
      if (navigationOwnsHeader() || readScroll() <= TOP_REVEAL_PX) setHidden(false);
      // Recheck after focus and pointer defaults have finished. Any scroll
      // adjustment that accompanies them starts a new direction baseline.
      schedule();
    }

    function onPageShow() {
      if (disposed) return;
      setHidden(readScroll() > TOP_REVEAL_PX && !navigationOwnsHeader());
      onOwnershipChange();
    }

    function onPointerEnter(event: PointerEvent) {
      if (event.pointerType !== "mouse") return;
      hovered = true;
      onOwnershipChange();
    }

    function onPointerLeave() {
      hovered = false;
      onOwnershipChange();
    }

    setHidden(readScroll() > TOP_REVEAL_PX && !navigationOwnsHeader());
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", onOwnershipChange, { passive: true });
    window.addEventListener("pageshow", onPageShow);
    homeHeader.addEventListener("pointerenter", onPointerEnter);
    homeHeader.addEventListener("pointerleave", onPointerLeave);
    const stopWatchingOwnership = watchHomeMotionOwnership(onOwnershipChange);
    const menu = new MutationObserver(onOwnershipChange);
    menu.observe(homeHeader, { attributes: true, attributeFilter: ["aria-expanded"], subtree: true });
    const layout = new ResizeObserver(onOwnershipChange);
    layout.observe(root);

    return () => {
      disposed = true;
      window.cancelAnimationFrame(frame);
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", onOwnershipChange);
      window.removeEventListener("pageshow", onPageShow);
      homeHeader.removeEventListener("pointerenter", onPointerEnter);
      homeHeader.removeEventListener("pointerleave", onPointerLeave);
      stopWatchingOwnership();
      menu.disconnect();
      layout.disconnect();
      delete homeHeader.dataset.homeNativeHidden;
    };
  }, []);

  return null;
}
