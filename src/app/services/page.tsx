import type { Metadata } from "next";
import Image from "next/image";
import { Header } from "@/layouts/Header";
import { Footer } from "@/sections/Footer";
import { Container } from "@/components/Container";
import { LinkButton } from "@/components/Button";
import { Reveal } from "@/components/Reveal";
import { SplitReveal } from "@/components/SplitReveal";
import { TiltCard } from "@/components/TiltCard";
import { PhotoHero } from "@/components/PhotoHero";
import { VideoBreak } from "@/components/VideoBreak";
import { TexturedDark } from "@/components/TexturedDark";
import { ClipReveal } from "@/components/ClipReveal";
import { ElementGlyph } from "@/components/ElementGlyph";
import { NatureAccent } from "@/components/NatureAccent";
import { SectionJumpNav } from "@/components/SectionJumpNav";
import { ProcessSection } from "@/sections/Process";
import { elements } from "@/data/elements";
import { process } from "@/data/process";
import { serviceGroups, offerings } from "@/data/services";
import { elementColor } from "@/lib/elementColor";
import { blendHex, ELEMENT_HEX } from "@/lib/sectionWash";

export const metadata: Metadata = {
  title: "Services",
  description:
    "Brand strategy, content strategy, social media marketing, and website development, all under one roof.",
  alternates: { canonical: "/services" },
  openGraph: {
    title: "Services | Branding Tatva",
    description:
      "Brand strategy, content strategy, social media marketing, and website development, all under one roof.",
    type: "website",
  },
};

// Approximate position of each element's own color-strand in
// higgsfield-elements-convergence.jpg, eyeballed against the actual
// image rather than computed — this is a decorative diagram dot, not a
// precision data point, so an exact match isn't the goal.
const ELEMENT_DOTS: { slug: "earth" | "water" | "fire" | "air" | "space"; top: string; left: string }[] = [
  { slug: "earth", top: "22%", left: "16%" },
  { slug: "water", top: "58%", left: "22%" },
  { slug: "fire", top: "42%", left: "48%" },
  { slug: "air", top: "32%", left: "80%" },
  { slug: "space", top: "68%", left: "76%" },
];

export default function ServicesPage() {
  return (
    <>
      <Header transparent />
      <main id="main-content">
        {/* Was a static mountain-silhouette photo — the site's one
            remaining static hero, and direct feedback pointed at the
            reference site's own "Heat" chapter (a close-up glowing-embers
            clip) as exactly the fire-element mood wanted here. A
            close-up fire loop doesn't illustrate "services" literally,
            but neither does any other hero on the site illustrate its
            own page literally — it's the same atmospheric-backdrop
            convention, just drawing on Fire instead of Earth/Water. */}
        <PhotoHero
          video="/videos/higgsfield-glowing-embers.mp4"
          poster="/images/higgsfield-glowing-embers-poster.jpg"
          minHeight="70vh"
        >
          <Container className="relative py-20 text-center">
            <Reveal className="relative">
              {/* One quiet accent on a fire-themed hero — same low-opacity,
                  near-heading placement Footer/Contact already use, just
                  the ember motif instead of leaf, since this hero already
                  runs on a glowing-embers backdrop. */}
              <NatureAccent
                variant="ember"
                className="pointer-events-none absolute -top-6 left-1/2 hidden h-10 w-10 -translate-x-[140%] text-ivory/20 sm:block"
              />
              <span className="inline-flex items-center rounded-full border border-ivory/30 px-4 py-1.5 text-[0.65rem] font-medium uppercase tracking-[0.25em] text-ivory/85">
                Services
              </span>
              <SplitReveal
                as="h1"
                className="mx-auto mt-6 max-w-2xl font-display text-[clamp(2rem,4.5vw,3.25rem)] font-normal leading-[1.1] text-ivory"
              >
                Everything a brand needs, in plain terms.
              </SplitReveal>
              <p className="mx-auto mt-4 max-w-xl text-ivory/70">
                Strategy, identity, content, and the channels that carry it.
                Here&apos;s what I actually do, before we get into how I
                think about it.
              </p>
            </Reveal>
          </Container>
        </PhotoHero>

        {/* Was bold solid Soil — per direct feedback pointing at the
            reference site's own restraint, moved back to a light neutral
            for this card grid. Cards keep their own opaque blendHex tint
            (still legible either way) and lean on their colored top
            border + icon for definition, the same restrained way the
            reference site's own cards separate from their background. */}
        <section id="offerings" className="scroll-mt-24 bg-background-alt py-14">
          <Container>
            <div className="spotlight-grid grid items-stretch gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {offerings.map((offer, i) => (
                <Reveal key={offer.name} delay={i * 0.06} className="h-full">
                  <TiltCard glowColor={offer.color}>
                    {/* border (all sides) added alongside the existing
                        border-t-2 accent — the card's own fill is a
                        light tint too close in lightness to the section's
                        own background-alt to read as a distinct object by
                        color alone (contrast-checked at ~1.1:1), so a
                        real edge does the defining work instead. */}
                    <div
                      className="spotlight-card relative flex h-full flex-col overflow-hidden rounded-lg border border-t-2 border-soil/10 p-6 shadow-elevation-sm transition-colors duration-300"
                      style={{
                        borderTopColor: offer.color,
                        backgroundColor: blendHex(offer.color, "#FCFAF6", 14),
                        ["--card-color" as string]: offer.color,
                      }}
                    >
                      <span
                        aria-hidden="true"
                        className="absolute -right-1 -top-3 font-display text-6xl font-normal leading-none"
                        style={{ color: offer.color, opacity: 0.18 }}
                      >
                        {String(i + 1).padStart(2, "0")}
                      </span>
                      <p className="relative font-display text-lg font-normal text-soil transition-colors duration-300">{offer.name}</p>
                      <p className="relative mt-2 text-sm text-foreground-secondary">{offer.detail}</p>
                    </div>
                  </TiltCard>
                </Reveal>
              ))}
            </div>
          </Container>
        </section>

        <VideoBreak
          src="/videos/own-golden-branches.mp4"
          poster="/images/own-golden-branches-poster.jpg"
          quote="The right service is just the vehicle. The strategy is what moves."
          height="72vh"
          imagePosition="center 75%"
        />

        {/* Was five arch-shaped cards in a row — direct feedback pointing
            at alethia.earth's own annotated-photo technique called this
            "a boring way to make people understand things." Replaced
            with one picture instead: higgsfield-elements-convergence.jpg
            (already in the library, unused) shows five ribbon strands in
            each element's own color spiraling into one point — an
            already-literal visual of "five elements, one brand," not
            just a neutral backdrop standing in for a card grid. Each
            strand gets a small dot at roughly where its color reads
            clearest in the photo; the legend below keeps every piece of
            the original cards' content (glyph, quote, meaning, services,
            proof) just without the arch-card borders and fills. */}
        {/* SectionHeading hardcodes text-soil, so — same rule already
            applied to the "How I work" and "By situation" sections below
            — this one instance is hand-rolled in ivory instead of
            touching that shared component's defaults for every other
            caller. */}
        <section id="elements" className="scroll-mt-24 bg-soil py-16 sm:py-20">
          <Container>
            <div className="max-w-2xl">
              <p className="text-sm font-medium uppercase tracking-wide text-sandstone">The deeper system</p>
              <h2 className="mt-2 text-display-sm font-display font-normal text-ivory">
                The elements that make a brand complete.
              </h2>
              <p className="mt-4 text-ivory/75">
                Every project draws on some combination of these five. None
                of them work well in isolation, and that&apos;s usually the
                actual problem a brand walks in with.
              </p>
            </div>
          </Container>

          <Reveal className="relative mx-auto mt-10 aspect-[16/9] w-full max-w-4xl overflow-hidden rounded-lg sm:mt-14">
            <Image
              src="/images/higgsfield-elements-convergence.jpg"
              alt=""
              fill
              sizes="(min-width: 1024px) 60vw, 100vw"
              style={{ objectFit: "cover" }}
            />
            {ELEMENT_DOTS.map((dot) => (
              <span
                key={dot.slug}
                aria-hidden="true"
                className="absolute h-3 w-3 -translate-x-1/2 -translate-y-1/2 rounded-full ring-2 ring-ivory/70"
                style={{ top: dot.top, left: dot.left, backgroundColor: ELEMENT_HEX[dot.slug] }}
              />
            ))}
          </Reveal>

          <Container>
            <div className="mt-14 grid gap-x-8 gap-y-10 sm:grid-cols-2 lg:grid-cols-5">
              {elements.map((el, i) => (
                <Reveal key={el.slug} delay={i * 0.08}>
                  <div className="flex items-center gap-2">
                    <span aria-hidden="true" className="h-2.5 w-2.5 shrink-0 rounded-full" style={{ backgroundColor: el.color }} />
                    <ElementGlyph slug={el.slug} className="h-5 w-5" style={{ color: el.color }} />
                  </div>
                  <p className="mt-3 font-display text-lg font-normal text-ivory">{el.name}</p>
                  <p className="mt-2 font-display text-sm italic text-ivory/70">&ldquo;{el.poetic}&rdquo;</p>
                  <p className="mt-2 text-sm text-ivory/70">{el.meaning}</p>
                  <ul className="mt-4 space-y-1.5">
                    {el.services.map((s) => (
                      <li key={s} className="text-sm text-ivory/70 before:mr-2 before:content-['•']">
                        {s}
                      </li>
                    ))}
                  </ul>
                  <p className="mt-4 pt-4 text-xs italic text-ivory/50">{el.proof}</p>
                </Reveal>
              ))}
            </div>
          </Container>
        </section>

        {/* The philosophy (elements) and the offerings (what) don't
            explain the actual sequence of working together — this does,
            reusing the same six-stage process (and the same
            VerticalJourney component) the home page already uses,
            rather than inventing a separate framework just for this
            page. */}
        {/* Was Ochre blended 60% toward Soil — a warm dark variant that,
            next to this page's own true-Soil sections above and below it
            (#elements, #by-situation), was one more slightly-off dark
            tone in the mix. Direct feedback that a different color per
            section reads as cluttered rather than cohesive applies here
            too — collapsed to plain Soil so all three dark sections on
            this page match exactly. VerticalJourney/JourneyStage take an
            opt-in `dark` prop for this (see sections/Process/types.ts) so
            Home's Process section is unaffected. SectionHeading
            hardcodes text-soil, so this instance is hand-rolled in ivory
            rather than touching that shared component's defaults for
            every other caller. */}
        <section id="process" className="scroll-mt-24 bg-soil py-16">
          {/* overflow-hidden scoped to this inner wrapper only, not the
              outer section — ProcessSection right below relies on
              `position: sticky` (PinnedJourney), which breaks the
              moment any ancestor has overflow other than visible (see
              PinnedJourney's own comment, and the Home page's identical
              note for its own Process section heading). Ghost watermark
              word, same technique as Home's "ELEMENTS" and About's
              "WHY" — this page had none of the site's recurring
              signature moments, reading plainer than Home/About. */}
          <div className="relative overflow-hidden">
            <span
              aria-hidden="true"
              className="pointer-events-none absolute -top-4 left-0 select-none whitespace-nowrap font-display text-[clamp(3rem,11vw,9rem)] font-bold leading-none text-ivory/[0.06] sm:-top-8"
            >
              METHOD
            </span>
            <Container className="relative">
              <div className="max-w-2xl">
                <p className="text-sm font-medium uppercase tracking-wide text-sandstone">How I work</p>
                <h2 className="mt-2 text-display-sm font-display font-normal text-ivory">
                  The same six steps, every time.
                </h2>
                <p className="mt-4 text-ivory/75">
                  Each stage depends on the one before it, a sequence rather
                  than a checklist you can jump around in. That order is
                  usually where a rushed process starts to show.
                </p>
              </div>
            </Container>
          </div>
          <ProcessSection stages={process} elementColor={elementColor} dark />
        </section>

        {/* Bold solid Soil, not the Phase-5 earth tint — matches the
            grid-of-cards=soil rule now applied to every other card-grid
            section site-wide. The cards' fill used the same translucent
            alpha-hex trick as the offerings cards (fixed above), which
            would go dark-on-dark against Soil — swapped for the same
            opaque blendHex tint. SectionHeading hardcodes text-soil, so
            this one instance is hand-rolled in ivory instead of touching
            that shared component's defaults for every other caller. */}
        <section id="by-situation" className="scroll-mt-24 bg-soil py-16">
          <Container>
            <div className="max-w-2xl">
              <p className="text-sm font-medium uppercase tracking-wide text-sandstone">By situation</p>
              <h2 className="mt-2 text-display-sm font-display font-normal text-ivory">
                Organised by where your brand is right now.
              </h2>
            </div>
            <div className="spotlight-grid mt-10 grid items-stretch gap-6 md:grid-cols-2">
              {serviceGroups.map((group, i) => (
                <Reveal key={group.slug} delay={i * 0.08} className="h-full">
                  <TiltCard glowColor={group.color}>
                    <div
                      id={group.slug}
                      className="spotlight-card flex h-full scroll-mt-24 flex-col rounded-lg border-t-2 p-6 shadow-elevation-sm transition-colors duration-300"
                      style={{
                        borderTopColor: group.color,
                        backgroundColor: blendHex(group.color, "#FCFAF6", 10),
                        ["--card-color" as string]: group.color,
                      }}
                    >
                      <p className="font-display text-xl font-normal text-soil">{group.name}</p>
                      <p className="mt-1 text-sm font-medium" style={{ color: group.color }}>{group.forWho}</p>
                      <p className="mt-4 text-foreground-secondary">{group.description}</p>
                      <ul className="mt-4 space-y-1.5">
                        {group.includes.map((item) => (
                          <li key={item} className="text-sm text-foreground-secondary before:mr-2 before:content-['•']">
                            {item}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </TiltCard>
                </Reveal>
              ))}
            </div>
            <p className="mt-8 text-sm text-ivory/70">
              Pricing is discussed after understanding your project. Every
              engagement is scoped individually rather than sold off a fixed
              menu.
            </p>
          </Container>
        </section>

        {/* TexturedDark sits outside ClipReveal now, not wrapped by it
            — it renders its own background image independently of its
            children, and clip-path hides an element's entire box, so
            wrapping the whole component meant a slow-to-fire reveal
            trigger showed blank page background instead of its own
            fill during fast real-device scrolling. Same fix as every
            other ClipReveal/PerspectiveReveal section this round. */}
        <TexturedDark image="/images/higgsfield-golden-ridge.jpg" className="py-24 text-center sm:pb-28">
          <ClipReveal>
            <Container>
              <h2 className="text-display-md font-display font-normal text-ivory">
                Still deciding which one fits?
              </h2>
              <p className="mx-auto mt-4 max-w-md text-ivory/70">
                That&apos;s a completely normal place to start. Tell me where
                your brand is right now and I&apos;ll tell you honestly what it needs.
              </p>
              <div className="mt-8">
                <LinkButton href="/contact">Start a brand conversation</LinkButton>
              </div>
            </Container>
          </ClipReveal>
        </TexturedDark>
      </main>
      <Footer />
      <SectionJumpNav
        items={[
          { href: "#offerings", label: "Offerings" },
          { href: "#elements", label: "Elements" },
          { href: "#process", label: "How I work" },
          { href: "#by-situation", label: "By situation" },
        ]}
      />
    </>
  );
}
