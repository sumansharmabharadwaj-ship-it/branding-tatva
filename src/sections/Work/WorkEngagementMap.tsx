import { Container } from "@/components/Container";
import { Reveal } from "@/components/Reveal";

const STAGES = [
  {
    number: "01",
    title: "Question",
    text: "Name the real decision, the business context, and what the current brand is making harder than it should be.",
    decision: "A precise problem and a bounded scope",
  },
  {
    number: "02",
    title: "Decode",
    text: "Audit the category, audience, existing material, and the gap between intended meaning and actual perception.",
    decision: "What must change—and what should stay",
  },
  {
    number: "03",
    title: "Architect",
    text: "Define the position, narrative, verbal system, experience logic, and the rules that keep them connected.",
    decision: "A direction the team can use",
  },
  {
    number: "04",
    title: "Signal",
    text: "Carry the strategy into the selected website, content, campaign, or identity-direction deliverables.",
    decision: "A coherent system in the world",
  },
  {
    number: "05",
    title: "Learn",
    text: "Review response and use only the evidence the engagement can genuinely observe; no universal promise is attached.",
    decision: "The next decision, grounded in signals",
  },
] as const;

export function WorkEngagementMap() {
  return (
    <Container className="mt-16 border-t border-border pt-14 sm:mt-20 sm:pt-16">
      <Reveal>
        <p className="text-sm font-medium uppercase tracking-wide text-action-secondary">Process + responsibilities</p>
        <h2 className="mt-2 max-w-2xl text-display-sm font-display font-normal text-soil">
          A project moves through decisions, not theatre.
        </h2>
        <p className="mt-4 max-w-2xl text-foreground-secondary">
          The sequence stays consistent; the duration and deliverables change with the actual problem.
        </p>
      </Reveal>

      <div className="mt-10 grid gap-px overflow-hidden rounded-2xl border border-border bg-border lg:grid-cols-5">
        {STAGES.map((stage, index) => (
          <Reveal key={stage.number} delay={index * 0.05} className="h-full bg-background-elevated p-5 sm:p-6">
            <article className="h-full">
              <p className="text-xs font-medium uppercase tracking-[0.16em] text-foreground-secondary">{stage.number}</p>
              <h3 className="mt-4 font-display text-xl font-normal text-soil">{stage.title}</h3>
              <p className="mt-3 text-sm leading-relaxed text-foreground-secondary">{stage.text}</p>
              <p className="mt-5 border-t border-border pt-4 text-xs font-medium uppercase tracking-[0.12em] text-action-secondary">
                Decision
              </p>
              <p className="mt-2 text-sm text-soil/80">{stage.decision}</p>
            </article>
          </Reveal>
        ))}
      </div>

      <div className="mt-10 grid gap-5 md:grid-cols-3">
        <Reveal className="rounded-xl border border-border bg-background-elevated p-6">
          <p className="text-xs font-medium uppercase tracking-[0.15em] text-action-secondary">You bring</p>
          <p className="mt-3 text-sm text-foreground-secondary">Context, access to existing material, timely decisions, and honest constraints.</p>
        </Reveal>
        <Reveal delay={0.06} className="rounded-xl border border-border bg-background-elevated p-6">
          <p className="text-xs font-medium uppercase tracking-[0.15em] text-action-secondary">Suman leads</p>
          <p className="mt-3 text-sm text-foreground-secondary">Diagnosis, strategy, production within scope, documentation, and direct communication.</p>
        </Reveal>
        <Reveal delay={0.12} className="rounded-xl border border-border bg-background-elevated p-6">
          <p className="text-xs font-medium uppercase tracking-[0.15em] text-action-secondary">Together</p>
          <p className="mt-3 text-sm text-foreground-secondary">Approve trade-offs, keep the decision log current, and agree on what the evidence can support.</p>
        </Reveal>
      </div>
    </Container>
  );
}
