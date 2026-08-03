"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { X } from "lucide-react";
import type { Project } from "@/data/projects";
import { useLenis } from "@/components/SmoothScrollProvider";

// Suman's board: "Click — the whole homepage freezes. The card opens
// full screen. The page becomes the project." The file opens as a
// cinematic overlay: the project's own hero footage becomes the room,
// tinted by its accent, and the documented decision trail reads over
// it — challenge, insight, verified outcome, real stats. Everything
// shown comes straight from projects.ts; the full case study is one
// action away. Scroll freezes through Lenis (which owns scroll on
// this site) with an overflow fallback; Escape and the close button
// both exit; the close button takes focus on open so keyboard users
// land inside the file. Reduced motion opens and closes instantly.
export function ProjectFile({ project, onClose }: { project: Project | null; onClose: () => void }) {
  const prefersReducedMotion = useReducedMotion();
  const lenis = useLenis();
  const closeRef = useRef<HTMLButtonElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (!project) return;
    lenis?.stop();
    document.documentElement.style.overflow = "hidden";
    closeRef.current?.focus();
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    window.addEventListener("keydown", onKey);
    return () => {
      lenis?.start();
      document.documentElement.style.overflow = "";
      window.removeEventListener("keydown", onKey);
    };
  }, [project, lenis, onClose]);

  // The bare autoplay attribute is unreliable on this site — every
  // video plays explicitly (see CLAUDE.md).
  useEffect(() => {
    if (!project || prefersReducedMotion) return;
    videoRef.current?.play().catch(() => {});
  });

  const video = project?.heroVideo ?? project?.cardVideo;
  const poster = project?.heroPoster ?? project?.cardImage;

  return (
    <AnimatePresence>
      {project && (
        <motion.div
          role="dialog"
          aria-modal="true"
          aria-label={`${project.title}, project file`}
          initial={prefersReducedMotion ? undefined : { opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={prefersReducedMotion ? undefined : { opacity: 0 }}
          transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
          className="fixed inset-0 z-[90] overflow-y-auto"
          style={{ backgroundColor: "#171411" }}
        >
          {/* The room: the project's own footage, accent tinted. */}
          <div className="pointer-events-none fixed inset-0" aria-hidden="true">
            {video && !prefersReducedMotion ? (
              <video
                ref={videoRef}
                className="h-full w-full object-cover"
                src={video}
                poster={poster}
                muted
                loop
                playsInline
                preload="metadata"
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

          <motion.div
            initial={prefersReducedMotion ? undefined : { opacity: 0, y: 24, scale: 0.985 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1], delay: 0.1 }}
            className="relative mx-auto flex min-h-full max-w-3xl flex-col justify-center px-6 py-20 sm:px-10"
          >
            <button
              ref={closeRef}
              type="button"
              onClick={onClose}
              aria-label="Close project file"
              className="fixed right-5 top-5 flex h-11 w-11 items-center justify-center rounded-full border border-ivory/30 text-ivory transition-colors duration-300 hover:border-ivory hover:bg-ivory/10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-sandstone"
              style={{ backgroundColor: "rgba(23,20,17,0.6)" }}
            >
              <X size={18} />
            </button>

            <p className="text-xs font-medium uppercase tracking-[0.25em]" style={{ color: project.accent }}>
              Project file · {project.industry}
            </p>
            <h2 className="mt-3 font-display text-display-sm font-normal text-ivory sm:text-display-md">
              {project.title}
            </h2>
            {project.hook && (
              <p className="mt-4 max-w-xl font-display text-lg italic text-ivory/85 sm:text-xl">{project.hook}</p>
            )}

            <div className="mt-8 space-y-6 border-l-2 pl-5" style={{ borderColor: `${project.accent}88` }}>
              <div>
                <p className="text-xs font-medium uppercase tracking-[0.18em] text-ivory/60">The challenge</p>
                <p className="mt-1.5 max-w-xl text-sm leading-relaxed text-ivory/85">{project.challenge}</p>
              </div>
              {project.insight && (
                <div>
                  <p className="text-xs font-medium uppercase tracking-[0.18em] text-ivory/60">The insight</p>
                  <p className="mt-1.5 max-w-xl text-sm leading-relaxed text-ivory/85">{project.insight}</p>
                </div>
              )}
              <div>
                <p className="text-xs font-medium uppercase tracking-[0.18em] text-ivory/60">The verified outcome</p>
                <p className="mt-1.5 max-w-xl text-sm leading-relaxed text-ivory/85">{project.outcome}</p>
              </div>
            </div>

            {project.stats && project.stats.length > 0 && (
              <ul className="mt-8 flex flex-wrap gap-3">
                {project.stats.map((s) => (
                  <li
                    key={s.label}
                    className="rounded-xl border border-ivory/15 px-4 py-3"
                    style={{ backgroundColor: "rgba(244,239,230,0.05)" }}
                  >
                    <p className="font-display text-2xl font-normal leading-none" style={{ color: project.accent }}>
                      {s.value}
                    </p>
                    <p className="mt-1 max-w-[11rem] text-[0.65rem] leading-snug text-ivory/70">{s.label}</p>
                  </li>
                ))}
              </ul>
            )}

            <div className="mt-10 flex flex-wrap items-center gap-5">
              <Link
                href={`/work/${project.slug}`}
                className="inline-flex items-center gap-2 rounded-full px-6 py-2.5 text-sm font-medium text-soil transition-transform duration-300 hover:scale-[1.03]"
                style={{ backgroundColor: project.accent, color: "#F4EFE6" }}
              >
                Open the full case study <span aria-hidden="true">→</span>
              </Link>
              <button
                type="button"
                onClick={onClose}
                className="link-underline text-sm text-ivory/75 transition-colors duration-300 hover:text-ivory"
              >
                Back to the archive
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
