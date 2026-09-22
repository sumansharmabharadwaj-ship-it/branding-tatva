import { ImageResponse } from "next/og";
import { projects } from "@/data/projects";
import { getCaseStudyPresentation } from "@/data/caseStudyPresentation";
import { getWorkTaxonomy } from "@/data/workTaxonomy";
import { site } from "@/data/site";

// Render the five known project previews once at build time. The installed
// next/og renderer includes Noto Sans, so rendering needs no remote assets
// or font request. Keep the original SVG diagrams in the pages and sitemap.
export const dynamic = "force-static";
export const dynamicParams = false;

export function generateStaticParams() {
  return projects.map(({ slug }) => ({ slug }));
}

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ slug: string }> },
) {
  const { slug } = await params;
  const project = projects.find((item) => item.slug === slug);
  if (!project) return new Response(null, { status: 404 });

  const presentation = getCaseStudyPresentation(slug);
  const taxonomy = getWorkTaxonomy(slug);
  const { from, to } = presentation.transformation;

  return new ImageResponse(
    (
      <div style={{ display: "flex", flexDirection: "column", justifyContent: "space-between", width: "100%", height: "100%", padding: "52px 64px", background: "#EEE7DB", color: "#292821", fontFamily: "sans-serif" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", fontSize: 24 }}>
          <span>{site.name}</span>
          <span style={{ color: "#566247" }}>Project record</span>
        </div>

        <div style={{ display: "flex", flexDirection: "column", marginTop: 20, marginBottom: 24 }}>
          <div style={{ display: "flex", fontSize: 58, lineHeight: 1.1, letterSpacing: -2, maxWidth: 1000 }}>{project.title}</div>
          <div style={{ display: "flex", fontSize: 25, color: "#625B50", marginTop: 16 }}>{taxonomy.evidenceLabel}</div>
        </div>

        <div style={{ display: "flex", borderTop: "2px solid #C7BEAD", paddingTop: 26, paddingBottom: 24, gap: 42 }}>
          <div style={{ display: "flex", flexDirection: "column", width: 480 }}>
            <div style={{ display: "flex", fontSize: 18, color: "#625B50", marginBottom: 12 }}>STARTING POINT</div>
            <div style={{ display: "flex", fontSize: 30, lineHeight: 1.25 }}>{from}</div>
          </div>
          <div style={{ display: "flex", flexDirection: "column", width: 508, borderLeft: "4px solid #6C7756", paddingLeft: 28 }}>
            <div style={{ display: "flex", fontSize: 18, color: "#566247", marginBottom: 12 }}>STRATEGIC DIRECTION</div>
            <div style={{ display: "flex", fontSize: 30, lineHeight: 1.25 }}>{to}</div>
          </div>
        </div>

        <div style={{ display: "flex", justifyContent: "space-between", fontSize: 19, color: "#625B50" }}>
          <span>Editorial summary of the recorded work</span>
          <span>brandingtatva.com</span>
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
      // The URL stays stable when a project record changes. Avoid the
      // renderer's one-year immutable browser cache on this mutable URL.
      headers: { "Cache-Control": "public, max-age=3600, stale-while-revalidate=86400" },
    },
  );
}
