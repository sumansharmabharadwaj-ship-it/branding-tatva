import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Responsive QA",
  robots: { index: false, follow: false },
};

const PRESETS = {
  desktop: { label: "Desktop wide", width: 1440, height: 900 },
  laptop: { label: "Short laptop", width: 1280, height: 720 },
  tablet: { label: "Tablet portrait", width: 768, height: 820 },
  mobile: { label: "Mobile portrait", width: 390, height: 844 },
  narrow: { label: "Narrow phone", width: 320, height: 720 },
  tall: { label: "Tall phone", width: 430, height: 932 },
  zoom200: { label: "200% zoom equivalent", width: 674, height: 468 },
  zoom400: { label: "400% zoom equivalent", width: 337, height: 234 },
} as const;

const ROOT_ROUTES = new Set([
  "/",
  "/about",
  "/services",
  "/insights",
  "/contact",
  "/blog",
  "/glossary",
  "/editorial-policy",
  "/privacy",
  "/terms",
]);

const DYNAMIC_ROUTE_PREFIXES = ["/blog/", "/glossary/", "/insights/", "/work/"];

function responsiveRoute(requestedPath?: string) {
  const path = requestedPath?.trim();
  if (!path || !/^\/(?!\/)[a-z0-9/_-]*$/i.test(path)) return "/";
  if (ROOT_ROUTES.has(path) || DYNAMIC_ROUTE_PREFIXES.some((prefix) => path.startsWith(prefix))) return path;
  return "/";
}

type PresetName = keyof typeof PRESETS;

export default async function HomepageResponsiveQa({
  searchParams,
}: {
  searchParams: Promise<{ preset?: string; path?: string }>;
}) {
  const params = await searchParams;
  const requested = params.preset;
  const presetName: PresetName =
    requested && requested in PRESETS ? (requested as PresetName) : "mobile";
  const preset = PRESETS[presetName];
  const route = responsiveRoute(params.path);
  const frameSrc = `${route}${route.includes("?") ? "&" : "?"}qa-responsive=1`;

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
          Internal responsive QA · {route} · {preset.label} · {preset.width} × {preset.height}
        </p>
      </header>
      <div
        style={{
          width: `${preset.width}px`,
          maxWidth: preset.width <= 768 ? "100%" : "none",
          height: `${preset.height}px`,
          boxSizing: "content-box",
          overflow: "hidden",
          border: "1px solid rgba(244,239,230,.45)",
          background: "#eee7db",
          boxShadow: "0 24px 70px rgba(0,0,0,.38)",
        }}
      >
        <iframe
          title={`Branding Tatva ${route} at ${preset.label}`}
          src={frameSrc}
          style={{ display: "block", width: "100%", height: "100%", border: 0 }}
        />
      </div>
    </main>
  );
}
