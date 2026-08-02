import { Container } from "@/components/Container";
import { Reveal } from "@/components/Reveal";
import { brandStudies } from "@/data/brandStudies";

// Brand studies — the Work page's teaching layer. Renowned brands from
// the US, UK and Canada dissected through the same vocabulary the rest
// of the site uses (distinctive assets, architecture, verbal identity,
// codes, ritual). CRITICAL FRAMING: these are independent analyses of
// the public record and must never read as client work — the framing
// line under the heading carries that in visitor facing copy, and the
// section sits visually distinct from the real client grid above it
// (numbered editorial rows, no project card chrome, no outcome stats).
// Copy follows the sitewide standard throughout.
export function BrandStudies() {
  return (
    <section className="bg-soil py-20 sm:py-28">
      <Container className="max-w-6xl">
        <Reveal>
          <p className="text-sm font-medium uppercase tracking-[0.18em] text-ivory/70">Brand studies</p>
          <h2 className="mt-2 max-w-2xl text-display-sm font-display font-normal text-ivory sm:text-display-md">
            Lessons from brands the whole world already knows.
          </h2>
          <p className="mt-4 max-w-xl text-base text-ivory/90">
            Independent dissections of the public record, written as study. Each brand below earned its place in
            memory through a specific mechanism, and each study names it.
          </p>
        </Reveal>

        <div className="mt-14 space-y-14 lg:space-y-16">
          {brandStudies.map((study, i) => (
            <Reveal key={study.slug} delay={Math.min(i * 0.08, 0.24)}>
              <article className="grid gap-8 border-t border-ivory/15 pt-10 lg:grid-cols-[minmax(0,20rem)_1fr] lg:gap-16">
                <div>
                  <div className="flex items-baseline gap-3">
                    <span className="font-display text-sm text-ivory/50" aria-hidden="true">
                      0{i + 1}
                    </span>
                    <h3 className="font-display text-2xl font-normal text-ivory sm:text-3xl">{study.brand}</h3>
                  </div>
                  <div className="mt-3 flex flex-wrap gap-2">
                    <span className="rounded-full border border-ivory/20 px-3 py-1 text-xs text-ivory/70">
                      {study.region}
                    </span>
                    <span className="rounded-full border border-[#A0A690]/40 px-3 py-1 text-xs text-[#A0A690]">
                      {study.lens}
                    </span>
                  </div>
                  <p className="mt-5 text-base leading-relaxed text-ivory/90">{study.premise}</p>
                </div>
                <div>
                  <div className="space-y-5">
                    {study.observations.map((obs) => (
                      <div key={obs.title}>
                        <p className="text-sm font-medium uppercase tracking-wide text-ivory/70">{obs.title}</p>
                        <p className="mt-1.5 max-w-2xl text-[0.95rem] leading-relaxed text-ivory/90">{obs.text}</p>
                      </div>
                    ))}
                  </div>
                  <p className="mt-7 border-l-2 border-[#A0A690]/60 pl-4 font-display text-lg italic text-ivory sm:text-xl">
                    {study.lesson}
                  </p>
                </div>
              </article>
            </Reveal>
          ))}
        </div>
      </Container>
    </section>
  );
}
