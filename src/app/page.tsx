import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Container } from "@/components/Container";
import { LinkButton } from "@/components/Button";
import { FAQ } from "@/components/FAQ";
import { DustMotes } from "@/components/DustMotes";
import { Reveal } from "@/components/Reveal";
import { Testimonials } from "@/components/Testimonials";
import { ElementsRail } from "@/components/ElementsRail";
import { KineticMarquee } from "@/components/KineticMarquee";
import { GradientSections } from "@/components/GradientSections";
import { KenBurnsImage } from "@/components/KenBurnsImage";
import { ElementGlyph } from "@/components/ElementGlyph";
import { ElementsConstellation } from "@/components/ElementsConstellation";
import { CinematicHero } from "@/components/CinematicHero";
import { ImageBreak } from "@/components/ImageBreak";
import { VideoBreak } from "@/components/VideoBreak";
import { FeaturedWorkHero } from "@/components/FeaturedWorkHero";
import { site } from "@/data/site";
import { elements } from "@/data/elements";
import { projects } from "@/data/projects";
import { process } from "@/data/process";

// Text-only palette for the Process step numerals. Fire uses a darkened
// ochre here (vs. the shared #C28A28 token) since the brand ochre falls
// under 3:1 contrast against the parchment section background at this size.
const elementColor: Record<string, string> = {
  Earth: "#B85A34",
  Water: "#24394D",
  Fire: "#A5752A",
  Air: "#5C6B4A",
  Space: "#AD6F5C",
};


export default function Home() {
  const featured = projects.filter((p) => p.featured);

  return (
    <>
      <Header transparent />
      <main id="main-content">
        <CinematicHero
          video="/videos/hero-forest-sanctuary.mp4"
          poster="/images/hero-forest-sanctuary-poster.jpg"
          imagePosition="30% 40%"
          badge="Brand strategy for founders & existing businesses"
          headline={
            <>
              Most brands are visible. Very few are{" "}
              <span className="italic text-clay">remembered</span>.
            </>
          }
          subhead={site.tagline}
        >
          <LinkButton href="/contact">Start a brand conversation</LinkButton>
          <LinkButton
            href="/work"
            variant="secondary"
            className="border-ivory/30 text-ivory hover:bg-ivory/10"
          >
            Explore the work
          </LinkButton>
        </CinematicHero>

        {/* Two-part editorial statement — the problem, then the philosophy,
            as one long unbroken chapter rather than two boxed sections. */}
        <section className="border-t border-border py-28 sm:py-40">
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
                  That gap is usually a <span className="font-semibold text-action-primary-hover">clarity problem</span>,
                  far more often than a visibility one.
                </p>
              </div>
            </Reveal>
          </Container>

          <div className="mt-20 sm:mt-28">
            <VideoBreak
              src="/videos/cinematic-pines.mp4"
              poster="/images/cinematic-pines-poster.jpg"
              quote="Attention is the first thing any brand has to earn."
              height="85vh"
              overlayGradient="linear-gradient(180deg, rgba(20,17,14,0.2) 0%, rgba(20,17,14,0.6) 35%, rgba(20,17,14,0.6) 65%, rgba(20,17,14,0.35) 90%, #F4EFE6 100%)"
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

        <KineticMarquee text="EARTH · WATER · FIRE · AIR · SPACE" />

        {/* Five elements — a slow vertical unfolding, not a grid of cards */}
        <section className="relative overflow-hidden border-t border-border py-28 sm:py-40">
          <div
            className="absolute inset-0"
            style={{
              background:
                "linear-gradient(180deg, #F4EFE6 0%, #EFE4D9 100%)",
            }}
          />
          <ElementsConstellation />
          <Container className="relative">
            <Reveal>
              <h2 className="text-display-sm font-display font-semibold text-soil">
                The five elements
              </h2>
              <p className="mt-3 max-w-md text-sm text-foreground-secondary">
                The same convergence that shapes an actual brand: separate
                parts finding one shared center.
              </p>
            </Reveal>
          </Container>

          <ElementsRail elements={elements} />

          <div className="mt-16 divide-y divide-border sm:mt-24">
            {elements.map((el, i) => (
              <Reveal key={el.slug} delay={i * 0.06}>
                <div className="relative overflow-hidden">
                  <div
                    className="absolute inset-0"
                    aria-hidden="true"
                    style={{
                      backgroundImage: `linear-gradient(${el.color}, ${el.color}), url(${el.image})`,
                      backgroundBlendMode: "color",
                      backgroundSize: "cover",
                      backgroundPosition: "center",
                      opacity: 0.16,
                    }}
                  />
                  <Container>
                  <div
                    id={el.slug}
                    className={`relative grid items-baseline gap-4 py-10 sm:grid-cols-[auto_1fr_1.2fr] sm:gap-10 sm:py-14 ${
                      i % 2 === 1 ? "sm:text-right" : ""
                    }`}
                  >
                    <div className={`flex items-baseline gap-3 ${i % 2 === 1 ? "sm:flex-row-reverse" : ""}`}>
                      <span
                        className="font-display text-[clamp(3rem,7vw,5.5rem)] font-semibold leading-none opacity-[0.22]"
                        style={{ color: el.color }}
                      >
                        {String(i + 1).padStart(2, "0")}
                      </span>
                      <ElementGlyph
                        slug={el.slug}
                        className="h-7 w-7 shrink-0 opacity-70 sm:h-9 sm:w-9"
                        style={{ color: el.color }}
                      />
                    </div>
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
                </div>
              </Reveal>
            ))}
          </div>
        </section>

        <ImageBreak
          image="/images/own-peaks.jpg"
          quote="The parts that don't move are usually the ones holding everything else up."
          height="72vh"
          overlayGradient="linear-gradient(180deg, #EFE4D9 0%, rgba(20,17,14,0.55) 16%, rgba(20,17,14,0.55) 78%, #F4EFE6 100%)"
        />

        {/* Two brand pathways — a real diptych, not two bordered text blocks */}
        <section>
          <h2 className="container-page pt-20 text-center font-display text-display-sm font-semibold text-soil">
            Every brand starts at one of two thresholds
          </h2>
          <div className="mt-12 grid min-h-[70vh] sm:grid-cols-2">
            <Reveal className="relative flex min-h-[50vh] items-end overflow-hidden bg-soil p-8 sm:min-h-0 sm:p-12">
              <KenBurnsImage
                image="/images/own-ridge-road.jpg"
                gradient="linear-gradient(180deg, rgba(39,34,30,0.25) 0%, rgba(39,34,30,0.9) 100%)"
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
              <KenBurnsImage
                image="/images/own-pond.jpg"
                gradient="linear-gradient(180deg, rgba(39,34,30,0.25) 0%, rgba(39,34,30,0.9) 100%)"
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

        <GradientSections colors={["#F4EFE6", "#EEE4DB"]}>
          {/* Featured work — one large photographic entry, two quiet
              editorial ones, not three identical cards */}
          <section className="py-20 sm:py-28">
            <Container>
              <Reveal>
                <div className="flex items-baseline justify-between">
                  <h2 className="text-display-sm font-display font-semibold text-soil">Selected work</h2>
                  <LinkButton href="/work" variant="secondary">View all work</LinkButton>
                </div>
              </Reveal>
            </Container>

            {featured[0] && (
              <Reveal delay={0.1} className="mt-10">
                {/* Photo: Andreas Schnabl via Pexels, free for commercial
                    use. The two other real-photo mountain shots on this
                    page needed a visually distinct backdrop here, not a
                    third variation on the same dusk-peak look. */}
                <FeaturedWorkHero
                  href={`/work/${featured[0].slug}`}
                  image="/images/pexels-forest-path.jpg"
                  industry={featured[0].industry}
                  title={featured[0].title}
                  outcome={featured[0].outcome}
                />
              </Reveal>
            )}

            <Container>
              <div className="mt-10 grid gap-10 sm:grid-cols-2">
                {featured.slice(1).map((project, i) => (
                  <Reveal key={project.slug} delay={i * 0.1}>
                    <a
                      href={`/work/${project.slug}`}
                      className="group relative flex min-h-[22rem] flex-col justify-end overflow-hidden rounded-lg p-6 sm:p-8"
                    >
                      {project.cardImage && (
                        <KenBurnsImage
                          image={project.cardImage}
                          gradient="linear-gradient(0deg, rgba(39,34,30,0.9) 0%, rgba(39,34,30,0.45) 55%, rgba(39,34,30,0.15) 100%)"
                        />
                      )}
                      <div className="relative border-t-2 pt-4" style={{ borderColor: project.accent }}>
                        <p className="text-xs font-medium uppercase tracking-wide text-ivory/70">
                          {project.industry}
                        </p>
                        <p className="mt-2 font-display text-2xl font-semibold text-ivory transition-colors group-hover:text-clay">
                          {project.title}
                        </p>
                        <p className="mt-3 text-sm text-ivory/80">{project.outcome}</p>
                      </div>
                    </a>
                  </Reveal>
                ))}
              </div>
            </Container>
          </section>

          {/* Testimonials */}
          <section className="py-20">
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
        </GradientSections>

        {/* Stretched larger and fading in from the same cream tone the
            testimonials section ends on, so it reads as one continuous
            scene opening up rather than a hard cut into a separate photo
            block. */}
        <ImageBreak
          image="/images/own-alpenglow-peak.jpg"
          quote="Every strong brand has a moment like this — quiet, and completely sure of itself."
          height="92vh"
          imagePosition="center 38%"
          overlayGradient="linear-gradient(180deg, #EEE4DB 0%, rgba(20,17,14,0.1) 14%, rgba(20,17,14,0.15) 82%, #EFE4D9 100%)"
        />

        <GradientSections colors={["#EFE4D9", "#F1EADE"]}>
          {/* Process */}
          <section className="py-20">
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
          <section className="py-20">
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
        </GradientSections>

        {/* Closing chapter — the contemplative statement and the final CTA
            used to be two separate sections (a video break, then a flat
            dark panel cut in right below it). Merged into one continuous
            video-backed section so the quiet moment carries straight
            through into the invitation, instead of the visual abruptly
            resetting between them. */}
        <VideoBreak
          src="/videos/own-moonlit-sea.mp4"
          poster="/images/own-moonlit-sea-poster.jpg"
          quote="Some things only become visible once everything else goes quiet."
          height="min(1500px, 185vh)"
          imagePosition="50% 12%"
          quoteVariant="statement"
          parallax
          overlayGradient="linear-gradient(180deg, rgba(20,17,14,0.7) 0%, rgba(20,17,14,0.3) 30%, rgba(20,17,14,0.3) 55%, rgba(20,17,14,0.92) 88%, #E8DED0 100%)"
        >
          <DustMotes />
          <div className="relative">
            <div className="relative">
              <h2
                className="mx-auto max-w-xl text-display-md font-display font-semibold text-ivory"
                style={{ textShadow: "0 2px 14px rgba(0,0,0,0.85), 0 1px 4px rgba(0,0,0,0.9)" }}
              >
                Let&apos;s find the Tatva of your business.
              </h2>
              <div className="mt-8">
                <LinkButton href="/contact">Start a brand conversation</LinkButton>
              </div>
            </div>
          </div>
        </VideoBreak>
      </main>
      <Footer />
    </>
  );
}
