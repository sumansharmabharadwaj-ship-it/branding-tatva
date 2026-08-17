import Link from "next/link";
import { AuditInvite } from "@/components/AuditInvite";
import { Container } from "@/components/Container";

const FIELDS = [
  {
    number: "01",
    name: "Psychology",
    line: "How attention lands, how memory holds, and how a choice actually gets made.",
  },
  {
    number: "02",
    name: "Language",
    line: "How a sentence frames value, how a phrase sticks, and how words carry a position.",
  },
] as const;

// One complete screen instead of the former 220vh typography runway.
// The water film provides continuous, non-reversing movement while the
// two disciplines and the decision they produce remain visible together.
export function Convergence() {
  return (
    <Container className="relative flex min-h-[100svh] w-full max-w-6xl items-center py-20 sm:h-[100svh] sm:min-h-[44rem] sm:py-24">
      <div className="w-full">
        <header className="grid items-end gap-5 border-b border-ivory/20 pb-6 md:grid-cols-[0.72fr_1.28fr] md:gap-12">
          <div>
            <p className="text-xs font-medium uppercase tracking-[0.2em] text-sandstone">
              Two fields, one discipline
            </p>
            <p className="mt-3 text-xs uppercase tracking-[0.16em] text-ivory/50">The working equation</p>
          </div>
          <h2 className="max-w-3xl font-display text-[clamp(2.2rem,4.7vw,4.8rem)] font-normal leading-[0.94] text-ivory">
            Meaning becomes useful when people can <span className="text-sandstone">feel it and repeat it.</span>
          </h2>
        </header>

        <div className="mt-6 grid gap-4 md:grid-cols-2">
          {FIELDS.map((field) => (
            <article
              key={field.name}
              className="grid min-h-32 grid-cols-[auto_1fr] gap-5 rounded-2xl border border-ivory/15 bg-soil/50 p-5 shadow-elevation-sm backdrop-blur-md sm:p-6"
            >
              <span className="pt-1 text-[0.65rem] font-medium tracking-[0.18em] text-sandstone/80">
                {field.number}
              </span>
              <div>
                <h3 className="font-display text-[clamp(1.9rem,3vw,3rem)] font-normal leading-none text-ivory">
                  {field.name}
                </h3>
                <p className="mt-3 max-w-md text-sm leading-relaxed text-ivory/75">{field.line}</p>
              </div>
            </article>
          ))}
        </div>

        <div className="mt-4 grid gap-4 lg:grid-cols-[1.14fr_0.86fr]">
          <article className="rounded-2xl border border-sandstone/30 bg-soil/65 p-5 shadow-elevation-md backdrop-blur-lg sm:p-7">
            <div className="flex items-center gap-3 text-[0.65rem] font-medium uppercase tracking-[0.18em] text-sandstone">
              <span>01 + 02</span>
              <span aria-hidden="true" className="h-px flex-1 bg-sandstone/30" />
              <span>Resolved</span>
            </div>
            <div className="mt-4 grid gap-4 sm:grid-cols-[0.72fr_1.28fr] sm:items-end">
              <h3 className="font-display text-[clamp(2.2rem,4vw,4rem)] font-normal leading-none text-sandstone">
                Brand strategy
              </h3>
              <div>
                <p className="text-sm leading-relaxed text-ivory/85">
                  One discipline, practised where the two overlap: what people notice, what they believe, and what they
                  repeat.
                </p>
                <p className="mt-3 text-xs leading-relaxed text-ivory/60">
                  In practice, sharper language and fewer posts moved one client&apos;s engagement rate from 0.71% to
                  2.81%.
                </p>
                <Link
                  href="/work/dr-haley-nutrition"
                  className="link-underline mt-3 inline-flex items-center gap-2 text-sm font-medium text-sandstone transition-colors duration-300 hover:text-ivory"
                >
                  See the decision trail <span aria-hidden="true">→</span>
                </Link>
              </div>
            </div>
          </article>

          <AuditInvite />
        </div>
      </div>
    </Container>
  );
}
