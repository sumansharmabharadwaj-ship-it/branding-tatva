const RESEND_EMAILS_URL = "https://api.resend.com/emails";

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
