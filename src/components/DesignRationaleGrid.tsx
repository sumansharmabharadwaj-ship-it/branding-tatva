"use client";

import { useState } from "react";
import Image from "next/image";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { Reveal } from "@/components/Reveal";
import { NatureAccent } from "@/components/NatureAccent";
import { LogoMark } from "@/components/Logo";
import { designChoices } from "@/data/design-rationale";
import { aboutIntro } from "@/data/about";
import { ELEMENT_HEX, SANDSTONE, SOIL } from "@/lib/sectionWash";
import { EASE_AIR } from "@/lib/motion";

// The honest version of the "logo/type/color/photography/voice reacting
// on hover" backlog item — every card here reveals a real, already-true
// specimen of this site's own system on hover or tap, not a fabricated
// brand-asset showcase built for a client who has none. Click/tap drives
// the actual open/close state (works identically on touch and desktop);
// hover and keyboard focus are convenience shortcuts into the same
// state, so nothing behaves differently for a mouse user versus someone
// tapping on a phone.
const PALETTE_SWATCHES = [
  { label: "Clay", hex: ELEMENT_HEX.earth },
  { label: "Indigo", hex: ELEMENT_HEX.water },
  { label: "Ochre", hex: ELEMENT_HEX.fire },
  { label: "Sage", hex: ELEMENT_HEX.air },
  { label: "Rose earth", hex: ELEMENT_HEX.space },
  { label: "Soil", hex: SOIL },
  { label: "Sandstone", hex: SANDSTONE },
];

const SPECIMEN_VARIANTS = {
  initial: { height: 0, opacity: 0 },
  animate: { height: "auto", opacity: 1 },
  exit: { height: 0, opacity: 0 },
};

function Specimen({ kind }: { kind: (typeof designChoices)[number]["kind"] }) {
  if (kind === "mark") {
    return (
      <div className="flex justify-center py-2">
        <LogoMark size={72} />
      </div>
    );
  }
  if (kind === "font-display") {
    return (
      <p className="py-2 text-center font-display text-4xl font-normal text-ivory sm:text-5xl">
        Aa Bb Cc
      </p>
    );
  }
  if (kind === "font-body") {
    return (
      <p className="py-2 text-center font-body text-2xl font-normal text-ivory sm:text-3xl">
        Aa Bb Cc
      </p>
    );
  }
  if (kind === "palette") {
    return (
      <div className="flex flex-wrap justify-center gap-3 py-2">
        {PALETTE_SWATCHES.map((s) => (
          <div key={s.label} className="text-center">
            <div className="h-8 w-8 rounded-full border border-ivory/20" style={{ backgroundColor: s.hex }} />
            <p className="mt-1 text-[0.6rem] uppercase tracking-wide text-ivory/50">{s.label}</p>
          </div>
        ))}
      </div>
    );
  }
  if (kind === "photography") {
    return (
      <div className="flex justify-center py-2">
        <div className="relative h-24 w-20 overflow-hidden rounded-2xl">
          <Image src="/images/own-portrait.jpg" alt="" fill sizes="80px" style={{ objectFit: "cover", objectPosition: "center 25%" }} />
        </div>
      </div>
    );
  }
  return (
    <p className="py-2 text-center font-display text-lg italic font-normal text-ivory">
      &ldquo;{aboutIntro.opening}&rdquo;
    </p>
  );
}

export function DesignRationaleGrid() {
  // Two separate pieces of state, not one: `pinned` is click/tap driven
  // and sticky until something else is clicked; `hovered` is a
  // mouse-only convenience that only applies while nothing is pinned.
  // A single shared index broke this: onMouseLeave had to clear
  // *something* on exit, and clearing the same index a click had just
  // set meant a click-to-open card slammed shut the instant the mouse
  // moved away, before a desktop user could even read the specimen.
  const [pinned, setPinned] = useState<number | null>(null);
  const [hovered, setHovered] = useState<number | null>(null);
  const prefersReducedMotion = useReducedMotion();

  return (
    <div className="mt-14 grid gap-x-12 gap-y-12 sm:grid-cols-2">
      {designChoices.map((choice, i) => {
        const isActive = pinned === i || (pinned === null && hovered === i);
        return (
          <Reveal key={choice.title} delay={i * 0.08}>
            <button
              type="button"
              onClick={() => setPinned((cur) => (cur === i ? null : i))}
              onMouseEnter={() => setHovered(i)}
              onMouseLeave={() => setHovered((cur) => (cur === i ? null : cur))}
              onFocus={() => setHovered(i)}
              onBlur={() => setHovered((cur) => (cur === i ? null : cur))}
              className="relative w-full border-t border-ivory/15 pt-6 text-left"
              aria-expanded={isActive}
            >
              <span className="font-display text-5xl font-normal leading-none text-ivory/15 sm:text-6xl">
                {String(i + 1).padStart(2, "0")}
              </span>
              <p className="mt-4 font-display text-lg font-normal text-ivory">{choice.title}</p>
              <p className="mt-2 text-sm text-ivory/85">{choice.detail}</p>
              <AnimatePresence initial={false}>
                {isActive && (
                  <motion.div
                    variants={prefersReducedMotion ? undefined : SPECIMEN_VARIANTS}
                    initial="initial"
                    animate="animate"
                    exit="exit"
                    transition={{ duration: 0.35, ease: EASE_AIR }}
                    className="overflow-hidden"
                  >
                    <div className="mt-4 rounded-2xl border border-ivory/15 bg-ivory/5">
                      <Specimen kind={choice.kind} />
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
              {/* One quiet hand-drawn touch, tied to this specific line
                  about the palette coming from materials rather than a
                  trend — not decoration for its own sake. */}
              {choice.title === "The palette" && (
                <NatureAccent
                  variant="mushroom"
                  className="pointer-events-none absolute -right-1 top-6 hidden h-9 w-9 rotate-6 text-ivory/20 sm:block"
                />
              )}
            </button>
          </Reveal>
        );
      })}
    </div>
  );
}
