"use client";

import { useHydratedMotionPreference } from "@/hooks/useHydratedReducedMotion";
import { useCallback, useEffect, useId, useRef, useState, type CSSProperties } from "react";
import Link from "next/link";
import { ArrowLeft, ArrowRight, X } from "lucide-react";
import type { Project } from "@/sections/HomeV4/homeSnapshotProjects";
import { useLenis } from "@/components/SmoothScrollProvider";
import styles from "./ProjectFile.module.css";

// Suman's board: "Click — the whole homepage freezes. The card opens
// full screen. The page becomes the project." The file opens as a
// cinematic overlay: the project's own hero footage becomes the room,
// with a light reading surface for the documented decision trail:
// challenge, insight, verified outcome, real stats. Everything shown
// comes from the homepage project snapshot; the full case study is one
// action away. A native modal keeps focus inside the file and lifts it
// above the chapter's transforms. Closing restores the reader's place.
// The shared media director gives the opened file the film budget.
export function ProjectFile({ project, projectIndex, projectCount, onNavigate, onClose }: {
  project: Project | null;
  projectIndex: number;
  projectCount: number;
  onNavigate: (direction: -1 | 1) => void;
  onClose: () => void;
}) {
  const { hydrated, prefersReducedMotion } = useHydratedMotionPreference();
  const [keyboardReading, setKeyboardReading] = useState(false);
  const lenis = useLenis();
  const titleId = useId();
  const dialogRef = useRef<HTMLDialogElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const toolbarRef = useRef<HTMLDivElement>(null);
  const readingRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLElement>(null);
  const mediaRef = useRef<HTMLDivElement>(null);
  const progressRef = useRef<HTMLSpanElement>(null);
  const animations = useRef<Animation[]>([]);
  const previousSlug = useRef<string | undefined>(undefined);
  const navigation = useRef({ direction: 1, animate: false });
  const projectSlug = project?.slug;
  const isOpen = Boolean(projectSlug);
  const readingStill = !hydrated || prefersReducedMotion || keyboardReading || !isOpen;

  useEffect(() => { if (!isOpen) setKeyboardReading(false); }, [isOpen]);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!isOpen || !dialog) return;
    const opener = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    const rootStyle = document.documentElement.style;
    const previousOverflow = rootStyle.getPropertyValue("overflow");
    const previousOverflowPriority = rootStyle.getPropertyPriority("overflow");
    const previousGutter = rootStyle.getPropertyValue("scrollbar-gutter");
    const previousGutterPriority = rootStyle.getPropertyPriority("scrollbar-gutter");
    const computedGutter = getComputedStyle(document.documentElement).scrollbarGutter;
    const wasStopped = lenis?.isStopped;
    lenis?.stop();
    // Retain the page's scrollbar space while the modal owns scrolling.
    // Otherwise every earlier chapter reflows, shifting the archive on close.
    rootStyle.setProperty("scrollbar-gutter", computedGutter.includes("stable") ? computedGutter : "stable");
    rootStyle.setProperty("overflow", "hidden");
    dialog.showModal();
    closeRef.current?.focus({ preventScroll: true });
    return () => {
      dialog.close();
      if (previousOverflow) rootStyle.setProperty("overflow", previousOverflow, previousOverflowPriority);
      else rootStyle.removeProperty("overflow");
      if (previousGutter) rootStyle.setProperty("scrollbar-gutter", previousGutter, previousGutterPriority);
      else rootStyle.removeProperty("scrollbar-gutter");
      if (!wasStopped) lenis?.start();
      if (opener?.isConnected) opener.focus({ preventScroll: true });
    };
  }, [isOpen, lenis]);

  useEffect(() => {
    const dialog = dialogRef.current;
    const toolbar = toolbarRef.current;
    if (!isOpen || !dialog || !toolbar) return;
    // The toolbar owns its natural height. Only the reading inset consumes
    // this measurement, so larger text cannot create a resize feedback loop.
    const measure = () => {
      dialog.style.setProperty("--file-toolbar-height", `${Math.ceil(toolbar.getBoundingClientRect().height)}px`);
    };
    const observer = new ResizeObserver(measure);
    observer.observe(toolbar);
    measure();
    return () => {
      observer.disconnect();
      dialog.style.removeProperty("--file-toolbar-height");
    };
  }, [isOpen]);

  const settleReading = useCallback(() => {
    animations.current.forEach((animation) => animation.cancel());
    animations.current = [];
  }, []);

  function settleForReading() {
    navigation.current.animate = false;
    settleReading();
  }

  function navigateProject(direction: -1 | 1, keyboardChoice: boolean) {
    if (keyboardChoice) { setKeyboardReading(true); settleForReading(); }
    navigation.current = { direction, animate: !keyboardChoice };
    onNavigate(direction);
  }

  useEffect(() => {
    const changed = previousSlug.current !== projectSlug;
    previousSlug.current = projectSlug;
    settleReading();
    // Only the inner reading scrolls. The dialog, its controls, the page lock,
    // and the original opener keep their identity throughout the archive.
    if (changed) readingRef.current?.scrollTo({ top: 0, behavior: "instant" });
    const requested = navigation.current.animate;
    navigation.current.animate = false;
    if (!projectSlug || !changed || readingStill || !requested) return;
    const reading = readingRef.current;
    if (reading === document.activeElement || reading?.querySelector(":focus-visible")) return;
    const direction = navigation.current.direction;
    const paper = contentRef.current;
    const media = mediaRef.current;
    paper?.querySelectorAll<HTMLElement>("[data-project-file-reading]").forEach((block, index) => {
      animations.current.push(block.animate([
        { transform: `translate3d(${direction * 6}px, 2px, 0)`, opacity: 1 },
        { transform: "translate3d(0, 0, 0)", opacity: 1 },
      ], { duration: 400, delay: Math.min(index * 45, 180), fill: "backwards", easing: "cubic-bezier(.22, 1, .36, 1)" }));
    });
    if (media) animations.current.push(media.animate([
      { transform: `translate3d(${-direction * 6}px, 0, 0) scale(1.025)` },
      { transform: "translate3d(0, 0, 0) scale(1)" },
    ], { duration: 620, easing: "cubic-bezier(.22, 1, .36, 1)" }));
    return settleReading;
  }, [projectSlug, readingStill, settleReading]);

  useEffect(() => {
    const reading = readingRef.current;
    const content = contentRef.current;
    const progress = progressRef.current;
    if (!projectSlug || !reading || !content || !progress) return;
    if (readingStill) {
      progress.style.transform = "scaleX(1)";
      return;
    }
    let frame = 0;
    const render = () => {
      frame = 0;
      const distance = reading.scrollHeight - reading.clientHeight;
      const amount = distance > 0 ? Math.min(1, Math.max(0, reading.scrollTop / distance)) : 1;
      progress.style.transform = `scaleX(${amount})`;
    };
    function schedule() {
      if (!frame) frame = window.requestAnimationFrame(render);
    }
    const observer = new ResizeObserver(schedule);
    observer.observe(reading);
    observer.observe(content);
    reading.addEventListener("scroll", schedule, { passive: true });
    render();
    return () => {
      window.cancelAnimationFrame(frame);
      observer.disconnect();
      reading.removeEventListener("scroll", schedule);
    };
  }, [projectSlug, readingStill]);

  const video = project?.heroVideo ?? project?.cardVideo;
  const poster = project?.heroPoster ?? project?.cardImage;

  return (
    <dialog
      ref={dialogRef}
      data-project-file=""
      data-motion={readingStill ? "reduced" : "full"}
      aria-labelledby={titleId}
      aria-modal="true"
      onCancel={(event) => {
        event.preventDefault();
        onClose();
      }}
      onFocusCapture={(event) => {
        if (event.target instanceof HTMLElement && event.target.matches(":focus-visible")) {
          setKeyboardReading(true);
          settleForReading();
        }
      }}
      onKeyDownCapture={() => { setKeyboardReading(true); settleForReading(); }}
      onPointerDownCapture={() => setKeyboardReading(false)}
      className={styles.dialog}
      style={{ "--file-accent": project?.accent ?? "#5C6B4A" } as CSSProperties}
    >
      {project && (
        <>
          {/* The film stays bright; the reading surface supplies contrast. */}
          <div ref={mediaRef} className={styles.media} aria-hidden="true">
            {video && !readingStill ? (
              <video
                key={project.slug}
                data-home-media-priority="10"
                src={video}
                poster={poster}
                muted
                loop
                playsInline
                preload="none"
              />
            ) : (
              poster && (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={poster} alt="" />
              )
            )}
          </div>

          <div ref={toolbarRef} className={styles.toolbar}>
            <span className={styles.toolbarLabel}>The evidence archive</span>
            <button
              ref={closeRef}
              type="button"
              onClick={onClose}
              aria-label="Close project file"
              className={styles.close}
            >
              <span>Close</span><X size={18} aria-hidden="true" />
            </button>
            <nav className={styles.navigator} aria-label="Browse project files">
              <button type="button" aria-label="Previous project file" onClick={(event) => navigateProject(-1, event.detail === 0)}>
                <ArrowLeft size={17} aria-hidden="true" /><span>Previous</span>
              </button>
              <span className={styles.counter} aria-hidden="true">
                {String(projectIndex + 1).padStart(2, "0")} / {String(projectCount).padStart(2, "0")}
              </span>
              <button type="button" aria-label="Next project file" onClick={(event) => navigateProject(1, event.detail === 0)}>
                <span>Next</span><ArrowRight size={17} aria-hidden="true" />
              </button>
            </nav>
            <span className={styles.progress} aria-hidden="true"><span ref={progressRef} /></span>
          </div>
          <p className={styles.announcement} role="status" aria-live="polite" aria-atomic="true">
            Project {projectIndex + 1} of {projectCount}: {project.title}.
          </p>

          <div ref={readingRef} className={styles.reading} data-lenis-prevent="" role="region" aria-label="Project reading" tabIndex={0}
            onFocusCapture={settleForReading} onPointerDown={settleForReading}>
            <article
              ref={contentRef}
              className={styles.paper}
            >
              <div data-project-file-reading>
                <p className={styles.eyebrow}>
                  Project file · {project.industry}
                </p>
                <h2 id={titleId} className={styles.title}>
                  {project.title}
                </h2>
                {project.hook && (
                  <p className={styles.hook}>{project.hook}</p>
                )}
              </div>

              <div className={styles.trail}>
                <div data-project-file-reading>
                  <h3><span aria-hidden="true">01</span>The challenge</h3>
                  <p>{project.challenge}</p>
                </div>
                {project.insight && (
                  <div data-project-file-reading>
                    <h3><span aria-hidden="true">02</span>The insight</h3>
                    <p>{project.insight}</p>
                  </div>
                )}
                <div data-project-file-reading>
                  <h3><span aria-hidden="true">{project.insight ? "03" : "02"}</span>The verified outcome</h3>
                  <p>{project.outcome}</p>
                </div>
              </div>

              {project.stats && project.stats.length > 0 && (
                <ul className={styles.stats} aria-label="Recorded project results" data-project-file-reading>
                  {project.stats.map((s) => (
                    <li
                      key={s.label}
                    >
                      <p className={styles.value}>
                        {s.value}
                      </p>
                      <p className={styles.statLabel}>{s.label}</p>
                    </li>
                  ))}
                </ul>
              )}

              <div className={styles.actions}>
                <Link
                  href={`/work/${project.slug}`}
                  prefetch={false}
                  className={styles.caseLink}
                >
                  Open the full case study <span aria-hidden="true">→</span>
                </Link>
                <button
                  type="button"
                  onClick={onClose}
                  className={styles.back}
                >
                  Back to the archive
                </button>
              </div>
            </article>
          </div>
        </>
      )}
    </dialog>
  );
}
