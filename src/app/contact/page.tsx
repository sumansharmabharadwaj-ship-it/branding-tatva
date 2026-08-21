import type { Metadata } from "next";
import Link from "next/link";
import { Header } from "@/layouts/Header";
import { Footer } from "@/sections/Footer";
import { Container } from "@/components/Container";
import { ContactForm } from "@/components/ContactForm";
import { Reveal } from "@/components/Reveal";
import { SplitReveal } from "@/components/SplitReveal";
import { PhotoHero } from "@/components/PhotoHero";
import { VideoBreak } from "@/components/VideoBreak";
import { CalendlyEmbed } from "@/components/CalendlyEmbed";
import { ElementGlyph } from "@/components/ElementGlyph";
import { NatureAccent } from "@/components/NatureAccent";
import { Fireflies } from "@/components/Fireflies";
import { AmbientElementShader } from "@/components/AmbientElementShader";
import { ScrollProgress } from "@/components/ScrollProgress";
import { BackgroundVideo } from "@/components/BackgroundVideo";
import { LinkButton } from "@/components/Button";
import { site } from "@/data/site";
import { credentials } from "@/data/about";
import { projects } from "@/data/projects";
import { SANDSTONE, ELEMENT_HEX } from "@/lib/sectionWash";
import { ContactDecisionSequence } from "@/sections/Contact/ContactDecisionSequence";

export const metadata: Metadata = {
  title: "Book a Brand Strategy Session",
  description: "Bring one unresolved brand question to Suman Sharma and begin a private, pressure-free strategy conversation.",
  alternates: { canonical: "/contact" },
  openGraph: {
    title: `Book a Brand Strategy Session | ${site.name}`,
    description: "Bring one unresolved brand question to Suman Sharma and begin a private, pressure-free strategy conversation.",
    type: "website",
  },
};

export default function ContactPage() {
  const enquiryDeliveryReady = Boolean(
    process.env.RESEND_API_KEY?.trim() &&
      process.env.CONTACT_TO_EMAIL?.trim() &&
      process.env.CONTACT_FROM_EMAIL?.trim(),
  );

  const structuredData = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "ContactPage",
        "@id": `${site.url}/contact/#page`,
        url: `${site.url}/contact`,
        name: "Book a Brand Strategy Session",
        description:
          "Bring one unresolved brand question to Suman Sharma and begin a private, pressure-free strategy conversation.",
        isPartOf: { "@id": `${site.url}/#website` },
        about: { "@id": `${site.url}/#organization` },
        mainEntity: { "@id": `${site.url}/about/#person` },
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Home", item: site.url },
          { "@type": "ListItem", position: 2, name: "Contact", item: `${site.url}/contact` },
        ],
      },
    ],
  };

  return (
    <>
      <Header transparent />
      <ScrollProgress />
      <main id="main-content">
        {/* Every other page on the site opens on a real video/photo
            hero; this page used to open directly on a flat color
            section instead, the one structural outlier in an otherwise
            consistent pattern. Tier 3 (70vh), the same as Services/
            Work — matches PhotoHero's own documented height-tier
            table. higgsfield-forest-light.mp4 (trees opening onto a
            clear valley view) was picked specifically because it
            echoes this page's own existing VideoBreak quote below: "A
            brand conversation is just the first clear view through the
            noise." */}
        {/* Redesigned from the same centered pill-badge-plus-headline
            template Work/Services/Blog's heroes used to share into the
            asymmetric masthead already proven on this site's case-study
            and blog-post templates — a large offset headline, a real
            byline-style aside (name and real credentials, the same
            meta-column job the blog post template gives to date and
            author), and a giant faint watermark word behind both.
            Distinct from the fuller credentials/count line that sits
            just above the form further down this page: that one is the
            final reassurance right before a visitor commits, this one
            is the immediate "who am I actually talking to" signal, the
            same two-jobs-one-fact pattern a masthead and a byline
            already play on any real publication. */}
        <PhotoHero
          video="/videos/higgsfield-forest-light.mp4"
          poster="/images/higgsfield-forest-light-poster.jpg"
          minHeight="70vh"
        >
          {/* Every other atmospheric hero on the site (About's forest
              backdrop) carries a small ambient layer on top of the
              video; this one was the plain video-plus-gradient every
              other page's hero already is, missing the one touch that
              gives About's hero its "considered, not just footage"
              feel. Same forest register as this hero's own clip, not a
              new visual idea introduced just for this page. */}
          <Fireflies />
          <span
            aria-hidden="true"
            className="pointer-events-none absolute -top-6 right-0 select-none whitespace-nowrap font-display text-[clamp(4rem,15vw,10rem)] font-bold uppercase leading-none text-ivory/[0.06]"
          >
            Contact
          </span>
          <Container className="relative py-20">
            <div className="grid gap-10 lg:grid-cols-[1fr_auto] lg:items-end lg:gap-16">
              <Reveal className="relative">
                <NatureAccent
                  variant="butterfly"
                  className="pointer-events-none absolute -top-6 left-8 hidden h-9 w-9 text-ivory/20 sm:block"
                />
                <span className="inline-flex items-center rounded-full border border-ivory/30 px-4 py-1.5 text-[0.65rem] font-medium uppercase tracking-[0.25em] text-ivory/85">
                  Contact
                </span>
                <SplitReveal
                  as="h1"
                  className="mt-6 max-w-2xl font-display text-[clamp(2.4rem,6.5vw,4.5rem)] font-normal leading-[1.05] text-ivory"
                >
                  Tell me what your brand is becoming.
                </SplitReveal>
                <p className="mt-4 max-w-lg text-ivory/80">
                  Begin with the decision that brought you here. Share only
                  the context that will make the first reply useful.
                </p>
              </Reveal>
              <Reveal delay={0.1} className="lg:pb-2 lg:text-right">
                <p className="font-display text-lg text-ivory">{site.founder}</p>
                <p className="mt-1 text-sm text-ivory/70">Founder, {site.name}</p>
                <p className="mt-1 text-sm text-ivory/70">Reads every enquiry personally</p>
              </Reveal>
            </div>
          </Container>
        </PhotoHero>

        {/* Was a one-off terracotta wash (earth blended 22%) — its own
            color, distinct from every other light section on the site.
            Sandstone now: the same single light-anchor tone About uses
            for its own opening section. The heading/intro copy above
            moved into the new hero; this section now carries just the
            form and the direct-contact links.
            Redesign pass: this is the single most consequential section
            on the entire site, the actual conversion moment, yet it was
            the flattest, a solid color with text and form fields and
            nothing else, while every other section on this page now
            has real depth. AmbientElementShader (the one deliberately
            restrained WebGL moment already proven safe on Services,
            color and light only, no 3D objects) gives it quiet
            atmosphere instead of a flat fill, at the same low opacity
            Services already uses on comparable light sections. */}
        <section id="project-enquiry" className="relative scroll-mt-24 overflow-hidden pb-20 pt-16 sm:pb-28 sm:pt-20" style={{ backgroundColor: SANDSTONE }}>
          <AmbientElementShader opacity={0.14} />
          <Container className="relative grid gap-12 lg:grid-cols-5">
            <Reveal className="lg:col-span-2">
              <p className="text-sm font-medium uppercase tracking-wide text-action-secondary">
                Reach me directly
              </p>
              <div className="mt-3 space-y-2 text-sm text-foreground-secondary">
                {site.email ? (
                  <p>
                    Prefer email?{" "}
                    <a href={`mailto:${site.email}`} className="text-action-primary-hover link-underline">
                      {site.email}
                    </a>
                  </p>
                ) : (
                  <p>Use the enquiry form. Every message is reviewed directly by Suman.</p>
                )}
                <p>
                  <a
                    href={site.social.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-action-primary-hover link-underline"
                  >
                    Connect on LinkedIn
                  </a>
                </p>
              </div>

              {/* Real trust indicator, placed where a first-time visitor
                  is actually deciding whether to fill in the form, not
                  buried elsewhere on the page. Same real facts and same
                  dot-separator presentation Home's own Trust beat
                  already uses (page.tsx), not a new device and not a
                  fabricated testimonial or client logo. */}
              <div className="mt-6 flex flex-wrap items-center gap-x-3 gap-y-2 border-t border-soil/10 pt-5 text-xs uppercase tracking-[0.1em] text-foreground-secondary">
                {credentials
                  .filter((c) => c.featured)
                  .map((c) => (
                    <span key={c.label} className="inline-flex items-center gap-3">
                      {c.label}
                      <span aria-hidden="true" className="h-1 w-1 rounded-full bg-soil/25" />
                    </span>
                  ))}
                <span>{projects.length} real client engagements</span>
              </div>

              <div className="mt-8 border-l border-clay/35 pl-5">
                <p className="font-display text-xl font-normal text-soil">Direct, private, pressure-free.</p>
                <p className="mt-2 text-sm leading-6 text-foreground-secondary">
                  Suman reads each enquiry. Context is used to understand the work, and the first reply leaves both sides free to decide whether a project makes sense.
                </p>
                <Link href="/work" className="mt-3 inline-flex text-sm font-medium text-action-primary-hover link-underline">
                  Review the documented work
                </Link>
              </div>
            </Reveal>

            <Reveal delay={0.1} className="lg:col-span-3">
              <ContactForm deliveryEnabled={enquiryDeliveryReady} />
            </Reveal>
          </Container>

          <Container className="relative mt-16 grid gap-8 border-t border-soil/10 pt-12 lg:grid-cols-[1.15fr_0.85fr] lg:gap-14">
            <Reveal>
              <ContactDecisionSequence />
            </Reveal>

            <Reveal delay={0.08}>
              <div className="rounded-2xl border border-soil/10 bg-parchment/75 p-6 sm:p-8">
                <p className="text-sm font-medium uppercase tracking-[0.16em] text-action-secondary">
                  A useful starting fit
                </p>
                <h2 className="mt-3 font-display text-2xl font-normal text-soil">
                  The work begins where an important brand choice is unresolved.
                </h2>
                <ul className="mt-6 space-y-4 text-sm leading-6 text-foreground-secondary">
                  {[
                    "A business is launching, repositioning or making an existing brand easier to recognise.",
                    "Leadership needs clarity across positioning, message, identity, architecture or customer experience.",
                    "The team wants a founder-led strategic partner and can bring honest context into the room.",
                  ].map((item) => (
                    <li key={item} className="border-l border-clay/35 pl-4">
                      {item}
                    </li>
                  ))}
                </ul>
                <p className="mt-6 text-sm leading-6 text-foreground-secondary">
                  If the need is still difficult to name, describe the tension rather than choosing a service prematurely.
                </p>
              </div>
            </Reveal>
          </Container>
        </section>

        {/* own-leaves-cabin.mp4 replaced with higgsfield-verdant-hills.mp4
            (morning mist parting over green hills, originally generated
            for Home's closing CTA) per direct feedback moving this clip
            here instead. */}
        <VideoBreak
          src="/videos/higgsfield-verdant-hills.mp4"
          poster="/images/higgsfield-verdant-hills-poster.jpg"
          quote="A brand conversation is just the first clear view through the noise."
          height="60vh"
          cameraPush
          spotlight
        />

        {/* Was solid Indigo — a second distinct color on a two-section
            page already using Sandstone above, exactly the kind of
            per-section color-cycling flagged sitewide as reading
            cluttered rather than cohesive. Soil now, the same dark
            anchor every other page uses; the water glyph below still
            carries the "water" theme as an accent, it just isn't the
            whole backdrop anymore. CalendlyEmbed already wraps itself in
            an opaque card, so no change needed there. */}
        {/* Direct feedback that this section read as two flat text blocks
            with only a hairline dividing them — same bordered,
            element-tinted card treatment FounderLens/PackageSelector
            already proved on Services, applied here to the two real
            choices this page already offers (book directly, or stay on
            the list). Water and Air, matching the glyphs already used.
            Audit found this section had no video behind it at all — the
            same "blank section" bug class fixed elsewhere. A calm
            wildflower meadow, genuinely unused elsewhere on this page
            (or its own Footer), fitting "grab a time / stay in touch."
            Overlay at bg-soil/80, the site's normalized standard. */}
        <section className="relative overflow-hidden bg-soil py-16">
          <BackgroundVideo video="/videos/pixabay-alpine-wildflowers.mp4" poster="/images/pixabay-alpine-wildflowers-poster.jpg" />
          <div className="absolute inset-0 bg-soil/80" />
          {/* min-w-0 on both grid items: CalendlyEmbed's own real
              minWidth:320px constraint (its own widget's floor, not
              this page's choice) was propagating up through CSS
              Grid's default min-width:auto item behavior, forcing the
              shared single-column mobile track wider than the
              viewport, and dragging the Newsletter card along with it
              even though it has no width problem of its own.
              Confirmed via computed-style inspection at 375px width
              (both cards measured 370px, 43px past the actual 327px
              content box) before fixing. */}
          <Container className="relative grid gap-8 lg:grid-cols-2 lg:items-start">
            <Reveal className="min-w-0">
              <div
                className="rounded-2xl border p-6 sm:p-8"
                style={{ borderColor: `${ELEMENT_HEX.water}40`, backgroundColor: `${ELEMENT_HEX.water}14` }}
              >
                <ElementGlyph slug="water" className="h-6 w-6 text-sandstone" strokeWidth={1.2} />
                {site.calendlyUrl ? (
                  <>
                    <p className="mt-3 text-sm font-medium uppercase tracking-wide text-sandstone">
                      Or skip the form
                    </p>
                    <h2 className="mt-2 text-display-sm font-display font-normal text-ivory">
                      Just grab a time that works for you.
                    </h2>
                    <p className="mt-3 text-ivory/85">
                      Times shown automatically adjust to your local timezone, wherever you are.
                    </p>
                    <CalendlyEmbed url={site.calendlyUrl} />
                    <p className="mt-3 text-xs text-ivory/75">
                      Having trouble with the embed?{" "}
                      <a
                        href={site.calendlyUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sandstone link-underline"
                      >
                        Open it directly instead
                      </a>
                      .
                    </p>
                  </>
                ) : (
                  <>
                    <p className="mt-3 text-sm font-medium uppercase tracking-wide text-sandstone">
                      Direct first step
                    </p>
                    <h2 className="mt-2 text-display-sm font-display font-normal text-ivory">
                      Begin with enough context to make the first reply useful.
                    </h2>
                    <p className="mt-3 text-ivory/85">
                      Share what is changing, where the brand feels unclear and what decision is waiting.
                    </p>
                    <div className="mt-6">
                      <LinkButton href="#project-enquiry" className="bg-sandstone text-soil hover:bg-parchment">
                        Return to the project enquiry
                      </LinkButton>
                    </div>
                  </>
                )}
              </div>
            </Reveal>

            <Reveal delay={0.1} className="min-w-0">
              <div
                className="rounded-2xl border p-6 sm:p-8"
                style={{ borderColor: `${ELEMENT_HEX.air}40`, backgroundColor: `${ELEMENT_HEX.air}14` }}
              >
                <ElementGlyph slug="air" className="h-6 w-6 text-sandstone" strokeWidth={1.2} />
                <p className="mt-3 text-sm font-medium uppercase tracking-wide text-sandstone">
                  Still deciding?
                </p>
                <h2 className="mt-2 text-display-sm font-display font-normal text-ivory">
                  Read the thinking before beginning a conversation.
                </h2>
                <p className="mt-3 text-ivory/85">
                  The field notes explain recognition, positioning and the brand decisions that compound over time.
                </p>
                <div className="mt-6">
                  <LinkButton href="/insights" className="bg-sandstone text-soil hover:bg-parchment">
                    Explore the field notes
                  </LinkButton>
                </div>
              </div>
            </Reveal>
          </Container>
        </section>
      </main>
      <Footer />
      <script
        type="application/ld+json"
        // eslint-disable-next-line react/no-danger
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
    </>
  );
}
