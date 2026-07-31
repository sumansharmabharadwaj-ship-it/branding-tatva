import Image from "next/image";
import { Container } from "@/components/Container";
import { credentials, aboutIntro } from "@/data/about";
import { projects } from "@/data/projects";

// Trust beat — "Founder Lens" per the brief's own naming. Reuses the
// exact sticky-rail layout (image column pinned, content scrolling
// beside it) already proven on the case-study and blog-post templates
// (work/[slug]/page.tsx, blog/[slug]/page.tsx), not a new mechanism.
// own-portrait.jpg is Suman's own real photo, already used on About's
// working-method section — reused here rather than a stock "founder"
// image or an invented video of her speaking, which doesn't exist.
// Copy is aboutIntro's own established lines (data/about.ts), not
// rewritten — the same founder voice should read identically wherever
// it appears on the site.
export function FounderLens() {
  const engagementCount = projects.length;

  return (
    <Container>
      <p className="text-sm font-medium uppercase tracking-wide text-sandstone">Trust</p>
      <h2 className="mt-2 max-w-xl text-display-sm font-display font-normal text-ivory">
        Can you trust the person behind this?
      </h2>
      <div className="mt-10 lg:grid lg:grid-cols-[300px_1fr] lg:gap-14">
        <div className="hidden lg:block">
          <div className="sticky top-32 space-y-6">
            <div className="relative aspect-[3/4] overflow-hidden rounded-lg">
              <Image src="/images/own-portrait.jpg" alt="Suman Sharma" fill sizes="300px" style={{ objectFit: "cover", objectPosition: "center 25%" }} />
            </div>
            <div>
              <p className="font-display text-lg font-normal text-ivory">Suman Sharma</p>
              <p className="mt-1 text-sm text-ivory/60">Founder, Branding Tatva</p>
            </div>
          </div>
        </div>

        <div className="mt-8 max-w-xl lg:mt-0">
          <div className="relative mb-8 aspect-[4/5] overflow-hidden rounded-lg lg:hidden">
            <Image src="/images/own-portrait.jpg" alt="Suman Sharma" fill sizes="100vw" style={{ objectFit: "cover", objectPosition: "center 25%" }} />
          </div>
          <p className="font-display text-2xl font-normal text-ivory sm:text-3xl">{aboutIntro.opening}</p>
          <p className="mt-5 text-ivory/75">{aboutIntro.body[0]}</p>

          <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-3 text-xs uppercase tracking-[0.15em] text-ivory/50 sm:text-sm">
            {credentials
              .filter((c) => c.featured)
              .map((c) => (
                <span key={c.label}>{c.label}</span>
              ))}
            <span>{engagementCount} real client engagements</span>
          </div>

          <ul className="mt-8 space-y-3 border-t border-ivory/15 pt-6">
            {credentials
              .filter((c) => !c.featured)
              .map((c) => (
                <li key={c.label} className="text-sm text-ivory/70">
                  <span style={{ color: c.color }}>{c.label}</span>
                  <span className="text-ivory/50"> · {c.detail}</span>
                </li>
              ))}
          </ul>
        </div>
      </div>
    </Container>
  );
}
