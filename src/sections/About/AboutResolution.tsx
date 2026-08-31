"use client";

import Link from "next/link";
import Image from "next/image";
import {
  useEffect,
  useRef,
  useState,
  type KeyboardEvent,
  type PointerEvent as ReactPointerEvent,
} from "react";
import { motion, useInView, useMotionValueEvent, useScroll, useTransform } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { BackgroundVideo } from "@/components/BackgroundVideo";
import { LinkButton } from "@/components/Button";
import { Container } from "@/components/Container";
import { packages, type Package } from "@/data/services";
import { useHydratedReducedMotion } from "@/hooks/useHydratedReducedMotion";
import { track } from "@/lib/analytics";
import { servicesContactHref } from "@/lib/servicesJourney";
import styles from "./AboutResolution.module.css";

const PATH_DEFINITIONS = [
  {
    slug: "brand-beginning",
    cue: "Launching",
    signal: "The offer is credible. The market position is not decided.",
    question: "What should this brand stand for before expression begins?",
    decision: "Define the position, audience, and promise the business can prove.",
  },
  {
    slug: "brand-clarity",
    cue: "Repositioning",
    signal: "The business has outgrown the brand buyers still see.",
    question: "Why does a capable brand still feel difficult to understand?",
    decision: "Decide the category meaning and rebuild around it.",
  },
  {
    slug: "brand-partnership",
    cue: "Directing",
    signal: "The brand changes whenever the channel or campaign changes.",
    question: "How can recognition compound while expression keeps moving?",
    decision: "Protect the same position across recurring work.",
  },
] as const;

function getPackage(slug: (typeof PATH_DEFINITIONS)[number]["slug"]): Package {
  const match = packages.find((entry) => entry.slug === slug);
  if (!match) throw new Error(`Missing About resolution package: ${slug}`);
  return match;
}

const PATHS = PATH_DEFINITIONS.map((path) => ({
  ...path,
  package: getPackage(path.slug),
}));

function indexFromProgress(progress: number) {
  const clamped = Math.min(0.9999, Math.max(0, progress));
  return Math.min(PATHS.length - 1, Math.floor(clamped * PATHS.length));
}

export function AboutResolution() {
  const sceneRef = useRef<HTMLElement>(null);
  const pathRailRef = useRef<HTMLDivElement>(null);
  const pointerFrameRef = useRef(0);
  const previewingRef = useRef(false);
  const manualChoiceRef = useRef(false);
  const manualChoiceIndexRef = useRef(0);
  const progressRef = useRef(0);
  const [activeIndex, setActiveIndex] = useState(0);
  const prefersReducedMotion = Boolean(useHydratedReducedMotion());
  const inView = useInView(sceneRef, { amount: 0.12, margin: "8% 0px -10% 0px" });
  const { scrollYProgress } = useScroll({
    target: sceneRef,
    offset: ["start 82%", "end end"],
  });
  const cameraY = useTransform(scrollYProgress, [0, 1], ["-3.5%", "3.5%"]);
  const cameraScale = useTransform(scrollYProgress, [0, 0.5, 1], [1.055, 1, 1.04]);
  const activePath = PATHS[activeIndex];

  useMotionValueEvent(scrollYProgress, "change", (progress) => {
    progressRef.current = progress;
    if (!inView || prefersReducedMotion || previewingRef.current || manualChoiceRef.current) return;
    const nextIndex = indexFromProgress(progress);
    setActiveIndex((current) => (current === nextIndex ? current : nextIndex));
  });

  useEffect(() => {
    if (!inView || prefersReducedMotion || previewingRef.current || manualChoiceRef.current) return;
    const nextIndex = indexFromProgress(scrollYProgress.get());
    setActiveIndex((current) => (current === nextIndex ? current : nextIndex));
  }, [inView, prefersReducedMotion, scrollYProgress]);

  useEffect(() => () => window.cancelAnimationFrame(pointerFrameRef.current), []);

  useEffect(() => {
    function releaseManualChoice(event: Event) {
      if (
        event instanceof KeyboardEvent &&
        event.target instanceof Node &&
        pathRailRef.current?.contains(event.target)
      ) return;

      manualChoiceRef.current = false;
    }

    window.addEventListener("wheel", releaseManualChoice, { passive: true });
    window.addEventListener("touchstart", releaseManualChoice, { passive: true });
    window.addEventListener("keydown", releaseManualChoice);

    return () => {
      window.removeEventListener("wheel", releaseManualChoice);
      window.removeEventListener("touchstart", releaseManualChoice);
      window.removeEventListener("keydown", releaseManualChoice);
    };
  }, []);

  function syncToScroll() {
    if (prefersReducedMotion || manualChoiceRef.current) return;
    setActiveIndex(indexFromProgress(progressRef.current));
  }

  function preview(index: number) {
    previewingRef.current = true;
    setActiveIndex(index);
  }

  function releasePreview() {
    previewingRef.current = false;
    if (manualChoiceRef.current) {
      setActiveIndex(manualChoiceIndexRef.current);
      return;
    }
    syncToScroll();
  }

  function choose(index: number) {
    previewingRef.current = false;
    manualChoiceRef.current = true;
    manualChoiceIndexRef.current = index;
    setActiveIndex(index);
    track("package_viewed", {
      package: PATHS[index].package.slug,
      page: "about",
      position: "resolution_threshold",
    });
  }

  function onPathKeyDown(event: KeyboardEvent<HTMLButtonElement>, index: number) {
    let next = index;
    if (event.key === "ArrowDown" || event.key === "ArrowRight") next = (index + 1) % PATHS.length;
    else if (event.key === "ArrowUp" || event.key === "ArrowLeft") next = (index + PATHS.length - 1) % PATHS.length;
    else if (event.key === "Home") next = 0;
    else if (event.key === "End") next = PATHS.length - 1;
    else return;

    event.preventDefault();
    choose(next);
    document.getElementById(`about-resolution-path-${next}`)?.focus();
  }

  function onPointerMove(event: ReactPointerEvent<HTMLElement>) {
    if (prefersReducedMotion || event.pointerType === "touch") return;
    const node = sceneRef.current;
    if (!node) return;
    const bounds = node.getBoundingClientRect();
    const x = ((event.clientX - bounds.left) / Math.max(bounds.width, 1) - 0.5) * 2;
    const y = ((event.clientY - bounds.top) / Math.max(bounds.height, 1) - 0.5) * 2;

    window.cancelAnimationFrame(pointerFrameRef.current);
    pointerFrameRef.current = window.requestAnimationFrame(() => {
      node.style.setProperty("--resolution-pointer-x", x.toFixed(3));
      node.style.setProperty("--resolution-pointer-y", y.toFixed(3));
    });
  }

  function resetPointer() {
    const node = sceneRef.current;
    if (!node) return;
    window.cancelAnimationFrame(pointerFrameRef.current);
    pointerFrameRef.current = window.requestAnimationFrame(() => {
      node.style.setProperty("--resolution-pointer-x", "0");
      node.style.setProperty("--resolution-pointer-y", "0");
    });
  }

  return (
    <section
      ref={sceneRef}
      className={styles.root}
      data-resolution-stage={activeIndex + 1}
      data-scroll-story="about-resolution-threshold"
      aria-labelledby="about-resolution-title"
      onPointerMove={onPointerMove}
      onPointerLeave={resetPointer}
    >
      <Container className={styles.inner}>
        <header className={styles.header}>
          <p className={styles.eyebrow}>A thirty minute brand diagnosis</p>
          <h2 id="about-resolution-title">
            Bring the business condition as it is. <em>Leave knowing what should be decided first.</em>
          </h2>
          <p className={styles.intro}>
            No polished brief is required. We identify the brand decision underneath the visible problem and choose the
            right place to begin.
          </p>
        </header>

        <div className={styles.interactiveExperience}>
          <div
            ref={pathRailRef}
            className={styles.pathRail}
            role="tablist"
            aria-label="Three ways an engagement can begin"
          >
            {PATHS.map((path, index) => {
              const state = index < activeIndex ? "passed" : index === activeIndex ? "active" : "waiting";
              return (
                <button
                  key={path.slug}
                  id={`about-resolution-path-${index}`}
                  type="button"
                  role="tab"
                  data-state={state}
                  aria-selected={index === activeIndex}
                  aria-controls="about-resolution-record"
                  tabIndex={index === activeIndex ? 0 : -1}
                  onClick={() => choose(index)}
                  onPointerEnter={() => preview(index)}
                  onPointerLeave={releasePreview}
                  onFocus={() => preview(index)}
                  onBlur={releasePreview}
                  onKeyDown={(event) => onPathKeyDown(event, index)}
                >
                  <span>0{index + 1}</span>
                  <span>
                    <small>{path.cue}</small>
                    <strong>{path.signal}</strong>
                  </span>
                </button>
              );
            })}
          </div>

          <motion.div
            className={styles.camera}
            style={prefersReducedMotion ? undefined : { y: cameraY, scale: cameraScale }}
          >
            <div className={styles.film}>
              <BackgroundVideo
                video="/videos/generated/bt-services-imagine-confluence.mp4"
                poster="/images/generated/bt-services-imagine-confluence-poster.jpg"
                playbackRate={0.82}
                posterPriority={false}
              />
              <div className={styles.filmWash} aria-hidden="true" />
              <span className={styles.frameMark} aria-hidden="true">
                BT / FIRST CONVERSATION / 0{activeIndex + 1}
              </span>

              <div
                id="about-resolution-record"
                className={styles.recordSheet}
                role="tabpanel"
                aria-labelledby={`about-resolution-path-${activeIndex}`}
              >
                {PATHS.map((path, index) => {
                  const state = index < activeIndex ? "passed" : index === activeIndex ? "active" : "waiting";
                  return (
                    <article key={path.slug} className={styles.recordStage} data-state={state} aria-hidden={index !== activeIndex}>
                      <small>{path.cue} · {path.package.name}</small>
                      <div className={styles.decisionPassage}>
                        <div>
                          <span>Question entering</span>
                          <p>{path.question}</p>
                        </div>
                        <i aria-hidden="true"><b /></i>
                        <div>
                          <span>First decision leaving</span>
                          <h3>{path.decision}</h3>
                        </div>
                      </div>
                      <dl>
                        <div>
                          <dt>Built for</dt>
                          <dd>{path.package.forWho}</dd>
                        </div>
                        <div>
                          <dt>Work that begins first</dt>
                          <dd>{path.package.includes.slice(0, 2).join(" · ")}</dd>
                        </div>
                      </dl>
                    </article>
                  );
                })}
              </div>
            </div>
          </motion.div>
        </div>

        <div className={styles.staticExperience}>
          <div className={styles.staticFilm} aria-hidden="true">
            <Image
              src="/images/generated/bt-services-imagine-confluence-poster.jpg"
              alt=""
              fill
              sizes="(max-width: 1023px) 100vw, 72rem"
              className={styles.staticFilmImage}
            />
          </div>
          <div className={styles.staticPaths}>
            {PATHS.map((path, index) => (
              <article key={path.slug}>
                <small>0{index + 1} · {path.cue}</small>
                <h3>{path.signal}</h3>
                <p>{path.package.forWho}</p>
                <strong>{path.package.name}</strong>
                <Link href={`/services#package-${path.slug}`}>
                  Inspect the engagement <ArrowUpRight size={14} aria-hidden="true" />
                </Link>
              </article>
            ))}
          </div>
        </div>

        <footer className={styles.footer}>
          <p className={styles.interactiveSummary} aria-live="polite">
            <span>Closest business condition · {activePath.cue}</span>
            <strong>{activePath.package.name} addresses this condition first.</strong>
          </p>
          <p className={styles.staticSummary}>
            <span>First conversation</span>
            <strong>Find the decision that deserves to come first.</strong>
          </p>
          <div className={styles.footerActions} data-about-resolution-actions>
            <div className={styles.interactiveCta}>
              <LinkButton
                href={`/services#package-${activePath.slug}`}
                variant="secondary"
                trackEvent="contextual_cta_clicked"
                trackProps={{ page: "about", target: activePath.slug }}
              >
                See {activePath.package.name}
              </LinkButton>
            </div>
            <div className={styles.staticCta}>
              <LinkButton
                href="/services#offerings"
                variant="secondary"
                trackEvent="contextual_cta_clicked"
                trackProps={{ page: "about", target: "all_engagement_routes" }}
              >
                Compare all engagements
              </LinkButton>
            </div>
            <div className={styles.interactiveContactCta}>
              <LinkButton
                key={activePath.slug}
                href={servicesContactHref(activePath.slug)}
                trackEvent="hero_booking_click"
                trackProps={{
                  page: "about",
                  position: "resolution_threshold",
                  package: activePath.slug,
                }}
              >
                Bring this question
              </LinkButton>
            </div>
            <div className={styles.staticContactCta}>
              <LinkButton
                href="/contact"
                trackEvent="hero_booking_click"
                trackProps={{ page: "about", position: "resolution_threshold" }}
              >
                Bring your brand question
              </LinkButton>
            </div>
          </div>
        </footer>
      </Container>
    </section>
  );
}
