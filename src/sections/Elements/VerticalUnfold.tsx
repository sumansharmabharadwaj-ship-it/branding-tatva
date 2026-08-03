import { Container } from "@/components/Container";
import { ElementReveal } from "@/components/ElementReveal";
import { ElementRowBackground } from "@/components/ElementRowBackground";
import { ElementGlyph } from "@/components/ElementGlyph";
import { ElementsRail } from "@/components/ElementsRail";
import type { Element } from "@/data/elements";

const TRANSFORMATIONS = {
  earth: {
    verb: "Anchor",
    before: "Assumptions pulling in different directions",
    after: "One position every decision can stand on",
    skipped: "Without Earth, the brand keeps rebuilding on moving ground.",
    steps: ["Audience", "Category", "Belief", "Position"],
  },
  water: {
    verb: "Carry",
    before: "A different expectation at every touchpoint",
    after: "One recognisable experience across every context",
    skipped: "Without Water, every channel quietly teaches a different brand.",
    steps: ["Notice", "Enter", "Use", "Return"],
  },
  fire: {
    verb: "Distinguish",
    before: "Category language anyone could claim",
    after: "A signal strong enough to earn a second look",
    skipped: "Without Fire, competent work disappears into category sameness.",
    steps: ["Familiar", "Tension", "Choice", "Recall"],
  },
  air: {
    verb: "Translate",
    before: "Strategy trapped inside internal language",
    after: "Words customers understand, remember, and repeat",
    skipped: "Without Air, the business knows what it means but the market does not.",
    steps: ["Meaning", "Frame", "Voice", "Repeat"],
  },
  space: {
    verb: "Compound",
    before: "Isolated moments of attention",
    after: "Recognition that becomes easier with every encounter",
    skipped: "Without Space, each campaign must introduce the brand all over again.",
    steps: ["Encounter", "Pattern", "Memory", "Equity"],
  },
} as const;

export function VerticalUnfold({ elements }: { elements: Element[] }) {
  return (
    <>
      <ElementsRail elements={elements} />

      <div className="divide-y divide-ivory/10 bg-soil pt-10 sm:pt-16">
        {elements.map((el, i) => {
          const transformation = TRANSFORMATIONS[el.slug];

          return (
            <div key={el.slug} className="relative overflow-hidden">
              <ElementRowBackground
                gate
                image={el.image}
                video={el.video}
                color={el.color}
                imagePosition={el.imagePosition}
              />

              <Container className="relative py-10 sm:py-16">
                <ElementReveal slug={el.slug} delay={i * 0.05}>
                  <article
                    id={el.slug}
                    className="overflow-hidden rounded-[1.75rem] border border-ivory/14 bg-soil/72 shadow-[0_28px_80px_-42px_rgba(0,0,0,0.85)] backdrop-blur-md"
                  >
                    <header className="border-b border-ivory/10 px-5 py-6 sm:px-8">
                      <div className="flex items-center justify-between gap-4">
                        <div className="flex items-center gap-3">
                          <span
                            className="font-display text-5xl font-normal leading-none opacity-65"
                            style={{ color: el.color }}
                          >
                            {String(i + 1).padStart(2, "0")}
                          </span>
                          <ElementGlyph
                            slug={el.slug}
                            className="h-8 w-8 shrink-0"
                            style={{ color: el.color }}
                          />
                        </div>
                        <span
                          className="rounded-full border px-3 py-1.5 text-[0.62rem] font-medium uppercase tracking-[0.2em]"
                          style={{ borderColor: `${el.color}88`, color: el.color }}
                        >
                          {transformation.verb}
                        </span>
                      </div>

                      <h3 className="mt-5 font-display text-3xl font-normal text-ivory sm:text-4xl">
                        {el.name}
                      </h3>
                      <p className="mt-3 max-w-xl font-display text-xl italic leading-snug text-ivory/84">
                        {el.poetic}
                      </p>
                    </header>

                    <div className="px-5 py-6 sm:px-8 sm:py-8">
                      <p className="text-sm leading-relaxed text-ivory/68">{el.meaning}</p>

                      <div className="mt-7 grid grid-cols-[1fr_auto_1fr] items-stretch gap-3">
                        <div className="rounded-2xl border border-ivory/10 bg-black/15 p-4">
                          <p className="text-[0.58rem] uppercase tracking-[0.2em] text-ivory/42">Before</p>
                          <p className="mt-3 text-sm leading-relaxed text-ivory/65">{transformation.before}</p>
                        </div>
                        <div className="flex items-center justify-center" aria-hidden="true">
                          <span className="text-xl" style={{ color: el.color }}>→</span>
                        </div>
                        <div className="rounded-2xl border p-4" style={{ borderColor: `${el.color}66`, backgroundColor: `${el.color}16` }}>
                          <p className="text-[0.58rem] uppercase tracking-[0.2em]" style={{ color: el.color }}>After</p>
                          <p className="mt-3 text-sm leading-relaxed text-ivory/88">{transformation.after}</p>
                        </div>
                      </div>

                      <div className="mt-7">
                        <p className="text-[0.6rem] uppercase tracking-[0.22em] text-ivory/42">How the Tatva moves</p>
                        <div className="mt-4 grid grid-cols-4 gap-2">
                          {transformation.steps.map((step, stepIndex) => (
                            <div key={step} className="relative text-center">
                              <span
                                className="mx-auto block h-2.5 w-2.5 rounded-full"
                                style={{ backgroundColor: el.color, opacity: 0.45 + stepIndex * 0.18 }}
                              />
                              {stepIndex < transformation.steps.length - 1 && (
                                <span
                                  aria-hidden="true"
                                  className="absolute left-[calc(50%+0.4rem)] right-[calc(-50%+0.4rem)] top-[0.28rem] h-px"
                                  style={{ backgroundColor: `${el.color}55` }}
                                />
                              )}
                              <span className="mt-2 block text-[0.58rem] uppercase tracking-[0.12em] text-ivory/52">
                                {step}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div className="mt-7 rounded-2xl border-l-2 bg-black/15 px-4 py-4" style={{ borderColor: el.color }}>
                        <p className="text-[0.58rem] uppercase tracking-[0.2em]" style={{ color: el.color }}>
                          When this layer is skipped
                        </p>
                        <p className="mt-2 text-sm leading-relaxed text-ivory/72">{transformation.skipped}</p>
                      </div>

                      <p className="mt-6 text-xs leading-relaxed text-ivory/48">
                        Proof in practice: {el.proof}
                      </p>
                    </div>
                  </article>
                </ElementReveal>
              </Container>
            </div>
          );
        })}
      </div>
    </>
  );
}
