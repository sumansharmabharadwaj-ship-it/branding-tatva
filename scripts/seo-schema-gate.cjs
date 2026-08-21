const fs = require("node:fs");
const path = require("node:path");

const root = path.resolve(__dirname, "..");

function read(relativePath) {
  return fs.readFileSync(path.join(root, relativePath), "utf8");
}

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

const layout = read("src/app/layout.tsx");
const home = read("src/app/page.tsx");
const about = read("src/app/about/page.tsx");
const work = read("src/app/work/page.tsx");
const insights = read("src/app/insights/page.tsx");
const article = read("src/app/insights/[slug]/page.tsx");
const contact = read("src/app/contact/page.tsx");
const caseStudy = read("src/app/work/[slug]/page.tsx");
const robots = read("src/app/robots.ts");
const sitemap = read("src/app/sitemap.ts");
const nextConfig = read("next.config.ts");
const combined = [layout, home, about, work, insights, article, contact, caseStudy].join("\n");

assert(!combined.includes('"@type": "ProfessionalService"'), "Deprecated ProfessionalService schema returned.");
assert(layout.includes('"@type": "Organization"'), "Organization entity is missing.");
assert(layout.includes('"@type": "WebSite"'), "WebSite entity is missing.");
assert(layout.includes("branding-tatva-tatva-mark.png"), "Approved identity mark is missing from Organization.logo.");
assert(about.includes('["AboutPage", "ProfilePage"]'), "AboutPage + ProfilePage entity home is missing.");
assert(about.includes('"@type": "Person"'), "Founder Person entity is missing from About.");
assert(work.includes('"@type": "CollectionPage"'), "Work CollectionPage schema is missing.");
assert(work.includes('"@type": "Service"'), "Visible Work engagement paths lack Service schema.");
assert(insights.includes('"@type": "ItemList"'), "Insights ItemList schema is missing.");
assert(article.includes('"@type": "BlogPosting"'), "Insight BlogPosting schema is missing.");
assert(contact.includes('"@type": "ContactPage"'), "ContactPage schema is missing.");
assert(caseStudy.includes('"@type": "CreativeWork"'), "Case-study CreativeWork schema is missing.");
assert(caseStudy.includes('"@type": "BreadcrumbList"'), "Case-study breadcrumb schema is missing.");
assert(!combined.includes('"@type": "FAQPage"'), "Agency FAQPage schema returned despite the eligibility guardrail.");

assert(robots.includes("OAI-SearchBot"), "OAI-SearchBot access rule is missing.");
assert(robots.includes("PerplexityBot"), "PerplexityBot access rule is missing.");
assert(robots.includes('disallow: ["/api/"]'), "Private API crawl rule is missing.");
assert(robots.includes('VERCEL_ENV === "preview"'), "Preview robots guard is missing.");
assert(nextConfig.includes("X-Robots-Tag"), "Preview X-Robots-Tag header is missing.");
assert(layout.includes('VERCEL_ENV !== "preview"'), "Preview metadata index guard is missing.");
assert(!sitemap.includes('"/services"'), "Redirect-only /services route remains in the sitemap.");

console.log("SEO/schema gate passed: entity homes, page types, service/case/article graphs, crawler rules, preview noindex, and sitemap architecture are present.");
