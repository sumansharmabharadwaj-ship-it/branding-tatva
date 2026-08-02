"use client";

import { useRef, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
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

export function WaystoneField({
  stones,
  activeId,
  onSelect,
  ariaLabel,
  recommendedId,
}: {
  stones: Waystone[];
  activeId: string | null;
  onSelect: (id: string) => void;
  ariaLabel: string;
  recommendedId?: string | null;
}) {
  const prefersReducedMotion = useReducedMotion();
  const [hoveredId, setHoveredId] = useState<string | null>(null);
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

  const hoveredIndex = stones.findIndex((s) => s.id === hoveredId);

  return (
    <div
      ref={panelRef}
      onPointerMove={onPointerMove}
      onPointerLeave={() => setHoveredId(null)}
      className="relative overflow-hidden rounded-2xl border border-ivory/12 p-4 sm:p-5"
      style={{
        // Matte carved glass: sandstone tinted, backdrop softened, the
        // site's own paper grain as the fiber — polished stone rather
        // than futuristic acrylic.
        backgroundColor: "rgba(212,185,154,0.06)",
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
            background: "radial-gradient(240px circle at var(--wx) var(--wy), rgba(198,169,122,0.14), transparent 70%)",
            opacity: hoveredId ? 1 : 0,
          }}
        />
      )}

      <div role="group" aria-label={ariaLabel} className="relative flex flex-wrap gap-2.5">
        {stones.map((stone, i) => {
          const selected = activeId === stone.id;
          const recommended = recommendedId === stone.id && !selected;
          const open = prefersReducedMotion || selected || hoveredId === stone.id;
          // Neighbours make space: stones before the hovered one drift
          // left, stones after drift right — a few pixels, never a jump.
          const drift =
            prefersReducedMotion || hoveredIndex === -1 || hoveredId === stone.id
              ? 0
              : i < hoveredIndex
                ? -3
                : 3;
          return (
            <motion.button
              key={stone.id}
              type="button"
              aria-pressed={selected}
              onClick={() => onSelect(stone.id)}
              onMouseEnter={() => setHoveredId(stone.id)}
              onFocus={() => setHoveredId(stone.id)}
              onBlur={() => setHoveredId((h) => (h === stone.id ? null : h))}
              animate={{ x: drift, y: selected && !prefersReducedMotion ? 2 : 0 }}
              whileTap={prefersReducedMotion ? undefined : { scale: 0.985 }}
              transition={{ duration: motionTokens.durationFast, ease: motionTokens.easeOrganic }}
              className={`relative overflow-hidden rounded-xl border px-4 py-2.5 text-left transition-colors duration-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-sandstone ${
                selected ? "waystone-selected border-transparent" : recommended ? "border-sandstone/60" : "border-ivory/15 hover:border-ivory/35"
              }`}
              style={{
                backgroundColor: selected ? "rgba(85,107,74,0.2)" : "rgba(244,239,230,0.04)",
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
                  style={{ background: "linear-gradient(90deg, transparent, rgba(242,240,232,0.5), transparent)" }}
                />
              )}
              {recommended && (
                <span className="mb-0.5 block text-[0.55rem] font-medium uppercase tracking-[0.16em] text-sandstone">
                  Recommended next
                </span>
              )}
              <span
                className={`block font-display text-base leading-snug transition-colors duration-300 sm:text-lg ${
                  selected ? "text-ivory" : "text-ivory/85"
                }`}
              >
                {stone.title}
              </span>
              {/* The stone's second and third layers unfold on
                  attention instead of hiding behind a click. */}
              <span
                className="grid transition-[grid-template-rows,opacity] duration-500"
                style={{ gridTemplateRows: open ? "1fr" : "0fr", opacity: open ? 1 : 0 }}
              >
                <span className="overflow-hidden">
                  <span className="block pt-1 text-xs leading-relaxed text-ivory/70">{stone.teach}</span>
                  {stone.meta && (
                    <span className="block pt-0.5 text-[0.62rem] uppercase tracking-[0.14em] text-sandstone/80">
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
