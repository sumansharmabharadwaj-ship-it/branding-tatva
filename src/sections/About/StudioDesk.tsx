"use client";

import { useHydratedReducedMotion } from "@/hooks/useHydratedReducedMotion";
import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { Container } from "@/components/Container";
import { Reveal } from "@/components/Reveal";
import { BackgroundVideo } from "@/components/BackgroundVideo";
import { experience } from "@/data/about";

// Suman's board, the studio wave: "the visitor explores YOU, never
// reads about you." Six objects sit on the desk; opening one reveals
// real practice material — the working method, the education pairing,
// the two disciplines, the documented decisions, the reading, and the
// record of roles. Every panel is genuine content already true of this
// practice: nothing simulated, no invented artifacts, no fabricated
// sketches. Accordion semantics (a real button per object, one panel
// open at a time, aria-expanded and aria-controls) so keyboard and
// screen readers explore exactly what a pointer does; the layout is a
// plain grid on every breakpoint, so nothing hides behind hover or
// depends on precise coordinates.
type Drawer = {
  id: string;
  label: string;
  hint: string;
  body: string[];
  href?: string;
  linkLabel?: string;
  list?: string[];
};

const DRAWERS: Drawer[] = [
  {
    id: "notebook",
    label: "The notebook",
    hint: "How a project actually starts",
    body: [
      "Every engagement opens with questions rather than deliverables: which single idea should surface with your name, who you get compared against, and which buying moments currently stay silent.",
      "The answers become the positioning sentence everything downstream inherits. Design waits until that sentence exists.",
    ],
    href: "/services#study",
    linkLabel: "Inspect the deliverables I hand over",
  },
  {
    id: "degrees",
    label: "Two degrees",
    hint: "Why psychology sits beside literature",
    body: [
      "M.A. Clinical Psychology, Amity University, 2023. B.A. (Hons) English Literature, University of Delhi, 2021.",
      "One studies how people notice, associate, remember, and choose. The other studies how language carries meaning. Brand strategy is the discipline where both apply at once, which is the whole argument of this practice.",
    ],
    href: "/insights/how-psychology-informs-brand-strategy",
    linkLabel: "Read how the psychology actually applies",
  },
  {
    id: "decisions",
    label: "Decision records",
    hint: "What survives after the project",
    body: [
      "Decisions get written down the day they land: the choice, the reasons as they actually were, the alternatives that lost, and the condition that would reopen the question.",
      "A brand drifts when the reasons live only in someone's memory. Records are how consistency survives new hands.",
    ],
    href: "/insights/how-to-document-brand-decisions",
    linkLabel: "See the record template",
  },
  {
    id: "voice",
    label: "The voice standard",
    hint: "The rules this site holds itself to",
    body: [
      "This site runs on its own documented voice: a vocabulary it reaches for, words it refuses, a rhythm, and claims it will stake. Every sentence here passes that standard before it ships.",
      "A voice you can break silently is a voice you never had, which is why the rules exist in writing rather than in taste.",
    ],
    href: "/insights/verbal-identity-beyond-tone-of-voice",
    linkLabel: "Read the voice worksheet",
  },
  {
    id: "evidence",
    label: "The evidence shelf",
    hint: "Real engagements, real numbers",
    body: [
      "Five client engagements, each documented with its challenge, its decision, and only outcomes that were actually measured. Where a number exists it appears; where none exists the decision speaks instead.",
    ],
    href: "/services#proof",
    linkLabel: "See the evidence",
  },
  {
    id: "roles",
    label: "The record",
    hint: "Where the practice was built",
    body: [
      "The practice grew out of content and marketing work before it became strategy, which is why execution reality sits underneath every recommendation here.",
    ],
    list: experience.map((e) => `${e.role} · ${e.org} · ${e.period}`),
  },
];

export function StudioDesk() {
  const [open, setOpen] = useState<string | null>(null);
  const prefersReducedMotion = useHydratedReducedMotion();

  return (
    <section className="relative overflow-hidden bg-soil py-16 sm:py-24">
      <BackgroundVideo video="/videos/pexels-studio-morning-light.mp4" videoWebm="/videos/pexels-studio-morning-light.webm" poster="/images/pexels-studio-morning-light-poster.jpg" />
      <div className="absolute inset-0 bg-soil/85" />
      <Container className="relative max-w-6xl">
        <div className="grid gap-10 lg:grid-cols-[minmax(0,17rem)_1fr] lg:gap-16">
          <Reveal>
            <div>
              <Image
                src="/images/own-portrait.jpg"
                alt="Suman Sharma"
                width={480}
                height={480}
                className="aspect-square w-32 rounded-full object-cover sm:w-40"
              />
              <p className="mt-5 text-sm font-medium uppercase tracking-[0.2em] text-sandstone">The studio</p>
              <h2 className="mt-2 font-display text-display-sm font-normal leading-[1.1] text-ivory">
                Open anything on the desk.
              </h2>
              <p className="mt-4 max-w-xs text-sm leading-relaxed text-ivory/75">
                Six objects, each holding something real from the practice. Open them in any order.
              </p>
            </div>
          </Reveal>

          <Reveal delay={0.1}>
            <ul className="grid gap-3 sm:grid-cols-2">
              {DRAWERS.map((d) => {
                const isOpen = open === d.id;
                return (
                  <li
                    key={d.id}
                    className={`rounded-2xl border transition-colors duration-300 ${isOpen ? "border-sandstone/60" : "border-ivory/12 hover:border-ivory/30"} ${isOpen ? "sm:col-span-2" : ""}`}
                    style={{ backgroundColor: isOpen ? "rgba(244,239,230,0.07)" : "rgba(244,239,230,0.04)" }}
                  >
                    <button
                      type="button"
                      aria-expanded={isOpen}
                      aria-controls={`drawer-${d.id}`}
                      onClick={() => setOpen(isOpen ? null : d.id)}
                      className="flex w-full items-baseline justify-between gap-4 px-5 py-4 text-left focus-visible:outline focus-visible:outline-2 focus-visible:outline-sandstone"
                    >
                      <span>
                        <span className="block font-display text-lg font-normal text-ivory sm:text-xl">{d.label}</span>
                        <span className="mt-0.5 block text-xs text-ivory/60">{d.hint}</span>
                      </span>
                      <span
                        aria-hidden="true"
                        className={`shrink-0 text-lg font-light transition-transform duration-300 ${isOpen ? "rotate-45 text-sandstone" : "text-ivory/50"}`}
                      >
                        +
                      </span>
                    </button>
                    <div id={`drawer-${d.id}`} hidden={!isOpen}>
                      <AnimatePresence initial={false}>
                        {isOpen && (
                          <motion.div
                            initial={prefersReducedMotion ? undefined : { opacity: 0, y: 8 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={prefersReducedMotion ? undefined : { opacity: 0 }}
                            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                            className="px-5 pb-5"
                          >
                            {d.body.map((p) => (
                              <p key={p} className="mt-2 max-w-2xl text-sm leading-relaxed text-ivory/85">
                                {p}
                              </p>
                            ))}
                            {d.list && (
                              <ul className="mt-3 space-y-1.5">
                                {d.list.map((line) => (
                                  <li key={line} className="text-sm text-ivory/75 before:mr-2 before:content-['·']">
                                    {line}
                                  </li>
                                ))}
                              </ul>
                            )}
                            {d.href && d.linkLabel && (
                              <Link
                                href={d.href}
                                className="link-underline mt-4 inline-flex items-center gap-2 text-sm font-medium text-sandstone transition-colors duration-300 hover:text-ivory"
                              >
                                {d.linkLabel} <span aria-hidden="true">→</span>
                              </Link>
                            )}
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  </li>
                );
              })}
            </ul>
          </Reveal>
        </div>
      </Container>
    </section>
  );
}
