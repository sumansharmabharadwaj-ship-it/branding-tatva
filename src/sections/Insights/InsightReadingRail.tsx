"use client";

import {
  useEffect,
  useRef,
  useState,
  type CSSProperties,
} from "react";
import { useHydratedReducedMotion } from "@/hooks/useHydratedReducedMotion";

type ReadingRailItem = {
  id: string;
  label: string;
};

type InsightReadingRailProps = {
  items: ReadingRailItem[];
  accent: string;
};

const MOBILE_READING_QUERY = "(max-width: 1279px)";
const DESKTOP_READING_QUERY = "(min-width: 1280px)";

function useActiveReadingChapter(
  items: ReadingRailItem[],
  mediaQuery: string,
) {
  const [activeId, setActiveId] = useState(items[0]?.id ?? "");

  useEffect(() => {
    const query = window.matchMedia(mediaQuery);
    let observer: IntersectionObserver | null = null;

    function connectObserver() {
      observer?.disconnect();
      observer = null;

      if (!query.matches) return;

      const sections = items
        .map((item) => document.getElementById(item.id))
        .filter((section): section is HTMLElement => Boolean(section));

      if (sections.length === 0) return;

      observer = new IntersectionObserver(
        (entries) => {
          const visible = entries
            .filter((entry) => entry.isIntersecting)
            .sort(
              (first, second) =>
                Math.abs(first.boundingClientRect.top) -
                Math.abs(second.boundingClientRect.top),
            );

          const nearest = visible[0]?.target;
          if (nearest instanceof HTMLElement) setActiveId(nearest.id);
        },
        { rootMargin: "-18% 0px -68% 0px", threshold: 0 },
      );

      sections.forEach((section) => observer?.observe(section));
    }

    connectObserver();
    query.addEventListener("change", connectObserver);

    return () => {
      observer?.disconnect();
      query.removeEventListener("change", connectObserver);
    };
  }, [items, mediaQuery]);

  return { activeId, setActiveId };
}

export function InsightReadingRail({
  items,
  accent,
}: InsightReadingRailProps) {
  const { activeId, setActiveId } = useActiveReadingChapter(
    items,
    MOBILE_READING_QUERY,
  );
  const itemRefs = useRef<Record<string, HTMLAnchorElement | null>>({});
  const itemsRef = useRef<HTMLDivElement>(null);
  const prefersReducedMotion = useHydratedReducedMotion();

  useEffect(() => {
    const item = itemRefs.current[activeId];
    const rail = itemsRef.current;

    if (!item || !rail) return;

    const centeredPosition =
      item.offsetLeft - (rail.clientWidth - item.clientWidth) / 2;
    rail.scrollTo({
      left: Math.max(0, centeredPosition),
      behavior: prefersReducedMotion ? "auto" : "smooth",
    });
  }, [activeId, prefersReducedMotion]);

  const activeIndex = Math.max(
    0,
    items.findIndex((item) => item.id === activeId),
  );
  const progress = items.length
    ? `${((activeIndex + 1) / items.length) * 100}%`
    : "0%";

  if (items.length === 0) return null;

  return (
    <nav
      aria-label="Article chapters"
      className="insight-reading-rail xl:hidden"
      style={
        {
          "--reading-accent": accent,
          "--reading-progress": progress,
        } as CSSProperties
      }
    >
      <div className="insight-reading-rail__frame">
        <span className="insight-reading-rail__label">Reading thread</span>
        <div ref={itemsRef} className="insight-reading-rail__items">
          {items.map((item, index) => (
            <a
              key={item.id}
              ref={(node) => {
                itemRefs.current[item.id] = node;
              }}
              href={`#${item.id}`}
              aria-current={activeId === item.id ? "location" : undefined}
              onClick={() => setActiveId(item.id)}
            >
              <span>{String(index + 1).padStart(2, "0")}</span>
              {item.label}
            </a>
          ))}
        </div>
      </div>
      <span className="insight-reading-rail__progress" aria-hidden="true" />
    </nav>
  );
}

export function InsightReadingIndex({
  items,
  accent,
}: InsightReadingRailProps) {
  const { activeId, setActiveId } = useActiveReadingChapter(
    items,
    DESKTOP_READING_QUERY,
  );
  const activeIndex = Math.max(
    0,
    items.findIndex((item) => item.id === activeId),
  );
  const progress = items.length
    ? `${((activeIndex + 1) / items.length) * 100}%`
    : "0%";

  if (items.length === 0) return null;

  return (
    <nav
      aria-label="In this article"
      className="insight-reading-index"
      style={
        {
          "--reading-accent": accent,
          "--reading-progress": progress,
        } as CSSProperties
      }
    >
      <div className="insight-reading-index__head">
        <p>In this article</p>
        <span aria-hidden="true">
          {String(activeIndex + 1).padStart(2, "0")} /{" "}
          {String(items.length).padStart(2, "0")}
        </span>
      </div>
      <span className="insight-reading-index__progress" aria-hidden="true" />
      <ol>
        {items.map((item, index) => (
          <li key={item.id}>
            <a
              href={`#${item.id}`}
              aria-current={activeId === item.id ? "location" : undefined}
              onClick={() => setActiveId(item.id)}
            >
              <span>{String(index + 1).padStart(2, "0")}</span>
              {item.label}
            </a>
          </li>
        ))}
      </ol>
    </nav>
  );
}
