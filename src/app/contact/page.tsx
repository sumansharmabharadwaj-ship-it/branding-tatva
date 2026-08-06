import type { Metadata } from "next";
import { preload } from "react-dom";
import { Header } from "@/layouts/Header";
import { Footer } from "@/sections/Footer";
import { Container } from "@/components/Container";
import { ContactForm } from "@/components/ContactForm";
import { Reveal } from "@/components/Reveal";
import { SplitReveal } from "@/components/SplitReveal";
import { PhotoHero } from "@/components/PhotoHero";
import { VideoBreak } from "@/components/VideoBreak";
import { CalendlyEmbed } from "@/components/CalendlyEmbed";
import { NewsletterForm } from "@/components/NewsletterForm";
import { ElementGlyph } from "@/components/ElementGlyph";
import { NatureAccent } from "@/components/NatureAccent";
import { Fireflies } from "@/components/Fireflies";
import { AmbientElementShader } from "@/components/AmbientElementShader";
import { BackgroundVideo } from "@/components/BackgroundVideo";
import { site } from "@/data/site";
import { credentials } from "@/data/about";
import { projects } from "@/data/projects";
import { SANDSTONE, ELEMENT_HEX } from "@/lib/sectionWash";

export const metadata: Metadata = {
  title: "Contact",
  description: "Tell me what your brand is becoming.",
  alternates: { canonical: "/contact" },
  openGraph: {
    title: `Contact | ${site.name}`,
    description: "Tell me what your brand is becoming.",
    type: "website",
  },
};

export default function ContactPage() {
  // The hero poster is this page's LCP element — a high priority
  // preload so first paint stops waiting behind the video request.
  preload("/images/pexels-studio-morning-light-poster.jpg", { as: "image", fetchPriority: "high" });
  return (
    <>
      <Header transparent />
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
          video="/videos/pexels-studio-morning-light.mp4"
          poster="/images/pexels-studio-morning-light-poster.jpg"
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
          <Container className="relative py-20 sm:py-28">
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
                  Fill in as much or as little as you know right now.
                  I&apos;ll ask a few more questions where it helps.
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

        {/* The two paths, up front (governing bible's contact
            architecture): a visitor either books the call or writes,
            and both doors are visible before any form field appears.
            Plain anchor cards, zero novelty — this page's job is to
            get out of the way. */}
        <section className="border-b border-soil/10 py-10" style={{ backgroundColor: "#E8DED0" }}>
          <Container className="grid gap-4 sm:grid-cols-2">
            <a
              href="#call"
              className="group rounded-2xl border border-soil/15 bg-background-elevated p-6 shadow-elevation-sm transition-transform duration-300 hover:translate-y-[-2px] focus-visible:outline focus-visible:outline-2 focus-visible:outline-clay"
            >
              <p className="text-xs font-medium uppercase tracking-[0.18em] text-action-secondary">Path one</p>
              <p className="mt-2 font-display text-xl font-normal text-soil">
                Book the twenty minute call
                <span aria-hidden="true" className="ml-2 inline-block transition-transform duration-300 group-hover:translate-y-0.5">↓</span>
              </p>
              <p className="mt-2 text-sm text-foreground-secondary">
                Pick a time directly. Honest feedback either way, and a clear next step if it fits.
              </p>
            </a>
            <a
              href="#write"
              className="group rounded-2xl border border-soil/15 bg-background-elevated p-6 shadow-elevation-sm transition-transform duration-300 hover:translate-y-[-2px] focus-visible:outline focus-visible:outline-2 focus-visible:outline-clay"
            >
              <p className="text-xs font-medium uppercase tracking-[0.18em] text-action-secondary">Path two</p>
              <p className="mt-2 font-display text-xl font-normal text-soil">
                Write it down instead
                <span aria-hidden="true" className="ml-2 inline-block transition-transform duration-300 group-hover:translate-y-0.5">↓</span>
              </p>
              <p className="mt-2 text-sm text-foreground-secondary">
                Prefer thinking in writing? The enquiry form takes as much or as little as you know today.
              </p>
            </a>
          </Container>
        </section>

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
        <section id="write" className="relative scroll-mt-24 overflow-hidden pb-20 pt-16 sm:pb-28 sm:pt-20" style={{ backgroundColor: SANDSTONE }}>
          <AmbientElementShader opacity={0.14} />
          <Container className="relative grid gap-12 lg:grid-cols-5">
            <Reveal className="lg:col-span-2">
              <p className="text-sm font-medium uppercase tracking-wide text-action-secondary">
                Reach me directly
              </p>
              <div className="mt-3 space-y-2 text-sm text-foreground-secondary">
                <p>
                  Prefer email?{" "}
                  <a href={`mailto:${site.email}`} className="text-action-primary-hover link-underline">
                    {site.email}
                  </a>
                </p>
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
            </Reveal>

            <Reveal delay={0.1} className="lg:col-span-3">
              <ContactForm />
              <p className="mt-4 text-xs leading-relaxed text-foreground-secondary/80">
                Your details stay with this practice: read personally, shared with nobody, and deleted on request.
              </p>
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
        <section id="call" className="relative scroll-mt-24 overflow-hidden bg-soil py-16 sm:py-24">
          {/* Restored to the warm meadow per Suman's design: the green
              backlit grasses read harsh behind this cream panel. */}
          <BackgroundVideo video="/videos/pixabay-alpine-wildflowers.mp4" poster="/images/pixabay-alpine-wildflowers-poster.jpg" />
          <div
            className="absolute inset-0"
            aria-hidden="true"
            style={{ backgroundImage: "linear-gradient(180deg, rgba(38,30,22,0.82) 0%, rgba(45,35,25,0.68) 45%, rgba(30,24,18,0.86) 100%)" }}
          />
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
          {/* What happens next — the same four real steps the Services
              clearing already promises, restated where the booking
              actually happens. */}
          <Container className="relative mb-10">
            <p className="text-xs font-medium uppercase tracking-[0.18em] text-sandstone">What happens next</p>
            <ol className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {[
                "You describe where the brand stands today, in your own words.",
                "I ask direct questions about positioning, audience, and where recognition is falling short.",
                "You get honest feedback either way, no sales pitch.",
                "If it makes sense to continue, we agree what the first thirty days would look like.",
              ].map((step, i) => (
                <Reveal key={step} delay={i * 0.08}>
                  <li className="flex items-start gap-3">
                    <span className="pt-0.5 font-display text-lg leading-none text-ivory/35" aria-hidden="true">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <p className="text-sm leading-relaxed text-ivory/85">{step}</p>
                  </li>
                </Reveal>
              ))}
            </ol>
          </Container>
          {/* Suman's direction: the booking panel needed emotional
              weight and a slower approach. The page spent everything
              above this explaining the thinking, then dropped straight
              into a scheduling widget. This beat sits between the two,
              with real space around it, so arriving at the calendar
              feels like a decision rather than a form. */}
          <Container className="relative mb-14 sm:mb-20">
            <Reveal delay={0.12}>
              <div className="mx-auto max-w-xl text-center">
                <span aria-hidden="true" className="mx-auto mb-7 block h-10 w-px" style={{ backgroundColor: "rgba(212,185,154,0.5)" }} />
                <p className="font-display text-2xl font-normal leading-snug text-ivory sm:text-3xl">
                  Everything above explains the thinking. This is where it becomes a conversation.
                </p>
              </div>
            </Reveal>
          </Container>

          <Container className="relative grid gap-8 lg:grid-cols-2 lg:items-start">
            <Reveal delay={0.28} className="min-w-0">
              {/* Suman's design: a cream panel carrying the booking,
                  opening on the italic welcome, her name in serif, and
                  the sprig divider before the calendar itself. */}
              <div className="rounded-2xl px-6 py-10 text-center shadow-elevation-lg sm:px-10" style={{ backgroundColor: "#F6F2EA" }}>
                <p className="font-display text-3xl italic" style={{ color: "#B08A4F" }}>Welcome,</p>
                <p className="mt-1 font-display text-4xl font-normal text-soil sm:text-5xl">{site.founder}</p>
                <span aria-hidden="true" className="mx-auto mt-4 block h-px w-16" style={{ backgroundColor: "#C6A97A" }} />
                <p className="mx-auto mt-5 max-w-sm font-display text-lg leading-snug text-soil sm:text-xl">
                  Thirty minutes with the person who would do the work.
                </p>
                <p className="mx-auto mt-3 max-w-xs text-sm leading-relaxed text-foreground-secondary">
                  Pick any time that suits you. Every slot adjusts to your own timezone automatically.
                </p>
                <span aria-hidden="true" className="mt-7 flex items-center justify-center gap-3">
                  <span className="h-px w-20 bg-soil/15" />
                  <svg viewBox="0 0 24 20" className="h-4 w-5" fill="none" style={{ color: "#C6A97A" }}>
                    <path d="M12 19V6M12 6C12 6 9 1 4 1c0 5 4 6 8 5zM12 6c0 0 3-5 8-5 0 5-4 6-8 5z" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                  <span className="h-px w-20 bg-soil/15" />
                </span>
                <CalendlyEmbed url={site.calendlyUrl} />
                <p className="mt-3 text-xs text-foreground-secondary">
                  Having trouble with the embed?{" "}
                  <a
                    href={site.calendlyUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="link-underline text-clay"
                  >
                    Open it directly instead
                  </a>
                  .
                </p>
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
                  Get occasional notes on brand clarity.
                </h2>
                <p className="mt-3 text-ivory/85">
                  A few honest thoughts a month, short and specific. Zero pitch,
                  unsubscribe whenever.
                </p>
                <NewsletterForm />
              </div>
            </Reveal>
          </Container>
        </section>
      </main>
      <Footer />
    </>
  );
}
