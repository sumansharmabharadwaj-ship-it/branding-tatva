import { BackgroundVideo } from "@/components/BackgroundVideo";

/**
 * A restrained cinematic treatment for the positioning chapter.
 *
 * Continuous wind moving through one field replaces the old animated
 * mineral plate. The footage now provides real environmental motion while
 * the comparison remains the chapter's primary interaction. Reduced-motion
 * visitors receive the matching photographic poster.
 */
export function StakesCinematicBackdrop({ video, poster }: { video: string; poster: string }) {
  return (
    <div aria-hidden="true" className="absolute inset-0 overflow-hidden">
      <BackgroundVideo video={video} poster={poster} imagePosition="center 58%" />
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "linear-gradient(180deg, rgba(12,15,17,0.36) 0%, transparent 34%, transparent 62%, rgba(12,15,17,0.5) 100%)",
        }}
      />
    </div>
  );
}
