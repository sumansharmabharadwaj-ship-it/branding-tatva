import { blogPosts } from "@/data/blog";
import { site } from "@/data/site";

export const dynamic = "force-static";

function escapeXml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

function absoluteUrl(pathname: string) {
  return new URL(pathname, site.url).toString();
}

export function GET() {
  const posts = [...blogPosts].sort(
    (a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime(),
  );
  const feedUrl = absoluteUrl("/insights/rss.xml");
  const insightsUrl = absoluteUrl("/insights");
  const latestDate = posts[0]?.publishedAt
    ? new Date(posts[0].publishedAt).toUTCString()
    : new Date().toUTCString();

  const items = posts
    .map((post) => {
      const articleUrl = absoluteUrl(`/insights/${post.slug}`);
      return [
        "<item>",
        `<title>${escapeXml(post.title)}</title>`,
        `<link>${escapeXml(articleUrl)}</link>`,
        `<guid isPermaLink="true">${escapeXml(articleUrl)}</guid>`,
        `<pubDate>${new Date(post.publishedAt).toUTCString()}</pubDate>`,
        `<description>${escapeXml(post.excerpt)}</description>`,
        `<category>${escapeXml(post.element)}</category>`,
        `<author>${escapeXml(`${site.email} (${site.founder})`)}</author>`,
        "</item>",
      ].join("");
    })
    .join("");

  const xml = [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">',
    "<channel>",
    `<title>${escapeXml(`${site.name} Insights`)}</title>`,
    `<link>${escapeXml(insightsUrl)}</link>`,
    `<description>${escapeXml(
      "Writing on brand positioning, recognition, verbal identity, brand psychology, and the decisions beneath memorable brands.",
    )}</description>`,
    "<language>en</language>",
    `<lastBuildDate>${latestDate}</lastBuildDate>`,
    `<atom:link href="${escapeXml(feedUrl)}" rel="self" type="application/rss+xml" />`,
    items,
    "</channel>",
    "</rss>",
  ].join("");

  return new Response(xml, {
    headers: {
      "Content-Type": "application/rss+xml; charset=utf-8",
      "Cache-Control": "public, max-age=0, s-maxage=3600, stale-while-revalidate=86400",
    },
  });
}
