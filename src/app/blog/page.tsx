import type { Metadata } from "next";
import Link from "next/link";
import { Header } from "@/layouts/Header";
import { Footer } from "@/sections/Footer";
import { Container } from "@/components/Container";
import { Reveal } from "@/components/Reveal";
import { SplitReveal } from "@/components/SplitReveal";
import { TiltCard } from "@/components/TiltCard";
import { PerspectiveReveal } from "@/components/PerspectiveReveal";
import { PhotoHero } from "@/components/PhotoHero";
import { ImageBreak } from "@/components/ImageBreak";
import { ClipReveal } from "@/components/ClipReveal";
import { TexturedDark } from "@/components/TexturedDark";
import { LinkButton } from "@/components/Button";
import { blogPosts } from "@/data/blog";
import { elements } from "@/data/elements";
import { ElementGlyph } from "@/components/ElementGlyph";
import { ScrollProgress } from "@/components/ScrollProgress";
import { SectionJumpNav } from "@/components/SectionJumpNav";

export const metadata: Metadata = {
  title: "Insights",
  description:
    "Notes on brand strategy, positioning, and the elemental approach, from Branding Tatva.",
  alternates: { canonical: "/insights" },
  openGraph: {
    title: "Insights | Branding Tatva",
    description:
      "Notes on brand strategy, positioning, and the elemental approach, from Branding Tatva.",
    type: "website",
  },
};

function elementColor(slug: string) {
  return elements.find((e) => e.slug === slug)?.color ?? "#27221E";
}

// Only 3 posts today, so a repeating modulo pattern (like the Work
// grid's TILE_LAYOUT_CLASSES) would be overkill — a plain array indexed
// against the sorted list is enough to give the most recent post a
// lead tile instead of three identical cards.
const GRID_TILE_CLASSES = ["sm:col-span-2 sm:min-h-64", "", ""];

const OBSERVATORY = [
  {
    number: "01",
    element: "space",
    title: "Systems before surfaces",
    thesis: "A brand becomes memorable when positioning, expression, language, experience, and repetition reinforce one decision.",
    href: "/insights/five-elements-working-as-one",
  },
  {
    number: "02",
    element: "fire",
    title: "Recognition before reach",
    thesis: "Visibility creates an impression. Distinctiveness and consistency decide whether that impression survives.",
    href: "/insights/visible-versus-remembered",
  },
  {
    number: "03",
    element: "water",
    title: "Diagnosis before redesign",
    thesis: "An audit finds the exact point where a brand stops telling one coherent story, before new execution makes the seam more expensive.",
    href: "/insights/what-a-brand-audit-actually-finds",
  },
] as const;

export default function BlogPage() {
  const sorted = [...blogPosts].sort(
    (a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
  );

  return (
    <>
      <Header transparent />
      <ScrollProgress />
      <main id="main-content">
        <PhotoHero
          video="/videos/higgsfield-redwood-canopy.mp4"
          poster="/images/higgsfield-redwood-canopy-poster.jpg"
          minHeight="70vh"
        >
          <span
            aria-hidden="true"
            className="pointer-events-none absolute -top-5 right-0 select-none whitespace-nowrap font-display text-[clamp(4rem,14vw,10rem)] font-bold uppercase leading-none text-ivory/[0.06]"
          >
            Observe
          </span>
          <Container className="relative py-20">
            <div className="grid gap-10 lg:grid-cols-[1fr_auto] lg:items-end lg:gap-16">
              <Reveal>
                <span className="inline-flex items-center rounded-full border border-ivory/30 px-4 py-1.5 text-[0.65rem] font-medium uppercase tracking-[0.25em] text-ivory/85">
                  Research observatory
                </span>
                <SplitReveal
                  as="h1"
                  className="mt-6 max-w-3xl font-display text-[clamp(2.5rem,6vw,4.75rem)] font-normal leading-[1.03] text-ivory"
                >
                  Ideas that make brand decisions easier to see.
                </SplitReveal>
                <p className="mt-5 max-w-xl text-ivory/80">
                  Original field notes on recognition, perception, positioning, and the systems that turn strategy into something people remember.
                </p>
              </Reveal>
              <Reveal delay={0.1} className="border-l border-ivory/20 pl-6 lg:max-w-64 lg:pb-2">
                <p className="text-xs font-medium uppercase tracking-[0.22em] text-ivory/55">Current lenses</p>
                <div className="mt-4 flex flex-wrap gap-2 lg:flex-col lg:items-start">
                  {["Recognition", "Perception", "Brand systems"].map((lens) => (
                    <span key={lens} className="rounded-full border border-ivory/25 px-3 py-1 text-xs text-ivory/85">
                      {lens}
                    </span>
                  ))}
                </div>
              </Reveal>
            </div>
          </Container>
        </PhotoHero>

        <section id="observatory" className="scroll-mt-24 bg-soil py-20 sm:py-28">
          <Container>
            <Reveal className="grid gap-6 border-b border-ivory/15 pb-10 lg:grid-cols-[0.55fr_1fr] lg:items-end">
              <div>
                <p className="text-sm font-medium uppercase tracking-wide text-sandstone">Three active questions</p>
                <h2 className="mt-2 text-display-sm font-display font-normal text-ivory">The research field.</h2>
              </div>
              <p className="max-w-2xl text-ivory/75">
                Each territory begins with a buyer problem, develops a clear argument, and ends with a practical decision beyond content-calendar filler.
              </p>
            </Reveal>
            <div>
              {OBSERVATORY.map((item, index) => (
                <Reveal key={item.number} delay={index * 0.07}>
                  <Link
                    href={item.href}
                    className="group grid gap-4 border-b border-ivory/15 py-7 transition-colors hover:bg-ivory/[0.03] sm:grid-cols-[5rem_1fr_1.4fr_auto] sm:items-center sm:px-3"
                  >
                    <span className="font-display text-2xl text-ivory/25">{item.number}</span>
                    <span className="flex items-center gap-3 font-display text-xl text-ivory">
                      <ElementGlyph slug={item.element} className="h-5 w-5 text-sandstone" strokeWidth={1.3} />
                      {item.title}
                    </span>
                    <span className="text-sm leading-relaxed text-ivory/70">{item.thesis}</span>
                    <span className="text-sm text-sandstone transition-transform group-hover:translate-x-1" aria-hidden="true">→</span>
                  </Link>
                </Reveal>
              ))}
            </div>
          </Container>
        </section>

        {/* Was bold solid Soil — per direct feedback pointing at the
            reference site's own restraint, card grids read better on a
            light neutral than a dark block. Blog cards already use an
            opaque bg-background-elevated fill (not a translucent alpha
            trick), so no card-level change needed either way. */}
        {/* bg-background-alt lives on the outer section now, outside
            PerspectiveReveal — opacity:0 hides an element's entire
            rendered box, background-color included, so wrapping the
            whole section meant a slow-to-fire reveal trigger showed
            blank page background during fast real-device scrolling.
            Same fix as Home's PerspectiveReveal/ClipReveal sections. */}
        <section id="notes" className="relative scroll-mt-24 overflow-hidden bg-background-alt py-16">
          {/* Ghost watermark word, same technique as Home's "ELEMENTS"
              and About's "WHY" — soil-toned rather than ivory-toned
              since this section is light, not dark, the inverse of
              every other instance of this pattern. Sits outside
              PerspectiveReveal, not inside it, for the same reason this
              section's own background does (see comment above): a
              slow-to-fire reveal trigger would hide it along with
              everything else it wraps. */}
          <span
            aria-hidden="true"
            className="pointer-events-none absolute -top-4 left-0 select-none whitespace-nowrap font-display text-[clamp(3rem,11vw,9rem)] font-bold leading-none text-soil/[0.05] sm:-top-8"
          >
            FIELD NOTES
          </span>
        <PerspectiveReveal>
          <Container>
            <div className="spotlight-grid grid items-stretch gap-6 sm:grid-cols-2">
              {sorted.map((post, i) => (
                <Reveal
                  key={post.slug}
                  delay={i * 0.06}
                  className={`h-full ${GRID_TILE_CLASSES[i % GRID_TILE_CLASSES.length]}`}
                >
                  <TiltCard glowColor={elementColor(post.element)}>
                    {/* border (all sides), not just border-t-2 — the
                        card's near-white fill and the section's own
                        background-alt are too close in lightness
                        (~1.3:1) to separate by color alone now that the
                        section isn't dark Soil anymore. */}
                    <Link
                      href={`/insights/${post.slug}`}
                      className="spotlight-card flex h-full flex-col rounded-lg border border-t-2 border-soil/10 bg-background-elevated p-6 shadow-elevation-sm transition-colors duration-300"
                      style={{
                        borderTopColor: elementColor(post.element),
                        ["--card-color" as string]: elementColor(post.element),
                      }}
                    >
                      <ElementGlyph
                        slug={post.element}
                        className="h-6 w-6 opacity-70"
                        style={{ color: elementColor(post.element) }}
                        strokeWidth={1.3}
                      />
                      <p className="mt-3 text-xs font-medium uppercase tracking-wide text-foreground-secondary">
                        {new Date(post.publishedAt).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                        })}
                        {" · "}
                        {post.readingTime}
                      </p>
                      <p className={`mt-3 font-display font-normal text-soil ${i === 0 ? "text-2xl sm:text-3xl" : "text-xl"}`}>
                        {post.title}
                      </p>
                      <p className={`mt-3 flex-1 text-foreground-secondary ${i === 0 ? "max-w-lg text-base" : "text-sm"}`}>
                        {post.excerpt}
                      </p>
                      <p className="mt-5 inline-flex items-center gap-1.5 text-xs font-medium uppercase tracking-wide text-action-primary-hover transition-transform duration-300">
                        Read more <span aria-hidden="true">&rarr;</span>
                      </p>
                    </Link>
                  </TiltCard>
                </Reveal>
              ))}
            </div>
          </Container>
        </PerspectiveReveal>
        </section>

        {/* Every other page closes on a real photographic beat before
            the footer; the blog index went straight from the grid into
            it, which audit flagged as the page with "almost no visual
            variety at all." own-pond.jpg was the one real photo in the
            library not yet used anywhere on the site. */}
        <ImageBreak
          image="/images/own-pond.jpg"
          quote="Every idea here started as a note before it became something worth reading."
          height="55vh"
        />

        {/* This page used to end on the ImageBreak above with no next
            step — every other page (Home, About, Services, Contact)
            closes with an explicit CTA. Same TexturedDark + ClipReveal
            + LinkButton combination Services and Work already prove.
            Was own-alpenglow-peak.jpg — the exact clip flagged earlier
            this session as reading flat and hazy next to the site's
            other, more vivid footage, confirmed still live here on a
            direct audit. Swapped for the one genuinely unused clip left
            in the library: a clear stream over rocks, a real visual
            match for "clarity," now upgraded from a static image to
            video. */}
        <div id="apply" className="scroll-mt-24">
          <TexturedDark
            image="/images/higgsfield-stream-clarity-poster.jpg"
            video="/videos/higgsfield-stream-clarity.mp4"
            className="py-24 text-center sm:pb-28"
          >
            <ClipReveal>
              <Container>
                <p className="text-sm font-medium uppercase tracking-[0.22em] text-sandstone">
                  Applied thinking
                </p>
                <h2 className="mx-auto mt-3 max-w-3xl text-display-md font-display font-normal text-ivory">
                  See how the thinking becomes a working brand system.
                </h2>
                <p className="mx-auto mt-4 max-w-xl text-ivory/80">
                  Every idea should connect to a mechanism, a piece of evidence, and a clearer decision. Explore the work—or bring one live question to the strategy room.
                </p>
                <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
                  <LinkButton href="/work">Explore Brand Strategy & Systems</LinkButton>
                  <LinkButton href="/contact" variant="secondary">
                    Bring a question to the strategy room
                  </LinkButton>
                </div>
              </Container>
            </ClipReveal>
          </TexturedDark>
        </div>
      </main>
      <Footer />
      <SectionJumpNav
        items={[
          { href: "#observatory", label: "Observatory" },
          { href: "#notes", label: "Field notes" },
          { href: "#apply", label: "Apply" },
        ]}
      />
    </>
  );
}
