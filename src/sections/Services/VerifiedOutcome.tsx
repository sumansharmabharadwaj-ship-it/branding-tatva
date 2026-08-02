import { Container } from "@/components/Container";
import { Reveal } from "@/components/Reveal";
import { LinkButton } from "@/components/Button";
import { projects } from "@/data/projects";

// Conversion architecture, Services chapter four: proof arrives right
// after the packages instead of waiting for the Work page. Every
// number renders from the verified stats already recorded in
// data/projects.ts for the Dr. Haley Nutrition engagement — the
// commercial honesty rule means this section can only ever show what
// that data file contains.
export function VerifiedOutcome() {
  const proof = projects.find((p) => p.slug === "dr-haley-nutrition");
  if (!proof?.stats) return null;
  return (
    <Container className="max-w-5xl">
      <Reveal>
        <p className="text-sm font-medium uppercase tracking-wide text-sandstone">Verified outcome</p>
        <h2 className="mt-2 max-w-2xl text-display-sm font-display font-normal text-ivory">
          {proof.title}: eight weeks of exactly this work.
        </h2>
        <p className="mt-4 max-w-2xl text-base leading-relaxed text-ivory/90">{proof.hook}</p>
      </Reveal>
      <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {proof.stats.map((stat, i) => (
          <Reveal key={stat.label} delay={i * 0.08}>
            <div className="border-t border-ivory/15 pt-4">
              <p className="font-display text-3xl font-normal text-sandstone sm:text-4xl">{stat.value}</p>
              <p className="mt-1.5 text-sm leading-relaxed text-ivory/80">{stat.label}</p>
            </div>
          </Reveal>
        ))}
      </div>
      <Reveal delay={0.1}>
        <div className="mt-10 flex flex-wrap gap-3">
          <LinkButton href={`/work/${proof.slug}`}>Read the full case study</LinkButton>
          <LinkButton href="/work" variant="secondary" className="border-ivory/30 text-ivory hover:bg-ivory/10">
            Explore the Work
          </LinkButton>
        </div>
      </Reveal>
    </Container>
  );
}
