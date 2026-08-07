"use client";

import { useHydratedReducedMotion } from "@/hooks/useHydratedReducedMotion";
import { useLenis } from "@/components/SmoothScrollProvider";
import Image from "next/image";
import Link from "next/link";
import { AnimatePresence, motion, useInView } from "framer-motion";
import { useEffect, useRef, useState, type CSSProperties } from "react";

const DISCIPLINES = [
  {
    number: "01",
    eyebrow: "M.A. Clinical Psychology",
    title: "Read the tension",
    line:
      "Audience behaviour is treated as evidence, not a demographic label. The work finds the friction people feel before they can explain it.",
    result: "Audience tension + perception map",
    video: "/videos/higgsfield-process-listen.mp4",
    poster: "/images/higgsfield-process-listen-poster.jpg",
    diagram: ["Notice", "Interpret", "Choose"],
    proofLabel: "Applied in HerbalCart",
    proofLine:
      "A supplement range being read through a purely herbal lens was repositioned as a modern, supplement-first wellness brand.",
    proofHref: "/work/herbalcart",
    accent: "#C98B63",
  },
  {
    number: "02",
    eyebrow: "B.A. English Literature",
    title: "Give it language",
    line:
      "Voice, narrative, rhythm, and symbolism turn a committed idea into language people can recognise, repeat, and carry beyond the page.",
    result: "Verbal identity + narrative spine",
    video: "/videos/higgsfield-idea-sketch.mp4",
    poster: "/images/higgsfield-idea-sketch.jpg",
    diagram: ["Meaning", "Language", "Memory"],
    proofLabel: "Applied in MyShopInEurope",
    proofLine:
      "Craft and origin replaced cheap access as the story European buyers could pass on to their own customers.",
    proofHref: "/work/myshopineurope",
    accent: "#7D9AA8",
  },
  {
    number: "03",
    eyebrow: "Strategy led directly by Suman",
    title: "Make it usable",
    line:
      "Positioning, identity, website, content, and campaigns are built as one connected system, so the business can keep using the idea after launch.",
    result: "A brand system that can keep moving",
    video: "/videos/higgsfield-process-shape.mp4",
    poster: "/images/higgsfield-process-shape-poster.jpg",
    diagram: ["Decision", "System", "Recognition"],
    proofLabel: "Applied in Dr. Haley Nutrition",
    proofLine:
      "A quality-first content system moved engagement from 0.71% to 2.81% while the account posted less.",
    proofHref: "/work/dr-haley-nutrition",
    accent: "#D3A24F",
  },
] as const;

const EASE = [0.22, 1, 0.36, 1] as const;

export function StudioCinematicChapter() {
  const sectionRef = useRef<HTMLElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const prefersReducedMotion = Boolean(useHydratedReducedMotion());
  const lenis = useLenis();
  const inView = useInView(sectionRef, {
    amount: 0.18,
    margin: "8% 0px -12% 0px",
  });
  const [activeIndex, setActiveIndex] = useState(0);
  const active = DISCIPLINES[activeIndex];

  // Scroll advances the disciplines now, rather than a timer.
  //
  // This chapter was 2.18 viewports of scrolling past a panel that changed
  // itself every 3.7 seconds, which is an auto advancing carousel, the one
  // pattern CLAUDE.md rules out. Reading at your own pace meant racing it.
  //
  // The section is a held scene instead: the frame stays still while the
  // runway underneath it scrolls, and position within that runway chooses
  // the discipline. Scrolling forward moves forward, scrolling back moves
  // back, and stopping holds. Sticky does the holding, measured rect maths
  // does the progress, matching every other held section here.
  useEffect(() => {
    const section = sectionRef.current;
    if (!section || prefersReducedMotion) return;
    // Below the runway breakpoint the frame is a normal block, so there is
    // no progress to read and the discipline list stays a plain chooser.
    if (!window.matchMedia("(min-width: 768px)").matches) return;

    let frame = 0;
    function read() {
      frame = 0;
      const el = sectionRef.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const travel = rect.height - window.innerHeight;
      if (travel <= 0) return;
      const progress = Math.min(1, Math.max(0, -rect.top / travel));
      // Sit each discipline in an equal band, biased slightly late so the
      // first one holds through the entrance rather than flicking past.
      const next = Math.min(
        DISCIPLINES.length - 1,
        Math.floor(progress * DISCIPLINES.length * 0.98),
      );
      setActiveIndex((current) => (current === next ? current : next));
    }
    function schedule() {
      if (frame) return;
      frame = window.requestAnimationFrame(read);
    }

    read();
    const unsubscribe = lenis?.on("scroll", schedule);
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    return () => {
      if (frame) window.cancelAnimationFrame(frame);
      unsubscribe?.();
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
    };
  }, [prefersReducedMotion, lenis]);

  useEffect(() => {
    const video = videoRef.current;
    if (!video || prefersReducedMotion) return;

    video.muted = true;
    video.defaultMuted = true;
    video.playsInline = true;
    video.loop = true;
    video.playbackRate = 1.22;

    if (inView && !document.hidden) {
      void video.play().catch(() => undefined);
    } else {
      video.pause();
    }

    return () => video.pause();
  }, [activeIndex, inView, prefersReducedMotion]);

  // With scroll choosing the discipline, setting state on click alone gets
  // overwritten by the next scroll frame, which left the chooser looking
  // broken. Clicking scrolls to that discipline's band instead, so the two
  // agree rather than fight, and the buttons become real navigation.
  function choose(index: number) {
    const section = sectionRef.current;
    const driving =
      section && !prefersReducedMotion && window.matchMedia("(min-width: 768px)").matches;

    if (driving) {
      const rect = section.getBoundingClientRect();
      const travel = rect.height - window.innerHeight;
      if (travel > 0) {
        const band = travel / DISCIPLINES.length;
        // Land mid band so a rounding wobble cannot drop into a neighbour.
        const target = rect.top + window.scrollY + band * index + band * 0.5;
        if (lenis) lenis.scrollTo(target, { duration: 0.8 });
        else window.scrollTo({ top: target, behavior: "smooth" });
        return;
      }
    }

    setActiveIndex(index);
  }

  return (
    <section
      ref={sectionRef}
      id="studio"
      data-home-chapter="studio"
      data-home-section="studio"
      data-studio-state={active.number}
      className="studio-cinematic home-scene"
      aria-labelledby="studio-cinematic-title"
      style={{ "--studio-accent": active.accent } as CSSProperties}
    >
      <div className="studio-cinematic__aurora studio-cinematic__aurora--clay" aria-hidden="true" />
      <div className="studio-cinematic__aurora studio-cinematic__aurora--sage" aria-hidden="true" />

      <div className="studio-cinematic__grid">
        <article className="studio-cinematic__media" aria-live="polite">
          <AnimatePresence mode="sync" initial={false}>
            <motion.div
              key={active.video}
              className="studio-cinematic__media-layer"
              initial={prefersReducedMotion ? false : { opacity: 0.28, scale: 1.06 }}
              animate={{ opacity: 1, scale: inView ? 1.1 : 1.04 }}
              exit={prefersReducedMotion ? undefined : { opacity: 0, scale: 1.025 }}
              transition={{
                opacity: { duration: prefersReducedMotion ? 0 : 0.42, ease: EASE },
                scale: { duration: prefersReducedMotion ? 0 : 8.4, ease: "linear" },
              }}
            >
              {prefersReducedMotion ? (
                <Image
                  src={active.poster}
                  alt=""
                  fill
                  sizes="100vw"
                  className="studio-cinematic__media-image"
                />
              ) : (
                <video
                  ref={videoRef}
                  src={active.video}
                  poster={active.poster}
                  className="studio-cinematic__media-video"
                  muted
                  autoPlay
                  loop
                  playsInline
                  preload={inView ? "metadata" : "none"}
                  data-home-playback-rate="1.22"
                  aria-hidden="true"
                />
              )}
            </motion.div>
          </AnimatePresence>

          <div className="studio-cinematic__media-wash" aria-hidden="true" />

          <div className="studio-cinematic__media-content">
            <div className="studio-cinematic__media-topline">
              <span>The thinking room</span>
              <span>{active.number} / 03</span>
            </div>

            <motion.div
              key={`caption-${active.title}`}
              className="studio-cinematic__media-caption"
              initial={prefersReducedMotion ? false : { opacity: 0.5, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: prefersReducedMotion ? 0 : 0.36, ease: EASE }}
            >
              <p>{active.eyebrow}</p>
              <h3>{active.title}</h3>
            </motion.div>
          </div>
        </article>

        <div className="studio-cinematic__content">
          <p className="studio-cinematic__eyebrow">About Suman</p>
          <h2 id="studio-cinematic-title">
            One mind. Three disciplines. <em>One accountable author.</em>
          </h2>
          <p className="studio-cinematic__lede">
            Psychology finds the tension. Literature gives it language. Strategy makes the answer usable after the room goes quiet.
          </p>

          <div
            className="studio-cinematic__tabs"
            role="tablist"
            aria-label="Explore Suman's three disciplines"
          >
            {DISCIPLINES.map((discipline, index) => {
              const selected = index === activeIndex;
              return (
                <button
                  key={discipline.title}
                  type="button"
                  role="tab"
                  aria-selected={selected}
                  aria-controls="studio-cinematic-panel"
                  onClick={() => choose(index)}
                  onFocus={() => choose(index)}
                  className={selected ? "is-active" : undefined}
                  style={{ "--studio-tab-accent": discipline.accent } as CSSProperties}
                >
                  <span>{discipline.number}</span>
                  <strong>{discipline.title}</strong>
                  <small>{discipline.eyebrow}</small>
                  <i aria-hidden="true">
                    <b
                      style={{
                        // Fills for whichever discipline is showing. It used
                        // to animate on the rotation timer, which would now
                        // be a countdown to nothing.
                        animation: "none",
                        transform: selected ? "scaleX(1)" : "scaleX(0)",
                        transformOrigin: "left",
                        transition: prefersReducedMotion ? "none" : "transform 420ms cubic-bezier(0.22,1,0.36,1)",
                      }}
                    />
                  </i>
                </button>
              );
            })}
          </div>

          <motion.article
            key={`panel-${active.title}`}
            id="studio-cinematic-panel"
            role="tabpanel"
            className="studio-cinematic__panel"
            initial={prefersReducedMotion ? false : { opacity: 0.64, y: 8, filter: "blur(3px)" }}
            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            transition={{ duration: prefersReducedMotion ? 0 : 0.38, ease: EASE }}
            aria-live="polite"
          >
            <p className="studio-cinematic__panel-copy">{active.line}</p>

            <div className="studio-cinematic__logic" aria-label={`${active.title} decision sequence`}>
              {active.diagram.map((step, index) => (
                <div key={step} className="studio-cinematic__logic-step">
                  <span>{step}</span>
                  {index < active.diagram.length - 1 && <i aria-hidden="true" />}
                </div>
              ))}
            </div>

            <div className="studio-cinematic__result">
              <span>What the client receives</span>
              <strong>{active.result}</strong>
            </div>

            <Link href={active.proofHref} className="studio-cinematic__proof">
              <span>
                <small>{active.proofLabel}</small>
                <strong>{active.proofLine}</strong>
              </span>
              <i aria-hidden="true">↗</i>
            </Link>
          </motion.article>

          <div className="studio-cinematic__footer">
            <Link href="/about">
              Meet the strategist <span aria-hidden="true">→</span>
            </Link>
            <p>The person you meet is the person doing the thinking, writing, and direction.</p>
          </div>
        </div>

        <aside className="studio-cinematic__portrait">
          <motion.div
            className="studio-cinematic__portrait-image"
            animate={
              prefersReducedMotion || !inView
                ? undefined
                : { scale: [1.02, 1.075, 1.02], x: [0, -6, 0] }
            }
            transition={
              prefersReducedMotion || !inView
                ? undefined
                : { duration: 12, repeat: Infinity, ease: "easeInOut" }
            }
          >
            <Image
              src="/images/own-portrait.jpg"
              alt="Suman Sharma, founder and strategist at Branding Tatva"
              fill
              sizes="(min-width: 1100px) 26vw, (min-width: 768px) 42vw, 100vw"
              className="studio-cinematic__portrait-photo"
            />
          </motion.div>
          <div className="studio-cinematic__portrait-wash" aria-hidden="true" />
          <div className="studio-cinematic__authorship">
            <span>Direct authorship</span>
            <strong>
              The same person hears the problem, makes the decisions, writes the language,
              and directs the work.
            </strong>
            <p>Every engagement is led directly by Suman, from diagnosis to delivery.</p>
          </div>
        </aside>
      </div>
    </section>
  );
}
