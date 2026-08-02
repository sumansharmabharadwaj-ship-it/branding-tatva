import { NextRequest, NextResponse } from "next/server";
import { newsletterSchema } from "@/lib/newsletter-schema";

// Mirrors /api/contact's own shape: validate, honeypot-check, then call
// the third-party API — falling back to a server-side log (not a hard
// failure) if the Mailchimp env vars aren't configured yet, same
// reasoning as CONTACT_TO_EMAIL/RESEND_API_KEY there.
//
// Subscribes with status "pending" rather than "subscribed" — per
// Mailchimp's own API docs, addresses added directly via the API
// (skipping their own signup-form UI) should go through the double
// opt-in confirmation email rather than being marked subscribed
// outright. That's also the safer default for a globally-visible site
// with no way to know which visitors are covered by consent rules
// that require it.

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => null);
  if (!body) {
    return NextResponse.json({ error: "Invalid submission." }, { status: 400 });
  }

  const parsed = newsletterSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "That looks like it might have a typo, mind checking it?" },
      { status: 422 }
    );
  }

  // Honeypot triggered — silently accept without subscribing, so bots
  // don't learn their submission was rejected.
  if (parsed.data.company_website) {
    return NextResponse.json({ ok: true });
  }

  // The audit form asks for explicit consent; enforce it server side
  // so a client bug can never subscribe someone silently.
  if ((parsed.data.source === "recognition-audit" || parsed.data.source === "project-map") && parsed.data.consent !== true) {
    return NextResponse.json({ error: "Please confirm the consent box first." }, { status: 422 });
  }

  // Trimmed defensively — a stray leading/trailing space or newline from
  // copy-pasting into Vercel's env var fields is invisible in the
  // dashboard but silently breaks the request: the key itself may be
  // perfectly valid (confirmed directly against Mailchimp's API), yet a
  // malformed subdomain from a whitespace-polluted server prefix routes
  // the request to the wrong regional endpoint, which then reports the
  // key as belonging to "a different datacenter" from *its* point of
  // view — a confusing error that points at the key when the actual
  // fault is whitespace in one of the other two values.
  const apiKey = process.env.MAILCHIMP_API_KEY?.trim();
  const audienceId = process.env.MAILCHIMP_AUDIENCE_ID?.trim();
  const serverPrefix = process.env.MAILCHIMP_SERVER_PREFIX?.trim();

  if (!apiKey || !audienceId || !serverPrefix) {
    console.log("Newsletter signup (Mailchimp setup still pending):", parsed.data.email);
    return NextResponse.json(
      { ok: true, note: "Received. Delivery setup is still pending." },
      { status: 200 }
    );
  }

  try {
    const res = await fetch(
      `https://${serverPrefix}.api.mailchimp.com/3.0/lists/${audienceId}/members`,
      {
        method: "POST",
        headers: {
          Authorization: `Basic ${Buffer.from(`anystring:${apiKey}`).toString("base64")}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email_address: parsed.data.email,
          status: "pending",
          // Audit submissions carry a first name and an origin tag so
          // the audience can be segmented; the plain newsletter form
          // sends neither and behaves exactly as before.
          ...(parsed.data.firstName ? { merge_fields: { FNAME: parsed.data.firstName } } : {}),
          ...(parsed.data.source ? { tags: [parsed.data.source] } : {}),
        }),
      }
    );

    if (res.ok) {
      return NextResponse.json({ ok: true });
    }

    const data = await res.json().catch(() => ({}));
    // Mailchimp's own "already on the list" signal — a friendly message
    // instead of a generic failure, since this isn't really an error
    // from the visitor's point of view.
    if (data.title === "Member Exists") {
      return NextResponse.json({ ok: true, alreadySubscribed: true });
    }

    console.error("Mailchimp subscribe failed:", data);
    return NextResponse.json({ error: "Something went wrong. Please try again." }, { status: 502 });
  } catch (err) {
    console.error("Newsletter signup error:", err);
    return NextResponse.json({ error: "Something went wrong. Please try again." }, { status: 500 });
  }
}
