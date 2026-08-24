import type { Metadata, MetadataRoute } from "next";

/*
 * Search visibility has one release switch: only a Vercel production
 * deployment may be indexed. Every local build, branch preview and protected
 * review alias stays out of search even when a child page supplies its own
 * metadata. Keeping this in one helper prevents an Article page from
 * accidentally replacing the root noindex contract with index: true.
 */
export const isPublicProduction = process.env.VERCEL_ENV === "production";

export function searchRobotsMetadata(): Metadata["robots"] {
  return {
    index: isPublicProduction,
    follow: isPublicProduction,
    googleBot: {
      index: isPublicProduction,
      follow: isPublicProduction,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  };
}

export function searchCrawlerRules(): MetadataRoute.Robots["rules"] {
  if (!isPublicProduction) {
    return { userAgent: "*", disallow: "/" };
  }

  return [
    {
      userAgent: ["Googlebot", "Bingbot", "OAI-SearchBot", "ChatGPT-User"],
      allow: "/",
    },
    { userAgent: "*", allow: "/" },
  ];
}
