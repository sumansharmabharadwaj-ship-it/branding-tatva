#!/usr/bin/env node

const fs = require("node:fs");
const path = require("node:path");

const BASE_URL = (
  process.env.PREVIEW_URL ||
  "https://branding-tatva-git-august-8-isolated-suman22.vercel.app"
).replace(/\/$/, "");
const OUTPUT_DIR = path.resolve(
  process.env.API_OUTPUT_DIR || "artifacts/form-api-runtime-gate",
);
const REQUEST_TIMEOUT_MS = Number(process.env.REQUEST_TIMEOUT_MS || 20_000);
const bypassSecret = (process.env.VERCEL_AUTOMATION_BYPASS_SECRET || "").trim();

function protectionHeaders() {
  if (!bypassSecret) return {};
  return {
    "x-vercel-protection-bypass": bypassSecret,
    "x-vercel-set-bypass-cookie": "true",
  };
}

async function request(pathname, init = {}) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);
  try {
    const response = await fetch(`${BASE_URL}${pathname}`, {
      redirect: "manual",
      ...init,
      signal: controller.signal,
      headers: {
        "User-Agent": "branding-tatva-api-runtime-gate",
        ...protectionHeaders(),
        ...(init.headers || {}),
      },
    });
    const text = await response.text();
    let body = null;
    try {
      body = JSON.parse(text);
    } catch {
      // Non-JSON rejection bodies remain valid evidence for method guards.
    }
    return {
      status: response.status,
      contentType: response.headers.get("content-type") || "",
      cacheControl: response.headers.get("cache-control") || "",
      location: response.headers.get("location") || "",
      bodyPreview: text.slice(0, 500),
      body,
    };
  } finally {
    clearTimeout(timer);
  }
}

async function main() {
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });
  const checks = [
    {
      name: "Contact GET is rejected",
      actual: await request("/api/contact"),
      allowedStatuses: [404, 405],
    },
    {
      name: "Contact text/plain is rejected",
      actual: await request("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "text/plain" },
        body: "hello",
      }),
      allowedStatuses: [400, 415],
    },
    {
      name: "Contact malformed JSON is rejected",
      actual: await request("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: "{",
      }),
      allowedStatuses: [400, 422],
    },
    {
      name: "Contact empty payload is rejected",
      actual: await request("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: "{}",
      }),
      allowedStatuses: [400, 422],
    },
    {
      name: "Contact oversized payload is rejected",
      actual: await request("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: "x".repeat(80_000),
          email: "nobody@example.com",
          message: "x".repeat(80_000),
        }),
      }),
      allowedStatuses: [400, 413, 422],
    },
    {
      name: "Newsletter GET is rejected",
      actual: await request("/api/newsletter"),
      allowedStatuses: [404, 405],
    },
    {
      name: "Newsletter text/plain is rejected",
      actual: await request("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "text/plain" },
        body: "hello",
      }),
      allowedStatuses: [400, 415],
    },
    {
      name: "Newsletter empty payload is rejected",
      actual: await request("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: "{}",
      }),
      allowedStatuses: [400, 422],
    },
    {
      name: "Release endpoint is uncached",
      actual: await request("/api/release"),
      allowedStatuses: [200],
      expectNoStore: true,
    },
    {
      name: "Verification endpoint is uncached",
      actual: await request("/api/verification"),
      allowedStatuses: [200],
      expectNoStore: true,
      expectContactReadiness: true,
    },
    {
      name: "Contact delivery monitor fails closed without cron authorization",
      actual: await request("/api/cron/contact-delivery"),
      allowedStatuses: [401, 503],
      expectNoStore: true,
      forbidSuccess: true,
    },
  ];

  const failures = [];
  for (const check of checks) {
    if (!check.allowedStatuses.includes(check.actual.status)) {
      failures.push(`${check.name}: HTTP ${check.actual.status}`);
    }
    if (
      check.expectNoStore &&
      !/no-store|no-cache/i.test(check.actual.cacheControl)
    ) {
      failures.push(
        `${check.name}: cache-control is ${check.actual.cacheControl || "missing"}`,
      );
    }
    if (check.forbidSuccess && /\"ok\"\s*:\s*true/.test(check.actual.bodyPreview)) {
      failures.push(`${check.name}: returned a false success body`);
    }
    if (check.expectContactReadiness) {
      const contact = check.actual.body?.contact;
      if (
        typeof contact?.deliveryConfigured !== "boolean" ||
        typeof contact?.monitorConfigured !== "boolean" ||
        contact?.monitorSchedule !== "production-daily" ||
        contact?.rateLimitScope !== "instance-local"
      ) {
        failures.push(`${check.name}: Contact readiness contract is missing or misleading`);
      }
    }
  }

  const report = {
    result: failures.length ? "failed" : "passed",
    checkedAt: new Date().toISOString(),
    baseUrl: BASE_URL,
    deploymentProtectionBypassConfigured: Boolean(bypassSecret),
    checks,
    failures,
  };
  fs.writeFileSync(
    path.join(OUTPUT_DIR, "report.json"),
    JSON.stringify(report, null, 2),
  );
  console.log(JSON.stringify(report, null, 2));
  if (failures.length) process.exitCode = 1;
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
