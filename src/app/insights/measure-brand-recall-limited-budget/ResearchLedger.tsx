import { Container } from "@/components/Container";
import { ElementGlyph } from "@/components/ElementGlyph";
import { LinkButton } from "@/components/Button";
import { Reveal } from "@/components/Reveal";
import { TexturedDark } from "@/components/TexturedDark";
import { brandRecallMeasurementInsightPosts } from "@/data/brandRecallMeasurementInsights";
import { elements } from "@/data/elements";
import { site } from "@/data/site";
import { Footer } from "@/sections/Footer";

const SLUG = "measure-brand-recall-limited-budget";
const article = brandRecallMeasurementInsightPosts[0];
const sources = article.sources;
const element = elements.find((item) => item.slug === article.element);
const color = element?.color ?? "#AD6F5C";

const citationStructuredData = {
  "@context": "https://schema.org",
  "@type": "BlogPosting",
  "@id": `${site.url}/insights/${SLUG}/#article`,
  citation: sources.map((source) => source.url),
};

export function ResearchLedger() {
  return (
    <>
      <section
        id="research-sources"
        aria-labelledby="research-sources-heading"
        className="relative overflow-hidden bg-ivory py-20 sm:py-28"
      >
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -right-24 top-0 h-80 w-80 rounded-full blur-3xl"
          style={{ backgroundColor: `${color}18` }}
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -left-20 bottom-0 h-64 w-64 rounded-full bg-sandstone/25 blur-3xl"
        />

        <Container className="relative">
          <Reveal>
            <div className="grid gap-8 lg:grid-cols-[minmax(0,0.75fr)_minmax(0,1.25fr)] lg:items-end">
              <div>
                <div className="inline-flex items-center gap-3 rounded-full border border-soil/10 bg-background-elevated px-4 py-2 shadow-elevation-sm">
                  <ElementGlyph
                    slug={article.element}
                    className="h-5 w-5"
                    strokeWidth={1.25}
                    style={{ color }}
                  />
                  <span className="text-[0.65rem] font-semibold uppercase tracking-[0.2em] text-clay">
                    Research ledger
                  </span>
                </div>
                <h2
                  id="research-sources-heading"
                  className="mt-6 max-w-xl font-display text-display-md font-normal leading-[1.02] text-soil"
                >
                  The evidence beneath the method.
                </h2>
              </div>

              <div className="max-w-2xl lg:justify-self-end">
                <p className="text-base leading-8 text-foreground-secondary">
                  These sources establish the survey, memory, and measurement
                  principles used in this guide. The practical recommendations
                  are Branding Tatva&apos;s application of that evidence to
                  smaller service businesses.
                </p>
                <p className="mt-4 text-sm leading-7 text-foreground-secondary">
                  They are shown openly so the method can be inspected rather
                  than accepted as a polished certainty score.
                </p>
              </div>
            </div>
          </Reveal>

          <ol className="mt-12 grid gap-5 md:grid-cols-2">
            {sources.map((source, index) => (
              <Reveal key={source.url} delay={index * 0.04}>
                <li className="group h-full rounded-[1.5rem] border border-soil/10 bg-background-elevated p-6 shadow-elevation-sm transition duration-300 hover:-translate-y-1 hover:shadow-elevation-md sm:p-7">
                  <div className="flex h-full gap-5">
                    <span
                      className="font-display text-3xl leading-none"
                      style={{ color }}
                      aria-hidden="true"
                    >
                      {String(index + 1).padStart(2, "0")}
                    </span>

                    <div className="flex min-w-0 flex-1 flex-col">
                      <a
                        href={source.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="font-display text-2xl font-normal leading-tight text-soil transition group-hover:text-clay"
                      >
                        {source.title}
                        <span className="ml-2 text-base" aria-hidden="true">
                          ↗
                        </span>
                      </a>
                      <p className="mt-3 text-[0.65rem] font-semibold uppercase tracking-[0.16em] text-clay">
                        {source.publisher}
                      </p>
                      {source.note && (
                        <p className="mt-4 text-sm leading-7 text-foreground-secondary">
                          {source.note}
                        </p>
                      )}
                    </div>
                  </div>
                </li>
              </Reveal>
            ))}
          </ol>
        </Container>
      </section>

      <TexturedDark
        image={article.heroImage}
        video={article.heroVideo}
        className="py-24 text-center sm:py-28"
      >
        <Container>
          <Reveal>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-sandstone">
              Apply the thinking
            </p>
            <h2 className="mx-auto mt-4 max-w-3xl font-display text-display-md font-normal text-ivory">
              A clear diagnosis makes the next brand decision smaller.
            </h2>
            <p className="mx-auto mt-5 max-w-xl text-base leading-7 text-ivory/75">
              Bring the question, the current materials, and the part that
              keeps refusing to hold together.
            </p>
            <div className="mt-8">
              <LinkButton href="/contact">Start a brand conversation</LinkButton>
            </div>
          </Reveal>
        </Container>
      </TexturedDark>

      <Footer />
      <script
        type="application/ld+json"
        // eslint-disable-next-line react/no-danger
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(citationStructuredData),
        }}
      />
    </>
  );
}
