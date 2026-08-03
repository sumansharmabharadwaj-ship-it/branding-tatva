"use client";

import { useEffect, useRef } from "react";
import { useReducedMotion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { ElementGlyph } from "@/components/ElementGlyph";
import { BackgroundVideo } from "@/components/BackgroundVideo";
import { useLenis } from "@/components/SmoothScrollProvider";
import { useMediaQuery } from "@/hooks/useMediaQuery";
import { ELEMENT_HEX, MOOD } from "@/lib/sectionWash";
import { elements } from "@/data/elements";
import { AmbientElementShader } from "@/components/AmbientElementShader";

// The Authority build, finally on the same mechanism as every other
// pinned scene on this site: CSS position sticky plus measured scroll
// progress. The GSAP ScrollTrigger pin this section used to carry was
// the last one on the site and the source of a repeatedly reported
// bug: the pin stamps a measured width as an inline style at pin
// time, and any stale measurement left the whole scene a strip
// narrower than the real viewport — visible gaps down both edges on
// real displays. Two workarounds (viewport width background, charcoal
// page ground) treated the symptom. This rebuild removes the cause:
// sticky IS the wrapper's own layout, so it can never disagree with
// the viewport about width.
//
// One responsive structure now serves every visitor: the server, the
// crawler, mobile, and reduced motion all get the five layers fully
// visible in normal flow (which also removes the old hydration height
// swap that once measured 0.21 CLS); desktop with motion gets the
// tall scroll range where the layers assemble one by one, driven by
// rect math on Lenis's own scroll event, styles written directly to
// the nodes with zero per-frame React state.
// Manual guide p11/p65: the scene must DEMONSTRATE amplification
// rather than caption it — each layer carries the marketing
// consequence of skipping it, and the output wave at the top of the
// diagram literally grows as the layers assemble. Teaching lines,
// zero invented client facts.
const SKIPPED: Record<string, string> = {
  earth: "Skipped: every campaign has to reintroduce the brand from zero.",
  water: "Skipped: attention arrives and leaks straight out of the journey.",
  fire: "Skipped: the message is right and nobody stops for it.",
  air: "Skipped: five channels, five personalities, zero memory.",
  space: "Skipped: the work performs once and leaves nothing behind.",
};

const LAYERS = elements.map((el) => ({
  slug: el.slug,
  label: el.name.split("·")[1]?.trim() ?? el.name,
  line: el.manifesto[0],
  skipped: SKIPPED[el.slug] ?? "",
  color: ELEMENT_HEX[el.slug],
}));

// The amplified signal: one path whose oscillation widens left to
// right — small input, growing output. Scaled vertically by scroll
// progress so the wave visibly gains amplitude as layers activate.
const WAVE_PATH = (() => {
  const points: string[] = [];
  for (let x = 0; x <= 400; x += 4) {
    const amp = 4 + (x / 400) * 30;
    const y = 40 + Math.sin((x / 400) * Math.PI * 7) * amp;
    points.push(`${x === 0 ? "M" : "L"}${x} ${y.toFixed(1)}`);
  }
  return points.join(" ");
})();

export function PinnedBrandBuild() {
  const wrapRef = useRef<HTMLDivElement>(null);
  const layerRefs = useRef<(HTMLDivElement | null)[]>([]);
  const waveRef = useRef<SVGGElement>(null);
  const prefersReducedMotion = useReducedMotion();
  const isDesktop = useMediaQuery("(min-width: 640px)");
  const lenis = useLenis();
  const animate = isDesktop && !prefersReducedMotion;

  useEffect(() => {
    if (!animate) {
      // Static contexts keep every layer fully visible and the output
      // wave at full amplitude.
      layerRefs.current.forEach((layer) => {
        if (!layer) return;
        layer.style.opacity = "";
        layer.style.transform = "";
        layer.style.setProperty("--act", "1");
      });
      if (waveRef.current) {
        waveRef.current.style.transform = "";
        waveRef.current.style.opacity = "";
      }
      return;
    }
    const wrap = wrapRef.current;
    if (!wrap) return;

    function update() {
      if (!wrap) return;
      const rect = wrap.getBoundingClientRect();
      const travel = rect.height - window.innerHeight;
      const progress = travel > 0 ? Math.min(1, Math.max(0, -rect.top / travel)) : 1;
      layerRefs.current.forEach((layer, i) => {
        if (!layer) return;
        const start = i / LAYERS.length;
        const span = 0.92 / LAYERS.length;
        const local = Math.min(1, Math.max(0, (progress - start) / span));
        const eased = 1 - (1 - local) * (1 - local);
        layer.style.opacity = String(eased);
        layer.style.transform = `translateY(${(36 * (1 - eased)).toFixed(1)}px) scale(${(0.97 + 0.03 * eased).toFixed(3)})`;
        layer.style.setProperty("--act", eased.toFixed(3));
      });
      // The amplification made visible: the output wave gains height
      // and presence as the layers beneath it assemble.
      if (waveRef.current) {
        waveRef.current.style.transform = `scaleY(${(0.12 + 0.88 * progress).toFixed(3)})`;
        waveRef.current.style.opacity = (0.3 + 0.7 * progress).toFixed(3);
      }
    }

    update();
    window.addEventListener("resize", update);
    if (lenis) {
      const off = lenis.on("scroll", update);
      return () => {
        off?.();
        window.removeEventListener("resize", update);
      };
    }
    window.addEventListener("scroll", update, { passive: true });
    return () => {
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, [animate, lenis]);

  return (
    <div ref={wrapRef} className="relative sm:h-[420vh]" style={{ backgroundColor: MOOD.charcoal }}>
      <div className="relative overflow-hidden sm:sticky sm:top-0 sm:flex sm:h-screen sm:flex-col sm:justify-center">
        {/* Approved Chapter 02 footage (Pexels 38390292, standard
            license): root network in extreme macro — hidden
            intelligence beneath the surface. Sticky children size to
            their own layout, so a plain inset-0 background always
            spans the real viewport; the old 100vw translate hack is
            gone along with the bug it papered over. Mobile carries the
            still frame instead of the video. */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="hidden h-full w-full sm:block">
            <BackgroundVideo
              video="/videos/pexels-root-network.mp4"
              videoWebm="/videos/pexels-root-network.webm"
              poster="/images/pexels-root-network-poster.jpg"
            />
          </div>
          <Image
            src="/images/pexels-root-network-poster.jpg"
            alt=""
            fill
            sizes="100vw"
            style={{ objectFit: "cover" }}
            className="sm:hidden"
          />
          <div className="absolute inset-0" style={{ backgroundColor: "rgba(23,24,26,0.35)" }} />
          <div className="hidden sm:block">
            <AmbientElementShader opacity={0.08} />
          </div>
        </div>

        <div className="relative mx-auto flex w-full max-w-[100rem] flex-col justify-center px-6 py-16 sm:px-10 sm:py-0 lg:px-20">
          <div className="grid items-center gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.35fr)] lg:gap-20">
            <div>
              <p className="text-sm font-medium uppercase tracking-wide text-ivory/70">Authority</p>
              <h2 className="mt-2 text-display-sm font-display font-normal text-ivory lg:text-display-md">
                Marketing amplifies whatever is already there.
              </h2>
              <p className="mt-8 max-w-md text-sm italic text-ivory/90 lg:text-base">
                Skip one layer, and marketing amplifies the gap instead of the position.
              </p>
              {/* The insight produces an action (manual p11): the
                  package that builds every layer, one step away. */}
              <Link
                href="#desire"
                className="mt-6 inline-flex items-center gap-2 text-sm font-medium text-sandstone underline decoration-sandstone/40 underline-offset-4 transition-colors hover:text-ivory"
              >
                The package that builds every layer: Full Brand System
                <span aria-hidden="true">→</span>
              </Link>
            </div>
            <div className="relative">
              {/* The output signal — a wave whose oscillation widens as
                  the layers beneath it assemble. Decorative twin of the
                  rows below, which carry the full text alternative. */}
              <div aria-hidden="true" className="mb-6 border-b border-ivory/10 pb-4">
                <p className="text-[0.62rem] font-medium uppercase tracking-[0.2em] text-ivory/50">
                  What marketing has to work with
                </p>
                <svg viewBox="0 0 400 80" className="mt-2 h-14 w-full max-w-lg" fill="none">
                  <g ref={waveRef} style={{ transformOrigin: "50% 50%" }}>
                    <path d={WAVE_PATH} stroke="#C6A97A" strokeWidth="1.6" strokeLinecap="round" opacity="0.9" />
                    <path d={WAVE_PATH} stroke="#C6A97A" strokeWidth="5" strokeLinecap="round" opacity="0.12" />
                  </g>
                </svg>
              </div>
              {LAYERS.map((layer, i) => (
                <div
                  key={layer.slug}
                  ref={(node) => {
                    layerRefs.current[i] = node;
                  }}
                  className="group/layer flex items-start gap-6 border-b border-ivory/10 py-4 transition-[border-color] duration-300 last:border-b-0 hover:border-ivory/30 xl:py-5"
                  style={{ marginLeft: `${i * 18}px` }}
                >
                  <span className="relative flex items-start gap-3">
                    {/* Activation node: fills with the layer's own color
                        as the layer arrives, tying row and diagram into
                        one system. */}
                    <span
                      aria-hidden="true"
                      className="mt-3 h-2 w-2 shrink-0 rounded-full"
                      style={{ backgroundColor: layer.color, opacity: "var(--act, 1)" }}
                    />
                    <span
                      className="font-display text-3xl font-normal leading-none opacity-40 xl:text-4xl"
                      style={{ color: layer.color }}
                    >
                      {String(i + 1).padStart(2, "0")}
                    </span>
                  </span>
                  <div className="flex items-start gap-4 pt-1">
                    <ElementGlyph slug={layer.slug} className="mt-1 h-6 w-6 shrink-0" style={{ color: layer.color }} />
                    <div>
                      <p className="font-display text-2xl font-normal text-ivory xl:text-3xl">{layer.label}</p>
                      <p className="mt-1 max-w-lg text-sm text-ivory/90 xl:text-base">{layer.line}</p>
                      <p className="mt-1 max-w-lg text-xs leading-relaxed text-ivory/60 xl:text-sm">{layer.skipped}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
