import Link from "next/link";
import { Instagram, Facebook, Linkedin } from "lucide-react";
import { Container } from "./Container";
import { IndianPattern } from "./IndianPattern";
import { Logo } from "./Logo";
import { ElementGlyph } from "./ElementGlyph";
import { site, navigation, footerLinks } from "@/data/site";

const socialLinks = [
  { href: site.social.linkedin, label: "LinkedIn", Icon: Linkedin },
  { href: site.social.instagram, label: "Instagram", Icon: Instagram },
  { href: site.social.facebook, label: "Facebook", Icon: Facebook },
].filter((s) => s.href);

export function Footer() {
  return (
    <footer className="border-t border-border bg-background-alt">
      <div className="h-10 overflow-hidden border-b border-border/60" aria-hidden="true">
        <IndianPattern opacity={0.1} />
      </div>
      <Container className="py-12">
        <div className="grid gap-10 md:grid-cols-3">
          <div>
            <Logo />
            <p className="mt-3 max-w-xs text-sm text-foreground-secondary">
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

        <div className="mt-14 flex flex-col items-center gap-3 text-center">
          <ElementGlyph slug="space" className="h-5 w-5 text-clay/70" strokeWidth={1.2} />
          <p className="max-w-sm font-display text-lg italic text-foreground-secondary">
            &ldquo;{site.tagline}&rdquo;
          </p>
        </div>

        <div className="mt-8 flex flex-col-reverse gap-4 border-t border-border pt-6 sm:flex-row sm:items-center sm:justify-between">
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
