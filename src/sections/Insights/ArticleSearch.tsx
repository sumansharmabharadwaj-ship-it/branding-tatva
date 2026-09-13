"use client";

import { useState } from "react";
import Link from "next/link";

// Insights search (manual guide p82: the index carries search). Plain
// client side filtering over the typed article data — twelve posts
// need zero infrastructure, just an accessible input and an instant
// result list. The full question led list below stays untouched; this
// is a faster path into it, never a gate in front of it.
export type SearchablePost = {
  slug: string;
  title: string;
  excerpt: string;
  question: string;
};

export function ArticleSearch({ posts }: { posts: SearchablePost[] }) {
  const [query, setQuery] = useState("");
  const q = query.trim().toLowerCase();
  const matches =
    q.length > 1
      ? posts.filter((p) =>
          [p.title, p.excerpt, p.question].some((field) => field.toLowerCase().includes(q))
        )
      : [];

  return (
    <div>
      <label htmlFor="insights-search" className="text-xs font-medium uppercase tracking-[0.18em] text-foreground-secondary/70">
        Search the writing
      </label>
      <input
        id="insights-search"
        type="search"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="positioning, voice, memory, pricing…"
        className="mt-2 w-full max-w-md rounded-full border border-soil/20 bg-transparent px-5 py-2.5 text-sm text-soil placeholder:text-foreground-secondary/50 focus:border-clay focus:outline-none"
      />
      <div aria-live="polite">
        {q.length > 1 && (
          <ul className="mt-4 max-w-xl space-y-2">
            {matches.length === 0 && (
              <li className="text-sm text-foreground-secondary">
                Nothing matches yet. The glossary may hold the term you mean.{" "}
                <Link href="/glossary" className="link-underline text-clay">
                  Browse the glossary <span aria-hidden="true">→</span>
                </Link>
              </li>
            )}
            {matches.map((p) => (
              <li key={p.slug}>
                <Link href={`/insights/${p.slug}`} className="group block rounded-2xl border border-soil/10 px-4 py-3 transition-colors duration-300 hover:border-clay/50">
                  <span className="font-display text-lg text-soil transition-colors duration-300 group-hover:text-clay">
                    {p.title}
                  </span>
                  <span className="mt-0.5 block text-xs text-foreground-secondary">{p.question}</span>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
