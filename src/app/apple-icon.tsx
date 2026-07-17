import { ImageResponse } from "next/og";

export const size = { width: 180, height: 180 };
export const contentType = "image/png";

const dots = [
  { color: "#A65F46", top: "10px", left: "68px" }, // earth
  { color: "#31485A", top: "56px", left: "124px" }, // water
  { color: "#C9953D", top: "124px", left: "100px" }, // fire
  { color: "#79816D", top: "124px", left: "34px" }, // air
  { color: "#27221E", top: "56px", left: "10px" }, // space
];

export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          position: "relative",
          background: "#F4EFE6",
        }}
      >
        {dots.map((d) => (
          <div
            key={d.color}
            style={{
              position: "absolute",
              top: d.top,
              left: d.left,
              width: 56,
              height: 56,
              borderRadius: "50%",
              background: d.color,
            }}
          />
        ))}
        <div
          style={{
            position: "absolute",
            top: "74px",
            left: "74px",
            width: 32,
            height: 32,
            borderRadius: "50%",
            background: "#27221E",
          }}
        />
      </div>
    ),
    { ...size }
  );
}
