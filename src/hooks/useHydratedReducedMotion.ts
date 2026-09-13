"use client";

import { useReducedMotion } from "framer-motion";
import { useMotionPreference } from "@/components/MotionPreference";

/**
 * Keeps the server render and hydration render identical, then honours
 * both the operating-system setting and Branding Tatva's Full/Reduced
 * control after mount.
 */
export function useHydratedMotionPreference() {
  const osReducedMotion = useReducedMotion();
  const { pref, hydrated } = useMotionPreference();

  return {
    hydrated,
    prefersReducedMotion:
      hydrated && (pref === "reduced" || Boolean(osReducedMotion)),
  };
}

export function useHydratedReducedMotion() {
  return useHydratedMotionPreference().prefersReducedMotion;
}
