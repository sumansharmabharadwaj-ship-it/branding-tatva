const fs = require("node:fs");
const path = require("node:path");
const ts = require("typescript");

const root = path.resolve(__dirname, "..");
const issues = [];
const genericPattern = /\b(unlock|elevate|empower|seamless|cutting-edge|game[- ]changing|holistic|transformative|bespoke|impactful|unparalleled|next[- ]level|world[- ]class|results-driven|tailored|innovative|leverage|delve|dynamic solutions?|digital landscape|today['’]s fast-paced)\b/i;

function propertyName(node) {
  if (ts.isPropertyAssignment(node.parent)) {
    return node.parent.name.getText().replaceAll(/["']/g, "");
  }
  if (ts.isJsxAttribute(node.parent)) return node.parent.name.getText();
  return "";
}

function isIgnored(node, value) {
  if (/^https?:\/\//.test(value)) return true;
  if (ts.isImportDeclaration(node.parent) || ts.isExportDeclaration(node.parent)) return true;
  return ["id", "slug", "href", "src", "poster", "className", "style", "key"].includes(propertyName(node));
}

function scan(file) {
  const code = fs.readFileSync(file, "utf8");
  const source = ts.createSourceFile(
    file,
    code,
    ts.ScriptTarget.Latest,
    true,
    file.endsWith("x") ? ts.ScriptKind.TSX : ts.ScriptKind.TS,
  );

  function visit(node) {
    let value = "";
    if (ts.isStringLiteralLike(node) || ts.isNoSubstitutionTemplateLiteral(node) || ts.isJsxText(node)) {
      value = node.text;
    }

    if (value && !isIgnored(node, value)) {
      const line = source.getLineAndCharacterOfPosition(node.getStart(source)).line + 1;
      const compact = value.replaceAll(/\s+/g, " ").trim();
      if (/\bnot\b/i.test(value)) issues.push(`${path.relative(root, file)}:${line} contains the banned negative construction: ${compact}`);
      if (genericPattern.test(value)) issues.push(`${path.relative(root, file)}:${line} contains generic AI language: ${compact}`);
      if (/Work \+ Services/i.test(value)) issues.push(`${path.relative(root, file)}:${line} contains the retired page name: ${compact}`);
    }
    ts.forEachChild(node, visit);
  }

  visit(source);
}

function walk(directory) {
  for (const entry of fs.readdirSync(directory, { withFileTypes: true })) {
    const full = path.join(directory, entry.name);
    if (entry.isDirectory()) walk(full);
    else if (/\.(tsx?|jsx?)$/.test(entry.name)) scan(full);
  }
}

walk(path.join(root, "src"));

if (issues.length) {
  console.error(issues.join("\n"));
  process.exit(1);
}

console.log("Copy language gate passed: banned negative construction, generic AI language, and retired page name are absent from user-facing source strings.");
