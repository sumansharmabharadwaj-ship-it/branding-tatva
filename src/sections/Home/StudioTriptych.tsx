"use client";

import { useHydratedReducedMotion } from "@/hooks/useHydratedReducedMotion";
import { useMemo, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  AnimatePresence,
  motion,
  useMotionValueEvent,
  useScroll,
  useTransform,
} from "framer-motion";
import { credentials } from "@/data/about";
import { useMediaQuery } from "@/hooks/useMediaQuery";

const LENSES = [
  {
    id: "notice",
    number: "01",
    label: "Notice",
    discipline: "Clinical psychology",
    question: "What is the audience attending to, avoiding, or misreading?",
    catches: "Assumptions disguised as insight. Messaging that asks for trust before it has earned attention.",
    changes: "Positioning begins with observable behaviour, not the founder's preferred description of the business.",
    verb: "Observe",
    tint: "rgba(83,104,75,0.34)",
  },
  {
    id: "name",
    number: "02",
    label: "Name",
    discipline: "English literature",
    question: "Which words carry the meaning, and which words merely decorate it?",
    catches: "Generic language, borrowed category phrases, and a voice that changes whenever the channel changes.",
    changes: "The brand gains one verbal centre: a recognisable idea and rhythm that can travel without becoming repetitive.",
    verb: "Distil",
    tint: "rgba(142,88,55,0.30)",
  },
  {
    id: "direct",
    number: "03",
    label: "Direct",
    discipline: "Filmmaking and content systems",
    question: "What should the audience see, feel, and do next?",
    catches: "Beautiful outputs with no sequence, no tension, and no commercial destination.",
    changes: "Every asset becomes part of a journey, from first attention to a believable next action.",
    verb: "Sequence",
    tint: "rgba(38,52,67,0.34)",
  },
] as const;

type LensId = (typeof LENSES)[number]["id"];

export function StudioTriptych() {
  const sectionRef = useRef<HTMLElement>(null);
  const prefersReducedMotion = useHydratedReducedMotion();
  const compactLayout = useMediaQuery("(max-width: 1023px), (max-height: 719px)");
  const staticLayout = Boolean(prefersReducedMotion) || compactLayout;
  const [activeId, setActiveId] = useState<LensId>("notice");
  const [manualLens, setManualLens] = useState(false);
  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ["start start", "end end"] });

  useMotionValueEvent(scrollYProgress, "change", (value) => {
    if (staticLayout || manualLens || value < 0.24) return;
    const lensProgress = Math.min(0.999, Math.max(0, (value - 0.24) / 0.76));
    const index = Math.min(LENSES.length - 1, Math.floor(lensProgress * LENSES.length));
    setActiveId(LENSES[index].id);
  });

  const active = LENSES.find((lens) => lens.id === activeId) ?? LENSES[0];
  const featuredCredentials = useMemo(() => credentials.filter((credential) => credential.featured), []);

  const imageScale = useTransform(scrollYProgress, [0, 1], [1.04, 1.2]);
  const imageX = useTransform(scrollYProgress, [0, 0.5, 1], [0, -34, 28]);
  const imageY = useTransform(scrollYProgress, [0, 1], [0, -40]);
  const veilOpacity = useTransform(scrollYProgress, [0, 0.45, 1], [0.48, 0.28, 0.58]);
  // The title now clears the frame before the active lens enters. The
  // previous crossfade placed two enormous serif compositions on top of
  // one another, which is the overlap visible in the audit screenshot.
  const titleOpacity = useTransform(scrollYProgress, [0, 0.1, 0.19], [1, 1, 0]);
  const titleY = useTransform(scrollYProgress, [0, 0.2], [0, -48]);
  const lensOpacity = useTransform(scrollYProgress, [0.22, 0.31, 1], [0, 1, 1]);
  const lensY = useTransform(scrollYProgress, [0.22, 0.34], [42, 0]);
  const progressScale = useTransform(scrollYProgress, [0, 1], [0, 1]);

  function chooseLens(id: LensId) {
    setManualLens(true);
    setActiveId(id);
  }

  if (staticLayout) {
    return (
      <section className="relative overflow-hidden bg-[#151411] px-6 py-24 text-ivory sm:px-10 sm:py-28">
        <div className="absolute inset-0">
          <Image
            src="/images/own-portrait.jpg"
            alt="Suman Sharma, founder of Branding Tatva"
            fill
            sizes="100vw"
            className="object-cover"
            style={{ objectPosition: "center 28%" }}
          />
        </div>
        <div className="absolute inset-0 bg-[linear-gradient(100deg,rgba(16,14,12,.94)_0%,rgba(16,14,12,.78)_52%,rgba(16,14,12,.82)_100%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_68%_24%,rgba(239,217,178,.14),transparent_30%)]" />

        <div className="relative z-10 mx-auto max-w-[92rem]">
          <p className="text-[0.65rem] font-medium uppercase tracking-[0.3em] text-sandstone">The author behind the system</p>
          <h2 className="mt-5 max-w-4xl font-display text-[clamp(3rem,8vw,7rem)] font-normal leading-[0.9] tracking-[-0.045em]">
            I study attention before I design <span className="italic text-sandstone">expression.</span>
          </h2>
          <p className="mt-7 max-w-2xl text-sm leading-relaxed text-ivory/72 sm:text-base">
            Psychology reads behaviour. Literature gives meaning a voice. Direction decides what the audience should experience next.
          </p>

          <div className="mt-12 grid gap-5 lg:grid-cols-3">
            {LENSES.map((lens) => (
              <article key={lens.id} className="rounded-[1.6rem] border border-ivory/14 bg-black/30 p-6 backdrop-blur-md sm:p-7">
                <p className="text-[0.62rem] font-medium uppercase tracking-[0.22em] text-sandstone">
                  {lens.number} · {lens.discipline}
                </p>
                <p className="mt-4 font-display text-5xl leading-none text-ivory">{lens.verb}.</p>
                <p className="mt-5 font-display text-2xl leading-tight text-ivory/92">{lens.question}</p>
                <div className="mt-7 border-t border-ivory/12 pt-5">
                  <p className="text-[0.58rem] uppercase tracking-[0.2em] text-ivory/42">The blind spot it catches</p>
                  <p className="mt-2 text-sm leading-relaxed text-ivory/70">{lens.catches}</p>
                </div>
                <div className="mt-5">
                  <p className="text-[0.58rem] uppercase tracking-[0.2em] text-ivory/42">The decision it changes</p>
                  <p className="mt-2 text-sm leading-relaxed text-ivory/70">{lens.changes}</p>
                </div>
              </article>
            ))}
          </div>

          <div className="mt-10 flex flex-col gap-5 border-t border-ivory/14 pt-6 sm:flex-row sm:items-end sm:justify-between">
            <div className="flex max-w-3xl flex-wrap gap-x-5 gap-y-2 text-[0.58rem] uppercase tracking-[0.16em] text-ivory/46">
              {featuredCredentials.map((credential) => (
                <span key={credential.label}>{credential.label} · {credential.detail}</span>
              ))}
            </div>
            <Link href="/about" className="shrink-0 text-xs font-medium uppercase tracking-[0.18em] text-sandstone transition-colors hover:text-ivory">
              Read the full practice ↗
            </Link>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section ref={sectionRef} className="relative h-[310svh] bg-[#151411] text-ivory">
      <div className="sticky top-0 h-svh min-h-[660px] overflow-hidden">
        <motion.div className="absolute inset-[-7%]" style={{ scale: imageScale, x: imageX, y: imageY }}>
          <Image
            src="/images/own-portrait.jpg"
            alt="Suman Sharma, founder of Branding Tatva"
            fill
            sizes="100vw"
            className="object-cover"
            style={{ objectPosition: "center 28%" }}
            priority={false}
          />
        </motion.div>

        <motion.div aria-hidden="true" className="absolute inset-0 bg-black" style={{ opacity: veilOpacity }} />
        <motion.div
          aria-hidden="true"
          className="absolute inset-0 transition-colors duration-700"
          animate={{ backgroundColor: active.tint }}
          transition={{ duration: 0.7 }}
        />
        <div aria-hidden="true" className="absolute inset-0 bg-[linear-gradient(90deg,rgba(16,14,12,.92)_0%,rgba(16,14,12,.62)_38%,rgba(16,14,12,.18)_66%,rgba(16,14,12,.64)_100%)]" />
        <div aria-hidden="true" className="absolute inset-0 bg-[radial-gradient(circle_at_68%_34%,rgba(239,217,178,.16),transparent_28%)]" />

        <motion.div className="absolute inset-0 z-10 flex items-end px-6 pb-16 sm:px-10 sm:pb-20 lg:px-16" style={{ opacity: titleOpacity, y: titleY }}>
          <div className="max-w-4xl">
            <p className="text-[0.65rem] font-medium uppercase tracking-[0.3em] text-sandstone">The author behind the system</p>
            <h2 className="mt-5 font-display text-[clamp(3.2rem,8vw,8rem)] font-normal leading-[0.88] tracking-[-0.045em]">
              I study attention
              <br />
              before I design
              <br />
              <span className="italic text-sandstone">expression.</span>
            </h2>
            <p className="mt-7 max-w-xl text-sm leading-relaxed text-ivory/68 sm:text-base">
              Psychology reads behaviour. Literature gives meaning a voice. Direction decides what the audience should experience next.
            </p>
          </div>
        </motion.div>

        <motion.div className="absolute inset-0 z-20 flex items-center px-6 sm:px-10 lg:px-16" style={{ opacity: lensOpacity, y: lensY }}>
          <div className="grid w-full gap-10 lg:grid-cols-[minmax(0,1.15fr)_minmax(20rem,.85fr)] lg:items-end">
            <AnimatePresence mode="wait">
              <motion.div
                key={active.id}
                id={`studio-panel-${active.id}`}
                role="tabpanel"
                aria-labelledby={`studio-tab-${active.id}`}
                initial={{ opacity: 0, y: 32, filter: "blur(10px)" }}
                animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                exit={{ opacity: 0, y: -22, filter: "blur(8px)" }}
                transition={{ duration: 0.62, ease: [0.22, 1, 0.36, 1] }}
                className="max-w-4xl"
              >
                <p className="text-[0.65rem] font-medium uppercase tracking-[0.28em] text-sandstone">
                  {active.number} · {active.discipline}
                </p>
                <p className="mt-4 font-display text-[clamp(4rem,10vw,10rem)] font-normal leading-[0.82] tracking-[-0.055em]">
                  {active.verb}.
                </p>
                <p className="mt-7 max-w-2xl font-display text-[clamp(1.65rem,3.4vw,3.15rem)] leading-[1.08] text-ivory/92">
                  {active.question}
                </p>
              </motion.div>
            </AnimatePresence>

            <div className="lg:pb-2">
              <AnimatePresence mode="wait">
                <motion.div
                  key={`${active.id}-reading`}
                  initial={{ opacity: 0, x: 28 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -18 }}
                  transition={{ duration: 0.52, ease: [0.22, 1, 0.36, 1] }}
                  className="space-y-7"
                >
                  <div>
                    <p className="text-[0.62rem] uppercase tracking-[0.22em] text-ivory/42">The blind spot it catches</p>
                    <p className="mt-3 text-sm leading-relaxed text-ivory/72 sm:text-base">{active.catches}</p>
                  </div>
                  <div>
                    <p className="text-[0.62rem] uppercase tracking-[0.22em] text-ivory/42">The decision it changes</p>
                    <p className="mt-3 text-sm leading-relaxed text-ivory/72 sm:text-base">{active.changes}</p>
                  </div>
                </motion.div>
              </AnimatePresence>

              <div className="mt-9 flex flex-wrap gap-2" role="tablist" aria-label="Choose a working lens">
                {LENSES.map((lens) => (
                  <button
                    key={lens.id}
                    id={`studio-tab-${lens.id}`}
                    type="button"
                    role="tab"
                    aria-selected={active.id === lens.id}
                    aria-controls={`studio-panel-${lens.id}`}
                    onClick={() => chooseLens(lens.id)}
                    className={`min-h-11 rounded-full border px-4 text-[0.62rem] font-medium uppercase tracking-[0.16em] transition-all duration-300 ${
                      active.id === lens.id
                        ? "border-sandstone bg-sandstone text-soil"
                        : "border-ivory/20 bg-black/10 text-ivory/58 backdrop-blur-sm hover:border-ivory/45 hover:text-ivory"
                    }`}
                  >
                    {lens.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </motion.div>

        <div className="absolute inset-x-6 bottom-5 z-30 sm:inset-x-10 lg:inset-x-16">
          <div className="flex items-end justify-between gap-5">
            <div className="hidden max-w-3xl flex-wrap gap-x-5 gap-y-1 text-[0.58rem] uppercase tracking-[0.16em] text-ivory/38 sm:flex">
              {featuredCredentials.map((credential) => (
                <span key={credential.label}>{credential.label} · {credential.detail}</span>
              ))}
            </div>
            <Link href="/about" className="shrink-0 text-xs font-medium uppercase tracking-[0.18em] text-sandstone transition-colors hover:text-ivory">
              Read the full practice ↗
            </Link>
          </div>
          <div className="mt-4 h-px overflow-hidden bg-ivory/12">
            <motion.div className="h-full origin-left bg-sandstone" style={{ scaleX: progressScale }} />
          </div>
        </div>
      </div>
    </section>
  );
}
