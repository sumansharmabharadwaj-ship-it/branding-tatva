// Scroll position (px) past which the header switches from its
// transparent "on hero" look to the solid elevated pill.
export const SCROLLED_THRESHOLD = 80;

// Minimum scroll delta (px) between reads before the header reacts to
// direction — filters out the sub-pixel/rubber-band noise Lenis and
// momentum scrolling both produce, which would otherwise flicker the
// header open and shut on essentially no movement.
export const HIDE_REVEAL_DELTA = 8;

// Scroll position (px) below which the header always stays visible,
// regardless of direction — hiding it while still this close to the
// top reads as broken, not helpful.
export const HIDE_REVEAL_MIN_SCROLL = 160;
