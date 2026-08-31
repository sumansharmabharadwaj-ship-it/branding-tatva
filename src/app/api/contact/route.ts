import { NextRequest } from "next/server";
import { contactSchema } from "@/lib/contact-schema";
import {
  fetchWithTimeout,
  guardJsonRequest,
  jsonNoStore,
  readJsonBody,
  singleLine,
} from "@/lib/api-protection";
import { deliverContactEnquiry } from "@/lib/contact-delivery";
import { packages } from "@/data/services";

export const runtime = "nodejs";

const CONTACT_SUBMISSION_PATTERN =
  /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
const CONTACT_ROUTE = "/api/contact";

type ContactLogLevel = "info" | "error";

function contactLog(
  level: ContactLogLevel,
  event: string,
  fields: Record<string, unknown>,
) {
  const line = JSON.stringify({
    level,
    event,
    route: CONTACT_ROUTE,
    ...fields,
  });
  if (level === "error") console.error(line);
  else console.info(line);
}

function contactSubmissionId(request: NextRequest) {
  const candidate = request.headers.get("x-contact-submission")?.trim();
  return candidate && CONTACT_SUBMISSION_PATTERN.test(candidate)
    ? candidate
    : crypto.randomUUID();
}

export async function POST(request: NextRequest) {
  const startedAt = Date.now();
  const requestId = crypto.randomUUID();
  const logContext = {
    requestId,
    vercelRequestId: request.headers.get("x-vercel-id") || null,
  };
  contactLog("info", "contact_request_started", logContext);

  const guarded = guardJsonRequest(request, { scope: "contact", limit: 5 });
  if (guarded) {
    contactLog("info", "contact_request_rejected", {
      ...logContext,
      durationMs: Date.now() - startedAt,
      status: guarded.status,
      stage: "request_guard",
    });
    return guarded;
  }

  const body = await readJsonBody(request);
  if (!body.ok) {
    contactLog("info", "contact_request_rejected", {
      ...logContext,
      durationMs: Date.now() - startedAt,
      status: body.status,
      stage: "body_read",
    });
    return jsonNoStore({ error: body.error }, { status: body.status });
  }

  const parsed = contactSchema.safeParse(body.value);
  if (!parsed.success) {
    contactLog("info", "contact_request_rejected", {
      ...logContext,
      durationMs: Date.now() - startedAt,
      status: 422,
      stage: "validation",
    });
    return jsonNoStore(
      {
        error: "Please check the highlighted fields.",
        issues: parsed.error.flatten(),
      },
      { status: 422 },
    );
  }

  if (parsed.data.company_website) {
    contactLog("info", "contact_honeypot_accepted", {
      ...logContext,
      durationMs: Date.now() - startedAt,
    });
    return jsonNoStore({ ok: true });
  }

  const apiKey = process.env.RESEND_API_KEY?.trim();
  const toEmail = process.env.CONTACT_TO_EMAIL?.trim();
  const fromEmail =
    process.env.CONTACT_FROM_EMAIL?.trim() ||
    "Branding Tatva <contact@brandingtatva.com>";
  const submissionId = contactSubmissionId(request);

  if (!apiKey || !toEmail) {
    contactLog("error", "contact_delivery_unconfigured", {
      ...logContext,
      durationMs: Date.now() - startedAt,
      resendConfigured: Boolean(apiKey),
      destinationConfigured: Boolean(toEmail),
    });
    return jsonNoStore(
      {
        error:
          "The enquiry form is temporarily unavailable. Please email suman@brandingtatva.com directly.",
        requestId,
      },
      { status: 503 },
    );
  }

  try {
    const data = parsed.data;
    const selectedPackage = packages.find(
      (entry) => entry.slug === data.servicePackage,
    );
    const text = [
      `Request ID: ${requestId}`,
      `Name: ${singleLine(data.name)}`,
      `Email: ${singleLine(data.email)}`,
      data.phone && `Phone: ${singleLine(data.phone)}`,
      data.business && `Business: ${singleLine(data.business)}`,
      data.website && `Website: ${singleLine(data.website)}`,
      data.brandStage && `Brand stage: ${singleLine(data.brandStage)}`,
      data.servicesNeeded && `Services needed: ${singleLine(data.servicesNeeded)}`,
      data.budget && `Budget: ${singleLine(data.budget)}`,
      data.timeline && `Timeline: ${singleLine(data.timeline)}`,
      data.referral && `Found via: ${singleLine(data.referral)}`,
      selectedPackage && `Selected package: ${singleLine(selectedPackage.name)}`,
      "",
      "Project description:",
      data.description.trim(),
    ]
      .filter(Boolean)
      .join("\n");

    const delivery = await deliverContactEnquiry(
      {
        apiKey,
        fromEmail,
        toEmail,
        replyTo: data.email.trim(),
        subject: `Branding Tatva enquiry · ${singleLine(data.name)}`,
        text,
        submissionId,
      },
      fetchWithTimeout,
    );

    if (!delivery.ok) {
      contactLog("error", "contact_delivery_rejected", {
        ...logContext,
        durationMs: Date.now() - startedAt,
        providerStatus: delivery.providerStatus,
      });
      return jsonNoStore(
        {
          error: "The delivery provider did not accept the note. Try once more or email Suman directly.",
          requestId,
        },
        { status: 502 },
      );
    }

    contactLog("info", "contact_delivery_accepted", {
      ...logContext,
      durationMs: Date.now() - startedAt,
      deliveryId: delivery.deliveryId,
    });

    return jsonNoStore({ ok: true, requestId });
  } catch (error) {
    contactLog("error", "contact_delivery_failed", {
      ...logContext,
      durationMs: Date.now() - startedAt,
      error: error instanceof Error ? error.message : String(error),
    });
    return jsonNoStore(
      {
        error: "The delivery service returned no confirmation. Try once more or email Suman directly.",
        requestId,
      },
      { status: 500 },
    );
  }
}
