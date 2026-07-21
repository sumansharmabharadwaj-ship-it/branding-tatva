import type { Metadata } from "next";
import { Header } from "@/layouts/Header";
import { Footer } from "@/sections/Footer";
import { Container } from "@/components/Container";
import { LinkButton } from "@/components/Button";
import { FAQ } from "@/sections/FAQ";
import { DustMotes } from "@/components/DustMotes";
import { Reveal } from "@/components/Reveal";
import { SplitReveal } from "@/components/SplitReveal";
import { KineticMarquee } from "@/components/KineticMarquee";
import { PerspectiveReveal } from "@/components/PerspectiveReveal";
import { GradientSections } from "@/components/GradientSections";
import { FeaturedSecondaryCard } from "@/components/FeaturedSecondaryCard";
import { ElementsConstellation } from "@/components/ElementsConstellation";
import { ElementsSection } from "@/sections/Elements";
import { CinematicHero } from "@/sections/Hero";
import { Threshold } from "@/sections/Threshold";
import { VideoBreak } from "@/components/VideoBreak";
import { FeaturedWorkHero } from "@/components/FeaturedWorkHero";
import { ProcessSection } from "@/sections/Process";
import { BackgroundVideo } from "@/components/BackgroundVideo";
import { site } from "@/data/site";
import { elements } from "@/data/elements";
import { projects } from "@/data/projects";
import { process } from "@/data/process";
import { faqs } from "@/data/faqs";
import { elementColor } from "@/lib/elementColor";
import { sectionWash, ELEMENT_HEX } from "@/lib/sectionWash";

// Previously relied entirely on the root layout's default title/description
// — functional, but means "/" never explicitly owns its own metadata (no
// page-specific canonical, no way to tune the homepage's own OG/Twitter
// copy independent of the site-wide fallback used everywhere else).
export const metadata: Metadata = {
  title: `${site.name}: Brand Strategy by ${site.founder}`,
  description: site.description,
  alternates: { canonical: "/" },
  openGraph: {
    title: `${site.name}: Brand Strategy by ${site.founder}`,
    description: site.description,
    url: site.url,
    type: "website",
  },
};

// The homepage's FAQ section (src/sections/FAQ) already has 8 real,
// substantive question/answer pairs — this was the single highest-value
// AEO gap on the site: zero structured markup on real FAQ content,
// meaning search engines' FAQ rich results and AI answer engines had no
// explicit machine-readable signal for it, only the rendered accordion
// text to infer from.
const faqStructuredData = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: faqs.map((faq) => ({
    "@type": "Question",
    name: faq.question,
    acceptedAnswer: { "@type": "Answer", text: faq.answer },
  })),
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
            as one long unbroken chapter rather than two boxed sections.
            This used to be a flat Sage text block sitting on top of a
            separate VideoBreak below it — three different attempts to
            put motion behind the text block on its own (an abstract
            clip, a CSS glow, then a second instance of this same video)
            each failed on either aesthetic fit or the site's own
            no-repeat rule. The actual fix: there's only one video here
            now. VideoBreak's new topContent slot renders the heading
            and paragraph inside the SAME video instance the quote
            already uses below it, so the whole passage is one
            continuous cinematic moment — cinematic-waterlight.mp4
            appears exactly once in the codebase, not twice. */}
        <VideoBreak
          src="/videos/cinematic-waterlight.mp4"
          poster="/images/cinematic-waterlight-poster.jpg"
          quote="Attention is the first thing any brand has to earn."
          height="145vh"
          cameraPush
          wordFade
          spotlight
          topContent={
            <div className="grid gap-8 sm:grid-cols-2 sm:items-start sm:gap-16">
              <SplitReveal className="font-display text-[clamp(2rem,5vw,3.75rem)] font-normal leading-[1.1] text-ivory">
                A brand can be visible and still go unnoticed.
              </SplitReveal>
              <Reveal delay={0.15}>
                <div className="max-w-md space-y-4 text-ivory/75 sm:ml-auto sm:text-right">
                  <p>
                    Being present differs from being recognised.
                    Looking attractive differs from communicating
                    clearly. Posting content differs from building
                    recall.
                  </p>
                  <p>
                    That gap is usually a{" "}
                    <span className="font-semibold text-ivory underline decoration-sandstone underline-offset-4">
                      clarity problem
                    </span>
                    , far more often than a visibility one.
                  </p>
                </div>
              </Reveal>
            </div>
          }
        />

        {/* pt-* lives on the section itself, not a margin-top on the
            child below — a child's top margin with nothing (no padding/
            border) on the parent to contain it collapses straight
            through and pushes the whole section's rendered box down,
            leaving the "spacing" show as a gap of the page's own cream
            above the section instead of space inside it. That's what
            was producing the blank gap right after the waterlight video
            — the sage color was real, it just started ~110px lower than
            its own <section> tag implied. Padding can't collapse the
            same way, and the values are tightened (not just moved) —
            direct feedback that this gap read as dead space even before
            the collapse bug was diagnosed. */}
        <section className="relative pt-14 pb-20 sm:pt-20 sm:pb-24" style={{ backgroundColor: ELEMENT_HEX.air }}>
          {/* Was a faint own-peaks.jpg background — one more mountain/ridge
              photo on a site that already has several (Footer, Home
              elements row, Services, Work hero), even without repeating
              the exact file. Dropped rather than reaching for another
              nature shot just to fill the space; flat Sage carries this
              transitional text block fine on its own, same as the
              section above it. Copy tightened from three paragraphs to
              two — the "most brands only have one or two" contrast and
              the personal closing line were saying adjacent things and
              read as padding rather than two distinct points. */}
          <div className="relative">
            <Container className="relative">
              <div className="grid gap-8 sm:grid-cols-2 sm:items-start sm:gap-16">
                <Reveal className="sm:order-2">
                  <h2 className="font-display text-[clamp(2rem,5vw,3.75rem)] font-normal leading-[1.1] text-ivory sm:text-right">
                    Five elements.
                    <br />
                    One brand.
                  </h2>
                </Reveal>
                <Reveal delay={0.15} className="sm:order-1">
                  <div className="max-w-md space-y-4 text-ivory/75">
                    <p>
                      Every brand needs the same five things: something
                      solid to stand on, a way of moving through
                      someone&apos;s day, a spark that earns a second look,
                      a voice, and the consistency that gets remembered.
                      Earth, water, fire, air, and space, dressed up as
                      a theme.
                    </p>
                    <p>
                      Most brands are built with one or two. The ones
                      people remember use all five, working as one
                      system —{" "}
                      <span className="font-medium text-ivory">
                        the method behind every project below, and the
                        one I&apos;d use on yours
                      </span>
                      .
                    </p>
                  </div>
                </Reveal>
              </div>
            </Container>
          </div>
        </section>

        <KineticMarquee text="EARTH · WATER · FIRE · AIR · SPACE" />

        {/* Five elements — a slow vertical unfolding, not a grid of cards.
            PerspectiveReveal (a camera-push settle, not ClipReveal's
            curtain-wipe) marks this as its own chapter after the
            marquee, since the two sections look nothing alike.
            ElementsSection (the pinned slider on desktop) deliberately
            sits OUTSIDE this section and outside PerspectiveReveal —
            `position: sticky` breaks the moment any ancestor has
            `overflow` other than visible (this section's own
            overflow-hidden, kept for the constellation glyphs and the
            watermark word) or a transform/filter mid-animation
            (PerspectiveReveal's own scale+blur entrance). Nesting the
            sticky slider inside either produced exactly the bug this
            replaces: the slide showed once, then the rest of the
            sequence never appeared, since sticky was resolving against
            the wrong containing block instead of the real page scroll. */}
        <PerspectiveReveal>
          <section className="relative overflow-hidden border-t border-border pt-16 pb-28 sm:pt-20 sm:pb-40">
            {/* Was a near-white-to-near-white gradient (#F4EFE6 to
                #EFE4D9, both plain cream) — direct feedback that this
                read as blank space rather than a real section, the same
                complaint the Process wash already got fixed for. A real
                earth wash (this section leads straight into the Earth
                slide of the pinned sequence below it) instead of another
                shade of cream. */}
            <div
              className="absolute inset-0"
              style={{
                background: `linear-gradient(180deg, ${sectionWash("earth", 20)} 0%, ${sectionWash("earth", 40)} 100%)`,
              }}
            />
            <ElementsConstellation />
            <Container className="relative">
            {/* Ghost watermark word, same technique as the case-study
                block numerals (.case-study-block::before in globals.css)
                extended to a word instead of a numeral — one signature
                moment, not applied to every heading site-wide. */}
            <span
              aria-hidden="true"
              className="pointer-events-none absolute -top-4 left-0 select-none whitespace-nowrap font-display text-[clamp(3rem,11vw,9rem)] font-bold leading-none text-soil/[0.06] sm:-top-8"
            >
              ELEMENTS
            </span>
            <Reveal>
              <h2 className="relative text-display-sm font-display font-normal text-soil">
                The five elements
              </h2>
              <p className="mt-3 max-w-md text-sm text-foreground-secondary">
                Every project moves through some version of all five, in
                this order. Here&apos;s what each one actually covers, and
                what it looks like when it&apos;s missing.
              </p>
            </Reveal>
          </Container>
          </section>
        </PerspectiveReveal>

        <ElementsSection elements={elements} />

        {/* Real footage, not the AI-generated architectural interior this
            replaced — that read as a real estate/architecture site, not
            a philosophical branding practice. A forest stream with mossy,
            unmoving boulders steadying its banks is the same idea the
            quote makes, just found in nature instead of illustrated with
            a building. */}
        <VideoBreak
          src="/videos/own-forest-stream.mp4"
          poster="/images/own-forest-stream-poster.jpg"
          quote="The parts that stay still are usually the ones holding everything else up."
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
              image: "/images/own-canopy.jpg",
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
              image: "/images/higgsfield-forest-stream-poster.jpg",
              video: "/videos/higgsfield-forest-stream.mp4",
              gradient: "linear-gradient(180deg, rgba(39,34,30,0.25) 0%, rgba(39,34,30,0.9) 100%)",
              ctaLabel: "Brand Clarity",
              ctaHref: "/services#brand-clarity",
              activeHeading: "Then you're finding where the story breaks.",
            },
          ]}
        />

        {/* Bold solid Soil, not the previous pale cream-to-near-cream
            drift — matches the same "grid of dark photographic cards
            sits on Soil" rule now applied to every other card-grid
            section site-wide (Services offerings, Work grid, Blog grid). */}
        <section className="bg-soil py-20 sm:py-28">
          {/* Featured work — one large photographic entry, two quiet
              editorial ones, not three identical cards */}
          <div>
            <Container>
              <Reveal>
                <div className="flex items-baseline justify-between">
                  <h2 className="text-display-sm font-display font-normal text-ivory">Selected work</h2>
                  <LinkButton
                    href="/work"
                    variant="secondary"
                    className="border-ivory/30 text-ivory hover:bg-ivory/10"
                  >
                    View all work
                  </LinkButton>
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
                  image={featured[0].cardImage ?? "/images/own-forest-clearing.jpg"}
                  industry={featured[0].industry}
                  title={featured[0].title}
                  outcome={featured[0].outcome}
                  stats={featured[0].stats}
                  accent={featured[0].accent}
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
          </div>
        </section>

        <VideoBreak
          src="/videos/higgsfield-lone-pine.mp4"
          poster="/images/higgsfield-lone-pine-poster.jpg"
          quote="Every strong brand has a moment like this, quiet, and completely sure of itself."
          height="92vh"
        />

        {/* Process and FAQ used to share one GradientSections wrapper
            drifting between two near-identical creams — audit found this
            as one of the longest "blank" runs on the site. Split into two
            washes, each in its own element-color family, so the two
            sections read as genuinely distinct rather than one long
            beige stretch. The strengths here (8/16) still computed to
            within a few RGB values of plain cream — direct feedback that
            the section right after the alpenglow-peak video still read
            as blank space, not a deliberate transition. Pushed strong
            enough to read as a real steel-blue-grey tint at a glance. */}
        <GradientSections colors={[sectionWash("water", 25), sectionWash("water", 45)]}>
          {/* Process — the horizontal-pinned treatment (desktop, motion
              allowed) needs to break out of Container's max-w-6xl to read
              as full-bleed, so it sits as a sibling after it rather than
              nested inside; the mobile/reduced-motion ProcessJourney
              fallback stays comfortable at that width regardless. */}
          <section className="py-20 sm:py-28">
            <Container>
              <Reveal>
                <h2 className="text-display-sm font-display font-normal text-soil">How a project moves</h2>
              </Reveal>
            </Container>
            <ProcessSection stages={process} elementColor={elementColor} />
          </section>
        </GradientSections>

        {/* Had zero photo/video at all — direct feedback that it read as
            flat and empty next to every other section on the site.
            higgsfield-forest-light.mp4 (a Seedance 2.0 generation,
            replacing the earlier static higgsfield-architecture-columns.jpg
            per direct feedback wanting motion here too): tall pines in a
            hazy valley, a quiet visual echo of "finding clarity" without
            illustrating the FAQ content literally. Kept as a light cream
            wash rather than the dark overlay Process/Five-Elements use,
            since FAQ's own accordion styling (soil text, clay hover) is
            built for a light backdrop — flipping it to dark would mean
            re-doing that component's states for one section, not worth
            it here. */}
        <section className="relative overflow-hidden py-20 sm:py-28">
          <BackgroundVideo video="/videos/higgsfield-forest-light.mp4" poster="/images/higgsfield-forest-light-poster.jpg" />
          <div
            className="absolute inset-0"
            style={{ backgroundImage: "linear-gradient(180deg, rgba(244,239,230,0.82) 0%, rgba(244,239,230,0.88) 100%)" }}
          />
          <Container className="relative max-w-2xl">
            <Reveal>
              <h2 className="text-display-sm font-display font-normal text-soil">
                Common questions
              </h2>
            <div className="mt-8">
              <FAQ />
            </div>
          </Reveal>
        </Container>
        </section>

        {/* Closing chapter — the contemplative statement and the final CTA
            used to be two separate sections (a video break, then a flat
            dark panel cut in right below it). Merged into one continuous
            video-backed section so the quiet moment carries straight
            through into the invitation, instead of the visual abruptly
            resetting between them. Was 210vh — nothing about this
            section's content scales with height (the quote and CTA just
            center within whatever space they're given; parallax/
            cameraPush are self-contained motion, not scroll-gated
            reveals), so the extra height was pure empty video before the
            centered content ever appeared. Direct, repeated feedback
            that this specific section felt long and boring. */}
        <VideoBreak
          src="/videos/own-moonlit-sea.mp4"
          poster="/images/own-moonlit-sea-poster.jpg"
          quote="Some things only become visible once everything else goes quiet."
          height="min(900px, 108vh)"
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
                className="mx-auto max-w-xl text-display-md font-display font-normal text-ivory"
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
      <script
        type="application/ld+json"
        // eslint-disable-next-line react/no-danger
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqStructuredData) }}
      />
    </>
  );
}
