// Work Page 2.0 palette — the handoff document's own token table,
// kept as one local source so every Work section pulls the same hexes
// instead of re-declaring them inline. These sit inside the site's
// codified earth-first design language (CLAUDE.md, Aug 2026): cream as
// the primary light ground, forest as the deep editorial dark, warm
// sand reserved for authorship accents and rare highlights. Individual
// projects may introduce their own evidence accents without mutating
// this shared navigation, archive, conversion, or mobile-deck palette.
// Changes in this boundary deliberately pass through the complete Work
// evidence gate because the same tokens govern every verified viewport,
// including combined-branch builds and the isolated final preview.
export const WORK = {
  forest: "#1F3A28",
  moss: "#556B4A",
  sage: "#8FAE83",
  olive: "#7D8E52",
  cream: "#F2F0E8",
  stone: "#B5B3AA",
  sand: "#C6A97A",
  wood: "#6F4E37",
  mist: "#DDE2DC",
  charcoal: "#1B1B1B",
} as const;

// The handoff's motion tokens, referenced by every Work section.
export const EASE_ORGANIC = [0.22, 1, 0.36, 1] as const;
