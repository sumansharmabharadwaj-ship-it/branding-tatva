"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  AnimatePresence,
  motion,
  useInView,
  useMotionValueEvent,
  useScroll,
  useSpring,
  useTransform,
} from "framer-motion";
import { Container } from "@/components/Container";
import { LinkButton } from "@/components/Button";
import { useHydratedReducedMotion } from "@/hooks/useHydratedReducedMotion";
import { useMediaQuery } from "@/hooks/useMediaQuery";
import { projects } from "@/data/projects";
import { elements, type Element } from "@/data/elements";
import { process } from "@/data/process";
import { credentials } from "@/data/about";
import { faqs } from "@/data/faqs";
import { track } from "@/lib/analytics";

const EASE = [0.16, 1, 0.3, 1] as const;
const SITUATION_KEY = "bt-situation";

const RECOGNITION_STATES = [
  {
    id: "idea",
    number: "01",
    label: "We keep changing direction before anything settles",
    stage: "Building from an idea",
    symptom: "Too many possibilities. No governing decision yet.",
    path: "Foundation",
    outcome: "A business people can understand before they are asked to buy.",
    note: "Discovery, positioning, core identity, and the first usable brand system.",
    proof: "myshopineurope",
  },
  {
    id: "inconsistent",
    number: "02",
    label: "People see us, but every version feels different",
    stage: "An existing brand without one system",
    symptom: "Every channel is active. None of them feel related.",
    path: "Full Brand System",
    outcome: "Recognition begins compounding instead of restarting on every channel.",
    note: "Audit, repositioning, verbal identity, and alignment across every customer-facing surface.",
    proof: "herbalcart",
  },
  {
    id: "outgrown",
    number: "03",
    label: "The business has grown, but the brand still looks behind",
    stage: "A mature offer inside an earlier identity",
    symptom: "The offer has matured. The brand still describes an earlier version.",
    path: "Full Brand System",
    outcome: "The brand catches up with the quality already present in the business.",
    note: "Strategic audit, repositioning, identity refinement, and an implementation system for the next stage.",
    proof: "dr-haley-nutrition",
  },
] as const;

type SituationId = (typeof RECOGNITION_STATES)[number]["id"];

const LENSES = [
  {
    id: "notice",
    number: "01",
    label: "Psychology",
    verb: "Observe",
    question: "What did attention choose before logic arrived?",
    consequence: "Recognition begins where instinct already leans.",
    catches: "Assumptions disguised as insight and messaging that asks for trust before earning attention.",
    changes: "Positioning begins with observable behaviour rather than the founder's preferred description.",
    accent: "#9AA184",
  },
  {
    id: "name",
    number: "02",
    label: "Literature",
    verb: "Distil",
    question: "Which words survive after the explanation disappears?",
    consequence: "Language gives strategy a shape memory can keep.",
    catches: "Generic category phrases and a voice that changes whenever the channel changes.",
    changes: "The brand gains one verbal centre that can travel without becoming repetitive.",
    accent: "#B87458",
  },
  {
    id: "direct",
    number: "03",
    label: "Direction",
    verb: "Sequence",
    question: "What should the audience see, feel, and do next?",
    consequence: "Every asset becomes part of a believable journey.",
    catches: "Beautiful outputs with no sequence, tension, or commercial destination.",
    changes: "Every expression inherits a role in the journey rather than existing as an isolated deliverable.",
    accent: "#C6A97A",
  },
] as const;

type LensId = (typeof LENSES)[number]["id"];

const PATHS = [
  {
    id: "foundation",
    number: "01",
    title: "Build the foundation",
    body: "For a business still carrying several possible identities and no governing decision.",
    route: ["Question", "Position", "Build", "Launch"],
    outcome: "A brand people can understand before they are asked to buy.",
    href: "/services#desire",
    accent: "#8B6045",
  },
  {
    id: "reposition",
    number: "02",
    title: "Reposition the whole system",
    body: "For an existing brand whose offer, identity, and communication no longer point in one direction.",
    route: ["Decode", "Refuse", "Align", "Signal"],
    outcome: "Recognition compounds instead of restarting on every channel.",
    href: "/services#situation",
    accent: "#6C7D5A",
  },
  {
    id: "continuity",
    number: "03",
    title: "Keep the brand coherent in motion",
    body: "For a sound brand that needs ongoing content, judgement, and consistency across changing channels.",
    route: ["Plan", "Create", "Learn", "Compound"],
    outcome: "Every new piece strengthens the same meaning instead of adding another personality.",
    href: "/services#offerings",
    accent: "#B28B4D",
  },
] as const;

const TATVA_TRANSFORMATIONS: Record<
  Element["slug"],
  { verb: string; from: string; to: string; consequence: string }
> = {
  earth: {
    verb: "Anchor",
    from: "Assumptions scattered beneath the business",
    to: "One position every later decision can stand on",
    consequence: "Every campaign starts by renegotiating who the brand is.",
  },
  water: {
    verb: "Carry",
    from: "Touchpoints behaving like unrelated encounters",
    to: "One expectation flowing through the whole journey",
    consequence: "Every platform teaches the customer a different version of you.",
  },
  fire: {
    verb: "Distinguish",
    from: "Category-safe expression that earns no second look",
    to: "A recognisable signal strong enough to interrupt habit",
    consequence: "Clarity stays invisible and attention goes to the louder alternative.",
  },
  air: {
    verb: "Translate",
    from: "Strategy understood only inside the business",
    to: "Language customers can repeat after the brand leaves",
    consequence: "Five channels develop five personalities and memory never settles.",
  },
  space: {
    verb: "Compound",
    from: "Isolated moments of attention",
    to: "Recognition that accumulates across time",
    consequence: "Every launch pays again for awareness the last one failed to store.",
  },
};

function SmartVideo({
  src,
  poster,
  objectPosition = "center",
  className = "",
  priority = false,
}: {
  src?: string;
  poster: string;
  objectPosition?: string;
  className?: string;
  priority?: boolean;
}) {
  const ref = useRef<HTMLVideoElement>(null);
  const reduced = useHydratedReducedMotion();
  const near = useInView(ref, { margin: "320px 0px 320px 0px" });

  useEffect(() => {
    const video = ref.current;
    if (!video || reduced) return;
    if (near) void video.play().catch(() => {});
    else video.pause();
  }, [near, reduced, src]);

  if (!src || reduced) {
    return (
      <Image
        src={poster}
        alt=""
        fill
        priority={priority}
        sizes="100vw"
        className={`object-cover ${className}`}
        style={{ objectPosition }}
      />
    );
  }

  return (
    <video
      ref={ref}
      className={`h-full w-full object-cover ${className}`}
      style={{ objectPosition }}
      src={src}
      poster={poster}
      muted
      loop
      playsInline
      preload={priority ? "auto" : "metadata"}
    />
  );
}

function SiteProgress() {
  const reduced = useHydratedReducedMotion();
  const { scrollYProgress } = useScroll();
  const scaleY = useSpring(scrollYProgress, { stiffness: 130, damping: 28, mass: 0.22 });

  if (reduced) return null;

  return (
    <div className="pointer-events-none fixed right-5 top-1/2 z-40 hidden h-36 -translate-y-1/2 lg:block" aria-hidden="true">
      <div className="relative h-full w-px bg-soil/14 mix-blend-multiply">
        <motion.span className="absolute inset-0 origin-top bg-sandstone" style={{ scaleY }} />
      </div>
      <span className="absolute -left-4 -top-7 rotate-90 text-[0.52rem] uppercase tracking-[0.24em] text-soil/38">Journey</span>
    </div>
  );
}

function SceneDivider({ label, tone = "dark" }: { label: string; tone?: "dark" | "light" }) {
  return (
    <div
      className={`home-scene-divider relative isolate flex h-28 items-center overflow-hidden sm:h-36 ${
        tone === "dark" ? "bg-soil text-ivory" : "bg-[#ECE7DC] text-soil"
      }`}
      aria-hidden="true"
    >
      <div className="absolute inset-0 opacity-55 [background:radial-gradient(circle_at_50%_50%,rgba(198,169,122,.15),transparent_48%)]" />
      <div className="mx-auto flex w-full max-w-[92rem] items-center gap-5 px-6 sm:px-10 lg:px-14">
        <span className="home-divider-line h-px flex-1 bg-current/14" />
        <span className="text-[0.56rem] uppercase tracking-[0.32em] opacity-48">{label}</span>
        <span className="home-divider-line h-px flex-1 bg-current/14" />
      </div>
    </div>
  );
}

function HeroFilm() {
  const ref = useRef<HTMLElement>(null);
  const reduced = useHydratedReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end end"] });
  const cameraScale = useTransform(scrollYProgress, [0, 1], [1.03, 1.16]);
  const cameraY = useTransform(scrollYProgress, [0, 1], [0, -42]);
  const openingOpacity = useTransform(scrollYProgress, [0, 0.3, 0.58], [1, 1, 0.12]);
  const openingY = useTransform(scrollYProgress, [0, 0.58], [0, -68]);
  const questionOpacity = useTransform(scrollYProgress, [0, 0.34, 0.58, 1], [0, 0.15, 1, 1]);
  const questionY = useTransform(scrollYProgress, [0.34, 0.64], [56, 0]);
  const aperture = useTransform(
    scrollYProgress,
    [0, 0.52, 1],
    ["inset(0% 0% 0% 0% round 0px)", "inset(4% 5% 5% 5% round 30px)", "inset(10% 12% 11% 12% round 42px)"],
  );
  const lineScale = useTransform(scrollYProgress, [0, 1], [0, 1]);

  return (
    <section ref={ref} className={reduced ? "relative min-h-svh bg-soil" : "relative h-[175svh] bg-soil"}>
      <div className={reduced ? "relative min-h-svh overflow-hidden" : "sticky top-0 h-svh min-h-[640px] overflow-hidden"}>
        <motion.div
          className="absolute inset-0"
          style={reduced ? undefined : { scale: cameraScale, y: cameraY, clipPath: aperture }}
        >
          <SmartVideo
            src="/videos/hero-forest-sanctuary.mp4"
            poster="/images/hero-forest-sanctuary-poster.jpg"
            objectPosition="30% 40%"
            priority
          />
          <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(12,14,12,.24),rgba(18,16,13,.28)_42%,rgba(13,11,9,.86)_100%)]" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_24%,rgba(238,213,163,.18),transparent_34%)]" />
        </motion.div>

        {!reduced && <div className="home-light-sweep absolute -inset-y-24 left-[-30%] z-[1] w-[34%] rotate-[16deg] bg-gradient-to-b from-transparent via-[#f2d6a2]/18 to-transparent blur-3xl" aria-hidden="true" />}

        <motion.div
          className="absolute inset-0 z-10 flex flex-col items-center justify-end px-6 pb-20 text-center sm:pb-24"
          style={reduced ? undefined : { opacity: openingOpacity, y: openingY }}
        >
          <span className="inline-flex items-center gap-2 rounded-full border border-ivory/24 bg-soil/18 px-4 py-2 text-[0.62rem] font-medium uppercase tracking-[0.24em] text-ivory/88 backdrop-blur-md">
            <span className="h-1.5 w-1.5 rounded-full bg-sandstone shadow-[0_0_16px_rgba(198,169,122,.9)]" />
            Brand strategy for founders and existing businesses
          </span>
          <h1 className="mt-6 max-w-5xl text-balance font-display text-[clamp(3rem,7.6vw,7.8rem)] font-normal leading-[0.88] tracking-[-0.055em] text-ivory">
            Most brands are visible.
            <span className="block italic text-sandstone">Very few are remembered.</span>
          </h1>
          <p className="mt-7 max-w-2xl text-pretty text-sm leading-relaxed text-ivory/76 sm:text-base">
            Positioning, identity, voice, and market presence for businesses that need recognition to compound rather than restart.
          </p>
          <div className="mt-9 flex flex-wrap items-center justify-center gap-4">
            <LinkButton href="/contact" trackEvent="hero_booking_click" trackProps={{ page: "home" }}>
              Book a Brand Strategy Session
            </LinkButton>
            <LinkButton href="/work" variant="secondary" className="border-ivory/28 text-ivory hover:bg-ivory/10">
              Explore the Work
            </LinkButton>
          </div>
          <p className="mt-5 text-xs text-ivory/48 sm:text-sm">
            The same method that moved one client&apos;s engagement rate from 0.71% to 2.81% in eight weeks.
          </p>
        </motion.div>

        {!reduced && (
          <motion.div
            className="pointer-events-none absolute inset-0 z-20 flex items-center justify-center px-6 text-center"
            style={{ opacity: questionOpacity, y: questionY }}
          >
            <div className="max-w-4xl">
              <p className="text-[0.62rem] font-medium uppercase tracking-[0.32em] text-sandstone">The first clue</p>
              <p className="mt-6 font-display text-[clamp(3.2rem,8vw,8rem)] font-normal leading-[0.88] tracking-[-0.055em] text-ivory">
                What remains after the moment?
              </p>
              <p className="mx-auto mt-7 max-w-xl text-sm leading-relaxed text-ivory/64 sm:text-base">
                The answer is not in what people see first. It is in what their mind keeps carrying into the next encounter.
              </p>
            </div>
          </motion.div>
        )}

        {!reduced && (
          <div className="absolute inset-x-6 bottom-5 z-30 flex items-center gap-4 sm:inset-x-10 lg:inset-x-16">
            <span className="text-[0.54rem] uppercase tracking-[0.22em] text-ivory/38">Attention</span>
            <div className="h-px flex-1 bg-ivory/12"><motion.div className="h-full origin-left bg-sandstone" style={{ scaleX: lineScale }} /></div>
            <span className="text-[0.54rem] uppercase tracking-[0.22em] text-ivory/38">Memory</span>
          </div>
        )}
      </div>
    </section>
  );
}

function RecognitionChapter() {
  const [selected, setSelected] = useState<SituationId>("idea");

  useEffect(() => {
    try {
      const saved = window.localStorage.getItem(SITUATION_KEY) as SituationId | null;
      if (saved && RECOGNITION_STATES.some((state) => state.id === saved)) setSelected(saved);
    } catch {}
  }, []);

  const active = RECOGNITION_STATES.find((state) => state.id === selected) ?? RECOGNITION_STATES[0];

  function choose(id: SituationId) {
    setSelected(id);
    try {
      window.localStorage.setItem(SITUATION_KEY, id);
    } catch {}
    track("visitor_situation_selected", { situation: id, page: "home" });
  }

  return (
    <section className="relative overflow-hidden bg-soil py-24 text-ivory sm:py-32 lg:py-40">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_18%_18%,rgba(184,90,52,.18),transparent_30%),radial-gradient(circle_at_82%_72%,rgba(198,169,122,.12),transparent_34%),linear-gradient(145deg,#17130f,#27211b_54%,#12100d)]" />
      <Container className="relative z-10 max-w-[92rem]">
        <div className="home-reveal grid gap-9 lg:grid-cols-[0.82fr_1.18fr] lg:items-end">
          <div>
            <p className="text-[0.62rem] font-medium uppercase tracking-[0.3em] text-sandstone">Recognition arrives before explanation</p>
            <h2 className="mt-5 max-w-3xl font-display text-[clamp(3.1rem,7vw,7rem)] font-normal leading-[0.9] tracking-[-0.05em]">
              Which sentence feels a little <span className="italic text-clay">too familiar?</span>
            </h2>
          </div>
          <p className="max-w-xl text-sm leading-relaxed text-ivory/66 sm:text-base lg:justify-self-end">
            Choose the line that catches first. The page remembers the answer and carries it into the service route below.
          </p>
        </div>

        <div className="mt-12 grid gap-4 lg:grid-cols-3">
          {RECOGNITION_STATES.map((state, index) => {
            const isActive = state.id === selected;
            return (
              <motion.button
                key={state.id}
                type="button"
                aria-pressed={isActive}
                onClick={() => choose(state.id)}
                className={`home-reveal group relative min-h-[19rem] overflow-hidden rounded-[1.75rem] border p-6 text-left transition-colors duration-500 sm:p-7 ${
                  isActive ? "border-sandstone/68 bg-black/32" : "border-ivory/12 bg-black/16 hover:border-ivory/34"
                }`}
                style={{ animationDelay: `${index * 70}ms` }}
                whileHover={{ y: -8 }}
                whileTap={{ scale: 0.985 }}
                transition={{ duration: 0.45, ease: EASE }}
              >
                <motion.span
                  className="absolute inset-x-0 top-0 h-[2px] origin-left bg-sandstone"
                  animate={{ scaleX: isActive ? 1 : 0.08 }}
                  transition={{ duration: 0.65, ease: EASE }}
                />
                <span className="text-[0.58rem] uppercase tracking-[0.23em] text-sandstone/68">{state.number} · {state.stage}</span>
                <span className="mt-7 block font-display text-[clamp(2rem,3vw,3.4rem)] leading-[1.02] tracking-[-0.035em] text-ivory">
                  “{state.label}”
                </span>
                <span className="absolute bottom-6 left-6 right-6 flex items-center justify-between text-[0.58rem] uppercase tracking-[0.18em] text-ivory/38 sm:left-7 sm:right-7">
                  <span>{isActive ? "Selected" : "Choose"}</span>
                  <span className="transition-transform duration-500 group-hover:translate-x-1">→</span>
                </span>
              </motion.button>
            );
          })}
        </div>

        <div className="home-reveal mt-6 overflow-hidden rounded-[1.8rem] border border-ivory/14 bg-[#15120f]/82 p-6 shadow-2xl backdrop-blur-xl sm:p-8">
          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              key={active.id}
              initial={{ opacity: 0.35, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0.35, y: -14 }}
              transition={{ duration: 0.5, ease: EASE }}
              className="grid gap-7 lg:grid-cols-[0.82fr_1.18fr_auto] lg:items-end"
            >
              <div>
                <p className="text-[0.58rem] uppercase tracking-[0.23em] text-ivory/38">The likely gap</p>
                <p className="mt-2 font-display text-3xl text-ivory sm:text-4xl">{active.path}</p>
                <p className="mt-3 text-sm leading-relaxed text-ivory/62">{active.symptom}</p>
              </div>
              <div>
                <p className="text-[0.58rem] uppercase tracking-[0.23em] text-ivory/38">What changes</p>
                <p className="mt-2 font-display text-2xl leading-tight text-ivory/92 sm:text-3xl">{active.outcome}</p>
                <p className="mt-3 text-sm leading-relaxed text-ivory/48">{active.note}</p>
              </div>
              <div className="flex flex-col gap-3">
                <Link href={`/work/${active.proof}`} className="inline-flex min-h-11 items-center justify-center rounded-full bg-sandstone px-5 text-xs font-medium uppercase tracking-[0.14em] text-soil transition-transform hover:-translate-y-0.5">
                  See the proof ↗
                </Link>
                <Link href="/services" className="inline-flex min-h-11 items-center justify-center rounded-full border border-ivory/20 px-5 text-xs font-medium uppercase tracking-[0.14em] text-ivory/78 transition-colors hover:border-ivory/48 hover:text-ivory">
                  Trace the path →
                </Link>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </Container>
    </section>
  );
}

function EvidenceChapter() {
  const featured = useMemo(() => projects.filter((project) => project.featured).slice(0, 3), []);

  return (
    <section className="relative overflow-hidden bg-[#ECE7DC] py-24 text-soil sm:py-32 lg:py-40">
      <Container className="max-w-[92rem]">
        <div className="home-reveal grid gap-9 lg:grid-cols-[0.85fr_1.15fr] lg:items-end">
          <div>
            <p className="text-[0.62rem] font-medium uppercase tracking-[0.3em] text-soil/46">Proof before promise</p>
            <h2 className="mt-5 max-w-3xl font-display text-[clamp(3rem,7vw,7rem)] font-normal leading-[0.9] tracking-[-0.05em]">
              The result is the last thing you should look at.
            </h2>
          </div>
          <p className="max-w-xl text-sm leading-relaxed text-soil/62 sm:text-base lg:justify-self-end">
            Each case opens with the visible problem, then reveals the diagnosis, decision, application, and only then the outcome.
          </p>
        </div>

        <div className="mt-12 grid gap-5 lg:grid-cols-3">
          {featured.map((project, index) => {
            const stat = project.stats?.[0];
            return (
              <motion.article
                key={project.slug}
                className="home-reveal group relative min-h-[38rem] overflow-hidden rounded-[1.9rem] bg-soil text-ivory shadow-[0_24px_80px_-36px_rgba(39,34,30,.5)]"
                style={{ animationDelay: `${index * 80}ms` }}
                whileHover={{ y: -10 }}
                transition={{ duration: 0.5, ease: EASE }}
              >
                {project.cardImage && (
                  <motion.div className="absolute inset-0" whileHover={{ scale: 1.055 }} transition={{ duration: 1.1, ease: EASE }}>
                    <Image
                      src={project.cardImage}
                      alt=""
                      fill
                      sizes="(min-width: 1024px) 33vw, 100vw"
                      className="object-cover"
                      style={{ objectPosition: project.cardImagePosition ?? "center" }}
                    />
                  </motion.div>
                )}
                <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(18,15,13,.12),rgba(18,15,13,.24)_38%,rgba(18,15,13,.94)_100%)]" />
                <div className="relative z-10 flex min-h-[38rem] flex-col justify-between p-6 sm:p-7">
                  <div className="flex items-center justify-between text-[0.58rem] uppercase tracking-[0.22em] text-ivory/56">
                    <span>Case {String(index + 1).padStart(2, "0")}</span>
                    <span>{project.industry}</span>
                  </div>
                  <div>
                    {stat && (
                      <div className="mb-5 inline-flex items-end gap-3 rounded-full border border-ivory/16 bg-black/22 px-4 py-2 backdrop-blur-md">
                        <span className="font-display text-3xl text-sandstone">{stat.value}</span>
                        <span className="max-w-36 text-[0.58rem] leading-tight text-ivory/58">{stat.label}</span>
                      </div>
                    )}
                    <h3 className="font-display text-[clamp(2.7rem,5vw,5rem)] font-normal leading-[0.9] tracking-[-0.045em]">{project.title}</h3>
                    <p className="mt-5 line-clamp-4 text-sm leading-relaxed text-ivory/68">{project.hook ?? project.challenge}</p>
                    <Link href={`/work/${project.slug}`} className="mt-7 inline-flex items-center gap-2 text-xs font-medium uppercase tracking-[0.18em] text-sandstone transition-colors hover:text-ivory">
                      Open the investigation <span className="transition-transform duration-300 group-hover:translate-x-1">↗</span>
                    </Link>
                  </div>
                </div>
              </motion.article>
            );
          })}
        </div>
      </Container>
    </section>
  );
}

function LensDiagram({ kind, accent }: { kind: LensId; accent: string }) {
  if (kind === "notice") {
    return (
      <svg viewBox="0 0 320 220" className="h-full w-full" aria-hidden="true">
        {[42, 72, 102].map((radius, index) => (
          <motion.circle
            key={radius}
            cx="160"
            cy="110"
            r={radius}
            fill="none"
            stroke={accent}
            strokeOpacity={0.18 + index * 0.1}
            initial={{ pathLength: 0.18, rotate: -18 }}
            whileInView={{ pathLength: 1, rotate: 18 }}
            viewport={{ amount: 0.4 }}
            transition={{ duration: 1.4 + index * 0.16, ease: EASE }}
          />
        ))}
        <motion.circle cx="160" cy="110" r="8" fill={accent} initial={{ scale: 0.6 }} whileInView={{ scale: [0.6, 1.5, 1] }} viewport={{ amount: 0.4 }} transition={{ duration: 1.2, ease: EASE }} />
      </svg>
    );
  }

  if (kind === "name") {
    return (
      <svg viewBox="0 0 320 220" className="h-full w-full" aria-hidden="true">
        {[0, 1, 2, 3, 4].map((index) => (
          <motion.line
            key={index}
            x1={36 + index * 18}
            y1={48 + index * 28}
            x2={284 - index * 22}
            y2={48 + index * 28}
            stroke={accent}
            strokeWidth={index === 2 ? 5 : 2}
            strokeLinecap="round"
            initial={{ pathLength: 0.08, opacity: 0.18 }}
            whileInView={{ pathLength: 1, opacity: 0.78 }}
            viewport={{ amount: 0.4 }}
            transition={{ duration: 1, delay: index * 0.09, ease: EASE }}
          />
        ))}
        <motion.circle cx="160" cy="110" r="30" fill="none" stroke={accent} strokeWidth="2" initial={{ scale: 1.6, opacity: 0 }} whileInView={{ scale: 1, opacity: 0.7 }} viewport={{ amount: 0.4 }} transition={{ duration: 1.2, ease: EASE }} />
      </svg>
    );
  }

  return (
    <svg viewBox="0 0 320 220" className="h-full w-full" aria-hidden="true">
      <motion.path d="M30 172 C96 172 88 54 158 54 C224 54 216 172 290 172" fill="none" stroke={accent} strokeWidth="3" strokeLinecap="round" initial={{ pathLength: 0.06 }} whileInView={{ pathLength: 1 }} viewport={{ amount: 0.4 }} transition={{ duration: 1.65, ease: EASE }} />
      {[30, 94, 158, 226, 290].map((x, index) => (
        <motion.circle key={x} cx={x} cy={index % 2 === 0 ? 172 : 78} r="7" fill={accent} initial={{ scale: 0 }} whileInView={{ scale: 1 }} viewport={{ amount: 0.4 }} transition={{ delay: 0.2 + index * 0.14, duration: 0.45, ease: EASE }} />
      ))}
    </svg>
  );
}

function ThinkingChapter() {
  return (
    <section className="relative overflow-hidden bg-soil py-24 text-ivory sm:py-32 lg:py-40">
      <div className="absolute inset-0 opacity-70 [background:radial-gradient(circle_at_52%_14%,rgba(198,169,122,.11),transparent_34%)]" />
      <Container className="relative max-w-[92rem]">
        <div className="home-reveal mx-auto max-w-5xl text-center">
          <p className="text-[0.62rem] font-medium uppercase tracking-[0.3em] text-sandstone">Behind the evidence</p>
          <h2 className="mt-5 font-display text-[clamp(3rem,7vw,7rem)] font-normal leading-[0.9] tracking-[-0.05em]">
            Observe widely. <span className="italic text-clay">Decide narrowly.</span>
          </h2>
          <p className="mx-auto mt-7 max-w-2xl text-sm leading-relaxed text-ivory/64 sm:text-base">
            The site borrows from the best scrollytelling work without copying its spectacle: every movement advances one idea, and every diagram survives without motion.
          </p>
        </div>

        <div className="relative mt-14 grid gap-5 lg:grid-cols-3">
          <div className="pointer-events-none absolute left-[16.6%] right-[16.6%] top-[10rem] hidden h-px bg-gradient-to-r from-transparent via-sandstone/28 to-transparent lg:block" aria-hidden="true" />
          {LENSES.map((lens, index) => (
            <motion.article
              key={lens.id}
              className="home-reveal relative overflow-hidden rounded-[1.8rem] border border-ivory/12 bg-black/20 p-6 backdrop-blur-md sm:p-7"
              style={{ animationDelay: `${index * 90}ms` }}
              whileHover={{ y: -8, borderColor: "rgba(244,239,230,.28)" }}
              transition={{ duration: 0.45, ease: EASE }}
            >
              <div className="h-48 rounded-[1.35rem] border border-ivory/8 bg-black/12 p-4">
                <LensDiagram kind={lens.id} accent={lens.accent} />
              </div>
              <p className="mt-7 text-[0.58rem] font-medium uppercase tracking-[0.24em]" style={{ color: lens.accent }}>
                Lens {lens.number} · {lens.label}
              </p>
              <h3 className="mt-4 font-display text-4xl leading-none text-ivory sm:text-5xl">{lens.verb}.</h3>
              <p className="mt-5 font-display text-2xl leading-tight text-ivory/92">{lens.question}</p>
              <p className="mt-5 text-sm leading-relaxed text-ivory/58">{lens.consequence}</p>
            </motion.article>
          ))}
        </div>
      </Container>
    </section>
  );
}

function AuthorChapter() {
  const [activeId, setActiveId] = useState<LensId>("notice");
  const active = LENSES.find((lens) => lens.id === activeId) ?? LENSES[0];
  const featuredCredentials = credentials.filter((credential) => credential.featured);

  function choose(id: LensId) {
    setActiveId(id);
  }

  return (
    <section className="relative isolate min-h-[110svh] overflow-hidden bg-[#151411] text-ivory">
      <div className="absolute inset-0">
        <Image
          src="/images/own-portrait.jpg"
          alt="Suman Sharma, founder of Branding Tatva"
          fill
          sizes="100vw"
          className="object-cover"
          style={{ objectPosition: "center 28%" }}
        />
      </div>
      <motion.div className="absolute inset-[-4%] bg-[radial-gradient(circle_at_68%_34%,rgba(239,217,178,.18),transparent_28%)]" animate={{ scale: [1, 1.08, 1], x: [0, -18, 0] }} transition={{ duration: 16, repeat: Infinity, ease: "easeInOut" }} />
      <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(16,14,12,.95)_0%,rgba(16,14,12,.72)_44%,rgba(16,14,12,.28)_70%,rgba(16,14,12,.74)_100%)]" />
      <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(16,14,12,.24),transparent_48%,rgba(16,14,12,.88))]" />

      <Container className="relative z-10 flex min-h-[110svh] max-w-[92rem] flex-col justify-between py-24 sm:py-28 lg:py-32">
        <div className="home-reveal max-w-5xl">
          <p className="text-[0.62rem] font-medium uppercase tracking-[0.3em] text-sandstone">The author behind the system</p>
          <h2 className="mt-5 font-display text-[clamp(3.4rem,8vw,8.6rem)] font-normal leading-[0.86] tracking-[-0.055em]">
            I study attention before I design <span className="italic text-sandstone">expression.</span>
          </h2>
          <p className="mt-7 max-w-2xl text-sm leading-relaxed text-ivory/70 sm:text-base">
            Psychology reads behaviour. Literature gives meaning a voice. Direction decides what the audience should experience next.
          </p>
        </div>

        <div className="mt-16 grid gap-10 lg:grid-cols-[1.1fr_.9fr] lg:items-end">
          <div className="relative min-h-[20rem] overflow-hidden rounded-[1.8rem] border border-ivory/12 bg-black/24 p-6 backdrop-blur-lg sm:p-8">
            <AnimatePresence mode="wait" initial={false}>
              <motion.div key={active.id} initial={{ opacity: 0.28, y: 30 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0.28, y: -22 }} transition={{ duration: 0.58, ease: EASE }}>
                <p className="text-[0.6rem] font-medium uppercase tracking-[0.26em]" style={{ color: active.accent }}>
                  {active.number} · {active.label}
                </p>
                <p className="mt-4 font-display text-[clamp(4.5rem,10vw,10rem)] font-normal leading-[0.78] tracking-[-0.06em]">{active.verb}.</p>
                <p className="mt-8 max-w-3xl font-display text-[clamp(1.8rem,3.4vw,3.5rem)] leading-[1.05] text-ivory/92">{active.question}</p>
              </motion.div>
            </AnimatePresence>
          </div>

          <div>
            <AnimatePresence mode="wait" initial={false}>
              <motion.div key={`${active.id}-reading`} initial={{ opacity: 0.28, x: 28 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0.28, x: -18 }} transition={{ duration: 0.48, ease: EASE }} className="space-y-7">
                <div>
                  <p className="text-[0.58rem] uppercase tracking-[0.22em] text-ivory/40">The blind spot it catches</p>
                  <p className="mt-3 text-sm leading-relaxed text-ivory/72 sm:text-base">{active.catches}</p>
                </div>
                <div>
                  <p className="text-[0.58rem] uppercase tracking-[0.22em] text-ivory/40">The decision it changes</p>
                  <p className="mt-3 text-sm leading-relaxed text-ivory/72 sm:text-base">{active.changes}</p>
                </div>
              </motion.div>
            </AnimatePresence>

            <div className="mt-9 flex flex-wrap gap-2" role="tablist" aria-label="Choose a working lens">
              {LENSES.map((lens) => (
                <button
                  key={lens.id}
                  type="button"
                  role="tab"
                  aria-selected={active.id === lens.id}
                  onClick={() => choose(lens.id)}
                  className={`min-h-11 rounded-full border px-5 text-[0.6rem] font-medium uppercase tracking-[0.16em] transition-all duration-300 ${
                    active.id === lens.id
                      ? "border-sandstone bg-sandstone text-soil"
                      : "border-ivory/20 bg-black/12 text-ivory/62 hover:border-ivory/48 hover:text-ivory"
                  }`}
                >
                  {lens.id === "notice" ? "Notice" : lens.id === "name" ? "Name" : "Direct"}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-14 flex flex-col gap-5 border-t border-ivory/14 pt-6 sm:flex-row sm:items-end sm:justify-between">
          <div className="flex max-w-3xl flex-wrap gap-x-5 gap-y-2 text-[0.56rem] uppercase tracking-[0.16em] text-ivory/42">
            {featuredCredentials.map((credential) => (
              <span key={credential.label}>{credential.label} · {credential.detail}</span>
            ))}
          </div>
          <Link href="/about" className="shrink-0 text-xs font-medium uppercase tracking-[0.18em] text-sandstone transition-colors hover:text-ivory">
            Read the full practice ↗
          </Link>
        </div>
      </Container>
    </section>
  );
}

function PathDiagram({ index, accent }: { index: number; accent: string }) {
  const paths = [
    "M18 126 C76 126 64 48 126 48 C188 48 178 126 238 126",
    "M18 60 C72 60 70 138 126 138 C184 138 182 60 238 60",
    "M18 110 C62 40 104 176 146 94 C180 28 204 156 238 86",
  ];
  return (
    <svg viewBox="0 0 256 184" className="h-full w-full" aria-hidden="true">
      <motion.path d={paths[index]} fill="none" stroke={accent} strokeWidth="3" strokeLinecap="round" initial={{ pathLength: 0.08 }} whileInView={{ pathLength: 1 }} viewport={{ amount: 0.45 }} transition={{ duration: 1.4, ease: EASE }} />
      {[0, 1, 2, 3].map((node) => (
        <motion.circle key={node} cx={30 + node * 64} cy={index === 1 ? (node % 2 ? 128 : 68) : index === 2 ? (node % 2 ? 56 : 116) : (node % 2 ? 54 : 126)} r="7" fill={accent} initial={{ scale: 0 }} whileInView={{ scale: 1 }} viewport={{ amount: 0.45 }} transition={{ delay: 0.18 + node * 0.13, duration: 0.42, ease: EASE }} />
      ))}
    </svg>
  );
}

function PathsChapter() {
  const [recommended, setRecommended] = useState(1);

  useEffect(() => {
    try {
      const situation = window.localStorage.getItem(SITUATION_KEY);
      setRecommended(situation === "idea" ? 0 : situation === "inconsistent" || situation === "outgrown" ? 1 : 1);
    } catch {}
  }, []);

  return (
    <section className="relative overflow-hidden bg-[#ECE7DC] py-24 text-soil sm:py-32 lg:py-40">
      <div className="absolute left-1/2 top-1/2 h-[72vw] w-[72vw] max-h-[68rem] max-w-[68rem] -translate-x-1/2 -translate-y-1/2 rounded-full border border-soil/7" aria-hidden="true" />
      <Container className="relative max-w-[92rem]">
        <div className="home-reveal grid gap-9 lg:grid-cols-[0.82fr_1.18fr] lg:items-end">
          <div>
            <p className="text-[0.62rem] font-medium uppercase tracking-[0.3em] text-soil/46">Three ways into the work</p>
            <h2 className="mt-5 max-w-3xl font-display text-[clamp(3rem,7vw,7rem)] font-normal leading-[0.9] tracking-[-0.05em]">
              The right scope begins where the signal breaks.
            </h2>
          </div>
          <p className="max-w-xl text-sm leading-relaxed text-soil/60 sm:text-base lg:justify-self-end">
            Each route turns a different kind of uncertainty into a sequence of decisions. Your earlier answer quietly recommends one.
          </p>
        </div>

        <div className="mt-12 grid gap-5 lg:grid-cols-3">
          {PATHS.map((path, index) => (
            <motion.article
              key={path.id}
              className={`home-reveal group relative overflow-hidden rounded-[1.85rem] border bg-white/28 p-6 backdrop-blur-md sm:p-7 ${
                index === recommended ? "border-soil/24 shadow-[0_22px_70px_-40px_rgba(39,34,30,.45)]" : "border-soil/12"
              }`}
              style={{ animationDelay: `${index * 90}ms` }}
              whileHover={{ y: -9, backgroundColor: "rgba(255,255,255,.5)" }}
              transition={{ duration: 0.48, ease: EASE }}
            >
              <div className="flex items-center justify-between">
                <span className="text-[0.58rem] uppercase tracking-[0.22em] text-soil/42">Route {path.number}</span>
                {index === recommended && <span className="rounded-full border border-soil/12 bg-white/38 px-3 py-1 text-[0.52rem] uppercase tracking-[0.16em]" style={{ color: path.accent }}>Suggested</span>}
              </div>
              <div className="mt-6 h-44 rounded-[1.35rem] border border-soil/8 bg-white/28 p-4">
                <PathDiagram index={index} accent={path.accent} />
              </div>
              <h3 className="mt-7 font-display text-[clamp(2.5rem,4.5vw,4.6rem)] font-normal leading-[0.92] tracking-[-0.045em]">{path.title}</h3>
              <p className="mt-5 text-sm leading-relaxed text-soil/60">{path.body}</p>
              <div className="mt-7 flex flex-wrap gap-2">
                {path.route.map((step, stepIndex) => (
                  <span key={step} className="inline-flex items-center gap-2 rounded-full border border-soil/10 bg-white/32 px-3 py-2 text-[0.55rem] uppercase tracking-[0.14em] text-soil/54">
                    <span style={{ color: path.accent }}>{String(stepIndex + 1).padStart(2, "0")}</span>{step}
                  </span>
                ))}
              </div>
              <p className="mt-7 border-t border-soil/10 pt-6 font-display text-2xl leading-tight">{path.outcome}</p>
              <Link
                href={path.href}
                onClick={() => track("service_path_opened", { path: path.id, recommended: index === recommended, page: "home" })}
                className="mt-7 inline-flex min-h-11 items-center gap-3 rounded-full border border-soil/16 bg-white/32 px-5 text-xs font-medium uppercase tracking-[0.16em] transition-all hover:bg-white/70"
              >
                Enter this route <span className="transition-transform duration-300 group-hover:translate-x-1">→</span>
              </Link>
            </motion.article>
          ))}
        </div>
      </Container>
    </section>
  );
}

function TatvaDiagram({ slug, color }: { slug: Element["slug"]; color: string }) {
  if (slug === "earth") {
    return (
      <div className="relative h-full w-full" aria-hidden="true">
        {[0, 1, 2, 3].map((index) => (
          <motion.div key={index} className="absolute inset-x-[10%] rounded-[50%] border" style={{ bottom: `${12 + index * 18}%`, height: "36%", borderColor: `${color}${42 + index * 10}` }} initial={{ y: 60, scaleX: 1.3 }} animate={{ y: 0, scaleX: 1 }} transition={{ duration: 0.9, delay: index * 0.08, ease: EASE }} />
        ))}
        <motion.div className="absolute bottom-[12%] left-1/2 top-[14%] w-px" style={{ backgroundColor: color }} initial={{ scaleY: 0 }} animate={{ scaleY: 1 }} transition={{ duration: 1.1, ease: EASE }} />
      </div>
    );
  }
  if (slug === "water") {
    return (
      <div className="relative h-full w-full overflow-hidden" aria-hidden="true">
        {[0, 1, 2, 3].map((index) => (
          <motion.div key={index} className="absolute left-[-14%] w-[128%] rounded-[50%] border" style={{ top: `${16 + index * 20}%`, height: "28%", borderColor: `${color}${56 - index * 7}` }} animate={{ x: index % 2 ? [30, -24, 30] : [-28, 24, -28] }} transition={{ duration: 8 + index, repeat: Infinity, ease: "easeInOut" }} />
        ))}
      </div>
    );
  }
  if (slug === "fire") {
    return (
      <motion.div className="relative mx-auto h-full max-h-[26rem] w-full max-w-[26rem]" aria-hidden="true" animate={{ rotate: [-4, 4, -4], scale: [0.96, 1.04, 0.96] }} transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}>
        {[0, 1, 2, 3, 4].map((index) => (
          <span key={index} className="absolute left-1/2 top-1/2 h-[58%] w-[18%] origin-bottom -translate-x-1/2 -translate-y-full rounded-[50%_50%_35%_35%] border" style={{ rotate: `${index * 72}deg`, borderColor: `${color}${34 + index * 9}` }} />
        ))}
      </motion.div>
    );
  }
  if (slug === "air") {
    return (
      <motion.div className="relative h-full w-full" aria-hidden="true" animate={{ y: [30, -24, 30] }} transition={{ duration: 9, repeat: Infinity, ease: "easeInOut" }}>
        {[14, 30, 48, 67, 82].map((top, index) => (
          <span key={top} className="absolute h-px rounded-full" style={{ top: `${top}%`, left: `${7 + index * 7}%`, width: `${58 + index * 5}%`, background: `linear-gradient(90deg,transparent,${color}AA,transparent)` }} />
        ))}
      </motion.div>
    );
  }
  return (
    <motion.div className="relative mx-auto h-full max-h-[28rem] w-full max-w-[28rem]" aria-hidden="true" animate={{ rotate: 360 }} transition={{ duration: 42, repeat: Infinity, ease: "linear" }}>
      {[18, 31, 46, 64, 82].map((size, index) => (
        <span key={size} className="absolute left-1/2 top-1/2 rounded-full border" style={{ width: `${size}%`, height: `${size}%`, transform: "translate(-50%,-50%)", borderColor: `${color}${28 + index * 10}` }} />
      ))}
      <span className="absolute left-1/2 top-1/2 h-3 w-3 -translate-x-1/2 -translate-y-1/2 rounded-full" style={{ backgroundColor: color, boxShadow: `0 0 48px ${color}` }} />
    </motion.div>
  );
}

function TatvaSequence() {
  const ref = useRef<HTMLElement>(null);
  const reduced = useHydratedReducedMotion();
  const compact = useMediaQuery("(max-width: 767px)");
  const [activeIndex, setActiveIndex] = useState(0);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end end"] });

  useMotionValueEvent(scrollYProgress, "change", (value) => {
    if (reduced || compact) return;
    setActiveIndex(Math.min(elements.length - 1, Math.floor(Math.min(0.999, value) * elements.length)));
  });

  if (reduced || compact) {
    return (
      <section className="bg-soil py-24 text-ivory sm:py-32">
        <Container className="max-w-[92rem]">
          <div className="home-reveal max-w-4xl">
            <p className="text-[0.62rem] font-medium uppercase tracking-[0.3em] text-sandstone">The five Tatvas</p>
            <h2 className="mt-5 font-display text-[clamp(3rem,7vw,6.8rem)] font-normal leading-[0.9] tracking-[-0.05em]">Five decisions. One remembered brand.</h2>
          </div>
          <div className="mt-12 space-y-6">
            {elements.map((element, index) => {
              const transformation = TATVA_TRANSFORMATIONS[element.slug];
              return (
                <article key={element.slug} className="home-reveal relative overflow-hidden rounded-[1.8rem] border border-ivory/12 bg-black/18 p-6 sm:p-8">
                  <div className="absolute inset-0 opacity-24">
                    <Image src={element.image} alt="" fill sizes="100vw" className="object-cover" style={{ objectPosition: element.imagePosition ?? "center" }} />
                  </div>
                  <div className="absolute inset-0 bg-[linear-gradient(110deg,rgba(18,15,13,.94),rgba(18,15,13,.64)_60%,rgba(18,15,13,.82))]" />
                  <div className="relative z-10 grid gap-8 sm:grid-cols-[0.85fr_1.15fr] sm:items-center">
                    <div>
                      <p className="text-[0.58rem] uppercase tracking-[0.24em]" style={{ color: element.color }}>Tatva {String(index + 1).padStart(2, "0")} · {transformation.verb}</p>
                      <h3 className="mt-4 font-display text-5xl leading-none" style={{ color: element.color }}>{element.name.split(" · ")[0]}.</h3>
                      <p className="mt-5 text-sm leading-relaxed text-ivory/68">{element.meaning}</p>
                    </div>
                    <div className="grid gap-5">
                      <div><p className="text-[0.56rem] uppercase tracking-[0.2em] text-ivory/38">Before</p><p className="mt-2 font-display text-2xl leading-tight text-ivory/62">{transformation.from}</p></div>
                      <div><p className="text-[0.56rem] uppercase tracking-[0.2em]" style={{ color: element.color }}>After</p><p className="mt-2 font-display text-2xl leading-tight text-ivory">{transformation.to}</p></div>
                      <p className="border-t border-ivory/10 pt-4 text-xs leading-relaxed text-ivory/52"><span className="text-ivory/82">Without {element.name.split(" · ")[0]}:</span> {transformation.consequence}</p>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        </Container>
      </section>
    );
  }

  const active = elements[activeIndex];
  const transformation = TATVA_TRANSFORMATIONS[active.slug];

  return (
    <section ref={ref} className="relative h-[400svh] bg-soil text-ivory">
      <div className="sticky top-0 h-svh min-h-[660px] overflow-hidden">
        <AnimatePresence mode="popLayout" initial={false}>
          <motion.div key={active.slug} className="absolute inset-0" initial={{ opacity: 0.22, scale: 1.08 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0.18, scale: 1.04 }} transition={{ duration: 0.8, ease: EASE }}>
            <SmartVideo src={active.video} poster={active.image} objectPosition={active.imagePosition ?? "center"} />
          </motion.div>
        </AnimatePresence>
        <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(14,12,10,.9)_0%,rgba(14,12,10,.58)_48%,rgba(14,12,10,.34)_72%,rgba(14,12,10,.78)_100%)]" />
        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(14,12,10,.46),transparent_42%,rgba(14,12,10,.82))]" />

        <div className="absolute inset-x-6 top-7 z-30 flex items-center justify-between text-[0.56rem] uppercase tracking-[0.24em] text-ivory/48 sm:inset-x-10 lg:inset-x-16">
          <span>The five Tatvas</span>
          <span>{String(activeIndex + 1).padStart(2, "0")} / 05</span>
        </div>

        <Container className="relative z-10 flex h-full max-w-[92rem] items-center">
          <div className="grid w-full gap-10 lg:grid-cols-[0.92fr_1.08fr] lg:items-center lg:gap-16">
            <AnimatePresence mode="wait" initial={false}>
              <motion.div key={`${active.slug}-copy`} initial={{ opacity: 0.26, y: 38 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0.24, y: -26 }} transition={{ duration: 0.62, ease: EASE }}>
                <p className="text-[0.6rem] font-medium uppercase tracking-[0.3em]" style={{ color: active.color }}>{transformation.verb}</p>
                <h2 className="mt-5 font-display text-[clamp(4.5rem,10vw,10.5rem)] font-normal leading-[0.78] tracking-[-0.07em]" style={{ color: active.color }}>
                  {active.name.split(" · ")[0].toLowerCase()}.
                </h2>
                <p className="mt-8 max-w-xl font-display text-[clamp(2rem,3.8vw,4rem)] leading-[1.02] text-ivory">{active.poetic}</p>
                <p className="mt-6 max-w-xl text-sm leading-relaxed text-ivory/64 sm:text-base">{active.meaning}</p>
              </motion.div>
            </AnimatePresence>

            <div className="grid gap-8 lg:grid-cols-[1fr_.9fr] lg:items-center">
              <div className="relative h-[18rem] overflow-hidden rounded-[1.8rem] border border-ivory/12 bg-black/18 p-5 backdrop-blur-md sm:h-[24rem]">
                <AnimatePresence mode="wait" initial={false}>
                  <motion.div key={`${active.slug}-diagram`} className="h-full w-full" initial={{ opacity: 0.22, scale: 0.92 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0.22, scale: 1.06 }} transition={{ duration: 0.65, ease: EASE }}>
                    <TatvaDiagram slug={active.slug} color={active.color} />
                  </motion.div>
                </AnimatePresence>
              </div>
              <AnimatePresence mode="wait" initial={false}>
                <motion.div key={`${active.slug}-change`} initial={{ opacity: 0.24, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0.22, x: -18 }} transition={{ duration: 0.52, ease: EASE }} className="space-y-7">
                  <div><p className="text-[0.56rem] uppercase tracking-[0.2em] text-ivory/38">Before</p><p className="mt-3 font-display text-3xl leading-tight text-ivory/62">{transformation.from}</p></div>
                  <div><p className="text-[0.56rem] uppercase tracking-[0.2em]" style={{ color: active.color }}>After</p><p className="mt-3 font-display text-3xl leading-tight text-ivory">{transformation.to}</p></div>
                  <p className="border-t border-ivory/12 pt-5 text-xs leading-relaxed text-ivory/52"><span className="text-ivory/82">Without {active.name.split(" · ")[0]}:</span> {transformation.consequence}</p>
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        </Container>

        <div className="absolute inset-x-6 bottom-7 z-30 sm:inset-x-10 lg:inset-x-16">
          <div className="mb-4 flex items-center justify-between gap-3">
            {elements.map((element, index) => (
              <span key={element.slug} className={`text-[0.52rem] uppercase tracking-[0.14em] transition-opacity duration-300 ${index === activeIndex ? "opacity-100" : "opacity-28"}`} style={{ color: index === activeIndex ? element.color : undefined }}>
                {String(index + 1).padStart(2, "0")} {element.name.split(" · ")[0]}
              </span>
            ))}
          </div>
          <div className="h-px bg-ivory/12"><motion.div className="h-full origin-left bg-sandstone" style={{ scaleX: scrollYProgress }} /></div>
        </div>
      </div>
    </section>
  );
}

function ProcessChapter() {
  return (
    <section className="relative overflow-hidden bg-[#100e0c] py-24 text-ivory sm:py-32 lg:py-40">
      <div className="absolute left-1/2 top-0 h-full w-px -translate-x-1/2 bg-gradient-to-b from-transparent via-sandstone/24 to-transparent" aria-hidden="true" />
      <Container className="relative max-w-[92rem]">
        <div className="home-reveal mx-auto max-w-4xl text-center">
          <p className="text-[0.62rem] font-medium uppercase tracking-[0.3em] text-sandstone">From principle to practice</p>
          <h2 className="mt-5 font-display text-[clamp(3rem,7vw,7rem)] font-normal leading-[0.9] tracking-[-0.05em]">A project does not move forward. It moves deeper.</h2>
          <p className="mx-auto mt-7 max-w-2xl text-sm leading-relaxed text-ivory/62 sm:text-base">Six decisions, each inheriting the one before it. The path stays visible even when motion is disabled.</p>
        </div>

        <div className="mt-16 space-y-8 sm:space-y-10">
          {process.map((stage, index) => {
            const left = index % 2 === 0;
            return (
              <article key={stage.stage} className={`home-reveal relative grid gap-6 lg:grid-cols-2 lg:items-center ${left ? "" : "lg:[&>*:first-child]:order-2"}`} style={{ animationDelay: `${index * 55}ms` }}>
                <div className={left ? "lg:pr-16" : "lg:pl-16"}>
                  <motion.div className="group relative aspect-[16/9] overflow-hidden rounded-[1.75rem] border border-ivory/12 bg-black/20" whileHover={{ y: -7 }} transition={{ duration: 0.45, ease: EASE }}>
                    {stage.poster && <Image src={stage.poster} alt="" fill sizes="(min-width: 1024px) 50vw, 100vw" className="object-cover transition-transform duration-1000 group-hover:scale-[1.055]" />}
                    <div className="absolute inset-0 bg-[linear-gradient(180deg,transparent,rgba(12,10,9,.72))]" />
                    <span className="absolute bottom-5 left-5 rounded-full border border-ivory/16 bg-black/26 px-4 py-2 font-display text-sm text-sandstone backdrop-blur-md">{String(index + 1).padStart(2, "0")}</span>
                  </motion.div>
                </div>
                <div className={`${left ? "lg:pl-16" : "lg:pr-16 lg:text-right"}`}>
                  <p className="text-[0.58rem] font-medium uppercase tracking-[0.24em] text-sandstone">Stage {String(index + 1).padStart(2, "0")} · {stage.element}</p>
                  <h3 className="mt-4 font-display text-[clamp(3rem,6vw,6rem)] font-normal leading-[0.9] tracking-[-0.045em]">{stage.stage}</h3>
                  <p className={`mt-6 max-w-xl text-sm leading-relaxed text-ivory/66 sm:text-base ${left ? "" : "lg:ml-auto"}`}>{stage.description}</p>
                </div>
                <motion.span className="absolute left-1/2 top-1/2 hidden h-4 w-4 -translate-x-1/2 -translate-y-1/2 rounded-full border border-sandstone bg-[#100e0c] lg:block" whileInView={{ scale: [0.5, 1.45, 1] }} viewport={{ amount: 0.5 }} transition={{ duration: 0.8, ease: EASE }} />
              </article>
            );
          })}
        </div>

        <div className="home-reveal mx-auto mt-16 max-w-4xl border-t border-ivory/12 pt-12 text-center">
          <p className="text-[0.6rem] font-medium uppercase tracking-[0.24em] text-sandstone">The system closes</p>
          <p className="mt-5 font-display text-[clamp(3rem,7vw,6.8rem)] leading-[0.9]">Every decision now remembers the one before it.</p>
        </div>
      </Container>
    </section>
  );
}

function ClosingChapter() {
  const questions = [
    "Can you help a brand new business?",
    "Can you help an existing brand that already has an identity?",
    "Can you actually implement, or just strategize?",
    "How long does a project take?",
    "Can we work remotely?",
  ].map((question) => faqs.find((faq) => faq.question === question)).filter(Boolean);

  return (
    <section className="relative isolate overflow-hidden bg-[#11100e] px-6 py-24 text-ivory sm:px-10 sm:py-32 lg:px-16 lg:py-40">
      <div className="absolute inset-0">
        <SmartVideo src="/videos/higgsfield-silver-tide.mp4" poster="/images/higgsfield-silver-tide-poster.jpg" />
      </div>
      <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(12,11,10,.62),rgba(12,11,10,.9)_52%,rgba(12,11,10,.98))]" />
      <div className="relative z-10 mx-auto max-w-[92rem]">
        <div className="home-reveal grid gap-9 lg:grid-cols-[.85fr_1.15fr] lg:items-end">
          <div>
            <p className="text-[0.62rem] font-medium uppercase tracking-[0.3em] text-sandstone">Before the room goes quiet</p>
            <h2 className="mt-5 max-w-4xl font-display text-[clamp(3rem,7vw,7rem)] font-normal leading-[0.9] tracking-[-0.05em]">Doubt deserves an answer. <span className="italic text-sandstone">Not a sales script.</span></h2>
          </div>
          <p className="max-w-xl text-sm leading-relaxed text-ivory/62 sm:text-base lg:justify-self-end">Open the question still holding the decision back. Every answer remains ordinary document flow, never trapped inside a scroll effect.</p>
        </div>

        <div className="home-reveal mt-12 divide-y divide-ivory/12 rounded-[1.8rem] border border-ivory/14 bg-black/28 px-5 backdrop-blur-xl sm:px-8">
          {questions.map((item, index) => item && (
            <details key={item.question} className="group py-6">
              <summary className="flex cursor-pointer list-none items-start gap-4 font-display text-2xl leading-tight marker:hidden sm:text-3xl lg:text-4xl">
                <span className="mt-1 text-[0.56rem] font-body uppercase tracking-[0.22em] text-sandstone/68">{String(index + 1).padStart(2, "0")}</span>
                <span>{item.question}</span>
                <span className="ml-auto text-xl text-sandstone transition-transform duration-300 group-open:rotate-45">+</span>
              </summary>
              <p className="ml-10 mt-5 max-w-3xl border-l border-sandstone/42 pl-5 text-sm leading-relaxed text-ivory/68 sm:text-base">{item.answer}</p>
            </details>
          ))}
        </div>

        <div className="home-reveal mt-20 border-t border-ivory/14 pt-14 text-center">
          <p className="text-[0.62rem] font-medium uppercase tracking-[0.3em] text-sandstone">The last frame belongs to them</p>
          <h2 className="mx-auto mt-6 max-w-5xl font-display text-[clamp(3rem,7.2vw,7.7rem)] font-normal leading-[0.9] tracking-[-0.055em]">What should your audience remember after you leave the room?</h2>
          <p className="mx-auto mt-7 max-w-xl text-sm leading-relaxed text-ivory/58 sm:text-base">Twenty minutes. A real diagnosis. No pitch deck waiting behind the curtain.</p>
          <div className="mt-9">
            <LinkButton href="/contact" trackEvent="closing_booking_click" trackProps={{ page: "home" }}>Begin with the real question</LinkButton>
          </div>
        </div>
      </div>
    </section>
  );
}

export function HomeExperience() {
  return (
    <>
      <style jsx global>{`
        .home-reveal {
          opacity: 1;
          transform: none;
        }

        @supports (animation-timeline: view()) {
          .home-reveal {
            animation-name: home-rise;
            animation-duration: 1ms;
            animation-fill-mode: both;
            animation-timing-function: cubic-bezier(.16,1,.3,1);
            animation-timeline: view();
            animation-range: entry 3% cover 34%;
          }
        }

        @keyframes home-rise {
          from {
            opacity: .18;
            transform: translate3d(0, 52px, 0) scale(.975);
            filter: blur(7px);
          }
          to {
            opacity: 1;
            transform: translate3d(0, 0, 0) scale(1);
            filter: blur(0);
          }
        }

        .home-divider-line {
          transform-origin: center;
          animation: home-divider-breathe 5s ease-in-out infinite;
        }

        @keyframes home-divider-breathe {
          0%, 100% { transform: scaleX(.72); opacity: .34; }
          50% { transform: scaleX(1); opacity: .8; }
        }

        .home-light-sweep {
          animation: home-light-sweep 12s ease-in-out infinite;
        }

        @keyframes home-light-sweep {
          0%, 100% { transform: translateX(-10%) rotate(16deg); opacity: .35; }
          50% { transform: translateX(240%) rotate(16deg); opacity: .8; }
        }

        @media (prefers-reduced-motion: reduce) {
          .home-reveal,
          .home-divider-line,
          .home-light-sweep {
            animation: none !important;
            opacity: 1 !important;
            transform: none !important;
            filter: none !important;
          }
        }

        :root[data-motion="reduced"] .home-reveal,
        :root[data-motion="reduced"] .home-divider-line,
        :root[data-motion="reduced"] .home-light-sweep {
          animation: none !important;
          opacity: 1 !important;
          transform: none !important;
          filter: none !important;
        }
      `}</style>
      <SiteProgress />
      <HeroFilm />
      <SceneDivider label="Recognition" />
      <RecognitionChapter />
      <SceneDivider label="Evidence" tone="light" />
      <EvidenceChapter />
      <SceneDivider label="Judgement" />
      <ThinkingChapter />
      <AuthorChapter />
      <SceneDivider label="Routes" tone="light" />
      <PathsChapter />
      <SceneDivider label="Five Tatvas" />
      <TatvaSequence />
      <SceneDivider label="Practice" />
      <ProcessChapter />
      <ClosingChapter />
    </>
  );
}
