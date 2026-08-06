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
  evidencePoster: string;
};

// Navigation and presentation taxonomy only. The evidence posters are
// editorial diagrams built from the recorded challenge, strategy,
// execution, and verified results in data/projects.ts. They demonstrate
// what the work decided without pretending to be client-supplied
// photography, mockups, or documentary footage.
export const WORK_TAXONOMY: Record<string, WorkTaxonomyRecord> = {
  "dr-haley-nutrition": {
    tier: "flagship",
    needs: ["recognition", "conversion"],
    evidenceLabel: "Measured performance",
    evidencePoster: "/images/work-evidence-dr-haley.svg",
  },
  myshopineurope: {
    tier: "flagship",
    needs: ["clarity", "authority", "system"],
    evidenceLabel: "Strategic system",
    evidencePoster: "/images/work-evidence-myshopineurope.svg",
  },
  "executive-springboard": {
    tier: "story",
    needs: ["conversion", "system"],
    evidenceLabel: "Conversion architecture",
    evidencePoster: "/images/work-evidence-executive-springboard.svg",
  },
  herbalcart: {
    tier: "story",
    needs: ["clarity", "recognition"],
    evidenceLabel: "Perception reset",
    evidencePoster: "/images/work-evidence-herbalcart.svg",
  },
  "plaxonic-content-portfolio": {
    tier: "story",
    needs: ["authority", "system"],
    evidenceLabel: "Content authority",
    evidencePoster: "/images/work-evidence-plaxonic.svg",
  },
};

const FALLBACK: WorkTaxonomyRecord = {
  tier: "story",
  needs: [],
  evidenceLabel: "Project evidence",
  evidencePoster: "/images/work-closing.jpg",
};

export function getWorkTaxonomy(slug: string): WorkTaxonomyRecord {
  return WORK_TAXONOMY[slug] ?? FALLBACK;
}
