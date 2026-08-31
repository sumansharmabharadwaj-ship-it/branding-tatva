const fs = require("node:fs");
const path = require("node:path");
const postcss = require("postcss");

const root = path.resolve(__dirname, "..");
const page = fs.readFileSync(path.join(root, "src/app/page.tsx"), "utf8");
const fix = process.argv.includes("--fix");

const retiredSelectors = [
  ".home-v4-guide",
  ".home-v4-cursor",
  ".home-v4-recognition",
  ".home-v4-chapter--foundation",
  '[data-home-v4-chapter="foundation"]',
  ".home-v4-chapter--insights",
  '[data-home-v4-chapter="insights"]',
  ".foundation-scroll-scene",
  ".tatva-pressure-lab",
  ".home-insights",
  "#tatva",
  "#insights-preview",
  ".home-v4-cost",
  ".studio-cinematic",
  ".paths-cinematic",
  ".cinematic-home",
  ".home-health",
  ".questions-cinematic",
  ".project-journey",
  ".evidence-cinematic__archive-current",
  ".evidence-cinematic__media",
  ".evidence-cinematic__dossier",
  ".evidence-cinematic__trail-step",
  ".evidence-cinematic__evidence-note",
  ".evidence-cinematic__timer",
  ".evidence-cinematic__index-image",
  ".home-v4-opening__signal",
  ".home-v4-opening__light",
  ".home-v4-opening__scroll",
];

const stylesheetPaths = [...page.matchAll(/^import "\.\/(home[^";]+\.css)";/gm)].map(
  (match) => path.join(root, "src/app", match[1]),
);

function isRetired(selector) {
  return retiredSelectors.some((token) => selector.includes(token));
}

function removeEmptyContainers(container) {
  [...(container.nodes ?? [])].forEach((node) => {
    if (node.nodes) removeEmptyContainers(node);
    if (node.nodes && node.nodes.length === 0) node.remove();
  });
}

const offenders = [];
let removedBranches = 0;

for (const stylesheetPath of stylesheetPaths) {
  const source = fs.readFileSync(stylesheetPath, "utf8");
  const tree = postcss.parse(source, { from: stylesheetPath });

  tree.walkRules((rule) => {
    const selectors = postcss.list.comma(rule.selector);
    const active = selectors.filter((selector) => !isRetired(selector));
    if (active.length === selectors.length) return;

    if (!fix) {
      offenders.push(`${path.relative(root, stylesheetPath)}: ${rule.selector}`);
      return;
    }

    removedBranches += selectors.length - active.length;
    if (active.length === 0) rule.remove();
    else rule.selector = active.join(",\n");
  });

  if (fix) {
    removeEmptyContainers(tree);
    const output = tree.toString();
    if (output !== source) fs.writeFileSync(stylesheetPath, output);
  }
}

if (offenders.length > 0) {
  throw new Error(
    `Retired homepage selector branches remain:\n${offenders.slice(0, 40).join("\n")}`,
  );
}

if (fix) {
  console.log(`Homepage retired CSS fixer removed ${removedBranches} selector branches.`);
} else {
  console.log("Homepage retired CSS gate passed: removed chapters have no rendered selector branches.");
}
