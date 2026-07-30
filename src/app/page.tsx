import type { Metadata } from "next";
import { Header } from "@/layouts/Header";
import { Footer } from "@/sections/Footer";
import { Container } from "@/components/Container";
import { LinkButton } from "@/components/Button";
import { FAQ } from "@/sections/FAQ";
import { DustMotes } from "@/components/DustMotes";
import { Reveal } from "@/components/Reveal";
import { KineticMarquee } from "@/components/KineticMarquee";
import { ClipReveal } from "@/components/ClipReveal";
import { ElementsSection } from "@/sections/Elements";
import { SelectedWorkPinned } from "@/sections/Home/SelectedWorkPinned";
import { CinematicHero } from "@/sections/Hero";
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
          subhead="Strategy, identity, and content built around the five things every remembered brand gets right: purpose, experience, expression, voice, and presence. The real reason people notice a brand, trust it, and come back to it."
        >
          <LinkButton href="/contact">Let&apos;s build the version of your brand people remember</LinkButton>
          <LinkButton
            href="/work"
            variant="secondary"
            className="border-ivory/30 text-ivory hover:bg-ivory/10"
          >
            Explore the work
          </LinkButton>
          {/* w-full forces this onto its own line within CinematicHero's
              flex wrap CTA row instead of crowding the two buttons. It
              stays inside the hero's own scrim, so there is no seam
              risk against whatever section follows. Real, verified
              number (Dr. Haley Nutrition, already live on /work), never
              invented social proof. */}
          <p className="w-full text-xs text-ivory/50 sm:text-sm">
            The same process that took one client&apos;s engagement rate from 0.71% to 2.81% in eight weeks.
          </p>
        </CinematicHero>

        {/* Direct feedback that this section, ElementsIntro, the two
            atmospheric quote breaks below, and Threshold all read as
            "useless" — cut and the videos kept on disk (not deleted)
            rather than reused elsewhere for now. What used to live here:
            a "clarity problem" text passage over cinematic-waterlight.mp4.
            Marquee now leads straight from Hero into the elements grid. */}
        {/* Was "EARTH · WATER · FIRE · AIR · SPACE" — direct feedback
            that bare element names are pure philosophy with zero
            business meaning, right before the section that explains
            them. Real branding vocabulary instead, doing actual work
            instead of decoration. */}
        <KineticMarquee text="POSITIONING · DISTINCTIVENESS · MENTAL AVAILABILITY · CATEGORY DESIGN · BRAND SALIENCE" />

        {/* New trust beat — direct feedback that the page went straight
            from the hero's emotional hook to the elements framework
            (Authority) with zero credibility established first, breaking
            the requested Attention → Curiosity → Trust → Authority
            sequence. Real credential, never padding. */}
        {/* Expanded from a single credibility line into real, verifiable
            credentials plus a factual count, for Phase 3 (Trust
            Building). Testimonials and client logos are deliberately
            absent here: real material exists for neither yet, and
            inventing them would break the same commercial-honesty
            standard the rest of this site's copy holds to. Credentials
            pulled directly from data/about.ts (M.A. Clinical Psychology,
            B.A. English Literature, both real, dated, verifiable); "5
            real client engagements" is a literal count of projects.ts,
            never a round invented number. Specific per-project proof
            (MyShopInEurope, Executive Springboard, Dr. Haley's real
            stats) already lives in the Selected work section below,
not repeated here. */}
        <section className="bg-soil py-14 text-center">
          <Container>
            <Reveal>
              <p className="font-display text-lg text-ivory sm:text-xl">Suman Sharma</p>
              <p className="mx-auto mt-2 max-w-xl text-sm text-ivory/70 sm:text-base">
                Clinical psychology and English literature, applied to brand strategy. A working method, the actual reason perception, memory, and trust get treated as a discipline here.
              </p>
              <div className="mx-auto mt-6 flex max-w-2xl flex-wrap items-center justify-center gap-x-6 gap-y-3 text-xs uppercase tracking-[0.15em] text-ivory/50 sm:text-sm">
                <span>M.A. Clinical Psychology</span>
                <span aria-hidden="true" className="h-1 w-1 rounded-full bg-ivory/30" />
                <span>B.A. (Hons) English Literature</span>
                <span aria-hidden="true" className="h-1 w-1 rounded-full bg-ivory/30" />
                <span>5 real client engagements</span>
              </div>
            </Reveal>
          </Container>
        </section>

        {/* Direct feedback the site needed to lead with real branding
            theory before naming the elements framework: branding as
            five decisions every remembered brand makes, then the
            elements as the explanatory device underneath that claim.
            Also folds in the requested consumer-psychology angle: why
            memory, trust, and choice actually work the way they do. */}
        <section className="bg-soil pb-10 pt-4 sm:pb-14">
          <Container className="max-w-2xl text-center">
            <Reveal>
              <p className="text-sm font-medium uppercase tracking-wide text-sandstone">The framework</p>
              <h2 className="mt-2 text-display-sm font-display font-normal text-ivory">
                Branding means five decisions every remembered brand makes.
              </h2>
              <p className="mt-4 text-ivory/75">
                Positioning. Distinctiveness. Narrative. Verbal identity. Salience. The language changes by agency. The decisions stay the same, because human memory, trust, and choice work the same way regardless of who is doing the branding.
              </p>
            </Reveal>
          </Container>
        </section>

        <ElementsSection elements={elements} />

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
                <div>
                  <h2 className="text-display-sm font-display font-normal text-ivory">Selected work</h2>
                  <p className="mt-2 text-sm italic text-ivory/70">
                    Real projects, real numbers, verified after launch. Everything below actually happened.
                  </p>
                </div>
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

        {/* Soft mid-funnel CTA — direct feedback that the page only had
            one ask at the very top and one at the very bottom. Desire
            peaks right after seeing real proof, and a visitor ready
            here deserves a link before Process/FAQ. Curiosity-driven
            copy, distinct from the hero's and closing CTA's own text,
            matching what a reader actually wants at this point: proof
            of a fit, before a full booking commitment. */}
        <section className="bg-soil py-10 text-center">
          <Container>
            <Reveal>
              <LinkButton
                href="/contact"
                variant="secondary"
                className="border-ivory/30 text-ivory hover:bg-ivory/10"
              >
                Let&apos;s uncover the perception your market already has
              </LinkButton>
            </Reveal>
          </Container>
        </section>

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
          <Container className="pb-16 pt-4 text-center sm:pb-20">
            <Reveal>
              <p className="mx-auto max-w-lg text-sm italic text-ivory/70 sm:text-base">
                Skipping a step costs you quietly. The recall you paid for simply stops compounding.
              </p>
            </Reveal>
          </Container>
        </section>

        {/* Threshold ("every brand starts at one of two thresholds") used
            to sit here — direct feedback called it out as useless along
            with the other video-quote interludes on this page, cut
            entirely. Its routing job (starting fresh vs. already in
            business) already lives on Services' own packages section
            (#brand-beginning/#brand-clarity), so nothing is lost, just
            not duplicated on Home too. Videos kept on disk, not deleted. */}

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
                Let&apos;s find the Tatva of your business, the layer that makes people remember you long after they have simply seen you.
              </h2>
              <div className="mt-8">
                <LinkButton href="/contact">Book a Brand Strategy Session</LinkButton>
                <p
                  className="mt-4 text-sm text-ivory/70"
                  style={{ textShadow: "0 1px 6px rgba(0,0,0,0.8)" }}
                >
                  Twenty minutes, a real conversation, zero pitch deck. Honest feedback either way.
                </p>
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
