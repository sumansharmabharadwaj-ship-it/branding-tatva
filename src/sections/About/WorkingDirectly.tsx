import { Container } from "@/components/Container";
import { Reveal } from "@/components/Reveal";

// About redesign, "working directly together" — the five real terms of
// engagement the brief names: direct founder access, documented
// decisions, explained feedback, clear implementation boundaries, and
// strategy before expression. Stated as commitments a client can hold
// the practice to, never as values language.
const TERMS = [
  {
    title: "Direct access",
    detail: "You work with the founder from the first call to the final file. Zero handoffs, zero account managers.",
  },
  {
    title: "Documented decisions",
    detail: "Every decision gets written down with its reasoning attached, so the logic survives the project.",
  },
  {
    title: "Explained feedback",
    detail: "Feedback arrives with a why. A verdict without reasoning teaches nobody anything.",
  },
  {
    title: "Honest boundaries",
    detail: "What this practice builds gets said up front, and where a project needs a specialist, that gets said too.",
  },
  {
    title: "Strategy before expression",
    detail: "Positioning gets decided before anything is designed. Every visual choice inherits that decision.",
  },
] as const;

export function WorkingDirectly() {
  return (
    <Container className="max-w-6xl">
      <div className="grid gap-10 lg:grid-cols-[minmax(0,20rem)_1fr] lg:gap-20">
        <Reveal className="lg:sticky lg:top-28 lg:self-start">
          <p className="text-sm font-medium uppercase tracking-wide text-sandstone">Working directly</p>
          <h2 className="mt-2 text-display-sm font-display font-normal text-ivory">
            The terms this practice actually works by.
          </h2>
        </Reveal>
        <div className="spotlight-grid">
          {TERMS.map((term, i) => (
            <Reveal key={term.title} delay={i * 0.06}>
              <div className="spotlight-card grid gap-2 rounded-2xl border-t border-ivory/15 px-4 py-6 transition-colors duration-500 hover:bg-ivory/[0.04] sm:grid-cols-[minmax(0,14rem)_1fr] sm:gap-8">
                <p className="flex items-baseline gap-3 font-display text-xl font-normal text-ivory">
                  <span className="text-sm text-ivory/40" aria-hidden="true">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  {term.title}
                </p>
                <p className="text-sm leading-relaxed text-ivory/85 sm:pt-1">{term.detail}</p>
              </div>
            </Reveal>
          ))}
          <div className="h-px bg-ivory/15" aria-hidden="true" />
        </div>
      </div>
    </Container>
  );
}
