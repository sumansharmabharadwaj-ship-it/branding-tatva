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
import { motion, useMotionValueEvent, useScroll, useTransform } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { BackgroundVideo } from "@/components/BackgroundVideo";
import { LinkButton } from "@/components/Button";
import { Container } from "@/components/Container";
import { packages, type Package } from "@/data/services";
import { useHydratedReducedMotion } from "@/hooks/useHydratedReducedMotion";
import { track } from "@/lib/analytics";
import styles from "./AboutResolution.module.css";

const PATH_DEFINITIONS = [
  {
    slug: "brand-beginning",
    cue: "Beginning",
    signal: "The idea is ready. The brand still needs its ground.",
  },
  {
    slug: "brand-clarity",
    cue: "Realigning",
    signal: "The brand exists. Its clearest meaning is still difficult to carry.",
  },
  {
    slug: "brand-partnership",
    cue: "Sustaining",
    signal: "The system exists. Recognition now needs continuity.",
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
  const pointerFrameRef = useRef(0);
  const previewingRef = useRef(false);
  const progressRef = useRef(0);
  const [activeIndex, setActiveIndex] = useState(0);
  const prefersReducedMotion = Boolean(useHydratedReducedMotion());
  const { scrollYProgress } = useScroll({
    target: sceneRef,
    offset: ["start end", "end start"],
  });
  const cameraY = useTransform(scrollYProgress, [0, 1], ["-3.5%", "3.5%"]);
  const cameraScale = useTransform(scrollYProgress, [0, 0.5, 1], [1.055, 1, 1.04]);
  const activePath = PATHS[activeIndex];

  useMotionValueEvent(scrollYProgress, "change", (progress) => {
    progressRef.current = progress;
    if (prefersReducedMotion || previewingRef.current) return;
    const nextIndex = indexFromProgress(progress);
    setActiveIndex((current) => (current === nextIndex ? current : nextIndex));
  });

  useEffect(() => () => window.cancelAnimationFrame(pointerFrameRef.current), []);

  function syncToScroll() {
    if (prefersReducedMotion) return;
    setActiveIndex(indexFromProgress(progressRef.current));
  }

  function preview(index: number) {
    previewingRef.current = true;
    setActiveIndex(index);
  }

  function releasePreview() {
    previewingRef.current = false;
    syncToScroll();
  }

  function choose(index: number) {
    previewingRef.current = false;
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
      aria-labelledby="about-resolution-title"
      onPointerMove={onPointerMove}
      onPointerLeave={resetPointer}
    >
      <Container className={styles.inner}>
        <header className={styles.header}>
          <p className={styles.eyebrow}>The next move · a calm half hour</p>
          <h2 id="about-resolution-title">
            Your question can arrive unresolved. <em>The next move can leave the room clear.</em>
          </h2>
          <p className={styles.intro}>
            Bring the condition as it is. The first conversation identifies the decision that deserves to come first,
            then gives the engagement a grounded starting point.
          </p>
        </header>

        <div className={styles.interactiveExperience}>
          <div className={styles.pathRail} role="group" aria-label="Three ways an engagement can begin">
            {PATHS.map((path, index) => {
              const state = index < activeIndex ? "passed" : index === activeIndex ? "active" : "waiting";
              return (
                <button
                  key={path.slug}
                  id={`about-resolution-path-${index}`}
                  type="button"
                  data-state={state}
                  aria-pressed={index === activeIndex}
                  aria-controls="about-resolution-record"
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

              <div id="about-resolution-record" className={styles.recordSheet} aria-live="polite">
                {PATHS.map((path, index) => {
                  const state = index < activeIndex ? "passed" : index === activeIndex ? "active" : "waiting";
                  return (
                    <article key={path.slug} className={styles.recordStage} data-state={state} aria-hidden={index !== activeIndex}>
                      <small>{path.cue} · {path.package.name}</small>
                      <h3>{path.package.forWho}</h3>
                      <p>{path.package.description}</p>
                      <dl>
                        <div>
                          <dt>First working decisions</dt>
                          <dd>{path.package.includes.slice(0, 2).join(" · ")}</dd>
                        </div>
                        <div>
                          <dt>Engagement route</dt>
                          <dd>{path.package.billing === "monthly" ? "Ongoing partnership" : "One-time strategic system"}</dd>
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
                  See the engagement route <ArrowUpRight size={14} aria-hidden="true" />
                </Link>
              </article>
            ))}
          </div>
        </div>

        <footer className={styles.footer}>
          <p>
            <span>First conversation</span>
            <strong>Find the decision that deserves to come first.</strong>
          </p>
          <div className={styles.footerActions}>
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
                Compare engagement routes
              </LinkButton>
            </div>
            <LinkButton
              href="/contact"
              trackEvent="hero_booking_click"
              trackProps={{ page: "about", position: "resolution_threshold" }}
            >
              Bring your brand question
            </LinkButton>
          </div>
        </footer>
      </Container>
    </section>
  );
}
