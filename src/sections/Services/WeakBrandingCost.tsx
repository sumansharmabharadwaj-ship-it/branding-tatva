"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { Container } from "@/components/Container";
import { Reveal } from "@/components/Reveal";
import { TiltCard } from "@/components/TiltCard";
import { useHydratedReducedMotion } from "@/hooks/useHydratedReducedMotion";
import { ELEMENT_HEX } from "@/lib/sectionWash";
import { MobileStakesDeck } from "@/sections/Services/MobileStakesDeck";

// A qualitative comparison grounded in the same mental availability,
// distinctive asset, and category-memory vocabulary used throughout
// the site. No invented statistics and no fabricated client story.
const WEAK = [
  "Competes mainly on price, since nothing else distinguishes it.",
  "Gets reintroduced to the market every time it advertises.",
  "Marketing spend replaces recognition instead of building on it.",
  "Blends into whichever category it happens to sit in.",
] as const;

const STRONG = [
  "Commands a price built on more than the lowest bid.",
  "Gets recognized before it gets explained.",
  "Marketing spend compounds instead of starting over each time.",
  "Owns a specific position inside its category, rather than one more listing in it.",
] as const;

// These four observations previously occupied a separate chapter. They
// remain here as the causal trail into the comparison, without another
// full-viewport shell repeating the same lesson.
const STARTS_HERE = [
  "Identity commissioned before positioning",
  "Constant reinvention",
  "Marketing asked to fix positioning",
  "Skipping the audit",
] as const;

export function WeakBrandingCost() {
  // Desktop retains the scroll-linked focus metaphor: the generic card
  // resolves from blur while the distinct card begins sharp. Mobile now
  // uses a stateful contrast deck, so it does not pay two full card
  // heights for one decision.
  const focusRef = useRef<HTMLDivElement>(null);
  const prefersReducedMotion = useHydratedReducedMotion();
  const { scrollYProgress } = useScroll({ target: focusRef, offset: ["start 0.95", "start 0.35"] });
  const blurPx = useTransform(scrollYProgress, [0, 1], [7, 1.5]);
  const filter = useTransform(blurPx, (blur) => `blur(${Math.round(blur)}px) saturate(0.85)`);

  return (
    <Container className="max-w-5xl">
      <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,18rem)] lg:items-end lg:gap-16">
        <Reveal>
          <p className="text-sm font-medium uppercase tracking-wide text-ivory/70">The stakes</p>
          <h2 className="mt-2 text-display-sm font-display font-normal text-ivory sm:text-display-md">
            What weak branding actually costs.
          </h2>
          <p className="mt-4 max-w-xl text-base text-ivory/90">
            The same budget buys two very different futures. Positioning decides which one a brand is paying for.
          </p>
        </Reveal>

        {/* Wide screens retain the editorial cause index beside the
            heading. The compact deck below carries the same four causes
            in a two-by-two evidence grid for smaller screens. */}
        <Reveal delay={0.12} className="hidden lg:block">
          <div data-stakes-desktop-origins="true">
            <p className="text-xs font-medium uppercase tracking-[0.15em] text-ivory/70">
              Where the weak column begins
            </p>
            <ol className="mt-3">
              {STARTS_HERE.map((item, index) => (
                <motion.li
                  key={item}
                  initial={prefersReducedMotion ? false : { opacity: 0, x: 14, filter: "blur(3px)" }}
                  animate={prefersReducedMotion ? { opacity: 1, x: 0, filter: "blur(0px)" } : undefined}
                  whileInView={prefersReducedMotion ? undefined : { opacity: 1, x: 0, filter: "blur(0px)" }}
                  viewport={{ once: true, margin: "0px 0px -10% 0px" }}
                  transition={
                    prefersReducedMotion
                      ? { duration: 0 }
                      : { duration: 0.72, delay: 0.3 + index * 0.16, ease: [0.16, 1, 0.3, 1] }
                  }
                  className="flex items-baseline gap-3 border-b border-ivory/15 py-2.5"
                >
                  <span className="font-display text-sm text-ivory/70">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <span className="text-sm text-ivory/90">{item}</span>
                </motion.li>
              ))}
            </ol>
          </div>
        </Reveal>
      </div>

      <MobileStakesDeck origins={STARTS_HERE} generic={WEAK} distinct={STRONG} />

      {/* Desktop keeps the original side-by-side focus comparison. The
          mobile deck uses one changing panel instead of stacking these
          complete cards vertically. */}
      <div
        data-stakes-desktop-comparison="true"
        className="mt-12 hidden gap-6 lg:grid lg:grid-cols-2"
      >
        <Reveal delay={0.06}>
          <div data-stakes-desktop-card="generic" className="h-full">
            <TiltCard glowColor={ELEMENT_HEX.earth} className="group h-full">
              <motion.div
                ref={focusRef}
                className="h-full rounded-2xl border-t-2 p-6 backdrop-blur-md transition-[filter] duration-500 group-hover:!filter-none sm:p-7"
                style={{
                  borderColor: ELEMENT_HEX.earth,
                  backgroundColor: "rgba(24,25,26,0.6)",
                  filter: prefersReducedMotion ? "none" : filter,
                }}
              >
                <p className="text-xs font-medium uppercase tracking-[0.15em] text-ivory/70">
                  Positioned generically
                </p>
                <ul data-stakes-list="generic" className="mt-5 space-y-3.5">
                  {WEAK.map((item, index) => (
                    <motion.li
                      key={item}
                      initial={prefersReducedMotion ? false : { opacity: 0, filter: "blur(4px)" }}
                      animate={prefersReducedMotion ? { opacity: 1, filter: "blur(0px)" } : undefined}
                      whileInView={prefersReducedMotion ? undefined : { opacity: 1, filter: "blur(0px)" }}
                      viewport={{ once: true, margin: "0px 0px -12% 0px" }}
                      transition={
                        prefersReducedMotion
                          ? { duration: 0 }
                          : { duration: 0.72, delay: 0.35 + index * 0.14 }
                      }
                      className="text-[0.95rem] leading-relaxed text-ivory/90"
                    >
                      {item}
                    </motion.li>
                  ))}
                </ul>
              </motion.div>
            </TiltCard>
          </div>
        </Reveal>

        <Reveal delay={0.14}>
          <div data-stakes-desktop-card="distinct" className="h-full">
            <TiltCard glowColor={ELEMENT_HEX.water} className="h-full">
              <div
                className="h-full rounded-2xl border-t-2 p-6 backdrop-blur-md sm:p-7"
                style={{ borderColor: ELEMENT_HEX.water, backgroundColor: "rgba(24,25,26,0.6)" }}
              >
                <p className="text-xs font-medium uppercase tracking-[0.15em] text-ivory/70">
                  Positioned distinctly
                </p>
                <ul data-stakes-list="distinct" className="mt-5 space-y-3.5">
                  {STRONG.map((item) => (
                    <li key={item} className="text-[0.95rem] leading-relaxed text-ivory/90">
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </TiltCard>
          </div>
        </Reveal>
      </div>
    </Container>
  );
}
