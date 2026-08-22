"use client";

import { useHydratedReducedMotion } from "@/hooks/useHydratedReducedMotion";
import Link from "next/link";
import { AnimatePresence, motion, useInView } from "framer-motion";
import { useEffect, useRef, useState, type CSSProperties, type KeyboardEvent } from "react";
import {
  SERVICES_SITUATION_EVENT,
  SERVICES_SITUATION_STORAGE_KEY,
  SITUATION_TO_PACKAGE,
  isServicesSituation,
  type ServicesSituationDetail,
  type ServicesSituationId,
} from "@/lib/servicesJourney";

const PATHS = [
  {
    number: "01",
    situation: "idea",
    eyebrow: "For an idea becoming a business",
    choice: "I am defining a new business",
    title: "Build the foundation",
    start: "A new direction",
    body:
      "Decide the category, audience, belief, and position first, then give identity and expression one direction to carry.",
    route: ["Frame", "Position", "System"],
    result: "A position and decision system the business can build from",
    href: "/services#desire",
    tint: "#C98B63",
    proof: {
      project: "MyShopInEurope",
      statement: "A complete brand foundation and year-long content operating system, built around craft and origin ahead of price.",
      href: "/work/myshopineurope",
    },
  },
  {
    number: "02",
    situation: "reposition",
    eyebrow: "For a business that has evolved",
    choice: "The business has outgrown its brand",
    title: "Reposition the system",
    start: "An established brand",
    body:
      "Audit the signals people already know, retain useful recognition, and align the brand with the business it has become.",
    route: ["Decode", "Retain", "Reframe"],
    result: "A clearer meaning that moves expectations forward",
    href: "/services#situation",
    tint: "#88A77E",
    proof: {
      project: "HerbalCart",
      statement: "A campaign reset with five content formats and complete video scripts, organised around a modern supplement-first position.",
      href: "/work/herbalcart",
    },
  },
  {
    number: "03",
    situation: "ongoing",
    eyebrow: "For a brand active across channels",
    choice: "The brand needs ongoing consistency",
    title: "Make the system repeatable",
    start: "A brand in motion",
    body:
      "Codify the strategy into rules for language, content, campaigns, websites, and teams, so each release strengthens the same memory.",
    route: ["Codify", "Apply", "Compound"],
    result: "One recognisable logic the whole business can repeat",
    href: "/services#offerings",
    tint: "#D3A24F",
    proof: {
      project: "Dr. Haley Nutrition",
      statement: "Twelve focused Instagram posts earned 126 new followers in January; followers earned per post rose 104%.",
      href: "/work/dr-haley-nutrition",
    },
  },
] as const satisfies ReadonlyArray<{
  number: string;
  situation: ServicesSituationId;
  eyebrow: string;
  choice: string;
  title: string;
  start: string;
  body: string;
  route: readonly string[];
  result: string;
  href: string;
  tint: string;
  proof: { project: string; statement: string; href: string };
}>;

const CURVES = [
  "M112 70 C210 70 238 160 338 160",
  "M112 160 C210 160 238 160 338 160",
  "M112 250 C210 250 238 160 338 160",
] as const;

const ENTRY_Y = [70, 160, 250] as const;
const EASE = [0.22, 1, 0.36, 1] as const;
const SITUATION_TO_INDEX: Record<ServicesSituationId, number> = {
  idea: 0,
  reposition: 1,
  ongoing: 2,
};

function publishSituation(situation: ServicesSituationId) {
  try {
    window.localStorage.setItem(SERVICES_SITUATION_STORAGE_KEY, situation);
    const detail: ServicesSituationDetail = {
      situation,
      packageSlug: SITUATION_TO_PACKAGE[situation],
    };
    window.dispatchEvent(new CustomEvent<ServicesSituationDetail>(SERVICES_SITUATION_EVENT, { detail }));
  } catch {}
}

export function PathsCinematicChapter() {
  const sectionRef = useRef<HTMLElement>(null);
  const prefersReducedMotion = Boolean(useHydratedReducedMotion());
  const inView = useInView(sectionRef, {
    amount: 0.22,
    margin: "8% 0px -12% 0px",
  });
  const [activeIndex, setActiveIndex] = useState(0);
  const [carriedChoice, setCarriedChoice] = useState(false);
  const active = PATHS[activeIndex];

  useEffect(() => {
    function applySituation(value: string | null, carried: boolean) {
      if (!isServicesSituation(value)) return;
      const index = SITUATION_TO_INDEX[value];
      setActiveIndex(index);
      setCarriedChoice(carried);
    }

    try {
      applySituation(window.localStorage.getItem(SERVICES_SITUATION_STORAGE_KEY), true);
    } catch {}

    function onSituation(event: Event) {
      const detail = (event as CustomEvent<ServicesSituationDetail>).detail;
      applySituation(detail?.situation ?? null, true);
    }

    window.addEventListener(SERVICES_SITUATION_EVENT, onSituation as EventListener);
    return () => window.removeEventListener(SERVICES_SITUATION_EVENT, onSituation as EventListener);
  }, []);

  function choose(index: number) {
    setActiveIndex(index);
    setCarriedChoice(false);
    publishSituation(PATHS[index].situation);
  }

  function onChoiceKeyDown(event: KeyboardEvent<HTMLButtonElement>, index: number) {
    let next = index;
    if (event.key === "ArrowRight" || event.key === "ArrowDown") next = (index + 1) % PATHS.length;
    else if (event.key === "ArrowLeft" || event.key === "ArrowUp") next = (index + PATHS.length - 1) % PATHS.length;
    else if (event.key === "Home") next = 0;
    else if (event.key === "End") next = PATHS.length - 1;
    else return;

    event.preventDefault();
    choose(next);
    document.getElementById(`path-tab-${PATHS[next].number}`)?.focus();
  }

  return (
    <section
      ref={sectionRef}
      id="paths"
      data-home-chapter="paths"
      data-home-section="paths"
      className="paths-cinematic home-scene"
      aria-labelledby="paths-cinematic-title"
      style={{ "--paths-accent": active.tint } as CSSProperties}
    >
      <MaterialSystemFilm activeIndex={activeIndex} inView={inView} reducedMotion={prefersReducedMotion} />

      <div className="paths-cinematic__glow paths-cinematic__glow--left" aria-hidden="true" />
      <div className="paths-cinematic__glow paths-cinematic__glow--right" aria-hidden="true" />

      <div className="paths-cinematic__shell">
        <header className="paths-cinematic__header">
          <div>
            <p className="paths-cinematic__eyebrow">Brand Strategy &amp; Systems</p>
            <h2 id="paths-cinematic-title">
              Three starting points. <em>One system built around the real gap.</em>
            </h2>
          </div>
          <div className="paths-cinematic__intro">
            <p>
              Choose the situation that sounds familiar. Each path opens the decisions, the practical outcome, and a recorded project that demonstrates the work.
            </p>
            <span>
              {carriedChoice
                ? "Your earlier choice is already open."
                : "Select a starting point to open its route."}
            </span>
          </div>
        </header>

        <div className="paths-cinematic__choices" role="tablist" aria-label="Choose a Brand Strategy and Systems starting point">
          {PATHS.map((path, index) => {
            const selected = index === activeIndex;
            return (
              <button
                key={path.number}
                id={`path-tab-${path.number}`}
                type="button"
                role="tab"
                aria-selected={selected}
                aria-controls={`path-panel-${path.number}`}
                tabIndex={selected ? 0 : -1}
                onClick={() => choose(index)}
                onKeyDown={(event) => onChoiceKeyDown(event, index)}
                className={selected ? "is-active" : undefined}
                style={{ "--path-tint": path.tint } as CSSProperties}
              >
                <span>{path.number}</span>
                <strong>{path.title}</strong>
                <p>{path.choice}</p>
                <i aria-hidden="true">
                  <b
                    style={{
                      animation: "none",
                      transform: selected ? "scaleX(1)" : "scaleX(0)",
                    }}
                  />
                </i>
              </button>
            );
          })}
        </div>

        <div className="paths-cinematic__stage">
          <div className="paths-cinematic__map" aria-label="Three brand paths converging into a recognisable system">
            <div className="paths-cinematic__map-heading">
              <span>Decision architecture</span>
              <strong>{active.number} / 03</strong>
            </div>

            <svg
              viewBox="0 0 860 320"
              role="img"
              aria-label={`${active.start} moves through ${active.route.join(", ")} toward ${active.result}`}
            >
              <defs>
                <radialGradient id="paths-core-glow">
                  <stop offset="0%" stopColor={active.tint} stopOpacity="0.28" />
                  <stop offset="100%" stopColor={active.tint} stopOpacity="0" />
                </radialGradient>
              </defs>

              <circle cx="338" cy="160" r="90" fill="url(#paths-core-glow)" />

              {CURVES.map((curve, index) => {
                const selected = index === activeIndex;
                return (
                  <g key={curve}>
                    <path
                      d={curve}
                      fill="none"
                      stroke={PATHS[index].tint}
                      strokeWidth="1"
                      opacity={selected ? 0.38 : 0.12}
                    />
                    <motion.path
                      d={curve}
                      fill="none"
                      stroke={PATHS[index].tint}
                      strokeWidth={selected ? 2.4 : 1.2}
                      strokeLinecap="round"
                      strokeDasharray="6 11"
                      animate={
                        selected && inView && !prefersReducedMotion
                          ? { strokeDashoffset: [0, -34] }
                          : { strokeDashoffset: 0 }
                      }
                      transition={{
                        duration: 1.2,
                        repeat: selected ? Infinity : 0,
                        ease: "linear",
                      }}
                      opacity={selected ? 0.96 : 0.16}
                    />
                  </g>
                );
              })}

              {PATHS.map((path, index) => {
                const selected = index === activeIndex;
                return (
                  <g key={path.start} opacity={selected ? 1 : 0.28}>
                    <circle cx="112" cy={ENTRY_Y[index]} r={selected ? 8 : 5} fill={path.tint} />
                    <text
                      x="90"
                      y={ENTRY_Y[index] + 5}
                      textAnchor="end"
                      className="paths-cinematic__svg-label"
                    >
                      {path.start}
                    </text>
                  </g>
                );
              })}

              <line x1="338" y1="160" x2="648" y2="160" className="paths-cinematic__spine" />

              {active.route.map((step, index) => {
                const x = 405 + index * 96;
                return (
                  <g key={`${active.number}-${step}`}>
                    <motion.circle
                      cx={x}
                      cy="160"
                      r="6"
                      fill={active.tint}
                      initial={prefersReducedMotion ? false : { scale: 0.4, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{ delay: prefersReducedMotion ? 0 : index * 0.13, ease: EASE }}
                      style={{ transformOrigin: `${x}px 160px` }}
                    />
                    <text x={x} y="132" textAnchor="middle" className="paths-cinematic__svg-step">
                      {step}
                    </text>
                  </g>
                );
              })}

              <circle cx="680" cy="160" r="32" fill="none" stroke={active.tint} strokeWidth="1.4" opacity="0.64" />
              <circle cx="680" cy="160" r="8" fill={active.tint} />
              <text x="720" y="151" className="paths-cinematic__svg-result">
                A system people
              </text>
              <text x="720" y="175" className="paths-cinematic__svg-result">
                recognise and choose
              </text>
            </svg>

            <div className="paths-cinematic__mobile-route" aria-hidden="true">
              <span>{active.start}</span>
              {active.route.map((step) => (
                <span key={step}>{step}</span>
              ))}
              <strong>{active.result}</strong>
            </div>
          </div>

          <AnimatePresence mode="wait" initial={false}>
            <motion.article
              key={active.number}
              id={`path-panel-${active.number}`}
              role="tabpanel"
              aria-labelledby={`path-tab-${active.number}`}
              className="paths-cinematic__focus"
              initial={prefersReducedMotion ? false : { opacity: 0, y: 14, filter: "blur(4px)" }}
              animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              exit={prefersReducedMotion ? undefined : { opacity: 0, y: -8, filter: "blur(3px)" }}
              transition={{ duration: prefersReducedMotion ? 0 : 0.46, ease: EASE }}
              aria-live="polite"
            >
              <div className="paths-cinematic__focus-topline">
                <span>Path {active.number}</span>
                <i aria-hidden="true" />
              </div>
              <p>{active.eyebrow}</p>
              <h3>{active.title}</h3>
              <p className="paths-cinematic__focus-body">{active.body}</p>
              <div className="paths-cinematic__focus-result">
                <span>What becomes possible</span>
                <strong>{active.result}</strong>
              </div>
              <div className="paths-cinematic__proof">
                <span>Recorded work</span>
                <strong>{active.proof.project}</strong>
                <p>{active.proof.statement}</p>
                <Link href={active.proof.href}>
                  Open the case file <span aria-hidden="true">→</span>
                </Link>
              </div>
              <Link href={active.href}>
                Follow this service path <span aria-hidden="true">↗</span>
              </Link>
            </motion.article>
          </AnimatePresence>
        </div>

        <div className="paths-cinematic__footer">
          <span>Still between paths?</span>
          <Link href="/services#health">
            Use the Brand Health Check <span aria-hidden="true">→</span>
          </Link>
        </div>
      </div>
    </section>
  );
}

function MaterialSystemFilm({
  activeIndex,
  inView,
  reducedMotion,
}: {
  activeIndex: number;
  inView: boolean;
  reducedMotion: boolean;
}) {
  return (
    <div
      className={[
        "paths-cinematic__film",
        inView && !reducedMotion ? "is-playing" : "is-resting",
      ].join(" ")}
      data-media-id="BT-HOME-SERVICES-MATERIAL-ASSEMBLY"
      data-active-material={PATHS[activeIndex].situation}
      aria-hidden="true"
    >
      <span className="paths-cinematic__material paths-cinematic__material--stone" />
      <span className="paths-cinematic__material paths-cinematic__material--paper" />
      <span className="paths-cinematic__material paths-cinematic__material--water" />
      <svg className="paths-cinematic__material-roots" viewBox="0 0 1200 760" preserveAspectRatio="xMidYMid slice">
        {[
          "M-80 690 C180 610 210 430 420 442 S690 580 842 396 S1060 178 1280 116",
          "M-40 740 C190 662 318 560 438 444",
          "M340 820 C392 636 392 520 438 444",
          "M430 444 C510 350 552 238 530 60",
          "M692 534 C760 488 786 444 842 396",
          "M842 396 C924 340 980 316 1080 318",
        ].map((path) => (
          <path key={path} d={path} />
        ))}
      </svg>
      <span className="paths-cinematic__material-signal" />
      <span className="paths-cinematic__film-wash" />
    </div>
  );
}
