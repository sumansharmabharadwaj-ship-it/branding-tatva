import { ImageResponse } from "next/og";

export const size = { width: 180, height: 180 };
export const contentType = "image/png";

// Same LogoMark five-bar design as icon.tsx, scaled up — see that
// file's comment for why this replaced the old five-petal pattern.
const bars = [
  { color: "#B85A34", x: 14, height: 34 },
  { color: "#24394D", x: 30, height: 48 },
  { color: "#C28A28", x: 46, height: 64 },
  { color: "#5C6B4A", x: 62, height: 48 },
  { color: "#27221E", x: 78, height: 34 },
];
const BASELINE = 78;

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
          background: "#F4EFE6",
        }}
      >
        <svg width="140" height="140" viewBox="0 0 100 100">
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
