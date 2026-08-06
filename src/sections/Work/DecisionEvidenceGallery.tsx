"use client";

import { useHydratedReducedMotion } from "@/hooks/useHydratedReducedMotion";
import { useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { Container } from "@/components/Container";
import { Reveal } from "@/components/Reveal";
import { decisionArtifacts } from "@/data/decisionArtifacts";
import { projects } from "@/data/projects";
import { track } from "@/lib/analytics";
import { WORK } from "@/sections/Work/palette";
import { motionTokens } from "@/lib/motionTokens";

// The tier-three visual archive: judgment shown at artefact scale rather
// than pretending every fragment is a separate transformation story.
// Seven real decisions from the five recorded engagements each carry
// the question, the decision, why it mattered, and where it appeared.
// One tile opens at a time; keyboard, pointer, touch, and reduced-motion
// visitors receive the same information.
export function DecisionEvidenceGallery() {
  const [openId, setOpenId] = useState<string | null>(null);
  const prefersReducedMotion = useHydratedReducedMotion();

  function toggle(id: string) {
    const next = openId === id ? null : id;
    setOpenId(next);
    if (next) track("decision_artifact_expanded", { artifact: id });
  }

  return (
    <section className="py-16 sm:py-24" style={{ backgroundColor: WORK.cream }}>
      <Container className="max-w-6xl">
        <Reveal>
          <p className="text-sm font-medium uppercase tracking-[0.2em]" style={{ color: WORK.olive }}>
            Visual archive · decision fragments
          </p>
          <h2 className="mt-2 max-w-2xl font-display text-display-sm font-normal" style={{ color: WORK.charcoal }}>
            Seven decisions, kept small enough to inspect.
          </h2>
          <p className="mt-4 max-w-xl text-base leading-relaxed" style={{ color: WORK.wood }}>
            These are artefacts from real engagements, not seven inflated case studies: the question each fragment
            answered, the call made, and the reason it mattered.
          </p>
        </Reveal>

        <ul className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3" aria-label="Decision artefacts">
          {decisionArtifacts.map((artifact, index) => {
            const open = openId === artifact.id;
            const project = projects.find((item) => item.slug === artifact.projectSlug);
            return (
              <motion.li
                key={artifact.id}
                layout={prefersReducedMotion ? false : "position"}
                transition={{ duration: motionTokens.durationBase, ease: motionTokens.easeOrganic }}
                className={open ? "sm:col-span-2 lg:col-span-3" : ""}
              >
                <div
                  className={`h-full rounded-2xl border transition-colors duration-300 ${
                    open ? "border-transparent" : "hover:border-[#556B4A]/50"
                  }`}
                  style={{
                    borderColor: open ? undefined : WORK.stone + "88",
                    backgroundColor: open ? WORK.forest : "rgba(255,255,255,0.5)",
                  }}
                >
                  <button
                    type="button"
                    aria-expanded={open}
                    onClick={() => toggle(artifact.id)}
                    className={`w-full p-5 text-left focus-visible:outline focus-visible:outline-2 sm:p-6 ${
                      open ? "" : "flex min-h-[9.75rem] flex-col"
                    }`}
                    style={{ outlineColor: WORK.moss }}
                  >
                    <span className="flex items-center justify-between gap-4">
                      <span
                        className="text-[0.6rem] font-medium uppercase tracking-[0.18em]"
                        style={{ color: open ? WORK.sand : WORK.olive }}
                      >
                        {artifact.kind}
                      </span>
                      <span
                        aria-hidden="true"
                        className="font-display text-sm"
                        style={{ color: open ? WORK.sage : WORK.wood }}
                      >
                        {String(index + 1).padStart(2, "0")}
                      </span>
                    </span>
                    <span
                      className="mt-1.5 block font-display text-xl font-normal leading-snug"
                      style={{ color: open ? WORK.cream : WORK.charcoal }}
                    >
                      {artifact.question}
                    </span>
                    {!open && (
                      <span
                        className="mt-auto inline-flex items-center gap-1 pt-5 text-[0.68rem] font-medium"
                        style={{ color: WORK.wood }}
                      >
                        Inspect the decision <span aria-hidden="true">→</span>
                      </span>
                    )}
                  </button>
                  <AnimatePresence initial={false}>
                    {open && (
                      <motion.div
                        initial={prefersReducedMotion ? undefined : { height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={prefersReducedMotion ? undefined : { height: 0, opacity: 0 }}
                        transition={{ duration: motionTokens.durationBase, ease: motionTokens.easeOrganic }}
                        className="overflow-hidden"
                      >
                        <div className="grid gap-5 px-5 pb-6 sm:px-6 lg:grid-cols-3 lg:gap-8">
                          {(
                            [
                              ["The decision", artifact.decision],
                              ["Why it mattered", artifact.why],
                              ["Where it appeared", artifact.where],
                            ] as const
                          ).map(([label, text]) => (
                            <div key={label}>
                              <p className="text-[0.6rem] font-medium uppercase tracking-[0.18em]" style={{ color: WORK.sage }}>
                                {label}
                              </p>
                              <p className="mt-1.5 text-sm leading-relaxed" style={{ color: "rgba(242,240,232,0.9)" }}>
                                {text}
                              </p>
                            </div>
                          ))}
                        </div>
                        {project && (
                          <div className="border-t px-5 pb-5 pt-4 sm:px-6" style={{ borderColor: "rgba(143,174,131,0.25)" }}>
                            <Link
                              href={`/work/${project.slug}`}
                              className="link-underline inline-flex items-center gap-2 text-sm font-medium"
                              style={{ color: WORK.sand }}
                            >
                              The full narrative: {project.title} <span aria-hidden="true">→</span>
                            </Link>
                          </div>
                        )}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </motion.li>
            );
          })}
        </ul>
      </Container>
    </section>
  );
}
