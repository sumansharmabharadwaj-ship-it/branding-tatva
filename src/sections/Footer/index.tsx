import Link from "next/link";
import { Container } from "@/components/Container";
import { IndianPattern } from "@/components/IndianPattern";
import { Logo } from "@/components/Logo";
import { ElementGlyph } from "@/components/ElementGlyph";
import { Reveal } from "@/components/Reveal";
import { site, navigation, footerLinks } from "@/data/site";
import { socialLinks, MANIFESTO_GLOW, REVEAL_DELAY_LOGO } from "./constants";

// No animations.ts here on purpose: every motion in this section is the
// shared Reveal primitive (src/components/Reveal.tsx) used as-is, with
// no Footer-specific timing or variants of its own to isolate — adding
// an empty file would just be ceremony.

export function Footer() {
  return (
    <footer className="relative border-t border-border bg-background-alt">
      <div className="h-10 overflow-hidden border-b border-border/60" aria-hidden="true">
        <IndianPattern opacity={0.1} />
      </div>
      <Container className="py-16 sm:py-20">
        <div className="grid gap-10 md:grid-cols-3">
          <div>
            <p className="max-w-xs text-sm text-foreground-secondary">
              {site.positioning}
            </p>
          </div>

          <nav aria-label="Footer navigation">
            <p className="text-xs font-medium uppercase tracking-wide text-foreground-secondary">
              Navigate
            </p>
            <ul className="mt-3 space-y-2">
              {navigation.map((item) => (
                <li key={item.href}>
                  <Link href={item.href} className="text-sm text-foreground hover:text-action-primary">
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div>
            <p className="text-xs font-medium uppercase tracking-wide text-foreground-secondary">
              Connect
            </p>
            <ul className="mt-3 space-y-2">
              <li>
                <a href={`mailto:${site.email}`} className="text-sm text-foreground hover:text-action-primary">
                  {site.email}
                </a>
              </li>
            </ul>
            <div className="mt-4 flex gap-3">
              {socialLinks.map(({ href, label, Icon }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`${site.name} on ${label}`}
                  className="flex h-9 w-9 items-center justify-center rounded-full border border-border text-foreground transition-colors hover:border-action-primary hover:text-action-primary"
                >
                  <Icon size={16} strokeWidth={1.75} />
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* Manifesto — the hero's own hook, echoed back as a closing
            statement rather than a mid-page pitch, so the site's argument
            resolves instead of just stopping. */}
        <div className="relative mt-20 overflow-hidden py-6 text-center sm:mt-28">
          <IndianPattern className="absolute inset-0" opacity={0.05} />
          <div
            className="pointer-events-none absolute left-1/2 top-0 h-64 w-64 -translate-x-1/2 -translate-y-1/4 rounded-full opacity-70"
            style={{ background: MANIFESTO_GLOW }}
            aria-hidden="true"
          />
          <Reveal className="relative">
            <ElementGlyph slug="space" className="mx-auto h-6 w-6 text-clay/70" strokeWidth={1.2} />
            <h2 className="mx-auto mt-6 max-w-2xl font-display text-[clamp(1.75rem,4vw,2.75rem)] font-semibold leading-[1.15] text-soil">
              {site.heroHeadline}
            </h2>
            <p className="mx-auto mt-5 max-w-md font-display text-lg italic text-foreground-secondary">
              &ldquo;{site.tagline}&rdquo;
            </p>
          </Reveal>
        </div>

        {/* Large logo — the final signature, not a repeat of the header */}
        <Reveal delay={REVEAL_DELAY_LOGO} className="mt-20 flex justify-center py-4 sm:mt-24">
          <Logo className="scale-[1.9] sm:scale-[2.3]" />
        </Reveal>

        <div className="mt-20 flex flex-col-reverse gap-4 border-t border-border pt-6 sm:mt-24 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-xs text-foreground-secondary">
            © {new Date().getFullYear()} {site.name}. All rights reserved.
          </p>
          <div className="flex gap-4">
            {footerLinks.map((item) => (
              <Link key={item.href} href={item.href} className="text-xs text-foreground-secondary hover:text-soil">
                {item.label}
              </Link>
            ))}
          </div>
        </div>
      </Container>
    </footer>
  );
}
