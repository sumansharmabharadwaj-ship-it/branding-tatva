"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { useInView, useReducedMotion } from "framer-motion";
import { BackgroundVideo } from "@/components/BackgroundVideo";

type ScopeOption = {
  id: string;
  number: string;
  tab: string;
  title: string;
  situation: string;
  diagnosis: string;
  move: string;
  result: string;
  deliverables: string[];
  signal: [number, number, number];
};

const SCOPE_OPTIONS: ScopeOption[] = [
  {
    id: "foundation",
    number: "01",
    tab: "Starting",
    title: "The idea is ahead of the brand.",
    situation: "The business is clear in your head, but the market has not met it yet.",
    diagnosis: "The risk is creating a logo, website, and content before deciding what they must make people believe.",
    move: "Commit the position",
    result: "A brand the rest of the business can grow from",
    deliverables: ["Audience tension", "Category frame", "Position and promise"],
    signal: [82, 34, 28],
  },
  {
    id: "reposition",
    number: "02",
    tab: "Drifting",
    title: "The business and brand have drifted apart.",
    situation: "The brand exists, but every channel seems to be describing a slightly different business.",
    diagnosis: "The risk is producing more visibility for a story that people still cannot repeat back clearly.",
    move: "Remove the contradictions",
    result: "One recognisable idea across every touchpoint",
    deliverables: ["Perception audit", "Narrative spine", "Verbal and visual direction"],
    signal: [48, 72, 39],
  },
  {
    id: "momentum",
    number: "03",
    tab: "Growing",
    title: "Growth is outrunning consistency.",
    situation: "The position is working, but the brand needs a system that can keep moving without losing itself.",
    diagnosis: "The risk is treating every campaign as a fresh invention and paying for recognition that never compounds.",
    move: "Turn the idea into rules",
    result: "A living brand system your team can keep using",
    deliverables: ["Content architecture", "Campaign system", "Governance and iteration"],
    signal: [66, 58, 86],
  },
];

const SITUATION_BY_SCOPE = ["idea", "inconsistent", "outgrown"] as const;
const RADAR_AXES = ["Clarity", "Consistency", "Momentum"] as const;
const GOLD = "#C6A97A";
const AUTO_ADVANCE_MS = 5600;
const MANUAL_PAUSE_MS = 16000;

function radarPoint(value: number, index: number, radius = 70) {
  const angle = -Math.PI / 2 + index * ((Math.PI * 2) / RADAR_AXES.length);
  const distance = (value / 100) * radius;
  return `${100 + Math.cos(angle) * distance},${100 + Math.sin(angle) * distance}`;
}

function radarRing(value: number) {
  return RADAR_AXES.map((_, index) => radarPoint(value, index)).join(" ");
}

export function ClarityCTA() {
  const sectionRef = useRef<HTMLElement>(null);
  const pauseUntilRef = useRef(0);
  const [activeIndex, setActiveIndex] = useState(0);
  const prefersReducedMotion = Boolean(useReducedMotion());
  const inView = useInView(sectionRef, { margin: "12% 0px", amount: 0.08 });
  const active = SCOPE_OPTIONS[activeIndex];

  useEffect(() => {
    if (prefersReducedMotion || !inView) return;

    const timer = window.setInterval(() => {
      if (document.hidden || Date.now() < pauseUntilRef.current) return;
      setActiveIndex((current) => (current + 1) % SCOPE_OPTIONS.length);
    }, AUTO_ADVANCE_MS);

    return () => window.clearInterval(timer);
  }, [inView, prefersReducedMotion]);

  function pauseAutoplay(duration = MANUAL_PAUSE_MS) {
    pauseUntilRef.current = Date.now() + duration;
  }

  function choose(index: number) {
    const situation = SITUATION_BY_SCOPE[index];
    setActiveIndex(index);
    pauseAutoplay();
    try {
      window.localStorage.setItem("bt-situation", situation);
      window.dispatchEvent(
        new CustomEvent("bt:situation", { detail: { situation } }),
      );
    } catch {}
  }

  const signalPolygon = useMemo(
    () => active.signal.map((value, index) => radarPoint(value, index)).join(" "),
    [active],
  );

  return (
    <section
      ref={sectionRef}
      className={`clarity-lab ${inView ? "is-awake" : "is-resting"} relative isolate overflow-hidden bg-[#141210] text-ivory`}
      aria-labelledby="clarity-lab-title"
      onFocusCapture={() => pauseAutoplay()}
      onPointerDown={() => pauseAutoplay()}
      onTouchStart={() => pauseAutoplay()}
    >
      <div className="absolute inset-0 -z-30" aria-hidden="true">
        <BackgroundVideo
          video="/videos/higgsfield-idea-sketch.mp4"
          poster="/images/higgsfield-idea-sketch.jpg"
          imagePosition="center 55%"
          parallax
        />
      </div>
      <div
        className="absolute inset-0 -z-20"
        aria-hidden="true"
        style={{
          backgroundImage:
            "linear-gradient(105deg, rgba(20,18,16,0.97) 0%, rgba(20,18,16,0.91) 38%, rgba(20,18,16,0.67) 66%, rgba(20,18,16,0.86) 100%)",
        }}
      />
      <div className="clarity-lab__glow absolute -right-[12rem] top-1/2 -z-10 h-[34rem] w-[34rem] -translate-y-1/2 rounded-full" aria-hidden="true" />
      <div className="clarity-lab__grain pointer-events-none absolute inset-0 -z-10 opacity-25" aria-hidden="true" />

      <div className="mx-auto max-w-[1480px] px-6 py-16 sm:px-10 sm:py-20 lg:px-16 lg:py-24 xl:px-24">
        <header className="grid gap-7 border-b border-ivory/10 pb-10 lg:grid-cols-[minmax(0,0.9fr)_minmax(26rem,0.7fr)] lg:items-end lg:gap-16">
          <div>
            <p className="text-xs font-medium uppercase tracking-[0.26em]" style={{ color: GOLD }}>
              Find the gap
            </p>
            <h2
              id="clarity-lab-title"
              className="mt-4 max-w-3xl font-display text-[clamp(2.35rem,5vw,5.2rem)] font-normal leading-[0.98] tracking-[-0.025em]"
            >
              The right work starts with the right diagnosis.
            </h2>
          </div>
          <p className="max-w-xl text-sm leading-7 text-ivory/70 sm:text-base sm:leading-8">
            Before choosing a package, identify what is actually failing: the foundation, the coherence, or the ability to compound one recognisable idea.
          </p>
        </header>

        <div className="mt-10 grid gap-8 lg:grid-cols-[minmax(16rem,0.72fr)_minmax(0,1.5fr)] lg:gap-12">
          <div className="flex flex-col justify-between gap-8">
            <div role="tablist" aria-label="Choose the condition closest to your brand" className="space-y-2">
              {SCOPE_OPTIONS.map((option, index) => {
                const selected = index === activeIndex;
                return (
                  <button
                    key={option.id}
                    type="button"
                    role="tab"
                    aria-selected={selected}
                    aria-controls="clarity-diagnosis"
                    onClick={() => choose(index)}
                    onPointerEnter={() => pauseAutoplay(9000)}
                    className="group relative w-full overflow-hidden rounded-2xl border px-5 py-5 text-left transition-[border-color,background-color,transform] duration-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 sm:px-6"
                    style={{
                      borderColor: selected ? "rgba(198,169,122,0.68)" : "rgba(244,239,230,0.11)",
                      backgroundColor: selected ? "rgba(198,169,122,0.09)" : "rgba(244,239,230,0.035)",
                      outlineColor: GOLD,
                      transform: selected ? "translateX(6px)" : "translateX(0)",
                    }}
                  >
                    <span
                      className="absolute inset-y-0 left-0 w-px origin-bottom transition-transform duration-700"
                      aria-hidden="true"
                      style={{ backgroundColor: GOLD, transform: selected ? "scaleY(1)" : "scaleY(0)" }}
                    />
                    <span className="flex items-center justify-between gap-4">
                      <span className="text-[0.66rem] uppercase tracking-[0.22em] text-ivory/40">{option.number}</span>
                      <span
                        className="h-2 w-2 rounded-full border transition-all duration-500"
                        aria-hidden="true"
                        style={{
                          borderColor: selected ? GOLD : "rgba(244,239,230,0.3)",
                          backgroundColor: selected ? GOLD : "transparent",
                          boxShadow: selected ? "0 0 22px rgba(198,169,122,0.68)" : "none",
                        }}
                      />
                    </span>
                    <span className="mt-3 block text-[0.67rem] font-medium uppercase tracking-[0.2em]" style={{ color: GOLD }}>
                      {option.tab}
                    </span>
                    <span className="mt-2 block font-display text-xl font-normal leading-snug text-ivory sm:text-2xl">
                      {option.situation}
                    </span>
                  </button>
                );
              })}
            </div>

            <p className="max-w-sm text-xs leading-6 text-ivory/40">
              The map wakes when you reach it. Choose the pattern closest to your business and it will hold while you read. It is a conversation starter, never an automated verdict.
            </p>
          </div>

          <div
            id="clarity-diagnosis"
            role="tabpanel"
            aria-live="polite"
            className="relative overflow-hidden rounded-[1.75rem] border border-ivory/15 bg-[#171512]/80 p-5 shadow-[0_32px_90px_rgba(0,0,0,0.34)] backdrop-blur-xl sm:p-7 lg:p-8"
          >
            <div className="absolute inset-0 opacity-30" aria-hidden="true" style={{ backgroundImage: "radial-gradient(circle at 76% 18%, rgba(198,169,122,0.24), transparent 34%)" }} />

            <div className="relative grid gap-8 xl:grid-cols-[minmax(0,0.95fr)_minmax(18rem,0.75fr)] xl:items-center">
              <article key={active.id} className="clarity-lab__reveal">
                <p className="text-[0.68rem] font-medium uppercase tracking-[0.22em]" style={{ color: GOLD }}>
                  The pattern · {active.number}
                </p>
                <h3 className="mt-4 max-w-xl font-display text-[clamp(2rem,4vw,3.8rem)] font-normal leading-[1.02]">
                  {active.title}
                </h3>
                <p className="mt-5 max-w-xl text-sm leading-7 text-ivory/70 sm:text-base sm:leading-8">
                  {active.diagnosis}
                </p>

                <div className="mt-8 grid gap-3 sm:grid-cols-3" aria-label="Evidence the diagnosis should clarify">
                  {active.deliverables.map((deliverable, index) => (
                    <div
                      key={deliverable}
                      className="clarity-lab__chip rounded-2xl border border-ivory/10 bg-ivory/[0.035] px-4 py-4"
                      style={{ animationDelay: `${index * 90}ms` }}
                    >
                      <span className="text-[0.62rem] uppercase tracking-[0.2em] text-ivory/35">
                        {String(index + 1).padStart(2, "0")}
                      </span>
                      <p className="mt-2 text-sm leading-6 text-ivory/80">{deliverable}</p>
                    </div>
                  ))}
                </div>
              </article>

              <div className="relative mx-auto w-full max-w-[24rem]">
                <p className="text-center text-[0.64rem] uppercase tracking-[0.22em] text-ivory/40">Illustrative signal map</p>
                <svg
                  viewBox="0 0 200 214"
                  className="mt-3 h-auto w-full overflow-visible"
                  role="img"
                  aria-label={`Illustrative brand signal pattern for ${active.title}`}
                >
                  {[25, 50, 75, 100].map((ring) => (
                    <polygon
                      key={ring}
                      points={radarRing(ring)}
                      fill="none"
                      stroke="rgba(244,239,230,0.12)"
                      strokeWidth="0.8"
                    />
                  ))}
                  {RADAR_AXES.map((axis, index) => {
                    const outer = radarPoint(100, index);
                    const [x, y] = outer.split(",");
                    return (
                      <line
                        key={axis}
                        x1="100"
                        y1="100"
                        x2={x}
                        y2={y}
                        stroke="rgba(244,239,230,0.12)"
                        strokeWidth="0.8"
                      />
                    );
                  })}
                  <polygon
                    points={signalPolygon}
                    fill="rgba(198,169,122,0.18)"
                    stroke={GOLD}
                    strokeWidth="1.6"
                    className="clarity-lab__polygon"
                  />
                  {active.signal.map((value, index) => {
                    const point = radarPoint(value, index);
                    const [cx, cy] = point.split(",");
                    return (
                      <circle
                        key={RADAR_AXES[index]}
                        cx={cx}
                        cy={cy}
                        r="3.2"
                        fill={GOLD}
                        className="clarity-lab__node"
                        style={{ animationDelay: `${index * 150}ms` }}
                      />
                    );
                  })}
                  <text x="100" y="15" textAnchor="middle" fill="rgba(244,239,230,0.62)" fontSize="8.5" letterSpacing="1.2">
                    CLARITY
                  </text>
                  <text x="182" y="164" textAnchor="end" fill="rgba(244,239,230,0.62)" fontSize="8.5" letterSpacing="1.2">
                    CONSISTENCY
                  </text>
                  <text x="18" y="164" textAnchor="start" fill="rgba(244,239,230,0.62)" fontSize="8.5" letterSpacing="1.2">
                    MOMENTUM
                  </text>
                </svg>
              </div>
            </div>

            <div className="relative mt-8 grid gap-3 border-t border-ivory/10 pt-7 md:grid-cols-[1fr_auto_1fr_auto_1fr] md:items-center">
              <div className="rounded-2xl border border-ivory/10 bg-black/10 px-4 py-4">
                <p className="text-[0.62rem] uppercase tracking-[0.2em] text-ivory/35">Where the tension lives</p>
                <p className="mt-2 font-display text-lg font-normal text-ivory/90">{active.tab}</p>
              </div>
              <div className="clarity-lab__flow hidden h-px w-14 overflow-hidden bg-ivory/10 md:block" aria-hidden="true">
                <span className="block h-full w-1/2" style={{ backgroundColor: GOLD }} />
              </div>
              <div className="rounded-2xl border px-4 py-4" style={{ borderColor: "rgba(198,169,122,0.4)", backgroundColor: "rgba(198,169,122,0.075)" }}>
                <p className="text-[0.62rem] uppercase tracking-[0.2em]" style={{ color: GOLD }}>The strategic move</p>
                <p className="mt-2 font-display text-lg font-normal text-ivory">{active.move}</p>
              </div>
              <div className="clarity-lab__flow hidden h-px w-14 overflow-hidden bg-ivory/10 md:block" aria-hidden="true">
                <span className="block h-full w-1/2" style={{ backgroundColor: GOLD }} />
              </div>
              <div className="rounded-2xl border border-ivory/10 bg-black/10 px-4 py-4">
                <p className="text-[0.62rem] uppercase tracking-[0.2em] text-ivory/35">What it unlocks</p>
                <p className="mt-2 font-display text-lg font-normal text-ivory/90">{active.result}</p>
              </div>
            </div>
          </div>
        </div>

        <footer className="mt-10 flex flex-col gap-6 border-t border-ivory/10 pt-8 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="font-display text-2xl font-normal text-ivory sm:text-3xl">A useful diagnosis before a proposal.</p>
            <p className="mt-2 text-sm leading-6 text-ivory/50">No pitch deck. No pressure to choose the largest scope.</p>
          </div>
          <Link
            href="#evidence-wall-title"
            className="group inline-flex min-h-12 shrink-0 items-center justify-center gap-4 rounded-full border px-7 text-xs font-medium uppercase tracking-[0.18em] transition-[background-color,border-color,transform] duration-300 hover:-translate-y-0.5 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2"
            style={{ borderColor: "rgba(198,169,122,0.78)", color: GOLD, outlineColor: GOLD }}
          >
            See how decisions become proof
            <span aria-hidden="true" className="transition-transform duration-300 group-hover:translate-x-1">→</span>
          </Link>
        </footer>
      </div>

      <style>{`
        .clarity-lab__glow {
          background: radial-gradient(circle, rgba(198,169,122,0.17) 0%, rgba(198,169,122,0.05) 42%, transparent 72%);
          filter: blur(14px);
          animation: clarity-breathe 7s ease-in-out infinite;
        }
        .clarity-lab__grain {
          background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 180 180' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.9' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='.18'/%3E%3C/svg%3E");
          mix-blend-mode: soft-light;
        }
        .clarity-lab__reveal {
          animation: clarity-reveal 680ms cubic-bezier(.22,1,.36,1) both;
        }
        .clarity-lab__chip {
          animation: clarity-chip 620ms cubic-bezier(.22,1,.36,1) both;
        }
        .clarity-lab__polygon {
          transition: points 900ms cubic-bezier(.22,1,.36,1), fill 500ms ease;
          filter: drop-shadow(0 0 14px rgba(198,169,122,0.22));
        }
        .clarity-lab__node {
          transform-origin: center;
          animation: clarity-node 1.8s ease-in-out infinite;
        }
        .clarity-lab__flow span {
          animation: clarity-flow 1.9s linear infinite;
        }
        .clarity-lab.is-resting .clarity-lab__glow,
        .clarity-lab.is-resting .clarity-lab__node,
        .clarity-lab.is-resting .clarity-lab__flow span {
          animation-play-state: paused;
        }
        @keyframes clarity-reveal {
          from { opacity: 0; transform: translateY(18px); filter: blur(5px); }
          to { opacity: 1; transform: translateY(0); filter: blur(0); }
        }
        @keyframes clarity-chip {
          from { opacity: 0; transform: translateY(12px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes clarity-node {
          0%, 100% { opacity: .72; filter: drop-shadow(0 0 2px rgba(198,169,122,.3)); }
          50% { opacity: 1; filter: drop-shadow(0 0 8px rgba(198,169,122,.9)); }
        }
        @keyframes clarity-flow {
          from { transform: translateX(-110%); }
          to { transform: translateX(220%); }
        }
        @keyframes clarity-breathe {
          0%, 100% { transform: translateY(-50%) scale(.94); opacity: .72; }
          50% { transform: translateY(-50%) scale(1.08); opacity: 1; }
        }
        @media (prefers-reduced-motion: reduce) {
          .clarity-lab *, .clarity-lab *::before, .clarity-lab *::after {
            animation-duration: 0.01ms !important;
            animation-iteration-count: 1 !important;
            scroll-behavior: auto !important;
            transition-duration: 0.01ms !important;
          }
        }
      `}</style>
    </section>
  );
}
