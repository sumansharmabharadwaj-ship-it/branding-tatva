"use client";

import { useEffect, useRef, useState } from "react";
import { useLenis } from "@/components/SmoothScrollProvider";
import { ElementRowBackground } from "@/components/ElementRowBackground";
import { ElementSignature } from "@/sections/Elements/ElementSignature";
import { ElementGlyph } from "@/components/ElementGlyph";
import type { Element } from "@/data/elements";

const STAGE_SPEED = 1.15;
const HOLD = 0.4;

const TRANSFORMATIONS: Record<
  Element["slug"],
  { verb: string; from: string; to: string; consequence: string; cue: string }
> = {
  earth: {
    verb: "Anchor",
    from: "Assumptions scattered beneath the business",
    to: "One position every later decision can stand on",
    consequence: "Without Earth, every campaign starts by renegotiating who the brand is.",
    cue: "Separate fragments compact into one load-bearing foundation.",
  },
  water: {
    verb: "Carry",
    from: "Touchpoints behaving like unrelated encounters",
    to: "One expectation flowing through the whole journey",
    consequence: "Without Water, every platform teaches the customer a different version of you.",
    cue: "A single signal travels through changing surfaces without losing its meaning.",
  },
  fire: {
    verb: "Distinguish",
    from: "Category-safe expression that earns no second look",
    to: "A recognisable signal strong enough to interrupt habit",
    consequence: "Without Fire, clarity stays invisible and attention goes to the louder alternative.",
    cue: "Weak signals fall away; the distinctive one remains lit.",
  },
  air: {
    verb: "Translate",
    from: "Strategy understood only inside the business",
    to: "Language customers can repeat after the brand leaves",
    consequence: "Without Air, five channels develop five personalities and memory never settles.",
    cue: "One thought becomes language, rhythm, and a phrase others can carry.",
  },
  space: {
    verb: "Compound",
    from: "Isolated moments of attention",
    to: "Recognition that accumulates across time",
    consequence: "Without Space, every launch pays again for awareness the last one failed to store.",
    cue: "Repeated signals leave a larger field of memory behind them.",
  },
};

function TransformationDiagram({ slug, color }: { slug: Element["slug"]; color: string }) {
  const shared = { fill: "none", stroke: color, strokeLinecap: "round" as const, strokeLinejoin: "round" as const };

  return (
    <svg viewBox="0 0 520 250" className="h-auto w-full" role="img" aria-label={TRANSFORMATIONS[slug].cue}>
      <defs>
        <filter id={`glow-${slug}`} x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="5" result="blur" />
          <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
        </filter>
      </defs>

      {slug === "earth" && (
        <>
          {[70, 112, 154, 196].map((x, i) => <circle key={x} cx={x} cy={70 + (i % 2) * 36} r="10" {...shared} strokeWidth="1.4" opacity="0.58" />)}
          <path d="M70 82 C110 138 160 144 214 174 M112 128 C145 151 175 165 214 174 M154 82 C170 125 190 151 214 174 M196 128 C203 145 208 159 214 174" {...shared} strokeWidth="1.4" strokeDasharray="4 7" />
          <path d="M214 174 H410" {...shared} strokeWidth="2" />
          <path d="M315 174 V112 M275 112 H355 M287 112 V78 H343 V112" {...shared} strokeWidth="2" />
          <circle cx="214" cy="174" r="8" fill={color} filter={`url(#glow-${slug})`} />
        </>
      )}

      {slug === "water" && (
        <>
          <path d="M48 82 C112 28 168 140 230 82 S348 28 472 82" {...shared} strokeWidth="1.3" opacity="0.38" />
          <path d="M48 126 C112 72 168 184 230 126 S348 72 472 126" {...shared} strokeWidth="1.3" opacity="0.58" />
          <path d="M48 170 C112 116 168 228 230 170 S348 116 472 170" {...shared} strokeWidth="2.4" />
          {[76, 170, 264, 358, 452].map((x, i) => <circle key={x} cx={x} cy={170 + (i % 2 ? -26 : 0)} r={i === 4 ? 9 : 5} fill={i === 4 ? color : "transparent"} stroke={color} strokeWidth="1.5" />)}
        </>
      )}

      {slug === "fire" && (
        <>
          {[75, 130, 185, 240].map((x, i) => <path key={x} d={`M${x} 174 C${x - 18} 140 ${x + 12} 126 ${x} ${92 + i * 8} C${x + 30} 124 ${x + 22} 155 ${x} 174Z`} {...shared} strokeWidth="1.2" opacity={0.3 + i * 0.12} />)}
          <path d="M360 184 C318 140 350 114 366 68 C418 112 438 151 392 184Z" {...shared} strokeWidth="2.5" />
          <path d="M378 169 C358 146 377 128 382 109 C405 135 407 154 390 169Z" fill={color} opacity="0.82" filter={`url(#glow-${slug})`} />
          <path d="M270 126 H326" {...shared} strokeWidth="1.5" strokeDasharray="5 7" />
        </>
      )}

      {slug === "air" && (
        <>
          <rect x="48" y="72" width="126" height="94" rx="18" {...shared} strokeWidth="1.4" />
          <path d="M77 104 H145 M77 124 H132 M77 144 H119" {...shared} strokeWidth="1.4" opacity="0.65" />
          <path d="M174 119 C230 74 270 166 326 119" {...shared} strokeWidth="1.5" strokeDasharray="5 8" />
          <path d="M326 92 H464 M326 119 H430 M326 146 H450" {...shared} strokeWidth="2" />
          <circle cx="326" cy="119" r="7" fill={color} filter={`url(#glow-${slug})`} />
        </>
      )}

      {slug === "space" && (
        <>
          {[34, 62, 92].map((r, i) => <circle key={r} cx="350" cy="125" r={r} {...shared} strokeWidth={i === 2 ? 2 : 1.3} opacity={0.35 + i * 0.2} />)}
          {[80, 132, 184, 236].map((x, i) => <circle key={x} cx={x} cy="125" r={5 + i * 2} fill={color} opacity={0.35 + i * 0.16} />)}
          <path d="M80 125 H258" {...shared} strokeWidth="1.5" strokeDasharray="5 8" />
          <path d="M258 125 H350" {...shared} strokeWidth="2.2" />
          <circle cx="350" cy="125" r="11" fill={color} filter={`url(#glow-${slug})`} />
        </>
      )}
    </svg>
  );
}

export function PinnedSlider({ elements }: { elements: Element[] }) {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const slideRefs = useRef<(HTMLDivElement | null)[]>([]);
  const [activeIndex, setActiveIndex] = useState(0);
  const activeIndexRef = useRef(0);
  const lenis = useLenis();

  useEffect(() => {
    const wrapper = wrapperRef.current;
    if (!wrapper) return;

    function update() {
      if (!wrapper) return;
      const rect = wrapper.getBoundingClientRect();
      const scrollDistance = (elements.length - 1) * window.innerHeight * STAGE_SPEED;
      const raw = scrollDistance > 0 ? -rect.top / scrollDistance : 0;
      const clamped = Math.min(1, Math.max(0, raw));
      const progress = clamped * (elements.length - 1);
      const idx = Math.min(elements.length - 1, Math.round(progress));
      if (idx !== activeIndexRef.current) {
        activeIndexRef.current = idx;
        setActiveIndex(idx);
      }
      slideRefs.current.forEach((slide, i) => {
        if (!slide) return;
        const d = Math.abs(progress - i);
        const opacity = d <= HOLD ? 1 : d <= 1 - HOLD ? 1 - (d - HOLD) / (1 - 2 * HOLD) : 0;
        slide.style.opacity = String(opacity);
      });
    }

    update();
    const unsubscribe = lenis?.on("scroll", update);
    window.addEventListener("resize", update);
    return () => {
      unsubscribe?.();
      window.removeEventListener("resize", update);
    };
  }, [elements.length, lenis]);

  return (
    <div ref={wrapperRef} className="relative" style={{ height: `${(elements.length - 1) * 100 * STAGE_SPEED + 100}vh` }}>
      <div className="sticky top-0 h-screen w-full overflow-hidden">
        {elements.map((el, i) => {
          const transformation = TRANSFORMATIONS[el.slug];
          return (
            <div
              key={el.slug}
              ref={(node) => { slideRefs.current[i] = node; }}
              className="absolute inset-0"
              style={{ opacity: i === 0 ? 1 : 0, pointerEvents: i === activeIndex ? "auto" : "none" }}
              aria-hidden={i !== activeIndex}
            >
              <ElementRowBackground image={el.image} video={el.video} color={el.color} imagePosition={el.imagePosition} active={i === activeIndex} />
              {i === activeIndex && <ElementSignature slug={el.slug} color={el.color} />}

              <div className="relative flex h-full items-center px-6 py-20 sm:px-12 lg:px-16">
                <div className="mx-auto grid w-full max-w-[92rem] items-center gap-8 lg:grid-cols-[0.78fr_1.22fr] lg:gap-16">
                  <div className="max-w-xl">
                    <div className="flex items-center gap-4">
                      <span className="font-display text-[clamp(3.4rem,8vw,6.2rem)] font-normal leading-none" style={{ color: el.color, textShadow: "0 2px 16px rgba(0,0,0,0.55)" }}>
                        {String(i + 1).padStart(2, "0")}
                      </span>
                      <ElementGlyph slug={el.slug} className="h-10 w-10 opacity-90" style={{ color: el.color }} />
                    </div>
                    <p className="mt-4 text-[0.68rem] font-medium uppercase tracking-[0.24em] text-ivory/55">{transformation.verb}</p>
                    <h3 className="mt-2 font-display text-4xl font-normal text-ivory sm:text-5xl">{el.name}</h3>
                    <p className="mt-5 max-w-lg font-display text-xl italic leading-snug text-ivory/88 sm:text-2xl">{el.poetic}</p>
                    <p className="mt-5 max-w-lg text-sm leading-relaxed text-ivory/68 sm:text-base">{el.meaning}</p>
                  </div>

                  <div className="rounded-[1.75rem] border border-ivory/14 bg-[#171411]/68 p-5 shadow-[0_34px_100px_-55px_rgba(0,0,0,0.95)] backdrop-blur-md sm:p-8">
                    <div className="flex items-center justify-between gap-4 border-b border-ivory/10 pb-4">
                      <p className="text-[0.65rem] uppercase tracking-[0.22em] text-ivory/45">The transformation</p>
                      <p className="font-display text-xl" style={{ color: el.color }}>{transformation.verb}</p>
                    </div>

                    <div className="mt-3">
                      <TransformationDiagram slug={el.slug} color={el.color} />
                    </div>

                    <div className="grid gap-4 border-t border-ivory/10 pt-5 sm:grid-cols-2">
                      <div>
                        <p className="text-[0.62rem] uppercase tracking-[0.2em] text-ivory/38">Before</p>
                        <p className="mt-2 text-sm leading-relaxed text-ivory/66">{transformation.from}</p>
                      </div>
                      <div>
                        <p className="text-[0.62rem] uppercase tracking-[0.2em]" style={{ color: el.color }}>After</p>
                        <p className="mt-2 text-sm leading-relaxed text-ivory/86">{transformation.to}</p>
                      </div>
                    </div>

                    <div className="mt-5 rounded-2xl border border-ivory/10 bg-black/15 px-4 py-3">
                      <p className="text-xs leading-relaxed text-ivory/58"><span className="font-medium text-ivory/82">Skipped:</span> {transformation.consequence}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          );
        })}

        <div className="pointer-events-none absolute bottom-7 left-6 z-10 flex gap-4 sm:bottom-10 sm:left-16 sm:gap-6">
          {elements.map((el, i) => (
            <div key={el.slug} className="flex items-center gap-2">
              <span className="font-body text-[0.62rem] uppercase tracking-[0.16em] transition-colors duration-500 sm:text-[0.7rem] sm:tracking-[0.2em]" style={{ color: i === activeIndex ? "#F4EFE6" : "rgba(244,239,230,0.35)" }}>
                {String(i + 1).padStart(2, "0")} {el.name.split(" ")[0]}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
