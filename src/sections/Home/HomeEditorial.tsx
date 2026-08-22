import Image from "next/image";
import Link from "next/link";
import { elements } from "@/data/elements";
import { projects } from "@/data/projects";
import { insightPosts } from "@/data/insights";

const symptoms = [
  {
    title: "The business has grown past its explanation.",
    body: "The offer is stronger than the language around it, so every sales conversation starts from the beginning.",
  },
  {
    title: "Every channel tells a different story.",
    body: "The website, pitch, identity, and content are individually busy but collectively hard to remember.",
  },
  {
    title: "Visibility is rising. Recognition is not.",
    body: "More activity has not made the brand easier to identify, trust, or choose.",
  },
] as const;

const waysToWork = [
  {
    title: "Position the business",
    body: "Audience tension, category, difference, offer logic, and the strategic decision the rest of the brand can inherit.",
  },
  {
    title: "Give the position language",
    body: "Message hierarchy, verbal identity, narrative, proof, and a voice another person can use without diluting it.",
  },
  {
    title: "Build a recognisable system",
    body: "Distinctive cues, content architecture, touchpoints, and practical rules that keep the brand coherent as it grows.",
  },
] as const;

export function HomeEditorial() {
  const featuredProjects = projects.filter((project) => project.featured).slice(0, 2);
  const featuredInsights = [...insightPosts]
    .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
    .slice(0, 3);

  return (
    <div className="el-page">
      <section className="el-hero" aria-labelledby="home-title">
        <div className="el-hero__media" aria-hidden="true">
          <video
            autoPlay
            muted
            loop
            playsInline
            preload="metadata"
            poster="/images/hero-valley-poster.jpg"
          >
            <source src="/videos/hero-valley.mp4" type="video/mp4" />
          </video>
          <div className="el-hero__veil" />
        </div>
        <div className="el-shell el-hero__content">
          <div className="el-hero__card">
            <p className="el-kicker">Founder-led brand strategy</p>
            <h1 id="home-title" className="el-display" style={{ marginTop: "1rem" }}>
              A clearer brand is a <em>calmer business.</em>
            </h1>
            <p className="el-lede">
              Branding Tatva shapes positioning, language, identity, and market expression into one coherent system people can recognise, trust, and choose.
            </p>
            <div className="el-button-row">
              <Link className="el-button" href="/contact">Book a strategy session <span aria-hidden="true">→</span></Link>
              <Link className="el-button el-button--quiet" href="/work">See the work</Link>
            </div>
          </div>
        </div>
      </section>

      <section className="el-section" aria-labelledby="recognition-title">
        <div className="el-shell">
          <div className="el-intro-grid">
            <div>
              <p className="el-kicker">Recognition before decoration</p>
              <h2 id="recognition-title" className="el-heading" style={{ marginTop: "1rem" }}>
                You do not need more brand noise. You need one decision the whole business can follow.
              </h2>
            </div>
            <p className="el-lede">
              When positioning is unresolved, every page, pitch, and campaign has to work too hard. The first job is to reduce the number of promises—not add another layer of design.
            </p>
          </div>
          <ol className="el-list" style={{ marginTop: "clamp(2.5rem,6vw,5rem)" }}>
            {symptoms.map((item, index) => (
              <li key={item.title}>
                <span className="el-list__number">0{index + 1}</span>
                <h3>{item.title}</h3>
                <p>{item.body}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="el-section el-section--mist" aria-labelledby="tatvas-title">
        <div className="el-shell">
          <div className="el-intro-grid">
            <div>
              <p className="el-kicker">The five Tatvas</p>
              <h2 id="tatvas-title" className="el-heading" style={{ marginTop: "1rem" }}>
                Five forces. <em>One operating system.</em>
              </h2>
            </div>
            <p className="el-lede">
              Foundation, experience, expression, voice, and memory are designed together, so the brand feels like the same business wherever people meet it.
            </p>
          </div>
          <ol className="el-list" style={{ marginTop: "clamp(2.5rem,6vw,5rem)" }}>
            {elements.map((element, index) => (
              <li key={element.slug}>
                <span className="el-list__number">0{index + 1}</span>
                <h3>{element.name}</h3>
                <p>{element.meaning}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="el-section" aria-labelledby="work-title">
        <div className="el-shell">
          <div className="el-intro-grid">
            <div>
              <p className="el-kicker">Selected work</p>
              <h2 id="work-title" className="el-heading" style={{ marginTop: "1rem" }}>
                Strategy shown through the decisions it changed.
              </h2>
            </div>
            <div>
              <p className="el-lede">Real engagements, separated from concept studies. Claims are grounded in documented project work and verified outcomes.</p>
              <div className="el-button-row" style={{ marginTop: "1.25rem" }}>
                <Link className="el-button el-button--quiet" href="/work">Explore all work</Link>
              </div>
            </div>
          </div>
          <div className="el-card-grid" style={{ marginTop: "clamp(2.5rem,6vw,5rem)" }}>
            {featuredProjects.map((project) => (
              <Link
                key={project.slug}
                href={`/work/${project.slug}`}
                className="el-card el-image-card"
                style={{ gridColumn: "span 6" }}
              >
                <Image src={project.cardImage ?? project.heroPoster ?? "/images/work-closing.jpg"} alt="" fill sizes="(max-width: 760px) 100vw, 50vw" />
                <div className="el-image-card__copy">
                  <p className="el-kicker" style={{ color: "#f0d5a6" }}>{project.industry}</p>
                  <h3 style={{ marginTop: ".8rem" }}>{project.title}</h3>
                  <p>{project.hook ?? project.challenge}</p>
                </div>
              </Link>
            ))}
          </div>
          <div className="el-stat-line" style={{ marginTop: "1rem" }}>
            <div className="el-stat"><strong>104%</strong><span>more Instagram followers earned per post</span></div>
            <div className="el-stat"><strong>1,350%</strong><span>jump in comments per post</span></div>
            <div className="el-stat"><strong>16</strong><span>evidence-led content pieces in one portfolio</span></div>
          </div>
        </div>
      </section>

      <section className="el-section el-section--paper-deep" aria-labelledby="method-title">
        <div className="el-shell">
          <div className="el-intro-grid">
            <div>
              <p className="el-kicker">The thinking room</p>
              <h2 id="method-title" className="el-heading" style={{ marginTop: "1rem" }}>
                Psychology notices the tension. Literature gives it language.
              </h2>
            </div>
            <p className="el-lede">
              Suman Sharma works directly across the engagement. One person hears the problem, makes the strategic decisions, writes the language, and stays accountable for the system.
            </p>
          </div>
          <div className="el-convergence" aria-label="Psychology and literature converge into brand strategy">
            <div className="el-convergence__source"><small>Psychology</small><strong>Read attention.</strong></div>
            <span className="el-convergence__arrow" aria-hidden="true">→</span>
            <div className="el-convergence__source"><small>Literature</small><strong>Shape meaning.</strong></div>
            <span className="el-convergence__arrow" aria-hidden="true">→</span>
            <div className="el-convergence__result"><small>Brand strategy</small><strong>Make it usable.</strong></div>
          </div>
          <div className="el-button-row" style={{ marginTop: "1.5rem" }}>
            <Link className="el-button el-button--quiet" href="/about">Meet Suman and the method</Link>
          </div>
        </div>
      </section>

      <section className="el-section" aria-labelledby="ways-title">
        <div className="el-shell">
          <div className="el-intro-grid">
            <div>
              <p className="el-kicker">Brand strategy &amp; systems</p>
              <h2 id="ways-title" className="el-heading" style={{ marginTop: "1rem" }}>Start with the decision that makes everything else easier.</h2>
            </div>
            <p className="el-lede">The work is shaped around the business problem, not a pre-packed list of outputs. These are the three most common places to begin.</p>
          </div>
          <ol className="el-list" style={{ marginTop: "clamp(2.5rem,6vw,5rem)" }}>
            {waysToWork.map((item, index) => (
              <li key={item.title}>
                <span className="el-list__number">0{index + 1}</span>
                <h3>{item.title}</h3>
                <p>{item.body}</p>
              </li>
            ))}
          </ol>
          <div className="el-button-row" style={{ marginTop: "1.5rem" }}>
            <Link className="el-button" href="/work#services">See capabilities and engagements <span aria-hidden="true">→</span></Link>
          </div>
        </div>
      </section>

      <section className="el-section el-section--mist" aria-labelledby="insights-title">
        <div className="el-shell">
          <div className="el-intro-grid">
            <div>
              <p className="el-kicker">Field notes</p>
              <h2 id="insights-title" className="el-heading" style={{ marginTop: "1rem" }}>Useful thinking before you are ready to hire anyone.</h2>
            </div>
            <p className="el-lede">Practical essays on positioning, proof, messaging, distinctiveness, and the choices that build brand memory.</p>
          </div>
          <div className="el-card-grid" style={{ marginTop: "clamp(2.5rem,6vw,5rem)" }}>
            {featuredInsights.map((post) => (
              <article key={post.slug} className="el-card el-detail-card" style={{ gridColumn: "span 4" }}>
                <p className="el-kicker">{post.readingTime}</p>
                <h3 style={{ marginTop: ".9rem" }}>{post.title}</h3>
                <p>{post.excerpt}</p>
                <Link href={`/insights/${post.slug}`} className="el-button el-button--quiet" style={{ marginTop: "1.25rem" }}>Read the note</Link>
              </article>
            ))}
          </div>
          <div className="el-button-row" style={{ marginTop: "1.5rem" }}>
            <Link className="el-button" href="/insights">Browse all insights <span aria-hidden="true">→</span></Link>
          </div>
        </div>
      </section>

      <section className="el-footer-cta" aria-labelledby="home-cta-title">
        <video autoPlay muted loop playsInline preload="metadata" poster="/images/pixabay-golden-reeds-wind-poster.jpg" aria-hidden="true">
          <source src="/videos/pixabay-golden-reeds-wind.mp4" type="video/mp4" />
        </video>
        <div className="el-footer-cta__copy">
          <p className="el-kicker">A calm place to begin</p>
          <h2 id="home-cta-title" style={{ marginTop: "1rem" }}>Bring the part of the brand that no longer makes sense.</h2>
          <p>The first conversation separates the symptom from the decision and gives you an honest next step, whether or not we work together.</p>
          <div className="el-button-row">
            <Link className="el-button el-button--paper" href="/contact">Book a 30-minute session <span aria-hidden="true">→</span></Link>
          </div>
        </div>
      </section>
    </div>
  );
}
