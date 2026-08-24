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

  if (!focusedLayer) return null;

  function toggleLayer(slug: string, index: number) {
    setFocusedIndex(index);
    setMarkedSlugs((current) =>
      current.includes(slug)
        ? current.filter((candidate) => candidate !== slug)
        : [...current, slug],
    );
  }

  return (
    <div
      className="insights-evidence-ledger"
      style={
        {
          "--ledger-progress": `${markedCount / Math.max(1, layers.length)}`,
        } as CSSProperties
      }
    >
      <div className="insights-evidence-ledger__status">
        <span>Working brief</span>
        <strong aria-live="polite">
          {markedCount === 0
            ? `${layers.length} ${layers.length === 1 ? "layer remains" : "layers remain"} open`
            : `${markedCount} ${markedCount === 1 ? "layer" : "layers"} marked for review`}
        </strong>
        <i aria-hidden="true">
          <span />
        </i>
      </div>

      <ol className="insights-evidence-ledger__layers">
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
            key={focusedLayer.slug}
            initial={
              prefersReducedMotion
                ? false
                : { clipPath: "inset(0 0 100% 0)", y: 6 }
            }
            animate={{ clipPath: "inset(0 0 0% 0)", y: 0 }}
            exit={
              prefersReducedMotion
                ? undefined
                : { clipPath: "inset(100% 0 0 0)", y: -4 }
            }
            transition={{
              duration: prefersReducedMotion ? 0 : 0.32,
              ease: [0.22, 1, 0.36, 1],
            }}
          >
            <p>
              <span>Signal to investigate</span>
              {focusedLayer.signal}
            </p>
            <p>
              <span>Evidence to collect</span>
              {focusedLayer.evidence}
            </p>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
