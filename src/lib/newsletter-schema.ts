import { z } from "zod";

export const newsletterSchema = z.object({
  email: z
    .string()
    .email("That looks like it might have a typo, mind checking it?")
    .max(254),
  // Honeypot. Bots may fill it; the route accepts and discards those
  // submissions without touching Mailchimp.
  company_website: z.string().max(200).optional(),
  // Optional fields used by the Brand Recognition Audit form. The
  // plain newsletter form never sends them, so both consumers share
  // one schema and one endpoint.
  firstName: z.string().max(80).optional(),
  business: z.string().max(120).optional(),
  consent: z.boolean().optional(),
  source: z.enum(["newsletter", "recognition-audit", "project-map"]).optional(),
});

export type NewsletterFormValues = z.infer<typeof newsletterSchema>;
