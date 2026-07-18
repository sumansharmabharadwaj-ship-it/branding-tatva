"use client";

import { site } from "@/data/site";

// Primary logo is the tracked-out small-caps "BRANDING" against a large
// italic serif "Tatva", now paired with a small version of the five-petal
// mark as the convergence point between the two words, a literal bindu:
// five elements meeting at one center, the same idea the whole site is
// built on, instead of an unrelated decorative icon. It turns slowly and
// always on its own, and blooms open on hover.

export function LogoMark({
  size = 32,
  className,
  spin = false,
}: {
  size?: number;
  className?: string;
  spin?: boolean;
}) {
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
      className={`${spin ? "animate-mark-spin" : ""} ${className ?? ""}`}
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
    <span className={`group inline-flex items-center gap-2 leading-none ${className ?? ""}`}>
      <span className="inline-flex flex-col leading-none">
        <span
          className={`font-body text-[0.6rem] font-bold uppercase tracking-[0.32em] transition-colors duration-500 ${light ? "text-ivory/90" : "text-action-secondary"}`}
          style={light ? { textShadow: "0 1px 10px rgba(20,17,14,0.7)" } : undefined}
        >
          Branding
        </span>
        <span
          className={`-mt-1 font-display text-[1.7rem] font-semibold italic tracking-tight transition-colors duration-500 ${light ? "text-ivory" : "text-clay"}`}
          style={light ? { textShadow: "0 1px 10px rgba(20,17,14,0.7)" } : undefined}
        >
          Tatva
        </span>
      </span>
      <LogoMark
        size={20}
        spin
        className="shrink-0 transition-transform duration-500 ease-out group-hover:scale-[1.4] group-hover:rotate-[72deg]"
      />
    </span>
  );
}
