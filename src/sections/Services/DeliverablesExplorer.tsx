"use client";

import { useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { Container } from "@/components/Container";
import { Reveal } from "@/components/Reveal";
import { LinkButton } from "@/components/Button";
import { deliverables, SCOPE_GROUPS, type ScopeGroup } from "@/data/deliverables";
import { packages } from "@/data/services";
import { track } from "@/lib/analytics";
import { motionTokens } from "@/lib/motionTokens";

// The deliverables explorer (conversion rebuild §16) — the invisible
// work made tangible. Every chip is a real inclusion from
// data/services.ts; selecting one reveals what it is, why it matters,
// and how it gets used, with the packages that include it. Scope
// group filters use the five group model instead of a raw list.
// Accessible throughout: buttons with pressed states, an aria live
// detail panel, nothing behind hover, reduced motion renders state
// changes instantly.
export function DeliverablesExplorer() {
  const [group, setGroup] = useState<ScopeGroup | "all">("all");
  const [activeId, setActiveId] = useState(deliverables[0].id);
  const prefersReducedMotion = useReducedMotion();

  const visible = group === "all" ? deliverables : deliverables.filter((d) => d.group === group);
  const active = deliverables.find((d) => d.id === activeId) ?? deliverables[0];

  function pick(id: string) {
    setActiveId(id);
    track("deliverable_inspected", { deliverable: id });
  }

  function pickGroup(g: ScopeGroup | "all") {
    setGroup(g);
    const pool = g === "all" ? deliverables : deliverables.filter((d) => d.group === g);
    if (pool.length && !pool.some((d) => d.id === activeId)) pick(pool[0].id);
  }

  return (
    <Container className="max-w-6xl">
      <Reveal>
        <p className="text-sm font-medium uppercase tracking-wide text-sandstone">Deliverables</p>
        <h2 className="mt-2 max-w-2xl text-display-sm font-display font-normal text-ivory">
          What you actually leave with.
        </h2>
        <p className="mt-4 max-w-xl text-base leading-relaxed text-ivory/85">
          Fourteen real deliverables across the three packages. Select any one to see what it is, why it matters, and
          how it gets used.
        </p>
      </Reveal>

      <div role="group" aria-label="Filter by scope group" className="mt-8 flex flex-wrap gap-2">
        {(["all", ...SCOPE_GROUPS] as const).map((g) => {
          const isActive = group === g;
          return (
            <button
              key={g}
              type="button"
              aria-pressed={isActive}
              onClick={() => pickGroup(g)}
              className={`rounded-full border px-3.5 py-1.5 text-xs uppercase tracking-[0.12em] transition-colors duration-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-sandstone ${
                isActive
                  ? "border-sandstone/70 bg-sandstone/15 text-ivory"
                  : "border-ivory/20 text-ivory/65 hover:border-ivory/40 hover:text-ivory"
              }`}
            >
              {g === "all" ? "Everything" : g}
            </button>
          );
        })}
      </div>

      <div className="mt-8 grid gap-8 lg:grid-cols-[1.15fr_1fr] lg:gap-14">
        <ul className="flex flex-wrap content-start gap-2.5" aria-label="Deliverables">
          {visible.map((d, i) => {
            const isActive = d.id === activeId;
            return (
              <motion.li
                key={d.id}
                initial={prefersReducedMotion ? undefined : { opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: motionTokens.durationFast, delay: prefersReducedMotion ? 0 : i * 0.03 }}
              >
                <button
                  type="button"
                  aria-pressed={isActive}
                  onClick={() => pick(d.id)}
                  className={`rounded-xl border px-4 py-2.5 text-left font-display text-base transition-colors duration-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-sandstone sm:text-lg ${
                    isActive
                      ? "border-sandstone/70 bg-ivory/[0.08] text-ivory"
                      : "border-ivory/15 bg-ivory/[0.03] text-ivory/80 hover:border-ivory/35 hover:text-ivory"
                  }`}
                >
                  {d.name}
                </button>
              </motion.li>
            );
          })}
        </ul>

        <div aria-live="polite" className="lg:sticky lg:top-28 lg:self-start">
          <AnimatePresence mode="wait">
            <motion.div
              key={active.id}
              initial={prefersReducedMotion ? undefined : { opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={prefersReducedMotion ? undefined : { opacity: 0 }}
              transition={{ duration: motionTokens.durationFast, ease: motionTokens.easeOrganic }}
              className="rounded-2xl border border-ivory/15 p-6 backdrop-blur-md sm:p-7"
              style={{ backgroundColor: "rgba(244,239,230,0.05)" }}
            >
              <p className="text-xs font-medium uppercase tracking-[0.15em] text-sandstone">{active.group}</p>
              <p className="mt-1.5 font-display text-2xl font-normal text-ivory">{active.name}</p>
              {(
                [
                  ["What it is", active.what],
                  ["Why it matters", active.why],
                  ["How it gets used", active.use],
                ] as const
              ).map(([label, text]) => (
                <div key={label} className="mt-4">
                  <p className="text-[0.62rem] font-medium uppercase tracking-[0.18em] text-ivory/55">{label}</p>
                  <p className="mt-1 text-sm leading-relaxed text-ivory/90">{text}</p>
                </div>
              ))}
              <div className="mt-5 flex flex-wrap items-center gap-2 border-t border-ivory/12 pt-4">
                <span className="text-[0.62rem] font-medium uppercase tracking-[0.18em] text-ivory/55">
                  Included in
                </span>
                {active.packages.map((slug) => {
                  const pkg = packages.find((p) => p.slug === slug);
                  return pkg ? (
                    <span
                      key={slug}
                      className="rounded-full border px-2.5 py-1 text-xs text-ivory/90"
                      style={{ borderColor: `${pkg.color}88`, backgroundColor: `${pkg.color}22` }}
                    >
                      {pkg.name}
                    </span>
                  ) : null;
                })}
              </div>
              <div className="mt-5">
                <LinkButton href="#desire" variant="secondary" className="border-ivory/30 text-ivory hover:bg-ivory/10">
                  See the packages
                </LinkButton>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </Container>
  );
}
