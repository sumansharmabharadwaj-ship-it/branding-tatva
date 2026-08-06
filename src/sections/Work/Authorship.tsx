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
    <section className="scroll-mt-28 py-14 sm:py-24" style={{ backgroundColor: WORK.forest }}>
      <Container className="max-w-6xl">
        <div className="grid items-center gap-8 sm:gap-10 lg:grid-cols-[minmax(0,22rem)_1fr] lg:gap-16 xl:gap-20">
          <figure className="relative mx-auto aspect-[4/3] w-full max-w-sm overflow-hidden rounded-[1.4rem] border border-white/10 sm:aspect-[4/5] lg:mx-0">
            {/* Display crop only. On phones, a tighter landscape frame
                gives the founder, rather than the distant landscape, the
                visual authority. The source portrait itself is unchanged. */}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/images/work-portrait.jpg"
              alt="Suman Sharma"
              className="h-full w-full scale-[1.42] object-cover object-[center_62%] min-[430px]:scale-[1.36] sm:scale-[1.16] sm:object-[center_58%] lg:scale-[1.08]"
              loading="lazy"
            />
            <div
              aria-hidden="true"
              className="absolute inset-x-0 bottom-0 h-2/5 sm:h-1/3"
              style={{ background: "linear-gradient(0deg, rgba(31,58,40,0.64) 0%, transparent 100%)" }}
            />
            <figcaption className="absolute bottom-3 left-3 rounded-full border border-white/20 bg-black/25 px-3 py-1 text-[0.56rem] font-medium uppercase tracking-[0.14em] text-white/80 backdrop-blur-sm sm:bottom-4 sm:left-4 sm:text-[0.58rem] sm:tracking-[0.15em]">
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

            <ul className="mt-6 max-w-2xl sm:mt-7">
              {COMMITMENTS.map((line, index) => (
                <li
                  key={line}
                  className="grid grid-cols-[1.8rem_1fr] gap-3 border-t py-3.5 sm:grid-cols-[2.5rem_1fr] sm:gap-4 sm:py-4"
                  style={{ borderColor: "rgba(143,174,131,0.25)" }}
                >
                  <span className="pt-0.5 font-display text-base leading-none sm:text-lg" style={{ color: WORK.sand }} aria-hidden="true">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <p className="text-[0.92rem] leading-relaxed sm:text-base" style={{ color: "rgba(242,240,232,0.9)" }}>
                    {line}
                  </p>
                </li>
              ))}
            </ul>

            <div className="mt-6 flex flex-col items-start gap-4 border-t pt-5 sm:mt-7 sm:flex-row sm:items-center sm:justify-between sm:gap-5 sm:pt-6" style={{ borderColor: "rgba(143,174,131,0.25)" }}>
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
