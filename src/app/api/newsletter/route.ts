import { NextRequest } from "next/server";
import { newsletterSchema } from "@/lib/newsletter-schema";
import {
  fetchWithTimeout,
  guardJsonRequest,
  jsonNoStore,
} from "@/lib/api-protection";

export const runtime = "nodejs";

export async function POST(request: NextRequest) {
  const guarded = guardJsonRequest(request, { scope: "newsletter", limit: 8 });
  if (guarded) return guarded;

  const body = await request.json().catch(() => null);
  if (!body) {
    return jsonNoStore({ error: "The server could not read this request." }, { status: 400 });
  }

  const parsed = newsletterSchema.safeParse(body);
  if (!parsed.success) {
    return jsonNoStore(
      { error: "Check the email address. One character may be out of place." },
      { status: 422 },
    );
  }

  if (parsed.data.company_website) {
    return jsonNoStore({ ok: true });
  }

  if (
    (parsed.data.source === "recognition-audit" ||
      parsed.data.source === "project-map") &&
    parsed.data.consent !== true
  ) {
    return jsonNoStore(
      { error: "Tick the consent box before requesting the resource." },
      { status: 422 },
    );
  }

  const apiKey = process.env.MAILCHIMP_API_KEY?.trim();
  const audienceId = process.env.MAILCHIMP_AUDIENCE_ID?.trim();
  const serverPrefix = process.env.MAILCHIMP_SERVER_PREFIX?.trim();
  const requestId = crypto.randomUUID();

  if (!apiKey || !audienceId || !serverPrefix) {
    console.error(`[newsletter:${requestId}] Mailchimp delivery is not configured.`);
    return jsonNoStore(
      {
        error: "The letter signup cannot send confirmation emails right now. Return later.",
        requestId,
      },
      { status: 503 },
    );
  }

  try {
    const response = await fetchWithTimeout(
      `https://${serverPrefix}.api.mailchimp.com/3.0/lists/${audienceId}/members`,
      {
        method: "POST",
        headers: {
          Authorization: `Basic ${Buffer.from(`anystring:${apiKey}`).toString("base64")}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email_address: parsed.data.email.trim().toLowerCase(),
          status: "pending",
          ...(parsed.data.firstName
            ? { merge_fields: { FNAME: parsed.data.firstName.trim() } }
            : {}),
          ...(parsed.data.source ? { tags: [parsed.data.source] } : {}),
        }),
      },
    );

    if (response.ok) {
      return jsonNoStore({ ok: true, requestId });
    }

    const data = await response.json().catch(() => ({}));
    if (
      data &&
      typeof data === "object" &&
      "title" in data &&
      data.title === "Member Exists"
    ) {
      return jsonNoStore({ ok: true, alreadySubscribed: true, requestId });
    }

    console.error(`[newsletter:${requestId}] Mailchimp failed:`, data);
    return jsonNoStore(
      { error: "The letter request did not reach the mailing list. Send it once more.", requestId },
      { status: 502 },
    );
  } catch (error) {
    console.error(`[newsletter:${requestId}] Signup error:`, error);
    return jsonNoStore(
      { error: "The mailing list server did not answer. Send the request once more.", requestId },
      { status: 500 },
    );
  }
}
