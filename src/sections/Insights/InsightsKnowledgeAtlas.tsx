"use client";

import {
  useEffect,
  useRef,
  useState,
  type CSSProperties,
  type KeyboardEvent,
} from "react";
import Link from "next/link";
import { motion, useInView, useMotionValueEvent, useScroll } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { BackgroundVideo } from "@/components/BackgroundVideo";
import { Container } from "@/components/Container";
import { ElementGlyph } from "@/components/ElementGlyph";
import { TrackedLink } from "@/components/TrackedLink";
import { useHydratedReducedMotion } from "@/hooks/useHydratedReducedMotion";
import {
  INSIGHTS_INTENT_CLEARED_EVENT,
  INSIGHTS_INTENT_EVENT,
  publishInsightsIntent,
  readInsightsIntent,
  type InsightsIntentDetail,
} from "@/lib/insights-intent";
import type { InsightElement } from "@/data/insights";

type AtlasArticle = {
  slug: string;
  title: string;
  readingTime: string;
};

export type AtlasPath = {
  slug: string;
  element: InsightElement;
  name: string;
  eyebrow: string;
  promise: string;
  diagnosticQuestions: string[];
  articleCount: number;
  articles: AtlasArticle[];
  proof: {
    slug: string;
    title: string;
    frame: string;
  };
  service: {
    slug: string;
    name: string;
    frame: string;
  };
};

type InsightsKnowledgeAtlasProps = {
  paths: AtlasPath[];
};

type AtlasSelectionLock = {
  index: number;
  awaitingArrival: boolean;
  arrivalY: number | null;
};

const ELEMENT_COLORS: Record<InsightElement, string> = {
  earth: "#D77A51",
  water: "#7FA4BA",
  fire: "#D7A84A",
  air: "#A8B68F",
  space: "#D09A89",
};

export function InsightsKnowledgeAtlas({ paths }: InsightsKnowledgeAtlasProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [carriedPathSlug, setCarriedPathSlug] = useState<string>();
  const [paused, setPaused] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);
  const tabRefs = useRef<Array<HTMLButtonElement | null>>([]);
  const transitionDirectionRef = useRef(1);
  const selectionLockRef = useRef<AtlasSelectionLock | null>(null);
  const inView = useInView(sectionRef, { amount: 0.42 });
  const prefersReducedMotion = useHydratedReducedMotion();
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start 92%", "end 8%"],
  });
  const activePath = paths[activeIndex];
  const carriedPath = carriedPathSlug
    ? paths.find((path) => path.slug === carriedPathSlug)
    : undefined;

  useEffect(() => {
    function syncPathFromHash() {
      const prefix = "#atlas-tab-";
      if (!window.location.hash.startsWith(prefix)) {
        selectionLockRef.current = null;
        return;
      }

      const slug = decodeURIComponent(window.location.hash.slice(prefix.length));
      const nextIndex = paths.findIndex((path) => path.slug === slug);
      if (nextIndex < 0) return;

      selectionLockRef.current = {
        index: nextIndex,
        awaitingArrival: true,
        arrivalY: null,
      };

      setActiveIndex((current) => {
        transitionDirectionRef.current = nextIndex >= current ? 1 : -1;
        return nextIndex;
      });
    }

    syncPathFromHash();
    window.addEventListener("hashchange", syncPathFromHash);
    return () => window.removeEventListener("hashchange", syncPathFromHash);
  }, [paths]);

  useEffect(() => {
    function applyCarriedPath(detail: InsightsIntentDetail | undefined) {
      if (!detail) return;

      const nextIndex = paths.findIndex((path) => path.slug === detail.topicSlug);
      if (nextIndex < 0) return;

      setCarriedPathSlug(detail.topicSlug);
      selectionLockRef.current = {
        index: nextIndex,
        awaitingArrival: true,
        arrivalY: null,
      };
      setActiveIndex((current) => {
        transitionDirectionRef.current = nextIndex >= current ? 1 : -1;
        return nextIndex;
      });
    }

    function carryMirrorPath(event: Event) {
      const { detail } = event as CustomEvent<InsightsIntentDetail>;
      applyCarriedPath(detail);
    }

    function releaseCarriedPath() {
      setCarriedPathSlug(undefined);
      selectionLockRef.current = null;
    }

    window.addEventListener(INSIGHTS_INTENT_EVENT, carryMirrorPath);
    window.addEventListener(
      INSIGHTS_INTENT_CLEARED_EVENT,
      releaseCarriedPath,
    );
    if (!window.location.hash.startsWith("#atlas-tab-")) {
      applyCarriedPath(readInsightsIntent());
    }

    return () => {
      window.removeEventListener(INSIGHTS_INTENT_EVENT, carryMirrorPath);
      window.removeEventListener(
        INSIGHTS_INTENT_CLEARED_EVENT,
        releaseCarriedPath,
      );
    };
  }, [paths]);

  useMotionValueEvent(scrollYProgress, "change", (value) => {
    if (!inView || paused || prefersReducedMotion || paths.length < 2) return;

    const selectionLock = selectionLockRef.current;
    if (selectionLock) {
      const bounds = sectionRef.current?.getBoundingClientRect();

      if (selectionLock.awaitingArrival) {
        if (
          bounds &&
          bounds.top <= window.innerHeight * 0.24 &&
          bounds.bottom >= window.innerHeight * 0.42
        ) {
          selectionLock.awaitingArrival = false;
          selectionLock.arrivalY = window.scrollY;
        }

        setActiveIndex((current) =>
          current === selectionLock.index ? current : selectionLock.index,
        );
        return;
      }

      const arrivalY = selectionLock.arrivalY ?? window.scrollY;
      if (Math.abs(window.scrollY - arrivalY) < window.innerHeight * 0.18) {
        setActiveIndex((current) =>
          current === selectionLock.index ? current : selectionLock.index,
        );
        return;
      }

      selectionLockRef.current = null;
    }

    const progress = Math.min(0.9999, Math.max(0, value));
    const nextIndex = Math.min(paths.length - 1, Math.floor(progress * paths.length));

    setActiveIndex((current) => {
      if (current === nextIndex) return current;
      transitionDirectionRef.current = nextIndex > current ? 1 : -1;
      return nextIndex;
    });
  });

  function selectPath(index: number, shouldFocus = false) {
    setActiveIndex((current) => {
      transitionDirectionRef.current = index >= current ? 1 : -1;
      return index;
    });
    if (shouldFocus) {
      setPaused(true);
      tabRefs.current[index]?.focus();
    }
  }

  function lockSelection(index: number) {
    selectionLockRef.current = {
      index,
      awaitingArrival: false,
      arrivalY: window.scrollY,
    };
  }

  function carryPath(index: number) {
    const path = paths[index];
    if (!path) return;

    setCarriedPathSlug(path.slug);
    publishInsightsIntent({
      topicSlug: path.slug,
      query: "",
      label: path.name,
      origin: "knowledge-atlas",
    });
  }

  function handleKeyDown(event: KeyboardEvent<HTMLButtonElement>, index: number) {
    let nextIndex: number | null = null;

    if (event.key === "ArrowDown" || event.key === "ArrowRight") {
      nextIndex = (index + 1) % paths.length;
    }
    if (event.key === "ArrowUp" || event.key === "ArrowLeft") {
      nextIndex = (index - 1 + paths.length) % paths.length;
    }
    if (event.key === "Home") nextIndex = 0;
    if (event.key === "End") nextIndex = paths.length - 1;

    if (nextIndex !== null) {
      event.preventDefault();
      lockSelection(nextIndex);
      selectPath(nextIndex, true);
      carryPath(nextIndex);
    }
  }

  if (!activePath) return null;

  const accent = ELEMENT_COLORS[activePath.element];
  const threadAccent = carriedPath
    ? ELEMENT_COLORS[carriedPath.element]
    : accent;

  return (
    <section
      ref={sectionRef}
      className="insights-atlas"
      aria-labelledby="insights-atlas-title"
      data-thread-active={Boolean(carriedPath)}
      style={
        {
          "--atlas-accent": accent,
          "--atlas-thread-accent": threadAccent,
        } as CSSProperties
      }
      onFocusCapture={(event) => {
        const target = event.target as HTMLElement;
        if (target.matches(":focus-visible")) setPaused(true);
      }}
      onBlurCapture={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget as Node | null)) {
          setPaused(false);
        }
      }}
    >
      <BackgroundVideo
        video="/videos/generated/bt-insights-reading-currents.mp4"
        poster="/images/generated/bt-insights-reading-currents-poster.jpg"
        playbackRate={0.96}
        posterPriority={false}
      />
      <div className="insights-atlas__veil" aria-hidden="true" />
      <div className="insights-atlas__handoff" aria-hidden="true">
        <span>
          {carriedPath ? (
            <>
              <ElementGlyph
                slug={carriedPath.element}
                className="h-4 w-4"
                strokeWidth={1.35}
              />
              <small>{carriedPath.name}</small>
            </>
          ) : null}
        </span>
        <i />
      </div>

      <Container className="insights-atlas__container">
        <header className="insights-atlas__header">
          <div>
            <p className="insights-atlas__eyebrow">Knowledge atlas</p>
            <h2 id="insights-atlas-title">
              Trace the decision beneath the visible brand problem.
            </h2>
          </div>
          <p>
            Five connected paths turn a vague concern into a sharper question,
            then carry that question into essays and working frameworks.
          </p>
        </header>

        <div className="insights-atlas__stage">
          <div
            className="insights-atlas__paths"
            role="tablist"
            aria-label="Brand decision paths"
            aria-orientation="vertical"
            onPointerEnter={(event) => {
              if (event.pointerType !== "touch") setPaused(true);
            }}
            onPointerLeave={(event) => {
              if (event.pointerType !== "touch") setPaused(false);
            }}
            onPointerUp={(event) => {
              if (event.pointerType === "touch") setPaused(false);
            }}
            onPointerCancel={() => setPaused(false)}
          >
            <div className="insights-atlas__current" aria-hidden="true">
              <motion.span
                animate={{ y: `${activeIndex * 100}%` }}
                transition={
                  prefersReducedMotion
                    ? { duration: 0 }
                    : { duration: 0.7, ease: [0.22, 1, 0.36, 1] }
                }
              />
            </div>

            {paths.map((path, index) => {
              const selected = index === activeIndex;
              const color = ELEMENT_COLORS[path.element];

              return (
                <button
                  key={path.slug}
                  ref={(node) => {
                    tabRefs.current[index] = node;
                  }}
                  type="button"
                  role="tab"
                  id={`atlas-tab-${path.slug}`}
                  aria-selected={selected}
                  aria-controls={selected ? `atlas-panel-${path.slug}` : undefined}
                  tabIndex={selected ? 0 : -1}
                  className={selected ? "is-active" : undefined}
                  onClick={() => {
                    lockSelection(index);
                    selectPath(index);
                    carryPath(index);
                  }}
                  onPointerEnter={(event) => {
                    if (event.pointerType !== "touch") selectPath(index);
                  }}
                  onFocus={() => selectPath(index)}
                  onKeyDown={(event) => handleKeyDown(event, index)}
                >
                  <span className="insights-atlas__path-index">0{index + 1}</span>
                  <span
                    className="insights-atlas__path-glyph"
                    style={{ color }}
                  >
                    <ElementGlyph
                      slug={path.element}
                      className="h-5 w-5"
                      strokeWidth={1.35}
                    />
                  </span>
                  <span className="insights-atlas__path-name">{path.name}</span>
                  <span className="insights-atlas__path-count">
                    {path.articleCount} reads
                  </span>
                </button>
              );
            })}
          </div>

          <div
            className="insights-atlas__panel-wrap"
            onPointerEnter={(event) => {
              if (event.pointerType !== "touch") setPaused(true);
            }}
            onPointerLeave={(event) => {
              if (event.pointerType !== "touch") setPaused(false);
            }}
            onPointerUp={(event) => {
              if (event.pointerType === "touch") setPaused(false);
            }}
            onPointerCancel={() => setPaused(false)}
          >
            <div className="insights-atlas__orbital" aria-hidden="true">
              <span />
              <i />
            </div>

            <motion.article
              key={activePath.slug}
              id={`atlas-panel-${activePath.slug}`}
              role="tabpanel"
              aria-labelledby={`atlas-tab-${activePath.slug}`}
              className="insights-atlas__panel"
              initial={
                prefersReducedMotion
                  ? false
                  : {
                      opacity: 0.58,
                      x: transitionDirectionRef.current * 24,
                      rotateY: transitionDirectionRef.current * 5,
                      scale: 0.988,
                      clipPath: "inset(0 8% 0 8% round 1.5rem)",
                    }
              }
              animate={{
                opacity: 1,
                x: 0,
                rotateY: 0,
                scale: 1,
                clipPath: "inset(0 0% 0 0% round 0rem)",
              }}
              transition={{
                duration: prefersReducedMotion ? 0 : 0.34,
                ease: [0.22, 1, 0.36, 1],
              }}
              style={{ transformPerspective: 1200 }}
            >
                <div className="insights-atlas__panel-head">
                  <p style={{ color: accent }}>{activePath.eyebrow}</p>
                  <span>{activePath.articleCount} essays</span>
                </div>
                <h3>{activePath.name}</h3>
                <p className="insights-atlas__promise">{activePath.promise}</p>

                <div className="insights-atlas__panel-grid">
                  <div>
                    <p className="insights-atlas__label">Questions in this path</p>
                    <ol className="insights-atlas__questions">
                      {activePath.diagnosticQuestions.map((question, index) => (
                        <li key={question}>
                          <span>0{index + 1}</span>
                          <p>{question}</p>
                        </li>
                      ))}
                    </ol>
                  </div>

                  <div>
                    <p className="insights-atlas__label">Recent field notes</p>
                    <div className="insights-atlas__articles">
                      {activePath.articles.map((article, articleIndex) => (
                        <TrackedLink
                          key={article.slug}
                          href={`/insights/${article.slug}`}
                          onClick={() => carryPath(activeIndex)}
                          event="insights_article_selected"
                          eventProps={{
                            source: "knowledge_atlas",
                            article: article.slug,
                            path: activePath.slug,
                            position: articleIndex + 1,
                            match_reason: "path_recent_read",
                          }}
                        >
                          <span>{article.title}</span>
                          <small>{article.readingTime}</small>
                        </TrackedLink>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="insights-atlas__application">
                  <Link
                    href={`/work/${activePath.proof.slug}`}
                    onClick={() => carryPath(activeIndex)}
                  >
                    <small>Published project record</small>
                    <strong>{activePath.proof.title}</strong>
                    <p>{activePath.proof.frame}</p>
                    <span>
                      See the decision trail
                      <ArrowUpRight aria-hidden="true" className="h-4 w-4" />
                    </span>
                  </Link>
                  <Link
                    href={`/services#package-${activePath.service.slug}`}
                    onClick={() => carryPath(activeIndex)}
                  >
                    <small>Strategy path</small>
                    <strong>{activePath.service.name}</strong>
                    <p>{activePath.service.frame}</p>
                    <span>
                      Explore the engagement
                      <ArrowUpRight aria-hidden="true" className="h-4 w-4" />
                    </span>
                  </Link>
                </div>

                <Link
                  href={`/insights/topic/${activePath.slug}`}
                  className="insights-atlas__cta"
                  onClick={() => carryPath(activeIndex)}
                >
                  Explore {activePath.name.toLowerCase()}
                  <ArrowUpRight aria-hidden="true" className="h-4 w-4" />
                </Link>
            </motion.article>
          </div>
        </div>
      </Container>
    </section>
  );
}
