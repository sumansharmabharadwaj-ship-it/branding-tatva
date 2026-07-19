// Shared visual for opengraph-image.tsx and twitter-image.tsx. Generated
// with satori (via next/og), which only supports flex layout — every
// node with more than one child needs an explicit display: flex, even
// short-lived wrapper rows.

export function OgCard() {
  return (
    <div
      style={{
        height: "100%",
        width: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        backgroundColor: "#27221E",
        padding: "80px",
        fontFamily: "Georgia, serif",
      }}
    >
      <div
        style={{
          display: "flex",
          fontSize: 28,
          letterSpacing: 6,
          textTransform: "uppercase",
          color: "#C9BBA8",
        }}
      >
        Branding Tatva
      </div>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          fontSize: 62,
          lineHeight: 1.25,
          color: "#F4EFE6",
          maxWidth: 980,
        }}
      >
        <div style={{ display: "flex" }}>Most brands are visible.</div>
        <div style={{ display: "flex" }}>
          <span style={{ marginRight: 18 }}>Very few are</span>
          <span style={{ color: "#CD7A4C", fontStyle: "italic" }}>remembered.</span>
        </div>
      </div>
      <div style={{ display: "flex", fontSize: 24, color: "#C9BBA8" }}>
        Brand strategy by Suman Sharma
      </div>
    </div>
  );
}
