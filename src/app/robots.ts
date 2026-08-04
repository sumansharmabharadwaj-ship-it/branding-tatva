import type { MetadataRoute } from "next";
import { site } from "@/data/site";

// Two changes over the previous bare wildcard.
//
// First, /api/ is disallowed. The newsletter endpoint is the only route
// under it, it accepts POST alone, and it has no business appearing in
// an index.
//
// Second, the answer engines are named explicitly and allowed. A bare
// wildcard already permits them, so this changes no access; what it
// changes is that the permission is now a recorded decision rather than
// a default nobody chose. That matters because the opposite decision is
// entirely reasonable for some businesses, and a future reader should
// see that this one was deliberate.
//
// The decision itself: this practice publishes teaching content, a
// glossary and brand studies specifically so people find it when they
// are trying to understand branding. Being quoted by an answer engine
// with attribution serves that, so these crawlers are welcome. To
// reverse it, change `allow` to `disallow` for the AI group below.
const AI_CRAWLERS = [
  "GPTBot",
  "OAI-SearchBot",
  "ChatGPT-User",
  "ClaudeBot",
  "Claude-User",
  "PerplexityBot",
  "Google-Extended",
  "CCBot",
  "Applebot-Extended",
];

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      { userAgent: "*", allow: "/", disallow: "/api/" },
      { userAgent: AI_CRAWLERS, allow: "/", disallow: "/api/" },
    ],
    sitemap: `${site.url}/sitemap.xml`,
    host: site.url,
  };
}
