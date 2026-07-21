// Section-level background washes for the long unbroken cream/parchment
// runs the design audit found (bg-background #F4EFE6 and bg-background-alt
// #E8DED0 are only ~8% apart in lightness — every plain section reads as
// the same "blank" neutral). Rather than a second, unrelated palette,
// every wash is a light blend of the same five-element hex colors already
// used everywhere else (cards, glyphs, embers), so a section picks up a
// real, distinct hue instead of introducing new brand colors.
//
// Blended by hand (channel-wise linear mix) rather than the CSS
// color-mix() function, since these values also feed GradientSections'
// framer-motion color interpolation, which only understands literal hex/
// rgb, not color-mix() syntax.

type ElementSlug = "earth" | "water" | "fire" | "air" | "space";

const ELEMENT_HEX: Record<ElementSlug, string> = {
  earth: "#B85A34",
  water: "#24394D",
  fire: "#C28A28",
  air: "#5C6B4A",
  space: "#AD6F5C",
};

const CREAM = "#F4EFE6";

function hexToRgb(hex: string): [number, number, number] {
  const n = parseInt(hex.slice(1), 16);
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
}

function rgbToHex([r, g, b]: number[]): string {
  return (
    "#" +
    [r, g, b]
      .map((c) => Math.max(0, Math.min(255, Math.round(c))).toString(16).padStart(2, "0"))
      .join("")
  );
}

// `strength` is roughly the percentage of the element color mixed into
// the base — 10-20 reads as a clear, soft tint; higher gets closer to
// the saturated color itself.
export function sectionWash(slug: ElementSlug, strength = 16, base: string = CREAM): string {
  const [er, eg, eb] = hexToRgb(ELEMENT_HEX[slug]);
  const [br, bg, bb] = hexToRgb(base);
  const t = strength / 100;
  return rgbToHex([er * t + br * (1 - t), eg * t + bg * (1 - t), eb * t + bb * (1 - t)]);
}
