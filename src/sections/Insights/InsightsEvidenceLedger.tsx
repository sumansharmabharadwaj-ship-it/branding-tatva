"use client";

import {
  useEffect,
  useRef,
  useState,
  type CSSProperties,
  type KeyboardEvent,
} from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowUpRight, Check, Plus } from "lucide-react";
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
  const layerRailRef = useRef<HTMLOListElement>(null);
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
  const showsSynthesis = markedCount > 0 && focusedIsMarked;
  const intentLayer = readerIntent
    ? layers.find((layer) => layer.topicSlug === readerIntent.topicSlug)
    : undefined;
  const focusedIsCarried =
    markedCount === 0 && intentLayer?.slug === focusedLayer.slug;
  const focusedStateLabel = focusedIsMarked
    ? "Marked for review"
    : focusedIsCarried
      ? "Carried from your reading path"
      : "Open to review";
  const showsWorkingHypothesis = showsSynthesis || focusedIsCarried;
  const markedRoute =
    markedCount === 2
      ? markedLayers.map((layer) => layer.name).join(" + ")
      : `the ${markedCount} marked layers`;
  const primaryDetail = showsSynthesis
    ? markedCount === 1
      ? `${focusedLayer.name} opens the first route. ${focusedLayer.signal}`
      : `Read ${markedRoute} as one connected buyer journey; evidence can reveal where confidence changes.`
    : focusedIsCarried
      ? `${focusedLayer.name} may be where confidence changes. ${focusedLayer.signal}`
      : focusedLayer.signal;
  const secondaryDetail = showsSynthesis
    ? `${focusedLayer.move} Start with ${focusedLayer.evidence.toLowerCase()}.`
    : focusedIsCarried
      ? `${focusedLayer.move} Begin with ${focusedLayer.evidence.toLowerCase()}.`
      : focusedLayer.evidence;
  const statusLabel =
    markedCount === 0
      ? intentLayer
        ? `${intentLayer.name} enters as the first hypothesis`
        : `${layers.length} ${layers.length === 1 ? "layer remains" : "layers remain"} open`
      : markedCount === 1
        ? `${markedLayers[0]?.name ?? "One layer"} opens the first route`
        : `${markedCount} layers form one working route`;
  const latestMarkedSlug = markedSlugs[markedSlugs.length - 1];
  const latestMarkedLayer = latestMarkedSlug
    ? layers.find((layer) => layer.slug === latestMarkedSlug)
    : undefined;
  const actionLayer = latestMarkedLayer ?? intentLayer;
  const threadLayer = actionLayer;
  const threadIndex = threadLayer
    ? layers.findIndex((layer) => layer.slug === threadLayer.slug)
    : 0;
  const threadColor = threadLayer
    ? THREAD_COLORS[threadLayer.element]
    : THREAD_COLORS.space;
  const actionState = latestMarkedLayer
    ? "ready"
    : intentLayer
      ? "carried"
      : "open";
  const actionTitle = latestMarkedLayer
    ? `This evidence route points to ${latestMarkedLayer.service.name}.`
    : intentLayer
      ? `Test ${intentLayer.name.toLowerCase()} as the first confidence seam.`
      : "Mark one layer to turn concern into a working route.";
  const actionDetail = latestMarkedLayer
    ? latestMarkedLayer.service.frame
    : intentLayer
      ? `${intentLayer.move} The first mark turns this reading thread into a committed evidence route.`
      : "Choose the place where buyer confidence changes. The full checklist remains available when you need the complete sequence.";

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
        focusedSlug: isMarked
          ? (nextLatestLayer?.slug ?? selectedLayer.slug)
          : selectedLayer.slug,
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

    if (isMarked && nextLatestSlug) {
      const latestMarkedIndex = layers.findIndex(
        (layer) => layer.slug === nextLatestSlug,
      );
      setFocusedIndex(latestMarkedIndex >= 0 ? latestMarkedIndex : index);
      return;
    }

    setFocusedIndex(index);
  }

  function restoreLatestMarkedFocus() {
    const latestMarkedSlug = markedSlugs[markedSlugs.length - 1];
    if (!latestMarkedSlug) return;
    const latestMarkedIndex = layers.findIndex(
      (layer) => layer.slug === latestMarkedSlug,
    );
    if (latestMarkedIndex >= 0) setFocusedIndex(latestMarkedIndex);
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
    setFocusedIndex(nextIndex);
    layerButtonRefs.current[nextIndex]?.focus();
  }

  return (
    <div
      className="insights-evidence-ledger-shell"
      data-thread-active={Boolean(threadLayer)}
      data-thread-state={latestMarkedLayer ? "committed" : "carried"}
      style={
        {
          "--ledger-thread": threadColor,
          "--ledger-thread-index": `${Math.max(0, threadIndex)}`,
        } as CSSProperties
      }
    >
      <div className="insights-evidence-ledger__arrival" aria-hidden="true">
        <i />
        <span>
          {threadLayer ? (
            <>
              <ElementGlyph
                slug={threadLayer.element}
                className="h-4 w-4"
                strokeWidth={1.35}
              />
              <small>{readerIntent?.label ?? threadLayer.name}</small>
            </>
          ) : null}
        </span>
      </div>

      <div
        className="insights-evidence-ledger"
        style={
          {
            "--ledger-progress": `${
              (markedCount + (intentLayer && markedCount === 0 ? 0.55 : 0)) /
              Math.max(1, layers.length)
            }`,
          } as CSSProperties
        }
        data-brief-state={showsSynthesis ? "synthesized" : "preview"}
        data-threaded={Boolean(threadLayer)}
      >
        <div className="insights-evidence-ledger__status">
          <span>Working brief</span>
          <strong aria-live="polite">{statusLabel}</strong>
          <i aria-hidden="true">
            <span />
          </i>
        </div>

        <ol
          ref={layerRailRef}
          className="insights-evidence-ledger__layers"
          aria-label="Evidence layers to review"
          onBlur={(event) => {
            const nextTarget = event.relatedTarget;
            if (
              nextTarget instanceof Node &&
              event.currentTarget.contains(nextTarget)
            ) {
              return;
            }
            restoreLatestMarkedFocus();
          }}
          onPointerLeave={(event) => {
            if (event.pointerType !== "touch") restoreLatestMarkedFocus();
          }}
        >
          {layers.map((layer, index) => {
            const marked = markedSlugs.includes(layer.slug);
            const focused = index === focusedIndex;
            const carried = markedCount === 0 && intentLayer?.slug === layer.slug;

            return (
              <li key={layer.slug}>
                <button
                  ref={(node) => {
                    layerButtonRefs.current[index] = node;
                  }}
                  type="button"
                  aria-pressed={marked}
                  data-threaded={carried}
                  className={focused ? "is-focused" : undefined}
                  onClick={() => toggleLayer(layer.slug, index)}
                  onFocus={() => setFocusedIndex(index)}
                  onKeyDown={(event) => handleLayerKeyDown(event, index)}
                  onPointerEnter={(event) => {
                    if (event.pointerType !== "touch") setFocusedIndex(index);
                  }}
                >
                  <span>0{index + 1}</span>
                  <strong>{layer.name}</strong>
                  <small>{marked ? "Marked" : carried ? "Carried" : "Open"}</small>
                  <i aria-hidden="true">
                    {marked ? (
                      <Check className="h-3.5 w-3.5" />
                    ) : carried ? (
                      <ElementGlyph
                        slug={layer.element}
                        className="h-3.5 w-3.5"
                        strokeWidth={1.35}
                      />
                    ) : (
                      <Plus className="h-3.5 w-3.5" />
                    )}
                  </i>
                </button>
              </li>
            );
          })}
        </ol>

        <div className="insights-evidence-ledger__detail" aria-live="polite">
          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              key={`${focusedLayer.slug}-${
                showsSynthesis
                  ? markedSlugs.join("-")
                  : focusedIsCarried
                    ? "carried"
                    : "preview"
              }`}
              data-brief-mode={
                showsSynthesis
                  ? "synthesis"
                  : focusedIsCarried
                    ? "carried"
                    : "preview"
              }
              initial={
                prefersReducedMotion
                  ? false
                  : showsSynthesis
                    ? { clipPath: "inset(0 100% 0 0)", x: -6 }
                    : { clipPath: "inset(0 0 100% 0)", y: 6 }
              }
              animate={{ clipPath: "inset(0 0 0% 0)", x: 0, y: 0 }}
              exit={
                prefersReducedMotion
                  ? undefined
                  : showsSynthesis
                    ? { clipPath: "inset(0 0 0 100%)", x: 4 }
                    : { clipPath: "inset(100% 0 0 0)", y: -4 }
              }
              transition={{
                duration: prefersReducedMotion ? 0 : 0.32,
                ease: [0.22, 1, 0.36, 1],
              }}
            >
              <header className="insights-evidence-ledger__detail-head">
                <ElementGlyph
                  slug={focusedLayer.element}
                  className="h-5 w-5"
                  strokeWidth={1.35}
                />
                <span>
                  <small>Layer 0{focusedIndex + 1}</small>
                  <strong>{focusedLayer.name}</strong>
                </span>
                <em>{focusedStateLabel}</em>
              </header>
              <div className="insights-evidence-ledger__detail-grid">
                <p>
                  <span>
                    {showsWorkingHypothesis
                      ? "Working hypothesis"
                      : "Signal to investigate"}
                  </span>
                  {primaryDetail}
                </p>
                <p>
                  <span>
                    {showsWorkingHypothesis
                      ? focusedIsCarried
                        ? "First evidence move"
                        : "Next evidence move"
                      : "Evidence to collect"}
                  </span>
                  {secondaryDetail}
                </p>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        <aside
          className="insights-evidence-ledger__bridge"
          data-action-state={actionState}
          aria-label="Apply this insight"
        >
          <div className="insights-evidence-ledger__bridge-copy" aria-live="polite">
            <span>
              {latestMarkedLayer
                ? `Evidence thread · ${latestMarkedLayer.name}`
                : intentLayer
                  ? `Reading thread · ${readerIntent?.label ?? intentLayer.name}`
                  : "Apply this idea"}
            </span>
            <strong>{actionTitle}</strong>
            <p>{actionDetail}</p>
          </div>
          <div className="insights-evidence-ledger__bridge-actions">
            <TrackedLink
              href="/insights/brand-audit-checklist-before-rebrand"
              event="contextual_cta_clicked"
              eventProps={{
                source: "insights_evidence_ledger",
                route: "audit_checklist",
                layer: actionLayer?.slug ?? "unselected",
                reader_path: readerIntent?.topicSlug ?? "none",
              }}
            >
              Read the checklist
              <ArrowUpRight aria-hidden="true" />
            </TrackedLink>
            {latestMarkedLayer ? (
              <TrackedLink
                href={`/services#package-${latestMarkedLayer.service.slug}`}
                data-bridge-action="service"
                event="contextual_cta_clicked"
                eventProps={{
                  source: "insights_evidence_ledger",
                  route: latestMarkedLayer.service.slug,
                  layer: latestMarkedLayer.slug,
                  reader_path: readerIntent?.topicSlug ?? "none",
                }}
              >
                See where {latestMarkedLayer.service.name} fits
                <ArrowUpRight aria-hidden="true" />
              </TrackedLink>
            ) : null}
          </div>
          <i aria-hidden="true" />
        </aside>
      </div>
    </div>
  );
}
