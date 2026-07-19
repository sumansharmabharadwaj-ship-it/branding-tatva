// Dark scrim over the background photo/video — heaviest at the very top
// and bottom (where the header pill and the text block sit), lightest
// through the middle third so the image itself still reads through.
export const HERO_SCRIM_GRADIENT =
  "linear-gradient(180deg, rgba(20,17,14,0.65) 0%, rgba(20,17,14,0.2) 14%, rgba(20,17,14,0.1) 32%, rgba(20,17,14,0.55) 62%, rgba(20,17,14,0.95) 100%)";

// How far the background drifts (as a % of its own height) and how far
// the text block drifts/fades, across the hero's full scroll-out — the
// background moves noticeably more than the text so the two separate
// visually rather than scrolling as one flat plane.
export const HERO_IMAGE_PARALLAX_RANGE: [string, string] = ["0%", "18%"];
export const HERO_CONTENT_Y_RANGE: [string, string] = ["0%", "10%"];
// Content fades out over just the first 60% of the scroll-out, so it's
// fully gone before the next section arrives rather than lingering.
export const HERO_CONTENT_FADE_PROGRESS: [number, number] = [0, 0.6];

// Mouse-parallax depth layer — deliberately subtle (a handful of
// pixels, not a dramatic tilt) so it reads as "this scene has depth"
// rather than as an obvious gimmick competing with the scroll parallax.
export const MOUSE_PARALLAX_RANGE_PX = 18;
export const MOUSE_PARALLAX_SPRING = { stiffness: 40, damping: 20, mass: 0.5 };
