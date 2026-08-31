import type { Metadata } from "next";
import { preload } from "react-dom";
import { Header } from "@/layouts/Header";
import { Footer } from "@/sections/Footer";
import { Container } from "@/components/Container";
import { ContactForm } from "@/components/ContactForm";
import { ContactPathways } from "@/components/ContactPathways";
import { ContactCinematicScene } from "@/components/ContactCinematicScene";
import { ContactKineticHeading } from "@/components/ContactKineticHeading";
import { ContactGratitude } from "@/components/ContactGratitude";
import { ContactCallSequence } from "@/components/ContactCallSequence";
import { ContactScrollRuntime } from "@/components/ContactScrollRuntime";
import { ContactChapterRail } from "@/components/ContactChapterRail";
import { ContactBookingAction } from "@/components/ContactBookingAction";
import { ContactHeroBookingLink, ContactHeroContextCard } from "@/components/ContactServicesHandoff";
import { TrackedLink } from "@/components/TrackedLink";
import { Reveal } from "@/components/Reveal";
import { SplitReveal } from "@/components/SplitReveal";
import { PhotoHero } from "@/components/PhotoHero";
import { NatureAccent } from "@/components/NatureAccent";
import { Fireflies } from "@/components/Fireflies";
import { BackgroundVideo } from "@/components/BackgroundVideo";
import { ArrowUpRight, CalendarDays, MessageCircle, Phone } from "lucide-react";
import { consultation, site } from "@/data/site";
import { pageSchema, ORGANIZATION_ID } from "@/lib/pageSchema";
import "./contact-cinematic.css";


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
  description: "Schedule a 30-minute brand strategy consultation with Suman Sharma, call or WhatsApp directly, or send a written enquiry.",
  alternates: { canonical: "/contact" },
  openGraph: {
    title: `Contact | ${site.name}`,
    description: "Schedule a 30-minute brand strategy consultation with Suman Sharma, call or WhatsApp directly, or send a written enquiry.",
    type: "website",
  },
};

export default function ContactPage() {
  // The hero poster is this page's LCP element — a high priority
  // preload so first paint stops waiting behind the video request.
  preload("/images/generated/bt-contact-original-hero-poster.jpg", { as: "image", fetchPriority: "high" });
  return (
    <>
      <Header transparent />
      <main id="main-content" data-contact-film>
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(pageJsonLd) }} />
        {/* Contact opens as an immersive 88svh film rather than a utility-page
            banner. This newly sourced dawn scene is exclusive to the hero; a
            dedicated portrait derivative protects mobile playback and the
            restrained pace gives the copy time to breathe. */}
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
          video="/videos/generated/bt-contact-original-hero.mp4"
          videoMobile="/videos/generated/bt-contact-original-hero-mobile.mp4"
          poster="/images/generated/bt-contact-original-hero-poster.jpg"
          minHeight="88vh"
          imagePosition="center 56%"
          playbackRate={0.84}
          className="contact-hero-film"
          overlayGradient="linear-gradient(180deg, rgba(25,27,22,0.18) 0%, rgba(28,29,23,0.32) 48%, rgba(29,27,23,0.76) 100%), linear-gradient(90deg, rgba(25,25,21,0.7) 0%, rgba(26,27,22,0.42) 46%, rgba(24,26,21,0.06) 78%)"
        >
          {/* Every other atmospheric hero on the site (About's forest
              backdrop) carries a small ambient layer on top of the
              video; this one was the plain video-plus-gradient every
              other page's hero already is, missing the one touch that
              gives About's hero its "considered, not just footage"
              feel. Same forest register as this hero's own clip, not a
              new visual idea introduced just for this page. */}
          <Fireflies />
          <div data-contact-hero-frame aria-hidden="true">
            <span />
            <span />
          </div>
          <div data-contact-hero-aperture aria-hidden="true">
            <span data-contact-hero-matte="top" />
            <span data-contact-hero-matte="bottom" />
            <span data-contact-hero-light-open />
          </div>
          <Container data-contact-hero className="relative py-16 sm:py-24">
            <div data-contact-hero-grid className="grid gap-10 lg:grid-cols-[1fr_auto] lg:items-end lg:gap-16">
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
                <div
                  data-contact-hero-signal
                  role="img"
                  aria-label="The conversation moves from listening, to naming what matters, to a clear next move."
                  className="mt-5 grid max-w-xl grid-cols-[auto_1fr_auto_1fr_auto] items-center gap-2 text-[0.56rem] font-medium uppercase tracking-[0.16em] text-ivory/62 sm:gap-3 sm:text-[0.62rem] sm:tracking-[0.2em]"
                >
                  <span>Listen</span>
                  <span aria-hidden="true" className="contact-hero-signal-line h-px overflow-hidden bg-ivory/18"><span className="block h-full origin-left bg-sandstone/80" /></span>
                  <span>Name it</span>
                  <span aria-hidden="true" className="contact-hero-signal-line h-px overflow-hidden bg-ivory/18"><span className="block h-full origin-left bg-sandstone/80" /></span>
                  <span>Move clearly</span>
                </div>
                <div data-contact-hero-actions className="mt-7 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
                  <ContactHeroBookingLink />
                  <TrackedLink
                    href="#write"
                    event="contact_route_selected"
                    eventProps={{ source: "contact_hero", route: "write" }}
                    data-cursor-label="Write a note"
                    className="inline-flex min-h-12 items-center justify-center rounded-full border border-ivory/30 bg-soil/20 px-6 py-3 text-sm font-medium text-ivory backdrop-blur-lg transition-[transform,background-color] duration-300 hover:-translate-y-0.5 hover:bg-soil/40 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-3 focus-visible:outline-ivory"
                  >
                    Write a note
                  </TrackedLink>
                </div>
                <p data-contact-hero-trust className="mt-4 text-[0.64rem] font-medium uppercase tracking-[0.18em] text-ivory/62">
                  {site.consultationMinutes} minutes · founder led · your timezone
                </p>
                <div
                  data-contact-hero-direct
                  className="mt-3 flex flex-wrap items-center gap-x-3 gap-y-2 text-sm text-ivory/72"
                  aria-label="Direct contact options"
                >
                  <span className="text-ivory/52">Prefer direct?</span>
                  <TrackedLink
                    href={`tel:${site.phone.tel}`}
                    event="contact_route_selected"
                    eventProps={{ source: "contact_hero", route: "call" }}
                    data-cursor-label="Call Suman"
                    className="link-underline inline-flex min-h-11 items-center text-ivory transition-colors hover:text-sandstone focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-3 focus-visible:outline-ivory"
                    aria-label={`Call Suman at ${site.phone.display}`}
                  >
                    <Phone aria-hidden="true" className="mr-1.5 h-3.5 w-3.5" strokeWidth={1.5} />
                    Call
                  </TrackedLink>
                  <TrackedLink
                    href={site.phone.whatsappUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    event="contact_route_selected"
                    eventProps={{ source: "contact_hero", route: "whatsapp" }}
                    data-cursor-label="WhatsApp Suman"
                    className="link-underline inline-flex min-h-11 items-center text-ivory transition-colors hover:text-sandstone focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-3 focus-visible:outline-ivory"
                  >
                    <MessageCircle aria-hidden="true" className="mr-1.5 h-3.5 w-3.5" strokeWidth={1.5} />
                    WhatsApp
                  </TrackedLink>
                </div>
              </Reveal>
              <Reveal delay={0.1} className="lg:pb-2" data-contact-hero-aside>
                <ContactHeroContextCard />
              </Reveal>
            </div>
          </Container>
        </PhotoHero>

        <ContactScrollRuntime />
        <ContactChapterRail />

        <ContactCinematicScene
          id="choose"
          labelledBy="contact-pathways-heading"
          variant="branch"
          className="border-b border-soil/10 bg-[#E8DED0]"
          media={
            <>
              <BackgroundVideo
                video="/videos/generated/bt-contact-original-pathways.mp4"
                videoMobile="/videos/generated/bt-contact-original-pathways-mobile.mp4"
                poster="/images/generated/bt-contact-original-pathways-poster.jpg"
                playbackRate={0.86}
                push
                posterPriority={false}
              />
              <div
                aria-hidden="true"
                className="absolute inset-0"
                style={{
                  backgroundImage:
                    "linear-gradient(110deg, rgba(232,222,208,0.84) 0%, rgba(235,227,216,0.68) 55%, rgba(223,225,214,0.62) 100%)",
                }}
              />
            </>
          }
        >
          <ContactPathways />
        </ContactCinematicScene>

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
        <ContactCinematicScene
          id="write"
          labelledBy="contact-write-heading"
          variant="paper"
          className="bg-[#DDE2DC]"
          media={
            <>
              <BackgroundVideo
                video="/videos/generated/bt-contact-original-write-scene.mp4"
                videoMobile="/videos/generated/bt-contact-original-write-scene-mobile.mp4"
                poster="/images/generated/bt-contact-original-write-scene-poster.jpg"
                playbackRate={0.8}
                posterPriority={false}
              />
              <div
                aria-hidden="true"
                className="absolute inset-0"
                style={{
                  backgroundImage:
                    "linear-gradient(100deg, rgba(235,232,221,0.88) 0%, rgba(232,229,219,0.66) 48%, rgba(218,224,214,0.48) 100%)",
                }}
              />
            </>
          }
        >
          <Container className="contact-write-layout relative grid w-full gap-10 py-12 sm:py-14 lg:grid-cols-[0.78fr_1.22fr] lg:items-center lg:gap-16">
            <div data-contact-write-copy>
              <p className="text-[0.68rem] font-medium uppercase tracking-[0.24em] text-soil/60">Write in your own time</p>
              <ContactKineticHeading
                id="contact-write-heading"
                data-contact-write-heading
                lines={["A short note", "can reveal", "the real question."]}
                resolveClassName="text-clay"
                className="mt-4 max-w-lg font-display text-[clamp(2.5rem,5vw,4.8rem)] font-normal leading-[0.98] text-soil"
              />
              <p className="mt-6 max-w-md text-sm leading-relaxed text-soil/72 sm:text-base">
                Bring the uncertainty, the unfinished thought, or the decision that keeps circling. I will read every word personally.
              </p>

              <div data-contact-write-note className="mt-8 max-w-md rounded-2xl border border-white/45 bg-white/28 p-5 backdrop-blur-xl">
                <p className="text-[0.65rem] font-medium uppercase tracking-[0.2em] text-soil/48">Where your note goes</p>
                <p className="mt-3 font-display text-2xl font-normal text-soil">Straight to Suman.</p>
                <p className="mt-2 text-sm leading-relaxed text-soil/65">
                  Every enquiry is read by the person who would shape the work with you.
                </p>
              </div>

              <p className="mt-6 text-sm text-soil/68">
                Prefer your inbox?{" "}
                <TrackedLink
                  href={`mailto:${site.email}`}
                  event="contact_route_selected"
                  eventProps={{ source: "contact_write_intro", route: "email" }}
                  data-cursor-label="Email Suman"
                  className="link-underline text-action-primary-hover"
                >
                  {site.email}
                </TrackedLink>
              </p>
            </div>

            <div className="min-w-0">
              <ContactForm />
              <p className="mt-4 rounded-full border border-white/35 bg-white/25 px-4 py-2 text-center text-[0.68rem] leading-relaxed text-soil/58 backdrop-blur-lg">
                Your details reach Suman directly and can be deleted on request. Read the{" "}
                <TrackedLink
                  href="/privacy"
                  event="contact_route_selected"
                  eventProps={{ source: "contact_form_privacy", route: "privacy" }}
                  data-cursor-label="Read privacy"
                  className="link-underline text-action-primary-hover"
                >
                  privacy note
                </TrackedLink>
                .
              </p>
            </div>
          </Container>
        </ContactCinematicScene>

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
        <ContactCinematicScene
          id="call"
          labelledBy="contact-call-heading"
          variant="horizon"
          className="bg-soil"
          media={
            <>
              <BackgroundVideo
                video="/videos/generated/bt-contact-original-call.mp4"
                videoMobile="/videos/generated/bt-contact-original-call-mobile.mp4"
                poster="/images/generated/bt-contact-original-call-poster.jpg"
                playbackRate={0.83}
                push
                posterPriority={false}
              />
              <div
                className="absolute inset-0"
                aria-hidden="true"
                style={{ backgroundImage: "linear-gradient(105deg, rgba(28,34,27,0.72) 0%, rgba(39,42,31,0.52) 48%, rgba(39,32,24,0.42) 100%)" }}
              />
            </>
          }
        >
          <Container className="contact-call-layout relative grid w-full gap-12 py-12 sm:py-14 lg:grid-cols-[0.9fr_1.1fr] lg:items-center lg:gap-16">
            <div data-contact-call-copy>
              <div>
                <p className="text-[0.68rem] font-medium uppercase tracking-[0.24em] text-sandstone">The first conversation</p>
                <ContactKineticHeading
                  id="contact-call-heading"
                  data-contact-call-heading
                  lines={["One question", "is enough", "for the first call."]}
                  resolveClassName="text-sandstone"
                  className="mt-4 max-w-xl font-display text-[clamp(2.7rem,5.6vw,5.4rem)] font-normal leading-[0.96] text-ivory"
                />
                <p data-contact-call-intro className="mt-6 max-w-md text-sm leading-relaxed text-ivory/75 sm:text-base">
                  Bring the decision taking up the most room in your head. I will listen, ask what matters, and share the clearest next move I can see.
                </p>
              </div>

              <ContactCallSequence />
            </div>

            <div className="min-w-0">
              <div data-contact-booking-card className="rounded-[2rem] border border-white/45 bg-[#F6F2EA]/90 p-6 shadow-[0_30px_100px_rgba(10,18,11,0.34)] backdrop-blur-3xl sm:p-10">
                <div data-contact-booking-header className="flex items-start justify-between gap-6">
                  <div>
                    <p className="text-[0.65rem] font-medium uppercase tracking-[0.22em] text-clay">Direct with the founder</p>
                    <p className="mt-3 font-display text-4xl font-normal leading-none text-soil sm:text-5xl">{site.consultationMinutes} minutes</p>
                  </div>
                  <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-soil text-ivory">
                    <CalendarDays aria-hidden="true" className="h-6 w-6" strokeWidth={1.35} />
                  </span>
                </div>

                <p data-contact-booking-description className="mt-7 max-w-md text-sm leading-relaxed text-soil/68 sm:text-base">
                  Choose a time that suits you. The calendar adjusts to your timezone. {consultation.preparation}
                </p>

                <p className="mt-4 border-l border-clay/25 pl-4 text-sm leading-relaxed text-soil/62">
                  You will speak with Suman throughout. Bring one question and leave with a clear next move.
                </p>

                {/* The direct Calendly route keeps the handoff immediate and
                    resilient even when an embedded calendar is blocked. */}
                <ContactBookingAction
                  href={site.calendlyUrl}
                  consultationMinutes={site.consultationMinutes}
                  founder={site.founder}
                />

                <div data-contact-booking-options className="mt-5 flex flex-wrap items-center justify-between gap-3 border-t border-soil/10 pt-5">
                  <p data-contact-booking-meta className="text-[0.65rem] font-medium uppercase tracking-[0.18em] text-soil/45">
                    Calendly · opens in a new tab
                  </p>
                  <div data-contact-booking-direct className="grid w-full grid-cols-2 gap-2 sm:w-auto sm:flex sm:flex-wrap sm:items-center sm:gap-4">
                    <TrackedLink
                      href={`tel:${site.phone.tel}`}
                      aria-label={`Call Suman at ${site.phone.display}`}
                      event="contact_route_selected"
                      eventProps={{ source: "contact_final_scene", route: "call" }}
                      data-cursor-label="Call Suman"
                      className="inline-flex min-h-11 items-center justify-center rounded-full border border-soil/10 bg-white/30 px-2 text-sm font-medium text-soil transition-colors duration-300 hover:text-clay focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-3 focus-visible:outline-clay sm:justify-start sm:rounded-none sm:border-0 sm:bg-transparent sm:px-0"
                    >
                      <Phone aria-hidden="true" className="mr-2 h-4 w-4" strokeWidth={1.5} />
                      <span className="leading-tight">
                        <span className="block">Call Suman</span>
                        <span
                          data-contact-phone-number
                          className="mt-0.5 block text-[0.62rem] font-normal tracking-[0.04em] text-soil/55"
                        >
                          {site.phone.display}
                        </span>
                      </span>
                    </TrackedLink>
                    <TrackedLink
                      href={site.phone.whatsappUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      event="contact_route_selected"
                      eventProps={{ source: "contact_final_scene", route: "whatsapp" }}
                      data-cursor-label="WhatsApp Suman"
                      className="inline-flex min-h-11 items-center justify-center rounded-full border border-soil/10 bg-white/30 px-2 text-sm font-medium text-soil transition-colors duration-300 hover:text-clay focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-3 focus-visible:outline-clay sm:justify-start sm:rounded-none sm:border-0 sm:bg-transparent sm:px-0"
                    >
                      <MessageCircle aria-hidden="true" className="mr-2 h-4 w-4" strokeWidth={1.5} />
                      WhatsApp Suman
                      <ArrowUpRight aria-hidden="true" className="ml-1.5 h-4 w-4" />
                    </TrackedLink>
                  </div>
                </div>
              </div>
            </div>
          </Container>
        </ContactCinematicScene>

        <ContactCinematicScene
          id="thanks"
          labelledBy="contact-gratitude-heading"
          variant="afterglow"
          className="bg-soil"
          media={
            <>
              <BackgroundVideo
                video="/videos/generated/bt-contact-original-gratitude.mp4"
                videoMobile="/videos/generated/bt-contact-original-gratitude-mobile.mp4"
                poster="/images/generated/bt-contact-original-gratitude-poster.jpg"
                imagePosition="center 42%"
                playbackRate={0.78}
                posterPriority={false}
                push
              />
              <div
                aria-hidden="true"
                className="absolute inset-0"
                style={{
                  backgroundImage:
                    "linear-gradient(180deg, rgba(24,31,23,0.5) 0%, rgba(26,34,24,0.58) 58%, rgba(39,34,30,0.86) 100%), radial-gradient(circle at 50% 43%, rgba(238,216,174,0.12) 0%, rgba(24,31,23,0.38) 70%)",
                }}
              />
            </>
          }
        >
          <ContactGratitude />
        </ContactCinematicScene>
      </main>
      <Footer compact className="contact-footer-afterglow" />
    </>
  );
}
