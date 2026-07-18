// Original, abstracted pictorial marks for the five elements — line-art in
// the same spirit as the jali lattice (IndianPattern.tsx): geometric and
// gestural, not a literal or religious symbol set. Each glyph is meant to
// be legible at a glance (a wave for water, a rising curve for fire) while
// staying part of the same drawn language as the rest of the brand mark.

type Slug = "earth" | "water" | "fire" | "air" | "space";

const paths: Record<Slug, React.ReactNode> = {
  // Grounded, layered strata — weight resting on weight.
  earth: (
    <>
      <path d="M8 30 L24 20 L40 30" />
      <path d="M11 34.5 L24 26.5 L37 34.5" />
      <path d="M14 39 L24 33 L34 39" />
    </>
  ),
  // A single continuous ripple, moving and returning.
  water: (
    <path d="M6 22c4-6 8-6 12 0s8 6 12 0 8-6 12 0M6 30c4-6 8-6 12 0s8 6 12 0 8-6 12 0" />
  ),
  // A rising, tapering curve — the shape of attention being drawn upward.
  fire: (
    <path d="M24 8c-7 8-11 14-11 20a11 11 0 0 0 22 0c0-4-2-7-4-9 .5 3-1 5-3 5.5 1.5-6-1-11-4-16.5Z" />
  ),
  // Dispersing, unequal arcs — breath leaving, never quite symmetric.
  air: (
    <>
      <path d="M6 18h24a5 5 0 1 0-4.5-7" />
      <path d="M6 26h30a5 5 0 1 1-4 8" />
      <path d="M6 34h20" />
    </>
  ),
  // The bindu — a single open point, the brand's own mark.
  space: <circle cx="24" cy="24" r="9" />,
};

export function ElementGlyph({
  slug,
  className,
  strokeWidth = 1.6,
  style,
}: {
  slug: Slug;
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
      {paths[slug]}
    </svg>
  );
}
