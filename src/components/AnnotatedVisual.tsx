"use client";

import { useHydratedReducedMotion } from "@/hooks/useHydratedReducedMotion";
import Image from "next/image";
import { motion } from "framer-motion";
import { useRevealTrigger } from "@/hooks/useRevealTrigger";
import { EASE_AIR } from "@/lib/motion";

// A photo annotated with dot-and-line callouts instead of another boxed
// card grid — the same "explain a point by pointing at it" technique
// alethia.earth/solutions/nature-based uses on its own hero tree, per
// direct feedback asking for exactly this instead of cards. Two
// callouts only (not three) — matches what that reference actually
// shows on screen at once, and keeps the layout from feeling crowded
// around a single photo. Desktop only for the dot/line treatment;
// mobile stacks the photo then each callout as plain text below it,
// since precise dot positions don't survive a full-width reflow.
//
// Redesign pass: the connector lines used to be static from first
// paint, and the photo sat small inside a capped 20-26rem column with
// a lot of surrounding whitespace, reading as a diagram rather than a
// considered visual moment. The lines now draw in (real SVG
// pathLength animation, the same technique LinkButton's own hover
// state already proves) once the section is actually visible, staged
// slightly after their own callout text, so the connection itself
// reads as a discovered relationship rather than something that was
// simply always there. The photo column is wider.

export type VisualCallout = {
  dotTop: string;
  dotLeft: string;
  side: "left" | "right";
  title: string;
  text: string;
};

export function AnnotatedVisual({
  image,
  alt,
  callouts,
}: {
  image: string;
  alt: string;
  callouts: [VisualCallout, VisualCallout];
}) {
  const [left, right] = callouts;
  const [ref, visible] = useRevealTrigger();
  const prefersReducedMotion = useHydratedReducedMotion();

  return (
    <div ref={ref} className="mx-auto max-w-5xl">
      <div className="hidden items-center gap-10 md:grid md:grid-cols-[1fr_minmax(24rem,34rem)_1fr]">
        <CalloutText callout={left} delay={0.1} visible={visible} />
        <div className="relative aspect-[4/3] w-full">
          <Image src={image} alt={alt} fill sizes="34vw" className="object-contain" />
          <Dot top={left.dotTop} left={left.dotLeft} lineTo="left" visible={visible} delay={0.3} prefersReducedMotion={Boolean(prefersReducedMotion)} />
          <Dot top={right.dotTop} left={right.dotLeft} lineTo="right" visible={visible} delay={0.45} prefersReducedMotion={Boolean(prefersReducedMotion)} />
        </div>
        <CalloutText callout={right} delay={0.25} visible={visible} />
      </div>

      <div className="space-y-8 md:hidden">
        <div className="relative mx-auto aspect-[4/3] w-full max-w-sm">
          <Image src={image} alt={alt} fill sizes="90vw" className="object-contain" />
        </div>
        {[left, right].map((c) => (
          <div key={c.title}>
            <p className="font-display text-lg text-soil">{c.title}</p>
            <p className="mt-1 text-sm text-foreground-secondary">{c.text}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

function Dot({
  top,
  left,
  lineTo,
  visible,
  delay,
  prefersReducedMotion,
}: {
  top: string;
  left: string;
  lineTo: "left" | "right";
  visible: boolean;
  delay: number;
  prefersReducedMotion: boolean;
}) {
  const lineWidth = 48;
  return (
    <span
      aria-hidden="true"
      className="absolute h-2 w-2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-clay"
      style={{ top, left }}
    >
      <svg
        className="absolute top-1/2 -translate-y-1/2"
        style={{ [lineTo === "left" ? "right" : "left"]: "100%" }}
        width={lineWidth}
        height="2"
      >
        <motion.line
          x1={lineTo === "left" ? lineWidth : 0}
          x2={lineTo === "left" ? 0 : lineWidth}
          y1="1"
          y2="1"
          stroke="var(--color-clay)"
          strokeOpacity={0.5}
          strokeWidth={1}
          initial={prefersReducedMotion ? undefined : { pathLength: 0 }}
          animate={prefersReducedMotion ? undefined : { pathLength: visible ? 1 : 0 }}
          transition={{ duration: 0.35, delay, ease: EASE_AIR }}
        />
      </svg>
    </span>
  );
}

function CalloutText({ callout, delay, visible }: { callout: VisualCallout; delay: number; visible: boolean }) {
  return (
    <motion.div
      className={callout.side === "left" ? "text-right" : "text-left"}
      initial={{ opacity: 0, y: 12 }}
      animate={visible ? { opacity: 1, y: 0 } : undefined}
      transition={{ duration: 0.35, delay, ease: EASE_AIR }}
    >
      <p className="font-display text-lg text-soil">{callout.title}</p>
      <p className="mt-1 text-sm text-foreground-secondary">{callout.text}</p>
    </motion.div>
  );
}
