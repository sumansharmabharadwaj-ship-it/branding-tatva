export type InsightEditorialVisual = {
  src: string;
  alt: string;
};

type InsightVisualPost = {
  slug: string;
  topicSlug: string;
  heroImage: string;
  heroImageAlt: string;
};

// Article heroes intentionally share an elemental film. Card surfaces need a
// more specific signal: when two essays reuse the same frame they read like
// duplicated recommendations. Keep one stable editorial contact sheet for
// every Insights surface so a given essay carries the same image in the main
// library, topic paths, and related-reading cards.
const EDITORIAL_VISUALS_BY_TOPIC: Record<
  string,
  InsightEditorialVisual[]
> = {
  positioning: [
    { src: "/images/higgsfield-himalayan-valley-poster.jpg", alt: "A Himalayan valley opening toward a clear distant route" },
    { src: "/images/pexels-himalayan-dawn-poster.jpg", alt: "Early light separating layers of Himalayan ridges" },
    { src: "/images/pixabay-sea-of-fog-sunrise-poster.jpg", alt: "A solitary peak rising above a sea of morning fog" },
    { src: "/images/own-jagged-peaks-wide-poster.jpg", alt: "A wide horizon of sharply defined mountain peaks" },
    { src: "/images/higgsfield-brass-compass.jpg", alt: "A brass compass resting on a weathered map" },
    { src: "/images/own-alpenglow-peak-poster.jpg", alt: "A mountain peak held in warm alpenglow" },
    { src: "/images/pexels-summit-inversion-poster.jpg", alt: "A high summit above a soft cloud inversion" },
    { src: "/images/pixabay-misty-ridge-drift-poster.jpg", alt: "Mist moving across a long mountain ridge" },
    { src: "/images/hero-valley-poster.jpg", alt: "A green valley leading toward a narrow horizon" },
    { src: "/images/own-misty-ridge-poster.jpg", alt: "A quiet ridge emerging through pale mist" },
  ],
  "customer-experience": [
    { src: "/images/pixabay-stream-mist-rays-poster.jpg", alt: "Sunlight reaching a forest stream through morning mist" },
    { src: "/images/pixabay-golden-reeds-wind-poster.jpg", alt: "Golden reeds bending together in the wind" },
    { src: "/images/pexels-river-dawn-poster.jpg", alt: "A calm river carrying first light through the landscape" },
    { src: "/images/pexels-moss-stream-poster.jpg", alt: "Water moving through moss-covered stones" },
    { src: "/images/own-waterfall-veil.jpg", alt: "A waterfall forming a soft veil over dark rock" },
  ],
  "distinctive-brand": [
    { src: "/images/pixabay-golden-forest-glow-poster.jpg", alt: "One bright clearing glowing inside a dark forest" },
    { src: "/images/pixabay-alpine-wildflowers-poster.jpg", alt: "Distinct alpine flowers standing across a green slope" },
    { src: "/images/pexels-dandelion-release-poster.jpg", alt: "Dandelion seeds separating into the air" },
  ],
  "brand-messaging": [
    { src: "/images/pexels-studio-morning-light-poster.jpg", alt: "Morning light falling across a quiet writing desk" },
    { src: "/images/higgsfield-idea-sketch.jpg", alt: "Editorial sketches and notes arranged on paper" },
    { src: "/images/pixabay-campfire-conversation-poster.jpg", alt: "A small campfire gathering attention in the dark" },
    { src: "/images/higgsfield-process-express-poster.jpg", alt: "A hand shaping a clear line of written thought" },
    { src: "/images/higgsfield-process-listen-poster.jpg", alt: "A quiet listening moment in soft natural light" },
    { src: "/images/higgsfield-process-shape-poster.jpg", alt: "Hands arranging fragments into a coherent composition" },
    { src: "/images/higgsfield-stream-clarity-poster.jpg", alt: "A clear stream moving over pale stone" },
  ],
  "brand-memory": [
    { src: "/images/pexels-fog-sunrise-poster.jpg", alt: "Sunlight returning through a familiar bank of fog" },
    { src: "/images/own-pond.jpg", alt: "Repeated rings travelling across a still pond" },
    { src: "/images/higgsfield-element-air.jpg", alt: "Fine seeds held in a repeating current of air" },
    { src: "/images/pexels-aspen-sunburst-poster.jpg", alt: "A bright sunburst recurring between aspen trunks" },
  ],
};

export function buildInsightEditorialVisuals(
  posts: readonly InsightVisualPost[],
) {
  const topicIndexes = new Map<string, number>();

  return new Map(
    posts.map((post) => {
      const index = topicIndexes.get(post.topicSlug) ?? 0;
      topicIndexes.set(post.topicSlug, index + 1);

      const visual = EDITORIAL_VISUALS_BY_TOPIC[post.topicSlug]?.[index] ?? {
        src: post.heroImage,
        alt: post.heroImageAlt,
      };

      return [post.slug, visual] as const;
    }),
  );
}
