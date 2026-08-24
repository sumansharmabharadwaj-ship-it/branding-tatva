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
  name: z.string().min(2, "Please share your name.").max(120),
  email: z
    .string()
    .email("That looks like it might have a typo, mind checking it?")
    .max(254),
  phone: z.string().max(60).optional(),
  business: z.string().max(160).optional(),
  website: z.string().max(500).optional(),
  brandStage: z.enum(brandStages).optional(),
  servicesNeeded: z.string().max(1000).optional(),
  budget: z.string().max(120).optional(),
  timeline: z.string().max(120).optional(),
  description: z
    .string()
    .min(10, "A few words help me prepare before we talk.")
    .max(5000),
  referral: z.string().max(200).optional(),
  company_website: z.string().max(200).optional(),
});

export type ContactFormValues = z.infer<typeof contactSchema>;
