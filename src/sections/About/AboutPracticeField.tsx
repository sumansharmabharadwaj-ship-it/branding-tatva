import { Container } from "@/components/Container";
import { Reveal } from "@/components/Reveal";
import { LinkButton } from "@/components/Button";

const PRACTICE_PATH = [
  {
    label: "01 · Learn to observe",
    title: "Psychology and literature",
    text: "Training in psychology sharpened how I observe perception and decisions. Literature trained the other half: how language carries meaning, tension, and memory.",
  },
  {
    label: "02 · Work inside the system",
    title: "Content, campaigns, and teams",
    text: "Roles across content and marketing made the theory practical: briefs change, channels behave differently, and a strong idea still needs a system that can survive delivery.",
  },
  {
    label: "03 · Build the practice",
    title: "Branding Tatva now",
    text: "Today the practice brings diagnosis, positioning, language, content, and digital delivery into one founder-led relationship instead of separating the thinking from the work.",
  },
] as const;

const WORKING_RULES = [
  ["Truth over theatre", "Unsupported figures stay unpublished, even when a larger number would make a louder headline."],
  ["Clarity over clutter", "A project begins with the decision that needs to become clear, before deliverables are allowed to multiply."],
  ["Proof over posturing", "Every project file states the role, scope, delivery, and the boundary of the evidence currently available."],
  ["Care without vagueness", "Questions, ownership, revisions, and next steps are made explicit so thoughtfulness never becomes ambiguity."],
] as const;

const FIT = {
  good: [
    "There is a real positioning, perception, or consistency decision to make.",
    "The people responsible for the brand can share context and make decisions.",
    "You want the strategy carried into language, content, or the digital experience.",
  ],
  notYet: [
    "You only need a logo execution with no strategy or verbal work.",
    "You need a guaranteed commercial outcome before the evidence exists.",
    "You want an anonymous hand-off rather than direct founder involvement.",
  ],
} as const;

export function AboutPracticeField() {
  return (
    <>
      <section id="practice" className="scroll-mt-24 bg-background-alt py-20 sm:py-28">
        <Container>
          <Reveal>
            <p className="text-sm font-medium uppercase tracking-wide text-action-secondary">How the practice took shape</p>
            <h2 className="mt-2 max-w-2xl text-display-sm font-display font-normal text-soil">
              Not a mythology. A sequence of disciplines that learned to work together.
            </h2>
          </Reveal>
          <div className="mt-12 grid gap-px overflow-hidden rounded-2xl border border-border bg-border lg:grid-cols-3">
            {PRACTICE_PATH.map((step, index) => (
              <Reveal key={step.label} delay={index * 0.08} className="h-full bg-background-elevated p-6 sm:p-8">
                <p className="text-xs font-medium uppercase tracking-[0.16em] text-foreground-secondary">{step.label}</p>
                <h3 className="mt-4 font-display text-xl font-normal text-soil">{step.title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-foreground-secondary">{step.text}</p>
              </Reveal>
            ))}
          </div>

          <div className="mt-14 grid gap-8 border-t border-border pt-10 md:grid-cols-[0.8fr_1.2fr] md:gap-16">
            <Reveal>
              <p className="text-sm font-medium uppercase tracking-wide text-action-secondary">How engagement feels</p>
              <h2 className="mt-2 text-display-sm font-display font-normal text-soil">Direct, bounded, and decision-led.</h2>
            </Reveal>
            <Reveal delay={0.08}>
              <p className="text-foreground-secondary">
                You work directly with Suman from diagnosis through delivery. The project stays organised around decisions,
                agreed responsibilities, and a visible evidence boundary—so collaboration can be thoughtful without becoming slow or unclear.
              </p>
              <p className="mt-4 text-sm text-foreground-secondary">
                Cadence, approvals, revision boundaries, and final ownership are confirmed in the scope before work begins.
              </p>
            </Reveal>
          </div>
        </Container>
      </section>

      <section id="fit" className="scroll-mt-24 bg-soil py-20 sm:py-28">
        <Container>
          <Reveal>
            <p className="text-sm font-medium uppercase tracking-wide text-sandstone">Values in practice</p>
            <h2 className="mt-2 max-w-2xl text-display-sm font-display font-normal text-ivory">
              Standards are only useful when they change a decision.
            </h2>
          </Reveal>
          <div className="mt-10 grid gap-5 sm:grid-cols-2">
            {WORKING_RULES.map(([title, text], index) => (
              <Reveal key={title} delay={index * 0.06} className="rounded-xl border border-ivory/15 p-6">
                <h3 className="font-display text-lg font-normal text-ivory">{title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-ivory/75">{text}</p>
              </Reveal>
            ))}
          </div>

          <div className="mt-14 grid gap-8 border-t border-ivory/15 pt-10 md:grid-cols-2 md:gap-12">
            <Reveal>
              <p className="text-xs font-medium uppercase tracking-[0.16em] text-sandstone">A useful fit when</p>
              <ul className="mt-5 space-y-3">
                {FIT.good.map((item) => (
                  <li key={item} className="border-l-2 border-sandstone/60 pl-4 text-sm text-ivory/80">{item}</li>
                ))}
              </ul>
            </Reveal>
            <Reveal delay={0.08}>
              <p className="text-xs font-medium uppercase tracking-[0.16em] text-ivory/55">Probably not yet when</p>
              <ul className="mt-5 space-y-3">
                {FIT.notYet.map((item) => (
                  <li key={item} className="border-l-2 border-ivory/20 pl-4 text-sm text-ivory/70">{item}</li>
                ))}
              </ul>
            </Reveal>
          </div>

          <Reveal delay={0.14} className="mt-14 rounded-2xl border border-ivory/15 bg-ivory/[0.04] p-6 sm:p-8">
            <p className="font-display text-2xl font-normal text-ivory">Bring the version that exists now.</p>
            <p className="mt-3 max-w-2xl text-ivory/75">
              Share what feels unclear, what decision is blocked, and whatever material already exists. Your enquiry goes directly to Suman and is used only to understand and answer the project context.
            </p>
            <div className="mt-6">
              <LinkButton href="/contact">Discuss the real question</LinkButton>
            </div>
          </Reveal>
        </Container>
      </section>
    </>
  );
}
