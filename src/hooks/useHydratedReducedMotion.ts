"use client";

import { useEffect, useState } from "react";
import { useReducedMotion } from "framer-motion";
import { useMotionPreference } from "@/components/MotionPreference";

/**
 * Keeps the server render and hydration render identical, then honours
 * both the operating-system setting and Branding Tatva's Full/Reduced
 * control after mount.
 */
export function useHydratedMotionPreference() {
  const osReducedMotion = useReducedMotion();
  const { pref } = useMotionPreference();
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setHydrated(true);
  }, []);

  return {
    hydrated,
    prefersReducedMotion:
      hydrated && (pref === "reduced" || Boolean(osReducedMotion)),
  };
}

export function useHydratedReducedMotion() {
  return useHydratedMotionPreference().prefersReducedMotion;
}
