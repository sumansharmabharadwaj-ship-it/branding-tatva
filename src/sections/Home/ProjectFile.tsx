"use client";

import { useHydratedReducedMotion } from "@/hooks/useHydratedReducedMotion";
import { useEffect, useId, useRef, type CSSProperties } from "react";
import Link from "next/link";
import { X } from "lucide-react";
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
export function ProjectFile({ project, onClose }: { project: Project | null; onClose: () => void }) {
  const prefersReducedMotion = useHydratedReducedMotion();
  const lenis = useLenis();
  const titleId = useId();
  const dialogRef = useRef<HTMLDialogElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const backRef = useRef<HTMLButtonElement>(null);
  const readingRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLElement>(null);
  const progressRef = useRef<HTMLSpanElement>(null);
  const projectSlug = project?.slug;

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!projectSlug || !dialog) return;
    const opener = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    const rootStyle = document.documentElement.style;
    const previousOverflow = rootStyle.getPropertyValue("overflow");
    const previousOverflowPriority = rootStyle.getPropertyPriority("overflow");
    const wasStopped = lenis?.isStopped;
    lenis?.stop();
    rootStyle.setProperty("overflow", "hidden");
    dialog.showModal();
    closeRef.current?.focus({ preventScroll: true });
    return () => {
      dialog.close();
      if (previousOverflow) rootStyle.setProperty("overflow", previousOverflow, previousOverflowPriority);
      else rootStyle.removeProperty("overflow");
      if (!wasStopped) lenis?.start();
      if (opener?.isConnected) opener.focus({ preventScroll: true });
    };
  }, [projectSlug, lenis]);

  useEffect(() => {
    const reading = readingRef.current;
    const content = contentRef.current;
    const progress = progressRef.current;
    if (!projectSlug || !reading || !content || !progress) return;
    if (prefersReducedMotion) {
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
  }, [projectSlug, prefersReducedMotion]);

  const video = project?.heroVideo ?? project?.cardVideo;
  const poster = project?.heroPoster ?? project?.cardImage;

  return (
    <dialog
      ref={dialogRef}
      data-project-file=""
      data-motion={prefersReducedMotion ? "reduced" : "full"}
      aria-labelledby={titleId}
      aria-modal="true"
      onCancel={(event) => {
        event.preventDefault();
        onClose();
      }}
      onKeyDown={(event) => {
        if (event.key !== "Tab") return;
        if (event.shiftKey && document.activeElement === closeRef.current) {
          event.preventDefault();
          backRef.current?.focus();
        } else if (!event.shiftKey && document.activeElement === backRef.current) {
          event.preventDefault();
          closeRef.current?.focus({ preventScroll: true });
        }
      }}
      className={styles.dialog}
      style={{ "--file-accent": project?.accent ?? "#5C6B4A" } as CSSProperties}
    >
      {project && (
        <>
          {/* The film stays bright; the reading surface supplies contrast. */}
          <div className={styles.media} aria-hidden="true">
            {video && !prefersReducedMotion ? (
              <video
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

          <div className={styles.toolbar}>
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
            <span className={styles.progress} aria-hidden="true"><span ref={progressRef} /></span>
          </div>

          <div ref={readingRef} className={styles.reading} data-lenis-prevent="" role="region" aria-label="Project reading" tabIndex={0}>
            <article
              ref={contentRef}
              key={project.slug}
              className={styles.paper}
            >
              <p className={styles.eyebrow}>
                Project file · {project.industry}
              </p>
              <h2 id={titleId} className={styles.title}>
                {project.title}
              </h2>
              {project.hook && (
                <p className={styles.hook}>{project.hook}</p>
              )}

              <div className={styles.trail}>
                <div>
                  <h3><span aria-hidden="true">01</span>The challenge</h3>
                  <p>{project.challenge}</p>
                </div>
                {project.insight && (
                  <div>
                    <h3><span aria-hidden="true">02</span>The insight</h3>
                    <p>{project.insight}</p>
                  </div>
                )}
                <div>
                  <h3><span aria-hidden="true">{project.insight ? "03" : "02"}</span>The verified outcome</h3>
                  <p>{project.outcome}</p>
                </div>
              </div>

              {project.stats && project.stats.length > 0 && (
                <ul className={styles.stats} aria-label="Recorded project results">
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
                  className={styles.caseLink}
                >
                  Open the full case study <span aria-hidden="true">→</span>
                </Link>
                <button
                  ref={backRef}
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
