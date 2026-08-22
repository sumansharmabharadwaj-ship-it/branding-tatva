"use client";

import { useEffect } from "react";

const VEIL_SELECTOR = "[data-page-load-veil]";
const BRIDGE_ATTRIBUTE = "data-home-prelude-bridge";
const READY_ATTRIBUTE = "data-home-prelude-ready";

export function HomeV4PreludeBridge() {
  useEffect(() => {
    const root = document.documentElement;
    const veil = document.querySelector<HTMLElement>(VEIL_SELECTOR);

    // The full-screen load veil used to be server-rendered, so a slow
    // hydration could leave a visitor looking at an empty dark screen. The
    // homepage now arrives immediately. Keep the ready signal for the media
    // director and the restrained light sweep, without hiding readable copy.
    root.removeAttribute(BRIDGE_ATTRIBUTE);
    root.setAttribute(READY_ATTRIBUTE, "true");
    window.dispatchEvent(new CustomEvent("bt:home-prelude-ready"));

    // Defensive compatibility for a cached layout that still contains the
    // old veil during a client transition: it must never block interaction.
    if (veil) {
      veil.style.display = "none";
    }

    return () => {
      root.removeAttribute(BRIDGE_ATTRIBUTE);
      root.removeAttribute(READY_ATTRIBUTE);
    };
  }, []);

  return null;
}
