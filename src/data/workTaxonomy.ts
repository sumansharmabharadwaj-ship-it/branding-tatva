export const WORK_NEEDS = [
  {
    id: "all",
    label: "All work",
    description: "Every recorded engagement.",
  },
  {
    id: "clarity",
    label: "Clarity",
    description: "Our brand feels unclear.",
  },
  {
    id: "recognition",
    label: "Recognition",
    description: "People see us, but do not remember us.",
  },
  {
    id: "conversion",
    label: "Conversion",
    description: "Attention is not leading anywhere useful.",
  },
  {
    id: "authority",
    label: "Authority",
    description: "We need stronger evidence and a sharper point of view.",
  },
  {
    id: "system",
    label: "System",
    description: "The brand has become fragmented across channels.",
  },
] as const;

export type WorkNeedId = Exclude<(typeof WORK_NEEDS)[number]["id"], "all">;
export type WorkFilterId = (typeof WORK_NEEDS)[number]["id"];
export type WorkTier = "flagship" | "story";

export type WorkTaxonomyRecord = {
  tier: WorkTier;
  needs: WorkNeedId[];
  evidenceLabel: string;
};

// Navigation taxonomy only. These labels are derived from each project's
// recorded challenge, strategy, and outcome in data/projects.ts. They do
// not introduce a new result, metric, client claim, or permission claim.
export const WORK_TAXONOMY: Record<string, WorkTaxonomyRecord> = {
  "dr-haley-nutrition": {
    tier: "flagship",
    needs: ["recognition", "conversion"],
    evidenceLabel: "Measured performance",
  },
  myshopineurope: {
    tier: "flagship",
    needs: ["clarity", "authority", "system"],
    evidenceLabel: "Strategic system",
  },
  "executive-springboard": {
    tier: "story",
    needs: ["conversion", "system"],
    evidenceLabel: "Conversion architecture",
  },
  herbalcart: {
    tier: "story",
    needs: ["clarity", "recognition"],
    evidenceLabel: "Perception reset",
  },
  "plaxonic-content-portfolio": {
    tier: "story",
    needs: ["authority", "system"],
    evidenceLabel: "Content authority",
  },
};

const FALLBACK: WorkTaxonomyRecord = {
  tier: "story",
  needs: [],
  evidenceLabel: "Project evidence",
};

export function getWorkTaxonomy(slug: string): WorkTaxonomyRecord {
  return WORK_TAXONOMY[slug] ?? FALLBACK;
}
