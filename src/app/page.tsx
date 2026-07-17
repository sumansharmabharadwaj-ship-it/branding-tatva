import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Container } from "@/components/Container";
import { LinkButton } from "@/components/Button";
import { FAQ } from "@/components/FAQ";
import { AnimatedHero } from "@/components/AnimatedHero";
import { IndianPattern } from "@/components/IndianPattern";
import { site } from "@/data/site";
import { elements } from "@/data/elements";
import { projects } from "@/data/projects";
import { process } from "@/data/process";

export default function Home() {
  const featured = projects.filter((p) => p.featured);

  return (
    <>
      <Header />
      <main id="main-content">
        {/* Hero — "The Elements Find Their Form" */}
        <section className="py-16 sm:py-24">
          <Container className="grid items-center gap-10 lg:grid-cols-2 lg:gap-16">
            <div>
              <p className="text-sm font-medium uppercase tracking-wide text-action-secondary">
                Brand strategy for founders &amp; existing businesses
              </p>
              <h1 className="mt-4 max-w-xl text-display-xl font-display font-semibold text-soil">
                {site.heroHeadline}
              </h1>
              <p className="mt-6 max-w-xl text-lg text-foreground-secondary">
                {site.tagline}
              </p>
              <div className="mt-8 flex flex-wrap gap-4">
                <LinkButton href="/contact">Start a brand conversation</LinkButton>
                <LinkButton href="/work" variant="secondary">Explore the work</LinkButton>
              </div>
            </div>
            <AnimatedHero />
          </Container>
        </section>

        {/* The Attention Problem */}
        <section className="border-y border-border bg-background-alt py-20">
          <Container className="grid gap-10 lg:grid-cols-2 lg:gap-16">
            <h2 className="text-display-md font-display font-semibold text-soil">
              A brand can be visible and still go unnoticed.
            </h2>
            <div className="space-y-4 text-foreground-secondary">
              <p>
                Being present isn&apos;t the same as being recognised. Looking
                attractive isn&apos;t the same as communicating clearly.
                Posting content isn&apos;t the same as building recall. Most
                businesses are doing the first half of each of those pairs
                and wondering why the second half isn&apos;t happening.
              </p>
              <p>
                That gap is usually not a visibility problem. It&apos;s a
                clarity problem — somewhere between what the brand believes,
                what it says, and what it actually looks like day to day.
              </p>
            </div>
          </Container>
        </section>

        {/* Philosophy */}
        <section className="py-20">
          <Container>
            <h2 className="max-w-2xl text-display-md font-display font-semibold text-soil">
              Five elements. One brand.
            </h2>
            <p className="mt-5 max-w-xl text-foreground-secondary">
              Earth is where a brand is grounded — its purpose, its audience,
              what it&apos;s actually for. Water is how it moves through
              someone&apos;s day. Fire is what makes people look twice. Air
              is the language that carries it. Space is what&apos;s left
              once the noise settles — the part people actually remember.
            </p>
            <p className="mt-4 max-w-xl font-medium text-soil">
              Most brands are built with one or two of these. The ones people
              remember are built with all five, working together.
            </p>
          </Container>
        </section>

        {/* Five elements */}
        <section className="border-t border-border bg-background-alt py-20">
          <Container>
            <h2 className="text-display-sm font-display font-semibold text-soil">
              The five elements
            </h2>
            <div className="mt-10 grid gap-8 sm:grid-cols-2 lg:grid-cols-5 lg:gap-6">
              {elements.map((el) => (
                <div key={el.slug} className="border-t-2 pt-4" style={{ borderColor: el.color }}>
                  <p className="font-display text-lg font-semibold text-soil">{el.name}</p>
                  <p className="mt-2 font-display text-base italic text-foreground-secondary">
                    &ldquo;{el.poetic}&rdquo;
                  </p>
                  <p className="mt-3 text-sm text-foreground-secondary">{el.meaning}</p>
                </div>
              ))}
            </div>
          </Container>
        </section>

        {/* Two brand pathways */}
        <section className="py-20">
          <Container>
            <h2 className="text-display-sm font-display font-semibold text-soil">
              Every brand starts at one of two thresholds
            </h2>
            <div className="mt-10 grid gap-10 md:grid-cols-2 md:gap-16">
              <div className="border-l-2 border-clay pl-6">
                <p className="text-xs font-medium uppercase tracking-wide text-action-secondary">
                  Threshold one
                </p>
                <p className="mt-2 font-display text-2xl font-semibold text-soil">
                  Starting with an idea
                </p>
                <p className="mt-3 text-foreground-secondary">
                  Earth-first work — purpose, audience, and positioning —
                  before anything else gets built.
                </p>
                <LinkButton href="/services#brand-beginning" variant="secondary" className="mt-6">
                  Brand Beginning
                </LinkButton>
              </div>
              <div className="border-l-2 border-indigo pl-6">
                <p className="text-xs font-medium uppercase tracking-wide text-action-secondary">
                  Threshold two
                </p>
                <p className="mt-2 font-display text-2xl font-semibold text-soil">
                  Already in business
                </p>
                <p className="mt-3 text-foreground-secondary">
                  An audit first — finding exactly where the story stops
                  holding together.
                </p>
                <LinkButton href="/services#brand-clarity" variant="secondary" className="mt-6">
                  Brand Clarity
                </LinkButton>
              </div>
            </div>
          </Container>
        </section>

        {/* Featured work */}
        <section className="border-t border-border bg-background-alt py-20">
          <Container>
            <div className="flex items-baseline justify-between">
              <h2 className="text-display-sm font-display font-semibold text-soil">Selected work</h2>
              <LinkButton href="/work" variant="secondary">View all work</LinkButton>
            </div>
            <div className="mt-10 grid gap-6 md:grid-cols-3">
              {featured.map((project) => (
                <a
                  key={project.slug}
                  href={`/work/${project.slug}`}
                  className="block rounded-lg border border-border bg-background-elevated p-6 transition-colors hover:border-action-primary/40"
                >
                  <p className="text-xs font-medium uppercase tracking-wide text-foreground-secondary">
                    {project.industry}
                  </p>
                  <p className="mt-2 font-display text-xl font-semibold text-soil">
                    {project.title}
                  </p>
                  <p className="mt-3 text-sm text-foreground-secondary">{project.outcome}</p>
                </a>
              ))}
            </div>
          </Container>
        </section>

        {/* Process */}
        <section className="py-20">
          <Container>
            <h2 className="text-display-sm font-display font-semibold text-soil">How a project moves</h2>
            <ol className="mt-10 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {process.map((stage, i) => (
                <li key={stage.stage} className="relative pl-10">
                  <span className="absolute left-0 top-0 font-display text-2xl font-semibold text-action-primary/50">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <p className="font-display text-lg font-semibold text-soil">{stage.stage}</p>
                  <p className="mt-2 text-sm text-foreground-secondary">{stage.description}</p>
                </li>
              ))}
            </ol>
          </Container>
        </section>

        {/* FAQ */}
        <section className="border-t border-border bg-background-alt py-20">
          <Container className="max-w-2xl">
            <h2 className="text-display-sm font-display font-semibold text-soil">
              Common questions
            </h2>
            <div className="mt-8">
              <FAQ />
            </div>
          </Container>
        </section>

        {/* Final CTA — a widening threshold, marked with the lattice motif */}
        <section className="relative overflow-hidden py-24">
          <IndianPattern className="absolute inset-0" opacity={0.05} />
          <Container className="relative text-center">
            <h2 className="mx-auto max-w-2xl text-display-md font-display font-semibold text-soil">
              Let&apos;s find the Tatva of your business.
            </h2>
            <div className="mt-8">
              <LinkButton href="/contact">Start a brand conversation</LinkButton>
            </div>
          </Container>
        </section>
      </main>
      <Footer />
    </>
  );
}
