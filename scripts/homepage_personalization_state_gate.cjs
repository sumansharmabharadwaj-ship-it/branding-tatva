const fs = require("node:fs");
const path = require("node:path");
const ts = require("typescript");

const filename = path.resolve(__dirname, "../src/lib/servicesJourney.ts");
const compiled = ts.transpileModule(fs.readFileSync(filename, "utf8"), {
  compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 },
}).outputText;
const moduleBox = { exports: {} };
const customRequire = (id) => id === "@/lib/analytics"
  ? { trackRuntimeIssue: () => false }
  : require(id);
new Function("module", "exports", "require", compiled)(moduleBox, moduleBox.exports, customRequire);
const journey = moduleBox.exports;

function loadTypeScriptModule(relative, resolveImport = require) {
  const sourcePath = path.resolve(__dirname, `../${relative}`);
  const output = ts.transpileModule(fs.readFileSync(sourcePath, "utf8"), {
    compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 },
  }).outputText;
  const loaded = { exports: {} };
  new Function("module", "exports", "require", output)(loaded, loaded.exports, resolveImport);
  return loaded.exports;
}

const studioJourney = loadTypeScriptModule("src/lib/homeStudioJourney.ts");
const questionJourney = loadTypeScriptModule(
  "src/lib/homeQuestionJourney.ts",
  (id) => id === "@/lib/homeStudioJourney" ? studioJourney : require(id),
);

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
assert(journey.completedHomeDiagnosisFrom({ ...valid, origin: "home_evidence" }, now) === null, "Evidence browsing personalized the invitation as a completed diagnosis.");
assert(journey.completedHomeDiagnosisFrom({ ...valid, origin: "home_paths" }, now) === null, "Path browsing personalized the invitation.");
assert(journey.completedHomeDiagnosisFrom({ ...valid, origin: "services" }, now) === null, "Services browsing personalized the invitation.");
assert(journey.completedHomeDiagnosisFrom({ ...valid, completedAt: now + 1 }, now) === null, "Future diagnosis was accepted.");
assert(journey.completedHomeDiagnosisFrom({ ...valid, completedAt: now - journey.SERVICES_SITUATION_MAX_AGE_MS - 1 }, now) === null, "Expired diagnosis was accepted.");
assert(journey.completedHomeDiagnosisFrom({ ...valid, packageSlug: "brand-clarity" }, now) === null, "Mismatched result package was accepted.");

let stored = JSON.stringify(valid);
let sessionStored = null;
let dispatched = null;
const dispatchedEvents = [];
global.window = {
  localStorage: {
    getItem: () => stored,
    setItem: (_key, value) => { stored = value; },
    removeItem: () => { stored = null; },
  },
  sessionStorage: {
    getItem: () => sessionStored,
    setItem: (_key, value) => { sessionStored = value; },
    removeItem: () => { sessionStored = null; },
  },
  dispatchEvent: (event) => {
    dispatched = event.detail;
    dispatchedEvents.push(event);
  },
};
global.CustomEvent = class CustomEvent {
  constructor(name, options = {}) {
    this.type = name;
    this.detail = options.detail;
  }
};
assert(journey.readCompletedHomeDiagnosis(now) === "idea", "Valid stored diagnosis failed reload recovery.");
stored = "idea";
assert(journey.readCompletedHomeDiagnosis(now) === null, "Legacy string personalized the invitation.");
stored = "{broken";
assert(journey.readCompletedHomeDiagnosis(now) === null, "Corrupt storage personalized the invitation.");

const selectedLens = studioJourney.HOME_STUDIO_LENSES[1];
studioJourney.publishHomeStudioLens(selectedLens);
assert(
  studioJourney.readHomeStudioLens()?.name === "Literature",
  "The carried studio lens failed reload recovery.",
);
const selectedQuestion = {
  id: "existing-brand",
  label: "Existing",
  question: "Can you help an existing brand that already has an identity?",
  lens: selectedLens,
};
questionJourney.publishHomeQuestionChoice(selectedQuestion);
assert(
  questionJourney.readHomeQuestionChoice()?.lens?.name === "Literature",
  "The practical question lost its studio lens during reload recovery.",
);
sessionStored = "{broken";
assert(
  questionJourney.readHomeQuestionChoice() === null,
  "Corrupt practical-question storage reached the final invitation.",
);
questionJourney.publishHomeQuestionChoice(null);
assert(sessionStored === null, "Clearing the practical question left stale session context.");

window.localStorage.setItem = () => { throw new Error("blocked"); };
journey.publishCompletedHomeDiagnosis("reposition");
assert(dispatched?.origin === "home_diagnostic" && dispatched?.situation === "reposition", "Blocked storage prevented in-session personalization.");
journey.clearServicesSituation();
assert(
  dispatchedEvents.at(-1)?.type === journey.SERVICES_SITUATION_CLEARED_EVENT,
  "Clearing a diagnosis did not reset downstream homepage personalization.",
);

console.log("Homepage personalization state gate passed: fresh, origin, expiry, corruption, reload, clear, and blocked-storage behavior verified.");
