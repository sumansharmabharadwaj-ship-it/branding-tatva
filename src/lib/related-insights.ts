import type { InsightPost } from "@/data/insights";

const RELATED_TOPIC_BRIDGES: Record<string, string[]> = {
  positioning: ["brand-messaging", "customer-experience"],
  "customer-experience": ["brand-messaging", "brand-memory"],
  "distinctive-brand": ["brand-memory", "brand-messaging"],
  "brand-messaging": ["positioning", "customer-experience"],
  "brand-memory": ["distinctive-brand", "customer-experience"],
};

const RELATED_STOP_WORDS = new Set([
  "and",
  "brand",
  "business",
  "for",
  "from",
  "how",
  "into",
  "service",
  "services",
  "that",
  "the",
  "this",
  "with",
]);

function getRelatedTerms(post: InsightPost) {
  const words = [
    post.title,
    post.primaryKeyword,
    ...post.secondaryKeywords,
    post.searchIntent,
    ...post.keyTakeaways.slice(0, 2),
  ]
    .join(" ")
    .toLowerCase()
    .match(/[a-z0-9]+/g);

  return new Set(
    (words ?? []).filter(
      (word) => word.length > 2 && !RELATED_STOP_WORDS.has(word),
    ),
  );
}

function getAffinityScore(source: InsightPost, candidate: InsightPost) {
  const sourceTerms = getRelatedTerms(source);
  const candidateTerms = getRelatedTerms(candidate);
  let score = 0;

  for (const term of candidateTerms) {
    if (sourceTerms.has(term)) score += term.length >= 8 ? 3 : 1;
  }

  if (candidate.relatedSlugs.includes(source.slug)) score += 12;

  const explicitIndex = source.relatedSlugs.indexOf(candidate.slug);
  if (explicitIndex >= 0) {
    score += (source.relatedSlugs.length - explicitIndex) * 8;
  }

  return score;
}

export function selectRelatedInsights(
  source: InsightPost,
  posts: InsightPost[],
  limit = 3,
) {
  if (limit <= 0) return [];

  const candidates = posts.filter((candidate) => candidate.slug !== source.slug);
  const explicit = source.relatedSlugs
    .map((slug) => candidates.find((candidate) => candidate.slug === slug))
    .filter((candidate): candidate is InsightPost => Boolean(candidate));
  const selected: InsightPost[] = [];
  const selectedSlugs = new Set<string>();

  const add = (candidate?: InsightPost) => {
    if (!candidate || selectedSlugs.has(candidate.slug) || selected.length >= limit) {
      return;
    }

    selected.push(candidate);
    selectedSlugs.add(candidate.slug);
  };

  add(explicit[0]);

  for (const topicSlug of RELATED_TOPIC_BRIDGES[source.topicSlug] ?? []) {
    if (selected.length >= limit) break;
    if (selected.some((candidate) => candidate.topicSlug === topicSlug)) continue;

    const bestBridge = candidates
      .map((candidate, order) => ({
        candidate,
        order,
        score: getAffinityScore(source, candidate),
      }))
      .filter(({ candidate }) => candidate.topicSlug === topicSlug)
      .sort((a, b) => b.score - a.score || a.order - b.order)[0]?.candidate;

    add(bestBridge);
  }

  for (const candidate of explicit) add(candidate);

  if (selected.length < limit) {
    const remaining = candidates
      .map((candidate, order) => ({
        candidate,
        order,
        score: getAffinityScore(source, candidate),
      }))
      .filter(({ candidate }) => !selectedSlugs.has(candidate.slug))
      .sort((a, b) => b.score - a.score || a.order - b.order);

    for (const { candidate } of remaining) add(candidate);
  }

  return selected.slice(0, limit);
}
