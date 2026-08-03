"use client";

import { useRef } from "react";
import {
  motion,
  useReducedMotion,
  useScroll,
  useTransform,
  type MotionValue,
} from "framer-motion";
import { ElementRowBackground } from "@/components/ElementRowBackground";
import { ElementSignature } from "@/sections/Elements/ElementSignature";
import { ElementGlyph } from "@/components/ElementGlyph";
import type { Element } from "@/data/elements";

const TRANSFORMATIONS: Record<
  Element["slug"],
  { verb: string; from: string; to: string; consequence: string; cue: string }
> = {
  earth: {
    verb: "Anchor",
    from: "Assumptions scattered beneath the business",
    to: "One position every later decision can stand on",
    consequence: "Every campaign starts by renegotiating who the brand is.",
    cue: "Fragments compact into a load-bearing centre.",
  },
  water: {
    verb: "Carry",
    from: "Touchpoints behaving like unrelated encounters",
    to: "One expectation flowing through the whole journey",
    consequence: "Every platform teaches the customer a different version of you.",
    cue: "Meaning survives while its surface keeps changing.",
  },
  fire: {
    verb: "Distinguish",
    from: "Category-safe expression that earns no second look",
    to: "A recognisable signal strong enough to interrupt habit",
    consequence: "Clarity stays invisible and attention goes to the louder alternative.",
    cue: "Weak signals burn away. One remains.",
  },
  air: {
    verb: "Translate",
    from: "Strategy understood only inside the business",
    to: "Language customers can repeat after the brand leaves",
    consequence: "Five channels develop five personalities and memory never settles.",
    cue: "A thought becomes language another person can carry.",
  },
  space: {
    verb: "Compound",
    from: "Isolated moments of attention",
    to: "Recognition that accumulates across time",
    consequence: "Every launch pays again for awareness the last one failed to store.",
    cue: "Repeated signals become a field of memory.",
  },
};

function WordAssembly({ text, progress, color }: { text: string; progress: MotionValue<number>; color: string }) {
  const words = text.split(" ");
  return (
    <span className="flex flex-wrap gap-x-[0.22em] gap-y-1">
      {words.map((word, index) => {
        const start = 0.12 + index * 0.055;
        const opacity = useTransform(progress, [start, start + 0.14], [0, 1]);
        const y = useTransform(progress, [start, start + 0.14], [34, 0]);
        const blur = useTransform(progress, [start, start + 0.14], [10, 0]);
        const filter = useTransform(blur, (value) => `blur(${value}px)`);
        return (
          <motion.span key={`${word}-${index}`} style={{ opacity, y, filter, color: index === words.length - 1 ? color : undefined }}>
            {word}
          </motion.span>
        );
      })}
    </span>
  );
}

function EarthField({ progress, color }: { progress: MotionValue<number>; color: string }) {
  const groundY = useTransform(progress, [0, 0.72], [180, 0]);
  const compression = useTransform(progress, [0.18, 0.72], [1.35, 1]);
  return (
    <motion.div className="absolute inset-x-[8%] bottom-[15%] h-[34%]" style={{ y: groundY, scaleX: compression }} aria-hidden="true">
      {[0, 1, 2, 3].map((i) => (
        <motion.div
          key={i}
          className="absolute inset-x-0 rounded-[50%] border"
          style={{ bottom: `${i * 20}%`, height: "44%", borderColor: `${color}${35 + i * 12}` }}
        />
      ))}
      <motion.div className="absolute left-1/2 top-0 h-full w-px -translate-x-1/2" style={{ backgroundColor: color }} />
    </motion.div>
  );
}

function WaterField({ progress, color }: { progress: MotionValue<number>; color: string }) {
  const xA = useTransform(progress, [0, 1], ["-18%", "12%"]);
  const xB = useTransform(progress, [0, 1], ["16%", "-12%"]);
  return (
    <div className="absolute inset-0 overflow-hidden" aria-hidden="true">
      {[xA, xB, xA].map((x, i) => (
        <motion.div
          key={i}
          className="absolute left-[-18%] w-[136%] rounded-[50%] border"
          style={{ x, top: `${25 + i * 18}%`, height: "26%", borderColor: `${color}${48 - i * 8}` }}
        />
      ))}
    </div>
  );
}

function FireField({ progress, color }: { progress: MotionValue<number>; color: string }) {
  const spread = useTransform(progress, [0, 0.55, 1], [1.8, 1.15, 0.72]);
  const rotate = useTransform(progress, [0, 1], [-12, 18]);
  return (
    <motion.div className="absolute left-1/2 top-1/2 h-[62vmin] w-[62vmin] -translate-x-1/2 -translate-y-1/2" style={{ scale: spread, rotate }} aria-hidden="true">
      {[0, 1, 2, 3, 4].map((i) => (
        <motion.span
          key={i}
          className="absolute left-1/2 top-1/2 h-[58%] w-[18%] origin-bottom -translate-x-1/2 -translate-y-full rounded-[50%_50%_35%_35%] border"
          style={{ rotate: `${i * 72}deg`, borderColor: `${color}${28 + i * 9}` }}
        />
      ))}
    </motion.div>
  );
}

function AirField({ progress, color }: { progress: MotionValue<number>; color: string }) {
  const lift = useTransform(progress, [0, 1], [140, -100]);
  const drift = useTransform(progress, [0, 0.5, 1], [-80, 90, -30]);
  return (
    <motion.div className="absolute inset-0" style={{ y: lift, x: drift }} aria-hidden="true">
      {[12, 27, 43, 61, 78].map((top, i) => (
        <span key={top} className="absolute h-px rounded-full" style={{ top: `${top}%`, left: `${8 + i * 7}%`, width: `${54 + i * 5}%`, background: `linear-gradient(90deg, transparent, ${color}88, transparent)` }} />
      ))}
    </motion.div>
  );
}

function SpaceField({ progress, color }: { progress: MotionValue<number>; color: string }) {
  const scale = useTransform(progress, [0, 1], [1.7, 0.72]);
  const rotate = useTransform(progress, [0, 1], [0, 86]);
  return (
    <motion.div className="absolute left-1/2 top-1/2 h-[72vmin] w-[72vmin] -translate-x-1/2 -translate-y-1/2" style={{ scale, rotate }} aria-hidden="true">
      {[16, 28, 41, 56, 72].map((size, i) => (
        <span key={size} className="absolute left-1/2 top-1/2 rounded-full border" style={{ width: `${size}%`, height: `${size}%`, transform: "translate(-50%, -50%)", borderColor: `${color}${25 + i * 10}` }} />
      ))}
      <span className="absolute left-1/2 top-1/2 h-3 w-3 -translate-x-1/2 -translate-y-1/2 rounded-full" style={{ backgroundColor: color, boxShadow: `0 0 45px ${color}` }} />
    </motion.div>
  );
}

function ElementWorld({ element, index }: { element: Element; index: number }) {
  const ref = useRef<HTMLElement>(null);
  const reduced = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end end"] });
  const transformation = TRANSFORMATIONS[element.slug];

  const sceneScale = useTransform(scrollYProgress, [0, 0.55, 1], [1.08, 1, 1.12]);
  const sceneBrightness = useTransform(scrollYProgress, [0, 0.52, 1], [0.52, 0.82, 0.42]);
  const sceneFilter = useTransform(sceneBrightness, (value) => `brightness(${value}) saturate(1.08)`);
  const introOpacity = useTransform(scrollYProgress, [0, 0.13, 0.34], [0, 1, 0]);
  const bodyOpacity = useTransform(scrollYProgress, [0.24, 0.42, 0.84, 1], [0, 1, 1, 0]);
  const bodyY = useTransform(scrollYProgress, [0.24, 0.48], [70, 0]);
  const beforeX = useTransform(scrollYProgress, [0.38, 0.68], [-80, 0]);
  const afterX = useTransform(scrollYProgress, [0.48, 0.78], [80, 0]);
  const consequenceOpacity = useTransform(scrollYProgress, [0.7, 0.88], [0, 1]);

  const field = {
    earth: <EarthField progress={scrollYProgress} color={element.color} />,
    water: <WaterField progress={scrollYProgress} color={element.color} />,
    fire: <FireField progress={scrollYProgress} color={element.color} />,
    air: <AirField progress={scrollYProgress} color={element.color} />,
    space: <SpaceField progress={scrollYProgress} color={element.color} />,
  }[element.slug];

  return (
    <section ref={ref} className="relative h-[185svh] bg-soil">
      <div className="sticky top-0 h-svh overflow-hidden">
        <motion.div className="absolute inset-0" style={reduced ? undefined : { scale: sceneScale, filter: sceneFilter }}>
          <ElementRowBackground image={element.image} video={element.video} color={element.color} imagePosition={element.imagePosition} active />
        </motion.div>
        {!reduced && <ElementSignature slug={element.slug} color={element.color} />}
        <div className="absolute inset-0 bg-gradient-to-b from-black/35 via-black/10 to-black/65" />
        {field}

        <motion.div className="absolute inset-0 z-[3] flex items-center justify-center px-6 text-center" style={reduced ? undefined : { opacity: introOpacity }}>
          <div>
            <p className="text-[0.62rem] uppercase tracking-[0.34em] text-ivory/48">Tatva {String(index + 1).padStart(2, "0")}</p>
            <p className="mt-5 font-display text-[clamp(5rem,17vw,13rem)] font-normal leading-[0.75] tracking-[-0.07em]" style={{ color: element.color }}>
              {element.name.split(" ")[0].toLowerCase()}.
            </p>
          </div>
        </motion.div>

        <motion.div className="relative z-[4] mx-auto flex h-full max-w-[92rem] items-center px-6 sm:px-12 lg:px-16" style={reduced ? undefined : { opacity: bodyOpacity, y: bodyY }}>
          <div className="grid w-full items-center gap-10 lg:grid-cols-[0.86fr_1.14fr] lg:gap-20">
            <div>
              <div className="flex items-center gap-4">
                <ElementGlyph slug={element.slug} className="h-10 w-10" style={{ color: element.color }} />
                <p className="text-[0.66rem] font-medium uppercase tracking-[0.28em]" style={{ color: element.color }}>{transformation.verb}</p>
              </div>
              <h3 className="mt-6 font-display text-[clamp(2.9rem,6vw,6.4rem)] font-normal leading-[0.92] tracking-[-0.04em] text-ivory">
                <WordAssembly text={transformation.cue} progress={scrollYProgress} color={element.color} />
              </h3>
              <p className="mt-7 max-w-lg text-sm leading-relaxed text-ivory/64 sm:text-base">{element.meaning}</p>
            </div>

            <div className="relative min-h-[26rem]">
              <motion.div className="absolute left-0 top-[15%] max-w-sm" style={reduced ? undefined : { x: beforeX }}>
                <p className="text-[0.62rem] uppercase tracking-[0.22em] text-ivory/38">Before</p>
                <p className="mt-3 font-display text-3xl leading-tight text-ivory/62 sm:text-4xl">{transformation.from}</p>
              </motion.div>
              <motion.div className="absolute bottom-[16%] right-0 max-w-sm text-right" style={reduced ? undefined : { x: afterX }}>
                <p className="text-[0.62rem] uppercase tracking-[0.22em]" style={{ color: element.color }}>After</p>
                <p className="mt-3 font-display text-3xl leading-tight text-ivory sm:text-4xl">{transformation.to}</p>
              </motion.div>
              <motion.div className="absolute bottom-0 left-0 max-w-xl" style={reduced ? undefined : { opacity: consequenceOpacity }}>
                <p className="text-xs leading-relaxed text-ivory/54"><span className="font-medium text-ivory/82">Without {element.name.split(" ")[0]}:</span> {transformation.consequence}</p>
              </motion.div>
            </div>
          </div>
        </motion.div>

        <div className="absolute bottom-7 left-6 right-6 z-[5] flex items-center gap-5 sm:left-12 sm:right-12 lg:left-16 lg:right-16">
          <span className="text-[0.58rem] uppercase tracking-[0.24em] text-ivory/38">{String(index + 1).padStart(2, "0")}</span>
          <div className="h-px flex-1 bg-ivory/12"><motion.div className="h-full origin-left" style={{ scaleX: scrollYProgress, backgroundColor: element.color }} /></div>
          <span className="text-[0.58rem] uppercase tracking-[0.24em] text-ivory/38">{String(index + 1).padStart(2, "0")} / 05</span>
        </div>
      </div>
    </section>
  );
}

export function PinnedSlider({ elements }: { elements: Element[] }) {
  return (
    <div className="bg-soil">
      {elements.map((element, index) => (
        <ElementWorld key={element.slug} element={element} index={index} />
      ))}
    </div>
  );
}
