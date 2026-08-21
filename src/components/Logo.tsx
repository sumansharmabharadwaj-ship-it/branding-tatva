import Image from "next/image";
import { site } from "@/data/site";

export function LogoMark({
  size = 32,
  className,
  priority = false,
}: {
  size?: number;
  className?: string;
  priority?: boolean;
}) {
  return (
    <Image
      src="/images/branding-tatva-tatva-mark.png"
      alt={`${site.name} mountain, river and roots mark`}
      width={size}
      height={size}
      className={className}
      sizes={`${size}px`}
      priority={priority}
    />
  );
}

export function Logo({ className, light = false }: { className?: string; light?: boolean }) {
  return (
    <span className={`inline-flex items-center leading-none ${className ?? ""}`}>
      <span
        className={`whitespace-nowrap font-display text-[0.78rem] font-medium uppercase tracking-[0.3em] transition-colors duration-500 sm:text-[0.86rem] ${light ? "text-ivory" : "text-soil"}`}
        style={light ? { textShadow: "0 1px 10px rgba(20,17,14,0.7)" } : undefined}
      >
        Branding Tatva
      </span>
    </span>
  );
}
