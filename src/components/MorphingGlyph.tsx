"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { MorphSVGPlugin } from "gsap/MorphSVGPlugin";
import { ELEMENT_HEX } from "@/lib/sectionWash";

gsap.registerPlugin(MorphSVGPlugin);

// The one deliberate use of MorphSVG on the site — free since Webflow's
// 2025 GreenSock acquisition, but still a GSAP-ticker-driven tween (there's
// no CSS/Web Animations API equivalent for interpolating path data), so
// it's kept off any load-critical or scroll-blocking path. Unlike
// PageLoadVeil (plain Framer Motion, on purpose — see that file's own
// notes on a prior GSAP-hydration incident), this is a decorative,
// non-blocking loop: gated on visibility, paused off-screen, and skipped
// entirely under reduced motion. Worst case if a tab is backgrounded
// mid-morph, the shape just freezes on its current frame and resumes when
// the tab refocuses — nothing depends on it reaching a terminal state.
//
// Same path data as ElementGlyph.tsx, reused rather than redrawn — earth's
// three strata lines and air's two arcs are concatenated into single
// compound `d` strings (multiple M...  subpaths in one path, the same
// technique water's own glyph already uses) since MorphSVG morphs one
// shape into one other shape. Space's circle becomes a two-arc path for
// the same reason.
const SHAPES = [
  { slug: "earth", color: ELEMENT_HEX.earth, d: "M8 30 L24 20 L40 30 M11 34.5 L24 26.5 L37 34.5 M14 39 L24 33 L34 39" },
  { slug: "water", color: ELEMENT_HEX.water, d: "M6 22c4-6 8-6 12 0s8 6 12 0 8-6 12 0M6 30c4-6 8-6 12 0s8 6 12 0 8-6 12 0" },
  { slug: "fire", color: ELEMENT_HEX.fire, d: "M24 8c-7 8-11 14-11 20a11 11 0 0 0 22 0c0-4-2-7-4-9 .5 3-1 5-3 5.5 1.5-6-1-11-4-16.5Z" },
  { slug: "air", color: ELEMENT_HEX.air, d: "M6 18h24a5 5 0 1 0-4.5-7 M6 26h30a5 5 0 1 1-4 8 M6 34h20" },
  { slug: "space", color: ELEMENT_HEX.space, d: "M15 24a9 9 0 1 0 18 0a9 9 0 1 0-18 0" },
] as const;

const HOLD = 1.3;
const MORPH = 0.8;

export function MorphingGlyph({ size = 112, className }: { size?: number; className?: string }) {
  const pathRef = useRef<SVGPathElement>(null);
  const wrapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const path = pathRef.current;
    const wrap = wrapRef.current;
    if (!path || !wrap) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const timeline = gsap.timeline({ repeat: -1, paused: true });
    SHAPES.forEach((shape) => {
      timeline.to(
        path,
        { morphSVG: shape.d, stroke: shape.color, duration: MORPH, ease: "power2.inOut" },
        `+=${HOLD}`
      );
    });

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) timeline.play();
        else timeline.pause();
      },
      { threshold: 0.2 }
    );
    observer.observe(wrap);

    return () => {
      observer.disconnect();
      timeline.kill();
    };
  }, []);

  return (
    <div ref={wrapRef} className={className}>
      <svg
        width={size}
        height={size}
        viewBox="0 0 48 48"
        fill="none"
        strokeWidth={1.6}
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <path ref={pathRef} d={SHAPES[0].d} stroke={SHAPES[0].color} />
      </svg>
    </div>
  );
}
