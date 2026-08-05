const BASE_URL = process.env.AUDIT_BASE_URL || "http://127.0.0.1:3000";

const validContact = {
  name: "Automated QA",
  email: "qa@example.com",
  description: "This three-field submission must pass validation and be swallowed by the honeypot.",
};

const checks = [
  {
    name: "contact rejects non-JSON requests",
    path: "/api/contact",
    init: {
      method: "POST",
      headers: { "Content-Type": "text/plain" },
      body: "{}",
    },
    status: 415,
  },
  {
    name: "contact rejects malformed JSON",
    path: "/api/contact",
    init: {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: "{",
    },
    status: 400,
  },
  {
    name: "contact returns field validation errors",
    path: "/api/contact",
    init: {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({}),
    },
    status: 422,
  },
  {
    name: "three-field contact honeypot exits before delivery",
    path: "/api/contact",
    init: {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...validContact, company_website: "https://bot.example" }),
    },
    status: 200,
    body: { ok: true },
  },
  {
    name: "newsletter rejects invalid addresses",
    path: "/api/newsletter",
    init: {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: "not-an-email", source: "newsletter" }),
    },
    status: 422,
  },
  {
    name: "recognition audit requires explicit consent",
    path: "/api/newsletter",
    init: {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: "qa@example.com",
        source: "recognition-audit",
        consent: false,
      }),
    },
    status: 422,
  },
  {
    name: "newsletter honeypot exits before Mailchimp",
    path: "/api/newsletter",
    init: {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: "qa@example.com",
        source: "newsletter",
        company_website: "https://bot.example",
      }),
    },
    status: 200,
    body: { ok: true },
  },
];

function matchesBody(actual, expected) {
  if (!expected) return true;
  return Object.entries(expected).every(([key, value]) => actual?.[key] === value);
}

async function main() {
  const failures = [];
  const results = [];

  for (const check of checks) {
    const response = await fetch(new URL(check.path, BASE_URL), check.init);
    const text = await response.text();
    let body = null;
    try {
      body = text ? JSON.parse(text) : null;
    } catch {
      body = null;
    }

    const noStore = response.headers.get("cache-control")?.includes("no-store") === true;
    const noSniff = response.headers.get("x-content-type-options") === "nosniff";
    const statusMatches = response.status === check.status;
    const bodyMatches = matchesBody(body, check.body);
    const passed = statusMatches && bodyMatches && noStore && noSniff;

    results.push({
      name: check.name,
      status: response.status,
      passed,
      noStore,
      noSniff,
    });

    if (!passed) {
      failures.push(
        `${check.name}: expected ${check.status}, got ${response.status}; no-store=${noStore}; nosniff=${noSniff}; body=${text.slice(0, 300)}`,
      );
    }
  }

  console.log("# Branding Tatva API contract gate");
  results.forEach((result) => {
    console.log(`- ${result.name}: ${result.passed ? "PASS" : "FAIL"} (${result.status})`);
  });
  console.log(`- Failures: ${failures.length}`);

  if (failures.length) {
    console.log("\n## Failures");
    failures.forEach((failure) => console.log(`- ${failure}`));
    process.exitCode = 1;
  }
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
