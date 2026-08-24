import type { MetadataRoute } from "next";
import { brandStudies } from "@/data/brandStudies";
import { allTerms } from "@/data/glossary";
import { insightPosts, insightTopics } from "@/data/insightLibrary";
import { projects } from "@/data/projects";
import { site } from "@/data/site";

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
    },
    {
      url: `${site.url}/about`,
      lastModified: SITE_LAST_UPDATED,
      changeFrequency: "monthly",
      priority: 0.7,
    },
    {
      url: `${site.url}/services`,
      lastModified: SITE_LAST_UPDATED,
      changeFrequency: "monthly",
      priority: 0.9,
    },
    {
      url: `${site.url}/insights`,
      lastModified: SITE_LAST_UPDATED,
      changeFrequency: "weekly",
      priority: 0.9,
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

  const workRoutes: MetadataRoute.Sitemap = projects.map((project) => ({
    url: `${site.url}/work/${project.slug}`,
    lastModified: SITE_LAST_UPDATED,
    changeFrequency: "monthly",
    priority: 0.7,
  }));

  const studyRoutes: MetadataRoute.Sitemap = brandStudies.map((study) => ({
    url: `${site.url}/work/studies/${study.slug}`,
    lastModified: new Date("2026-08-02"),
    changeFrequency: "monthly",
    priority: 0.7,
  }));

  const insightRoutes: MetadataRoute.Sitemap = insightPosts.map((post) => ({
    url: `${site.url}/insights/${post.slug}`,
    lastModified: new Date(`${post.updatedAt}T00:00:00Z`),
    changeFrequency: "monthly",
    priority: post.featured ? 0.8 : 0.7,
  }));

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
