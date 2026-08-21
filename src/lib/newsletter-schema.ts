import { z } from "zod";

export const newsletterSchema = z.object({
  email: z.string().email("That looks like it might have a typo, mind checking it?"),
  // honeypot — real users never fill this in
  company_website: z.string().max(0, "").optional(),
});

export type NewsletterFormValues = z.infer<typeof newsletterSchema>;
