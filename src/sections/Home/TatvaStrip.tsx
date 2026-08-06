"use client";

import { useHydratedReducedMotion } from "@/hooks/useHydratedReducedMotion";
import { motion, useInView } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { Container } from "@/components/Container";
import { Reveal } from "@/components/Reveal";
import { elements } from "@/data/elements";
import { ELEMENT_HEX } from "@/lib/sectionWash";

type Tatva = {
  slug: keyof typeof ELEMENT_HEX;
  name: string;
  role: string;
  line: string;
  governs: string;
  question: string;
};

const TATVAS: Tatva[] = [
  {
    slug: "earth",
    name: "Prithvi",
    role: "The Foundation",
    line: "The strategic truth everything else stands on.",
    governs: "Positioning, category, audience, belief",
    question: "What must people understand before the brand looks like anything?",
  },
  {
    slug: "water",
    name: "Jal",
    role: "The Flow",
    line: "The experience that makes every touchpoint feel related.",
    governs: "Journey, offers, interaction, continuity",
    question: "How should every encounter feel connected to the one before it?",
  },
  {
    slug: "fire",
    name: "Agni",
    role: "The Spark",
    line: "The distinct expression that earns attention.",
    governs: "Identity, distinction, creative direction",
    question: "What gives the right audience a reason to look twice?",
  },
  {
    slug: "air",
    name: "Vayu",
    role: "The Voice",
    line: "The language people carry beyond the room.",
    governs: "Voice, messaging, content, distribution",
    question: "What can people repeat clearly after the brand has stopped speaking?",
  },
  {
    slug: "space",
    name: "Akash",
    role: "The Space",
    line: "The consistency that turns exposure into memory.",
    governs: "Recognition, governance, repetition, recall",
    question: "What must remain coherent long enough to become familiar?",
  },
];

const AUTO_ADVANCE_MS = 3400;
const MANUAL_PAUSE_MS = 15000;
const HOVER_PREVIEW_MS = 3000;

export function TatvaStrip() {
  const prefersReducedMotion = Boolean(useHydratedReducedMotion());
  const sectionRef = useRef<HTMLElement>(null);
  const pauseUntilRef = useRef(0);
  const inView = useInView(sectionRef, { amount: 0.18 });
  const [activeIndex, setActiveIndex] = useState(0);
  const active = TATVAS[activeIndex] ?? TATVAS[0];

  useEffect(() => {
    if (prefersReducedMotion || !inView) return;

    const timer = window.setInterval(() => {
      if (document.hidden || Date.now() < pauseUntilRef.current) return;
      setActiveIndex((current) => (current + 1) % TATVAS.length);
    }, AUTO_ADVANCE_MS);

    return () => window.clearInterval(timer);
  }, [inView, prefersReducedMotion]);

  useEffect(() => {
    function onChapter(event: Event) {
      const detail = (event as CustomEvent<{ id?: string }>).detail;
      if (detail?.id !== "framework") return;
      setActiveIndex(0);
      pauseUntilRef.current = Date.now() + 650;
    }

    window.addEventListener("bt:home-chapter", onChapter as EventListener);
    return () => {
      window.removeEventListener("bt:home-chapter", onChapter as EventListener);
    };
  }, []);

  function choose(index: number, duration = MANUAL_PAUSE_MS) {
    pauseUntilRef.current = Date.now() + duration;
    setActiveIndex(index);
  }

  const motionActive = inView && !prefersReducedMotion;

  return (
    <section
      ref={sectionRef}
      className="tatva-observatory relative isolate overflow-hidden py-20 sm:py-28"
      style={{ backgroundColor: "#0D1514" }}
      aria-labelledby="tatva-framework-title"
      onPointerDown={() => {
        pauseUntilRef.current = Date.now() + MANUAL_PAUSE_MS;
      }}
      onTouchStart={() => {
        pauseUntilRef.current = Date.now() + MANUAL_PAUSE_MS;
      }}
      onFocusCapture={() => {
        pauseUntilRef.current = Date.now() + MANUAL_PAUSE_MS;
      }}
    >
      <div className="tatva-observatory__film" aria-hidden="true">
        <video
          src="/videos/higgsfield-confident-light.mp4"
          poster="/images/higgsfield-confident-light-poster.jpg"
          muted
          autoPlay={!prefersReducedMotion}
          loop
          playsInline
          preload={inView ? "metadata" : "none"}
          data-home-playback-rate="1.2"
        />
        <span />
      </div>

      <motion.div
        aria-hidden="true"
        className="pointer-events-none absolute -left-28 top-[18%] z-[2] h-80 w-80 rounded-full blur-3xl"
        style={{ background: "radial-gradient(circle, rgba(199,119,82,0.22), transparent 68%)" }}
        animate={motionActive ? { x: [0, 44, 0], y: [0, 28, 0], scale: [1, 1.12, 1] } : undefined}
        transition={motionActive ? { duration: 14, repeat: Infinity, ease: "easeInOut" } : undefined}
      />
      <motion.div
        aria-hidden="true"
        className="pointer-events-none absolute -right-28 bottom-[8%] z-[2] h-96 w-96 rounded-full blur-3xl"
        style={{ background: "radial-gradient(circle, rgba(82,117,111,0.24), transparent 68%)" }}
        animate={motionActive ? { x: [0, -52, 0], y: [0, -24, 0], scale: [1.04, 0.94, 1.04] } : undefined}
        transition={motionActive ? { duration: 17, repeat: Infinity, ease: "easeInOut" } : undefined}
      />

      <Container className="relative z-[3] max-w-[100rem]">
        <div className="grid gap-12 lg:grid-cols-[minmax(0,21rem)_1fr] lg:items-center lg:gap-16">
          <Reveal className="tatva-observatory__copy">
            <p className="text-sm font-medium uppercase tracking-[0.2em]" style={{ color: "#D4B99A" }}>
              The framework
            </p>
            <h2
              id="tatva-framework-title"
              className="mt-3 font-display text-display-sm font-normal leading-[1.08]"
            >
              Five forces. One recognisable brand.
            </h2>
            <p className="mt-4 max-w-sm text-sm leading-relaxed">
              Each Tatva governs a different decision. The system works when none of them is forced to compensate for a missing one.
            </p>

            <motion.div
              key={active.slug}
              className="tatva-observatory__focus mt-7 overflow-hidden rounded-2xl border p-5"
              style={{
                borderColor: `${ELEMENT_HEX[active.slug]}88`,
                background: `radial-gradient(circle at 92% 4%, ${ELEMENT_HEX[active.slug]}24, transparent 42%), rgba(9,18,16,0.78)`,
              }}
              initial={prefersReducedMotion ? false : { opacity: 0, y: 10, filter: "blur(5px)" }}
              animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              transition={{ duration: prefersReducedMotion ? 0 : 0.55, ease: [0.22, 1, 0.36, 1] }}
              aria-live="polite"
            >
              <div className="flex items-center justify-between gap-4">
                <p className="text-[0.62rem] font-medium uppercase tracking-[0.18em]">
                  Now in focus
                </p>
                <span className="text-[0.62rem] tracking-[0.14em]" style={{ color: ELEMENT_HEX[active.slug] }}>
                  {String(activeIndex + 1).padStart(2, "0")} / 05
                </span>
              </div>
              <p className="mt-3 font-display text-2xl font-normal">
                {active.role}
              </p>
              <p className="mt-2 text-sm leading-relaxed">
                {active.question}
              </p>
              <p className="mt-4 text-[0.62rem] font-medium uppercase tracking-[0.14em]" style={{ color: ELEMENT_HEX[active.slug] }}>
                Governs · {active.governs}
              </p>
              <span className="mt-4 block h-px overflow-hidden bg-ivory/10">
                <motion.span
                  key={`progress-${active.slug}`}
                  className="block h-full origin-left"
                  style={{ backgroundColor: ELEMENT_HEX[active.slug] }}
                  initial={{ scaleX: 0 }}
                  animate={{ scaleX: 1 }}
                  transition={{ duration: prefersReducedMotion ? 0 : AUTO_ADVANCE_MS / 1000, ease: "linear" }}
                />
              </span>
            </motion.div>

            <Link
              href="#tatva"
              className="link-underline mt-6 inline-flex items-center gap-2 text-sm font-medium uppercase tracking-[0.14em]"
              style={{ color: "#D4B99A" }}
            >
              Enter the five-element chapter <span aria-hidden="true">→</span>
            </Link>
          </Reveal>

          <Reveal delay={0.1}>
            <ol className="tatva-observatory__orbit grid grid-cols-2 gap-x-4 gap-y-8 sm:grid-cols-3 lg:flex lg:items-start lg:justify-between lg:gap-2">
              {TATVAS.map((tatva, index) => {
                const element = elements.find((entry) => entry.slug === tatva.slug);
                const direction = index % 2 === 0 ? 1 : -1;
                const isActive = index === activeIndex;

                return (
                  <motion.li
                    key={tatva.slug}
                    className="flex min-w-0 items-start lg:flex-1"
                    initial={prefersReducedMotion ? false : { opacity: 0, y: 26 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, amount: 0.2 }}
                    animate={{ opacity: isActive ? 1 : 0.58 }}
                    transition={{
                      duration: prefersReducedMotion ? 0 : 0.65,
                      delay: prefersReducedMotion ? 0 : index * 0.06,
                      ease: [0.22, 1, 0.36, 1],
                    }}
                  >
                    <button
                      type="button"
                      aria-pressed={isActive}
                      aria-label={`Focus ${tatva.name}: ${tatva.role}`}
                      onClick={() => choose(index)}
                      onPointerEnter={() => choose(index, HOVER_PREVIEW_MS)}
                      onFocus={() => choose(index)}
                      className="tatva-observatory__force group flex min-w-0 w-full flex-col items-center rounded-2xl text-center focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-sandstone"
                    >
                      <motion.span
                        className="relative block h-24 w-24 lg:h-28 lg:w-28"
                        animate={
                          motionActive
                            ? {
                                y: isActive ? [0, -9, 0] : [0, -3, 0],
                                rotate: isActive ? [0, direction * 1.5, 0] : 0,
                                scale: isActive ? [1, 1.055, 1] : 0.9,
                              }
                            : undefined
                        }
                        transition={
                          motionActive
                            ? {
                                duration: isActive ? 5.6 : 7.5,
                                repeat: Infinity,
                                ease: "easeInOut",
                              }
                            : undefined
                        }
                      >
                        <motion.span
                          aria-hidden="true"
                          className="absolute -inset-3 rounded-full border border-dashed"
                          style={{ borderColor: `${ELEMENT_HEX[tatva.slug]}77` }}
                          animate={motionActive && isActive ? { rotate: direction * 360 } : undefined}
                          transition={motionActive && isActive ? { duration: 17 + index * 1.5, repeat: Infinity, ease: "linear" } : undefined}
                        />
                        <motion.span
                          aria-hidden="true"
                          className="absolute -inset-4 rounded-full"
                          animate={motionActive && isActive ? { rotate: direction * -360 } : undefined}
                          transition={motionActive && isActive ? { duration: 11 + index * 1.2, repeat: Infinity, ease: "linear" } : undefined}
                        >
                          <span
                            className="absolute left-1/2 top-0 h-2 w-2 -translate-x-1/2 rounded-full"
                            style={{
                              backgroundColor: ELEMENT_HEX[tatva.slug],
                              boxShadow: isActive ? `0 0 18px ${ELEMENT_HEX[tatva.slug]}bb` : "none",
                            }}
                          />
                        </motion.span>

                        <span
                          className="tatva-observatory__portrait absolute inset-0 overflow-hidden rounded-full ring-2 ring-offset-2 transition-transform duration-500 group-hover:scale-[1.05]"
                          style={{
                            ["--tw-ring-color" as string]: `${ELEMENT_HEX[tatva.slug]}88`,
                            ["--tw-ring-offset-color" as string]: "#0D1514",
                          }}
                        >
                          {element?.image && (
                            <motion.span
                              className="absolute inset-0"
                              animate={
                                motionActive
                                  ? isActive
                                    ? { scale: [1.03, 1.14, 1.03], x: [0, direction * 5, 0], y: [0, -3, 0] }
                                    : { scale: 1.04 }
                                  : undefined
                              }
                              transition={motionActive ? { duration: 8 + index, repeat: Infinity, ease: "easeInOut" } : undefined}
                            >
                              <Image src={element.image} alt="" fill sizes="112px" className="object-cover" />
                            </motion.span>
                          )}
                          {isActive && motionActive && (
                            <motion.span
                              aria-hidden="true"
                              className="absolute -inset-y-3 -left-1/2 w-1/3 rotate-12 bg-white/20 blur-md"
                              animate={{ x: ["0%", "520%"] }}
                              transition={{ duration: 3.8, repeat: Infinity, repeatDelay: 2.4, ease: "easeInOut" }}
                            />
                          )}
                        </span>
                      </motion.span>

                      <span className="tatva-observatory__name mt-5 text-xs font-medium uppercase tracking-[0.25em]">
                        {tatva.name}
                      </span>
                      <span className="tatva-observatory__role mt-1 font-display text-base font-normal" style={{ color: ELEMENT_HEX[tatva.slug] }}>
                        {tatva.role}
                      </span>
                      <span className="tatva-observatory__line mt-1 max-w-[11rem] text-xs leading-relaxed">
                        {tatva.line}
                      </span>
                    </button>

                    {index < TATVAS.length - 1 && (
                      <span aria-hidden="true" className="tatva-observatory__connector relative mt-14 hidden h-px flex-1 lg:block">
                        <span className="absolute inset-0 border-t border-dashed" style={{ borderColor: "rgba(244,239,230,0.18)" }} />
                        {isActive && motionActive && (
                          <motion.span
                            className="absolute top-1/2 h-1.5 w-1.5 -translate-y-1/2 rounded-full bg-sandstone"
                            animate={{ left: ["0%", "100%"], opacity: [0, 1, 1, 0] }}
                            transition={{ duration: 2.2, repeat: Infinity, repeatDelay: 0.65, ease: "easeInOut" }}
                          />
                        )}
                      </span>
                    )}
                  </motion.li>
                );
              })}
            </ol>
          </Reveal>
        </div>
      </Container>
    </section>
  );
}
