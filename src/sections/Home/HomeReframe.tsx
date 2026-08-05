"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import type { CSSProperties } from "react";

const diagnoses = [
  {
    label: "Starting",
    title: "The idea is ahead of the brand.",
    description:
      "The business is clear in your head, but the market has not met one committed position yet.",
    move: "Define the audience tension, category frame, promise, and message before designing outputs.",
    output: "Brand foundation + positioning architecture",
    accent: "#C87555",
    image: "/images/higgsfield-himalayan-valley-poster.jpg",
  },
  {
    label: "Drifting",
    title: "The business evolved. The brand stayed behind.",
    description:
      "The website, voice, identity, and content are describing slightly different versions of the company.",
    move: "Audit what the market is reading now, then reposition the whole system around one stronger idea.",
    output: "Brand audit + repositioning system",
    accent: "#52756F",
    image: "/images/pexels-root-network-poster.jpg",
  },
  {
    label: "Growing",
    title: "The brand works, but the system cannot scale.",
    description:
      "Every campaign and channel still depends on someone rebuilding the logic from the beginning.",
    move: "Turn the position into repeatable language, design direction, website logic, and content rules.",
    output: "Brand operating system + activation",
    accent: "#7D8565",
    image: "/images/pexels-river-dawn-poster.jpg",
  },
] as const;

const projects = [
  {
    name: "Dr. Haley Nutrition",
    category: "Nutrition and wellness",
    metric: "0.71 → 2.81%",
    metricLabel: "engagement rate in eight weeks",
    summary:
      "The intervention was not more output. It was a tighter content system in which every remaining post had to earn its place.",
    proof: "+104% followers earned per post",
    image: "/images/card-dr-haley-nutrition-poster.jpg",
    href: "/work/dr-haley-nutrition",
    accent: "#7D8565",
  },
  {
    name: "MyShopInEurope",
    category: "B2B marketplace",
    metric: "Craft over price",
    metricLabel: "the positioning refusal",
    summary:
      "The brand stopped competing as another sourcing platform and committed to a clearer belief about European craft and value.",
    proof: "Audience, category, belief, mission, and promise rebuilt as one system",
    image: "/images/card-myshopineurope-poster.jpg",
    href: "/work/myshopineurope",
    accent: "#C87555",
  },
  {
    name: "Executive Springboard",
    category: "Executive mentoring",
    metric: "Registrations",
    metricLabel: "not applause, became the end point",
    summary:
      "Content, webinar sequencing, and platform playbooks were designed around the action the business actually needed people to take.",
    proof: "A sustained content system built to convert attention into participation",
    image: "/images/card-executive-springboard-poster.jpg",
    href: "/work/executive-springboard",
    accent: "#52756F",
  },
  {
    name: "HerbalCart",
    category: "D2C wellness",
    metric: "Wellness first",
    metricLabel: "the perception shift",
    summary:
      "A brand being read through a purely herbal lens was redirected toward the modern, supplement-first identity it intended to own.",
    proof: "Positioning, scripts, campaigns, and content aligned around one perception",
    image: "/images/card-herbalcart-poster.jpg",
    href: "/work/herbalcart",
    accent: "#D8A251",
  },
  {
    name: "Plaxonic",
    category: "Enterprise technology",
    metric: "16 pieces",
    metricLabel: "across one B2B content portfolio",
    summary:
      "Research, perspective, blog, and article formats were organised around a consistent expert point of view rather than isolated topics.",
    proof: "A connected body of authority content across complex technology themes",
    image: "/images/card-plaxonic-poster.jpg",
    href: "/work/plaxonic-content-portfolio",
    accent: "#C87555",
  },
] as const;

const paths = [
  {
    number: "01",
    eyebrow: "For an idea becoming a business",
    title: "Build the foundation",
    body: "Choose what the brand means before the logo, website, and content start making accidental promises.",
    items: ["Audience tension", "Category and position", "Purpose and promise", "Voice direction"],
    href: "/services#desire",
    cta: "Explore foundation work",
    className: "home-reframe__path--terracotta",
  },
  {
    number: "02",
    eyebrow: "For a business that outgrew its brand",
    title: "Reposition the system",
    body: "Find the gap between what the company has become and what its current identity still teaches people to expect.",
    items: ["Brand audit", "Perception map", "Repositioning", "Identity and website direction"],
    href: "/services#situation",
    cta: "Explore repositioning",
    className: "home-reframe__path--teal",
  },
  {
    number: "03",
    eyebrow: "For a brand ready to compound",
    title: "Create consistency",
    body: "Translate the strategy into a usable system for websites, content, campaigns, and teams without flattening the brand.",
    items: ["Messaging system", "Website development", "Content architecture", "Campaign direction"],
    href: "/services#offerings",
    cta: "Explore ongoing systems",
    className: "home-reframe__path--moss",
  },
] as const;

const tatvas = [
  {
    sanskrit: "Prithvi",
    english: "Earth",
    role: "Position",
    question: "What must people understand before the brand looks like anything?",
    result: "A strategic truth that every later decision can stand on.",
    accent: "#C87555",
    image: "/images/higgsfield-himalayan-valley-poster.jpg",
  },
  {
    sanskrit: "Jal",
    english: "Water",
    role: "Experience",
    question: "Do the website, content, and customer journey feel like the same business?",
    result: "Touchpoints that reinforce one expectation instead of diluting it.",
    accent: "#52756F",
    image: "/images/pixabay-stream-mist-rays-poster.jpg",
  },
  {
    sanskrit: "Agni",
    english: "Fire",
    role: "Distinction",
    question: "What makes this brand worth turning toward in a crowded category?",
    result: "A recognisable expression with enough courage to earn attention.",
    accent: "#D8A251",
    image: "/images/pixabay-golden-forest-glow-poster.jpg",
  },
  {
    sanskrit: "Vayu",
    english: "Air",
    role: "Voice",
    question: "What language will people carry after the brand has left the room?",
    result: "A verbal identity that makes the strategy portable and memorable.",
    accent: "#7D8565",
    image: "/images/pixabay-golden-reeds-wind-poster.jpg",
  },
  {
    sanskrit: "Akash",
    english: "Space",
    role: "Recognition",
    question: "What remains after the campaign, post, or launch has passed?",
    result: "Mental availability that compounds because the whole system keeps repeating one idea.",
    accent: "#B77A73",
    image: "/images/pixabay-sea-of-fog-sunrise-poster.jpg",
  },
] as const;

const processSteps = [
  {
    number: "01",
    title: "Question",
    body: "Surface the founder truth, audience tension, inherited assumptions, and contradictions before choosing a framework.",
  },
  {
    number: "02",
    title: "Commit",
    body: "Choose the position, promise, category frame, and language the rest of the business must reinforce.",
  },
  {
    number: "03",
    title: "Build",
    body: "Translate the decision into identity direction, website, content architecture, campaigns, and usable rules.",
  },
  {
    number: "04",
    title: "Compound",
    body: "Keep the system coherent long enough for recognition, trust, and market memory to accumulate.",
  },
] as const;

const questions = [
  {
    question: "Can you help a brand-new business?",
    answer:
      "Yes. The work begins with audience, category, positioning, and promise so the visual identity and website are built on an actual decision rather than decoration.",
  },
  {
    question: "Can you work with an identity that already exists?",
    answer:
      "Yes. Existing assets are not discarded by default. The audit determines what still carries useful recognition, what is creating confusion, and what needs to be rebuilt.",
  },
  {
    question: "Do you only provide strategy?",
    answer:
      "No. Strategy can continue into verbal identity, website development, content systems, campaigns, and ongoing direction. Scope is chosen around the problem, not around the largest package.",
  },
  {
    question: "Will I work directly with Suman?",
    answer:
      "Yes. The same person hears the problem, makes the strategic decisions, writes the language, and directs the implementation. There is no account-manager handoff.",
  },
  {
    question: "Can the work happen remotely?",
    answer:
      "Yes. The engagements shown on this site were led remotely, with working sessions, reviews, and delivery organised around the project rather than geography.",
  },
] as const;

function useMotionAllowed() {
  const [allowed, setAllowed] = useState(false);

  useEffect(() => {
    const query = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setAllowed(!query.matches);
    update();
    query.addEventListener("change", update);
    return () => query.removeEventListener("change", update);
  }, []);

  return allowed;
}

export function HomeReframe() {
  const [diagnosisIndex, setDiagnosisIndex] = useState(0);
  const [diagnosisLocked, setDiagnosisLocked] = useState(false);
  const [projectIndex, setProjectIndex] = useState(0);
  const [tatvaIndex, setTatvaIndex] = useState(0);
  const [tatvaLocked, setTatvaLocked] = useState(false);
  const motionAllowed = useMotionAllowed();

  useEffect(() => {
    if (!motionAllowed || diagnosisLocked) return;
    const timer = window.setInterval(
      () => setDiagnosisIndex((current) => (current + 1) % diagnoses.length),
      5600,
    );
    return () => window.clearInterval(timer);
  }, [diagnosisLocked, motionAllowed]);

  useEffect(() => {
    if (!motionAllowed || tatvaLocked) return;
    const timer = window.setInterval(
      () => setTatvaIndex((current) => (current + 1) % tatvas.length),
      4800,
    );
    return () => window.clearInterval(timer);
  }, [motionAllowed, tatvaLocked]);

  const diagnosis = diagnoses[diagnosisIndex];
  const project = projects[projectIndex];
  const tatva = tatvas[tatvaIndex];

  const diagnosisStyle = useMemo(
    () => ({ "--home-accent": diagnosis.accent } as CSSProperties),
    [diagnosis.accent],
  );
  const projectStyle = useMemo(
    () => ({ "--home-accent": project.accent } as CSSProperties),
    [project.accent],
  );
  const tatvaStyle = useMemo(
    () => ({ "--home-accent": tatva.accent } as CSSProperties),
    [tatva.accent],
  );

  return (
    <div className="home-reframe" data-home-reframe>
      <section
        id="opening"
        data-home-chapter="opening"
        className="home-reframe__hero"
        aria-labelledby="home-reframe-hero-title"
      >
        <div className="home-reframe__hero-grid">
          <div className="home-reframe__hero-copy">
            <p className="home-reframe__eyebrow">
              Founder-led brand practice · strategy through implementation
            </p>
            <h1 id="home-reframe-hero-title">
              Make the business <em>clear enough</em> to be remembered.
            </h1>
            <p className="home-reframe__hero-lede">
              Branding Tatva helps founders and growing businesses choose what their brand should mean,
              then builds the positioning, voice, website, content, and market system that make that
              meaning recognisable.
            </p>
            <div className="home-reframe__actions">
              <Link href="#diagnosis" className="home-reframe__button home-reframe__button--primary">
                Find the right starting point <span aria-hidden="true">↘</span>
              </Link>
              <Link href="/work" className="home-reframe__button home-reframe__button--quiet">
                See selected work <span aria-hidden="true">↗</span>
              </Link>
            </div>
            <div className="home-reframe__credentials" aria-label="How the work is shaped">
              <span>Clinical psychology</span>
              <span>English literature</span>
              <span>Direct authorship</span>
            </div>
          </div>

          <div className="home-reframe__hero-stage" aria-label="A living Himalayan forest scene">
            <div className="home-reframe__hero-media">
              <video
                src="/videos/hero-forest-sanctuary.mp4"
                poster="/images/hero-forest-sanctuary-poster.jpg"
                autoPlay
                muted
                loop
                playsInline
                preload="metadata"
              />
              <span className="home-reframe__media-wash" aria-hidden="true" />
            </div>
            <div className="home-reframe__hero-orbit" aria-hidden="true">
              <span>position</span>
              <span>language</span>
              <span>recognition</span>
            </div>
            <div className="home-reframe__hero-proof">
              <span>Recorded result</span>
              <strong>0.71 → 2.81%</strong>
              <p>engagement rate in eight weeks for one sustained client engagement</p>
            </div>
            <p className="home-reframe__hero-caption">
              Psychology reveals what people notice. Literature shapes what they remember. Strategy
              turns both into something they can choose.
            </p>
          </div>
        </div>
        <a className="home-reframe__scroll-cue" href="#diagnosis">
          <span>Begin with the problem</span>
          <i aria-hidden="true" />
        </a>
      </section>

      <section
        id="diagnosis"
        data-home-chapter="diagnosis"
        className="home-reframe__section home-reframe__diagnosis"
        aria-labelledby="home-reframe-diagnosis-title"
      >
        <header className="home-reframe__section-head home-reframe__section-head--split">
          <div>
            <p className="home-reframe__eyebrow">01 · Diagnose before designing</p>
            <h2 id="home-reframe-diagnosis-title">
              The brand may not need more. It may need <em>one decision</em>.
            </h2>
          </div>
          <p>
            Select the condition closest to the business. The page will name the strategic move rather
            than sending every problem toward the same package.
          </p>
        </header>

        <div className="home-reframe__diagnosis-grid" style={diagnosisStyle}>
          <div className="home-reframe__diagnosis-tabs" role="tablist" aria-label="Brand conditions">
            {diagnoses.map((item, index) => {
              const active = index === diagnosisIndex;
              return (
                <button
                  key={item.label}
                  type="button"
                  role="tab"
                  aria-selected={active}
                  data-diagnosis-option
                  onClick={() => {
                    setDiagnosisIndex(index);
                    setDiagnosisLocked(true);
                  }}
                  className={active ? "is-active" : undefined}
                >
                  <span>{String(index + 1).padStart(2, "0")}</span>
                  <strong>{item.label}</strong>
                  <small>{item.title}</small>
                </button>
              );
            })}
          </div>

          <article className="home-reframe__diagnosis-panel" role="tabpanel" aria-live="polite">
            <div className="home-reframe__diagnosis-image">
              <Image src={diagnosis.image} alt="" fill sizes="(min-width: 900px) 38vw, 100vw" />
            </div>
            <div className="home-reframe__diagnosis-copy">
              <p>{diagnosis.label} pattern</p>
              <h3>{diagnosis.title}</h3>
              <p>{diagnosis.description}</p>
              <div className="home-reframe__diagnosis-move">
                <span>The strategic move</span>
                <strong>{diagnosis.move}</strong>
              </div>
              <div className="home-reframe__diagnosis-output">
                <span>What the work should produce</span>
                <strong>{diagnosis.output}</strong>
              </div>
            </div>
          </article>
        </div>
      </section>

      <section
        id="evidence"
        data-home-chapter="evidence"
        className="home-reframe__section home-reframe__evidence"
        aria-labelledby="home-reframe-evidence-title"
      >
        <header className="home-reframe__section-head home-reframe__section-head--split">
          <div>
            <p className="home-reframe__eyebrow">02 · Proof before persuasion</p>
            <h2 id="home-reframe-evidence-title">A decision is only useful once the work can prove it.</h2>
          </div>
          <p>
            Five engagements, shown through the signal that was misread, the decision that changed the
            direction, and the result that could actually be recorded.
          </p>
        </header>

        <div className="home-reframe__project-shell" style={projectStyle}>
          <div className="home-reframe__project-media">
            <Image src={project.image} alt="" fill sizes="(min-width: 900px) 55vw, 100vw" />
            <span aria-hidden="true" />
            <div className="home-reframe__project-index">
              {String(projectIndex + 1).padStart(2, "0")} / {String(projects.length).padStart(2, "0")}
            </div>
          </div>
          <article className="home-reframe__project-panel" data-project-panel aria-live="polite">
            <p className="home-reframe__project-category">{project.category}</p>
            <h3>{project.name}</h3>
            <strong className="home-reframe__project-metric">{project.metric}</strong>
            <span className="home-reframe__project-metric-label">{project.metricLabel}</span>
            <p className="home-reframe__project-summary">{project.summary}</p>
            <div className="home-reframe__project-proof">
              <span>Recorded proof</span>
              <p>{project.proof}</p>
            </div>
            <Link href={project.href} className="home-reframe__text-link">
              Open the case study <span aria-hidden="true">↗</span>
            </Link>
          </article>
        </div>

        <div className="home-reframe__project-nav" aria-label="Choose a project">
          {projects.map((item, index) => (
            <button
              key={item.name}
              type="button"
              data-project-option
              aria-pressed={index === projectIndex}
              onClick={() => setProjectIndex(index)}
            >
              <span>{String(index + 1).padStart(2, "0")}</span>
              <strong>{item.name}</strong>
            </button>
          ))}
        </div>
      </section>

      <section
        id="studio"
        data-home-chapter="studio"
        className="home-reframe__section home-reframe__studio"
        aria-labelledby="home-reframe-studio-title"
      >
        <span className="home-reframe__studio-word" aria-hidden="true">
          one mind
        </span>
        <div className="home-reframe__studio-grid">
          <div className="home-reframe__portrait">
            <Image
              src="/images/own-portrait.jpg"
              alt="Suman Sharma, founder and strategist at Branding Tatva"
              fill
              sizes="(min-width: 900px) 42vw, 100vw"
            />
            <div>
              <span>Direct authorship</span>
              <p>The person in the first conversation is the person doing the thinking, writing, and direction.</p>
            </div>
          </div>
          <div className="home-reframe__studio-copy">
            <p className="home-reframe__eyebrow">03 · The strategist behind the system</p>
            <h2 id="home-reframe-studio-title">One mind. Three disciplines. No account-manager fog.</h2>
            <p className="home-reframe__studio-lede">
              Branding Tatva is a personal practice led by Suman Sharma. Psychology decodes perception.
              Literature sharpens language and narrative. Strategy makes both commercially usable.
            </p>
            <div className="home-reframe__discipline-list">
              <article>
                <span>01</span>
                <h3>Read the tension</h3>
                <p>Audience behaviour is treated as evidence, not as a demographic label.</p>
              </article>
              <article>
                <span>02</span>
                <h3>Give it language</h3>
                <p>Positioning becomes a voice and story that people can actually carry.</p>
              </article>
              <article>
                <span>03</span>
                <h3>Make it usable</h3>
                <p>The idea is translated into a website, content, campaigns, and decision rules.</p>
              </article>
            </div>
            <Link href="/about" className="home-reframe__text-link">
              Meet Suman and the practice <span aria-hidden="true">↗</span>
            </Link>
          </div>
        </div>
      </section>

      <section
        id="paths"
        data-home-chapter="paths"
        className="home-reframe__section home-reframe__paths"
        aria-labelledby="home-reframe-paths-title"
      >
        <header className="home-reframe__section-head home-reframe__section-head--split">
          <div>
            <p className="home-reframe__eyebrow">04 · Choose by problem, not package size</p>
            <h2 id="home-reframe-paths-title">Three paths. Each begins at a different kind of uncertainty.</h2>
          </div>
          <p>
            The scope expands only when the business needs it. A positioning problem does not receive a
            content calendar, and a scaling problem does not receive another isolated strategy deck.
          </p>
        </header>

        <div className="home-reframe__path-grid">
          {paths.map((path) => (
            <article key={path.number} className={`home-reframe__path ${path.className}`}>
              <div className="home-reframe__path-topline">
                <span>{path.number}</span>
                <p>{path.eyebrow}</p>
              </div>
              <h3>{path.title}</h3>
              <p className="home-reframe__path-body">{path.body}</p>
              <ul>
                {path.items.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
              <Link href={path.href}>
                {path.cta} <span aria-hidden="true">↗</span>
              </Link>
            </article>
          ))}
        </div>
      </section>

      <section
        id="framework"
        data-home-chapter="framework"
        className="home-reframe__framework"
        aria-labelledby="home-reframe-framework-title"
      >
        <div className="home-reframe__framework-film" aria-hidden="true">
          <video
            src="/videos/pexels-river-dawn.mp4"
            poster="/images/pexels-river-dawn-poster.jpg"
            autoPlay
            muted
            loop
            playsInline
            preload="metadata"
          />
        </div>
        <div className="home-reframe__framework-copy">
          <p className="home-reframe__eyebrow">05 · The Branding Tatva framework</p>
          <h2 id="home-reframe-framework-title">Five forces. One brand people can recognise.</h2>
          <p>
            Position, experience, distinction, voice, and recognition are separate jobs. The system
            becomes coherent when no layer has to rescue a missing one.
          </p>
          <Link href="#elements" className="home-reframe__button home-reframe__button--light">
            Explore the five Tatvas <span aria-hidden="true">↓</span>
          </Link>
        </div>
        <div className="home-reframe__framework-orbit" aria-label="The five forces of the framework">
          <span>Earth · position</span>
          <span>Water · experience</span>
          <span>Fire · distinction</span>
          <span>Air · voice</span>
          <span>Space · recognition</span>
          <strong>Tatva</strong>
        </div>
      </section>

      <section
        id="elements"
        data-home-chapter="elements"
        className="home-reframe__section home-reframe__elements"
        aria-labelledby="home-reframe-elements-title"
        style={tatvaStyle}
      >
        <header className="home-reframe__section-head home-reframe__section-head--split">
          <div>
            <p className="home-reframe__eyebrow">06 · The five Tatvas in practice</p>
            <h2 id="home-reframe-elements-title">Every layer has one job. Select one to see the decision it governs.</h2>
          </div>
          <p>
            The names are elemental; the work is practical. Each Tatva corresponds to a business
            decision that can be examined, built, and used.
          </p>
        </header>

        <div className="home-reframe__element-grid">
          <div className="home-reframe__element-tabs" role="tablist" aria-label="Choose a Tatva">
            {tatvas.map((item, index) => (
              <button
                key={item.sanskrit}
                type="button"
                role="tab"
                data-tatva-option
                aria-selected={index === tatvaIndex}
                className={index === tatvaIndex ? "is-active" : undefined}
                onClick={() => {
                  setTatvaIndex(index);
                  setTatvaLocked(true);
                }}
              >
                <span>{String(index + 1).padStart(2, "0")}</span>
                <strong>{item.sanskrit}</strong>
                <small>{item.role}</small>
              </button>
            ))}
          </div>

          <article className="home-reframe__element-panel" data-tatva-panel role="tabpanel" aria-live="polite">
            <div className="home-reframe__element-image">
              <Image src={tatva.image} alt="" fill sizes="(min-width: 900px) 42vw, 100vw" />
            </div>
            <div className="home-reframe__element-copy">
              <p>{tatva.sanskrit} · {tatva.english}</p>
              <h3>{tatva.role}</h3>
              <blockquote>{tatva.question}</blockquote>
              <div>
                <span>When this layer is working</span>
                <p>{tatva.result}</p>
              </div>
            </div>
          </article>
        </div>
      </section>

      <section
        id="process"
        data-home-chapter="process"
        className="home-reframe__section home-reframe__process"
        aria-labelledby="home-reframe-process-title"
      >
        <header className="home-reframe__section-head home-reframe__section-head--split">
          <div>
            <p className="home-reframe__eyebrow">07 · The work without the black box</p>
            <h2 id="home-reframe-process-title">Question. Commit. Build. Compound.</h2>
          </div>
          <p>
            The process is designed to reduce uncertainty in sequence. Expression begins only after the
            business has made the decisions expression must carry.
          </p>
        </header>

        <ol className="home-reframe__process-grid">
          {processSteps.map((step) => (
            <li key={step.number}>
              <span>{step.number}</span>
              <h3>{step.title}</h3>
              <p>{step.body}</p>
            </li>
          ))}
        </ol>
        <div className="home-reframe__process-footer">
          <p>Bring the unfinished notes, conflicting opinions, and the version nobody has managed to explain yet.</p>
          <Link href="/contact" className="home-reframe__text-link">
            Bring the messy version <span aria-hidden="true">↗</span>
          </Link>
        </div>
      </section>

      <section
        id="questions"
        data-home-chapter="questions"
        className="home-reframe__section home-reframe__questions"
        aria-labelledby="home-reframe-questions-title"
      >
        <div className="home-reframe__questions-intro">
          <p className="home-reframe__eyebrow">08 · Before we work together</p>
          <h2 id="home-reframe-questions-title">Five practical doubts. One calmer decision.</h2>
          <p>
            Scope, implementation, distance, and fit should be clear before a proposal enters the room.
          </p>
          <Link href="/services" className="home-reframe__text-link">
            See the complete service structure <span aria-hidden="true">↗</span>
          </Link>
        </div>

        <div className="home-reframe__faq-list">
          {questions.map((item, index) => (
            <details key={item.question} open={index === 0}>
              <summary>
                <span>{String(index + 1).padStart(2, "0")}</span>
                <strong>{item.question}</strong>
                <i aria-hidden="true">+</i>
              </summary>
              <p>{item.answer}</p>
            </details>
          ))}
        </div>
      </section>

      <section
        id="invitation"
        data-home-chapter="invitation"
        className="home-reframe__invitation"
        aria-labelledby="home-reframe-invitation-title"
      >
        <div className="home-reframe__invitation-copy">
          <p className="home-reframe__eyebrow">09 · The next decision</p>
          <h2 id="home-reframe-invitation-title">Bring the messy version. We will find the idea worth keeping.</h2>
          <p>
            Twenty minutes, a real conversation, and an honest view of what the brand needs next. No
            pitch deck. No pressure to choose the largest scope.
          </p>
          <div className="home-reframe__actions">
            <Link href="/contact" className="home-reframe__button home-reframe__button--light">
              Book a brand strategy session <span aria-hidden="true">↗</span>
            </Link>
            <a href="mailto:suman@brandingtatva.com" className="home-reframe__invitation-email">
              suman@brandingtatva.com
            </a>
          </div>
          <div className="home-reframe__invitation-notes">
            <span>20 minutes</span>
            <span>Founder-led</span>
            <span>Remote worldwide</span>
          </div>
        </div>
        <div className="home-reframe__invitation-media">
          <video
            src="/videos/higgsfield-silver-tide.mp4"
            poster="/images/higgsfield-silver-tide-poster.jpg"
            autoPlay
            muted
            loop
            playsInline
            preload="metadata"
          />
          <span aria-hidden="true" />
          <blockquote>“Some things only become visible once everything else goes quiet.”</blockquote>
        </div>
      </section>

      <footer className="home-reframe__footer">
        <div>
          <strong>Branding Tatva</strong>
          <p>Brand strategy, language, websites, content, and recognition systems led directly by Suman Sharma.</p>
        </div>
        <nav aria-label="Footer">
          <Link href="/about">About</Link>
          <Link href="/services">Services</Link>
          <Link href="/work">Work</Link>
          <Link href="/insights">Insights</Link>
          <Link href="/contact">Contact</Link>
        </nav>
        <p>© {new Date().getFullYear()} Branding Tatva</p>
      </footer>
    </div>
  );
}
