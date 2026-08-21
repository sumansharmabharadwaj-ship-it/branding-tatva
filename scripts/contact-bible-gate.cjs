const fs = require("node:fs");
const path = require("node:path");

const root = path.resolve(__dirname, "..");

function read(relativePath) {
  return fs.readFileSync(path.join(root, relativePath), "utf8");
}

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

const page = read("src/app/contact/page.tsx");
const form = read("src/components/ContactForm.tsx");
const schema = read("src/lib/contact-schema.ts");
const route = read("src/app/api/contact/route.ts");

assert(page.includes("What happens next"), "Contact page is missing the follow-up sequence.");
assert(page.includes("Suman reads the context"), "Contact page does not say who reads the enquiry.");
assert(page.includes("A useful starting fit"), "Contact page is missing fit guidance.");
assert(page.includes("Direct, private, pressure-free"), "Contact page is missing the trust summary.");
assert(page.includes("enquiryDeliveryReady"), "Contact form is not gated by verified delivery configuration.");
assert(page.includes("site.calendlyUrl ?"), "Calendar availability is not truthfully gated.");
assert(!page.includes("+91 84477 25381"), "Phone number was published before publication intent was verified.");
assert(!page.includes("20 minutes") && !page.includes("30 minutes"), "Unresolved session duration was published.");

for (const field of ["name", "email", "business", "description"]) {
  assert(form.includes(`register(\"${field}\")`), `Essential contact field ${field} is missing.`);
}
for (const field of ["timeline", "budget", "phone"]) {
  assert(form.includes(`register(\"${field}\")`), `Optional contact context ${field} is missing.`);
}
assert(form.includes("successRef.current?.focus"), "Contact confirmation does not receive focus.");
assert(form.includes("errorRef.current?.focus"), "Contact delivery errors do not receive focus.");
assert(form.includes("deliveryEnabled"), "Contact form can render without a verified delivery gate.");
assert(form.includes("Share this only if you would prefer a callback"), "Optional phone purpose is not explained.");

assert(schema.includes("business: z.string().trim().min(1"), "Company or brand is not required.");
assert(schema.includes("description:") && schema.includes(".max(5000)"), "Challenge field bounds are missing.");
assert(schema.includes("company_website: z.string().max(200)"), "Honeypot cannot survive validation.");

for (const key of ["RESEND_API_KEY", "CONTACT_TO_EMAIL", "CONTACT_FROM_EMAIL"]) {
  assert(route.includes(key), `Contact delivery does not require ${key}.`);
}
assert(route.includes("readGuardedJsonRequest"), "Contact API request guard is missing.");
assert(route.includes("fetchWithTimeout"), "Contact provider timeout is missing.");
assert(route.includes("requestId"), "Contact delivery is missing request traceability.");
assert(route.includes("return jsonNoStore({ ok: true, requestId })"), "Success is not tied to provider delivery.");

console.log("Contact Bible gate passed.");
