// Small decorative motifs — leaf, mushroom, butterfly, ripple, ember —
// in the same technical drawn language as ElementGlyph.tsx (48x48
// viewBox, single stroke color, rounded caps/joins), kept abstracted
// and gestural rather than botanically detailed so they read as part of
// the same brand mark vocabulary instead of an imported clip-art set.
// Unlike ElementGlyph (a fixed, literal per-element marker used as a
// functional label everywhere), these are purely decorative flourishes
// loosely inspired by the five elements — ripple/ember lean water/fire,
// leaf/mushroom/butterfly lean earth/air — not meant as a 1:1 second
// icon set. Reserved for one or two quiet moments per page (see Footer,
// About's design-rationale, Contact/Services/Blog heroes) rather than
// scattered everywhere — this site's own restraint is part of its case.

type Variant = "leaf" | "mushroom" | "butterfly" | "ripple" | "ember";

const paths: Record<Variant, React.ReactNode> = {
  leaf: (
    <>
      <path d="M24 6c10 4 16 14 16 24c0 8-7 12-16 12s-16-4-16-12c0-10 6-20 16-24Z" />
      <path d="M24 8v34" />
    </>
  ),
  mushroom: (
    <>
      <path d="M12 22c0-8 5-14 12-14s12 6 12 14c-6-2-10-2-12-2s-6 0-12 2Z" />
      <path d="M19 22v14c0 3 2 5 5 5s5-2 5-5V22" />
    </>
  ),
  butterfly: (
    <>
      <path d="M24 10v28" />
      <path d="M24 14c-4-8-16-8-18 0c-2 8 8 12 18 6" />
      <path d="M24 14c4-8 16-8 18 0c2 8-8 12-18 6" />
      <path d="M24 24c-4 8-14 10-16 4c-2-4 6-4 16 0" />
      <path d="M24 24c4 8 14 10 16 4c2-4-6-4-16 0" />
    </>
  ),
  // Water — three nested rings, like a drop's rings still spreading.
  ripple: (
    <>
      <path d="M8 26a16 16 0 0 0 32 0" />
      <path d="M14 22a10 10 0 0 0 20 0" />
      <path d="M20 18a4 4 0 0 0 8 0" />
    </>
  ),
  // Fire — a single gestural flame, same closed-outline language as leaf/mushroom.
  ember: (
    <path d="M24 6c6 9 10 15 10 21a10 10 0 0 1-20 0c0-4 2-7 4-9c0 4 2 6 4 6c-1-4 0-9 2-18Z" />
  ),
};

export function NatureAccent({
  variant,
  className,
  strokeWidth = 1.4,
  style,
}: {
  variant: Variant;
  className?: string;
  strokeWidth?: number;
  style?: React.CSSProperties;
}) {
  return (
    <svg
      viewBox="0 0 48 48"
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      style={style}
      aria-hidden="true"
    >
      {paths[variant]}
    </svg>
  );
}
