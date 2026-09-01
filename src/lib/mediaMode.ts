const SYNTHETIC_MOTION_PREFIXES = [
  "/videos/generated/",
  "/videos/higgsfield-",
] as const;

/**
 * Synthetic clips on the site are intentionally short. Their near-static
 * frames and repeated resets are visible in long, decision-heavy sections,
 * so those assets act as still art sources while natural documentary footage
 * can keep its native motion.
 */
export function usesLivingStill(video?: string) {
  return Boolean(
    video && SYNTHETIC_MOTION_PREFIXES.some((prefix) => video.startsWith(prefix)),
  );
}
