import type { Metadata } from "next";
import Link from "next/link";
import { Header } from "@/layouts/Header";
import { Footer } from "@/sections/Footer";
import { ContactForm } from "@/components/ContactForm";
import { CalendlyEmbed } from "@/components/CalendlyEmbed";
import { site } from "@/data/site";
import { pageSchema, ORGANIZATION_ID } from "@/lib/pageSchema";

const pageJsonLd = pageSchema({
  type: "ContactPage",
  path: "/contact",
  name: "Contact | Branding Tatva",
  description: "Schedule a brand strategy consultation with Suman Sharma, call or WhatsApp directly, or send a written enquiry.",
  trail: [{ name: "Contact", path: "/contact" }],
  mainEntity: ORGANIZATION_ID,
});

export const metadata: Metadata = {
  title: "Contact",
  description: "Schedule a 30-minute brand strategy consultation with Suman Sharma, call or WhatsApp directly, or send a written enquiry.",
  alternates: { canonical: "/contact" },
  openGraph: {
    title: `Contact | ${site.name}`,
    description: "Schedule a 30-minute brand strategy consultation with Suman Sharma, call or WhatsApp directly, or send a written enquiry.",
    type: "website",
  },
};

const paths = [
  { number: "01", title: "Choose a time", body: "Book a thirty-minute conversation directly. Best when you are ready to talk through the condition." },
  { number: "02", title: "Speak directly", body: "Call or send a WhatsApp message when a shorter first step feels easier." },
  { number: "03", title: "Write it down", body: "Send the question in your own time. Three fields are enough; more detail is optional." },
] as const;

export default function ContactPage() {
  return (
    <>
      <Header transparent />
      <main id="main-content" className="el-page">
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(pageJsonLd) }} />

        <section className="el-hero el-contact-hero" aria-labelledby="contact-title">
          <div className="el-hero__media" aria-hidden="true">
            <video autoPlay muted loop playsInline preload="metadata" poster="/images/pixabay-golden-reeds-wind-poster.jpg">
              <source src="/videos/pixabay-golden-reeds-wind.mp4" type="video/mp4" />
            </video>
            <div className="el-hero__veil" />
          </div>
          <div className="el-shell el-hero__content">
            <div className="el-hero__card">
              <p className="el-kicker">A calm place to begin</p>
              <h1 id="contact-title" className="el-display" style={{ marginTop: "1rem" }}>Tell me what your brand is <em>becoming.</em></h1>
              <p className="el-lede">You do not need a perfect brief. Bring the part that feels unclear and we will find the decision beneath it.</p>
              <div className="el-button-row">
                <Link className="el-button" href="#book">Choose a time <span aria-hidden="true">↓</span></Link>
                <Link className="el-button el-button--quiet" href="#write">Write instead</Link>
              </div>
            </div>
          </div>
        </section>

        <section className="el-section el-section--compact" aria-label="Three contact paths">
          <div className="el-shell">
            <ol className="el-list">
              {paths.map((path) => (
                <li key={path.number}>
                  <span className="el-list__number">{path.number}</span>
                  <h3>{path.title}</h3>
                  <p>{path.body}</p>
                </li>
              ))}
            </ol>
          </div>
        </section>

        <section id="book" className="el-section el-section--paper-deep" aria-labelledby="book-title">
          <div className="el-shell">
            <div className="el-intro-grid">
              <div>
                <p className="el-kicker">Book a session</p>
                <h2 id="book-title" className="el-heading" style={{ marginTop: "1rem" }}>Thirty minutes to make the next step clearer.</h2>
              </div>
              <div>
                <p className="el-lede">The first call is useful even when the answer is “not yet.” Suman reads the context, asks the sharper question, and recommends the most sensible next move.</p>
                <div className="el-contact-direct">
                  <a href={`tel:${site.phone.tel}`}>Call {site.phone.display}</a>
                  <a href={site.phone.whatsappUrl} target="_blank" rel="noopener noreferrer">WhatsApp Suman ↗</a>
                  <a href={`mailto:${site.email}`}>{site.email}</a>
                </div>
              </div>
            </div>
            <div className="el-contact-calendar">
              <div className="el-contact-calendar__note">
                <p className="el-kicker">What to bring</p>
                <p className="el-quote" style={{ marginTop: "1rem" }}>The symptom is enough. We can find the brief together.</p>
                <ul className="el-plain-list">
                  <li>What feels harder to explain than it should.</li>
                  <li>Where the brand stops feeling coherent.</li>
                  <li>What needs to change in the next six to twelve months.</li>
                </ul>
              </div>
              <CalendlyEmbed url={site.calendlyUrl} />
            </div>
          </div>
        </section>

        <section id="write" className="el-section el-section--mist" aria-labelledby="write-title">
          <div className="el-shell el-contact-write">
            <div>
              <p className="el-kicker">Prefer writing?</p>
              <h2 id="write-title" className="el-heading" style={{ marginTop: "1rem" }}>Put the question down in your own words.</h2>
              <p className="el-lede" style={{ marginTop: "1.25rem" }}>Only your name, email, and the unclear part are required. Suman reads every enquiry personally and replies within a few days.</p>
              <p className="el-contact-assurance">No sales sequence. No pressure. No need to know which service you need.</p>
            </div>
            <ContactForm />
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
