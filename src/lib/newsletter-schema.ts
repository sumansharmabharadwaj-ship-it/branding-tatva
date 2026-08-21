import { z } from "zod";

export const newsletterSchema = z.object({
  email: z
    .string()
    .trim()
    .email("That looks like it might have a typo, mind checking it?")
    .max(254),
  company_website: z.string().max(200).optional(),
  firstName: z.string().trim().max(80).optional(),
  business: z.string().trim().max(120).optional(),
  consent: z.boolean().optional(),
  source: z.enum(["newsletter", "recognition-audit", "project-map"]).optional(),
});

export type NewsletterFormValues = z.infer<typeof newsletterSchema>;
