export type InsightEditorialVisual = {
  src: string;
  alt: string;
  shortTitle?: string;
  description?: string;
  depthKind: "positioning" | "case-study" | "recall" | "worksheet" | "image";
  aspectRatio: number;
};

type InsightVisualPost = {
  slug: string;
  title: string;
  excerpt: string;
  heroImage: string;
  heroImageAlt: string;
};

const FEATURED_VISUALS: Record<string, InsightEditorialVisual> = {
  "brand-positioning-statement-examples-why-generic": {
    src: "/images/generated/insights-editorial/positioning-specificity.png",
    alt: "A generic positioning sentence annotated against a more specific structure built from customer, situation, alternative, choice, and proof",
    shortTitle: "Why most positioning statements sound generic",
    description: "See exactly where specificity disappears.",
    depthKind: "positioning",
    aspectRatio: 990 / 312,
  },
  "case-study-structure-service-businesses": {
    src: "/images/generated/insights-editorial/case-study-anatomy.png",
    alt: "A seven-stage case study anatomy showing the difficult decision-making middle between situation and outcome",
    shortTitle: "Show the decision behind the result",
    description: "A buyer needs the difficult middle.",
    depthKind: "case-study",
    aspectRatio: 990 / 259,
  },
  "brand-awareness-vs-brand-recall": {
    src: "/images/generated/insights-editorial/awareness-recall.png",
    alt: "A side-by-side worksheet comparing aided recognition with unaided brand recall",
    shortTitle: "Awareness is not recall",
    description: "Recognition uses a cue. Recall does not.",
    depthKind: "recall",
    aspectRatio: 990 / 211,
  },
  // The AI era set's diagrams, drawn in the same annotated-worksheet
  // language as the three above: paper ground, small-caps structure,
  // red hand annotations carrying the argument.
  // Every remaining essay's framework, rendered in the shared annotated
  // worksheet language so the library reads as one drawn system. Sheets
  // are generated from each essay's own framework and direct answer.
  "brand-positioning-strategy-service-businesses": {
    src: "/images/generated/insights-editorial/brand-positioning-strategy-service-businesses.png",
    alt: "The positioning spine, drawn as an annotated worksheet with its steps and the decision it settles",
    depthKind: "worksheet",
    aspectRatio: 990 / 356,
  },
  "brand-audit-checklist-before-rebrand": {
    src: "/images/generated/insights-editorial/brand-audit-checklist-before-rebrand.png",
    alt: "The brand audit in five layers, drawn as an annotated worksheet with its steps and the decision it settles",
    depthKind: "worksheet",
    aspectRatio: 990 / 298,
  },
  "brand-messaging-framework": {
    src: "/images/generated/insights-editorial/brand-messaging-framework.png",
    alt: "The five part message architecture, drawn as an annotated worksheet with its steps and the decision it settles",
    depthKind: "worksheet",
    aspectRatio: 990 / 296,
  },
  "five-element-brand-strategy-framework": {
    src: "/images/generated/insights-editorial/five-element-brand-strategy-framework.png",
    alt: "The five elements of the brand system, drawn as an annotated worksheet with its steps and the decision it settles",
    depthKind: "worksheet",
    aspectRatio: 990 / 317,
  },
  "website-messaging-hierarchy-service-businesses": {
    src: "/images/generated/insights-editorial/website-messaging-hierarchy-service-businesses.png",
    alt: "The five layer website message stack, drawn as an annotated worksheet with its steps and the decision it settles",
    depthKind: "worksheet",
    aspectRatio: 990 / 298,
  },
  "distinctive-brand-assets-audit": {
    src: "/images/generated/insights-editorial/distinctive-brand-assets-audit.png",
    alt: "The five tests of a distinctive asset, drawn as an annotated worksheet with its steps and the decision it settles",
    depthKind: "worksheet",
    aspectRatio: 990 / 317,
  },
  "customer-journey-mapping-service-businesses": {
    src: "/images/generated/insights-editorial/customer-journey-mapping-service-businesses.png",
    alt: "The six stage service journey, drawn as an annotated worksheet with its steps and the decision it settles",
    depthKind: "worksheet",
    aspectRatio: 990 / 340,
  },
  "how-to-position-a-consulting-business": {
    src: "/images/generated/insights-editorial/how-to-position-a-consulting-business.png",
    alt: "The consulting position compass, drawn as an annotated worksheet with its steps and the decision it settles",
    depthKind: "worksheet",
    aspectRatio: 990 / 336,
  },
  "measure-brand-recall-limited-budget": {
    src: "/images/generated/insights-editorial/measure-brand-recall-limited-budget.png",
    alt: "The lean recall tracker, drawn as an annotated worksheet with its steps and the decision it settles",
    depthKind: "worksheet",
    aspectRatio: 990 / 351,
  },
  "value-proposition-vs-positioning-vs-tagline": {
    src: "/images/generated/insights-editorial/value-proposition-vs-positioning-vs-tagline.png",
    alt: "The meaning ladder, drawn as an annotated worksheet with its steps and the decision it settles",
    depthKind: "worksheet",
    aspectRatio: 990 / 359,
  },
  "brand-consistency-checklist-service-businesses": {
    src: "/images/generated/insights-editorial/brand-consistency-checklist-service-businesses.png",
    alt: "The consistency chain, drawn as an annotated worksheet with its steps and the decision it settles",
    depthKind: "worksheet",
    aspectRatio: 990 / 336,
  },
  "why-beautiful-brand-identity-can-be-forgettable": {
    src: "/images/generated/insights-editorial/why-beautiful-brand-identity-can-be-forgettable.png",
    alt: "The recognition spine, drawn as an annotated worksheet with its steps and the decision it settles",
    depthKind: "worksheet",
    aspectRatio: 990 / 340,
  },
  "find-real-differentiator-crowded-service-market": {
    src: "/images/generated/insights-editorial/find-real-differentiator-crowded-service-market.png",
    alt: "The consequence test, drawn as an annotated worksheet with its steps and the decision it settles",
    depthKind: "worksheet",
    aspectRatio: 990 / 336,
  },
  "reposition-established-service-business-without-losing-recognition": {
    src: "/images/generated/insights-editorial/reposition-established-service-business-without-losing-recognition.png",
    alt: "The recognition bridge, drawn as an annotated worksheet with its steps and the decision it settles",
    depthKind: "worksheet",
    aspectRatio: 990 / 355,
  },
  "brand-refresh-vs-rebrand-how-much-change": {
    src: "/images/generated/insights-editorial/brand-refresh-vs-rebrand-how-much-change.png",
    alt: "The change depth ladder, drawn as an annotated worksheet with its steps and the decision it settles",
    depthKind: "worksheet",
    aspectRatio: 990 / 393,
  },
  "turn-client-proof-into-positioning-advantage": {
    src: "/images/generated/insights-editorial/turn-client-proof-into-positioning-advantage.png",
    alt: "The proof architecture, drawn as an annotated worksheet with its steps and the decision it settles",
    depthKind: "worksheet",
    aspectRatio: 990 / 355,
  },
  "brand-architecture-service-businesses": {
    src: "/images/generated/insights-editorial/brand-architecture-service-businesses.png",
    alt: "The architecture threshold, drawn as an annotated worksheet with its steps and the decision it settles",
    depthKind: "worksheet",
    aspectRatio: 990 / 393,
  },
  "customer-interviews-brand-strategy": {
    src: "/images/generated/insights-editorial/customer-interviews-brand-strategy.png",
    alt: "The decision reconstruction, drawn as an annotated worksheet with its steps and the decision it settles",
    depthKind: "worksheet",
    aspectRatio: 990 / 351,
  },
  "turn-customer-interviews-into-positioning-brief": {
    src: "/images/generated/insights-editorial/turn-customer-interviews-into-positioning-brief.png",
    alt: "The evidence to decision ladder, drawn as an annotated worksheet with its steps and the decision it settles",
    depthKind: "worksheet",
    aspectRatio: 990 / 336,
  },
  "service-line-naming-strategy": {
    src: "/images/generated/insights-editorial/service-line-naming-strategy.png",
    alt: "The naming gravity test, drawn as an annotated worksheet with its steps and the decision it settles",
    depthKind: "worksheet",
    aspectRatio: 990 / 374,
  },
  "competitor-research-brand-strategy-without-copying-category": {
    src: "/images/generated/insights-editorial/competitor-research-brand-strategy-without-copying-category.png",
    alt: "The competitive distance map, drawn as an annotated worksheet with its steps and the decision it settles",
    depthKind: "worksheet",
    aspectRatio: 990 / 336,
  },
  "brand-voice-guidelines-writers-can-use": {
    src: "/images/generated/insights-editorial/brand-voice-guidelines-writers-can-use.png",
    alt: "The usable voice stack, drawn as an annotated worksheet with its steps and the decision it settles",
    depthKind: "worksheet",
    aspectRatio: 990 / 314,
  },
  "brand-discovery-workshop-questions": {
    src: "/images/generated/insights-editorial/brand-discovery-workshop-questions.png",
    alt: "The decision workshop, drawn as an annotated worksheet with its steps and the decision it settles",
    depthKind: "worksheet",
    aspectRatio: 990 / 336,
  },
  "homepage-messaging-service-businesses": {
    src: "/images/generated/insights-editorial/homepage-messaging-service-businesses.png",
    alt: "The homepage decision sequence, drawn as an annotated worksheet with its steps and the decision it settles",
    depthKind: "worksheet",
    aspectRatio: 990 / 336,
  },
  "service-page-messaging-strategy": {
    src: "/images/generated/insights-editorial/service-page-messaging-strategy.png",
    alt: "The service page confidence stack, drawn as an annotated worksheet with its steps and the decision it settles",
    depthKind: "worksheet",
    aspectRatio: 990 / 296,
  },
  "testimonial-questions-buying-evidence": {
    src: "/images/generated/insights-editorial/testimonial-questions-buying-evidence.png",
    alt: "The decision evidence testimonial, drawn as an annotated worksheet with its steps and the decision it settles",
    depthKind: "worksheet",
    aspectRatio: 990 / 340,
  },
  "aeo-vs-seo-vs-geo": {
    src: "/images/generated/insights-editorial/aeo-vs-seo-vs-geo.png",
    alt: "The one record method, drawn as an annotated worksheet with its steps and the decision it settles",
    depthKind: "worksheet",
    aspectRatio: 990 / 432,
  },
  "generative-engine-optimisation-guide": {
    src: "/images/generated/insights-editorial/generative-engine-optimisation-guide.png",
    alt: "The quotable record, drawn as an annotated worksheet with its steps and the decision it settles",
    depthKind: "worksheet",
    aspectRatio: 990 / 432,
  },
  "brand-strategy-when-ai-agents-buy": {
    src: "/images/generated/insights-editorial/brand-strategy-when-ai-agents-buy.png",
    alt: "The instruction test, drawn as an annotated worksheet with its steps and the decision it settles",
    depthKind: "worksheet",
    aspectRatio: 990 / 374,
  },
  "how-to-name-a-brand-when-good-names-are-taken": {
    src: "/images/generated/insights-editorial/how-to-name-a-brand-when-good-names-are-taken.png",
    alt: "The naming audition, drawn as an annotated worksheet: job, sound, distance, rights, and deposit, with the decision it settles",
    depthKind: "worksheet",
    aspectRatio: 990 / 377,
  },
  "how-ai-assistants-choose-brands-to-recommend": {
    src: "/images/generated/insights-editorial/ai-retrieval-path.png",
    alt: "A buyer's prompt above the four memory checks an AI assistant runs: entity, category, situations, and evidence",
    shortTitle: "The assistant answers from memory",
    description: "Four checks decide whether your brand gets named.",
    depthKind: "worksheet",
    aspectRatio: 990 / 362,
  },
  "why-ai-content-makes-brands-average": {
    src: "/images/generated/insights-editorial/ai-modal-trap.png",
    alt: "A generic AI written tagline annotated as the statistical centre of the category, above the four decisions that escape it",
    shortTitle: "The tool returns the category average",
    description: "See the modal trap, then the escape.",
    depthKind: "worksheet",
    aspectRatio: 990 / 334,
  },
  "brand-marketing-vs-performance-marketing": {
    src: "/images/generated/insights-editorial/demand-ledger.png",
    alt: "A two column ledger separating demand harvesting from demand creation, above the three signals of an empty demand reservoir",
    shortTitle: "The dashboard only measures the harvest",
    description: "Split the budget by what each job actually does.",
    depthKind: "worksheet",
    aspectRatio: 990 / 296,
  },
  "founder-brand-vs-company-brand": {
    src: "/images/generated/insights-editorial/founder-company-ledger.png",
    alt: "A two column ledger weighing the founder's name against the company's name, above the three shared cues that bridge them",
    shortTitle: "Two names, one memory system",
    description: "Decide which name the trust should accrue to.",
    depthKind: "worksheet",
    aspectRatio: 990 / 296,
  },
  "what-rebrand-backlashes-teach-about-brand-memory": {
    src: "/images/generated/insights-editorial/rebrand-change-budget.png",
    alt: "A cue ledger separating equity to conserve from debt to spend, above the sequence for changing an established brand",
    shortTitle: "Rebrands spend a change budget",
    description: "Sort equity from debt before any redesign.",
    depthKind: "worksheet",
    aspectRatio: 990 / 296,
  },
};

export function buildInsightEditorialVisuals(
  posts: readonly InsightVisualPost[],
) {
  return new Map(
    posts.map((post) => [
      post.slug,
      FEATURED_VISUALS[post.slug] ?? {
        src: post.heroImage,
        alt: post.heroImageAlt,
        shortTitle: post.title,
        description: post.excerpt,
        depthKind: "image" as const,
        aspectRatio: 16 / 5,
      },
    ] as const),
  );
}