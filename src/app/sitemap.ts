import type { MetadataRoute } from "next";
import { brandStudies } from "@/data/brandStudies";
import { allTerms } from "@/data/glossary";
import { insightPosts, insightTopics } from "@/data/insightLibrary";
import { projects } from "@/data/projects";
import { site } from "@/data/site";

const SITE_LAST_UPDATED = new Date("2026-08-06");

export default function sitemap(): MetadataRoute.Sitemap {
  const staticRoutes: MetadataRoute.Sitemap = [
    { url: site.url, lastModified: SITE_LAST_UPDATED, changeFrequency: "weekly", priority: 1 },
    { url: `${site.url}/about`, lastModified: SITE_LAST_UPDATED, changeFrequency: "monthly", priority: 0.7 },
    { url: `${site.url}/services`, lastModified: SITE_LAST_UPDATED, changeFrequency: "monthly", priority: 0.9 },
    { url: `${site.url}/work`, lastModified: SITE_LAST_UPDATED, changeFrequency: "weekly", priority: 0.9 },
    { url: `${site.url}/insights`, lastModified: SITE_LAST_UPDATED, changeFrequency: "weekly", priority: 0.9 },
    { url: `${site.url}/glossary`, lastModified: SITE_LAST_UPDATED, changeFrequency: "monthly", priority: 0.6 },
    { url: `${site.url}/contact`, lastModified: SITE_LAST_UPDATED, changeFrequency: "yearly", priority: 0.8 },
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

  const topicRoutes: MetadataRoute.Sitemap = insightTopics.map((topic) => ({
    url: `${site.url}/insights/topic/${topic.slug}`,
    lastModified: SITE_LAST_UPDATED,
    changeFrequency: "monthly",
    priority: 0.65,
  }));

  const insightRoutes: MetadataRoute.Sitemap = insightPosts.map((post) => ({
    url: `${site.url}/insights/${post.slug}`,
    lastModified: new Date(post.updatedAt),
    changeFrequency: "monthly",
    priority: post.featured ? 0.8 : 0.7,
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
