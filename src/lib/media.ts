// Shared overlay gradient for the mid-page media breaks (ImageBreak,
// VideoBreak) — darkest through the middle band where the quote sits,
// lighter at the top/bottom edges so the photo/video still reads through.
export const BREAK_OVERLAY_GRADIENT =
  "linear-gradient(0deg, rgba(20,17,14,0.2) 0%, rgba(20,17,14,0.6) 35%, rgba(20,17,14,0.6) 65%, rgba(20,17,14,0.2) 100%)";

// `vh` is the large viewport (address bar hidden) on mobile Safari/Chrome,
// so a section sized in `vh` grows and the page jumps every time the
// address bar shows or hides while scrolling — the exact "mobile
// viewport height changes" class of scroll bug. `svh` (small viewport)
// stays fixed to the *smallest* the chrome ever leaves, so the section
// never resizes out from under the scroll position. CinematicHero
// already used `svh` directly via a Tailwind class; this covers every
// height/minHeight value that arrives as a plain string prop instead
// (PhotoHero, VideoBreak, ImageBreak, CalendlyEmbed), including ones
// nested inside a CSS min()/max() expression rather than standing
// alone, without having to touch every call site that passes "72vh".
export function toSvh(value: string): string {
  return value.replace(/(\d*\.?\d+)vh\b/g, "$1svh");
}
