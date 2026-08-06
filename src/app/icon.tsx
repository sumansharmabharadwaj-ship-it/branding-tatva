import { ImageResponse } from "next/og";
import { monogramFont } from "@/lib/monogram-font";

export const size = { width: 32, height: 32 };
export const contentType = "image/png";

// The 2026 tab icon per Suman's brand boards: the interlocked BT
// monogram, cream on the charcoal app icon ground. At 16 to 32 pixels
// the sprig would smear, so the favicon carries the letters alone;
// apple-icon.tsx adds the sprig at its larger size.
export default async function Icon() {
  const font = await monogramFont();
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          background: "#1B1B1B",
          borderRadius: 7,
          position: "relative",
          fontFamily: "Cormorant",
        }}
      >
        <div style={{ position: "absolute", left: 4, top: 8, fontSize: 19, color: "#F2F0E8", opacity: 0.9 }}>T</div>
        <div style={{ position: "absolute", left: 11, top: 1, fontSize: 29, color: "#F2F0E8" }}>B</div>
      </div>
    ),
    {
      ...size,
      fonts: font ? [{ name: "Cormorant", data: font, style: "normal", weight: 600 }] : undefined,
    }
  );
}
