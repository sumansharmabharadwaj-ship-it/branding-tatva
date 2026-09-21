const fs = require("node:fs");
const path = require("node:path");
const ts = require("typescript");

const filename = path.resolve(__dirname, "../src/lib/analytics.ts");
const compiled = ts.transpileModule(fs.readFileSync(filename, "utf8"), {
  compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 },
}).outputText;
let consent = false;
const events = [];
const customRequire = (id) => {
  if (id === "@vercel/analytics") return { track: (event, props) => events.push({ event, props }) };
  if (id === "@/lib/consent") return { readConsent: () => ({ analytics: consent }) };
  return require(id);
};
const moduleBox = { exports: {} };
new Function("module", "exports", "require", compiled)(moduleBox, moduleBox.exports, customRequire);
const analytics = moduleBox.exports;

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

global.window = {
  innerWidth: 390,
  location: { pathname: "/" },
  matchMedia: () => ({ matches: false }),
};
global.document = { documentElement: { dataset: {} } };

assert(analytics.track("faq_opened") === false && events.length === 0, "No-consent event escaped.");
consent = true;
assert(analytics.track("faq_opened", { source: "home" }) === true && events.length === 1, "Consented event was lost.");
consent = false;
assert(analytics.track("faq_opened") === false && events.length === 1, "Consent withdrawal was cached.");
consent = true;

analytics.trackRuntimeIssue("scene_visibility_failed", {
  scene: "opening",
  media: "BT-HOME-HERO-FOREST-SANCTUARY",
  attempt: 99,
});
let payload = events.at(-1).props;
assert(payload.device === "mobile" && payload.route === "home", "Mobile or root-route bucket drifted.");
assert(payload.media === "opening_film" && payload.attempt === 3, "Media allowlist or attempt clamp drifted.");
const count = events.length;
analytics.trackRuntimeIssue("scene_visibility_failed", {
  scene: "opening",
  media: "BT-HOME-HERO-FOREST-SANCTUARY",
  attempt: 99,
});
assert(events.length === count, "Exact runtime payload was not deduplicated.");

window.innerWidth = 900;
window.location.pathname = "/services/package";
document.documentElement.dataset.motion = "reduced";
analytics.trackRuntimeIssue("scene_visibility_recovered", { scene: "services", media: "alice@example.com" });
payload = events.at(-1).props;
assert(payload.device === "tablet" && payload.route === "services" && payload.motion === "site_reduced", "Tablet, route, or site-motion bucket drifted.");
assert(payload.scene === "unknown" && payload.media === "unknown", "Arbitrary runtime values were transmitted.");
assert(!JSON.stringify(payload).includes("alice") && !JSON.stringify(payload).includes("@"), "Email-shaped runtime data escaped.");

window.innerWidth = 1440;
window.location.pathname = "/private/token-123";
document.documentElement.dataset.motion = "";
window.matchMedia = () => ({ matches: true });
analytics.trackRuntimeIssue("media_playback_failed", { scene: "invitation", media: "secret-token-123" });
payload = events.at(-1).props;
assert(payload.device === "desktop" && payload.route === "other" && payload.motion === "os_reduced", "Desktop, unknown route, or OS-motion bucket drifted.");
assert(!JSON.stringify(payload).includes("token"), "Token-shaped runtime data escaped.");

console.log("Homepage analytics contract gate passed: consent, withdrawal, deduplication, device, motion, route, clamp, and privacy allowlists verified.");
