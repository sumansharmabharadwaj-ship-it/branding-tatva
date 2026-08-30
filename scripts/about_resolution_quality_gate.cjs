const fs = require("node:fs");
const path = require("node:path");

const root = path.resolve(__dirname, "..");
const read = (relative) => fs.readFileSync(path.join(root, relative), "utf8");
const component = read("src/sections/About/AboutResolution.tsx");
const styles = read("src/sections/About/AboutResolution.module.css");
const memoryGate = read("scripts/about_route_memory_gate.cjs");
const browserWorkflow = read(".github/workflows/about-route-memory-gate.yml");

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

const shortScreenRule = styles.match(
  /@media \(min-width: 1024px\) and \(max-height: 620px\) \{([\s\S]*?)\n\}/,
)?.[1] ?? "";

assert(shortScreenRule, "About resolution lacks its short-desktop reading fallback.");
assert(
  /\.interactiveExperience\s*\{\s*display:\s*none;\s*\}/.test(shortScreenRule),
  "Short desktops can render the clipped interactive record.",
);
assert(
  /\.staticExperience\s*\{[^}]*display:\s*grid;/.test(shortScreenRule),
  "Short desktops do not expose the complete static reading record.",
);
assert(
  /\.inner\s*\{[^}]*height:\s*auto;[^}]*min-height:\s*auto;/.test(shortScreenRule),
  "Short-desktop fallback is still constrained to one clipped viewport.",
);
assert(
  /\.recordStage small,\s*\n\.recordStage dt\s*\{[^}]*font-size:\s*0\.625rem;/.test(styles),
  "Closing-record labels have fallen below the protected readable size.",
);
assert(
  /\.recordStage dd\s*\{[^}]*font-size:\s*0\.6875rem;/.test(styles),
  "Closing-record supporting copy has fallen below the protected readable size.",
);
assert(
  /\.recordSheet\s*\{[^}]*min-height:\s*25\.5rem;/.test(styles),
  "Desktop closing records have lost their protected vertical reading room.",
);
assert(
  !/<div id="about-resolution-record"[^>]*aria-live=/.test(component),
  "The detailed record duplicates the concise route announcement.",
);
assert(
  /className=\{styles\.interactiveSummary\}\s+aria-live="polite"/.test(component),
  "The concise route-change announcement is missing.",
);
assert(
  component.includes('aria-controls="about-resolution-record"') && component.includes("aria-pressed={index === activeIndex}"),
  "Closing-record controls have lost their accessible state relationship.",
);
assert(
  !memoryGate.includes('await client.send("DOM.enable")'),
  "The retained-node sampler re-enables the long-lived DOM diagnostic session.",
);
assert(
  memoryGate.indexOf("const finalDetachedDomTrees = await detachedDomCount(page);") >
    memoryGate.indexOf("samples.push(await sampleMemory(client, page, `after-${trip + 1}`));"),
  "Detached-tree diagnostics run before the retained-node sample series is complete.",
);
assert(
  /id:\s*memory\s*\n\s*continue-on-error:\s*true/.test(browserWorkflow) &&
    /id:\s*rendered\s*\n\s*continue-on-error:\s*true/.test(browserWorkflow) &&
    browserWorkflow.includes("About memory and responsive rendering gates passed."),
  "A memory failure can hide the rendered responsive result again.",
);

console.log(
  "About resolution quality gate passed: reading fallback, accessible route state, isolated memory sampling, and independent rendered QA verified.",
);
