"use client";

import { useEffect, useState } from "react";

const REDUCED_QUERY = "(prefers-reduced-motion: reduce)";

/**
 * Video is deliberately opt-in rather than opt-out. The server and first
 * hydrated frame render the poster only; a media resource is mounted after
 * the browser confirms that motion is allowed. This removes the tiny autoplay
 * race that can otherwise occur before a reduced-motion hook settles.
 */
export function useMotionMediaAllowed(): boolean {
  const [allowed, setAllowed] = useState(false);

  useEffect(() => {
    const media = window.matchMedia(REDUCED_QUERY);
    const update = () => {
      setAllowed(
        !media.matches && document.documentElement.dataset.motion !== "reduced",
      );
    };

    update();

    const motionPreference = new MutationObserver(update);
    motionPreference.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["data-motion"],
    });

    if (typeof media.addEventListener === "function") {
      media.addEventListener("change", update);
    } else {
      media.addListener(update);
    }

    return () => {
      motionPreference.disconnect();
      if (typeof media.removeEventListener === "function") {
        media.removeEventListener("change", update);
      } else {
        media.removeListener(update);
      }
    };
  }, []);

  return allowed;
}
