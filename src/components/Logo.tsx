import { site } from "@/data/site";

// Primary logo is the wordmark alone: a tracked-out small-caps "BRANDING"
// against a large italic serif "Tatva". That contrast carries the brand on
// its own — an elite mark stays quiet and confident rather than competing
// with itself. A small spinning icon was tried alongside the wordmark and
// read as a muddy, indistinct smudge at the size a header actually needs,
// so it's gone from here. The five-petal mark (LogoMark, below) still
// exists for places built to show a single glyph at real size, like the
// browser favicon, where its convergence point actually reads clearly.

export function LogoMark({ size = 32, className }: { size?: number; className?: string }) {
  const petals = [
    { color: "#B85A34", rotate: 0 }, // earth — clay
    { color: "#24394D", rotate: 72 }, // water — indigo
    { color: "#C28A28", rotate: 144 }, // fire — ochre
    { color: "#5C6B4A", rotate: 216 }, // air — sage
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
        className={`font-body text-[0.62rem] font-bold uppercase tracking-[0.38em] transition-colors duration-500 ${light ? "text-ivory/90" : "text-action-secondary"}`}
        style={light ? { textShadow: "0 1px 10px rgba(20,17,14,0.7)" } : undefined}
      >
        Branding
      </span>
      <span
        className={`-mt-1 font-display text-[2.1rem] font-semibold italic tracking-tight transition-colors duration-500 ${light ? "text-ivory" : "text-clay"}`}
        style={light ? { textShadow: "0 1px 10px rgba(20,17,14,0.7)" } : undefined}
      >
        Tatva
      </span>
    </span>
  );
}
