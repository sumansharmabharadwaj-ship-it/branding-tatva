import { site } from "@/data/site";

// The 2026 identity, per Suman's brand boards: an interlocked serif
// B and T monogram with a botanical sprig climbing its left side, and
// a single line spaced serif wordmark beneath it. The monogram is
// composed from the site's own display face (Cormorant Garamond)
// rather than outlined paths, so it always matches the typography
// around it; the sprig is a hand drawn SVG. The previous five bar
// mark is retired from the logo entirely.

export function Sprig({ className, color = "currentColor" }: { className?: string; color?: string }) {
  return (
    <svg viewBox="0 0 40 100" fill="none" className={className} aria-hidden="true">
      {/* The stem — one quiet curve. */}
      <path d="M30 96 Q14 68 12 44 Q11 26 20 6" stroke={color} strokeWidth="1.6" strokeLinecap="round" fill="none" />
      {/* Leaves, alternating along the climb. */}
      <path d="M13 40 Q2 34 1 24 Q12 26 15 36 Z" fill={color} opacity="0.9" />
      <path d="M13 52 Q24 46 27 36 Q15 38 12 48 Z" fill={color} opacity="0.75" />
      <path d="M14 62 Q3 58 1 48 Q12 50 16 58 Z" fill={color} opacity="0.85" />
      <path d="M17 74 Q28 70 31 60 Q19 62 16 70 Z" fill={color} opacity="0.7" />
      <path d="M21 84 Q10 82 7 73 Q18 74 22 80 Z" fill={color} opacity="0.8" />
      <path d="M19 14 Q28 8 34 10 Q28 18 20 20 Z" fill={color} opacity="0.85" />
    </svg>
  );
}

export function LogoMark({
  size = 32,
  className,
  light = false,
}: {
  size?: number;
  className?: string;
  light?: boolean;
}) {
  const letter = light ? "#F2F0E8" : "#1B1B1B";
  const sprig = light ? "#C6A97A" : "#7D8E52";
  return (
    <span
      role="img"
      aria-label={`${site.name} mark`}
      className={`relative inline-block select-none ${className ?? ""}`}
      style={{ width: size, height: size }}
    >
      <Sprig color={sprig} className="absolute left-0 top-[8%] h-[84%] w-[38%]" />
      <span
        aria-hidden="true"
        className="absolute font-display font-medium leading-none"
        style={{ color: letter, fontSize: size * 0.62, left: size * 0.22, top: size * 0.3, opacity: 0.92 }}
      >
        T
      </span>
      <span
        aria-hidden="true"
        className="absolute font-display font-medium leading-none"
        style={{ color: letter, fontSize: size * 0.94, left: size * 0.4, top: size * 0.02 }}
      >
        B
      </span>
    </span>
  );
}

export function Logo({ className, light = false }: { className?: string; light?: boolean }) {
  return (
    <span className={`inline-flex flex-col leading-none ${className ?? ""}`}>
      <span
        className={`font-display text-[0.95rem] font-medium uppercase tracking-[0.3em] transition-colors duration-500 ${
          light ? "text-ivory" : "text-soil"
        }`}
        style={light ? { textShadow: "0 1px 10px rgba(20,17,14,0.7)" } : undefined}
      >
        {site.name}
      </span>
    </span>
  );
}
