import type { InsightPost } from "@/data/insights";
import type { CaseStudyPresentation } from "@/data/caseStudyPresentation";
import type { Project } from "@/data/projects";
import type { WorkTaxonomyRecord } from "@/data/workTaxonomy";
import { site } from "@/data/site";

export type SearchImage = {
  url: string;
  title: string;
  alt: string;
  caption: string;
  creditText: string;
};

function absoluteMediaUrl(path: string) {
  return path.startsWith("http") ? path : `${site.url}${path}`;
}

export function getCaseStudySearchMedia(
  project: Project,
  taxonomy: WorkTaxonomyRecord,
  presentation: CaseStudyPresentation,
): SearchImage {
  const transformation = `${presentation.transformation.from} to ${presentation.transformation.to}`;

  return {
    url: absoluteMediaUrl(taxonomy.evidencePoster),
    title: `${project.title} ${taxonomy.evidenceLabel} evidence`,
    alt: `${project.title} ${taxonomy.evidenceLabel.toLowerCase()} diagram showing the recorded change from ${transformation}.`,
    caption: `Editorial evidence diagram based on the recorded project. ${presentation.resultSummary}`,
    creditText: `${site.name} editorial evidence diagram`,
  };
}

export function getInsightSearchMedia(post: InsightPost): SearchImage {
  return {
    url: absoluteMediaUrl(post.heroImage),
    title: `${post.title} editorial image`,
    alt: post.heroImageAlt,
    caption: post.heroImageAlt,
    creditText: `${site.name} editorial image`,
  };
}

// Only one representative image is exposed per core route. The moving
// landscape films on these pages remain atmospheric layers rather than
// searchable video claims.
export const CORE_ROUTE_SEARCH_IMAGES: Record<string, string> = {
  "": absoluteMediaUrl("/images/hero-forest-sanctuary-poster.jpg"),
  "/about": absoluteMediaUrl("/images/own-portrait.jpg"),
  "/services": absoluteMediaUrl("/images/generated/bt-services-hero-root-system-poster.jpg"),
  "/insights": absoluteMediaUrl("/images/generated/bt-insights-foundation-folio-poster.jpg"),
  "/contact": absoluteMediaUrl("/images/generated/bt-contact-three-paths-waterpaper-poster.jpg"),
};
