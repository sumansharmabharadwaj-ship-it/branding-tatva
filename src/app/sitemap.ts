import type { MetadataRoute } from "next";
import { site } from "@/data/site";
import { projects } from "@/data/projects";
import { blogPosts } from "@/data/blog";
import { brandStudies } from "@/data/brandStudies";

// No per-page edit-history is tracked anywhere in this codebase, so
// `new Date()` (recomputed on every single sitemap request) was
// reporting "now" as the modification date — never actually true,
// and actively misleading to a crawler. A single fixed date ("as of
// this update") is honest about what's actually known, rather than
// fabricating per-page history or leaving a meaningless moving target.
// Update this constant when static pages get a substantive content
// pass, same spirit as the blog/work pages already using their own
// real dates.
const SITE_LAST_UPDATED = new Date("2026-07-21");

export default function sitemap(): MetadataRoute.Sitemap {
  const STATIC_ROUTES: {
    route: string;
    priority: number;
    changeFrequency: NonNullable<MetadataRoute.Sitemap[number]["changeFrequency"]>;
  }[] = [
    { route: "", priority: 1.0, changeFrequency: "weekly" },
    { route: "/about", priority: 0.7, changeFrequency: "monthly" },
    { route: "/services", priority: 0.9, changeFrequency: "monthly" },
    { route: "/work", priority: 0.9, changeFrequency: "weekly" },
    { route: "/blog", priority: 0.8, changeFrequency: "weekly" },
    { route: "/contact", priority: 0.8, changeFrequency: "yearly" },
    { route: "/privacy", priority: 0.2, changeFrequency: "yearly" },
    { route: "/terms", priority: 0.2, changeFrequency: "yearly" },
  ];
  const staticRoutes = STATIC_ROUTES.map(({ route, priority, changeFrequency }) => ({
    url: `${site.url}${route}`,
    lastModified: SITE_LAST_UPDATED,
    changeFrequency,
    priority,
  }));

  const studyRoutes = brandStudies.map((s) => ({
    url: `${site.url}/work/studies/${s.slug}`,
    lastModified: new Date("2026-08-02"),
    changeFrequency: "monthly" as const,
    priority: 0.7,
  }));

  const workRoutes = projects.map((p) => ({
    url: `${site.url}/work/${p.slug}`,
    lastModified: SITE_LAST_UPDATED,
    changeFrequency: "monthly" as const,
    priority: 0.7,
  }));

  const blogRoutes = blogPosts.map((p) => ({
    url: `${site.url}/blog/${p.slug}`,
    lastModified: new Date(p.publishedAt),
    changeFrequency: "yearly" as const,
    priority: 0.6,
  }));

  return [...staticRoutes, ...workRoutes, ...blogRoutes , ...studyRoutes];
}
