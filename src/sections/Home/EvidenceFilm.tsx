"use client";

import { useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { BackgroundVideo } from "@/components/BackgroundVideo";
import { Container } from "@/components/Container";
import { LinkButton } from "@/components/Button";
import type { Project } from "@/data/projects";

const LAYERS = [
  { key: "challenge", label: "What was visible" },
  { key: "insight", label: "What the surface concealed" },
  { key: "strategy", label: "The decision beneath the work" },
  { key: "outcome", label: "What the evidence supports" },
] as const;

type LayerKey = (typeof LAYERS)[number]["key"];

function shorten(value: string | undefined, max = 285) {
  if (!value) return "This layer is documented inside the complete case study.";
  if (value.length <= max) return value;
  const cut = value.slice(0, max).lastIndexOf(" ");
  return `${value.slice(0, cut > 0 ? cut : max).trim()}…`;
}

export function EvidenceFilm({ projects }: { projects: Project[] }) {
  const reduce = useReducedMotion();
  const [activeProject, setActiveProject] = useState(0);
  const [activeLayer, setActiveLayer] = useState<LayerKey>("challenge");
  const selected = projects[activeProject] ?? projects[0];

  if (!selected || !selected.cardVideo || !selected.cardImage) return null;

  const stat = selected.stats?.[0];
  const layer = LAYERS.find((item) => item.key === activeLayer) ?? LAYERS[0];
  const layerText = selected[activeLayer];

  function chooseProject(index: number) {
    setActiveProject(index);
    setActiveLayer("challenge");
  }

  return (
    <section className="relative isolate overflow-hidden bg-[#101813] py-24 text-ivory sm:py-32 lg:py-40">
      <BackgroundVideo
        video="/videos/pexels-still-water-reflection.mp4"
        poster="/images/pexels-still-water-reflection-poster.jpg"
        imagePosition="50% 48%"
        parallax
      />
      <div className="absolute inset-0 bg-[linear-gradient(110deg,rgba(12,23,17,.96)_0%,rgba(12,23,17,.83)_48%,rgba(12,23,17,.68)_100%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_78%_40%,rgba(198,169,122,.14),transparent_34%)]" />

      <Container className="relative max-w-[92rem]">
        <div className="grid gap-10 lg:grid-cols-[0.74fr_1.26fr] lg:items-end lg:gap-20">
          <div>
            <p className="text-[0.64rem] font-medium uppercase tracking-[0.3em] text-sandstone">Scene three · evidence</p>
            <h2 className="mt-5 max-w-3xl font-display text-[clamp(3rem,6.2vw,6.5rem)] font-normal leading-[0.89] tracking-[-0.05em] text-ivory">
              The result is the last thing worth looking at.
            </h2>
          </div>
          <p className="max-w-2xl text-sm leading-relaxed text-ivory/70 sm:text-base lg:justify-self-end">
            Strong branding begins with the ambiguity people can see, then traces the decision that changed what they understood, trusted, and did next.
          </p>
        </div>

        <div className="mt-14 grid gap-5 lg:grid-cols-[0.72fr_1.28fr]">
          <div className="rounded-[1.8rem] border border-ivory/12 bg-soil/58 p-5 backdrop-blur-2xl sm:p-7">
            <p className="text-[0.58rem] uppercase tracking-[0.22em] text-ivory/38">Open a project file</p>
            <div className="mt-5 space-y-3" role="tablist" aria-label="Choose a case study">
              {projects.map((project, index) => {
                const active = index === activeProject;
                return (
                  <button
                    key={project.slug}
                    type="button"
                    role="tab"
                    aria-selected={active}
                    onClick={() => chooseProject(index)}
                    className={`group relative w-full overflow-hidden rounded-[1.25rem] border px-5 py-5 text-left transition-colors duration-500 ${
                      active
                        ? "border-ivory/24 bg-ivory/[0.08]"
                        : "border-ivory/8 bg-black/10 hover:border-ivory/18 hover:bg-ivory/[0.04]"
                    }`}
                  >
                    <motion.span
                      className="absolute inset-y-0 left-0 w-1 origin-bottom"
                      animate={{ backgroundColor: project.accent, scaleY: active ? 1 : 0.16, opacity: active ? 1 : 0.32 }}
                      transition={{ duration: 0.48 }}
                    />
                    <span className="block text-[0.56rem] uppercase tracking-[0.2em] text-ivory/36">
                      0{index + 1} · {project.industry}
                    </span>
                    <span className="mt-2 block font-display text-2xl text-ivory sm:text-3xl">{project.title}</span>
                    <span className="mt-3 block text-xs leading-relaxed text-ivory/48">{project.hook}</span>
                  </button>
                );
              })}
            </div>
            <div className="mt-6">
              <LinkButton href="/work" variant="secondary" className="border-ivory/22 text-ivory hover:bg-ivory/10">
                Enter the complete archive
              </LinkButton>
            </div>
          </div>

          <div className="overflow-hidden rounded-[2rem] border border-ivory/14 bg-[#101813]/76 shadow-2xl backdrop-blur-2xl">
            <div className="relative min-h-[24rem] overflow-hidden sm:min-h-[31rem]">
              <AnimatePresence mode="wait" initial={false}>
                <motion.div
                  key={selected.slug}
                  className="absolute inset-0"
                  initial={reduce ? false : { opacity: 0, scale: 1.04, filter: "blur(10px)" }}
                  animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
                  exit={reduce ? undefined : { opacity: 0, scale: 1.02, filter: "blur(8px)" }}
                  transition={{ duration: reduce ? 0 : 0.72, ease: [0.22, 1, 0.36, 1] }}
                >
                  <BackgroundVideo
                    video={selected.cardVideo}
                    poster={selected.cardImage}
                    imagePosition={selected.cardImagePosition ?? "center"}
                    push
                  />
                  <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(10,16,12,.16),rgba(10,16,12,.26)_42%,rgba(10,16,12,.94)_100%)]" />
                </motion.div>
              </AnimatePresence>

              <div className="absolute inset-x-0 bottom-0 z-10 p-6 sm:p-8 lg:p-10">
                <p className="text-[0.58rem] uppercase tracking-[0.22em] text-sandstone">Current file</p>
                <h3 className="mt-3 max-w-4xl font-display text-[clamp(3rem,7vw,7.2rem)] font-normal leading-[0.86] tracking-[-0.055em] text-ivory">
                  {selected.title}
                </h3>
                <p className="mt-5 max-w-2xl text-sm leading-relaxed text-ivory/70 sm:text-base">{selected.hook}</p>
              </div>
            </div>

            <div className="p-6 sm:p-8 lg:p-10">
              <div className="grid gap-3 sm:grid-cols-4" role="tablist" aria-label="Inspect the case study layers">
                {LAYERS.map((item, index) => {
                  const active = item.key === activeLayer;
                  return (
                    <button
                      key={item.key}
                      type="button"
                      role="tab"
                      aria-selected={active}
                      onClick={() => setActiveLayer(item.key)}
                      className={`rounded-[1rem] border px-4 py-4 text-left transition-colors duration-400 ${
                        active ? "border-ivory/22 bg-ivory/[0.08]" : "border-ivory/8 bg-black/8 hover:border-ivory/16"
                      }`}
                    >
                      <span className="block text-[0.54rem] uppercase tracking-[0.18em] text-ivory/34">0{index + 1}</span>
                      <span className="mt-2 block text-xs leading-relaxed text-ivory/68">{item.label}</span>
                    </button>
                  );
                })}
              </div>

              <AnimatePresence mode="wait" initial={false}>
                <motion.div
                  key={`${selected.slug}-${activeLayer}`}
                  initial={reduce ? false : { opacity: 0, y: 18, filter: "blur(8px)" }}
                  animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                  exit={reduce ? undefined : { opacity: 0, y: -12, filter: "blur(6px)" }}
                  transition={{ duration: reduce ? 0 : 0.58, ease: [0.22, 1, 0.36, 1] }}
                  className="mt-8 grid gap-8 border-t border-ivory/12 pt-8 lg:grid-cols-[1fr_auto] lg:items-end"
                >
                  <div>
                    <p className="text-[0.58rem] uppercase tracking-[0.22em] text-sandstone">{layer.label}</p>
                    <p className="mt-4 max-w-4xl font-display text-[clamp(2rem,4vw,4.2rem)] leading-[1.01] tracking-[-0.035em] text-ivory">
                      {shorten(layerText)}
                    </p>
                  </div>

                  <div className="flex flex-col items-start gap-5 lg:items-end">
                    {activeLayer === "outcome" && stat && (
                      <div className="lg:text-right">
                        <p className="font-display text-5xl text-sandstone sm:text-6xl">{stat.value}</p>
                        <p className="mt-2 max-w-52 text-xs leading-relaxed text-ivory/48">{stat.label}</p>
                      </div>
                    )}
                    <Link href={`/work/${selected.slug}`} className="link-underline text-sm text-ivory/74 hover:text-ivory">
                      Read the complete decision story
                    </Link>
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
