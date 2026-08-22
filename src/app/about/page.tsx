import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Header } from "@/layouts/Header";
import { Footer } from "@/sections/Footer";
import { aboutIntro, credentials } from "@/data/about";
import { site } from "@/data/site";
import { pageSchema, PERSON_ID } from "@/lib/pageSchema";

const pageJsonLd = pageSchema({
  type: "AboutPage",
  path: "/about",
  name: "About Suman Sharma | Branding Tatva",
  description: "The thinking behind Branding Tatva: brand strategy grounded in psychology and language.",
  trail: [{ name: "About", path: "/about" }],
  mainEntity: PERSON_ID,
});

export const metadata: Metadata = {
  title: "About Suman Sharma",
  description: `The thinking behind ${site.name}: brand strategy grounded in psychology and language.`,
  alternates: { canonical: "/about" },
  openGraph: {
    title: `About ${site.founder} | ${site.name}`,
    description: `The thinking behind ${site.name}: brand strategy grounded in psychology and language.`,
    type: "profile",
  },
};

const method = [
  { title: "Notice the human tension", body: "Listen for the doubt, expectation, and behaviour beneath the stated brief before solving the visible symptom." },
  { title: "Name the decision", body: "Turn research into one strategic choice the offer, language, identity, and experience can all inherit." },
  { title: "Make it usable", body: "Build the words, rules, and examples that help the business keep the decision intact after the engagement ends." },
] as const;

const commitments = [
  "You work directly with Suman throughout the engagement.",
  "Strategy arrives as clear decisions, not a presentation that disappears after the meeting.",
  "Research is translated into language and tools the team can actually use.",
  "Evidence is separated from interpretation; no invented certainty and no borrowed proof.",
] as const;

export default function AboutPage() {
  return (
    <>
      <Header transparent />
      <main id="main-content" className="el-page">
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(pageJsonLd) }} />

        <section className="el-section el-about-hero" aria-labelledby="about-title">
          <div className="el-shell el-about-hero__grid">
            <div className="el-about-hero__copy">
              <p className="el-kicker">About Suman Sharma</p>
              <h1 id="about-title" className="el-display" style={{ marginTop: "1rem" }}>
                One mind. Three disciplines. <em>One accountable author.</em>
              </h1>
              <p className="el-lede" style={{ marginTop: "1.5rem" }}>{aboutIntro.opening}</p>
              <div className="el-button-row" style={{ marginTop: "1.75rem" }}>
                <Link className="el-button" href="/contact">Book a strategy session <span aria-hidden="true">→</span></Link>
                <Link className="el-button el-button--quiet" href="/work">Explore the work</Link>
              </div>
            </div>
            <figure className="el-about-hero__portrait">
              <Image src="/images/own-portrait.jpg" alt="Suman Sharma, founder of Branding Tatva" fill priority sizes="(max-width: 820px) 100vw, 44vw" />
              <figcaption>Suman Sharma · Founder and brand strategist</figcaption>
            </figure>
          </div>
        </section>

        <section className="el-section el-section--paper-deep" aria-labelledby="convergence-title">
          <div className="el-shell">
            <div className="el-intro-grid">
              <div>
                <p className="el-kicker">The method</p>
                <h2 id="convergence-title" className="el-heading" style={{ marginTop: "1rem" }}>
                  Psychology and literature meet where a brand becomes memorable.
                </h2>
              </div>
              <div className="el-lede">
                {aboutIntro.body.map((paragraph) => <p key={paragraph} style={{ margin: "0 0 1rem" }}>{paragraph}</p>)}
              </div>
            </div>
            <div className="el-convergence el-convergence--animated" aria-label="Psychology and literature converge into brand strategy">
              <div className="el-convergence__source"><small>M.A. Clinical Psychology</small><strong>Attention</strong><span>How people notice, process, and decide.</span></div>
              <span className="el-convergence__arrow" aria-hidden="true">→</span>
              <div className="el-convergence__source"><small>B.A. English Literature</small><strong>Meaning</strong><span>How language holds tension, identity, and memory.</span></div>
              <span className="el-convergence__arrow" aria-hidden="true">→</span>
              <div className="el-convergence__result"><small>Brand strategy</small><strong>Recognition</strong><span>A decision system people can understand and repeat.</span></div>
            </div>
          </div>
        </section>

        <section className="el-section" aria-labelledby="working-title">
          <div className="el-shell">
            <div className="el-intro-grid">
              <div>
                <p className="el-kicker">How the room works</p>
                <h2 id="working-title" className="el-heading" style={{ marginTop: "1rem" }}>Read the tension. Give it language. Make it useful.</h2>
              </div>
              <p className="el-lede">The work moves in a straight line from human evidence to a strategic decision, then into the language and systems that carry it.</p>
            </div>
            <ol className="el-list" style={{ marginTop: "clamp(2.5rem,6vw,5rem)" }}>
              {method.map((item, index) => (
                <li key={item.title}>
                  <span className="el-list__number">0{index + 1}</span>
                  <h3>{item.title}</h3>
                  <p>{item.body}</p>
                </li>
              ))}
            </ol>
          </div>
        </section>

        <section className="el-section el-section--mist" aria-labelledby="credentials-title">
          <div className="el-shell">
            <div className="el-intro-grid">
              <div>
                <p className="el-kicker">Grounded authority</p>
                <h2 id="credentials-title" className="el-heading" style={{ marginTop: "1rem" }}>The qualifications behind the method.</h2>
              </div>
              <p className="el-lede">Formal study matters here because the practice makes claims about attention, language, and behaviour. The credentials are shown plainly, without turning the page into a résumé.</p>
            </div>
            <div className="el-card-grid" style={{ marginTop: "clamp(2.5rem,6vw,5rem)" }}>
              {credentials.map((credential) => (
                <article key={credential.label} className="el-card el-detail-card" style={{ gridColumn: credential.featured ? "span 6" : "span 4" }}>
                  <p className="el-kicker">Credential</p>
                  <h3 style={{ marginTop: ".9rem" }}>{credential.label}</h3>
                  <p>{credential.detail}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="el-section" aria-labelledby="direct-title">
          <div className="el-shell el-about-direct">
            <div className="el-about-direct__image el-card">
              <Image src="/images/pexels-forest-path.jpg" alt="A quiet path through a green forest" fill sizes="(max-width: 820px) 100vw, 45vw" />
            </div>
            <div>
              <p className="el-kicker">Direct authorship</p>
              <h2 id="direct-title" className="el-heading" style={{ marginTop: "1rem" }}>The same person hears the problem and carries the answer through.</h2>
              <ul className="el-plain-list">
                {commitments.map((commitment) => <li key={commitment}>{commitment}</li>)}
              </ul>
              <div className="el-button-row" style={{ marginTop: "1.5rem" }}>
                <Link className="el-button" href="/contact">Start a conversation <span aria-hidden="true">→</span></Link>
              </div>
            </div>
          </div>
        </section>

        <section className="el-footer-cta" aria-labelledby="about-cta-title">
          <video autoPlay muted loop playsInline preload="metadata" poster="/images/about-hero-bg-meadow-poster.jpg" aria-hidden="true">
            <source src="/videos/about-hero-bg-meadow.mp4" type="video/mp4" />
          </video>
          <div className="el-footer-cta__copy">
            <p className="el-kicker">A quieter starting point</p>
            <h2 id="about-cta-title" style={{ marginTop: "1rem" }}>Bring the question you keep circling.</h2>
            <p>You do not need a perfect brief. The first conversation is designed to find the decision beneath the symptom.</p>
            <div className="el-button-row">
              <Link className="el-button el-button--paper" href="/contact">Book a 30-minute session <span aria-hidden="true">→</span></Link>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
