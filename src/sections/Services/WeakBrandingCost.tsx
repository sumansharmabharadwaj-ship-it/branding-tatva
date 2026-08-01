"use client";

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
  return (
    <Container className="max-w-3xl">
      <Reveal>
        <p className="text-sm font-medium uppercase tracking-wide text-sandstone">The stakes</p>
        <h2 className="mt-2 text-display-sm font-display font-normal text-ivory sm:text-display-md">
          What weak branding actually costs.
        </h2>
        <p className="mt-4 max-w-xl text-base text-ivory/85">
          A pattern that holds across categories, described in general terms rather than as one company&apos;s story.
        </p>
      </Reveal>
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
            <div
              className="h-full rounded-lg border-t-2 p-6 backdrop-blur-md transition-[filter] duration-500 [filter:blur(1.5px)_saturate(0.85)] group-hover:[filter:blur(0)_saturate(1)] sm:p-7"
              style={{ borderColor: ELEMENT_HEX.earth, backgroundColor: "rgba(24,25,26,0.6)" }}
            >
              <p className="text-xs font-medium uppercase tracking-[0.15em] text-ivory/55">Positioned generically</p>
              <ul className="mt-5 space-y-3.5">
                {WEAK.map((item) => (
                  <li key={item} className="text-[0.95rem] leading-relaxed text-ivory/80">
                    {item}
                  </li>
                ))}
              </ul>
            </div>
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
      <Reveal delay={0.2}>
        <p className="mt-12 text-xs font-medium uppercase tracking-wide text-ivory/50">Where it usually starts</p>
        <div className="mt-4 flex flex-wrap gap-x-8 gap-y-3">
          {STARTS_HERE.map((item) => (
            <span key={item} className="text-sm text-ivory/80">
              {item}
            </span>
          ))}
        </div>
      </Reveal>
    </Container>
  );
}
