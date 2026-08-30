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

export const runtime = "nodejs";

const CONTACT_SUBMISSION_PATTERN =
  /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

function contactSubmissionId(request: NextRequest) {
  const candidate = request.headers.get("x-contact-submission")?.trim();
  return candidate && CONTACT_SUBMISSION_PATTERN.test(candidate)
    ? candidate
    : crypto.randomUUID();
}

export async function POST(request: NextRequest) {
  const guarded = guardJsonRequest(request, { scope: "contact", limit: 5 });
  if (guarded) return guarded;

  const body = await readJsonBody(request);
  if (!body.ok) {
    return jsonNoStore({ error: body.error }, { status: body.status });
  }

  const parsed = contactSchema.safeParse(body.value);
  if (!parsed.success) {
    return jsonNoStore(
      {
        error: "Please check the highlighted fields.",
        issues: parsed.error.flatten(),
      },
      { status: 422 },
    );
  }

  if (parsed.data.company_website) {
    return jsonNoStore({ ok: true });
  }

  const apiKey = process.env.RESEND_API_KEY?.trim();
  const toEmail = process.env.CONTACT_TO_EMAIL?.trim();
  const fromEmail =
    process.env.CONTACT_FROM_EMAIL?.trim() ||
    "Branding Tatva <contact@brandingtatva.com>";
  const requestId = crypto.randomUUID();
  const submissionId = contactSubmissionId(request);

  if (!apiKey || !toEmail) {
    console.error(`[contact:${requestId}] Email delivery is not configured.`);
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
      console.error(
        `[contact:${requestId}] Resend rejected or returned no delivery ID:`,
        delivery.providerBody.slice(0, 600),
      );
      return jsonNoStore(
        {
          error: "Delivery failed. Please try again shortly or email Suman directly.",
          requestId,
        },
        { status: 502 },
      );
    }

    console.info(
      `[contact:${requestId}] Resend accepted delivery ${delivery.deliveryId}.`,
    );

    return jsonNoStore({ ok: true, requestId });
  } catch (error) {
    console.error(`[contact:${requestId}] Submission error:`, error);
    return jsonNoStore(
      {
        error: "Something went wrong. Please try again or email Suman directly.",
        requestId,
      },
      { status: 500 },
    );
  }
}
