import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Homepage responsive QA",
  robots: { index: false, follow: false },
};

const PRESETS = {
  tablet: { label: "Tablet portrait", width: 768, height: 820 },
  mobile: { label: "Mobile portrait", width: 390, height: 844 },
  zoom200: { label: "200% zoom equivalent", width: 674, height: 468 },\n  zoom400: { label: "400% zoom equivalent", width: 337, height: 234 },
} as const;

type PresetName = keyof typeof PRESETS;

export default async function HomepageResponsiveQa({
  searchParams,
}: {
  searchParams: Promise<{ preset?: string }>;
}) {
  const requested = (await searchParams).preset;
  const presetName: PresetName =
    requested && requested in PRESETS ? (requested as PresetName) : "mobile";
  const preset = PRESETS[presetName];

  return (
    <main
      style={{
        minHeight: "100vh",
        padding: "24px",
        background: "#111812",
        color: "#f4efe6",
        fontFamily: "system-ui, sans-serif",
      }}
    >
      <header style={{ marginBottom: "18px" }}>
        <p style={{ margin: 0, fontSize: "12px", letterSpacing: "0.12em", textTransform: "uppercase" }}>
          Internal responsive QA · {preset.label} · {preset.width} × {preset.height}
        </p>
      </header>
      <div
        style={{
          width: `${preset.width}px`,
          maxWidth: "100%",
          height: `${preset.height}px`,
          overflow: "hidden",
          border: "1px solid rgba(244,239,230,.45)",
          background: "#eee7db",
          boxShadow: "0 24px 70px rgba(0,0,0,.38)",
        }}
      >
        <iframe
          title={`Branding Tatva homepage at ${preset.label}`}
          src="/?qa-responsive=1"
          style={{ display: "block", width: "100%", height: "100%", border: 0 }}
        />
      </div>
    </main>
  );
}
