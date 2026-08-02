import Link from "next/link";
import { Container } from "@/components/Container";
import { Reveal } from "@/components/Reveal";
import type { Project } from "@/data/projects";
import { WORK } from "@/sections/Work/palette";

// Work Page 2.0 archive — the range chapter: every engagement in one
// scannable ledger (project, industry, the decisions it carried),
// each row a real link. Deliberately quiet after the signature
// project's depth; the table itself is the design.
export function WorkArchive({ projects }: { projects: Project[] }) {
  return (
    <section className="py-16 sm:py-24" style={{ backgroundColor: WORK.cream }}>
      <Container className="max-w-6xl">
        <Reveal>
          <p className="text-sm font-medium uppercase tracking-[0.2em]" style={{ color: WORK.olive }}>
            Archive
          </p>
          <h2 className="mt-2 font-display text-display-sm font-normal" style={{ color: WORK.charcoal }}>
            Every engagement on record.
          </h2>
        </Reveal>
        <div className="mt-10">
          <div
            className="hidden grid-cols-[1.2fr_1fr_1.3fr_auto] gap-6 pb-3 text-xs font-medium uppercase tracking-[0.15em] sm:grid"
            style={{ color: WORK.stone }}
            aria-hidden="true"
          >
            <span>Project</span>
            <span>Industry</span>
            <span>Decisions carried</span>
            <span />
          </div>
          {projects.map((project, i) => (
            <Reveal key={project.slug} delay={i * 0.05}>
              <Link
                href={`/work/${project.slug}`}
                className="group grid gap-2 border-t py-5 transition-colors duration-300 focus-visible:outline focus-visible:outline-2 sm:grid-cols-[1.2fr_1fr_1.3fr_auto] sm:items-baseline sm:gap-6"
                style={{ borderColor: WORK.stone + "77", outlineColor: WORK.moss }}
              >
                <span className="font-display text-xl font-normal transition-transform duration-300 group-hover:translate-x-1" style={{ color: WORK.charcoal }}>
                  {project.title}
                </span>
                <span className="text-sm" style={{ color: WORK.wood }}>
                  {project.industry}
                </span>
                <span className="text-sm" style={{ color: WORK.moss }}>
                  {project.services.join("  ·  ")}
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
          ))}
          <div className="h-px" style={{ backgroundColor: WORK.stone + "77" }} aria-hidden="true" />
        </div>
      </Container>
    </section>
  );
}
