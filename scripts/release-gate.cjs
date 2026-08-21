const fs = require("node:fs");
const path = require("node:path");

const root = path.resolve(__dirname, "..");
const sourceRoot = path.join(root, "src");

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

function read(relativePath) {
  return fs.readFileSync(path.join(root, relativePath), "utf8");
}

function walk(directory) {
  return fs.readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const absolute = path.join(directory, entry.name);
    return entry.isDirectory() ? walk(absolute) : [absolute];
  });
}

const sourceFiles = walk(sourceRoot).filter((file) => /\.(?:ts|tsx|js|jsx)$/.test(file));
const missingAssets = [];
const referencedAssets = new Set();
const assetPattern = /["'`](\/(?:images|videos|audio)\/[^"'`?#)\s]+)["'`]/g;

for (const file of sourceFiles) {
  const source = fs.readFileSync(file, "utf8");
  for (const match of source.matchAll(assetPattern)) {
    const publicPath = match[1];
    referencedAssets.add(publicPath);
    if (!fs.existsSync(path.join(root, "public", publicPath))) {
      missingAssets.push(`${path.relative(root, file)} -> ${publicPath}`);
    }
  }
}

assert(missingAssets.length === 0, `Missing referenced media:\n${missingAssets.join("\n")}`);

const logo = read("src/components/Logo.tsx");
const loader = read("src/components/PageLoadVeil.tsx");
const layout = read("src/app/layout.tsx");
const sitemap = read("src/app/sitemap.ts");
const site = read("src/data/site.ts");
const contact = read("src/app/contact/page.tsx");
const insightsGate = read("scripts/insights-bible-gate.cjs");
const packageJson = JSON.parse(read("package.json"));

assert(fs.existsSync(path.join(root, "public/images/branding-tatva-tatva-mark.png")), "Approved Tatva mark is missing.");
assert(logo.includes("branding-tatva-tatva-mark.png"), "Header/footer logo is not using the approved Tatva mark.");
assert(loader.includes("branding-tatva-tatva-mark.png"), "Loading veil is not using the approved Tatva mark.");
assert(layout.includes("PageLoadVeil"), "Loading veil is not mounted in the root layout.");
assert(site.includes('url: "https://brandingtatva.com"'), "Canonical production origin changed unexpectedly.");
assert(!sitemap.includes('"/services"'), "Redirect-only /services route is still listed in the sitemap.");
assert(!sitemap.includes("work/studies"), "Nonexistent Work studies route is still listed in the sitemap.");
assert(contact.includes("site.calendlyUrl ?"), "Calendar route is not gated.");
assert(contact.includes("enquiryDeliveryReady"), "Contact delivery route is not gated.");
assert(
  insightsGate.includes("expectedSlugs") && insightsGate.includes("expectedSlugs.length === 22"),
  "Exact 22-guide Insights gate is missing.",
);

for (const script of ["audit:home", "audit:about", "audit:work", "audit:insights", "audit:contact", "audit:api"]) {
  assert(packageJson.scripts?.[script], `Required release script ${script} is missing.`);
}

const combinedSource = sourceFiles.map((file) => fs.readFileSync(file, "utf8")).join("\n");
assert(!combinedSource.includes('href="#"'), "Placeholder href=# remains in the release source.");
assert(!combinedSource.includes("javascript:"), "javascript: URL remains in the release source.");
assert(!combinedSource.includes("+91 84477 25381"), "Phone was published before publication intent was verified.");
assert(!combinedSource.includes("suman@brandingtatva.com"), "Unverified business email was published.");

console.log(`Release gate passed with ${referencedAssets.size} referenced media assets verified.`);
