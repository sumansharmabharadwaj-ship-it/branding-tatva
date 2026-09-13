const RESEND_EMAILS_URL = "https://api.resend.com/emails";

export const CONTACT_DELIVERY_MONITOR_RECIPIENT =
  "delivered+branding-tatva-contact@resend.dev";

type ContactDeliveryFetch = (
  input: string,
  init: RequestInit,
) => Promise<Response>;

export type ContactDeliveryRequest = {
  apiKey: string;
  fromEmail: string;
  toEmail: string;
  replyTo: string;
  subject: string;
  text: string;
  submissionId: string;
};

export type ContactDeliveryResult =
  | { ok: true; deliveryId: string }
  | { ok: false; providerBody: string; providerStatus: number };

type ContactDeliveryMonitorRequest = {
  apiKey: string;
  fromEmail: string;
  replyTo: string;
  scope: string;
};

function monitorScope(value: string) {
  const normalized = value
    .toLowerCase()
    .replace(/[^a-z0-9-]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 48);
  return normalized || "unknown";
}

export async function deliverContactEnquiry(
  request: ContactDeliveryRequest,
  fetcher: ContactDeliveryFetch,
): Promise<ContactDeliveryResult> {
  const response = await fetcher(RESEND_EMAILS_URL, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${request.apiKey}`,
      "Content-Type": "application/json",
      "Idempotency-Key": `contact-enquiry-${request.submissionId}`,
    },
    body: JSON.stringify({
      from: request.fromEmail,
      to: [request.toEmail],
      reply_to: request.replyTo,
      subject: request.subject,
      text: request.text,
    }),
  });

  const providerBody = await response
    .text()
    .catch(() => "Unknown delivery error");
  let deliveryId: string | null = null;

  if (response.ok) {
    try {
      const deliveryData: unknown = JSON.parse(providerBody);
      if (
        deliveryData &&
        typeof deliveryData === "object" &&
        "id" in deliveryData &&
        typeof deliveryData.id === "string" &&
        deliveryData.id.trim()
      ) {
        deliveryId = deliveryData.id.trim();
      }
    } catch {}
  }

  return response.ok && deliveryId
    ? { ok: true, deliveryId }
    : {
        ok: false,
        providerBody,
        providerStatus: response.status,
      };
}

/**
 * Exercises the real provider boundary with Resend's designated delivered
 * test recipient. No visitor payload or lead-inbox address is used as the
 * destination. The UTC day and deployment scope make retries idempotent while
 * allowing the next scheduled check to create fresh evidence.
 */
export function probeContactDeliveryProvider(
  request: ContactDeliveryMonitorRequest,
  fetcher: ContactDeliveryFetch,
  now = new Date(),
) {
  const utcDay = now.toISOString().slice(0, 10);
  const scope = monitorScope(request.scope);

  return deliverContactEnquiry(
    {
      apiKey: request.apiKey,
      fromEmail: request.fromEmail,
      toEmail: CONTACT_DELIVERY_MONITOR_RECIPIENT,
      replyTo: request.replyTo,
      subject: "Branding Tatva contact delivery monitor",
      text: [
        "Synthetic delivery probe.",
        "No visitor enquiry was submitted.",
        `Scope: ${scope}`,
        `UTC day: ${utcDay}`,
      ].join("\n"),
      submissionId: `provider-monitor-${scope}-${utcDay}`,
    },
    fetcher,
  );
}
