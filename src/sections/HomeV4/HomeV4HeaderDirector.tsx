"use client";

import { useEffect } from "react";

const TOP_REVEAL_PX = 96;
const DIRECTION_THRESHOLD_PX = 8;

export function HomeV4HeaderDirector() {
  useEffect(() => {
    const header = document.querySelector<HTMLElement>("header");
    if (!header) return;
    const homeHeader = header;

    let lastCommittedScroll = window.scrollY;

    function setHidden(hidden: boolean) {
      homeHeader.dataset.homeNativeHidden = hidden ? "true" : "false";
    }

    function syncHeader() {
      const current = window.scrollY;
      const openMenu = Boolean(homeHeader.querySelector('[aria-expanded="true"]'));

      if (openMenu || current <= TOP_REVEAL_PX) {
        setHidden(false);
        lastCommittedScroll = current;
        return;
      }

      const delta = current - lastCommittedScroll;
      if (Math.abs(delta) < DIRECTION_THRESHOLD_PX) return;

      setHidden(delta > 0);
      lastCommittedScroll = current;
    }

    setHidden(false);
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
