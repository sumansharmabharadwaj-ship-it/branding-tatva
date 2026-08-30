#!/usr/bin/env node

import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { createRequire } from "node:module";

const require = createRequire(import.meta.url);
const ts = require("typescript");
const deliverySource = fs.readFileSync(
  path.resolve("src/lib/contact-delivery.ts"),
  "utf8",
);
const compiled = ts.transpileModule(deliverySource, {
  compilerOptions: {
    module: ts.ModuleKind.CommonJS,
    target: ts.ScriptTarget.ES2020,
  },
  fileName: "contact-delivery.ts",
  reportDiagnostics: true,
});
const compileErrors = (compiled.diagnostics || []).filter(
  (diagnostic) => diagnostic.category === ts.DiagnosticCategory.Error,
);
assert.deepEqual(
  compileErrors,
  [],
  "Contact delivery helper must transpile for the runtime gate.",
);

const deliveryModule = { exports: {} };
const loadDeliveryModule = new Function(
  "exports",
  "module",
  "require",
  compiled.outputText,
);
loadDeliveryModule(
  deliveryModule.exports,
  deliveryModule,
  require,
);
const {
  CONTACT_DELIVERY_MONITOR_RECIPIENT,
  deliverContactEnquiry,
  probeContactDeliveryProvider,
} = deliveryModule.exports;

const submissionId = "123e4567-e89b-42d3-a456-426614174000";
const request = {
  apiKey: "resend_test_key",
  fromEmail: "Branding Tatva <contact@brandingtatva.com>",
  toEmail: "suman@brandingtatva.com",
  replyTo: "visitor@example.com",
  subject: "Branding Tatva enquiry · Visitor",
  text: "A test enquiry body.",
  submissionId,
};

const capturedRequests = [];
const accepted = await deliverContactEnquiry(request, async (url, init) => {
  capturedRequests.push({ url, init });
  return new Response(JSON.stringify({ id: "  email_delivery_123  " }), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
});

assert.deepEqual(accepted, {
  ok: true,
  deliveryId: "email_delivery_123",
});
assert.equal(capturedRequests.length, 1);
assert.equal(capturedRequests[0].url, "https://api.resend.com/emails");
assert.equal(capturedRequests[0].init.method, "POST");

const acceptedHeaders = new Headers(capturedRequests[0].init.headers);
assert.equal(acceptedHeaders.get("Authorization"), "Bearer resend_test_key");
assert.equal(acceptedHeaders.get("Content-Type"), "application/json");
assert.equal(
  acceptedHeaders.get("Idempotency-Key"),
  `contact-enquiry-${submissionId}`,
);
assert.deepEqual(JSON.parse(capturedRequests[0].init.body), {
  from: request.fromEmail,
  to: [request.toEmail],
  reply_to: request.replyTo,
  subject: request.subject,
  text: request.text,
});

const retryKeys = [];
const retryFetcher = async (_url, init) => {
  retryKeys.push(new Headers(init.headers).get("Idempotency-Key"));
  return new Response(JSON.stringify({ id: "email_retry_123" }), {
    status: 200,
  });
};
await deliverContactEnquiry(request, retryFetcher);
await deliverContactEnquiry(request, retryFetcher);
assert.deepEqual(retryKeys, [
  `contact-enquiry-${submissionId}`,
  `contact-enquiry-${submissionId}`,
]);

const missingDeliveryId = await deliverContactEnquiry(
  request,
  async () => new Response(JSON.stringify({}), { status: 200 }),
);
assert.equal(missingDeliveryId.ok, false);
assert.equal(missingDeliveryId.providerStatus, 200);

const rejected = await deliverContactEnquiry(
  request,
  async () => new Response("rate limited", { status: 429 }),
);
assert.deepEqual(rejected, {
  ok: false,
  providerBody: "rate limited",
  providerStatus: 429,
});

const unreadable = await deliverContactEnquiry(request, async () => ({
  ok: true,
  status: 200,
  text: async () => {
    throw new Error("body unavailable");
  },
}));
assert.deepEqual(unreadable, {
  ok: false,
  providerBody: "Unknown delivery error",
  providerStatus: 200,
});

await assert.rejects(
  deliverContactEnquiry(request, async () => {
    throw new Error("network unavailable");
  }),
  /network unavailable/,
);

const monitorRequests = [];
const monitorFetcher = async (url, init) => {
  monitorRequests.push({ url, init });
  return new Response(JSON.stringify({ id: "monitor_delivery_123" }), {
    status: 200,
  });
};
const monitorRequest = {
  apiKey: "resend_monitor_key",
  fromEmail: "Branding Tatva <contact@brandingtatva.com>",
  replyTo: "suman@brandingtatva.com",
  scope: "preview/unsafe characters",
};
const monitorDate = new Date("2026-08-30T23:59:00.000Z");

const monitorAccepted = await probeContactDeliveryProvider(
  monitorRequest,
  monitorFetcher,
  monitorDate,
);
await probeContactDeliveryProvider(monitorRequest, monitorFetcher, monitorDate);
await probeContactDeliveryProvider(
  monitorRequest,
  monitorFetcher,
  new Date("2026-08-31T00:01:00.000Z"),
);

assert.deepEqual(monitorAccepted, {
  ok: true,
  deliveryId: "monitor_delivery_123",
});
assert.equal(monitorRequests.length, 3);
const monitorBodies = monitorRequests.map(({ init }) => JSON.parse(init.body));
for (const body of monitorBodies) {
  assert.deepEqual(body.to, [CONTACT_DELIVERY_MONITOR_RECIPIENT]);
  assert.equal(body.to.includes(monitorRequest.replyTo), false);
  assert.match(body.text, /No visitor enquiry was submitted\./);
}
const monitorKeys = monitorRequests.map(({ init }) =>
  new Headers(init.headers).get("Idempotency-Key"),
);
assert.equal(monitorKeys[0], monitorKeys[1]);
assert.notEqual(monitorKeys[1], monitorKeys[2]);
assert.match(monitorKeys[0], /provider-monitor-preview-unsafe-characters-2026-08-30$/);

console.log(
  JSON.stringify(
    {
      result: "passed",
      providerAcceptance: true,
      providerIdRequired: true,
      stableRetryKey: true,
      providerRejection: true,
      unreadableResponse: true,
      networkFailure: true,
      syntheticRecipientIsolated: true,
      monitorRetryKeyStablePerUtcDay: true,
      monitorRetryKeyRotatesNextUtcDay: true,
    },
    null,
    2,
  ),
);
