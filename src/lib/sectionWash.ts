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

export type ElementSlug = "earth" | "water" | "fire" | "air" | "space";

export const ELEMENT_HEX: Record<ElementSlug, string> = {
  earth: "#B85A34",
  water: "#24394D",
  fire: "#C28A28",
  air: "#5C6B4A",
  space: "#AD6F5C",
};

// Defined in globals.css but barely used anywhere — the "tan" half of
// the bold-section palette (Phase 6), alongside Soil for "dark forest".
export const SANDSTONE = "#D4B99A";

// The site's two anchor tones for flat (non-photo/video) sections —
// Sandstone for the occasional light break, this for everything else.
// Exposed as a literal hex (not just the bg-soil Tailwind class) for the
// few call sites that need a JS color value: inline styles and
// GradientSections' framer-motion color interpolation. Every full-bleed
// element-hue section (Sage, Clay, Indigo, Ochre) was collapsed into
// this single dark tone — direct feedback that cycling through five
// different saturated colors down one page read as "cluttered, no
// cohesive visual language," not as intentional variety. Element hues
// now only appear as accents (icons, borders, small numerals, card
// tints), never as a full section fill.
export const SOIL = "#27221E";

const CREAM = "#F4EFE6";

// Per-section dark mood tones — the Services page's cinematic color
// script. NOT a return of the rejected per-section element-color
// blocking (five saturated hues cycling down a page read as cluttered
// and were collapsed into SOIL, see that comment above): these are
// near-neutral darks separated by temperature, the way a graded film
// shifts mood between scenes while staying one film. Direct diagnosis,
// confirmed by the founder: viewing every section through the same
// warm SOIL base and soil-tinted overlays was re-warming even
// deliberately cool footage into one continuous amber wash. Each
// Services section now sits on its own mood; SOIL remains the warm
// tone, reserved (with Sandstone light breaks) for the page's few
// deliberate golden moments and for every other page's established
// sections.
export const MOOD = {
  charcoal: "#17181A", // Authority — architectural, neutral-cool
  stone: "#1B1A17", // Stakes — dry stone/graphite, reads grey
  mist: "#1A2026", // Education — blue-grey mist
  deepwater: "#0F151C", // Desire — night-water blue behind the gold
  forest: "#141A15", // Health Check — deep forest green-black
  slate: "#181D21", // FAQ — cool slate calm
  // Deliverables — "the study": warm charcoal-bronze dark, the room the
  // strategy documents are read in. Direct creative direction replaced
  // the chapter's parchment-light ground (which read as a white SaaS
  // pricing block against the cinematic chapters around it) with a dark
  // warm interior where the cream documents themselves become the
  // light. Deliberately the warmest dark on the page short of Book
  // Call's soil, sitting between Desire's cold deep water and Health
  // Check's forest.
  study: "#1F1A15",
} as const;

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

// Generic channel-wise linear blend between any two hex colors — the
// mechanism `sectionWash` itself is built on, exposed directly for
// cases that need to blend an arbitrary color (e.g. a card's own accent)
// rather than one of the five fixed element hues.
export function blendHex(hexA: string, hexB: string, strength: number): string {
  const [ar, ag, ab] = hexToRgb(hexA);
  const [br, bg, bb] = hexToRgb(hexB);
  const t = strength / 100;
  return rgbToHex([ar * t + br * (1 - t), ag * t + bg * (1 - t), ab * t + bb * (1 - t)]);
}

// `strength` is roughly the percentage of the element color mixed into
// the base — 10-20 reads as a clear, soft tint; higher gets closer to
// the saturated color itself.
export function sectionWash(slug: ElementSlug, strength = 16, base: string = CREAM): string {
  return blendHex(ELEMENT_HEX[slug], base, strength);
}
