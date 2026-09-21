const fs = require("node:fs");
const path = require("node:path");
const ts = require("typescript");

const filename = path.resolve(__dirname, "../src/lib/homeDiagnosticState.ts");
const compiled = ts.transpileModule(fs.readFileSync(filename, "utf8"), {
  compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 },
}).outputText;
const moduleBox = { exports: {} };
new Function("module", "exports", compiled)(moduleBox, moduleBox.exports);
const {
  homeDiagnosticReducer,
  initialHomeDiagnosticState,
  resolveCompletedHomeDiagnosis,
} = moduleBox.exports;

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

assert(resolveCompletedHomeDiagnosis(["recognition", null, null]) === null, "Partial answers resolved as complete.");
assert(resolveCompletedHomeDiagnosis(["recognition", "recognition", "demand"]) === "recognition", "Majority result drifted.");
assert(resolveCompletedHomeDiagnosis(["recognition", "coherence", "demand"]) === "mixed", "Mixed result drifted.");

let state = initialHomeDiagnosticState;
state = homeDiagnosticReducer(state, { type: "continue" });
assert(state.step === 0, "Unanswered diagnostic skipped forward.");
state = homeDiagnosticReducer(state, { type: "choose", step: 0, answer: "recognition", selection: 0 });
state = homeDiagnosticReducer(state, { type: "continue" });
assert(state.step === 1 && state.answers[0] === "recognition", "Forward transition lost its committed answer.");
state = homeDiagnosticReducer(state, { type: "choose", step: 1, answer: "coherence", selection: 1 });
state = homeDiagnosticReducer(state, { type: "back" });
state = homeDiagnosticReducer(state, { type: "choose", step: 0, answer: "demand", selection: 2 });
assert(state.answers[0] === "demand" && state.answers[1] === "coherence", "Back and edit corrupted diagnostic state.");
state = homeDiagnosticReducer(state, { type: "continue" });
state = homeDiagnosticReducer(state, { type: "continue" });
state = homeDiagnosticReducer(state, { type: "choose", step: 2, answer: "demand", selection: 2 });
state = homeDiagnosticReducer(state, { type: "complete", answers: [...state.answers] });
assert(state.resultVisible && state.result === "demand", "Completion did not atomically bind the result.");
state = homeDiagnosticReducer(state, { type: "review" });
assert(!state.resultVisible && state.result === null && state.step === 2, "Review retained a stale result.");
state = homeDiagnosticReducer(state, { type: "reset" });
assert(state.step === 0 && state.answers.every((value) => value === null), "Reset retained diagnostic state.");

console.log("Homepage diagnostic state gate passed: skip, partial, forward, back, edit, complete, mixed, review, and reset verified.");
