"use client";

import { Container } from "@/components/Container";
import { Reveal } from "@/components/Reveal";

// Direct feedback asked for a section answering "why is this different
// from an agency" with real authority, not another paragraph explaining
// the theory. Four real, opinionated observations grounded in the
// branding vocabulary already established across this site (positioning,
// mental availability, verbal identity) rather than invented case data
// or a specific company's story. Sits right after Education, extending
// the same "why some brands look different" teaching before Trust picks
// up the founder's own credibility.
const MISTAKES = [
  {
    title: "Identity before positioning",
    detail:
      "A logo gets commissioned before anyone agrees on what the brand actually stands for. Visual identity should follow positioning, rather than replace it.",
  },
  {
    title: "Constant reinvention",
    detail:
      "Consistency compounds recall over time. A brand that changes its look every season resets that compounding, again and again.",
  },
  {
    title: "Marketing asked to fix positioning",
    detail:
      "Marketing amplifies whatever position already exists. Ask it to cover for a weak one instead, and the gap just gets louder.",
  },
  {
    title: "Skipping the audit",
    detail:
      "Most rebuilds start from a blank page instead of an honest read of where the brand already stands. That audit is the step skipped most often, and the first thing that shows.",
  },
] as const;

export function CommonMistakes() {
  return (
    <Container className="max-w-3xl">
      <Reveal>
        <p className="text-sm font-medium uppercase tracking-wide text-sandstone">Perspective</p>
        <h2 className="mt-2 text-display-sm font-display font-normal text-ivory">
          Where branding actually goes wrong.
        </h2>
      </Reveal>
      <div className="mt-12 grid gap-x-12 gap-y-10 sm:grid-cols-2">
        {MISTAKES.map((m, i) => (
          <Reveal key={m.title} delay={i * 0.08}>
            {/* A tilt/glow card would fight this section's own editorial
                ghost-numeral language (the same index-list style
                DesignRationaleGrid uses) — instead a quiet, CSS-only
                hover: the numeral brightens and the whole row nudges
                right, reading as "this row responded to you" without
                borrowing the product-card treatment used elsewhere. */}
            <div className="group relative cursor-default border-t border-ivory/15 pt-6 transition-[border-color] duration-300 hover:border-sandstone/50">
              <span className="font-display text-5xl font-normal leading-none text-ivory/15 transition-colors duration-300 group-hover:text-sandstone/40 sm:text-6xl">
                {String(i + 1).padStart(2, "0")}
              </span>
              <p className="mt-4 font-display text-lg font-normal text-ivory transition-transform duration-300 group-hover:translate-x-1">
                {m.title}
              </p>
              <p className="mt-2 text-sm text-ivory/85 transition-transform duration-300 group-hover:translate-x-1">
                {m.detail}
              </p>
            </div>
          </Reveal>
        ))}
      </div>
    </Container>
  );
}
