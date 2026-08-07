const fs = require("node:fs");
const path = require("node:path");

const BASE_URL = process.env.AUDIT_BASE_URL || "http://127.0.0.1:3000";
const OUTPUT = path.join(process.cwd(), "insights-discovery-audit");
const EXPECTED_MIN_GUIDES = Number(process.env.INSIGHTS_EXPECTED_MIN || "22");

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
    const href = decodeEntities(match[1]);
    if (href.startsWith(prefix)) links.push(href.split(/[?#]/)[0]);
  }
  return [...new Set(links)];
}

async function request(pathname) {
  const response = await fetch(`${BASE_URL}${pathname}`, {
    redirect: "manual",
    headers: { "user-agent": "Branding-Tatva-Insights-Discovery-Gate/1.0" },
  });
  const text = await response.text();
  return { response, text };
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
  const h1 = matchOne(text, /<h1[^>]*>([\s\S]*?)<\/h1>/i).replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
  const jsonLd = [...text.matchAll(/<script[^>]+type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi)]
    .map((match) => match[1]);
  const internalLinks = collectLinks(text, "/");

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

  return {
    href,
    title,
    description,
    canonical,
    h1,
    internalLinkCount: internalLinks.length,
  };
}

(async () => {
  const index = await request("/insights");
  assert(index.response.status >= 200 && index.response.status < 400,
    `/insights returned ${index.response.status}`);
  const guideLinks = collectLinks(index.text, "/insights/");
  assert(guideLinks.length >= EXPECTED_MIN_GUIDES,
    `Expected at least ${EXPECTED_MIN_GUIDES} guide routes, found ${guideLinks.length}`);

  const sitemap = await request("/sitemap.xml");
  assert(sitemap.response.status >= 200 && sitemap.response.status < 400,
    `/sitemap.xml returned ${sitemap.response.status}`);
  for (const href of guideLinks) {
    assert(sitemap.text.includes(href), `Sitemap is missing ${href}`);
  }

  const robots = await request("/robots.txt");
  assert(robots.response.status >= 200 && robots.response.status < 400,
    `/robots.txt returned ${robots.response.status}`);
  assert(/sitemap:/i.test(robots.text), "robots.txt is missing a Sitemap directive");
  assert(!/disallow:\s*\/insights(?:\s|$)/i.test(robots.text),
    "robots.txt disallows the Insights library");

  const articleResults = [];
  for (let index = 0; index < guideLinks.length; index += 5) {
    const batch = guideLinks.slice(index, index + 5);
    articleResults.push(...(await Promise.all(batch.map(auditArticle))));
  }

  const uniqueTitles = new Set(articleResults.map((article) => article.title));
  const uniqueDescriptions = new Set(articleResults.map((article) => article.description));
  const uniqueCanonicals = new Set(articleResults.map((article) => article.canonical));
  assert(uniqueTitles.size === articleResults.length,
    `Duplicate article titles detected: ${articleResults.length - uniqueTitles.size}`);
  assert(uniqueDescriptions.size === articleResults.length,
    `Duplicate article descriptions detected: ${articleResults.length - uniqueDescriptions.size}`);
  assert(uniqueCanonicals.size === articleResults.length,
    `Duplicate article canonicals detected: ${articleResults.length - uniqueCanonicals.size}`);

  const report = {
    commit: process.env.AUDIT_COMMIT || "local",
    generatedAt: new Date().toISOString(),
    guideCount: guideLinks.length,
    sitemapStatus: sitemap.response.status,
    robotsStatus: robots.response.status,
    articleResults,
  };
  fs.writeFileSync(path.join(OUTPUT, "report.json"), JSON.stringify(report, null, 2));
  fs.writeFileSync(
    path.join(OUTPUT, "guide-routes.txt"),
    guideLinks.join("\n") + "\n",
  );
  console.log(`Insights discovery gate passed for ${guideLinks.length} guides.`);
})().catch((error) => {
  console.error(error);
  process.exit(1);
});
