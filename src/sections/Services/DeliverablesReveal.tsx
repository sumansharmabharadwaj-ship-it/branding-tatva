"use client";

import { Container } from "@/components/Container";
import { Reveal } from "@/components/Reveal";
import { packages } from "@/data/services";

// Direct feedback that the original flat 14-item two-column checklist
// read as a plain SaaS features list, no hierarchy, no sense of which
// deliverable belonged to which real commitment. Regrouped by the same
// three real packages PackageSelector shows above, one card per
// package, each showing only what that tier actually *adds* (Full
// Brand System's own "Everything in Foundation" cross-reference line
// is a summary, not a 15th deliverable, so it's filtered here same as
// before) — a reader can now see the real cumulative shape of the
// offer instead of one undifferentiated block of checkmarks. Each
// card's own package color anchors it, the same visual language
// PackageSelector already uses, so this reads as a continuation of the
// choice above rather than a disconnected list.

export function DeliverablesReveal() {
  return (
    <Container className="max-w-5xl">
      <Reveal>
        <p className="text-sm font-medium uppercase tracking-wide text-sandstone">What you receive</p>
        <h2 className="mt-2 text-display-sm font-display font-normal text-ivory">
          What you actually leave with.
        </h2>
        <p className="mt-4 max-w-xl text-ivory/85">
          Every item below is pulled directly from the three packages above. Nothing generic, nothing invented.
        </p>
      </Reveal>
      <div className="mt-10 grid gap-6 sm:grid-cols-3">
        {packages.map((pkg, pi) => {
          const items = pkg.includes.filter((item) => !item.startsWith("Everything in"));
          return (
            <Reveal key={pkg.slug} delay={pi * 0.08}>
              <div
                className="h-full rounded-xl border-t-2 bg-ivory/[0.03] p-6"
                style={{ borderColor: pkg.color }}
              >
                <p className="text-xs font-medium uppercase tracking-wide text-ivory/60">{pkg.name}</p>
                <ul className="mt-4 space-y-2.5">
                  {items.map((item) => (
                    <li key={item} className="flex items-start gap-2.5 text-sm text-ivory/85">
                      <span aria-hidden="true" className="mt-0.5 shrink-0" style={{ color: pkg.color }}>
                        &#10003;
                      </span>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </Reveal>
          );
        })}
      </div>
    </Container>
  );
}
