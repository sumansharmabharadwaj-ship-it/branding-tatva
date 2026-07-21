import { Container } from "@/components/Container";
import { ElementReveal } from "@/components/ElementReveal";
import { ElementRowBackground } from "@/components/ElementRowBackground";
import { ElementGlyph } from "@/components/ElementGlyph";
import { ElementsRail } from "@/components/ElementsRail";
import type { Element } from "@/data/elements";

// The reduced-motion / no-JS-pin fallback — a slow vertical unfolding
// instead of the pinned slide sequence in PinnedSlider. This was the
// only version of this section for most of the site's life; kept
// exactly as-is rather than a lesser fallback, since it already reads
// as a complete, deliberate design on its own (the same reasoning
// Process/VerticalJourney's own history already established for this
// site — see that component's comments).
export function VerticalUnfold({ elements }: { elements: Element[] }) {
  return (
    <>
      <ElementsRail elements={elements} />

      <div className="mt-16 divide-y divide-border sm:mt-24">
        {elements.map((el, i) => (
          <ElementReveal key={el.slug} slug={el.slug} delay={i * 0.06}>
            <div className="relative overflow-hidden">
              <ElementRowBackground image={el.image} video={el.video} color={el.color} imagePosition={el.imagePosition} />
              <Container>
              <div
                id={el.slug}
                className={`relative grid items-baseline gap-4 rounded-xl bg-soil/45 px-4 py-9 backdrop-blur-[2px] sm:grid-cols-[auto_1fr_1.2fr] sm:gap-10 sm:bg-transparent sm:px-0 sm:py-11 sm:backdrop-blur-none ${
                  i % 2 === 1 ? "sm:text-right" : ""
                }`}
              >
                <div className={`flex items-baseline gap-3 ${i % 2 === 1 ? "sm:flex-row-reverse" : ""}`}>
                  <span
                    className="font-display text-[clamp(3rem,7vw,5.5rem)] font-semibold leading-none opacity-40"
                    style={{ color: el.color }}
                  >
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <ElementGlyph
                    slug={el.slug}
                    className="h-7 w-7 shrink-0 opacity-90 sm:h-9 sm:w-9"
                    style={{ color: el.color }}
                  />
                </div>
                <p
                  className={`font-display text-2xl font-semibold text-ivory sm:text-3xl ${
                    i % 2 === 1 ? "sm:order-3" : ""
                  }`}
                >
                  {el.name}
                </p>
                <div className={i % 2 === 1 ? "sm:order-2" : ""}>
                  <p className="font-display text-lg italic text-ivory/85">
                    &ldquo;{el.poetic}&rdquo;
                  </p>
                  <p className="mt-2 text-sm text-ivory/75">{el.meaning}</p>
                </div>
              </div>
              </Container>
            </div>
          </ElementReveal>
        ))}
      </div>
    </>
  );
}
