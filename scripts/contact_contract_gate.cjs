#!/usr/bin/env node

const fs = require("node:fs");
const path = require("node:path");

const ROOT = path.resolve(__dirname, "..");
const SRC = path.join(ROOT, "src");
const CONTRACT_VERSION = 10;
const EXPECTED_PHONE_E164 = "+918447725381";
const EXPECTED_PHONE_DISPLAY = "+91 84477 25381";
const EXPECTED_DURATION = 30;

// These are the visitor-facing surfaces that describe, open, or hand off to
// the consultation. Deliberately exclude editorial articles and utility-class
// source, where phrases such as "twenty minutes" or "min-h-20" can be valid
// and unrelated to the booking contract.
const BOOKING_SURFACES = [
  "src/app/contact/page.tsx",
  "src/app/services/page.tsx",
  "src/components/CalendlyEmbed.tsx",
  "src/components/SeasonalCalendarPanel.tsx",
  "src/sections/Home/FinalInvitation.tsx",
  "src/sections/Process/RootSystem.tsx",
  "src/sections/Services/StrategyRoomCTA.tsx",
];

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

function durationPhrasePattern(number, word, flags = "i") {
  return new RegExp(
    `\\b(?:${number}|${word})(?:\\s*-\\s*|\\s+)?(?:minute|min)s?\\b`,
    flags,
  );
}

const sourceFiles = walk(SRC).filter((file) => /\.(?:ts|tsx|js|jsx|json|md|css)$/.test(file));
const source = new Map(
  sourceFiles.map((file) => [relative(file), fs.readFileSync(file, "utf8")]),
);

for (const file of BOOKING_SURFACES) {
  const content = source.get(file);
  if (typeof content !== "string") {
    fail(`${file} is missing from the booking contract surface list.`);
    continue;
  }

  const matches = [...content.matchAll(durationPhrasePattern(20, "twenty", "gi"))];
  if (matches.length) {
    fail(
      `${file} contains obsolete consultation wording: ${matches
        .map((match) => match[0])
        .join(", ")}`,
    );
  }
}

const siteFile = source.get("src/data/site.ts") || "";
const contactPage = source.get("src/app/contact/page.tsx") || "";
const contactForm = source.get("src/components/ContactForm.tsx") || "";
const contactPathways = source.get("src/components/ContactPathways.tsx") || "";
const contactGratitude = source.get("src/components/ContactGratitude.tsx") || "";
const contactChapterRail = source.get("src/components/ContactChapterRail.tsx") || "";
const servicesContactPackageHook = source.get("src/hooks/useServicesContactPackage.ts") || "";
const contactCinematicCss = source.get("src/app/contact/contact-cinematic.css") || "";
const contactRoute = source.get("src/app/api/contact/route.ts") || "";
const contactDelivery = source.get("src/lib/contact-delivery.ts") || "";
const calendly = source.get("src/components/CalendlyEmbed.tsx") || "";
const contactExperience = `${contactPage}\n${calendly}`;

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

const literalDurationPattern = durationPhrasePattern(EXPECTED_DURATION, "thirty");
const centralizedDurationPattern =
  /\{?\s*(?:site\.)?consultationMinutes\s*\}?\s*(?:-\s*|\s+)?(?:minute|min)s?\b/i;
const durationEvidence = literalDurationPattern.test(contactExperience)
  ? "literal"
  : centralizedDurationPattern.test(contactExperience)
    ? "centralized"
    : null;

if (!durationEvidence) {
  fail(
    "The contact or booking experience must state the 30-minute duration, either literally or through site.consultationMinutes.",
  );
}
if (!/href=\{site\.calendlyUrl\}|<ContactBookingAction\b/.test(contactPage)) {
  fail("Contact page must retain the Calendly booking path.");
}
if (!/<ContactForm\b/.test(contactPage)) {
  fail("Contact page must retain the written-enquiry path.");
}
if (!contactForm.includes('"X-Contact-Submission"')) {
  fail("Contact form retries must keep a stable submission identity.");
}
if (!contactRoute.includes("deliverContactEnquiry")) {
  fail("Contact API route must use the tested delivery boundary.");
}
if (!contactDelivery.includes('"Idempotency-Key"')) {
  fail("Contact delivery must send a Resend idempotency key.");
}
if (!/response\.ok\s*&&\s*deliveryId/.test(contactDelivery)) {
  fail("Contact delivery must verify a provider delivery ID before reporting success.");
}
if (!contactGratitude.includes('role="progressbar"')) {
  fail("Contact gratitude must expose acknowledgement progress.");
}
if (!contactGratitude.includes('event.key === "Escape"')) {
  fail("Contact gratitude must let keyboard visitors close an active acknowledgement.");
}
if (!contactGratitude.includes("document.activeElement !== event.currentTarget")) {
  fail("Contact gratitude hover must preserve a keyboard-focused acknowledgement.");
}
if (!contactGratitude.includes('data-contact-gratitude-next')) {
  fail("Contact gratitude must expose its completed reading handoff.");
}
if (!contactGratitude.includes('href="/insights"')) {
  fail("Contact gratitude must offer a useful reading route after completion.");
}
if (!contactGratitude.includes("aria-hidden={!allNotesVisited}")) {
  fail("Contact gratitude reading route must stay hidden until completion.");
}
if (!contactGratitude.includes("tabIndex={allNotesVisited ? undefined : -1}")) {
  fail("Contact gratitude reading route must stay outside the tab order until completion.");
}
if (!contactChapterRail.includes("data-contact-chapter-status")) {
  fail("Contact chapter navigation must expose an assistive current-chapter status.");
}
if (!contactChapterRail.includes('aria-live="polite"')) {
  fail("Contact chapter status must announce chapter changes politely.");
}
if (!contactPage.includes("data-contact-hero-trust")) {
  fail("Contact hero must retain its concise booking reassurance.");
}
if (!contactPage.includes("data-contact-hero-direct")) {
  fail("Contact hero must expose direct call and WhatsApp routes without another scroll.");
}
if (!contactCinematicCss.includes("[data-contact-film] [data-contact-hero-trust] {")) {
  fail("Contact mobile hero reassurance must retain its compact treatment.");
}
if (
  /\[data-contact-film\]\s+\[data-contact-hero-aside\]\s*,\s*\[data-contact-film\]\s+\[data-contact-hero-trust\]\s*\{\s*display:\s*none/.test(
    contactCinematicCss,
  )
) {
  fail("Contact mobile hero must retain its concise booking reassurance.");
}
if (!contactForm.includes("data-contact-form-package-remove")) {
  fail("Carried service context must offer an explicit removal action.");
}
if (!contactForm.includes("data-contact-form-package-status")) {
  fail("Carried service removal must announce its result.");
}
if (!contactForm.includes("packageStatusRef.current?.focus({ preventScroll: true })")) {
  fail("Carried service removal must preserve keyboard focus.");
}
if (!contactForm.includes("clearServicesContactPackage()")) {
  fail("Contact form must clear carried service context through the shared boundary.");
}
if (!contactForm.includes("data-contact-success-destination")) {
  fail("Contact success must confirm where the reply will be sent.");
}
if (!contactForm.includes("Enquiry reference")) {
  fail("Contact success must expose a support reference when delivery returns one.");
}
if (!contactForm.includes("data-contact-recovery-copy")) {
  fail("Contact delivery recovery must let visitors preserve their full note outside the form.");
}
if (!contactForm.includes("Support needed:")) {
  fail("Contact email recovery must retain optional enquiry context.");
}
if (
  !contactPathways.includes("calendlyHrefForServicesPackage") ||
  !contactPathways.includes("href={bookingHref}")
) {
  fail("Every Contact booking pathway must retain carried service context.");
}
if (!contactPathways.includes("data-contact-pathway-package")) {
  fail("The Contact booking pathway must make carried service context visible.");
}
if (!servicesContactPackageHook.includes("window.history.replaceState")) {
  fail("Clearing carried service context must keep the visitor on the current Contact scene.");
}
if (!servicesContactPackageHook.includes('url.searchParams.delete("package")')) {
  fail("Clearing carried service context must remove it from the Contact URL.");
}
if (!servicesContactPackageHook.includes("SERVICES_CONTACT_PACKAGE_EVENT")) {
  fail("Contact surfaces must share carried service changes immediately.");
}
if (!servicesContactPackageHook.includes('window.addEventListener("popstate"')) {
  fail("Contact service context must follow browser history changes.");
}

if (!process.exitCode) {
  console.log(
    JSON.stringify(
      {
        result: "passed",
        contractVersion: CONTRACT_VERSION,
        phoneE164: EXPECTED_PHONE_E164,
        phoneDisplay: EXPECTED_PHONE_DISPLAY,
        consultationMinutes: EXPECTED_DURATION,
        durationEvidence,
        bookingSurfacesChecked: BOOKING_SURFACES.length,
        sourceFilesIndexed: source.size,
      },
      null,
      2,
    ),
  );
}
