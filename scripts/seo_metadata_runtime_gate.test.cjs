const assert = require("node:assert/strict");
const test = require("node:test");
const { PRIMARY_ROUTES, SERVICE_ROUTES, parseStructuredData, validateMetadata } = require("./seo_metadata_runtime_gate.cjs");

const production = "https://brandingtatva.com";
const preview = "https://branding-tatva-example.vercel.app";
function page(overrides = {}) {
  const route = overrides.route || "/brand-positioning";
  return {
    baseUrl: production,
    route,
    status: 200,
    headers: {},
    ...overrides,
    metadata: {
      title: "Brand positioning for UK service businesses | Branding Tatva",
      description: "Clarify your offer, audience and differentiation with a focused brand positioning engagement.",
      canonical: `${production}${route}`,
      robots: "index, follow",
      googlebot: "index, follow, max-image-preview:large, max-snippet:-1",
      ogTitle: "Brand positioning",
      ogDescription: "Clarify the position your business can credibly own.",
      ogImage: `${production}/opengraph-image`,
      twitterCard: "summary_large_image",
      twitterTitle: "Brand positioning",
      twitterDescription: "Clarify the position your business can credibly own.",
      h1Count: 1,
      schemaTypes: ["WebPage", "Service"],
      ...overrides.metadata,
    },
  };
}

test("current primary routes include all UK service pages and exclude the retired work index", () => {
  for (const route of SERVICE_ROUTES) assert(PRIMARY_ROUTES.includes(route));
  assert(!PRIMARY_ROUTES.includes("/work"));
});

test("an indexable production service page passes with or without an explicit index directive", () => {
  assert.deepEqual(validateMetadata(page()), []);
  assert.deepEqual(validateMetadata(page({ metadata: { robots: "", googlebot: "" } })), []);
});

for (const [name, overrides] of [
  ["robots noindex", { metadata: { robots: "NOINDEX, follow" } }],
  ["conflicting robots tags", { metadata: { robots: "index,follow,noindex" } }],
  ["robots none", { metadata: { robots: "none" } }],
  ["Googlebot noindex", { metadata: { googlebot: "noindex" } }],
  ["Googlebot none", { metadata: { googlebot: "none" } }],
  ["HTTP noindex", { headers: { "X-Robots-Tag": "noindex, follow" } }],
  ["Googlebot HTTP none", { headers: { "x-robots-tag": "googlebot: none" } }],
]) {
  test(`production rejects ${name} even when another directive says index`, () => {
    assert(validateMetadata(page(overrides)).includes("production page blocks Google indexing"));
  });
}

test("crawler-specific headers preserve scope and directive values", () => {
  assert.deepEqual(validateMetadata(page({ headers: { "x-robots-tag": "otherbot: noindex, nofollow" } })), []);
  assert(validateMetadata(page({ headers: { "x-robots-tag": "otherbot: noindex, googlebot: max-snippet:-1, noindex" } }))
    .includes("production page blocks Google indexing"));
});

test("crawler scope resets between separate X-Robots-Tag header fields", () => {
  assert(validateMetadata(page({ headers: { "x-robots-tag": ["otherbot: nofollow", "noindex"] } }))
    .includes("production page blocks Google indexing"));
  assert.deepEqual(validateMetadata(page({ headers: { "x-robots-tag": ["otherbot: noindex", "index, follow"] } })), []);
});

test("production rejects nofollow and preview requires an applicable noindex directive", () => {
  assert(validateMetadata(page({ metadata: { robots: "index, nofollow" } }))
    .includes("production page blocks following links"));
  assert.deepEqual(validateMetadata(page({ baseUrl: preview, metadata: { robots: "noindex, nofollow" } })), []);
  assert.deepEqual(validateMetadata(page({ baseUrl: preview, headers: { "x-robots-tag": "none" } })), []);
  assert(validateMetadata(page({ baseUrl: preview })).includes("preview is not explicitly noindex"));
  assert(validateMetadata(page({ baseUrl: preview, headers: { "x-robots-tag": "otherbot: noindex" } }))
    .includes("preview is not explicitly noindex"));
});

test("errors and empty responses cannot pass even if their metadata looks valid", () => {
  for (const status of [0, 204, 301, 404, 429, 500, 503]) {
    assert(validateMetadata(page({ status })).some((failure) => failure.includes("expected HTTP 200")));
  }
});

test("a navigation to a login screen or another route fails", () => {
  assert.deepEqual(validateMetadata(page({ finalUrl: `${production}/brand-positioning` })), []);
  for (const finalUrl of [`${production}/contact`, "https://vercel.com/login"]) {
    assert(validateMetadata(page({ finalUrl })).includes("navigation redirected away from the expected page"));
  }
});

test("canonicals require the exact HTTPS origin and a clean matching path", () => {
  for (const canonical of [
    "http://brandingtatva.com/brand-positioning",
    "https://brandingtatva.com.example.org/brand-positioning",
    "https://example.org/brandingtatva.com/brand-positioning",
    `${preview}/brand-positioning`,
    `${production}/brand-audit`,
    `${production}/brand-positioning?variant=2`,
    `${production}/brand-positioning#offer`,
    "not a URL",
    "",
  ]) {
    assert(validateMetadata(page({ metadata: { canonical } })).some((failure) => failure.includes("canonical")), canonical);
  }
  assert.deepEqual(validateMetadata(page({ metadata: { canonical: `${production}/brand-positioning/` } })), []);
});

test("service schema is detected inside JSON-LD graphs and arrays", () => {
  const parsed = parseStructuredData([
    JSON.stringify({ "@context": "https://schema.org", "@graph": [{ "@type": "WebPage" }, { "@type": "Service" }] }),
    JSON.stringify([{ "@type": ["Organization", "ProfessionalService"] }]),
  ]);
  assert(parsed.schemaTypes.includes("Service"));
  assert(parsed.schemaTypes.includes("ProfessionalService"));
  assert.deepEqual(validateMetadata(page({ metadata: parsed })), []);
  assert(validateMetadata(page({ metadata: { schemaTypes: ["WebPage"] } }))
    .includes("service page is missing Service schema"));
});

test("malformed JSON-LD fails instead of being silently discarded", () => {
  const parsed = parseStructuredData(['{"@type": "Service"}', "{ invalid }"]);
  assert(validateMetadata(page({ metadata: parsed })).includes("invalid JSON-LD in script 2"));
});

test("guides require article schema; topic hubs do not", () => {
  assert(validateMetadata(page({ route: "/insights/brand-positioning-guide" }))
    .includes("Insight guide is missing Article or BlogPosting schema"));
  assert.deepEqual(validateMetadata(page({ route: "/insights/brand-positioning-guide", metadata: { schemaTypes: ["BlogPosting"] } })), []);
  assert.deepEqual(validateMetadata(page({ route: "/insights/topic/positioning", metadata: { schemaTypes: ["CollectionPage"] } })), []);
});

test("existing title, description, social, heading and project schema checks remain active", () => {
  const failures = validateMetadata(page({
    route: "/work/example",
    metadata: { title: "", description: "", ogImage: "", twitterTitle: "", h1Count: 2, schemaTypes: [] },
  }));
  assert.equal(failures.length, 6);
});
