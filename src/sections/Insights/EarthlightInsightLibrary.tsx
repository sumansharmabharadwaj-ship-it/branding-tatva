"use client";

import Link from "next/link";
import { useMemo, useState } from "react";

type LibraryPost = {
  slug: string;
  title: string;
  excerpt: string;
  topicSlug: string;
  readingTime: string;
  updatedAt: string;
};

type LibraryTopic = { slug: string; name: string };

export function EarthlightInsightLibrary({ posts, topics }: { posts: LibraryPost[]; topics: LibraryTopic[] }) {
  const [query, setQuery] = useState("");
  const [topic, setTopic] = useState("all");

  const visible = useMemo(() => {
    const normalised = query.trim().toLowerCase();
    return posts.filter((post) => {
      const matchesTopic = topic === "all" || post.topicSlug === topic;
      const matchesQuery = !normalised || `${post.title} ${post.excerpt}`.toLowerCase().includes(normalised);
      return matchesTopic && matchesQuery;
    });
  }, [posts, query, topic]);

  return (
    <div className="el-library">
      <div className="el-library__controls">
        <label className="el-library__search">
          <span>Search the library</span>
          <input
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Positioning, messaging, proof…"
          />
        </label>
        <div className="el-library__topics" role="group" aria-label="Filter insights by topic">
          <button type="button" aria-pressed={topic === "all"} onClick={() => setTopic("all")}>All</button>
          {topics.map((item) => (
            <button key={item.slug} type="button" aria-pressed={topic === item.slug} onClick={() => setTopic(item.slug)}>{item.name}</button>
          ))}
        </div>
      </div>

      <p className="el-library__count" aria-live="polite">{visible.length} {visible.length === 1 ? "note" : "notes"}</p>
      <div className="el-library__list">
        {visible.map((post) => (
          <article key={post.slug}>
            <div>
              <p className="el-kicker">{post.readingTime}</p>
              <h3><Link href={`/insights/${post.slug}`}>{post.title}</Link></h3>
            </div>
            <p>{post.excerpt}</p>
            <Link className="el-library__read" href={`/insights/${post.slug}`}>Read <span aria-hidden="true">→</span></Link>
          </article>
        ))}
      </div>
      {visible.length === 0 && <p className="el-library__empty">No field note matches that combination. Try a broader word or choose All.</p>}
    </div>
  );
}
