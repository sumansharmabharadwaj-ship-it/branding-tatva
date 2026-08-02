"use client";

import { useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { Container } from "@/components/Container";
import { Reveal } from "@/components/Reveal";
import { decisionArtifacts } from "@/data/decisionArtifacts";
import { projects } from "@/data/projects";
import { track } from "@/lib/analytics";
import { WORK } from "@/sections/Work/palette";
import { motionTokens } from "@/lib/motionTokens";

// The decision evidence gallery (conversion rebuild §9) — judgment
// shown at tile size. Seven real decisions from the five recorded
// engagements, each tile carrying its question; expanding reveals the
// decision, why it mattered, and where it appeared, with the link
// back to the full narrative. One tile open at a time, the expanded
// tile spanning the grid; keyboard identical to pointer; reduced
// motion expands instantly; mobile stacks to one column.
export function DecisionEvidenceGallery() {
  const [openId, setOpenId] = useState<string | null>(null);
  const prefersReducedMotion = useReducedMotion();

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
            Decision evidence
          </p>
          <h2 className="mt-2 max-w-2xl font-display text-display-sm font-normal" style={{ color: WORK.charcoal }}>
            Seven decisions, kept small enough to inspect.
          </h2>
          <p className="mt-4 max-w-xl text-base leading-relaxed" style={{ color: WORK.wood }}>
            Each artefact is a real call from a recorded engagement: the question it answered, the decision made, and
            why it mattered.
          </p>
        </Reveal>

        <ul className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3" aria-label="Decision artefacts">
          {decisionArtifacts.map((artifact) => {
            const open = openId === artifact.id;
            const project = projects.find((p) => p.slug === artifact.projectSlug);
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
                    className="w-full p-5 text-left focus-visible:outline focus-visible:outline-2 sm:p-6"
                    style={{ outlineColor: WORK.moss }}
                  >
                    <span
                      className="text-[0.6rem] font-medium uppercase tracking-[0.18em]"
                      style={{ color: open ? WORK.sand : WORK.olive }}
                    >
                      {artifact.kind}
                    </span>
                    <span
                      className="mt-1.5 block font-display text-xl font-normal leading-snug"
                      style={{ color: open ? WORK.cream : WORK.charcoal }}
                    >
                      {artifact.question}
                    </span>
                    {!open && (
                      <span className="mt-3 inline-block text-xs" style={{ color: WORK.stone }}>
                        Open the decision <span aria-hidden="true">→</span>
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
