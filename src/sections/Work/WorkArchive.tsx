import Link from "next/link";
import { Container } from "@/components/Container";
import { Reveal } from "@/components/Reveal";
import type { Project } from "@/data/projects";
import { getWorkTaxonomy, WORK_NEEDS, type WorkTier } from "@/data/workTaxonomy";
import { WORK } from "@/sections/Work/palette";

const GROUPS: {
  tier: WorkTier;
  index: string;
  title: string;
  description: string;
}[] = [
  {
    tier: "flagship",
    index: "01",
    title: "Flagship case studies",
    description: "The fullest evidence on record: problem, diagnosis, decision, execution, and outcome.",
  },
  {
    tier: "story",
    index: "02",
    title: "Project stories",
    description: "Meaningful engagements told at the depth the available evidence can honestly support.",
  },
];

export function WorkArchive({ projects }: { projects: Project[] }) {
  return (
    <section className="py-16 sm:py-24" style={{ backgroundColor: WORK.cream }}>
      <Container className="max-w-6xl">
        <Reveal>
          <p className="text-sm font-medium uppercase tracking-[0.2em]" style={{ color: WORK.olive }}>
            Client work archive
          </p>
          <h2 className="mt-2 max-w-2xl font-display text-display-sm font-normal" style={{ color: WORK.charcoal }}>
            Not every project needs to pretend it was the same size.
          </h2>
          <p className="mt-4 max-w-xl text-base leading-relaxed" style={{ color: WORK.wood }}>
            The archive gives the strongest evidence room to breathe, while shorter engagements stay useful, specific, and proportionate.
          </p>
        </Reveal>

        <div className="mt-12 space-y-14">
          {GROUPS.map((group) => {
            const entries = projects.filter((project) => getWorkTaxonomy(project.slug).tier === group.tier);
            if (entries.length === 0) return null;

            return (
              <section key={group.tier} aria-labelledby={`archive-${group.tier}`}>
                <div className="grid gap-3 border-b pb-5 sm:grid-cols-[4rem_1fr] sm:gap-6" style={{ borderColor: WORK.stone }}>
                  <p className="font-display text-xl" style={{ color: WORK.olive }} aria-hidden="true">
                    {group.index}
                  </p>
                  <div>
                    <h3 id={`archive-${group.tier}`} className="font-display text-2xl font-normal" style={{ color: WORK.charcoal }}>
                      {group.title}
                    </h3>
                    <p className="mt-1 max-w-xl text-sm leading-relaxed" style={{ color: WORK.wood }}>
                      {group.description}
                    </p>
                  </div>
                </div>

                <div>
                  {entries.map((project, index) => {
                    const record = getWorkTaxonomy(project.slug);
                    const needs = record.needs.map((needId) => {
                      const need = WORK_NEEDS.find((item) => item.id === needId);
                      return need ? need.label : needId;
                    });

                    return (
                      <Reveal key={project.slug} delay={index * 0.05}>
                        <Link
                          href={`/work/${project.slug}`}
                          className="group grid gap-3 border-b py-6 transition-colors duration-300 focus-visible:outline focus-visible:outline-2 sm:grid-cols-[1.2fr_0.8fr_1.25fr_auto] sm:items-center sm:gap-6"
                          style={{ borderColor: WORK.stone + "77", outlineColor: WORK.moss }}
                        >
                          <span>
                            <span
                              className="block font-display text-xl font-normal transition-transform duration-300 group-hover:translate-x-1"
                              style={{ color: WORK.charcoal }}
                            >
                              {project.title}
                            </span>
                            <span className="mt-1 block text-xs uppercase tracking-[0.13em]" style={{ color: WORK.olive }}>
                              {project.industry}
                            </span>
                          </span>

                          <span className="text-sm font-medium" style={{ color: WORK.moss }}>
                            {record.evidenceLabel}
                          </span>

                          <span>
                            <span className="block text-[0.58rem] font-medium uppercase tracking-[0.14em]" style={{ color: WORK.stone }}>
                              Relevant when
                            </span>
                            <span className="mt-1 block text-sm" style={{ color: WORK.wood }}>
                              {needs.join(" · ")}
                            </span>
                          </span>

                          <span
                            className="hidden text-sm transition-transform duration-300 group-hover:translate-x-1 sm:block"
                            style={{ color: WORK.forest }}
                            aria-hidden="true"
                          >
                            →
                          </span>
                        </Link>
                      </Reveal>
                    );
                  })}
                </div>
              </section>
            );
          })}
        </div>
      </Container>
    </section>
  );
}
