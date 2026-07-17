import Link from "next/link";
import { Container } from "./Container";
import { IndianPattern } from "./IndianPattern";
import { Logo } from "./Logo";
import { site, navigation, footerLinks } from "@/data/site";

export function Footer() {
  return (
    <footer className="border-t border-border bg-background-alt">
      <div className="h-10 overflow-hidden border-b border-border/60" aria-hidden="true">
        <IndianPattern opacity={0.1} />
      </div>
      <Container className="py-12">
        <div className="grid gap-10 md:grid-cols-3">
          <div>
            <Logo size={26} />
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
              <li>
                <a
                  href={site.social.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-foreground hover:text-action-primary"
                >
                  LinkedIn
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-10 flex flex-col-reverse gap-4 border-t border-border pt-6 sm:flex-row sm:items-center sm:justify-between">
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
