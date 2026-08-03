"use client";

import { useEffect, useRef, useState } from "react";
import { useLenis } from "@/components/SmoothScrollProvider";
import type { ProcessStage } from "@/data/process";

const GOLD = "#C6A97A";

const OUTCOMES = [
  "The right question",
  "A pattern worth trusting",
  "A blueprint with consequences",
  "An identity that can hold",
  "A market signal in motion",
  "One living brand system",
] as const;

const MOVES = [
  { x: -18, y: 18, rotate: -2, origin: "left center" },
  { x: 14, y: -10, rotate: 1.5, origin: "right center" },
  { x: 0, y: 22, rotate: 0, origin: "center center" },
  { x: -12, y: -14, rotate: 1, origin: "left bottom" },
  { x: 16, y: 12, rotate: -1.2, origin: "right top" },
  { x: 0, y: -6, rotate: 0, origin: "center center" },
] as const;

export function RootSystem({ stages }: { stages: ProcessStage[] }) {
  const wrapRef = useRef<HTMLDivElement | null>(null);
  const [progress, setProgress] = useState(0);
  const [active, setActive] = useState(0);
  const lenis = useLenis();

  useEffect(() => {
    const wrap = wrapRef.current;
    if (!wrap) return;

    let frame = 0;
    const update = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        const el = wrapRef.current;
        if (!el) return;
        const rect = el.getBoundingClientRect();
        const travel = Math.max(1, rect.height - window.innerHeight);
        const nextProgress = Math.min(1, Math.max(0, -rect.top / travel));
        const nextActive = Math.min(stages.length - 1, Math.floor(nextProgress * stages.length));
        setProgress(nextProgress);
        setActive(nextActive);
      });
    };

    update();
    const unsubscribe = lenis?.on("scroll", update);
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);

    return () => {
      cancelAnimationFrame(frame);
      unsubscribe?.();
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, [lenis, stages.length]);

  const stageProgress = progress * stages.length;
  const cameraY = -progress * 32;
  const cameraScale = 1 + progress * 0.13;
  const finalResolve = Math.min(1, Math.max(0, (progress - 0.86) / 0.14));

  return (
    <div ref={wrapRef} className="relative bg-[#100e0c]" style={{ height: `${Math.max(620, stages.length * 118)}svh` }}>
      <div className="sticky top-0 h-svh min-h-[620px] overflow-hidden bg-[#100e0c]">
        {stages.map((stage, index) => {
          const distance = Math.abs(stageProgress - (index + 0.5));
          const visible = Math.max(0, 1 - distance * 1.15);
          return stage.video ? (
            <video
              key={stage.video}
              className="absolute inset-0 h-full w-full object-cover transition-opacity duration-700"
              src={stage.video}
              poster={stage.poster}
              muted
              autoPlay
              loop
              playsInline
              preload="metadata"
              style={{ opacity: visible * 0.28, transform: `scale(${1.04 + visible * 0.08})` }}
              ref={(el) => {
                if (el && el.paused) void el.play().catch(() => {});
              }}
            />
          ) : null;
        })}

        <div
          aria-hidden="true"
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(70% 56% at 50% 40%, rgba(198,169,122,0.10), transparent 65%), linear-gradient(to bottom, rgba(16,14,12,0.5), rgba(16,14,12,0.94))",
          }}
        />

        <div className="pointer-events-none absolute inset-x-6 top-6 z-30 flex items-start justify-between gap-6 sm:inset-x-10 sm:top-8">
          <div>
            <p className="text-[0.62rem] font-medium uppercase tracking-[0.24em] text-sandstone">How a project moves</p>
            <p className="mt-2 max-w-xs font-display text-xl leading-tight text-ivory/88 sm:text-2xl">Not forward. Deeper.</p>
          </div>
          <p className="text-right text-[0.62rem] uppercase tracking-[0.18em] text-ivory/42">
            {String(active + 1).padStart(2, "0")} / {String(stages.length).padStart(2, "0")}
          </p>
        </div>

        <div
          className="absolute inset-0 will-change-transform"
          style={{ transform: `translate3d(0, ${cameraY}vh, 0) scale(${cameraScale})`, transformOrigin: "50% 48%" }}
        >
          <div className="absolute left-1/2 top-[14%] h-[72%] w-px -translate-x-1/2 bg-gradient-to-b from-transparent via-sandstone/35 to-transparent" aria-hidden="true" />

          {stages.map((stage, index) => {
            const local = Math.min(1, Math.max(0, stageProgress - index));
            const exit = Math.min(1, Math.max(0, stageProgress - index - 0.72));
            const move = MOVES[index % MOVES.length];
            const side = index % 2 === 0 ? "left" : "right";
            const y = 18 + index * 12.4;
            const opacity = Math.min(1, local * 2.8) * (1 - exit * 0.78);
            const translateX = (1 - local) * move.x + exit * -move.x * 0.45;
            const translateY = (1 - local) * move.y - exit * 8;
            const scale = 0.86 + local * 0.14 - exit * 0.05;

            return (
              <article
                key={stage.stage}
                className={`absolute w-[min(78vw,31rem)] ${side === "left" ? "left-[7%] text-left" : "right-[7%] text-right"}`}
                style={{
                  top: `${y}%`,
                  opacity,
                  transform: `translate3d(${translateX}vw, ${translateY}vh, 0) rotate(${move.rotate * (1 - local)}deg) scale(${scale})`,
                  transformOrigin: move.origin,
                }}
                aria-hidden={active !== index}
              >
                <div className={`flex items-center gap-4 ${side === "right" ? "flex-row-reverse" : ""}`}>
                  <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full border border-sandstone/28 bg-black/20 font-display text-sm text-sandstone backdrop-blur-md">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <span className="h-px flex-1 bg-gradient-to-r from-sandstone/45 to-transparent" style={{ transform: side === "right" ? "scaleX(-1)" : undefined }} />
                </div>

                <p className="mt-5 text-[0.64rem] font-medium uppercase tracking-[0.22em] text-sandstone/78">{stage.stage}</p>
                <h3 className="mt-2 font-display text-[clamp(2.2rem,5vw,4.8rem)] font-normal leading-[0.94] text-ivory">
                  {OUTCOMES[index] ?? stage.stage}
                </h3>
                <p className={`mt-4 text-sm leading-relaxed text-ivory/64 sm:text-base ${side === "right" ? "ml-auto" : ""} max-w-md`}>
                  {stage.description}
                </p>
              </article>
            );
          })}
        </div>

        <div
          className="pointer-events-none absolute inset-0 z-20 flex items-center justify-center bg-[#100e0c] text-center"
          style={{ opacity: finalResolve }}
          aria-hidden={finalResolve < 0.5}
        >
          <div style={{ transform: `scale(${0.92 + finalResolve * 0.08})`, opacity: finalResolve }}>
            <p className="text-[0.64rem] font-medium uppercase tracking-[0.26em] text-sandstone">The system closes</p>
            <p className="mx-auto mt-5 max-w-4xl font-display text-[clamp(3rem,8vw,7.6rem)] font-normal leading-[0.9] text-ivory">
              Every decision now remembers the one before it.
            </p>
            <p className="mx-auto mt-6 max-w-xl text-sm leading-relaxed text-ivory/55 sm:text-base">
              Skip a stage and the break appears later, where recognition should have compounded.
            </p>
          </div>
        </div>

        <div className="absolute inset-x-0 bottom-0 z-30 h-px bg-ivory/10">
          <span className="block h-full bg-sandstone" style={{ width: `${progress * 100}%` }} />
        </div>
      </div>
    </div>
  );
}
