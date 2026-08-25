const fs = require("node:fs");
const path = require("node:path");
const ts = require("typescript");

const filename = path.resolve(__dirname, "../src/lib/servicesJourney.ts");
const compiled = ts.transpileModule(fs.readFileSync(filename, "utf8"), {
  compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 },
}).outputText;
const moduleBox = { exports: {} };
new Function("module", "exports", "require", compiled)(moduleBox, moduleBox.exports, require);
const journey = moduleBox.exports;

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

const now = 2_000_000_000_000;
const valid = {
  situation: "idea",
  packageSlug: "brand-beginning",
  origin: "home_diagnostic",
  completedAt: now - 1000,
};
assert(journey.completedHomeDiagnosisFrom(valid, now) === "idea", "Fresh completed diagnosis was rejected.");
assert(journey.completedHomeDiagnosisFrom({ ...valid, origin: "home_paths" }, now) === null, "Path browsing personalized the invitation.");
assert(journey.completedHomeDiagnosisFrom({ ...valid, origin: "services" }, now) === null, "Services browsing personalized the invitation.");
assert(journey.completedHomeDiagnosisFrom({ ...valid, completedAt: now + 1 }, now) === null, "Future diagnosis was accepted.");
assert(journey.completedHomeDiagnosisFrom({ ...valid, completedAt: now - journey.SERVICES_SITUATION_MAX_AGE_MS - 1 }, now) === null, "Expired diagnosis was accepted.");
assert(journey.completedHomeDiagnosisFrom({ ...valid, packageSlug: "brand-clarity" }, now) === null, "Mismatched result package was accepted.");

let stored = JSON.stringify(valid);
let dispatched = null;
global.window = {
  localStorage: {
    getItem: () => stored,
    setItem: (_key, value) => { stored = value; },
    removeItem: () => { stored = null; },
  },
  dispatchEvent: (event) => { dispatched = event.detail; },
};
global.CustomEvent = class CustomEvent {
  constructor(_name, options) { this.detail = options.detail; }
};
assert(journey.readCompletedHomeDiagnosis(now) === "idea", "Valid stored diagnosis failed reload recovery.");
stored = "idea";
assert(journey.readCompletedHomeDiagnosis(now) === null, "Legacy string personalized the invitation.");
stored = "{broken";
assert(journey.readCompletedHomeDiagnosis(now) === null, "Corrupt storage personalized the invitation.");
window.localStorage.setItem = () => { throw new Error("blocked"); };
journey.publishCompletedHomeDiagnosis("reposition");
assert(dispatched?.origin === "home_diagnostic" && dispatched?.situation === "reposition", "Blocked storage prevented in-session personalization.");

console.log("Homepage personalization state gate passed: fresh, origin, expiry, corruption, reload, and blocked-storage behavior verified.");
