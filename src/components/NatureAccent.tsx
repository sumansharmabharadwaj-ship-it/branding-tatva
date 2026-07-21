// Small decorative nature marks — leaf, mushroom, butterfly — in the same
// technical drawn language as ElementGlyph.tsx (48x48 viewBox, single
// stroke color, rounded caps/joins), kept abstracted and gestural rather
// than botanically detailed so they read as part of the same brand mark
// vocabulary instead of an imported clip-art set. Reserved for one or two
// quiet moments (see Footer, About's design-rationale) rather than
// scattered everywhere — this site's own restraint is part of its case.

type Variant = "leaf" | "mushroom" | "butterfly";

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
