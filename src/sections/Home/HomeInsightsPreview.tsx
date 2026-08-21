import Link from "next/link";
import { Container } from "@/components/Container";
import { ElementGlyph } from "@/components/ElementGlyph";
import { LinkButton } from "@/components/Button";
import { Reveal } from "@/components/Reveal";
import { blogPosts } from "@/data/blog";
import { elements } from "@/data/elements";

function elementColor(slug: string) {
  return elements.find((element) => element.slug === slug)?.color ?? "#5C6B4A";
}

export function HomeInsightsPreview() {
  const posts = [...blogPosts].sort(
    (a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
  );
  const [featured, ...supporting] = posts;

  if (!featured) return null;

  return (
    <section
      id="thinking"
      aria-labelledby="thinking-heading"
      className="flex min-h-svh scroll-mt-24 items-center bg-background-alt py-20 sm:py-24"
    >
      <Container>
        <div className="grid gap-12 lg:grid-cols-[1.08fr_0.92fr] lg:gap-20">
          <Reveal>
            <p className="text-xs font-medium uppercase tracking-[0.24em] text-action-secondary">
              The thinking behind the work
            </p>
            <h2
              id="thinking-heading"
              className="mt-4 max-w-xl font-display text-[clamp(2.5rem,5vw,4.75rem)] font-normal leading-[1.02] text-soil"
            >
              Ideas should make the next decision easier.
            </h2>
            <p className="mt-5 max-w-lg text-foreground-secondary">
              One considered field note, then two supporting questions. No content-calendar filler and no generic advice disconnected from the work.
            </p>
            <div className="mt-8">
              <LinkButton href="/insights">Enter the research observatory</LinkButton>
            </div>
          </Reveal>

          <div className="border-t border-soil/15 lg:border-l lg:border-t-0 lg:pl-10">
            <Reveal>
              <Link href={`/insights/${featured.slug}`} className="group block py-8 lg:pt-0">
                <ElementGlyph
                  slug={featured.element}
                  className="h-7 w-7"
                  style={{ color: elementColor(featured.element) }}
                  strokeWidth={1.3}
                />
                <p className="mt-5 text-xs font-medium uppercase tracking-[0.18em] text-foreground-secondary">
                  Branding Tatva field note · {featured.readingTime}
                </p>
                <p className="mt-3 font-display text-3xl font-normal leading-tight text-soil transition-colors group-hover:text-action-primary-hover">
                  {featured.title}
                </p>
                <p className="mt-4 text-sm leading-relaxed text-foreground-secondary">{featured.excerpt}</p>
                <span className="mt-5 inline-flex text-sm text-action-primary-hover">Read the argument →</span>
              </Link>
            </Reveal>

            <div className="border-t border-soil/15">
              {supporting.slice(0, 2).map((post, index) => (
                <Reveal key={post.slug} delay={(index + 1) * 0.06}>
                  <Link
                    href={`/insights/${post.slug}`}
                    className="group grid grid-cols-[2.5rem_1fr_auto] items-start gap-4 border-b border-soil/15 py-5"
                  >
                    <span className="font-display text-xl text-soil/30">0{index + 2}</span>
                    <span className="text-sm leading-relaxed text-soil group-hover:text-action-primary-hover">
                      {post.title}
                    </span>
                    <span aria-hidden="true" className="text-action-primary-hover">→</span>
                  </Link>
                </Reveal>
              ))}
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
