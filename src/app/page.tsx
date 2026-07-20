import Image from "next/image";
import { Header } from "@/layouts/Header";
import { Footer } from "@/sections/Footer";
import { Container } from "@/components/Container";
import { LinkButton } from "@/components/Button";
import { FAQ } from "@/sections/FAQ";
import { DustMotes } from "@/components/DustMotes";
import { Reveal } from "@/components/Reveal";
import { SplitReveal } from "@/components/SplitReveal";
import { ElementsRail } from "@/components/ElementsRail";
import { KineticMarquee } from "@/components/KineticMarquee";
import { PerspectiveReveal } from "@/components/PerspectiveReveal";
import { GradientSections } from "@/components/GradientSections";
import { FeaturedSecondaryCard } from "@/components/FeaturedSecondaryCard";
import { ElementGlyph } from "@/components/ElementGlyph";
import { ElementReveal } from "@/components/ElementReveal";
import { ElementRowBackground } from "@/components/ElementRowBackground";
import { ElementsConstellation } from "@/components/ElementsConstellation";
import { CinematicHero } from "@/sections/Hero";
import { Threshold } from "@/sections/Threshold";
import { ImageBreak } from "@/components/ImageBreak";
import { VideoBreak } from "@/components/VideoBreak";
import { FeaturedWorkHero } from "@/components/FeaturedWorkHero";
import { ProcessSection } from "@/sections/Process";
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
            <SplitReveal className="max-w-3xl font-display text-[clamp(2rem,5vw,3.75rem)] font-semibold leading-[1.1] text-soil">
              A brand can be visible and still go unnoticed.
            </SplitReveal>
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
              src="/videos/cinematic-waterlight.mp4"
              poster="/images/cinematic-waterlight-poster.jpg"
              quote="Attention is the first thing any brand has to earn."
              height="85vh"
              cameraPush
              wordFade
              spotlight
            />
          </div>

          {/* Own-peaks silhouette, very faint, behind this text block only —
              the text block between the waterlight video and the Five
              Elements section's own photography was previously flat cream
              for its full height, the kind of "text on a plain background"
              stretch the site otherwise avoids. Many sharp peaks under one
              continuous sky doubles as a quiet visual echo of "five
              elements, one brand" without illustrating it literally. */}
          <div className="relative mt-20 overflow-hidden sm:mt-28">
            <Image
              src="/images/own-peaks.jpg"
              alt=""
              fill
              priority
              sizes="100vw"
              className="object-cover"
              style={{ opacity: 0.1 }}
            />
            <Container className="relative">
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
                  <p>
                    Most brands are built with one or two of these — a logo
                    with no positioning behind it, a content calendar with no
                    voice tying it together. The ones people remember are
                    built with all five, working as one system.
                  </p>
                  <p className="font-medium text-soil">
                    That&apos;s not a mood board. It&apos;s the actual method
                    behind every project below, and the one I&apos;d use on
                    yours.
                  </p>
                </div>
              </Reveal>
            </Container>
          </div>
        </section>

        <KineticMarquee text="EARTH · WATER · FIRE · AIR · SPACE" />

        {/* Five elements — a slow vertical unfolding, not a grid of cards.
            PerspectiveReveal (a camera-push settle, not ClipReveal's
            curtain-wipe) marks this as its own chapter after the
            marquee, since the two sections look nothing alike. */}
        <PerspectiveReveal>
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
                Every project moves through some version of all five, in
                this order. Here&apos;s what each one actually covers, and
                what it looks like when it&apos;s missing.
              </p>
            </Reveal>
          </Container>

          <ElementsRail elements={elements} />

          <div className="mt-16 divide-y divide-border sm:mt-24">
            {elements.map((el, i) => (
              <ElementReveal key={el.slug} slug={el.slug} delay={i * 0.06}>
                <div className="relative overflow-hidden">
                  <ElementRowBackground image={el.image} video={el.video} color={el.color} />
                  <Container>
                  <div
                    id={el.slug}
                    className={`relative grid items-baseline gap-4 rounded-xl bg-background/55 px-4 py-10 backdrop-blur-[2px] sm:grid-cols-[auto_1fr_1.2fr] sm:gap-10 sm:bg-transparent sm:px-0 sm:py-14 sm:backdrop-blur-none ${
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
              </ElementReveal>
            ))}
          </div>
          </section>
        </PerspectiveReveal>

        <ImageBreak
          image="/images/higgsfield-architecture-columns.jpg"
          quote="The parts that don't move are usually the ones holding everything else up."
          height="72vh"
        />

        {/* Two brand pathways — an interactive split-screen, not two
            bordered text blocks. See sections/Threshold. */}
        <Threshold
          heading="Every brand starts at one of two thresholds"
          panels={[
            {
              key: "left",
              eyebrow: "Threshold one",
              title: "Starting with an idea",
              description:
                "Earth first work: purpose, audience, and positioning, before anything else gets built.",
              image: "/images/higgsfield-idea-sketch.jpg",
              video: "/videos/higgsfield-idea-sketch.mp4",
              gradient: "linear-gradient(180deg, rgba(39,34,30,0.25) 0%, rgba(39,34,30,0.9) 100%)",
              ctaLabel: "Brand Beginning",
              ctaHref: "/services#brand-beginning",
              activeHeading: "Then you're building the foundation first.",
            },
            {
              key: "right",
              eyebrow: "Threshold two",
              title: "Already in business",
              description:
                "An audit first, finding exactly where the story stops holding together.",
              image: "/images/higgsfield-stream-clarity.jpg",
              video: "/videos/higgsfield-stream-clarity.mp4",
              gradient: "linear-gradient(180deg, rgba(39,34,30,0.25) 0%, rgba(39,34,30,0.9) 100%)",
              ctaLabel: "Brand Clarity",
              ctaHref: "/services#brand-clarity",
              activeHeading: "Then you're finding where the story breaks.",
            },
          ]}
        />

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
                {/* The project's own cardImage/heroVideo world (see
                    data/projects.ts) rather than a separate hardcoded
                    photo — this is the same brand this project's case
                    study page and Work grid card already use, not a
                    third, unrelated backdrop for the same entry. */}
                <FeaturedWorkHero
                  href={`/work/${featured[0].slug}`}
                  image={featured[0].cardImage ?? "/images/higgsfield-forest-path.jpg"}
                  industry={featured[0].industry}
                  title={featured[0].title}
                  outcome={featured[0].outcome}
                  stats={featured[0].stats}
                />
              </Reveal>
            )}

            <Container>
              <div className="mt-10 grid gap-10 sm:grid-cols-2">
                {featured.slice(1).map((project, i) => (
                  <Reveal key={project.slug} delay={i * 0.1}>
                    <FeaturedSecondaryCard project={project} />
                  </Reveal>
                ))}
              </div>
            </Container>
          </section>
        </GradientSections>

        <VideoBreak
          src="/videos/higgsfield-confident-light.mp4"
          poster="/images/higgsfield-confident-light-poster.jpg"
          quote="Every strong brand has a moment like this — quiet, and completely sure of itself."
          height="92vh"
        />

        <GradientSections colors={["#EFE4D9", "#F1EADE"]}>
          {/* Process — the horizontal-pinned treatment (desktop, motion
              allowed) needs to break out of Container's max-w-6xl to read
              as full-bleed, so it sits as a sibling after it rather than
              nested inside; the mobile/reduced-motion ProcessJourney
              fallback stays comfortable at that width regardless. */}
          <section className="py-20">
            <Container>
              <Reveal>
                <h2 className="text-display-sm font-display font-semibold text-soil">How a project moves</h2>
              </Reveal>
            </Container>
            <ProcessSection stages={process} elementColor={elementColor} />
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
          height="min(1750px, 210vh)"
          imagePosition="50% 12%"
          quoteVariant="statement"
          parallax
          cameraPush
          wordFade
          overlayGradient="linear-gradient(180deg, rgba(20,17,14,0.35) 0%, rgba(20,17,14,0.15) 30%, rgba(20,17,14,0.2) 55%, rgba(20,17,14,0.9) 100%)"
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
