// The pinned horizontal treatment needs real width to read as "pages"
// rather than a cramped strip, and a pin that eats 6 screens of scroll on
// a phone is closer to a trap than storytelling — so it's gated to a
// wide viewport, on top of the existing prefers-reduced-motion check.
export const DESKTOP_QUERY = "(min-width: 1024px)";
