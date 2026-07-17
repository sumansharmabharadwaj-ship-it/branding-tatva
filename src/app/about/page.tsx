import type { Metadata } from "next";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Container } from "@/components/Container";
import { LinkButton } from "@/components/Button";
import { ImagePlaceholder } from "@/components/ImagePlaceholder";
import { Reveal } from "@/components/Reveal";
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
      <Header />
      <main id="main-content">
        <section className="bg-soil py-20 sm:py-28">
          <Container className="grid items-start gap-12 lg:grid-cols-[1.4fr_1fr]">
            <Reveal>
              <p className="text-sm font-medium uppercase tracking-wide text-sandstone">
                About
              </p>
              <h1 className="mt-3 max-w-xl text-display-lg font-display font-semibold text-ivory">
                {aboutIntro.opening}
              </h1>
              <div className="mt-8 max-w-xl space-y-5 text-ivory/70">
                {aboutIntro.body.map((para, i) => (
                  <p key={i}>{para}</p>
                ))}
              </div>
              <div className="mt-8 flex flex-wrap gap-4">
                <LinkButton href="/contact">Start a brand conversation</LinkButton>
                <LinkButton href="/resume.pdf" variant="secondary" className="border-ivory/30 text-ivory hover:bg-ivory/10">
                  Download résumé
                </LinkButton>
              </div>
            </Reveal>
            <Reveal delay={0.15}>
              <ImagePlaceholder label="Portrait, pending upload" />
              <p className="mt-3 text-xs text-ivory/50">
                The same convergence the homepage opens with, elements
                settling into form, once here as a person rather than a
                composition.
              </p>
            </Reveal>
          </Container>
        </section>

        <section className="border-t border-border bg-background-alt py-20">
          <Container className="grid gap-12 md:grid-cols-2">
            <Reveal>
              <h2 className="text-display-sm font-display font-semibold text-soil">
                Working method
              </h2>
              <p className="mt-4 text-foreground-secondary">
                I don&apos;t start with mood boards. I start by asking what a
                business believes, who it&apos;s actually speaking to, and
                where its current story stops making sense. The elemental
                system, earth, water, fire, air, space, is how I keep track
                of which part of that is solved and which isn&apos;t.
              </p>
              <p className="mt-4 text-foreground-secondary">
                I use &ldquo;I,&rdquo; not &ldquo;we.&rdquo; Branding Tatva
                is a personal practice, and every project has my direct
                attention.
              </p>
            </Reveal>

            <Reveal delay={0.1}>
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
          </Container>
        </section>

        <section className="py-20">
          <Container>
            <Reveal>
              <h2 className="text-display-sm font-display font-semibold text-soil">
                Credentials
              </h2>
            </Reveal>
            <div className="mt-8 grid gap-6 sm:grid-cols-2">
              {credentials.map((c, i) => (
                <Reveal key={c.label} delay={i * 0.06}>
                  <div className="rounded-lg border border-border p-5 transition-transform duration-300 hover:-translate-y-1">
                    <p className="font-medium text-soil">{c.label}</p>
                    <p className="mt-1 text-sm text-foreground-secondary">{c.detail}</p>
                  </div>
                </Reveal>
              ))}
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
