import type { Metadata } from "next";
import Link from "next/link";
import { Container } from "@/components/Container";
import { entityFacts } from "@/data/entityFacts";
import { servicePages, type ServicePageContent } from "@/data/servicePages";
import { site } from "@/data/site";
import { Header } from "@/layouts/Header";
import { pageSchema } from "@/lib/pageSchema";
import { Footer } from "@/sections/Footer";
import styles from "./ServicePage.module.css";

export function servicePageMetadata(page: ServicePageContent): Metadata {
  return {
    title: page.title,
    description: page.description,
    alternates: { canonical: `/${page.slug}` },
    openGraph: {
      title: `${page.title} | ${site.name}`,
      description: page.description,
      url: `${site.url}/${page.slug}`,
      type: "website",
      images: [{ url: "/opengraph-image", width: 1200, height: 630 }],
    },
    twitter: { card: "summary_large_image", title: page.title, description: page.description },
  };
}

export function ServicePage({ page }: { page: ServicePageContent }) {
  const url = `${site.url}/${page.slug}`;
  const schema = {
    "@context": "https://schema.org",
    "@graph": [
      pageSchema({
        type: "WebPage",
        path: `/${page.slug}`,
        name: page.title,
        description: page.description,
        trail: [{ name: "Brand Strategy & Systems", path: "/services" }, { name: page.name, path: `/${page.slug}` }],
        mainEntity: `${url}#service`,
      }),
      {
        "@type": "Service",
        "@id": `${url}#service`,
        url,
        name: page.name,
        serviceType: page.name,
        description: page.description,
        provider: { "@id": `${site.url}/#organization` },
        areaServed: entityFacts.delivery.regions.map((name) => ({ "@type": "Country", name })),
      },
    ],
  };

  return (
    <>
      <Header />
      <main id="main-content" className={styles.page}>
        <section className={styles.hero}>
          <Container>
            <nav aria-label="Breadcrumb" className={styles.breadcrumb}>
              <Link href="/">Home</Link><span aria-hidden="true">/</span>
              <Link href="/services">Brand Strategy &amp; Systems</Link><span aria-hidden="true">/</span>
              <span aria-current="page">{page.name}</span>
            </nav>
            <p className={styles.eyebrow}>{page.name} with Suman Sharma</p>
            <h1>{page.title}</h1>
            <p className={styles.headline}>{page.headline}</p>
            <p className={styles.lede}>{page.introduction}</p>
            <div className={styles.actions}>
              <Link href="/contact" className={styles.button}>Book a 30 minute diagnosis <span aria-hidden="true">↗</span></Link>
              <Link href="#scope" className={styles.textLink}>See what the work covers</Link>
            </div>
          </Container>
        </section>
        <Container className={styles.content}>
          <section className={styles.opening} aria-labelledby={`${page.slug}-situation`}>
            <p className={styles.eyebrow}>When to begin</p>
            <h2 id={`${page.slug}-situation`}>Recognise the question?</h2>
            <p>{page.situation}</p>
          </section>
          <div id="scope" className={styles.scope}>
            <div>
              {page.sections.map((section, index) => (
                <section key={section.title} className={styles.step}>
                  <span className={styles.number} aria-hidden="true">0{index + 1}</span>
                  <div><h2>{section.title}</h2><p>{section.body}</p></div>
                </section>
              ))}
            </div>
            <aside className={styles.outputs} aria-labelledby={`${page.slug}-outputs`}>
              <p className={styles.eyebrow}>Scope to discuss</p>
              <h2 id={`${page.slug}-outputs`}>What the work can leave you with</h2>
              <ul>{page.outputs.map((output) => <li key={output}>{output}</li>)}</ul>
              <Link href="/services#desire" className={styles.textLink}>Compare the engagement formats</Link>
            </aside>
          </div>
          <section className={styles.preparation}>
            <div><h2>Bring what already exists.</h2><p>{page.preparation}</p></div>
            <div><h2>Agree the scope before work begins.</h2><p>{page.boundary}</p></div>
          </section>
          <section className={styles.opening} aria-labelledby={`${page.slug}-engagement`}>
            <p className={styles.eyebrow}>Working together remotely</p>
            <h2 id={`${page.slug}-engagement`}>{page.engagement.title}</h2>
            <p>{page.engagement.body}</p>
          </section>
          <section className={styles.reading} aria-labelledby={`${page.slug}-reading`}>
            <p className={styles.eyebrow}>Before we speak</p>
            <h2 id={`${page.slug}-reading`}>Read the thinking behind the work.</h2>
            <ul>{page.reading.map((item) => <li key={item.href}><Link href={item.href}>{item.title}<span aria-hidden="true">↗</span></Link></li>)}</ul>
          </section>
          <section className={styles.close}>
            <p className={styles.eyebrow}>One strategist, from question to direction</p>
            <h2>Bring the decision you keep returning to.</h2>
            <p>Work directly with <Link href="/about">Suman Sharma</Link>. Begin with a conversation about the business, the question and the evidence you already have.</p>
            <div className={styles.actions}>
              <Link href="/contact" className={styles.button}>Discuss your brand <span aria-hidden="true">↗</span></Link>
              {servicePages.filter((item) => item.slug !== page.slug).map((item) => <Link key={item.slug} href={`/${item.slug}`} className={styles.textLink}>See {item.name.toLowerCase()}</Link>)}
            </div>
          </section>
        </Container>
      </main>
      <Footer compact />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema).replace(/</g, "\\u003c") }} />
    </>
  );
}
