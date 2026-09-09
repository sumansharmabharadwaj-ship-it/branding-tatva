"use client";

import {
  useEffect,
  useRef,
  useState,
  type CSSProperties,
  type KeyboardEvent,
} from "react";
import { motion } from "framer-motion";
import { ArrowRight, ArrowUpRight, Check, Plus } from "lucide-react";
import { ElementGlyph } from "@/components/ElementGlyph";
import { TrackedLink } from "@/components/TrackedLink";
import type { InsightElement } from "@/data/insights";
import { useCenteredRailSelection } from "@/hooks/useCenteredRailSelection";
import { useHydratedReducedMotion } from "@/hooks/useHydratedReducedMotion";
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
  const [focusedIndex, setFocusedIndex] = useState(0);
  const [markedSlugs, setMarkedSlugs] = useState<string[]>([]);
  const [readerIntent, setReaderIntent] = useState<InsightsIntentDetail>();
  const priorReaderIntentRef = useRef<InsightsIntentDetail | undefined>(
    undefined,
  );
  const layerRailRef = useRef<HTMLDivElement>(null);
  const layerButtonRefs = useRef<Array<HTMLButtonElement | null>>([]);
  const prefersReducedMotion = useHydratedReducedMotion();
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
      window.removeEventListener(INSIGHTS_INTENT_EVENT, carryReaderIntent);
      window.removeEventListener(
        INSIGHTS_INTENT_CLEARED_EVENT,
        releaseReaderIntent,
      );
    };
  }, [layers]);

  useEffect(() => {
    if (!readerIntent || markedCount > 0) return;

    const intentIndex = layers.findIndex(
      (layer) => layer.topicSlug === readerIntent.topicSlug,
    );
    if (intentIndex >= 0) setFocusedIndex(intentIndex);
  }, [layers, markedCount, readerIntent]);

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

  function selectLayer(index: number) {
    setFocusedIndex(index);
    if (markedCount > 0) {
      writeInsightsEvidenceState({
        markedSlugs,
        focusedSlug: layers[index].slug,
        priorIntent: priorReaderIntentRef.current,
      });
    }
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
            <i key={layer.slug} data-marked={markedSlugs.includes(layer.slug)} />
          ))}
        </div>
      </div>

      <div
        ref={layerRailRef}
        className="insights-worksheet__areas"
        role="tablist"
        aria-label="Brand areas to review"
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
              <span className="insights-worksheet__number">0{index + 1}</span>
              <span className="insights-worksheet__area-name">{layer.name}</span>
              <span className="insights-worksheet__area-icon" aria-hidden="true">
                {marked ? <Check /> : <ArrowRight />}
              </span>
              {marked ? <span className="sr-only">Marked for review</span> : null}
            </button>
          );
        })}
      </div>

      {layers.map((layer, index) => (
        <div
          key={layer.slug}
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
                  initial={prefersReducedMotion ? false : { opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: prefersReducedMotion ? 0 : 0.28, ease: [0.22, 1, 0.36, 1] }}
                  className="insights-worksheet__answer"
                >
                  <h3>{layer.question}</h3>
                  <p className="insights-worksheet__signal">{layer.signal}</p>
                  <div className="insights-worksheet__evidence">
                    <div>
                      <h4>Evidence to collect</h4>
                      <ul>{layer.evidence.split(" · ").map((item) => <li key={item}>{item}</li>)}</ul>
                    </div>
                    <div>
                      <h4>First move</h4>
                      <p>{layer.move}</p>
                    </div>
                  </div>
                </motion.div>
              <button
                type="button"
                className="insights-worksheet__mark"
                aria-pressed={focusedIsMarked}
                onClick={() => toggleLayer(layer.slug, index)}
              >
                {focusedIsMarked ? <Check aria-hidden="true" /> : <Plus aria-hidden="true" />}
                {focusedIsMarked ? "Marked for review" : "Mark for review"}
              </button>
            </>
          ) : null}
        </div>
      ))}

      <footer className="insights-worksheet__footer">
        <p aria-live="polite">
          {markedCount > 0
            ? `${markedLayers.map((layer) => layer.name).join(", ")} ${markedCount === 1 ? "is" : "are"} on your review list.`
            : "Five questions before you commission a redesign."}
        </p>
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
