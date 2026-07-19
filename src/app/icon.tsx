import { ImageResponse } from "next/og";

export const size = { width: 32, height: 32 };
export const contentType = "image/png";

// Adapted from Logo.tsx's LogoMark — five bars in the five element
// colors, rising and settling like a skyline. Replaces an earlier
// five-petal design that, at a real 16x16 browser-tab size, read as a
// radiating star rather than a brand mark.
const bars = [
  { color: "#B85A34", x: 14, height: 34 },
  { color: "#24394D", x: 30, height: 48 },
  { color: "#C28A28", x: 46, height: 64 },
  { color: "#5C6B4A", x: 62, height: 48 },
  { color: "#27221E", x: 78, height: 34 },
];
const BASELINE = 78;

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          background: "#F4EFE6",
          borderRadius: "50%",
        }}
      >
        <svg width="32" height="32" viewBox="0 0 100 100">
          {bars.map((b) => (
            <rect
              key={b.x}
              x={b.x}
              y={BASELINE - b.height}
              width={10}
              height={b.height}
              rx={5}
              fill={b.color}
            />
          ))}
        </svg>
      </div>
    ),
    { ...size }
  );
}
