"use client";

import { useHydratedReducedMotion } from "@/hooks/useHydratedReducedMotion";
import { useRef, useState } from "react";
import { motion } from "framer-motion";
import { motionTokens } from "@/lib/motionTokens";

// The Living Compass — waystones on a carved matte glass panel, per
// the direct spec. Each stone is an information object (title,
// teaching line, real count) rather than a button label. Hovering a
// stone expands it while its neighbours drift a few pixels aside to
// make space; a warm light follows the cursor beneath the glass;
// selecting sinks the stone two pixels with an inner shadow, a moss
// glow that pulses on a slow breath, and a contour line drawing
// itself around the border — the soundless wooden click achieved
// through scale and shadow compression alone. A stone marked
// recommended carries a quiet sand ring and label, grounded in the
// recommendation engine rather than any pretend intelligence.
// Accessibility: real buttons, pressed states, keyboard identical to
// pointer, and reduced motion renders every stone fully expanded with
// zero drift, pulse, or sweep.
export type Waystone = {
  id: string;
  title: string;
  teach: string;
  meta?: string;
};

// Tone tokens: the field lives on dark chapters (charcoal, forest)
// and light ones (mist, cream). Same behaviour, swapped materials.
const TONES = {
  dark: {
    panelBg: "rgba(212,185,154,0.06)",
    panelBorder: "border-ivory/12",
    light: "rgba(198,169,122,0.14)",
    stoneBorder: "border-ivory/15 hover:border-ivory/35",
    stoneBg: "rgba(244,239,230,0.04)",
    selectedBg: "rgba(85,107,74,0.2)",
    recommendedBorder: "border-sandstone/60",
    title: "text-ivory/85",
    titleSelected: "text-ivory",
    teach: "text-ivory/70",
    meta: "text-sandstone/80",
    recommendedTag: "text-sandstone",
    outline: "focus-visible:outline-sandstone",
    sweep: "rgba(242,240,232,0.5)",
  },
  light: {
    panelBg: "rgba(31,58,40,0.05)",
    panelBorder: "border-[#1B1B1B]/10",
    light: "rgba(198,169,122,0.22)",
    stoneBorder: "border-[#1B1B1B]/15 hover:border-[#1B1B1B]/35",
    stoneBg: "rgba(255,255,255,0.45)",
    selectedBg: "rgba(85,107,74,0.16)",
    recommendedBorder: "border-[#C6A97A]",
    title: "text-[#1B1B1B]/80",
    titleSelected: "text-[#1B1B1B]",
    teach: "text-[#6F4E37]",
    meta: "text-[#7D8E52]",
    recommendedTag: "text-[#6F4E37]",
    outline: "focus-visible:outline-[#556B4A]",
    sweep: "rgba(255,255,255,0.6)",
  },
} as const;

export function WaystoneField({
  stones,
  activeId,
  onSelect,
  ariaLabel,
  recommendedId,
  tone = "dark",
}: {
  stones: Waystone[];
  activeId: string | null;
  onSelect: (id: string) => void;
  ariaLabel: string;
  recommendedId?: string | null;
  tone?: "dark" | "light";
}) {
  const T = TONES[tone];
  const prefersReducedMotion = useHydratedReducedMotion();
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const [focusedId, setFocusedId] = useState<string | null>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const raf = useRef<number | null>(null);

  // The warm light under the glass follows the cursor — one rAF
  // coalesced write to two CSS variables, zero React state per move.
  function onPointerMove(e: React.PointerEvent<HTMLDivElement>) {
    if (prefersReducedMotion || e.pointerType !== "mouse") return;
    const el = panelRef.current;
    if (!el || raf.current) return;
    const { clientX, clientY } = e;
    raf.current = requestAnimationFrame(() => {
      raf.current = null;
      const rect = el.getBoundingClientRect();
      el.style.setProperty("--wx", `${(((clientX - rect.left) / rect.width) * 100).toFixed(1)}%`);
      el.style.setProperty("--wy", `${(((clientY - rect.top) / rect.height) * 100).toFixed(1)}%`);
    });
  }

  const attentionId = focusedId ?? hoveredId;
  const attentionIndex = stones.findIndex((stone) => stone.id === attentionId);

  return (
    <div
      ref={panelRef}
      onPointerMove={onPointerMove}
      onPointerLeave={() => setHoveredId(null)}
      className={`relative overflow-hidden rounded-2xl border p-4 sm:p-5 ${T.panelBorder}`}
      style={{
        // Matte carved glass: sandstone tinted, backdrop softened, the
        // site's own paper grain as the fiber — polished stone rather
        // than futuristic acrylic.
        backgroundColor: T.panelBg,
        backdropFilter: "blur(6px)",
        ["--wx" as string]: "50%",
        ["--wy" as string]: "50%",
      }}
    >
      <div className="paper-grain" style={{ opacity: 0.08 }} aria-hidden="true" />
      {!prefersReducedMotion && (
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 transition-opacity duration-500"
          style={{
            background: `radial-gradient(240px circle at var(--wx) var(--wy), ${T.light}, transparent 70%)`,
            opacity: hoveredId ? 1 : 0,
          }}
        />
      )}

      <div role="group" aria-label={ariaLabel} className="relative flex flex-wrap gap-2.5">
        {stones.map((stone, i) => {
          const selected = activeId === stone.id;
          const recommended = recommendedId === stone.id && !selected;
          const open = prefersReducedMotion || selected || attentionId === stone.id;
          // Neighbours make space: stones before the attended one drift
          // left, stones after drift right — a few pixels, never a jump.
          const drift =
            prefersReducedMotion || attentionIndex === -1 || attentionId === stone.id
              ? 0
              : i < attentionIndex
                ? -3
                : 3;
          return (
            <motion.button
              key={stone.id}
              type="button"
              data-waystone-id={stone.id}
              aria-pressed={selected}
              onClick={() => onSelect(stone.id)}
              onMouseEnter={() => setHoveredId(stone.id)}
              onFocus={() => setFocusedId(stone.id)}
              onBlur={() => setFocusedId((id) => (id === stone.id ? null : id))}
              animate={{ x: drift, y: selected && !prefersReducedMotion ? 2 : 0 }}
              whileTap={prefersReducedMotion ? undefined : { scale: 0.985 }}
              transition={{ duration: motionTokens.durationFast, ease: motionTokens.easeOrganic }}
              className={`relative overflow-hidden rounded-2xl border px-4 py-2.5 text-left transition-colors duration-300 focus-visible:outline focus-visible:outline-2 ${T.outline} ${
                selected ? "waystone-selected border-transparent" : recommended ? T.recommendedBorder : T.stoneBorder
              }`}
              style={{
                backgroundColor: selected ? T.selectedBg : T.stoneBg,
                boxShadow: selected ? "inset 0 2px 6px rgba(0,0,0,0.35)" : undefined,
              }}
            >
              {/* The contour line drawing itself around a placed marker. */}
              {selected && !prefersReducedMotion && (
                <svg className="pointer-events-none absolute inset-0 h-full w-full" aria-hidden="true">
                  <motion.rect
                    x="1"
                    y="1"
                    width="calc(100% - 2px)"
                    height="calc(100% - 2px)"
                    rx="11"
                    fill="none"
                    stroke="#8FAE83"
                    strokeOpacity="0.7"
                    strokeWidth="1.2"
                    initial={{ pathLength: 0 }}
                    animate={{ pathLength: 1 }}
                    transition={{ duration: motionTokens.durationSlow, ease: motionTokens.easeOrganic }}
                  />
                </svg>
              )}
              {/* The slow light sweep a settled marker catches. */}
              {selected && !prefersReducedMotion && (
                <span
                  aria-hidden="true"
                  className="waystone-sweep pointer-events-none absolute inset-y-0 w-1/3"
                  style={{ background: `linear-gradient(90deg, transparent, ${T.sweep}, transparent)` }}
                />
              )}
              {recommended && (
                <span className={`mb-0.5 block text-[0.55rem] font-medium uppercase tracking-[0.16em] ${T.recommendedTag}`}>
                  Recommended next
                </span>
              )}
              <span
                className={`block font-display text-base leading-snug transition-colors duration-300 sm:text-lg ${
                  selected ? T.titleSelected : T.title
                }`}
              >
                {stone.title}
              </span>
              {/* The stone's second and third layers unfold on
                  attention instead of hiding behind a click. */}
              <span
                data-waystone-details
                className="grid transition-[grid-template-rows,opacity] duration-500"
                style={{ gridTemplateRows: open ? "1fr" : "0fr", opacity: open ? 1 : 0 }}
              >
                <span className="overflow-hidden">
                  <span className={`block pt-1 text-xs leading-relaxed ${T.teach}`}>{stone.teach}</span>
                  {stone.meta && (
                    <span className={`block pt-0.5 text-[0.62rem] uppercase tracking-[0.14em] ${T.meta}`}>
                      {stone.meta}
                    </span>
                  )}
                </span>
              </span>
            </motion.button>
          );
        })}
      </div>
    </div>
  );
}
