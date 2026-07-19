// A 5-tile repeating pattern (large+tall pair, then a 3/3 pair, then one
// full-width close) so the grid reads as a considered mosaic rather than
// uniform cards, whichever filter is active — 3 featured or all 5.
export const TILE_LAYOUT_CLASSES = [
  "md:col-span-4 md:min-h-120",
  "md:col-span-2 md:min-h-120",
  "md:col-span-3 md:min-h-80",
  "md:col-span-3 md:min-h-80",
  "md:col-span-6 md:min-h-96",
];

// The same dark-to-transparent scrim used on both the still image and
// the video crossfade, so hovering never causes a visible shift in how
// legible the card's text is.
export const CARD_MEDIA_GRADIENT =
  "linear-gradient(0deg, rgba(39,34,30,0.9) 0%, rgba(39,34,30,0.45) 55%, rgba(39,34,30,0.15) 100%)";

// How far a card tilts toward the cursor — kept modest so it reads as
// "this card has weight" rather than a gimmick.
export const CARD_TILT_MAX_DEGREES = 6;
