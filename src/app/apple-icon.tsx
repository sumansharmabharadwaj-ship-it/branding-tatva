import { ImageResponse } from "next/og";
import { TATVA_CONTOURS, TATVA_MARK_COLORS } from "@/lib/brandMark";

export const size = { width: 180, height: 180 };
export const contentType = "image/png";

export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#142018",
        }}
      >
        <div
          style={{
            width: 146,
            height: 146,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            borderRadius: 42,
            background: "radial-gradient(circle at 50% 38%, rgba(198,169,122,.17), transparent 48%)",
            border: "1px solid rgba(244,239,230,.12)",
          }}
        >
          <svg width="118" height="118" viewBox="0 0 100 100" fill="none">
            {TATVA_CONTOURS.map((path, index) => (
              <path
                key={path}
                d={path}
                fill="none"
                stroke={TATVA_MARK_COLORS[index]}
                strokeWidth={index === 0 ? 4.4 : 3.8}
                strokeLinecap="round"
                strokeLinejoin="round"
                opacity={0.96}
              />
            ))}
            <circle cx="50" cy="57" r="6" fill={TATVA_MARK_COLORS[4]} />
          </svg>
        </div>
      </div>
    ),
    { ...size },
  );
}
