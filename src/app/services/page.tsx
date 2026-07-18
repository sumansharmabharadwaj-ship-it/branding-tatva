import type { Metadata } from "next";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Container } from "@/components/Container";
import { SectionHeading } from "@/components/SectionHeading";
import { LinkButton } from "@/components/Button";
import { Reveal } from "@/components/Reveal";
import { PhotoHero } from "@/components/PhotoHero";
import { elements } from "@/data/elements";
import { serviceGroups, offerings } from "@/data/services";

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
        <PhotoHero image="/images/green-valley.jpg" minHeight="65vh">
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

        <section className="py-16">
          <Container>
            <div className="grid items-stretch gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {offerings.map((offer, i) => (
                <Reveal key={offer.name} delay={i * 0.06} className="h-full">
                  <div
                    className="flex h-full flex-col rounded-lg border-t-2 border-border bg-background-elevated p-6 transition-transform duration-300 hover:-translate-y-1"
                    style={{ borderTopColor: offer.color }}
                  >
                    <p className="font-display text-lg font-semibold text-soil">{offer.name}</p>
                    <p className="mt-2 text-sm text-foreground-secondary">{offer.detail}</p>
                  </div>
                </Reveal>
              ))}
            </div>
          </Container>
        </section>

        <section className="border-t border-border bg-background-alt py-16">
          <Container>
            <SectionHeading
              eyebrow="The deeper system"
              title="The elements that make a brand complete."
              description="Every project draws on some combination of these five. None of them work well in isolation, and that's usually the actual problem a brand walks in with."
            />
          </Container>
        </section>

        <section className="py-16">
          <Container>
            <div className="grid items-stretch gap-6 lg:grid-cols-5">
              {elements.map((el, i) => (
                <Reveal key={el.slug} delay={i * 0.08} className="h-full">
                  <div
                    className="flex h-full flex-col border-t-2 bg-background-elevated p-6 transition-transform duration-300 hover:-translate-y-1"
                    style={{ borderColor: el.color }}
                  >
                    <p className="font-display text-xl font-semibold text-soil">{el.name}</p>
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
                    <p className="mt-auto pt-4 text-xs text-foreground-secondary/80 italic">{el.proof}</p>
                  </div>
                </Reveal>
              ))}
            </div>
          </Container>
        </section>

        <section className="py-20">
          <Container>
            <SectionHeading
              eyebrow="By situation"
              title="Organised by where your brand is right now."
            />
            <div className="mt-10 grid items-stretch gap-6 md:grid-cols-2">
              {serviceGroups.map((group, i) => (
                <Reveal key={group.slug} delay={i * 0.08} className="h-full">
                  <div id={group.slug} className="flex h-full scroll-mt-24 flex-col rounded-lg border border-border p-6 transition-transform duration-300 hover:-translate-y-1">
                    <p className="font-display text-xl font-semibold text-soil">{group.name}</p>
                    <p className="mt-1 text-sm font-medium text-action-secondary">{group.forWho}</p>
                    <p className="mt-4 text-foreground-secondary">{group.description}</p>
                    <ul className="mt-4 space-y-1.5">
                      {group.includes.map((item) => (
                        <li key={item} className="text-sm text-foreground-secondary before:mr-2 before:content-['•']">
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
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

        <section className="border-t border-border bg-background-alt py-20 text-center">
          <Container>
            <h2 className="text-display-sm font-display font-semibold text-soil">
              Still deciding which one fits?
            </h2>
            <p className="mx-auto mt-3 max-w-md text-foreground-secondary">
              That&apos;s a completely normal place to start. Tell me where
              your brand is right now and I&apos;ll tell you honestly what it needs.
            </p>
            <div className="mt-6">
              <LinkButton href="/contact">Start a brand conversation</LinkButton>
            </div>
          </Container>
        </section>
      </main>
      <Footer />
    </>
  );
}
