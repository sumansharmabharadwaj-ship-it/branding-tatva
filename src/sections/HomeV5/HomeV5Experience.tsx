"use client";

import Image from "next/image";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowDownRight, ArrowUpRight, Check } from "lucide-react";
import { useEffect, useState, type ReactNode } from "react";
import { BackgroundVideo } from "@/components/BackgroundVideo";
import { useHydratedReducedMotion } from "@/hooks/useHydratedReducedMotion";
import { AskTatva } from "@/sections/HomeV4/AskTatva";

const CHAPTERS = [
  ["opening", "Start"],
  ["recognition", "Diagnose"],
  ["foundation", "Paths"],
  ["process", "Method"],
  ["evidence", "Proof"],
  ["studio", "Studio"],
  ["decision", "Questions"],
  ["invitation", "Begin"],
] as const;

const DIAGNOSES = [
  {
    label: "Misunderstood",
    question: "People see the offer, but not the reason to choose it.",
    detail: "The business needs a position its identity, language, website, and team can all inherit.",
    move: "Clarify the foundation",
  },
  {
    label: "Outgrown",
    question: "The business has changed. The brand still teaches the old expectation.",
    detail: "The work is to protect useful equity while making the next version of the business unmistakable.",
    move: "Reposition the system",
  },
  {
    label: "Inconsistent",
    question: "Every channel is active. Recognition still starts from zero.",
    detail: "One clear idea needs to travel through the visual, verbal, digital, and behavioural system.",
    move: "Create consistency",
  },
] as const;

const PATHS = [
  {
    number: "01",
    label: "Build the foundation",
    forWhom: "For a new idea becoming a real business.",
    decision: "Choose the audience, category, belief, and position before the visible brand starts making promises.",
    result: "A clear strategic foundation the business can grow from.",
    href: "/services#education",
  },
  {
    number: "02",
    label: "Reposition the system",
    forWhom: "For an established business that has moved forward.",
    decision: "Separate what still carries value from what now creates the wrong expectation, then rebuild around the future.",
    result: "A sharper position without discarding recognition that still matters.",
    href: "/services#offerings",
  },
  {
    number: "03",
    label: "Create consistency",
    forWhom: "For a sound brand expressed differently everywhere.",
    decision: "Turn the strategy into a usable identity, voice, website, and content system that can hold together in practice.",
    result: "One recognisable brand across every important encounter.",
    href: "/services#health",
  },
] as const;

const METHOD = [
  {
    label: "Listen",
    title: "Read the business before prescribing the brand.",
    body: "Interviews, existing material, customer language, and market signals reveal the tension worth solving.",
  },
  {
    label: "Decide",
    title: "Make the strategic choice explicit.",
    body: "Audience, category, value, belief, and position become decisions the team can challenge and commit to.",
  },
  {
    label: "Build",
    title: "Give the decision a coherent form.",
    body: "Identity, language, content, and digital experience begin from the same source instead of separate moodboards.",
  },
  {
    label: "Test",
    title: "Judge understanding, not internal excitement.",
    body: "The system is tested against real touchpoints: what a visitor notices, understands, trusts, and remembers.",
  },
  {
    label: "Carry",
    title: "Leave the brand usable after the presentation ends.",
    body: "Guidelines, examples, and decision rules help the team repeat the idea without flattening it.",
  },
] as const;

const QUESTIONS = [
  {
    label: "Scope",
    question: "Can you help a brand-new business?",
    answer: "Yes. The beginning work covers discovery, audience, category, positioning, and the system the launch should grow from.",
  },
  {
    label: "Fit",
    question: "Can you help an established brand that already has recognition?",
    answer: "Yes. Repositioning begins by identifying which equity should be protected, evolved, bridged, or retired.",
  },
  {
    label: "Delivery",
    question: "Do you only hand over strategy?",
    answer: "No. The work can carry through identity, language, content direction, and the digital experience needed to express it.",
  },
] as const;

const EASE = [0.22, 1, 0.36, 1] as const;

function SceneCopy({ children, className = "" }: { children: ReactNode; className?: string }) {
  const reduced = Boolean(useHydratedReducedMotion());
  return (
    <motion.div
      className={className}
      initial={reduced ? false : { opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: false, amount: 0.34 }}
      transition={{ duration: reduced ? 0 : 0.72, ease: EASE }}
    >
      {children}
    </motion.div>
  );
}

function CinematicImage({
  src,
  alt,
  sizes,
  duration,
  distance,
}: {
  src: string;
  alt: string;
  sizes: string;
  duration: number;
  distance: number;
}) {
  const reduced = Boolean(useHydratedReducedMotion());

  return (
    <motion.div
      animate={reduced ? { scale: 1, x: 0 } : { scale: [1.02, 1.08, 1.02], x: [0, distance, 0] }}
      transition={reduced ? { duration: 0 } : { duration, repeat: Infinity, ease: "easeInOut" }}
    >
      <Image src={src} alt={alt} fill sizes={sizes} />
    </motion.div>
  );
}

function Film({ src, poster, rate = 0.88, position = "center" }: { src: string; poster: string; rate?: number; position?: string }) {
  return (
    <>
      <BackgroundVideo video={src} poster={poster} playbackRate={rate} imagePosition={position} push />
      <div className="home-v5-film-grade" aria-hidden="true" />
    </>
  );
}

function ChapterRail() {
  const [active, setActive] = useState(0);
  const reduced = Boolean(useHydratedReducedMotion());

  useEffect(() => {
    const sections = CHAPTERS.map(([id]) => document.getElementById(id)).filter(Boolean) as HTMLElement[];
    const ratios = new Map<HTMLElement, number>();
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => ratios.set(entry.target as HTMLElement, entry.intersectionRatio));
        let next = 0;
        let best = -1;
        sections.forEach((section, index) => {
          const ratio = ratios.get(section) ?? 0;
          if (ratio > best) {
            next = index;
            best = ratio;
          }
        });
        setActive(next);
      },
      { rootMargin: "-22% 0px -24% 0px", threshold: [0, 0.2, 0.45, 0.72] },
    );
    sections.forEach((section) => observer.observe(section));
    return () => observer.disconnect();
  }, []);

  return (
    <nav className="home-v5-rail" aria-label="Homepage chapters">
      <span>{String(active + 1).padStart(2, "0")}</span>
      <div>
        {CHAPTERS.map(([id, label], index) => (
          <button
            key={id}
            type="button"
            aria-label={`Go to ${label}`}
            aria-current={index === active ? "step" : undefined}
            onClick={() => document.getElementById(id)?.scrollIntoView({ behavior: reduced ? "auto" : "smooth", block: "start" })}
          >
            <i aria-hidden="true" />
            <em>{label}</em>
          </button>
        ))}
      </div>
      <span>{String(CHAPTERS.length).padStart(2, "0")}</span>
    </nav>
  );
}

export function HomeV5Experience() {
  const [diagnosis, setDiagnosis] = useState(0);
  const [path, setPath] = useState(0);
  const [method, setMethod] = useState(0);
  const [question, setQuestion] = useState(0);
  const reduced = Boolean(useHydratedReducedMotion());

  useEffect(() => {
    if (reduced) return;

    function resumeOpeningFilm() {
      if (document.hidden) return;
      const video = document.querySelector<HTMLVideoElement>("#opening video");
      if (!video) return;
      const rect = video.getBoundingClientRect();
      if (rect.bottom <= 0 || rect.top >= window.innerHeight) return;
      void video.play().catch(() => undefined);
    }

    // The opening film mounts behind the short first-visit veil. Chromium can
    // occasionally resolve the neighbouring preloaded film first and leave
    // this already-visible video paused until the first scroll crossing.
    // Resume once the veil has cleared, and again when a restored tab returns.
    const timer = window.setTimeout(resumeOpeningFilm, 1_150);
    window.addEventListener("pageshow", resumeOpeningFilm);
    document.addEventListener("visibilitychange", resumeOpeningFilm);

    return () => {
      window.clearTimeout(timer);
      window.removeEventListener("pageshow", resumeOpeningFilm);
      document.removeEventListener("visibilitychange", resumeOpeningFilm);
    };
  }, [reduced]);

  return (
    <div className="home-v5" data-home-v5>
      <ChapterRail />
      <AskTatva />

      <section id="opening" className="home-v5-scene home-v5-opening" data-home-v5-chapter="opening">
        <Film
          src="/videos/home-v5-opening-film.mp4"
          poster="/images/home-v5-opening-film-poster.jpg"
          rate={0.82}
          position="58% center"
        />
        <div className="home-v5-shell home-v5-opening__grid">
          <SceneCopy className="home-v5-opening__copy">
            <p className="home-v5-kicker">Independent brand strategy · India and worldwide</p>
            <h1>
              Your business has moved forward. <em>Does the brand still tell the truth?</em>
            </h1>
            <p className="home-v5-lede">
              Branding Tatva helps founder-led businesses clarify what they stand for, then carry that decision through
              identity, language, content, and digital experience.
            </p>
            <div className="home-v5-actions">
              <Link href="#recognition" className="home-v5-button home-v5-button--light">
                Find the right starting point <ArrowDownRight size={16} />
              </Link>
              <Link href="#evidence" className="home-v5-button home-v5-button--ghost">
                See the proof <ArrowUpRight size={16} />
              </Link>
            </div>
          </SceneCopy>
          <SceneCopy className="home-v5-opening__proof">
            <span>One source. Every expression.</span>
            <strong>Strategy before styling.</strong>
            <p>So the logo, website, pitch, and experience stop making separate promises.</p>
            <div>
              <i /> Position
              <i /> Identity
              <i /> Language
              <i /> Experience
            </div>
          </SceneCopy>
        </div>
        <a href="#recognition" className="home-v5-next" aria-label="Continue to diagnosis">
          Scroll for the diagnosis <span aria-hidden="true">↓</span>
        </a>
      </section>

      <section id="recognition" className="home-v5-scene home-v5-diagnosis" data-home-v5-chapter="recognition">
        <Film src="/videos/home-v5-diagnosis-film.mp4" poster="/images/home-v5-diagnosis-film-poster.jpg" rate={0.86} />
        <div className="home-v5-shell">
          <SceneCopy className="home-v5-heading home-v5-heading--split">
            <div>
              <p className="home-v5-kicker">01 · Diagnose the real gap</p>
              <h2>Start with the friction people can already feel.</h2>
            </div>
            <p>Choose the condition closest to the business today. The right path begins with the source, not the symptom.</p>
          </SceneCopy>
          <div className="home-v5-diagnosis__stage">
            <div className="home-v5-tabs" role="tablist" aria-label="Choose a brand condition">
              {DIAGNOSES.map((item, index) => (
                <button key={item.label} type="button" role="tab" aria-selected={diagnosis === index} onClick={() => setDiagnosis(index)}>
                  <span>{String(index + 1).padStart(2, "0")}</span>
                  <strong>{item.label}</strong>
                </button>
              ))}
            </div>
            <AnimatePresence mode="wait" initial={false}>
              <motion.article
                key={DIAGNOSES[diagnosis].label}
                className="home-v5-focus-card"
                initial={reduced ? false : { opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                exit={reduced ? undefined : { opacity: 0, y: -12 }}
                transition={{ duration: reduced ? 0 : 0.4, ease: EASE }}
              >
                <span>The condition</span>
                <h3>{DIAGNOSES[diagnosis].question}</h3>
                <p>{DIAGNOSES[diagnosis].detail}</p>
                <div>
                  <small>The useful move</small>
                  <strong>{DIAGNOSES[diagnosis].move}</strong>
                </div>
                <Link href="#foundation">Match the path <ArrowDownRight size={15} /></Link>
              </motion.article>
            </AnimatePresence>
          </div>
        </div>
      </section>

      <section id="foundation" className="home-v5-scene home-v5-paths" data-home-v5-chapter="foundation">
        <Film src="/videos/home-v5-paths-film.mp4" poster="/images/home-v5-paths-film-poster.jpg" rate={0.86} position="center 42%" />
        <div className="home-v5-shell">
          <SceneCopy className="home-v5-heading home-v5-heading--split">
            <div>
              <p className="home-v5-kicker">02 · Three paths</p>
              <h2>Choose by what needs to become true next.</h2>
            </div>
            <p>Every path begins with diagnosis. The difference is the decision the business is ready to make.</p>
          </SceneCopy>
          <div className="home-v5-paths__stage">
            <div className="home-v5-tabs home-v5-tabs--vertical" role="tablist" aria-label="Choose a service path">
              {PATHS.map((item, index) => (
                <button key={item.number} type="button" role="tab" aria-selected={path === index} onClick={() => setPath(index)}>
                  <span>{item.number}</span>
                  <strong>{item.label}</strong>
                  <small>{item.forWhom}</small>
                </button>
              ))}
            </div>
            <AnimatePresence mode="wait" initial={false}>
              <motion.article
                key={PATHS[path].number}
                className="home-v5-focus-card home-v5-focus-card--path"
                initial={reduced ? false : { opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={reduced ? undefined : { opacity: 0, x: -16 }}
                transition={{ duration: reduced ? 0 : 0.42, ease: EASE }}
              >
                <span>Path {PATHS[path].number}</span>
                <h3>{PATHS[path].label}</h3>
                <p>{PATHS[path].decision}</p>
                <div>
                  <small>What becomes possible</small>
                  <strong>{PATHS[path].result}</strong>
                </div>
                <Link href={PATHS[path].href}>Explore this path <ArrowUpRight size={15} /></Link>
              </motion.article>
            </AnimatePresence>
          </div>
        </div>
      </section>

      <section id="process" className="home-v5-scene home-v5-method" data-home-v5-chapter="process">
        <Film src="/videos/home-v5-method-film.mp4" poster="/images/home-v5-method-film-poster.jpg" rate={0.88} position="center 38%" />
        <div className="home-v5-shell home-v5-method__grid">
          <SceneCopy className="home-v5-method__copy">
            <p className="home-v5-kicker">03 · A visible method</p>
            <h2>The work stays inspectable while it moves.</h2>
            <p>No black-box reveal. Each stage leaves a decision the next stage can inherit.</p>
            <div className="home-v5-method__steps" role="tablist" aria-label="Choose a method stage">
              {METHOD.map((item, index) => (
                <button key={item.label} type="button" role="tab" aria-selected={method === index} onClick={() => setMethod(index)}>
                  <span>{String(index + 1).padStart(2, "0")}</span>
                  {item.label}
                </button>
              ))}
            </div>
            <AnimatePresence mode="wait" initial={false}>
              <motion.div
                key={METHOD[method].label}
                className="home-v5-method__answer"
                initial={reduced ? false : { opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={reduced ? undefined : { opacity: 0, y: -8 }}
                transition={{ duration: reduced ? 0 : 0.36, ease: EASE }}
              >
                <strong>{METHOD[method].title}</strong>
                <p>{METHOD[method].body}</p>
              </motion.div>
            </AnimatePresence>
            <Link href="/services#education" className="home-v5-text-link">See how the work is structured <ArrowUpRight size={14} /></Link>
          </SceneCopy>
          <SceneCopy className="home-v5-editorial-card">
            <CinematicImage
              src="/images/home-v5-process-editorial.jpg"
              alt="A strategy table with notes, research papers, material samples, and an open notebook"
              sizes="(max-width: 900px) 100vw, 46vw"
              duration={18}
              distance={-8}
            />
            <span>Original editorial study · the work behind the work</span>
          </SceneCopy>
        </div>
      </section>

      <section id="evidence" className="home-v5-scene home-v5-evidence" data-home-v5-chapter="evidence">
        <Film src="/videos/home-v5-evidence-film.mp4" poster="/images/home-v5-evidence-film-poster.jpg" rate={0.86} position="center 42%" />
        <div className="home-v5-shell">
          <SceneCopy className="home-v5-heading home-v5-heading--split">
            <div>
              <p className="home-v5-kicker">04 · Recorded evidence</p>
              <h2>One decision. Measurable change.</h2>
            </div>
            <p>Dr. Haley Nutrition tested whether fewer, sharper posts could outperform a heavier publishing schedule.</p>
          </SceneCopy>
          <div className="home-v5-evidence__grid">
            <SceneCopy className="home-v5-evidence__result">
              <span>Verified result · Dec 2025 to Jan 2026</span>
              <strong>104%</strong>
              <p>more followers earned per Instagram post</p>
              <div>
                <span><b>23 → 12</b> posts</span>
                <span><b>+1,350%</b> comments per post</span>
                <span><b>0.71 → 2.81%</b> LinkedIn engagement</span>
              </div>
            </SceneCopy>
            <SceneCopy className="home-v5-evidence__decision">
              <span>The strategic call</span>
              <h3>Post less. Make every remaining post earn its place.</h3>
              <p>Impressions barely moved even as publishing dropped by nearly half. Relevance, not volume, was doing the work.</p>
              <div className="home-v5-actions">
                <Link href="/work/dr-haley-nutrition" className="home-v5-button home-v5-button--clay">Inspect the project <ArrowUpRight size={15} /></Link>
                <Link href="/work" className="home-v5-text-link">Explore all work <ArrowUpRight size={14} /></Link>
              </div>
            </SceneCopy>
          </div>
        </div>
      </section>

      <section id="studio" className="home-v5-scene home-v5-studio" data-home-v5-chapter="studio">
        <div className="home-v5-studio__image" aria-hidden="true">
          <CinematicImage src="/images/home-v5-studio-editorial.jpg" alt="" sizes="100vw" duration={22} distance={-12} />
          <span />
        </div>
        <div className="home-v5-shell home-v5-studio__grid">
          <SceneCopy className="home-v5-studio__copy">
            <p className="home-v5-kicker">05 · The thinking room</p>
            <h2>Psychology finds the tension. Literature gives it language. Strategy makes it usable.</h2>
            <p>You work directly with the person doing the research, writing, direction, and decision-making.</p>
            <ul>
              <li><Check size={14} /> M.A. Clinical Psychology</li>
              <li><Check size={14} /> B.A. English Literature</li>
              <li><Check size={14} /> Founder-led strategy and delivery</li>
            </ul>
            <Link href="/about" className="home-v5-button home-v5-button--ghost">Meet Suman <ArrowUpRight size={15} /></Link>
          </SceneCopy>
        </div>
      </section>

      <section id="decision" className="home-v5-scene home-v5-questions" data-home-v5-chapter="decision">
        <Film src="/videos/home-v5-questions-film.mp4" poster="/images/home-v5-questions-film-poster.jpg" rate={0.86} position="center 58%" />
        <div className="home-v5-shell">
          <SceneCopy className="home-v5-heading home-v5-heading--split">
            <div>
              <p className="home-v5-kicker">06 · Before we work together</p>
              <h2>Useful answers before a sales call.</h2>
            </div>
            <p>Start with the doubt underneath the question. If it is not answered here, Ask Tatva stays available in the corner.</p>
          </SceneCopy>
          <div className="home-v5-questions__stage">
            <div className="home-v5-tabs home-v5-tabs--vertical" role="tablist" aria-label="Choose a practical question">
              {QUESTIONS.map((item, index) => (
                <button key={item.label} type="button" role="tab" aria-selected={question === index} onClick={() => setQuestion(index)}>
                  <span>{String(index + 1).padStart(2, "0")}</span>
                  <strong>{item.label}</strong>
                  <small>{item.question}</small>
                </button>
              ))}
            </div>
            <AnimatePresence mode="wait" initial={false}>
              <motion.article
                key={QUESTIONS[question].label}
                className="home-v5-focus-card"
                initial={reduced ? false : { opacity: 0, x: 18 }}
                animate={{ opacity: 1, x: 0 }}
                exit={reduced ? undefined : { opacity: 0, x: -14 }}
                transition={{ duration: reduced ? 0 : 0.38, ease: EASE }}
              >
                <span>What this is really asking</span>
                <h3>{QUESTIONS[question].question}</h3>
                <p>{QUESTIONS[question].answer}</p>
                <Link href="/contact">Bring the remaining question <ArrowUpRight size={15} /></Link>
              </motion.article>
            </AnimatePresence>
          </div>
        </div>
      </section>

      <section id="invitation" className="home-v5-scene home-v5-invitation" data-home-v5-chapter="invitation">
        <Film src="/videos/home-v5-invitation-film.mp4" poster="/images/home-v5-invitation-film-poster.jpg" rate={0.8} />
        <div className="home-v5-shell home-v5-invitation__grid">
          <SceneCopy className="home-v5-invitation__copy">
            <p className="home-v5-kicker">The next clear decision</p>
            <h2>Bring the part of the brand that no longer makes sense.</h2>
            <p>Thirty focused minutes to name the tension, choose the direction, and see what the business needs next.</p>
            <div className="home-v5-actions">
              <Link href="/contact" className="home-v5-button home-v5-button--clay">Enter the strategy room <ArrowUpRight size={15} /></Link>
              <Link href="/work" className="home-v5-text-link">Read the decisions behind the work <ArrowUpRight size={14} /></Link>
            </div>
            <div className="home-v5-invitation__terms"><span>30 minutes</span><span>Honest diagnosis</span><span>No pitch deck</span></div>
          </SceneCopy>
        </div>
      </section>
    </div>
  );
}
