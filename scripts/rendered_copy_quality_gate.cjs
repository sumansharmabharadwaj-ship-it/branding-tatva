const { spawn } = require("node:child_process");
const fs = require("node:fs");
const path = require("node:path");

const ROOT = path.resolve(__dirname, "..");
const PORT = 4174;
const ORIGIN = `http://127.0.0.1:${PORT}`;
const BUILT_APP_ROOT = path.join(ROOT, ".next", "server", "app");

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

function wait(milliseconds) {
  return new Promise((resolve) => setTimeout(resolve, milliseconds));
}

function decodeEntities(value) {
  const named = {
    amp: "&",
    apos: "'",
    gt: ">",
    hellip: "…",
    lt: "<",
    nbsp: " ",
    quot: '"',
    rsquo: "’",
  };
  return value
    .replace(/&#(\d+);/g, (_match, digits) => String.fromCodePoint(Number(digits)))
    .replace(/&#x([\da-f]+);/gi, (_match, digits) => String.fromCodePoint(Number.parseInt(digits, 16)))
    .replace(/&([a-z]+);/gi, (match, name) => named[name] ?? match);
}

function visibleText(html) {
  return decodeEntities(
    html
      .replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi, " ")
      .replace(/<style\b[^>]*>[\s\S]*?<\/style>/gi, " ")
      .replace(/<svg\b[^>]*>[\s\S]*?<\/svg>/gi, " ")
      .replace(/<[^>]+>/g, " "),
  )
    .replace(/\s+/g, " ")
    .trim();
}

function context(text, index, length) {
  return text
    .slice(Math.max(0, index - 72), Math.min(text.length, index + length + 92))
    .replace(/\s+/g, " ");
}

function walkHtml(directory) {
  return fs.readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const absolute = path.join(directory, entry.name);
    if (entry.isDirectory()) return walkHtml(absolute);
    return entry.name.endsWith(".html") ? [absolute] : [];
  });
}

function discoverRoutes() {
  return walkHtml(BUILT_APP_ROOT)
    .map((file) => {
      const relative = path.relative(BUILT_APP_ROOT, file).split(path.sep).join("/");
      if (relative === "index.html") return "/";
      return `/${relative.replace(/\.html$/, "")}`;
    })
    .filter((route) => route !== "/_not-found" && route !== "/blog")
    .sort();
}

function policyFor(route) {
  if (/^\/insights\/[^/]+$/.test(route)) {
    return { checkCompoundHyphens: false, checkStockPhrases: false };
  }
  if (/^\/insights\/topic\//.test(route) || /^\/glossary\//.test(route)) {
    return { checkCompoundHyphens: false, checkStockPhrases: true };
  }
  return { checkCompoundHyphens: true, checkStockPhrases: true };
}

async function waitForServer() {
  for (let attempt = 0; attempt < 60; attempt += 1) {
    try {
      const response = await fetch(ORIGIN, { redirect: "manual" });
      if (response.status < 500) return;
    } catch {}
    await wait(200);
  }
  throw new Error("The production server did not become ready for rendered copy inspection.");
}

async function main() {
  const routes = discoverRoutes();
  const server = spawn(
    path.join(ROOT, "node_modules", ".bin", "next"),
    ["start", "--hostname", "127.0.0.1", "--port", String(PORT)],
    { cwd: ROOT, env: { ...process.env, PORT: String(PORT) }, stdio: "ignore" },
  );

  const findings = [];
  try {
    await waitForServer();
    for (const route of routes) {
      const response = await fetch(`${ORIGIN}${route}`);
      if (!response.ok) {
        findings.push({ route, issue: `HTTP ${response.status}`, copy: "Route did not render." });
        continue;
      }
      const text = visibleText(await response.text());
      const policy = policyFor(route);
      const dash = policy.checkCompoundHyphens
        ? /[—–]|[A-Za-z0-9]-[A-Za-z0-9]/g
        : /[—–]/g;
      for (const match of text.matchAll(dash)) {
        findings.push({ route, issue: "dash or hyphen", copy: context(text, match.index, match[0].length) });
      }
      if (policy.checkStockPhrases) {
        for (const pattern of STOCK_PATTERNS) {
          const match = pattern.exec(text);
          if (match) {
            findings.push({ route, issue: `stock phrase ${pattern}`, copy: context(text, match.index, match[0].length) });
          }
        }
      }
    }
  } finally {
    server.kill("SIGTERM");
  }

  if (findings.length) {
    console.error("Rendered copy gate failed:\n");
    for (const finding of findings) {
      console.error(`${finding.route}  ${finding.issue}\n  ${finding.copy}\n`);
    }
    process.exit(1);
  }

  console.log(`Rendered copy gate passed across ${routes.length} generated website routes.`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
