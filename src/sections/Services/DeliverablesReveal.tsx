"use client";

import { Container } from "@/components/Container";
import { Reveal } from "@/components/Reveal";
import { packages } from "@/data/services";

// Direct feedback asked for a section that makes the deliverables feel
// tangible rather than abstract. Every item here is computed straight
// from the same three real packages PackageSelector shows above, not a
// separately-maintained list that could drift out of sync or invent a
// deliverable that doesn't actually exist. "Everything in Foundation"
// is a cross-reference line inside services.ts, not a deliverable of
// its own, so it's filtered out rather than shown as a 15th item.
const ALL_ITEMS = Array.from(
  new Set(packages.flatMap((p) => p.includes).filter((item) => !item.startsWith("Everything in")))
);

export function DeliverablesReveal() {
  return (
    <Container className="max-w-3xl">
      <Reveal>
        <p className="text-sm font-medium uppercase tracking-wide text-sandstone">What you receive</p>
        <h2 className="mt-2 text-display-sm font-display font-normal text-ivory">
          What you actually leave with.
        </h2>
        <p className="mt-4 max-w-xl text-ivory/75">
          Every item below is pulled directly from the three packages above. Nothing generic, nothing invented.
        </p>
      </Reveal>
      <ul className="mt-10 grid gap-x-8 gap-y-3 sm:grid-cols-2">
        {ALL_ITEMS.map((item, i) => (
          <Reveal key={item} delay={Math.min(i, 12) * 0.04}>
            <li className="flex items-start gap-3 text-sm text-ivory/85">
              <span aria-hidden="true" className="mt-0.5 text-sandstone">
                &#10003;
              </span>
              {item}
            </li>
          </Reveal>
        ))}
      </ul>
    </Container>
  );
}
