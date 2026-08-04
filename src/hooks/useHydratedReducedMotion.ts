"use client";

import { useEffect, useState } from "react";
import { useReducedMotion } from "framer-motion";

/**
 * Framer can read the operating system motion preference during the first
 * browser render, while the server cannot. Components that return a different
 * DOM for reduced motion must wait until hydration has completed before
 * switching to that fallback.
 */
export function useHydratedReducedMotion(): boolean {
  const reduced = useReducedMotion();
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setHydrated(true);
  }, []);

  return hydrated && Boolean(reduced);
}
