"use client";

import {
  useDeferredValue,
  useEffect,
  useMemo,
  useRef,
  useState,
  type CSSProperties,
  type UIEvent,
} from "react";
import { AnimatePresence, motion, type Variants } from "framer-motion";
import { ArrowLeft, ArrowRight, Search } from "lucide-react";
import { BackgroundVideo } from "@/components/BackgroundVideo";
import {
  InsightCard,
  type InsightCardPost,
} from "@/components/InsightCard";
import { ElementGlyph } from "@/components/ElementGlyph";
import type { InsightElement } from "@/data/insights";
import { buildInsightEditorialVisuals } from "@/data/insightEditorialVisuals";
import { useHydratedReducedMotion } from "@/hooks/useHydratedReducedMotion";
import {
  clearInsightsIntent,
  INSIGHTS_INTENT_CLEARED_EVENT,
  INSIGHTS_INTENT_EVENT,
  publishInsightsIntent,
  readInsightsIntent,
  type InsightsIntentDetail,
} from "@/lib/insights-intent";
import {
  readInsightsLibraryState,
  writeInsightsLibraryState,
} from "@/lib/insights-library-state";
import { track } from "@/lib/analytics";

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

const THREAD_COLORS: Record<InsightElement, string> = {
  earth: "#D77A51",
  water: "#7FA4BA",
  fire: "#D7A84A",
  air: "#A8B68F",
  space: "#D09A89",
};

// The library keeps one stable row in the cinematic scene. Turning the folio
// replaces that row in place, so deeper browsing never creates a long runway
// or shifts the following scene farther away.
const POSTS_PER_FOLIO = 3;
const RECOVERY_QUERIES = [
  "price pressure",
  "trust gaps",
  "brand sameness",
  "faint recall",
];

const INTENT_LANGUAGE: Record<string, string> = {
  positioning:
    "price pricing pressure cheap premium compare comparison category crowded offer audience niche differentiator similar explain value unclear",
  "customer-experience":
    "trust hesitate friction gap gaps enquiry inquiry onboarding journey handoff slow confusing inconsistent experience promise delivery drop off",
  "distinctive-brand":
    "same sameness similar generic interchangeable invisible attention recognition distinctive visual identity polished bland stand out",
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

function describeTopMatch(post: InsightCardPost, cleanQuery: string) {
  const tokens = cleanQuery
    .split(/[^a-z0-9]+/)
    .filter((token) => token.length > 2);
  const wording = [
    post.title,
    post.primaryKeyword,
    post.secondaryKeywords.join(" "),
    post.excerpt,
  ]
    .join(" ")
    .toLowerCase();
  const intentLanguage = INTENT_LANGUAGE[post.topicSlug] ?? "";

  if (
    wording.includes(cleanQuery) ||
    (tokens.length > 0 &&
      tokens.filter((token) => wording.includes(token)).length >=
        Math.min(2, tokens.length))
  ) {
    return { label: "Closest wording match", kind: "wording" } as const;
  }

  if (
    intentLanguage.includes(cleanQuery) ||
    tokens.some((token) => intentLanguage.includes(token))
  ) {
    return { label: "Closest tension match", kind: "tension" } as const;
  }

  return { label: "Closest current match", kind: "ranked" } as const;
}

function interleaveTopicPaths(
  posts: InsightCardPost[],
  topics: ExplorerTopic[],
) {
  const knownTopicSlugs = new Set(topics.map((topic) => topic.slug));
  const topicQueues = new Map(
    topics.map((topic) => [
      topic.slug,
      posts.filter((post) => post.topicSlug === topic.slug),
    ]),
  );
  const balancedPosts: InsightCardPost[] = [];
  let depth = 0;

  while (balancedPosts.length < posts.length) {
    let foundPostAtDepth = false;

    topics.forEach((topic) => {
      const post = topicQueues.get(topic.slug)?.[depth];
      if (!post) return;
      balancedPosts.push(post);
      foundPostAtDepth = true;
    });

    if (!foundPostAtDepth) break;
    depth += 1;
  }

  return [
    ...balancedPosts,
    ...posts.filter((post) => !knownTopicSlugs.has(post.topicSlug)),
  ];
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
  const [carriedIntent, setCarriedIntent] =
    useState<InsightsIntentDetail>();
  const [folio, setFolio] = useState({ index: 0, direction: 1 });
  const [mobileCardIndex, setMobileCardIndex] = useState(0);
  const [hasRestoredLibraryState, setHasRestoredLibraryState] =
    useState(false);
  const topicRailRef = useRef<HTMLDivElement>(null);
  const topicButtonRefs = useRef<Array<HTMLButtonElement | null>>([]);
  const folioTrackRef = useRef<HTMLDivElement>(null);
  const folioCardRefs = useRef<Array<HTMLDivElement | null>>([]);
  const prefersReducedMotion = useHydratedReducedMotion();

  const libraryVisuals = useMemo(
    () => buildInsightEditorialVisuals(posts),
    [posts],
  );

  useEffect(() => {
    function applyIntent(detail: InsightsIntentDetail | undefined) {
      if (!detail || !topics.some((topic) => topic.slug === detail.topicSlug)) {
        return false;
      }

      setCarriedIntent(detail);
      setQuery(detail.query);
      setTopicSlug(detail.topicSlug);
      setFolio({ index: 0, direction: -1 });
      return true;
    }

    function carryIntent(event: Event) {
      const { detail } = event as CustomEvent<InsightsIntentDetail>;
      applyIntent(detail);
    }

    function releaseIntent() {
      setCarriedIntent(undefined);
    }

    window.addEventListener(INSIGHTS_INTENT_EVENT, carryIntent);
    window.addEventListener(INSIGHTS_INTENT_CLEARED_EVENT, releaseIntent);
    const initialIntent = readInsightsIntent();
    const restoredLibrary = readInsightsLibraryState();
    const hasValidLibraryTopic =
      restoredLibrary?.topicSlug === "all" ||
      topics.some((topic) => topic.slug === restoredLibrary?.topicSlug);
    const libraryMatchesInternalIntent =
      !initialIntent ||
      (initialIntent.origin === "insights-library" &&
        initialIntent.topicSlug === restoredLibrary?.topicSlug);

    if (restoredLibrary && hasValidLibraryTopic && libraryMatchesInternalIntent) {
      setQuery(restoredLibrary.query);
      setTopicSlug(restoredLibrary.topicSlug);
      setFolio({ index: restoredLibrary.folio, direction: -1 });

      if (initialIntent?.origin === "insights-library") {
        setCarriedIntent(initialIntent);
      }
    } else {
      applyIntent(initialIntent);
    }

    setHasRestoredLibraryState(true);
    return () => {
      window.removeEventListener(INSIGHTS_INTENT_EVENT, carryIntent);
      window.removeEventListener(INSIGHTS_INTENT_CLEARED_EVENT, releaseIntent);
    };
  }, [topics]);

  const filteredPosts = useMemo(() => {
    const cleanQuery = deferredQuery.trim().toLowerCase();
    const topicPosts = posts.filter(
      (post) => topicSlug === "all" || post.topicSlug === topicSlug,
    );

    if (cleanQuery.length === 0) {
      return topicSlug === "all"
        ? interleaveTopicPaths(topicPosts, topics)
        : topicPosts;
    }

    return topicPosts
      .map((post) => ({ post, score: scorePostForIntent(post, cleanQuery) }))
      .filter((result) => result.score > 0)
      .sort(
        (a, b) =>
          b.score - a.score || b.post.updatedAt.localeCompare(a.post.updatedAt),
      )
      .map((result) => result.post);
  }, [deferredQuery, posts, topicSlug, topics]);

  const folioCount = Math.max(1, Math.ceil(filteredPosts.length / POSTS_PER_FOLIO));
  const activeFolio = Math.min(folio.index, folioCount - 1);
  const folioProgress =
    folioCount > 1 ? (activeFolio / (folioCount - 1)) * 100 : 0;
  const firstPostIndex = activeFolio * POSTS_PER_FOLIO;
  const visiblePosts = filteredPosts.slice(
    firstPostIndex,
    firstPostIndex + POSTS_PER_FOLIO,
  );
  const visibleFolioKey =
    visiblePosts.map((post) => post.slug).join("|") || "empty";
  const settledQuery = deferredQuery.trim();
  const selectedTopic =
    topicSlug === "all"
      ? undefined
      : topics.find((topic) => topic.slug === topicSlug);
  const inferredTopic = settledQuery
    ? topics.find((topic) => topic.slug === filteredPosts[0]?.topicSlug)
    : selectedTopic;
  const signalKey = settledQuery
    ? inferredTopic?.slug ?? "unresolved"
    : selectedTopic?.slug ?? "open";
  const signalLabel = carriedIntent
    ? carriedIntent.origin === "decision-mirror"
      ? "Carried from your mirror"
      : carriedIntent.origin === "knowledge-atlas"
        ? "Carried from your atlas"
        : carriedIntent.origin === "evidence-ledger"
          ? "Confirmed in your ledger"
        : "Chosen in this library"
    : settledQuery
      ? inferredTopic
        ? "Strongest current"
        : "Signal unresolved"
      : selectedTopic
        ? "Path in focus"
        : "Search lens";
  const signalTitle = inferredTopic
    ? inferredTopic.name
    : settledQuery
      ? "A wider phrase will open more paths"
      : "Five strategic paths remain open";
  const signalDetail = carriedIntent
    ? carriedIntent.origin === "decision-mirror" && carriedIntent.query
      ? `“${carriedIntent.query}” stays in view. ${filteredPosts.length} ${filteredPosts.length === 1 ? "essay matches" : "essays match"} this route.`
      : `${filteredPosts.length} ${filteredPosts.length === 1 ? "essay now follows" : "essays now follow"} the ${carriedIntent.label.toLowerCase()} route you chose.`
    : settledQuery
      ? inferredTopic
        ? `${filteredPosts.length} ${filteredPosts.length === 1 ? "essay gathers" : "essays gather"} around this path.`
        : "The archive needs a broader clue."
      : selectedTopic
        ? `${filteredPosts.length} ${filteredPosts.length === 1 ? "essay remains" : "essays remain"} in this path.`
        : "Write the symptom in the language already used in the room.";
  const signalColor = inferredTopic
    ? ELEMENT_COLORS[inferredTopic.element]
    : "#B85A34";
  const carriedTopic = carriedIntent
    ? topics.find((topic) => topic.slug === carriedIntent.topicSlug)
    : undefined;
  const threadColor = carriedTopic
    ? THREAD_COLORS[carriedTopic.element]
    : signalColor;
  const topMatch =
    settledQuery && filteredPosts[0]
      ? carriedIntent?.origin === "decision-mirror"
        ? { label: "Closest to your chosen tension", kind: "reader_tension" as const }
        : describeTopMatch(filteredPosts[0], settledQuery.toLowerCase())
      : undefined;
  const resultMessage = settledQuery
    ? filteredPosts.length > 0
      ? `Best matches ${firstPostIndex + 1}–${firstPostIndex + visiblePosts.length} of ${filteredPosts.length} for “${settledQuery}”`
      : `No close matches for “${settledQuery}”`
    : `${
        filteredPosts.length > 0
          ? `Showing ${firstPostIndex + 1}–${firstPostIndex + visiblePosts.length} of ${filteredPosts.length}`
          : "Showing 0"
      } ${filteredPosts.length === 1 ? "essay" : "essays"}`;

  useEffect(() => {
    if (!hasRestoredLibraryState) return;

    writeInsightsLibraryState({
      query,
      topicSlug,
      folio: activeFolio,
    });
  }, [activeFolio, hasRestoredLibraryState, query, topicSlug]);

  useEffect(() => {
    setMobileCardIndex(0);
    folioCardRefs.current.length = visiblePosts.length;
    folioTrackRef.current?.scrollTo({
      left: 0,
      behavior: prefersReducedMotion ? "auto" : "smooth",
    });
  }, [
    activeFolio,
    prefersReducedMotion,
    topicSlug,
    visibleFolioKey,
    visiblePosts.length,
  ]);

  useEffect(() => {
    const rail = topicRailRef.current;
    const selectedIndex =
      topicSlug === "all"
        ? 0
        : topics.findIndex((topic) => topic.slug === topicSlug) + 1;
    const button = topicButtonRefs.current[Math.max(0, selectedIndex)];

    if (!rail || !button || rail.scrollWidth <= rail.clientWidth + 2) return;

    const centeredPosition =
      button.offsetLeft - (rail.clientWidth - button.clientWidth) / 2;
    rail.scrollTo({
      left: Math.max(0, centeredPosition),
      behavior: prefersReducedMotion ? "auto" : "smooth",
    });
  }, [prefersReducedMotion, topicSlug, topics]);

  function resetFolio() {
    setFolio({ index: 0, direction: -1 });
  }

  function releaseCarriedIntent() {
    clearInsightsIntent();
    setCarriedIntent(undefined);
  }

  function chooseTopic(topic: ExplorerTopic) {
    publishInsightsIntent({
      topicSlug: topic.slug,
      query: "",
      label: topic.name,
      origin: "insights-library",
    });
    track("insights_path_selected", {
      source: "insights_library",
      path: topic.slug,
    });
  }

  function recoverWithQuery(nextQuery: string) {
    releaseCarriedIntent();
    setQuery(nextQuery);
    setTopicSlug("all");
    resetFolio();
  }

  function turnFolio(nextIndex: number) {
    const clampedIndex = Math.min(folioCount - 1, Math.max(0, nextIndex));
    setFolio((current) => ({
      index: clampedIndex,
      direction: clampedIndex >= current.index ? 1 : -1,
    }));
  }

  function goToMobileCard(nextIndex: number) {
    const clampedIndex = Math.min(
      visiblePosts.length - 1,
      Math.max(0, nextIndex),
    );
    const track = folioTrackRef.current;
    const card = folioCardRefs.current[clampedIndex];

    setMobileCardIndex(clampedIndex);
    if (!track || !card) return;

    const centeredPosition =
      card.offsetLeft - (track.clientWidth - card.clientWidth) / 2;
    track.scrollTo({
      left: Math.max(0, centeredPosition),
      behavior: prefersReducedMotion ? "auto" : "smooth",
    });
  }

  function handleMobileCardScroll(event: UIEvent<HTMLDivElement>) {
    const track = event.currentTarget;
    const trackCenter = track.scrollLeft + track.clientWidth / 2;
    let closestIndex = mobileCardIndex;
    let closestDistance = Number.POSITIVE_INFINITY;

    folioCardRefs.current.forEach((card, index) => {
      if (!card) return;
      const cardCenter = card.offsetLeft + card.clientWidth / 2;
      const distance = Math.abs(cardCenter - trackCenter);
      if (distance < closestDistance) {
        closestDistance = distance;
        closestIndex = index;
      }
    });

    if (closestIndex !== mobileCardIndex) setMobileCardIndex(closestIndex);
  }

  // The archive film stays intentionally low-contrast beneath the
  // interactive search layer, with posters covering reduced motion.
  return (
    <section
      id={sectionId}
      className="insights-library relative overflow-hidden bg-background-alt"
      data-thread-active={Boolean(carriedTopic)}
      style={{ "--library-thread": threadColor } as CSSProperties}
    >
      <div className="insights-library__film" aria-hidden="true">
        <BackgroundVideo
          video={video}
          poster={poster}
          playbackRate={0.84}
          posterPriority={false}
        />
        <div className="absolute inset-0 bg-[#EAE6DD]/87" />
      </div>
      <div className="insights-library__handoff" aria-hidden="true">
        <i />
        <span>
          {carriedTopic ? (
            <>
              <ElementGlyph
                slug={carriedTopic.element}
                className="h-4 w-4"
                strokeWidth={1.35}
              />
              <small>{carriedTopic.name}</small>
            </>
          ) : null}
        </span>
      </div>
      <div className="insights-library__evidence-handoff" aria-hidden="true">
        <span>
          {carriedTopic ? (
            <>
              <ElementGlyph
                slug={carriedTopic.element}
                className="h-4 w-4"
                strokeWidth={1.35}
              />
              <small>{carriedTopic.name}</small>
            </>
          ) : null}
        </span>
        <i />
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

        <div
          className="insights-library__lens rounded-[1.5rem] border border-soil/10 bg-background-elevated p-4 shadow-elevation-sm"
          style={{ "--library-signal": signalColor } as CSSProperties}
        >
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
                releaseCarriedIntent();
                setQuery(event.target.value);
                resetFolio();
              }}
              placeholder={searchPlaceholder}
              className="min-h-14 w-full rounded-full border border-border bg-ivory pl-12 pr-5 text-sm text-soil outline-none transition focus:border-clay focus:ring-2 focus:ring-clay/15"
            />
          </label>

          <div
            className="insights-library__signal"
            aria-live="polite"
            aria-busy={query !== deferredQuery}
          >
            <span
              className="insights-library__signal-glyph"
              style={{ color: signalColor }}
              aria-hidden="true"
            >
              {inferredTopic ? (
                <ElementGlyph
                  slug={inferredTopic.element}
                  className="h-4 w-4"
                  strokeWidth={1.4}
                />
              ) : (
                <Search className="h-4 w-4" strokeWidth={1.4} />
              )}
            </span>
            <AnimatePresence mode="wait" initial={false}>
              <motion.p
                key={signalKey}
                initial={
                  prefersReducedMotion
                    ? false
                    : { clipPath: "inset(0 0 100% 0)", y: 5 }
                }
                animate={{ clipPath: "inset(0 0 0% 0)", y: 0 }}
                exit={
                  prefersReducedMotion
                    ? undefined
                    : { clipPath: "inset(100% 0 0 0)", y: -4 }
                }
                transition={{
                  duration: prefersReducedMotion ? 0 : 0.3,
                  ease: [0.22, 1, 0.36, 1],
                }}
              >
                <span>{signalLabel}</span>
                <strong>{signalTitle}</strong>
              </motion.p>
            </AnimatePresence>
            <small>{signalDetail}</small>
          </div>

          {topics.length > 0 && (
            <div
              ref={topicRailRef}
              className="insights-library__topics mt-4 flex flex-wrap gap-2"
              aria-label="Filter articles by topic"
            >
              <button
                ref={(node) => {
                  topicButtonRefs.current[0] = node;
                }}
                type="button"
                onClick={() => {
                  releaseCarriedIntent();
                  setQuery("");
                  setTopicSlug("all");
                  resetFolio();
                  track("insights_path_selected", {
                    source: "insights_library",
                    path: "all",
                  });
                }}
                aria-pressed={topicSlug === "all"}
                className={`min-h-11 rounded-full border px-4 py-2 text-xs font-semibold uppercase tracking-[0.12em] transition ${
                  topicSlug === "all"
                    ? "border-soil bg-soil text-ivory"
                    : "border-border bg-transparent text-soil hover:border-soil/30"
                }`}
              >
                All themes
              </button>
              {topics.map((topic, index) => {
                const active = topicSlug === topic.slug;
                const color = ELEMENT_COLORS[topic.element];

                return (
                  <button
                    key={topic.slug}
                    ref={(node) => {
                      topicButtonRefs.current[index + 1] = node;
                    }}
                    type="button"
                    onClick={() => chooseTopic(topic)}
                    aria-pressed={active}
                    className="min-h-11 rounded-full border px-4 py-2 text-xs font-semibold uppercase tracking-[0.12em] transition"
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
                releaseCarriedIntent();
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
            {visiblePosts.length > 1 ? (
              <div
                className="insights-library__mobile-reader"
                style={
                  {
                    "--mobile-card-progress": `${
                      ((mobileCardIndex + 1) / visiblePosts.length) * 100
                    }%`,
                  } as CSSProperties
                }
              >
                <div
                  className="insights-library__mobile-reader-copy"
                  aria-live="polite"
                >
                  <span>Reading shelf</span>
                  <strong>
                    {String(mobileCardIndex + 1).padStart(2, "0")} /{" "}
                    {String(visiblePosts.length).padStart(2, "0")} ·{" "}
                    {visiblePosts[mobileCardIndex]?.title}
                  </strong>
                </div>
                <div
                  className="insights-library__mobile-reader-actions"
                  role="group"
                  aria-label="Move through visible essays"
                >
                  <button
                    type="button"
                    aria-label="Previous essay"
                    disabled={mobileCardIndex === 0}
                    onClick={() => goToMobileCard(mobileCardIndex - 1)}
                  >
                    <ArrowLeft aria-hidden="true" className="h-4 w-4" />
                  </button>
                  <button
                    type="button"
                    aria-label="Next essay"
                    disabled={mobileCardIndex === visiblePosts.length - 1}
                    onClick={() => goToMobileCard(mobileCardIndex + 1)}
                  >
                    <ArrowRight aria-hidden="true" className="h-4 w-4" />
                  </button>
                </div>
                <i aria-hidden="true" />
              </div>
            ) : null}
            <AnimatePresence mode="wait" initial={false} custom={folio.direction}>
              <motion.div
                key={`${topicSlug}-${activeFolio}-${visibleFolioKey}`}
                ref={folioTrackRef}
                custom={folio.direction}
                className="insights-library__folios grid gap-5 md:grid-cols-2 xl:grid-cols-3"
                onScroll={handleMobileCardScroll}
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
                    ref={(node) => {
                      folioCardRefs.current[index] = node;
                    }}
                    className="insights-library__folio"
                    style={{
                      "--folio-delay": `${index * 38}ms`,
                    } as CSSProperties}
                  >
                    <InsightCard
                      post={post}
                      imageOverride={libraryVisuals.get(post.slug)}
                      showReadingOutcome
                      readingCue={
                        firstPostIndex === 0 && index === 0
                          ? topMatch?.label
                          : undefined
                      }
                      tracking={{
                        source: "insights_library",
                        context: {
                          mode: settledQuery
                            ? "ranked_search"
                            : topicSlug === "all"
                              ? "open_archive"
                              : "topic_filter",
                          folio: activeFolio + 1,
                          position: firstPostIndex + index + 1,
                          match_reason:
                            firstPostIndex === 0 && index === 0
                              ? topMatch?.kind ?? "none"
                              : "none",
                          carried_from: carriedIntent?.origin ?? "none",
                        },
                      }}
                    />
                  </div>
                ))}
              </motion.div>
            </AnimatePresence>

            {folioCount > 1 ? (
              <div
                className="insights-library__pager"
                role="group"
                aria-label="Essay folios"
                style={
                  {
                    "--folio-progress": `${folioProgress}%`,
                  } as CSSProperties
                }
              >
                <button
                  type="button"
                  onClick={() => turnFolio(activeFolio - 1)}
                  disabled={activeFolio === 0}
                >
                  <ArrowLeft aria-hidden="true" className="h-4 w-4" />
                  Previous
                </button>
                <label className="insights-library__folio-depth">
                  <span aria-live="polite">
                    Folio {activeFolio + 1} / {folioCount}
                  </span>
                  <input
                    type="range"
                    min="1"
                    max={folioCount}
                    step="1"
                    value={activeFolio + 1}
                    onChange={(event) =>
                      turnFolio(Number(event.currentTarget.value) - 1)
                    }
                    aria-label="Choose essay folio"
                    aria-valuetext={`Folio ${activeFolio + 1} of ${folioCount}, essays ${firstPostIndex + 1} to ${firstPostIndex + visiblePosts.length}`}
                  />
                </label>
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
              Choose the clue closest to the concern and the archive will open
              a wider route.
            </p>
            <div
              className="insights-library__recovery"
              aria-label="Broader search suggestions"
            >
              {RECOVERY_QUERIES.map((suggestion) => (
                <button
                  key={suggestion}
                  type="button"
                  onClick={() => recoverWithQuery(suggestion)}
                >
                  {suggestion}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
