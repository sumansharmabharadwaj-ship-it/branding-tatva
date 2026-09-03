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
