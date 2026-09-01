const SYNTHETIC_MOTION_PREFIXES = [
  "/videos/generated/",
  "/videos/higgsfield-",
  "/videos/card-",
  "/videos/hero-",
  "/videos/about-hero-bg-meadow.mp4",
] as const;

const REPEAT_PRONE_DOCUMENTARY_FILMS = [
  "/videos/pexels-studio-morning-light.mp4",
  "/videos/pexels-golden-fog-sea.mp4",
  "/videos/pexels-river-dawn.mp4",
  "/videos/pixabay-campfire-conversation.mp4",
  "/videos/pixabay-cascade-rocks.mp4",
  "/videos/pixabay-forest-sunbeams.mp4",
  "/videos/pixabay-golden-reeds-wind.mp4",
  "/videos/pixabay-golden-forest-glow.mp4",
  "/videos/pixabay-sea-of-fog-sunrise.mp4",
  "/videos/pixabay-stream-mist-rays.mp4",
] as const;

/**
 * Synthetic clips and a small, reviewed set of short documentary films have
 * visible resets in long, decision-heavy sections. Those assets therefore
 * become visitor-driven living images while longer, purposeful documentary
 * footage can keep its native motion.
 */
export function usesLivingStill(video?: string) {
  return Boolean(
    video &&
      (SYNTHETIC_MOTION_PREFIXES.some((prefix) => video.startsWith(prefix)) ||
        REPEAT_PRONE_DOCUMENTARY_FILMS.some((film) => video === film)),
  );
}
