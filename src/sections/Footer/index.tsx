import Link from "next/link";
import type { ReactNode } from "react";
import { Container } from "@/components/Container";
import { TexturedDark } from "@/components/TexturedDark";
import { Logo } from "@/components/Logo";
import { SeasonalCalendarPanel } from "@/components/SeasonalCalendarPanel";
import { Reveal } from "@/components/Reveal";
import { site, footerLinks } from "@/data/site";
import { socialLinks } from "./constants";
import { MotionToggle } from "@/components/MotionPreference";
import { ConsentPreferencesLink } from "@/components/ConsentPreferencesLink";

// Rebuilt as a compact "widget bar" — direct feedback that the previous
// full-screen closing scene (headline, five glyphs, giant logo, a
// standalone email/social block) buried the actual conversion goal
// (booking a call) under a lot of space and scroll with poor alignment.
// This keeps the same close-every-page-consistently job (Footer already
// renders on all 12 pages) but gets to the booking widget immediately,
// side by side with a brand/CTA card and a contact card — like a taskbar,
// not another full scene. The jagged peaks backdrop (restored on
// direct request) sits behind a much shorter passage now that there's
// far less content sitting on top of it.

const WIDGET_CLASS =
  "rounded-2xl border border-white/15 bg-black/20 backdrop-blur-md p-5 sm:p-6 shadow-[0_20px_60px_-20px_rgba(0,0,0,0.5)] transition-all duration-300 hover:-translate-y-1 hover:border-white/25 hover:bg-black/25";

type FooterProps = {
  compact?: boolean;
  className?: string;
  intro?: ReactNode;
};

export function Footer({ compact = false, className, intro }: FooterProps) {
  return (
    <footer className={`relative ${className ?? ""}`}>
      {/* This used to carry a decorative IndianPattern strip here —
          first with no background of its own (showing plain cream
          through it), then with a bg-soil fix, then with its own
          border removed. Each round, the strip itself still read as a
          distinct "element" sitting between the two sections rather
          than disappearing into either of them — repeated feedback
          kept pointing at this exact band. Dropped entirely: the
          section above and this footer's own video now meet directly,
          with only their own color transition between them, the same
          way every other section-to-section boundary on the site
          already works. */}

      {/* Backdrop restored to the original jagged peaks on direct
          request; the dandelion release now lives in the Deliverables
          chapter on Services instead. imagePosition biased down keeps
          the pale sky band out of the section's top edge. */}
      {!compact && (
        <TexturedDark
        image="/images/own-jagged-peaks.jpg"
        video="/videos/own-jagged-peaks.mp4"
        imagePosition="center 85%"
        className="py-12 sm:py-14"
      >
        <Container className="relative">
          <Reveal className="mx-auto max-w-2xl text-center">
            {intro ?? (
              <>
                <p className="text-xs uppercase tracking-[0.3em] text-ivory/50">When the brand stops keeping up</p>
                <h2 className="mt-2 font-display text-2xl font-normal leading-tight text-ivory sm:text-3xl">
                  If the business has outgrown the brand, let&apos;s find where the gap begins.
                </h2>
              </>
            )}
          </Reveal>

          {/* The widget bar itself — three cards side by side on desktop,
              stacked on mobile. The calendar gets the most width: it's
              the one thing here that actually converts, everything else
              is support. LinkButton "Book a Session" duplicates Header's
              own CTA on purpose here — this bar is the one place a
              visitor lands right at page-bottom with both conversion
              paths (project inquiry, booking) sitting together, instead
              of one and a scroll back up for the other.
              justify-center (not justify-between) on the two side cards
              — direct feedback that stretching sparse content to match
              the taller calendar card left a dead gap in the middle of
              each one; centering reads as a deliberate compact block
              instead. */}
          <Reveal delay={0.08} className="mt-6 flex flex-col items-stretch gap-4 sm:flex-row">
            <div className={`${WIDGET_CLASS} flex flex-col justify-center gap-5 sm:w-[240px] sm:shrink-0`}>
              <div>
                <Logo light className="scale-90 origin-left" />
                <p className="mt-3 text-sm text-ivory/80">
                  A solo practice. Suman leads the thinking, writing, and direction from the first question through delivery.
                </p>
              </div>
            </div>

            <div className="sm:min-w-0 sm:flex-1">
              <SeasonalCalendarPanel />
            </div>

            <div className={`${WIDGET_CLASS} flex flex-col justify-center gap-5 sm:w-[250px] sm:shrink-0`}>
              <div>
                <p className="text-xs uppercase tracking-[0.2em] text-ivory/50">Get in touch</p>
                <a
                  href={`mailto:${site.email}`}
                  className="site-footer-email mt-2 inline-flex min-h-11 items-center text-[0.8rem] text-ivory/80 transition-colors hover:text-ivory"
                >
                  {site.email}
                </a>
              </div>
              <div className="h-px w-8 bg-ivory/20" aria-hidden="true" />
              <div>
                <p className="text-xs uppercase tracking-[0.2em] text-ivory/50">Follow along</p>
                <div className="mt-2 flex gap-3">
                  {socialLinks.map(({ href, label, Icon }) => (
                    <a
                      key={label}
                      href={href}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={`${site.name} on ${label}`}
                    className="flex h-11 w-11 items-center justify-center rounded-full border border-ivory/25 text-ivory/70 transition-colors hover:border-ivory/50 hover:text-ivory"
                    >
                      <Icon size={16} strokeWidth={1.75} />
                    </a>
                  ))}
                </div>
              </div>
            </div>
          </Reveal>
        </Container>
        </TexturedDark>
      )}

      {/* Was sectionWash("space", 14) — rgb(234,221,211), a pale near-cream
          strip sitting directly under a near-black video section, the same
          "abrupt light band right at a seam" problem the divider fixes
          earlier this session already targeted. Flipped dark (bg-soil,
          matching TexturedDark right above it) so the footer stays one
          continuous dark passage through to the very last pixel instead
          of resetting to light for the copyright line; text flips to its
          light-on-dark equivalents to match. */}
      <div className="site-footer-meta flex flex-col-reverse items-center gap-3 bg-soil px-6 py-5 text-center sm:flex-row sm:justify-between sm:px-10">
        <div className="flex flex-col items-center gap-1 sm:items-start">
          <p className="text-xs text-ivory/70">
            © {new Date().getFullYear()} {site.name}
          </p>
          {/* Kevin MacLeod's Creative Commons license (the free tier of
              his standard/CC split — see incompetech.com's own license
              page) requires this credit in exchange for no licensing
              fee, the same free-resources approach used for every
              stock video sourced this session. */}
          <p className="text-xs text-ivory/70">
            Ambient music: &ldquo;That Zen Moment&rdquo; by{" "}
            <a
              href="https://incompetech.com"
              target="_blank"
              rel="noopener noreferrer"
              className="underline decoration-ivory/40 underline-offset-2 hover:text-ivory"
            >
              Kevin MacLeod
            </a>{" "}
            (CC BY 4.0)
          </p>
        </div>
        <div className="flex flex-wrap items-center justify-center gap-4">
          {/* The sitewide Full/Reduced motion control (80 page manual
              p23) — quiet, but present on every page via the footer. */}
          <MotionToggle />
          {/* Withdrawing has to be as easy as agreeing was, so the door back
              to the consent panel sits on every page. */}
          <ConsentPreferencesLink />
          {footerLinks.map((item) => (
            <Link key={item.href} href={item.href} className="inline-flex min-w-11 items-center justify-center text-xs text-ivory/70 hover:text-ivory">
              {item.label}
            </Link>
          ))}
        </div>
      </div>
    </footer>
  );
}
