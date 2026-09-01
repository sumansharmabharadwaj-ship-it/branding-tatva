"use client";

import { useHydratedReducedMotion } from "@/hooks/useHydratedReducedMotion";
import { useEffect, useRef, useState } from "react";

import Link from "next/link";
import { ElementGlyph } from "@/components/ElementGlyph";
import { BackgroundVideo } from "@/components/BackgroundVideo";
import { ELEMENT_HEX, MOOD } from "@/lib/sectionWash";
import { elements } from "@/data/elements";
import { packages } from "@/data/services";
import { MobileAuthorityDeck, type AuthorityLayer } from "@/sections/Services/MobileAuthorityDeck";
import {
  SERVICES_SITUATION_EVENT,
  SERVICES_SITUATION_STORAGE_KEY,
  SITUATION_TO_PACKAGE,
  isServicesSituation,
  readCompletedHomeDiagnosis,
  type ServicesSituationDetail,
  type ServicesSituationId,
} from "@/lib/servicesJourney";

const SCENE_PROGRESS_EVENT = "bt:services-scene-progress";

// Authority uses the page's shared native scroll camera rather than a
// second pinned runway. The GSAP ScrollTrigger version repeatedly
// desynchronised and introduced dead space. A later CSS sticky version
// fixed the width bug, but still asked for more than two viewports. The
// current one frame build keeps the progressive layer assembly while
// every pixel of travel remains ordinary page scroll.
//
// One responsive structure now serves every visitor: the server, the
// crawler, mobile, and reduced motion all get the five layers fully
// visible in normal flow (which also removes the old hydration height
// swap that once measured 0.21 CLS); desktop with motion gets the
// one viewport where the layers assemble one by one as the shared
// services camera crosses the chapter. The same progress reverses
// when the visitor scrolls upward, while touch and reduced motion keep
// the complete tabbed deck in normal flow.
// Manual guide p11/p65: the scene must DEMONSTRATE amplification
// rather than caption it — each layer carries the marketing
// consequence of skipping it, and the output wave at the top of the
// diagram literally grows as the layers assemble. Teaching lines,
// zero invented client facts.
const SKIPPED: Record<string, string> = {
  earth: "Without this: every campaign has to explain the business from the beginning.",
  water: "Without this: attention arrives, but the experience gives buyers no reason to stay.",
  fire: "Without this: the message may be right, yet nothing earns a second look.",
  air: "Without this: five channels sound like five different businesses.",
  space: "Without this: each campaign works alone and leaves little memory behind.",
};

const LAYERS: AuthorityLayer[] = elements.map((el) => ({
  slug: el.slug,
  label: el.name.split("·")[1]?.trim() ?? el.name,
  line: el.manifesto[0],
  skipped: SKIPPED[el.slug] ?? "",
  color: ELEMENT_HEX[el.slug] ?? "#C6A97A",
}));

const AUTHORITY_ROUTE_ACTION: Record<ServicesSituationId, string> = {
  idea: "Build the foundation first",
  reposition: "Rebuild every layer",
  ongoing: "Keep every layer recognisable",
};

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
  const layerRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const waveRef = useRef<SVGGElement>(null);
  const [situation, setSituation] = useState<ServicesSituationId | null>(null);
  const [inspectedLayer, setInspectedLayer] = useState<number | null>(null);
  const prefersReducedMotion = useHydratedReducedMotion();
  const recommendedPackage = packages.find(
    (pkg) => pkg.slug === (situation ? SITUATION_TO_PACKAGE[situation] : "brand-clarity"),
  );
  const authorityAction = situation
    ? AUTHORITY_ROUTE_ACTION[situation]
    : "The package that builds every layer";

  useEffect(() => {
    try {
      const storedSituation = window.localStorage.getItem(SERVICES_SITUATION_STORAGE_KEY);
      setSituation(
        isServicesSituation(storedSituation)
          ? storedSituation
          : readCompletedHomeDiagnosis(),
      );
    } catch {
      setSituation(null);
    }

    function onSituation(event: Event) {
      const detail = (event as CustomEvent<ServicesSituationDetail>).detail;
      setSituation(isServicesSituation(detail?.situation) ? detail.situation : null);
    }

    window.addEventListener(SERVICES_SITUATION_EVENT, onSituation as EventListener);
    return () => window.removeEventListener(SERVICES_SITUATION_EVENT, onSituation as EventListener);
  }, []);

  useEffect(() => {
    if (prefersReducedMotion) {
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

    function update(progress: number, direction: "up" | "down", velocity: number) {
      if (!wrap) return;
      // Resolve the complete system before the chapter reaches the viewport
      // focal line. Direct chapter links therefore arrive on a readable,
      // finished diagram, while ordinary scrolling still controls the build
      // during the chapter's anticipation and activation phases.
      const assembly = Math.min(1, Math.max(0, (progress - 0.04) / 0.58));
      const signedVelocity = Math.min(1, velocity) * (direction === "down" ? 1 : -1);

      wrap.dataset.authorityDirection = direction;
      wrap.style.setProperty("--authority-progress", assembly.toFixed(4));
      wrap.style.setProperty("--authority-camera-y", `${((0.5 - progress) * 28 + signedVelocity * 8).toFixed(2)}px`);
      wrap.style.setProperty("--authority-camera-scale", (1.035 - assembly * 0.025 + velocity * 0.012).toFixed(4));
      wrap.style.setProperty("--authority-copy-x", `${((1 - assembly) * -20 + signedVelocity * 6).toFixed(2)}px`);
      wrap.style.setProperty("--authority-copy-opacity", (0.82 + assembly * 0.18).toFixed(4));

      layerRefs.current.forEach((layer, i) => {
        if (!layer) return;
        const start = i * 0.095;
        const local = Math.min(1, Math.max(0, (assembly - start) / 0.34));
        const eased = 1 - Math.pow(1 - local, 3);
        const orbit = (1 - eased) * (i % 2 === 0 ? -1 : 1) * (38 + i * 5);
        const lift = (1 - eased) * (24 + i * 3) + signedVelocity * (5 + i);
        const rotation = (1 - eased) * (i % 2 === 0 ? -1 : 1) * 1.2;
        // Keep every consequence readable while the system assembles. The
        // unfinished rows still yield to the active layer through position,
        // scale, colour and the activation signal rather than disappearing
        // into the moving material beneath them.
        layer.style.opacity = String(0.68 + eased * 0.32);
        layer.style.transform = `translate3d(${orbit.toFixed(1)}px, ${lift.toFixed(1)}px, 0) rotate(${rotation.toFixed(2)}deg) scale(${(0.965 + 0.035 * eased).toFixed(3)})`;
        layer.style.setProperty("--act", (0.34 + eased * 0.66).toFixed(3));
      });

      if (waveRef.current) {
        waveRef.current.style.transform = `translate3d(${(signedVelocity * 7).toFixed(2)}px, 0, 0) scaleY(${(0.12 + 0.88 * assembly).toFixed(3)})`;
        waveRef.current.style.opacity = (0.48 + 0.52 * assembly).toFixed(3);
      }
    }

    function onProgress(event: Event) {
      const detail = (
        event as CustomEvent<{
          id?: string;
          progress?: number;
          direction?: "up" | "down";
          velocity?: number;
        }>
      ).detail;
      if (detail?.id !== "authority" || typeof detail.progress !== "number") return;
      update(detail.progress, detail.direction ?? "down", detail.velocity ?? 0);
    }

    update(0, "down", 0);
    window.addEventListener(SCENE_PROGRESS_EVENT, onProgress as EventListener);
    return () => {
      window.removeEventListener(SCENE_PROGRESS_EVENT, onProgress as EventListener);
      delete wrap.dataset.authorityDirection;
      wrap.style.removeProperty("--authority-progress");
      wrap.style.removeProperty("--authority-camera-y");
      wrap.style.removeProperty("--authority-camera-scale");
      wrap.style.removeProperty("--authority-copy-x");
      wrap.style.removeProperty("--authority-copy-opacity");
    };
  }, [prefersReducedMotion]);

  return (
    <div
      ref={wrapRef}
      data-authority-story="true"
      data-authority-route={situation ?? "default"}
      className="relative min-h-[100svh] lg:h-[100svh]"
      style={{ backgroundColor: MOOD.charcoal }}
    >
      <div
        data-authority-frame="true"
        className="relative overflow-hidden lg:flex lg:h-[100svh] lg:flex-col lg:justify-center"
      >
        {/* Original procedural Authority film: a restrained signal rises
            through five natural material layers and widens only after
            the full system is present. The assembling rows remain the primary
            scroll-led demonstration; the film gives them one coherent
            material world instead of repeating the hero's root metaphor. */}
        <div data-authority-media-plane="true" className="absolute inset-0 overflow-hidden">
          <BackgroundVideo
            video="/videos/generated/bt-services-authority-layers.mp4"
            videoMobile="/videos/generated/bt-services-authority-layers-mobile.mp4"
            poster="/images/generated/bt-services-authority-layers-poster.jpg"
            playbackRate={1.04}
          />
          <div
            className="absolute inset-0"
            style={{
              backgroundImage:
                "linear-gradient(100deg, rgba(15,17,19,0.58) 0%, rgba(15,17,19,0.34) 46%, rgba(15,17,19,0.18) 100%)",
            }}
          />
        </div>

        <div
          data-authority-shell="true"
          className="relative mx-auto flex w-full max-w-[100rem] flex-col justify-center px-6 py-16 sm:px-10 sm:py-20 lg:px-20 lg:py-0"
        >
          <div
            data-authority-grid="true"
            className="grid items-center gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.35fr)] lg:gap-20"
          >
            <div data-authority-copy="true">
              <p className="text-sm font-medium uppercase tracking-wide text-ivory/70">Before promotion</p>
              <h2 className="mt-2 text-display-sm font-display font-normal text-ivory lg:text-display-md">
                Marketing cannot correct what the brand has not decided.
              </h2>
              <p className="mt-8 max-w-md text-sm italic text-ivory/90 lg:text-base">
                When category, experience, expression, voice, or presence is weak, every campaign has to compensate.
              </p>
              {/* The insight produces an action (manual p11): the
                  package that builds every layer, one step away. */}
              <Link
                href="#desire"
                className="mt-6 inline-flex items-center gap-2 text-sm font-medium text-sandstone underline decoration-sandstone/40 underline-offset-4 transition-colors hover:text-ivory"
              >
                {authorityAction}: {recommendedPackage?.name ?? "Full Brand System"}
                <span aria-hidden="true">→</span>
              </Link>
            </div>
            <MobileAuthorityDeck layers={LAYERS} wavePath={WAVE_PATH} />
            <div data-authority-diagram="true" data-services-chapter-instrument="true" className="relative hidden lg:block">
              {/* The output signal — a wave whose oscillation widens as
                  the layers beneath it assemble. Decorative twin of the
                  rows below, which carry the full text alternative. */}
              <div data-authority-wave="true" className="mb-6 border-b border-ivory/10 pb-4">
                <div data-authority-signal-header="true">
                  <p className="text-[0.62rem] font-medium uppercase tracking-[0.2em] text-ivory/50">
                    What must exist before promotion
                  </p>
                  <p
                    data-authority-signal-status="true"
                    className="text-right text-[0.58rem] font-medium uppercase tracking-[0.16em] text-ivory/55"
                    aria-live="polite"
                  >
                    <span className="text-ivory/40">Layer in focus</span>
                    <span className="ml-2 text-sandstone">
                      {inspectedLayer === null ? "Entire brand system" : LAYERS[inspectedLayer]?.label}
                    </span>
                  </p>
                </div>
                <svg aria-hidden="true" viewBox="0 0 400 80" className="mt-2 h-14 w-full max-w-lg" fill="none">
                  <g ref={waveRef} style={{ transformOrigin: "50% 50%" }}>
                    <path d={WAVE_PATH} stroke="#C6A97A" strokeWidth="1.6" strokeLinecap="round" opacity="0.9" />
                    <path d={WAVE_PATH} stroke="#C6A97A" strokeWidth="5" strokeLinecap="round" opacity="0.12" />
                  </g>
                </svg>
              </div>
              {LAYERS.map((layer, i) => (
                <button
                  key={layer.slug}
                  data-authority-desktop-layer="true"
                  type="button"
                  aria-pressed={inspectedLayer === i}
                  onClick={() => setInspectedLayer((current) => (current === i ? null : i))}
                  ref={(node) => {
                    layerRefs.current[i] = node;
                  }}
                  className="group/layer flex items-start gap-6 border-b border-ivory/10 py-4 text-left transition-[border-color,background-color,box-shadow] duration-300 last:border-b-0 hover:border-ivory/30 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sandstone xl:py-5"
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
                      className="font-display text-3xl font-normal leading-none opacity-[0.78] xl:text-4xl"
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
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
