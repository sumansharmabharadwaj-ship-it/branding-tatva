// Shared easing curves for Framer Motion — the JS-side counterpart to
// --ease-air/--ease-earth in globals.css. Framer Motion needs the raw
// cubic-bezier control points as a numeric array rather than a CSS
// custom property, so this is the one place those four numbers live
// instead of the same array copied into every component that uses it.
//
// EASE_AIR is the dominant curve site-wide (Reveal, ClipReveal, card
// tilts, section transitions, the load veil — anywhere something settles
// into place). EASE_EARTH is reserved for the handful of spots that
// already use --ease-earth on the CSS side (button hovers, the nav
// underline) — a slightly heavier, more grounded settle for direct
// hover feedback rather than an entrance.
export const EASE_AIR = [0.16, 1, 0.3, 1] as const;
export const EASE_EARTH = [0.22, 0.61, 0.36, 1] as const;

// Motion Bible tokens. Meaning-carrying transitions use the same small
// vocabulary across pages, which keeps five very different journeys inside
// one cinematic world.
export const MOTION_DURATION = {
  micro: 0.16,
  focus: 0.22,
  reveal: 0.58,
  scene: 0.9,
  signature: 1.45,
} as const;

export const MOTION_DISTANCE = {
  near: 12,
  content: 20,
  scene: 28,
} as const;
