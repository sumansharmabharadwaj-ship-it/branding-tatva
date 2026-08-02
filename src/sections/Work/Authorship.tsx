import { Container } from "@/components/Container";
import { Reveal } from "@/components/Reveal";
import { LinkButton } from "@/components/Button";
import { WORK } from "@/sections/Work/palette";

// Work Page 2.0 authorship — the solo practice advantage, stated
// plainly beside a real portrait (own-portrait.jpg, graded this round
// toward the page's warm natural register). Warm sand is reserved for
// exactly this chapter, per the handoff's own palette table.
const COMMITMENTS = [
  "You speak with the person doing the work, from the first call to the final file.",
  "Strategy and expression stay connected because one mind carries both.",
  "Every recommendation arrives with its reasoning written down.",
  "Where a project needs a specialist beyond this practice, that boundary gets said out loud.",
] as const;

export function Authorship() {
  return (
    <section className="py-20 sm:py-28" style={{ backgroundColor: WORK.forest }}>
      <Container className="max-w-6xl">
        <div className="grid items-center gap-12 lg:grid-cols-[minmax(0,24rem)_1fr] lg:gap-20">
          <Reveal>
            <div className="relative mx-auto max-w-sm overflow-hidden rounded-2xl lg:mx-0">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/images/work-portrait.jpg" alt="Suman Sharma" className="block h-auto w-full" loading="lazy" />
              <div
                aria-hidden="true"
                className="absolute inset-x-0 bottom-0 h-1/4"
                style={{ background: "linear-gradient(0deg, rgba(31,58,40,0.5) 0%, transparent 100%)" }}
              />
            </div>
          </Reveal>
          <div>
            <Reveal>
              <p className="text-sm font-medium uppercase tracking-[0.2em]" style={{ color: WORK.sand }}>
                Authorship
              </p>
              <h2 className="mt-2 max-w-xl font-display text-display-sm font-normal text-white sm:text-display-md">
                One practice. One point of view. Every decision led directly.
              </h2>
            </Reveal>
            <ul className="mt-8 max-w-xl">
              {COMMITMENTS.map((line, i) => (
                <Reveal key={line} delay={i * 0.07}>
                  <li
                    className="flex items-start gap-4 border-t py-4"
                    style={{ borderColor: "rgba(143,174,131,0.25)" }}
                  >
                    <span className="pt-0.5 font-display text-lg leading-none" style={{ color: WORK.sand }} aria-hidden="true">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <p className="text-base leading-relaxed" style={{ color: "rgba(242,240,232,0.9)" }}>
                      {line}
                    </p>
                  </li>
                </Reveal>
              ))}
            </ul>
            <Reveal delay={0.3}>
              <p className="mt-8 text-sm italic" style={{ color: WORK.sand }}>
                Conceived, written, designed, and directed by Suman Sharma.
              </p>
              <div className="mt-6">
                <LinkButton href="/about" variant="secondary" className="border-ivory/40 text-ivory hover:bg-ivory/10">
                  The mind behind the practice
                </LinkButton>
              </div>
            </Reveal>
          </div>
        </div>
      </Container>
    </section>
  );
}
