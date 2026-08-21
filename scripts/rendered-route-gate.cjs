const BASE_URL = process.env.AUDIT_BASE_URL || "http://127.0.0.1:3000";
const PRODUCTION_URL = "https://brandingtatva.com";

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

function decodeText(value) {
  return value
    .replace(/<script\b[\s\S]*?<\/script>/gi, " ")
    .replace(/<style\b[\s\S]*?<\/style>/gi, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/&(?:nbsp|#xA0);/gi, " ")
    .replace(/&amp;/gi, "&")
    .replace(/&quot;/gi, '"')
    .replace(/&#x27;|&#39;/gi, "'")
    .replace(/&lt;/gi, "<")
    .replace(/&gt;/gi, ">")
    .replace(/\s+/g, " ")
    .trim();
}

async function fetchText(path, init) {
  const response = await fetch(`${BASE_URL}${path}`, { redirect: "manual", ...init });
  return { response, body: await response.text() };
}

(async () => {
  const sitemapResponse = await fetch(`${BASE_URL}/sitemap.xml`);
  assert(sitemapResponse.status === 200, `sitemap: expected 200, got ${sitemapResponse.status}`);
  const sitemap = await sitemapResponse.text();
  const paths = [...sitemap.matchAll(/<loc>(.*?)<\/loc>/g)].map((match) => {
    const url = new URL(match[1]);
    return `${url.pathname}${url.search}`;
  });
  assert(paths.length >= 35, `sitemap route inventory is unexpectedly small: ${paths.length}`);

  const titles = new Map();
  for (const route of paths) {
    const { response, body } = await fetchText(route);
    assert(response.status === 200, `${route}: expected 200, got ${response.status}`);

    const h1Count = (body.match(/<h1\b/gi) || []).length;
    assert(h1Count === 1, `${route}: expected one H1, found ${h1Count}`);

    const title = body.match(/<title>([\s\S]*?)<\/title>/i)?.[1]?.trim();
    assert(title, `${route}: title is missing.`);
    const duplicate = titles.get(title);
    assert(!duplicate, `${route}: title duplicates ${duplicate}: ${title}`);
    titles.set(title, route);

    const canonical = body.match(/<link\s+rel="canonical"\s+href="([^"]+)"/i)?.[1];
    assert(canonical === `${PRODUCTION_URL}${route === "/" ? "" : route}`, `${route}: canonical mismatch: ${canonical}`);

    const visibleText = decodeText(body);
    assert(!/\bnot\b/i.test(visibleText), `${route}: banned standalone word appears in rendered content.`);
  }

  const services = await fetch(`${BASE_URL}/services`, { redirect: "manual" });
  assert([301, 308].includes(services.status), `/services: expected permanent redirect, got ${services.status}`);
  assert(services.headers.get("location")?.startsWith("/work"), "/services: redirect destination is incorrect.");

  const missing = await fetch(`${BASE_URL}/route-that-does-not-exist`, { redirect: "manual" });
  assert(missing.status === 404, `missing route: expected 404, got ${missing.status}`);

  const robots = await fetch(`${BASE_URL}/robots.txt`).then((response) => response.text());
  for (const crawler of ["Googlebot", "Bingbot", "OAI-SearchBot", "PerplexityBot"]) {
    assert(robots.includes(crawler), `robots.txt lacks ${crawler}.`);
  }

  console.log(`Rendered route gate passed across ${paths.length} canonical pages with unique titles, one H1, correct canonicals, clean visible copy, permanent redirects, and crawler rules.`);
})().catch((error) => {
  console.error(error);
  process.exit(1);
});
