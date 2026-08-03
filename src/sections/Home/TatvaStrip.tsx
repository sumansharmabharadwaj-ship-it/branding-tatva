"use client";

import Link from "next/link";
import { Container } from "@/components/Container";
import { Reveal } from "@/components/Reveal";
import { elements } from "@/data/elements";
import { ELEMENT_HEX } from "@/lib/sectionWash";

const TATVAS: { slug: keyof typeof ELEMENT_HEX; name: string; role: string; line: string; motion: string }[] = [
  { slug: "earth", name: "Prithvi", role: "The Foundation", line: "The truth everything else stands on.", motion: "settles" },
  { slug: "water", name: "Jal", role: "The Flow", line: "The experience that carries meaning forward.", motion: "travels" },
  { slug: "fire", name: "Agni", role: "The Spark", line: "The distinction that earns attention.", motion: "ignites" },
  { slug: "air", name: "Vayu", role: "The Voice", line: "The language people remember and repeat.", motion: "spreads" },
  { slug: "space", name: "Akash", role: "The Presence", line: "The memory that remains after the moment.", motion: "compounds" },
];

export function TatvaStrip() {
  return (
    <section className="relative isolate overflow-hidden bg-[#182019] py-20 text-ivory sm:py-28">
      <video
        className="absolute inset-0 -z-20 h-full w-full scale-[1.06] object-cover opacity-45 motion-reduce:hidden"
        src="/videos/pixabay-golden-forest-glow.mp4"
        poster="/images/pixabay-golden-forest-glow-poster.jpg"
        autoPlay
        muted
        loop
        playsInline
        preload="metadata"
        aria-hidden="true"
      />
      <div className="absolute inset-0 -z-10 bg-[linear-gradient(90deg,rgba(19,25,20,.92)_0%,rgba(19,25,20,.72)_42%,rgba(19,25,20,.6)_100%)]" />
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_72%_38%,rgba(214,172,93,.18),transparent_34%),radial-gradient(circle_at_22%_78%,rgba(91,118,76,.18),transparent_30%)]" />
      <div className="tatva-light-drift pointer-events-none absolute -right-[10%] top-[-35%] h-[110%] w-[42%] rotate-[18deg] bg-gradient-to-b from-transparent via-[#f4d69a]/15 to-transparent blur-3xl motion-reduce:hidden" />

      <Container className="max-w-[100rem]">
        <div className="grid gap-12 lg:grid-cols-[minmax(18rem,25rem)_1fr] lg:items-end lg:gap-16">
          <Reveal>
            <div className="max-w-md">
              <p className="text-xs font-medium uppercase tracking-[0.28em] text-[#d4ad69]">The living framework</p>
              <h2 className="mt-4 font-display text-[clamp(2.9rem,5.6vw,5.8rem)] font-normal leading-[0.96] tracking-[-0.035em] text-ivory">
                Five forces.
                <br />
                One remembered
                <br />
                <span className="italic text-[#d4ad69]">meaning.</span>
              </h2>
              <p className="mt-6 max-w-sm text-sm leading-relaxed text-ivory/68 sm:text-base">
                A brand becomes coherent when foundation, experience, distinction, language and presence move as one system.
              </p>
              <Link
                href="#elements"
                className="group mt-7 inline-flex items-center gap-3 rounded-full border border-ivory/22 bg-ivory/[0.06] px-5 py-3 text-xs font-medium uppercase tracking-[0.18em] text-ivory backdrop-blur-md transition duration-500 hover:border-[#d4ad69]/65 hover:bg-[#d4ad69]/10"
              >
                Enter the five Tatvas
                <span className="transition-transform duration-500 group-hover:translate-x-1" aria-hidden="true">→</span>
              </Link>
            </div>
          </Reveal>

          <Reveal delay={0.1}>
            <ol className="grid gap-3 sm:grid-cols-2 xl:grid-cols-5">
              {TATVAS.map((t, i) => {
                const el = elements.find((e) => e.slug === t.slug);
                return (
                  <li key={t.slug} className={i === 4 ? "sm:col-span-2 xl:col-span-1" : ""}>
                    <Link
                      href={`#${t.slug}`}
                      className="tatva-card group relative flex min-h-[20rem] overflow-hidden rounded-[1.4rem] border border-ivory/14 bg-[#182019]/48 p-4 shadow-[0_24px_70px_rgba(0,0,0,.24)] backdrop-blur-md transition-[transform,border-color,background-color] duration-700 hover:-translate-y-2 hover:border-ivory/32 hover:bg-[#182019]/62 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#d4ad69] sm:min-h-[23rem]"
                    >
                      <div className="absolute inset-0 overflow-hidden">
                        {el?.video ? (
                          <video
                            className="h-full w-full scale-[1.08] object-cover opacity-62 transition duration-[1400ms] group-hover:scale-100 group-hover:opacity-82 motion-reduce:hidden"
                            src={el.video}
                            poster={el.image}
                            autoPlay
                            muted
                            loop
                            playsInline
                            preload="metadata"
                            aria-hidden="true"
                          />
                        ) : null}
                        <div className="absolute inset-0 bg-gradient-to-b from-black/10 via-black/20 to-black/90" />
                        <div className="absolute inset-0 opacity-60 mix-blend-soft-light" style={{ backgroundColor: ELEMENT_HEX[t.slug] }} />
                      </div>

                      <span className="tatva-orbit pointer-events-none absolute right-3 top-3 h-16 w-16 rounded-full border border-ivory/28 motion-reduce:hidden" aria-hidden="true">
                        <span className="absolute left-1/2 top-[-3px] h-1.5 w-1.5 -translate-x-1/2 rounded-full bg-ivory shadow-[0_0_14px_rgba(255,255,255,.85)]" />
                      </span>

                      <div className="relative mt-auto w-full">
                        <span className="text-[0.65rem] font-medium uppercase tracking-[0.24em] text-ivory/66">
                          {String(i + 1).padStart(2, "0")} · {t.motion}
                        </span>
                        <p className="mt-4 font-display text-[2rem] font-normal leading-none text-ivory">{t.name}</p>
                        <p className="mt-1 font-display text-lg italic" style={{ color: "#f0c97d" }}>{t.role}</p>
                        <p className="mt-3 max-w-[14rem] text-xs leading-relaxed text-ivory/72">{t.line}</p>
                        <span className="mt-5 inline-flex items-center gap-2 text-[0.65rem] font-medium uppercase tracking-[0.2em] text-ivory/80 opacity-70 transition duration-500 group-hover:opacity-100">
                          See it move <span className="transition-transform duration-500 group-hover:translate-x-1" aria-hidden="true">↗</span>
                        </span>
                      </div>
                    </Link>
                  </li>
                );
              })}
            </ol>
          </Reveal>
        </div>
      </Container>

      <style jsx>{`
        .tatva-light-drift {
          animation: tatva-light-drift 9s ease-in-out infinite alternate;
        }
        .tatva-orbit {
          animation: tatva-orbit 8s linear infinite;
        }
        .tatva-card:nth-child(even) .tatva-orbit {
          animation-direction: reverse;
          animation-duration: 10s;
        }
        @keyframes tatva-light-drift {
          from { transform: translate3d(-7%, -2%, 0) rotate(18deg); opacity: .45; }
          to { transform: translate3d(10%, 7%, 0) rotate(22deg); opacity: .8; }
        }
        @keyframes tatva-orbit {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </section>
  );
}
