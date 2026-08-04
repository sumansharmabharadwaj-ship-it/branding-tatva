"use client";

import { useEffect, useState } from "react";
import { useReducedMotion } from "framer-motion";

/**
 * Keep the server and first client render identical, then combine
 * Framer's MotionConfig preference with the browser's native media
 * query. The native query also covers browser emulation and prevents
 * a video from continuing between first paint and Framer's
 * preference subscription update.
 */
export function useHydratedReducedMotion(): boolean {
  const framerReduced = useReducedMotion();
  const [hydrated, setHydrated] = useState(false);
  const [systemReduced, setSystemReduced] = useState(false);

  useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setSystemReduced(media.matches);
    update();
    setHydrated(true);

    if (typeof media.addEventListener === "function") {
      media.addEventListener("change", update);
      return () => media.removeEventListener("change", update);
    }

    media.addListener(update);
    return () => media.removeListener(update);
  }, []);

  return hydrated && (Boolean(framerReduced) || systemReduced);
}
