import Link from "next/link";
import { Container } from "@/components/Container";
import { Reveal } from "@/components/Reveal";
import { packages } from "@/data/services";

// Conversion architecture, Home section five: a compact commercial map
// of the three real service paths before the framework teaches the
// philosophy. Every line comes from data/services.ts — who each path
// suits is the package's own real forWho field, never new marketing
// copy. One contextual CTA per row.
const PATHS = [
  { title: "Build the foundation", decision: "The decision it resolves: what this brand stands for, before anything is designed.", slug: "brand-beginning" },
  { title: "Reposition an existing brand", decision: "The decision it resolves: which single position the brand owns, out of everything it could say.", slug: "brand-clarity" },
  { title: "Create ongoing consistency", decision: "The decision it resolves: who keeps the system coherent as more goes out into the world.", slug: "brand-partnership" },
] as const;

export function ServicePaths() {
  return (
    <section className="bg-soil py-16 sm:py-24">
      <Container className="max-w-5xl">
        <Reveal>
          <p className="text-sm font-medium uppercase tracking-wide text-sandstone">Three paths</p>
          <h2 className="mt-2 max-w-2xl text-display-sm font-display font-normal text-ivory">
            The work meets the business wherever it stands.
          </h2>
        </Reveal>
        <div className="mt-10 space-y-0">
          {PATHS.map((path, i) => {
            const pkg = packages.find((p) => p.slug === path.slug);
            return (
              <Reveal key={path.slug} delay={i * 0.08}>
                <div className="grid gap-3 border-t border-ivory/12 py-7 lg:grid-cols-[minmax(0,16rem)_1fr_auto] lg:items-baseline lg:gap-10">
                  <h3 className="font-display text-xl font-normal text-ivory sm:text-2xl">{path.title}</h3>
                  <div>
                    <p className="text-sm leading-relaxed text-ivory/85">{pkg?.forWho}</p>
                    <p className="mt-1.5 text-sm leading-relaxed text-ivory/60">{path.decision}</p>
                  </div>
                  <Link
                    href="/services"
                    className="inline-flex items-center gap-2 text-sm font-medium text-sandstone underline decoration-sandstone/40 underline-offset-4 transition-colors hover:text-ivory"
                  >
                    {pkg?.name}
                    <span aria-hidden="true">→</span>
                  </Link>
                </div>
              </Reveal>
            );
          })}
          <div className="h-px bg-ivory/12" aria-hidden="true" />
        </div>
      </Container>
    </section>
  );
}
