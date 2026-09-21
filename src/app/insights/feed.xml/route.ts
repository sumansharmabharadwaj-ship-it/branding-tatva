import { insightPosts } from "@/data/insights";
import { site } from "@/data/site";

function escapeXml(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&apos;");
}

export function GET() {
  const posts = [...insightPosts].sort(
    (a, b) =>
      new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
  );
  const latest = posts[0]?.updatedAt ?? "2026-08-06";

  const items = posts
    .map(
      (post) => `
      <item>
        <title>${escapeXml(post.title)}</title>
        <link>${site.url}/insights/${post.slug}</link>
        <guid isPermaLink="true">${site.url}/insights/${post.slug}</guid>
        <description>${escapeXml(post.excerpt)}</description>
        <pubDate>${new Date(`${post.publishedAt}T00:00:00Z`).toUTCString()}</pubDate>
        <category>${escapeXml(post.topicSlug)}</category>
      </item>`
    )
    .join("");

  const feed = `<?xml version="1.0" encoding="UTF-8" ?>
    <rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
      <channel>
        <title>Branding Tatva Insights</title>
        <link>${site.url}/insights</link>
        <description>Essays and practical frameworks on brand positioning, messaging, customer experience, distinctiveness, recognition, and memory.</description>
        <language>en</language>
        <lastBuildDate>${new Date(`${latest}T00:00:00Z`).toUTCString()}</lastBuildDate>
        <atom:link href="${site.url}/insights/feed.xml" rel="self" type="application/rss+xml" />
        ${items}
      </channel>
    </rss>`;

  return new Response(feed.trim(), {
    headers: {
      "Content-Type": "application/rss+xml; charset=utf-8",
      "Cache-Control": "public, max-age=3600, s-maxage=3600",
    },
  });
}
