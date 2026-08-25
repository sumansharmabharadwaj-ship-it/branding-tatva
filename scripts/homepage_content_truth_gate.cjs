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

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

assert(!/M\.A\. Clinical Psychology|B\.A\.(?: Hons)? English Literature/.test(studio), "Pending exact degree wording returned to Home.");
assert(studio.includes('credential: "Applied psychology"') && studio.includes('credential: "Applied literature"'), "Claim-safe applied disciplines are missing.");
assert(invitation.includes('import { consultation } from "@/data/site"'), "Final invitation duplicates the consultation contract.");
assert(invitation.includes("consultation.actionLabel") && invitation.includes("consultation.minutes"), "Final invitation hardcodes duration or action copy.");
assert(!/three decisions|Commit the position|Build the first system|We will/i.test(invitation), "Final invitation promises completed strategy work on the first call.");
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
assert(!studio.includes("↗"), "Studio proof uses an external-link arrow for an internal route.");

console.log("Homepage content truth gate passed: claim boundaries, honest call promise, booking facts, navigation grammar, and audio target verified.");
