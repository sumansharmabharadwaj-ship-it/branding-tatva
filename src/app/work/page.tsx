import type { Metadata } from "next";
import { Header } from "@/layouts/Header";
import { Footer } from "@/sections/Footer";
import { Container } from "@/components/Container";
import { Reveal } from "@/components/Reveal";
import { SplitReveal } from "@/components/SplitReveal";
import { PhotoHero } from "@/components/PhotoHero";
import { VideoBreak } from "@/components/VideoBreak";
import { WorkGrid } from "@/sections/CaseStudies";
import { WorkServicesJourney } from "@/sections/Work/WorkServicesJourney";
import { ClipReveal } from "@/components/ClipReveal";
import { AnnotatedVisual } from "@/components/AnnotatedVisual";
import { KineticMarquee } from "@/components/KineticMarquee";
import { SectionJumpNav } from "@/components/SectionJumpNav";
import { ScrollProgress } from "@/components/ScrollProgress";
import { AnimatedStat } from "@/components/AnimatedStat";
import { ElementGlyph } from "@/components/ElementGlyph";
import { projects } from "@/data/projects";
import { elements } from "@/data/elements";

export const metadata: Metadata = {
  title: "Work + Services",
  description: "Proof-led brand strategy services, selected work, deliverables, and a practical brand health check.",
  alternates: { canonical: "/work" },
  openGraph: {
    title: "Work + Services | Branding Tatva",
    description: "Proof-led brand strategy services, selected work, deliverables, and a practical brand health check.",
    type: "website",
  },
};

export default function WorkPage() {
  const industries = [...new Set(projects.map((p) => p.industry))];
  // Real derived fact, not a decorative element grid: which of the five
  // elements at least one real project's own services field actually
  // names, kept in the framework's canonical Earth/Water/Fire/Air/Space
  // order rather than data-insertion order.
  const elementsCovered = elements
    .map((e) => e.slug)
    .filter((slug) => projects.some((p) => p.services.some((s) => s.toLowerCase().startsWith(slug))));

  return (
    <>
      <Header transparent />
      <ScrollProgress />
      <main id="main-content">
        {/* Redesigned from the centered pill-badge-plus-headline template
            every secondary page's hero used to share (identical to
            Services/Blog/Contact) — an asymmetric masthead instead, the
            exact technique already proven on this site's own case-study
            and blog-post templates (large offset headline in one
            column, a real-data aside in the other, a giant faint
            watermark word behind both), just never applied to this
            page's own top-level hero until now. Real industries list
            (already computed below for the numbers strip) fills the
            aside — distinct from that strip's own lead (the project
            count), not a repeat of it. */}
        <PhotoHero
          video="/videos/own-ridge-road.mp4"
          poster="/images/own-ridge-road-poster.jpg"
          minHeight="70vh"
        >
          <span
            aria-hidden="true"
            className="pointer-events-none absolute -top-6 right-0 select-none whitespace-nowrap font-display text-[clamp(4rem,15vw,10rem)] font-bold uppercase leading-none text-ivory/[0.06]"
          >
            Work
          </span>
          <Container className="relative py-20">
            <div className="grid gap-10 lg:grid-cols-[1fr_auto] lg:items-end lg:gap-16">
              <Reveal>
                <span className="inline-flex items-center rounded-full border border-ivory/30 px-4 py-1.5 text-[0.65rem] font-medium uppercase tracking-[0.25em] text-ivory/85">
                  Work + Services
                </span>
                <SplitReveal
                  as="h1"
                  className="mt-6 max-w-2xl font-display text-[clamp(2.4rem,6.5vw,4.5rem)] font-normal leading-[1.05] text-ivory"
                >
                  Proof first. Then the path that fits.
                </SplitReveal>
                <p className="mt-4 max-w-lg text-ivory/80">
                  See the work, understand the mechanism, and choose a starting point without guessing.
                </p>
              </Reveal>
              <Reveal delay={0.1} className="flex flex-row flex-wrap gap-2 lg:max-w-56 lg:flex-col lg:items-end lg:pb-2">
                {industries.map((industry) => (
                  <span
                    key={industry}
                    className="rounded-full border border-ivory/25 px-3 py-1 text-xs text-ivory/85 lg:text-right"
                  >
                    {industry}
                  </span>
                ))}
              </Reveal>
            </div>
          </Container>
        </PhotoHero>

        {/* Direct feedback pointed at alethia.earth/solutions/nature-based's
            "OUR SOLUTION" section as the technique to borrow — a photo
            with dot-and-line callouts, not another card grid — but the
            first pass leaned too hard on the reference itself: an
            isolated single tree, same composition, same idea, not just
            the same technique. Swapped for a brass compass instead —
            takes the "one clear object explains it" gist without
            reproducing what alethia's own asset actually shows, and
            ties into "starts with real direction" more literally than a
            tree did. Added here, not in place of the project grid
            below: those five projects are genuinely distinct case
            studies someone needs to click into individually, the same
            reason alethia's own case-study list stays a normal list
            further down their page. This explains the method behind
            all five before the grid, the one thing a card grid can't
            easily say on its own. */}
        <section className="bg-background-alt py-20 sm:py-28">
          <Container>
            <Reveal>
              <AnnotatedVisual
                image="/images/higgsfield-brass-compass.jpg"
                alt=""
                callouts={[
                  {
                    dotTop: "38%",
                    dotLeft: "44%",
                    side: "left",
                    title: "A real audit, built for your actual market",
                    text: "I look at what's actually happening in your market first, then build a plan specific to where your brand stands today.",
                  },
                  {
                    dotTop: "58%",
                    dotLeft: "56%",
                    side: "right",
                    title: "One connected system, start to finish",
                    text: "Positioning, identity, and content built to carry the same throughline, from the first conversation to the last deliverable.",
                  },
                ]}
              />
            </Reveal>
          </Container>
        </section>

        {/* A section-transition beat between the compass explainer and
            the project grid — this page had no divider at all between
            its two flat-light sections. Reuses the exact industry list
            already stated in this page's own hero subhead above, not
            new copy. */}
        <KineticMarquee text="MARKETPLACES · WELLNESS · D2C · ENTERPRISE · COACHING" />

        {/* Redesigned: the industries list here duplicated the exact
            same real data the new hero aside above now already shows,
            and the section itself read as a plain flex row rather than
            a real moment. The count now counts up on scroll (the same
            AnimatedStat device the case-study numbers sections already
            use, real motion instead of a static digit), and the second
            fact is a genuinely different one: which of the five
            elements real client work has actually touched, derived
            directly from every project's own services field, not a
            repeated industries list or a decorative element grid for
            its own sake. */}
        <section className="bg-soil py-16 sm:py-20">
          <Container>
            <Reveal className="flex flex-col items-center gap-10 text-center sm:flex-row sm:items-end sm:justify-between sm:text-left">
              <div>
                <p className="font-display text-6xl font-normal text-sandstone sm:text-7xl">
                  <AnimatedStat value={String(projects.length)} />
                </p>
                <p className="mt-2 text-sm text-ivory/80">Real client engagements, each one different.</p>
              </div>
              <div>
                <p className="text-xs font-medium uppercase tracking-wide text-ivory/60 sm:text-right">
                  Every element, in real work
                </p>
                <div className="mt-3 flex justify-center gap-4 sm:justify-end">
                  {elementsCovered.map((slug) => (
                    <ElementGlyph
                      key={slug}
                      slug={slug}
                      className="h-6 w-6 text-sandstone"
                      strokeWidth={1.3}
                    />
                  ))}
                </div>
              </div>
            </Reveal>
          </Container>
        </section>

        {/* Was bold solid Soil, matching every other photo/video section
            site-wide — but per direct feedback pointing at the reference
            site's own restraint, a card grid doesn't need that: these
            cards are already dark, self-contained photographic tiles, so
            they read as their own visual weight regardless of what's
            behind them. Letting them sit on the site's own light neutral
            instead lets the photography carry the color, the same way
            the reference's own image-forward sections do. */}
        {/* bg-background-alt lives on the outer section now, outside
            ClipReveal — clip-path:inset(...100%...) hides an element's
            entire rendered box, background-color included, so wrapping
            the whole section meant a slow-to-fire reveal trigger showed
            blank page background instead of this section's own fill
            during fast real-device scrolling. Same fix as Home's
            PerspectiveReveal/ClipReveal sections and VerticalUnfold's
            element rows. */}
        <section id="proof" className="scroll-mt-24 bg-background-alt py-16">
          <ClipReveal>
            <Container>
              <WorkGrid projects={projects} />
            </Container>
          </ClipReveal>
        </section>

        {/* Was a static image (higgsfield-canopy-light.jpg) under a quote
            that is literally about "a forest of noise" — real cinematic
            footage instead, sourced and verified this session: sunbeams
            breaking through mist in a real forest (Pexels, id 33237395,
            standard Pexels license, free for commercial use, no
            attribution required), trimmed to an 8s loop and re-encoded
            at 1080p/crf22 (5.6MB, verified via frame extraction against
            the original before compressing further). The copy's own
            metaphor is now the thing actually on screen, not a
            coincidentally-similar stock photo. */}
        <VideoBreak
          src="/videos/pexels-misty-forest-sunbeams.mp4"
          poster="/images/pexels-misty-forest-sunbeams-poster.jpg"
          quote="Every one of these projects started in a forest of noise, the same place yours is starting from."
          height="60vh"
        />

        <WorkServicesJourney />
      </main>
      <Footer />
      <SectionJumpNav
        items={[
          { href: "#proof", label: "Proof" },
          { href: "#mechanism", label: "Mechanism" },
          { href: "#services", label: "Services" },
          { href: "#health-check", label: "Health" },
          { href: "#questions", label: "FAQ" },
        ]}
      />
    </>
  );
}
