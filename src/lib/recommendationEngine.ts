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

// The consultation layer — per situation diagnostic beats, so the
// map reads as the first consultation rather than a product picker:
// what the business is probably struggling with, the symptoms usually
// observed, what customers may currently perceive, the likely root
// cause, and why this practice would begin where it begins. Written
// as honest pattern observation ("usually", "often", "may"), never as
// a claim about this specific visitor's business.
export type Diagnostic = {
  struggle: string;
  symptoms: string[];
  perception: string;
  rootCause: string;
  why: string;
};

export const DIAGNOSTICS: Record<SituationId, Diagnostic> = {
  launching: {
    struggle: "Everything needs deciding at once, and each decision feels like it blocks the next.",
    symptoms: [
      "The name, the logo, and the website all feel urgent simultaneously",
      "Descriptions of the business change depending on who asks",
      "Design choices keep getting revisited because nothing anchors them",
    ],
    perception: "Customers meet fragments: a promising idea that reads slightly differently at every touchpoint.",
    rootCause: "Design decisions are being made before the positioning decision that should govern them.",
    why: "Businesses that decide their position first make every later choice once. That is why the path begins at diagnosis rather than design.",
  },
  repositioning: {
    struggle: "The brand that got you here reads wrong for where the business is going.",
    symptoms: [
      "New offers sit awkwardly under the old identity",
      "The best clients arrive despite the brand rather than because of it",
      "Explaining the business takes longer than it should",
    ],
    perception: "Customers still file the brand under its old category, whatever the new work says.",
    rootCause: "The position moved but the perception stayed; every touchpoint still rehearses the old story.",
    why: "Repositioning without an audit usually repaints the confusion. The audit finds where recognition leaks before anything gets rebuilt.",
  },
  inconsistent: {
    struggle: "Growth multiplied the voices, and the brand now says several things at once.",
    symptoms: [
      "Each channel has drifted into its own tone",
      "New material needs the founder's review to sound right",
      "Old assets and new assets look like different companies",
    ],
    perception: "Customers see activity without accumulation: familiar pieces that never add up to one memory.",
    rootCause: "The brand grew by addition instead of by system; consistency depends on people remembering rather than rules deciding.",
    why: "Consistency returns when decisions live in a system instead of a person's taste. That is why the path centres on the audit and the voice work.",
  },
  "new-market": {
    struggle: "What worked in the home market lands differently here, and nobody is sure which parts to keep.",
    symptoms: [
      "Messages that converted before now need explaining",
      "The category means something different to the new audience",
      "Local competitors own codes the brand has yet to learn",
    ],
    perception: "The new market reads the brand through its own category codes, and the current identity was never written for them.",
    rootCause: "Position and language were decided for one market's assumptions and inherited by another's.",
    why: "Entering a market on its own terms beats arriving with a translation. The path starts by re examining position against the new category.",
  },
  founder: {
    struggle: "The founder's thinking is the product, and it currently lives only in conversations.",
    symptoms: [
      "Clients arrive through referrals rather than reputation",
      "Expertise shows up in calls but nowhere public",
      "Content gets planned, started, and quietly abandoned",
    ],
    perception: "The market sees a competent service; the distinctive point of view stays invisible until the first meeting.",
    rootCause: "Authority compounds only when a position gets repeated in public, and there is no system carrying that repetition.",
    why: "A founder's voice needs a position before a posting schedule. That is why the path decides the point of view first, then builds the rhythm that carries it.",
  },
  marketing: {
    struggle: "Marketing produces activity and reach, yet enquiries stay flat.",
    symptoms: [
      "Impressions grow while conversations stay rare",
      "Every campaign starts from a blank page",
      "Metrics get reported without changing decisions",
    ],
    perception: "Customers see the brand often enough, yet a week later they would struggle to say what it stands for.",
    rootCause: "Marketing is amplifying an unclear position. Amplification multiplies whatever exists, including confusion.",
    why: "Marketing amplifies clarity; it rarely creates it. That is why the path fixes what gets amplified before touching how loudly.",
  },
};

// One educational insight per desired change — the visitor should
// leave having learned something true regardless of whether they book.
export const CHANGE_INSIGHTS: Record<ChangeId, string> = {
  position: "Businesses rarely lose customers over weak visuals. They lose recognition because every touchpoint communicates a different idea.",
  recognition: "Recognition is a compound asset: the same distinctive signals, repeated until strangers can identify the brand with the logo covered.",
  messaging: "A message that needs explaining was written for the company rather than the customer.",
  identity: "Consistency without positioning simply repeats the confusion more efficiently.",
  website: "A website converts when every page knows what the visitor should notice, understand, and do next.",
  "content-system": "Content compounds only when one position governs it; volume without a system dilutes instead of builds.",
};

// Waystone support: the real deliverable count each situation path
// draws on (from the base maps above, so the number can never drift
// from the truth), and the change this practice would usually
// recommend first for each situation — grounded in each diagnostic's
// own root cause, which points at positioning far more often than at
// expression.
export function baseDeliverableCount(situation: SituationId): number {
  return SITUATION_BASE[situation].deliverableIds.length;
}

export const RECOMMENDED_CHANGE: Record<SituationId, ChangeId> = {
  launching: "position",
  repositioning: "position",
  inconsistent: "identity",
  "new-market": "position",
  founder: "recognition",
  marketing: "position",
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
