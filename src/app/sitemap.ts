import type { MetadataRoute } from "next";
import { brandStudies } from "@/data/brandStudies";
import { allTerms } from "@/data/glossary";
import { insightPosts, insightTopics } from "@/data/insightLibrary";
import { projects } from "@/data/projects";
import { getCaseStudyPresentation } from "@/data/caseStudyPresentation";
import {
  CORE_ROUTE_SEARCH_IMAGES,
  getCaseStudySearchMedia,
  getInsightSearchMedia,
} from "@/data/searchMedia";
import { site } from "@/data/site";
import { getWorkTaxonomy } from "@/data/workTaxonomy";

// Static routes do not carry a trustworthy per-page edit history in the
// repository. Keep one explicit release date rather than telling crawlers
// that every page changed at request time.
const SITE_LAST_UPDATED = new Date("2026-08-07");

export default function sitemap(): MetadataRoute.Sitemap {
  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: site.url,
      lastModified: SITE_LAST_UPDATED,
      changeFrequency: "weekly",
      priority: 1,
      images: [CORE_ROUTE_SEARCH_IMAGES[""]],
    },
    {
      url: `${site.url}/about`,
      lastModified: SITE_LAST_UPDATED,
      changeFrequency: "monthly",
      priority: 0.7,
      images: [CORE_ROUTE_SEARCH_IMAGES["/about"]],
    },
    {
      url: `${site.url}/services`,
      lastModified: SITE_LAST_UPDATED,
      changeFrequency: "monthly",
      priority: 0.9,
      images: [CORE_ROUTE_SEARCH_IMAGES["/services"]],
    },
    {
      url: `${site.url}/insights`,
      lastModified: SITE_LAST_UPDATED,
      changeFrequency: "weekly",
      priority: 0.9,
      images: [CORE_ROUTE_SEARCH_IMAGES["/insights"]],
    },
    {
      url: `${site.url}/glossary`,
      lastModified: SITE_LAST_UPDATED,
      changeFrequency: "monthly",
      priority: 0.6,
    },
    {
      url: `${site.url}/contact`,
      lastModified: SITE_LAST_UPDATED,
      changeFrequency: "yearly",
      priority: 0.8,
      images: [CORE_ROUTE_SEARCH_IMAGES["/contact"]],
    },
    {
      url: `${site.url}/editorial-policy`,
      lastModified: new Date("2026-08-24"),
      changeFrequency: "yearly",
      priority: 0.5,
    },
    {
      url: `${site.url}/privacy`,
      lastModified: SITE_LAST_UPDATED,
      changeFrequency: "yearly",
      priority: 0.2,
    },
    {
      url: `${site.url}/terms`,
      lastModified: SITE_LAST_UPDATED,
      changeFrequency: "yearly",
      priority: 0.2,
    },
  ];

  const workRoutes: MetadataRoute.Sitemap = projects.map((project) => {
    const media = getCaseStudySearchMedia(
      project,
      getWorkTaxonomy(project.slug),
      getCaseStudyPresentation(project.slug),
    );

    return {
      url: `${site.url}/work/${project.slug}`,
      lastModified: SITE_LAST_UPDATED,
      changeFrequency: "monthly",
      priority: 0.7,
      images: [media.url],
    };
  });

  const studyRoutes: MetadataRoute.Sitemap = brandStudies.map((study) => ({
    url: `${site.url}/work/studies/${study.slug}`,
    lastModified: new Date("2026-08-02"),
    changeFrequency: "monthly",
    priority: 0.7,
  }));

  const insightRoutes: MetadataRoute.Sitemap = insightPosts.map((post) => {
    const media = getInsightSearchMedia(post);

    return {
      url: `${site.url}/insights/${post.slug}`,
      lastModified: new Date(`${post.updatedAt}T00:00:00Z`),
      changeFrequency: "monthly",
      priority: post.featured ? 0.8 : 0.7,
      images: [media.url],
    };
  });

  const topicRoutes: MetadataRoute.Sitemap = insightTopics.map((topic) => ({
    url: `${site.url}/insights/topic/${topic.slug}`,
    lastModified: SITE_LAST_UPDATED,
    changeFrequency: "monthly",
    priority: 0.65,
  }));

  const glossaryRoutes: MetadataRoute.Sitemap = allTerms.map((term) => ({
    url: `${site.url}/glossary/${term.slug}`,
    lastModified: new Date("2026-08-03"),
    changeFrequency: "monthly",
    priority: 0.5,
  }));

  return [
    ...staticRoutes,
    ...workRoutes,
    ...studyRoutes,
    ...topicRoutes,
    ...insightRoutes,
    ...glossaryRoutes,
  ];
}
