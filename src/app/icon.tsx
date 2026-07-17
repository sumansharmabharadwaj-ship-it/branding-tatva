import { ImageResponse } from "next/og";

export const size = { width: 32, height: 32 };
export const contentType = "image/png";

const dots = [
  { color: "#A65F46", top: "2px", left: "12px" }, // earth
  { color: "#31485A", top: "10px", left: "22px" }, // water
  { color: "#C9953D", top: "22px", left: "18px" }, // fire
  { color: "#79816D", top: "22px", left: "6px" }, // air
  { color: "#27221E", top: "10px", left: "2px" }, // space
];

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          position: "relative",
          background: "#F4EFE6",
          borderRadius: "50%",
        }}
      >
        {dots.map((d) => (
          <div
            key={d.color}
            style={{
              position: "absolute",
              top: d.top,
              left: d.left,
              width: 10,
              height: 10,
              borderRadius: "50%",
              background: d.color,
            }}
          />
        ))}
        <div
          style={{
            position: "absolute",
            top: "13px",
            left: "13px",
            width: 6,
            height: 6,
            borderRadius: "50%",
            background: "#27221E",
          }}
        />
      </div>
    ),
    { ...size }
  );
}
