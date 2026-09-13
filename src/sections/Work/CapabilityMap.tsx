"use client";

import { useHydratedMotionPreference } from "@/hooks/useHydratedReducedMotion";
import { useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { Container } from "@/components/Container";
import { BackgroundVideo } from "@/components/BackgroundVideo";
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
  const { hydrated, prefersReducedMotion } = useHydratedMotionPreference();
  const animateTransitions = hydrated && !prefersReducedMotion;
  const need = NEED_PATHS.find((item) => item.id === activeNeed) ?? NEED_PATHS[0];
  const project = projects.find((item) => item.slug === need.projectSlug);
  const activeCapabilities = CAPABILITIES.filter((capability) => need.capabilityIds.includes(capability.id));

  function pick(id: string) {
    setActiveNeed(id);
    track("capability_selected", { need: id, source: "work_case_selector" });
  }

  return (
    <section id="find-relevant-proof" className="relative scroll-mt-24 overflow-hidden py-14 sm:py-24" style={{ backgroundColor: WORK.mist }}>
      <BackgroundVideo
        video="/videos/generated/bt-work-capability-rootmist.mp4"
        poster="/images/generated/bt-work-capability-rootmist-poster.jpg"
        parallax
        playbackRate={0.92}
      />
      <div aria-hidden="true" className="absolute inset-0 bg-[#DDE2DC]/82" />
      <Container className="relative max-w-6xl">
        <div>
          <p className="text-sm font-medium uppercase tracking-[0.2em]" style={{ color: WORK.moss }}>
            Find relevant proof
          </p>
          <h2 className="mt-2 max-w-2xl font-display text-display-sm font-normal" style={{ color: WORK.charcoal }}>
            What are you trying to fix?
          </h2>
          <p className="mt-4 max-w-xl text-base leading-relaxed" style={{ color: WORK.wood }}>
            Choose the condition that feels familiar. The selector reveals the recorded project, capability areas, and service path most closely connected to it.
          </p>
        </div>

        <div className="mt-7 sm:mt-8">
          <WaystoneField
            stones={NEED_STONES}
            activeId={activeNeed}
            onSelect={pick}
            ariaLabel="Choose the brand problem you are trying to fix"
            tone="light"
          />
        </div>

        <div className="mt-7 grid gap-5 lg:mt-10 lg:grid-cols-[1.2fr_1fr] lg:gap-16">
          <div className="order-2 lg:order-1">
            <div
              data-mobile-capability-map
              data-active-capability-count={activeCapabilities.length}
              className="rounded-2xl border p-4 lg:hidden"
              style={{ borderColor: WORK.stone + "88", backgroundColor: "rgba(255,255,255,0.38)" }}
            >
              <div className="grid grid-cols-[minmax(0,1fr)_auto] items-start gap-4">
                <div>
                  <p className="text-[0.6rem] font-medium uppercase tracking-[0.17em]" style={{ color: WORK.moss }}>
                    Capability path
                  </p>
                  <h3 className="mt-1 max-w-[13rem] font-display text-lg font-normal" style={{ color: WORK.charcoal }}>
                    What this evidence actually used
                  </h3>
                </div>
                <p
                  className="max-w-[6rem] pt-0.5 text-right text-[0.56rem] uppercase leading-relaxed tracking-[0.12em]"
                  style={{ color: WORK.olive }}
                >
                  {activeCapabilities.length} of {CAPABILITIES.length} active
                </p>
              </div>

              <AnimatePresence mode="wait" initial={false}>
                <motion.ul
                  key={need.id}
                  initial={animateTransitions ? { opacity: 0, y: motionTokens.distanceMicro } : false}
                  animate={{ opacity: 1, y: 0 }}
                  exit={animateTransitions ? { opacity: 0, y: -motionTokens.distanceMicro } : undefined}
                  transition={{ duration: animateTransitions ? motionTokens.durationFast : 0, ease: motionTokens.easeOrganic }}
                  className="mt-4 flex flex-wrap gap-2"
                  aria-label="Active capability areas for the selected problem"
                >
                  {activeCapabilities.map((capability, index) => (
                    <li
                      key={capability.id}
                      className="inline-flex min-h-10 items-center gap-2 rounded-full border px-3 py-2"
                      style={{ borderColor: WORK.stone + "88", backgroundColor: WORK.cream }}
                    >
                      <span className="text-[0.54rem] font-medium uppercase tracking-[0.12em]" style={{ color: WORK.olive }}>
                        {String(index + 1).padStart(2, "0")}
                      </span>
                      <span className="font-display text-sm leading-none" style={{ color: WORK.forest }}>
                        {capability.name}
                      </span>
                    </li>
                  ))}
                </motion.ul>
              </AnimatePresence>

              <p className="mt-4 border-t pt-3 text-[0.72rem] leading-relaxed" style={{ borderColor: WORK.stone + "66", color: WORK.wood }}>
                Only the areas evidenced by this route are shown. The complete map contains fifteen.
              </p>
            </div>

            <ul className="hidden flex-wrap items-start gap-x-3 gap-y-4 lg:flex" aria-label="Complete capability map">
              {CAPABILITIES.map((capability, index) => {
                const lit = need.capabilityIds.includes(capability.id);
                return (
                  <motion.li
                    key={capability.id}
                    animate={
                      animateTransitions
                        ? { y: lit ? 0 : motionTokens.distanceMicro, scale: lit ? 1 : 0.97 }
                        : undefined
                    }
                    transition={{ duration: animateTransitions ? motionTokens.durationFast : 0, ease: motionTokens.easeOrganic }}
                    className="rounded-full border px-4 py-2 font-display text-lg transition-colors duration-500"
                    style={{
                      marginTop: `${(index % 3) * 8}px`,
                      borderColor: lit ? WORK.moss : "rgba(111,78,55,0.28)",
                      backgroundColor: lit ? "rgba(85,107,74,0.14)" : "rgba(255,255,255,0.12)",
                      color: lit ? WORK.forest : "rgba(111,78,55,0.68)",
                    }}
                  >
                    {capability.name}
                  </motion.li>
                );
              })}
            </ul>
          </div>

          <div className="order-1 lg:order-2" aria-live="polite" aria-atomic="true">
            <AnimatePresence mode="wait" initial={false}>
              <motion.div
                key={need.id}
                data-recommended-proof
                initial={animateTransitions ? { opacity: 0, y: 10 } : false}
                animate={{ opacity: 1, y: 0 }}
                exit={animateTransitions ? { opacity: 0, y: -6 } : undefined}
                transition={{ duration: animateTransitions ? 0.35 : 0, ease: EASE_ORGANIC }}
                className="rounded-2xl p-5 sm:p-7"
                style={{ backgroundColor: WORK.cream }}
              >
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-xs font-medium uppercase tracking-[0.18em]" style={{ color: WORK.moss }}>
                      Closest recorded evidence
                    </p>
                    {project && (
                      <p className="mt-2 font-display text-2xl font-normal" style={{ color: WORK.charcoal }}>
                        {project.title}
                      </p>
                    )}
                  </div>
                  <span
                    className="shrink-0 rounded-full border px-2.5 py-1 text-[0.56rem] font-medium uppercase tracking-[0.12em]"
                    style={{ borderColor: WORK.stone, color: WORK.olive }}
                  >
                    {activeCapabilities.length} capabilities
                  </span>
                </div>
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
