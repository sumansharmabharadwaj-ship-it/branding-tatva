import { ImageResponse } from "next/og";

export const size = { width: 32, height: 32 };
export const contentType = "image/png";

// Adapted from Logo.tsx's LogoMark — its own comment says this exists
// specifically for the favicon, where the convergence point reads
// clearly at small size. The petals there are tuned for a 32px header
// mark; at a real 16x16 browser-tab favicon the same thin, needle-like
// shape reads as a blurry smudge rather than a mark, so these are
// widened and lengthened to hold up at that size.
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
