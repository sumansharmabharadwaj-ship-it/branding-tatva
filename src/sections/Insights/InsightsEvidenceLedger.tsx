"use client";

import {
  useEffect,
  useId,
  useRef,
  useState,
  type CSSProperties,
  type KeyboardEvent,
} from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowRight, ArrowUpRight, Check, Plus } from "lucide-react";
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

export function InsightsEvidenceLedger({ layers }: InsightsEvidenceLedgerProps) {
  const selectionId = useId();
  const [focusedIndex, setFocusedIndex] = useState(0);
  const [selectionDirection, setSelectionDirection] = useState(1);
  const [markedSlugs, setMarkedSlugs] = useState<string[]>([]);
  const [readerIntent, setReaderIntent] = useState<InsightsIntentDetail>();
  const priorReaderIntentRef = useRef<InsightsIntentDetail | undefined>(
    undefined,
  );
  const layerRailRef = useRef<HTMLDivElement>(null);
  const layerButtonRefs = useRef<Array<HTMLButtonElement | null>>([]);
  const panelRefs = useRef<Array<HTMLDivElement | null>>([]);
  const panelFocusFrameRef = useRef<number | null>(null);
  const prefersReducedMotion = useHydratedReducedMotion();
  const usesHorizontalRail = useMediaQuery("(max-width: 760px)");
  const focusedLayer = layers[focusedIndex];
  const markedCount = markedSlugs.length;
  const markedLayers = layers.filter((layer) => markedSlugs.includes(layer.slug));

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
      setMarkedSlugs([]);
      setFocusedIndex(0);
      clearInsightsEvidenceState();
    }

    const initialIntent = readInsightsIntent();
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

      if (
        storedEvidence &&
        markedSlugs?.length === storedEvidence.markedSlugs.length &&
        latestMarkedLayer?.topicSlug === initialIntent.topicSlug
      ) {
        const focusedIndex = layers.findIndex(
          (layer) => layer.slug === storedEvidence.focusedSlug,
        );
        setMarkedSlugs(markedSlugs);
        setFocusedIndex(
          focusedIndex >= 0
            ? focusedIndex
            : layers.findIndex((layer) => layer.slug === latestMarkedSlug),
        );
        priorReaderIntentRef.current = storedEvidence.priorIntent;
      } else {
        clearInsightsEvidenceState();
      }
    }

    window.addEventListener(INSIGHTS_INTENT_EVENT, carryReaderIntent);
    window.addEventListener(
      INSIGHTS_INTENT_CLEARED_EVENT,
      releaseReaderIntent,
    );
    setReaderIntent(initialIntent);

    return () => {
      if (panelFocusFrameRef.current !== null) {
        window.cancelAnimationFrame(panelFocusFrameRef.current);
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
  const statusLabel = markedCount > 0
    ? `${markedCount} of ${layers.length} marked for review`
    : intentLayer
      ? `From your reading: ${intentLayer.name}`
      : "Choose an area to begin";
  const revealVariants = {
    enter: { opacity: 0, x: selectionDirection * 14 },
    settled: {
      opacity: 1,
      x: 0,
      transition: { duration: prefersReducedMotion ? 0 : 0.38, ease: [0.22, 1, 0.36, 1] as const },
    },
  };

  function selectLayer(index: number) {
    if (index === focusedIndex) return;
    setSelectionDirection(index > focusedIndex ? 1 : -1);
    setFocusedIndex(index);
    if (markedCount > 0) {
      writeInsightsEvidenceState({
        markedSlugs,
        focusedSlug: layers[index].slug,
        priorIntent: priorReaderIntentRef.current,
      });
    }
  }

  function openLayer(index: number) {
    selectLayer(index);
    if (panelFocusFrameRef.current !== null) {
      window.cancelAnimationFrame(panelFocusFrameRef.current);
    }

    // Wait for the selected panel to become visible, then hand keyboard and
    // screen-reader focus to its content without a native focus-scroll jump.
    panelFocusFrameRef.current = window.requestAnimationFrame(() => {
      panelFocusFrameRef.current = null;
      const panel = panelRefs.current[index];
      if (!panel || panel.hidden) return;

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
      ? {
          topicSlug: nextLatestLayer.topicSlug,
          query: "",
          label: nextLatestLayer.name,
          origin: "evidence-ledger",
        }
      : priorReaderIntentRef.current;

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

    if (event.key === "ArrowDown" || event.key === "ArrowRight") {
      nextIndex = (index + 1) % layers.length;
    }
    if (event.key === "ArrowUp" || event.key === "ArrowLeft") {
      nextIndex = (index - 1 + layers.length) % layers.length;
    }
    if (event.key === "Home") nextIndex = 0;
    if (event.key === "End") nextIndex = layers.length - 1;

    if (nextIndex === null) return;

    event.preventDefault();
    selectLayer(nextIndex);
    layerButtonRefs.current[nextIndex]?.focus({ preventScroll: true });
  }

  return (
    <div
      className="insights-worksheet"
      style={{ "--worksheet-accent": THREAD_COLORS[focusedLayer.element] } as CSSProperties}
    >
      <div className="insights-worksheet__status">
        <span aria-live="polite">{statusLabel}</span>
        <div className="insights-worksheet__marks" aria-hidden="true">
          {layers.map((layer) => (
            <i key={layer.slug} data-marked={markedSlugs.includes(layer.slug)}>
              <motion.span
                initial={false}
                animate={{ scaleX: markedSlugs.includes(layer.slug) ? 1 : 0 }}
                transition={{ duration: prefersReducedMotion ? 0 : 0.38, ease: [0.22, 1, 0.36, 1] }}
              />
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
              onFocus={() => selectLayer(index)}
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
                {marked ? <Check /> : <ArrowRight />}
              </span>
              {marked ? <span className="sr-only">Marked for review</span> : null}
            </button>
          );
        })}
      </motion.div>

      {layers.map((layer, index) => (
        <div
          key={layer.slug}
          ref={(node) => { panelRefs.current[index] = node; }}
          role="tabpanel"
          id={`worksheet-panel-${layer.slug}`}
          aria-labelledby={`worksheet-tab-${layer.slug}`}
          hidden={index !== focusedIndex}
          tabIndex={0}
          className="insights-worksheet__panel"
        >
          {index === focusedIndex ? (
            <>
              <div className="insights-worksheet__panel-label">
                <ElementGlyph slug={layer.element} className="h-5 w-5" strokeWidth={1.35} />
                <span>Check 0{index + 1} / {layer.name}</span>
              </div>
              <motion.div
                key={layer.slug}
                initial={prefersReducedMotion ? false : "enter"}
                animate="settled"
                variants={{ enter: {}, settled: { transition: { staggerChildren: prefersReducedMotion ? 0 : 0.065 } } }}
                className="insights-worksheet__answer"
              >
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
                  aria-pressed={focusedIsMarked}
                  whileTap={prefersReducedMotion ? undefined : { scale: 0.98 }}
                  onClick={() => toggleLayer(layer.slug, index)}
                >
                  <motion.span
                    key={focusedIsMarked ? "marked" : "open"}
                    className="insights-worksheet__mark-icon"
                    initial={prefersReducedMotion ? false : { scale: 0.65, rotate: -35 }}
                    animate={{ scale: 1, rotate: 0 }}
                    transition={{ duration: prefersReducedMotion ? 0 : 0.3, ease: [0.22, 1, 0.36, 1] }}
                    aria-hidden="true"
                  >
                    {focusedIsMarked ? <Check /> : <Plus />}
                  </motion.span>
                  <span>{focusedIsMarked ? "Marked for review" : "Mark for review"}</span>
                </motion.button>
                <motion.button
                  type="button"
                  className="insights-worksheet__next"
                  aria-label={`${index === layers.length - 1 ? "First" : "Next"} check: ${layers[(index + 1) % layers.length].name}`}
                  whileTap={prefersReducedMotion ? undefined : { scale: 0.98 }}
                  onClick={() => openLayer((index + 1) % layers.length)}
                >
                  {index === layers.length - 1 ? "First check" : "Next check"}
                  <ArrowRight aria-hidden="true" />
                </motion.button>
              </div>
            </>
          ) : null}
        </div>
      ))}

      <footer className="insights-worksheet__footer">
        <div className="insights-worksheet__review" role="group" aria-label="Your review list">
          {markedCount === 0 ? <p>Five questions before you commission a redesign.</p> : null}
          <AnimatePresence initial={false} mode="popLayout">
            {markedLayers.map((layer) => (
              <motion.button
                key={layer.slug}
                type="button"
                className="insights-worksheet__review-item"
                aria-label={`Review ${layer.name}`}
                aria-current={layer.slug === focusedLayer.slug ? "true" : undefined}
                initial={prefersReducedMotion ? false : { opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: prefersReducedMotion ? 0 : -4 }}
                transition={{ duration: prefersReducedMotion ? 0 : 0.22, ease: [0.22, 1, 0.36, 1] }}
                onClick={() => openLayer(layers.indexOf(layer))}
              >
                <Check aria-hidden="true" />{layer.name}
              </motion.button>
            ))}
          </AnimatePresence>
        </div>
        <div className="insights-worksheet__links">
          {latestMarkedLayer ? (
            <TrackedLink
              href={`/services#package-${latestMarkedLayer.service.slug}`}
              event="contextual_cta_clicked"
              eventProps={{ source: "insights_evidence_ledger", route: latestMarkedLayer.service.slug, layer: latestMarkedLayer.slug, reader_path: readerIntent?.topicSlug ?? "none" }}
            >
              Explore {latestMarkedLayer.service.name}<ArrowUpRight aria-hidden="true" />
            </TrackedLink>
          ) : null}
          <TrackedLink
            href="/insights/brand-audit-checklist-before-rebrand"
            className="insights-worksheet__checklist"
            event="contextual_cta_clicked"
            eventProps={{ source: "insights_evidence_ledger", route: "audit_checklist", layer: latestMarkedLayer?.slug ?? "unselected", reader_path: readerIntent?.topicSlug ?? "none" }}
          >
            Read the full checklist<ArrowUpRight aria-hidden="true" />
          </TrackedLink>
        </div>
      </footer>
    </div>
  );
}
