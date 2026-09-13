"use client";

import {
  useId,
  useRef,
  useState,
  type CSSProperties,
  type KeyboardEvent,
  type MouseEvent,
} from "react";
import { motion } from "framer-motion";
import { ArrowDown, ArrowUpRight } from "lucide-react";
import { ElementGlyph } from "@/components/ElementGlyph";
import { useLenis } from "@/components/SmoothScrollProvider";
import { TrackedLink } from "@/components/TrackedLink";
import { useCenteredRailSelection } from "@/hooks/useCenteredRailSelection";
import { useHydratedReducedMotion } from "@/hooks/useHydratedReducedMotion";
import { useMediaQuery } from "@/hooks/useMediaQuery";
import { publishInsightsIntent } from "@/lib/insights-intent";
import type { InsightElement } from "@/data/insights";

export type ReaderQuest = {
  topicSlug: string;
  element: InsightElement;
  pathName: string;
  tension: string;
  reading: string;
  firstQuestion: string;
  article: {
    slug: string;
    title: string;
    excerpt: string;
    readingTime: string;
  };
};

type InsightsDecisionMirrorProps = {
  quests: ReaderQuest[];
};

const ELEMENT_COLORS: Record<InsightElement, string> = {
  earth: "#B85A34",
  water: "#547C91",
  fire: "#C28A28",
  air: "#667653",
  space: "#AD6F5C",
};

export function InsightsDecisionMirror({ quests }: InsightsDecisionMirrorProps) {
  const selectionId = useId();
  const [activeIndex, setActiveIndex] = useState(0);
  const [committedSlug, setCommittedSlug] = useState<string>();
  const questRailRef = useRef<HTMLDivElement>(null);
  const tabRefs = useRef<Array<HTMLButtonElement | null>>([]);
  const directionRef = useRef(1);
  const prefersReducedMotion = useHydratedReducedMotion();
  const usesHorizontalRail = useMediaQuery("(max-width: 899px)");
  const lenis = useLenis();
  const activeQuest = quests[activeIndex];

  useCenteredRailSelection(
    questRailRef,
    tabRefs,
    activeIndex,
    prefersReducedMotion,
  );

  function selectQuest(index: number, focus = false) {
    setActiveIndex((current) => {
      if (index !== current) directionRef.current = index > current ? 1 : -1;
      return index;
    });
    if (focus) tabRefs.current[index]?.focus({ preventScroll: true });
  }

  function carryQuest(index: number) {
    const quest = quests[index];
    if (!quest) return;

    setCommittedSlug(quest.topicSlug);
    publishInsightsIntent({
      topicSlug: quest.topicSlug,
      query: quest.tension,
      label: quest.pathName,
      origin: "decision-mirror",
    });
  }

  function previewQuest(index: number) {
    const page = document.querySelector<HTMLElement>(".insights-page");
    const scrollVelocity = Number.parseFloat(
      page?.style.getPropertyValue("--insights-scroll-velocity") ?? "0",
    );
    if (Number.isFinite(scrollVelocity) && Math.abs(scrollVelocity) > 0.08) return;
    if (page?.querySelector(
      ".insights-decision-mirror :focus-visible, .insights-decision-mirror__panel:focus-within",
    )) return;
    selectQuest(index);
    carryQuest(index);
  }

  function handleAtlasJourney(event: MouseEvent<HTMLAnchorElement>) {
    if (event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    const target = document.getElementById("knowledge-atlas");
    carryQuest(activeIndex);
    if (!target) return;

    event.preventDefault();
    const nextHash = "#knowledge-atlas";
    if (window.location.hash !== nextHash) {
      window.history.pushState(null, "", nextHash);
    }

    if (lenis && !prefersReducedMotion) {
      lenis.scrollTo(target, {
        duration: 0.9,
        easing: (value) => 1 - Math.pow(1 - value, 3),
      });
      return;
    }

    target.scrollIntoView({
      behavior: prefersReducedMotion ? "auto" : "smooth",
      block: "start",
    });
  }

  function handleKeyDown(event: KeyboardEvent<HTMLButtonElement>, index: number) {
    let nextIndex: number | null = null;
    const forwardKey = usesHorizontalRail ? "ArrowRight" : "ArrowDown";
    const backwardKey = usesHorizontalRail ? "ArrowLeft" : "ArrowUp";

    if (event.key === forwardKey) {
      nextIndex = (index + 1) % quests.length;
    }
    if (event.key === backwardKey) {
      nextIndex = (index - 1 + quests.length) % quests.length;
    }
    if (event.key === "Home") nextIndex = 0;
    if (event.key === "End") nextIndex = quests.length - 1;

    if (nextIndex !== null) {
      event.preventDefault();
      selectQuest(nextIndex, true);
      carryQuest(nextIndex);
    }
  }

  if (!activeQuest) return null;

  const accent = ELEMENT_COLORS[activeQuest.element];

  return (
    <div
      className="insights-decision-mirror"
      style={{ "--mirror-accent": accent } as CSSProperties}
    >
      <motion.div
        ref={questRailRef}
        layoutScroll
        className="insights-decision-mirror__quests"
        role="tablist"
        aria-label="Common brand problems"
        aria-orientation={usesHorizontalRail ? "horizontal" : "vertical"}
      >
        {quests.map((quest, index) => {
          const selected = index === activeIndex;
          const color = ELEMENT_COLORS[quest.element];

          return (
            <button
              key={quest.topicSlug}
              ref={(node) => {
                tabRefs.current[index] = node;
              }}
              type="button"
              role="tab"
              id={`decision-mirror-tab-${quest.topicSlug}`}
              aria-selected={selected}
              aria-controls={
                selected ? `decision-mirror-panel-${quest.topicSlug}` : undefined
              }
              tabIndex={selected ? 0 : -1}
              className={selected ? "is-active" : undefined}
              onClick={() => {
                selectQuest(index);
                carryQuest(index);
              }}
              onPointerEnter={(event) => {
                if (event.pointerType !== "touch") previewQuest(index);
              }}
              onFocus={() => {
                selectQuest(index);
                carryQuest(index);
              }}
              onKeyDown={(event) => handleKeyDown(event, index)}
            >
              {selected ? (
                <motion.span
                  className="insights-choice-selection"
                  aria-hidden="true"
                  layoutId={prefersReducedMotion ? undefined : `${selectionId}-problem`}
                  initial={false}
                  transition={{ duration: prefersReducedMotion ? 0 : 0.42, ease: [0.22, 1, 0.36, 1] }}
                />
              ) : null}
              <span className="insights-decision-mirror__index">0{index + 1}</span>
              <span
                className="insights-decision-mirror__glyph"
                style={{ color }}
                aria-hidden="true"
              >
                <ElementGlyph slug={quest.element} className="h-5 w-5" strokeWidth={1.4} />
              </span>
              <strong>{quest.tension}</strong>
            </button>
          );
        })}
      </motion.div>

      <div className="insights-decision-mirror__answer">
        <div className="insights-decision-mirror__signal" aria-hidden="true">
          <span>Problem</span>
          <i />
          <span>Relevant decision</span>
        </div>

          <article
            key={activeQuest.topicSlug}
            id={`decision-mirror-panel-${activeQuest.topicSlug}`}
            role="tabpanel"
            aria-labelledby={`decision-mirror-tab-${activeQuest.topicSlug}`}
            className="insights-decision-mirror__panel"
            data-choice-motion={prefersReducedMotion ? "reduced" : "full"}
            style={{
              "--choice-entry-x": `${usesHorizontalRail ? directionRef.current * 12 : 0}px`,
              "--choice-entry-y": `${usesHorizontalRail ? 0 : directionRef.current * 10}px`,
            } as CSSProperties}
          >
            <p className="insights-decision-mirror__route">
              {committedSlug === activeQuest.topicSlug
                ? "Selected topic"
                : "Suggested topic"}{" "}
              <span>{activeQuest.pathName}</span>
            </p>
            <h3>{activeQuest.reading}</h3>

            <div className="insights-decision-mirror__question">
              <span>Question to ask first</span>
              <p>{activeQuest.firstQuestion}</p>
            </div>

            <TrackedLink
              href={`/insights/${activeQuest.article.slug}`}
              className="insights-decision-mirror__first-read"
              onClick={() => carryQuest(activeIndex)}
              event="insights_article_selected"
              eventProps={{
                source: "decision_mirror",
                article: activeQuest.article.slug,
                path: activeQuest.topicSlug,
                position: 1,
                match_reason: "recommended_first_read",
              }}
            >
              <span>Start with this essay</span>
              <strong>{activeQuest.article.title}</strong>
              <p>{activeQuest.article.excerpt}</p>
              <small>
                {activeQuest.article.readingTime}
                <ArrowUpRight aria-hidden="true" className="h-4 w-4" />
              </small>
            </TrackedLink>

            <a
              href="#knowledge-atlas"
              className="insights-decision-mirror__atlas-link"
              onClick={handleAtlasJourney}
            >
              See all {activeQuest.pathName.toLowerCase()} essays
              <ArrowDown aria-hidden="true" className="h-4 w-4" />
            </a>
          </article>
        <p className="sr-only" aria-live="polite">
          {committedSlug === activeQuest.topicSlug
            ? `${activeQuest.pathName} is selected for the topic map.`
            : ""}
        </p>
      </div>
    </div>
  );
}
