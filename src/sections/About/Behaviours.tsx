import { Container } from "@/components/Container";
import { Reveal } from "@/components/Reveal";

// About redesign, behaviours instead of values — the brief's own four,
// each one observable in how this practice already works rather than
// aspirational language.
const BEHAVIOURS = [
  "Say less when proof is absent.",
  "Challenge the category before decorating it.",
  "Explain every recommendation.",
  "Protect recognition from constant reinvention.",
] as const;

export function Behaviours() {
  return (
    <Container className="max-w-5xl">
      <Reveal>
        <p className="text-sm font-medium uppercase tracking-wide text-sandstone">Behaviours</p>
        <h2 className="mt-2 max-w-xl text-display-sm font-display font-normal text-ivory">
          Values are claims. These are habits.
        </h2>
      </Reveal>
      <div className="mt-10 grid gap-x-10 gap-y-6 sm:grid-cols-2">
        {BEHAVIOURS.map((line, i) => (
          <Reveal key={line} delay={i * 0.07}>
            <p className="border-l-2 border-sandstone/50 pl-5 font-display text-xl font-normal leading-snug text-ivory sm:text-2xl">
              {line}
            </p>
          </Reveal>
        ))}
      </div>
    </Container>
  );
}
