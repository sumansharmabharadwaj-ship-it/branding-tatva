import { NextRequest } from "next/server";
import { newsletterSchema } from "@/lib/newsletter-schema";
import {
  fetchWithTimeout,
  jsonNoStore,
  readGuardedJsonRequest,
} from "@/lib/api-protection";

export const runtime = "nodejs";

export async function POST(request: NextRequest) {
  const { response: guarded, body } = await readGuardedJsonRequest(request, {
    scope: "newsletter",
    limit: 8,
  });
  if (guarded) return guarded;

  const parsed = newsletterSchema.safeParse(body);
  if (!parsed.success) {
    return jsonNoStore(
      { error: "That looks like it might have a typo, mind checking it?" },
      { status: 422 },
    );
  }

  if (parsed.data.company_website) {
    return jsonNoStore({ ok: true });
  }

  if (
    (parsed.data.source === "recognition-audit" || parsed.data.source === "project-map") &&
    parsed.data.consent !== true
  ) {
    return jsonNoStore(
      { error: "Please confirm the consent box first." },
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
        error: "Subscription delivery is temporarily unavailable. Please try again later.",
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
          email_address: parsed.data.email.toLowerCase(),
          status: "pending",
          ...(parsed.data.firstName
            ? { merge_fields: { FNAME: parsed.data.firstName } }
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
      { error: "Something went wrong. Please try again.", requestId },
      { status: 502 },
    );
  } catch (error) {
    console.error(`[newsletter:${requestId}] Signup error:`, error);
    return jsonNoStore(
      { error: "Something went wrong. Please try again.", requestId },
      { status: 500 },
    );
  }
}
