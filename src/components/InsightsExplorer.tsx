"use client";

import { useMemo, useState } from "react";
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
};

const ELEMENT_COLORS: Record<InsightElement, string> = {
  earth: "#B85A34",
  water: "#24394D",
  fire: "#C28A28",
  air: "#5C6B4A",
  space: "#AD6F5C",
};

export function InsightsExplorer({ posts, topics }: InsightsExplorerProps) {
  const [query, setQuery] = useState("");
  const [topicSlug, setTopicSlug] = useState("all");

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

  // The archive film stays intentionally low-contrast beneath the
  // interactive search layer, with posters covering reduced motion.
  return (
    <section id="insights-library" className="relative overflow-hidden bg-background-alt py-20 sm:py-28">
      <BackgroundVideo
        video="/videos/pexels-aspen-sunburst.mp4"
        poster="/images/pexels-aspen-sunburst-poster.jpg"
        parallax
        playbackRate={0.84}
      />
      <div aria-hidden="true" className="absolute inset-0 bg-[#EAE6DD]/88" />
      <div className="relative mx-auto w-full max-w-7xl px-5 sm:px-8 lg:px-12">
        <div className="grid gap-10 lg:grid-cols-[0.72fr_1.28fr] lg:items-end">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-clay">
              The library
            </p>
            <h2 className="mt-4 max-w-xl font-display text-display-md font-normal text-soil">
              Find the question behind the visible problem.
            </h2>
          </div>
          <p className="max-w-2xl text-base leading-7 text-foreground-secondary lg:justify-self-end">
            Search by the decision you are facing, or follow one of the five
            reading paths. Every article links back to the wider system, so one
            answer opens the next useful question.
          </p>
        </div>

        <div className="mt-12 rounded-[1.75rem] border border-soil/10 bg-background-elevated p-4 shadow-elevation-sm sm:p-5">
          <label className="relative block">
            <span className="sr-only">Search the insight library</span>
            <Search
              aria-hidden="true"
              className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-foreground-secondary"
            />
            <input
              type="search"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search positioning, messaging, memory"
              className="min-h-14 w-full rounded-full border border-border bg-ivory pl-12 pr-5 text-sm text-soil outline-none transition focus:border-clay focus:ring-2 focus:ring-clay/15"
            />
          </label>

          <div className="mt-4 flex flex-wrap gap-2" aria-label="Filter articles by topic">
            <button
              type="button"
              onClick={() => setTopicSlug("all")}
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
                  onClick={() => setTopicSlug(topic.slug)}
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
        </div>

        <div className="mt-6 flex items-center justify-between gap-4">
          <p className="text-sm text-foreground-secondary" aria-live="polite">
            {filteredPosts.length} {filteredPosts.length === 1 ? "essay" : "essays"}
          </p>
          {(query || topicSlug !== "all") && (
            <button
              type="button"
              onClick={() => {
                setQuery("");
                setTopicSlug("all");
              }}
              className="link-underline text-sm font-medium text-soil"
            >
              Clear the view
            </button>
          )}
        </div>

        {filteredPosts.length > 0 ? (
          <div className="mt-8 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {filteredPosts.map((post) => (
              <InsightCard key={post.slug} post={post} />
            ))}
          </div>
        ) : (
          <div className="mt-8 rounded-[1.5rem] border border-border bg-ivory px-6 py-16 text-center">
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
