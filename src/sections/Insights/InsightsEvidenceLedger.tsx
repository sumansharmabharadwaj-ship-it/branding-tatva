"use client";

import {
  useEffect,
  useId,
  useRef,
  useState,
  type CSSProperties,
  type FocusEvent,
  type KeyboardEvent,
} from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowRight, ArrowUpRight, Check } from "lucide-react";
import { ElementGlyph } from "@/components/ElementGlyph";
import { TrackedLink } from "@/components/TrackedLink";
import type { InsightElement } from "@/data/insights";
import { useCenteredRailSelection } from "@/hooks/useCenteredRailSelection";
import { useHydratedReducedMotion } from "@/hooks/useHydratedReducedMotion";
import { useMediaQuery } from "@/hooks/useMediaQuery";
import {
  clearInsightsIntent,
  INSIGHTS_INTENT_CLEARED_EVENT,
  INSIGHTS_INTENT_EVENT,
  publishInsightsIntent,
  readInsightsIntent,
  type InsightsIntentDetail,
} from "@/lib/insights-intent";
import {
  clearInsightsEvidenceState,
  readInsightsEvidenceState,
  writeInsightsEvidenceState,
} from "@/lib/insights-evidence-state";
import { track } from "@/lib/analytics";

export type EvidenceLayer = {
  slug: string;
  topicSlug: string;
  element: InsightElement;
  name: string;
  question: string;
  signal: string;
  evidence: string;
  move: string;
  service: {
    slug: string;
    name: string;
    frame: string;
  };
};

type InsightsEvidenceLedgerProps = {
  layers: EvidenceLayer[];
};

const THREAD_COLORS: Record<InsightElement, string> = {
  earth: "#D77A51",
  water: "#7FA4BA",
  fire: "#D7A84A",
  air: "#A8B68F",
  space: "#D09A89",
};

const REVIEW_COUNT_VARIANTS = {
  enter: (direction: number) => ({ opacity: 0, y: `${direction * 85}%` }),
  settled: { opacity: 1, y: "0%" },
  exit: (direction: number) => ({ opacity: 0, y: `${direction * -85}%` }),
};

function worksheetIntent(layer: EvidenceLayer): InsightsIntentDetail {
  return {
    topicSlug: layer.topicSlug,
    query: "",
    label: layer.name,
    origin: "evidence-ledger",
  };
}

function WorksheetMarkIcon({
  marked,
  reducedMotion,
  openIcon = "plus",
}: {
  marked: boolean;
  reducedMotion: boolean;
  openIcon?: "plus" | "arrow";
}) {
  const openPath = openIcon === "plus" ? "M12 5v14M5 12h14" : "M5 12h14M12 5l7 7-7 7";
  const checkPath = "m5 12 4 4L19 6";

  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      {reducedMotion ? <path d={marked ? checkPath : openPath} /> : (
        <>
          <motion.path
            d={openPath}
            initial={false}
            animate={{ opacity: marked ? 0 : 1 }}
            transition={{ duration: 0.14 }}
          />
          <motion.path
            d={checkPath}
            initial={false}
            animate={{ pathLength: marked ? 1 : 0, opacity: marked ? 1 : 0 }}
            transition={{
              pathLength: { duration: marked ? 0.32 : 0.18, ease: [0.22, 1, 0.36, 1] },
              opacity: { duration: 0.14 },
            }}
          />
        </>
      )}
    </svg>
  );
}

export function InsightsEvidenceLedger({ layers }: InsightsEvidenceLedgerProps) {
  const selectionId = useId();
  const [focusedIndex, setFocusedIndex] = useState(0);
  const [selectionDirection, setSelectionDirection] = useState(1);
  const [markedSlugs, setMarkedSlugs] = useState<string[]>([]);
  const [reviewCountDirection, setReviewCountDirection] = useState(1);
  const [readerIntent, setReaderIntent] = useState<InsightsIntentDetail>();
  const priorReaderIntentRef = useRef<InsightsIntentDetail | undefined>(
    undefined,
  );
  const layerRailRef = useRef<HTMLDivElement>(null);
  const layerButtonRefs = useRef<Array<HTMLButtonElement | null>>([]);
  const panelRefs = useRef<Array<HTMLDivElement | null>>([]);
  const focusFrameRef = useRef<number | null>(null);
  const prefersReducedMotion = useHydratedReducedMotion();
  const usesHorizontalRail = useMediaQuery("(max-width: 760px)");
  const focusedLayer = layers[focusedIndex];
  const markedCount = markedSlugs.length;
  const markedLayers = layers.filter((layer) => markedSlugs.includes(layer.slug));
  const serviceNames = [...new Set(layers.map((layer) => layer.service.name))];

  useCenteredRailSelection(
    layerRailRef,
    layerButtonRefs,
    focusedIndex,
    prefersReducedMotion,
  );

  useEffect(() => {
    function carryReaderIntent(event: Event) {
      const nextIntent = (event as CustomEvent<InsightsIntentDetail>).detail;
      if (nextIntent.origin !== "evidence-ledger") {
        priorReaderIntentRef.current = nextIntent;
        setReviewCountDirection(-1);
        setMarkedSlugs([]);
        clearInsightsEvidenceState();
        const nextIndex = layers.findIndex(
          (layer) => layer.topicSlug === nextIntent.topicSlug,
        );
        if (nextIndex >= 0) setFocusedIndex(nextIndex);
      }
      setReaderIntent(nextIntent);
    }

    function releaseReaderIntent() {
      priorReaderIntentRef.current = undefined;
      setReaderIntent(undefined);
      setReviewCountDirection(-1);
      setMarkedSlugs([]);
      setFocusedIndex(0);
      clearInsightsEvidenceState();
    }

    const initialIntent = readInsightsIntent();
    let restoredIntent: InsightsIntentDetail | undefined;
    if (initialIntent?.origin !== "evidence-ledger") {
      priorReaderIntentRef.current = initialIntent;
      clearInsightsEvidenceState();
      const initialIndex = layers.findIndex(
        (layer) => layer.topicSlug === initialIntent?.topicSlug,
      );
      if (initialIndex >= 0) setFocusedIndex(initialIndex);
    } else {
      const storedEvidence = readInsightsEvidenceState();
      const markedSlugs = storedEvidence?.markedSlugs.filter((slug) =>
        layers.some((layer) => layer.slug === slug),
      );
      const latestMarkedSlug = markedSlugs?.[markedSlugs.length - 1];
      const latestMarkedLayer = latestMarkedSlug
        ? layers.find((layer) => layer.slug === latestMarkedSlug)
        : undefined;
      const focusedIndex = layers.findIndex(
        (layer) => layer.slug === storedEvidence?.focusedSlug,
      );
      const focusedLayer = layers[focusedIndex];
      const suggestedLayer = focusedLayer && markedSlugs?.includes(focusedLayer.slug)
        ? focusedLayer
        : latestMarkedLayer;

      if (
        storedEvidence &&
        suggestedLayer &&
        markedSlugs?.length === storedEvidence.markedSlugs.length &&
        // Older sessions carried the last mark even after another was reopened.
        (suggestedLayer.topicSlug === initialIntent.topicSlug ||
          latestMarkedLayer?.topicSlug === initialIntent.topicSlug)
      ) {
        setMarkedSlugs(markedSlugs);
        setFocusedIndex(
          focusedIndex >= 0
            ? focusedIndex
            : layers.findIndex((layer) => layer.slug === latestMarkedSlug),
        );
        priorReaderIntentRef.current = storedEvidence.priorIntent;
        restoredIntent = worksheetIntent(suggestedLayer);
      } else {
        clearInsightsEvidenceState();
      }
    }

    window.addEventListener(INSIGHTS_INTENT_EVENT, carryReaderIntent);
    window.addEventListener(
      INSIGHTS_INTENT_CLEARED_EVENT,
      releaseReaderIntent,
    );
    if (restoredIntent && restoredIntent.topicSlug !== initialIntent?.topicSlug) {
      publishInsightsIntent(restoredIntent);
    } else {
      setReaderIntent(restoredIntent ?? initialIntent);
    }

    return () => {
      if (focusFrameRef.current !== null) {
        window.cancelAnimationFrame(focusFrameRef.current);
      }
      window.removeEventListener(INSIGHTS_INTENT_EVENT, carryReaderIntent);
      window.removeEventListener(
        INSIGHTS_INTENT_CLEARED_EVENT,
        releaseReaderIntent,
      );
    };
  }, [layers]);

  if (!focusedLayer) return null;

  const focusedIsMarked = markedSlugs.includes(focusedLayer.slug);
  const intentLayer = readerIntent
    ? layers.find((layer) => layer.topicSlug === readerIntent.topicSlug)
    : undefined;
  const latestMarkedLayer = layers.find(
    (layer) => layer.slug === markedSlugs[markedSlugs.length - 1],
  );
  const suggestedLayer = focusedIsMarked ? focusedLayer : latestMarkedLayer;
  const statusLabel = markedCount > 0
    ? `${markedCount} of ${layers.length} marked for review`
    : intentLayer
      ? `From your reading: ${intentLayer.name}`
      : `0 of ${layers.length} marked for review`;
  const revealVariants = {
    enter: {
      opacity: 0,
      x: usesHorizontalRail ? selectionDirection * 16 : 0,
      y: usesHorizontalRail ? 0 : selectionDirection * 12,
    },
    settled: {
      opacity: 1,
      x: 0,
      y: 0,
      transition: { duration: prefersReducedMotion ? 0 : 0.38, ease: [0.22, 1, 0.36, 1] as const },
    },
  };

  function selectLayer(index: number, direction?: 1 | -1) {
    if (index === focusedIndex) return;
    setSelectionDirection(direction ?? (index > focusedIndex ? 1 : -1));
    setFocusedIndex(index);
    if (markedCount > 0) {
      writeInsightsEvidenceState({
        markedSlugs,
        focusedSlug: layers[index].slug,
        priorIntent: priorReaderIntentRef.current,
      });
      const nextSuggestedLayer = markedSlugs.includes(layers[index].slug)
        ? layers[index]
        : latestMarkedLayer;
      if (
        nextSuggestedLayer &&
        (readerIntent?.origin !== "evidence-ledger" ||
          readerIntent.topicSlug !== nextSuggestedLayer.topicSlug)
      ) {
        publishInsightsIntent(worksheetIntent(nextSuggestedLayer));
      }
    }
  }

  function openLayer(index: number, direction?: 1 | -1) {
    selectLayer(index, direction);
    if (focusFrameRef.current !== null) {
      window.cancelAnimationFrame(focusFrameRef.current);
    }

    // Wait for the selected panel to become visible, then hand keyboard and
    // screen-reader focus to its content without a native focus-scroll jump.
    focusFrameRef.current = window.requestAnimationFrame(() => {
      focusFrameRef.current = null;
      const panel = panelRefs.current[index];
      if (!panel || panel.inert) return;

      panel.focus({ preventScroll: true });
      const viewport = window.visualViewport;
      const viewportTop = viewport?.offsetTop ?? 0;
      const viewportBottom = viewportTop + (viewport?.height ?? window.innerHeight);
      const styles = window.getComputedStyle(panel);
      const safeTop = viewportTop + Number.parseFloat(styles.scrollMarginTop);
      const safeBottom = viewportBottom - Number.parseFloat(styles.scrollMarginBottom);
      const question = panel.querySelector("h3");
      if (!question) return;

      // Leave an already readable question in place. On a phone, returning
      // from the review list brings only the current check back into view.
      if (
        panel.getBoundingClientRect().top < safeTop ||
        question.getBoundingClientRect().bottom > safeBottom
      ) {
        panel.scrollIntoView({
          behavior: prefersReducedMotion ? "auto" : "smooth",
          block: "start",
          inline: "nearest",
        });
      }
    });
  }

  function keepControlVisible(event: FocusEvent<HTMLDivElement>) {
    const control = event.target;
    if (!(control instanceof HTMLElement) || !control.matches("button, a")) return;
    if (focusFrameRef.current !== null) {
      window.cancelAnimationFrame(focusFrameRef.current);
    }

    // Native keyboard focus can stop beneath the fixed chapter bar. Use the
    // same clear space for tabs, review buttons, and the next-step links.
    focusFrameRef.current = window.requestAnimationFrame(() => {
      focusFrameRef.current = null;
      if (document.activeElement !== control || !control.isConnected) return;

      const viewport = window.visualViewport;
      const viewportTop = viewport?.offsetTop ?? 0;
      const viewportBottom = viewportTop + (viewport?.height ?? window.innerHeight);
      const styles = window.getComputedStyle(control);
      const safeTop = viewportTop + Number.parseFloat(styles.scrollMarginTop);
      const safeBottom = viewportBottom - Number.parseFloat(styles.scrollMarginBottom);
      const bounds = control.getBoundingClientRect();

      if (bounds.top < safeTop || bounds.bottom > safeBottom) {
        control.scrollIntoView({
          behavior: prefersReducedMotion ? "auto" : "smooth",
          block: "nearest",
          inline: "nearest",
        });
      }
    });
  }

  function toggleLayer(slug: string, index: number) {
    const selectedLayer = layers[index];
    if (!selectedLayer) return;

    const isMarked = markedSlugs.includes(slug);
    const nextMarkedSlugs = isMarked
      ? markedSlugs.filter((candidate) => candidate !== slug)
      : [...markedSlugs, slug];
    const nextLatestSlug = nextMarkedSlugs[nextMarkedSlugs.length - 1];
    const nextLatestLayer = nextLatestSlug
      ? layers.find((layer) => layer.slug === nextLatestSlug)
      : undefined;
    const nextIntent: InsightsIntentDetail | undefined = nextLatestLayer
      ? worksheetIntent(nextLatestLayer)
      : priorReaderIntentRef.current;

    setReviewCountDirection(isMarked ? -1 : 1);
    setMarkedSlugs(nextMarkedSlugs);
    if (nextMarkedSlugs.length > 0) {
      writeInsightsEvidenceState({
        markedSlugs: nextMarkedSlugs,
        focusedSlug: selectedLayer.slug,
        priorIntent: priorReaderIntentRef.current,
      });
    } else {
      clearInsightsEvidenceState();
    }
    track("insights_evidence_layer_toggled", {
      layer: slug,
      state: isMarked ? "open" : "marked",
      marked_count: nextMarkedSlugs.length,
      reader_path: nextIntent?.topicSlug ?? "none",
    });

    if (nextIntent) {
      publishInsightsIntent(nextIntent);
    } else {
      clearInsightsIntent();
    }

    // Intent events dispatch synchronously. Keep the open check after restoring
    // the prior reading path; an effect would override this on the next render.
    setFocusedIndex(index);
  }

  function handleLayerKeyDown(
    event: KeyboardEvent<HTMLButtonElement>,
    index: number,
  ) {
    let nextIndex: number | null = null;
    let direction: 1 | -1 | undefined;

    if (event.key === "ArrowDown" || event.key === "ArrowRight") {
      nextIndex = (index + 1) % layers.length;
      direction = 1;
    }
    if (event.key === "ArrowUp" || event.key === "ArrowLeft") {
      nextIndex = (index - 1 + layers.length) % layers.length;
      direction = -1;
    }
    if (event.key === "Home") nextIndex = 0;
    if (event.key === "End") nextIndex = layers.length - 1;

    if (nextIndex === null) return;

    event.preventDefault();
    selectLayer(nextIndex, direction);
    layerButtonRefs.current[nextIndex]?.focus({ preventScroll: true });
  }

  return (
    <div
      className="insights-worksheet"
      onFocusCapture={keepControlVisible}
      style={{ "--worksheet-accent": THREAD_COLORS[focusedLayer.element] } as CSSProperties}
    >
      <div className="insights-worksheet__status">
        <div className="insights-worksheet__status-copy">
          <span className="sr-only" role="status" aria-atomic="true">{statusLabel}</span>
          <span className="insights-worksheet__status-summary" aria-hidden="true">
            {markedCount > 0 || !intentLayer ? (
              <>
                <span className="insights-worksheet__review-count">
                  {prefersReducedMotion ? <span>{markedCount}</span> : (
                    <AnimatePresence initial={false} custom={reviewCountDirection}>
                      <motion.span
                        key={markedCount}
                        custom={reviewCountDirection}
                        variants={REVIEW_COUNT_VARIANTS}
                        initial="enter"
                        animate="settled"
                        exit="exit"
                        transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
                      >
                        {markedCount}
                      </motion.span>
                    </AnimatePresence>
                  )}
                </span>
                <span>of {layers.length} marked</span>
              </>
            ) : statusLabel}
          </span>
        </div>
        <div className="insights-worksheet__marks" aria-hidden="true">
          {layers.map((layer, index) => (
            <i key={layer.slug} data-marked={markedSlugs.includes(layer.slug)}>
              <motion.span
                className="insights-worksheet__mark-fill"
                initial={false}
                animate={{ scaleX: markedSlugs.includes(layer.slug) ? 1 : 0 }}
                transition={{ duration: prefersReducedMotion ? 0 : 0.38, ease: [0.22, 1, 0.36, 1] }}
              />
              {index === focusedIndex ? (
                <motion.span
                  className="insights-worksheet__check-position"
                  layoutId={prefersReducedMotion ? undefined : `${selectionId}-position`}
                  initial={false}
                  transition={{ duration: prefersReducedMotion ? 0 : 0.42, ease: [0.22, 1, 0.36, 1] }}
                />
              ) : null}
            </i>
          ))}
        </div>
      </div>

      <motion.div
        ref={layerRailRef}
        layoutScroll
        className="insights-worksheet__areas"
        role="tablist"
        aria-label="Brand areas to review"
        aria-orientation={usesHorizontalRail ? "horizontal" : "vertical"}
      >
        {layers.map((layer, index) => {
          const selected = index === focusedIndex;
          const marked = markedSlugs.includes(layer.slug);
          return (
            <button
              key={layer.slug}
              ref={(node) => { layerButtonRefs.current[index] = node; }}
              id={`worksheet-tab-${layer.slug}`}
              type="button"
              role="tab"
              aria-selected={selected}
              aria-controls={`worksheet-panel-${layer.slug}`}
              tabIndex={selected ? 0 : -1}
              onClick={() => selectLayer(index)}
              onKeyDown={(event) => handleLayerKeyDown(event, index)}
            >
              {selected ? (
                <motion.span
                  className="insights-worksheet__selection"
                  aria-hidden="true"
                  layoutId={prefersReducedMotion ? undefined : selectionId}
                  initial={false}
                  transition={{ duration: prefersReducedMotion ? 0 : 0.42, ease: [0.22, 1, 0.36, 1] }}
                />
              ) : null}
              <span className="insights-worksheet__number">0{index + 1}</span>
              <span className="insights-worksheet__area-name">{layer.name}</span>
              <span className="insights-worksheet__area-icon" data-marked={marked} aria-hidden="true">
                <WorksheetMarkIcon marked={marked} reducedMotion={prefersReducedMotion} openIcon="arrow" />
              </span>
              {marked ? <span className="sr-only">Marked for review</span> : null}
            </button>
          );
        })}
      </motion.div>

      {/* Shared grid sizing reserves room for the longest check at any width.
          Inactive panels remain inert and hidden from view and assistive tech. */}
      {layers.map((layer, index) => {
        const selected = index === focusedIndex;
        const marked = markedSlugs.includes(layer.slug);
        return (
          <div
            key={layer.slug}
            ref={(node) => { panelRefs.current[index] = node; }}
            role="tabpanel"
            id={`worksheet-panel-${layer.slug}`}
            aria-labelledby={`worksheet-tab-${layer.slug}`}
            aria-hidden={!selected}
            inert={!selected}
            tabIndex={selected ? 0 : -1}
            className="insights-worksheet__panel"
          >
            <motion.div
              key={`${layer.slug}-${selected ? "active" : "idle"}`}
              initial={prefersReducedMotion || !selected ? false : "enter"}
              animate="settled"
              variants={{ enter: {}, settled: { transition: { staggerChildren: prefersReducedMotion ? 0 : 0.045 } } }}
              className="insights-worksheet__answer"
            >
              <motion.div variants={revealVariants} className="insights-worksheet__panel-label">
                <ElementGlyph slug={layer.element} className="h-5 w-5" strokeWidth={1.35} />
                <span>Check 0{index + 1} / {layer.name}</span>
              </motion.div>
              <motion.h3 variants={revealVariants}>{layer.question}</motion.h3>
              <motion.p variants={revealVariants} className="insights-worksheet__signal">{layer.signal}</motion.p>
              <div className="insights-worksheet__evidence">
                <motion.div variants={revealVariants}>
                  <h4>Evidence to collect</h4>
                  <ul>{layer.evidence.split(" · ").map((item) => <li key={item}>{item}</li>)}</ul>
                </motion.div>
                <motion.div variants={revealVariants}>
                  <h4>First move</h4>
                  <p>{layer.move}</p>
                </motion.div>
              </div>
            </motion.div>
            <div className="insights-worksheet__actions">
              <motion.button
                type="button"
                className="insights-worksheet__mark"
                aria-pressed={marked}
                whileTap={prefersReducedMotion ? undefined : { scale: 0.98 }}
                onClick={() => toggleLayer(layer.slug, index)}
              >
                <span className="insights-worksheet__mark-icon" aria-hidden="true">
                  <WorksheetMarkIcon marked={marked} reducedMotion={prefersReducedMotion} />
                </span>
                <span>{marked ? "Marked for review" : "Mark for review"}</span>
              </motion.button>
              <motion.button
                type="button"
                className="insights-worksheet__next"
                aria-label={`${index === layers.length - 1 ? "First" : "Next"} check: ${layers[(index + 1) % layers.length].name}`}
                whileTap={prefersReducedMotion ? undefined : { scale: 0.98 }}
                onClick={() => openLayer((index + 1) % layers.length, 1)}
              >
                {index === layers.length - 1 ? "First check" : "Next check"}
                <ArrowRight aria-hidden="true" />
              </motion.button>
            </div>
          </div>
        );
      })}

      <footer className="insights-worksheet__footer">
        <div className="insights-worksheet__review" role="group" aria-label="Your review list">
          {markedCount === 0 ? <p>Five questions before you commission a redesign.</p> : null}
          <AnimatePresence initial={false} mode="popLayout">
            {markedLayers.map((layer) => (
              <motion.button
                key={layer.slug}
                type="button"
                className="insights-worksheet__review-item"
                layout={prefersReducedMotion ? false : "position"}
                aria-label={`Review ${layer.name}`}
                aria-current={layer.slug === focusedLayer.slug ? "true" : undefined}
                initial={prefersReducedMotion ? false : { opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: prefersReducedMotion ? 0 : -4 }}
                transition={{ duration: prefersReducedMotion ? 0 : 0.22, ease: [0.22, 1, 0.36, 1] }}
                onClick={() => openLayer(layers.indexOf(layer))}
              >
                <Check aria-hidden="true" />{layer.name}
                {layer.slug === focusedLayer.slug ? (
                  <motion.span
                    className="insights-worksheet__review-selection"
                    aria-hidden="true"
                    layoutId={prefersReducedMotion ? undefined : `${selectionId}-review`}
                    initial={false}
                    transition={{ duration: prefersReducedMotion ? 0 : 0.3, ease: [0.22, 1, 0.36, 1] }}
                  />
                ) : null}
              </motion.button>
            ))}
          </AnimatePresence>
        </div>
        <div className="insights-worksheet__links">
          {suggestedLayer ? (
            <TrackedLink
              href={`/services#package-${suggestedLayer.service.slug}`}
              aria-label={`Explore ${suggestedLayer.service.name}`}
              event="contextual_cta_clicked"
              eventProps={{ source: "insights_evidence_ledger", route: suggestedLayer.service.slug, layer: suggestedLayer.slug, reader_path: readerIntent?.topicSlug ?? "none" }}
            >
              <span className="insights-worksheet__service-copy" aria-hidden="true">
                {/* Keep this link's space steady as its recommendation changes,
                    including when the footer wraps on a phone or at larger text sizes. */}
                {serviceNames.map((name) => (
                  <span key={name} className="insights-worksheet__service-measure">
                    Explore {name}<ArrowUpRight />
                  </span>
                ))}
                <motion.span
                  key={suggestedLayer.service.slug}
                  className="insights-worksheet__service-label"
                  initial={prefersReducedMotion ? false : { opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: prefersReducedMotion ? 0 : 0.28, ease: [0.22, 1, 0.36, 1] }}
                >
                  Explore {suggestedLayer.service.name}<ArrowUpRight />
                </motion.span>
              </span>
            </TrackedLink>
          ) : null}
          <TrackedLink
            href="/insights/brand-audit-checklist-before-rebrand"
            className="insights-worksheet__checklist"
            event="contextual_cta_clicked"
            eventProps={{ source: "insights_evidence_ledger", route: "audit_checklist", layer: suggestedLayer?.slug ?? "unselected", reader_path: readerIntent?.topicSlug ?? "none" }}
          >
            Read the full checklist<ArrowUpRight aria-hidden="true" />
          </TrackedLink>
        </div>
      </footer>
    </div>
  );
}
