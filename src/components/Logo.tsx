import { site } from "@/data/site";

// The mark: five petals, one per element (earth, water, fire, air, space),
// converging on a central bindu — the same "elements finding their form"
// idea as the homepage hero, distilled into a shape that still reads at
// favicon size. See docs/brand-identity/BRAND_IDENTITY.md for the reasoning.
//
// The wordmark deliberately mixes two type styles, a tracked-out sans for
// "BRANDING" against a large italic serif for "Tatva", the same trick that
// makes a lot of strong studio logotypes feel considered rather than just
// typed out in one weight. It's not decoration for its own sake: the
// contrast mirrors the brand's whole premise, a plain-language practice
// (the sans) built on something with real depth underneath (the serif).

const petals = [
  { color: "#A65F46", rotate: 0 }, // earth — clay
  { color: "#31485A", rotate: 72 }, // water — indigo
  { color: "#C9953D", rotate: 144 }, // fire — ochre
  { color: "#79816D", rotate: 216 }, // air — sage
  { color: "#27221E", rotate: 288 }, // space — soil
];

export function LogoMark({ size = 32, className }: { size?: number; className?: string }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      fill="none"
      className={className}
      role="img"
      aria-label={`${site.name} mark`}
    >
      <title>{site.name}</title>
      <circle cx="50" cy="50" r="47" stroke="#27221E" strokeOpacity="0.12" strokeWidth="1.5" />
      <g>
        {petals.map((p) => (
          <path
            key={p.rotate}
            d="M50 50 C 43.5 36, 43.5 20, 50 9 C 56.5 20, 56.5 36, 50 50 Z"
            fill={p.color}
            opacity={0.92}
            transform={`rotate(${p.rotate} 50 50)`}
          />
        ))}
        <circle cx="50" cy="50" r="5.5" fill="#F4EFE6" />
        <circle cx="50" cy="50" r="3" fill="#27221E" />
      </g>
    </svg>
  );
}

export function Logo({
  size = 34,
  showWordmark = true,
  className,
}: {
  size?: number;
  showWordmark?: boolean;
  className?: string;
}) {
  return (
    <span className={`inline-flex items-center gap-3 ${className ?? ""}`}>
      <LogoMark size={size} />
      {showWordmark && (
        <span className="flex flex-col leading-none">
          <span className="font-body text-[0.6rem] font-bold uppercase tracking-[0.28em] text-action-secondary">
            Branding
          </span>
          <span className="-mt-0.5 font-display text-2xl font-semibold italic tracking-tight text-soil">
            Tatva
          </span>
        </span>
      )}
    </span>
  );
}
