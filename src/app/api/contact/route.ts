import { NextRequest } from "next/server";
import { contactSchema } from "@/lib/contact-schema";
import {
  fetchWithTimeout,
  jsonNoStore,
  readGuardedJsonRequest,
  singleLine,
} from "@/lib/api-protection";

export const runtime = "nodejs";

export async function POST(request: NextRequest) {
  const { response: guarded, body } = await readGuardedJsonRequest(request, {
    scope: "contact",
    limit: 5,
  });
  if (guarded) return guarded;

  const parsed = contactSchema.safeParse(body);
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
  const fromEmail = process.env.CONTACT_FROM_EMAIL?.trim();
  const requestId = crypto.randomUUID();

  if (!apiKey || !toEmail || !fromEmail) {
    console.error(`[contact:${requestId}] Verified enquiry delivery is not configured.`);
    return jsonNoStore(
      {
        error: "The enquiry form is temporarily unavailable. Please try again later.",
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
      `Business: ${singleLine(data.business)}`,
      data.phone && `Phone: ${singleLine(data.phone)}`,
      data.website && `Website: ${singleLine(data.website)}`,
      data.brandStage && `Brand stage: ${singleLine(data.brandStage)}`,
      data.servicesNeeded && `Support considered: ${singleLine(data.servicesNeeded)}`,
      data.timeline && `Timing: ${singleLine(data.timeline)}`,
      data.budget && `Budget or range: ${singleLine(data.budget)}`,
      data.referral && `Found via: ${singleLine(data.referral)}`,
      "",
      "What is changing and what decision is waiting:",
      data.description.trim(),
    ]
      .filter(Boolean)
      .join("\n");

    const response = await fetchWithTimeout("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: fromEmail,
        to: [toEmail],
        reply_to: data.email,
        subject: `Branding Tatva enquiry · ${singleLine(data.name)}`,
        text,
      }),
    });

    if (!response.ok) {
      const deliveryError = await response.text().catch(() => "Unknown delivery error");
      console.error(`[contact:${requestId}] Resend failed:`, deliveryError.slice(0, 600));
      return jsonNoStore(
        {
          error: "Delivery failed. Please try again shortly.",
          requestId,
        },
        { status: 502 },
      );
    }

    return jsonNoStore({ ok: true, requestId });
  } catch (error) {
    console.error(`[contact:${requestId}] Submission error:`, error);
    return jsonNoStore(
      {
        error: "Something went wrong. Please try again.",
        requestId,
      },
      { status: 500 },
    );
  }
}
