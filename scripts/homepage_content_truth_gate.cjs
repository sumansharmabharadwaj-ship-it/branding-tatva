const fs = require("node:fs");
const path = require("node:path");

const root = path.resolve(__dirname, "..");
const read = (relative) => fs.readFileSync(path.join(root, relative), "utf8");
const studio = read("src/sections/Home/StudioCinematicChapter.tsx");
const invitation = read("src/sections/Home/FinalInvitation.tsx");
const site = read("src/data/site.ts");
const contact = read("src/app/contact/page.tsx");
const audio = read("src/components/AmbientAudio.tsx");
const questions = read("src/sections/Home/HomeQuestionsScene.tsx");
const faqs = read("src/data/faqs.ts");
const experience = read("src/sections/HomeV4/HomeV4Experience.tsx");
const invitationCss = read("src/app/home-v4-invitation-cinematic-final.css");
const invitationLivingCss = read("src/app/home-v4-invitation-living-final.css");
const paths = read("src/sections/Home/PathsCinematicChapter.tsx");
const process = read("src/sections/Process/RootSystem.tsx");
const diagnostic = read("src/sections/Home/HomeBrandHealthCheck.tsx");
const evidence = read("src/sections/Home/EvidenceWall.tsx");
const methodCss = read("src/app/home-v4-process-living-final.css");

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

assert(!/M\.A\. Clinical Psychology|B\.A\.(?: Hons)? English Literature/.test(studio), "Pending exact degree wording returned to Home.");
assert(studio.includes('credential: "Applied psychology"') && studio.includes('credential: "Applied literature"'), "Claim-safe applied disciplines are missing.");
assert(invitation.includes('import { consultation } from "@/data/site"'), "Final invitation duplicates the consultation contract.");
assert(invitation.includes("consultation.actionLabel") && invitation.includes("consultation.minutes"), "Final invitation hardcodes duration or action copy.");
assert(!/three decisions|Commit the position|Build the first system|We will/i.test(invitation), "Final invitation promises completed strategy work on the first call.");
assert(invitation.includes("SERVICES_SITUATION_STORAGE_KEY") && invitation.includes("window.localStorage.getItem"), "The closing invitation forgets a deliberately chosen service path.");
assert(invitation.includes('detail?.origin === "home_diagnostic" || detail?.origin === "home_paths"'), "The closing invitation does not distinguish deliberate homepage choices from unrelated service events.");
assert(!invitation.includes("Your diagnosis"), "The closing invitation overstates a selected path as a completed diagnosis.");
assert((invitation.match(/\bthanks:/g) || []).length >= 5 && invitation.includes("{invitation.thanks}"), "Final invitation no longer closes with path-aware gratitude.");
assert(invitation.includes('className="final-invitation__thread"') && invitation.includes('aria-hidden="true"'), "Final invitation has lost its quiet, decorative decision thread.");
assert(site.includes("consultationMinutes: 30") && site.includes("export const consultation"), "Canonical consultation contract is missing.");
const bookingAction = contact.indexOf("<ContactBookingAction");
for (const marker of [
  "Direct with the founder",
  "site.consultationMinutes",
  "consultation.preparation",
  "share the clearest next move I can see",
]) {
  const index = contact.indexOf(marker);
  assert(index >= 0 && index < bookingAction, `Contact booking fact must precede the scheduling action: ${marker}`);
}
assert(audio.includes("h-11 w-11"), "Ambient audio control is smaller than 44 by 44 pixels.");
assert(!/strategize/.test(`${questions}\n${faqs}`), "Homepage FAQ has drifted from the site's British spelling system.");
assert(!questions.includes("↗"), "Homepage FAQ uses an external-link arrow for an internal control or route.");
assert(questions.includes('href="#invitation"'), "Practical answers no longer continue into the closing invitation.");
assert(!questions.includes('href="/contact#write"'), "Practical answers bypass the closing decision scene.");
assert(questions.includes("SITUATION_TO_QUESTION") && questions.includes("SERVICES_SITUATION_EVENT"), "Practical answers no longer respond to the visitor's chosen brand situation.");
assert(questions.includes('event.pointerType === "mouse"'), "Practical-answer hover can consume touch gestures.");
assert(questions.includes("matchedToSituation") && questions.includes("active.signal"), "Practical answers no longer help the visitor self-qualify from their chosen path.");
assert(!faqs.includes("Brand Beginning work") && !faqs.includes("Brand Elevation work"), "Homepage practical answers restored retired offer names.");
assert(faqs.includes("The exact implementation depends on the agreed scope."), "Homepage practical answers overstate implementation beyond the agreed scope.");
assert(!studio.includes("↗"), "Studio proof uses an external-link arrow for an internal route.");
assert(!paths.includes("↗"), "Service path uses an external-link arrow for an internal route.");
assert(!diagnostic.includes("↗"), "Diagnostic result uses an external-link arrow for an internal route.");
assert(diagnostic.includes('href="#evidence"'), "Diagnostic no longer carries its result into client proof.");
assert(!diagnostic.includes("Take the quiz again"), "Diagnostic restored a redundant restart action beside answer review.");
assert(evidence.includes("SITUATION_TO_PROOF_SLUG") && evidence.includes("SERVICES_SITUATION_EVENT"), "Client proof no longer responds to the visitor's chosen brand situation.");
assert(evidence.includes("projectsForSituation") && evidence.includes("Matched proof"), "Client proof no longer prioritises or labels the most relevant real case.");
assert(evidence.includes("project.slug !== primary.slug"), "Client proof can repeat its matched case in the supporting evidence index.");
assert(evidence.includes("herbalcart") && evidence.includes("Delivered campaign reset"), "Repositioning proof is missing its factual delivered-work boundary.");
assert(evidence.includes('href="#paths"'), "Client proof no longer hands the visitor into a matched service path.");
assert(paths.includes('href="#process"'), "The chosen service path no longer continues into the working method.");
assert(paths.includes("publishSituation(active.situation)"), "The service-path handoff loses the visitor's chosen situation.");
assert(process.includes("SITUATION_TO_STAGE") && process.includes("SERVICES_SITUATION_EVENT"), "The working method no longer opens at the decision relevant to the chosen path.");
assert(experience.includes("rgba(238,224,198,0.88) 100%"), "Final invitation loses its reading surface over the dark film edge.");
assert(/final-invitation__promise > p:first-child\s*\{[^}]*font-size: 0\.75rem/.test(invitationCss), "Final invitation utility text has returned below its readable size.");
assert(invitationLivingCss.includes("var(--invitation-accent)"), "Final invitation no longer carries the selected path into its visual language.");
assert(methodCss.includes("background: rgba(28, 47, 37, .68);"), "Method selector has lost its stable contrast surface.");
assert(methodCss.includes("font-size: clamp(.875rem, 1vw, 1rem);"), "Method supporting copy has returned below its desktop reading size.");

console.log("Homepage content truth gate passed: claim boundaries, honest call promise, booking facts, navigation grammar, invitation legibility, and audio target verified.");
