import { Container } from "@/components/Container";
import { ElementReveal } from "@/components/ElementReveal";
import { ElementRowBackground } from "@/components/ElementRowBackground";
import { ElementGlyph } from "@/components/ElementGlyph";
import { ElementsRail } from "@/components/ElementsRail";
import type { Element } from "@/data/elements";

// The reduced-motion / no-JS-pin fallback — a slow vertical unfolding
// instead of the pinned slide sequence in PinnedSlider. This was the
// only version of this section for most of the site's life; kept as a
// complete, deliberate design rather than a lesser fallback. On phones,
// each Tatva now owns most of one viewport, so Earth and Water no longer
// compete inside the same frame and every environmental film has enough
// time to establish its own atmosphere. Desktop reduced-motion retains
// the compact row rhythm.
export function VerticalUnfold({ elements }: { elements: Element[] }) {
  return (
    <>
      <ElementsRail elements={elements} />

      {/*
        bg-soil here (not just on each row) is the actual fix for the
        remaining gap: this wrapper used to be fully transparent with a
        mt-16/sm:mt-24 top margin sitting directly on top of the plain
        cream page background — on mobile this is the ONLY layout for
        this section (desktop uses PinnedSlider instead, which has no
        such margin), so that margin always showed as a solid band of
        cream between the preceding section and the first row. Giving
        the wrapper its own dark fill and turning the margin into
        padding means there's no longer any transparent gap for the
        page background to show through, no matter how the rows above
        settle.
      */}
      <div className="divide-y divide-border bg-soil pt-5 sm:pt-12">
        {elements.map((el, i) => (
          // ElementRowBackground deliberately sits OUTSIDE ElementReveal
          // now, not wrapped by it — it already carries its own robust
          // fallback (a solid color fill the instant it mounts, before
          // the photo/video even loads, specifically built so a slow
          // asset never reads as blank empty space). Nesting the whole
          // row inside ElementReveal's own opacity:0 entrance undid that
          // guarantee at a level up: if that reveal's trigger doesn't
          // fire promptly during real, fast mobile scrolling, the entire
          // row — background included — stayed invisible, showing the
          // plain page background through it instead. Scoping ElementReveal
          // to just the text block keeps the per-element entrance motion
          // while the row's visual presence is no longer gated on it.
          <div
            key={el.slug}
            className="relative flex min-h-[72svh] items-center overflow-hidden md:block md:min-h-0"
          >
            <ElementRowBackground
              gate
              image={el.image}
              video={el.video}
              videoWebm={el.videoWebm}
              color={el.color}
              imagePosition={el.imagePosition}
            />
            <Container className="relative w-full">
              <ElementReveal slug={el.slug} delay={i * 0.06}>
                <div
                  id={el.slug}
                  className={`relative grid items-baseline gap-4 rounded-2xl bg-soil/45 px-4 py-9 backdrop-blur-[2px] sm:grid-cols-[auto_1fr_1.2fr] sm:gap-10 sm:bg-transparent sm:px-0 sm:py-11 sm:backdrop-blur-none ${
                    i % 2 === 1 ? "sm:text-right" : ""
                  }`}
                >
                  <div className={`flex items-baseline gap-3 ${i % 2 === 1 ? "sm:flex-row-reverse" : ""}`}>
                    <span
                      className="font-display text-[clamp(3rem,7vw,5.5rem)] font-normal leading-none opacity-40"
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
                    className={`font-display text-2xl font-normal text-ivory sm:text-3xl ${
                      i % 2 === 1 ? "sm:order-3" : ""
                    }`}
                  >
                    {el.name}
                  </p>
                  <div className={i % 2 === 1 ? "sm:order-2" : ""}>
                    {/* Same spacing fix as PinnedSlider's desktop
                        version — Tailwind's preflight zeroes default <p>
                        margins, so stacked manifesto lines/concepts need
                        an explicit rhythm. */}
                    <div className="space-y-1 font-display text-lg italic text-ivory/85">
                      {el.manifesto.map((line, li) => (
                        <p key={li}>{line}</p>
                      ))}
                    </div>
                    <div className="mt-3 space-y-1.5">
                      {el.concepts.map((c, ci) => (
                        <p key={ci} className="text-sm text-ivory/75">
                          {c}
                        </p>
                      ))}
                    </div>
                  </div>
                </div>
              </ElementReveal>
            </Container>
          </div>
        ))}
      </div>
    </>
  );
}
