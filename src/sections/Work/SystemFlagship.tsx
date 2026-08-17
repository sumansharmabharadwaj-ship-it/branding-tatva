"use client";

import { useHydratedMotionPreference } from "@/hooks/useHydratedReducedMotion";
import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { Container } from "@/components/Container";
import { BackgroundVideo } from "@/components/BackgroundVideo";
import { useLenis } from "@/components/SmoothScrollProvider";
import type { Project } from "@/data/projects";
import { getWorkTaxonomy } from "@/data/workTaxonomy";
import { registerScrollCheck } from "@/lib/scrollCheckRegistry";
import { WORK, EASE_ORGANIC } from "@/sections/Work/palette";

const VISUAL_STATES = [
  {
    word: "ACCESS",
    eyebrow: "The default meaning",
    line: "A generic route to inexpensive supply.",
  },
  {
    word: "ORIGIN",
    eyebrow: "The positioning decision",
    line: "Craft and story before price.",
  },
  {
    word: "SYSTEM",
    eyebrow: "What the work built",
    line: "One foundation carried through channels and rollout.",
  },
] as const;

const SYSTEM_CARDS = [
  {
    label: "Foundation",
    detail: "Belief · mission · promise · value",
  },
  {
    label: "Content architecture",
    detail: "65% authority · 25% culture · 10% direct brand",
  },
  {
    label: "Rollout",
    detail: "Foundation → audience pull → lead quality → market position",
  },
] as const;

export function SystemFlagship({ project }: { project: Project }) {
  const { hydrated, prefersReducedMotion } = useHydratedMotionPreference();
  const animateTransitions = hydrated && !prefersReducedMotion;
  const lenis = useLenis();
  const [active, setActive] = useState(0);
  const stepRefs = useRef<(HTMLDivElement | null)[]>([]);
  const evidencePoster = getWorkTaxonomy(project.slug).evidencePoster;

  const steps = [
    {
      label: "The category risk",
      title: "A real opportunity was about to inherit a generic meaning.",
      body: project.challenge,
    },
    {
      label: "The strategic choice",
      title: "The advantage was not access. It was origin.",
      body: project.strategy ?? project.insight ?? "",
    },
    {
      label: "The operating system",
      title: "The position had to survive contact with every channel.",
      body: project.execution ?? project.outcome,
    },
  ];

  useEffect(() => {
    if (!hydrated || prefersReducedMotion) return;

    function checkActiveStep() {
      const elements = stepRefs.current.filter((element): element is HTMLDivElement => Boolean(element));
      if (elements.length === 0) return;

      const firstRect = elements[0].getBoundingClientRect();
      const lastRect = elements[elements.length - 1].getBoundingClientRect();

      if (firstRect.top >= window.innerHeight) {
        setActive(0);
        return;
      }
      if (lastRect.bottom <= 0) {
        setActive(elements.length - 1);
        return;
      }

      const readingLine = window.innerHeight * 0.48;
      let closestIndex = 0;
      let closestDistance = Number.POSITIVE_INFINITY;

      elements.forEach((element, index) => {
        const rect = element.getBoundingClientRect();
        const center = rect.top + rect.height / 2;
        const distance = Math.abs(center - readingLine);
        if (distance < closestDistance) {
          closestDistance = distance;
          closestIndex = index;
        }
      });

      setActive(closestIndex);
    }

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          const index = Number(entry.target.getAttribute("data-system-step"));
          if (Number.isFinite(index)) setActive(index);
        }
      },
      { rootMargin: "-38% 0px -48% 0px" },
    );

    stepRefs.current.forEach((element) => element && observer.observe(element));
    const frame = window.requestAnimationFrame(checkActiveStep);
    const fallback = window.setTimeout(checkActiveStep, 700);

    let unsubscribe: (() => void) | undefined;
    if (lenis) {
      unsubscribe = registerScrollCheck(lenis, checkActiveStep);
    } else {
      window.addEventListener("scroll", checkActiveStep, { passive: true });
      unsubscribe = () => window.removeEventListener("scroll", checkActiveStep);
    }

    window.addEventListener("pageshow", checkActiveStep);

    return () => {
      observer.disconnect();
      window.cancelAnimationFrame(frame);
      window.clearTimeout(fallback);
      unsubscribe?.();
      window.removeEventListener("pageshow", checkActiveStep);
    };
  }, [hydrated, lenis, prefersReducedMotion]);

  const state = VISUAL_STATES[active] ?? VISUAL_STATES[0];

  function goToStep(index: number) {
    setActive(index);
    const element = stepRefs.current[index];
    if (!element) return;

    if (lenis) {
      lenis.scrollTo(element, { offset: -Math.round(window.innerHeight * 0.32) });
    } else {
      element.scrollIntoView({ behavior: prefersReducedMotion ? "auto" : "smooth", block: "center" });
    }
  }

  return (
    <section className="relative scroll-mt-28 overflow-hidden py-20 sm:py-28" style={{ backgroundColor: "#10151A" }}>
      <BackgroundVideo
        video="/videos/pexels-moss-stream.mp4"
        poster="/images/pexels-moss-stream-poster.jpg"
        parallax
        playbackRate={0.9}
      />
      <div
        aria-hidden="true"
        className="absolute inset-0"
        style={{
          backgroundImage:
            "linear-gradient(105deg, rgba(7,12,13,0.95) 0%, rgba(10,16,18,0.82) 46%, rgba(10,16,18,0.58) 100%)",
        }}
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -left-[12%] top-[12%] h-[34rem] w-[34rem] rounded-full opacity-50 blur-3xl"
        style={{ background: "radial-gradient(circle, rgba(184,90,52,0.22), transparent 68%)" }}
      />

      <Container className="relative max-w-6xl">
        <div className="grid gap-8 border-b pb-10 lg:grid-cols-[1fr_auto] lg:items-end" style={{ borderColor: "rgba(198,169,122,0.22)" }}>
          <div>
            <p className="text-sm font-medium uppercase tracking-[0.2em]" style={{ color: WORK.sand }}>
              Flagship case study · system building
            </p>
            <h2 className="mt-2 max-w-3xl font-display text-display-sm font-normal text-white sm:text-display-md">
              {project.title}
            </h2>
            <p className="mt-3 text-xs font-medium uppercase tracking-[0.15em]" style={{ color: "rgba(242,240,232,0.6)" }}>
              {project.industry}
            </p>
          </div>
          <div className="grid grid-cols-[auto_1fr] gap-x-3 gap-y-1 text-sm lg:max-w-sm">
            <span className="text-[0.6rem] font-medium uppercase tracking-[0.16em]" style={{ color: WORK.sand }}>
              From
            </span>
            <span className="text-white/72">Generic access-only marketplace</span>
            <span className="text-[0.6rem] font-medium uppercase tracking-[0.16em]" style={{ color: WORK.sand }}>
              To
            </span>
            <span className="text-white/90">An origin-led brand and content operating system</span>
          </div>
        </div>

        <div className="mt-12 grid gap-12 lg:grid-cols-[1.05fr_0.95fr] lg:gap-16">
          <div className="lg:sticky lg:top-24 lg:self-start">
            <div
              className="relative overflow-hidden rounded-[1.6rem] border shadow-[0_28px_90px_rgba(0,0,0,0.3)]"
              style={{ borderColor: "rgba(198,169,122,0.28)", backgroundColor: "#172027" }}
            >
              <div className="relative aspect-[4/3] overflow-hidden">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={evidencePoster}
                  alt={`${project.title} brand-system evidence diagram`}
                  className="absolute inset-0 h-full w-full object-cover opacity-55"
                />
                <div
                  aria-hidden="true"
                  className="absolute inset-0"
                  style={{ background: "linear-gradient(135deg, rgba(16,21,26,0.18), rgba(16,21,26,0.92) 76%)" }}
                />

                <div className="absolute inset-0 flex flex-col justify-between p-5 sm:p-7">
                  <AnimatePresence mode="wait" initial={false}>
                    <motion.div
                      key={`${state.word}-heading`}
                      initial={animateTransitions ? { opacity: 0, y: 10 } : false}
                      animate={{ opacity: 1, y: 0 }}
                      exit={animateTransitions ? { opacity: 0, y: -6 } : undefined}
                      transition={{ duration: animateTransitions ? 0.45 : 0, ease: EASE_ORGANIC }}
                    >
                      <p className="text-[0.6rem] font-medium uppercase tracking-[0.18em]" style={{ color: WORK.sand }}>
                        {state.eyebrow}
                      </p>
                      <p className="mt-1 font-display text-[clamp(3.2rem,8vw,6.7rem)] font-normal leading-none tracking-[-0.04em] text-white">
                        {state.word}
                      </p>
                      <p className="mt-2 max-w-md text-sm leading-relaxed text-white/75 sm:text-base">{state.line}</p>
                    </motion.div>
                  </AnimatePresence>

                  <div className="relative h-[12rem] sm:h-[13.5rem]" aria-label="System components">
                    {SYSTEM_CARDS.map((card, index) => {
                      const settled = prefersReducedMotion || active >= 2;
                      const considered = active >= 1;
                      const x = settled ? 0 : considered ? index * 13 : (index - 1) * 34;
                      const y = settled ? index * 66 : considered ? index * 38 : index * 25;
                      const rotate = settled ? 0 : considered ? (index - 1) * 1.5 : (index - 1) * 4;

                      return (
                        <motion.div
                          key={card.label}
                          className="absolute inset-x-0 rounded-2xl border p-4 backdrop-blur-md"
                          animate={{
                            x: animateTransitions ? x : 0,
                            y: prefersReducedMotion ? index * 66 : animateTransitions ? y : index * 42,
                            rotate: animateTransitions ? rotate : 0,
                            opacity: prefersReducedMotion || active > 0 ? 1 : 0.7 + index * 0.1,
                          }}
                          transition={{ duration: animateTransitions ? 0.62 : 0, ease: EASE_ORGANIC }}
                          style={{
                            borderColor: settled ? "rgba(198,169,122,0.44)" : "rgba(242,240,232,0.2)",
                            backgroundColor: settled ? "rgba(31,58,40,0.9)" : "rgba(16,21,26,0.8)",
                          }}
                        >
                          <p className="text-[0.58rem] font-medium uppercase tracking-[0.16em]" style={{ color: WORK.sand }}>
                            {String(index + 1).padStart(2, "0")} · {card.label}
                          </p>
                          <p className="mt-1 text-sm text-white/82">{card.detail}</p>
                        </motion.div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>

            <ol className="mt-5 grid grid-cols-3 gap-2" aria-label="Case-study progress">
              {steps.map((step, index) => (
                <li key={step.label}>
                  <button
                    type="button"
                    onClick={() => goToStep(index)}
                    aria-current={active === index ? "step" : undefined}
                    aria-label={`${String(index + 1).padStart(2, "0")}: ${step.label}`}
                    className="min-h-10 w-full rounded-full border px-3 py-2 text-[0.58rem] font-medium uppercase tracking-[0.13em] transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2"
                    style={{
                      borderColor: active === index ? WORK.sand : "rgba(198,169,122,0.22)",
                      backgroundColor: active === index ? "rgba(198,169,122,0.12)" : "transparent",
                      color: active === index ? WORK.sand : "rgba(242,240,232,0.58)",
                      outlineColor: WORK.sand,
                    }}
                  >
                    {String(index + 1).padStart(2, "0")}
                  </button>
                </li>
              ))}
            </ol>
          </div>

          <div>
            {steps.map((step, index) => (
              <div
                key={step.label}
                data-system-step={index}
                ref={(element) => {
                  stepRefs.current[index] = element;
                }}
                className="flex min-h-[44vh] items-center border-l-2 py-10 pl-7 transition-colors duration-500 first:pt-2 last:min-h-[40vh] sm:min-h-[50vh] sm:py-12 sm:pl-9 lg:min-h-[62vh] lg:last:min-h-[46vh]"
                style={{ borderColor: active === index ? WORK.sand : "rgba(198,169,122,0.16)" }}
              >
                <div>
                  <p className="flex items-center gap-3 text-[0.62rem] font-medium uppercase tracking-[0.18em]" style={{ color: WORK.sand }}>
                    <span className="font-display text-base" aria-hidden="true">
                      {String(index + 1).padStart(2, "0")}
                    </span>
                    {step.label}
                  </p>
                  <h3 className="mt-3 max-w-xl font-display text-3xl font-normal leading-tight text-white sm:text-4xl">
                    {step.title}
                  </h3>
                  <p
                    className="mt-5 max-w-xl text-base leading-relaxed transition-opacity duration-500"
                    style={{ color: "rgba(242,240,232,0.78)", opacity: prefersReducedMotion || active === index ? 1 : 0.62 }}
                  >
                    {step.body}
                  </p>
                </div>
              </div>
            ))}

            <div className="border-l-2 pb-2 pl-7 sm:pl-9" style={{ borderColor: WORK.sand }}>
              <p className="text-[0.62rem] font-medium uppercase tracking-[0.18em]" style={{ color: WORK.sand }}>
                Outcome on record
              </p>
              <p className="mt-3 max-w-xl text-lg leading-relaxed text-white">{project.outcome}</p>
              <Link
                href={`/work/${project.slug}`}
                className="link-underline mt-6 inline-flex items-center gap-2 text-sm font-medium"
                style={{ color: WORK.sand }}
              >
                Read the full case study <span aria-hidden="true">→</span>
              </Link>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
