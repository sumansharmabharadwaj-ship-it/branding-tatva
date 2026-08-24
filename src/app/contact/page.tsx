import type { Metadata } from "next";
import { preload } from "react-dom";
import { Header } from "@/layouts/Header";
import { Footer } from "@/sections/Footer";
import { Container } from "@/components/Container";
import { ContactForm } from "@/components/ContactForm";
import { ContactPathways } from "@/components/ContactPathways";
import { Reveal } from "@/components/Reveal";
import { SplitReveal } from "@/components/SplitReveal";
import { PhotoHero } from "@/components/PhotoHero";
import { NatureAccent } from "@/components/NatureAccent";
import { Fireflies } from "@/components/Fireflies";
import { BackgroundVideo } from "@/components/BackgroundVideo";
import { ArrowRight, ArrowUpRight, CalendarDays, MessageCircle, Phone } from "lucide-react";
import { site } from "@/data/site";
import { pageSchema, ORGANIZATION_ID } from "@/lib/pageSchema";


const pageJsonLd = pageSchema({
  type: "ContactPage",
  path: "/contact",
  name: "Contact | Branding Tatva",
  description:
    "Schedule a brand strategy consultation with Suman Sharma, call or WhatsApp directly, or send a written enquiry.",
  trail: [{ name: "Contact", path: "/contact" }],
  mainEntity: ORGANIZATION_ID,
});

export const metadata: Metadata = {
  title: "Contact",
  description: "Schedule a 30 minute brand strategy consultation with Suman Sharma, call or WhatsApp directly, or send a written enquiry.",
  alternates: { canonical: "/contact" },
  openGraph: {
    title: `Contact | ${site.name}`,
    description: "Schedule a 30 minute brand strategy consultation with Suman Sharma, call or WhatsApp directly, or send a written enquiry.",
    type: "website",
  },
};

export default function ContactPage() {
  // The hero poster is this page's LCP element — a high priority
  // preload so first paint stops waiting behind the video request.
  preload("/images/pexels-fog-sunrise-poster.jpg", { as: "image", fetchPriority: "high" });
  return (
    <>
      <Header transparent />
      <main id="main-content">
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(pageJsonLd) }} />
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
          video="/videos/pexels-fog-sunrise.mp4"
          poster="/images/pexels-fog-sunrise-poster.jpg"
          minHeight="70vh"
          overlayGradient="linear-gradient(180deg, rgba(31,29,25,0.34) 0%, rgba(31,29,25,0.44) 58%, rgba(31,29,25,0.68) 100%), linear-gradient(90deg, rgba(31,29,25,0.44) 0%, rgba(31,29,25,0.08) 72%)"
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
                  Bring the question that keeps circling. A clear next move can begin with one honest conversation.
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

        <section className="relative overflow-hidden border-b border-soil/10 bg-[#E8DED0]">
          <BackgroundVideo
            video="/videos/generated/bt-contact-three-paths-waterpaper.mp4"
            poster="/images/generated/bt-contact-three-paths-waterpaper-poster.jpg"
            parallax
            playbackRate={0.82}
          />
          <div
            aria-hidden="true"
            className="absolute inset-0"
            style={{
              backgroundImage:
                "linear-gradient(110deg, rgba(232,222,208,0.84) 0%, rgba(235,227,216,0.68) 55%, rgba(223,225,214,0.62) 100%)",
            }}
          />
          <ContactPathways />
        </section>

        {/* Was a one-off terracotta wash (earth blended 22%) — its own
            color, distinct from every other light section on the site.
            Sandstone now: the same single light-anchor tone About uses
            for its own opening section. The heading/intro copy above
            moved into the new hero; this section now carries just the
            form and the direct-contact links.
            Redesign pass: this is the single most consequential section
            on the entire site, so its atmosphere must never depend on a
            WebGL context. Two restrained paper-light washes keep the form
            dimensional without adding a GPU-heavy failure point. */}
        <section id="write" className="relative flex min-h-[100svh] scroll-mt-24 items-center overflow-hidden bg-[#DDE2DC] py-16 sm:py-20">
          <BackgroundVideo
            video="/videos/pexels-moss-stream.mp4"
            poster="/images/pexels-moss-stream-poster.jpg"
            parallax
            playbackRate={0.78}
          />
          <div
            aria-hidden="true"
            className="absolute inset-0"
            style={{
              backgroundImage:
                "linear-gradient(100deg, rgba(235,232,221,0.88) 0%, rgba(232,229,219,0.66) 48%, rgba(218,224,214,0.48) 100%)",
            }}
          />
          <Container className="relative grid w-full gap-10 lg:grid-cols-[0.78fr_1.22fr] lg:items-center lg:gap-16">
            <Reveal>
              <p className="text-[0.68rem] font-medium uppercase tracking-[0.24em] text-soil/60">Write in your own time</p>
              <h2 className="mt-4 max-w-lg font-display text-[clamp(2.5rem,5vw,4.8rem)] font-normal leading-[0.98] text-soil">
                A short note can reveal the real question.
              </h2>
              <p className="mt-6 max-w-md text-sm leading-relaxed text-soil/72 sm:text-base">
                Bring the uncertainty, the unfinished thought, or the decision that keeps circling. I will read every word personally.
              </p>

              <div className="mt-8 max-w-md rounded-2xl border border-white/45 bg-white/28 p-5 backdrop-blur-xl">
                <p className="text-[0.65rem] font-medium uppercase tracking-[0.2em] text-soil/48">Where your note goes</p>
                <p className="mt-3 font-display text-2xl font-normal text-soil">Straight to Suman.</p>
                <p className="mt-2 text-sm leading-relaxed text-soil/65">
                  Every enquiry is read by the person who would shape the work with you.
                </p>
              </div>

              <p className="mt-6 text-sm text-soil/68">
                Prefer your inbox?{" "}
                <a href={`mailto:${site.email}`} className="link-underline text-action-primary-hover">{site.email}</a>
              </p>
            </Reveal>

            <Reveal delay={0.1}>
              <ContactForm />
              <p className="mt-4 rounded-full border border-white/35 bg-white/25 px-4 py-2 text-center text-[0.68rem] leading-relaxed text-soil/58 backdrop-blur-lg">
                Your details stay private, reach Suman directly, and can be deleted on request.
              </p>
            </Reveal>
          </Container>
        </section>

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
        <section id="call" className="relative flex min-h-[100svh] scroll-mt-24 items-center overflow-hidden bg-soil py-16 sm:py-20">
          <BackgroundVideo
            video="/videos/pexels-valley-first-light.mp4"
            poster="/images/pexels-valley-first-light-poster.jpg"
            parallax
            playbackRate={0.8}
          />
          <div
            className="absolute inset-0"
            aria-hidden="true"
            style={{ backgroundImage: "linear-gradient(105deg, rgba(28,34,27,0.72) 0%, rgba(39,42,31,0.52) 48%, rgba(39,32,24,0.42) 100%)" }}
          />
          <Container className="relative grid w-full gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:items-center lg:gap-16">
            <div>
              <Reveal>
                <p className="text-[0.68rem] font-medium uppercase tracking-[0.24em] text-sandstone">The first conversation</p>
                <h2 className="mt-4 max-w-xl font-display text-[clamp(2.7rem,5.6vw,5.4rem)] font-normal leading-[0.96] text-ivory">
                  One question is enough for the first call.
                </h2>
                <p className="mt-6 max-w-md text-sm leading-relaxed text-ivory/75 sm:text-base">
                  Bring the decision taking up the most room in your head. I will listen, ask what matters, and share the clearest next move I can see.
                </p>
              </Reveal>

              <ol className="mt-9 grid gap-3 sm:grid-cols-3 lg:grid-cols-1">
                {[
                  "You describe where the brand stands today.",
                  "We examine positioning, perception, and recognition.",
                  "You leave with an honest next step.",
                ].map((step, i) => (
                  <Reveal key={step} delay={i * 0.08}>
                    <li className="flex items-start gap-4 rounded-2xl border border-white/10 bg-white/[0.06] px-4 py-3 backdrop-blur-lg">
                      <span className="pt-0.5 font-display text-lg leading-none text-sandstone/70" aria-hidden="true">
                        {String(i + 1).padStart(2, "0")}
                      </span>
                      <p className="text-sm leading-relaxed text-ivory/82">{step}</p>
                    </li>
                  </Reveal>
                ))}
              </ol>
            </div>

            <Reveal delay={0.12} className="min-w-0">
              <div className="rounded-[2rem] border border-white/45 bg-[#F6F2EA]/90 p-6 shadow-[0_30px_100px_rgba(10,18,11,0.34)] backdrop-blur-3xl sm:p-10">
                <div className="flex items-start justify-between gap-6">
                  <div>
                    <p className="text-[0.65rem] font-medium uppercase tracking-[0.22em] text-clay">Direct with the founder</p>
                    <p className="mt-3 font-display text-4xl font-normal leading-none text-soil sm:text-5xl">{site.consultationMinutes} minutes</p>
                  </div>
                  <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-soil text-ivory">
                    <CalendarDays aria-hidden="true" className="h-6 w-6" strokeWidth={1.35} />
                  </span>
                </div>

                <p className="mt-7 max-w-md text-sm leading-relaxed text-soil/68 sm:text-base">
                  Choose a time that suits you. Every slot adjusts to your timezone, and the confirmation arrives after booking.
                </p>

                {/* CalendlyEmbed remains the established scheduling contract;
                    this direct route keeps the handoff immediate and resilient. */}
                <a
                  href={site.calendlyUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group mt-8 flex min-h-16 w-full items-center gap-4 rounded-2xl bg-soil p-4 text-left text-ivory shadow-elevation-sm transition-[transform,box-shadow,background-color] duration-300 hover:-translate-y-1 hover:bg-action-primary-hover hover:shadow-elevation-lg focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-clay sm:p-5"
                  aria-label={`Open Calendly to book a ${site.consultationMinutes} minute meeting with ${site.founder}`}
                >
                  <span className="min-w-0 flex-1">
                    <span className="block font-display text-2xl font-normal sm:text-3xl">
                      Choose a time
                    </span>
                    <span className="mt-1 block text-sm text-ivory/65">View the live calendar</span>
                  </span>
                  <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-sandstone text-soil transition-transform duration-300 group-hover:translate-x-1">
                    <ArrowRight aria-hidden="true" className="h-5 w-5" strokeWidth={1.6} />
                  </span>
                </a>

                <div className="mt-5 flex flex-wrap items-center justify-between gap-3 border-t border-soil/10 pt-5">
                  <p className="text-[0.65rem] font-medium uppercase tracking-[0.18em] text-soil/45">
                    Calendly · opens in a new tab
                  </p>
                  <div className="flex flex-wrap items-center gap-4">
                    <a
                      href={`tel:${site.phone.tel}`}
                      aria-label={`Call Suman at ${site.phone.display}`}
                      className="inline-flex min-h-11 items-center text-sm font-medium text-soil transition-colors duration-300 hover:text-clay focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-3 focus-visible:outline-clay"
                    >
                      <Phone aria-hidden="true" className="mr-2 h-4 w-4" strokeWidth={1.5} />
                      Call Suman
                    </a>
                    <a
                      href={site.phone.whatsappUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex min-h-11 items-center text-sm font-medium text-soil transition-colors duration-300 hover:text-clay focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-3 focus-visible:outline-clay"
                    >
                      <MessageCircle aria-hidden="true" className="mr-2 h-4 w-4" strokeWidth={1.5} />
                      WhatsApp Suman
                      <ArrowUpRight aria-hidden="true" className="ml-1.5 h-4 w-4" />
                    </a>
                  </div>
                </div>
              </div>
            </Reveal>
          </Container>
        </section>
      </main>
      <Footer compact />
    </>
  );
}
