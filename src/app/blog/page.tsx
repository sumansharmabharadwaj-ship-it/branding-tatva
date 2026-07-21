import type { Metadata } from "next";
import Link from "next/link";
import { Header } from "@/layouts/Header";
import { Footer } from "@/sections/Footer";
import { Container } from "@/components/Container";
import { Reveal } from "@/components/Reveal";
import { TiltCard } from "@/components/TiltCard";
import { PerspectiveReveal } from "@/components/PerspectiveReveal";
import { PhotoHero } from "@/components/PhotoHero";
import { blogPosts } from "@/data/blog";
import { elements } from "@/data/elements";

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
            <Reveal>
              <span className="inline-flex items-center rounded-full border border-ivory/30 px-4 py-1.5 text-[0.65rem] font-medium uppercase tracking-[0.25em] text-ivory/85">
                Blog
              </span>
              <h1 className="mx-auto mt-6 max-w-2xl font-display text-[clamp(2rem,4.5vw,3.25rem)] font-semibold leading-[1.1] text-ivory">
                Notes on brand strategy, one element at a time.
              </h1>
              <p className="mx-auto mt-4 max-w-xl text-ivory/70">
                Short, specific writing on positioning, audience, and the
                elemental approach, the kind that&apos;s
                actually useful rather than a content calendar.
              </p>
            </Reveal>
          </Container>
        </PhotoHero>

        <PerspectiveReveal>
        <section className="border-t border-border bg-background-alt py-16">
          <Container>
            <div className="grid items-stretch gap-6 sm:grid-cols-2">
              {sorted.map((post, i) => (
                <Reveal
                  key={post.slug}
                  delay={i * 0.06}
                  className={`h-full ${GRID_TILE_CLASSES[i % GRID_TILE_CLASSES.length]}`}
                >
                  <TiltCard glowColor={elementColor(post.element)}>
                    <Link
                      href={`/blog/${post.slug}`}
                      className="flex h-full flex-col rounded-lg border-t-2 bg-background-elevated p-6 shadow-elevation-sm"
                      style={{ borderTopColor: elementColor(post.element) }}
                    >
                      <p className="text-xs font-medium uppercase tracking-wide text-foreground-secondary">
                        {new Date(post.publishedAt).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                        })}
                        {" · "}
                        {post.readingTime}
                      </p>
                      <p className={`mt-3 font-display font-semibold text-soil ${i === 0 ? "text-2xl sm:text-3xl" : "text-xl"}`}>
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
        </section>
        </PerspectiveReveal>
      </main>
      <Footer />
    </>
  );
}
