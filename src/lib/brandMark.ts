export const BRAND_MARK_VIEWBOX = "0 0 100 100";

// Four organic contours and one bindu. Together they form a seed, a
// topographic map, and an eye without becoming a literal illustration.
// The contours represent Earth, Water, Fire, and Air moving around the
// central Space. The shared lower point makes the five parts resolve into
// one governing truth rather than sit beside one another as separate icons.
export const TATVA_CONTOURS = [
  "M50 8C28 11 12 29 12 51C12 72 27 87 50 94C73 87 88 72 88 51C88 29 72 11 50 8Z",
  "M50 20C33 23 22 37 22 53C22 68 33 79 50 85C67 79 78 68 78 53C78 37 67 23 50 20Z",
  "M50 32C39 34 32 43 32 54C32 64 39 72 50 77C61 72 68 64 68 54C68 43 61 34 50 32Z",
  "M50 43C44 45 40 50 40 56C40 62 44 67 50 70C56 67 60 62 60 56C60 50 56 45 50 43Z",
] as const;

export const TATVA_MARK_COLORS = [
  "#B85A34", // Earth
  "#4E6A69", // Water
  "#C28A28", // Fire
  "#8FAE83", // Air
  "#D4B99A", // Space / bindu
] as const;
