const fs = require("node:fs");
const path = require("node:path");

const root = path.resolve(__dirname, "..");

function read(relativePath) {
  return fs.readFileSync(path.join(root, relativePath), "utf8");
}

function assert(condition, message) {
  if (!condition) {
    throw new Error(`About release gate failed: ${message}`);
  }
}

const page = read("src/app/about/page.tsx");
const data = read("src/data/about.ts");
const method = read("src/sections/About/PinnedWorkingMethod.tsx");
const aboutSource = `${page}\n${data}\n${method}`;

assert(!aboutSource.includes("0.71%"), "unverified 0.71% metric is still present");
assert(!aboutSource.includes("2.81%"), "unverified 2.81% metric is still present");
assert(!data.includes('period: "Current"'), "an employment role is still labelled Current");
assert(data.includes('period: "Feb 2024 — Apr 2026"'), "Plaxonic dates are not the verified range");
assert(data.includes('org: "TheDigibee Network"'), "verified TheDigibee experience is missing");
assert((data.match(/application:/g) || []).length === 5, "every credential must explain its application");
assert(page.includes('href="/work#proof"'), "About does not bridge to project evidence");
assert(page.includes('href="/work#services"'), "About does not bridge to Services");
assert(page.includes('ctaHref="/contact"'), "About hero does not retain the Contact conversion path");
assert(!method.includes("priority"), "below-fold portrait is still marked priority");
assert(method.includes('<ul className="mt-4 space-y-4">'), "experience list is missing");
assert(!aboutSource.includes("pin: true"), "new GSAP pinning is not allowed on About");

console.log("About Bible release gate passed.");
