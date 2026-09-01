const fs = require("node:fs");
const path = require("node:path");

const root = path.resolve(__dirname, "..");
const read = (relative) => fs.readFileSync(path.join(root, relative), "utf8");
const component = read("src/sections/About/AboutResolution.tsx");
const styles = read("src/sections/About/AboutResolution.module.css");
const memoryGate = read("scripts/about_route_memory_gate.cjs");
const renderedGate = read("scripts/about_resolution_rendered_gate.cjs");
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
  /\.recordStage dd\s*\{[^}]*font-size:\s*0\.75rem;/.test(styles),
  "Closing-record supporting copy has fallen below the protected readable size.",
);
assert(
  /\.pathRail button > span:first-child\s*\{[^}]*font-size:\s*0\.6rem;/.test(styles),
  "Closing-route numbers have fallen below the protected reading floor.",
);
assert(
  /\.pathRail small,\s*\n\.recordStage small,\s*\n\.recordStage dt,\s*\n\.staticPaths small,\s*\n\.footer p span\s*\{[^}]*font-size:\s*0\.6rem;/.test(styles),
  "Closing-route and static-path labels have fallen below the protected reading floor.",
);
assert(
  /\.frameMark\s*\{[^}]*font-size:\s*0\.6rem;/.test(styles),
  "The closing cinematic frame mark has fallen below the protected reading floor.",
);
assert(
  /\.recordSheet\s*\{[^}]*min-height:\s*30rem;/.test(styles),
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
  /className=\{styles\.pathRail\}[\s\S]*?role="tablist"/.test(component) &&
    component.includes('role="tab"') &&
    component.includes("aria-selected={index === activeIndex}") &&
    component.includes('aria-controls="about-resolution-record"') &&
    component.includes("tabIndex={index === activeIndex ? 0 : -1}") &&
    component.includes('role="tabpanel"') &&
    component.includes("aria-labelledby={`about-resolution-path-${activeIndex}`}"),
  "Closing-record controls have lost their accessible state relationship.",
);
assert(
  component.includes("href={servicesContactHref(activePath.slug)}") &&
    component.includes("package: activePath.slug") &&
    component.includes("className={styles.staticContactCta}") &&
    component.includes('href="/contact"'),
  "The closing route no longer carries an explicit choice while keeping static journeys neutral.",
);
assert(
  component.includes("manualChoiceRef.current = true") &&
    component.includes("manualChoiceIndexRef.current = index") &&
    component.includes("setActiveIndex(manualChoiceIndexRef.current)") &&
    component.includes("previewingRef.current || manualChoiceRef.current") &&
    component.includes('window.addEventListener("wheel", releaseManualChoice, { passive: true })') &&
    component.includes('window.addEventListener("touchstart", releaseManualChoice, { passive: true })') &&
    component.includes('window.addEventListener("keydown", releaseManualChoice)') &&
    component.includes("pathRailRef.current?.contains(event.target)"),
  "An explicit closing-route choice can be overwritten before its Contact handoff.",
);
assert(
  component.includes("key={activePath.slug}") &&
    component.includes("href={servicesContactHref(activePath.slug)}"),
  "The closing Contact link can retain a stale client-side destination after the route changes.",
);
assert(
  component.includes("data-about-resolution-actions") &&
    /@media \(max-width: 1023px\) \{[\s\S]*?\.inner,[\s\S]*?padding-bottom:\s*calc\(7\.75rem \+ env\(safe-area-inset-bottom\)\);/.test(styles) &&
    /html\[data-consent-banner="visible"\][\s\S]*?padding-bottom:\s*calc\(11\.75rem \+ env\(safe-area-inset-bottom\)\);/.test(styles),
  "The final About actions can fall underneath the persistent mobile navigator or consent-banner stack.",
);
assert(
  styles.includes(':global(html[data-consent-banner="visible"]) .footer') &&
    styles.includes("padding-right: clamp(14rem, 18vw, 16rem);"),
  "The final desktop actions can settle beneath the consent notice.",
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
assert(
  renderedGate.includes('name: "zoom-equivalent-720x450"') &&
    renderedGate.includes('name: "narrow-mobile-320x568"') &&
    renderedGate.includes('name: "reduced-mobile-320x568"') &&
    renderedGate.includes("fallbackGeometry.contentContained") &&
    renderedGate.includes("focusState.outlineWidth >= 2 || focusState.hasHalo"),
  "Narrow, high-zoom, or reduced-motion closing records can regress outside the rendered matrix.",
);

console.log(
  "About resolution quality gate passed: reading fallback, accessible route state, isolated memory sampling, and independent rendered QA verified.",
);
