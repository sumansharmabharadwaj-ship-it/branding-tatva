import { site } from "@/data/site";
import { BRAND_IDENTITY } from "@/lib/brandIdentity";
import styles from "./Logo.module.css";

export function LogoMark({ size = 32, className, light = false, animated = false }: {
  size?: number;
  className?: string;
  light?: boolean;
  animated?: boolean;
}) {
  return (
    <span role="img" aria-label={`${site.name} mark`} className={`${styles.mark} ${className ?? ""}`}
      data-animated={animated ? "true" : undefined} data-light={light ? "true" : undefined}
      style={{ width: size, height: size }}>
      <span className={styles.sculpture}>
        <svg viewBox="0 0 104 112" fill="none" aria-hidden="true" focusable="false">
          <g className={styles.upper}><path d={BRAND_IDENTITY.upper} /></g>
          <g className={styles.lower}><path d={BRAND_IDENTITY.lower} /></g>
          <g className={styles.trunk}><path d={BRAND_IDENTITY.trunk} /></g>
          <path className={styles.trace} d={BRAND_IDENTITY.trace} pathLength="1" />
          <path className={styles.glint} d={BRAND_IDENTITY.trace} pathLength="1" />
        </svg>
      </span>
    </span>
  );
}

export function Logo({ className, light = false, animated = false }: { className?: string; light?: boolean; animated?: boolean }) {
  return (
    <span className={`${styles.wordmark} inline-flex flex-col leading-none ${className ?? ""}`} data-animated={animated ? "true" : undefined}>
      <span
        className={`${styles.lettering} font-display text-[0.95rem] font-medium uppercase tracking-[0.3em] transition-colors duration-500 ${light ? "text-ivory" : "text-soil"}`}
        style={light ? { textShadow: "0 1px 10px rgba(20,17,14,0.7)" } : undefined}
      >
        {site.name}
      </span>
    </span>
  );
}
