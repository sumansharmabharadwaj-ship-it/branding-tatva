"use client";

import { useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { Container } from "@/components/Container";
import { Reveal } from "@/components/Reveal";
import { CAPABILITIES, NEED_PATHS } from "@/data/capabilities";
import { projects } from "@/data/projects";
import { track } from "@/lib/analytics";
import { WORK, EASE_ORGANIC } from "@/sections/Work/palette";
import { motionTokens } from "@/lib/motionTokens";
import { WaystoneField, type Waystone } from "@/components/motion/WaystoneField";

// Each need waystone teaches in one line and carries the real count
// of capability areas it illuminates — computed from the need paths
// themselves, never typed by hand.
const NEED_TEACH: Record<string, string> = {
  clarity: "One position instead of several.",
  recognition: "Known before compared.",
  consistency: "One system, many hands.",
  launch: "Decided before designed.",
  marketing: "Amplify clarity, never confusion.",
};

const NEED_STONES: Waystone[] = NEED_PATHS.map((n) => ({
  id: n.id,
  title: n.label,
  teach: NEED_TEACH[n.id] ?? "",
  meta: `${n.capabilityIds.length} capability areas`,
}));

// The capability and experience map — breadth communicated through
// visible judgment rather than claimed volume. The visitor names
// their need; the map illuminates the capabilities that answer it,
// then shows the one real engagement that evidences those
// capabilities and the real package that serves the need. Accessible
// buttons throughout, nothing lives behind hover, reduced motion gets
// instant state changes, and every fact resolves to recorded data.
export function CapabilityMap() {
  const [activeNeed, setActiveNeed] = useState(NEED_PATHS[0].id);
  const prefersReducedMotion = useReducedMotion();
  const need = NEED_PATHS.find((n) => n.id === activeNeed) ?? NEED_PATHS[0];
  const project = projects.find((p) => p.slug === need.projectSlug);

  function pick(id: string) {
    setActiveNeed(id);
    track("capability_selected", { need: id });
  }

  return (
    <section className="py-16 sm:py-24" style={{ backgroundColor: WORK.mist }}>
      <Container className="max-w-6xl">
        <Reveal>
          <p className="text-sm font-medium uppercase tracking-[0.2em]" style={{ color: WORK.moss }}>
            Capability map
          </p>
          <h2 className="mt-2 max-w-2xl font-display text-display-sm font-normal" style={{ color: WORK.charcoal }}>
            Name the need. The map shows the work that answers it.
          </h2>
        </Reveal>

        <div className="mt-8">
          <WaystoneField
            stones={NEED_STONES}
            activeId={activeNeed}
            onSelect={pick}
            ariaLabel="Choose your need"
            tone="light"
          />
        </div>

        <div className="mt-10 grid gap-10 lg:grid-cols-[1.2fr_1fr] lg:gap-16">
          {/* The organic cluster — fifteen real capability areas; the
              active need's set illuminates. Offsets give the field a
              terrain feel while every node stays an ordinary, readable
              element in DOM order. */}
          <ul className="flex flex-wrap items-start gap-x-3 gap-y-4" aria-label="Capability areas">
            {CAPABILITIES.map((cap, i) => {
              const lit = need.capabilityIds.includes(cap.id);
              return (
                <motion.li
                  key={cap.id}
                  animate={
                    prefersReducedMotion
                      ? undefined
                      : { y: lit ? 0 : motionTokens.distanceMicro, scale: lit ? 1 : 0.97 }
                  }
                  transition={{ duration: motionTokens.durationFast, ease: motionTokens.easeOrganic }}
                  className="rounded-full border px-4 py-2 font-display text-base transition-colors duration-500 sm:text-lg"
                  style={{
                    marginTop: `${(i % 3) * 8}px`,
                    borderColor: lit ? WORK.moss : WORK.stone + "77",
                    backgroundColor: lit ? "rgba(85,107,74,0.14)" : "transparent",
                    color: lit ? WORK.forest : WORK.stone,
                  }}
                >
                  {cap.name}
                </motion.li>
              );
            })}
          </ul>

          <div aria-live="polite">
            <AnimatePresence mode="wait">
              <motion.div
                key={need.id}
                initial={prefersReducedMotion ? undefined : { opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={prefersReducedMotion ? undefined : { opacity: 0 }}
                transition={{ duration: 0.35, ease: EASE_ORGANIC }}
                className="rounded-2xl p-6 sm:p-7"
                style={{ backgroundColor: WORK.cream }}
              >
                <p className="text-xs font-medium uppercase tracking-[0.18em]" style={{ color: WORK.moss }}>
                  The evidence
                </p>
                {project && (
                  <p className="mt-2 font-display text-2xl font-normal" style={{ color: WORK.charcoal }}>
                    {project.title}
                  </p>
                )}
                <p className="mt-3 text-sm leading-relaxed" style={{ color: WORK.wood }}>
                  {need.line}
                </p>
                <div className="mt-5 flex flex-col gap-2 border-t pt-4 text-sm" style={{ borderColor: WORK.stone + "66" }}>
                  {project && (
                    <Link
                      href={`/work/${project.slug}`}
                      className="link-underline inline-flex items-center gap-2 font-medium"
                      style={{ color: WORK.forest }}
                    >
                      See the work behind this capability <span aria-hidden="true">→</span>
                    </Link>
                  )}
                  <Link
                    href="/services#desire"
                    className="link-underline inline-flex items-center gap-2"
                    style={{ color: WORK.moss }}
                  >
                    The service path: {need.packageName} <span aria-hidden="true">→</span>
                  </Link>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </Container>
    </section>
  );
}
