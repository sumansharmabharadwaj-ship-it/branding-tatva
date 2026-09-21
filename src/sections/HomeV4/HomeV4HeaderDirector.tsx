"use client";

import { useEffect } from "react";

const TOP_REVEAL_PX = 96;
const DOWNWARD_HIDE_THRESHOLD_PX = 8;
const UPWARD_REVEAL_TRAVEL_PX = 56;

export function HomeV4HeaderDirector() {
  useEffect(() => {
    const header = document.querySelector<HTMLElement>("header");
    if (!header) return;
    const homeHeader = header;

    let lastCommittedScroll = window.scrollY;
    let upwardTravel = 0;

    function setHidden(hidden: boolean) {
      homeHeader.dataset.homeNativeHidden = hidden ? "true" : "false";
    }

    function syncHeader() {
      const current = window.scrollY;
      const openMenu = Boolean(homeHeader.querySelector('[aria-expanded="true"]'));

      if (openMenu || current <= TOP_REVEAL_PX) {
        upwardTravel = 0;
        setHidden(false);
        lastCommittedScroll = current;
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

    setHidden(window.scrollY > TOP_REVEAL_PX);
    window.addEventListener("scroll", syncHeader, { passive: true });
    window.addEventListener("pageshow", syncHeader);

    return () => {
      window.removeEventListener("scroll", syncHeader);
      window.removeEventListener("pageshow", syncHeader);
      delete homeHeader.dataset.homeNativeHidden;
    };
  }, []);

  return null;
}
