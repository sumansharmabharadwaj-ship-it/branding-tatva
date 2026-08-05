"use client";

import Image from "next/image";
import Link from "next/link";
import { useMemo, useState, type CSSProperties } from "react";
import { usePricing } from "@/components/PricingProvider";
import { REGIONS, formatPrice, type PackageSlug } from "@/data/pricing";
import { offerings, packages } from "@/data/services";
import styles from "./ServicesReframe.module.css";

const scenarios = [
  {
    key: "starting",
    label: "Starting",
    eyebrow: "An idea becoming a business",
    title: "The business is clearer in your head than it is in the market.",
    body:
      "The fastest route is not a logo sprint. It is deciding the audience tension, category, promise, and language before every visible asset starts making accidental promises.",
    move: "Build the strategic foundation first, then translate it into identity and launch direction.",
    outputs: ["Audience and category decision", "Positioning and promise", "Voice direction", "Core visual identity"],
    packageSlug: "brand-beginning" as PackageSlug,
    accent: "#C87555",
    image: "/images/higgsfield-himalayan-valley-poster.jpg",
  },
  {
    key: "repositioning",
    label: "Repositioning",
    eyebrow: "A business that outgrew its brand",
    title: "The company evolved. The brand is still describing the old version.",
    body:
      "The website, content, identity, and sales language may each be reasonable alone while collectively teaching the market four different expectations.",
    move: "Audit the perception gap, choose the stronger position, and rebuild the system around one idea.",
    outputs: ["Brand and perception audit", "Repositioning architecture", "Messaging system", "Website and identity direction"],
    packageSlug: "brand-clarity" as PackageSlug,
    accent: "#52756F",
    image: "/images/pexels-root-network-poster.jpg",
  },
  {
    key: "growing",
    label: "Growing",
    eyebrow: "A brand ready to compound",
    title: "The brand works, but every channel still has to reinvent it.",
    body:
      "Growth becomes expensive when each campaign, page, and post needs a fresh interpretation of what the brand is supposed to sound and feel like.",
    move: "Turn the position into repeatable language, content rules, campaign logic, and ongoing oversight.",
    outputs: ["Monthly content direction", "Consistency review", "Performance adjustment", "Quarterly strategic reset"],
    packageSlug: "brand-partnership" as PackageSlug,
    accent: "#7D8565",
    image: "/images/pexels-river-dawn-poster.jpg",
  },
] as const;

const capabilityRoles = [
  { label: "Position", question: "What should the market understand first?" },
  { label: "Message", question: "What language carries that decision?" },
  { label: "Presence", question: "How does the idea stay recognisable in public?" },
  { label: "Experience", question: "Does the website behave like the same brand?" },
  { label: "Expression", question: "What does the system create repeatedly?" },
  { label: "Amplification", question: "Where should attention be directed and measured?" },
] as const;

const processSteps = [
  {
    number: "01",
    title: "Question",
    body: "Surface the founder truth, audience tension, inherited assumptions, and the contradiction the market is currently reading.",
  },
  {
    number: "02",
    title: "Commit",
    body: "Choose the category frame, position, promise, and language that every later decision must reinforce.",
  },
  {
    number: "03",
    title: "Build",
    body: "Translate the decision into identity direction, website structure, content architecture, campaigns, and usable rules.",
  },
  {
    number: "04",
    title: "Compound",
    body: "Keep the system coherent long enough for recognition, trust, and market memory to accumulate instead of resetting each month.",
  },
] as const;

const healthPrompts = [
  "A customer can explain the brand in one clear sentence.",
  "The website, sales language, and social content repeat the same position.",
  "The visual identity is recognisable without relying on the logo every time.",
  "Content decisions come from a defined voice and message system.",
  "A new team member could create on-brand work without rebuilding the logic from zero.",
] as const;

const questions = [
  {
    question: "Can the work begin before the business has a logo or website?",
    answer:
      "Yes. That is often the cleanest moment to begin. Positioning, audience, category, promise, and voice are decided before visible assets harden around assumptions that later become expensive to undo.",
  },
  {
    question: "Will I work directly with Suman?",
    answer:
      "Yes. The same person hears the problem, makes the strategic decisions, writes the language, and directs implementation. There is no account-manager handoff between diagnosis and delivery.",
  },
  {
    question: "Do I have to replace an identity that already has recognition?",
    answer:
      "No. Existing assets are not discarded by default. The audit determines what still carries useful memory, what is creating confusion, and what needs to evolve.",
  },
  {
    question: "Is this strategy only, or can the work continue into execution?",
    answer:
      "The work can continue into verbal identity, website development, content systems, campaign direction, and ongoing brand management. Scope follows the actual problem rather than forcing every business into the largest package.",
  },
  {
    question: "Are the prices shown final quotes?",
    answer:
      "They are starting figures for the listed scope. The final fee follows a discovery conversation because complexity, existing assets, research depth, and implementation needs change the real amount of work.",
  },
  {
    question: "Can the engagement happen remotely?",
    answer:
      "Yes. Strategy sessions, reviews, and delivery can be organised remotely around the project and time zone rather than geography.",
  },
] as const;

function recommendationFor(score: number) {
  if (score <= 1) {
    return {
      label: "Foundation gap",
      title: "The brand is asking execution to solve a strategic problem.",
      body: "Begin with positioning, audience, promise, and voice before commissioning more visible output.",
      packageSlug: "brand-beginning" as PackageSlug,
      accent: "#C87555",
    };
  }
  if (score <= 3) {
    return {
      label: "Alignment gap",
      title: "Useful pieces exist, but they are not reinforcing one market idea yet.",
      body: "An audit and repositioning pass can preserve what carries recognition while removing the contradictions.",
      packageSlug: "brand-clarity" as PackageSlug,
      accent: "#52756F",
    };
  }
  return {
    label: "Consistency opportunity",
    title: "The foundation is present. The next gain comes from compounding it.",
    body: "Ongoing direction can keep content, campaigns, and the website coherent as the business grows.",
    packageSlug: "brand-partnership" as PackageSlug,
    accent: "#7D8565",
  };
}

export function ServicesReframe() {
  const { region, setRegion } = usePricing();
  const [scenarioIndex, setScenarioIndex] = useState(0);
  const [healthAnswers, setHealthAnswers] = useState<boolean[]>(() => healthPrompts.map(() => false));
  const [openQuestion, setOpenQuestion] = useState(0);

  const scenario = scenarios[scenarioIndex];
  const recommendedPackage =
    packages.find((item) => item.slug === scenario.packageSlug) ?? packages[0];
  const healthScore = healthAnswers.filter(Boolean).length;
  const healthRecommendation = useMemo(() => recommendationFor(healthScore), [healthScore]);
  const healthPackage =
    packages.find((item) => item.slug === healthRecommendation.packageSlug) ?? packages[0];

  const scenarioStyle = {
    "--services-accent": scenario.accent,
  } as CSSProperties;
  const healthStyle = {
    "--services-accent": healthRecommendation.accent,
  } as CSSProperties;

  function contactHref(packageSlug: string, stage = scenario.key) {
    return `/contact?package=${encodeURIComponent(packageSlug)}&stage=${encodeURIComponent(stage)}&source=services`;
  }

  function toggleHealth(index: number) {
    setHealthAnswers((current) => current.map((value, itemIndex) => (itemIndex === index ? !value : value)));
  }

  return (
    <div className={styles.root} data-services-reframe>
      <section className={styles.hero} id="opening" aria-labelledby="services-reframe-title">
        <div className={styles.heroGrid}>
          <div className={styles.heroCopy}>
            <p className={styles.eyebrow}>Brand strategy · identity · websites · content systems</p>
            <h1 id="services-reframe-title">
              The work begins where <em>recognition breaks.</em>
            </h1>
            <p className={styles.heroLede}>
              Some businesses need a foundation. Some need to shed an old position. Others need a system
              strong enough to stay coherent while they grow. The service is chosen after the problem is
              named, never before.
            </p>
            <div className={styles.actions}>
              <a href="#diagnose" className={`${styles.button} ${styles.buttonPrimary}`}>
                Diagnose the starting point <span aria-hidden="true">↘</span>
              </a>
              <Link href="/work" className={`${styles.button} ${styles.buttonQuiet}`}>
                See the evidence <span aria-hidden="true">↗</span>
              </Link>
            </div>
            <div className={styles.heroSignals} aria-label="How the practice works">
              <span>Founder-led</span>
              <span>Strategy through implementation</span>
              <span>Remote worldwide</span>
            </div>
          </div>

          <div className={styles.heroStage} aria-label="Sunlight moving through Himalayan trees">
            <div className={styles.heroFilm}>
              <video autoPlay muted loop playsInline preload="metadata" poster="/images/pexels-aspen-sunburst-poster.jpg">
                <source src="/videos/pexels-aspen-sunburst.webm" type="video/webm" />
                <source src="/videos/pexels-aspen-sunburst.mp4" type="video/mp4" />
              </video>
              <span className={styles.filmWash} aria-hidden="true" />
            </div>
            <div className={styles.heroProof}>
              <span>Recorded client result</span>
              <strong>0.71 → 2.81%</strong>
              <p>engagement rate after eight weeks of a tighter content system</p>
            </div>
            <div className={styles.heroCompass} aria-hidden="true">
              <span>position</span>
              <span>voice</span>
              <span>experience</span>
            </div>
          </div>
        </div>

        <nav className={styles.chapterNav} aria-label="Services page sections">
          <a href="#diagnose"><span>01</span> Diagnose</a>
          <a href="#capabilities"><span>02</span> Build</a>
          <a href="#packages"><span>03</span> Choose</a>
          <a href="#proof"><span>04</span> Verify</a>
          <a href="#book"><span>05</span> Begin</a>
        </nav>
      </section>

      <section id="diagnose" className={`${styles.section} ${styles.diagnosis}`} aria-labelledby="services-diagnosis-title">
        <header className={`${styles.sectionHead} ${styles.sectionHeadSplit}`}>
          <div>
            <p className={styles.eyebrow}>01 · Scope follows diagnosis</p>
            <h2 id="services-diagnosis-title">
              Three businesses can ask for a website and need <em>three different interventions.</em>
            </h2>
          </div>
          <p>
            Choose the condition closest to the business. The recommendation changes because the page is
            diagnosing the source of confusion, not merely matching keywords to a package.
          </p>
        </header>

        <div className={styles.scenarioTabs} role="group" aria-label="Choose the closest business situation">
          {scenarios.map((item, index) => (
            <button
              key={item.key}
              type="button"
              aria-pressed={scenarioIndex === index}
              onClick={() => setScenarioIndex(index)}
              className={scenarioIndex === index ? styles.scenarioTabActive : styles.scenarioTab}
            >
              <span>{String(index + 1).padStart(2, "0")}</span>
              {item.label}
            </button>
          ))}
        </div>

        <div className={styles.diagnosisGrid} style={scenarioStyle}>
          <article className={styles.diagnosisStory} id="services-scenario-panel" aria-live="polite">
            <div className={styles.diagnosisImage}>
              <Image src={scenario.image} alt="" fill sizes="(max-width: 900px) 100vw, 48vw" />
              <span aria-hidden="true" />
            </div>
            <div className={styles.diagnosisCopy}>
              <p className={styles.eyebrow}>{scenario.eyebrow}</p>
              <h3>{scenario.title}</h3>
              <p>{scenario.body}</p>
              <div className={styles.strategicMove}>
                <span>Strategic move</span>
                <strong>{scenario.move}</strong>
              </div>
            </div>
          </article>

          <aside className={styles.recommendation} aria-label="Recommended starting scope">
            <p className={styles.eyebrow}>Recommended starting scope</p>
            <div className={styles.recommendationIndex}>{String(scenarioIndex + 1).padStart(2, "0")}</div>
            <h3>{recommendedPackage.name}</h3>
            <p>{recommendedPackage.description}</p>
            <ul>
              {scenario.outputs.map((output) => (
                <li key={output}>{output}</li>
              ))}
            </ul>
            <Link href={contactHref(recommendedPackage.slug)} className={`${styles.button} ${styles.buttonPrimary}`}>
              Discuss this starting point <span aria-hidden="true">↗</span>
            </Link>
          </aside>
        </div>
      </section>

      <section id="capabilities" className={`${styles.section} ${styles.capabilities}`} aria-labelledby="services-capabilities-title">
        <div className={styles.capabilityLayout}>
          <header className={styles.capabilityIntro}>
            <p className={styles.eyebrow}>02 · One connected practice</p>
            <h2 id="services-capabilities-title">
              Six capabilities. <em>One market idea.</em>
            </h2>
            <p>
              Strategy, identity, websites, content, social, and marketing only compound when they keep
              teaching the same expectation. The work is organised as one system instead of six separate
              suppliers passing a brief between them.
            </p>
            <Link href="/about" className={styles.textLink}>
              Why direct authorship matters <span aria-hidden="true">↗</span>
            </Link>
          </header>

          <ol className={styles.capabilityLedger}>
            {offerings.map((offering, index) => {
              const role = capabilityRoles[index];
              return (
                <li
                  key={offering.name}
                  style={{ "--services-row-accent": offering.color } as CSSProperties}
                >
                  <span className={styles.capabilityNumber}>{String(index + 1).padStart(2, "0")}</span>
                  <div>
                    <p>{role.label}</p>
                    <h3>{offering.name}</h3>
                  </div>
                  <div className={styles.capabilityQuestion}>
                    <span>{role.question}</span>
                    <p>{offering.detail}</p>
                  </div>
                </li>
              );
            })}
          </ol>
        </div>
      </section>

      <section id="packages" className={`${styles.section} ${styles.packages}`} aria-labelledby="services-packages-title">
        <header className={`${styles.sectionHead} ${styles.sectionHeadSplit}`}>
          <div>
            <p className={styles.eyebrow}>03 · Choose the depth, not a shopping list</p>
            <h2 id="services-packages-title">
              A clear starting scope, with room for the <em>real problem</em> to shape it.
            </h2>
          </div>
          <div className={styles.regionControl}>
            <label htmlFor="services-region">Pricing region</label>
            <select id="services-region" value={region} onChange={(event) => setRegion(event.target.value as typeof region)}>
              {REGIONS.map((item) => (
                <option key={item.id} value={item.id}>
                  {item.label}
                </option>
              ))}
            </select>
            <p>Starting figures. Final scope follows discovery.</p>
          </div>
        </header>

        <div className={styles.packageGrid}>
          {packages.map((item, index) => (
            <article
              key={item.slug}
              className={`${styles.packageCard} ${item.popular ? styles.packageFeatured : ""}`}
              style={{ "--services-package-accent": item.color } as CSSProperties}
            >
              <div className={styles.packageTopline}>
                <span>{String(index + 1).padStart(2, "0")}</span>
                {item.popular && <strong>Most selected</strong>}
              </div>
              <p className={styles.packageFor}>{item.forWho}</p>
              <h3>{item.name}</h3>
              <div className={styles.packagePrice}>
                <span>from</span>
                <strong>{formatPrice(region, item.slug as PackageSlug)}</strong>
                <small>{item.billing === "monthly" ? "/ month" : "project fee"}</small>
              </div>
              <p className={styles.packageDescription}>{item.description}</p>
              <ul>
                {item.includes.map((included) => (
                  <li key={included}>{included}</li>
                ))}
              </ul>
              <div className={styles.packageActions}>
                <Link href={contactHref(item.slug)} className={`${styles.button} ${item.popular ? styles.buttonPrimary : styles.buttonQuiet}`}>
                  Discuss {item.name} <span aria-hidden="true">↗</span>
                </Link>
                {item.proofSlug && (
                  <Link href={`/work/${item.proofSlug}`} className={styles.textLink}>
                    See related evidence <span aria-hidden="true">↗</span>
                  </Link>
                )}
              </div>
            </article>
          ))}
        </div>

        <div className={styles.fitNote}>
          <p className={styles.eyebrow}>A useful boundary</p>
          <p>
            Branding Tatva is built for founders who want the thinking and execution connected. A one-off
            logo without positioning, content volume without a message system, and overnight growth promises
            are outside the practice by design.
          </p>
        </div>
      </section>

      <section id="proof" className={styles.proof} aria-labelledby="services-proof-title">
        <div className={styles.proofGrid}>
          <div className={styles.proofMedia}>
            <Image
              src="/images/card-dr-haley-nutrition-poster.jpg"
              alt="A warm, editorial nutrition scene representing the Dr. Haley Nutrition engagement"
              fill
              sizes="(max-width: 900px) 100vw, 48vw"
            />
            <span aria-hidden="true" />
          </div>
          <div className={styles.proofCopy}>
            <p className={styles.eyebrow}>04 · Proof before promises</p>
            <h2 id="services-proof-title">
              Posting less worked because the <em>system became sharper.</em>
            </h2>
            <p>
              For Dr. Haley Nutrition, the intervention was not more volume. Instagram posting fell from
              23 posts to 12 while the remaining work became more relevant, deliberate, and consistent.
            </p>
            <div className={styles.proofMetrics}>
              <div><strong>104%</strong><span>more followers earned per post</span></div>
              <div><strong>1,350%</strong><span>jump in comments per post</span></div>
              <div><strong>365%</strong><span>rise in LinkedIn impressions</span></div>
              <div><strong>2.81%</strong><span>engagement rate, up from 0.71%</span></div>
            </div>
            <Link href="/work/dr-haley-nutrition" className={`${styles.button} ${styles.buttonLight}`}>
              Read the case study <span aria-hidden="true">↗</span>
            </Link>
          </div>
        </div>
      </section>

      <section id="process" className={`${styles.section} ${styles.process}`} aria-labelledby="services-process-title">
        <header className={`${styles.sectionHead} ${styles.sectionHeadSplit}`}>
          <div>
            <p className={styles.eyebrow}>05 · The working method</p>
            <h2 id="services-process-title">
              The visible work arrives third. <em>The decision arrives first.</em>
            </h2>
          </div>
          <p>
            Every engagement changes in detail, but the order remains stable. Question before commitment;
            commitment before execution; execution before compounding.
          </p>
        </header>

        <ol className={styles.processGrid}>
          {processSteps.map((step) => (
            <li key={step.number}>
              <span>{step.number}</span>
              <h3>{step.title}</h3>
              <p>{step.body}</p>
            </li>
          ))}
        </ol>
      </section>

      <section id="health" className={`${styles.section} ${styles.health}`} aria-labelledby="services-health-title">
        <div className={styles.healthGrid}>
          <div className={styles.healthIntro}>
            <p className={styles.eyebrow}>06 · A two-minute brand check</p>
            <h2 id="services-health-title">
              How much of the brand can already <em>hold without you?</em>
            </h2>
            <p>
              Mark every statement that is reliably true today. The result points toward the next strategic
              move rather than assigning a theatrical score to the business.
            </p>
            <div className={styles.healthScale} aria-hidden="true">
              <span>Foundation</span><i /><span>Alignment</span><i /><span>Consistency</span>
            </div>
          </div>

          <div className={styles.healthInstrument} style={healthStyle}>
            <div className={styles.healthQuestions} role="group" aria-label="Brand health statements">
              {healthPrompts.map((prompt, index) => (
                <button
                  key={prompt}
                  type="button"
                  aria-pressed={healthAnswers[index]}
                  onClick={() => toggleHealth(index)}
                  className={healthAnswers[index] ? styles.healthAnswerActive : styles.healthAnswer}
                >
                  <span>{healthAnswers[index] ? "Yes" : "Not yet"}</span>
                  <strong>{prompt}</strong>
                </button>
              ))}
            </div>

            <aside className={styles.healthResult} aria-live="polite">
              <div className={styles.healthScore}>
                <strong>{healthScore}</strong><span>/ 5</span>
              </div>
              <p className={styles.eyebrow}>{healthRecommendation.label}</p>
              <h3>{healthRecommendation.title}</h3>
              <p>{healthRecommendation.body}</p>
              <Link href={contactHref(healthPackage.slug, `health-${healthScore}`)} className={`${styles.button} ${styles.buttonPrimary}`}>
                Discuss {healthPackage.name} <span aria-hidden="true">↗</span>
              </Link>
            </aside>
          </div>
        </div>
      </section>

      <section id="questions" className={`${styles.section} ${styles.questions}`} aria-labelledby="services-questions-title">
        <header className={styles.questionIntro}>
          <p className={styles.eyebrow}>07 · Before the first conversation</p>
          <h2 id="services-questions-title">
            Practical questions, answered <em>without theatre.</em>
          </h2>
        </header>

        <div className={styles.questionList}>
          {questions.map((item, index) => {
            const open = openQuestion === index;
            return (
              <article key={item.question} className={open ? styles.questionOpen : styles.questionItem}>
                <button
                  type="button"
                  aria-expanded={open}
                  aria-controls={`services-answer-${index}`}
                  onClick={() => setOpenQuestion(open ? -1 : index)}
                >
                  <span>{String(index + 1).padStart(2, "0")}</span>
                  <strong>{item.question}</strong>
                  <i aria-hidden="true">{open ? "−" : "+"}</i>
                </button>
                <div id={`services-answer-${index}`} hidden={!open}>
                  <p>{item.answer}</p>
                </div>
              </article>
            );
          })}
        </div>
      </section>

      <section id="book" className={styles.invitation} aria-labelledby="services-book-title">
        <div className={styles.invitationFilm}>
          <video autoPlay muted loop playsInline preload="metadata" poster="/images/pexels-fog-sunrise-poster.jpg">
            <source src="/videos/pexels-fog-sunrise.webm" type="video/webm" />
            <source src="/videos/pexels-fog-sunrise.mp4" type="video/mp4" />
          </video>
          <span aria-hidden="true" />
        </div>
        <div className={styles.invitationCopy}>
          <p className={styles.eyebrow}>The strategy room</p>
          <h2 id="services-book-title">
            Bring the confusion. Leave with the <em>first honest decision.</em>
          </h2>
          <p>
            The opening conversation is for naming the real problem, testing whether the practice is the
            right fit, and deciding what should happen before anyone produces another asset.
          </p>
          <div className={styles.actions}>
            <Link href={contactHref(recommendedPackage.slug)} className={`${styles.button} ${styles.buttonLight}`}>
              Start the conversation <span aria-hidden="true">↗</span>
            </Link>
            <Link href="/work" className={`${styles.button} ${styles.buttonGhost}`}>
              Review the work first
            </Link>
          </div>
          <div className={styles.invitationNotes}>
            <span>Directly with Suman</span>
            <span>No forced package</span>
            <span>Remote worldwide</span>
          </div>
        </div>
      </section>
    </div>
  );
}
