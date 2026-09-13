"use client";

import { useHydratedReducedMotion } from "@/hooks/useHydratedReducedMotion";
import { useEffect, useId, useRef } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { X } from "lucide-react";
import type { Project } from "@/sections/HomeV4/homeSnapshotProjects";
import { useLenis } from "@/components/SmoothScrollProvider";

// Suman's board: "Click — the whole homepage freezes. The card opens
// full screen. The page becomes the project." The file opens as a
// cinematic overlay: the project's own hero footage becomes the room,
// tinted by its accent, and the documented decision trail reads over
// it — challenge, insight, verified outcome, real stats. Everything
// shown comes straight from projects.ts; the full case study is one
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

  const video = project?.heroVideo ?? project?.cardVideo;
  const poster = project?.heroPoster ?? project?.cardImage;

  return (
    <dialog
      ref={dialogRef}
      data-project-file=""
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
      className="fixed inset-0 m-0 h-dvh max-h-none w-full max-w-none overflow-hidden border-0 bg-soil p-0 text-ivory backdrop:bg-soil"
    >
      {project && (
        <>
          {/* The room: the project's own footage, accent tinted. */}
          <div className="pointer-events-none absolute inset-0" aria-hidden="true">
            {video && !prefersReducedMotion ? (
              <video
                data-home-media-priority="10"
                className="h-full w-full object-cover"
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
                <img src={poster} alt="" className="h-full w-full object-cover" />
              )
            )}
            <div className="absolute inset-0" style={{ backgroundColor: `${project.accent}26` }} />
            <div
              className="absolute inset-0"
              style={{
                backgroundImage:
                  "linear-gradient(180deg, rgba(23,20,17,0.82) 0%, rgba(23,20,17,0.55) 45%, rgba(23,20,17,0.88) 100%)",
              }}
            />
          </div>

          <button
            ref={closeRef}
            type="button"
            onClick={onClose}
            aria-label="Close project file"
            className="absolute right-5 top-5 z-20 flex h-11 w-11 items-center justify-center rounded-full border border-ivory/30 text-ivory transition-colors duration-300 hover:border-ivory hover:bg-ivory/10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-sandstone"
            style={{ backgroundColor: "rgba(23,20,17,0.6)" }}
          >
            <X size={18} />
          </button>

          <div className="relative h-full overflow-y-auto overscroll-contain" data-lenis-prevent="">
            <motion.div
              key={project.slug}
              initial={prefersReducedMotion ? false : { opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: prefersReducedMotion ? 0 : 0.35, ease: [0.22, 1, 0.36, 1] }}
              className="relative mx-auto flex min-h-full max-w-3xl flex-col justify-center px-6 py-24 sm:px-10 sm:py-28"
            >
              <p className="text-xs font-medium uppercase tracking-[0.25em] text-ivory/75">
                Project file · {project.industry}
              </p>
              <h2 id={titleId} className="mt-3 font-display text-display-sm font-normal text-ivory sm:text-display-md">
                {project.title}
              </h2>
              {project.hook && (
                <p className="mt-4 max-w-xl font-display text-lg italic text-ivory/85 sm:text-xl">{project.hook}</p>
              )}

              <div className="mt-8 space-y-6 border-l-2 pl-5" style={{ borderColor: `${project.accent}88` }}>
                <div>
                  <p className="text-xs font-medium uppercase tracking-[0.18em] text-ivory/60">The challenge</p>
                  <p className="mt-1.5 max-w-xl text-base leading-relaxed text-ivory/85">{project.challenge}</p>
                </div>
                {project.insight && (
                  <div>
                    <p className="text-xs font-medium uppercase tracking-[0.18em] text-ivory/60">The insight</p>
                    <p className="mt-1.5 max-w-xl text-base leading-relaxed text-ivory/85">{project.insight}</p>
                  </div>
                )}
                <div>
                  <p className="text-xs font-medium uppercase tracking-[0.18em] text-ivory/60">The verified outcome</p>
                  <p className="mt-1.5 max-w-xl text-base leading-relaxed text-ivory/85">{project.outcome}</p>
                </div>
              </div>

              {project.stats && project.stats.length > 0 && (
                <ul className="mt-8 flex flex-wrap gap-3">
                  {project.stats.map((s) => (
                    <li
                      key={s.label}
                      className="rounded-2xl border border-ivory/15 px-4 py-3"
                      style={{ backgroundColor: "rgba(244,239,230,0.05)" }}
                    >
                      <p className="font-display text-2xl font-normal leading-none text-ivory">
                        {s.value}
                      </p>
                      <p className="mt-1 max-w-[11rem] text-xs leading-relaxed text-ivory/75">{s.label}</p>
                    </li>
                  ))}
                </ul>
              )}

              <div className="mt-10 flex flex-wrap items-center gap-5">
                <Link
                  href={`/work/${project.slug}`}
                  className="inline-flex min-h-12 items-center gap-2 rounded-full px-6 py-3 text-sm font-medium text-soil transition-colors duration-300 hover:brightness-110 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-sandstone"
                  style={{ backgroundColor: project.accent, color: "#F4EFE6" }}
                >
                  Open the full case study <span aria-hidden="true">→</span>
                </Link>
                <button
                  ref={backRef}
                  type="button"
                  onClick={onClose}
                  className="link-underline min-h-12 text-sm text-ivory/75 transition-colors duration-300 hover:text-ivory focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-sandstone"
                >
                  Back to the archive
                </button>
              </div>
            </motion.div>
          </div>
        </>
      )}
    </dialog>
  );
}
