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
    tint: "#8B6045",
    route: ["Question", "Position", "Build", "Launch"],
    outcome: "A brand people can understand before they are asked to buy.",
  },
  {
    n: "02",
    title: "Reposition the whole system",
    body: "For an existing brand whose offer, identity and communication no longer point in one direction.",
    start: "Drift",
    finish: "Coherence",
    href: "/services#situation",
    tint: "#6C7D5A",
    route: ["Decode", "Refuse", "Align", "Signal"],
    outcome: "Recognition begins compounding instead of restarting on every channel.",
  },
  {
    n: "03",
    title: "Keep the brand coherent in motion",
    body: "For a sound brand that needs ongoing content, judgement and consistency across changing channels.",
    start: "Momentum",
    finish: "Memory",
    href: "/services#offerings",
    tint: "#B28B4D",
    route: ["Plan", "Create", "Learn", "Compound"],
    outcome: "Every new piece strengthens the same meaning instead of adding another personality.",
  },
] as const;

const SITUATION_TO_PATH: Record<string, number> = { idea: 0, inconsistent: 1, outgrown: 1 };
const SITUATION_COPY: Record<string, string> = {
  idea: "You said the business keeps changing direction before anything settles.",
  inconsistent: "You said people see the brand, but every version feels different.",
  outgrown: "You said the business has grown while the brand still looks behind.",
};

export function ThreePathsSection() {
  const [recommendedPath, setRecommendedPath] = useState(1);
  const [situation, setSituation] = useState<string | null>(null);
  const [activePath, setActivePath] = useState(1);

  useEffect(() => {
    try {
      const saved = window.localStorage.getItem(SITUATION_KEY);
      if (!saved) return;
      setSituation(saved);
      const recommendation = SITUATION_TO_PATH[saved] ?? 1;
      setRecommendedPath(recommendation);
      setActivePath(recommendation);
    } catch {}
  }, []);

  const active = PATHS[activePath];

  function choosePath(index: number) {
    setActivePath(index);
    track("service_path_opened", {
      path: PATHS[index].title,
      recommended: index === recommendedPath,
      page: "home",
    });
  }

  return (
    <section className="bg-[#ECE7DC] px-6 py-20 text-soil sm:px-10 sm:py-28 lg:px-14">
      <div className="mx-auto max-w-[92rem]">
        <div className="grid gap-10 border-b border-soil/12 pb-10 lg:grid-cols-[.8fr_1.2fr] lg:items-end">
          <div>
            <p className="text-[0.62rem] font-medium uppercase tracking-[0.24em] text-soil/48">Three ways into the work</p>
            <p className="mt-4 max-w-md text-sm leading-relaxed text-soil/60 sm:text-base">
              {situation
                ? SITUATION_COPY[situation]
                : "Most businesses do not need more output first. They need to know which problem the output is meant to solve."}
            </p>
          </div>
          <h2 className="font-display text-[clamp(3rem,7vw,7rem)] leading-[0.88] tracking-[-0.05em] lg:text-right">
            The right scope begins where the signal breaks.
          </h2>
        </div>

        <div className="mt-10 grid gap-4 lg:grid-cols-3">
          {PATHS.map((path, index) => {
            const activeCard = index === activePath;
            const recommended = index === recommendedPath;
            return (
              <button
                key={path.n}
                type="button"
                onClick={() => choosePath(index)}
                aria-pressed={activeCard}
                className={`min-h-[18rem] rounded-[2rem] border p-6 text-left transition-all duration-300 sm:p-8 ${activeCard ? "-translate-y-1 border-soil/30 bg-white/65 shadow-[0_22px_70px_rgba(61,48,38,.12)]" : "border-soil/12 bg-white/25 hover:border-soil/25 hover:bg-white/45"}`}
              >
                <div className="flex items-center justify-between gap-4">
                  <span className="text-[0.62rem] uppercase tracking-[0.2em] text-soil/42">{path.n}</span>
                  {recommended && (
                    <span className="rounded-full px-3 py-1 text-[0.58rem] uppercase tracking-[0.14em] text-white" style={{ backgroundColor: path.tint }}>
                      Recommended
                    </span>
                  )}
                </div>
                <p className="mt-8 text-[0.62rem] uppercase tracking-[0.2em]" style={{ color: path.tint }}>
                  {path.start} → {path.finish}
                </p>
                <h3 className="mt-4 font-display text-[clamp(2.1rem,3.2vw,3.7rem)] leading-[0.96] tracking-[-0.035em]">{path.title}</h3>
                <p className="mt-5 text-sm leading-relaxed text-soil/60 sm:text-base">{path.body}</p>
              </button>
            );
          })}
        </div>

        <div className="mt-8 rounded-[2rem] border border-soil/12 bg-white/45 p-6 sm:p-8 lg:p-10">
          <div className="grid gap-8 lg:grid-cols-[1fr_auto] lg:items-end">
            <div>
              <p className="text-[0.62rem] uppercase tracking-[0.2em]" style={{ color: active.tint }}>
                {active.start} becomes {active.finish}
              </p>
              <h3 className="mt-3 font-display text-[clamp(2.6rem,5vw,5.2rem)] leading-[0.92] tracking-[-0.045em]">{active.title}</h3>
              <p className="mt-5 max-w-3xl text-base leading-relaxed text-soil/64">{active.outcome}</p>

              <div className="mt-7 flex flex-wrap gap-3">
                {active.route.map((step, index) => (
                  <span key={step} className="inline-flex items-center gap-3 rounded-full border border-soil/12 bg-white/55 px-4 py-3 text-xs uppercase tracking-[0.14em] text-soil/58">
                    <span className="text-soil/35">0{index + 1}</span>{step}
                  </span>
                ))}
              </div>
            </div>

            <Link
              href={active.href}
              onClick={() => choosePath(activePath)}
              className="inline-flex min-h-12 items-center justify-center rounded-full bg-soil px-6 text-xs font-medium uppercase tracking-[0.17em] text-ivory transition-transform hover:-translate-y-0.5"
            >
              Enter this route →
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
