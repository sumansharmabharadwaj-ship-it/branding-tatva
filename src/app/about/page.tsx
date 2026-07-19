import type { Metadata } from "next";
import Image from "next/image";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Container } from "@/components/Container";
import { LinkButton } from "@/components/Button";
import { Reveal } from "@/components/Reveal";
import { PhotoHero } from "@/components/PhotoHero";
import { VideoBreak } from "@/components/VideoBreak";
import { aboutIntro, credentials, experience } from "@/data/about";
import { designChoices } from "@/data/design-rationale";
import { site } from "@/data/site";

export const metadata: Metadata = {
  title: "About Suman Sharma",
  description: `The thinking behind ${site.name}: brand strategy grounded in psychology and language.`,
};

export default function AboutPage() {
  return (
    <>
      <Header transparent />
      <main id="main-content">
        <PhotoHero image="/images/own-companions.jpg" minHeight="80vh" imagePosition="30% 75%">
          <Container className="relative pb-16 pt-20 text-center sm:pb-20">
            <Reveal>
              <span className="inline-flex items-center rounded-full border border-ivory/30 px-4 py-1.5 text-[0.65rem] font-medium uppercase tracking-[0.25em] text-ivory/85">
                About
              </span>
              <h1 className="mx-auto mt-6 max-w-2xl font-display text-[clamp(1.75rem,4vw,3rem)] font-semibold leading-[1.15] text-ivory">
                {aboutIntro.opening}
              </h1>
              <div className="mt-8">
                <LinkButton href="/contact">Start a brand conversation</LinkButton>
              </div>
            </Reveal>
          </Container>
        </PhotoHero>

        <section className="pb-20 pt-20 sm:pb-28 sm:pt-28">
          <Container>
            <Reveal>
              <div className="max-w-xl space-y-5 text-foreground-secondary">
                {aboutIntro.body.map((para, i) => (
                  <p key={i}>{para}</p>
                ))}
              </div>
            </Reveal>
          </Container>
        </section>

        <VideoBreak
          src="/videos/cinematic-ridge.mp4"
          poster="/images/cinematic-ridge-poster.jpg"
          quote="The fog lifts the same way clarity does: slowly, then all at once."
          height="85vh"
          quoteVariant="left"
          overlayGradient="linear-gradient(180deg, #F4EFE6 0%, rgba(20,17,14,0.55) 15%, rgba(20,17,14,0.55) 65%, rgba(20,17,14,0.35) 90%, #E8DED0 100%)"
        />

        <section className="border-t border-border bg-background-alt py-20">
          <Container className="grid gap-12 md:grid-cols-[auto_1fr]">
            <Reveal>
              <Image
                src="/images/own-portrait.jpg"
                alt="Suman Sharma"
                width={480}
                height={480}
                className="aspect-square w-40 rounded-full object-cover sm:w-48"
              />
            </Reveal>
            <div className="grid gap-12 sm:grid-cols-2">
              <Reveal delay={0.1}>
                <h2 className="text-display-sm font-display font-semibold text-soil">
                  Working method
                </h2>
                <p className="mt-4 text-foreground-secondary">
                  I don&apos;t start with mood boards. I start by asking what
                  a business believes, who it&apos;s actually speaking to,
                  and where its current story stops making sense. The
                  elemental system, earth, water, fire, air, space, is how I
                  keep track of which part of that is solved and which
                  isn&apos;t.
                </p>
                <p className="mt-4 text-foreground-secondary">
                  I use &ldquo;I&rdquo; instead of &ldquo;we.&rdquo; Branding
                  Tatva is a personal practice, and every project has my
                  direct attention.
                </p>
              </Reveal>

              <Reveal delay={0.15}>
                <h2 className="text-display-sm font-display font-semibold text-soil">
                  Recent experience
                </h2>
                <ul className="mt-4 space-y-4">
                  {experience.map((role) => (
                    <li key={`${role.org}-${role.period}`} className="border-l-2 border-action-primary/30 pl-4">
                      <p className="font-medium text-soil">{role.role}</p>
                      <p className="text-sm text-foreground-secondary">
                        {role.org} &middot; {role.period}
                      </p>
                    </li>
                  ))}
                </ul>
              </Reveal>
            </div>
          </Container>
        </section>

        <section className="py-20">
          <Container>
            <div className="grid gap-8 md:grid-cols-[220px_1fr] md:gap-12">
              <Reveal>
                <h2 className="text-display-sm font-display font-semibold text-soil md:sticky md:top-28">
                  Credentials
                </h2>
              </Reveal>
              <div className="grid items-stretch gap-6 sm:grid-cols-2">
                {credentials.map((c, i) => (
                  <Reveal key={c.label} delay={i * 0.06} className="h-full">
                    <div
                      className="flex h-full flex-col rounded-lg border-t-2 border-border bg-background-elevated p-5 shadow-elevation-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-elevation-md"
                      style={{ borderTopColor: c.color }}
                    >
                      <p className="font-medium text-soil">{c.label}</p>
                      <p className="mt-1 text-sm text-foreground-secondary">{c.detail}</p>
                    </div>
                  </Reveal>
                ))}
              </div>
            </div>
          </Container>
        </section>

        <section className="border-t border-border bg-background-alt py-20">
          <Container>
            <Reveal>
              <h2 className="text-display-sm font-display font-semibold text-soil">
                Why this site looks the way it does
              </h2>
              <p className="mt-4 max-w-2xl text-foreground-secondary">
                I could tell a prospective client what good branding looks
                like, or I could just let this site be the example. Every
                choice below was made on purpose, and I&apos;d make the same
                case for yours.
              </p>
            </Reveal>
            <div className="mt-10 grid gap-8 sm:grid-cols-2">
              {designChoices.map((choice, i) => (
                <Reveal key={choice.title} delay={i * 0.08}>
                  <p className="font-medium text-soil">{choice.title}</p>
                  <p className="mt-2 text-sm text-foreground-secondary">
                    {choice.detail}
                  </p>
                </Reveal>
              ))}
            </div>
          </Container>
        </section>
      </main>
      <Footer />
    </>
  );
}
