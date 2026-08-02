import Link from "next/link";
import { Container } from "@/components/Container";
import { Reveal } from "@/components/Reveal";
import { projects } from "@/data/projects";

// About redesign, the evidence chapter — for each selected case: the
// original ambiguity, the decision made, the observed result. Every
// line is drawn from that project's own recorded challenge, strategy,
// and outcome in data/projects.ts; the sentences chosen here compress
// rather than embellish, per the verified outcomes rule.
const CASES = [
  {
    slug: "dr-haley-nutrition",
    ambiguity: "More posts kept going out while fewer people stayed. Volume and trust were pulling in opposite directions.",
    decision: "Post less, make every post earn its place, and let relevance rather than cadence carry the account.",
    result: "104% more followers earned per post, a 1,350% jump in comments per post, engagement rate from 0.71% to 2.81%.",
  },
  {
    slug: "myshopineurope",
    ambiguity: "A new marketplace risked reading as generic access to cheap supply, with nothing separating it from the next listings site.",
    decision: "Position around craft heritage and origin instead of price, and sell the story a buyer can pass on.",
    result: "A complete brand foundation and a year long content operating system, each quarter tied to a specific business outcome.",
  },
  {
    slug: "herbalcart",
    ambiguity: "Buyers saw a herbal remedy brand while the shelves held whey protein and pre workout. The perception gap was eroding trust.",
    decision: "Reset the argument: supplementation fills a practical, explainable gap, told in the category's own native content style.",
    result: "A full campaign reset with five formats ready to shoot, moving perception toward a modern, supplement first wellness brand.",
  },
] as const;

export function Evidence() {
  return (
    <Container className="max-w-6xl">
      <Reveal>
        <p className="text-sm font-medium uppercase tracking-wide text-sandstone">Evidence</p>
        <h2 className="mt-2 max-w-2xl text-display-sm font-display font-normal text-ivory">
          Ambiguity, decision, result. Three times on record.
        </h2>
      </Reveal>
      <div className="mt-12 space-y-14">
        {CASES.map((c, i) => {
          const project = projects.find((p) => p.slug === c.slug);
          if (!project) return null;
          return (
            <Reveal key={c.slug} delay={i * 0.07}>
              <div className="border-t border-ivory/15 pt-8">
                <div className="flex flex-wrap items-baseline gap-x-4 gap-y-1">
                  <Link
                    href={`/work/${project.slug}`}
                    className="font-display text-2xl font-normal text-ivory transition-colors duration-300 hover:text-sandstone"
                  >
                    {project.title}
                  </Link>
                  <p className="text-xs font-medium uppercase tracking-[0.15em] text-ivory/50">{project.industry}</p>
                </div>
                <div className="mt-6 grid gap-6 lg:grid-cols-3 lg:gap-10">
                  {(
                    [
                      ["The ambiguity", c.ambiguity],
                      ["The decision", c.decision],
                      ["The observed result", c.result],
                    ] as const
                  ).map(([label, text]) => (
                    <div key={label}>
                      <p className="text-xs font-medium uppercase tracking-[0.18em] text-sandstone">{label}</p>
                      <p className="mt-2 text-sm leading-relaxed text-ivory/88">{text}</p>
                    </div>
                  ))}
                </div>
              </div>
            </Reveal>
          );
        })}
      </div>
    </Container>
  );
}
