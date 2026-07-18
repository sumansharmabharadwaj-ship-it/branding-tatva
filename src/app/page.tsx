import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Container } from "@/components/Container";
import { LinkButton } from "@/components/Button";
import { FAQ } from "@/components/FAQ";
import { AnimatedHero } from "@/components/AnimatedHero";
import { IndianPattern } from "@/components/IndianPattern";
import { Reveal } from "@/components/Reveal";
import { Testimonials } from "@/components/Testimonials";
import { TexturedDark } from "@/components/TexturedDark";
import { CinematicHero } from "@/components/CinematicHero";
import { ImageBreak } from "@/components/ImageBreak";
import { site } from "@/data/site";
import { elements } from "@/data/elements";
import { projects } from "@/data/projects";
import { process } from "@/data/process";

const elementColor: Record<string, string> = {
  Earth: "#A65F46",
  Water: "#31485A",
  Fire: "#C9953D",
  Air: "#79816D",
  Space: "#B98278",
};

export default function Home() {
  const featured = projects.filter((p) => p.featured);

  return (
    <>
      <Header transparent />
      <main id="main-content">
        <CinematicHero
          image="/images/campaign-hero.jpg"
          eyebrow="Brand strategy for founders & existing businesses"
          headline={site.heroHeadline}
        >
          <p className="mt-6 max-w-md text-base text-ivory/70">{site.tagline}</p>
          <div className="mt-9 flex flex-wrap gap-4">
            <LinkButton href="/contact">Start a brand conversation</LinkButton>
            <LinkButton href="/work" variant="secondary" className="border-ivory/30 text-ivory hover:bg-ivory/10">
              Explore the work
            </LinkButton>
          </div>
        </CinematicHero>

        {/* Two-part editorial statement — the problem, then the philosophy,
            as one long unbroken chapter rather than two boxed sections. */}
        <section className="py-28 sm:py-40">
          <Container>
            <Reveal>
              <h2 className="max-w-3xl font-display text-[clamp(2rem,5vw,3.75rem)] font-semibold leading-[1.1] text-soil">
                A brand can be visible and still go unnoticed.
              </h2>
            </Reveal>
            <Reveal delay={0.15}>
              <div className="mt-10 max-w-md space-y-4 text-foreground-secondary sm:ml-auto sm:mr-0 sm:mt-8 sm:text-right">
                <p>
                  Being present isn&apos;t the same as being recognised.
                  Looking attractive isn&apos;t the same as communicating
                  clearly. Posting content isn&apos;t the same as building
                  recall.
                </p>
                <p>
                  That gap is usually a <span className="font-medium text-clay">clarity problem</span>,
                  far more often than a visibility one.
                </p>
              </div>
            </Reveal>
          </Container>

          <div className="mt-20 sm:mt-28">
            <ImageBreak
              image="/images/campaign-detail.jpg"
              quote="Attention is the first thing any brand has to earn."
              height="60vh"
            />
          </div>

          <Container className="mt-20 sm:mt-28">
            <Reveal>
              <h2 className="ml-auto max-w-2xl text-right font-display text-[clamp(2rem,5vw,3.75rem)] font-semibold leading-[1.1] text-soil">
                Five elements.
                <br />
                One brand.
              </h2>
            </Reveal>
            <Reveal delay={0.15}>
              <div className="mt-10 max-w-md space-y-4 text-foreground-secondary">
                <p>
                  Earth is where a brand is grounded. Water is how it moves
                  through someone&apos;s day. Fire is what makes people look
                  twice. Air is the language that carries it. Space is
                  what&apos;s left once the noise settles, the part people
                  actually remember.
                </p>
                <p className="font-medium text-soil">
                  Most brands are built with one or two of these. The ones
                  people remember are built with all five, working together.
                </p>
              </div>
            </Reveal>
          </Container>
        </section>

        {/* Five elements — a slow vertical unfolding, not a grid of cards */}
        <section className="border-t border-border bg-sandstone/15 py-28 sm:py-36">
          <Container>
            <div className="grid items-center gap-10 lg:grid-cols-[1fr_auto]">
              <Reveal>
                <h2 className="text-display-sm font-display font-semibold text-soil">
                  The five elements
                </h2>
                <p className="mt-3 max-w-md text-sm text-foreground-secondary">
                  Watch how they settle into place, the same convergence
                  that shapes an actual brand: separate parts finding one
                  shared center.
                </p>
              </Reveal>
              <Reveal delay={0.1}>
                <AnimatedHero />
              </Reveal>
            </div>
          </Container>

          <div className="mt-16 divide-y divide-border sm:mt-24">
            {elements.map((el, i) => (
              <Reveal key={el.slug} delay={i * 0.06}>
                <Container>
                  <div
                    className={`relative grid items-baseline gap-4 py-10 sm:grid-cols-[auto_1fr_1.2fr] sm:gap-10 sm:py-14 ${
                      i % 2 === 1 ? "sm:text-right" : ""
                    }`}
                  >
                    <span
                      className="font-display text-[clamp(3rem,7vw,5.5rem)] font-semibold leading-none opacity-[0.14]"
                      style={{ color: el.color }}
                    >
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <p
                      className={`font-display text-2xl font-semibold text-soil sm:text-3xl ${
                        i % 2 === 1 ? "sm:order-3" : ""
                      }`}
                    >
                      {el.name}
                    </p>
                    <div className={i % 2 === 1 ? "sm:order-2" : ""}>
                      <p className="font-display text-lg italic text-foreground-secondary">
                        &ldquo;{el.poetic}&rdquo;
                      </p>
                      <p className="mt-2 text-sm text-foreground-secondary">{el.meaning}</p>
                    </div>
                  </div>
                </Container>
              </Reveal>
            ))}
          </div>
        </section>

        {/* Two brand pathways — a real diptych, not two bordered text blocks */}
        <section>
          <h2 className="container-page pt-20 text-center font-display text-display-sm font-semibold text-soil">
            Every brand starts at one of two thresholds
          </h2>
          <div className="mt-12 grid min-h-[70vh] sm:grid-cols-2">
            <Reveal className="relative flex min-h-[50vh] items-end overflow-hidden bg-soil p-8 sm:min-h-0 sm:p-12">
              <div
                className="absolute inset-0"
                style={{
                  backgroundImage:
                    "linear-gradient(180deg, rgba(39,34,30,0.25) 0%, rgba(39,34,30,0.9) 100%), url(/images/hero-canyon.jpg)",
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                }}
              />
              <div className="relative">
                <p className="text-xs font-medium uppercase tracking-[0.3em] text-sandstone">
                  Threshold one
                </p>
                <p className="mt-3 max-w-xs font-display text-3xl font-semibold text-ivory">
                  Starting with an idea
                </p>
                <p className="mt-3 max-w-xs text-sm text-ivory/70">
                  Earth first work: purpose, audience, and positioning,
                  before anything else gets built.
                </p>
                <LinkButton
                  href="/services#brand-beginning"
                  variant="secondary"
                  className="mt-6 border-ivory/30 text-ivory hover:bg-ivory/10"
                >
                  Brand Beginning
                </LinkButton>
              </div>
            </Reveal>

            <Reveal delay={0.12} className="relative flex min-h-[50vh] items-end overflow-hidden bg-soil p-8 sm:min-h-0 sm:p-12">
              <div
                className="absolute inset-0"
                style={{
                  backgroundImage:
                    "linear-gradient(180deg, rgba(39,34,30,0.25) 0%, rgba(39,34,30,0.9) 100%), url(/images/hero-river.jpg)",
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                }}
              />
              <div className="relative">
                <p className="text-xs font-medium uppercase tracking-[0.3em] text-sandstone">
                  Threshold two
                </p>
                <p className="mt-3 max-w-xs font-display text-3xl font-semibold text-ivory">
                  Already in business
                </p>
                <p className="mt-3 max-w-xs text-sm text-ivory/70">
                  An audit first, finding exactly where the story stops
                  holding together.
                </p>
                <LinkButton
                  href="/services#brand-clarity"
                  variant="secondary"
                  className="mt-6 border-ivory/30 text-ivory hover:bg-ivory/10"
                >
                  Brand Clarity
                </LinkButton>
              </div>
            </Reveal>
          </div>
        </section>

        {/* Featured work */}
        <section className="border-t border-border bg-clay/5 py-20">
          <Container>
            <Reveal>
              <div className="flex items-baseline justify-between">
                <h2 className="text-display-sm font-display font-semibold text-soil">Selected work</h2>
                <LinkButton href="/work" variant="secondary">View all work</LinkButton>
              </div>
            </Reveal>
            <div className="mt-10 grid gap-6 md:grid-cols-3">
              {featured.map((project, i) => (
                <Reveal key={project.slug} delay={i * 0.1}>
                  <a
                    href={`/work/${project.slug}`}
                    className="block rounded-lg border-t-2 border-border bg-background-elevated p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-md"
                    style={{ borderTopColor: project.accent }}
                  >
                    <p className="text-xs font-medium uppercase tracking-wide text-foreground-secondary">
                      {project.industry}
                    </p>
                    <p className="mt-2 font-display text-xl font-semibold text-soil">
                      {project.title}
                    </p>
                    <p className="mt-3 text-sm text-foreground-secondary">{project.outcome}</p>
                  </a>
                </Reveal>
              ))}
            </div>
          </Container>
        </section>

        {/* Testimonials */}
        <section className="bg-rose-earth/10 py-20">
          <Container>
            <Reveal>
              <h2 className="text-display-sm font-display font-semibold text-soil">
                What clients say
              </h2>
              <p className="mt-3 max-w-xl text-sm text-foreground-secondary">
                Real quotes are being collected from recent projects. This
                section fills in as they come in, rather than being filled
                with anything invented in the meantime.
              </p>
              <div className="mt-8">
                <Testimonials />
              </div>
            </Reveal>
          </Container>
        </section>

        {/* Process */}
        <section className="border-t border-border bg-terracotta/10 py-20">
          <Container>
            <Reveal>
              <h2 className="text-display-sm font-display font-semibold text-soil">How a project moves</h2>
            </Reveal>
            <ol className="mt-10 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {process.map((stage, i) => (
                <li key={stage.stage} className="relative pl-10">
                  <Reveal delay={(i % 3) * 0.1}>
                    <span
                      className="absolute left-0 top-0 font-display text-2xl font-semibold"
                      style={{ color: elementColor[stage.element] }}
                    >
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <p className="font-display text-lg font-semibold text-soil">{stage.stage}</p>
                    <p className="mt-2 text-sm text-foreground-secondary">{stage.description}</p>
                  </Reveal>
                </li>
              ))}
            </ol>
          </Container>
        </section>

        {/* FAQ */}
        <section className="border-t border-border bg-sandstone/10 py-20">
          <Container className="max-w-2xl">
            <Reveal>
              <h2 className="text-display-sm font-display font-semibold text-soil">
                Common questions
              </h2>
              <div className="mt-8">
                <FAQ />
              </div>
            </Reveal>
          </Container>
        </section>

        {/* Final CTA — a widening threshold, marked with the lattice motif */}
        <TexturedDark className="py-24" image="/images/campaign-path.jpg">
          <IndianPattern className="absolute inset-0" opacity={0.08} color="#F4EFE6" />
          <Reveal>
            <Container className="relative text-center">
              <h2 className="mx-auto max-w-2xl text-display-md font-display font-semibold text-ivory">
                Let&apos;s find the Tatva of your business.
              </h2>
              <div className="mt-8">
                <LinkButton href="/contact">Start a brand conversation</LinkButton>
              </div>
            </Container>
          </Reveal>
        </TexturedDark>
      </main>
      <Footer />
    </>
  );
}
