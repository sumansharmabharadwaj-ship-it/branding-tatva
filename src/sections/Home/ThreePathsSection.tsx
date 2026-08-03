"use client";

import { useState } from "react";
import Link from "next/link";

// Suman's design, second pass: the film is gone. A sketchbook video
// decorated this section without explaining it, so the right panel is
// now a drawn diagram that does the explaining: three real starting
// points on the left, the stages each one runs through in the middle,
// one shared outcome on the right. Hovering a path drives both the
// diagram and the cards, and softens the siblings, so the section
// behaves like a crossroads rather than three equal boxes.
const PATHS = [
  {
    n: "01",
    title: "Build the foundation",
    body: "For founders starting with an idea, before anything is built.",
    start: "An idea",
    href: "/services#desire",
    tint: "#6F4E37",
    route: ["Question", "Architect", "Signal"],
    icon: <><path d="M20 30V16" /><path d="M20 20c-4 0-7-3-7-7 4 0 7 3 7 7z" /><path d="M20 22c4 0 7-3 7-7-4 0-7 3-7 7z" /></>,
  },
  {
    n: "02",
    title: "Reposition an existing brand",
    body: "For brands that feel unclear, inconsistent, or hard to explain in one sentence.",
    start: "A brand that drifted",
    href: "/services#situation",
    tint: "#556B4A",
    route: ["Decode", "Architect", "Signal"],
    icon: <><circle cx="16" cy="22" r="7" /><circle cx="24" cy="22" r="7" /><circle cx="20" cy="15" r="7" /></>,
  },
  {
    n: "03",
    title: "Create ongoing consistency",
    body: "For brands that need ongoing content, consistency, and someone watching the whole system.",
    start: "A brand in motion",
    href: "/services#offerings",
    tint: "#8a6b3d",
    route: ["Signal", "Influence", "Compound"],
    icon: <><circle cx="20" cy="20" r="9" /><path d="M20 8v4M20 28v4M8 20h4M28 20h4M20 14l3 6-3 6-3-6z" /></>,
  },
];

// One curve per path: from its own entry point, into the shared trunk,
// out to the single outcome.
const CURVES = [
  "M150 60 C 240 60, 250 150, 330 150",
  "M150 150 C 240 150, 250 150, 330 150",
  "M150 240 C 240 240, 250 150, 330 150",
];
const ENTRY_Y = [60, 150, 240];

export function ThreePathsSection() {
  const [openPath, setOpenPath] = useState<number | null>(null);
  const shown = openPath ?? 1;

  return (
    <section
      className="relative transition-colors duration-700"
      style={{ backgroundColor: openPath === null ? "#F2F0E8" : `${PATHS[openPath].tint}0E` }}
    >
      <style>{`
        @keyframes tatva-flow { to { stroke-dashoffset: -28; } }
        @keyframes tatva-breathe { 0%,100% { opacity: .4 } 50% { opacity: 1 } }
        @media (prefers-reduced-motion: reduce) {
          .tatva-flow, .tatva-breathe { animation: none !important; }
        }
      `}</style>

      <div className="grid lg:grid-cols-[minmax(0,1fr)_minmax(0,1.4fr)]">
        <div className="flex items-center px-6 pb-4 pt-14 sm:px-12 lg:px-14 lg:py-14">
          <div className="max-w-sm">
            <p className="text-xs font-medium uppercase tracking-[0.25em]" style={{ color: "#8a6b3d" }}>
              Three paths
            </p>
            <h2 className="mt-4 font-display text-[clamp(1.9rem,3.6vw,3rem)] font-normal leading-[1.1] text-soil">
              The work meets the business wherever it stands.
            </h2>
            <span aria-hidden="true" className="mt-5 block h-px w-14" style={{ backgroundColor: "#C6A97A" }} />
            <p className="mt-5 text-sm leading-relaxed text-foreground-secondary">
              Three starting points, the same six stages underneath, one place they all arrive.
            </p>
            <p className="mt-6 text-xs uppercase tracking-[0.16em] text-foreground-secondary/70">
              Hover a path to follow it
            </p>
          </div>
        </div>

        {/* The explainer: where each path enters, what it moves through,
            and where all three arrive. */}
        <div className="flex items-center px-4 pb-6 sm:px-8 lg:py-14">
          <svg
            viewBox="0 0 900 300"
            className="h-auto w-full"
            role="img"
            aria-label="Three starting points running through the same stages toward one recognised brand"
          >
            {CURVES.map((d, i) => {
              const on = openPath === null || openPath === i;
              return (
                <g key={i}>
                  <path d={d} fill="none" stroke={PATHS[i].tint} strokeWidth={1} opacity={on ? 0.3 : 0.08} style={{ transition: "opacity 500ms" }} />
                  <path
                    className="tatva-flow"
                    d={d}
                    fill="none"
                    stroke={PATHS[i].tint}
                    strokeWidth={openPath === i ? 2.2 : 1.3}
                    strokeLinecap="round"
                    strokeDasharray="5 9"
                    opacity={on ? 1 : 0.12}
                    style={{
                      animation: `tatva-flow ${openPath === i ? 1.1 : 2.6}s linear infinite`,
                      transition: "opacity 500ms, stroke-width 500ms",
                    }}
                  />
                </g>
              );
            })}

            {PATHS.map((p, i) => {
              const on = openPath === null || openPath === i;
              return (
                <g key={p.n} opacity={on ? 1 : 0.22} style={{ transition: "opacity 500ms" }}>
                  <circle
                    className="tatva-breathe"
                    cx={150}
                    cy={ENTRY_Y[i]}
                    r={6}
                    fill={p.tint}
                    style={{ animation: `tatva-breathe 3.6s ease-in-out ${i * 0.5}s infinite` }}
                  />
                  <text x={132} y={ENTRY_Y[i] + 5} textAnchor="end" fontSize={15} fill="#27221E" opacity={0.78}>
                    {p.start}
                  </text>
                </g>
              );
            })}

            {/* The trunk: the stages this path actually runs through */}
            <line x1={330} y1={150} x2={650} y2={150} stroke="#C6A97A" strokeWidth={1.6} strokeLinecap="round" />
            {PATHS[shown].route.map((step, s) => (
              <g key={step}>
                <circle cx={380 + s * 100} cy={150} r={4.5} fill="#C6A97A" />
                <text x={380 + s * 100} y={128} textAnchor="middle" fontSize={13} fill="#27221E" opacity={0.72}>
                  {step}
                </text>
              </g>
            ))}

            {/* The outcome */}
            <circle cx={690} cy={150} r={30} fill="none" stroke="#C6A97A" strokeWidth={1.2} opacity={0.45} />
            <circle className="tatva-breathe" cx={690} cy={150} r={8} fill="#C6A97A" style={{ animation: "tatva-breathe 3.6s ease-in-out infinite" }} />
            <text x={734} y={145} fontSize={19} fill="#27221E" className="font-display">
              A brand people
            </text>
            <text x={734} y={170} fontSize={19} fill="#27221E" className="font-display">
              recognise
            </text>
          </svg>
        </div>
      </div>

      <div className="relative px-6 pb-14 sm:px-10">
        <ul className="mx-auto grid max-w-6xl gap-5 lg:grid-cols-3">
          {PATHS.map((p, i) => {
            const dimmed = openPath !== null && openPath !== i;
            return (
              <li
                key={p.n}
                className="transition-all duration-500"
                style={{ opacity: dimmed ? 0.42 : 1, filter: dimmed ? "saturate(0.5)" : "none" }}
              >
                <Link
                  href={p.href}
                  onMouseEnter={() => setOpenPath(i)}
                  onMouseLeave={() => setOpenPath(null)}
                  onFocus={() => setOpenPath(i)}
                  onBlur={() => setOpenPath(null)}
                  className="group flex h-full flex-col rounded-2xl border p-7 transition-all duration-500 hover:-translate-y-1"
                  style={{
                    borderColor: openPath === i ? `${p.tint}55` : "rgba(39,34,30,0.10)",
                    backgroundColor: openPath === i ? "rgba(255,255,255,0.85)" : "rgba(255,255,255,0.55)",
                    boxShadow: openPath === i ? `0 24px 60px -30px ${p.tint}88` : "none",
                  }}
                >
                  <span className="flex items-center gap-4">
                    <span className="rounded-2xl px-2.5 py-1 font-display text-sm text-ivory" style={{ backgroundColor: p.tint }}>
                      {p.n}
                    </span>
                    <span className="flex h-14 w-14 items-center justify-center rounded-full border border-soil/12">
                      <svg viewBox="0 0 40 40" className="h-7 w-7" fill="none" stroke={p.tint} strokeWidth="1.1" strokeLinecap="round" strokeLinejoin="round">
                        {p.icon}
                      </svg>
                    </span>
                  </span>
                  <span className="mt-5 block font-display text-2xl font-normal leading-tight text-soil">{p.title}</span>
                  <span className="mt-3 block text-sm leading-relaxed text-foreground-secondary">{p.body}</span>
                  <span className="mt-auto pt-6 text-xs font-medium uppercase tracking-[0.16em]" style={{ color: p.tint }}>
                    Explore path{" "}
                    <span aria-hidden="true" className="inline-block transition-transform duration-300 group-hover:translate-x-1">→</span>
                  </span>
                </Link>
              </li>
            );
          })}
        </ul>

        <div className="mt-10 flex flex-wrap items-center justify-center gap-4 text-xs uppercase tracking-[0.16em] text-foreground-secondary">
          <span>Unsure where to start?</span>
          <span aria-hidden="true" className="h-4 w-px bg-soil/20" />
          <Link href="/services#health" className="link-underline font-medium" style={{ color: "#8a6b3d" }}>
            Take the clarity check <span aria-hidden="true">→</span>
          </Link>
        </div>
      </div>
    </section>
  );
}
