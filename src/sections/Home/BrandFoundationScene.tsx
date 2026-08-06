"use client";

import { useHydratedReducedMotion } from "@/hooks/useHydratedReducedMotion";
import { useEffect, useLayoutEffect, useRef, useState, type CSSProperties } from "react";
import Link from "next/link";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useInView } from "framer-motion";

// Suman's excavation concept: the Earth chapter stops being a list over a
// scenic landscape and becomes the idea itself. A real root network fills the
// frame, mineral light travels through it, the invisible strategic layers rise
// from the ground, and their connections become the finished foundation.
//
// Deliberately NO ScrollTrigger.pin. The outer wrapper supplies the scroll
// travel and the scene holds itself with CSS sticky, which is the same
// discipline every other held sequence here uses. GSAP drives only the
// internal timeline, scrubbed against that wrapper. Lenis already bridges into
// ScrollTrigger centrally in SmoothScrollProvider, so nothing here creates a
// second scroll system.
gsap.registerPlugin(ScrollTrigger);

// useLayoutEffect measures the scene, and React warns if it runs during SSR.
const useIsomorphicLayoutEffect = typeof window === "undefined" ? useEffect : useLayoutEffect;

type FoundationLayer = {
  id: string;
  number: string;
  label: string;
  title: string;
  description: string;
  produces: string[];
  x: string;
  y: string;
};

const FOUNDATION_LAYERS: FoundationLayer[] = [
  {
    id: "category",
    number: "01",
    label: "Category",
    title: "Where the business belongs.",
    description:
      "The frame that tells people what you are, what they should compare you with, and why the category has room for you.",
    produces: ["Category frame", "Competitor codes", "Market boundaries"],
    x: "8%",
    y: "70%",
  },
  {
    id: "audience",
    number: "02",
    label: "Audience",
    title: "Whose mind the brand must enter.",
    description:
      "The behaviours, tensions, and associations that decide how the right people read the business before they ever speak to it.",
    produces: ["Audience tensions", "Decision behaviour", "Perception map"],
    x: "27%",
    y: "60%",
  },
  {
    id: "belief",
    number: "03",
    label: "Belief",
    title: "What people should begin to associate.",
    description:
      "The central truth that identity, language, experience, and every campaign afterwards keep reinforcing.",
    produces: ["Brand truth", "Association system", "Message territory"],
    x: "46%",
    y: "70%",
  },
  {
    id: "position",
    number: "04",
    label: "Position",
    title: "The space competitors struggle to occupy.",
    description:
      "A clear, defensible reason to choose this business ahead of the most familiar alternative in the category.",
    produces: ["Positioning statement", "Value proposition", "Decision filters"],
    x: "65%",
    y: "58%",
  },
];

export function BrandFoundationScene() {
  const wrapperRef = useRef<HTMLElement>(null);
  const sceneRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const prefersReducedMotion = useHydratedReducedMotion();
  const sceneInView = useInView(wrapperRef, { amount: 0.08 });
  const [activeLayer, setActiveLayer] = useState<string>(FOUNDATION_LAYERS[0].id);

  useEffect(() => {
    const videoAtEffectStart = videoRef.current;

    function syncPlayback() {
      const video = videoRef.current;
      if (!video) return;

      if (prefersReducedMotion || !sceneInView || document.hidden) {
        video.pause();
        return;
      }
      void video.play().catch(() => {});
    }

    syncPlayback();
    document.addEventListener("visibilitychange", syncPlayback);
    return () => {
      document.removeEventListener("visibilitychange", syncPlayback);
      videoAtEffectStart?.pause();
    };
  }, [prefersReducedMotion, sceneInView]);

  useIsomorphicLayoutEffect(() => {
    const wrapper = wrapperRef.current;
    const scene = sceneRef.current;
    if (!wrapper || !scene || prefersReducedMotion) return;
    // Desktop only: on a phone the cards sit in normal flow, so there is no
    // scrubbed sequence to drive.
    if (!window.matchMedia("(min-width: 768px)").matches) return;

    const context = gsap.context(() => {
      const landscape = scene.querySelector("[data-landscape]");
      const sunlight = scene.querySelector("[data-sunlight]");
      const openingCopy = scene.querySelector("[data-opening-copy]");
      const finalCopy = scene.querySelector("[data-final-copy]");
      const layers = gsap.utils.toArray<HTMLElement>("[data-foundation-layer]");
      const lines = gsap.utils.toArray<SVGPathElement>("[data-connection-line]");
      const depthGrid = scene.querySelector("[data-depth-grid]");

      gsap.set(layers, { opacity: 0, y: 36, scale: 0.96 });
      gsap.set(finalCopy, { opacity: 0, y: 24 });
      gsap.set(lines, { strokeDasharray: 480, strokeDashoffset: 480 });
      gsap.set(depthGrid, { opacity: 0, scaleY: 0.7, transformOrigin: "50% 100%" });

      const timeline = gsap.timeline({
        defaults: { ease: "none" },
        scrollTrigger: {
          trigger: wrapper,
          start: "top top",
          end: "bottom bottom",
          scrub: 0.65,
          invalidateOnRefresh: true,
          onUpdate: (self) => {
            const index = Math.min(
              FOUNDATION_LAYERS.length - 1,
              Math.floor(self.progress * FOUNDATION_LAYERS.length),
            );
            setActiveLayer(FOUNDATION_LAYERS[index].id);
          },
        },
      });

      timeline
        .to(landscape, { scale: 1.12, yPercent: -3, duration: 1.7 }, 0)
        .to(sunlight, { xPercent: 190, yPercent: -30, rotate: 8, opacity: 0.76, duration: 2.5 }, 0.15)
        .to(openingCopy, { opacity: 0, y: -22, filter: "blur(8px)", duration: 0.45 }, 0.42)
        .to(depthGrid, { opacity: 0.62, scaleY: 1, duration: 0.7 }, 0.5);

      layers.forEach((layer, index) => {
        // Each layer arrives out of shadow when the mineral light reaches it,
        // rather than simply fading upward like another website card.
        timeline.fromTo(
          layer,
          { opacity: 0, y: 36, scale: 0.96, filter: "brightness(0.5) blur(8px)" },
          {
            opacity: 1,
            y: 0,
            scale: 1,
            filter: "brightness(1) blur(0px)",
            duration: 0.5,
            ease: "power2.out",
          },
          0.8 + index * 0.45,
        );
      });

      lines.forEach((line, index) => {
        timeline.to(
          line,
          { strokeDashoffset: 0, duration: 0.55, ease: "power2.inOut" },
          1.15 + index * 0.45,
        );
      });

      timeline.to(finalCopy, { opacity: 1, y: 0, duration: 0.6, ease: "power3.out" }, 2.45);
    }, wrapper);

    return () => context.revert();
  }, [prefersReducedMotion]);

  return (
    <section
      ref={wrapperRef}
      className="relative h-auto md:h-[220svh]"
      style={{ backgroundColor: "#121713" }}
      aria-labelledby="brand-foundation-title"
    >
      <div
        ref={sceneRef}
        className="relative min-h-svh overflow-hidden md:sticky md:top-0 md:h-svh md:min-h-[700px]"
      >
        <div data-landscape className="absolute inset-0 will-change-transform">
          <video
            ref={videoRef}
            muted
            loop
            autoPlay={Boolean(sceneInView && !prefersReducedMotion)}
            playsInline
            preload={sceneInView ? "metadata" : "none"}
            poster="/images/pexels-root-network-poster.jpg"
            aria-hidden="true"
            className="h-full w-full object-cover object-[center_52%]"
          >
            <source src="/videos/pexels-root-network.webm" type="video/webm" />
            <source src="/videos/pexels-root-network.mp4" type="video/mp4" />
          </video>
        </div>

        {/* The scrim protects the reading zones while leaving a clear window
            through the centre-right roots. It is local contrast, not a brown
            filter poured over the entire film. */}
        <div
          aria-hidden="true"
          className="absolute inset-0"
          style={{
            backgroundImage:
              "linear-gradient(105deg, rgba(8,13,10,0.93) 0%, rgba(8,13,10,0.64) 41%, rgba(8,13,10,0.18) 67%, rgba(8,13,10,0.72) 100%), linear-gradient(180deg, rgba(8,13,10,0.08) 0%, rgba(8,13,10,0.84) 100%)",
          }}
        />

        <div
          data-sunlight
          aria-hidden="true"
          className="pointer-events-none absolute -left-[28%] top-[4%] hidden h-[80%] w-[34%] rotate-[-18deg] blur-2xl will-change-transform md:block"
          style={{
            backgroundImage:
              "linear-gradient(90deg, transparent, rgba(181,197,170,0.1), rgba(233,225,193,0.32), transparent)",
          }}
        />

        <DepthGrid />

        <div className="relative z-20 mx-auto flex h-full max-w-[1500px] flex-col px-6 py-20 md:px-12 lg:px-16">
          <div data-opening-copy className="max-w-xl md:pt-[8vh]">
            <p className="mb-5 text-xs font-medium uppercase tracking-[0.28em]" style={{ color: "#b8aa86" }}>
              01 · Earth
            </p>
            <h2
              id="brand-foundation-title"
              className="max-w-lg font-display text-[clamp(2.4rem,6vw,6.2rem)] font-normal leading-[0.94] tracking-[-0.03em]"
              style={{ color: "#f1eadc" }}
            >
              The decisions people never see.
            </h2>
            <p className="mt-7 max-w-md text-base leading-8 sm:text-lg" style={{ color: "rgba(225,218,205,0.82)" }}>
              Every remembered brand stands on a foundation its customers may never consciously notice.
            </p>
          </div>

          <div className="relative mt-10 md:mt-auto md:h-[53%]">
            <FoundationConnections />
            {FOUNDATION_LAYERS.map((layer) => (
              <FoundationLayerCard
                key={layer.id}
                layer={layer}
                active={activeLayer === layer.id}
                staticAll={Boolean(prefersReducedMotion)}
              />
            ))}
          </div>

          <FinalCopy staticAll={Boolean(prefersReducedMotion)} />
        </div>

        <nav
          aria-label="Brand foundation layers"
          className="absolute bottom-6 left-6 z-40 hidden items-center gap-5 md:flex lg:left-16"
        >
          {FOUNDATION_LAYERS.map((layer) => (
            <span
              key={layer.id}
              className="text-[0.67rem] uppercase tracking-[0.22em] transition-colors duration-300"
              style={{ color: activeLayer === layer.id ? "#f1eadc" : "rgba(241,234,220,0.35)" }}
            >
              {layer.number} {layer.label}
            </span>
          ))}
        </nav>
      </div>
    </section>
  );
}

function FoundationLayerCard({
  layer,
  active,
  staticAll,
}: {
  layer: FoundationLayer;
  active: boolean;
  staticAll: boolean;
}) {
  // Desktop reveals the system progressively. Mobile has no scrubbed scene,
  // so every explanation and output remains open in one readable sequence.
  // Reduced motion follows the same complete-at-rest principle on every size.
  const open = active || staticAll;
  const position = { "--layer-x": layer.x, "--layer-y": layer.y } as CSSProperties;

  return (
    <article
      data-foundation-layer
      style={position}
      className={[
        "relative mb-4 w-full",
        "md:absolute md:mb-0 md:left-[var(--layer-x)] md:top-[var(--layer-y)]",
        "md:w-[min(270px,22vw)] md:-translate-x-1/2 md:-translate-y-1/2",
        "rounded-2xl border px-5 py-5 backdrop-blur-lg",
        "max-md:border-[#b8aa86]/40 max-md:bg-[#111714]/82",
        "transition-[border-color,background-color,box-shadow] duration-500",
        open
          ? "md:border-[#b8aa86]/75 md:bg-[#111714]/88 md:shadow-[0_20px_60px_rgba(0,0,0,.34)]"
          : "md:border-[#efe5d2]/15 md:bg-[#111714]/68",
      ].join(" ")}
    >
      <div className="flex items-center justify-between">
        <span className="text-[0.68rem] uppercase tracking-[0.24em]" style={{ color: "#b8aa86" }}>
          {layer.number}
        </span>
        <span
          aria-hidden="true"
          className={[
            "h-2.5 w-2.5 rounded-full border transition-all duration-500",
            "max-md:border-[#b8aa86] max-md:bg-[#b8aa86]",
            open ? "md:border-[#b8aa86] md:bg-[#b8aa86]" : "md:border-[#efe5d2]/35",
          ].join(" ")}
        />
      </div>
      <p className="mt-4 text-xs uppercase tracking-[0.22em]" style={{ color: "rgba(239,229,210,0.65)" }}>
        {layer.label}
      </p>
      <h3 className="mt-2 font-display text-xl font-normal leading-6" style={{ color: "#f2eadc" }}>
        {layer.title}
      </h3>
      <p
        className={[
          "overflow-hidden text-sm leading-6 transition-[max-height,opacity,margin] duration-500",
          "max-md:mt-4 max-md:max-h-60 max-md:opacity-100",
          open ? "md:mt-4 md:max-h-60 md:opacity-100" : "md:mt-0 md:max-h-0 md:opacity-0",
        ].join(" ")}
        style={{ color: "rgba(222,214,200,0.72)" }}
      >
        {layer.description}
      </p>
      <ul
        className={[
          "space-y-1 overflow-hidden border-[#efe5d2]/10 text-xs leading-5 transition-[max-height,opacity,margin,padding] duration-500",
          "max-md:mt-4 max-md:max-h-40 max-md:border-t max-md:pt-4 max-md:opacity-100",
          open
            ? "md:mt-4 md:max-h-40 md:border-t md:pt-4 md:opacity-100"
            : "md:mt-0 md:max-h-0 md:opacity-0",
        ].join(" ")}
        style={{ color: "rgba(222,214,200,0.6)" }}
      >
        {layer.produces.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>
    </article>
  );
}

function FoundationConnections() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 1200 460"
      preserveAspectRatio="none"
      className="pointer-events-none absolute inset-0 hidden h-full w-full md:block"
    >
      {[
        "M168 340 C280 275 332 276 415 297",
        "M420 298 C510 340 590 338 660 315",
        "M662 315 C760 280 842 248 925 240",
      ].map((d) => (
        <path key={d} data-connection-line d={d} fill="none" stroke="rgba(184,170,134,.72)" strokeWidth="2" />
      ))}
    </svg>
  );
}

function DepthGrid() {
  return (
    <div
      data-depth-grid
      aria-hidden="true"
      className="pointer-events-none absolute inset-x-0 bottom-0 z-10 hidden h-[58%] overflow-hidden opacity-0 md:block"
    >
      <div
        className="absolute inset-0"
        style={{ backgroundImage: "linear-gradient(to top, rgba(9,14,11,.94), transparent)" }}
      />
      <div className="absolute inset-x-[6%] bottom-[-8%] h-[92%] [perspective:700px]">
        <div
          className="h-full w-full origin-bottom [transform:rotateX(62deg)]"
          style={{
            backgroundImage:
              "linear-gradient(rgba(184,170,134,.16) 1px, transparent 1px), linear-gradient(90deg, rgba(184,170,134,.16) 1px, transparent 1px)",
            backgroundSize: "72px 54px",
          }}
        />
      </div>
    </div>
  );
}

function FinalCopy({ staticAll }: { staticAll: boolean }) {
  return (
    <div
      data-final-copy
      className={[
        "z-30 mt-10 max-w-md md:absolute md:bottom-16 md:right-8 md:mt-0 md:max-w-xs md:text-right lg:right-12",
        staticAll ? "opacity-100" : "md:opacity-0",
      ].join(" ")}
    >
      <p className="text-xs uppercase tracking-[0.26em]" style={{ color: "#b8aa86" }}>
        The foundation
      </p>
      <p
        className="mt-3 font-display text-[clamp(1.4rem,2.1vw,2.1rem)] font-normal leading-tight"
        style={{ color: "#f1eadc" }}
      >
        The logo is visible. The reason it means something begins underneath.
      </p>
      <Link
        href="/services#desire"
        className="mt-6 inline-flex min-h-12 items-center gap-4 rounded-full border border-[#eadfcb]/30 bg-[#101612]/68 px-6 text-sm backdrop-blur-md transition-colors duration-300 hover:border-[#b8aa86]/70 hover:bg-[#1d271f] focus-visible:outline focus-visible:outline-2"
        style={{ color: "#f1eadc", outlineColor: "#b8aa86" }}
      >
        Explore the foundation path
        <span aria-hidden="true">↗</span>
      </Link>
    </div>
  );
}
