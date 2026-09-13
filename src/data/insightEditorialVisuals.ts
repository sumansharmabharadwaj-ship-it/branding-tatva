export type InsightEditorialVisual = {
  src: string;
  alt: string;
  shortTitle?: string;
  description?: string;
  depthKind: "positioning" | "case-study" | "recall" | "image";
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
  "how-ai-assistants-choose-brands-to-recommend": {
    src: "/images/generated/insights-editorial/ai-retrieval-path.png",
    alt: "A buyer's prompt above the four memory checks an AI assistant runs: entity, category, situations, and evidence",
    shortTitle: "The assistant answers from memory",
    description: "Four checks decide whether your brand gets named.",
    depthKind: "image",
    aspectRatio: 990 / 362,
  },
  "why-ai-content-makes-brands-average": {
    src: "/images/generated/insights-editorial/ai-modal-trap.png",
    alt: "A generic AI written tagline annotated as the statistical centre of the category, above the four decisions that escape it",
    shortTitle: "The tool returns the category average",
    description: "See the modal trap, then the escape.",
    depthKind: "image",
    aspectRatio: 990 / 334,
  },
  "what-rebrand-backlashes-teach-about-brand-memory": {
    src: "/images/generated/insights-editorial/rebrand-change-budget.png",
    alt: "A cue ledger separating equity to conserve from debt to spend, above the sequence for changing an established brand",
    shortTitle: "Rebrands spend a change budget",
    description: "Sort equity from debt before any redesign.",
    depthKind: "image",
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