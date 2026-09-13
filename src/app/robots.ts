import type { MetadataRoute } from "next";
import { site } from "@/data/site";
import { searchCrawlerRules } from "@/lib/searchVisibility";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: searchCrawlerRules(),
    sitemap: `${site.url}/sitemap.xml`,
    host: site.url,
  };
}
