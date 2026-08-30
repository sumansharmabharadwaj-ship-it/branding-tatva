import Link from "next/link";
import type { InsightPathway } from "@/data/insightPathways";

export function InsightDecisionPath({
  pathway,
  className = "",
  id,
}: {
  pathway: InsightPathway;
  className?: string;
  id?: string;
}) {
  const links = [pathway.service, pathway.proof, pathway.conversation];

  return (
    <section
      id={id}
      aria-labelledby="insight-decision-path-heading"
      className={`border-y border-soil/10 py-10 sm:py-12 ${className}`}
    >
      <div className="grid gap-8 lg:grid-cols-[0.72fr_1.28fr] lg:gap-12">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-clay">
            From reading to decision
          </p>
          <h2
            id="insight-decision-path-heading"
            className="mt-4 max-w-md font-display text-3xl font-normal leading-tight text-soil sm:text-4xl"
          >
            Follow the question into the work.
          </h2>
        </div>

        <ol className="divide-y divide-soil/10 border-t border-soil/10">
          {links.map((link, index) => (
            <li key={link.href}>
              <Link
                href={link.href}
                className="group grid gap-3 py-5 sm:grid-cols-[2.5rem_1fr_auto] sm:items-start sm:gap-4"
              >
                <span className="font-display text-lg text-clay/75">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <span>
                  <strong className="block font-display text-xl font-normal text-soil transition-colors group-hover:text-clay sm:text-2xl">
                    {link.label}
                  </strong>
                  <span className="mt-2 block max-w-2xl text-sm leading-6 text-foreground-secondary">
                    {link.description}
                  </span>
                </span>
                <span
                  aria-hidden="true"
                  className="hidden pt-1 text-lg text-clay transition-transform group-hover:translate-x-1 sm:block"
                >
                  →
                </span>
              </Link>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
