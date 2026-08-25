"use client";

import {
  useRef,
  useState,
  type CSSProperties,
  type KeyboardEvent,
  type MouseEvent,
} from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowDown, ArrowUpRight } from "lucide-react";
import { ElementGlyph } from "@/components/ElementGlyph";
import { useLenis } from "@/components/SmoothScrollProvider";
import { TrackedLink } from "@/components/TrackedLink";
import { useHydratedReducedMotion } from "@/hooks/useHydratedReducedMotion";
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
  const [activeIndex, setActiveIndex] = useState(0);
  const [committedSlug, setCommittedSlug] = useState<string>();
  const tabRefs = useRef<Array<HTMLButtonElement | null>>([]);
  const directionRef = useRef(1);
  const prefersReducedMotion = useHydratedReducedMotion();
  const lenis = useLenis();
  const activeQuest = quests[activeIndex];

  function selectQuest(index: number, focus = false) {
    setActiveIndex((current) => {
      directionRef.current = index >= current ? 1 : -1;
      return index;
    });
    if (focus) tabRefs.current[index]?.focus();
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
    selectQuest(index);
    const page = document.querySelector<HTMLElement>(".insights-page");
    const scrollVelocity = Number.parseFloat(
      page?.style.getPropertyValue("--insights-scroll-velocity") ?? "0",
    );
    if (Number.isFinite(scrollVelocity) && scrollVelocity > 0.08) return;
    carryQuest(index);
  }

  function handleAtlasJourney(event: MouseEvent<HTMLAnchorElement>) {
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

    if (event.key === "ArrowDown" || event.key === "ArrowRight") {
      nextIndex = (index + 1) % quests.length;
    }
    if (event.key === "ArrowUp" || event.key === "ArrowLeft") {
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
      <div
        className="insights-decision-mirror__quests"
        role="tablist"
        aria-label="Brand tensions"
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
      </div>

      <div className="insights-decision-mirror__answer">
        <div className="insights-decision-mirror__signal" aria-hidden="true">
          <span>Recognition</span>
          <i />
          <span>First move</span>
        </div>

        <AnimatePresence mode="popLayout" initial={false}>
          <motion.article
            key={activeQuest.topicSlug}
            id={`decision-mirror-panel-${activeQuest.topicSlug}`}
            role="tabpanel"
            aria-labelledby={`decision-mirror-tab-${activeQuest.topicSlug}`}
            className="insights-decision-mirror__panel"
            initial={
              prefersReducedMotion
                ? false
                : {
                    opacity: 0.58,
                    x: directionRef.current * 20,
                    rotateY: directionRef.current * 3,
                    clipPath: "inset(0 7% 0 7% round 1.25rem)",
                  }
            }
            animate={{
              opacity: 1,
              x: 0,
              rotateY: 0,
              clipPath: "inset(0 0% 0 0% round 0rem)",
            }}
            exit={
              prefersReducedMotion
                ? undefined
                : {
                    opacity: 0.36,
                    x: directionRef.current * -14,
                    rotateY: directionRef.current * -2,
                    clipPath: "inset(0 4% 0 4% round 1rem)",
                  }
            }
            transition={{
              duration: prefersReducedMotion ? 0 : 0.48,
              ease: [0.22, 1, 0.36, 1],
            }}
            style={{ transformPerspective: 1100 }}
          >
            <p className="insights-decision-mirror__route">
              {committedSlug === activeQuest.topicSlug
                ? "Path held"
                : "Likely reading path"}{" "}
              <span>{activeQuest.pathName}</span>
            </p>
            <h3>{activeQuest.reading}</h3>

            <div className="insights-decision-mirror__question">
              <span>Question worth asking first</span>
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
              <span>Recommended first read</span>
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
              Trace the complete {activeQuest.pathName.toLowerCase()} path
              <ArrowDown aria-hidden="true" className="h-4 w-4" />
            </a>
          </motion.article>
        </AnimatePresence>
        <p className="sr-only" aria-live="polite">
          {committedSlug === activeQuest.topicSlug
            ? `${activeQuest.pathName} path held for the knowledge atlas.`
            : ""}
        </p>
      </div>
    </div>
  );
}
