const fs = require("node:fs");
const path = require("node:path");

const root = path.resolve(__dirname, "..");

function read(relativePath) {
  return fs.readFileSync(path.join(root, relativePath), "utf8");
}

function assert(condition, message) {
  if (!condition) throw new Error(`Work release gate failed: ${message}`);
}

const workPage = read("src/app/work/page.tsx");
const casePage = read("src/app/work/[slug]/page.tsx");
const projects = read("src/data/projects.ts");
const services = read("src/data/services.ts");
const faqs = read("src/data/faqs.ts");
const elements = read("src/data/elements.ts");
const journey = read("src/sections/Work/WorkServicesJourney.tsx");
const engagement = read("src/sections/Work/WorkEngagementMap.tsx");
const weakBranding = read("src/sections/Services/WeakBrandingCost.tsx");
const workSource = `${workPage}\n${casePage}\n${projects}\n${services}\n${faqs}\n${elements}\n${journey}\n${engagement}\n${weakBranding}`;

for (const unsupportedMetric of ["0.71%", "2.81%", "104%", "1,350%", "365%", "15% to 20%", "Under 3%"] ) {
  assert(!workSource.includes(unsupportedMetric), `unsupported metric remains: ${unsupportedMetric}`);
}

assert((projects.match(/evidenceNote:/g) || []).length === 6, "every Project and all five records must define an evidence boundary");
assert(casePage.includes('title="Evidence boundary"'), "case studies do not display their evidence boundary");
assert(workPage.includes('id="proof"'), "Work proof index anchor is missing");
assert(workPage.includes("<WorkServicesJourney />"), "Services journey is not integrated into Work");
assert(journey.includes("<WorkEngagementMap />"), "process and responsibility map is not integrated");
assert(engagement.includes("You bring") && engagement.includes("Suman leads") && engagement.includes("Together"), "responsibilities are not explicit");
assert(!services.includes("price:"), "unconfirmed pricing is still shipped to the client");
assert(!services.includes("billing:"), "unconfirmed billing terms are still shipped to the client");
assert(services.includes("scope is shaped after audit") || services.includes("scope"), "scope qualification is missing");
assert(workSource.includes('href="/contact"'), "Work does not retain a Contact conversion path");
assert(!weakBranding.includes("blur("), "Work hides text behind blur");
assert(!workSource.includes("pin: true"), "new GSAP pinning is not allowed on Work + Services");

console.log("Work + Services Bible release gate passed.");
