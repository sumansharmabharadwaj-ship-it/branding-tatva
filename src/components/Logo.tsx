import { site } from "@/data/site";
import { BRAND_MARK_VIEWBOX, TATVA_CONTOURS, TATVA_MARK_COLORS } from "@/lib/brandMark";

export function LogoMark({
  size = 32,
  className,
  light = false,
  monochrome = false,
}: {
  size?: number;
  className?: string;
  light?: boolean;
  monochrome?: boolean;
}) {
  return (
    <svg
      width={size}
      height={size}
      viewBox={BRAND_MARK_VIEWBOX}
      fill="none"
      className={className}
      role="img"
      aria-label={`${site.name} mark`}
    >
      <title>{site.name}</title>
      {TATVA_CONTOURS.map((path, index) => (
        <path
          key={path}
          d={path}
          stroke={monochrome || light ? "currentColor" : TATVA_MARK_COLORS[index]}
          strokeWidth={index === 0 ? 3.7 : 3.1 - index * 0.18}
          strokeLinecap="round"
          strokeLinejoin="round"
          opacity={monochrome || light ? 0.42 + index * 0.14 : 0.94}
        />
      ))}
      <circle
        cx="50"
        cy="57"
        r="5.2"
        fill={monochrome ? "currentColor" : TATVA_MARK_COLORS[4]}
        opacity={light ? 0.96 : 1}
      />
    </svg>
  );
}

export function Logo({ className, light = false }: { className?: string; light?: boolean }) {
  return (
    <span className={`inline-flex flex-col leading-none ${className ?? ""}`}>
      <span
        className={`font-display text-[1.7rem] font-medium tracking-[-0.045em] transition-colors duration-500 ${
          light ? "text-ivory" : "text-soil"
        }`}
        style={light ? { textShadow: "0 1px 12px rgba(20,17,14,.68)" } : undefined}
      >
        Branding <span className={light ? "italic text-sandstone" : "italic text-clay"}>Tatva</span>
      </span>
      <span
        className={`mt-1 text-[0.47rem] font-semibold uppercase tracking-[0.27em] transition-colors duration-500 ${
          light ? "text-ivory/58" : "text-foreground-secondary"
        }`}
      >
        Strategy · language · memory
      </span>
    </span>
  );
}
