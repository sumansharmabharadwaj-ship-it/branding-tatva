import type { MetadataRoute } from "next";
import { site } from "@/data/site";

const INDEXABLE_DEPLOYMENT = process.env.VERCEL_ENV === "production";

export default function robots(): MetadataRoute.Robots {
  if (!INDEXABLE_DEPLOYMENT) {
    return {
      rules: { userAgent: "*", disallow: "/" },
    };
  }

  return {
    rules: { userAgent: "*", allow: "/" },
    sitemap: `${site.url}/sitemap.xml`,
  };
}
