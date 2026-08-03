"use client";

import { useRef, useState } from "react";
import Link from "next/link";
import { useReducedMotion } from "framer-motion";

// Suman's design: the three real service paths, introduced by a film of
// the work itself. Left is a cream panel with the claim and the play
// control; right is the video; the three paths sit beneath as cards
// joined by a dotted route, closing on the clarity quiz. Every path
// maps to a real package in data/services.ts. The video carries muted,
// autoPlay and playsInline together (browsers block autoplay with
// sound), and the visitor can pause or resume from either control.
const PATHS = [
  {
    n: "01",
    title: "Build the foundation",
    body: "For founders starting with an idea, before anything is built.",
    href: "/services#desire",
    tint: "#6F4E37",
    icon: <><path d="M20 30V16" /><path d="M20 20c-4 0-7-3-7-7 4 0 7 3 7 7z" /><path d="M20 22c4 0 7-3 7-7-4 0-7 3-7 7z" /></>,
  },
  {
    n: "02",
    title: "Reposition an existing brand",
    body: "For brands that feel unclear, inconsistent, or hard to explain in one sentence.",
    href: "/services#situation",
    tint: "#556B4A",
    icon: <><circle cx="16" cy="22" r="7" /><circle cx="24" cy="22" r="7" /><circle cx="20" cy="15" r="7" /></>,
  },
  {
    n: "03",
    title: "Create ongoing consistency",
    body: "For brands that need ongoing content, consistency, and someone watching the whole system.",
    href: "/services#offerings",
    tint: "#8a6b3d",
    icon: <><circle cx="20" cy="20" r="9" /><path d="M20 8v4M20 28v4M8 20h4M28 20h4M20 14l3 6-3 6-3-6z" /></>,
  },
];

export function ThreePathsSection() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [playing, setPlaying] = useState(true);
  const prefersReducedMotion = useReducedMotion();

  function toggle() {
    const v = videoRef.current;
    if (!v) return;
    if (v.paused) {
      v.play().catch(() => {});
      setPlaying(true);
    } else {
      v.pause();
      setPlaying(false);
    }
  }

  return (
    <section style={{ backgroundColor: "#F2F0E8" }}>
      <div className="grid lg:grid-cols-[minmax(0,1fr)_minmax(0,1.55fr)]">
        <div className="flex items-center px-6 py-14 sm:px-12 lg:px-14">
          <div className="max-w-sm">
            <p className="text-xs font-medium uppercase tracking-[0.25em]" style={{ color: "#8a6b3d" }}>
              Three paths
            </p>
            <h2 className="mt-4 font-display text-[clamp(1.9rem,3.6vw,3rem)] font-normal leading-[1.1] text-soil">
              The work meets the business wherever it stands.
            </h2>
            <span aria-hidden="true" className="mt-5 block h-px w-14" style={{ backgroundColor: "#C6A97A" }} />
            <p className="mt-5 text-sm leading-relaxed text-foreground-secondary">
              Three paths build brands that stay clear in strategy and consistent in the real world.
            </p>
            <button
              type="button"
              onClick={toggle}
              aria-pressed={playing}
              className="group mt-7 inline-flex items-center gap-3 rounded-full border px-6 py-3 text-xs font-medium uppercase tracking-[0.16em] transition-colors duration-300 hover:bg-[#C6A97A]/10"
              style={{ borderColor: "rgba(198,169,122,0.85)", color: "#8a6b3d" }}
            >
              <span aria-hidden="true" className="text-sm">{playing ? "❚❚" : "▶"}</span>
              {playing ? "Pause the film" : "Watch how we work"}
            </button>
          </div>
        </div>

        <div className="relative min-h-[16rem] bg-soil lg:min-h-[26rem]">
          <video
            ref={videoRef}
            className="absolute inset-0 h-full w-full object-cover"
            src="/videos/higgsfield-idea-sketch.mp4"
            poster="/images/higgsfield-idea-sketch.jpg"
            muted
            autoPlay={!prefersReducedMotion}
            playsInline
            loop
            preload="metadata"
            controls={false}
            aria-label="The working desk: notes, sketches, and a brand taking shape"
          />
          <button
            type="button"
            onClick={toggle}
            aria-label={playing ? "Pause the film" : "Play the film"}
            className="absolute inset-0 flex items-center justify-center focus-visible:outline focus-visible:outline-2 focus-visible:outline-sandstone"
          >
            <span className="flex h-16 w-16 items-center justify-center rounded-full border border-ivory/50 text-ivory backdrop-blur-sm transition-transform duration-300 hover:scale-105" style={{ backgroundColor: "rgba(23,20,17,0.35)" }}>
              <span aria-hidden="true" className="text-lg">{playing ? "❚❚" : "▶"}</span>
            </span>
          </button>
        </div>
      </div>

      <div className="px-6 pb-14 sm:px-10">
        <ul className="mx-auto grid max-w-6xl gap-5 lg:grid-cols-3">
          {PATHS.map((p) => (
            <li key={p.n}>
              <Link
                href={p.href}
                className="group flex h-full flex-col rounded-2xl border border-soil/10 bg-white/55 p-7 transition-all duration-300 hover:-translate-y-1 hover:border-soil/25"
              >
                <span className="flex items-center gap-4">
                  <span className="rounded-lg px-2.5 py-1 font-display text-sm text-ivory" style={{ backgroundColor: p.tint }}>
                    {p.n}
                  </span>
                  <span className="flex h-14 w-14 items-center justify-center rounded-full border border-soil/12">
                    <svg viewBox="0 0 40 40" className="h-7 w-7" fill="none" stroke={p.tint} strokeWidth="1.1" strokeLinecap="round" strokeLinejoin="round">
                      {p.icon}
                    </svg>
                  </span>
                </span>
                <span className="mt-5 block font-display text-2xl font-normal leading-tight text-soil">{p.title}</span>
                <span className="mt-3 block text-sm leading-relaxed text-foreground-secondary">{p.body}</span>
                <span className="mt-auto pt-6 text-xs font-medium uppercase tracking-[0.16em]" style={{ color: p.tint }}>
                  Explore path{" "}
                  <span aria-hidden="true" className="inline-block transition-transform duration-300 group-hover:translate-x-1">→</span>
                </span>
              </Link>
            </li>
          ))}
        </ul>

        <div className="mt-10 flex flex-wrap items-center justify-center gap-4 text-xs uppercase tracking-[0.16em] text-foreground-secondary">
          <span>Not sure where to start?</span>
          <span aria-hidden="true" className="h-4 w-px bg-soil/20" />
          <Link href="/services#health" className="link-underline font-medium" style={{ color: "#8a6b3d" }}>
            Take the clarity check <span aria-hidden="true">→</span>
          </Link>
        </div>
      </div>
    </section>
  );
}
