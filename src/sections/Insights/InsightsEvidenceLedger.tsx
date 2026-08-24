"use client";

import { useState, type CSSProperties } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Check, Plus } from "lucide-react";
import { useHydratedReducedMotion } from "@/hooks/useHydratedReducedMotion";

export type EvidenceLayer = {
  slug: string;
  name: string;
  signal: string;
  evidence: string;
  move: string;
};

type InsightsEvidenceLedgerProps = {
  layers: EvidenceLayer[];
};

export function InsightsEvidenceLedger({ layers }: InsightsEvidenceLedgerProps) {
  const [focusedIndex, setFocusedIndex] = useState(0);
  const [markedSlugs, setMarkedSlugs] = useState<string[]>([]);
  const prefersReducedMotion = useHydratedReducedMotion();
  const focusedLayer = layers[focusedIndex];
  const markedCount = markedSlugs.length;
  const markedLayers = layers.filter((layer) => markedSlugs.includes(layer.slug));

  if (!focusedLayer) return null;

  const focusedIsMarked = markedSlugs.includes(focusedLayer.slug);
  const showsSynthesis = markedCount > 0 && focusedIsMarked;
  const markedRoute =
    markedCount === 2
      ? markedLayers.map((layer) => layer.name).join(" + ")
      : `the ${markedCount} marked layers`;
  const primaryDetail = showsSynthesis
    ? markedCount === 1
      ? `${focusedLayer.name} opens the first route. ${focusedLayer.signal}`
      : `Read ${markedRoute} as one connected buyer journey; evidence can reveal where confidence changes.`
    : focusedLayer.signal;
  const secondaryDetail = showsSynthesis
    ? `${focusedLayer.move} Start with ${focusedLayer.evidence.toLowerCase()}.`
    : focusedLayer.evidence;
  const statusLabel =
    markedCount === 0
      ? `${layers.length} ${layers.length === 1 ? "layer remains" : "layers remain"} open`
      : markedCount === 1
        ? `${markedLayers[0]?.name ?? "One layer"} opens the first route`
        : `${markedCount} layers form one working route`;

  function toggleLayer(slug: string, index: number) {
    const isMarked = markedSlugs.includes(slug);
    const nextMarkedSlugs = isMarked
      ? markedSlugs.filter((candidate) => candidate !== slug)
      : [...markedSlugs, slug];

    setMarkedSlugs(nextMarkedSlugs);

    if (isMarked && nextMarkedSlugs.length > 0) {
      const latestMarkedSlug = nextMarkedSlugs[nextMarkedSlugs.length - 1];
      const latestMarkedIndex = layers.findIndex(
        (layer) => layer.slug === latestMarkedSlug,
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

  return (
    <div
      className="insights-evidence-ledger"
      style={
        {
          "--ledger-progress": `${markedCount / Math.max(1, layers.length)}`,
        } as CSSProperties
      }
      data-brief-state={showsSynthesis ? "synthesized" : "preview"}
    >
      <div className="insights-evidence-ledger__status">
        <span>Working brief</span>
        <strong aria-live="polite">{statusLabel}</strong>
        <i aria-hidden="true">
          <span />
        </i>
      </div>

      <ol
        className="insights-evidence-ledger__layers"
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

          return (
            <li key={layer.slug}>
              <button
                type="button"
                aria-pressed={marked}
                className={focused ? "is-focused" : undefined}
                onClick={() => toggleLayer(layer.slug, index)}
                onFocus={() => setFocusedIndex(index)}
                onPointerEnter={(event) => {
                  if (event.pointerType !== "touch") setFocusedIndex(index);
                }}
              >
                <span>0{index + 1}</span>
                <strong>{layer.name}</strong>
                <small>{marked ? "Marked" : "Open"}</small>
                <i aria-hidden="true">
                  {marked ? (
                    <Check className="h-3.5 w-3.5" />
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
              showsSynthesis ? markedSlugs.join("-") : "preview"
            }`}
            data-brief-mode={showsSynthesis ? "synthesis" : "preview"}
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
            <p>
              <span>
                {showsSynthesis ? "Working hypothesis" : "Signal to investigate"}
              </span>
              {primaryDetail}
            </p>
            <p>
              <span>
                {showsSynthesis ? "Next evidence move" : "Evidence to collect"}
              </span>
              {secondaryDetail}
            </p>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
