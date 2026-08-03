import { ImageResponse } from "next/og";
import { TATVA_CONTOURS, TATVA_MARK_COLORS } from "@/lib/brandMark";

export const size = { width: 32, height: 32 };
export const contentType = "image/png";

export default function Icon() {
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
          borderRadius: 9,
        }}
      >
        <svg width="28" height="28" viewBox="0 0 100 100" fill="none">
          {TATVA_CONTOURS.map((path, index) => (
            <path
              key={path}
              d={path}
              fill="none"
              stroke={index === 0 ? TATVA_MARK_COLORS[0] : "#F4EFE6"}
              strokeOpacity={index === 0 ? 0.95 : 0.42 + index * 0.16}
              strokeWidth={index === 0 ? 5.4 : 4.8}
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          ))}
          <circle cx="50" cy="57" r="7.2" fill={TATVA_MARK_COLORS[4]} />
        </svg>
      </div>
    ),
    { ...size },
  );
}
