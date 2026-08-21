"use client";

import { Container } from "@/components/Container";
import { Reveal } from "@/components/Reveal";
import { packages } from "@/data/services";

// Direct feedback asked for a section that makes the deliverables feel
// tangible rather than abstract. Every item here is computed straight
// from the same three starting paths PackageSelector shows above, not a
// separately-maintained list that could drift out of sync or invent a
// deliverable that doesn't actually exist. "Everything in Foundation"
// is a cross-reference line inside services.ts, not a deliverable of
// its own, so it's filtered out rather than shown as a 15th item.
const ALL_ITEMS = Array.from(
  new Set(packages.flatMap((p) => p.includes).filter((item) => !item.startsWith("Everything in")))
);

export function DeliverablesReveal({ dark = true }: { dark?: boolean }) {
  return (
    <Container className="max-w-3xl">
      <Reveal>
        <p className={`text-sm font-medium uppercase tracking-wide ${dark ? "text-sandstone" : "text-action-secondary"}`}>What you receive</p>
        <h2 className={`mt-2 text-display-sm font-display font-normal ${dark ? "text-ivory" : "text-soil"}`}>
          What you actually leave with.
        </h2>
        <p className={`mt-4 max-w-xl ${dark ? "text-ivory/85" : "text-foreground-secondary"}`}>
          Every item below is pulled directly from the three starting paths above. Final scope is confirmed after the audit.
        </p>
      </Reveal>
      <ul className="mt-10 grid gap-x-8 gap-y-1 sm:grid-cols-2">
        {ALL_ITEMS.map((item, i) => (
          <Reveal key={item} delay={Math.min(i, 12) * 0.04}>
            {/* Real hover feedback on a real checklist — the check mark
                fills in and the row picks up a quiet tint, so each
                deliverable reads as something you can point at rather
                than a static bullet. */}
            <li
              className={`group flex cursor-default items-start gap-3 rounded-md px-2 py-1.5 text-sm transition-colors duration-200 ${
                dark ? "text-ivory/85 hover:bg-ivory/5" : "text-foreground-secondary hover:bg-soil/5"
              }`}
            >
              <span
                aria-hidden="true"
                className={`mt-0.5 transition-colors duration-200 ${
                  dark ? "text-sandstone/60 group-hover:text-sandstone" : "text-action-secondary/65 group-hover:text-action-secondary"
                }`}
              >
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
