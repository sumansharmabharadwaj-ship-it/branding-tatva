import Link from "next/link";
import { Container } from "@/components/Container";
import { IndianPattern } from "@/components/IndianPattern";
import { TexturedDark } from "@/components/TexturedDark";
import { Logo } from "@/components/Logo";
import { ElementGlyph } from "@/components/ElementGlyph";
import { Reveal } from "@/components/Reveal";
import { SplitReveal } from "@/components/SplitReveal";
import { LinkButton } from "@/components/Button";
import { site, footerLinks } from "@/data/site";
import { socialLinks, EMBERS, REVEAL_DELAY_LOGO } from "./constants";

// The old footer spent its first screen on a nav column the header already
// covers and a positioning paragraph nobody reads at the very bottom of a
// page. This closes every page the way the site's own argument wants to
// close — one line, a way to start, then the mark settling like credits —
// instead of stopping on a sitemap. own-alpenglow-peak.jpg was sitting
// unused in the library: an actual end-of-day photo for an actual closing
// scene, not a stock sunset.

export function Footer() {
  return (
    <footer className="relative border-t border-border">
      <div className="h-10 overflow-hidden border-b border-border/60" aria-hidden="true">
        <IndianPattern opacity={0.1} />
      </div>

      <TexturedDark image="/images/own-alpenglow-peak.jpg" className="py-24 sm:py-32">
        <div className="footer-embers" aria-hidden="true">
          {EMBERS.map((ember, i) => (
            <span
              key={i}
              style={{
                top: ember.top,
                left: ember.left,
                width: ember.size,
                height: ember.size,
                animationDelay: ember.delay,
                animationDuration: ember.duration,
              }}
            />
          ))}
        </div>

        <Container className="relative text-center">
          <Reveal>
            <ElementGlyph slug="space" className="mx-auto h-6 w-6 text-ivory/50" strokeWidth={1.2} />
            <SplitReveal className="mx-auto mt-6 max-w-3xl font-display text-[clamp(2rem,5.5vw,4rem)] font-semibold leading-[1.1] text-ivory">
              Every brand is visible. Let&apos;s make yours unforgettable.
            </SplitReveal>
          </Reveal>

          <Reveal delay={0.1} className="mt-9 flex justify-center">
            <LinkButton href="/contact">Start a project</LinkButton>
          </Reveal>

          <Reveal delay={REVEAL_DELAY_LOGO} className="mt-20 flex justify-center sm:mt-24">
            <Logo light className="scale-[2.6] sm:scale-[3.4]" />
          </Reveal>

          <Reveal
            delay={REVEAL_DELAY_LOGO + 0.05}
            className="mt-10 flex flex-col items-center gap-4 sm:flex-row sm:justify-center sm:gap-6"
          >
            <a
              href={`mailto:${site.email}`}
              className="text-sm text-ivory/70 transition-colors hover:text-ivory"
            >
              {site.email}
            </a>
            <div className="flex gap-3">
              {socialLinks.map(({ href, label, Icon }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`${site.name} on ${label}`}
                  className="flex h-9 w-9 items-center justify-center rounded-full border border-ivory/25 text-ivory/70 transition-colors hover:border-ivory/50 hover:text-ivory"
                >
                  <Icon size={16} strokeWidth={1.75} />
                </a>
              ))}
            </div>
          </Reveal>
        </Container>
      </TexturedDark>

      <div className="flex flex-col-reverse items-center gap-3 border-t border-border bg-background-alt px-6 py-5 text-center sm:flex-row sm:justify-between sm:px-10">
        <p className="text-xs text-foreground-secondary">
          © {new Date().getFullYear()} {site.name}
        </p>
        <div className="flex gap-4">
          {footerLinks.map((item) => (
            <Link key={item.href} href={item.href} className="text-xs text-foreground-secondary hover:text-soil">
              {item.label}
            </Link>
          ))}
        </div>
      </div>
    </footer>
  );
}
