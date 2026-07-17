import { NextRequest, NextResponse } from "next/server";
import { contactSchema } from "@/lib/contact-schema";

// This route validates and (once RESEND_API_KEY is set — see Phase 11 /
// CONTACT_FORM_SETUP.md) emails contact form submissions. Until that key
// exists, submissions are validated and logged server-side but not
// delivered — Suman will be walked through creating a free Resend account
// before launch.

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => null);
  if (!body) {
    return NextResponse.json({ error: "Invalid submission." }, { status: 400 });
  }

  const parsed = contactSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Please check the highlighted fields.", issues: parsed.error.flatten() },
      { status: 422 }
    );
  }

  // Honeypot triggered — silently accept without sending, so bots don't
  // learn their submission was rejected.
  if (parsed.data.company_website) {
    return NextResponse.json({ ok: true });
  }

  const apiKey = process.env.RESEND_API_KEY;
  const toEmail = process.env.CONTACT_TO_EMAIL;

  if (!apiKey || !toEmail) {
    console.log("Contact form submission (email delivery not yet configured):", parsed.data);
    return NextResponse.json(
      { ok: true, note: "Received — email delivery is not yet connected." },
      { status: 200 }
    );
  }

  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: "Branding Tatva <onboarding@resend.dev>",
        to: toEmail,
        subject: `New enquiry from ${parsed.data.name}`,
        text: JSON.stringify(parsed.data, null, 2),
      }),
    });

    if (!res.ok) {
      const errText = await res.text();
      console.error("Resend delivery failed:", errText);
      return NextResponse.json({ error: "Delivery failed. Please try again shortly." }, { status: 502 });
    }

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("Contact form error:", err);
    return NextResponse.json({ error: "Something went wrong. Please try again." }, { status: 500 });
  }
}
