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
      {/* Was four display lines on bare soil with a border rule and
          nothing else on the whole section. spotlight-grid is pure CSS
          (a :has() sibling selector, no JS, so this stays a server
          component): resting on one habit dims the other three, which
          is the only way four equal statements stop reading as a list. */}
      <div className="spotlight-grid mt-10 grid gap-x-8 gap-y-4 sm:grid-cols-2">
        {BEHAVIOURS.map((line, i) => (
          <Reveal key={line} delay={i * 0.07}>
            <div className="spotlight-card group h-full rounded-2xl border border-ivory/10 p-6 transition-colors duration-500 hover:border-sandstone/45 hover:bg-ivory/[0.04]">
              <span className="font-display text-sm text-ivory/35" aria-hidden="true">
                {String(i + 1).padStart(2, "0")}
              </span>
              <p className="mt-3 font-display text-xl font-normal leading-snug text-ivory sm:text-2xl">{line}</p>
              <span
                aria-hidden="true"
                className="mt-5 block h-px w-8 origin-left bg-sandstone/70 transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-x-[5]"
              />
            </div>
          </Reveal>
        ))}
      </div>
    </Container>
  );
}
