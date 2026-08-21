"use client";

import { useEffect, useState } from "react";
import { useReducedMotion } from "framer-motion";

/**
 * Keeps the server render and first hydration render identical, then
 * honours the operating-system motion preference after mount.
 */
export function useHydratedReducedMotion() {
  const reducedMotion = useReducedMotion();
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setHydrated(true);
  }, []);

  return hydrated && Boolean(reducedMotion);
}
