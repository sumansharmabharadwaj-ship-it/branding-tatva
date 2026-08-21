import { z } from "zod";

export const brandStages = [
  "I am beginning with an idea",
  "I am preparing to launch",
  "My brand already exists",
  "I need to reposition",
  "I need ongoing support",
  "I need help deciding",
] as const;

export const contactSchema = z.object({
  name: z.string().trim().min(2, "Please share your name.").max(120),
  email: z
    .string()
    .trim()
    .email("That looks like it might have a typo, mind checking it?")
    .max(254),
  phone: z.string().trim().max(60).optional(),
  business: z.string().trim().min(1, "Please share the company or brand name.").max(160),
  website: z.string().trim().max(500).optional(),
  brandStage: z.enum(brandStages).optional().or(z.literal("")),
  servicesNeeded: z.string().trim().max(1000).optional(),
  budget: z.string().trim().max(120).optional(),
  timeline: z.string().trim().max(120).optional(),
  description: z
    .string()
    .trim()
    .min(10, "A few sentences helps make the first reply useful.")
    .max(5000),
  referral: z.string().trim().max(200).optional(),
  // Honeypot fields must survive validation so the route can silently
  // accept bot submissions without revealing the trap.
  company_website: z.string().max(200).optional(),
});

export type ContactFormValues = z.infer<typeof contactSchema>;
