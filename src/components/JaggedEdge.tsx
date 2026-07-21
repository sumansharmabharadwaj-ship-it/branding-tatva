// A torn/jagged silhouette at the seam between a hero and the bold
// color section right after it, instead of a flat straight cut — the
// section's own color tears up into the hero above it, the same
// "torn paper into a ridge line" transition the reference moodboard's
// Huckberry and Nevada House screenshots both use at their hero seams.
// Reserved for one or two signature moments (Home, About) rather than
// every hero, matching this project's existing "sparingly" rule for
// anything that breaks the otherwise-consistent section rhythm (see
// VideoBreak's quoteVariant).
export function JaggedEdge({ color, className }: { color: string; className?: string }) {
  return (
    <svg
      viewBox="0 0 1440 100"
      preserveAspectRatio="none"
      className={`pointer-events-none absolute inset-x-0 bottom-full h-16 w-full translate-y-px sm:h-24 ${className ?? ""}`}
      aria-hidden="true"
    >
      <path
        d="M0,100 L0,55 L45,30 L100,58 L150,15 L210,48 L270,22 L340,52 L400,8 L470,40 L540,18 L610,50 L680,25 L750,55 L820,12 L890,45 L960,20 L1030,52 L1100,28 L1170,48 L1240,15 L1310,42 L1380,20 L1440,45 L1440,100 Z"
        fill={color}
      />
    </svg>
  );
}
