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

const NEED_TEACH: Record<string, string> = {
  clarity: "One position instead of several.",
  recognition: "Known before compared.",
  consistency: "One system, many hands.",
  launch: "Decided before designed.",
  marketing: "Amplify clarity, never confusion.",
};

const NEED_STONES: Waystone[] = NEED_PATHS.map((need) => ({
  id: need.id,
  title: need.label,
  teach: NEED_TEACH[need.id] ?? "",
  meta: `${need.capabilityIds.length} capability areas`,
}));

export function CapabilityMap() {
  const [activeNeed, setActiveNeed] = useState(NEED_PATHS[0].id);
  const prefersReducedMotion = useReducedMotion();
  const need = NEED_PATHS.find((item) => item.id === activeNeed) ?? NEED_PATHS[0];
  const project = projects.find((item) => item.slug === need.projectSlug);

  function pick(id: string) {
    setActiveNeed(id);
    track("capability_selected", { need: id, source: "work_case_selector" });
  }

  return (
    <section id="find-relevant-proof" className="scroll-mt-24 py-16 sm:py-24" style={{ backgroundColor: WORK.mist }}>
      <Container className="max-w-6xl">
        <Reveal>
          <p className="text-sm font-medium uppercase tracking-[0.2em]" style={{ color: WORK.moss }}>
            Find relevant proof
          </p>
          <h2 className="mt-2 max-w-2xl font-display text-display-sm font-normal" style={{ color: WORK.charcoal }}>
            What are you trying to fix?
          </h2>
          <p className="mt-4 max-w-xl text-base leading-relaxed" style={{ color: WORK.wood }}>
            Choose the condition that feels familiar. The selector reveals the recorded project, capability areas, and service path most closely connected to it.
          </p>
        </Reveal>

        <div className="mt-8">
          <WaystoneField
            stones={NEED_STONES}
            activeId={activeNeed}
            onSelect={pick}
            ariaLabel="Choose the brand problem you are trying to fix"
            tone="light"
          />
        </div>

        <div className="mt-10 grid gap-10 lg:grid-cols-[1.2fr_1fr] lg:gap-16">
          <ul className="flex flex-wrap items-start gap-x-3 gap-y-4" aria-label="Capability areas">
            {CAPABILITIES.map((capability, index) => {
              const lit = need.capabilityIds.includes(capability.id);
              return (
                <motion.li
                  key={capability.id}
                  animate={
                    prefersReducedMotion
                      ? undefined
                      : { y: lit ? 0 : motionTokens.distanceMicro, scale: lit ? 1 : 0.97 }
                  }
                  transition={{ duration: motionTokens.durationFast, ease: motionTokens.easeOrganic }}
                  className="rounded-full border px-4 py-2 font-display text-base transition-colors duration-500 sm:text-lg"
                  style={{
                    marginTop: `${(index % 3) * 8}px`,
                    borderColor: lit ? WORK.moss : WORK.stone + "77",
                    backgroundColor: lit ? "rgba(85,107,74,0.14)" : "transparent",
                    color: lit ? WORK.forest : WORK.stone,
                  }}
                >
                  {capability.name}
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
                  Closest recorded evidence
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
                      See the work behind this problem <span aria-hidden="true">→</span>
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
