"use client";

import { useHydratedReducedMotion } from "@/hooks/useHydratedReducedMotion";
import { motion, useInView, useMotionValueEvent, useScroll, useTransform, type MotionStyle } from "framer-motion";
import Image from "next/image";
import { useCallback, useEffect, useRef, type CSSProperties, type FocusEvent, type KeyboardEvent } from "react";
import { Container } from "@/components/Container";
import { useMediaQuery } from "@/hooks/useMediaQuery";
import { useScrollDrivenVisualizer } from "@/hooks/useScrollDrivenVisualizer";
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

function TatvaReading({ tatva }: { tatva: Tatva }) {
  return (
    <>
      <p className="tatva-observatory__reading-title mt-3 font-display text-2xl font-normal">{tatva.role}</p>
      <p className="tatva-observatory__reading-question mt-2 text-base leading-relaxed">{tatva.question}</p>
      <p className="mt-4 text-sm leading-relaxed text-ivory/75">Governs · {tatva.governs}</p>
    </>
  );
}

export function TatvaStrip() {
  const prefersReducedMotion = Boolean(useHydratedReducedMotion());
  const sectionRef = useRef<HTMLElement>(null);
  const frameRef = useRef<HTMLDivElement>(null);
  const choicesRef = useRef<HTMLDivElement>(null);
  const readingRef = useRef<HTMLDivElement>(null);
  const readingAnimations = useRef<Animation[]>([]);
  const forceRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const previousIndex = useRef(0);
  const inView = useInView(sectionRef, { amount: 0.18 });
  const desktopStory = useMediaQuery("(min-width: 1181px) and (min-height: 761px) and (pointer: fine)");
  const { activeIndex, choose, preview, releasePreview, scrollYProgress } = useScrollDrivenVisualizer({
    count: TATVAS.length,
    target: sectionRef,
    enabled: desktopStory && inView,
    reducedMotion: prefersReducedMotion,
    scrollHysteresis: 0.0125,
    preservePanelFocus: true,
    focusScopeSelector: ".tatva-observatory__focus, .tatva-observatory__force",
  });
  const active = TATVAS[activeIndex] ?? TATVAS[0];
  const { scrollYProgress: choicesProgress } = useScroll({ target: choicesRef, offset: ["start end", "end start"] });
  const choicesArrival = useTransform(choicesProgress, [0, .55], [0, 1]);

  const writeProgress = useCallback((progress: number) => {
    if (!desktopStory || prefersReducedMotion) return;
    frameRef.current?.style.setProperty("--tatva-scroll-progress", Math.max(0, Math.min(1, progress)).toFixed(4));
  }, [desktopStory, prefersReducedMotion]);
  useMotionValueEvent(scrollYProgress, "change", writeProgress);
  useEffect(() => {
    const frame = frameRef.current;
    writeProgress(scrollYProgress.get());
    return () => { frame?.style.removeProperty("--tatva-scroll-progress"); };
  }, [scrollYProgress, writeProgress]);

  const settleReading = useCallback(() => {
    readingAnimations.current.forEach((animation) => animation.cancel());
    readingAnimations.current = [];
  }, []);
  useEffect(() => {
    const previous = previousIndex.current;
    previousIndex.current = activeIndex;
    settleReading();
    if (prefersReducedMotion || previous === activeIndex) return;
    const reading = readingRef.current;
    if (!reading || reading.closest("#tatva-focus-reading")?.matches(":focus-within")) return;
    const direction = activeIndex > previous ? 1 : -1;
    // Animate the three original paragraphs separately. Native animations can
    // restart on every choice without replacing text nodes or the focus region.
    readingAnimations.current = Array.from(reading.children).map((paragraph, index) => paragraph.animate([
      { transform: `translate3d(${-direction * (desktopStory ? 10 : 5)}px, ${desktopStory ? 4 : 2}px, 0)`, opacity: 1 },
      { transform: "translate3d(0, 0, 0)", opacity: 1 },
    ], { duration: 460, delay: index * 45, fill: "backwards", easing: "cubic-bezier(0.22, 1, 0.36, 1)" }));
    return settleReading;
  }, [activeIndex, desktopStory, prefersReducedMotion, settleReading]);

  function revealFocusedReading(event: FocusEvent<HTMLElement>) {
    const target = event.target;
    if (!(target instanceof HTMLElement) || !target.matches(":focus-visible")) return;
    const bounds = target.getBoundingClientRect();
    if (bounds.top < 80 || bounds.bottom > window.innerHeight - 80) {
      target.scrollIntoView({
        block: bounds.height > window.innerHeight - 160 ? "start" : "center",
        inline: "nearest",
        behavior: "instant",
      });
    }
  }

  function onForceKey(event: KeyboardEvent<HTMLButtonElement>, index: number) {
    if (!["ArrowLeft", "ArrowRight", "Home", "End"].includes(event.key)) return;
    event.preventDefault();
    const next = event.key === "Home" ? 0 : event.key === "End" ? TATVAS.length - 1
      : (index + (event.key === "ArrowRight" ? 1 : TATVAS.length - 1)) % TATVAS.length;
    choose(next);
    const nextButton = forceRefs.current[next];
    if (!nextButton) return;
    // One focus placement owns the correction, including the bottom controls.
    nextButton.focus({ preventScroll: true });
  }

  const motionActive = inView && !prefersReducedMotion;

  return (
    <section
      ref={sectionRef}
      className="tatva-observatory relative isolate"
      style={{ backgroundColor: "#0D1514" }}
      aria-labelledby="tatva-framework-title"
      onFocusCapture={revealFocusedReading}
    >
      <div
        ref={frameRef}
        className="tatva-observatory__stage relative isolate overflow-hidden py-20 sm:py-28"
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
          animate={{ x: motionActive ? activeIndex * 8 : 0 }}
          transition={{ duration: prefersReducedMotion ? 0 : 0.65, ease: [0.22, 1, 0.36, 1] }}
        />
        <motion.div
          aria-hidden="true"
          className="pointer-events-none absolute -right-28 bottom-[8%] z-[2] h-96 w-96 rounded-full blur-3xl"
          style={{ background: "radial-gradient(circle, rgba(82,117,111,0.24), transparent 68%)" }}
          animate={{ x: motionActive ? activeIndex * -8 : 0 }}
          transition={{ duration: prefersReducedMotion ? 0 : 0.65, ease: [0.22, 1, 0.36, 1] }}
        />

        <Container className="tatva-observatory__frame relative z-[3] max-w-[100rem]">
        <div className="tatva-observatory__layout">
          <div className="tatva-observatory__copy">
            <p className="text-sm font-medium uppercase tracking-[0.2em]" style={{ color: "#D4B99A" }}>
              The framework
            </p>
            <h2
              id="tatva-framework-title"
              className="mt-3 font-display text-display-sm font-normal leading-[1.08]"
            >
              Five forces. One recognisable brand.
            </h2>
            <p className="mt-4 max-w-sm text-base leading-relaxed">
              Each Tatva governs a different decision. The system works when none of them is forced to compensate for a missing one.
            </p>
          </div>

          <motion.div
            ref={choicesRef}
            className="tatva-observatory__choices"
            style={{ "--tatva-arrival": prefersReducedMotion ? 1 : choicesArrival } as MotionStyle}
          >
            <ol aria-label="Choose a Tatva" className="tatva-observatory__orbit grid grid-cols-2 gap-x-4 gap-y-8 sm:grid-cols-3 lg:flex lg:items-start lg:justify-between lg:gap-2">
              {TATVAS.map((tatva, index) => {
                const element = elements.find((entry) => entry.slug === tatva.slug);
                const isActive = index === activeIndex;

                return (
                  <li
                    key={tatva.slug}
                    className="flex min-w-0 items-start lg:flex-1"
                    style={{ "--tatva-order": index } as CSSProperties}
                  >
                    <button
                      ref={(node) => { forceRefs.current[index] = node; }}
                      type="button"
                      aria-pressed={isActive}
                      aria-controls="tatva-focus-reading"
                      aria-label={`Focus ${tatva.name}: ${tatva.role}`}
                      onClick={() => choose(index)}
                      onPointerEnter={(event) => { if (event.pointerType === "mouse") preview(index); }}
                      onPointerLeave={releasePreview}
                      onKeyDown={(event) => onForceKey(event, index)}
                      className="tatva-observatory__force group flex min-w-0 w-full flex-col items-center rounded-2xl text-center focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-sandstone"
                    >
                      <motion.span
                        className="relative block h-24 w-24 lg:h-28 lg:w-28"
                        initial={false}
                        animate={{ scale: prefersReducedMotion ? 1 : isActive ? 1.04 : 0.96 }}
                        transition={{ duration: prefersReducedMotion ? 0 : 0.45, ease: [0.22, 1, 0.36, 1] }}
                      >
                        <motion.span
                          aria-hidden="true"
                          className="absolute -inset-3 rounded-full border"
                          style={{ borderColor: `${ELEMENT_HEX[tatva.slug]}77` }}
                          initial={false}
                          animate={{ opacity: isActive ? 1 : 0, scale: prefersReducedMotion ? 1 : isActive ? 1 : 0.94 }}
                          transition={{ duration: prefersReducedMotion ? 0 : 0.45, ease: [0.22, 1, 0.36, 1] }}
                        />

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
                              initial={false}
                              animate={{ scale: prefersReducedMotion ? 1 : isActive ? 1.1 : 1.02 }}
                              transition={{ duration: prefersReducedMotion ? 0 : 0.65, ease: [0.22, 1, 0.36, 1] }}
                            >
                              <Image src={element.image} alt="" fill sizes="112px" className="object-cover" />
                            </motion.span>
                          )}
                        </span>
                      </motion.span>

                      <span className="tatva-observatory__name mt-5 text-sm font-medium uppercase tracking-[0.16em]">
                        {tatva.name}
                      </span>
                      <span className="tatva-observatory__role mt-1 font-display text-lg font-normal text-[#D4B99A]">
                        {tatva.role}
                      </span>
                      <span className="tatva-observatory__line mt-1 max-w-[11rem] text-sm leading-relaxed">
                        {tatva.line}
                      </span>
                    </button>

                    {index < TATVAS.length - 1 && (
                      <span aria-hidden="true" className="tatva-observatory__connector relative mt-14 hidden h-px flex-1 lg:block">
                        <span className="absolute inset-0 border-t border-dashed" style={{ borderColor: "rgba(244,239,230,0.18)" }} />
                        <motion.span
                          className="absolute inset-0 origin-left bg-sandstone"
                          initial={false}
                          animate={{ scaleX: isActive ? 1 : 0 }}
                          transition={{ duration: prefersReducedMotion ? 0 : 0.45, ease: [0.22, 1, 0.36, 1] }}
                        />
                      </span>
                    )}
                  </li>
                );
              })}
            </ol>
          </motion.div>

            <div
              id="tatva-focus-reading"
              role="region"
              aria-label={`${active.name}: ${active.role}`}
              tabIndex={0}
              onFocusCapture={settleReading}
              onPointerDown={settleReading}
              className="tatva-observatory__focus overflow-hidden rounded-2xl border p-5"
              style={{
                borderColor: `${ELEMENT_HEX[active.slug]}88`,
                background: `radial-gradient(circle at 92% 4%, ${ELEMENT_HEX[active.slug]}24, transparent 42%), rgba(9,18,16,0.78)`,
              }}
            >
              <div className="flex items-center justify-between gap-4">
                <p className="text-[0.8125rem] font-medium uppercase tracking-[0.12em]">
                  Now in focus
                </p>
                <span className="text-[0.8125rem] tracking-[0.1em] text-ivory/75">
                  {String(activeIndex + 1).padStart(2, "0")} / 05
                </span>
              </div>
              <div className="tatva-observatory__reading">
                <div className="tatva-observatory__reading-measure" aria-hidden="true" inert>
                  {TATVAS.map((tatva) => <div key={tatva.slug}><TatvaReading tatva={tatva} /></div>)}
                </div>
                <div ref={readingRef} className="tatva-observatory__reading-copy">
                  <TatvaReading tatva={active} />
                </div>
              </div>
            </div>
        </div>
        </Container>
      </div>
    </section>
  );
}
