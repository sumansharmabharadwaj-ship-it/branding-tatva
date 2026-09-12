import { ImageResponse } from "next/og";
import { BRAND_IDENTITY as brand } from "@/lib/brandIdentity";

export const size = { width: 64, height: 64 };
export const contentType = "image/png";

// A high contrast, font independent silhouette stays recognisable at 16px.
export default function Icon() {
  return new ImageResponse(
    <div style={{ display: "flex", width: "100%", height: "100%", background: brand.ink, borderRadius: 15, alignItems: "center", justifyContent: "center" }}>
      <svg width="56" height="56" viewBox="0 0 104 112">
        <path d={brand.upper} fill={brand.cream} />
        <path d={brand.lower} fill={brand.cream} />
        <path d={brand.trunk} fill={brand.sand} />
      </svg>
    </div>,
    size,
  );
}
