"use client";

import { useRef } from "react";
import { motion, useReducedMotion, useScroll, useTransform, type MotionValue } from "framer-motion";
import { Container } from "@/components/Container";
import { Reveal } from "@/components/Reveal";
import { TiltCard } from "@/components/TiltCard";
import { ElementGlyph } from "@/components/ElementGlyph";
import { useSpotlight } from "@/hooks/useSpotlight";
import { packages } from "@/data/services";

// The strategy room, interaction model v2: PROGRESSIVE DISCOVERY.
// Direct feedback on v1: the whole desk was visible at once, so the
// interaction loop (scroll, tilt, read) ended in seconds and the
// chapter went passive. On desktop the desk is now a scroll-scrubbed
// discovery sequence inside a sticky frame (the site's proven sticky
// mechanism — NOT ScrollTrigger.pin, per the documented history): the
// visitor arrives at a closed strategy folder; scrolling slides the
// cover away, then draws each file out of the folder one at a time
// until the full spread is assembled — the living, tiltable desk from
// v1 becomes the END STATE the visitor uncovers rather than the
// opening image. Roughly every quarter viewport of scroll reveals
// something new. Mobile and reduced motion keep the direct spread
// (CSS dual render, same convention as ElementsIntro) — a scrubbed
// 280vh sequence is a desktop pointer-and-wheel experience.
//
// All six living layers from v1 survive as the sequence's end state:
// lamp glows, dust, drifting grain (section level), camera settle,
// cursor lamp beam, tilt + under-page separation, embossing stamps,
// ambient sheet breathing.

const ANNOTATIONS: Record<string, string> = {
  "brand-beginning": "the ground everything stands on",
  "brand-clarity": "one system, every channel",
  "brand-partnership": "recognition, month after month",
};

const GLYPHS: Record<string, "earth" | "water" | "space"> = {
  "brand-beginning": "earth",
  "brand-clarity": "water",
  "brand-partnership": "space",
};

// Desktop discovery poses — absolute positions inside the sticky
// frame, deliberately photographed rather than laid out: overlapping,
// asymmetric, edges breathing against the frame.
const DESK_POSES = [
  { rotate: -1.4, className: "lg:absolute lg:left-[2%] lg:top-[4%] lg:w-[54%]" },
  { rotate: 1.2, className: "lg:absolute lg:right-[1%] lg:top-[24%] lg:w-[56%]" },
  { rotate: -0.9, className: "lg:absolute lg:bottom-[3%] lg:left-[9%] lg:w-[54%]" },
];

// Mobile flow poses (the v1 spread).
const FLOW_POSES = [
  { rotate: -1.3, className: "" },
  { rotate: 1.1, className: "" },
  { rotate: -0.9, className: "" },
];

// One sheet of the dossier — shared by both renders so the document
// itself (tab, rule, checklist, annotation, embossed glyph) stays
// identical between the desktop sequence and the mobile spread.
function Sheet({ pkg, pi, prefersReducedMotion, writeIn }: {
  pkg: (typeof packages)[number];
  pi: number;
  prefersReducedMotion: boolean | null;
  // Mobile writes items in on scroll; the desktop sequence pulls
  // already-authored files out of a folder, so items render complete.
  writeIn: boolean;
}) {
  const items = pkg.includes.filter((item) => !item.startsWith("Everything in"));
  return (
    <TiltCard glowColor={pkg.color}>
      <div
        aria-hidden="true"
        className={`absolute inset-0 rounded-sm bg-[#EFE6D6] shadow-[0_4px_18px_rgba(0,0,0,0.35)] transition-transform duration-500 ease-out ${
          pi % 2 === 0
            ? "rotate-[1.4deg] group-hover:translate-y-2.5 group-hover:rotate-[2.8deg]"
            : "-rotate-[1.2deg] group-hover:translate-y-2.5 group-hover:-rotate-[2.6deg]"
        }`}
      />
      <div className="relative inline-flex translate-y-px items-center gap-2 rounded-t-md border border-b-0 border-soil/20 bg-[#EFE6D6] px-4 py-1.5">
        <span aria-hidden="true" className="h-1.5 w-1.5 rounded-full" style={{ backgroundColor: pkg.color }} />
        <span className="text-[0.65rem] font-medium uppercase tracking-[0.2em] text-soil/70">
          File {String(pi + 1).padStart(2, "0")}
        </span>
      </div>
      <div className="relative overflow-hidden rounded-b-md rounded-tr-md bg-[#F6EFE2] p-6 shadow-[0_10px_40px_rgba(0,0,0,0.45)] transition-shadow duration-300 group-hover:shadow-[0_26px_64px_rgba(0,0,0,0.6)] sm:p-8">
        <div aria-hidden="true" className="absolute inset-x-0 top-0 h-[2px]" style={{ backgroundColor: pkg.color }} />
        <motion.div
          aria-hidden="true"
          className="pointer-events-none absolute -bottom-8 -right-6"
          initial={prefersReducedMotion ? { opacity: 0.09 } : { opacity: 0, scale: 1.18, rotate: -2 }}
          whileInView={prefersReducedMotion ? undefined : { opacity: 0.09, scale: 1, rotate: -6 }}
          viewport={{ once: true, margin: "0px 0px -6% 0px" }}
          transition={{ duration: 0.9, delay: 0.5, ease: [0.16, 1, 0.3, 1] }}
        >
          <ElementGlyph slug={GLYPHS[pkg.slug]} className="h-36 w-36" style={{ color: pkg.color }} />
        </motion.div>
        <div className="relative flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1">
          <h3 className="font-display text-2xl font-normal text-soil sm:text-3xl">{pkg.name}</h3>
          <span className="-rotate-1 font-display text-base italic text-action-secondary">{ANNOTATIONS[pkg.slug]}</span>
        </div>
        <div className="relative mt-4 h-px bg-soil/15" aria-hidden="true" />
        <ul className="relative mt-4 gap-x-8 space-y-2.5 sm:columns-2 sm:[&>li]:break-inside-avoid">
          {items.map((item, ii) => (
            <motion.li
              key={item}
              initial={writeIn && !prefersReducedMotion ? { opacity: 0, x: -10 } : undefined}
              whileInView={writeIn && !prefersReducedMotion ? { opacity: 1, x: 0 } : undefined}
              viewport={{ once: true, margin: "0px 0px -8% 0px" }}
              transition={{ duration: 0.4, delay: 0.3 + ii * 0.09 }}
              className="flex items-start gap-2.5 text-[0.95rem] text-soil/85"
            >
              <span aria-hidden="true" className="mt-0.5 shrink-0" style={{ color: pkg.color }}>
                &#10003;
              </span>
              {item}
            </motion.li>
          ))}
        </ul>
      </div>
    </TiltCard>
  );
}

// A file emerging from the folder in the desktop sequence — its
// opacity/travel/rotation are scrubbed by the section's own scroll
// progress over its assigned range, so the visitor physically draws it
// out of the folder. The ambient breath sits on a nested wrapper so
// the loop never fights the scrubbed values.
function SequencedSheet({ seq, range, pose, pi, children, prefersReducedMotion }: {
  seq: MotionValue<number>;
  range: [number, number];
  pose: { rotate: number; className: string };
  pi: number;
  children: React.ReactNode;
  prefersReducedMotion: boolean | null;
}) {
  const opacity = useTransform(seq, range, [0, 1]);
  const y = useTransform(seq, range, [150, 0]);
  const rotate = useTransform(seq, range, [pose.rotate + 5, pose.rotate]);
  return (
    <motion.div
      className={`group ${pose.className}`}
      style={{ opacity, y, rotate, zIndex: pi + 10 }}
    >
      <motion.div
        animate={prefersReducedMotion ? undefined : { y: [0, -5, 0] }}
        transition={{ duration: 7 + pi * 1.4, repeat: Infinity, ease: "easeInOut", delay: pi * 0.9 }}
      >
        {children}
      </motion.div>
    </motion.div>
  );
}

export function DeliverablesReveal({ room = false }: { room?: boolean }) {
  const prefersReducedMotion = useReducedMotion();
  const seqRef = useRef<HTMLDivElement>(null);
  const deskRef = useRef<HTMLDivElement>(null);
  // The discovery sequence's master progress — one scrubbed timeline
  // the folder, camera, and all three files hand off along.
  const { scrollYProgress: seq } = useScroll({ target: seqRef, offset: ["start start", "end end"] });
  const camRotateX = useTransform(seq, [0, 0.14], [5, 0]);
  const camScale = useTransform(seq, [0, 0.14], [0.96, 1]);
  // The folder cover: holds the frame alone, then slides off the desk.
  const coverX = useTransform(seq, [0.08, 0.3], ["0%", "-135%"]);
  const coverRotate = useTransform(seq, [0.08, 0.3], [-1.5, -13]);
  const coverOpacity = useTransform(seq, [0.26, 0.36], [1, 0]);
  const spotlightRef = useSpotlight(deskRef, Boolean(prefersReducedMotion));

  if (!room) {
    return (
      <Container className="max-w-5xl">
        <Reveal>
          <p className="text-sm font-medium uppercase tracking-wide text-sandstone">What you receive</p>
          <h2 className="mt-2 text-display-sm font-display font-normal text-ivory sm:text-display-md">
            What you actually leave with.
          </h2>
          <p className="mt-4 max-w-xl text-base text-ivory/85">
            Every item below is pulled directly from the three packages above. Nothing generic, nothing invented.
          </p>
        </Reveal>
        <div className="mt-12 grid gap-6 sm:grid-cols-3">
          {packages.map((pkg, pi) => {
            const items = pkg.includes.filter((item) => !item.startsWith("Everything in"));
            return (
              <div key={pkg.slug} className="h-full rounded-xl border-t-2 bg-ivory/[0.03] p-6" style={{ borderColor: pkg.color }}>
                <p className="text-xs font-medium uppercase tracking-[0.15em] text-ivory/60">{pkg.name}</p>
                <ul className="mt-4 space-y-3">
                  {items.map((item) => (
                    <li key={item} className="flex items-start gap-2.5 text-sm text-ivory/85">
                      <span aria-hidden="true" className="mt-0.5 shrink-0" style={{ color: pkg.color }}>
                        &#10003;
                      </span>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            );
          })}
        </div>
      </Container>
    );
  }

  return (
    <>
      <Container className="max-w-6xl">
        <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,15rem)] lg:items-end lg:gap-16">
          <Reveal>
            <p className="text-sm font-medium uppercase tracking-wide text-sandstone">What you receive</p>
            <h2 className="mt-2 text-display-sm font-display font-normal text-ivory sm:text-display-md">
              What you actually leave with.
            </h2>
            <p className="mt-4 max-w-xl text-base text-ivory/85">
              Every item below is pulled directly from the three packages above. Nothing generic, nothing invented.
            </p>
          </Reveal>
          <Reveal delay={0.12} className="hidden lg:block">
            <p className="text-xs font-medium uppercase tracking-[0.15em] text-ivory/50">Inside this file</p>
            <ol className="mt-3">
              {packages.map((pkg, i) => (
                <li key={pkg.slug} className="flex items-baseline gap-3 border-b border-ivory/15 py-2">
                  <span className="font-display text-sm text-ivory/40">{String(i + 1).padStart(2, "0")}</span>
                  <span className="text-sm text-ivory/80">{pkg.name}</span>
                </li>
              ))}
            </ol>
          </Reveal>
        </div>
      </Container>

      {/* DESKTOP: the discovery sequence. A 280vh scrub range with a
          sticky full-viewport frame — the visitor stands over the desk
          while the folder opens and the files are drawn out one at a
          time. Sticky, never pinned. Skipped entirely under reduced
          motion (a scrubbed sequence with no motion is a blank frame);
          those visitors get the direct spread below at every width. */}
      {!prefersReducedMotion && (
      <div ref={seqRef} className="relative hidden lg:block lg:h-[280vh]">
        <div className="sticky top-0 flex h-screen items-center">
          <Container className="w-full max-w-6xl">
            <div ref={deskRef} className="relative h-[82vh]" style={{ perspective: 1200 }}>
              <div ref={spotlightRef} aria-hidden="true" className="cursor-spotlight pointer-events-none absolute -inset-8 z-40" />
              <motion.div
                className="relative h-full"
                style={prefersReducedMotion ? undefined : { rotateX: camRotateX, scale: camScale, transformOrigin: "50% 30%" }}
              >
                {packages.map((pkg, pi) => (
                  <SequencedSheet
                    key={pkg.slug}
                    seq={seq}
                    range={([[0.18, 0.34], [0.42, 0.58], [0.64, 0.8]] as [number, number][])[pi]}
                    pose={DESK_POSES[pi]}
                    pi={pi}
                    prefersReducedMotion={prefersReducedMotion}
                  >
                    <Sheet pkg={pkg} pi={pi} prefersReducedMotion={prefersReducedMotion} writeIn={false} />
                  </SequencedSheet>
                ))}
                {/* The closed folder — the first thing on the desk, and
                    the chapter's opening question. Slides away as the
                    visitor begins to scroll. Centered via negative
                    margins so Framer's scrubbed x owns the transform. */}
                <motion.div
                  aria-hidden="true"
                  className="absolute left-1/2 top-1/2 z-30 w-[56%]"
                  style={{ x: coverX, rotate: coverRotate, opacity: coverOpacity, marginLeft: "-28%", marginTop: "-13%" }}
                >
                  <div className="rounded-md bg-[#EFE6D6] p-10 shadow-[0_18px_60px_rgba(0,0,0,0.55)]">
                    <div className="flex items-center justify-between">
                      <span className="text-[0.65rem] font-medium uppercase tracking-[0.25em] text-soil/60">
                        Branding Tatva
                      </span>
                      <span aria-hidden="true" className="h-8 w-8 rounded-full border-2 border-clay/40" />
                    </div>
                    <p className="mt-10 font-display text-4xl font-normal text-soil">Strategy files</p>
                    <p className="mt-2 text-sm text-soil/60">Three real packages. Every item inside is real.</p>
                    <div className="mt-10 h-px bg-soil/15" />
                    <p className="mt-3 text-[0.65rem] font-medium uppercase tracking-[0.25em] text-soil/50">
                      Scroll to open
                    </p>
                  </div>
                </motion.div>
              </motion.div>
            </div>
          </Container>
        </div>
      </div>
      )}

      {/* MOBILE + reduced motion: the direct spread — every file
          visible, entrances on scroll, checklists writing in. */}
      <Container className={`mt-12 max-w-6xl ${prefersReducedMotion ? "" : "lg:hidden"}`}>
        <div className="relative">
          {packages.map((pkg, pi) => (
            <motion.article
              key={pkg.slug}
              initial={prefersReducedMotion ? undefined : { opacity: 0, y: 60, rotate: FLOW_POSES[pi].rotate + 2.5 }}
              whileInView={prefersReducedMotion ? undefined : { opacity: 1, y: 0, rotate: FLOW_POSES[pi].rotate }}
              viewport={{ once: true, margin: "0px 0px -12% 0px" }}
              transition={{ duration: 0.7, delay: 0.08, ease: [0.16, 1, 0.3, 1] }}
              className="group relative mt-10 first:mt-0"
              style={{ zIndex: pi + 10 }}
            >
              <Sheet pkg={pkg} pi={pi} prefersReducedMotion={prefersReducedMotion} writeIn />
            </motion.article>
          ))}
        </div>
      </Container>
    </>
  );
}
