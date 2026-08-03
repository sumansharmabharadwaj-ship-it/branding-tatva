"use client";

import { useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { KenBurnsImage } from "@/components/KenBurnsImage";
import { credentials } from "@/data/about";

const LENSES = [
  {
    id: "notice",
    number: "01",
    label: "Notice",
    discipline: "Clinical psychology",
    question: "What is the audience attending to, avoiding, or misreading?",
    catches: "Assumptions disguised as insight. Messaging that asks for trust before it has earned attention.",
    changes: "The positioning begins with observable behaviour rather than a founder's preferred description of the business.",
    verb: "Observe",
  },
  {
    id: "name",
    number: "02",
    label: "Name",
    discipline: "English literature",
    question: "Which words carry the meaning, and which words merely decorate it?",
    catches: "Generic language, borrowed category phrases, and a voice that changes every time the channel changes.",
    changes: "The brand gains a verbal centre: one idea, one rhythm, many expressions without losing recognition.",
    verb: "Distil",
  },
  {
    id: "direct",
    number: "03",
    label: "Direct",
    discipline: "Filmmaking and content systems",
    question: "What should the audience see, feel, and do next?",
    catches: "Beautiful outputs with no sequence, no tension, and no commercial destination.",
    changes: "Every asset becomes part of a journey, from first attention to a believable next action.",
    verb: "Sequence",
  },
] as const;

export function StudioTriptych() {
  const [selected, setSelected] = useState<(typeof LENSES)[number]["id"]>("notice");
  const prefersReducedMotion = useReducedMotion();
  const active = LENSES.find((lens) => lens.id === selected) ?? LENSES[0];
  const featuredCredentials = credentials.filter((credential) => credential.featured);

  return (
    <section className="relative overflow-hidden bg-[#ede8dc] text-soil">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-70"
        style={{
          background:
            "radial-gradient(circle at 14% 15%, rgba(184,90,52,0.12), transparent 30%), radial-gradient(circle at 82% 70%, rgba(198,169,122,0.18), transparent 34%)",
        }}
      />

      <div className="relative grid min-h-[48rem] lg:grid-cols-[0.82fr_1.35fr]">
        <div className="relative min-h-[30rem] overflow-hidden lg:min-h-full">
          <KenBurnsImage
            image="/images/own-portrait.jpg"
            gradient="linear-gradient(to top, rgba(20,18,16,0.78) 0%, rgba(20,18,16,0.12) 58%, rgba(20,18,16,0.04) 100%)"
            imagePosition="center 28%"
            className="absolute inset-0 h-full w-full"
            sizes="(min-width: 1024px) 42vw, 100vw"
          />

          <div className="absolute inset-x-0 bottom-0 p-6 sm:p-10 lg:p-12">
            <p className="text-[0.65rem] font-medium uppercase tracking-[0.28em] text-sandstone">The practitioner behind the work</p>
            <h2 className="mt-4 max-w-lg font-display text-[clamp(2.4rem,5vw,4.8rem)] font-normal leading-[0.98] text-ivory">
              I study attention before I design expression.
            </h2>
            <p className="mt-5 max-w-md text-sm leading-relaxed text-ivory/72 sm:text-base">
              Psychology explains how people notice and decide. Literature explains how language carries meaning. Direction turns both into a system a business can actually use.
            </p>
          </div>
        </div>

        <div className="flex flex-col px-6 py-14 sm:px-10 sm:py-20 lg:px-14 xl:px-20">
          <div className="flex flex-col gap-6 border-b border-soil/12 pb-8 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-xs font-medium uppercase tracking-[0.26em] text-[#8a6b3d]">A method, not a biography</p>
              <h3 className="mt-3 max-w-2xl font-display text-[clamp(2rem,4vw,3.7rem)] font-normal leading-[1.02]">
                Three disciplines. One commercial judgement.
              </h3>
            </div>
            <div className="space-y-2 text-right text-[0.67rem] uppercase tracking-[0.16em] text-soil/52">
              {featuredCredentials.map((credential) => (
                <p key={credential.label}>
                  {credential.label}
                  <span className="ml-2 text-soil/34">{credential.detail}</span>
                </p>
              ))}
            </div>
          </div>

          <div className="mt-8 grid gap-8 xl:grid-cols-[0.72fr_1.28fr]">
            <div role="tablist" aria-label="Suman's strategic lenses" className="space-y-2">
              {LENSES.map((lens) => {
                const isActive = lens.id === selected;
                return (
                  <button
                    key={lens.id}
                    type="button"
                    role="tab"
                    aria-selected={isActive}
                    onClick={() => setSelected(lens.id)}
                    className={`group flex w-full items-center gap-4 rounded-2xl border px-4 py-4 text-left transition-all duration-500 ${
                      isActive
                        ? "translate-x-1 border-soil/20 bg-soil text-ivory shadow-[0_20px_50px_-32px_rgba(31,26,20,0.65)]"
                        : "border-transparent bg-white/28 hover:border-soil/12 hover:bg-white/52"
                    }`}
                  >
                    <span className={`font-display text-sm ${isActive ? "text-sandstone" : "text-soil/42"}`}>{lens.number}</span>
                    <span className="min-w-0 flex-1">
                      <span className="block font-display text-2xl leading-none">{lens.label}</span>
                      <span className={`mt-1 block text-xs ${isActive ? "text-ivory/58" : "text-soil/48"}`}>{lens.discipline}</span>
                    </span>
                    <span aria-hidden="true" className={`transition-transform duration-300 ${isActive ? "translate-x-0 text-sandstone" : "-translate-x-1 text-soil/25 group-hover:translate-x-0"}`}>
                      →
                    </span>
                  </button>
                );
              })}
            </div>

            <div className="relative min-h-[29rem] overflow-hidden rounded-3xl border border-soil/12 bg-white/52 p-6 shadow-[0_28px_80px_-52px_rgba(43,35,27,0.45)] sm:p-8">
              <div className="absolute right-0 top-0 h-40 w-40 rounded-full bg-[#c6a97a]/18 blur-3xl" aria-hidden="true" />

              <AnimatePresence mode="wait">
                <motion.div
                  key={active.id}
                  role="tabpanel"
                  initial={prefersReducedMotion ? undefined : { opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={prefersReducedMotion ? undefined : { opacity: 0, y: -10 }}
                  transition={{ duration: prefersReducedMotion ? 0 : 0.48, ease: [0.22, 1, 0.36, 1] }}
                  className="relative flex h-full flex-col"
                >
                  <div className="flex items-start justify-between gap-6">
                    <div>
                      <p className="text-[0.65rem] font-medium uppercase tracking-[0.22em] text-[#8a6b3d]">Working lens</p>
                      <p className="mt-2 font-display text-4xl">{active.verb}</p>
                    </div>
                    <span className="flex h-14 w-14 items-center justify-center rounded-full border border-soil/12 font-display text-lg text-[#8a6b3d]">
                      {active.number}
                    </span>
                  </div>

                  <div className="mt-8 space-y-7">
                    <div>
                      <p className="text-[0.64rem] uppercase tracking-[0.2em] text-soil/38">The question</p>
                      <p className="mt-2 font-display text-2xl leading-snug">{active.question}</p>
                    </div>
                    <div className="grid gap-6 border-t border-soil/10 pt-6 sm:grid-cols-2">
                      <div>
                        <p className="text-[0.64rem] uppercase tracking-[0.2em] text-soil/38">The blind spot it catches</p>
                        <p className="mt-3 text-sm leading-relaxed text-soil/68">{active.catches}</p>
                      </div>
                      <div>
                        <p className="text-[0.64rem] uppercase tracking-[0.2em] text-soil/38">The decision it improves</p>
                        <p className="mt-3 text-sm leading-relaxed text-soil/68">{active.changes}</p>
                      </div>
                    </div>
                  </div>

                  <div className="mt-auto border-t border-soil/10 pt-6">
                    <p className="font-display text-xl italic text-soil/76">
                      Observe widely. Decide narrowly. Repeat coherently.
                    </p>
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>
          </div>

          <div className="mt-9 flex flex-col gap-4 border-t border-soil/12 pt-7 sm:flex-row sm:items-center sm:justify-between">
            <p className="max-w-xl text-sm leading-relaxed text-soil/58">
              The value is not having three interests. It is knowing which one should lead at each decision.
            </p>
            <Link href="/about" className="link-underline inline-flex items-center gap-2 text-sm font-medium text-[#8a6b3d]">
              Read the full practice <span aria-hidden="true">→</span>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
