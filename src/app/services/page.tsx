import type { Metadata } from "next";
import Image from "next/image";
import { Header } from "@/layouts/Header";
import { Footer } from "@/sections/Footer";
import { Container } from "@/components/Container";
import { SectionHeading } from "@/components/SectionHeading";
import { LinkButton } from "@/components/Button";
import { Reveal } from "@/components/Reveal";
import { TiltCard } from "@/components/TiltCard";
import { PhotoHero } from "@/components/PhotoHero";
import { VideoBreak } from "@/components/VideoBreak";
import { TexturedDark } from "@/components/TexturedDark";
import { ClipReveal } from "@/components/ClipReveal";
import { ElementGlyph } from "@/components/ElementGlyph";
import { SectionJumpNav } from "@/components/SectionJumpNav";
import { ProcessSection } from "@/sections/Process";
import { elements } from "@/data/elements";
import { process } from "@/data/process";
import { serviceGroups, offerings } from "@/data/services";
import { elementColor } from "@/lib/elementColor";

export const metadata: Metadata = {
  title: "Services",
  description:
    "Brand strategy, content strategy, social media marketing, and website development, all under one roof.",
};

export default function ServicesPage() {
  return (
    <>
      <Header transparent />
      <main id="main-content">
        <PhotoHero
          image="/images/own-peaks-silhouette.jpg"
          minHeight="70vh"
          imagePosition="center 65%"
        >
          <Container className="relative py-20 text-center">
            <Reveal>
              <span className="inline-flex items-center rounded-full border border-ivory/30 px-4 py-1.5 text-[0.65rem] font-medium uppercase tracking-[0.25em] text-ivory/85">
                Services
              </span>
              <h1 className="mx-auto mt-6 max-w-2xl font-display text-[clamp(2rem,4.5vw,3.25rem)] font-semibold leading-[1.1] text-ivory">
                Everything a brand needs, in plain terms.
              </h1>
              <p className="mx-auto mt-4 max-w-xl text-ivory/70">
                Strategy, identity, content, and the channels that carry it.
                Here&apos;s what I actually do, before we get into how I
                think about it.
              </p>
            </Reveal>
          </Container>
        </PhotoHero>

        <section id="offerings" className="scroll-mt-24 py-14">
          <Container>
            <div className="spotlight-grid grid items-stretch gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {offerings.map((offer, i) => (
                <Reveal key={offer.name} delay={i * 0.06} className="h-full">
                  <TiltCard glowColor={offer.color}>
                    <div
                      className="spotlight-card flex h-full flex-col rounded-lg border-t-2 p-6 shadow-elevation-sm transition-colors duration-300"
                      style={{
                        borderTopColor: offer.color,
                        backgroundColor: `${offer.color}14`,
                        ["--card-color" as string]: offer.color,
                      }}
                    >
                      <p className="font-display text-lg font-semibold text-soil transition-colors duration-300">{offer.name}</p>
                      <p className="mt-2 text-sm text-foreground-secondary">{offer.detail}</p>
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

        <section id="elements" className="scroll-mt-24 border-t border-border bg-background-alt py-16">
          <Container>
            <SectionHeading
              eyebrow="The deeper system"
              title="The elements that make a brand complete."
              description="Every project draws on some combination of these five. None of them work well in isolation, and that's usually the actual problem a brand walks in with."
            />
          </Container>
        </section>

        <section className="py-14">
          <Container>
            <div className="grid items-stretch gap-6 lg:grid-cols-5">
              {elements.map((el, i) => (
                <Reveal key={el.slug} delay={i * 0.08} className="h-full">
                  <TiltCard glowColor={el.color}>
                    <div
                      className="relative flex h-full flex-col overflow-hidden border-t-2 p-6 shadow-elevation-sm"
                      style={{ borderColor: el.color }}
                    >
                      <div className="absolute inset-0" aria-hidden="true" style={{ opacity: 0.14 }}>
                        <div className="absolute inset-0" style={{ backgroundColor: el.color }} />
                        <Image
                          src={el.image}
                          alt=""
                          fill
                          priority
                          sizes="(min-width: 1024px) 20vw, 100vw"
                          style={{ objectFit: "cover", objectPosition: "center", mixBlendMode: "color" }}
                        />
                      </div>
                      <div className="absolute inset-0 bg-background-elevated/90" aria-hidden="true" />
                      <div className="relative">
                        <ElementGlyph
                          slug={el.slug}
                          className="h-7 w-7 opacity-70"
                          style={{ color: el.color }}
                        />
                        <p className="mt-3 font-display text-xl font-semibold text-soil">{el.name}</p>
                        <p className="mt-2 font-display text-sm italic text-foreground-secondary">
                          &ldquo;{el.poetic}&rdquo;
                        </p>
                        <p className="mt-2 text-sm text-foreground-secondary">{el.meaning}</p>
                        <ul className="mt-4 space-y-1.5">
                          {el.services.map((s) => (
                            <li key={s} className="text-sm text-foreground-secondary before:mr-2 before:content-['•']">
                              {s}
                            </li>
                          ))}
                        </ul>
                        <p className="mt-4 pt-4 text-xs text-foreground-secondary/80 italic">{el.proof}</p>
                      </div>
                    </div>
                  </TiltCard>
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
        <section id="process" className="scroll-mt-24 border-t border-border py-16">
          <Container>
            <SectionHeading
              eyebrow="How I work"
              title="The same six steps, every time."
              description="Not a rigid checklist — a sequence. Each stage depends on the one before it, which is usually where a rushed process starts to show."
            />
          </Container>
          <ProcessSection stages={process} elementColor={elementColor} />
        </section>

        <section id="by-situation" className="scroll-mt-24 py-16">
          <Container>
            <SectionHeading
              eyebrow="By situation"
              title="Organised by where your brand is right now."
            />
            <div className="spotlight-grid mt-10 grid items-stretch gap-6 md:grid-cols-2">
              {serviceGroups.map((group, i) => (
                <Reveal key={group.slug} delay={i * 0.08} className="h-full">
                  <TiltCard glowColor={group.color}>
                    <div
                      id={group.slug}
                      className="spotlight-card flex h-full scroll-mt-24 flex-col rounded-lg border-t-2 p-6 shadow-elevation-sm transition-colors duration-300"
                      style={{
                        borderTopColor: group.color,
                        backgroundColor: `${group.color}0F`,
                        ["--card-color" as string]: group.color,
                      }}
                    >
                      <p className="font-display text-xl font-semibold text-soil">{group.name}</p>
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
            <p className="mt-8 text-sm text-foreground-secondary">
              Pricing is discussed after understanding your project. Every
              engagement is scoped individually rather than sold off a fixed
              menu.
            </p>
          </Container>
        </section>

        <ClipReveal>
          <TexturedDark image="/images/own-jagged-peaks.jpg" className="py-24 text-center sm:pb-28">
            <Container>
              <h2 className="text-display-md font-display font-semibold text-ivory">
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
          </TexturedDark>
        </ClipReveal>
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
