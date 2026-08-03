import Image from "next/image";
import Link from "next/link";
import { Container } from "@/components/Container";
import { Reveal } from "@/components/Reveal";
import { elements } from "@/data/elements";
import { ELEMENT_HEX } from "@/lib/sectionWash";

// Suman's board, scene three: the framework introduced as five living
// Tatvas instead of a text block on brown — the exact section she
// flagged. The Sanskrit names carry the philosophy's real origin;
// each orb is a circular window into that element's own footage world
// (the same photography the Elements exploration below uses, so the
// strip works as its trailhead). Board copy kept verbatim where she
// authored it. The strip links straight down into the full pinned
// exploration, which is where "scroll to explore" pays off.
const TATVAS: { slug: keyof typeof ELEMENT_HEX; name: string; role: string; line: string }[] = [
  { slug: "earth", name: "Prithvi", role: "The Foundation", line: "We uncover the truth that everything stands on." },
  { slug: "water", name: "Jal", role: "The Flow", line: "We find the emotion that moves people." },
  { slug: "fire", name: "Agni", role: "The Spark", line: "We create the message that ignites action." },
  { slug: "air", name: "Vayu", role: "The Voice", line: "We shape the expression that spreads it far." },
  { slug: "space", name: "Akash", role: "The Space", line: "We build the presence that lasts." },
];

export function TatvaStrip() {
  return (
    <section className="py-16 sm:py-20" style={{ backgroundColor: "#F2F0E8" }}>
      <Container className="max-w-[100rem]">
        <div className="grid items-center gap-12 lg:grid-cols-[minmax(0,18rem)_1fr] lg:gap-16">
          <Reveal>
            <p className="text-sm font-medium uppercase tracking-[0.2em]" style={{ color: "#556B4A" }}>
              Our framework
            </p>
            <h2 className="mt-3 font-display text-display-sm font-normal leading-[1.08] text-soil">
              The five Tatvas of every brand we build.
            </h2>
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-foreground-secondary">
              A timeless framework. A living system. Scroll to explore each element.
            </p>
            <Link
              href="#elements"
              className="link-underline mt-5 inline-flex items-center gap-2 text-sm font-medium uppercase tracking-[0.14em]"
              style={{ color: "#556B4A" }}
            >
              Explore the framework <span aria-hidden="true">→</span>
            </Link>
          </Reveal>

          <Reveal delay={0.1}>
            <ol className="grid grid-cols-2 gap-x-4 gap-y-8 sm:grid-cols-3 lg:flex lg:items-start lg:justify-between lg:gap-2">
              {TATVAS.map((t, i) => {
                const el = elements.find((e) => e.slug === t.slug);
                return (
                  <li key={t.slug} className="flex items-start lg:flex-1">
                    <Link href="#elements" className="group flex w-full flex-col items-center text-center">
                      <span
                        className="relative block h-24 w-24 overflow-hidden rounded-full ring-2 ring-offset-2 transition-transform duration-500 group-hover:scale-105 lg:h-28 lg:w-28"
                        style={{ ["--tw-ring-color" as string]: `${ELEMENT_HEX[t.slug]}55`, ["--tw-ring-offset-color" as string]: "#F2F0E8" }}
                      >
                        {el?.image && (
                          <Image src={el.image} alt="" fill sizes="112px" style={{ objectFit: "cover" }} />
                        )}
                      </span>
                      <span className="mt-4 text-xs font-medium uppercase tracking-[0.25em] text-soil">{t.name}</span>
                      <span className="mt-1 font-display text-base font-normal" style={{ color: ELEMENT_HEX[t.slug] }}>
                        {t.role}
                      </span>
                      <span className="mt-1 max-w-[11rem] text-xs leading-relaxed text-foreground-secondary">
                        {t.line}
                      </span>
                    </Link>
                    {/* Dotted connector between orbs, desktop row only. */}
                    {i < TATVAS.length - 1 && (
                      <span
                        aria-hidden="true"
                        className="mt-12 hidden h-px flex-1 border-t border-dashed lg:block"
                        style={{ borderColor: "#B5B3AA" }}
                      />
                    )}
                  </li>
                );
              })}
            </ol>
          </Reveal>
        </div>
      </Container>
    </section>
  );
}
