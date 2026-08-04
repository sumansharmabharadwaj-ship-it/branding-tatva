"use client";

import { useCallback, useSyncExternalStore } from "react";

/**
 * Hydration-safe media query hook.
 *
 * The server snapshot stays false so server markup and the first
 * hydrated render agree. useSyncExternalStore then reads the real
 * viewport immediately and keeps the result subscribed to changes.
 */
export function useMediaQuery(query: string): boolean {
  const subscribe = useCallback(
    (notify: () => void) => {
      const media = window.matchMedia(query);
      const listener = () => notify();

      if (typeof media.addEventListener === "function") {
        media.addEventListener("change", listener);
        return () => media.removeEventListener("change", listener);
      }

      media.addListener(listener);
      return () => media.removeListener(listener);
    },
    [query],
  );

  const getSnapshot = useCallback(() => window.matchMedia(query).matches, [query]);
  const getServerSnapshot = useCallback(() => false, []);

  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}
