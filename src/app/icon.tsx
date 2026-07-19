import { ImageResponse } from "next/og";

export const size = { width: 32, height: 32 };
export const contentType = "image/png";

// The five-petal mark from Logo.tsx's LogoMark — its own comment says
// this exists specifically for the favicon, where the convergence point
// reads clearly at small size. icon.tsx previously used an unrelated
// five-dot pattern instead of this mark; this replaces it with the
// actual documented design.
const petals = [
  { color: "#B85A34", rotate: 0 },
  { color: "#24394D", rotate: 72 },
  { color: "#C28A28", rotate: 144 },
  { color: "#5C6B4A", rotate: 216 },
  { color: "#27221E", rotate: 288 },
];

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
          {petals.map((p) => (
            <path
              key={p.rotate}
              d="M50 50 C 43.5 36, 43.5 20, 50 9 C 56.5 20, 56.5 36, 50 50 Z"
              fill={p.color}
              opacity={0.92}
              transform={`rotate(${p.rotate} 50 50)`}
            />
          ))}
        </svg>
      </div>
    ),
    { ...size }
  );
}
