const fs = require("node:fs");
const path = require("node:path");

const BASE_URL = process.env.AUDIT_BASE_URL || "http://127.0.0.1:3000";
const OUTPUT = path.join(process.cwd(), "insights-discovery-audit");
const EXPECTED_MIN_GUIDES = Number(process.env.INSIGHTS_EXPECTED_MIN || "27");
const EXPECTED_MIN_TOPICS = Number(process.env.INSIGHTS_EXPECTED_TOPICS || "5");
const RUN_STATE = {
  commit: process.env.AUDIT_COMMIT || "local",
  generatedAt: new Date().toISOString(),
  guideLinks: [],
  topicLinks: [],
  articleResults: [],
};

fs.mkdirSync(OUTPUT, { recursive: true });

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

function decodeEntities(value) {
  return value
    .replace(/&amp;/g, "&")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">");
}

function matchOne(html, pattern) {
  const match = html.match(pattern);
  return match ? decodeEntities(match[1].trim()) : "";
}

function collectLinks(html, prefix) {
  const links = [];
  const pattern = /href=["']([^"']+)["']/gi;
  let match;
  while ((match = pattern.exec(html))) {
    const href = decodeEntities(match[1]).split(/[?#]/)[0];
    if (href.startsWith(prefix)) links.push(href);
  }
  return [...new Set(links)];
}

function collectGuideLinks(html) {
  return collectLinks(html, "/insights/").filter(
    (href) => /^\/insights\/[^/]+$/.test(href) && !href.endsWith(".xml"),
  );
}

function collectTopicLinks(html) {
  return collectLinks(html, "/insights/topic/").filter(
    (href) => /^\/insights\/topic\/[^/]+$/.test(href),
  );
}

function writeFailureReport(error) {
  fs.writeFileSync(
    path.join(OUTPUT, "failure.json"),
    JSON.stringify(
      {
        ...RUN_STATE,
        failedAt: new Date().toISOString(),
        error: {
          message: error instanceof Error ? error.message : String(error),
          stack: error instanceof Error ? error.stack : undefined,
        },
      },
      null,
      2,
    ),
  );
}

async function request(pathname) {
  const response = await fetch(`${BASE_URL}${pathname}`, {
    redirect: "manual",
    headers: { "user-agent": "Branding-Tatva-Insights-Discovery-Gate/1.2" },
  });
  const text = await response.text();
  return { response, text };
}

function verifyFeed({ pathname, response, text }, guideLinks) {
  assert(response.status >= 200 && response.status < 400,
    `${pathname} returned ${response.status}`);
  const contentType = response.headers.get("content-type") || "";
  assert(/(?:application\/rss\+xml|application\/xml|text\/xml)/i.test(contentType),
    `${pathname} returned an unexpected content type: ${contentType}`);
  assert(/<rss\b/i.test(text) && /<channel>/i.test(text),
    `${pathname} is missing its RSS channel structure`);
  assert(/<atom:link[^>]+rel=["']self["'][^>]+type=["']application\/rss\+xml["']/i.test(text),
    `${pathname} is missing its self-discovery link`);
  for (const href of guideLinks) {
    assert(text.includes(href), `${pathname} is missing ${href}`);
  }
  return contentType;
}

async function auditArticle(href) {
  const { response, text } = await request(href);
  assert(response.status >= 200 && response.status < 400, `${href}: returned ${response.status}`);

  const title = matchOne(text, /<title[^>]*>([\s\S]*?)<\/title>/i);
  const description = matchOne(
    text,
    /<meta[^>]+name=["']description["'][^>]+content=["']([^"']*)["'][^>]*>/i,
  ) || matchOne(
    text,
    /<meta[^>]+content=["']([^"']*)["'][^>]+name=["']description["'][^>]*>/i,
  );
  const canonical = matchOne(
    text,
    /<link[^>]+rel=["']canonical["'][^>]+href=["']([^"']+)["'][^>]*>/i,
  ) || matchOne(
    text,
    /<link[^>]+href=["']([^"']+)["'][^>]+rel=["']canonical["'][^>]*>/i,
  );
  const h1 = matchOne(text, /<h1[^>]*>([\s\S]*?)<\/h1>/i)
    .replace(/<[^>]+>/g, " ")
    .replace(/\s+/g, " ")
    .trim();
  const jsonLd = [...text.matchAll(/<script[^>]+type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi)]
    .map((match) => match[1]);
  const internalLinks = collectLinks(text, "/");
  const hasResearchSources = /Research sources/i.test(text);
  const hasStructuredCitations = jsonLd.some((value) => /["']citation["']\s*:/i.test(value));

  assert(title.length >= 20 && title.length <= 80, `${href}: title length ${title.length} is outside 20-80`);
  assert(description.length >= 70 && description.length <= 190,
    `${href}: description length ${description.length} is outside 70-190`);
  assert(canonical.includes(href), `${href}: canonical mismatch (${canonical})`);
  assert(h1.length >= 10, `${href}: article H1 missing or too short`);
  assert(jsonLd.some((value) => /Article|BlogPosting/i.test(value)),
    `${href}: Article or BlogPosting schema missing`);
  assert(jsonLd.some((value) => /datePublished/i.test(value)), `${href}: datePublished missing from schema`);
  assert(internalLinks.some((link) => link.startsWith("/services") || link.startsWith("/work") || link === "/contact"),
    `${href}: no service, work, or contact pathway found`);
  if (hasResearchSources) {
    assert(hasStructuredCitations, `${href}: visible Research sources are missing BlogPosting.citation data`);
  } else {
    assert(!hasStructuredCitations, `${href}: citation data exists without a visible Research sources chapter`);
  }

  return {
    href,
    title,
    description,
    canonical,
    h1,
    internalLinkCount: internalLinks.length,
    hasResearchSources,
    hasStructuredCitations,
  };
}

(async () => {
  const index = await request("/insights");
  assert(index.response.status >= 200 && index.response.status < 400,
    `/insights returned ${index.response.status}`);
  const guideLinks = collectGuideLinks(index.text);
  const topicLinks = collectTopicLinks(index.text);
  RUN_STATE.guideLinks = guideLinks;
  RUN_STATE.topicLinks = topicLinks;

  assert(guideLinks.length >= EXPECTED_MIN_GUIDES,
    `Expected at least ${EXPECTED_MIN_GUIDES} guide routes, found ${guideLinks.length}`);
  assert(topicLinks.length >= EXPECTED_MIN_TOPICS,
    `Expected at least ${EXPECTED_MIN_TOPICS} topic routes, found ${topicLinks.length}`);

  const sitemap = await request("/sitemap.xml");
  assert(sitemap.response.status >= 200 && sitemap.response.status < 400,
    `/sitemap.xml returned ${sitemap.response.status}`);
  for (const href of [...guideLinks, ...topicLinks]) {
    assert(sitemap.text.includes(href), `Sitemap is missing ${href}`);
  }

  const robots = await request("/robots.txt");
  assert(robots.response.status >= 200 && robots.response.status < 400,
    `/robots.txt returned ${robots.response.status}`);
  assert(/sitemap:/i.test(robots.text), "robots.txt is missing a Sitemap directive");
  assert(!/disallow:\s*\/insights(?:\s|$)/i.test(robots.text),
    "robots.txt disallows the Insights library");

  const canonicalFeedResponse = await request("/insights/feed.xml");
  const canonicalFeedType = verifyFeed(
    { pathname: "/insights/feed.xml", ...canonicalFeedResponse },
    guideLinks,
  );
  const rssAliasResponse = await request("/insights/rss.xml");
  const rssAliasType = verifyFeed(
    { pathname: "/insights/rss.xml", ...rssAliasResponse },
    guideLinks,
  );

  const llms = await request("/llms.txt");
  assert(llms.response.status >= 200 && llms.response.status < 400,
    `/llms.txt returned ${llms.response.status}`);
  assert(/https:\/\/brandingtatva\.com\/insights(?:\)|\s|$)/i.test(llms.text),
    "llms.txt does not identify /insights as the canonical editorial library");
  assert(/https:\/\/brandingtatva\.com\/insights\/feed\.xml/i.test(llms.text),
    "llms.txt is missing the canonical Insights feed");
  assert(/https:\/\/brandingtatva\.com\/insights\/rss\.xml/i.test(llms.text),
    "llms.txt is missing the Insights RSS compatibility feed");
  assert(!/\[Blog\]\(https:\/\/brandingtatva\.com\/blog\)/i.test(llms.text),
    "llms.txt still presents /blog as the canonical editorial route");
  assert(/30-minute consultation/i.test(llms.text),
    "llms.txt is missing the current 30-minute consultation duration");

  for (let index = 0; index < guideLinks.length; index += 5) {
    const batch = guideLinks.slice(index, index + 5);
    RUN_STATE.articleResults.push(...(await Promise.all(batch.map(auditArticle))));
  }

  const uniqueTitles = new Set(RUN_STATE.articleResults.map((article) => article.title));
  const uniqueDescriptions = new Set(RUN_STATE.articleResults.map((article) => article.description));
  const uniqueCanonicals = new Set(RUN_STATE.articleResults.map((article) => article.canonical));
  assert(uniqueTitles.size === RUN_STATE.articleResults.length,
    `Duplicate article titles detected: ${RUN_STATE.articleResults.length - uniqueTitles.size}`);
  assert(uniqueDescriptions.size === RUN_STATE.articleResults.length,
    `Duplicate article descriptions detected: ${RUN_STATE.articleResults.length - uniqueDescriptions.size}`);
  assert(uniqueCanonicals.size === RUN_STATE.articleResults.length,
    `Duplicate article canonicals detected: ${RUN_STATE.articleResults.length - uniqueCanonicals.size}`);

  const report = {
    ...RUN_STATE,
    guideCount: guideLinks.length,
    topicCount: topicLinks.length,
    sourcedGuideCount: RUN_STATE.articleResults.filter((article) => article.hasResearchSources).length,
    sitemapStatus: sitemap.response.status,
    robotsStatus: robots.response.status,
    canonicalFeedStatus: canonicalFeedResponse.response.status,
    canonicalFeedContentType: canonicalFeedType,
    rssAliasStatus: rssAliasResponse.response.status,
    rssAliasContentType: rssAliasType,
    llmsStatus: llms.response.status,
  };
  fs.writeFileSync(path.join(OUTPUT, "report.json"), JSON.stringify(report, null, 2));
  fs.writeFileSync(path.join(OUTPUT, "guide-routes.txt"), guideLinks.join("\n") + "\n");
  fs.writeFileSync(path.join(OUTPUT, "topic-routes.txt"), topicLinks.join("\n") + "\n");
  fs.writeFileSync(path.join(OUTPUT, "feed.xml"), canonicalFeedResponse.text);
  fs.writeFileSync(path.join(OUTPUT, "rss.xml"), rssAliasResponse.text);
  fs.writeFileSync(path.join(OUTPUT, "llms.txt"), llms.text);
  console.log(
    `Insights discovery gate passed for ${guideLinks.length} guides, ${topicLinks.length} topics, both feeds, and llms.txt.`,
  );
})().catch((error) => {
  writeFailureReport(error);
  console.error(error);
  process.exit(1);
});
