import { Container } from "@/components/Container";
import { LinkButton } from "@/components/Button";
import { WORK } from "@/sections/Work/palette";

// Work-page authorship: the founder-led advantage stated plainly beside
// a real portrait. This chapter is intentionally static. By this point
// the visitor has already moved through several interactive proof modes;
// authority should be readable immediately rather than entering through
// another repeated fade-up sequence.
const COMMITMENTS = [
  "You speak with the person doing the work, from the first call to the final file.",
  "Strategy and expression stay connected because one mind carries both.",
  "Every recommendation arrives with its reasoning written down.",
  "Where a project needs a specialist beyond this practice, that boundary gets said out loud.",
] as const;

export function Authorship() {
  return (
    <section className="scroll-mt-28 py-16 sm:py-24" style={{ backgroundColor: WORK.forest }}>
      <Container className="max-w-6xl">
        <div className="grid items-center gap-10 lg:grid-cols-[minmax(0,22rem)_1fr] lg:gap-16 xl:gap-20">
          <figure className="relative mx-auto aspect-[4/5] w-full max-w-sm overflow-hidden rounded-[1.4rem] border border-white/10 lg:mx-0">
            {/* Display crop only. The source portrait is unchanged; the
                closer framing makes the founder, rather than the distant
                landscape, carry this authority chapter on small screens. */}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/images/work-portrait.jpg"
              alt="Suman Sharma"
              className="h-full w-full scale-[1.08] object-cover object-[center_58%]"
              loading="lazy"
            />
            <div
              aria-hidden="true"
              className="absolute inset-x-0 bottom-0 h-1/3"
              style={{ background: "linear-gradient(0deg, rgba(31,58,40,0.58) 0%, transparent 100%)" }}
            />
            <figcaption className="absolute bottom-4 left-4 rounded-full border border-white/20 bg-black/20 px-3 py-1 text-[0.58rem] font-medium uppercase tracking-[0.15em] text-white/75 backdrop-blur-sm">
              Founder · strategic lead
            </figcaption>
          </figure>

          <div>
            <p className="text-sm font-medium uppercase tracking-[0.2em]" style={{ color: WORK.sand }}>
              Authorship
            </p>
            <h2 className="mt-2 max-w-2xl font-display text-display-sm font-normal text-white sm:text-display-md">
              One practice. One point of view. Every decision led directly.
            </h2>

            <ul className="mt-7 max-w-2xl">
              {COMMITMENTS.map((line, index) => (
                <li
                  key={line}
                  className="grid grid-cols-[2rem_1fr] gap-3 border-t py-4 sm:grid-cols-[2.5rem_1fr] sm:gap-4"
                  style={{ borderColor: "rgba(143,174,131,0.25)" }}
                >
                  <span className="pt-0.5 font-display text-lg leading-none" style={{ color: WORK.sand }} aria-hidden="true">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <p className="text-[0.95rem] leading-relaxed sm:text-base" style={{ color: "rgba(242,240,232,0.9)" }}>
                    {line}
                  </p>
                </li>
              ))}
            </ul>

            <div className="mt-7 flex flex-col items-start gap-5 border-t pt-6 sm:flex-row sm:items-center sm:justify-between" style={{ borderColor: "rgba(143,174,131,0.25)" }}>
              <p className="max-w-md text-sm italic" style={{ color: WORK.sand }}>
                Conceived, written, designed, and directed by Suman Sharma.
              </p>
              <LinkButton href="/about" variant="secondary" className="shrink-0 border-ivory/40 text-ivory hover:bg-ivory/10">
                The mind behind the practice
              </LinkButton>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
