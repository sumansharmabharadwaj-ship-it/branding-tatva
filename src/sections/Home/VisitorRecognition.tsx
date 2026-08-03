"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Container } from "@/components/Container";
import { track } from "@/lib/analytics";

const STATES = [
  {
    id: "idea",
    number: "01",
    label: "We keep changing direction before anything settles",
    stage: "Building from an idea",
    symptom: "Too many possibilities. No governing decision yet.",
    path: "Foundation",
    pathNote: "Discovery, positioning, core identity, and the first usable brand system.",
    outcome: "A business people can understand before they are asked to buy.",
    proof: { slug: "myshopineurope", title: "MyShopInEurope" },
  },
  {
    id: "inconsistent",
    number: "02",
    label: "People see us, but every version feels different",
    stage: "An existing brand without one system",
    symptom: "Every channel is active. None of them feel related.",
    path: "Full Brand System",
    pathNote: "Audit, repositioning, verbal identity, and alignment across every customer-facing surface.",
    outcome: "Recognition begins compounding instead of restarting on every channel.",
    proof: { slug: "herbalcart", title: "HerbalCart" },
  },
  {
    id: "outgrown",
    number: "03",
    label: "The business has grown, but the brand still looks behind",
    stage: "A mature offer inside an earlier identity",
    symptom: "The offer has matured. The brand still describes an earlier version.",
    path: "Full Brand System",
    pathNote: "Strategic audit, repositioning, identity refinement, and an implementation system for the next stage.",
    outcome: "The brand catches up with the quality already present in the business.",
    proof: { slug: "dr-haley-nutrition", title: "Dr. Haley Nutrition" },
  },
] as const;

export const SITUATION_KEY = "bt-situation";
type SituationId = (typeof STATES)[number]["id"];

export function VisitorRecognition() {
  const [selected, setSelected] = useState<SituationId>(STATES[0].id);

  useEffect(() => {
    try {
      const saved = window.localStorage.getItem(SITUATION_KEY) as SituationId | null;
      if (saved && STATES.some((state) => state.id === saved)) setSelected(saved);
    } catch {}
  }, []);

  function pick(id: SituationId) {
    setSelected(id);
    track("visitor_situation_selected", { situation: id, page: "home" });
    try {
      window.localStorage.setItem(SITUATION_KEY, id);
    } catch {}
  }

  const active = STATES.find((state) => state.id === selected) ?? STATES[0];

  return (
    <section className="bg-soil py-24 text-ivory sm:py-32">
      <Container className="max-w-[88rem]">
        <div className="grid gap-14 lg:grid-cols-[0.78fr_1.22fr] lg:gap-20">
          <div className="lg:sticky lg:top-28 lg:self-start">
            <p className="text-[0.65rem] font-medium uppercase tracking-[0.32em] text-sandstone">
              The mind answers before the mouth does
            </p>
            <h2 className="mt-5 max-w-xl font-display text-[clamp(3rem,6vw,6rem)] font-normal leading-[0.92] tracking-[-0.045em]">
              Which sentence feels a little <span className="italic text-clay">too familiar?</span>
            </h2>
            <p className="mt-7 max-w-md text-sm leading-relaxed text-ivory/62 sm:text-base">
              Choose the one that catches first. The result below updates immediately and stays in view.
            </p>
          </div>

          <div>
            <div className="space-y-3" role="list" aria-label="Choose the situation that best describes your brand">
              {STATES.map((state) => {
                const activeState = state.id === selected;
                return (
                  <button
                    key={state.id}
                    type="button"
                    onClick={() => pick(state.id)}
                    aria-pressed={activeState}
                    className={`w-full rounded-[1.5rem] border p-6 text-left transition-colors duration-300 sm:p-8 ${
                      activeState
                        ? "border-sandstone/70 bg-ivory/[0.08]"
                        : "border-ivory/12 bg-ivory/[0.025] hover:border-ivory/28 hover:bg-ivory/[0.05]"
                    }`}
                  >
                    <span className="block text-[0.62rem] uppercase tracking-[0.24em] text-sandstone/70">
                      {state.number} · {state.stage}
                    </span>
                    <span className="mt-3 block font-display text-[clamp(1.8rem,3.1vw,3.6rem)] leading-[1.02] tracking-[-0.03em]">
                      “{state.label}”
                    </span>
                  </button>
                );
              })}
            </div>

            <div className="mt-6 rounded-[1.75rem] border border-ivory/14 bg-black/15 p-6 sm:p-8">
              <div className="grid gap-7 md:grid-cols-2">
                <div>
                  <p className="text-[0.6rem] uppercase tracking-[0.24em] text-ivory/40">The likely gap</p>
                  <p className="mt-3 font-display text-3xl text-ivory sm:text-4xl">{active.path}</p>
                  <p className="mt-3 text-sm leading-relaxed text-ivory/62">{active.symptom}</p>
                </div>
                <div>
                  <p className="text-[0.6rem] uppercase tracking-[0.24em] text-ivory/40">What changes</p>
                  <p className="mt-3 text-base leading-relaxed text-ivory/82">{active.outcome}</p>
                  <p className="mt-3 text-sm leading-relaxed text-ivory/48">{active.pathNote}</p>
                </div>
              </div>
              <div className="mt-7 flex flex-wrap gap-3">
                <Link href={`/work/${active.proof.slug}`} className="inline-flex min-h-11 items-center justify-center rounded-full bg-sandstone px-5 text-xs font-medium uppercase tracking-[0.14em] text-soil">
                  See {active.proof.title} ↗
                </Link>
                <Link href="/services" className="inline-flex min-h-11 items-center justify-center rounded-full border border-ivory/22 px-5 text-xs font-medium uppercase tracking-[0.14em] text-ivory/80">
                  Trace the path →
                </Link>
              </div>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
