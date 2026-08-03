import type { Metadata } from "next";
import Link from "next/link";
import { Header } from "@/layouts/Header";
import { Footer } from "@/sections/Footer";
import { Container } from "@/components/Container";
import { Reveal } from "@/components/Reveal";
import { SplitReveal } from "@/components/SplitReveal";
import { PhotoHero } from "@/components/PhotoHero";
import { ClipReveal } from "@/components/ClipReveal";
import { TexturedDark } from "@/components/TexturedDark";
import { LinkButton } from "@/components/Button";
import { ElementGlyph } from "@/components/ElementGlyph";
import { TopicClusters } from "@/sections/Insights/TopicClusters";
import { ArticleSearch } from "@/sections/Insights/ArticleSearch";
import { RecognitionAudit } from "@/sections/Services/RecognitionAudit";
import { blogPosts } from "@/data/blog";
import { elements } from "@/data/elements";
import { credentials } from "@/data/about";
import { site } from "@/data/site";

export const metadata: Metadata = {
  title: "Insights",
  description:
    "Writing on brand positioning, recognition, verbal identity, and the psychology underneath them, plus the Branding Tatva glossary.",
  alternates: { canonical: "/insights" },
  openGraph: {
    title: "Insights | Branding Tatva",
    description:
      "Writing on brand positioning, recognition, verbal identity, and the psychology underneath them, plus the Branding Tatva glossary.",
    type: "website",
  },
};

// The Insights rebuild per the governing bible's architecture:
// editorial hero → featured pillar article → question led articles →
// topic clusters with the glossary inside them → author block → the
// audit lead magnet. Reading stays primary; every article is framed
// by the genuine question it answers.
const QUESTION_FOR: Record<string, string> = {
  "five-elements-working-as-one": "Why does brand strategy need five elements working together?",
  "visible-versus-remembered": "What separates being seen from being remembered?",
  "what-a-brand-audit-actually-finds": "What actually happens in a brand audit?",
  "what-brand-positioning-actually-decides": "What does positioning actually decide?",
  "why-visible-brands-stay-forgettable": "Why does visibility fail to create memory?",
  "verbal-identity-beyond-tone-of-voice": "What belongs in a voice beyond tone?",
  "when-a-growing-business-needs-repositioning": "When does a position stop fitting?",
  "distinctive-assets-and-mental-availability": "What makes a brand come to mind at all?",
  "brand-architecture-for-multiple-offers": "Does the new offer earn its own name?",
  "how-psychology-informs-brand-strategy": "What machinery does a buyer actually run on?",
  "how-to-evaluate-a-branding-proposal": "How should a branding proposal be judged?",
  "category-reframing-a-concept-case-study": "What if the category itself is the problem?",
  "pricing-brand-strategy-across-markets": "Why does the same work carry different prices?",
  "how-to-document-brand-decisions": "Who remembers why the brand decided this?",
  "the-annual-brand-health-review": "How far has the brand drifted this year?",
};

function elementColor(slug: string) {
  return elements.find((e) => e.slug === slug)?.color ?? "#27221E";
}

export default function InsightsPage() {
  const sorted = [...blogPosts].sort(
    (a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
  );
  const [featured, ...rest] = sorted;
  const degrees = credentials.filter((c) => c.featured);

  return (
    <>
      <Header transparent />
      <main id="main-content">
        <PhotoHero
          video="/videos/pexels-himalayan-dawn.mp4"
          poster="/images/pexels-himalayan-dawn-poster.jpg"
          minHeight="60vh"
        >
          <Container className="relative py-20 sm:py-28">
            <Reveal>
              <span className="inline-flex items-center rounded-full border border-ivory/30 px-4 py-1.5 text-[0.65rem] font-medium uppercase tracking-[0.25em] text-ivory/85">
                Insights
              </span>
              <SplitReveal
                as="h1"
                className="mt-6 max-w-2xl font-display text-[clamp(2rem,4.5vw,3.25rem)] font-normal leading-[1.1] text-ivory"
              >
                Writing that answers real brand questions.
              </SplitReveal>
              <p className="mt-4 max-w-xl text-ivory/80">
                Positioning, recognition, verbal identity, and the psychology underneath them. Every piece starts from
                a question a real project actually raised.
              </p>
            </Reveal>
          </Container>
        </PhotoHero>

        {/* Featured pillar — the strongest piece carried as a full
            editorial block rather than the largest tile in a grid. */}
        {featured && (
          <section className="bg-background-alt py-16 sm:py-24">
            <Container className="max-w-5xl">
              <Reveal>
                <p className="text-sm font-medium uppercase tracking-wide" style={{ color: elementColor(featured.element) }}>
                  Featured
                </p>
                <Link href={`/insights/${featured.slug}`} className="group mt-3 block">
                  <p className="max-w-2xl font-display text-[clamp(1.8rem,4vw,3rem)] font-normal leading-tight text-soil transition-colors duration-300 group-hover:text-clay">
                    {featured.title}
                  </p>
                  <p className="mt-4 max-w-2xl text-base leading-relaxed text-foreground-secondary">
                    {featured.excerpt}
                  </p>
                  <p className="mt-5 inline-flex items-center gap-2 text-sm font-medium uppercase tracking-wide text-action-primary-hover">
                    Read the article <span aria-hidden="true">→</span>
                  </p>
                </Link>
              </Reveal>
            </Container>
          </section>
        )}

        {/* Search over the archive (manual guide p82) — twelve pieces
            earn a faster path in; the full list below stays primary. */}
        <section className="bg-background-alt pb-10">
          <Container className="max-w-5xl">
            <Reveal>
              <ArticleSearch
                posts={sorted.map((p) => ({
                  slug: p.slug,
                  title: p.title,
                  excerpt: p.excerpt,
                  question: QUESTION_FOR[p.slug] ?? "",
                }))}
              />
            </Reveal>
          </Container>
        </section>

        {/* Question led articles — each remaining piece introduced by
            the genuine question it answers, per the bible's answer
            format direction. */}
        <section className="bg-background-alt pb-16 sm:pb-24">
          <Container className="max-w-5xl">
            {rest.map((post, i) => (
              <Reveal key={post.slug} delay={i * 0.06}>
                <Link
                  href={`/insights/${post.slug}`}
                  className="group grid gap-2 border-t border-soil/15 py-7 sm:grid-cols-[1fr_auto] sm:items-baseline sm:gap-8"
                >
                  <span>
                    <span className="flex items-center gap-2.5 text-xs font-medium uppercase tracking-[0.15em]" style={{ color: elementColor(post.element) }}>
                      <ElementGlyph slug={post.element} className="h-4 w-4" strokeWidth={1.3} />
                      {QUESTION_FOR[post.slug] ?? "A question from a real project"}
                    </span>
                    <span className="mt-2 block font-display text-2xl font-normal text-soil transition-transform duration-300 group-hover:translate-x-1">
                      {post.title}
                    </span>
                    <span className="mt-2 block max-w-xl text-sm leading-relaxed text-foreground-secondary">
                      {post.excerpt}
                    </span>
                  </span>
                  <span className="text-sm text-foreground-secondary/70">{post.readingTime}</span>
                </Link>
              </Reveal>
            ))}
            <div className="h-px bg-soil/15" aria-hidden="true" />
          </Container>
        </section>

        {/* Topic clusters + glossary — the practice's vocabulary made
            explorable. Dark chapter, matching the site's editorial
            rhythm of light reading over dark teaching. */}
        <section className="bg-soil py-16 sm:py-24">
          <TopicClusters />
        </section>

        {/* Author block — every insight on this site has the same
            author; her real credentials say why that matters. */}
        <section className="bg-soil pb-16 sm:pb-24">
          <Container className="max-w-5xl">
            <Reveal>
              <div className="grid items-center gap-8 rounded-2xl border border-ivory/12 p-6 sm:p-10 lg:grid-cols-[minmax(0,14rem)_1fr]" style={{ backgroundColor: "rgba(244,239,230,0.04)" }}>
                <div className="mx-auto max-w-[14rem] overflow-hidden rounded-2xl lg:mx-0">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src="/images/work-portrait.jpg" alt={site.founder} className="block h-auto w-full" loading="lazy" />
                </div>
                <div>
                  <p className="text-xs font-medium uppercase tracking-[0.18em] text-sandstone">Written by</p>
                  <p className="mt-1 font-display text-2xl font-normal text-ivory">{site.founder}</p>
                  <p className="mt-3 max-w-lg text-sm leading-relaxed text-ivory/85">
                    Every piece here is written by the person who does the client work. {degrees.map((d) => d.label).join(" and ")}:
                    one for how people notice and decide, the other for how language carries meaning.
                  </p>
                  <Link href="/about" className="link-underline mt-4 inline-block text-sm text-sandstone transition-colors duration-300 hover:text-ivory">
                    The mind behind the practice
                  </Link>
                </div>
              </div>
            </Reveal>
          </Container>
        </section>

        {/* The audit lead magnet, in its pillar context — the bible
            places it inside Insights as well as after the Services
            health check. Same component, same honest preview rule. */}
        <section className="bg-soil pb-20 sm:pb-28">
          <RecognitionAudit />
        </section>

        <TexturedDark
          image="/images/higgsfield-stream-clarity-poster.jpg"
          video="/videos/higgsfield-stream-clarity.mp4"
          className="py-20 sm:py-28 text-center sm:pb-28"
        >
          <ClipReveal>
            <Container>
              <h2 className="text-display-md font-display font-normal text-ivory">
                Want writing like this, applied to your own brand?
              </h2>
              <p className="mx-auto mt-4 max-w-md text-ivory/80">
                Everything here started as a real question from a real project. Tell me yours, and I&apos;ll start
                there too.
              </p>
              <div className="mt-8">
                <LinkButton href="/contact">Start a Brand Conversation</LinkButton>
              </div>
            </Container>
          </ClipReveal>
        </TexturedDark>
      </main>
      <Footer />
    </>
  );
}
