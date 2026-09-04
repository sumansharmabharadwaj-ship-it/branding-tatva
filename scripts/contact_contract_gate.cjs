#!/usr/bin/env node

const fs = require("node:fs");
const path = require("node:path");

const ROOT = path.resolve(__dirname, "..");
const SRC = path.join(ROOT, "src");
const CONTRACT_VERSION = 14;
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
const contactMonitorRoute = source.get("src/app/api/cron/contact-delivery/route.ts") || "";
const contactVerificationRoute = source.get("src/app/api/verification/route.ts") || "";
const contactDelivery = source.get("src/lib/contact-delivery.ts") || "";
const contactReadiness = source.get("src/lib/contact-readiness.ts") || "";
const vercelConfig = fs.readFileSync(path.join(ROOT, "vercel.json"), "utf8");
const envExample = fs.readFileSync(path.join(ROOT, ".env.example"), "utf8");
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
if (!contactRoute.includes('"contact_delivery_accepted"')) {
  fail("Contact delivery must emit structured success evidence.");
}
if (!contactRoute.includes('"contact_delivery_rejected"')) {
  fail("Contact delivery must emit structured provider-failure evidence.");
}
if (contactRoute.includes("providerBody.slice")) {
  fail("Contact runtime logs must not include raw provider response bodies.");
}
if (!contactDelivery.includes('"Idempotency-Key"')) {
  fail("Contact delivery must send a Resend idempotency key.");
}
if (!/response\.ok\s*&&\s*deliveryId/.test(contactDelivery)) {
  fail("Contact delivery must verify a provider delivery ID before reporting success.");
}
if (!contactDelivery.includes("delivered+branding-tatva-contact@resend.dev")) {
  fail("Contact provider monitoring must use Resend's designated test recipient.");
}
if (!contactMonitorRoute.includes('`Bearer ${cronSecret}`')) {
  fail("Contact provider monitoring must require the Vercel cron secret.");
}
if (!contactMonitorRoute.includes("probeContactDeliveryProvider")) {
  fail("Contact provider monitoring must exercise the tested delivery boundary.");
}
if (!contactMonitorRoute.includes('status: "degraded"')) {
  fail("Contact provider monitoring must report provider failures truthfully.");
}
if (!vercelConfig.includes('"path": "/api/cron/contact-delivery"')) {
  fail("Vercel must schedule the authenticated Contact provider monitor.");
}
if (!/^CRON_SECRET=$/m.test(envExample)) {
  fail("The server environment contract must document the Contact cron secret.");
}
if (!contactVerificationRoute.includes("getContactReadiness()")) {
  fail("Public release verification must expose the secrets-free Contact readiness contract.");
}
if (!contactVerificationRoute.includes("jsonNoStore")) {
  fail("Public Contact readiness must never be cached.");
}
if (!contactReadiness.includes('rateLimitScope: CONTACT_RATE_LIMIT_SCOPE')) {
  fail("Contact readiness must report the serverless rate-limit scope truthfully.");
}
if (!contactReadiness.includes('CONTACT_RATE_LIMIT_SCOPE = "instance-local"')) {
  fail("Contact readiness must not describe process-local throttling as distributed protection.");
}
if (/apiKey|toEmail|cronSecret/i.test(contactVerificationRoute)) {
  fail("Public Contact readiness must not serialize delivery configuration values.");
}
if (!contactGratitude.includes('role="progressbar"')) {
  fail("Contact gratitude must expose acknowledgement progress.");
}
if (!contactGratitude.includes('event.key === "Escape"')) {
  fail("Contact gratitude must let keyboard visitors close an active acknowledgement.");
}
if (!contactGratitude.includes("event.currentTarget.contains(document.activeElement)")) {
  fail("Contact gratitude hover must preserve keyboard focus across the acknowledgement group.");
}
if (!contactGratitude.includes('data-contact-gratitude-flow="continuous"')) {
  fail("Contact gratitude must keep pointer movement continuous across acknowledgements.");
}
if (!contactGratitude.includes('event.key === "ArrowDown"')) {
  fail("Contact gratitude acknowledgements must support arrow-key movement.");
}
if (!contactGratitude.includes("selectedNote")) {
  fail("Contact gratitude must keep click and touch selections open until dismissed.");
}
if (!contactGratitude.includes('data-contact-gratitude-next')) {
  fail("Contact gratitude must expose its onward routes.");
}
if (!contactGratitude.includes('href="/insights"')) {
  fail("Contact gratitude must offer a useful reading route.");
}
if (!contactGratitude.includes('href="#call"')) {
  fail("Contact gratitude must keep the booking route available.");
}
if (!contactGratitude.includes('aria-hidden="false"')) {
  fail("Contact gratitude onward routes must remain available without a completion gate.");
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
if (
  !contactForm.includes('window.addEventListener("pagehide", persistLatestDraft)') ||
  !contactForm.includes('document.addEventListener("visibilitychange", persistWhenHidden)')
) {
  fail("Contact drafts must flush before a tab is backgrounded or released.");
}
if (!contactForm.includes("data-contact-draft-announcement")) {
  fail("Restored Contact drafts must retain a focused assistive announcement.");
}
if (!contactForm.includes("moveToNextRequiredField")) {
  fail("Contact's primary fields must retain their mobile keyboard progression.");
}
if (!contactForm.includes('data-contact-mobile-next="email"')) {
  fail("The Contact name field must advance mobile keyboards to email without submitting early.");
}
if (!contactForm.includes('data-contact-mobile-next="description"')) {
  fail("The Contact email field must advance mobile keyboards to the enquiry without submitting early.");
}
if (!contactForm.includes('event.nativeEvent.isComposing')) {
  fail("Contact keyboard progression must preserve in-progress input method composition.");
}
if (/data-contact-draft-status[\s\S]{0,180}aria-live=/.test(contactForm)) {
  fail("Routine Contact draft saving must not repeatedly interrupt assistive technology.");
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
