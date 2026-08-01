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

// `light` — Phase 1's editorial-light chapter break: this section moved
// off dark video onto the site's parchment ground, and the cards read
// as what the deliverables actually are — printed documents. Real paper
// surfaces (near-white fill, a hairline rule under the package name, a
// soft shadow lifting each sheet off the parchment), dark confident
// type. The dark variant is kept intact for any future dark-ground
// caller rather than deleted.
export function DeliverablesReveal({ light = false }: { light?: boolean }) {
  return (
    <Container className="max-w-5xl">
      <Reveal>
        <p className={`text-sm font-medium uppercase tracking-wide ${light ? "text-action-secondary" : "text-sandstone"}`}>
          What you receive
        </p>
        <h2 className={`mt-2 text-display-sm font-display font-normal sm:text-display-md ${light ? "text-soil" : "text-ivory"}`}>
          What you actually leave with.
        </h2>
        <p className={`mt-4 max-w-xl text-base ${light ? "text-foreground-secondary" : "text-ivory/85"}`}>
          Every item below is pulled directly from the three packages above. Nothing generic, nothing invented.
        </p>
      </Reveal>
      <div className="mt-12 grid gap-6 sm:grid-cols-3">
        {packages.map((pkg, pi) => {
          const items = pkg.includes.filter((item) => !item.startsWith("Everything in"));
          return (
            <Reveal key={pkg.slug} delay={pi * 0.08}>
              <div
                className={
                  light
                    ? "h-full rounded-lg border-t-2 bg-[#FBF8F2] p-7 shadow-[0_2px_16px_rgba(39,34,30,0.08)]"
                    : "h-full rounded-xl border-t-2 bg-ivory/[0.03] p-6"
                }
                style={{ borderColor: pkg.color }}
              >
                <p className={`text-xs font-medium uppercase tracking-[0.15em] ${light ? "text-soil/60" : "text-ivory/60"}`}>
                  {pkg.name}
                </p>
                {light && <div className="mt-3 h-px bg-soil/10" aria-hidden="true" />}
                <ul className="mt-4 space-y-3">
                  {items.map((item) => (
                    <li
                      key={item}
                      className={`flex items-start gap-2.5 ${light ? "text-[0.95rem] text-soil/85" : "text-sm text-ivory/85"}`}
                    >
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
