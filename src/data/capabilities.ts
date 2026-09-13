// The capability and experience map (Work page) — breadth stated
// honestly: fifteen real capability areas, five visitor needs, and for
// each need the one real engagement that evidences it plus the real
// package that serves it. Every projectSlug resolves to
// data/projects.ts; nothing here claims client volume.
export type Capability = { id: string; name: string };

export const CAPABILITIES: Capability[] = [
  { id: "research", name: "Research" },
  { id: "positioning", name: "Positioning" },
  { id: "category", name: "Category Design" },
  { id: "architecture", name: "Brand Architecture" },
  { id: "naming", name: "Naming" },
  { id: "verbal", name: "Verbal Identity" },
  { id: "visual", name: "Visual Direction" },
  { id: "assets", name: "Distinctive Assets" },
  { id: "journey", name: "Customer Journey" },
  { id: "website", name: "Website Strategy" },
  { id: "content", name: "Content Strategy" },
  { id: "social", name: "Social Media Strategy" },
  { id: "launch", name: "Launch Planning" },
  { id: "campaigns", name: "Campaign Systems" },
  { id: "measurement", name: "Measurement" },
];

export type NeedPath = {
  id: string;
  label: string;
  capabilityIds: string[];
  projectSlug: string;
  packageSlug: string;
  packageName: string;
  line: string; // why this evidence answers this need — grounded in the project's own record
};

export const NEED_PATHS: NeedPath[] = [
  {
    id: "clarity",
    label: "I need clarity",
    capabilityIds: ["research", "positioning", "category", "architecture", "naming", "verbal"],
    projectSlug: "myshopineurope",
    packageSlug: "brand-clarity",
    packageName: "Full Brand System",
    line: "A marketplace that risked meaning cheap supply became a brand built on craft and origin. Clarity was the deliverable.",
  },
  {
    id: "recognition",
    label: "I need recognition",
    capabilityIds: ["assets", "social", "content", "measurement", "positioning"],
    projectSlug: "dr-haley-nutrition",
    packageSlug: "brand-clarity",
    packageName: "Full Brand System",
    line: "Posting dropped by nearly half while followers earned per post doubled. Recognition rewards relevance over volume.",
  },
  {
    id: "consistency",
    label: "I need consistency",
    capabilityIds: ["verbal", "content", "architecture", "measurement"],
    projectSlug: "plaxonic-content-portfolio",
    packageSlug: "brand-partnership",
    packageName: "Brand Partnership",
    line: "Sixteen pieces across four formats, each doing a different job under one deliberate arc. Consistency is a system, never a mood.",
  },
  {
    id: "launch",
    label: "I need a launch",
    capabilityIds: ["positioning", "campaigns", "launch", "visual", "verbal"],
    projectSlug: "herbalcart",
    packageSlug: "brand-beginning",
    packageName: "Foundation",
    line: "A campaign reset with five formats ready to shoot, built in the category's own native language before anything went live.",
  },
  {
    id: "marketing",
    label: "I need better marketing",
    capabilityIds: ["journey", "content", "social", "campaigns", "measurement", "website"],
    projectSlug: "executive-springboard",
    packageSlug: "brand-partnership",
    packageName: "Brand Partnership",
    line: "Everyday content wired directly to webinar registration. Marketing that ends in an action rather than a like.",
  },
];
