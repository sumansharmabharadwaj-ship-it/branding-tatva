const GENERATED_MOTION_PREFIX = "/videos/generated/";

/**
 * Generated clips on the site are intentionally short. Their resets are
 * visible in long, decision-heavy sections, so those assets now act as still
 * art sources while natural documentary footage can keep its native motion.
 */
export function usesLivingStill(video?: string) {
  return Boolean(video?.startsWith(GENERATED_MOTION_PREFIX));
}
