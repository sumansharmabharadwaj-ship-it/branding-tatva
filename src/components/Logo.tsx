import { site } from "@/data/site";

// Primary logo is the wordmark alone: a tracked-out small-caps "BRANDING"
// against a large italic serif "Tatva". That contrast carries the brand on
// its own — an elite mark stays quiet and confident rather than competing
// with itself. A small spinning icon was tried alongside the wordmark and
// read as a muddy, indistinct smudge at the size a header actually needs,
// so it's gone from here. The five-bar mark (LogoMark, below) still exists
// for places built to show a single glyph at real size, like the browser
// favicon: five bars in the five element colors, rising and settling like
// a skyline — the same five-part idea as the radiating petals this
// replaced, but a shape that reads as a mark rather than a symbol.
const BARS = [
  { color: "#B85A34", x: 14, height: 34 }, // earth — clay
  { color: "#24394D", x: 30, height: 48 }, // water — indigo
  { color: "#C28A28", x: 46, height: 64 }, // fire — ochre
  { color: "#5C6B4A", x: 62, height: 48 }, // air — sage
  { color: "#27221E", x: 78, height: 34 }, // space — soil
];
const BAR_WIDTH = 10;
const BASELINE = 78;

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
      {BARS.map((b) => (
        <rect
          key={b.x}
          x={b.x}
          y={BASELINE - b.height}
          width={BAR_WIDTH}
          height={b.height}
          rx={5}
          fill={b.color}
          opacity={0.92}
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
