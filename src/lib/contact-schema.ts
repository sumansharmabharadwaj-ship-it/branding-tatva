import { z } from "zod";

function isWebsiteOrSocialReference(value: string) {
  if (!value || /^@[a-z0-9._-]{2,64}$/i.test(value)) return true;

  const candidate = /^[a-z][a-z0-9+.-]*:\/\//i.test(value)
    ? value
    : `https://${value}`;
  try {
    const parsed = new URL(candidate);
    return (
      (parsed.protocol === "http:" || parsed.protocol === "https:") &&
      parsed.hostname.includes(".")
    );
  } catch {
    return false;
  }
}

export const brandStages = [
  "I am beginning with an idea",
  "I am preparing to launch",
  "My brand already exists",
  "I need to reposition",
  "I need ongoing support",
  "I need help deciding",
] as const;

export const servicePackages = [
  "brand-beginning",
  "brand-clarity",
  "brand-partnership",
] as const;

export const contactSchema = z.object({
  name: z.string().trim().min(2, "Please share your name.").max(120),
  email: z
    .string()
    .trim()
    .email("Check the email address. One character may be out of place.")
    .max(254),
  phone: z.string().trim().max(60).optional(),
  business: z.string().trim().max(160).optional(),
  website: z
    .string()
    .trim()
    .max(500)
    .refine(isWebsiteOrSocialReference, "Share a full link, domain, or @handle.")
    .optional(),
  brandStage: z.enum(brandStages).optional(),
  servicesNeeded: z.string().trim().max(1000).optional(),
  budget: z.string().trim().max(120).optional(),
  timeline: z.string().trim().max(120).optional(),
  description: z
    .string()
    .trim()
    .min(10, "A few words help me prepare before we talk.")
    .max(5000),
  referral: z.string().trim().max(200).optional(),
  servicePackage: z.enum(servicePackages).optional(),
  company_website: z.string().trim().max(200).optional(),
});

export type ContactFormValues = z.infer<typeof contactSchema>;
