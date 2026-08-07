#!/usr/bin/env node

const fs = require("node:fs");
const path = require("node:path");

const ROOT = path.resolve(__dirname, "..");
const SRC = path.join(ROOT, "src");
const EXPECTED_PHONE_E164 = "+918447725381";
const EXPECTED_PHONE_DISPLAY = "+91 84477 25381";
const EXPECTED_DURATION = 30;

function walk(directory) {
  return fs.readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const absolute = path.join(directory, entry.name);
    if (entry.isDirectory()) return walk(absolute);
    return [absolute];
  });
}

function relative(file) {
  return path.relative(ROOT, file).replaceAll(path.sep, "/");
}

function fail(message) {
  console.error(`[contact-contract] ${message}`);
  process.exitCode = 1;
}

const sourceFiles = walk(SRC).filter((file) => /\.(?:ts|tsx|js|jsx|json|md|css)$/.test(file));
const source = new Map(
  sourceFiles.map((file) => [relative(file), fs.readFileSync(file, "utf8")]),
);

const contradictoryDuration = [
  /\b20[ -]?minute\b/gi,
  /\btwenty[ -]?minute\b/gi,
];

for (const [file, content] of source) {
  for (const pattern of contradictoryDuration) {
    const matches = [...content.matchAll(pattern)];
    if (matches.length) {
      fail(`${file} contains obsolete consultation wording: ${matches.map((match) => match[0]).join(", ")}`);
    }
  }
}

const siteFile = source.get("src/data/site.ts") || "";
const contactPage = source.get("src/app/contact/page.tsx") || "";
const calendly = source.get("src/components/CalendlyEmbed.tsx") || "";

if (!siteFile.includes(EXPECTED_PHONE_E164)) {
  fail(`src/data/site.ts must contain the canonical E.164 phone ${EXPECTED_PHONE_E164}`);
}
if (!siteFile.includes(EXPECTED_PHONE_DISPLAY)) {
  fail(`src/data/site.ts must contain the readable phone ${EXPECTED_PHONE_DISPLAY}`);
}
if (!new RegExp(`consultationMinutes\\s*:\\s*${EXPECTED_DURATION}\\b`).test(siteFile)) {
  fail(`src/data/site.ts must centralize consultationMinutes: ${EXPECTED_DURATION}`);
}
if (!/tel:\$?\{?[^\n]*(?:phone|contact)/i.test(contactPage) && !contactPage.includes("phoneHref")) {
  fail("Contact page must expose a tap-to-call path from centralized contact data.");
}
if (!/whatsapp|wa\.me/i.test(contactPage)) {
  fail("Contact page must expose a WhatsApp path.");
}
if (!/30\s*(?:minute|min)/i.test(contactPage + calendly)) {
  fail("The contact or booking experience must state the 30-minute duration.");
}
if (!/CalendlyEmbed/.test(contactPage)) {
  fail("Contact page must retain the Calendly booking path.");
}
if (!/ContactForm/.test(contactPage)) {
  fail("Contact page must retain the written-enquiry path.");
}

if (!process.exitCode) {
  console.log(
    JSON.stringify(
      {
        result: "passed",
        phoneE164: EXPECTED_PHONE_E164,
        phoneDisplay: EXPECTED_PHONE_DISPLAY,
        consultationMinutes: EXPECTED_DURATION,
        sourceFilesChecked: source.size,
      },
      null,
      2,
    ),
  );
}
