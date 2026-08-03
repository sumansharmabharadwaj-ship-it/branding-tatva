"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";

const LENSES = [
  {
    id: "notice",
    label: "Notice",
    discipline: "Clinical psychology",
    question: "What is the audience attending to, avoiding, or misreading?",
    catches: "Assumptions disguised as insight and messaging that asks for trust before it earns attention.",
    changes: "Positioning begins with observable behaviour, not the founder's preferred description of the business.",
  },
  {
    id: "name",
    label: "Name",
    discipline: "English literature",
    question: "Which words carry the meaning, and which words merely decorate it?",
    catches: "Generic language, borrowed category phrases, and a voice that changes from channel to channel.",
    changes: "The brand gains one verbal centre that can travel without becoming repetitive.",
  },
  {
    id: "direct",
    label: "Direct",
    discipline: "Filmmaking and content systems",
    question: "What should the audience see, feel, and do next?",
    catches: "Beautiful outputs with no sequence, no tension, and no commercial destination.",
    changes: "Every asset becomes part of a journey from first attention to a believable next action.",
  },
] as const;

type LensId = (typeof LENSES)[number]["id"];

export function StudioTriptych() {
  const [activeId, setActiveId] = useState<LensId>("notice");
  const active = LENSES.find((lens) => lens.id === activeId) ?? LENSES[0];

  return (
    <section className="relative overflow-hidden bg-[#151411] text-ivory">
      <div className="grid min-h-[760px] lg:grid-cols-[0.95fr_1.05fr]">
        <div className="relative min-h-[460px] lg:min-h-full">
          <Image
            src="/images/own-portrait.jpg"
            alt="Suman Sharma, founder of Branding Tatva"
            fill
            sizes="(min-width: 1024px) 48vw, 100vw"
            className="object-cover"
            style={{ objectPosition: "center 28%" }}
          />
          <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(15,14,12,.18),rgba(15,14,12,.78))] lg:bg-[linear-gradient(90deg,rgba(15,14,12,.08),rgba(15,14,12,.78))]" />
          <div className="absolute inset-x-6 bottom-8 sm:inset-x-10">
            <p className="text-[0.62rem] font-medium uppercase tracking-[0.28em] text-sandstone">The author behind the system</p>
            <h2 className="mt-4 max-w-3xl font-display text-[clamp(2.9rem,6vw,6.8rem)] font-normal leading-[0.9] tracking-[-0.045em]">
              I study attention before I design expression.
            </h2>
          </div>
        </div>

        <div className="flex items-center px-6 py-16 sm:px-10 lg:px-14 lg:py-20">
          <div className="w-full max-w-2xl">
            <p className="text-[0.62rem] font-medium uppercase tracking-[0.24em] text-sandstone">{active.discipline}</p>
            <h3 className="mt-5 font-display text-[clamp(2.2rem,4.5vw,4.8rem)] font-normal leading-[0.96] tracking-[-0.04em]">
              {active.question}
            </h3>

            <div className="mt-10 grid gap-8 sm:grid-cols-2">
              <div>
                <p className="text-[0.62rem] uppercase tracking-[0.2em] text-ivory/38">The blind spot it catches</p>
                <p className="mt-3 text-sm leading-relaxed text-ivory/68 sm:text-base">{active.catches}</p>
              </div>
              <div>
                <p className="text-[0.62rem] uppercase tracking-[0.2em] text-ivory/38">The decision it changes</p>
                <p className="mt-3 text-sm leading-relaxed text-ivory/68 sm:text-base">{active.changes}</p>
              </div>
            </div>

            <div className="mt-10 flex flex-wrap gap-2" aria-label="Choose a working lens">
              {LENSES.map((lens) => (
                <button
                  key={lens.id}
                  type="button"
                  onClick={() => setActiveId(lens.id)}
                  aria-pressed={activeId === lens.id}
                  className={`min-h-11 rounded-full border px-5 text-[0.62rem] font-medium uppercase tracking-[0.16em] transition-colors duration-200 ${
                    activeId === lens.id
                      ? "border-sandstone bg-sandstone text-soil"
                      : "border-ivory/20 text-ivory/58 hover:border-ivory/45 hover:text-ivory"
                  }`}
                >
                  {lens.label}
                </button>
              ))}
            </div>

            <Link href="/about" className="mt-10 inline-flex text-xs font-medium uppercase tracking-[0.18em] text-sandstone hover:text-ivory">
              Read the full practice ↗
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
