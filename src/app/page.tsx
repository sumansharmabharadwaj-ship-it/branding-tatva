import type { Metadata } from "next";
import { Header } from "@/layouts/Header";
import { Footer } from "@/sections/Footer";
import { Container } from "@/components/Container";
import { LinkButton } from "@/components/Button";
import { FAQ } from "@/sections/FAQ";
import { DustMotes } from "@/components/DustMotes";
import { Reveal } from "@/components/Reveal";
import { ScatterReveal } from "@/components/ScatterReveal";
import { KineticMarquee } from "@/components/KineticMarquee";
import { ClipReveal } from "@/components/ClipReveal";
import { ElementsSection } from "@/sections/Elements";
import { ElementsIntro } from "@/sections/Elements/ElementsIntro";
import { SelectedWorkPinned } from "@/sections/Home/SelectedWorkPinned";
import { CinematicHero } from "@/sections/Hero";
import { PinnedThreshold } from "@/components/PinnedThreshold";
import { PinnedVideoBreak } from "@/components/PinnedVideoBreak";
import { ProcessSection } from "@/sections/Process";
import { BackgroundVideo } from "@/components/BackgroundVideo";
import { site } from "@/data/site";
import { elements } from "@/data/elements";
import { projects } from "@/data/projects";
import { process } from "@/data/process";
import { faqs } from "@/data/faqs";
import { elementColor } from "@/lib/elementColor";

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
        <PinnedVideoBreak
          src="/videos/cinematic-waterlight.mp4"
          poster="/images/cinematic-waterlight-poster.jpg"
          quote="Attention is the first thing any brand has to earn."
          height="145vh"
          cameraPush
          wordFade
          spotlight
          topContent={
            <div className="grid gap-8 sm:grid-cols-2 sm:items-start sm:gap-16">
              {/* Was SplitReveal (calm word fade) — this is the single
                  showcase spot for ScatterReveal's more dramatic
                  scattered-to-settled entrance instead, the site's own
                  version of the kinetic-typography intro technique. */}
              <ScatterReveal className="font-display text-[clamp(2rem,5vw,3.75rem)] font-normal leading-[1.1] text-ivory">
                A brand can be visible and still go unnoticed.
              </ScatterReveal>
              <div className="max-w-md space-y-4 text-ivory/75 sm:ml-auto sm:text-right">
                <Reveal delay={0.15}>
                  <p>
                    Being present differs from being recognised.
                    Looking attractive differs from communicating
                    clearly. Posting content differs from building
                    recall.
                  </p>
                </Reveal>
                <Reveal delay={0.25}>
                  <p>
                    That gap is usually a{" "}
                    <span className="font-semibold text-ivory underline decoration-sandstone underline-offset-4">
                      clarity problem
                    </span>
                    , far more often than a visibility one.
                  </p>
                </Reveal>
              </div>
            </div>
          }
        />

        {/* pt-* lives on the section itself, not a margin-top on the
            child below — a child's top margin with nothing (no padding/
            border) on the parent to contain it collapses straight
            through and pushes the whole section's rendered box down,
            leaving the "spacing" show as a gap of the page's own cream
            above the section instead of space inside it. Padding can't
            collapse the same way, and the values are tightened (not
            just moved) — direct feedback that this gap read as dead
            space even before the collapse bug was diagnosed. */}
        {/* Pilot: these two sections ("Five elements. One brand." and
            "The five elements" intro) used to scroll past independently.
            Direct feedback pointed at ElementsSection's own PinnedSlider
            as the feeling to extend, so they're now one pinned 2-stage
            cinematic sequence leading straight into it — see
            ElementsIntro's own comment for the full reasoning and why
            this stays scoped to just these two sections rather than the
            whole page. Desktop/motion-allowed only; mobile and reduced
            motion get these same two sections back in normal document
            flow, unchanged from before this pilot. */}
        <ElementsIntro />

        <KineticMarquee text="EARTH · WATER · FIRE · AIR · SPACE" />

        <ElementsSection elements={elements} />

        {/* Was own-forest-stream.mp4 — direct feedback wanting something
            more alive: a lush green, cinematic flowing river instead.
            pixabay-emerald-river.mp4 (vivid turquoise-green water over
            mossy rocks, tall grass framing the bank) still carries the
            same idea the quote makes — motion and stillness sitting
            together in one frame — just with real color and life to it
            instead of a duller, quieter clip. */}
        <PinnedVideoBreak
          src="/videos/pixabay-emerald-river.mp4"
          poster="/images/pixabay-emerald-river-poster.jpg"
          quote="The parts that stay still are usually the ones holding everything else up."
          height="72vh"
          cameraPush
          spotlight
        />

        {/* Was flat bg-soil — direct feedback that the heading zone here
            still read as a blank gap between the elements grid above and
            the actual case-study imagery below. Fire fits a section about
            the work that earned a second look — pixabay-flame-texture.mp4
            (an abstract, tight flame-texture shot, distinct from the
            elements grid's own campfire-with-wood clip so the same
            footage doesn't repeat on this page). Was
            higgsfield-element-fire.mp4, an indoor theatrical stage set
            with a film projector on a table — direct feedback that this
            broke the site's natural-outdoor-footage standard, the same
            class of mismatch the old mislabeled Air clip had. */}
        {/* Heading kept as its own section, separate from the pinned
            work content below — SelectedWorkPinned relies on
            position: sticky, which breaks the moment an ancestor has
            overflow other than visible (this section's own
            overflow-hidden, kept for the fire video). Same fix pattern
            as every other pinned section on this page. */}
        <section className="relative overflow-hidden bg-soil py-20 sm:py-28">
          <BackgroundVideo video="/videos/pixabay-flame-texture.mp4" poster="/images/pixabay-flame-texture-poster.jpg" />
          <div className="absolute inset-0 bg-soil/60" />
          <Container className="relative">
            <div className="flex items-baseline justify-between">
              <Reveal>
                <h2 className="text-display-sm font-display font-normal text-ivory">Selected work</h2>
              </Reveal>
              <Reveal delay={0.1}>
                <LinkButton
                  href="/work"
                  variant="secondary"
                  className="border-ivory/30 text-ivory hover:bg-ivory/10"
                >
                  View all work
                </LinkButton>
              </Reveal>
            </div>
          </Container>
        </section>

        {/* Featured work — one large photographic entry, two quiet
            editorial ones, not three identical cards. Same pinned
            mechanism as PinnedSlider/PinnedJourney; see
            SelectedWorkPinned's own comment for why it's 2 stages, not
            3, and why neither card component conflicts with permanent
            mounting + opacity toggling. */}
        <SelectedWorkPinned featured={featured} />

        <PinnedVideoBreak
          src="/videos/higgsfield-lone-pine.mp4"
          poster="/images/higgsfield-lone-pine-poster.jpg"
          quote="Every strong brand has a moment like this, quiet, and completely sure of itself."
          height="92vh"
          wordFade
          spotlight
        />

        {/* Was solid Indigo (before that, a pale blue-gray wash) — one
            more one-off hue in a page that already had Sage and Clay
            elsewhere, the exact color-cycling this round removes. Soil,
            matching every other flat section on the page now; the
            GradientSections scroll-interpolation wrapper this used to
            need (blending between two near-identical Indigo tints) isn't
            needed for a single flat color, so it's gone along with the
            import. Process — the horizontal-pinned treatment (desktop,
            motion allowed) needs to break out of Container's max-w-6xl
            to read as full-bleed, so it sits as a sibling after the
            heading rather than nested inside it; the mobile/reduced-
            motion ProcessJourney fallback stays comfortable at that
            width regardless. */}
        <section className="bg-soil">
          {/* overflow-hidden scoped to this heading div only, not the
              outer section — ProcessSection's own PinnedJourney relies
              on `position: sticky`, which breaks the moment any ancestor
              has overflow other than visible (see PinnedJourney's own
              comment). Was flat bg-soil here too, direct feedback that
              the heading zone before the pinned stages begin still read
              as a blank gap; pixabay-roots-stream.mp4 (moss-covered
              roots framing a small forest stream) fills it, fitting
              since this heading introduces the whole process — roots as
              the foundation the other five stages build on, the stream
              as the first sign of movement. Was
              higgsfield-element-earth.mp4, architectural blueprints on
              an indoor desk — the same natural-outdoor-footage mismatch
              found across several of this row's clips this round. */}
          <div className="relative overflow-hidden py-20 sm:py-28">
            <BackgroundVideo video="/videos/pixabay-roots-stream.mp4" poster="/images/pixabay-roots-stream-poster.jpg" />
            <div className="absolute inset-0 bg-soil/60" />
            <Container className="relative">
              <Reveal>
                <h2 className="text-display-sm font-display font-normal text-ivory">How a project moves</h2>
              </Reveal>
            </Container>
          </div>
          <ProcessSection stages={process} elementColor={elementColor} />
        </section>

        {/* Moved here from between the elements grid and Selected work —
            that position interrupted "here's the method, here's it in
            action" with an unrelated qualification question mid-story.
            By this point in the page a visitor has seen the method (Five
            Elements), the proof (Selected work), and the mechanism
            (Process) — "which of these two are you" now reads as a
            natural personalized next step into FAQ/CTA, not an
            interruption. Two brand pathways — an interactive
            split-screen, not two bordered text blocks. See
            sections/Threshold. */}
        <PinnedThreshold
          heading="Every brand starts at one of two thresholds"
          panels={[
            {
              key: "left",
              eyebrow: "Threshold one",
              title: "Starting with an idea",
              description:
                "Earth first work: purpose, audience, and positioning, before anything else gets built.",
              image: "/images/higgsfield-forest-trail-mist-poster.jpg",
              video: "/videos/higgsfield-forest-trail-mist.mp4",
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

        {/* Had zero photo/video at all — direct feedback that it read as
            flat and empty next to every other section on the site.
            higgsfield-forest-light.mp4 (a Seedance 2.0 generation,
            replacing the earlier static higgsfield-architecture-columns.jpg
            per direct feedback wanting motion here too): tall pines in a
            hazy valley, a quiet visual echo of "finding clarity" without
            illustrating the FAQ content literally.
            The wash went through two rounds already: 0.82-0.88 (crushed
            the video to nothing) then 0.48-0.58 (direct feedback that it
            still needed "more clarity" and vibrancy). This round
            separates the two concerns instead of tuning one wash to
            serve both: the video itself is re-graded (+35% saturation,
            +15% contrast) so it actually reads as vivid rather than
            hazy, the section wash drops further (down to 0.18-0.28) to
            let that vividness show, and the FAQ content moves onto its
            own solid card instead of floating directly on the video —
            so a busier, more saturated background can't compete with
            the text for attention. */}
        {/* BackgroundVideo/overlay sit outside ClipReveal now, not
            wrapped by it — same fix as the PerspectiveReveal section
            above and VerticalUnfold's element rows. ClipReveal's
            initial state clips its *entire* children to zero height,
            so nesting the whole section (background included) inside
            it meant a slow-to-fire reveal trigger left the whole
            section blank/cream during real mobile scrolling. Reveal is
            scoped to the content card only now — that's also the part
            with a real "mode-shift" boundary to mark (the card itself
            wiping into view), while the ambient backdrop video is
            always present underneath it. */}
        <section className="relative overflow-hidden py-20 sm:py-28">
          {/* Light chapter giving way from the dark Selected-work grid
              above — the same real mode-shift ClipReveal already marks
              on Services and Work, just running the other direction
              (dark to light instead of light to dark) since that's the
              actual boundary here. */}
          <BackgroundVideo video="/videos/higgsfield-forest-light-vivid.mp4" poster="/images/higgsfield-forest-light-vivid-poster.jpg" />
          <div
            className="absolute inset-0"
            style={{ backgroundImage: "linear-gradient(180deg, rgba(244,239,230,0.18) 0%, rgba(244,239,230,0.28) 100%)" }}
          />
          <ClipReveal>
            <Container className="relative max-w-2xl">
              <Reveal>
                <div className="rounded-2xl border border-border/50 bg-background-elevated/92 px-6 py-10 shadow-elevation-md backdrop-blur-sm sm:px-14 sm:py-16">
                  <h2 className="text-display-sm font-display font-normal text-soil">
                    Common questions
                  </h2>
                  <div className="mt-8">
                    <FAQ />
                  </div>
                </div>
              </Reveal>
            </Container>
          </ClipReveal>
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
            that this specific section felt long and boring.
            higgsfield-silver-tide.mp4 — a brief round swapped this for
            higgsfield-verdant-hills.mp4 (the green hills clip, moved to
            the Contact page instead per direct feedback), then reverted
            back to this one per direct feedback preferring the night sea
            here after all. */}
        <PinnedVideoBreak
          src="/videos/higgsfield-silver-tide.mp4"
          poster="/images/higgsfield-silver-tide-poster.jpg"
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
        </PinnedVideoBreak>
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
