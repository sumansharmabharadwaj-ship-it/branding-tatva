import { NextRequest, NextResponse } from "next/server";
import { contactSchema } from "@/lib/contact-schema";

// This route validates and emails contact form submissions via Resend.
// If RESEND_API_KEY or CONTACT_TO_EMAIL is missing (e.g. a fresh clone
// without .env.local), it falls back to logging server-side instead of
// failing the submission outright.

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
    console.log("Contact form submission (email delivery still pending setup):", parsed.data);
    return NextResponse.json(
      { ok: true, note: "Received. Email delivery setup is still pending." },
      { status: 200 }
    );
  }

  try {
    const d = parsed.data;
    // Readable, labeled body instead of a raw JSON dump — this is a real
    // business enquiry someone reads on a phone, not a debug log.
    const text = [
      `Name: ${d.name}`,
      `Email: ${d.email}`,
      d.phone && `Phone: ${d.phone}`,
      `Business: ${d.business}`,
      d.website && `Website: ${d.website}`,
      `Brand stage: ${d.brandStage}`,
      `Services needed: ${d.servicesNeeded}`,
      d.budget && `Budget: ${d.budget}`,
      d.timeline && `Timeline: ${d.timeline}`,
      d.referral && `Found via: ${d.referral}`,
      "",
      "Project description:",
      d.description,
    ]
      .filter(Boolean)
      .join("\n");

    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: "Branding Tatva <contact@brandingtatva.com>",
        to: toEmail,
        // Lets Suman just hit "reply" in her inbox to respond directly
        // to the person who submitted the form.
        reply_to: d.email,
        subject: `New enquiry from ${d.name}`,
        text,
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
