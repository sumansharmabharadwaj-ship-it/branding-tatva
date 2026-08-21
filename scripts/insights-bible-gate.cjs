const fs = require("node:fs");
const path = require("node:path");

const root = path.resolve(__dirname, "..");

function read(relativePath) {
  return fs.readFileSync(path.join(root, relativePath), "utf8");
}

function assert(condition, message) {
  if (!condition) throw new Error(`Insights release gate failed: ${message}`);
}

const hub = read("src/app/insights/page.tsx");
const article = read("src/app/insights/[slug]/page.tsx");
const topic = read("src/app/insights/topic/[topic]/page.tsx");
const feed = read("src/app/insights/feed.xml/route.ts");
const sitemap = read("src/app/sitemap.ts");
const config = read("next.config.ts");
const explorer = read("src/components/InsightsExplorer.tsx");
const insightIndex = read("src/data/insights.ts");

const insightDataFiles = fs
  .readdirSync(path.join(root, "src/data"), { withFileTypes: true })
  .filter((entry) => entry.isFile() && /Insights\.ts$/.test(entry.name))
  .map((entry) => read(`src/data/${entry.name}`))
  .join("\n");

const expectedSlugs = [
  "brand-positioning-strategy-service-businesses",
  "brand-audit-checklist-before-rebrand",
  "brand-awareness-vs-brand-recall",
  "brand-messaging-framework",
  "five-element-brand-strategy-framework",
  "website-messaging-hierarchy-service-businesses",
  "distinctive-brand-assets-audit",
  "customer-journey-mapping-service-businesses",
  "how-to-position-a-consulting-business",
  "measure-brand-recall-limited-budget",
  "value-proposition-vs-positioning-vs-tagline",
  "brand-consistency-checklist-service-businesses",
  "why-beautiful-brand-identity-can-be-forgettable",
  "find-real-differentiator-crowded-service-market",
  "brand-positioning-statement-examples-why-generic",
  "reposition-established-service-business-without-losing-recognition",
  "brand-refresh-vs-rebrand-how-much-change",
  "turn-client-proof-into-positioning-advantage",
  "brand-architecture-service-businesses",
  "customer-interviews-brand-strategy",
  "turn-customer-interviews-into-positioning-brief",
  "service-line-naming-strategy",
];

for (const slug of expectedSlugs) {
  assert(insightDataFiles.includes(`slug: "${slug}"`), `missing recovered guide: ${slug}`);
}
assert(expectedSlugs.length === 22, "authority source list is not the exact 22-guide set");
assert(insightIndex.includes("combinedPosts") && insightIndex.includes("findIndex"), "guide registration or de-duplication is missing");
assert(hub.includes("<InsightsExplorer"), "search and topic explorer are not integrated");
assert(explorer.includes('type="search"') && explorer.includes("aria-pressed"), "search/filter controls are not accessible");
assert(hub.includes("newsletterConfigured ?"), "newsletter is not truthfully gated by provider configuration");
assert(article.includes("The direct answer"), "answer-first article summary is missing");
assert(article.includes("Key takeaways"), "article takeaways are missing");
assert(article.includes("Research sources"), "visible citation layer is missing");
assert(article.includes("citation: sources.map"), "citation schema is missing");
assert(article.includes(`href="/about"`), "author-to-About bridge is missing");
assert(article.includes(`href="/contact"`), "article conversion path is missing");
assert(topic.includes("generateStaticParams"), "topic routes are not statically registered");
assert(feed.includes("Branding Tatva Insights"), "RSS feed is missing");
assert(!sitemap.includes("/services`"), "redirect-only Services URL remains in the sitemap");
assert(!sitemap.includes("work/studies"), "nonexistent study routes remain in the sitemap");
assert(config.includes("/blog/visible-versus-remembered"), "legacy article redirects are missing");
assert(!`${hub}\n${article}\n${topic}`.includes("pin: true"), "new GSAP pinning is not allowed on Insights");

console.log("Insights Bible release gate passed: exact 22-guide authority source verified.");
