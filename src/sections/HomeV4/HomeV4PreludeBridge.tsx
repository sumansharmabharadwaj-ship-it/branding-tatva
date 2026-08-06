"use client";

import { useEffect } from "react";

const VEIL_SELECTOR = "[data-page-load-veil]";
const BRIDGE_ATTRIBUTE = "data-home-prelude-bridge";
const READY_ATTRIBUTE = "data-home-prelude-ready";

export function HomeV4PreludeBridge() {
  useEffect(() => {
    const root = document.documentElement;
    let readyFrame = 0;
    let publishedState: boolean | null = null;
    let observer: MutationObserver | null = null;

    root.setAttribute(BRIDGE_ATTRIBUTE, "active");

    function setReady(ready: boolean) {
      if (publishedState === ready) return;
      publishedState = ready;
      root.setAttribute(READY_ATTRIBUTE, ready ? "true" : "false");

      if (ready) {
        window.dispatchEvent(new CustomEvent("bt:home-prelude-ready"));
        observer?.disconnect();
      }
    }

    function sync() {
      const veil = document.querySelector<HTMLElement>(VEIL_SELECTOR);
      const leaving = veil?.dataset.pageLoadState === "leaving";

      if (!veil || leaving) {
        window.cancelAnimationFrame(readyFrame);
        readyFrame = window.requestAnimationFrame(() => setReady(true));
      } else {
        setReady(false);
      }
    }

    sync();
    observer = new MutationObserver(sync);
    observer.observe(document.body, {
      childList: true,
      subtree: true,
      attributes: true,
      attributeFilter: ["data-page-load-state"],
    });

    return () => {
      observer?.disconnect();
      window.cancelAnimationFrame(readyFrame);
      root.removeAttribute(BRIDGE_ATTRIBUTE);
      root.removeAttribute(READY_ATTRIBUTE);
    };
  }, []);

  return null;
}
