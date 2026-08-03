"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { SITUATION_KEY } from "@/sections/Home/VisitorRecognition";
import { track } from "@/lib/analytics";

const PATHS = [
  {
    n: "01",
    title: "Build the foundation",
    body: "For a business still carrying several possible identities and no governing decision.",
    start: "Possibility",
    finish: "A clear position",
    href: "/services#desire",
    tint: "#6F4E37",
    route: ["Question", "Position", "Build", "Launch"],
    outcome: "A brand people can understand before they are asked to buy.",
    icon: <><path d="M20 30V16" /><path d="M20 20c-4 0-7-3-7-7 4 0 7 3 7 7z" /><path d="M20 22c4 0 7-3 7-7-4 0-7 3-7 7z" /></>,
  },
  {
    n: "02",
    title: "Reposition the whole system",
    body: "For an existing brand whose offer, identity and communication no longer point in one direction.",
    start: "Drift",
    finish: "Coherence",
    href: "/services#situation",
    tint: "#556B4A",
    route: ["Decode", "Refuse", "Align", "Signal"],
    outcome: "Recognition begins compounding instead of restarting on every channel.",
    icon: <><circle cx="16" cy="22" r="7" /><circle cx="24" cy="22" r="7" /><circle cx="20" cy="15" r="7" /></>,
  },
  {
    n: "03",
    title: "Keep the brand coherent in motion",
    body: "For a sound brand that needs ongoing content, judgement and consistency across changing channels.",
    start: "Momentum",
    finish: "Memory",
    href: "/services#offerings",
    tint: "#8A6B3D",
    route: ["Plan", "Create", "Learn", "Compound"],
    outcome: "Every new piece strengthens the same meaning instead of adding another personality.",
    icon: <><circle cx="20" cy="20" r="9" /><path d="M20 8v4M20 28v4M8 20h4M28 20h4M20 14l3 6-3 6-3-6z" /></>,
  },
] as const;

const SITUATION_TO_PATH: Record<string, number> = {
  idea: 0,
  inconsistent: 1,
  outgrown: 1,
};

const SITUATION_COPY: Record<string, string> = {
  idea: "You said the business keeps changing direction before anything settles.",
  inconsistent: "You said people see the brand, but every version feels different.",
  outgrown: "You said the business has grown while the brand still looks behind.",
};

const CURVES = [
  "M136 62 C 238 62, 252 150, 340 150",
  "M136 150 C 238 150, 252 150, 340 150",
  "M136 238 C 238 238, 252 150, 340 150",
];
const ENTRY_Y = [62, 150, 238];

export function ThreePathsSection() {
  const [recommendedPath, setRecommendedPath] = useState(1);
  const [situation, setSituation] = useState<string | null>(null);
  const [activePath, setActivePath] = useState<number | null>(null);
  const shown = activePath ?? recommendedPath;

  useEffect(() => {
    try {
      const saved = window.localStorage.getItem(SITUATION_KEY);
      if (!saved) return;
      setSituation(saved);
      setRecommendedPath(SITUATION_TO_PATH[saved] ?? 1);
    } catch {}
  }, []);

  const recommendation = PATHS[recommendedPath];

  return (
    <section className="relative overflow-hidden bg-[#F2F0E8] py-20 sm:py-28">
      <style>{`
        @keyframes tatva-flow { to { stroke-dashoffset: -34; } }
        @keyframes tatva-pulse { 0%,100% { opacity: .35; transform: scale(.94) } 50% { opacity: 1; transform: scale(1.08) } }
        @media (prefers-reduced-motion: reduce) {
          .tatva-flow, .tatva-pulse { animation: none !important; }
        }
      `}</style>

      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-60"
        style={{ background: `radial-gradient(circle at 72% 38%, ${PATHS[shown].tint}18, transparent 34%)` }}
      />

      <div className="relative mx-auto max-w-[92rem] px-6 sm:px-10 lg:px-14">
        <div className="grid gap-10 border-b border-soil/10 pb-10 lg:grid-cols-[0.78fr_1.22fr] lg:items-end">
          <div>
            <p className="text-xs font-medium uppercase tracking-[0.26em]" style={{ color: "#8A6B3D" }}>
              Three ways into the work
            </p>
            <h2 className="mt-4 max-w-2xl font-display text-[clamp(2.6rem,5vw,5.2rem)] font-normal leading-[0.96] text-soil">
              The right scope begins with what is actually broken.
            </h2>
          </div>

          <div className="lg:justify-self-end">
            <div className="max-w-xl rounded-2xl border border-soil/10 bg-white/55 p-5 shadow-[0_20px_70px_-50px_rgba(39,34,30,0.55)] sm:p-6">
              <div className="flex items-center gap-3">
                <span className="relative flex h-8 w-8 items-center justify-center" aria-hidden="true">
                  <span className="tatva-pulse absolute inset-0 rounded-full border" style={{ borderColor: `${recommendation.tint}66`, animation: "tatva-pulse 3.4s ease-in-out infinite" }} />
                  <span className="h-2 w-2 rounded-full" style={{ backgroundColor: recommendation.tint }} />
                </span>
                <p className="text-[0.65rem] font-medium uppercase tracking-[0.2em]" style={{ color: recommendation.tint }}>
                  Recommended from your diagnosis
                </p>
              </div>
              <p className="mt-4 font-display text-2xl leading-tight text-soil sm:text-3xl">{recommendation.title}</p>
              <p className="mt-3 text-sm leading-relaxed text-foreground-secondary">
                {situation ? SITUATION_COPY[situation] : "Most existing businesses need alignment before they need more output."}
              </p>
            </div>
          </div>
        </div>

        <div className="mt-10 grid gap-10 lg:grid-cols-[0.92fr_1.08fr] lg:items-center">
          <div className="order-2 lg:order-1">
            <ul className="space-y-4">
              {PATHS.map((path, index) => {
                const isRecommended = recommendedPath === index;
                const isActive = shown === index;
                const isDimmed = activePath !== null && !isActive;

                return (
                  <li key={path.n} style={{ opacity: isDimmed ? 0.42 : 1 }} className="transition-opacity duration-500">
                    <Link
                      href={path.href}
                      onMouseEnter={() => setActivePath(index)}
                      onMouseLeave={() => setActivePath(null)}
                      onFocus={() => setActivePath(index)}
                      onBlur={() => setActivePath(null)}
                      onClick={() => track("service_path_opened", { path: path.title, recommended: isRecommended, page: "home" })}
                      className="group relative grid min-h-[11rem] gap-5 overflow-hidden rounded-2xl border p-6 transition-all duration-500 hover:-translate-y-0.5 sm:grid-cols-[auto_1fr_auto] sm:items-center sm:p-7"
                      style={{
                        borderColor: isActive ? `${path.tint}66` : "rgba(39,34,30,0.11)",
                        backgroundColor: isActive ? "rgba(255,255,255,0.88)" : "rgba(255,255,255,0.48)",
                        boxShadow: isActive ? `0 28px 80px -52px ${path.tint}` : "none",
                      }}
                    >
                      <span aria-hidden="true" className="absolute inset-y-0 left-0 w-1 transition-transform duration-500" style={{ backgroundColor: path.tint, transform: isActive ? "scaleY(1)" : "scaleY(.18)" }} />

                      <span className="flex h-14 w-14 items-center justify-center rounded-full border border-soil/10 bg-white/55">
                        <svg viewBox="0 0 40 40" className="h-7 w-7" fill="none" stroke={path.tint} strokeWidth="1.1" strokeLinecap="round" strokeLinejoin="round">
                          {path.icon}
                        </svg>
                      </span>

                      <span>
                        <span className="flex flex-wrap items-center gap-3">
                          <span className="text-[0.62rem] uppercase tracking-[0.2em] text-soil/45">Path {path.n}</span>
                          {isRecommended && (
                            <span className="rounded-full px-3 py-1 text-[0.58rem] font-medium uppercase tracking-[0.16em] text-white" style={{ backgroundColor: path.tint }}>
                              Your likely fit
                            </span>
                          )}
                        </span>
                        <span className="mt-2 block font-display text-2xl leading-tight text-soil sm:text-3xl">{path.title}</span>
                        <span className="mt-3 block max-w-xl text-sm leading-relaxed text-foreground-secondary">{path.body}</span>
                      </span>

                      <span className="self-end text-xs font-medium uppercase tracking-[0.16em] sm:self-center" style={{ color: path.tint }}>
                        See the roadmap <span aria-hidden="true" className="inline-block transition-transform duration-300 group-hover:translate-x-1">→</span>
                      </span>
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>

          <div className="order-1 overflow-hidden rounded-[1.75rem] border border-soil/10 bg-white/45 p-4 shadow-[0_34px_100px_-70px_rgba(39,34,30,0.6)] sm:p-7 lg:order-2">
            <div className="flex items-center justify-between border-b border-soil/10 pb-5">
              <div>
                <p className="text-[0.62rem] uppercase tracking-[0.2em] text-soil/40">Active transformation</p>
                <p className="mt-1 font-display text-2xl text-soil">{PATHS[shown].start} → {PATHS[shown].finish}</p>
              </div>
              <span className="rounded-full px-3 py-1 text-[0.62rem] uppercase tracking-[0.16em] text-white" style={{ backgroundColor: PATHS[shown].tint }}>
                {PATHS[shown].n}
              </span>
            </div>

            <svg viewBox="0 0 900 310" className="mt-5 h-auto w-full" role="img" aria-label={`${PATHS[shown].title}: ${PATHS[shown].route.join(" to ")}, ending in a recognised brand`}>
              {CURVES.map((curve, index) => {
                const active = shown === index;
                return (
                  <g key={curve} opacity={active ? 1 : 0.14} style={{ transition: "opacity 500ms" }}>
                    <path d={curve} fill="none" stroke={PATHS[index].tint} strokeWidth={active ? 2.2 : 1} strokeLinecap="round" opacity={0.35} />
                    <path
                      className="tatva-flow"
                      d={curve}
                      fill="none"
                      stroke={PATHS[index].tint}
                      strokeWidth={active ? 2.7 : 1.2}
                      strokeLinecap="round"
                      strokeDasharray="6 10"
                      style={{ animation: `tatva-flow ${active ? 1.15 : 2.8}s linear infinite` }}
                    />
                    <circle cx={136} cy={ENTRY_Y[index]} r={active ? 7 : 4} fill={PATHS[index].tint} />
                    <text x={118} y={ENTRY_Y[index] + 5} textAnchor="end" fontSize={14} fill="#27221E" opacity={0.72}>{PATHS[index].start}</text>
                  </g>
                );
              })}

              <line x1={340} y1={150} x2={674} y2={150} stroke={PATHS[shown].tint} strokeWidth={2} strokeLinecap="round" opacity={0.5} />
              {PATHS[shown].route.map((step, index) => {
                const x = 382 + index * 88;
                return (
                  <g key={step}>
                    <circle cx={x} cy={150} r={6} fill={PATHS[shown].tint} />
                    <circle className="tatva-pulse" cx={x} cy={150} r={12} fill="none" stroke={PATHS[shown].tint} opacity={0.24} style={{ transformOrigin: `${x}px 150px`, animation: `tatva-pulse 3.2s ease-in-out ${index * 0.35}s infinite` }} />
                    <text x={x} y={122} textAnchor="middle" fontSize={13} fill="#27221E" opacity={0.72}>{step}</text>
                  </g>
                );
              })}

              <circle cx={718} cy={150} r={38} fill="none" stroke={PATHS[shown].tint} strokeWidth={1.2} opacity={0.35} />
              <circle className="tatva-pulse" cx={718} cy={150} r={10} fill={PATHS[shown].tint} style={{ transformOrigin: "718px 150px", animation: "tatva-pulse 3.4s ease-in-out infinite" }} />
              <text x={768} y={143} fontSize={19} fill="#27221E" className="font-display">A meaning people</text>
              <text x={768} y={168} fontSize={19} fill="#27221E" className="font-display">can recognise</text>
            </svg>

            <div className="mt-2 rounded-2xl border border-soil/10 bg-[#F7F3EA] p-5 sm:p-6">
              <p className="text-[0.62rem] uppercase tracking-[0.2em]" style={{ color: PATHS[shown].tint }}>What this path changes</p>
              <p className="mt-3 font-display text-2xl leading-snug text-soil">{PATHS[shown].outcome}</p>
            </div>
          </div>
        </div>

        <div className="mt-10 flex flex-col items-center justify-between gap-5 rounded-2xl border border-soil/10 bg-white/40 px-6 py-5 text-center sm:flex-row sm:text-left">
          <p className="text-sm leading-relaxed text-foreground-secondary">
            A recommendation is a starting hypothesis, not a package pushed before the business is understood.
          </p>
          <Link href="/services#health" className="shrink-0 text-xs font-medium uppercase tracking-[0.16em]" style={{ color: "#8A6B3D" }}>
            Check the fit properly <span aria-hidden="true">→</span>
          </Link>
        </div>
      </div>
    </section>
  );
}
