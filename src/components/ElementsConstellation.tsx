import { ElementGlyph } from "./ElementGlyph";

// Replaces a literal (and thematically unrelated) photo behind the five
// elements section with the elements themselves, drawn — five glyphs held
// in a loose orbit around a shared centre, echoing the "separate parts,
// one centre" idea the section's copy already states. Faint and fixed,
// it reads as texture from normal scroll distance, not as decoration
// fighting the text in front of it.

const layout: { slug: "earth" | "water" | "fire" | "air" | "space"; color: string; style: React.CSSProperties }[] = [
  { slug: "earth", color: "#B85A34", style: { top: "8%", left: "8%", width: "13vw", maxWidth: 160 } },
  { slug: "water", color: "#24394D", style: { top: "62%", left: "4%", width: "11vw", maxWidth: 140 } },
  { slug: "fire", color: "#A5752A", style: { top: "14%", right: "10%", width: "10vw", maxWidth: 130 } },
  { slug: "air", color: "#5C6B4A", style: { top: "68%", right: "14%", width: "13vw", maxWidth: 160 } },
  { slug: "space", color: "#AD6F5C", style: { top: "40%", left: "45%", width: "8vw", maxWidth: 100 } },
];

export function ElementsConstellation() {
  return (
    <div className="absolute inset-0 overflow-hidden" aria-hidden="true">
      {layout.map(({ slug, color, style }) => (
        <ElementGlyph
          key={slug}
          slug={slug}
          strokeWidth={1}
          className="absolute opacity-[0.16]"
          style={{ color, ...style }}
        />
      ))}
    </div>
  );
}
