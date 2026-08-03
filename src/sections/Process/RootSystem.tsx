"use client";

import { useEffect, useRef, useState } from "react";
import { useLenis } from "@/components/SmoothScrollProvider";
import type { ProcessStage } from "@/data/process";

// One root network grows as the visitor moves through the process.
// Each node names the concrete outcome produced by that stage, so the
// scene communicates transformation without relying on placeholder
// symbols or a caption to explain what the interaction means.
const NODES = [
  { x: 200, y: 52, becomes: "The right question" },
  { x: 200, y: 162, becomes: "A clear pattern" },
  { x: 200, y: 272, becomes: "A committed blueprint" },
  { x: 112, y: 388, becomes: "A coherent identity" },
  { x: 288, y: 388, becomes: "Market movement" },
  { x: 200, y: 522, becomes: "A brand ecosystem" },
];

// Architect forks into Signal and Influence, and both feed back into
// Compound: identity and reach grow in parallel from one architecture.
const SEGMENTS = [
  { d: "M200 60 C 200 100, 200 112, 200 154" },
  { d: "M200 170 C 200 210, 200 222, 200 264" },
  { d: "M200 280 C 200 330, 132 336, 114 372" },
  { d: "M200 280 C 200 330, 268 336, 286 372" },
  { d: "M112 404 C 112 456, 178 466, 196 506" },
  { d: "M288 404 C 288 456, 222 466, 204 506" },
];

const GOLD = "#C6A97A";

export function RootSystem({ stages }: { stages: ProcessStage[] }) {
  const wrapRef = useRef<HTMLDivElement | null>(null);
  const segRefs = useRef<(SVGPathElement | null)[]>([]);
  const [active, setActive] = useState(-1);
  const [hover, setHover] = useState<number | null>(null);
  const lenis = useLenis();

  useEffect(() => {
    const wrap = wrapRef.current;
    if (!wrap) return;
    let lastActive = -1;

    function update() {
      const el = wrapRef.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const travel = rect.height - window.innerHeight;
      const p = travel > 0 ? Math.min(1, Math.max(0, -rect.top / travel)) : 0;

      // Finish before release so the final ecosystem has a settled beat.
      const grow = Math.min(1, p / 0.88) * SEGMENTS.length;
      SEGMENTS.forEach((_, i) => {
        const local = Math.min(1, Math.max(0, grow - i));
        const path = segRefs.current[i];
        if (path) path.style.strokeDashoffset = String(1 - local);
      });

      const next = Math.min(NODES.length - 1, Math.floor(grow));
      if (next !== lastActive) {
        lastActive = next;
        setActive(next);
      }
    }

    update();
    if (lenis) return lenis.on("scroll", update);
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    return () => {
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, [lenis]);

  const shown = hover ?? (active >= 0 ? active : 0);
  const stage = stages[shown];

  return (
    <div ref={wrapRef} className="relative" style={{ height: "420svh" }}>
      <div className="sticky top-0 h-svh min-h-[620px] overflow-hidden bg-[#141210]">
        <video
          className="absolute inset-0 h-full w-full object-cover opacity-30"
          src="/videos/higgsfield-process-ground.mp4"
          poster="/images/higgsfield-process-ground-poster.jpg"
          muted
          autoPlay
          loop
          playsInline
          preload="metadata"
          ref={(el) => {
            if (el && el.paused) void el.play().catch(() => {});
          }}
        />
        <div
          aria-hidden="true"
          className="absolute inset-0"
          style={{ background: "radial-gradient(70% 60% at 50% 45%, rgba(20,18,16,0.35), rgba(20,18,16,0.94))" }}
        />

        <div className="relative mx-auto flex h-full max-w-6xl flex-col justify-center px-6 lg:flex-row lg:items-center lg:gap-16">
          <div className="relative mx-auto w-full max-w-[22rem] lg:mx-0 lg:max-w-md">
            <svg viewBox="0 0 400 600" className="h-auto w-full" role="img" aria-label="Six brand strategy stages growing through one connected root system">
              {SEGMENTS.map((seg, i) => (
                <path
                  key={i}
                  ref={(el) => {
                    segRefs.current[i] = el;
                  }}
                  d={seg.d}
                  pathLength={1}
                  fill="none"
                  stroke={GOLD}
                  strokeWidth={1.4}
                  strokeLinecap="round"
                  strokeDasharray={1}
                  style={{ strokeDashoffset: 1, opacity: 0.75 }}
                />
              ))}

              {NODES.map((node, i) => {
                const reached = i <= active;
                const lit = hover === i;
                return (
                  <g key={i}>
                    {reached && (
                      <circle
                        cx={node.x}
                        cy={node.y}
                        r={lit ? 22 : 16}
                        fill={GOLD}
                        opacity={lit ? 0.22 : 0.12}
                        style={{ transition: "r 700ms cubic-bezier(0.22,1,0.36,1), opacity 700ms" }}
                      />
                    )}
                    <circle
                      cx={node.x}
                      cy={node.y}
                      r={5}
                      fill={reached ? GOLD : "transparent"}
                      stroke={GOLD}
                      strokeWidth={1.2}
                      opacity={reached ? 1 : 0.3}
                      style={{ transition: "fill 700ms, opacity 700ms" }}
                    />
                    <text
                      x={node.x}
                      y={node.y - 18}
                      textAnchor="middle"
                      className="font-display"
                      fontSize={17}
                      fill="#F6F2EA"
                      opacity={reached ? 1 : 0.35}
                      style={{ transition: "opacity 700ms" }}
                    >
                      {stages[i]?.stage}
                    </text>
                  </g>
                );
              })}
            </svg>

            {NODES.map((node, i) => (
              <button
                key={i}
                type="button"
                onMouseEnter={() => setHover(i)}
                onMouseLeave={() => setHover(null)}
                onFocus={() => setHover(i)}
                onBlur={() => setHover(null)}
                aria-label={`${stages[i]?.stage}. Outcome: ${node.becomes}.`}
                aria-pressed={shown === i}
                className="absolute h-11 w-11 -translate-x-1/2 -translate-y-1/2 rounded-full focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4"
                style={{
                  left: `${(node.x / 400) * 100}%`,
                  top: `${(node.y / 600) * 100}%`,
                  outlineColor: GOLD,
                }}
              />
            ))}
          </div>

          <div className="mt-8 w-full lg:mt-0 lg:w-[26rem]" aria-live="polite">
            <div
              className="rounded-2xl border p-6 backdrop-blur-md sm:p-7"
              style={{ borderColor: "rgba(246,242,234,0.10)", backgroundColor: "rgba(246,242,234,0.06)" }}
            >
              <p className="text-[0.68rem] font-medium uppercase tracking-[0.2em]" style={{ color: GOLD }}>
                {String(shown + 1).padStart(2, "0")} · {stage?.stage}
              </p>
              <p className="mt-3 font-display text-3xl font-normal text-ivory sm:text-4xl">{NODES[shown].becomes}</p>
              <span aria-hidden="true" className="mt-4 block h-px w-12" style={{ backgroundColor: GOLD }} />
              <p className="mt-4 text-sm leading-relaxed text-ivory/70">{stage?.description}</p>
              {stage?.video && (
                <video
                  key={stage.video}
                  className="mt-5 aspect-video w-full rounded-2xl object-cover"
                  src={stage.video}
                  poster={stage.poster}
                  muted
                  autoPlay
                  loop
                  playsInline
                  preload="metadata"
                  ref={(el) => {
                    if (el && el.paused) void el.play().catch(() => {});
                  }}
                />
              )}
            </div>
            <p className="mt-5 max-w-sm text-sm leading-relaxed text-ivory/45">
              One decision never grows a brand. It grows because every decision feeds the same root.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
