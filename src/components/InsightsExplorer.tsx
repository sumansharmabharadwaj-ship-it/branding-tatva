"use client";

import {
  useDeferredValue,
  useMemo,
  useState,
  type CSSProperties,
} from "react";
import { AnimatePresence, motion, type Variants } from "framer-motion";
import { ArrowLeft, ArrowRight, Search } from "lucide-react";
import { BackgroundVideo } from "@/components/BackgroundVideo";
import {
  InsightCard,
  type InsightCardPost,
} from "@/components/InsightCard";
import type { InsightElement } from "@/data/insights";
import { useHydratedReducedMotion } from "@/hooks/useHydratedReducedMotion";

type ExplorerTopic = {
  slug: string;
  name: string;
  element: InsightElement;
};

type InsightsExplorerProps = {
  posts: InsightCardPost[];
  topics: ExplorerTopic[];
  sectionId?: string;
  eyebrow?: string;
  heading?: string;
  description?: string;
  searchPlaceholder?: string;
  video?: string;
  poster?: string;
};

const ELEMENT_COLORS: Record<InsightElement, string> = {
  earth: "#B85A34",
  water: "#24394D",
  fire: "#C28A28",
  air: "#5C6B4A",
  space: "#AD6F5C",
};

// The library keeps one stable row in the cinematic scene. Turning the folio
// replaces that row in place, so deeper browsing never creates a long runway
// or shifts the following scene farther away.
const POSTS_PER_FOLIO = 3;

const INTENT_LANGUAGE: Record<string, string> = {
  positioning:
    "price pricing cheap premium compare comparison category crowded offer audience niche differentiator similar explain value unclear",
  "customer-experience":
    "trust hesitate friction enquiry inquiry onboarding journey handoff slow confusing inconsistent experience promise delivery drop off",
  "distinctive-brand":
    "same similar generic interchangeable invisible attention recognition distinctive visual identity polished bland stand out",
  "brand-messaging":
    "explain explanation words website homepage proposal sales language voice message confusing unclear value proposition",
  "brand-memory":
    "forgettable recall remember memory consistency content publish posting recognition repeated familiar awareness faint",
};

function scorePostForIntent(post: InsightCardPost, cleanQuery: string) {
  const tokens = cleanQuery
    .split(/[^a-z0-9]+/)
    .filter((token) => token.length > 2);
  const title = post.title.toLowerCase();
  const primaryKeyword = post.primaryKeyword.toLowerCase();
  const secondaryKeywords = post.secondaryKeywords.join(" ").toLowerCase();
  const excerpt = post.excerpt.toLowerCase();
  const intentLanguage = INTENT_LANGUAGE[post.topicSlug] ?? "";
  let score = 0;

  if (title.includes(cleanQuery)) score += 24;
  if (primaryKeyword.includes(cleanQuery)) score += 18;
  if (secondaryKeywords.includes(cleanQuery)) score += 12;
  if (excerpt.includes(cleanQuery)) score += 8;
  if (intentLanguage.includes(cleanQuery)) score += 10;

  tokens.forEach((token) => {
    if (title.includes(token)) score += 7;
    if (primaryKeyword.includes(token)) score += 6;
    if (secondaryKeywords.includes(token)) score += 4;
    if (excerpt.includes(token)) score += 2;
    if (intentLanguage.includes(token)) score += 3;
  });

  return score;
}

const FOLIO_TURN_VARIANTS: Variants = {
  enter: (direction: number = 1) => ({
    opacity: 0.72,
    rotateY: direction * 4,
    scaleX: 0.985,
    clipPath:
      direction > 0
        ? "inset(0 7% 0 0 round 1.5rem)"
        : "inset(0 0 0 7% round 1.5rem)",
  }),
  settled: {
    opacity: 1,
    rotateY: 0,
    scaleX: 1,
    clipPath: "inset(0 0% 0 0% round 0rem)",
  },
  exit: (direction: number = 1) => ({
    opacity: 0.48,
    rotateY: direction * -3,
    scaleX: 0.992,
    clipPath:
      direction > 0
        ? "inset(0 0 0 7% round 1.5rem)"
        : "inset(0 7% 0 0 round 1.5rem)",
  }),
};

export function InsightsExplorer({
  posts,
  topics,
  sectionId = "insights-library",
  eyebrow = "The library",
  heading = "Find the article closest to the tension.",
  description = "Search in the language of the problem: price pressure, hesitation, sameness, unclear value, or faint recall. The library ranks the strongest clues first, while the five paths keep wider exploration open.",
  searchPlaceholder = "Try “price pressure” or “hard to explain”",
  video = "/videos/generated/bt-insights-library-leafcurrent.mp4",
  poster = "/images/generated/bt-insights-library-leafcurrent-poster.jpg",
}: InsightsExplorerProps) {
  const [query, setQuery] = useState("");
  const deferredQuery = useDeferredValue(query);
  const [topicSlug, setTopicSlug] = useState("all");
  const [folio, setFolio] = useState({ index: 0, direction: 1 });
  const prefersReducedMotion = useHydratedReducedMotion();

  const filteredPosts = useMemo(() => {
    const cleanQuery = deferredQuery.trim().toLowerCase();
    const topicPosts = posts.filter(
      (post) => topicSlug === "all" || post.topicSlug === topicSlug,
    );

    if (cleanQuery.length === 0) return topicPosts;

    return topicPosts
      .map((post) => ({ post, score: scorePostForIntent(post, cleanQuery) }))
      .filter((result) => result.score > 0)
      .sort(
        (a, b) =>
          b.score - a.score || b.post.updatedAt.localeCompare(a.post.updatedAt),
      )
      .map((result) => result.post);
  }, [deferredQuery, posts, topicSlug]);

  const folioCount = Math.max(1, Math.ceil(filteredPosts.length / POSTS_PER_FOLIO));
  const activeFolio = Math.min(folio.index, folioCount - 1);
  const firstPostIndex = activeFolio * POSTS_PER_FOLIO;
  const visiblePosts = filteredPosts.slice(
    firstPostIndex,
    firstPostIndex + POSTS_PER_FOLIO,
  );
  const settledQuery = deferredQuery.trim();
  const resultMessage = settledQuery
    ? filteredPosts.length > 0
      ? `Best matches ${firstPostIndex + 1}–${firstPostIndex + visiblePosts.length} of ${filteredPosts.length} for “${settledQuery}”`
      : `No close matches for “${settledQuery}”`
    : `${
        filteredPosts.length > 0
          ? `Showing ${firstPostIndex + 1}–${firstPostIndex + visiblePosts.length} of ${filteredPosts.length}`
          : "Showing 0"
      } ${filteredPosts.length === 1 ? "essay" : "essays"}`;

  function resetFolio() {
    setFolio({ index: 0, direction: -1 });
  }

  function turnFolio(nextIndex: number) {
    const clampedIndex = Math.min(folioCount - 1, Math.max(0, nextIndex));
    setFolio((current) => ({
      index: clampedIndex,
      direction: clampedIndex >= current.index ? 1 : -1,
    }));
  }

  // The archive film stays intentionally low-contrast beneath the
  // interactive search layer, with posters covering reduced motion.
  return (
    <section id={sectionId} className="insights-library relative overflow-hidden bg-background-alt">
      <div className="insights-library__film" aria-hidden="true">
        <BackgroundVideo
          video={video}
          poster={poster}
          playbackRate={0.84}
          posterPriority={false}
        />
        <div className="absolute inset-0 bg-[#EAE6DD]/87" />
      </div>
      <div className="insights-library__camera relative mx-auto w-full max-w-7xl px-5 sm:px-8 lg:px-12">
        <div className="insights-library__header">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-clay">
              {eyebrow}
            </p>
            <h2 className="mt-3 max-w-xl font-display text-display-sm font-normal text-soil">
              {heading}
            </h2>
          </div>
          <p className="max-w-2xl text-sm leading-6 text-foreground-secondary lg:justify-self-end">
            {description}
          </p>
        </div>

        <div className="insights-library__lens rounded-[1.5rem] border border-soil/10 bg-background-elevated p-4 shadow-elevation-sm">
          <label className="relative block">
            <span className="sr-only">Search the insight library</span>
            <Search
              aria-hidden="true"
              className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-foreground-secondary"
            />
            <input
              type="search"
              value={query}
              onChange={(event) => {
                setQuery(event.target.value);
                resetFolio();
              }}
              placeholder={searchPlaceholder}
              className="min-h-14 w-full rounded-full border border-border bg-ivory pl-12 pr-5 text-sm text-soil outline-none transition focus:border-clay focus:ring-2 focus:ring-clay/15"
            />
          </label>

          {topics.length > 0 && (
            <div
              className="insights-library__topics mt-4 flex flex-wrap gap-2"
              aria-label="Filter articles by topic"
            >
              <button
                type="button"
                onClick={() => {
                  setTopicSlug("all");
                  resetFolio();
                }}
                aria-pressed={topicSlug === "all"}
                className={`rounded-full border px-4 py-2 text-xs font-semibold uppercase tracking-[0.12em] transition ${
                  topicSlug === "all"
                    ? "border-soil bg-soil text-ivory"
                    : "border-border bg-transparent text-soil hover:border-soil/30"
                }`}
              >
                All themes
              </button>
              {topics.map((topic) => {
                const active = topicSlug === topic.slug;
                const color = ELEMENT_COLORS[topic.element];

                return (
                  <button
                    key={topic.slug}
                    type="button"
                    onClick={() => {
                      setTopicSlug(topic.slug);
                      resetFolio();
                    }}
                    aria-pressed={active}
                    className="rounded-full border px-4 py-2 text-xs font-semibold uppercase tracking-[0.12em] transition"
                    style={{
                      borderColor: active ? color : "#D9CDBC",
                      backgroundColor: active ? `${color}18` : "transparent",
                      color: active ? color : "#27221E",
                    }}
                  >
                    {topic.name}
                  </button>
                );
              })}
            </div>
          )}
        </div>

        <div
          className="insights-library__result-line flex items-center justify-between gap-4"
          aria-busy={query !== deferredQuery}
        >
          <p className="text-sm text-foreground-secondary" aria-live="polite">
            {resultMessage}
          </p>
          {(query || topicSlug !== "all") && (
            <button
              type="button"
              onClick={() => {
                setQuery("");
                setTopicSlug("all");
                resetFolio();
              }}
              className="link-underline text-sm font-medium text-soil"
            >
              Clear the view
            </button>
          )}
        </div>

        {filteredPosts.length > 0 ? (
          <>
            <AnimatePresence mode="wait" initial={false} custom={folio.direction}>
              <motion.div
                key={`${topicSlug}-${activeFolio}`}
                custom={folio.direction}
                className="insights-library__folios grid gap-5 md:grid-cols-2 xl:grid-cols-3"
                variants={FOLIO_TURN_VARIANTS}
                initial={prefersReducedMotion ? false : "enter"}
                animate="settled"
                exit={prefersReducedMotion ? undefined : "exit"}
                transition={{
                  duration: prefersReducedMotion ? 0 : 0.46,
                  ease: [0.22, 1, 0.36, 1],
                }}
                style={{ transformPerspective: 1400 }}
              >
                {visiblePosts.map((post, index) => (
                  <div
                    key={post.slug}
                    className="insights-library__folio"
                    style={{
                      "--folio-delay": `${index * 38}ms`,
                    } as CSSProperties}
                  >
                    <InsightCard post={post} showReadingOutcome />
                  </div>
                ))}
              </motion.div>
            </AnimatePresence>

            {folioCount > 1 ? (
              <div
                className="insights-library__pager"
                role="group"
                aria-label="Essay folios"
              >
                <button
                  type="button"
                  onClick={() => turnFolio(activeFolio - 1)}
                  disabled={activeFolio === 0}
                >
                  <ArrowLeft aria-hidden="true" className="h-4 w-4" />
                  Previous
                </button>
                <span aria-live="polite">
                  Folio {activeFolio + 1} / {folioCount}
                </span>
                <button
                  type="button"
                  onClick={() => turnFolio(activeFolio + 1)}
                  disabled={activeFolio === folioCount - 1}
                >
                  Next
                  <ArrowRight aria-hidden="true" className="h-4 w-4" />
                </button>
              </div>
            ) : null}
          </>
        ) : (
          <div className="insights-library__empty rounded-[1.5rem] border border-border bg-ivory px-6 py-16 text-center">
            <p className="font-display text-2xl text-soil">
              This search has wandered beyond the current library.
            </p>
            <p className="mx-auto mt-3 max-w-md text-sm leading-6 text-foreground-secondary">
              Try a broader phrase such as positioning, audit, recall, message,
              price pressure, trust, sameness, or brand system.
            </p>
          </div>
        )}
      </div>
    </section>
  );
}
