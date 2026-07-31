import type { Metadata } from "next";
import { Header } from "@/layouts/Header";
import { Footer } from "@/sections/Footer";
import { Container } from "@/components/Container";
import { Reveal } from "@/components/Reveal";
import { SplitReveal } from "@/components/SplitReveal";
import { PhotoHero } from "@/components/PhotoHero";
import { ImageBreak } from "@/components/ImageBreak";
import { WorkGrid } from "@/sections/CaseStudies";
import { ClipReveal } from "@/components/ClipReveal";
import { AnnotatedVisual } from "@/components/AnnotatedVisual";
import { KineticMarquee } from "@/components/KineticMarquee";
import { TexturedDark } from "@/components/TexturedDark";
import { LinkButton } from "@/components/Button";
import { ScrollProgress } from "@/components/ScrollProgress";
import { projects } from "@/data/projects";

export const metadata: Metadata = {
  title: "Work",
  description: "Selected brand and content strategy work.",
  alternates: { canonical: "/work" },
  openGraph: {
    title: "Work | Branding Tatva",
    description: "Selected brand and content strategy work.",
    type: "website",
  },
};

export default function WorkPage() {
  const industries = [...new Set(projects.map((p) => p.industry))];

  return (
    <>
      <Header transparent />
      <ScrollProgress />
      <main id="main-content">
        <PhotoHero
          video="/videos/own-ridge-road.mp4"
          poster="/images/own-ridge-road-poster.jpg"
          minHeight="70vh"
        >
          <Container className="relative py-20 text-center">
            <Reveal>
              <span className="inline-flex items-center rounded-full border border-ivory/30 px-4 py-1.5 text-[0.65rem] font-medium uppercase tracking-[0.25em] text-ivory/85">
                Work
              </span>
              <SplitReveal
                as="h1"
                className="mx-auto mt-6 max-w-2xl font-display text-[clamp(2rem,4.5vw,3.25rem)] font-normal leading-[1.1] text-ivory"
              >
                Projects across very different categories.
              </SplitReveal>
              <p className="mx-auto mt-4 max-w-xl text-ivory/70">
                Marketplaces, executive coaching, wellness, D2C supplements,
                enterprise technology: different industries, the same
                underlying method.
              </p>
            </Reveal>
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

        {/* Direct feedback that this page stayed uniformly light from the
            compass explainer straight through to the closing CTA, the
            one page on the site with no dark chapter until the very end.
            Real facts already stated on this page (the project count,
            the industry list from the hero subhead), given a moment of
            visual weight rather than new stats. */}
        <section className="bg-soil py-14">
          <Container>
            <Reveal className="flex flex-col items-center gap-8 text-center sm:flex-row sm:justify-between sm:text-left">
              <div>
                <p className="font-display text-5xl font-normal text-sandstone sm:text-6xl">
                  {projects.length}
                </p>
                <p className="mt-2 text-sm text-ivory/70">Real client engagements, each one different.</p>
              </div>
              <div className="flex flex-wrap justify-center gap-2 sm:justify-end">
                {industries.map((industry) => (
                  <span
                    key={industry}
                    className="rounded-full border border-ivory/25 px-3 py-1 text-xs text-ivory/75"
                  >
                    {industry}
                  </span>
                ))}
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
        <section className="bg-background-alt py-16">
          <ClipReveal>
            <Container>
              <WorkGrid projects={projects} />
            </Container>
          </ClipReveal>
        </section>

        <ImageBreak
          image="/images/higgsfield-canopy-light.jpg"
          quote="Every one of these projects started in a forest of noise, the same place yours is starting from."
          height="60vh"
        />

        {/* This page used to end on the ImageBreak above with no next
            step — every other page (Home, About, Services, Contact)
            closes with an explicit CTA. Same TexturedDark + ClipReveal
            + LinkButton combination Services already proves at its own
            closing section. */}
        <TexturedDark image="/images/higgsfield-forest-path.jpg" className="py-24 text-center sm:pb-28">
          <ClipReveal>
            <Container>
              <h2 className="text-display-md font-display font-normal text-ivory">
                Want a project like these on your own brand?
              </h2>
              <p className="mx-auto mt-4 max-w-md text-ivory/70">
                Every one of these started with a conversation about where
                the brand actually stood. Yours can start the same way.
              </p>
              <div className="mt-8">
                <LinkButton href="/contact">Book a Brand Strategy Session</LinkButton>
              </div>
            </Container>
          </ClipReveal>
        </TexturedDark>
      </main>
      <Footer />
    </>
  );
}
