#!/usr/bin/env node

const fs = require("node:fs");
const path = require("node:path");

const root = process.cwd();
const surfaces = [
  "src/app/contact/page.tsx",
  "src/components/ContactCallSequence.tsx",
  "src/components/ContactForm.tsx",
  "src/components/ContactPathways.tsx",
  "src/components/ContactServicesHandoff.tsx",
  "src/app/api/contact/route.ts",
];
const source = surfaces
  .map((file) => fs.readFileSync(path.join(root, file), "utf8"))
  .join("\n");

const genericPhrases = [
  "a clear next move",
  "clear place to land",
  "honest conversation",
  "start where the conversation feels natural",
  "what are you building?",
  "what feels unclear right now?",
  "something went wrong",
  "delivery failed",
  "longer than expected",
  "server was unreachable",
];

for (const phrase of genericPhrases) {
  if (source.toLowerCase().includes(phrase)) {
    console.error(`[contact-copy] generic phrase returned: ${phrase}`);
    process.exitCode = 1;
  }
}

for (const signal of ["positioning", "perception", "recognition"]) {
  if (!source.toLowerCase().includes(signal)) {
    console.error(`[contact-copy] missing Branding Tatva signal: ${signal}`);
    process.exitCode = 1;
  }
}

if (!process.exitCode) {
  console.log("[contact-copy] founder focused brand language verified.");
}
