export type InsightEditorialVisual = {
  src: string;
  alt: string;
};

type InsightVisualPost = {
  slug: string;
  heroImage: string;
  heroImageAlt: string;
};

export function buildInsightEditorialVisuals(
  posts: readonly InsightVisualPost[],
) {
  return new Map(
    posts.map((post) => [
      post.slug,
      {
        src: post.heroImage,
        alt: post.heroImageAlt,
      },
    ] as const),
  );
}
