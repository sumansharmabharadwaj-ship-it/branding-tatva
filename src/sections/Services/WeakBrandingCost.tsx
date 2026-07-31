"use client";

import { Container } from "@/components/Container";
import { Reveal } from "@/components/Reveal";
import { ELEMENT_HEX } from "@/lib/sectionWash";

// Direct feedback asked for a section showing the cost of weak
// branding. Built on the safe default already offered: grounded in
// established branding theory (mental availability, distinctive
// assets, category memory — the same vocabulary this site already
// uses elsewhere), described as a general pattern rather than a
// specific company's story. No invented statistics, no named business —
// a real client comparison would need real data that does not exist
// yet, so this stays qualitative and honest about what it is.
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

export function WeakBrandingCost() {
  return (
    <Container className="max-w-3xl">
      <Reveal>
        <p className="text-sm font-medium uppercase tracking-wide text-sandstone">The stakes</p>
        <h2 className="mt-2 text-display-sm font-display font-normal text-ivory">
          What weak branding actually costs.
        </h2>
        <p className="mt-4 max-w-xl text-ivory/75">
          A pattern that holds across categories, described in general terms rather than as one company&apos;s story.
        </p>
      </Reveal>
      <div className="mt-10 grid gap-6 sm:grid-cols-2">
        <Reveal delay={0.06}>
          <div
            className="h-full rounded-lg border-t-2 p-6"
            style={{ borderColor: ELEMENT_HEX.earth, backgroundColor: `${ELEMENT_HEX.earth}0F` }}
          >
            <p className="text-xs font-medium uppercase tracking-wide text-ivory/50">Positioned generically</p>
            <ul className="mt-4 space-y-3">
              {WEAK.map((item) => (
                <li key={item} className="text-sm text-ivory/75">
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </Reveal>
        <Reveal delay={0.14}>
          <div
            className="h-full rounded-lg border-t-2 p-6"
            style={{ borderColor: ELEMENT_HEX.water, backgroundColor: `${ELEMENT_HEX.water}0F` }}
          >
            <p className="text-xs font-medium uppercase tracking-wide text-ivory/50">Positioned distinctly</p>
            <ul className="mt-4 space-y-3">
              {STRONG.map((item) => (
                <li key={item} className="text-sm text-ivory/85">
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </Reveal>
      </div>
    </Container>
  );
}
