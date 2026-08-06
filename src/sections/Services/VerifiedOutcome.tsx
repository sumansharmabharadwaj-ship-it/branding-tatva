import { Container } from "@/components/Container";
import { Reveal } from "@/components/Reveal";
import { LinkButton } from "@/components/Button";
import { AnimatedStat } from "@/components/AnimatedStat";
import { projects } from "@/data/projects";

// Conversion architecture, Services chapter four: proof directly after
// the packages instead of waiting for the Work page. Every number
// renders from the verified stats already recorded in data/projects.ts
// for the Dr. Haley Nutrition engagement — the commercial honesty rule
// means this section can only ever show what that data file contains.
//
// Continuity pass: recomposed from a centered heading over a four
// column stat grid (another repeat of the same template) into an
// editorial split — one oversized lead number carrying the section on
// the left, the remaining evidence stacked as quiet ledger rows on the
// right. The lead stat is the engagement climb the hero already
// promised, closed here as delivered.
export function VerifiedOutcome() {
  const proof = projects.find((p) => p.slug === "dr-haley-nutrition");
  if (!proof?.stats) return null;
  // Proof allocation (WORK_SERVICES_CONVERSION_PLAN.md §1): Services
  // shows THE DECISION and one stat; the full four stat narrative
  // lives only on the Work page's signature chapter.
  const lead = proof.stats.find((s) => s.value === "104%") ?? proof.stats[0];
  return (
    <Container className="max-w-6xl">
      <Reveal>
        <p className="text-sm font-medium uppercase tracking-wide text-sandstone">Verified outcome</p>
        <h2 className="mt-2 max-w-2xl text-display-sm font-display font-normal text-ivory">
          {proof.title}: eight weeks of exactly this work.
        </h2>
      </Reveal>
      <div className="mt-12 grid items-end gap-12 lg:grid-cols-[minmax(0,1.1fr)_1fr] lg:gap-20">
        <Reveal>
          <p className="font-display text-[clamp(4.5rem,11vw,9rem)] font-normal leading-none text-sandstone">
            <AnimatedStat value={lead.value} />
          </p>
          <p className="mt-3 max-w-sm text-base leading-relaxed text-ivory/90">{lead.label}</p>
          <p className="mt-5 max-w-md text-sm leading-relaxed text-ivory/70">{proof.hook}</p>
        </Reveal>
        <div>
          <Reveal>
            <p className="text-xs font-medium uppercase tracking-[0.18em] text-sandstone">The decision</p>
            <p className="mt-3 max-w-xl text-base leading-relaxed text-ivory/90">{proof.strategy}</p>
          </Reveal>
          <Reveal delay={0.15}>
            <div className="mt-8 flex flex-wrap gap-3 border-t border-ivory/15 pt-6">
              <LinkButton href={`/work/${proof.slug}`}>See the full decision trail</LinkButton>
              <LinkButton href="/work" variant="secondary" className="border-ivory/30 text-ivory hover:bg-ivory/10">
                Explore the Work
              </LinkButton>
            </div>
          </Reveal>
        </div>
      </div>
    </Container>
  );
}
