"use client";

import { useMemo, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { Container } from "@/components/Container";
import { Reveal } from "@/components/Reveal";
import { useRevealTrigger } from "@/hooks/useRevealTrigger";
import { motionTokens } from "@/lib/motionTokens";
import { deliverables, SCOPE_GROUPS, type ScopeGroup } from "@/data/deliverables";
import { packages } from "@/data/services";

// Package composition, drawn from real counts only. Every segment below
// is a count of actual rows in data/deliverables.ts whose `packages`
// array contains that package, grouped by that row's own `group` field.
// Nothing here is weighted, estimated, or scored: a segment five units
// long means five real deliverables, and the deliverable names sit one
// click away so the count can be checked against the list that produced
// it. The scope groups are the five already defined in that same file.
//
// This answers a question the explorer below it cannot: what actually
// separates the three packages, seen in one glance rather than by
// selecting fourteen items one at a time.

const GROUP_COLOR: Record<ScopeGroup, string> = {
  Foundation: "#B85A34", // clay
  Expression: "#C28A28", // ochre
  Experience: "#5C6B4A", // sage
  Activation: "#CD7A4C", // terracotta
  Continuity: "#AD6F5C", // rose earth
};

const VB_W = 360;
const VB_H = 16;
const GAP = 3;

export function ScopeComposition() {
  const [focus, setFocus] = useState<ScopeGroup | "all">("all");
  const prefersReducedMotion = useReducedMotion();
  const [ref, visible] = useRevealTrigger("0px 0px -120px 0px");
  const still = Boolean(prefersReducedMotion);
  const run = visible || still;

  const rows = useMemo(
    () =>
      packages.map((pkg) => {
        const items = deliverables.filter((d) => d.packages.some((s) => s === pkg.slug));
        const segments = SCOPE_GROUPS.map((group) => ({
          group,
          count: items.filter((d) => d.group === group).length,
        })).filter((s) => s.count > 0);
        return { pkg, total: items.length, segments };
      }),
    []
  );

  const axis = Math.max(...rows.map((r) => r.total));
  const unit = VB_W / axis;

  const focusItems = focus === "all" ? deliverables : deliverables.filter((d) => d.group === focus);

  return (
    <Container className="max-w-5xl">
      <Reveal>
        <p className="text-sm font-medium uppercase tracking-wide text-sandstone">Scope, at a glance</p>
        <h2 className="mt-2 max-w-2xl text-display-sm font-display font-normal text-ivory">
          Where each package puts its weight.
        </h2>
        <p className="mt-4 max-w-xl text-base leading-relaxed text-ivory/85">
          Every deliverable in the practice, sorted into the five scope groups it already belongs to. Bar length is a
          count, so the difference between the three packages arrives as a shape rather than a list. Choose a group to
          follow it across all three.
        </p>
      </Reveal>

      <div role="group" aria-label="Focus a scope group" className="mt-8 flex flex-wrap gap-2">
        {(["all", ...SCOPE_GROUPS] as const).map((g) => {
          const isActive = focus === g;
          return (
            <button
              key={g}
              type="button"
              aria-pressed={isActive}
              onClick={() => setFocus(g)}
              className="flex items-center gap-2 rounded-full border px-3.5 py-1.5 text-xs uppercase tracking-[0.12em] transition-colors duration-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-sandstone"
              style={{
                borderColor: isActive
                  ? g === "all"
                    ? "rgba(212,185,154,0.7)"
                    : `${GROUP_COLOR[g]}cc`
                  : "rgba(244,239,230,0.2)",
                backgroundColor: isActive
                  ? g === "all"
                    ? "rgba(212,185,154,0.15)"
                    : `${GROUP_COLOR[g]}26`
                  : "transparent",
                color: isActive ? "#F4EFE6" : "rgba(244,239,230,0.65)",
              }}
            >
              {g !== "all" && (
                <span
                  aria-hidden="true"
                  className="h-2 w-2 rounded-full"
                  style={{ backgroundColor: GROUP_COLOR[g] }}
                />
              )}
              {g === "all" ? "Everything" : g}
            </button>
          );
        })}
      </div>

      <div ref={ref} className="mt-10 space-y-8">
        {rows.map((row, ri) => {
          const inFocus = focus === "all" ? row.total : row.segments.find((s) => s.group === focus)?.count ?? 0;
          let cursor = 0;
          return (
            <div key={row.pkg.slug}>
              <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
                <p className="flex items-center gap-2.5 font-display text-lg font-normal text-ivory">
                  <span
                    aria-hidden="true"
                    className="h-2 w-2 rounded-full"
                    style={{ backgroundColor: row.pkg.color }}
                  />
                  {row.pkg.name}
                </p>
                <p className="text-xs uppercase tracking-[0.14em] text-ivory/60">
                  {focus === "all"
                    ? `${row.total} deliverables`
                    : `${inFocus} of ${row.total} in ${focus}`}
                </p>
              </div>
              <svg
                viewBox={`0 0 ${VB_W} ${VB_H}`}
                className="mt-3 h-auto w-full"
                role="img"
                aria-label={`${row.pkg.name}: ${row.segments
                  .map((s) => `${s.count} in ${s.group}`)
                  .join(", ")}. ${row.total} deliverables in total.`}
              >
                <motion.g
                  initial={still ? false : { scaleX: 0 }}
                  animate={run ? { scaleX: 1 } : undefined}
                  transition={
                    still
                      ? { duration: 0 }
                      : { duration: motionTokens.durationBase, ease: motionTokens.easeOrganic, delay: ri * 0.12 }
                  }
                  // originX rather than a transformOrigin style — see
                  // PriceLadder's note: Framer Motion overwrites
                  // transform-origin on SVG children otherwise, and the
                  // row would unroll from its own middle.
                  style={{ originX: 0 }}
                >
                  {row.segments.map((seg) => {
                    const x = cursor * unit;
                    const w = Math.max(2, seg.count * unit - GAP);
                    cursor += seg.count;
                    const dim = focus !== "all" && focus !== seg.group;
                    return (
                      <motion.rect
                        key={seg.group}
                        x={x}
                        y={0}
                        width={w}
                        height={VB_H}
                        rx={VB_H / 2}
                        fill={GROUP_COLOR[seg.group]}
                        initial={false}
                        animate={{ opacity: dim ? 0.22 : 1 }}
                        transition={still ? { duration: 0 } : { duration: motionTokens.durationFast }}
                      />
                    );
                  })}
                </motion.g>
              </svg>
            </div>
          );
        })}
      </div>

      <div aria-live="polite" className="mt-10 border-t border-ivory/12 pt-6">
        <p className="text-[0.62rem] font-medium uppercase tracking-[0.18em] text-ivory/55">
          {focus === "all" ? "All fourteen deliverables" : `${focus}: ${focusItems.length} deliverables`}
        </p>
        <ul className="mt-4 grid gap-x-8 gap-y-3 sm:grid-cols-2">
          {focusItems.map((d, i) => (
            <motion.li
              key={d.id}
              initial={still ? false : { opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={still ? { duration: 0 } : { duration: motionTokens.durationFast, delay: i * 0.03 }}
              className="flex items-start gap-2.5 text-sm leading-relaxed text-ivory/85"
            >
              <span
                aria-hidden="true"
                className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full"
                style={{ backgroundColor: GROUP_COLOR[d.group] }}
              />
              <span>
                {d.name}
                <span className="ml-2 text-xs text-ivory/50">
                  {d.packages
                    .map((slug) => packages.find((p) => p.slug === slug)?.name)
                    .filter(Boolean)
                    .join(", ")}
                </span>
              </span>
            </motion.li>
          ))}
        </ul>
      </div>
    </Container>
  );
}
