import { ImageResponse } from "next/og";
import { BRAND_IDENTITY as brand } from "@/lib/brandIdentity";

export const size = { width: 180, height: 180 };
export const contentType = "image/png";

export default function AppleIcon() {
  return new ImageResponse(
    <div style={{ display: "flex", width: "100%", height: "100%", background: brand.ink, alignItems: "center", justifyContent: "center" }}>
      <svg width="144" height="144" viewBox={brand.iconViewBox}>
        <path d={brand.upper} fill={brand.cream} />
        <path d={brand.lower} fill={brand.cream} />
        <path d={brand.trunk} fill={brand.sand} />
      </svg>
    </div>,
    size,
  );
}
