import { ImageResponse } from "next/og";
import { monogramFont } from "@/lib/monogram-font";

export const size = { width: 180, height: 180 };
export const contentType = "image/png";

// The 2026 app icon per Suman's brand boards: the interlocked BT
// monogram with its botanical sprig, cream and sand on the charcoal
// ground. Same composition as Logo.tsx's LogoMark, rebuilt inline for
// the ImageResponse renderer.
export default async function AppleIcon() {
  const font = await monogramFont();
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          background: "#1B1B1B",
          borderRadius: 36,
          position: "relative",
          fontFamily: "Cormorant",
        }}
      >
        <svg
          viewBox="0 0 40 100"
          style={{ position: "absolute", left: 22, top: 30, width: 46, height: 120 }}
        >
          <path
            d="M30 96 Q14 68 12 44 Q11 26 20 6"
            stroke="#C6A97A"
            strokeWidth="1.6"
            strokeLinecap="round"
            fill="none"
          />
          <path d="M13 40 Q2 34 1 24 Q12 26 15 36 Z" fill="#C6A97A" opacity="0.9" />
          <path d="M13 52 Q24 46 27 36 Q15 38 12 48 Z" fill="#C6A97A" opacity="0.75" />
          <path d="M14 62 Q3 58 1 48 Q12 50 16 58 Z" fill="#C6A97A" opacity="0.85" />
          <path d="M17 74 Q28 70 31 60 Q19 62 16 70 Z" fill="#C6A97A" opacity="0.7" />
          <path d="M21 84 Q10 82 7 73 Q18 74 22 80 Z" fill="#C6A97A" opacity="0.8" />
          <path d="M19 14 Q28 8 34 10 Q28 18 20 20 Z" fill="#C6A97A" opacity="0.85" />
        </svg>
        <div style={{ position: "absolute", left: 44, top: 58, fontSize: 96, color: "#F2F0E8", opacity: 0.9 }}>T</div>
        <div style={{ position: "absolute", left: 76, top: 22, fontSize: 148, color: "#F2F0E8" }}>B</div>
      </div>
    ),
    {
      ...size,
      fonts: font ? [{ name: "Cormorant", data: font, style: "normal", weight: 600 }] : undefined,
    }
  );
}
