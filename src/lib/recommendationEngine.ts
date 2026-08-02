// The Imagine Your Brand recommendation engine — a pure, local mapping
// from (situation, desired change) to a project map built entirely
// from real data: deliverable ids resolve to data/deliverables.ts,
// package slugs to data/services.ts, journey stages to the practice's
// real working sequence. Deliberately zero timeline estimates: the
// site's own FAQ promises a real timeline after discovery rather than
// a generic range, and this engine keeps that promise.
import type { PackageSlug } from "@/data/pricing";

export type SituationId = "launching" | "repositioning" | "inconsistent" | "new-market" | "founder" | "marketing";
export type ChangeId = "position" | "recognition" | "messaging" | "identity" | "website" | "content-system";

export const SITUATIONS: { id: SituationId; label: string }[] = [
  { id: "launching", label: "Launching something new" },
  { id: "repositioning", label: "Repositioning an existing brand" },
  { id: "inconsistent", label: "Growing, but inconsistently" },
  { id: "new-market", label: "Entering a new market" },
  { id: "founder", label: "Building founder authority" },
  { id: "marketing", label: "Improving marketing" },
];

export const CHANGES: { id: ChangeId; label: string }[] = [
  { id: "position", label: "A clearer position" },
  { id: "recognition", label: "Stronger recognition" },
  { id: "messaging", label: "Better messaging" },
  { id: "identity", label: "A coherent identity" },
  { id: "website", label: "A more useful website" },
  { id: "content-system", label: "A repeatable content system" },
];

export const JOURNEY_STAGES = [
  "Diagnosis",
  "Positioning",
  "Verbal identity",
  "Expression",
  "Customer journey",
  "Launch",
  "Measurement",
] as const;

export type ProjectMap = {
  stages: number[]; // indexes into JOURNEY_STAGES that this path emphasises
  questions: string[]; // the strategic questions this combination raises
  deliverableIds: string[]; // resolve against data/deliverables.ts
  packageSlug: PackageSlug;
  marketingLayer?: string; // honest add on framing, quotation follows discovery
};

const SITUATION_BASE: Record<SituationId, Omit<ProjectMap, "questions">> = {
  launching: {
    stages: [0, 1, 2, 3, 5],
    deliverableIds: ["discovery", "audience", "identity", "guidelines", "launch-messaging"],
    packageSlug: "brand-beginning",
  },
  repositioning: {
    stages: [0, 1, 2, 3, 6],
    deliverableIds: ["audit", "discovery", "voice", "campaign"],
    packageSlug: "brand-clarity",
  },
  inconsistent: {
    stages: [0, 1, 2, 6],
    deliverableIds: ["audit", "voice", "consistency-review", "guidelines"],
    packageSlug: "brand-clarity",
  },
  "new-market": {
    stages: [0, 1, 2, 4, 5],
    deliverableIds: ["discovery", "audience", "voice", "launch-messaging"],
    packageSlug: "brand-clarity",
  },
  founder: {
    stages: [0, 1, 2, 6],
    deliverableIds: ["discovery", "voice", "content-mgmt", "tracking"],
    packageSlug: "brand-partnership",
    marketingLayer: "A founder authority layer: content pillars and a publishing rhythm built on the position.",
  },
  marketing: {
    stages: [0, 4, 5, 6],
    deliverableIds: ["audience", "content-mgmt", "tracking", "quarterly"],
    packageSlug: "brand-partnership",
    marketingLayer: "A channel role map connecting the brand system to the places your audience already is.",
  },
};

const CHANGE_QUESTIONS: Record<ChangeId, string> = {
  position: "Which single idea should this brand own in a buyer's head?",
  recognition: "What would a stranger recognize with the logo covered?",
  messaging: "Which sentence would only this brand say?",
  identity: "Do every surface and every sentence reinforce the same meaning?",
  website: "What should each page make a visitor notice, understand, and do?",
  "content-system": "What structure turns expertise into repeatable, recognizable output?",
};

const SITUATION_QUESTIONS: Record<SituationId, string> = {
  launching: "What must be decided before anything gets designed?",
  repositioning: "Where exactly is recognition leaking today?",
  inconsistent: "Which of the current voices is the real one?",
  "new-market": "What does this market already believe about the category?",
  founder: "What point of view earns attention before the product does?",
  marketing: "Which channel actually moves a buyer toward a conversation?",
};

const CHANGE_EXTRAS: Partial<Record<ChangeId, { deliverableIds?: string[]; stage?: number }>> = {
  messaging: { deliverableIds: ["voice"] },
  identity: { deliverableIds: ["identity", "guidelines"] },
  website: { deliverableIds: ["website"], stage: 4 },
  "content-system": { deliverableIds: ["content-mgmt"], stage: 6 },
  recognition: { deliverableIds: ["identity"] },
};

export function buildProjectMap(situation: SituationId, change: ChangeId): ProjectMap {
  const base = SITUATION_BASE[situation];
  const extra = CHANGE_EXTRAS[change];
  const deliverableIds = [...new Set([...base.deliverableIds, ...(extra?.deliverableIds ?? [])])];
  const stages = [...new Set([...base.stages, ...(extra?.stage != null ? [extra.stage] : [])])].sort((a, b) => a - b);
  return {
    stages,
    deliverableIds,
    packageSlug: base.packageSlug,
    marketingLayer: base.marketingLayer,
    questions: [SITUATION_QUESTIONS[situation], CHANGE_QUESTIONS[change]],
  };
}
