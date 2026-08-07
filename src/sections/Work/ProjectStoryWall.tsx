import Link from "next/link";
import { Container } from "@/components/Container";
import { BackgroundVideo } from "@/components/BackgroundVideo";
import { Reveal } from "@/components/Reveal";
import type { Project } from "@/data/projects";
import { getWorkTaxonomy, WORK_NEEDS } from "@/data/workTaxonomy";
import { WORK } from "@/sections/Work/palette";

const PLACEMENTS = [
  "lg:col-span-7",
  "lg:col-span-5 lg:translate-y-16",
  "lg:col-span-8 lg:col-start-3 lg:mt-10",
] as const;

const RATIOS = ["aspect-[16/10]", "aspect-[4/5]", "aspect-[16/8]"] as const;

function firstSentence(text: string) {
  return text.split(/(?<=\.)\s/)[0];
}

export function ProjectStoryWall({ projects }: { projects: Project[] }) {
  const stories = projects.filter((project) => getWorkTaxonomy(project.slug).tier === "story");

  if (stories.length === 0) return null;

  return (
    <section className="relative overflow-hidden py-20 sm:py-28" style={{ backgroundColor: WORK.mist }}>
      <BackgroundVideo
        video="/videos/generated/bt-work-story-paperlight.mp4"
        poster="/images/generated/bt-work-story-paperlight-poster.jpg"
        parallax
        playbackRate={0.9}
      />
      <div aria-hidden="true" className="absolute inset-0 bg-[#F2F0E8]/84" />
      <Container className="relative max-w-6xl">
        <Reveal>
          <div className="grid gap-6 lg:grid-cols-[1fr_auto] lg:items-end">
            <div>
              <p className="text-sm font-medium uppercase tracking-[0.2em]" style={{ color: WORK.moss }}>
                Project stories
              </p>
              <h2 className="mt-2 max-w-3xl font-display text-display-sm font-normal" style={{ color: WORK.charcoal }}>
                Shorter engagements, told at the depth the evidence can carry.
              </h2>
              <p className="mt-4 max-w-xl text-base leading-relaxed" style={{ color: WORK.wood }}>
                Each story names the actual problem, the decision made, and the useful outcome without dressing a focused engagement as a theatrical transformation.
              </p>
            </div>
            <p className="text-xs uppercase tracking-[0.18em]" style={{ color: WORK.stone }}>
              {String(stories.length).padStart(2, "0")} recorded stories
            </p>
          </div>
        </Reveal>

        <div className="mt-12 grid gap-8 lg:grid-cols-12 lg:gap-7">
          {stories.map((project, index) => {
            const record = getWorkTaxonomy(project.slug);
            const needs = record.needs.map((needId) => {
              const need = WORK_NEEDS.find((item) => item.id === needId);
              return need ? need.label : needId;
            });
            const placement = PLACEMENTS[index] ?? "lg:col-span-6";
            const ratio = RATIOS[index] ?? "aspect-[4/3]";

            return (
              <Reveal key={project.slug} delay={index * 0.08} className={placement}>
                <article className="group">
                  <Link
                    href={`/work/${project.slug}`}
                    className="block rounded-[1.4rem] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4"
                    style={{ outlineColor: WORK.moss }}
                  >
                    <div
                      className={`relative overflow-hidden rounded-[1.4rem] border shadow-[0_20px_60px_rgba(31,58,40,0.12)] ${ratio}`}
                      style={{ borderColor: "rgba(85,107,74,0.2)", backgroundColor: WORK.cream }}
                    >
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={record.evidencePoster}
                        alt={`${project.title} evidence diagram`}
                        loading="lazy"
                        className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.018]"
                      />
                      <div
                        aria-hidden="true"
                        className="absolute inset-0"
                        style={{ background: "linear-gradient(180deg, rgba(8,12,10,0.01) 48%, rgba(8,12,10,0.86) 100%)" }}
                      />

                      <div className="absolute inset-x-0 top-0 flex items-center justify-between gap-4 p-4 sm:p-5">
                        <span className="rounded-full border border-white/30 bg-black/20 px-3 py-1 text-[0.58rem] font-medium uppercase tracking-[0.15em] text-white backdrop-blur-sm">
                          Project story
                        </span>
                        <span className="font-display text-sm text-white/80" aria-hidden="true">
                          {String(index + 1).padStart(2, "0")}
                        </span>
                      </div>

                      <div className="absolute inset-x-0 bottom-0 p-5 sm:p-6">
                        <p className="text-[0.58rem] font-medium uppercase tracking-[0.16em]" style={{ color: WORK.sand }}>
                          {record.evidenceLabel} · {project.industry}
                        </p>
                        <h3 className="mt-1 font-display text-3xl font-normal text-white sm:text-4xl">{project.title}</h3>
                        <span className="mt-3 inline-flex items-center gap-2 text-sm font-medium text-white">
                          Open the story <span aria-hidden="true" className="transition-transform duration-300 group-hover:translate-x-1">→</span>
                        </span>
                      </div>
                    </div>
                  </Link>

                  <div className="px-1 pt-5 sm:px-2">
                    <p className="max-w-xl text-base leading-relaxed" style={{ color: WORK.charcoal }}>
                      {project.hook ?? firstSentence(project.challenge)}
                    </p>
                    <p className="mt-3 max-w-xl text-sm leading-relaxed" style={{ color: WORK.wood }}>
                      {firstSentence(project.outcome)}
                    </p>
                    <div className="mt-4 flex flex-wrap gap-2" aria-label="Relevant business problems">
                      {needs.map((need) => (
                        <span
                          key={need}
                          className="rounded-full border px-3 py-1 text-[0.6rem] font-medium uppercase tracking-[0.11em]"
                          style={{ borderColor: WORK.stone, color: WORK.moss }}
                        >
                          {need}
                        </span>
                      ))}
                    </div>
                  </div>
                </article>
              </Reveal>
            );
          })}
        </div>
      </Container>
    </section>
  );
}
