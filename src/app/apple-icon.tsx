import { ImageResponse } from "next/og";

export const size = { width: 180, height: 180 };
export const contentType = "image/png";

// Same LogoMark petal design as icon.tsx, scaled up — see that file's
// comment for why this replaced the old five-dot pattern.
const petals = [
  { color: "#B85A34", rotate: 0 },
  { color: "#24394D", rotate: 72 },
  { color: "#C28A28", rotate: 144 },
  { color: "#5C6B4A", rotate: 216 },
  { color: "#27221E", rotate: 288 },
];

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
          {petals.map((p) => (
            <path
              key={p.rotate}
              d="M50 50 C 31 33, 31 17, 50 4 C 69 17, 69 33, 50 50 Z"
              fill={p.color}
              transform={`rotate(${p.rotate} 50 50)`}
            />
          ))}
        </svg>
      </div>
    ),
    { ...size }
  );
}
