import Image from "next/image";
import { Container } from "@/components/Container";
import { Reveal } from "@/components/Reveal";
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
//
// Direct feedback that the section read as a plain biography — the
// same real 5 credentials now render as staggered chip cards (a small
// alternating vertical offset per card, Reveal's own stagger) instead
// of an inline list, for more visual presence. No new photography:
// sketches/books/research notes were requested but don't exist, and
// won't be simulated — only layout changed, not content.
export function FounderLens() {
  const engagementCount = projects.length;

  return (
    <Container>
      <p className="text-sm font-medium uppercase tracking-wide text-sandstone">Trust</p>
      <h2 className="mt-2 max-w-xl text-display-sm font-display font-normal text-ivory">
        The mind behind Branding Tatva.
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
          <p className="mt-5 text-ivory/85">{aboutIntro.body[0]}</p>
          <p className="mt-4 text-sm text-ivory/60">
            Every engagement is led directly by the founder, start to finish, no handoffs and no account managers.
          </p>

          <div className="mt-10 flex flex-wrap gap-3">
            {credentials.map((c, i) => (
              <Reveal key={c.label} delay={i * 0.06} className={i % 2 === 1 ? "sm:mt-4" : undefined}>
                <div
                  className="rounded-lg border p-4"
                  style={{ borderColor: `${c.color}55`, backgroundColor: `${c.color}14` }}
                >
                  <p className="text-sm font-medium" style={{ color: c.color }}>
                    {c.label}
                  </p>
                  <p className="mt-1 text-xs text-ivory/60">{c.detail}</p>
                </div>
              </Reveal>
            ))}
            <Reveal delay={credentials.length * 0.06}>
              <div className="flex h-full items-center rounded-lg border border-ivory/20 bg-ivory/5 px-4 py-4">
                <p className="text-sm text-ivory/80">{engagementCount} real client engagements</p>
              </div>
            </Reveal>
          </div>
        </div>
      </div>
    </Container>
  );
}
