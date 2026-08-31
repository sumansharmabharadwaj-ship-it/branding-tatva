const fs = require("node:fs");
const path = require("node:path");
const ts = require("typescript");

const ROOT = path.resolve(__dirname, "..");
const SOURCE_ROOTS = ["src/app", "src/components", "src/data", "src/layouts", "src/lib", "src/sections"];
const SKIP_PATHS = [
  `${path.sep}qa${path.sep}`,
  `${path.sep}feed.xml${path.sep}`,
  `${path.sep}rss.xml${path.sep}`,
  "generatedMediaManifest.ts",
  "canonical-preview-release",
  "release-markers",
];

const TECHNICAL_ATTRIBUTES = new Set([
  "className",
  "id",
  "href",
  "src",
  "poster",
  "role",
  "rel",
  "target",
  "type",
  "name",
  "value",
  "content",
  "property",
  "itemProp",
  "dateTime",
  "autoComplete",
  "inputMode",
  "viewBox",
  "d",
  "fill",
  "stroke",
  "style",
  "aria-labelledby",
  "aria-controls",
  "aria-describedby",
  "aria-errormessage",
  "aria-owns",
]);

const TECHNICAL_KEYS = new Set([
  "slug",
  "id",
  "href",
  "url",
  "image",
  "video",
  "poster",
  "cardImage",
  "cardVideo",
  "heroVideo",
  "heroPoster",
  "closingVideo",
  "closingPoster",
  "imagePosition",
  "position",
  "className",
  "source",
  "event",
  "route",
  "topicSlug",
  "projectSlug",
  "packageSlug",
  "accent",
  "color",
  "mimeType",
  "schema",
  "keywords",
  "synonyms",
]);

const STOCK_PATTERNS = [
  /\bunlock(?:ing|ed|s)?\b/i,
  /\belevat(?:e|es|ed|ing)\b/i,
  /\bresonat(?:e|es|ed|ing)\b/i,
  /\bseamless(?:ly)?\b/i,
  /\btailored?\b/i,
  /\bgame\s+changer\b/i,
  /\bnext\s+level\b/i,
  /\bstand\s+out\b/i,
  /\bbring(?:ing|s)?\s+.+\s+to\s+life\b/i,
  /\bmore\s+than\s+just\b/i,
  /\bnot\s+just\b/i,
  /\bat\s+its\s+core\b/i,
  /\bever\s+evolving\b/i,
  /\bclear(?:er)?\s+next\s+step\b/i,
  /\bholistic\b/i,
  /\bimpactful\b/i,
  /\bcutting[ -]edge\b/i,
  /\bnew heights\b/i,
  /\bunique needs\b/i,
  /\bmake your mark\b/i,
  /\bcompelling narrative\b/i,
  /\bauthentic connections?\b/i,
  /\bresults?[ -]driven\b/i,
  /\bone[ -]stop\b/i,
  /\bturn your vision\b/i,
  /\bdiscover how\b/i,
  /\bsomething went wrong\b/i,
  /\btry again\b/i,
  /\blearn more\b/i,
  /\bget started\b/i,
  /\bread more\b/i,
  /\bbook a call\b/i,
  /\blet['’]s talk\b/i,
  /\bdrive(?:s|n|ing)? (?:real )?(?:growth|results|impact)\b/i,
];

const LONG_FORM_SURFACE_KEYS = new Set([
  "title",
  "seoTitle",
  "metaDescription",
  "description",
  "excerpt",
  "summary",
  "headline",
  "directAnswer",
  "promise",
  "premise",
  "lesson",
  "practice",
  "expanded",
  "question",
  "answer",
  "label",
  "pullQuote",
]);

function walk(directory) {
  return fs.readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const absolute = path.join(directory, entry.name);
    if (entry.isDirectory()) return walk(absolute);
    return /\.(?:ts|tsx)$/.test(entry.name) ? [absolute] : [];
  });
}

function isAuditedSurfaceFile(relativeFile) {
  const normalized = relativeFile.split(path.sep).join("/");
  if (/^src\/app\/(?:page|about\/page|services\/page|insights\/page|contact\/page)\.tsx$/.test(normalized)) return true;
  if (/^src\/app\/(?:error|not-found)\.tsx$/.test(normalized)) return true;
  if (/^src\/app\/api\/(?:contact|newsletter)\/route\.ts$/.test(normalized)) return true;
  if (/^src\/app\/(?:editorial-policy|privacy|terms|glossary|glossary\/\[term\]|insights\/\[slug\]|insights\/topic\/\[topic\]|work\/\[slug\]|work\/studies\/\[slug\])\/page\.tsx$/.test(normalized)) return true;
  if (/^src\/data\/(?:about|faqs|process|services|site)\.ts$/.test(normalized)) return true;
  if (/^src\/data\/(?:brandStudies|caseStudyPresentation|glossary|insightApplications|insightPathways|projects|workTaxonomy|.+Insights)\.ts$/.test(normalized)) return true;
  if (/^src\/lib\/(?:api-protection|contact-schema|newsletter-schema|servicesJourney)\.ts$/.test(normalized)) return true;
  if (normalized === "src/layouts/Header/index.tsx") return true;
  if (/^src\/components\/(?:CalendlyEmbed|ConsentManager|Contact.+|NewsletterForm|InsightsExplorer|SeasonalCalendarPanel)\.tsx$/.test(normalized)) return true;
  if (/^src\/components\/(?:FeaturedSecondaryCard|FeaturedWorkHero|InsightDecisionPath|InsightsLibraryReturnLink|RelatedInsightIntent|SectionJumpNav)\.tsx$/.test(normalized)) return true;
  if (/^src\/sections\/(?:About|Services|Insights)\/.+\.tsx$/.test(normalized)) return true;
  if (/^src\/sections\/Work\/(?:CaseStudyExperience|MobileNarrativeEnhancers|MobileSystemEvidenceBoard)\.tsx$/.test(normalized)) return true;
  if (normalized === "src/sections/Footer/index.tsx") return true;
  if (normalized === "src/sections/HomeV4/HomeV4Scenes.tsx") return true;
  if (/^src\/sections\/Home\/(?:EvidenceWall|FinalInvitation|HomeBrandHealthCheck|HomeQuestionsScene|PathsCinematicChapter|StudioCinematicChapter)\.tsx$/.test(normalized)) return true;
  return false;
}

function propertyName(node) {
  if (!node) return "";
  if (ts.isIdentifier(node) || ts.isStringLiteral(node)) return node.text;
  return "";
}

function nearestVariableName(node) {
  let current = node.parent;
  while (current) {
    if (ts.isVariableDeclaration(current)) return propertyName(current.name);
    current = current.parent;
  }
  return "";
}

function isLongFormSurfaceNode(node) {
  return ts.isPropertyAssignment(node.parent) && LONG_FORM_SURFACE_KEYS.has(propertyName(node.parent.name));
}

function shouldInspect(node, text) {
  const clean = text.replace(/\s+/g, " ").trim();
  if (!clean || clean.length < 3) return false;
  if (/^(?:https?:\/\/|mailto:|tel:|\/|#)/i.test(clean)) return false;
  if (/^[\w.+-]+@[\w.-]+\.[a-z]{2,}$/i.test(clean)) return false;
  if (/^(?:linear|radial)-gradient\(|^rgba?\(|^@(?:media|keyframes)|^\[data-|^\.[\w-]/i.test(clean)) return false;
  if (/\b(?:uniform|varying|gl_FragColor|stroke-dashoffset)\b|[{};]/.test(clean)) return false;
  if (/^\(?\s*(?:min|max|prefers)-width:|^\(prefers-reduced-motion:/i.test(clean)) return false;
  if (/^[Mm]\s*-?\d/.test(clean) || /^M-?\d/.test(clean)) return false;
  if (!/\s/.test(clean) && /^[a-z0-9]+(?:-[a-z0-9]+)+$/i.test(clean)) return false;

  if (ts.isJsxText(node)) return true;
  if (ts.isImportDeclaration(node.parent) || ts.isExportDeclaration(node.parent)) return false;

  if (ts.isJsxAttribute(node.parent)) {
    const key = propertyName(node.parent.name);
    if (TECHNICAL_ATTRIBUTES.has(key) || key.startsWith("data-")) return false;
    return true;
  }

  if (ts.isPropertyAssignment(node.parent)) {
    const key = propertyName(node.parent.name);
    if (TECHNICAL_KEYS.has(key)) return false;
  }

  const variable = nearestVariableName(node);
  if (/class|style|token|key|event|path|regex|selector|storage|manifest|gradient|overlay|media|query|intent.*language/i.test(variable)) {
    return false;
  }

  const tokens = clean.split(/\s+/);
  const utilityTokens = tokens.filter(
    (token) => /[:/\[\]]/.test(token) || /^(?:sm|md|lg|xl|hover|focus|group)-?/.test(token),
  );
  if (tokens.length >= 3 && utilityTokens.length / tokens.length > 0.45) return false;
  const technicalTokens = tokens.filter((token) => /[-:/\[\]]/.test(token));
  if (
    /^[a-z]/.test(clean) &&
    technicalTokens.length / tokens.length >= 0.5 &&
    !/[.!?]$/.test(clean)
  ) {
    return false;
  }

  if (/\s/.test(clean)) return true;
  return /[—–]/.test(clean);
}

function issueFor(text, allowCompoundHyphens = false) {
  const clean = text.replace(/\s+/g, " ").trim();
  if (/[—–]/.test(clean)) return "dash punctuation";
  if (!allowCompoundHyphens && /[A-Za-z0-9]-[A-Za-z0-9]/.test(clean)) return "hyphenated copy";
  const stock = STOCK_PATTERNS.find((pattern) => pattern.test(clean));
  return stock ? `stock phrase ${stock}` : null;
}

const issues = [];
for (const sourceRoot of SOURCE_ROOTS) {
  const directory = path.join(ROOT, sourceRoot);
  for (const file of walk(directory)) {
    if (SKIP_PATHS.some((fragment) => file.includes(fragment))) continue;
    const relativeFile = path.relative(ROOT, file);
    if (!isAuditedSurfaceFile(relativeFile)) continue;
    const source = fs.readFileSync(file, "utf8");
    const sourceFile = ts.createSourceFile(
      file,
      source,
      ts.ScriptTarget.Latest,
      true,
      file.endsWith(".tsx") ? ts.ScriptKind.TSX : ts.ScriptKind.TS,
    );
    const longFormData =
      relativeFile.startsWith(`src${path.sep}data${path.sep}`) &&
      /(?:Insights|blog|glossary|supportingInsights|pillarInsights)/.test(relativeFile);

    function visit(node) {
      const isTextNode =
        ts.isStringLiteral(node) ||
        ts.isNoSubstitutionTemplateLiteral(node) ||
        ts.isJsxText(node);
      if (
        isTextNode &&
        (!longFormData || isLongFormSurfaceNode(node)) &&
        shouldInspect(node, node.text)
      ) {
        const issue = issueFor(node.text, longFormData);
        if (issue) {
          const position = sourceFile.getLineAndCharacterOfPosition(node.getStart(sourceFile));
          issues.push({
            file: relativeFile,
            line: position.line + 1,
            issue,
            copy: node.text.replace(/\s+/g, " ").trim(),
          });
        }
      }
      ts.forEachChild(node, visit);
    }

    visit(sourceFile);
  }
}

if (issues.length) {
  console.error("Copy voice gate failed:\n");
  for (const issue of issues) {
    console.error(`${issue.file}:${issue.line}  ${issue.issue}\n  ${issue.copy}\n`);
  }
  process.exit(1);
}

console.log("Copy voice gate passed: no dash punctuation or blocked stock phrasing in inspected copy.");
