import type { Metadata } from "next";
import Link from "next/link";
import { Header } from "@/layouts/Header";
import { Footer } from "@/sections/Footer";
import { Container } from "@/components/Container";
import { Reveal } from "@/components/Reveal";
import { SplitReveal } from "@/components/SplitReveal";
import { NatureAccent } from "@/components/NatureAccent";
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

export const metadata: Metadata = {
  title: "Blog",
  description:
    "Notes on brand strategy, positioning, and the elemental approach, from Branding Tatva.",
  alternates: { canonical: "/blog" },
  openGraph: {
    title: "Blog | Branding Tatva",
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

export default function BlogPage() {
  const sorted = [...blogPosts].sort(
    (a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
  );

  return (
    <>
      <Header transparent />
      <main id="main-content">
        <PhotoHero
          video="/videos/own-dusk-ridge.mp4"
          poster="/images/own-dusk-ridge-poster.jpg"
          minHeight="60vh"
        >
          <Container className="relative py-20 text-center">
            <Reveal className="relative">
              {/* Ripple — ideas spreading outward — same quiet, low-opacity
                  accent Footer/Contact/Services already carry near their
                  own headings. */}
              <NatureAccent
                variant="ripple"
                className="pointer-events-none absolute -top-6 left-1/2 hidden h-10 w-10 translate-x-[60%] text-ivory/20 sm:block"
              />
              <span className="inline-flex items-center rounded-full border border-ivory/30 px-4 py-1.5 text-[0.65rem] font-medium uppercase tracking-[0.25em] text-ivory/85">
                Blog
              </span>
              <SplitReveal
                as="h1"
                className="mx-auto mt-6 max-w-2xl font-display text-[clamp(2rem,4.5vw,3.25rem)] font-normal leading-[1.1] text-ivory"
              >
                Notes on brand strategy, one element at a time.
              </SplitReveal>
              <p className="mx-auto mt-4 max-w-xl text-ivory/70">
                Short, specific writing on positioning, audience, and the
                elemental approach, the kind that&apos;s
                actually useful rather than a content calendar.
              </p>
            </Reveal>
          </Container>
        </PhotoHero>

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
        <section className="relative overflow-hidden bg-background-alt py-16">
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
            NOTES
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
                      href={`/blog/${post.slug}`}
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
            + LinkButton combination Services and Work already prove. */}
        <TexturedDark image="/images/own-alpenglow-peak.jpg" className="py-24 text-center sm:pb-28">
          <ClipReveal>
            <Container>
              <h2 className="text-display-md font-display font-normal text-ivory">
                Want writing like this, applied to your own brand?
              </h2>
              <p className="mx-auto mt-4 max-w-md text-ivory/70">
                Everything here started as a real question from a real
                project. Tell me yours, and I&apos;ll start there too.
              </p>
              <div className="mt-8">
                <LinkButton href="/contact">Start a brand conversation</LinkButton>
              </div>
            </Container>
          </ClipReveal>
        </TexturedDark>
      </main>
      <Footer />
    </>
  );
}
