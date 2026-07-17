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
  name: z.string().min(2, "Please share your name."),
  email: z.string().email("That doesn't look like a working email — mind checking it?"),
  phone: z.string().optional(),
  business: z.string().min(1, "Let me know your business or brand name."),
  website: z.string().optional(),
  brandStage: z.enum(brandStages, {
    errorMap: () => ({ message: "Pick the option closest to where you are." }),
  }),
  servicesNeeded: z.string().min(1, "A rough idea is fine — what do you think you need?"),
  budget: z.string().optional(),
  timeline: z.string().optional(),
  description: z.string().min(10, "A few sentences helps me prepare before we talk."),
  referral: z.string().optional(),
  // honeypot — real users never fill this in
  company_website: z.string().max(0, "").optional(),
});

export type ContactFormValues = z.infer<typeof contactSchema>;
