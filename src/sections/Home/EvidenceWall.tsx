"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Container } from "@/components/Container";
import { Reveal } from "@/components/Reveal";
import { BackgroundVideo } from "@/components/BackgroundVideo";
import { projects } from "@/data/projects";
import { ProjectFile } from "@/sections/Home/ProjectFile";

const ACTION: Record<string, string> = {
  "dr-haley-nutrition": "Watch the story",
  "myshopineurope": "Open the file",
  "executive-springboard": "View the case",
  herbalcart: "View the case",
  "plaxonic-content-portfolio": "Open the file",
};

const DECISION: Record<string, { big: string; label: string }> = {
  myshopineurope: { big: "Craft over price", label: "the positioning refusal that reframed the platform" },
  "executive-springboard": { big: "Registrations", label: "content built to end in one, well past a like" },
  herbalcart: { big: "Wellness first", label: "perception moved from herbal supplement to modern brand" },
};

export function EvidenceWall() {
  const [openSlug, setOpenSlug] = useState<string | null>(null);

  return (
    <section className="relative overflow-hidden bg-soil py-16 sm:py-24">
      <BackgroundVideo
        video="/videos/pexels-fog-sunrise.mp4"
        videoWebm="/videos/pexels-fog-sunrise.webm"
        poster="/images/pexels-fog-sunrise-poster.jpg"
      />
      <div className="absolute inset-0 bg-soil/85" />

      <Container className="relative max-w-[100rem]">
        <div className="flex flex-col gap-10 lg:flex-row lg:items-center lg:gap-14">
          <Reveal className="lg:w-80 lg:shrink-0">
            <div className="flex gap-5">
              <div aria-hidden="true" className="hidden flex-col items-center pt-2 sm:flex">
                <span className="font-display text-xs text-ivory/50">01</span>
                <span className="my-2 h-16 w-px bg-ivory/25" />
                <span className="h-1.5 w-1.5 rounded-full bg-sandstone" />
                <span className="my-2 h-16 w-px bg-ivory/25" />
                <span className="font-display text-xs text-ivory/50">{String(projects.length).padStart(2, "0")}</span>
              </div>

              <div>
                <p className="text-sm font-medium uppercase tracking-[0.2em] text-sandstone">The work</p>
                <h2 className="mt-3 font-display text-display-sm font-normal leading-[1.05] text-ivory lg:text-display-md">
                  Evidence.
                  <br />
                  Not Portfolio.
                </h2>
                <p className="mt-4 max-w-xs text-sm leading-relaxed text-ivory/75">
                  Real projects. Real numbers. Every detail documented.
                </p>
                <Link
                  href="/work"
                  className="link-underline mt-6 inline-flex items-center gap-2 text-sm font-medium uppercase tracking-[0.14em] text-sandstone transition-colors duration-300 hover:text-ivory"
                >
                  Explore the archive <span aria-hidden="true">→</span>
                </Link>
              </div>
            </div>
          </Reveal>

          <Reveal delay={0.1} className="min-w-0 lg:flex-1">
            <ul className="-mx-2 flex snap-x snap-mandatory gap-4 overflow-x-auto px-2 pb-4" aria-label="Project archive">
              {projects.map((project) => {
                const stat = project.stats?.[0];
                const fallback = DECISION[project.slug];

                return (
                  <li
                    key={project.slug}
                    className="group w-64 shrink-0 snap-start transition-transform duration-500 ease-out hover:z-10 hover:scale-[1.04] sm:w-72"
                  >
                    <div
                      className="flex h-full flex-col overflow-hidden rounded-2xl border border-ivory/12 transition-[border-color,box-shadow] duration-300 group-hover:border-sandstone/60"
                      style={{ backgroundColor: "rgba(244,239,230,0.05)", boxShadow: "0 0 0 rgba(0,0,0,0)" }}
                    >
                      <button
                        type="button"
                        onClick={() => setOpenSlug(project.slug)}
                        className="flex w-full flex-1 flex-col text-left focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-sandstone"
                        aria-label={`Open project file for ${project.title}`}
                      >
                        <span
                          className="relative block h-36 w-full overflow-hidden"
                          style={{ backgroundColor: project.accent }}
                        >
                          {project.cardImage && (
                            <Image
                              src={project.cardImage}
                              alt=""
                              fill
                              sizes="288px"
                              style={{ objectFit: "cover" }}
                              className="transition-transform duration-700 group-hover:scale-[1.04]"
                            />
                          )}
                        </span>

                        <span className="flex flex-1 flex-col px-5 pb-3 pt-5">
                          <span className="text-[0.62rem] font-medium uppercase tracking-[0.2em] text-ivory/60">
                            {project.title}
                          </span>
                          <span className="mt-2 font-display text-3xl font-normal leading-none text-ivory sm:text-4xl">
                            {stat ? stat.value : fallback?.big}
                          </span>
                          <span className="mt-2 text-xs leading-relaxed text-ivory/70">
                            {stat ? stat.label : fallback?.label}
                          </span>
                          <span className="mt-auto pt-4 text-[0.65rem] uppercase tracking-[0.15em] text-ivory/50">
                            {project.industry}
                          </span>
                        </span>
                      </button>

                      <Link
                        href={`/work/${project.slug}`}
                        className="mx-5 mb-5 inline-flex items-center gap-2 self-start text-xs font-medium uppercase tracking-[0.15em] transition-colors duration-300 hover:text-ivory focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-sandstone"
                        style={{ color: project.accent }}
                      >
                        {ACTION[project.slug] ?? "View the case"}
                        <span aria-hidden="true" className="transition-transform duration-300 group-hover:translate-x-1">
                          →
                        </span>
                      </Link>
                    </div>
                  </li>
                );
              })}
            </ul>
          </Reveal>
        </div>
      </Container>

      <ProjectFile project={projects.find((project) => project.slug === openSlug) ?? null} onClose={() => setOpenSlug(null)} />
    </section>
  );
}
