import { site } from "@/data/site";

// Primary logo is the wordmark alone, a tracked-out small-caps "BRANDING"
// against a large italic serif "Tatva". That contrast is doing the branding
// work on its own; it doesn't need an icon standing next to it competing
// for attention. The five-petal mark still exists (see LogoMark below) but
// is reserved for places that need a compact glyph and nothing else, like
// the browser favicon, where its convergence point actually reads clearly
// at small size instead of looking like clutter next to text.

export function LogoMark({ size = 32, className }: { size?: number; className?: string }) {
  const petals = [
    { color: "#A65F46", rotate: 0 }, // earth — clay
    { color: "#31485A", rotate: 72 }, // water — indigo
    { color: "#C9953D", rotate: 144 }, // fire — ochre
    { color: "#79816D", rotate: 216 }, // air — sage
    { color: "#27221E", rotate: 288 }, // space — soil
  ];
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
      {petals.map((p) => (
        <path
          key={p.rotate}
          d="M50 50 C 43.5 36, 43.5 20, 50 9 C 56.5 20, 56.5 36, 50 50 Z"
          fill={p.color}
          opacity={0.92}
          transform={`rotate(${p.rotate} 50 50)`}
        />
      ))}
    </svg>
  );
}

export function Logo({ className, light = false }: { className?: string; light?: boolean }) {
  return (
    <span className={`inline-flex flex-col leading-none ${className ?? ""}`}>
      <span
        className={`font-body text-[0.6rem] font-bold uppercase tracking-[0.32em] transition-colors duration-500 ${light ? "text-sandstone" : "text-action-secondary"}`}
      >
        Branding
      </span>
      <span
        className={`-mt-1 font-display text-[1.7rem] font-semibold italic tracking-tight transition-colors duration-500 ${light ? "text-ivory" : "text-soil"}`}
      >
        Tatva
      </span>
    </span>
  );
}
