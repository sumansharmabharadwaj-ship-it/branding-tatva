"use client";

import { useRef } from "react";
import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";
import { Container } from "@/components/Container";
import { Reveal } from "@/components/Reveal";
import { TiltCard } from "@/components/TiltCard";
import { ELEMENT_HEX } from "@/lib/sectionWash";

// Direct feedback asked for a section showing the cost of weak
// branding. Built on the safe default already offered: grounded in
// established branding theory (mental availability, distinctive
// assets, category memory — the same vocabulary this site already
// uses elsewhere), described as a general pattern rather than a
// specific company's story. No invented statistics, no named business —
// a real client comparison would need real data that does not exist
// yet, so this stays qualitative and honest about what it is.
//
// Direct feedback that hover across the page "does nothing interesting"
// — wrapped both panels in TiltCard, the same cursor-reactive tilt+glow
// mechanism already proven on every other card grid on the site (About
// credentials, Blog, Work, related-work), rather than inventing a new
// interaction pattern for this one section.
const WEAK = [
  "Competes mainly on price, since nothing else distinguishes it.",
  "Gets reintroduced to the market every time it advertises.",
  "Marketing spend replaces recognition instead of building on it.",
  "Blends into whichever category it happens to sit in.",
];

const STRONG = [
  "Commands a price built on more than the lowest bid.",
  "Gets recognized before it gets explained.",
  "Marketing spend compounds instead of starting over each time.",
  "Owns a specific position inside its category, rather than one more listing in it.",
];

// Was its own separate section, CommonMistakes — a Creative Direction
// Audit found it taught the same idea as this section (positioning
// discipline vs. positioning failure) with its own full-viewport video
// beat, directly contributing to "the page repeats branding concepts
// and is longer than necessary." Folded in here as a compact addendum
// instead of cut outright — the four real observations survive, the
// separate video/heading/section shell doesn't.
const STARTS_HERE = [
  "Identity commissioned before positioning",
  "Constant reinvention",
  "Marketing asked to fix positioning",
  "Skipping the audit",
];

export function WeakBrandingCost() {
  // Phase 2 motion direction — this section's story IS focus: a
  // generically positioned brand is out of focus; a distinctly
  // positioned one is sharp. Primary motion: as the visitor scrolls
  // the section into view, the "generic" card pulls from heavy blur
  // toward its resting soft-blur — clarity arriving with attention —
  // while the "distinct" card was never blurred at all. Scroll-linked
  // (not time-based) so the visitor's own progress performs the focus
  // pull. Bounded to one element; hover still completes the sharpen.
  const focusRef = useRef<HTMLDivElement>(null);
  const prefersReducedMotion = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: focusRef, offset: ["start 0.95", "start 0.35"] });
  const blurPx = useTransform(scrollYProgress, [0, 1], [7, 1.5]);
  const filter = useTransform(blurPx, (b) => `blur(${b}px) saturate(0.85)`);

  return (
    // Creative Director pass: this was the page's most conventional
    // composition — a narrow max-w-3xl island with dead stone field on
    // both sides at wide viewports, and the "where it starts" list as a
    // limp footnote row under the cards. Recomposed to the same
    // editorial two-column masthead its neighbors use: heading left,
    // the four origin points as a numbered hairline index filling the
    // right column (echoing the hero's own chapter index), cards full
    // width beneath.
    <Container className="max-w-5xl">
      <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,18rem)] lg:items-end lg:gap-16">
        <Reveal>
          <p className="text-sm font-medium uppercase tracking-wide text-ivory/70">The stakes</p>
          <h2 className="mt-2 text-display-sm font-display font-normal text-ivory sm:text-display-md">
            What weak branding actually costs.
          </h2>
          {/* Phase 4 persuasion pass: the old subhead described the
              section ("a pattern that holds across categories") —
              methodology talk. This one puts the reader's own money in
              the sentence. */}
          <p className="mt-4 max-w-xl text-base text-ivory/85">
            The same budget buys two very different futures. Positioning decides which one a brand is paying for.
          </p>
        </Reveal>
        <Reveal delay={0.12}>
          <p className="text-xs font-medium uppercase tracking-[0.15em] text-ivory/50">Where the weak column begins</p>
          {/* Phase 4.5 — Stakes' motion identity is focus and tension:
              the four origin points arrive one at a time, each sliding
              in from soft focus to sharp, the editorial numbering
              building as the case accumulates. Same blur vocabulary as
              the generic card below, so the whole chapter speaks one
              language. */}
          <ol className="mt-3">
            {STARTS_HERE.map((item, i) => (
              <motion.li
                key={item}
                initial={prefersReducedMotion ? undefined : { opacity: 0, x: 14, filter: "blur(3px)" }}
                whileInView={prefersReducedMotion ? undefined : { opacity: 1, x: 0, filter: "blur(0px)" }}
                viewport={{ once: true, margin: "0px 0px -10% 0px" }}
                transition={{ duration: 0.55, delay: 0.3 + i * 0.16, ease: [0.16, 1, 0.3, 1] }}
                className="flex items-baseline gap-3 border-b border-ivory/15 py-2.5"
              >
                <span className="font-display text-sm text-ivory/45">{String(i + 1).padStart(2, "0")}</span>
                <span className="text-sm text-ivory/85">{item}</span>
              </motion.li>
            ))}
          </ol>
        </Reveal>
      </div>
      <div className="mt-12 grid gap-6 sm:grid-cols-2">
        <Reveal delay={0.06}>
          {/* Metaphor, not decoration: this card starts very slightly
              soft-focused and only fully sharpens on hover — a literal
              visual echo of "blends into whichever category it happens
              to sit in," the last line in its own list. The distinct
              card (below) never blurs; it's already in focus, matching
              "gets recognized before it gets explained." Both cards
              now sit on real stone-glass reading surfaces (Phase 1) —
              the old ${"{color}"}0F fills were near-transparent over
              moving video, dissolving the list text into the footage. */}
          <TiltCard glowColor={ELEMENT_HEX.earth} className="group">
            <motion.div
              ref={focusRef}
              className="h-full rounded-lg border-t-2 p-6 backdrop-blur-md transition-[filter] duration-500 group-hover:!filter-none sm:p-7"
              style={{
                borderColor: ELEMENT_HEX.earth,
                backgroundColor: "rgba(24,25,26,0.6)",
                filter: prefersReducedMotion ? "none" : filter,
              }}
            >
              <p className="text-xs font-medium uppercase tracking-[0.15em] text-ivory/55">Positioned generically</p>
              {/* Each cost surfaces from soft focus one line at a time —
                  the psychological weight builds instead of arriving as
                  one block. The distinct card's list (below) stays
                  sharp and immediate: it was always in focus. */}
              <ul className="mt-5 space-y-3.5">
                {WEAK.map((item, wi) => (
                  <motion.li
                    key={item}
                    initial={prefersReducedMotion ? undefined : { opacity: 0, filter: "blur(4px)" }}
                    whileInView={prefersReducedMotion ? undefined : { opacity: 1, filter: "blur(0px)" }}
                    viewport={{ once: true, margin: "0px 0px -12% 0px" }}
                    transition={{ duration: 0.6, delay: 0.35 + wi * 0.14 }}
                    className="text-[0.95rem] leading-relaxed text-ivory/80"
                  >
                    {item}
                  </motion.li>
                ))}
              </ul>
            </motion.div>
          </TiltCard>
        </Reveal>
        <Reveal delay={0.14}>
          <TiltCard glowColor={ELEMENT_HEX.water}>
            <div
              className="h-full rounded-lg border-t-2 p-6 backdrop-blur-md sm:p-7"
              style={{ borderColor: ELEMENT_HEX.water, backgroundColor: "rgba(24,25,26,0.6)" }}
            >
              <p className="text-xs font-medium uppercase tracking-[0.15em] text-ivory/55">Positioned distinctly</p>
              <ul className="mt-5 space-y-3.5">
                {STRONG.map((item) => (
                  <li key={item} className="text-[0.95rem] leading-relaxed text-ivory/90">
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </TiltCard>
        </Reveal>
      </div>
    </Container>
  );
}
