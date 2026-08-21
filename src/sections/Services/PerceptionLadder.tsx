"use client";

import { useRef } from "react";
import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";
import { Container } from "@/components/Container";
import { Reveal } from "@/components/Reveal";
import { AmbientElementShader } from "@/components/AmbientElementShader";

// "Education" objection — why premium-reading brands look different.
// Reframed from the brief's literal "looks expensive / feels expensive"
// ladder (trips the banned-adjective list — "expensive," close enough
// to "premium," reads as the exact agency-cliché register this site's
// copy standard exists to avoid) into the site's own established
// recognition/mental-availability vocabulary. Sits on the one Three.js
// ambient shader moment (AmbientElementShader) as a quiet backdrop —
// color and light, not literal 3D objects.
const RUNGS = [
  { label: "Unknown", text: "Zero recall, zero association. Where every brand starts." },
  { label: "Recognized", text: "Seen enough times to register. Still replaceable by the next thing seen." },
  { label: "Remembered", text: "Recalled without being shown again. Mental availability doing its actual job." },
  { label: "Preferred", text: "The default choice, decided before any comparison even starts." },
] as const;

export function PerceptionLadder() {
  const trackRef = useRef<HTMLDivElement>(null);
  const prefersReducedMotion = useReducedMotion();
  // Direct critique (Creative Direction Audit) flagged this as the
  // weakest execution on the page — real content, but a plain bordered
  // list with zero motion. The ladder metaphor now literally climbs:
  // a fill line tracks scroll progress through the list instead of a
  // static border, the same target-scoped useScroll technique already
  // proven lightweight elsewhere, no new scroll-math system invented.
  const { scrollYProgress } = useScroll({
    target: trackRef,
    offset: ["start 0.75", "end 0.4"],
  });
  const fillScale = useTransform(scrollYProgress, [0, 1], [0, 1]);

  return (
    <div className="relative py-20 sm:py-28">
      <AmbientElementShader opacity={0.16} />
      <Container className="relative max-w-2xl">
        <Reveal>
          <p className="text-sm font-medium uppercase tracking-wide text-sandstone">Education</p>
          <h2 className="mt-2 text-display-sm font-display font-normal text-ivory">
            Why some brands look different.
          </h2>
          <p className="mt-4 text-ivory/85">
            A position on the same ladder every brand climbs, deliberately or by accident.
          </p>
        </Reveal>

        <div ref={trackRef} className="relative mt-12 space-y-8 pl-6 sm:pl-8">
          <div className="absolute inset-y-0 left-0 w-[2px] bg-ivory/15" aria-hidden="true" />
          {!prefersReducedMotion && (
            <motion.div
              className="absolute left-0 top-0 w-[2px] origin-top bg-sandstone"
              style={{ height: "100%", scaleY: fillScale }}
              aria-hidden="true"
            />
          )}
          {RUNGS.map((rung, i) => (
            <Reveal key={rung.label} delay={i * 0.1}>
              <div className="relative">
                <span
                  className="absolute -left-[29px] top-1.5 h-2.5 w-2.5 rounded-full border-2 border-ivory/25 bg-soil sm:-left-[33px]"
                  aria-hidden="true"
                />
                <p className="font-display text-xl font-normal text-ivory sm:text-2xl">{rung.label}</p>
                <p className="mt-1 text-sm text-ivory/80 sm:text-base">{rung.text}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </Container>
    </div>
  );
}
