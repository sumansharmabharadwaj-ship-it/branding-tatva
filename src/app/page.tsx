import type { Metadata } from "next";
import Link from "next/link";
import { Header } from "@/layouts/Header";
import { Footer } from "@/sections/Footer";
import { Container } from "@/components/Container";
import { AuditInvite } from "@/components/AuditInvite";
import { LinkButton } from "@/components/Button";
import { FAQ } from "@/sections/FAQ";
import { DustMotes } from "@/components/DustMotes";
import { Reveal } from "@/components/Reveal";
import { ClipReveal } from "@/components/ClipReveal";
import { ElementsSection } from "@/sections/Elements";
import { EvidenceWall } from "@/sections/Home/EvidenceWall";
import { ClarityCTA } from "@/sections/Home/ClarityCTA";
import { TatvaStrip } from "@/sections/Home/TatvaStrip";
import { StudioTriptych } from "@/sections/Home/StudioTriptych";
import { CinematicHero } from "@/sections/Hero";
import { VisitorRecognition } from "@/sections/Home/VisitorRecognition";
import { ThreePathsSection } from "@/sections/Home/ThreePathsSection";
import { VideoBreak } from "@/components/VideoBreak";
import { ProcessSection } from "@/sections/Process";
import { BackgroundVideo } from "@/components/BackgroundVideo";
import { TexturedDark } from "@/components/TexturedDark";
import { ScrollProgress } from "@/components/ScrollProgress";
import { site } from "@/data/site";
import { elements } from "@/data/elements";
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
  return (
    <>
      <Header transparent />
      <ScrollProgress />
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
          subhead="Brand positioning, identity, voice, and market presence for founders and existing businesses that need recognition to compound."
        >
          <LinkButton href="/contact">Book a Brand Strategy Session</LinkButton>
          <LinkButton
            href="/work"
            variant="secondary"
            className="border-ivory/30 text-ivory hover:bg-ivory/10"
          >
            Explore the Work
          </LinkButton>
          {/* w-full forces this onto its own line within CinematicHero's
              flex wrap CTA row instead of crowding the two buttons. It
              stays inside the hero's own scrim, so there is no seam
              risk against whatever section follows. Real, verified
              number (Dr. Haley Nutrition, already live on /work), never
              invented social proof. */}
          <p className="w-full text-xs text-ivory/50 sm:text-sm">
            The same process that took one client&apos;s engagement rate from 0.71% to 2.81% in eight weeks. Led
            directly by Suman, start to finish.
          </p>
        </CinematicHero>

        {/* Conversion architecture section two: the visitor identifies
            their situation before anything teaches them. Selection
            persists and Services reads it back. */}
        <VisitorRecognition />

        {/* The generic marquee between recognition and proof was cut
            per Suman's review (item 2): the visitor moves from naming
            their own situation straight into verified evidence, with
            no decorative interlude in between. */}

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
        {/* Suman's board, scene two: the documentary archive replaces
            the "Selected work" heading + two-stage pinned sequence —
            her direct verdict named that pairing the page's weakest
            beat ("Selected Work... then nothing"). Every project now
            arrives as a living file with its verified number or
            recorded decision. */}
        <EvidenceWall />

        {/* Board scene one: the decision moment at the desk — proof
            above hands into a human invitation before the service
            paths ask for a choice. */}
        <ClarityCTA />


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
        {/* Trust and the framework claim used to be two separate
            sections — a video-backed beat cutting straight to flat
            bg-soil right after it, the same "abrupt seam" pattern
            already fixed elsewhere on this page. Merged into one
            TexturedDark instead: one continuous video plays behind both
            blocks, a hairline divider marks the handoff between them
            instead of a hard section cut. higgsfield-idea-sketch.mp4
            (a hand-drawn sketch, pencil, coffee, morning window light —
            a real push-in, not a static shot) replaces both the earlier
            personal-photo montage and a since-rejected static "empty
            room" clip — direct feedback wanted something people
            actually relate to and that visibly moves; a sketchbook
            mid-thought reads as the strategy work itself, not a mood
            board standing in for it. */}
        {/* Suman's layout reference: the studio as a triptych —
            quote card, the three pillars in a cream centre, and the
            working wall — replacing the full-bleed video with floating
            hotspots. */}
        <StudioTriptych />

        {/* Conversion architecture section five: the three commercial
            paths, before the framework teaches the philosophy behind
            them. */}
        <ThreePathsSection />

        {/* Board scene three: the framework arrives as five living
            Tatvas instead of text on brown — the exact block Suman
            flagged. The strip is the trailhead; the full pinned
            exploration below is where "scroll to explore" pays off. */}
        <TatvaStrip />

        <div id="elements" className="scroll-mt-24">
          <ElementsSection elements={elements} />
        </div>


        {/* Was a standalone mid-funnel CTA section here (plain bg-soil,
            no video) — direct, repeated feedback that this and the
            closing Process quote below were both flat text-only breaks
            interrupting otherwise-continuous video sections, reading as
            a visible "seam" rather than one connected scroll. Removed
            entirely rather than video-ified: Home already opens and
            closes on real CTAs, and cutting this one lets Selected
            Work's flame video hand off directly into Process's own
            video heading with no flat interlude between them. */}

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
            <div className="absolute inset-0 bg-soil/80" />
            <Container className="relative">
              <Reveal>
                <h2 className="text-display-sm font-display font-normal text-ivory">How a project moves</h2>
              </Reveal>
            </Container>
          </div>
          <ProcessSection stages={process} elementColor={elementColor} />
          {/* Direct, repeated feedback that this quote sat on bare
              bg-soil right after the pinned journey releases — the exact
              seam complaint above, just at the other end of the same
              section. A second, independent overflow-hidden wrapper
              here (a sibling AFTER ProcessSection, never an ancestor of
              it) keeps PinnedJourney's own sticky mechanism untouched —
              see the comment on the heading div above for why that
              scoping matters. Same roots-and-stream clip as the
              heading: a deliberate visual bookend (open and close the
              section on the same footage) rather than a new clip. */}
          <div className="relative overflow-hidden">
            <BackgroundVideo video="/videos/pixabay-roots-stream.mp4" poster="/images/pixabay-roots-stream-poster.jpg" />
            <div className="absolute inset-0 bg-soil/80" />
            <Container className="relative pb-16 pt-10 text-center sm:pb-20 sm:pt-14">
              <Reveal>
                <p className="mx-auto max-w-lg text-sm italic text-ivory/80 sm:text-base">
                  Skipping a step costs you quietly. The recall you paid for simply stops compounding.
                </p>
              </Reveal>
            </Container>
          </div>
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
          {/* Round three footage (approved pick 4527565): a fog sea catching
              first gold — warm and luminous per the Media OS, replacing
              the flat overcast pines flagged in the round two audit.
              Graded with the sitewide warm LUT. */}
          <BackgroundVideo video="/videos/pexels-golden-fog-sea.mp4" videoWebm="/videos/pexels-golden-fog-sea.webm" poster="/images/pexels-golden-fog-sea-poster.jpg" />
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
                    <FAQ
                      questions={[
                        "Can you help a brand new business?",
                        "Can you help an existing brand that already has an identity?",
                        "Can you actually implement, or just strategize?",
                        "How long does a project take?",
                        "Can we work remotely?",
                      ]}
                    />
                    <p className="mt-6 text-sm">
                      <Link href="/services#book" className="link-underline text-foreground-secondary hover:text-soil">
                        Bring any other question to a first conversation
                      </Link>
                    </p>
                    {/* Lead magnet placement (bible §11) — the audit
                        signpost lives inside this reading section
                        rather than as its own flat interlude after the
                        five decisions; a standalone break there was
                        already removed once as a visible seam. */}
                    <div className="mt-8">
                      <AuditInvite tone="light" />
                    </div>
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
        <VideoBreak
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
                  className="mt-4 text-sm text-ivory/80"
                  style={{ textShadow: "0 1px 6px rgba(0,0,0,0.8)" }}
                >
                  Twenty minutes, a real conversation, zero pitch deck. Honest feedback either way.
                </p>
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
