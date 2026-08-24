"use client";

import { useMemo, useState, type CSSProperties } from "react";
import { Search } from "lucide-react";
import { BackgroundVideo } from "@/components/BackgroundVideo";
import {
  InsightCard,
  type InsightCardPost,
} from "@/components/InsightCard";
import type { InsightElement } from "@/data/insights";

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

// The landing page is a doorway, not the full archive. One complete desktop
// row gives a visitor enough choice without turning the page into a catalogue
// before they have searched or chosen a reading path. The remaining essays
// stay available through an explicit, reversible "show more" action.
const INITIAL_VISIBLE_POSTS = 3;
const LOAD_MORE_POSTS = 6;

export function InsightsExplorer({
  posts,
  topics,
  sectionId = "insights-library",
  eyebrow = "The library",
  heading = "Find the question behind the visible problem.",
  description = "Search by the decision you are facing, or follow one of the five reading paths. Every article links back to the wider system, so one answer opens the next useful question.",
  searchPlaceholder = "Search positioning, messaging, memory",
  video = "/videos/generated/bt-insights-library-leafcurrent.mp4",
  poster = "/images/generated/bt-insights-library-leafcurrent-poster.jpg",
}: InsightsExplorerProps) {
  const [query, setQuery] = useState("");
  const [topicSlug, setTopicSlug] = useState("all");
  const [visibleCount, setVisibleCount] = useState(INITIAL_VISIBLE_POSTS);

  const filteredPosts = useMemo(() => {
    const cleanQuery = query.trim().toLowerCase();

    return posts.filter((post) => {
      const matchesTopic = topicSlug === "all" || post.topicSlug === topicSlug;
      const searchable = [
        post.title,
        post.excerpt,
        post.primaryKeyword,
        ...post.secondaryKeywords,
      ]
        .join(" ")
        .toLowerCase();
      const matchesQuery = cleanQuery.length === 0 || searchable.includes(cleanQuery);

      return matchesTopic && matchesQuery;
    });
  }, [posts, query, topicSlug]);

  const visiblePosts = filteredPosts.slice(0, visibleCount);
  const remainingPosts = Math.max(0, filteredPosts.length - visiblePosts.length);

  // The archive film stays intentionally low-contrast beneath the
  // interactive search layer, with posters covering reduced motion.
  return (
    <section id={sectionId} className="insights-library relative overflow-hidden bg-background-alt">
      <div className="insights-library__film" aria-hidden="true">
        <BackgroundVideo
          video={video}
          poster={poster}
          playbackRate={0.84}
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
                setVisibleCount(INITIAL_VISIBLE_POSTS);
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
                  setVisibleCount(INITIAL_VISIBLE_POSTS);
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
                      setVisibleCount(INITIAL_VISIBLE_POSTS);
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

        <div className="insights-library__result-line flex items-center justify-between gap-4">
          <p className="text-sm text-foreground-secondary" aria-live="polite">
            Showing {visiblePosts.length} of {filteredPosts.length} {filteredPosts.length === 1 ? "essay" : "essays"}
          </p>
          {(query || topicSlug !== "all") && (
            <button
              type="button"
              onClick={() => {
                setQuery("");
                setTopicSlug("all");
                setVisibleCount(INITIAL_VISIBLE_POSTS);
              }}
              className="link-underline text-sm font-medium text-soil"
            >
              Clear the view
            </button>
          )}
        </div>

        {filteredPosts.length > 0 ? (
          <>
            <div className="insights-library__folios grid gap-5 md:grid-cols-2 xl:grid-cols-3">
              {visiblePosts.map((post, index) => (
                <div
                  key={post.slug}
                  className="insights-library__folio"
                  style={{
                    "--folio-delay": `${index * 38}ms`,
                  } as CSSProperties}
                >
                  <InsightCard post={post} />
                </div>
              ))}
            </div>
            {remainingPosts > 0 && (
              <div className="mt-6 flex justify-center">
                <button
                  type="button"
                  onClick={() => setVisibleCount((count) => count + LOAD_MORE_POSTS)}
                  className="min-h-12 rounded-full border border-soil/25 bg-ivory/75 px-6 py-3 text-sm font-semibold text-soil shadow-elevation-sm transition hover:-translate-y-0.5 hover:border-soil/45 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-clay"
                >
                  Show {Math.min(LOAD_MORE_POSTS, remainingPosts)} more essays
                </button>
              </div>
            )}
          </>
        ) : (
          <div className="insights-library__empty rounded-[1.5rem] border border-border bg-ivory px-6 py-16 text-center">
            <p className="font-display text-2xl text-soil">
              This search has wandered beyond the current library.
            </p>
            <p className="mx-auto mt-3 max-w-md text-sm leading-6 text-foreground-secondary">
              Try a broader phrase such as positioning, audit, recall, message,
              or brand system.
            </p>
          </div>
        )}
      </div>
    </section>
  );
}
